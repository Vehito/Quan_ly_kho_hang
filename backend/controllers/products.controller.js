import ApiError from "../api-error.js";
import ProductService from "../services/products.service.js";
import * as sharedController from "./controller.shared.js";
import multer from "multer";
import path from 'path';
import fs from 'fs/promises';

export async function insert(req, res, next) {
    sharedController.isValid(req.body, ['name', 'manufacturer', 'sale_price'], 'product');
    try {
        const result = await sharedController
        .withTransaction(async (conn) => {
            const productService = new ProductService();
            return await productService.insert(req.body, conn);
        });
        if(req.body.img_name) {
            const imgName = req.body.img_name;
            const tempPath = path.join('public', 'imgs' ,'temp_uploads', imgName);
            const finalPath = path.join('public', 'imgs', 'product', imgName);

            try {
                await fs.rename(tempPath, finalPath);
            } catch (error) {
                console.error(error);
                throw new ApiError(500, 'Không thể lưu ảnh');
            }
        }
        return res.send(result);
    } catch (error) {
        if (req.body.img_name) {
            const tempPath = path.join('public', 'imgs', 'temp_uploads', req.body.img_name);
            try {
                await fs.unlink(tempPath); // Xóa ảnh tạm
                console.log(`Đã xóa ảnh tạm: ${tempPath}`);
            } catch (unlinkErr) {
                console.error(`Không thể xóa ảnh tạm: ${unlinkErr.message}`);
            }
        }
        return next(
            new ApiError(500, `An error occured while inserting the product: ${error}`)
        );
    }
}

export async function query(req, res, next) {
    let result = [];
    try {
        result = await sharedController
            .withTransaction(async (conn) => {
                const productService = new ProductService();
                if(req.params?.id) {
                    return await productService.query(req.params, conn);
                } else if(req.query?.itemLength) {
                    return await productService.queryCount(req.query, conn);
                } else {
                    return await productService.query(req.query, conn);
                }
            });
        return res.send(result);
    } catch (error) {
        return next(
            new ApiError(500, `An error occured while querying the product: ${error}`)
        );
    }
}

export async function update(req, res, next) {
    let result = [];
    const {img, ...filter} = req.body;
    try {
        result = await sharedController
            .withTransaction(async (conn) => {
                const productService = new ProductService();
                return await productService.update(req.params.id, filter, conn);
            });
            if(img!=='undefined' && img!==undefined) {
            const imgName = req.body.img_name;
            const tempPath = path.join('public', 'imgs' ,'temp_uploads', imgName);
            const finalPath = path.join('public', 'imgs', 'product', imgName);

            try {
                await fs.rename(tempPath, finalPath);
            } catch (error) {
                console.error(error);
                throw new ApiError(500, 'Không thể lưu ảnh');
            }
        }
        return res.send(result);
    } catch (error) {
        if(img) {
            const tempPath = path.join('public', 'imgs', 'temp_uploads', req.body.img_name);
            try {
                await fs.unlink(tempPath); // Xóa ảnh tạm
                console.log(`Đã xóa ảnh tạm: ${tempPath}`);
            } catch (unlinkErr) {
                console.error(`Không thể xóa ảnh tạm: ${unlinkErr.message}`);
            }
        }
        return next(
            new ApiError(500, `An error occured while updating the product: ${error}`)
        );
    }
}

export async function remove(req, res, next) {
    let result = [];
    try {
        result = await sharedController
        .withTransaction(async (conn) => {
            const productService = new ProductService();
            return await productService.delete(req.params.id, conn);
        });
        return res.send(result);
    } catch (error) {
        return next(
            new ApiError(500, `An error occured while removing the product: ${error}`)
        )
    }
}