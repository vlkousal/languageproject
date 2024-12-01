import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
    appId: 'net.kousal.bopomofo',
    appName: 'Bopomofo',
    webDir: 'dist/bopomofo',
    server: {
        androidScheme: "http",
        cleartext: true,
    },
    android: {
        allowMixedContent: true
    },
    plugins: {
        CapacitorHttp: {
            enabled: true
        }
    }
};

export default config;
