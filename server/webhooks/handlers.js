import { createClient, getOrderUTMSource } from '../handlers';
import { Checkout } from '../models/entity/checkout.entity';
import { Order } from '../models/entity/order.entity';
import { Session } from '../models/entity/session.entity';
import { CheckoutRepository } from '../repository/checkout.repository';

class Handler {
    constructor(shopName){
        this.shopName = shopName;
    }
}

class OrderPaidHandler extends Handler {
    async handle(ctx, data, shop) {
        const order = new Order(data);
        console.log("--------------------------------------------------------------");
        console.log(`Order Paid: id (${order.id})`);
        console.log(`Order Paid: create time (${order.createdAt}) - update time (${order.updatedAt}) - close time (${order.closedAt})`);
        console.log("--------------------------------------------------------------");

        const apolloClient = createClient(shop.name, shop.access_token);
        Object.assign(ctx, {client: apolloClient, order_id: order.id});
        const sessionToken = await getOrderUTMSource(ctx).catch(e => {console.log(e); throw e;});
        console.log("sessionToken", sessionToken);

        if(sessionToken !== undefined){
            console.log("Call Ackoo system");
        }
    }
}

// TODO remove

class CreateChectoutHandler extends Handler {
    async handle(data) {
        const checkout = new Checkout(data);
        console.log("--------------------------------------------------------------");
        console.log(`Created Checkout: name (${checkout.name}) - id (${checkout.id}) - token (${checkout.token}) - gateway (${checkout.paymentGatewayName})`);
        console.log(`Created Checkout: create time (${checkout.createdAt}) - update time (${checkout.updatedAt}) - complete time (${checkout.completedAt}) - close time (${checkout.closedAt})`);
        console.log("--------------------------------------------------------------");
        await CheckoutRepository.updateCheckout(checkout).catch(e => {throw e;});
    }
}

class UpdateChectoutHandler extends Handler {
    async handle(ctx, data, shop) {
        console.log("data", data);
        console.log("shop", shop);
        const checkout = new Checkout(data);
        console.log("--------------------------------------------------------------");
        console.log(`Updated Checkout: name (${checkout.name}) - id (${checkout.id}) - token (${checkout.token}) - gateway (${checkout.paymentGatewayName})`);
        console.log(`Updated Checkout: create time (${checkout.createdAt}) - update time (${checkout.updatedAt}) - complete time (${checkout.completedAt}) - close time (${checkout.closedAt})`);
        console.log("--------------------------------------------------------------");
        await CheckoutRepository.updateCheckout(checkout).catch(e => {throw e;});
        const storedCheckout = await CheckoutRepository.getCheckout(checkout.token).catch(e => {throw e;});
        console.log("update:", storedCheckout);

        const apolloClient = createClient(shop.name, shop.access_token);
        Object.assign(ctx, {client: apolloClient, order_id: 3771291500716});
        const sessionToken = await getOrderUTMSource(ctx).catch(e => {console.log(e);})
        console.log("sessionToken", sessionToken);

        if(!storedCheckout.isCalled && storedCheckout.isCompleted && storedCheckout.completedAt !== undefined){
            console.log("Call Ackoo system");
            storedCheckout.isCalled = true;
            await CheckoutRepository.updateCheckout(storedCheckout).catch(e => {throw e;});
        }
    }
}

class ConfirmChectoutHandler extends Handler {
    async handle(data) {
        const session = new Session(data);
        console.log("--------------------------------------------------------------");
        console.log(`Confirm Checkout: session token (${session.sessionToken}) - checkout token (${session.checkoutToken}) - shop (${session.shop})`);
        console.log("--------------------------------------------------------------");
        await CheckoutRepository.confirmCheckout(session).catch(e => {throw e;});
        const storedCheckout = await CheckoutRepository.getCheckout(session.checkoutToken).catch(e => {throw e;});
        console.log("confirm", storedCheckout);
        if(!storedCheckout.isCalled && storedCheckout.isCompleted && storedCheckout.completedAt !== undefined){
            console.log("Call Ackoo system");
            storedCheckout.isCalled = true;
            await CheckoutRepository.updateCheckout(storedCheckout).catch(e => {throw e;});
        }
    }
}

export { UpdateChectoutHandler, CreateChectoutHandler, ConfirmChectoutHandler, OrderPaidHandler };