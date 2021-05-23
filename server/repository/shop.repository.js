import { ShopDAO } from "../models/dao/shop.dao";

let _shopsDB = {};
export class ShopRepository {
    static get shopsDB() { return _shopsDB; };

    static async addShop(shop) {
        let storedShop = await ShopRepository.getShop(shop.name).catch(e => { console.log(e); throw e; });
        if (storedShop === undefined) {
            storedShop = new ShopDAO({});
        }
        storedShop.name = shop.name;
        storedShop.access_token = shop.access_token;

        ShopRepository.shopsDB[shop.name] = storedShop;
    }
    static async getShop(name) {
        return ShopRepository.shopsDB[name];
    }
}