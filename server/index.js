// @ts-check
import { resolve } from 'path';
import express from 'express';
import cookieParser from 'cookie-parser';
import { Shopify, ApiVersion, DataType } from '@shopify/shopify-api';
import 'dotenv/config';

import applyAuthMiddleware from './middleware/auth.js';

const USE_ONLINE_TOKENS = true;
const TOP_LEVEL_OAUTH_COOKIE = 'shopify_top_level_oauth';

const PORT = parseInt(process.env.PORT || '8081', 10);
const isTest = process.env.NODE_ENV === 'test' || !!process.env.VITE_TEST_BUILD;

Shopify.Context.initialize({
  API_KEY: process.env.SHOPIFY_API_KEY,
  API_SECRET_KEY: process.env.SHOPIFY_API_SECRET,
  SCOPES: process.env.SCOPES.split(','),
  HOST_NAME: process.env.HOST.replace(/https:\/\//, ''),
  API_VERSION: ApiVersion.Unstable,
  IS_EMBEDDED_APP: true,
  // This should be replaced with your preferred storage strategy
  SESSION_STORAGE: new Shopify.Session.MemorySessionStorage(),
});

// Storing the currently active shops in memory will force them to re-login when your server restarts. You should
// persist this object in your app.
const ACTIVE_SHOPIFY_SHOPS = {};
Shopify.Webhooks.Registry.addHandler('APP_UNINSTALLED', {
  path: '/webhooks',
  webhookHandler: async (topic, shop, body) =>
    delete ACTIVE_SHOPIFY_SHOPS[shop],
});

// export for test use only
export async function createServer(
  root = process.cwd(),
  isProd = process.env.NODE_ENV === 'production'
) {
  const app = express();
  app.set('top-level-oauth-cookie', TOP_LEVEL_OAUTH_COOKIE);
  app.set('active-shopify-shops', ACTIVE_SHOPIFY_SHOPS);
  app.set('use-online-tokens', USE_ONLINE_TOKENS);

  app.use(cookieParser(Shopify.Context.API_SECRET_KEY));

  applyAuthMiddleware(app);

  app.post('/webhooks', async (req, res) => {
    try {
      await Shopify.Webhooks.Registry.process(req, res);
      console.log(`Webhook processed, returned status code 200`);
    } catch (error) {
      console.log(`Failed to process webhook: ${error}`);
      res.status(500).send(error.message);
    }
  });

  // This endpoint will forward GraphQL requests to the Shopify GraphQL Admin API
  app.post('/graphql', async (req, res) => {
    try {
      const response = await Shopify.Utils.graphqlProxy(req, res);
      res.status(200).send(response.body);
    } catch (error) {
      console.log('error', error);
      res.status(500).send(error.message);
    }
  });

  //Retrieves the shops orders
  app.get('/orders', async (req, res) => {
    try {
      const session = await Shopify.Utils.loadCurrentSession(req, res, true);
      const shop = session.shop;
      const client = new Shopify.Clients.Rest(shop, session.accessToken);
      const data = await client.get({
        path: 'orders',
        query: { status: 'any' },
      });
      res.status(200).send(data);
    } catch (e) {
      console.log('error', e);
      res.status(500).send(e.message);
    }
  });

  app.use(express.json());

  // Create a fulfillment by order id
  app.post('/orders/:id', async (req, res) => {
    try {
      const session = await Shopify.Utils.loadCurrentSession(req, res, true);
      const shop = session.shop;
      const client = new Shopify.Clients.Rest(shop, session.accessToken);

      await client.post({
        path: 'orders/' + req.params.id + '/fulfillments',
        data: { fulfillment: req.body.fulfillment },
        type: DataType.JSON,
      });

      // check if there is a note in the request body
      if (req.body.order) {
        // Add a note to an order to represent a fulfillment message
        await client.put({
          path: 'orders/' + req.params.id,
          data: { order: req.body.order },
          type: DataType.JSON,
        });
      }
    } catch (e) {
      console.log(e.message);
      res.status(500).send({
        message: `There was an error fulfilling the order: ${e.message}`,
      });
    }
    res.status(200).send();
  });

  // For the legacy flow in order to fulfill an order, you need to know the location ID of the fulfillment. Here we get the locations for the shop, and default to the first one.
  app.get('/location', async (req, res) => {
    try {
      const session = await Shopify.Utils.loadCurrentSession(req, res, true);
      const shop = session.shop;
      const client = new Shopify.Clients.Rest(shop, session.accessToken);
      const data = await client.get({
        path: 'locations',
      });
      res.status(200).send(data.body.locations[0]);
    } catch (e) {
      res.status(500).send(e.message);
    }
  });

  app.use((req, res, next) => {
    const shop = req.query.shop;
    if (Shopify.Context.IS_EMBEDDED_APP && shop) {
      res.setHeader(
        'Content-Security-Policy',
        `frame-ancestors https://${shop} https://admin.shopify.com;`
      );
    } else {
      res.setHeader('Content-Security-Policy', `frame-ancestors 'none';`);
    }
    next();
  });

  app.use('/*', (req, res, next) => {
    const shop = req.query.shop;

    // Detect whether we need to reinstall the app, any request from Shopify will
    // include a shop in the query parameters.
    if (app.get('active-shopify-shops')[shop] === undefined && shop) {
      res.redirect(`/auth?shop=${shop}`);
    } else {
      next();
    }
  });

  /**
   * @type {import('vite').ViteDevServer}
   */
  let vite;
  if (!isProd) {
    vite = await import('vite').then(({ createServer }) =>
      createServer({
        root,
        logLevel: isTest ? 'error' : 'info',
        server: {
          port: PORT,
          hmr: {
            protocol: 'ws',
            host: 'localhost',
            port: 64999,
            clientPort: 64999,
          },
          middlewareMode: 'html',
        },
      })
    );
    app.use(vite.middlewares);
  } else {
    const compression = await import('compression').then(
      ({ default: fn }) => fn
    );
    const serveStatic = await import('serve-static').then(
      ({ default: fn }) => fn
    );
    app.use(compression());
    app.use(serveStatic(resolve('dist/client')));
  }

  return { app, vite };
}

if (!isTest) {
  createServer().then(({ app }) => app.listen(PORT));
}
