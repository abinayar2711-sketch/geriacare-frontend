import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { loadEnv, type UserConfigFn } from 'vite';
import { iframeErrorPropagation } from './vite-plugin-iframe-errors.ts';
import { watermarkInjectPlugin } from './vite-plugin-watermark.ts';
import { loaderInjectPlugin } from './vite-plugin-loader.ts';

// https://vite.dev/config/
const config: UserConfigFn = ({ mode }) => {
    process.env = {
        ...process.env,
        ...loadEnv(mode, process.cwd())
    };
    return {
        plugins: [
            react(),
            tailwindcss(),
            iframeErrorPropagation(),
            loaderInjectPlugin(),
            watermarkInjectPlugin({
                logo: process.env.VITE_BUILDER_PLATFORM_LOGO || '',
                name: process.env.VITE_BUILDER_PLATFORM_NAME || '',
                url: process.env.VITE_BUILDER_PLATFORM_URL || ''
            })
        ],
        server: {
            allowedHosts: process.env.ALLOWED_HOSTS?.split(',') || true,
            host: '0.0.0.0',
            port: parseInt(process.env.PORT!) || 3000,
            strictPort: true, // Don't try alternative ports, fail if port is occupied
            watch: {
                ignored: ['node_modules']
            }
        },
        base: './',
        resolve: {
            alias: {
                '@': path.resolve(__dirname, './src')
            }
        }
    };
};

export default config;
