import Foundation
import Capacitor

@objc(FCMTokenPlugin)
public class FCMTokenPlugin: CAPPlugin {
    @objc func getToken(_ call: CAPPluginCall) {
        // Read FCM token from UserDefaults
        if let token = UserDefaults.standard.string(forKey: "FCM_TOKEN") {
            call.resolve(["token": token])
        } else {
            call.reject("No FCM token available")
        }
    }
}
