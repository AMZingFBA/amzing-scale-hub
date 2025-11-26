import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.amzing.fba',
  appName: 'AMZing FBA',
  webDir: 'dist',
  server: {
    androidScheme: 'https'
  }
};

export default config;
