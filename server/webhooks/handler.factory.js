import { UpdateChectoutHandler, CreateChectoutHandler, ConfirmChectoutHandler, OrderPaidHandler } from "./handlers";

export class HandlerFactory {
    static make(topic, shopName) {
        switch (topic) {
            case "orders/paid":
                return new OrderPaidHandler(shopName);
            default:
                return undefined;
        }
    }
};