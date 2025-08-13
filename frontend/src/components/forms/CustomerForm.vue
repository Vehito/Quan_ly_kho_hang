<template>
    <div class="form-container">
        <Form @submit="submitCustomer"
            :validation-schema="validationSchema"
        >
            <div class="row">
                <div class="col">
                    <div
                        v-for="field in fields.slice(0, 3)"
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
                </div>
                <div class="col">
                    <div
                        v-for="field in fields.slice(3, 6)"
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
                </div>
            </div>
            <div class="form-group text-center">
                <button class="btn btn-primary" type="submit">
                    Lưu
                </button>
                <button
                    v-if="localCustomer.id"
                    class="btn btn-danger ml-2"
                    type="button"
                    @click="deleteCustomer"
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
import { Customer } from '@/models/customers.model.js';
import router from '@/router/index.js';
import date_helperUtil from '@/utils/date_helper.util';

const props = defineProps({
    customer: { type: Customer, required: false }
});

const emits = defineEmits(['submit:customer', 'delete:customer']);

let localCustomer = props.customer ?? Customer.getEmptyObject();
let delete_debt = 0;

const fields = [
    { 
        label: 'Tên khách hàng:',
        modelValue: localCustomer.name,
        placeholder: "Nhập tên khách hàng",
        name: "name",
        updateModelValue: (value) => {
            localCustomer.name = value;
        }
    },
    {
        label: 'Công ty khách hàng:',
        modelValue: localCustomer.company,
        placeholder: "Nhập tên công ty",
        name: "company",
        updateModelValue: (value) => {
            localCustomer.company = value;
        }
    },
    {
        label: 'Địa chỉ khách hàng:',
        type: 'textarea',
        modelValue: localCustomer.address,
        placeholder: "Nhập địa chỉ",
        name: "address",
        updateModelValue: (value) => {
            localCustomer.address = value;
        }
    },
    ...(!props.customer 
        ? [{
            label: 'Số nợ khách hàng:',
            type: 'number',
            modelValue: localCustomer.debt,
            placeholder: "Nhập số nợ",
            name: "debt",
            updateModelValue: (value) => {
                localCustomer.debt = value;
            }
        }]
        : [{
            label: 'Số nợ muốn xóa:',
            type: 'number',
            modelValue: delete_debt,
            placeholder: "Nhập số nợ muốn xóa",
            name: "delete_debt",
            updateModelValue: (value) => {
                delete_debt = value;
            }
        }]),
    {
        label: 'Ngày trả:',
        type: 'date',
        modelValue: localCustomer.due_date ? date_helperUtil.getModelValue(localCustomer.due_date) : null,
        placeholder: "Nhập ngày trả",
        name: "due_date",
        updateModelValue: (value) => {
            localCustomer.due_date = value;
        }
    },
    {
        label: 'Trạng thái khách hàng:',
        type: 'select',
        modelValue: localCustomer.status,
        placeholder: "Chọn trạng thái",
        options: [{id: 1, name: 'Kích hoạt'},
            {id: 0, name: 'Không kích hoạt'}],
        name: "status",
        updateModelValue: (value) => {
            localCustomer.status = value;
        }
    },
]

const validationSchema = yup.object().shape({
        name: yup
            .string()
            .required("Tên phải có giá trị")
            .min(2, "Tên phải có ít nhất 2 ký tự")
            .max(50, "Tên có nhiều nhất 100 ký tự"),
        company: yup
            .string()
            .notRequired()
            .max(50, "Tên công ty cao nhất 50 ký tự"),
        address: yup
            .string()
            .required("Địa chỉ phải có giá trị")
            .min(2, "Địa chỉ ít nhất 2 ký tự")
            .max(100, "Địa chỉ cao nhất 100 ký tự"),
        ...(!props.customer?.id 
            ? {
                debt: yup.number()
                    .required("Số nợ phải có giá trị")
                    .typeError("Sai định dạng")
                    .min(0, "Số nợ nhỏ nhất là 0đ")
            }
            : {
                delete_debt: yup.number()
                    .required("Số nợ muốn xóa không được trống")
                    .typeError("Sai định dạng")
                    .min(0, "Giá trị nhỏ nhất là 0đ")
                    .test("delete_debt",
                        `Không được vượt quá khoản nợ hiện tại\n${localCustomer.formatted_debt}`,
                        value => value <= localCustomer.debt
                    )
            }
        ),
        due_date: yup
            .date()
            .transform((value, originalValue) => {
                return originalValue === "" || originalValue==='NaN-NaN-NaN NaN:NaN:NaN'
                    ? undefined : value;
            })
            .notRequired()
            .typeError("Sai định dạng"),
        status: yup
            .number()
            .required("Trạng thái cần có giá trị")
            .test("isValidStatus", "Trạng thái sai định dạng",
                val => val === 1 || val === 0
            )
});

function submitCustomer() {
    localCustomer.due_date===''
        ? localCustomer.due_date = null
        : localCustomer.due_date;
    localCustomer.due_date==='NaN-NaN-NaN NaN:NaN:NaN'
        ? localCustomer.due_date = null
        : localCustomer.due_date;
    if(delete_debt>0 && delete_debt<localCustomer.debt && props.customer?.id) {
        localCustomer.debt -= delete_debt;
    }
    emits('submit:customer', localCustomer);
}

function deleteCustomer() {
    emits('delete:customer', props.customer.id);
}

function cancel() {
    const reply = window.confirm('You have unsaved changes! Do you wanna leave?');
    if(!reply) {
        return false;
    } else {
        router.push({ name: 'customers' });
    }
}
</script>

<style>
@import "@/assets/form.css";
</style>