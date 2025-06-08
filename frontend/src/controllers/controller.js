import Model from "@/models/model";
import ErrorAlert from "@/utils/error_alert.util";

class Controller {
    #model;

    constructor(
        model = new Model(),
    ) {
        this.#model = model
    }

    async insert(data) {
        try {
            return await this.#model.insert(data);
        } catch (error) {
            throw new ErrorAlert(error.statusCode, error.message);
        }
    }

    async queryById(id) {
        try {
            return await this.#model.queryById(id);
        } catch (error) {
            throw new ErrorAlert(error.statusCode, error.message);
        }
    }

    async queryAll(filter = {}) {
        try {
            return await this.#model.queryAll(filter);
        } catch (error) {
            throw new ErrorAlert(error.statusCode, error.message);
        }
    }

    async update(id, data) {
        try {
            return await this.#model.update(id, data);
        } catch (error) {
            throw new ErrorAlert(error.statusCode, error.message);
        }
    }

    async delete(id) {
        try {
            return await this.#model.delete(id);
        } catch (error) {
            throw new ErrorAlert(error.statusCode, error.message);
        }
    }
}

export default Controller;