class Order { constructor(id, orderNumber, date, status, products = []) { this.id = id; this.orderNumber = orderNumber; this.date = date; this.status = status; this.Products = products;         this.finalPrice = finalPrice;
} }
export default Order;