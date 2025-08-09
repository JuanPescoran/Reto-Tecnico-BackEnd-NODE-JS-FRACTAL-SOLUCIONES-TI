import Product from '../entities/Product.js'; // Necesitaremos buscar productos
import MySQLProductRepository from '../../infrastructure/database/MySQLProductRepository.js';

const productRepo = new MySQLProductRepository(); // Inyección de dependencias un poco simplificada aquí

export class GetAllOrders { constructor(repo) { this.repo = repo; } async execute() { return this.repo.getAll(); } }
export class GetOrderById { constructor(repo) { this.repo = repo; } async execute(id) { return this.repo.findById(id); } }
export class DeleteOrder {
    constructor(repo) { this.repo = repo; }
    async execute(id) {
        const order = await this.repo.findById(id);
        if (order && order.status === 'Completed') {
            throw new Error('Cannot delete a completed order.');
        }
        return this.repo.delete(id);
    }
}
export class UpdateOrderStatus {
    constructor(repo) { this.repo = repo; }
    async execute(id, status) {
        const order = await this.repo.findById(id);
        if (order && order.status === 'Completed') {
            throw new Error('Status of a completed order cannot be changed.');
        }
        return this.repo.updateStatus(id, status);
    }
}
export class CreateOrder {
    constructor(orderRepository) {
        this.orderRepository = orderRepository;
    }

    async execute(payload) {
        // Lógica de negocio para crear una orden
        const productsWithDetails = await Promise.all(
            payload.products.map(async p => {
                const productDetails = await productRepo.findById(p.productId);
                if (!productDetails) throw new Error(`Product with id ${p.productId} not found.`);
                return {
                    ...p,
                    productName: productDetails.name,
                    productPrice: productDetails.price,
                    totalPrice: productDetails.price * p.quantity,
                };
            })
        );

        const finalPrice = productsWithDetails.reduce((sum, p) => sum + p.totalPrice, 0);

        const orderData = {
            orderNumber: `ORD-${Date.now()}`,
            date: new Date(),
            status: 'Pending',
            products: productsWithDetails,
            finalPrice: finalPrice
        };

        return this.orderRepository.create(orderData);
    }
}