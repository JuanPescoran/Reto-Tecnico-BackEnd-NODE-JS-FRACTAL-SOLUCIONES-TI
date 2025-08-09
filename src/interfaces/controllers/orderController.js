import MySQLOrderRepository from '../../infrastructure/database/MySQLOrderRepository.js';
import { GetAllOrders, GetOrderById, CreateOrder, UpdateOrderStatus, DeleteOrder } from '../../core/use_cases/orderUseCases.js';

const repo = new MySQLOrderRepository();

export const orderController = {
    getAll: async (req, res) => {
        const useCase = new GetAllOrders(repo);
        try {
            const orders = await useCase.execute();
            res.json(orders);
        } catch (e) { res.status(500).json({ message: e.message }); }
    },
    getById: async (req, res) => {
        const useCase = new GetOrderById(repo);
        try {
            const order = await useCase.execute(req.params.id);
            if (!order) return res.status(404).json({ message: 'Order not found' });
            res.json(order);
        } catch (e) { res.status(500).json({ message: e.message }); }
    },
    create: async (req, res) => {
        const useCase = new CreateOrder(repo);
        try {
            const order = await useCase.execute(req.body);
            res.status(201).json(order);
        } catch (e) { res.status(400).json({ message: e.message }); }
    },
    updateStatus: async (req, res) => {
        const useCase = new UpdateOrderStatus(repo);
        try {
            const order = await useCase.execute(req.params.id, req.body.status);
            res.json(order);
        } catch (e) { res.status(400).json({ message: e.message }); }
    },
    delete: async (req, res) => {
        const useCase = new DeleteOrder(repo);
        try {
            await useCase.execute(req.params.id);
            res.status(204).send();
        } catch (e) { res.status(400).json({ message: e.message }); }
    }
};