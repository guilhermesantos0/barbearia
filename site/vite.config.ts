import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import svgr from 'vite-plugin-svgr';

export default defineConfig({
    plugins: [
        react(),
        svgr({
            // exportAsDefault: true,
            svgrOptions: {
                icon: true
            },
            include: '**/*.svg?react'
        }),
    ],
    resolve: {
        alias: {
            '@assets': path.resolve(__dirname, './src/assets'),
            '@components': path.resolve(__dirname, './src/components'),
            '@pages': path.resolve(__dirname, './src/pages'),
            '@styles': path.resolve(__dirname, './src/styles'),
            '@contexts': path.resolve(__dirname, './src/contexts'),
            '@types': path.resolve(__dirname, './src/types'),
            '@utils': path.resolve(__dirname, './src/utils')
        },
    },
    css: {
        modules: {
            generateScopedName: "[name]_[local]__[hash:base64:5]"
        }
    }
});
