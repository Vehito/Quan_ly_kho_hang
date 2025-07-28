import express from "express";
import * as products from "../controllers/products.controller.js";
import { upload } from "../utils/multer.util.js";

const route = express.Router();

route.route("/")
    .get(products.query)
    .post(upload.single('img') , products.insert);

route.route("/:id")
    .get(products.query)
    .put(upload.single('img'), products.update)
    .delete(products.remove);

export default route;