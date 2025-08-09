class IProductRepository {
    async getAll() { throw new Error("Not implemented"); }
    async findById(id) { throw new Error("Not implemented"); }
    async create(productData) { throw new Error("Not implemented"); }
    async update(id, productData) { throw new Error("Not implemented"); }
    async delete(id) { throw new Error("Not implemented"); }
}
export default IProductRepository;