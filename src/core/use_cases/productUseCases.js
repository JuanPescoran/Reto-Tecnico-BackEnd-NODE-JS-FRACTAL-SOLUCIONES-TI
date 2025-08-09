// Un solo archivo para todos los casos de uso de productos por simplicidad
export class GetAllProducts { constructor(repo) { this.repo = repo; } async execute() { return this.repo.getAll(); } }
export class CreateProduct { constructor(repo) { this.repo = repo; } async execute(data) { return this.repo.create(data); } }
export class UpdateProduct { constructor(repo) { this.repo = repo; } async execute(id, data) { return this.repo.update(id, data); } }
export class DeleteProduct { constructor(repo) { this.repo = repo; } async execute(id) { return this.repo.delete(id); } }