import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.amzing.fba',
  appName: 'AMZing FBA',
  webDir: 'dist',
  server: {
    androidScheme: 'https',
    allowNavigation: [
      'localhost',
      '*.lovableproject.com',
      'amzingfba.com',
      '*.amzingfba.com'
    ]
  }
};

export default config;
