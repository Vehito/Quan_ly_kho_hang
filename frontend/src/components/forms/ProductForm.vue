<template>
    <div class="form-container">
        <Form @submit="submitProduct" :validation-schema="validationSchema">
            <div class="row justify-content-center">
                <div class="col-lg-6 col-12">
                    <div
                        v-for="field in leftFields"
                        :key="field.name"
                        class="form-group"
                    >
                        <FormFields 
                            :label="field.label"
                            :type="field.type"
                            :model-value="field.modelValue ?? ''"
                            :name="field.name"
                            :placeholder="field.placeholder"
                            @update:model-value="field.updateModelValue"
    
                        />
                        <ErrorMessage :name="field.name" class="error-feedback" />
                    </div>
                </div>
                <div class="col-lg-6 col-12">
                    <div
                        v-for="field in rightFields"
                        :key="field.name"
                        class="form-group"
                    >
                        <FormFields 
                            :label="field.label"
                            :type="field.type"
                            :model-value="field.modelValue ?? ''"
                            :options="field.options"
                            :name="field.name"
                            :placeholder="field.placeholder"
                            @update:model-value="field.updateModelValue"
    
                        />
                        <ErrorMessage :name="field.name" class="error-feedback" />
                    </div>
                </div>
            </div>
            <div class="form-group">
                <button class="btn btn-primary" type="submit">
                    Lưu
                </button>
                <button
                    v-if="localProduct.id"
                    class="btn btn-danger ml-2"
                    type="button"
                    @click="deleteProduct"
                >
                    Xóa
                </button>
                <button
                    class="btn btn-warning ml-2"
                    type="button"
                    @click="cancel"
                >
                    Thoát
                </button>
            </div>
        </Form>
    </div>
</template>

<script setup>
import * as yup from 'yup';
import FormFields from './FormFields.vue';
import { Form, ErrorMessage } from 'vee-validate';
import { Product } from '@/models/products.model.js';
import router from '@/router/index.js';

const props = defineProps({
    product: { type: Product, required: false }
});

const emits = defineEmits(['submit:product', 'delete:product']);

let localProduct = props.product ?? Product.getEmptyObject();
let haveImg = localProduct.img_url ? true : false;
const leftFields = [
    { 
        label: 'Tên sản phẩm:',
        modelValue: localProduct.name,
        placeholder: "Nhập tên sản phẩm",
        name: "name",
        updateModelValue: (value) => {
            localProduct.name = value;
        }
    },
    {
        label: 'Giá bán sản phẩm:',
        type: 'number',
        modelValue: localProduct.sale_price,
        placeholder: "Nhập giá sản phẩm",
        name: "sale_price",
        updateModelValue: (value) => {
            localProduct.sale_price = value;
        }
    },
    {
        label: 'Hình ảnh sản phẩm:',
        type: 'img',
        modelValue: localProduct.img_url,
        placeholder: "Chọn hình ảnh",
        name: "img",
        updateModelValue: (value) => {
            haveImg = false;
            localProduct.img = value;
            localProduct.img_name = value.name;
        }
    },
];
const rightFields = [
    {
        label: 'Nhà sản xuất:',
        modelValue: localProduct.manufacturer,
        placeholder: "Nhập tên nhà sản xuất",
        name: "manufacturer",
        updateModelValue: (value) => {
            localProduct.manufacturer = value;
        }
    },
    { 
        label: 'Loại sản phẩm:',
        modelValue: localProduct.type,
        type: 'select',
        options: Product.types.map(
            (type) => {return {id: type, name: type}}
        ),
        placeholder: "Chọn loại sản phẩm",
        name: "type",
        updateModelValue: (value) => {
            localProduct.type = value;
        }
    },
    {
        label: 'Nguồn gốc:',
        modelValue: localProduct.origin,
        placeholder: "Nhập nguồn gốc",
        name: "origin",
        updateModelValue: (value) => {
            localProduct.origin = value;
        }
    },
    {
        label: 'Đơn vị:',
        type: 'select',
        modelValue: localProduct.unit,
        placeholder: "Chọn đơn vị",
        name: "unit",
        options: Product.units.map(
            (unit) => {return {id: unit, name: unit}}
        ),
        updateModelValue: (value) => {
            localProduct.unit = value;
        }
    },
    {
        label: 'Mô tả:',
        type: 'textarea',
        modelValue: localProduct.description,
        placeholder: "Nhập mô tả",
        name: "description",
        updateModelValue: (value) => {
            localProduct.description = value;
        }
    }
];


const validationSchema = yup.object().shape({
    name: yup
        .string()
        .required("Tên không được trống")
        .min(2, "Tên phải có ít nhất 2 ký tự")
        .max(50, "Tên có nhiều nhất 100 ký tự"),
    sale_price: yup
        .number()
        .required("Giá không được trống")
        .min(1000, "Giá ít nhất 1.000đ")
        .max(9999999, "Giá cao nhất 9.999.999đ"),
    img: yup
        .mixed()
        .required("Ảnh sản phẩm không được trống")
        .test(
            'imgType',
            'Mục được chọn phải là ảnh',
            (value) => {
                if(haveImg) return true;
                if(!localProduct.img) return false;
                return localProduct.img.type.startsWith('image/')
            }
        )
        .test(
            'imgName',
            'Tên ảnh không vượt quá 50 ký tự',
            (value) => {
                if(haveImg) return true;
                if (!localProduct.img) return false;
                return localProduct.img_name.length <= 100;
            }
        ),
    manufacturer: yup
        .string()
        .required("Nhà sản xuất không được trống")
        .min(2, "Nhà sản xuất ít nhất 2 ký tự")
        .max(100, "Nhà sản xuất cao nhất 100 ký tự"),
    type: yup
        .string()
        .required("Loại sản phẩm không được trống"),
    origin: yup
        .string()
        .required("Nguồn gốc không được trống")
        .max(100, "Nguồn gốc cao nhất 100 ký tự"),
    unit: yup
        .string()
        .required("Đơn vị không được trống")
        .max(100, "Đơn vị cao nhất 100 ký tự"),
    description: yup
        .string()
        .notRequired()
        .max(100, "Mô tả cao nhất 100 ký tự"),
});

function submitProduct() {
    const formData = new FormData();

    // Thêm tất cả trường vào formData
    formData.append('name', localProduct.name);
    formData.append('sale_price', localProduct.sale_price);
    formData.append('manufacturer', localProduct.manufacturer);
    formData.append('type', localProduct.type);
    formData.append('origin', localProduct.origin);
    formData.append('unit', localProduct.unit);
    formData.append('description', localProduct.description ?? '');
    formData.append('img', localProduct.img);
    formData.append('img_name', localProduct.img_name);

    emits('submit:product', formData);
}

function deleteProduct() {
    emits('delete:product', props.product.id);
}

function cancel() {
    const reply = window.confirm('You have unsaved changes! Do you wanna leave?');
    if(!reply) {
        return false;
    } else {
        router.push({ name: 'products' });
    }
}
</script>

<style>
@import "@/assets/form.css";
</style>