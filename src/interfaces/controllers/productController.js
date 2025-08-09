import MySQLProductRepository from '../../infrastructure/database/MySQLProductRepository.js';
import { GetAllProducts, CreateProduct, UpdateProduct, DeleteProduct } from '../../core/use_cases/productUseCases.js';

const repo = new MySQLProductRepository();

export const productController = {
    getAll: async (req, res) => {
        const useCase = new GetAllProducts(repo);
        try {
            const products = await useCase.execute();
            res.json(products);
        } catch (e) { res.status(500).json({ message: e.message }); }
    },
    create: async (req, res) => {
        const useCase = new CreateProduct(repo);
        try {
            const product = await useCase.execute(req.body);
            res.status(201).json(product);
        } catch (e) { res.status(400).json({ message: e.message }); }
    },
    update: async (req, res) => {
        const useCase = new UpdateProduct(repo);
        try {
            const product = await useCase.execute(req.params.id, req.body);
            res.json(product);
        } catch (e) { res.status(400).json({ message: e.message }); }
    },
    delete: async (req, res) => {
        const useCase = new DeleteProduct(repo);
        try {
            await useCase.execute(req.params.id);
            res.status(204).send();
        } catch (e) { res.status(500).json({ message: e.message }); }
    }
};