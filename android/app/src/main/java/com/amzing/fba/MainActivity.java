package com.amzing.fba;

import android.os.Bundle;
import android.util.Log;

import com.getcapacitor.BridgeActivity;
import com.google.firebase.FirebaseApp;
import com.google.firebase.messaging.FirebaseMessaging;

public class MainActivity extends BridgeActivity {
  private static final String TAG = "MainActivity";

  @Override
  public void onCreate(Bundle savedInstanceState) {
    super.onCreate(savedInstanceState);
    
    // Initialiser Firebase
    try {
      FirebaseApp.initializeApp(this);
      Log.d(TAG, "✅ Firebase initialized successfully");
      
      // Récupérer le token FCM immédiatement
      FirebaseMessaging.getInstance().getToken()
        .addOnCompleteListener(task -> {
          if (!task.isSuccessful()) {
            Log.e(TAG, "❌ Failed to get FCM token", task.getException());
            return;
          }

          String token = task.getResult();
          Log.d(TAG, "✅ FCM Token retrieved: " + token);
        });
    } catch (Exception e) {
      Log.e(TAG, "❌ Error initializing Firebase", e);
    }
  }
}
