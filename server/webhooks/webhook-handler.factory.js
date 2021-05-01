import { UpdateChectoutHandler, CreateChectoutHandler } from "./handlers";

export class WebhookHandlerFactory {
    static make(topic, shopName) {
        switch (topic) {
            case "checkouts/create":
                return new CreateChectoutHandler(shopName);
            case "checkouts/update":
                return new UpdateChectoutHandler(shopName);
            default:
                return undefined;
        }
    }
};