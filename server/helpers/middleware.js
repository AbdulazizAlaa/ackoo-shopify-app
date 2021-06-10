import { ShopifySignature } from "./shopify-signature";

export class Middleware {
  static async setOrigin(ctx, next) {
    const refererUrl = ctx.req.headers["referer"] || "";

    const query = ShopifySignature.convertQueryParams(refererUrl);
    const shopOrigin = query["shop"];

    Object.assign(ctx.req.headers, { "x-shopify-shop-domain": shopOrigin });
    await next();
  }

  static async verifyRequest(ctx, next) {
    const refererUrl = ctx.req.headers["referer"] || "";
    const query = ShopifySignature.convertQueryParams(refererUrl);
    const isValid = ShopifySignature.validate(query);

    if (!isValid) {
      ctx.statusCode = 400;
      ctx.body = {
        message: "failed",
      };
      return;
    }
    await next();
  }
}
