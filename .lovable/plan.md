# Intégration automatique Credaris (recouvrement)

Objectif : dès qu'un paiement échoue sur Amzing FBA, un webhook signé est envoyé automatiquement à Credaris avec toutes les preuves juridiques (CGV horodatées + IP, factures, contexte abonnement). Zéro saisie manuelle.

## 1. Secrets & configuration

Ajouter deux secrets runtime via le tool secrets :
- `AMZING_WEBHOOK_SECRET` = `IMnZWDvKdnW2WXQhuyVFKShOHDlM0AVHBAP51f7HgsVQ6AEcAuyYa2xqXvn0RtKr`
- `CREDARIS_WEBHOOK_URL` = `https://project--b49eaac5-99cf-4800-bc49-cb6c0bac61e8.lovable.app/api/public/amzing/webhook` (modifiable plus tard pour la prod)

## 2. Migration base de données

Nouvelles colonnes / tables :

**profiles** (ajouts) :
- `cgv_version` text
- `cgv_accepted_at` timestamptz
- `cgv_ip` text
- `cgv_user_agent` text
- `billing_address_street`, `billing_address_zip`, `billing_address_city`, `billing_address_country` text
- `phone_e164` text
- `legal_form` text (SAS, SARL, EI, etc.)
- `client_ref` text unique (format `AMZ-CL-XXXXXX`, auto-généré)

**cgv_versions** (nouvelle table) :
- `version` text PK, `pdf_url` text, `published_at` timestamptz, `is_current` boolean

**payment_attempts** (nouvelle table) :
- `id`, `user_id`, `stripe_event_id`, `transaction_id`, `amount_eur`, `currency`, `method`, `status` (failed/succeeded), `error_code`, `error_message`, `raw_psp_response` jsonb, `installment_number` int, `attempted_at`

**consecutive_failures** (compteur dénormalisé sur subscriptions) :
- `subscriptions.consecutive_failed_count` int default 0
- `subscriptions.last_failure_at` timestamptz

**credaris_sync_log** (nouvelle table) :
- `id`, `event` text, `external_id` text unique, `payload` jsonb, `status` (pending/success/failed), `http_status` int, `response_body` text, `retry_count` int, `last_attempt_at`, `next_retry_at`, `created_at`

Toutes avec `GRANT` appropriés + RLS (admin-only sauf `cgv_versions` lisible par tous).

## 3. Storage bucket privé

Créer bucket privé `invoices` pour stocker les PDF de factures avec URL signée 7 jours minimum.

## 4. Edge functions

**`notify-credaris`** (cœur du système) :
- Reçoit `{ event, externalId, payload }`
- Signe le body brut en HMAC-SHA256 hex avec `AMZING_WEBHOOK_SECRET`
- POST vers `CREDARIS_WEBHOOK_URL` avec header `X-Amzing-Signature`
- Log dans `credaris_sync_log`
- Retry exponentiel (0s, 30s, 5min) si HTTP ≠ 2xx
- Idempotence via `external_id`

**`stripe-webhook`** (modification de l'existant) :
- Sur `invoice.payment_failed` : incrémente compteur, log `payment_attempt`, construit payload complet (client + abonnement + payment + documents), appelle `notify-credaris` avec event `payment.failed`
- Sur `invoice.payment_succeeded` : reset compteur, appelle event `payment.succeeded`
- Sur `customer.subscription.updated|deleted` : appelle event correspondant
- Toujours capture la réponse PSP brute

**`credaris-manual-dossier`** :
- Appelée par le bouton admin
- Construit le payload complet pour un user_id donné
- Envoie event `dossier.create_manual`

**`capture-cgv-acceptance`** :
- Appelée à l'inscription / souscription
- Lit IP depuis `x-forwarded-for` / `cf-connecting-ip`
- Stocke `cgv_version`, `cgv_accepted_at`, `cgv_ip`, `cgv_user_agent` sur le profil

**`credaris-retry-failed`** (cron / appel manuel) :
- Relance les entrées `credaris_sync_log` en status `failed` éligibles au retry

## 5. Frontend

**Formulaire d'inscription / souscription** :
- Champs adresse de facturation séparés (rue / CP / ville / pays)
- Téléphone forcé E.164 (avec react-phone-number-input ou validation regex)
- Champ SIRET + forme juridique conditionnels (si client pro)
- Case à cocher obligatoire « J'accepte les CGV » avec lien vers PDF de la version courante
- À la soumission : appel `capture-cgv-acceptance` avant le redirect Stripe

**Page admin** `/admin/credaris-sync` :
- Liste paginée de `credaris_sync_log`
- Filtres status (success/failed/pending), event, date
- Colonnes : date, event, client, external_id, status, retry_count, HTTP status
- Bouton « Renvoyer » par ligne (appelle `notify-credaris` avec même external_id)
- Bouton « Voir payload » (modale JSON)

**Fiche client admin** (probablement `AdminAirtableUsers` ou équivalent) :
- Bouton « Créer un dossier Credaris » → appelle `credaris-manual-dossier`
- Toast succès avec `dossier_id` retourné

## 6. Test final

Bouton de test dans `/admin/credaris-sync` qui envoie un `dossier.create_manual` avec `external_id: test_<timestamp>` et affiche la réponse Credaris.

## Détails techniques

- HMAC : `createHmac("sha256", secret).update(rawBody, "utf8").digest("hex")` — body sérialisé UNE SEULE FOIS pour éviter les drifts de signature
- IP : prioriser `cf-connecting-ip` > première valeur de `x-forwarded-for` > `req.headers.get('x-real-ip')`
- `external_id` : format `evt_amzing_<uuid>` généré côté Amzing, persisté avant l'envoi
- Retries : stockés en `pending` avec `next_retry_at`, repris par cron (ou appel manuel admin)
- Tous les logs masquent le secret HMAC

## Confirmation requise

Avant d'implémenter, deux questions :
1. Le bouton « Créer un dossier Credaris » va sur quelle page admin exactement (fiche profil dans `AdminAirtableUsers`, ou nouvelle page dédiée) ?
2. Le PDF des CGV courantes existe-t-il déjà quelque part (URL publique) ou faut-il créer la table `cgv_versions` vide et tu uploadras le PDF manuellement après ?
