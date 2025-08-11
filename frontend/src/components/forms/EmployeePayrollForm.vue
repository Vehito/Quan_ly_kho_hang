<template>
    <div class="shadow">
        <h3 class="text-center" style="color: skyblue;">Thông tin nhân viên</h3>
        <div class="float-right">
            <button class="btn btn-outline-primary"
                v-if="employeePayroll.finalized_day===null"
                type="submit" form="form"
                @click="submitEmployeePayroll"
                style="max-width: fit-content;"
            >   Lưu
            </button>
            <button class="btn btn-outline-success" 
                @click="employeePayrollPdfExport(employeePayroll)"
                style="max-width: fit-content;"
            >   Xuất PDF <i class="fa-solid fa-file-pdf"></i>
            </button>
        </div>
        <div class="employee_infos mt-5">
            <div v-for="info in employee_infos" class="background_info">
                <p><strong>{{ info.label }}:</strong> {{ info.text }}</p>
            </div>
        </div>
    </div>
    <div class="row mt-3 payroll_table">
        <div class="col">
            <CustomTable :table-headers="plus_table.tableHeaders"
                :table-rows="plus_table.tableRows" :total="plus_table.total"
                :total-columns="plus_table.totalColumns"
            />
        </div>
        <div class="col">
            <CustomTable :table-headers="minus_table.tableHeaders"
                :table-rows="minus_table.tableRows" :total="minus_table.total"
                :total-columns="minus_table.totalColumns"
            />
        </div>
    </div>

    <div v-if="employeePayroll.finalized_day===null" class="mt-3">
        <Form @submit="submitEmployeePayroll" id="form" :validation-schema="validationSchema">
            <div class="form-slot row">
                <div class="basic_infos_slot col-md">
                    <FormFields v-for="field in basic_info_fields"
                        :label="field.label"
                        :type="field.type"
                        :model-value="field.modelValue"
                        :name="field.name"
                        :placeholder="field.placeholder"
                        @update:model-value="field.updateModelValue"
                    />
                </div>
                <div class="allowances_slot ml-md-5 mt-2 mt-md-0 col-md">
                    <FormFields v-for="field in plus_fields"
                        :label="field.label"
                        :type="field.type"
                        :model-value="field.modelValue"
                        :name="field.name"
                        :placeholder="field.placeholder"
                        @update:model-value="field.updateModelValue"
                    />
                </div>
                <div class="deductions_slot ml-md-5 mt-2 mt-md-0 col-md">
                    <FormFields v-for="field in minus_fields"
                        :label="field.label"
                        :type="field.type"
                        :model-value="field.modelValue"
                        :name="field.name"
                        :placeholder="field.placeholder"
                        @update:model-value="field.updateModelValue"
                    />
                </div>
            </div>
        </Form>
    </div>
</template>

<script setup>
const props = defineProps({
    employeePayroll: { type: EmployeePayroll, required: false },
});
const emits = defineEmits(['submit:employee_payroll']);

// components
import { Form } from 'vee-validate';
import FormFields from './FormFields.vue';
import CustomTable from '../CustomTable.vue';

// models
import { EmployeePayroll } from '@/models/employee_payrolls.model';

// more
import * as yup from 'yup';
import { ref } from 'vue';
import { employeePayrollPdfExport } from '@/utils/PDF_export';

const localEmployeePayroll = props.employeePayroll;

// ref

