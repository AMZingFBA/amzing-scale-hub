# 🚨 RÉSOLUTION DÉFINITIVE - Push Notifications iOS

## LE PROBLÈME

Vos logs montrent que `didRegisterForRemoteNotificationsWithDeviceToken` **N'EST JAMAIS APPELÉE**.
Vous voyez `📱 Registering for push notifications...` mais **JAMAIS** `📱 APNs Device Token received`.

## LA SOLUTION EN 3 ÉTAPES

### ÉTAPE 1: Vérifier que le fichier AppDelegate.swift a été VRAIMENT modifié

1. **Ouvrez Xcode**
   ```bash
   open ios/App/App.xcworkspace
   ```

2. **Dans Xcode, localisez AppDelegate.swift** (App > AppDelegate.swift)

3. **VÉRIFIEZ LE CONTENU ACTUEL** - Est-ce qu'il contient ces lignes EXACTEMENT?
   - `import FirebaseMessaging` en haut
   - `Messaging.messaging().delegate = self` dans didFinishLaunchingWithOptions
   - `Messaging.messaging().apnsToken = deviceToken` dans didRegisterForRemoteNotificationsWithDeviceToken
   - `extension AppDelegate: MessagingDelegate` à la fin

**SI NON**, remplacez TOUT le contenu du fichier par ce code:

```swift
import UIKit
import Capacitor
import Firebase
import FirebaseMessaging

@UIApplicationMain
class AppDelegate: UIResponder, UIApplicationDelegate {
    var window: UIWindow?

    func application(_ application: UIApplication, didFinishLaunchingWithOptions launchOptions: [UIApplication.LaunchOptionsKey: Any]?) -> Bool {
        // Configure Firebase
        FirebaseApp.configure()
        
        // Set Firebase Messaging delegate
        Messaging.messaging().delegate = self
        
        // Register for remote notifications
        UNUserNotificationCenter.current().delegate = self
        
        return true
    }

    func applicationWillResignActive(_ application: UIApplication) {
    }

    func applicationDidEnterBackground(_ application: UIApplication) {
    }

    func applicationWillEnterForeground(_ application: UIApplication) {
    }

    func applicationDidBecomeActive(_ application: UIApplication) {
    }

    func applicationWillTerminate(_ application: UIApplication) {
    }

    func application(_ application: UIApplication, open url: URL, options: [UIApplication.OpenURLOptionsKey: Any] = [:]) -> Bool {
        return ApplicationDelegateProxy.shared.application(application, open: url, options: options)
    }

    func application(_ application: UIApplication, continue userActivity: NSUserActivity, restorationHandler: @escaping ([UIUserActivityRestoring]?) -> Void) -> Bool {
        return ApplicationDelegateProxy.shared.application(application, continue: userActivity, restorationHandler: restorationHandler)
    }
    
    // CRITIQUE: Ces méthodes DOIVENT être présentes
    func application(_ application: UIApplication, didRegisterForRemoteNotificationsWithDeviceToken deviceToken: Data) {
        print("📱 APNs Device Token received")
        
        let tokenParts = deviceToken.map { data in String(format: "%02.2hhx", data) }
        let token = tokenParts.joined()
        print("📱 APNs Token: \(token)")
        
        // CRITIQUE: Passer le token APNs à Firebase
        Messaging.messaging().apnsToken = deviceToken
        
        // NE PAS passer le token APNs à Capacitor ici
        // On va passer le token FCM dans le delegate Firebase
    }
    
    func application(_ application: UIApplication, didFailToRegisterForRemoteNotificationsWithError error: Error) {
        print("❌ Failed to register for remote notifications: \(error)")
        NotificationCenter.default.post(name: .capacitorDidFailToRegisterForRemoteNotifications, object: error)
    }
}

// Extension pour Firebase Messaging
extension AppDelegate: MessagingDelegate {
    func messaging(_ messaging: Messaging, didReceiveRegistrationToken fcmToken: String?) {
        print("🔥 Firebase FCM Token: \(fcmToken ?? "nil")")
        
        // CRITIQUE: Passer le token FCM (pas APNs) à Capacitor
        if let fcmToken = fcmToken {
            NotificationCenter.default.post(name: .capacitorDidRegisterForRemoteNotifications, object: fcmToken)
            print("✅ FCM Token passed to Capacitor")
        }
    }
}

// Extension pour gérer les notifications
extension AppDelegate: UNUserNotificationCenterDelegate {
    func userNotificationCenter(_ center: UNUserNotificationCenter, willPresent notification: UNNotification, withCompletionHandler completionHandler: @escaping (UNNotificationPresentationOptions) -> Void) {
        // Afficher la notification même quand l'app est au premier plan
        completionHandler([.banner, .sound, .badge])
    }
    
    func userNotificationCenter(_ center: UNUserNotificationCenter, didReceive response: UNNotificationResponse, withCompletionHandler completionHandler: @escaping () -> Void) {
        // Gérer l'action de l'utilisateur sur la notification
        // Capacitor gère automatiquement ces notifications
        completionHandler()
    }
}
```

### ÉTAPE 2: Vérifier les Capabilities dans Xcode

1. **Dans Xcode**, sélectionnez le projet "App" (en haut de la liste à gauche)
2. Sélectionnez la target "App"
3. Allez dans l'onglet **"Signing & Capabilities"**
4. **VÉRIFIEZ** que vous avez:
   - ✅ **Push Notifications** (ajoutez-le avec le bouton "+ Capability" si absent)
   - ✅ **Background Modes** avec **"Remote notifications"** coché

### ÉTAPE 3: Clean Build et Test

1. **Dans Xcode**:
   - `Product` > `Clean Build Folder` (⇧⌘K)
   - Attendez que ça finisse
   - `Product` > `Build` (⌘B)

2. **Lancez sur votre iPhone physique** (PAS sur simulateur)

3. **REGARDEZ LES LOGS XCODE** - Vous DEVEZ voir:
   ```
   📱 APNs Device Token received
   📱 APNs Token: [un long token hexadécimal]
   🔥 Firebase FCM Token: [un token Firebase]
   ```

## SI ÇA NE MARCHE TOUJOURS PAS

### Vérifiez GoogleService-Info.plist

1. **Dans Xcode**, vérifiez que `GoogleService-Info.plist` est bien présent dans le dossier App
2. **Cliquez dessus** et vérifiez dans le panneau de droite que "Target Membership" est **coché pour App**

### Vérifiez le certificat APNs dans Firebase Console

1. Allez sur **Firebase Console** > Votre projet > **Project Settings** ⚙️
2. Onglet **Cloud Messaging**
3. Section **Apple app configuration**
4. Vérifiez que vous avez bien uploadé votre:
   - **APNs Authentication Key (.p8)** OU
   - **APNs Certificate (.p12)**

## APRÈS CES ÉTAPES

Vous DEVEZ voir dans les logs Xcode:
- ✅ `📱 APNs Device Token received`
- ✅ `🔥 Firebase FCM Token: ...`
- ✅ Le token enregistré dans votre base de données

Si vous voyez ces 3 logs, les push notifications fonctionnent! 🎉
