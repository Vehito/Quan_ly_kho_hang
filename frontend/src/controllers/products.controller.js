import productsModel from "@/models/products.model";
import Controller from "./controller";
import date_helperUtil from "@/utils/date_helper.util";

class ProductsController extends Controller {
    constructor() {
        super(productsModel);
    }
    
    async update(id, data) {
        data.created_at = date_helperUtil.formatDateForMySQL(data.created_at);
        const editedData = super.deleteAttribute(data, ['formatted_sale_price']);
        return await super.update(id, editedData);
    }
}

export default new ProductsController();