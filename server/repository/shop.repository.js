import { ShopDAO } from "../models/dao/shop.dao";
import { Database } from "./database";

let _shopsDB = {};
export class ShopRepository {
  static get shopsDB() {
    return _shopsDB;
  }

  static get collectionName() {
    return "ackoo-shops";
  }

  static async addShop(shop) {
    let storedShop = await ShopRepository.getShop(shop.name).catch((e) => {
      console.log(e);
      throw e;
    });
    if (storedShop === undefined) {
      storedShop = new ShopDAO({});
    }
    storedShop.name = shop.name;
    storedShop.access_token = shop.access_token || storedShop.access_token;
    storedShop.api_key = shop.api_key || storedShop.api_key;
    storedShop.api_secret = shop.api_secret || storedShop.api_secret;

    const db = await Database.getInstance().catch((e) => {
      throw e;
    });
    await db
      .collection(ShopRepository.collectionName)
      .insertOne(storedShop)
      .catch((e) => {
        throw e;
      });
    // ShopRepository.shopsDB[shop.name] = storedShop;

    return await ShopRepository.getShop(shop.name).catch((e) => {
      throw e;
    });
  }
  static async getShop(name) {
    const db = await Database.getInstance().catch((e) => {
      throw e;
    });
    const shop = await db
      .collection(ShopRepository.collectionName)
      .findOne({ name: name })
      .catch((e) => {
        console.log("sssss", e);
        throw e;
      });
    return shop;
    // return ShopRepository.shopsDB[name];
  }
}
