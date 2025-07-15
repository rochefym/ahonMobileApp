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
      'http://192.168.1.4',
      'http://192.168.1.4:8000',
      'http://192.168.1.4:8000/*',
      'http://192.168.1.4:8000/api/*',
      'http://192.168.1.4:8000/api/detection-stream',
      'http://10.0.2.2',
      'http://10.0.2.2:8000',
      'http://10.0.2.2:8000/*',
      'http://10.0.2.2:8000/api/*',
      'http://10.0.2.2:8000/api/detection-stream',
      'http://localhost',
      'http://localhost:8000',
      'http://localhost:8000/*',
      'http://localhost:8000/api/*',
      'http://localhost:8000/api/detection-stream',
      'http://172.29.3.29',
      'http://172.29.3.29:8000',
      'http://172.29.3.29:8000/*',
      'http://172.29.3.29:8000/api/*',
      'http://172.29.3.29:8000/api/detection-stream',
      'https://7pd4fg47-8000.asse.devtunnels.ms',
      'https://7pd4fg47-8000.asse.devtunnels.ms/*',
      'https://7pd4fg47-8000.asse.devtunnels.ms/api/*',
      'https://7pd4fg47-8000.asse.devtunnels.ms/api/detection-stream',
    ],
    // Allow cleartext (HTTP) traffic
    cleartext: true
  },

};

export default config;
