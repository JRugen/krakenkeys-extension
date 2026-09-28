import { defineConfig } from 'wxt';

const DEFAULT_API_BASE = 'https://krakenkeys.com';

export default defineConfig({
  modules: ['@wxt-dev/module-vue'],
  dev: {
    server: {
      host: '127.0.0.1',
      port: 3100,
      origin: 'http://127.0.0.1:3100',
    },
  },
  manifest: ({ browser }) => ({
    name: 'KrakenKeys - Game Price Comparison',
    description: 'Find the cheapest key price for any Steam game',
    permissions: ['storage'],
    host_permissions: [`${process.env.WXT_API_BASE ?? DEFAULT_API_BASE}/*`],
    ...(browser === 'firefox' && {
      browser_specific_settings: {
        gecko: { id: 'extension@krakenkeys.com' },
      },
    }),
  }),
});
