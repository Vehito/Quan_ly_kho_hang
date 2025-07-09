import express from "express";
import * as employees from "../controllers/employees.controller.js";

const route = express.Router();

route.route("/")
    .post(employees.login);

route.route("/refresh")
    .post(employees.refreshToken);

export default route;