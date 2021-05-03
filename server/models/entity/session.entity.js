export class Session {
    constructor(data) {
        this.sessionToken = data['session_token'];
        this.checkoutToken = data['checkout_token'];
        this.shop = data['shop'];
    }
}