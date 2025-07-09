import express from "express";
import * as employees from "../controllers/employees.controller.js";

const route = express.Router();

route.route("/")
    .post(employees.login);

export default route;