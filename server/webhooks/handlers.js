import { Checkout } from '../models/checkout.entity';

class CreateChectoutHandler {
    handle(data) {
        const checkout = new Checkout(data);
        console.log("--------------------------------------------------------------");
        console.log(`Created Checkout: name (${checkout.name}) - id (${checkout.id}) - token (${checkout.token}) - gateway (${checkout.paymentGatewayName})`);
        console.log(`Created Checkout: create time (${checkout.createdAt}) - update time (${checkout.updatedAt}) - complete time (${checkout.completedAt}) - close time (${checkout.closedAt})`);
        console.log("--------------------------------------------------------------");
    }
}

class UpdateChectoutHandler {
    handle(data) {
        const checkout = new Checkout(data);
        console.log("--------------------------------------------------------------");
        console.log(`Updated Checkout: name (${checkout.name}) - id (${checkout.id}) - token (${checkout.token}) - gateway (${checkout.paymentGatewayName})`);
        console.log(`Updated Checkout: create time (${checkout.createdAt}) - update time (${checkout.updatedAt}) - complete time (${checkout.completedAt}) - close time (${checkout.closedAt})`);
        console.log("--------------------------------------------------------------");
    }
}

export { UpdateChectoutHandler, CreateChectoutHandler };