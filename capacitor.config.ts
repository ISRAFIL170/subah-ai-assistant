import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.israfil.subahai',
  appName: 'Subah AI Assistant',
  webDir: 'dist',
  server: {
    androidScheme: 'https'
  }
};

export default config;
