import express from "express";
import * as departments from "../controllers/departments.controller.js";

const route = express.Router();

route.route("/")
    .get(departments.query)
    .post(departments.insert);

route.route("/:id")
    .get(departments.query)
    .put(departments.update)
    .delete(departments.remove);

export default route;