export class Order {
    constructor(data) {
        this.id = data['id'];
        this.amount = data['amount'];
        this.currency = data['currency'];
        this.createdAt = data['created_at'];
        this.updatedAt = data['updated_at'];
        this.closedAt = data['closed_at'];
    }
}