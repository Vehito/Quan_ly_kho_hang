import express from "express";
import * as suppliers from "../controllers/suppliers.controller.js";

const route = express.Router();

route.route("/")
    .get(suppliers.query)
    .post(suppliers.insert);

route.route("/:id")
    .get(suppliers.query)
    .put(suppliers.update)
    .delete(suppliers.remove);

export default route;