import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'app.lovable.6c002a1cdb754b68b43b8e5c9b112692',
  appName: 'amzing-scale-hub',
  webDir: 'dist',
  server: {
    url: "https://6c002a1c-db75-4b68-b43b-8e5c9b112692.lovableproject.com?forceHideBadge=true",
    cleartext: true
  },
  plugins: {
    FirebaseMessaging: {
      presentationOptions: ["badge", "sound", "alert"]
    }
  }
};

export default config;
