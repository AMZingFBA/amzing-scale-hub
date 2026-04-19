import UIKit
import Capacitor

class ViewController: CAPBridgeViewController {
    override func viewDidLoad() {
        super.viewDidLoad()
        // Do any additional setup after loading the view.
    }
    
    override open func capacitorDidLoad() {
        bridge?.webView?.scrollView.bounces = false
    }
}
