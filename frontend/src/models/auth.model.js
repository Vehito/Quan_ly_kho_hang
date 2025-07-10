import { default as Model } from "./model";

class AuthModel extends Model {
    constructor() {
        super('/api/auth');
        this.refreshTokenURL = '/refresh';
    }

    async login(info) {
        const data = (await this.api.post('/', info)).data;
        return data;
    }

    async refreshToken() {
        const data = (await this.api.post(`${this.refreshTokenURL}`)).data;
        return data;
    }
}

export default new AuthModel();