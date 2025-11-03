# Configuration AppDelegate.swift pour Push Notifications iOS

## Le fichier AppDelegate.swift complet

Remplacez TOUT le contenu de `ios/App/App/AppDelegate.swift` par ce code:

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
        // Sent when the application is about to move from active to inactive state.
    }

    func applicationDidEnterBackground(_ application: UIApplication) {
        // Use this method to release shared resources, save user data, invalidate timers, and store enough application state information to restore your application to its current state in case it is terminated later.
    }

    func applicationWillEnterForeground(_ application: UIApplication) {
        // Called as part of the transition from the background to the active state; here you can undo many of the changes made on entering the background.
    }

    func applicationDidBecomeActive(_ application: UIApplication) {
        // Restart any tasks that were paused (or not yet started) while the application was inactive.
    }

    func applicationWillTerminate(_ application: UIApplication) {
        // Called when the application is about to terminate. Save data if appropriate.
    }

    func application(_ application: UIApplication, open url: URL, options: [UIApplication.OpenURLOptionsKey: Any] = [:]) -> Bool {
        // Called when the app was launched with a url.
        return ApplicationDelegateProxy.shared.application(application, open: url, options: options)
    }

    func application(_ application: UIApplication, continue userActivity: NSUserActivity, restorationHandler: @escaping ([UIUserActivityRestoring]?) -> Void) -> Bool {
        // Called when the app was launched with an activity, including Universal Links.
        return ApplicationDelegateProxy.shared.application(application, continue: userActivity, restorationHandler: restorationHandler)
    }
    
    // IMPORTANT: Ces méthodes sont CRITIQUES pour les push notifications
    func application(_ application: UIApplication, didRegisterForRemoteNotificationsWithDeviceToken deviceToken: Data) {
        print("📱 APNs Device Token received")
        
        // Convertir le token en string pour le debug
        let tokenParts = deviceToken.map { data in String(format: "%02.2hhx", data) }
        let token = tokenParts.joined()
        print("📱 APNs Token: \(token)")
        
        // CRITIQUE: Passer le token APNs à Firebase Messaging
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

// Extension pour gérer les notifications quand l'app est au premier plan
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

## Étapes pour appliquer ces changements:

1. **Ouvrez Xcode** avec le workspace:
   ```bash
   open ios/App/App.xcworkspace
   ```

2. **Localisez le fichier AppDelegate.swift**:
   - Dans le navigateur de fichiers (à gauche)
   - Dossier `App` > `AppDelegate.swift`

3. **Remplacez TOUT le contenu** avec le code ci-dessus

4. **Nettoyez et rebuild**:
   - Dans Xcode: `Product` > `Clean Build Folder` (Cmd+Shift+K)
   - Ensuite: `Product` > `Build` (Cmd+B)

5. **Lancez sur votre iPhone physique**:
   - Sélectionnez votre iPhone dans la liste des devices
   - Cliquez sur le bouton Play ▶️

6. **Vérifiez les logs**:
   - Vous devriez voir `📱 APNs Device Token received`
   - Suivi de `🔔 Push registration success!`
   - Et le token enregistré dans la base de données

## Pourquoi c'était le problème?

Sur iOS, le flux pour les push notifications est:
1. L'app demande l'autorisation → ✅ Fonctionnait
2. iOS génère un token APNs → ❌ N'était pas géré
3. AppDelegate reçoit le token via `didRegisterForRemoteNotificationsWithDeviceToken` → ❌ Manquant
4. Le token est passé à Capacitor → ❌ Manquant
5. Firebase convertit le token APNs en token FCM → N'arrivait jamais là

Sans les méthodes `didRegisterForRemoteNotificationsWithDeviceToken` et `didFailToRegisterForRemoteNotificationsWithError`, iOS ne peut pas passer le token à votre app!
