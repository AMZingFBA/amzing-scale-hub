# Configuration Firebase pour iOS Push Notifications

## Étape 1: Créer un projet Firebase

1. Allez sur [Firebase Console](https://console.firebase.google.com/)
2. Créez un nouveau projet (ou sélectionnez un projet existant)
3. Donnez-lui un nom (ex: "Amzing Scale Hub")

## Étape 2: Ajouter iOS à votre projet Firebase

1. Dans Firebase Console, cliquez sur l'icône iOS (ou "Ajouter une app")
2. **Bundle ID iOS**: `app.lovable.6c002a1cdb754b68b43b8e5c9b112692`
3. Téléchargez le fichier `GoogleService-Info.plist`
4. **IMPORTANT**: Gardez ce fichier, vous en aurez besoin à l'étape 5

## Étape 3: Créer un certificat APNs (Apple Push Notification service)

### Option A: Clé d'authentification APNs (Recommandée)

1. Allez sur [Apple Developer Portal](https://developer.apple.com/account/resources/authkeys/list)
2. Créez une nouvelle clé:
   - Cochez "Apple Push Notifications service (APNs)"
   - Téléchargez le fichier `.p8`
   - **Notez le Key ID** (vous ne pourrez le voir qu'une fois)

3. Dans Firebase Console → Project Settings → Cloud Messaging:
   - Uploadez le fichier `.p8`
   - Entrez votre **Key ID**
   - Entrez votre **Team ID** (trouvable sur votre compte Apple Developer)

### Option B: Certificat APNs (Alternative)

1. Générez un certificat via Xcode ou Apple Developer Portal
2. Exportez-le en `.p12`
3. Uploadez-le dans Firebase Console → Cloud Messaging

## Étape 4: Préparer votre projet

```bash
# Pull le code mis à jour
git pull

# Installer les dépendances
npm install

# Mettre à jour les capacitors
npx cap sync ios
```

## Étape 5: Configuration Xcode

1. Ouvrez le projet dans Xcode:
```bash
npx cap open ios
```

2. **Ajouter GoogleService-Info.plist**:
   - Dans Xcode, faites un clic droit sur "App" folder
   - Sélectionnez "Add Files to 'App'..."
   - Choisissez le fichier `GoogleService-Info.plist` téléchargé à l'étape 2
   - **IMPORTANT**: Cochez "Copy items if needed"
   - **IMPORTANT**: Cochez "Add to targets: App"

3. **Activer Push Notifications**:
   - Sélectionnez le projet "App" dans la barre latérale
   - Allez dans l'onglet "Signing & Capabilities"
   - Cliquez sur "+ Capability"
   - Ajoutez "Push Notifications"
   - Ajoutez "Background Modes" et cochez "Remote notifications"

4. **Vérifier le Bundle ID**:
   - Dans "General" tab
   - Vérifiez que le Bundle Identifier est: `app.lovable.6c002a1cdb754b68b43b8e5c9b112692`

## Étape 6: Tester

1. Lancez l'app sur un **appareil physique** (les notifications push ne fonctionnent pas sur simulateur):
```bash
npx cap run ios --target <DEVICE_NAME>
```

2. Acceptez les notifications quand demandé

3. Vérifiez dans les logs que le token est généré:
   - Vous devriez voir: "🔔 Push registration success!"
   - Le token devrait être sauvegardé dans la base de données

## Étape 7: Obtenir votre Server Key FCM

1. Dans Firebase Console → Project Settings → Cloud Messaging
2. Dans l'onglet "Cloud Messaging API (Legacy)"
3. **Activez-le** si nécessaire
4. Copiez la **Server Key**
5. Cette clé est déjà configurée dans vos secrets Lovable Cloud

## Vérification

Pour vérifier que tout fonctionne:

1. Créez une alerte dans l'admin
2. L'app devrait recevoir une notification push
3. Vérifiez les logs de l'edge function `send-push-notifications`

## Dépannage

### Le token ne se génère pas
- Vérifiez que GoogleService-Info.plist est bien ajouté au projet
- Vérifiez que Push Notifications est activé dans Capabilities
- Testez sur un appareil physique, pas un simulateur

### Notifications non reçues
- Vérifiez que le certificat APNs est correctement configuré dans Firebase
- Vérifiez que la Server Key FCM est correcte dans les secrets
- Consultez les logs de l'edge function pour voir les erreurs

### Erreur de certificat
- Assurez-vous que le Bundle ID correspond exactement
- Vérifiez que le certificat APNs n'est pas expiré
- Utilisez une clé d'authentification APNs plutôt qu'un certificat (plus fiable)
