class IOrderRepository {
    async getAll() { throw new Error("Not implemented"); }
    async findById(id) { throw new Error("Not implemented"); }
    async create(orderData) { throw new Error("Not implemented"); }
    async updateStatus(id, status) { throw new Error("Not implemented"); }
    async delete(id) { throw new Error("Not implemented"); }
}
export default IOrderRepository;