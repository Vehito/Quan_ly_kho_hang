import { default as axios } from "axios"

class Model {
    #api;
    constructor(baseURL) {
        this.#api = axios.create({
            baseURL,
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json"
            }
        });
    }

    createIntance(data) {
        return data;    
    }

    async queryById(id, filter = {}) {
        const data = (await this.#api.get(`/${id}`, { params: filter })).data[0];
        return this.createIntance(data);
    }

    async queryAll(filter = {}) {
        const data = (await this.#api.get(`/`, {params: filter})).data;
        return Array.isArray(data) 
            ? data.map((item) => this.createIntance(item)) : [];
    }

    async insert(data) {
        return (await this.#api.post("/", data)).data;
    }

    async update(id, data) {
        return (await this.#api.put(`/${id}`, data)).data;
    }

    async delete(id) {
        return (await this.#api.delete(`/${id}`)).data;
    }
}

export default Model;