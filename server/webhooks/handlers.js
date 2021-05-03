import { Checkout } from '../models/entity/checkout.entity';
import { Session } from '../models/entity/session.entity';
import { CheckoutRepository } from '../repository/checkout.repository';

class ChectoutHandler {
    constructor(shopName){
        this.shopName = shopName;
    }
}

class CreateChectoutHandler extends ChectoutHandler {
    async handle(data) {
        const checkout = new Checkout(data);
        console.log("--------------------------------------------------------------");
        console.log(`Created Checkout: name (${checkout.name}) - id (${checkout.id}) - token (${checkout.token}) - gateway (${checkout.paymentGatewayName})`);
        console.log(`Created Checkout: create time (${checkout.createdAt}) - update time (${checkout.updatedAt}) - complete time (${checkout.completedAt}) - close time (${checkout.closedAt})`);
        console.log("--------------------------------------------------------------");
        await CheckoutRepository.updateCheckout(checkout).catch(e => {throw e;});
    }
}

class UpdateChectoutHandler extends ChectoutHandler {
    async handle(data) {
        const checkout = new Checkout(data);
        console.log("--------------------------------------------------------------");
        console.log(`Updated Checkout: name (${checkout.name}) - id (${checkout.id}) - token (${checkout.token}) - gateway (${checkout.paymentGatewayName})`);
        console.log(`Updated Checkout: create time (${checkout.createdAt}) - update time (${checkout.updatedAt}) - complete time (${checkout.completedAt}) - close time (${checkout.closedAt})`);
        console.log("--------------------------------------------------------------");
        await CheckoutRepository.updateCheckout(checkout).catch(e => {throw e;});
        const storedCheckout = await CheckoutRepository.getCheckout(checkout.token).catch(e => {throw e;});
        console.log("update:", storedCheckout);
        if(!storedCheckout.isCalled && storedCheckout.isCompleted && storedCheckout.completedAt !== undefined){
            console.log("Call Ackoo system");
            storedCheckout.isCalled = true;
            await CheckoutRepository.updateCheckout(storedCheckout).catch(e => {throw e;});
        }
    }
}

class ConfirmChectoutHandler extends ChectoutHandler {
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

export { UpdateChectoutHandler, CreateChectoutHandler, ConfirmChectoutHandler };