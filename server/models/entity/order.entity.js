export class Order {
    constructor(data) {
        this.id = data['id'];
        this.createdAt = data['created_at'];
        this.updatedAt = data['updated_at'];
        this.closedAt = data['closed_at'];
    }
}