<template>
    <div class="form-container">
        <Form @submit="submitEmployee" :validation-schema="validationSchema">
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
                            :options="field.options"
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
import { Form, ErrorMessage, } from 'vee-validate';
import { Employee } from '@/models/employees.model.js';
import router from '@/router/index.js';
import date_helperUtil from '@/utils/date_helper.util';
import { ref } from 'vue';

const props = defineProps({
    employee: { type: Employee, required: false },
    departments: { type: Array, required: true }
});

const emits = defineEmits(['submit:employee', 'delete:employee']);

let localEmployee = props.employee ?? Employee.getEmptyObject();
let confirmPassword = '';
const arr_working_days_status = localEmployee.arr_working_days_status;
const isAdmin = ref(localEmployee.position==='Admin');
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
        label: 'Phòng ban:',
        type: "select",
        modelValue: localEmployee.department_id,
        placeholder: 'Chọn phòng ban',
        options: props.departments,
        name: "department_id",
        updateModelValue: (value) => {
            localEmployee.department_id = value;
        }
    },
    { 
        label: 'Lương cơ bản (ngày):',
        type: "number",
        modelValue: localEmployee.basic_salary,
        placeholder: 'Nhập lương cơ bản',
        name: "basic_salary",
        updateModelValue: (value) => {
            localEmployee.basic_salary = value;
        }
    },
    { 
        label: 'Phụ cấp trách nhiệm:',
        type: "number",
        modelValue: localEmployee.responsibility_allowance,
        placeholder: 'Nhập phụ cấp trách nhiệm',
        name: "responsibility_allowance",
        updateModelValue: (value) => {
            localEmployee.responsibility_allowance = value;
        }
    },
    { 
        label: 'Vị trí:',
        type: "select",
        modelValue: localEmployee.position,
        placeholder: 'Chọn vị trí',
        options: [
            {id: 'Employee', name: 'Nhân viên'},
            {id: 'Admin', name: 'Quản lý'}
        ],
        name: "position",
        updateModelValue: (value) => {
            localEmployee.position = value;
            isAdmin.value = localEmployee.position==='Admin';
        }
    },
    { 
        label: 'Ngày làm việc trong tuần:',
        type: "checkbox",
        placeholder: 'Chọn ngày làm việc',
        options: Employee.arrDateInWeek.map((ele, index) => {
            return {id: ele, name: ele, 
                checked: arr_working_days_status[index]}
        }),
        name: "working_days",
        updateModelValue: (selectedValue) => {
            const {value, index} = selectedValue;
            arr_working_days_status[index] = value ? true : false;
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
];

if(localEmployee.username===null) {
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
}

if(localEmployee.username===null) {
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

const leftFields = !props.employee?.username===null ? fields.slice(0, 5) : fields.slice(0, 6);
const rightFields = !props.employee?.username===null ? fields.slice(5, 10) : fields.slice(6, 12);

const validationSchema = yup.object().shape({
    name: yup
        .string()
        .required("Tên phải có giá trị")
        .min(2, "Tên phải có ít nhất 2 ký tự")
        .max(50, "Tên có nhiều nhất 50 ký tự"),
    department_id: yup
        .number()
        .required("Phòng ban không được trống")
        .typeError("Lỗi định dạng"),
    basic_salary: yup
        .number()
        .typeError("Sai định dạng")
        .required("Lương cơ bản không được trống")
        .min(80000, "Lương cơ bản ít nhất 80.000đ")
        .max(5000000, "Lương cơ bản cao nhất là 5.000.000đ"),
    responsibility_allowance: yup
        .number()
        .typeError("Sai định dạng")
        .required("Phụ cấp trách nhiệm không được trống")
        .min(80000, "Phụ cấp trách nhiệm ít nhất 80.000đ")
        .max(5000000, "Phụ cấp trách nhiệm cao nhất là 5.000.000đ"),
    position: yup
        .string()
        .required("Vị trí không được trống")
        .test("position", "Vị trí không hợp lệ",
            value => localEmployee.position==='Admin' 
                || localEmployee.position==='Employee'
        ),
    department_id: yup
        .string()
        .required("Phòng ban không được trống"),
    working_days: yup.
        mixed()
        .test("working_days", "Ngày làm việc không hợp lệ",
            value => !arr_working_days_status.every(
                (staus) => staus===false)
        ),
    birth: yup
        .date()
        .required("Sinh nhật phải có giá trị")
        .typeError("Sai định dạng"),
    phone: yup
        .number()
        .typeError("Số điện thoại phải là số")
        .required("Số điện thoại phải có giá trị")
        .test("len", "Số điện thoại phải có đúng 10 chữ số", 
            val => val && val.toString().length === 9),
    address: yup
        .string()
        .required("Địa chỉ phải có giá trị")
        .min(2, "Địa chỉ ít nhất 2 ký tự")
        .max(100, "Địa chỉ cao nhất 100 ký tự"),
    username: yup.string()
        .test('username_admin', "Tên đăng nhập không hợp lệ (2-50 ký tự)",
            value => {
                if(!isAdmin.value) return true;
                if(localEmployee.username.length > 2
                    && localEmployee.username.length < 50) {
                    return true;
                } else return false;
            }
        )
        .test('username_emp', "Chỉ quản lý mới có tài khoản",
            value => {
                if(isAdmin.value) return true;
                if(localEmployee.username==='' || localEmployee.username===null) {
                    return true;
                } else return false;
            }
        ),
    password: !props.employee?.username
        ? yup.string()
            .test('password_admin', "Mật khẩu không hợp lệ (8-50 ký tự)",
                value => {
                    if(!isAdmin.value) return true;
                    if(localEmployee.password.length > 8
                        && localEmployee.password.length < 50) {
                        return true;
                    } else return false;
                }
            )
            .test('password_emp', "Chỉ quản lý mới có tài khoản",
                value => {
                    if(isAdmin.value) return true;
                    if(!localEmployee.password) {
                        return true;
                    } else return false;
                }
            )
        : yup.string().notRequired(),
    confirmPassword: !props.employee?.username
        ? yup.string()
            .test('confirm_password_admin', "Mật khẩu nhập lại không hợp lệ (8-50 ký tự)",
                value => {
                    if(!isAdmin.value) return true;
                    if(value.length > 8 && value.length < 50) {
                        return true;
                    } else return false;
                }
            )
            .test("confirmPassword", "Mật khẩu nhập lại không trùng khớp",
                    val => {
                        if(!isAdmin.value) return true;
                        if(val === localEmployee.password) return true;
                        else return false;
                    }
                )
            .test('confirm_password_emp', "Chỉ quản lý mới có tài khoản",
                value => {
                    if(isAdmin.value) return true;
                    if(value==='') {
                        return true;
                    } else return false;
                }
            )
        : yup.string().notRequired(),
});

function submitEmployee() {
    if(!isAdmin.value) {
        localEmployee.username=null;
    }
    const arrDateInWeek = Employee.arrDateInWeek;
    localEmployee.working_days = 
        arr_working_days_status.map((ele, index) => {
            if(ele) { return arrDateInWeek[index]; }
        }).join(', ');
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