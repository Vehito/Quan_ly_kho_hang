import ApiError from "../api-error.js";
import jwt from "jsonwebtoken";
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
                { id: user.id, name: user.name, 
                position_name: user.position_name, level: user.level },
                process.env.SECRET,
                { expiresIn: '60m' });
            const refreshToken = jwt.sign(
                {id: user.id}, process.env.SECRET,
                { expiresIn: '7d' });
            res.cookie('token', token, {
                httpOnly: true,
                sameSite: 'Strict',
                maxAge: 60 * 60 * 1000 // 60 phút
            });

            res.cookie('refreshToken', refreshToken, {
                httpOnly: true,
                sameSite: 'Strict',
                maxAge: 7 * 24 * 60 * 60 * 1000 // 7 ngày
            });
            res.status(200).json({ success: true, user });
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

export function logout(req, res, next) {
    res.clearCookie('token', {
        httpOnly: true,
        sameSite: 'Strict'
    });
    res.clearCookie('refreshToken', {
        httpOnly: true,
        sameSite: 'Strict'
    });

    return res.status(200).json({ success: true });
}

export function refreshToken(req, res, next) {
    const refreshToken = req.cookies.refreshToken;
    if(!refreshToken) {
        return next(
            new ApiError(500, `There's no refresh token`)
        );
    }

    jwt.verify(refreshToken, REFRESH_SECRET, (err, decoded) => {
        if (err) {
            return res.status(403).json({ message: 'Invalid refresh token' });
        }

        const newAccessToken = jwt.sign(
            { id: decoded.id, name: decoded.name, 
                position_name: decoded.position_name, level: decoded.level },
            process.env.SECRET,
            { expiresIn: '15m' }
        );

        // Gắn access token mới vào cookie
        res.cookie('token', newAccessToken, {
            httpOnly: true,
            sameSite: 'Strict',
            maxAge: 15 * 60 * 1000 // 15 phút
        });

        return res.sendStatus(200); // hoặc res.json(...) nếu frontend cần
    });
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