import IOrderRepository from '../../core/repositories/IOrderRepository.js';
import Order from '../../core/entities/Order.js';
import OrderProduct from '../../core/entities/OrderProduct.js';
import db from './mysqlConnection.js';

class MySQLOrderRepository extends IOrderRepository {
    async getAll() {
        const [orderRows] = await db.query('SELECT * FROM orders ORDER BY date DESC');
        if (orderRows.length === 0) return [];

        const orderIds = orderRows.map(o => o.id);
        const [productRows] = await db.query('SELECT * FROM order_products WHERE orderId IN (?)', [orderIds]);

        const productsByOrderId = productRows.reduce((acc, product) => {
            const orderId = product.orderId;
            if (!acc[orderId]) acc[orderId] = [];
            acc[orderId].push(new OrderProduct(
                product.id, product.orderId, product.productId,
                product.productName, product.productPrice, product.quantity, product.totalPrice
            ));
            return acc;
        }, {});

        // VERIFICAR QUE LA LLAMADA AL CONSTRUCTOR COINCIDA CON LA DEFINICIÓN
        return orderRows.map(orderRow => {
            const productsForOrder = productsByOrderId[orderRow.id] || [];
            return new Order(
                orderRow.id,
                orderRow.orderNumber,
                orderRow.date,
                orderRow.status,
                productsForOrder,
                orderRow.finalPrice // El 6º argumento, como en la definición
            );
        });
    }

    async findById(id) {
        const [orderRows] = await db.query('SELECT * FROM orders WHERE id = ?', [id]);
        if (orderRows.length === 0) return null;

        const [productRows] = await db.query('SELECT * FROM order_products WHERE orderId = ?', [id]);
        const products = productRows.map(p => new OrderProduct(
            p.id, p.orderId, p.productId, p.productName, p.productPrice, p.quantity, p.totalPrice
        ));

        const orderRow = orderRows[0];
        // VERIFICAR QUE LA LLAMADA AL CONSTRUCTOR COINCIDA CON LA DEFINICIÓN
        return new Order(
            orderRow.id,
            orderRow.orderNumber,
            orderRow.date,
            orderRow.status,
            products,
            orderRow.finalPrice // El 6º argumento
        );
    }

    /**
     * Crea una nueva orden y sus líneas de producto asociadas dentro de una transacción.
     * @param {object} orderData - Los datos completos de la orden a crear.
     * @returns {Promise<Order>} La nueva entidad Order creada y completa.
     */
    async create(orderData) {
        const connection = await db.getConnection();
        try {
            await connection.beginTransaction();

            const { orderNumber, date, status, products, finalPrice } = orderData;

            const [orderResult] = await connection.query(
                'INSERT INTO orders (orderNumber, date, status, finalPrice) VALUES (?, ?, ?, ?)',
                [orderNumber, date, status, finalPrice]
            );
            const orderId = orderResult.insertId;

            if (products && products.length > 0) {
                const orderProductsValues = products.map(p => [orderId, p.productId, p.productName, p.productPrice, p.quantity, p.totalPrice]);
                await connection.query(
                    'INSERT INTO order_products (orderId, productId, productName, productPrice, quantity, totalPrice) VALUES ?',
                    [orderProductsValues]
                );
            }

            await connection.commit();
            return this.findById(orderId);

        } catch (error) {
            await connection.rollback();
            throw error;
        } finally {
            connection.release();
        }
    }

    /**
     * Actualiza solo el estado de una orden.
     * @param {number} id - El ID de la orden.
     * @param {string} status - El nuevo estado.
     * @returns {Promise<Order>} La entidad Order actualizada.
     */
    async updateStatus(id, status) {
        await db.query('UPDATE orders SET status = ? WHERE id = ?', [status, id]);
        return this.findById(id);
    }

    /**
     * Elimina una orden. Se basa en ON DELETE CASCADE en la BD para borrar los productos asociados.
     * @param {number} id - El ID de la orden a eliminar.
     * @returns {Promise<boolean>} True si se eliminó, false en caso contrario.
     */
    async delete(id) {
        const [result] = await db.query('DELETE FROM orders WHERE id = ?', [id]);
        return result.affectedRows > 0;
    }
}

export default MySQLOrderRepository;