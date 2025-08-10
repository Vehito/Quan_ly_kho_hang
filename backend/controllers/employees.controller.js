import ApiError from "../api-error.js";
import jwt from "jsonwebtoken";
import EmployeesService from "../services/employees.service.js";
import * as sharedController from "./controller.shared.js";
import dotenv from "dotenv";
dotenv.config();

export async function insert(req, res, next) {
    sharedController.isValid(
        req.body, 
        ['name', 'department_id', 'birth', 'phone', 'position',
            ...(req.body.position === 'Admin' ? ['username', 'password'] : []),
            'address'],
        'employee');
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
                return (await employeeService.query({username: req.body.username}, conn))[0];
            });
            const token = jwt.sign(
            {
                id: user.id, name: user.name, 
                department_name: user.department_name, 
                username: user.username, position: user.position,
            },
                process.env.SECRET,
                { expiresIn: '8h' });
            const refreshToken = jwt.sign(
                {id: user.id}, process.env.SECRET,
                { expiresIn: '7d' });
            res.cookie('token', token, {
                httpOnly: true,
                sameSite: 'Strict',
                maxAge: 8 * 60 * 60 * 1000 // 8h
            });

            res.cookie('refreshToken', refreshToken, {
                httpOnly: true,
                sameSite: 'Strict',
                maxAge: 7 * 24 * 60 * 60 * 1000 // 7 ngày
            });
            user.ttl =  8 * 60 * 60 * 1000;
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
                department_name: decoded.department_name,
                username: decoded.username },
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
    let result;
    try {
        result = await sharedController
        .withTransaction(async (conn) => {
            const employeeService = new EmployeesService();
            const isValid = await employeeService.vertifyEmployee(req.body.username, req.body.old_password, conn);
            if(isValid) {
                const result = await employeeService.changePassword(req.params.id, req.body.new_password, conn);
                if(result[0].changedRows === 1) {
                    return true;
                }
                throw new ApiError(400, 'Invalid request');;
            } else {
                throw new ApiError(400, 'Invalid input');
            }
        });
        return res.send(result);
    } catch (error) {
        return next(
            new ApiError(500, `An error occured while changing password: ${error}`)
        );
    }
}