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
      throw e;
    });
    if (storedShop === undefined || storedShop === null) {
      storedShop = new ShopDAO({});
    }
    storedShop.name = shop.name;
    storedShop.access_token =
      shop.access_token == undefined
        ? storedShop.access_token
        : shop.access_token;
    storedShop.app_key =
      shop.app_key == undefined ? storedShop.app_key : shop.app_key;
    storedShop.app_secret =
      shop.app_secret == undefined ? storedShop.app_secret : shop.app_secret;

    console.log(storedShop);
    const db = await Database.getInstance().catch((e) => {
      throw e;
    });
    await db
      .collection(ShopRepository.collectionName)
      .update({ _id: storedShop._id }, storedShop, { upsert: true })
      .catch((e) => {
        console.log(e);
        throw e;
      });

    storedShop = await ShopRepository.getShop(shop.name).catch((e) => {
      throw e;
    });

    return storedShop;
  }

  static async getShop(name) {
    const db = await Database.getInstance().catch((e) => {
      throw e;
    });
    return await db
      .collection(ShopRepository.collectionName)
      .findOne({ name: name })
      .catch((e) => {
        throw e;
      });
  }
}
