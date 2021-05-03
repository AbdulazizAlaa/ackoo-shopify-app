export class CheckoutDAO {
    constructor({shop, token, session_token, created_at, updated_at, completed_at}) {
        this.shop = shop;
        this.checkoutToken = token;
        this.sessionToken = session_token;
        this.createdAt = created_at;
        this.updatedAt = updated_at;
        this.completedAt = completed_at;
        this.isCompleted = false;
        this.isCalled = false;
    }
}