import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'io.ionic.starter',
  appName: 'ahonApp',
  webDir: 'www',
  server: {
    androidScheme: 'https',
    allowNavigation: [
      'https://*',
      'http://*',
      'http://172.29.3.6:8000',
      'http://172.29.9.192',
      'http://172.29.9.192:8000',
      'http://172.29.9.192:8000/*',
      'http://172.29.9.192:8000/api/stream',
    ],
    // Allow cleartext (HTTP) traffic
    cleartext: true
  },

};

export default config;
