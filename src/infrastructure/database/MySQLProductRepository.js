import IProductRepository from '../../core/repositories/IProductRepository.js';
import Product from '../../core/entities/Product.js';
import db from './mysqlConnection.js';

/**
 * Implementación del repositorio de productos para MySQL.
 * Se encarga de todas las operaciones de base de datos relacionadas con los productos.
 */
class MySQLProductRepository extends IProductRepository {
    /**
     * Obtiene todos los productos del catálogo.
     * @returns {Promise<Product[]>} Un array de entidades Product.
     */
    async getAll() {
        const [rows] = await db.query('SELECT * FROM products ORDER BY id DESC');
        return rows.map(row => new Product(row.id, row.name, row.price));
    }

    /**
     * Busca un producto por su ID.
     * @param {number} id - El ID del producto a buscar.
     * @returns {Promise<Product|null>} La entidad Product o null si no se encuentra.
     */
    async findById(id) {
        const [rows] = await db.query('SELECT * FROM products WHERE id = ?', [id]);
        if (rows.length === 0) {
            return null;
        }
        const row = rows[0];
        return new Product(row.id, row.name, row.price);
    }

    /**
     * Crea un nuevo producto en la base de datos.
     * @param {object} productData - Objeto con { name, price }.
     * @returns {Promise<Product>} La nueva entidad Product creada.
     */
    async create(productData) {
        const { name, price } = productData;
        const [result] = await db.query('INSERT INTO products (name, price) VALUES (?, ?)', [name, price]);
        return new Product(result.insertId, name, price);
    }

    /**
     * Actualiza un producto existente en la base de datos.
     * @param {number} id - El ID del producto a actualizar.
     * @param {object} productData - Objeto con { name, price }.
     * @returns {Promise<Product>} La entidad Product actualizada.
     */
    async update(id, productData) {
        const { name, price } = productData;
        await db.query('UPDATE products SET name = ?, price = ? WHERE id = ?', [name, price, id]);
        // Devolvemos el objeto actualizado para consistencia
        return new Product(id, name, price);
    }

    /**
     * Elimina un producto de la base de datos.
     * @param {number} id - El ID del producto a eliminar.
     * @returns {Promise<boolean>} True si se eliminó, false en caso contrario.
     */
    async delete(id) {
        const [result] = await db.query('DELETE FROM products WHERE id = ?', [id]);
        return result.affectedRows > 0;
    }
}

export default MySQLProductRepository;