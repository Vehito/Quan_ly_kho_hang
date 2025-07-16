import { default as axios } from "axios"

class Model {
    api;
    constructor(baseURL) {
        this.api = axios.create({
            baseURL,
            withCredentials: true,
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
        const data = (await this.api.get(`/${id}`, { params: filter })).data;
        if(data.length > 1) {
            return Array.isArray(data) 
                ? data.map((item) => this.createIntance(item)) : [];
        }
        return this.createIntance(data[0]);
    }

    async queryAll(filter = {}) {
        const data = (await this.api.get(`/`, {params: filter})).data;
        return Array.isArray(data) 
            ? data.map((item) => this.createIntance(item)) : [];
    }

    async queryCount(filter = {}, extend = '') {
        const data = (await this.api.get(`/${extend}`, {params: {itemLength: true, ...filter}})).data;
        return data;
    }

    async insert(data, extend = '') {
        return (await this.api.post(`/${extend}`, data)).data;
    }

    async update(id, data) {
        return (await this.api.put(`/${id}`, data)).data;
    }

    async delete(id) {
        return (await this.api.delete(`/${id}`)).data;
    }
}

export default Model;