import MySQL from "../utils/mysql.util.js";

class ProductService {
    constructor() {
        this.tableName = "products"
    }

    #extractProductData(payload) {
        const product = {
            id: payload.id,
            name: payload.name,
            salePrice: payload.salePrice,
            manufacturer: payload.manufacturer,
            quantity: payload.quantity ?? 0,
            createAt: payload.createAt ?? new Date(),
        };
        Object.keys(product).forEach(
            (key) => product[key] === undefined && delete product[key]
        );
        return product;
    }

    #getQueryArrClauses(filter) {
        const clauses = [];
        const values = [];

        Object.entries(filter).forEach(([key, arr]) => {
            if(Array.isArray(arr) && arr.length > 0) {
                clauses.push(`${key} IN (${arr.map(() => '?').join(', ')})`);
                values.push(...arr);
            }
        });
        return {
            clauses: clauses.join(' AND '),
            values
        };
    }

    #getQueryClauses(filter) {
        const clauses = [];
        const values = [];

        Object.entries(filter).forEach(([key, val]) => {
            clauses.push(`${key} = ?`);
            values.push(val);
        });
        return {
            clauses: clauses.join(' AND '),
            values
        };
    }

    #getUpdateClauses(payload) {
        const clauses = [];
        const values = [];
        Object.entries(payload).forEach(([key, val]) => {
            clauses.push(`${key} = ?`);
            values.push(val);
        });
        return {
            clauses: clauses.join(', '),
            values: values
        }
    }

    async insert(payload) {
        const product = this.#extractProductData(payload);
        const pool = MySQL.getPool();
        const [result] = await pool.query(
            `INSERT INTO ${this.tableName} (name, salePrice, manufacturer, quantity, createdAt)
            VALUES (?, ?, ?, ?, ?)`,
            [product.name, product.salePrice, product.manufacturer, product.quantity, product.createAt]
        )
        return {
            id: result.insertId,
            ...result,
        }
    }

    async query(filter) {
        const pool = MySQL.getPool();
        const {clauses, values} = this.#getQueryClauses(filter);
        let query = `SELECT * FROM ${this.tableName}`;
        if(clauses) {
            query +=   ` WHERE ${clauses}`;
        }
        const [rows] = await pool.query(query, values);
        return rows;
    }

    async queryArr(filter = {}) {
        const pool = MySQL.getPool();
        const {clauses, values} = this.#getQueryArrClauses(filter);
        let query = `SELECT * FROM ${this.tableName}`;
        if(clauses) {
            query += ` WHERE ${clauses}`;
        }
        const [rows] = await pool.query(query, values);
        return rows;
    }

    async update(id, payload) {
        const pool = MySQL.getPool();
        const {clauses, values} = this.#getUpdateClauses(payload);
        values.push(id);
        const update = `UPDATE ${this.tableName} SET ${clauses} WHERE id = ?`;
        const [result] = await pool.query(update, values);
        return result;
    }

    async delete(id) {
        const pool = MySQL.getPool();
        const deleteQuery = `DELETE FROM ${this.tableName} WHERE id = ?`;
        const [result] = await pool.query(deleteQuery, id);
        return result;
    }
}

export default ProductService;