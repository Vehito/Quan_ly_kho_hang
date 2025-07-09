import ApiError from "../api-error.js";
import * as jwt from 'jsonwebtoken';
import EmployeesService from "../services/employees.service.js";
import * as sharedController from "./controller.shared.js";
import dotenv from "dotenv";
dotenv.config();

export async function insert(req, res, next) {
    sharedController.isValid(
        req.body, 
        ['name', 'position_id', 'birth', 'phone', 'username', 'password', 'address'],
        'employee'
    );
    try {
        const result = await sharedController
        .withTransaction(async (conn) => {
            const employeeService = new EmployeesService();
            return await employeeService.insert(req.body, conn);
        });
        return res.send(result);
    } catch (error) {
        return next(
            new ApiError(500, `An error occured while inserting the employee: ${error}`)
        )
    }
}

export async function query(req, res, next) {
    let result = [];
    try {
        result = await sharedController
            .withTransaction(async (conn) => {
                const employeeService = new EmployeesService();
                if(req.params) {
                    return await employeeService.query(req.params, conn);
                } else {
                    return await employeeService.query(req.query, conn);
                }
            });
        return res.send(result);
    } catch (error) {
        return next(
            new ApiError(500, `An error occured while querying the employee: ${error}`)
        );
    }
}

export async function update(req, res, next) {
    if(req.body.password) {
        return next(new ApiError(400, "Invalid Request"));
    }
    let result = [];
    try {
        result = await sharedController
            .withTransaction(async (conn) => {
                const employeeService = new EmployeesService();
                return await employeeService.update(req.params.id, req.body, conn);
            });
        return res.send(result);
    } catch (error) {
        return next(
            new ApiError(500, `An error occured while updating the employee: ${error}`)
        );
    }
}

export async function remove(req, res, next) {
    let result = [];
    try {
        result = await sharedController
        .withTransaction(async (conn) => {
            const employeeService = new EmployeesService();
            return await employeeService.delete(req.params.id, conn);
        });
        return res.send(result);
    } catch (error) {
        return next(
            new ApiError(500, `An error occured while removing the employee: ${error}`)
        )
    }
}

export async function login(req, res, next) {
    sharedController.isValid(req.body, ['username', 'password'], 'user');
    try {
        const isValid = await sharedController
        .withTransaction(async (conn) => {
            const employeeService = new EmployeesService();
            return await employeeService
                .vertifyEmployee(req.body.username, req.body.password, conn);
        });
        if(isValid) {
            const user = await sharedController
            .withTransaction(async (conn) => {
                const employeeService = new EmployeesService();
                return (await employeeService.query(req.body, conn))[0];
            });
            const token = jwt.sign(
                { id: user.id, level: user.level },
                process.env.SECRET,
                { expiresIn: '15m' });
            const refreshToken = jwt.sign(
                {id: user.id}, process.env.SECRET,
                { expiresIn: '7d' });
            return res.send({ token, refreshToken })
        } else {
            return next(
                new ApiError(400, 'Sai thông tin đăng nhập')
            );
        }
    } catch (error) {
        return next(
            new ApiError(500, `An error occured while vertifying the employee: ${error}`)
        )
    }
}

export async function changePassword(req, res, next) {
    if(!req.body.password) {
        return next(new ApiError(400, 'Invalid Request'));
    }
    let result;
    try {
        result = await sharedController
        .withTransaction(async (conn) => {
            const employeeService = new EmployeesService();
            return await employeeService.changePassword(req.params.id, req.body.password, conn);
        });
        return res.send(result);
    } catch (error) {
        return next(
            new ApiError(500, `An error occured while changing password: ${error}`)
        );
    }
}