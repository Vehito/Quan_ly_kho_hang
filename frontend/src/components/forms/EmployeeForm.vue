<template>
    <div class="form-container">
        <Form @submit="submitEmployee" 
            :validation-schema="{
                schema: getValidationSchema,
                context: { isNew: !props.employee?.id }
            }"
        >
            <div class="row">
                <div class="col-12 col-md-6">
                    <div
                        v-for="field in leftFields"
                        :key="field.name"
                        class="form-group"
                    >
                        <FormFields
                            :label="field.label"
                            :type="field.type"
                            :options="field.options"
                            :model-value="field.modelValue ?? ''"
                            :name="field.name"
                            :placeholder="field.placeholder"
                            @update:model-value="field.updateModelValue"
                        />
                        <ErrorMessage :name="field.name" class="error-feedback" />
                    </div>
                </div>
                <div class="col-12 col-md-6">
                    <div
                        v-for="field in rightFields"
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
                <button class="btn btn-primary" type="submit">
                    Lưu
                </button>
                <button
                    v-if="localEmployee.id"
                    class="btn btn-danger ml-2"
                    type="button"
                    @click="deleteEmployee"
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
import { Employee } from '@/models/employees.model.js';
import router from '@/router/index.js';
import date_helperUtil from '@/utils/date_helper.util';

const props = defineProps({
    employee: { type: Employee, required: false },
    positions: { type: Array, required: true }
});

const emits = defineEmits(['submit:employee', 'delete:employee']);

let localEmployee = props.employee ?? Employee.getEmptyObject();
let confirmPassword = '';
const isNew = props.employee

const fields = [
    { 
        label: 'Tên nhân viên:',
        modelValue: localEmployee.name,
        placeholder: "Nhập tên nhân viên",
        name: "name",
        updateModelValue: (value) => {
            localEmployee.name = value;
        }
    },
    { 
        label: 'Vị trí:',
        type: "select",
        modelValue: localEmployee.position_id,
        placeholder: 'Chọn vị trí',
        options: props.positions,
        name: "position_id",
        updateModelValue: (value) => {
            localEmployee.position_id = value;
        }
    },
    {
        label: 'Sinh nhật nhân viên:',
        type: 'date',
        modelValue: date_helperUtil.getModelValue(localEmployee.birth),
        placeholder: "Chọn sinh nhật nhân viên",
        name: "birth",
        updateModelValue: (value) => {
            localEmployee.birth = value;
        }
    },
    {
        label: 'Địa chỉ:',
        type: 'textarea',
        modelValue: localEmployee.address,
        placeholder: "Nhập địa chỉ",
        name: "address",
        updateModelValue: (value) => {
            localEmployee.address = value;
        }
    },
    {
        label: 'Số điện thoại:',
        type: 'tel',
        modelValue: localEmployee.phone,
        placeholder: "Nhập số điện thoại",
        name: "phone",
        updateModelValue: (value) => {
            localEmployee.phone = value;
        }
    },
    {
        label: 'Tên đăng nhập:',
        modelValue: localEmployee.username,
        placeholder: "Nhập tên đăng nhập",
        name: "username",
        updateModelValue: (value) => {
            localEmployee.username = value;
        }
    },
]

if(!props.employee) {
    fields.push({
        label: 'Mật khẩu:',
        type: 'password',
        modelValue: localEmployee.password,
        placeholder: "Nhập mật khẩu",
        name: "password",
        updateModelValue: (value) => {
            localEmployee.password = value;
        }
    });
    fields.push({
        label: 'Nhập lại mật khẩu:',
        type: 'password',
        modelValue: confirmPassword,
        placeholder: "Nhập lại mật khẩu",
        name: "confirmPassword",
        updateModelValue: (value) => {
            confirmPassword = value;
        }
    });
}

const leftFields = props.employee ? fields.slice(0, 3) : fields.slice(0, 4);
const rightFields = props.employee ? fields.slice(3, 6) : fields.slice(4, 8);

function getValidationSchema(context) {
    return yup.object().shape({
        name: yup
            .string()
            .required("Tên phải có giá trị")
            .min(2, "Tên phải có ít nhất 2 ký tự")
            .max(50, "Tên có nhiều nhất 50 ký tự"),
        birth: yup
            .date()
            .required("Sinh nhật phải có giá trị")
            .typeError("Sai định dạng"),
        phone: yup
            .number()
            .typeError("Số điện thoại phải là số")
            .required("Nhà sản xuất phải có giá trị")
            .test("len", "Số điện thoại phải có đúng 10 chữ số", 
                val => val && val.toString().length === 9),
        username: yup
            .string()
            .required("Tên đăng nhập phải có giá trị")
            .min(2, "Tên đăng nhập phải có ít nhất 2 ký tự")
            .max(50, "Tên đăng nhập có nhiều nhất 50 ký tự"),
        password: yup.string().when('$isNew', {
            is: true,
            then: schema => 
                schema.required("Mật khẩu phải có giá trị")
                    .min(8, "Mật khẩu phải có ít nhất 8 ký tự")
                    .max(50, "Mật khẩu có nhiều nhất 50 ký tự"),
            otherwise: schema => schema.notRequired()
        }),
        confirmPassword: yup.string().when('$isNew', {
            is: true,
            then: schema =>
                schema.required("Mật khẩu phải có giá trị")
                    .min(8, "Mật khẩu phải có ít nhất 8 ký tự")
                    .max(50, "Mật khẩu có nhiều nhất 50 ký tự")
                    .test("confirmPassword", "Mật khẩu nhập lại không trùng khớp",
                        val => val === localEmployee.password),
            otherwise: schema => schema.notRequired()
        }),
    });
}

function submitEmployee() {
    emits('submit:employee', localEmployee);
}

function deleteEmployee() {
    emits('delete:employee', props.employee.id);
}

function cancel() {
    const reply = window.confirm('You have unsaved changes! Do you wanna leave?');
    if(!reply) {
        return false;
    } else {
        router.push({ name: 'employees' });
    }
}
</script>

<style>
@import "@/assets/form.css";
</style>