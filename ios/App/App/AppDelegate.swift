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
        print("✅ Firebase configured")
        
        // Set Firebase Messaging delegate
        Messaging.messaging().delegate = self
        
        // Set UNUserNotificationCenter delegate
        UNUserNotificationCenter.current().delegate = self
        
        // Request notification authorization
        UNUserNotificationCenter.current().requestAuthorization(options: [.alert, .badge, .sound]) { granted, error in
            if granted {
                print("✅ Notification permission granted")
                DispatchQueue.main.async {
                    application.registerForRemoteNotifications()
                    print("📱 Registering for remote notifications...")
                }
            } else {
                print("❌ Notification permission denied: \(String(describing: error))")
            }
        }
        
        return true
    }

    func applicationWillResignActive(_ application: UIApplication) {
        // Sent when the application is about to move from active to inactive state. This can occur for certain types of temporary interruptions (such as an incoming phone call or SMS message) or when the user quits the application and it begins the transition to the background state.
        // Use this method to pause ongoing tasks, disable timers, and invalidate graphics rendering callbacks. Games should use this method to pause the game.
    }

    func applicationDidEnterBackground(_ application: UIApplication) {
        // Use this method to release shared resources, save user data, invalidate timers, and store enough application state information to restore your application to its current state in case it is terminated later.
        // If your application supports background execution, this method is called instead of applicationWillTerminate: when the user quits.
    }

    func applicationWillEnterForeground(_ application: UIApplication) {
        // Called as part of the transition from the background to the active state; here you can undo many of the changes made on entering the background.
    }

    func applicationDidBecomeActive(_ application: UIApplication) {
        // Restart any tasks that were paused (or not yet started) while the application was inactive. If the application was previously in the background, optionally refresh the user interface.
    }

    func applicationWillTerminate(_ application: UIApplication) {
        // Called when the application is about to terminate. Save data if appropriate. See also applicationDidEnterBackground:.
    }

    func application(_ app: UIApplication, open url: URL, options: [UIApplication.OpenURLOptionsKey: Any] = [:]) -> Bool {
        // Called when the app was launched with a url. Feel free to add additional processing here,
        // but if you want the App API to support tracking app url opens, you must keep this call
        return ApplicationDelegateProxy.shared.application(app, open: url, options: options)
    }

    func application(_ application: UIApplication, continue userActivity: NSUserActivity, restorationHandler: @escaping ([UIUserActivityRestoring]?) -> Void) -> Bool {
        // Called when the app was launched with an activity, including Universal Links.
        // Feel free to add additional processing here, but if you want the App API to support
        // tracking app url opens, you must keep this call
        return ApplicationDelegateProxy.shared.application(application, continue: userActivity, restorationHandler: restorationHandler)
    }

    // MARK: - APNs Token Registration
    func application(_ application: UIApplication, didRegisterForRemoteNotificationsWithDeviceToken deviceToken: Data) {
        print("✅ APNs Device Token received")
        let tokenParts = deviceToken.map { data in String(format: "%02.2hhx", data) }
        let token = tokenParts.joined()
        print("📱 APNs Token (hex): \(token)")
        
        // CRITICAL: Pass the token to Firebase Messaging (will generate FCM token)
        Messaging.messaging().apnsToken = deviceToken
        print("✅ APNs token passed to Firebase Messaging")
        print("⏳ Waiting for FCM token generation...")
        // CRITICAL: Do NOT post APNs token - it would override FCM token
    }
    
    func application(_ application: UIApplication, didFailToRegisterForRemoteNotificationsWithError error: Error) {
        print("❌ Failed to register for remote notifications: \(error.localizedDescription)")
        NotificationCenter.default.post(name: .capacitorDidFailToRegisterForRemoteNotifications, object: error)
    }
    
    func application(_ application: UIApplication, didReceiveRemoteNotification userInfo: [AnyHashable : Any], fetchCompletionHandler completionHandler: @escaping (UIBackgroundFetchResult) -> Void) {
        print("📬 Remote notification received")
        
        // CRITICAL: Notify Capacitor of remote notification
        NotificationCenter.default.post(name: Notification.Name.init("didReceiveRemoteNotification"), object: completionHandler, userInfo: userInfo)
    }
}

// MARK: - MessagingDelegate
extension AppDelegate: MessagingDelegate {
    func messaging(_ messaging: Messaging, didReceiveRegistrationToken fcmToken: String?) {
        guard let token = fcmToken else { 
            print("⚠️ FCM token is nil")
            return 
        }
        print("🔥 Firebase FCM Token generated: \(token)")
        
        // Vérifier que c'est bien un FCM token (contient ':')
        guard token.contains(":") else {
            print("⚠️ Token invalide (pas de ':'), ignoré")
            return
        }
        
        // Sauvegarder dans UserDefaults
        UserDefaults.standard.set(token, forKey: "FCM_TOKEN")
        UserDefaults.standard.synchronize()
        print("✅ FCM Token sauvegardé dans UserDefaults")
        
        // Injecter dans le WebView si prêt
        injectFCMToken(token)
    }
    
    private func injectFCMToken(_ token: String) {
        DispatchQueue.main.async {
            guard let bridge = self.window?.rootViewController as? CAPBridgeViewController,
                  let webView = bridge.webView else {
                print("⚠️ WebView pas encore prêt, token en attente")
                return
            }
            
            let script = """
            (function() {
                console.log('🔥 Native: Injection FCM token...');
                window.__FCM_TOKEN__ = '\(token)';
                window.dispatchEvent(new CustomEvent('fcmTokenReceived', { detail: { token: '\(token)' } }));
                console.log('✅ Native: Token injecté:', '\(token)'.substring(0, 30) + '...');
            })();
            """
            
            webView.evaluateJavaScript(script) { (result, error) in
                if let error = error {
                    print("❌ Erreur injection FCM token: \(error)")
                } else {
                    print("✅ FCM Token injecté avec succès")
                }
            }
        }
    }
}

// MARK: - UNUserNotificationCenterDelegate
extension AppDelegate: UNUserNotificationCenterDelegate {
    // This method will be called when app is in foreground
    func userNotificationCenter(_ center: UNUserNotificationCenter, willPresent notification: UNNotification, withCompletionHandler completionHandler: @escaping (UNNotificationPresentationOptions) -> Void) {
        completionHandler([.alert, .badge, .sound])
    }
    
    // This method will be called when user taps on notification
    func userNotificationCenter(_ center: UNUserNotificationCenter, didReceive response: UNNotificationResponse, withCompletionHandler completionHandler: @escaping () -> Void) {
        // Réinjecter le FCM token si WebView est maintenant prêt
        if let token = UserDefaults.standard.string(forKey: "FCM_TOKEN") {
            print("🔄 Ré-injection FCM token après interaction notification")
            injectFCMToken(token)
        }
        completionHandler()
    }
}
