import { CheckoutDAO } from "../models/dao/checkout.dao";

let _checkoutsDB = {};
export class CheckoutRepository {
    static get checkoutsDB() { return _checkoutsDB; };

    static async updateCheckout(checkout) {
        let storedCheckout = await CheckoutRepository.getCheckout(checkout.token).catch(e => { throw e; });
        if (storedCheckout === undefined) {
            storedCheckout = new CheckoutDAO({
                shop: checkout.shop,
                token: checkout.token,
                created_at: checkout.createdAt,
                updated_at: checkout.updatedAt,
                completed_at: checkout.completedAt,
            });
        }

        storedCheckout.shop = checkout.shop;
        storedCheckout.token = checkout.token;
        storedCheckout.createdAt = checkout.createdAt;
        storedCheckout.updatedAt = checkout.updatedAt;
        storedCheckout.completedAt = checkout.completedAt;
        storedCheckout.isCalled = checkout.isCalled || false;
        CheckoutRepository.checkoutsDB[checkout.token] = storedCheckout;
    }
    static async confirmCheckout(session) {
        let storedCheckout = await CheckoutRepository.getCheckout(session.checkoutToken).catch(e => { throw e; });
        if (storedCheckout === undefined) {
            throw new Error("can not confirm non existent checkout");
        }
        storedCheckout.sessionToken = session.sessionToken;
        storedCheckout.isCompleted = true;
        CheckoutRepository.checkoutsDB[session.token] = storedCheckout;
    }
    static async getCheckout(token) {
        return CheckoutRepository.checkoutsDB[token];
    }
    static async getCheckouts() {
        return Object.values(CheckoutRepository.checkoutsDB);
    }
}