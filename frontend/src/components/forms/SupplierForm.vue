<template>
    <div class="form-container">
        <Form @submit="submitSupplier" 
            :validation-schema="validationSchema"
        >
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
                    :options="field.options"
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
                    v-if="localSupplier.id"
                    class="btn btn-danger ml-2"
                    type="button"
                    @click="deleteSupplier"
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
import { Supplier } from '@/models/suppliers.model.js';
import router from '@/router/index.js';

const props = defineProps({
    supplier: { type: Supplier, required: false }
});

const emits = defineEmits(['submit:supplier', 'delete:supplier']);

let localSupplier = props.supplier ?? Supplier.getEmptyObject();

const fields = [
    { 
        label: 'Tên nhà cung cấp:',
        modelValue: localSupplier.name,
        placeholder: "Nhập tên nhà cung cấp",
        name: "name",
        updateModelValue: (value) => {
            localSupplier.name = value;
        }
    },
    {
        label: 'Địa chỉ nhà cung cấp:',
        type: 'textarea',
        modelValue: localSupplier.address,
        placeholder: "Nhập địa chỉ",
        name: "address",
        updateModelValue: (value) => {
            localSupplier.address = value;
        }
    },
    { 
        label: 'Số điện thoại:',
        type: 'tel',
        modelValue: localSupplier.phone,
        placeholder: "Nhập số điện thoại",
        name: "phone",
        updateModelValue: (value) => {
            localSupplier.phone = value;
        }
    },
    { 
        label: 'Mô tả:',
        type: 'textarea',
        modelValue: localSupplier.description,
        placeholder: "Nhập mô tả",
        name: "description",
        updateModelValue: (value) => {
            localSupplier.description = value;
        }
    },
]

const validationSchema = yup.object().shape({
        name: yup
            .string()
            .required("Tên phải có giá trị")
            .min(2, "Tên phải có ít nhất 2 ký tự")
            .max(50, "Tên có nhiều nhất 100 ký tự"),
        address: yup
            .string()
            .required("Địa chỉ phải có giá trị")
            .min(2, "Địa chỉ ít nhất 2 ký tự")
            .max(100, "Địa chỉ cao nhất 100 ký tự"),
        phone: yup
            .number()
            .typeError("Số điện thoại phải là số")
            .required("Số điện thoại phải có giá trị")
            .test("len", "Số điện thoại phải có đúng 10 chữ số", 
                val => val && val.toString().length === 9),
        description: yup
            .string()
            .notRequired()
            .max(100, "Mô tả tối đa 100 ký tự"),
});

function submitSupplier() {
    emits('submit:supplier', localSupplier);
}

function deleteSupplier() {
    emits('delete:supplier', props.supplier.id);
}

function cancel() {
    const reply = window.confirm('You have unsaved changes! Do you wanna leave?');
    if(!reply) {
        return false;
    } else {
        router.push({ name: 'suppliers' });
    }
}
</script>

<style>
@import "@/assets/form.css";
</style>