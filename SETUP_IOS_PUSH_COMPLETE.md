# ✅ Configuration Complète iOS Push Notifications

## 📋 CHECKLIST COMPLÈTE

### 1️⃣ Vérifier le Bundle ID dans Xcode

**CRITIQUE** : Le Bundle ID dans Xcode **DOIT** être : `app.lovable.6c002a1cdb754b68b43b8e5c9b112692`

**Comment vérifier :**
1. Ouvrir Xcode → `ios/App/App.xcworkspace`
2. Sélectionner le projet "App" dans le navigateur de gauche
3. Sélectionner la target "App"
4. Onglet "Signing & Capabilities"
5. **Vérifier que "Bundle Identifier" = `app.lovable.6c002a1cdb754b68b43b8e5c9b112692`**

**Si ce n'est pas le bon Bundle ID :**
- Cliquer sur le Bundle Identifier
- Le changer manuellement en `app.lovable.6c002a1cdb754b68b43b8e5c9b112692`

---

### 2️⃣ Vérifier le fichier GoogleService-Info.plist

**CRITIQUE** : Le fichier GoogleService-Info.plist doit provenir du projet Firebase `amzingfba-3dbf5` pour l'app iOS avec Bundle ID `app.lovable.6c002a1cdb754b68b43b8e5c9b112692`

**Comment vérifier :**
1. Ouvrir le fichier `ios/App/App/GoogleService-Info.plist` dans un éditeur de texte
2. **Vérifier les valeurs suivantes :**
   - `CLIENT_ID` doit contenir `537925270902`
   - `REVERSED_CLIENT_ID` doit commencer par `com.googleusercontent.apps.537925270902`
   - `PROJECT_ID` = `amzingfba-3dbf5`
   - `BUNDLE_ID` = `app.lovable.6c002a1cdb754b68b43b8e5c9b112692`
   - `GCM_SENDER_ID` = `537925270902`

**Si les valeurs ne correspondent pas :**
1. Aller sur Firebase Console : https://console.firebase.google.com/project/amzingfba-3dbf5/settings/general
2. Dans la section "Vos apps" → trouver l'app iOS avec Bundle ID `app.lovable.6c002a1cdb754b68b43b8e5c9b112692`
3. Cliquer sur l'icône d'engrenage → "Télécharger GoogleService-Info.plist"
4. **Remplacer** le fichier `ios/App/App/GoogleService-Info.plist` par le nouveau fichier téléchargé
5. Dans Xcode, supprimer l'ancien fichier de la liste (clic droit → Delete → "Remove Reference")
6. Glisser-déposer le nouveau fichier GoogleService-Info.plist dans Xcode
7. Cocher "Copy items if needed" et sélectionner la target "App"

---

### 3️⃣ Vérifier les Capabilities dans Xcode

**Comment vérifier :**
1. Dans Xcode, sélectionner le projet "App" → target "App" → onglet "Signing & Capabilities"
2. **Vérifier que ces capabilities sont activées :**

✅ **Push Notifications**
   - Si absent : cliquer sur "+ Capability" → rechercher "Push Notifications" → ajouter

✅ **Background Modes** avec ces options cochées :
   - ☑️ Remote notifications
   - Si absent : cliquer sur "+ Capability" → rechercher "Background Modes" → cocher "Remote notifications"

---

### 4️⃣ Vérifier la clé APNs dans Firebase Console

**Comment vérifier :**
1. Aller sur : https://console.firebase.google.com/project/amzingfba-3dbf5/settings/cloudmessaging
2. Cliquer sur l'onglet "Apple app configuration"
3. Trouver l'app iOS avec Bundle ID `app.lovable.6c002a1cdb754b68b43b8e5c9b112692`
4. **Vérifier qu'il y a bien une clé APNs uploadée :**
   - Key ID : `42PJJ677AT`
   - Team ID : `6TSCGN48W2`

**Si la clé APNs est manquante ou incorrecte :**
- Suivre les étapes précédentes pour uploader la clé .p8

---

### 5️⃣ Clean Build et Rebuild

1. Dans Xcode : Product → Clean Build Folder (ou ⌘ + Shift + K)
2. Fermer Xcode complètement
3. Supprimer le dossier DerivedData :
   ```bash
   rm -rf ~/Library/Developer/Xcode/DerivedData
   ```
4. Rouvrir Xcode
5. Rebuild : Product → Build (ou ⌘ + B)
6. Lancer sur iPhone physique

---

### 6️⃣ Logs attendus au démarrage

Si tout est correctement configuré, tu dois voir ces logs dans Xcode au démarrage de l'app :

```
📱 APNs Device Token received
📱 APNs Token: [long hex string]
🔥 Firebase FCM Token: [long token string]
✅ FCM Token sent to JavaScript successfully
```

**Si tu ne vois PAS ces logs :**
- Le problème est dans la configuration iOS/Firebase
- Revenir aux étapes 1-4 ci-dessus

**Si tu vois ces logs :**
- ✅ Les notifications push iOS sont fonctionnelles
- Le token sera sauvegardé dans la base de données automatiquement

---

## 🚨 Points critiques

1. **Bundle ID DOIT être exactement** : `app.lovable.6c002a1cdb754b68b43b8e5c9b112692`
2. **GoogleService-Info.plist DOIT venir du bon projet Firebase** avec le bon Bundle ID
3. **Clé APNs DOIT être uploadée dans Firebase Console**
4. **Capabilities Push Notifications et Background Modes DOIVENT être activées**
5. **Tester UNIQUEMENT sur iPhone physique** (pas simulateur)

---

## 🔍 Debugging

Si après avoir suivi toutes ces étapes, aucun token APNs n'est généré :

1. Vérifier les paramètres iPhone : Réglages → Notifications → AMZing FBA → Autoriser les notifications (ON)
2. Vérifier le provisioning profile dans Xcode
3. Vérifier que l'iPhone est bien enregistré dans Apple Developer Account
4. Attendre 15 minutes après avoir uploadé la clé APNs (propagation Firebase)
