<template>
    <div class="form-container mt-5">
        <Form @submit="submitForm" :validation-schema="validationSchema">
            <div class="row">
                <div class="col-12 col-md-6">
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
                </div>
            </div>
            <div class="form-group">
                <button class="btn btn-block btn-outline-primary" type="submit">
                    Lưu
                </button>
            </div>
        </Form>
    </div>
</template>

<script setup>
import FormFields from './FormFields.vue';
import { Form, ErrorMessage } from 'vee-validate';
import * as yup from 'yup';

const props = defineProps({
    id: { type: String, required: true }
});
const emits = defineEmits(['submit']);

const localData = {
    old_password: '',
    new_password: '',
}

const fields = [
    {
        label: 'Mật khẩu cũ:',
        type: 'password',
        modelValue: localData.old_password,
        placeholder: "Nhập mật khẩu cũ",
        name: "old_password",
        updateModelValue: (value) => {
            localData.old_password = value;
        }
    },
    {
        label: 'Mật khẩu mới:',
        type: 'password',
        modelValue: localData.new_password,
        placeholder: "Nhập mật khẩu mới",
        name: "new_password",
        updateModelValue: (value) => {
            localData.new_password = value;
        }
    }
];

const validationSchema = yup.object().shape({
    old_password: yup.string()
            .required("Mật khẩu cũ phải có giá trị")
            .min(8, "Mật khẩu cũ phải có ít nhất 8 ký tự")
            .max(50, "Mật khẩu cũ có nhiều nhất 50 ký tự"),
    new_password: yup.string()
            .required("Mật khẩu mới phải có giá trị")
            .min(8, "Mật khẩu mới phải có ít nhất 8 ký tự")
            .max(50, "Mật khẩu mới có nhiều nhất 50 ký tự")
            .test("same_pwd", "Mật khẩu mới ko được giống mật khẩu cũ",
                    val => val !== localData.old_password),
});

function submitForm() {
    emits('submit', localData);
}
</script>