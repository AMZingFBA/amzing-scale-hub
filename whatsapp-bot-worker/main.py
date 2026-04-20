#!/usr/bin/env python3
"""
WhatsApp Bot Worker: polls Supabase for pending bot jobs,
processes them via Selenium/Chrome, updates progress in real-time.
Runs 24/7 on server (same pattern as analysis-worker).
"""

import json
import os
import random
import time
import traceback

from dotenv import load_dotenv
from supabase import create_client

from config import WHATSAPP_ACCOUNTS, DELAI_MIN, DELAI_MAX, POLL_INTERVAL
from bot import create_driver, send_whatsapp_message

load_dotenv()

SUPABASE_URL = os.environ["SUPABASE_URL"]
SUPABASE_KEY = os.environ["SUPABASE_KEY"]


def get_supabase():
    return create_client(SUPABASE_URL, SUPABASE_KEY)


def update_job(sb, job_id: str, **kwargs):
    """Met à jour un job dans Supabase."""
    sb.table("whatsapp_bot_jobs").update(kwargs).eq("id", job_id).execute()


def process_job(sb, job: dict):
    """Traite un job: ouvre Chrome, envoie les messages, met à jour le statut."""
    job_id = job["id"]
    contacts = job["contacts"]
    message_template = job["message_template"]
    account_phone = job["account_phone"]

    print(f"\n{'='*50}")
    print(f"JOB {job_id[:8]}... — {len(contacts)} contacts via {account_phone}")
    print(f"{'='*50}")

    # Vérifier que le compte existe
    account = WHATSAPP_ACCOUNTS.get(account_phone)
    if not account:
        print(f"  Compte {account_phone} inconnu !")
        update_job(sb, job_id, status="failed",
                   progress={"sent": 0, "failed": 0, "total": len(contacts), "current_contact": "Compte inconnu"})
        return

    # Ouvrir Chrome
    print(f"  Ouverture Chrome (profil: {account['profile_dir']})...")
    try:
        driver = create_driver(account["profile_dir"], headless=True)
    except Exception as e:
        print(f"  Erreur Chrome: {e}")
        update_job(sb, job_id, status="failed",
                   progress={"sent": 0, "failed": 0, "total": len(contacts), "current_contact": f"Erreur Chrome: {e}"})
        return

    # Ouvrir WhatsApp Web
    print("  Ouverture WhatsApp Web...")
    driver.get("https://web.whatsapp.com/")
    time.sleep(15)

    sent = 0
    failed = 0
    results = []

    try:
        for i, contact in enumerate(contacts):
            phone = contact["phone"]
            name = contact.get("name", "Inconnu")

            # Update progress
            update_job(sb, job_id,
                       progress={"sent": sent, "failed": failed, "total": len(contacts), "current_contact": f"{name} ({phone})"},
                       results=results)

            # Envoyer
            result = send_whatsapp_message(driver, phone, name, message_template)

            results.append({
                "phone": phone,
                "name": name,
                "status": result,
            })

            if result == "sent":
                sent += 1
            else:
                failed += 1

            # Délai entre envois
            if i < len(contacts) - 1:
                delai = random.randint(DELAI_MIN, DELAI_MAX)
                print(f"  Attente {delai}s...")
                time.sleep(delai)

    except Exception as e:
        print(f"  ERREUR pendant l'envoi: {e}")
        traceback.print_exc()
    finally:
        driver.quit()
        print("  Chrome fermé")

    # Finaliser
    update_job(sb, job_id,
               status="completed",
               progress={"sent": sent, "failed": failed, "total": len(contacts), "current_contact": ""},
               results=results)

    print(f"  Terminé: {sent} envoyé(s), {failed} échoué(s)")


def main():
    print("=" * 50)
    print("WhatsApp Bot Worker")
    print(f"Comptes: {list(WHATSAPP_ACCOUNTS.keys())}")
    print(f"Poll: toutes les {POLL_INTERVAL}s")
    print("=" * 50)

    sb = get_supabase()

    while True:
        try:
            # Claim next pending job via RPC
            response = sb.rpc("whatsapp_bot_claim_next").execute()
            jobs = response.data

            if jobs and len(jobs) > 0:
                job = jobs[0]
                process_job(sb, job)
            else:
                pass  # No pending jobs

        except KeyboardInterrupt:
            print("\nArrêt demandé.")
            break
        except Exception as e:
            print(f"Erreur polling: {e}")
            traceback.print_exc()

        time.sleep(POLL_INTERVAL)


if __name__ == "__main__":
    main()
