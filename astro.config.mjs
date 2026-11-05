import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://shawndsouza.com',
  trailingSlash: 'always',
  build: { format: 'directory' },
  redirects: {
    '/publications/': '/#publications',
    '/projects/': '/#ncbs',
    '/teaching/': '/#talks',
    '/news/': '/#inside',
    '/blog/': '/#writing',
  },
});
