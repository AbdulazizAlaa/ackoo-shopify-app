import { UpdateChectoutHandler, CreateChectoutHandler, ConfirmChectoutHandler, OrderPaidHandler } from "./handlers";

export class HandlerFactory {
    static make(topic, shopName) {
        switch (topic) {
            // case "checkouts/create":
            //     return new CreateChectoutHandler(shopName);
            // case "checkouts/update":
            //     return new UpdateChectoutHandler(shopName);
            // case "checkouts/confirm":
            //     return new ConfirmChectoutHandler(shopName);
            case "orders/paid":
                return new OrderPaidHandler(shopName);
            default:
                return undefined;
        }
    }
};