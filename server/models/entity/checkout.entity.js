export class Checkout {
    constructor(data) {
        this.id = data['id'];
        this.name = data['name'];
        this.shop = data['shop'];
        this.token = data['token'];
        this.createdAt = data['created_at'];
        this.updatedAt = data['updated_at'];
        this.completedAt = data['completed_at'];
        this.closedAt = data['closed_at'];
        this.paymentGatewayName = data['gateway'];
    }
}