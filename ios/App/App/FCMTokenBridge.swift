import Foundation
import Capacitor

@objc(FCMTokenBridgePlugin)
public class FCMTokenBridgePlugin: CAPPlugin, CAPBridgedPlugin {
    public let identifier = "FCMTokenBridgePlugin"
    public let jsName = "FCMTokenBridge"
    public let pluginMethods: [CAPPluginMethod] = [
        CAPPluginMethod(name: "getToken", returnType: CAPPluginReturnPromise)
    ]
    
    @objc func getToken(_ call: CAPPluginCall) {
        print("🔍 JS demande le FCM token...")
        
        if let token = UserDefaults.standard.string(forKey: "FCM_TOKEN") {
            print("✅ Token trouvé dans UserDefaults: \(token.prefix(30))...")
            call.resolve(["token": token])
        } else {
            print("⚠️ Aucun token dans UserDefaults")
            call.reject("No FCM token available")
        }
    }
}
