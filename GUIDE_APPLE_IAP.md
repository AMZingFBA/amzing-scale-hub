# 📱 Guide de configuration Apple In-App Purchase

## ✅ Ce qui est déjà fait
- ✅ Plugin RevenueCat installé (`@revenuecat/purchases-capacitor`)
- ✅ Code d'intégration IAP implémenté dans l'app
- ✅ Détection automatique mobile vs web (Stripe sur web, Apple IAP sur mobile)
- ✅ Edge function de validation créée

---

## 🎯 Étapes à suivre

### 1️⃣ Créer votre app dans App Store Connect

1. Allez sur [App Store Connect](https://appstoreconnect.apple.com/)
2. Connectez-vous avec votre compte Apple Developer
3. Cliquez sur **"Mes apps"** → **"+"** → **"Nouvelle app"**
4. Remplissez les informations :
   - **Plateformes**: iOS
   - **Nom**: AMZing (ou votre nom d'app)
   - **Langue principale**: Français
   - **Bundle ID**: `app.lovable.6c002a1cdb754b68b43b8e5c9b112692` (déjà configuré dans Capacitor)
   - **SKU**: `amzing-app-001` (peut être n'importe quoi d'unique)
   - **Accès complet ou limité**: Accès complet

### 2️⃣ Configurer l'abonnement dans App Store Connect

1. Dans votre app, allez dans **"Fonctionnalités"** → **"Abonnements"**
2. Cliquez sur **"Créer"** pour créer un nouveau groupe d'abonnements
3. **Nom du groupe**: "AMZing VIP"
4. Cliquez sur **"Créer un abonnement"**

#### Configuration de l'abonnement:

- **Identifiant du produit**: `com.amzing.vip.monthly`
  ⚠️ IMPORTANT: Utilisez exactement cet ID (il est déjà dans le code)
  
- **Nom de référence**: "AMZing VIP Mensuel"

- **Durée d'abonnement**: 1 mois

- **Prix**: Choisissez votre prix (ex: 9,99 €)

#### Essai gratuit de 7 jours:

1. Dans la section **"Offre d'introduction"**
2. Cliquez sur **"Créer une offre d'introduction"**
3. **Type**: Essai gratuit
4. **Durée**: 7 jours
5. **Éligibilité**: Nouveaux abonnés uniquement

#### Informations d'évaluation:

Dans la section "Informations d'app" de l'abonnement:
- **Nom d'affichage**: "AMZing VIP"
- **Description**: Décrivez votre abonnement VIP (accès illimité, etc.)
- **Capture d'écran** (optionnel mais recommandé)

### 3️⃣ Créer un compte RevenueCat

1. Allez sur [RevenueCat.com](https://www.revenuecat.com/)
2. Créez un compte gratuit (jusqu'à 10k$/mois de revenu)
3. Créez un nouveau projet: **"AMZing"**
4. Choisissez **iOS** comme plateforme

### 4️⃣ Connecter App Store Connect à RevenueCat

1. Dans RevenueCat, allez dans **"Project Settings"** → **"Apple App Store"**
2. Suivez les instructions pour générer:
   - **App Store Connect API Key** (.p8 file)
   - **Issuer ID**
   - **Key ID**
3. Uploadez ces informations dans RevenueCat

### 5️⃣ Configurer le produit dans RevenueCat

1. Dans RevenueCat, allez dans **"Products"**
2. Cliquez sur **"+ New"**
3. **Product identifier**: `com.amzing.vip.monthly` (EXACTEMENT le même que App Store Connect)
4. **Type**: Subscription
5. Sauvegardez

### 6️⃣ Créer un Entitlement

1. Dans RevenueCat, allez dans **"Entitlements"**
2. Cliquez sur **"+ New"**
3. **Identifier**: `vip` (EXACTEMENT ce nom, il est dans le code)
4. Attachez le produit `com.amzing.vip.monthly`
5. Sauvegardez

### 7️⃣ Créer un Offering

1. Dans RevenueCat, allez dans **"Offerings"**
2. Le "default" offering devrait déjà exister
3. Cliquez dessus et ajoutez un **Package**:
   - **Identifier**: `monthly`
   - **Product**: `com.amzing.vip.monthly`
   - Sauvegardez

### 8️⃣ Récupérer les clés API RevenueCat

1. Dans RevenueCat, allez dans **"API Keys"**
2. Copiez la clé **iOS** (commence par `appl_...`)
3. ⚠️ GARDEZ CETTE CLÉ SECRÈTE

### 9️⃣ Configurer les clés dans votre projet Lovable

1. Dans le fichier `src/hooks/use-trial.tsx`, ligne 86:
   ```typescript
   apiKey: 'VOTRE_REVENUECAT_API_KEY_IOS', // Remplacer ici
   ```
   Remplacez par votre vraie clé RevenueCat iOS

2. Pour l'edge function `validate-apple-receipt`, vous devez configurer le secret:
   - Dans **Lovable Cloud Backend** → **Secrets**
   - Ajoutez: `APPLE_SHARED_SECRET`
   - Valeur: Trouvée dans App Store Connect → Votre App → Fonctionnalités → Abonnements → "Clé secrète partagée" (en bas de page)

### 🔟 Tester l'abonnement

#### En mode Sandbox (tests):

1. Sur votre iPhone, allez dans **Réglages** → **App Store** → **Sandbox Account**
2. Créez un compte de test dans App Store Connect:
   - App Store Connect → **Utilisateurs et accès** → **Sandbox Testers**
   - Cliquez sur **"+"** pour créer un testeur
3. Utilisez ce compte sandbox sur votre iPhone
4. Lancez votre app via Xcode
5. Testez l'achat (il sera gratuit en mode sandbox)

---

## 🚀 Déploiement

### Pour tester sur un vrai appareil:

```bash
# 1. Transférez le projet vers Github
# Utilisez le bouton "Export to Github" dans Lovable

# 2. Clonez sur votre Mac
git clone [votre-repo]
cd [votre-projet]

# 3. Installez les dépendances
npm install

# 4. Ajoutez iOS
npx cap add ios

# 5. Buildez le projet
npm run build

# 6. Synchronisez avec Capacitor
npx cap sync ios

# 7. Ouvrez dans Xcode
npx cap open ios

# 8. Dans Xcode:
# - Sélectionnez votre équipe de développement
# - Connectez votre iPhone
# - Cliquez sur Run (▶️)
```

---

## 📝 Notes importantes

### Prix de l'abonnement:
- Définissez le prix dans App Store Connect
- Apple prend 30% de commission (15% après 1 an)
- Ex: Si vous mettez 9,99 €, vous recevrez ~7 €

### Période d'essai:
- 7 jours gratuits (comme demandé)
- L'utilisateur doit autoriser le paiement dès le début
- Il sera facturé automatiquement après 7 jours
- Il peut annuler avant la fin de la période d'essai

### RevenueCat gratuit:
- Gratuit jusqu'à 10 000 $ de revenu mensuel
- Après, 1% de commission

### Délais Apple:
- La validation de votre app peut prendre 24-48h
- Les produits IAP peuvent prendre quelques heures à apparaître
- En mode sandbox, c'est instantané

---

## 🆘 En cas de problème

### L'achat ne fonctionne pas:
1. Vérifiez que l'ID produit est identique partout
2. Attendez 24h après création du produit
3. Vérifiez que vous êtes en mode sandbox avec un compte testeur

### Erreur "Product not found":
- Les produits IAP prennent du temps à se synchroniser (jusqu'à 24h)
- Vérifiez l'ID exact dans App Store Connect

### L'essai gratuit n'apparaît pas:
- Assurez-vous d'avoir créé l'offre d'introduction dans App Store Connect
- Vérifiez l'éligibilité (nouveaux abonnés uniquement)

---

## ✅ Checklist finale

- [ ] App créée dans App Store Connect
- [ ] Bundle ID configuré: `app.lovable.6c002a1cdb754b68b43b8e5c9b112692`
- [ ] Produit IAP créé: `com.amzing.vip.monthly`
- [ ] Essai gratuit 7 jours configuré
- [ ] Prix défini
- [ ] Compte RevenueCat créé
- [ ] App Store Connect connecté à RevenueCat
- [ ] Produit configuré dans RevenueCat
- [ ] Entitlement "vip" créé dans RevenueCat
- [ ] Offering configuré dans RevenueCat
- [ ] Clé API RevenueCat ajoutée dans le code
- [ ] Apple Shared Secret configuré dans Lovable Cloud
- [ ] Test en mode sandbox réussi

---

## 📞 Support

Si vous avez des questions, consultez:
- [Documentation RevenueCat](https://docs.revenuecat.com/)
- [Documentation Apple IAP](https://developer.apple.com/in-app-purchase/)
- [Guide Capacitor + RevenueCat](https://docs.revenuecat.com/docs/capacitor)
