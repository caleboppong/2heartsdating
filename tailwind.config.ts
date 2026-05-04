import type { Config } from 'tailwindcss';
const config: Config = { content: ['./app/**/*.{js,ts,jsx,tsx}', './components/**/*.{js,ts,jsx,tsx}'], theme: { extend: { colors: { rosebrand: '#E83E75', navybrand: '#101B3D', softpink: '#FFF1F6', goldbrand: '#D4AF37' } } }, plugins: [] };
export default config;
