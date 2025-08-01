<template>
    <div class="form-container">
        <Form @submit="submitLogin"
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
                    :placeholder="field.placeholder"
                    @update:model-value="field.updateModelValue"

                />
                <ErrorMessage :name="field.name" class="error-feedback" />
            </div>
            <div class="form-group">
                <button class="btn btn-block btn-primary" type="submit">
                    Đăng nhập
                </button>
            </div>
        </Form>
    </div>
</template>

<script setup>
import * as yup from 'yup';
import FormFields from './FormFields.vue';
import { Form, ErrorMessage } from 'vee-validate';

const emits = defineEmits(['submit:login']);

const loginInfo = {
    username: 'nguyen123',
    password: 'abcde12345'
};

const fields = [
    { 
        label: 'Tên đăng nhập:',
        modelValue: 'nguyen123',
        placeholder: "Nhập tên đăng nhập",
        name: "username",
        updateModelValue: (value) => {
            loginInfo.username = value;
        }
    },
    {
        label: 'Mật khẩu:',
        modelValue: 'abcde12345',
        placeholder: "Nhập mật khẩu",
        type: 'password',
        name: "password",
        updateModelValue: (value) => {
            loginInfo.password = value;
        }
    },
]

const validationSchema = yup.object().shape({
        username: yup
            .string()
            .required("Tên đăng nhập phải có giá trị")
            .min(2, "Tên đăng nhập phải có ít nhất 2 ký tự")
            .max(50, "Tên đăng nhập có nhiều nhất 100 ký tự"),
        password: yup
            .string()
            .required("Mật khẩu không được để trống")
            .min(8, "Mật khẩu phải có ít nhất 8 ký tự")
            .max(50, "Mật khẩu có nhiều nhất 50 ký tự"),
});

function submitLogin() {
    emits('submit:login', loginInfo);
}
</script>

<style>
@import "@/assets/form.css";
</style>