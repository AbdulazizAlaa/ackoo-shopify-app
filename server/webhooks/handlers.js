import axios from 'axios';
import { createClient, getOrderUTMSource } from '../handlers';
import { Order } from '../models/entity/order.entity';

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

        if(sessionToken !== undefined && sessionToken !== null){
            console.log("Call Ackoo system");

            // TODO remove this not needed
            const ReqBody = {
                "orderId": String(order.id),
                "status": "completed",
                "amount": order.amount || 20.000,
                "currency": "kwd"
                // "currency": order.currency.toLowerCase() || "kwd"
            };
            const ReqConfig = {
              headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                "session-token": sessionToken,
                "app-key": "8d4b7d70ac1f60e25409032c10808f3801f19aa5",
                'app-secret': "68049f5f6e1320d54cad04352be9c706c58ee662"
              },
              method: "PUT"
            };
            const res = await axios.put(`https://staging.ackoo.app/partner/transactions`, ReqBody, ReqConfig).catch(e => {
                console.log(e);
                console.log(e.response.data);
                console.log(JSON.stringify(e.response.data));
            });
            console.log(res);
            if (res.status != '201') {
              console.log("Failed to add script tags to partner store");
            }
        }
    }
}

export { OrderPaidHandler };