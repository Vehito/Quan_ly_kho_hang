import express from "express";
import * as customers from "../controllers/customers.controller.js";

const route = express.Router();

route.route("/")
    .get(customers.query)
    .post(customers.insert);

route.route("/:id")
    .get(customers.query)
    .put(customers.update)
    .delete(customers.remove);

export default route;