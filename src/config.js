import dotenv from 'dotenv';

// Ejecuta la configuración de dotenv
dotenv.config();

export const config = {
    db: {
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        name: process.env.DB_NAME,
        port: process.env.DB_PORT || 3306
    },
    server: {
        port: process.env.PORT || 8080
    }
};