import express from "express";
import * as employees from "../controllers/employees.controller.js";

const route = express.Router();

route.route("/")
    .get(employees.query)
    .post(employees.insert);

route.route("/:id")
    .get(employees.query)
    .put(employees.update)
    .patch(employees.changePassword)
    .delete(employees.remove);

export default route;