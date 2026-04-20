"""
Fonctions Selenium pour envoyer des messages WhatsApp Web.
Réutilise la logique de whatsapp_bot_airtable_v2.py.
"""

import os
import time

from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC


def create_driver(profile_dir: str, headless: bool = True):
    """Crée une instance Chrome avec le profil spécifié."""
    options = webdriver.ChromeOptions()
    if headless:
        options.add_argument("--headless=new")
    options.add_argument("--window-size=1920,1080")
    options.add_argument("--disable-gpu")
    options.add_argument("--no-sandbox")
    options.add_argument("--disable-dev-shm-usage")
    options.add_argument(f"--user-data-dir={os.path.abspath(profile_dir)}")
    options.add_argument("--profile-directory=Default")
    options.add_experimental_option(
        "prefs", {"profile.default_content_setting_values.notifications": 2}
    )
    options.add_experimental_option("excludeSwitches", ["enable-automation"])

    driver = webdriver.Chrome(options=options)
    return driver


def send_whatsapp_message(driver, phone: str, name: str, message_template: str) -> str:
    """
    Envoie un message WhatsApp à un contact.
    Retourne: "sent", "no_whatsapp", ou "error"
    """
    try:
        # Personnaliser le message
        if name == "Inconnu":
            message = message_template.replace("Bonjour {name},", "Bonjour,")
        else:
            message = message_template.replace("{name}", name)

        # Naviguer vers le chat
        chat_url = f"https://web.whatsapp.com/send?phone={phone}"
        print(f"  -> {name} ({phone})")
        driver.get(chat_url)
        time.sleep(5)

        # Vérifier si le numéro n'a pas WhatsApp
        try:
            error_popup = driver.find_elements(
                By.XPATH,
                "//*[contains(text(), \"n'est pas sur WhatsApp\") or contains(text(), 'not on WhatsApp')]",
            )
            if error_popup:
                print(f"     Pas WhatsApp")
                try:
                    ok_btn = driver.find_element(
                        By.XPATH,
                        "//div[@role='button'][contains(text(), 'OK')] | //button[contains(text(), 'OK')]",
                    )
                    ok_btn.click()
                    time.sleep(1)
                except Exception:
                    pass
                return "no_whatsapp"
        except Exception:
            pass

        # Gérer popup "Utiliser ici"
        try:
            use_here = driver.find_elements(
                By.XPATH, "//div[contains(text(), 'Utiliser ici')]"
            )
            if use_here and use_here[0].is_displayed():
                use_here[0].click()
                time.sleep(3)
        except Exception:
            pass

        time.sleep(2)

        # Vérifier à nouveau
        try:
            errors = driver.find_elements(
                By.XPATH,
                "//*[contains(text(), \"n'est pas sur WhatsApp\") or contains(text(), 'not on WhatsApp')]",
            )
            if errors:
                try:
                    ok_btn = driver.find_element(
                        By.XPATH,
                        "//div[@role='button'][contains(text(), 'OK')] | //button[contains(text(), 'OK')]",
                    )
                    ok_btn.click()
                    time.sleep(1)
                except Exception:
                    pass
                return "no_whatsapp"
        except Exception:
            pass

        # Fermer tout dialogue
        try:
            close_buttons = driver.find_elements(
                By.XPATH,
                "//div[@aria-label='Fermer'] | //button[@aria-label='Fermer'] | //span[@data-icon='x-viewer']",
            )
            for btn in close_buttons:
                try:
                    if btn.is_displayed():
                        btn.click()
                        time.sleep(1)
                except Exception:
                    pass
        except Exception:
            pass

        # Trouver zone de texte
        message_box = None
        selectors = [
            '//div[@contenteditable="true"][@data-tab="10"]',
            '//div[@contenteditable="true"][@role="textbox"]',
            '//footer//div[@contenteditable="true"]',
        ]

        time.sleep(2)

        for sel in selectors:
            try:
                message_box = WebDriverWait(driver, 8).until(
                    EC.element_to_be_clickable((By.XPATH, sel))
                )
                break
            except Exception:
                continue

        if not message_box:
            print(f"     Pas de zone texte")
            return "no_whatsapp"

        # Scroller et focus
        try:
            driver.execute_script(
                "arguments[0].scrollIntoView({block: 'center'});", message_box
            )
            time.sleep(1)
        except Exception:
            pass

        # Envoyer le message
        try:
            message_box.click()
        except Exception:
            driver.execute_script(
                "arguments[0].focus(); arguments[0].click();", message_box
            )

        time.sleep(1)

        lines = message.split("\n")
        for i, line in enumerate(lines):
            message_box.send_keys(line)
            if i < len(lines) - 1:
                message_box.send_keys(Keys.SHIFT + Keys.ENTER)

        time.sleep(1)
        message_box.send_keys(Keys.ENTER)
        print(f"     Envoyé !")
        time.sleep(3)

        return "sent"

    except Exception as e:
        print(f"     ERREUR: {e}")
        return "error"
