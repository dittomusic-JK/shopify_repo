import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  site: 'https://www.riffride.com',
  devToolbar: { enabled: false },
  vite: {
    plugins: [tailwindcss()],
  },
});
