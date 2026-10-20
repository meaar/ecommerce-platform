const { Pool } = require('pg');

const DEFAULT_PRODUCTS = [
  ['1', 'Laptop Pro', 1299.99, 'High-performance laptop for professionals', 'https://via.placeholder.com/300x200?text=Laptop+Pro', 'Electronics', 4.8, 15],
  ['2', 'Wireless Headphones', 199.99, 'Premium noise-cancelling headphones', 'https://via.placeholder.com/300x200?text=Headphones', 'Electronics', 4.6, 42],
  ['3', 'Mechanical Keyboard', 149.99, 'RGB mechanical keyboard with custom switches', 'https://via.placeholder.com/300x200?text=Keyboard', 'Accessories', 4.7, 28],
  ['4', 'USB-C Cable', 19.99, 'High-speed USB-C charging and data cable', 'https://via.placeholder.com/300x200?text=USB+Cable', 'Cables', 4.4, 150],
  ['5', '4K Monitor', 599.99, '27-inch 4K ultra HD monitor', 'https://via.placeholder.com/300x200?text=Monitor', 'Electronics', 4.9, 8],
  ['6', 'Mouse Pad', 29.99, 'Large extended gaming mouse pad', 'https://via.placeholder.com/300x200?text=Mouse+Pad', 'Accessories', 4.3, 60],
];

class ProductRepository {
  constructor(databaseConfig) {
    this.pool = new Pool(databaseConfig);
  }

  async initialize() {
    await this.pool.query(`
      CREATE TABLE IF NOT EXISTS products (
        id VARCHAR(64) PRIMARY KEY,
        name VARCHAR(200) NOT NULL,
        price NUMERIC(12, 2) NOT NULL CHECK (price >= 0),
        description TEXT NOT NULL,
        image TEXT NOT NULL,
        category VARCHAR(120) NOT NULL,
        rating NUMERIC(2, 1) NOT NULL CHECK (rating >= 0 AND rating <= 5),
        stock INTEGER NOT NULL CHECK (stock >= 0)
      )
    `);

    await this.pool.query(`
      INSERT INTO products (id, name, price, description, image, category, rating, stock)
      VALUES ${DEFAULT_PRODUCTS.map((_, index) => `($${index * 8 + 1}, $${index * 8 + 2}, $${index * 8 + 3}, $${index * 8 + 4}, $${index * 8 + 5}, $${index * 8 + 6}, $${index * 8 + 7}, $${index * 8 + 8})`).join(', ')}
      ON CONFLICT (id) DO NOTHING
    `, DEFAULT_PRODUCTS.flat());
  }

  async findAll() {
    const result = await this.pool.query('SELECT * FROM products ORDER BY id');
    return result.rows.map(row => this.mapRow(row));
  }

  async findById(id) {
    const result = await this.pool.query('SELECT * FROM products WHERE id = $1', [id]);
    return this.mapRow(result.rows[0]);
  }

  mapRow(row) {
    if (!row) {
      return undefined;
    }

    return {
      id: row.id,
      name: row.name,
      price: Number(row.price),
      description: row.description,
      image: row.image,
      category: row.category,
      rating: Number(row.rating),
      stock: row.stock,
    };
  }
}

module.exports = { ProductRepository };
