import './config.js';
import express from 'express';
import cors from 'cors';
import productRoutes from './infrastructure/web/productRoutes.js';
import orderRoutes from './infrastructure/web/orderRoutes.js';

const app = express();
const PORT = process.env.PORT || 8080; // o config.server.port

app.use(cors());
app.use(express.json());

app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);

app.listen(PORT, () => {
    console.log(`Backend server is running on http://localhost:${PORT}`);
});