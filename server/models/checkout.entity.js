export class Checkout {
    constructor(data) {
        this.name = data['name'];
        this.id = data['id'];
        this.token = data['token'];
        this.createdAt = data['created_at'];
        this.updatedAt = data['updated_at'];
        this.completedAt = data['completed_at'];
        this.closedAt = data['closed_at'];
        this.paymentGatewayName = data['gateway'];
    }
}