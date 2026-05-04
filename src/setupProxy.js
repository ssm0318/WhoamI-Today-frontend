/* eslint-disable @typescript-eslint/no-var-requires, import/no-extraneous-dependencies, no-param-reassign */
const { createProxyMiddleware } = require('http-proxy-middleware');

const API_TARGET = 'http://localhost:8000';

const rewriteDevCookie = (cookie) =>
  cookie
    .replace(/;\s*Secure/gi, '')
    .replace(/;\s*Domain=[^;]+/gi, '')
    .replace(/;\s*SameSite=None/gi, '; SameSite=Lax');

module.exports = function setupProxy(app) {
  app.use(
    '/api',
    createProxyMiddleware({
      target: API_TARGET,
      changeOrigin: true,
      cookieDomainRewrite: '',
      onProxyRes(proxyRes) {
        const setCookieHeader = proxyRes.headers['set-cookie'];
        if (!setCookieHeader) return;

        proxyRes.headers['set-cookie'] = Array.isArray(setCookieHeader)
          ? setCookieHeader.map(rewriteDevCookie)
          : rewriteDevCookie(setCookieHeader);
      },
    }),
  );

  app.use(
    '/ws',
    createProxyMiddleware({
      target: API_TARGET,
      changeOrigin: true,
      ws: true,
    }),
  );
};
