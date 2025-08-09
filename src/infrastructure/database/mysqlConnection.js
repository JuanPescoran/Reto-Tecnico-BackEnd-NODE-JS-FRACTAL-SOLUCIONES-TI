import '../../config.js';
import mysql from 'mysql2/promise';

// Configuración de la conexión, sin especificar la base de datos inicialmente.
const dbBootstrapConfig = {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT || 3306,
    ssl: { rejectUnauthorized: false }
};

const dbName = process.env.DB_NAME;

/**
 * Función de Bootstrap para asegurar que la base de datos y todas las tablas existan.
 * Esto simplifica la configuración inicial para un entorno de prueba/desarrollo.
 */
async function initializeDatabase() {
    let connection;
    try {
        // 1. Conexión al servidor MySQL (sin base de datos específica)
        connection = await mysql.createConnection(dbBootstrapConfig);
        console.log('Bootstrap connection successful. Setting up database...');

        // 2. Crear la base de datos si no existe
        await connection.query(`CREATE DATABASE IF NOT EXISTS \`${dbName}\`;`);
        console.log(`Database '${dbName}' is ready.`);

        // 3. Seleccionar la base de datos para las siguientes operaciones
        await connection.query(`USE \`${dbName}\`;`);

        // 4. Crear la tabla de productos si no existe
        await connection.query(`
            CREATE TABLE IF NOT EXISTS products (
                id INT AUTO_INCREMENT PRIMARY KEY,
                name VARCHAR(255) NOT NULL,
                price DECIMAL(10, 2) NOT NULL
            );
        `);
        console.log("Table 'products' is ready.");

        // 5. Crear la tabla de órdenes si no existe
        await connection.query(`
            CREATE TABLE IF NOT EXISTS orders (
                id INT AUTO_INCREMENT PRIMARY KEY,
                orderNumber VARCHAR(255) NOT NULL UNIQUE,
                date DATETIME NOT NULL,
                status ENUM('Pending', 'InProgress', 'Completed') NOT NULL,
                finalPrice DECIMAL(10, 2) NOT NULL
            );
        `);
        console.log("Table 'orders' is ready.");

        // 6. Crear la tabla de productos de la orden si no existe
        await connection.query(`
            CREATE TABLE IF NOT EXISTS order_products (
                id INT AUTO_INCREMENT PRIMARY KEY,
                orderId INT NOT NULL,
                productId INT NOT NULL,
                productName VARCHAR(255) NOT NULL,
                productPrice DECIMAL(10, 2) NOT NULL,
                quantity INT NOT NULL,
                totalPrice DECIMAL(10, 2) NOT NULL,
                FOREIGN KEY (orderId) REFERENCES orders(id) ON DELETE CASCADE
            );
        `);
        console.log("Table 'order_products' is ready.");

        console.log("Database schema initialized successfully.");

    } catch (error) {
        console.error("Failed to initialize database schema:", error);
        // Si hay un error aquí, es crítico, así que salimos del proceso.
        process.exit(1);
    } finally {
        // 7. Cerrar la conexión de bootstrap
        if (connection) await connection.end();
    }
}

// Llama a la función de inicialización. El 'await' en el nivel superior es válido en módulos ES.
await initializeDatabase();

// --- Creación del Pool Principal ---
// Ahora que sabemos que la DB y las tablas existen, creamos el pool que usará la aplicación.
const pool = mysql.createPool({
    ...dbBootstrapConfig, // Reutiliza la configuración
    database: dbName,      // Pero ahora sí especifica la base de datos
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

// Comprueba la conexión del pool final
pool.getConnection()
    .then(conn => {
        console.log('Main connection pool is ready and connected to the database.');
        conn.release();
    })
    .catch(err => {
        console.error('Error with the main connection pool:', err);
    });

export default pool;