import authModel from "@/models/auth.model";
import { default as Controller } from "./controller";
import ErrorAlert from "@/utils/error_alert.util";

class AuthController extends Controller {
    constructor() {
        super(authModel);
    }

    async login(info) {
        try {
            return (await this.model.login(info));
        } catch (error) {
            throw new ErrorAlert(error.status, error.response.data.message);
        }
    }
    
    async logout() {
        try {
            return (await this.model.logout());
        } catch (error) {
            throw new ErrorAlert(error.status, error.response.data.message);
        }
    }

    async refreshToken() {
        try {
            return (await this.model.refreshToken());
        } catch (error) {
            throw new ErrorAlert(error.status, error.response.data.message);
        }
    }
}

export default new AuthController();