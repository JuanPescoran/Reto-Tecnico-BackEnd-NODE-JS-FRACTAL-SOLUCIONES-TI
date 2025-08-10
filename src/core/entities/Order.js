// src/core/entities/Order.js

class Order {
    /**
     * @param {number} id
     * @param {string} orderNumber
     * @param {Date} date
     * @param {string} status
     * @param {Array} products
     * @param {number} finalPrice - ¡Importante que este sea el último parámetro!
     */
    constructor(id, orderNumber, date, status, products = [], finalPrice) {
        this.id = id;
        this.orderNumber = orderNumber;
        this.date = date;
        this.status = status;
        this.Products = products;
        this.finalPrice = finalPrice; // Asignar la propiedad
    }
}

export default Order;