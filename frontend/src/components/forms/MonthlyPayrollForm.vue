<template>
    <ButtonCollapse :btn-classes="createField.buttonCollapse.btnClasses"
        :btn-texts="createField.buttonCollapse.btnTexts" :ids="createField.buttonCollapse.ids"
    >
        <template #default="{ index }">
            <Form @submit="createField.createMonthlyPayroll" :validation-schema="validationSchema">
                <div class="row">
                    <div class="col" v-for="field in createField.fields">
                        <FormFields
                            :label="field.label" :model-value="field.modelValue"
                            :name="field.name" :placeholder="field.placeholder"
                            @update:model-value="field.updateModelValue"
                        />
                        <ErrorMessage :name="field.name" class="error-feedback" />
                    </div>
                    <LoadingButton :btn-text="createField.btn.btnText"
                        :class-content="createField.btn.btnClass"
                        :is-loading="createField.btn.isLoading.value"
                    >
                        <button :class="createField.btn.btnClass">
                            {{ createField.btn.btnText }}</button>
                    </LoadingButton>
                </div>
            </Form>
        </template>
    </ButtonCollapse>
</template>

<script setup>
const emits = defineEmits(['onCreate']);

// components
import { Form, ErrorMessage } from 'vee-validate';
import FormFields from './FormFields.vue';
import ButtonCollapse from '../ButtonCollapse.vue';
import LoadingButton from '../loading/LoadingButton.vue';

// controllers
import monthly_payrollsController from '@/controllers/monthly_payrolls.controller';

// more
import * as yup from 'yup';
import { useUserStore } from '@/utils/pinia.util';
import { MonthlyPayroll } from '@/models/monthly_payrolls.model';
import { ref } from 'vue';
const userStore = useUserStore();

// ref
const isLoading = ref(false);

// var
const today = new Date();
const time = [today.getFullYear(), today.getMonth()+1, 1];
const localMonthlyPayroll = new MonthlyPayroll({});
const validationSchema = yup.object().shape({
    payroll_month: yup
        .number()
        .required("Tháng không được trống")
        .typeError("Tháng phải là số")
        .min(1, "Tháng nhỏ nhất là 1")
        .max(12, "Tháng lớn nhât là 12"),
    payroll_year: yup
        .number()
        .typeError("Năm phải là số")
        .required("Năm không được trống")
        .min(2020, "Năm tối thiểu là 2020")
        .max(today.getFullYear(), `Năm tối đa là ${today.getFullYear()}`),
});
const createField = {
    async createMonthlyPayroll() {
        try {
            isLoading.value = true;
            localMonthlyPayroll.created_by = userStore.id;
            localMonthlyPayroll.payroll_month = time.join('-');
            const result = await monthly_payrollsController.insert(localMonthlyPayroll);
            if(result?.id) {
                emits('onCreate', result?.id);
            }
        } catch (error) {
            error?.showAlert();
        } finally {
            isLoading.value = false;
        }
    },
    buttonCollapse: {
        btnClasses: ['btn btn-outline-primary'],
        btnTexts: ['Tạo bảng lương'],
        ids: ['create_btn_collapse']
    },
    btn: {
        btnText: 'Tạo bảng lương tháng mới',
        btnClass: 'btn btn-outline-primary',
        isLoading: isLoading,
    },
    fields: [
        {
            label: 'Tháng',
            modelValue: today.getMonth() + 1,
            placeholder: "Nhập tháng",
            name: "payroll_month",
            updateModelValue: (value) => {
                time[1] = value;
            }
        },
        {
            label: 'Năm',
            modelValue: today.getFullYear(),
            placeholder: "Nhập năm",
            name: "payroll_year",
            updateModelValue: (value) => {
                time[0] = value;
            }
        }
    ]
};
</script>

<style>
@import "@/assets/form.css";
</style>