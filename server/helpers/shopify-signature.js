const crypto = require("crypto");

export class ShopifySignature {
  static validate(query) {
    const parameters = [];
    for (let key in query) {
      if (key != "signature") {
        parameters.push(key + "=" + query[key]);
      }
    }
    const message = parameters.join("&");
    const digest = crypto
      .createHmac("sha256", process.env.SHOPIFY_API_SECRET)
      .update(message)
      .digest("hex");
    return crypto.timingSafeEqual(
      Buffer.from(digest),
      Buffer.from(query.signature)
    );
  }

  static convertQueryParams(url) {
    const regex = /[?&]([^=#]+)=([^&#]*)/g;
    const params = {};
    let match;

    while ((match = regex.exec(url))) {
      const key = match[1] === "hmac" ? "signature" : match[1];
      params[key] = match[2];
    }

    return params;
  }
}
