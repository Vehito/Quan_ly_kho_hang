import Model from "@/models/model";
import ErrorAlert from "@/utils/error_alert.util";

class Controller {
    constructor(
        model = new Model(),
    ) {
        this.model = model
    }

    async insert(data) {
        try {
            return await this.model.insert(data);
        } catch (error) {
            throw new ErrorAlert(error.status, error.response.data.message);
        }
    }

    async queryById(id, filter = {}) {
        try {
            return await this.model.queryById(Number(id), filter);
        } catch (error) {
            throw new ErrorAlert(error.status, error.response.data.message);
        }
    }

    async queryAll(filter = {}) {
        try {
            return await this.model.queryAll(filter);
        } catch (error) {
            throw new ErrorAlert(error.status, error.response.data.message);
        }
    }

    async queryCount(filter = {}) {
        try {
            filter.itemLength = true;
            return await this.model.queryCount(filter);
        } catch (error) {
            throw new ErrorAlert(error.status, error.response.data.message);
        }
    }

    async update(id, data) {
        try {
            return await this.model.update(id, data);
        } catch (error) {
            throw new ErrorAlert(error.status, error.response.data.message);
        }
    }

    async delete(id) {
        try {
            return await this.model.delete(id);
        } catch (error) {
            throw new ErrorAlert(error.status, error.response.data.message);
        }
    }

    deleteAttribute(data, nameAttribute = []) {
        nameAttribute.forEach((attr) => {
            delete data[attr];
        });
        return data;
    }
}

export default Controller;