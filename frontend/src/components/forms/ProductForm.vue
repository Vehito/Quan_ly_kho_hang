<template>
    <div class="form-container">
        <Form @submit="submitProduct" :validation-schema="validationSchema">
            <div
                v-for="field in fields"
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

const fields = [
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
        label: 'Nhà sản xuất:',
        modelValue: localProduct.manufacturer,
        placeholder: "Nhập tên nhà sản xuất",
        name: "manufacturer",
        updateModelValue: (value) => {
            localProduct.manufacturer = value;
        }
    }
]

const validationSchema = yup.object().shape({
    name: yup
        .string()
        .required("Tên phải có giá trị")
        .min(2, "Tên phải có ít nhất 2 ký tự")
        .max(50, "Tên có nhiều nhất 100 ký tự"),
    sale_price: yup
        .number()
        .required("Giá phải có giá trị")
        .min(1000, "Giá ít nhất 1.000đ")
        .max(9999999, "Giá cao nhất 9.999.999đ"),
    manufacturer: yup
        .string()
        .required("Nhà sản xuất phải có giá trị")
        .min(2, "Nhà sản xuất ít nhất 2 ký tự")
        .max(100, "Nhà sản xuất cao nhất 100 ký tự"),
});

function submitProduct() {
    emits('submit:product', localProduct);
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