import express from "express";
import * as employees from "../controllers/employees.controller.js";

const route = express.Router();

route.route("/")
    .post(employees.login);

route.route("/logout")
    .get(employees.logout);

route.route("/refresh")
    .post(employees.refreshToken);

route.route("/change_password/:id")
    .post(employees.changePassword)

export default route;