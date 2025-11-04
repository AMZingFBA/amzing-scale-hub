import UIKit
import Capacitor
import Firebase
import FirebaseMessaging

@UIApplicationMain
class AppDelegate: UIResponder, UIApplicationDelegate {

    var window: UIWindow?
    private var fcmToken: String?
    private var retryCount = 0
    private let maxRetries = 15  // 15 tentatives = 30 secondes maximum
    
    func application(_ application: UIApplication, didFinishLaunchingWithOptions launchOptions: [UIApplication.LaunchOptionsKey: Any]?) -> Bool {
        // Configure Firebase
        FirebaseApp.configure()
        
        // Set Firebase Messaging delegate
        Messaging.messaging().delegate = self
        
        // Register for remote notifications
        UNUserNotificationCenter.current().delegate = self
        UNUserNotificationCenter.current().requestAuthorization(options: [.alert, .badge, .sound]) { granted, error in
            if granted {
                DispatchQueue.main.async {
                    application.registerForRemoteNotifications()
                }
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

    // MARK: - APNs Token
    func application(_ application: UIApplication, didRegisterForRemoteNotificationsWithDeviceToken deviceToken: Data) {
        print("📱 APNs Device Token received")
        let tokenParts = deviceToken.map { data in String(format: "%02.2hhx", data) }
        let token = tokenParts.joined()
        print("📱 APNs Token: \(token)")
        
        // Pass the token to Firebase Messaging
        Messaging.messaging().apnsToken = deviceToken
    }
    
    func application(_ application: UIApplication, didFailToRegisterForRemoteNotificationsWithError error: Error) {
        print("❌ Failed to register for remote notifications: \(error)")
    }
    
    // Function to send FCM token to JavaScript with retry mechanism
    private func sendFCMTokenToJS(token: String, attempt: Int = 1) {
        guard let bridge = (UIApplication.shared.delegate as? AppDelegate)?.window?.rootViewController as? CAPBridgeViewController else {
            if attempt <= maxRetries {
                print("⏳ Attempt \(attempt)/\(maxRetries): WebView not ready yet, retrying in 2 seconds...")
                DispatchQueue.main.asyncAfter(deadline: .now() + 2.0) { [weak self] in
                    self?.sendFCMTokenToJS(token: token, attempt: attempt + 1)
                }
            } else {
                print("❌ Failed to send FCM token after \(maxRetries) attempts")
            }
            return
        }
        
        guard let webView = bridge.webView else {
            if attempt <= maxRetries {
                print("⏳ Attempt \(attempt)/\(maxRetries): WebView not available yet, retrying in 2 seconds...")
                DispatchQueue.main.asyncAfter(deadline: .now() + 2.0) { [weak self] in
                    self?.sendFCMTokenToJS(token: token, attempt: attempt + 1)
                }
            } else {
                print("❌ Failed to send FCM token after \(maxRetries) attempts")
            }
            return
        }
        
        // WebView is ready, store token globally and dispatch event
        let js = """
        window.__FCM_TOKEN__ = '\(token)';
        window.dispatchEvent(new CustomEvent('fcmTokenReceived', { detail: { token: '\(token)' }}));
        """
        webView.evaluateJavaScript(js) { result, error in
            if let error = error {
                print("❌ Error sending FCM token to JavaScript: \(error)")
                if attempt <= self.maxRetries {
                    print("⏳ Retrying in 2 seconds...")
                    DispatchQueue.main.asyncAfter(deadline: .now() + 2.0) { [weak self] in
                        self?.sendFCMTokenToJS(token: token, attempt: attempt + 1)
                    }
                }
            } else {
                print("✅ FCM Token sent to JavaScript successfully on attempt \(attempt)")
                
                // Renvoyer le token après 5 secondes pour s'assurer que React est prêt
                if attempt == 1 {
                    print("⏳ Re-sending token in 5 seconds to ensure React is ready...")
                    DispatchQueue.main.asyncAfter(deadline: .now() + 5.0) { [weak self] in
                        self?.sendFCMTokenToJS(token: token, attempt: 99)
                    }
                }
            }
        }
    }
}

// MARK: - MessagingDelegate
extension AppDelegate: MessagingDelegate {
    func messaging(_ messaging: Messaging, didReceiveRegistrationToken fcmToken: String?) {
        guard let token = fcmToken else { return }
        print("🔥 Firebase FCM Token: \(token)")
        
        // Store the token
        self.fcmToken = token
        
        // Try to send immediately with retry mechanism
        self.sendFCMTokenToJS(token: token)
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
        completionHandler()
    }
}
