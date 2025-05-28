import Model from "@/models/model";
import ErrorAlert from "@/utils/error_alert.util";

class Controller {
    #model;
    // required: [{name: "", type: ""}], unrequired: [{name: "", type: ""}]
    // #requiredFields;
    // #unrequiredFields;
    constructor(
        model = new Model(),
        // requiredFields = [{}],
        // unrequiredFields = [{}]
    ) {
        this.#model = model
        // this.#requiredFields = requiredFields,
        // this.#unrequiredFields = unrequiredFields;
    }

    // isValidField(data = {}, fields = [{}]) {
    //     for(const field of fields) {
    //         const {name, type} = field;
    //         const value = data[name];

    //     }
    // }

    // isValidFilter(data = {}, statusCode = 500, message = "Invalid data") {
    //     throw new ErrorAlert(statusCode, message);
    // }

    // isValidData(data = {}, statusCode = 500, message = "Invalid data") {
    //     if(data) {
    //         return;
    //     }
    //     throw new ErrorAlert(statusCode, message);
    // }

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