// var
const plus_table = {
    tableHeaders: [
        {name: 'Tên mục phụ cấp', key: 'name'},
        {name: 'Ghi chú', key: 'description'},
        {name: 'Số tiền', key: 'amount'}
    ],
    tableRows: [
        {name: 'Lương cơ bản theo hợp đồng', description: '',
            amount: ref(localEmployeePayroll.formatted_basic_month_salary)},
        {name: 'Phụ cấp cơm trưa', description: '',
            amount: ref(localEmployeePayroll.formatted_lunch_allowance)},
        {name: 'Phụ cấp trách nhiệm', description: '',
            amount: ref(localEmployeePayroll.formatted_resposibility_allowances)},
        {name: 'Phụ cấp khác', description: ref(localEmployeePayroll.other_allowances_description),
            amount: ref(localEmployeePayroll.formatted_other_allowances)},
    ],
    totalColumns: [2], total: {2: ref(localEmployeePayroll.formatted_total_income)},
    update_basic_month_salary() {
        this.tableRows[0].amount.value = localEmployeePayroll.formatted_basic_month_salary;
        this.total[2].value = localEmployeePayroll.formatted_total_income;
    },
    update_lunch_allowance() {
        this.tableRows[1].amount.value = localEmployeePayroll.formatted_lunch_allowance;
        this.total[2].value = localEmployeePayroll.formatted_total_income;
    },
    update_resposibility_allowances() {
        this.tableRows[2].amount.value = localEmployeePayroll.formatted_resposibility_allowances;
        this.total[2].value = localEmployeePayroll.formatted_total_income;
    },
    update_other_allowances() {
        this.tableRows[3].amount.value = localEmployeePayroll.formatted_other_allowances;
        this.total[2].value = localEmployeePayroll.formatted_total_income;
    },
    // update_other_allowances_descriptions() {
    //     this.tableRows[3].description.value = localEmployeePayroll.other_allowances_description;
    // },
};
const minus_table = {
    tableHeaders: [
        {name: 'Tên mục khấu trừ', key: 'name'},
        {name: 'Ghi chú', key: 'description'},
        {name: 'Số tiền', key: 'amount'}
    ],
    tableRows: [
        {name: 'Bảo hiểm y tế', description: '',
            amount: ref(localEmployeePayroll.formatted_health_insurance)},
        {name: 'Bảo hiểm xã hội', description: '',
            amount: ref(localEmployeePayroll.formatted_social_insurance)},
        {name: 'Bảo hiểm thất nghiệp', description: '',
            amount: ref(localEmployeePayroll.formatted_unemployment_insurance)},
        {name: 'Thuế thu nhập cá nhân', description: '',
            amount: ref(localEmployeePayroll.formatted_persenal_tax_deduction)},
        {name: 'Khấu trừ khác', description: ref(localEmployeePayroll.other_deductions_description),
            amount: ref(localEmployeePayroll.formatted_other_deductions)},
    ],
    totalColumns: [2], total: {2: ref(localEmployeePayroll.formatted_total_deduction)},
    update_health_insurance() {
        this.tableRows[0].amount.value = localEmployeePayroll.formatted_health_insurance;
        this.total[2].value = localEmployeePayroll.formatted_total_deduction;
    },
    update_social_insurance() {
        this.tableRows[1].amount.value = localEmployeePayroll.formatted_social_insurance;
        this.total[2].value = localEmployeePayroll.formatted_total_deduction;
    },
    update_unemployment_insurance() {
        this.tableRows[2].amount.value = localEmployeePayroll.formatted_unemployment_insurance;
        this.total[2].value = localEmployeePayroll.formatted_total_deduction;
    },
    update_other_deductions() {
        this.tableRows[3].amount.value = localEmployeePayroll.formatted_other_deductions;
        this.total[2].value = localEmployeePayroll.formatted_total_deduction;
    },
    update_persenal_tax_deduction() {
        this.tableRows[4].amount.value = localEmployeePayroll.formatted_persenal_tax_deduction;
        this.total[2].value = localEmployeePayroll.formatted_total_deduction;
    },
    // update_other_deductions_description() {
    //     this.tableRows[4].description.value = localEmployeePayroll.other_deductions_description;
    // },
};
const basic_info_fields = [
    {
        label: 'Lương cơ bản:',
        type: 'number',
        modelValue: localEmployeePayroll.basic_salary,
        placeholder: "Nhập lương cơ bản",
        name: "basic_salary",
        updateModelValue: (value) => {
            localEmployeePayroll.basic_salary = value;
            plus_table.update_basic_month_salary();
        }
    },
    {
        label: 'Số ngày công:',
        type: 'number',
        modelValue: localEmployeePayroll.workdays,
        placeholder: "Nhập số ngày công",
        name: "workdays",
        updateModelValue: (value) => {
            localEmployeePayroll.workdays = value;
            plus_table.update_basic_month_salary();
        }
    },
    {
        label: 'Số giờ OT ngoài giờ (150%):',
        type: 'number',
        modelValue: localEmployeePayroll.overtime_weekday_hours,
        placeholder: "Nhập số giờ",
        name: "OT_150_h",
        updateModelValue: (value) => {
            localEmployeePayroll.overtime_weekday_hours = value;
            plus_table.update_basic_month_salary();
        }
    },
    {
        label: 'Số giờ OT cuối tuần (200%):',
        type: 'number',
        modelValue: localEmployeePayroll.overtime_weekend_hours,
        placeholder: "Nhập số giờ",
        name: "OT_200_h",
        updateModelValue: (value) => {
            localEmployeePayroll.overtime_weekend_hours = value;
            plus_table.update_basic_month_salary();
        }
    },
    {
        label: 'Số giờ OT ngày lễ (300%):',
        type: 'number',
        modelValue: localEmployeePayroll.overtime_holiday_hours,
        placeholder: "Nhập số giờ",
        name: "OT_300_h",
        updateModelValue: (value) => {
            localEmployeePayroll.overtime_holiday_hours = value;
            plus_table.update_basic_month_salary();
        }
    },
];
const plus_fields = [
    {
        label: 'Phụ cấp trách nhiệm:',
        type: 'number',
        modelValue: localEmployeePayroll.responsibility_allowance,
        placeholder: "Nhập số tiền phụ cấp",
        name: "responsibility_allowance",
        updateModelValue: (value) => {
            localEmployeePayroll.responsibility_allowance = value;
            plus_table.update_resposibility_allowances();
        }
    },
    {
        label: 'Phụ cấp ăn trưa:',
        type: 'number',
        modelValue: localEmployeePayroll.lunch_allowance,
        placeholder: "Nhập số tiền phụ cấp",
        name: "lunch_allowance",
        updateModelValue: (value) => {
            localEmployeePayroll.lunch_allowance = value;
            plus_table.update_lunch_allowance();
        }
    },
    {
        label: 'Phụ cấp khác:',
        type: 'number',
        modelValue: localEmployeePayroll.other_allowances,
        placeholder: "Nhập số tiền phụ cấp",
        name: "other_allowances",
        updateModelValue: (value) => {
            localEmployeePayroll.other_allowances = value;
            plus_table.update_other_allowances();
        }
    },
    {
        label: 'Mô tả phụ cấp:',
        type: 'textarea',
        modelValue: localEmployeePayroll.other_allowances_description,
        placeholder: "Nhập mô tả",
        name: "other_allowances_description",
        updateModelValue: (value) => {
            localEmployeePayroll.other_allowances_description = value;
            // plus_table.update_other_allowances_descriptions();
        }
    },
];
const minus_fields = [
    {
        label: 'Bảo hiểm xã hội:',
        type: 'number',
        modelValue: localEmployeePayroll.social_insurance,
        placeholder: "Nhập số tiền",
        name: "social_insurance",
        updateModelValue: (value) => {
            localEmployeePayroll.social_insurance = value;
            minus_table.update_social_insurance();
        }
    },
    {
        label: 'Bảo hiểm y tế:',
        type: 'number',
        modelValue: localEmployeePayroll.health_insurance,
        placeholder: "Nhập số tiền",
        name: "health_insurance",
        updateModelValue: (value) => {
            localEmployeePayroll.health_insurance = value;
            minus_table.update_health_insurance();
        }
    },
    {
        label: 'Khấu trừ khác:',
        type: 'number',
        modelValue: localEmployeePayroll.other_deductions,
        placeholder: "Nhập số tiền",
        name: "other_deductions",
        updateModelValue: (value) => {
            localEmployeePayroll.other_deductions = value;
            minus_table.update_other_deductions();
        }
    },
    {
        label: 'Mô tả khấu trừ:',
        type: 'textarea',
        modelValue: localEmployeePayroll.other_deductions_description,
        placeholder: "Nhập mô tả",
        name: "other_deductions_description",
        updateModelValue: (value) => {
            localEmployeePayroll.other_deductions_description = value;
            // minus_table.update_other_deductions_description();
        }
    },
];
const employee_infos = [
    { label: 'Mã nhân viên', text: localEmployeePayroll.employee_id },
    { label: 'Tên nhân viên', text: localEmployeePayroll.employee_name },
    { label: 'Phòng ban', text: localEmployeePayroll.department_name },
    { label: 'Vị trí', text: localEmployeePayroll.text_position },
];
const validationSchema = yup.object().shape({
    basic_salary: yup
        .number()
        .typeError('Sai định dạng')
        .required("Lương cơ bản không được trống")
        .min(80000, "Lương cơ bản phải có ít nhất 80.000đ")
        .max(5000000, "Lương cơ bản có nhiều nhất 5.000.000đ"),
    workdays: yup
        .number()
        .typeError('Sai định dạng')
        .required("Ngày làm việc không được trống")
        .min(1, "Ngày làm việc cao nhất 1 ngày")
        .max(30, "Ngày làm việc cao nhất 30 ngày"),
    OT_150_h: yup
        .number()
        .typeError('Sai định dạng')
        .required("OT 150% không được trống")
        .min(0, "OT 150% ít nhất 0 giờ")
        .max(40, "OT 150% cao nhất 40 giờ"),
    OT_200_h: yup
        .number()
        .typeError('Sai định dạng')
        .required("OT 200% không được trống")
        .min(0, "OT 200% ít nhất 0 giờ")
        .max(40, "OT 200% cao nhất 40 giờ"),
    OT_300_h: yup
        .number()
        .typeError('Sai định dạng')
        .required("OT 300% không được trống")
        .min(0, "OT 300% ít nhất 0 giờ")
        .max(40, "OT 300% cao nhất 40 giờ"),
    responsibility_allowance: yup
        .number()
        .typeError('Sai định dạng')
        .required("Phụ cấp trách nhiệm không được trống")
        .min(0, "Phụ cấp trách nhiệm ít nhất 0đ")
        .max(2000000, "Phụ cấp trách nhiệm cao nhất 2.000.000đ"),
    lunch_allowance: yup
        .number()
        .typeError('Sai định dạng')
        .required("Phụ cấp cơm trưa không được trống")
        .min(0, "Phụ cấp cơm trưa ít nhất 0đ")
        .max(1000000, "Phụ cấp cơm trưa cao nhất 1.000.000đ"),
    other_allowances_description: yup
        .string()
        .required("Mô tả không được trống")
        .max(150, "Mô tả cao nhất 150 ký tự"),
    social_insurance: yup
        .number()
        .typeError('Sai định dạng')
        .required("Bảo hiểm xã hội không được trống")
        .min(0, "Bảo hiểm xã hội ít nhất 0đ")
        .max(1000000, "Bảo hiểm xã hội cao nhất 1.000.000đ"),
    health_insurance: yup
        .number()
        .typeError('Sai định dạng')
        .required("Bảo hiểm ý tế không được trống")
        .min(0, "Bảo hiểm ý tế ít nhất 0đ")
        .max(1000000, "Bảo hiểm ý tế cao nhất 1.000.000đ"),
    other_deductions: yup
        .number()
        .typeError('Sai định dạng')
        .required("Khấu trừ khác không được trống")
        .min(0, "Khấu trừ khác ít nhất 0đ")
        .max(5000000, "Khấu trừ khác cao nhất 5.000.000đ"),
    other_deductions_description: yup
        .number()
        .required("Mô tả không được trống")
        .max(150, "Mô tả cao nhất 150 ký tự"),
});

// func
function submitEmployeePayroll() {
    emits('submit:employee_payroll', localEmployeePayroll);
}

</script>

<style>
@import "@/assets/form.css";
.employee_infos {
    display: flex;
    justify-content: space-around;
    border: .5px skyblue solid;
    border-radius: 20px;
    padding: 10px;
    background-color: rgb(135, 206, 235, .2);
}
.basic_infos_slot {
    border: .5px skyblue solid;
    border-radius: 20px;
    padding: 10px;
    background-color: rgb(135, 206, 235, .2);
}

.allowances_slot {
    border: .5px rgb(0, 255, 0) solid;
    border-radius: 20px;
    padding: 10px;
    background-color: rgb(0, 255, 0, .1);
}
.deductions_slot {
    border: .5px yellow solid;
    border-radius: 20px;
    padding: 10px;
    background-color: rgb(255, 255, 0, .1);
}

.form-slot {
    display: flex;
    justify-content: center;
}
</style>