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

    async logout() {
        const data = (await this.api.get('/logout')).data;
        return data.success;
    }

    async refreshToken() {
        const data = (await this.api.post(`${this.refreshTokenURL}`)).data;
        return data;
    }
    async changePassword(id, username, oldPwd, newPwd) {
        const data = (await this.api.post(`/change_password/${id}`, {username: username, old_password: oldPwd, new_password: newPwd})).data;
        return data;
    }
}

export default new AuthModel();