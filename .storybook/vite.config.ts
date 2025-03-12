import { defineConfig } from 'vite';
import { WxtVitest } from 'wxt/testing';

export default defineConfig({
  plugins: [WxtVitest()],
  optimizeDeps: { exclude: ['fsevents'] },
});
