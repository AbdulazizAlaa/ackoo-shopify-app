import "@babel/polyfill";
import dotenv from "dotenv";
import "isomorphic-fetch";
import createShopifyAuth, { verifyRequest } from "@shopify/koa-shopify-auth";
import Shopify, { ApiVersion } from "@shopify/shopify-api";
import Koa from "koa";
import cors from "@koa/cors";
import next from "next";
import Router from "koa-router";
import koaBody from "koa-body";
import { HandlerFactory } from "./webhooks/handler.factory";
import { ShopRepository } from "./repository/shop.repository";
import { Middleware } from "./helpers/middleware";

dotenv.config();
const port = parseInt(process.env.PORT, 10) || 8081;
const dev = process.env.NODE_ENV !== "production";
const app = next({
  dev,
});
const handle = app.getRequestHandler();

Shopify.Context.initialize({
  API_KEY: process.env.SHOPIFY_API_KEY,
  API_SECRET_KEY: process.env.SHOPIFY_API_SECRET,
  SCOPES: process.env.SCOPES.split(","),
  HOST_NAME: process.env.HOST.replace(/https:\/\//, ""),
  API_VERSION: ApiVersion.October20,
  IS_EMBEDDED_APP: true,
  // This should be replaced with your preferred storage strategy
  SESSION_STORAGE: new Shopify.Session.MemorySessionStorage(),
});

// Storing the currently active shops in memory will force them to re-login when your server restarts. You should
// persist this object in your app.
const ACTIVE_SHOPIFY_SHOPS = {};

app.prepare().then(async () => {
  const server = new Koa();
  const router = new Router();
  server.keys = [Shopify.Context.API_SECRET_KEY];
  server.use(
    createShopifyAuth({
      async afterAuth(ctx) {
        // Access token and shop available in ctx.state.shopify
        const { shop, accessToken, scope } = ctx.state.shopify;
        ACTIVE_SHOPIFY_SHOPS[shop] = scope;
        console.log("start ", shop, accessToken, scope, ACTIVE_SHOPIFY_SHOPS);

        await ShopRepository.addShop({
          name: shop,
          access_token: accessToken,
        }).catch((e) => {
          throw e;
        });

        const response = await Shopify.Webhooks.Registry.register({
          shop,
          accessToken,
          path: "/webhooks",
          topic: "ORDERS_PAID",
          webhookHandler: async (topic, shop, body) =>
            delete ACTIVE_SHOPIFY_SHOPS[shop],
        });

        if (!response.success) {
          console.log(
            `Failed to register APP_UNINSTALLED, CHECKOUT_CREATE, CHECKOUT_UPDATE webhook: ${response.result}`
          );
        }
        // Redirect to app with shop parameter upon auth
        ctx.redirect(`/?shop=${shop}`);
      },
    })
  );

  const handleRequest = async (ctx) => {
    await handle(ctx.req, ctx.res);
    ctx.respond = false;
    ctx.res.statusCode = 200;
  };

  router.get("/", async (ctx) => {
    const shop = ctx.query.shop;

    // This shop hasn't been seen yet, go through OAuth to create a session
    if (ACTIVE_SHOPIFY_SHOPS[shop] === undefined) {
      ctx.redirect(`/auth?shop=${shop}`);
    } else {
      await handleRequest(ctx);
    }
  });

  router.post("/webhooks", async (ctx) => {
    try {
      // await Shopify.Webhooks.Registry.process(ctx.request, ctx.res);
      console.log(`Webhook processed, returned status code 200`);
      // console.log(ctx.req);
      // console.log("body", ctx.request.body);

      const webhookId = ctx.req.headers["x-shopify-webhook-id"];
      const shopHMAC = ctx.req.headers["x-shopify-hmac-sha256"];
      const topic = ctx.req.headers["x-shopify-topic"];
      const shopDomain = ctx.req.headers["x-shopify-shop-domain"];
      const shop = shopDomain.split(".")[0];
      const data = ctx.request.body;

      console.log("shopHMAC: ", shopHMAC);
      console.log("topic: ", topic);
      console.log("shopDomain: ", shopDomain);
      console.log("shop: ", shop);

      const shopData = await ShopRepository.getShop(shopDomain).catch((e) => {
        throw e;
      });

      const handler = HandlerFactory.make(topic, shop);
      if (handler === undefined) {
        throw new Error("unspported webhook");
      }
      handler.handle(ctx, data, shopData);
    } catch (error) {
      console.log(`Failed to process webhook: ${error}`);
    }
  });

  router.post(
    "/graphql",
    verifyRequest({ returnHeader: true }),
    async (ctx, next) => {
      await Shopify.Utils.graphqlProxy(ctx.req, ctx.res);
    }
  );

  router.post(
    "/shop/keys",
    Middleware.setOrigin,
    Middleware.verifyRequest,
    async (ctx) => {
      const body = ctx.request.body;
      const shop = ctx.req.headers["x-shopify-shop-domain"];
      console.log("body", body);
      console.log("shop", shop);

      let updatedShop = await ShopRepository.addShop({
        name: shop,
        app_key: body.app_key,
        app_secret: body.app_secret,
      }).catch((e) => {
        throw e;
      });

      ctx.set("content-type", "application/json");
      ctx.statusCode = 200;
      ctx.body = {
        message: "successful",
        data: updatedShop,
      };
    }
  );

  router.get(
    "/shop/keys",
    Middleware.setOrigin,
    Middleware.verifyRequest,
    async (ctx) => {
      const shop = ctx.req.headers["x-shopify-shop-domain"];
      const shopData = await ShopRepository.getShop(shop).catch((e) => {
        throw e;
      });

      ctx.set("content-type", "application/json");
      ctx.statusCode = 200;
      ctx.body = {
        message: "successful",
        data: shopData,
      };
    }
  );

  router.get("(/_next/static/.*)", handleRequest); // Static content is clear
  router.get("/_next/webpack-hmr", handleRequest); // Webpack content is clear
  router.get("(.*)", verifyRequest(), handleRequest); // Everything else must have sessions

  server.use(cors());
  server.use(koaBody());
  server.use(router.allowedMethods());
  server.use(router.routes());
  server.listen(port, () => {
    console.log(`> Ready on http://localhost:${port}`);
  });
});
