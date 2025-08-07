<template>
<div class="page">
    <h5 class="text-center mb-5">{{ tableTitle }}</h5>
    <LoadingScreen :is-loading="isLoading.employee_payrolls.value">
        <CustomTable2 :table-content="tableContent"
            :total="tableContent.total" :total-columns="tableContent.totalColumns"
        >
            <template #custom="{row}">
                <DropdownBtn
                    :dropdown-items="['Chi tiết', 'Xuất PDF']"
                    @select:value="(selectedAction) => handleAction(selectedAction, row)"
                >
                    <template #label>
                        <i class="fa-solid fa-bars"></i>
                    </template>
                </DropdownBtn>
            </template>
        </CustomTable2>
    </LoadingScreen>

    <div class="ml-5 mt-5 row">
        <div class="col">
            <LoadingButton :is-loading="isLoading.create.value"
                :btn-text="createBtn.btnText" :class-content="createBtn.classContent"
            >
                <button :class="createBtn.classContent"
                    :disabled="!canCreate"
                    @click="createEmployeePayrolls"    
                >
                    {{ createBtn.btnText }}
                </button>
            </LoadingButton>
        </div>
        <!-- <div class="col">
            <button class="btn btn-outline-success" 
                @click=""
                style="max-width: fit-content;"
            >
                Xuất PDF
                <i class="fa-solid fa-file-pdf"></i>
            </button>
        </div> -->
        <div class="col">
            <button class="btn btn-outline-danger"
                v-if="!monthly_payroll.is_finalized"
                @click="updateMonthlyPayroll"
                style="max-width: fit-content;"
            >
                Xác nhận thanh toán
                <i class="fa-solid fa-credit-card"></i>
            </button>
        </div>
    </div>
</div>
</template>

<script setup>
const props = defineProps({
    id: { type: String, required: true },
});

// components
import CustomTable2 from '@/components/CustomTable2.vue';
import LoadingScreen from '@/components/loading/LoadingScreen.vue';
import LoadingButton from '@/components/loading/LoadingButton.vue';
import { DropdownBtn } from '@/utils/buttons.util';

// controllers
import employee_payrollsController from '@/controllers/employee_payrolls.controller';
import employeesController from '@/controllers/employees.controller';

// more
import { onMounted, ref } from 'vue';
import { EmployeePayroll } from '@/models/employee_payrolls.model';
import { Employee } from '@/models/employees.model';
import date_helperUtil from '@/utils/date_helper.util';
import router from '@/router';
import { employeePayrollPdfExport } from '@/utils/PDF_export';
import number_heplerUtil from '@/utils/number_hepler.util';
import { MonthlyPayroll } from '@/models/monthly_payrolls.model';
import monthly_payrollsController from '@/controllers/monthly_payrolls.controller';

// ref
const tableTitle = ref('');
const monthly_payroll = ref(new MonthlyPayroll({}));
const employees = ref([new Employee({})]);
const employee_payrolls = ref([new EmployeePayroll({})]);
const isLoading = {employee_payrolls: ref(true), create: ref(false)};
const tableContent = {
    tableHeaders: {
        upper: [
            {name: 'Tên nhân viên', colspan: 1, rowspan: 1},
            {name: 'Phòng ban', colspan: 1, rowspan: 1},
            {name: 'Ngày công/Lương cơ bản', colspan: 1, rowspan: 1},
            {name: 'Phụ cấp cơm trưa', colspan: 1, rowspan: 1}, 
            {name: 'Phụ cấp trách nhiệm', colspan: 1, rowspan: 1},

            {name: 'Phụ cấp khác', colspan: 1, rowspan: 2},

            {name: 'Tổng thu nhập', colspan: 1, rowspan: 2},
            
            {name: 'Bảo hiểm xã hội', colspan: 1, rowspan: 1},
            {name: 'Bảo hiểm thất nghiệp', colspan: 1, rowspan: 1},
            
            {name: 'Khấu trừ khác', colspan: 1, rowspan: 2},

            {name: 'Tổng khoản giảm trừ', colspan: 1, rowspan: 2},

            {name: 'Số tiền thực nhận', colspan: 1, rowspan: 2},
        ],
        lower: [
            {name: 'Mã nhân viên', colspan: 1, rowspan: 1},
            {name: 'Chức vụ', colspan: 1, rowspan: 1},
            {name: '150% OT', colspan: 1, rowspan: 1},
            {name: '200% OT', colspan: 1, rowspan: 1},
            {name: '300% OT', colspan: 1, rowspan: 1},

            {name: 'Bảo hiểm y tế', colspan: 1, rowspan: 1},
            {name: 'Thuế TNCN', colspan: 1, rowspan: 1},
        ]
    },
    tableRows: {
        upper: [
            { key: 'employee_name', colspan: 1, rowspan: 1},
            { key: 'department_name', colspan: 1, rowspan: 1},
            { key: 'formatted_basic_salary', colspan: 1, rowspan: 1},
            { key: 'formatted_lunch_allowance', colspan: 1, rowspan: 1},
            { key: 'formatted_resposibility_allowances', colspan: 1, rowspan: 1},
            { key: 'formatted_other_allowances', colspan: 1, rowspan: 2},
            { key: 'formatted_total_income', colspan: 1, rowspan: 2}, // 6
            { key: 'formatted_social_insurance', colspan: 1, rowspan: 1},
            { key: 'formatted_unemloyment_insurance', colspan: 1, rowspan: 1},
            { key: 'formatted_other_deductions', colspan: 1, rowspan: 2},
            { key: 'formatted_total_deduction', colspan: 1, rowspan: 2}, // 10
            { key: 'formatted_net_salary', colspan: 1, rowspan: 2}, // 11
        ],
        lower: [
            { key: 'employee_id', colspan: 1, rowspan: 1},
            { key: 'text_position', colspan: 1, rowspan: 1},
            { key: 'formatted_OT_150_salary', colspan: 1, rowspan: 1},
            { key: 'formatted_OT_200_salary', colspan: 1, rowspan: 1},
            { key: 'formatted_OT_300_salary', colspan: 1, rowspan: 1},
            { key: 'formatted_heath_insurance', colspan: 1, rowspan: 1},
            { key: 'formatted_persenal_tax_deduction', colspan: 1, rowspan: 1},
        ]
    },
    data: [],
    totalColumns: [6, 10, 11],
    total: { 6: ref(0), 10: ref(0), 11: ref(0) }
};
const canCreate= ref(true);

// var
const createBtn = {
    btnText: 'Tạo bảng lương nhân viên',
    classContent: 'btn btn-outline-primary'
};

// async
async function loadEmployeePayrolls() {
    try {
        isLoading.employee_payrolls.value = true;
        employee_payrolls.value = await employee_payrollsController
            .queryAll({monthly_payroll_id: props.id});
        console.log(props.id);
        tableContent.data = employee_payrolls.value;
        if(employee_payrolls.value.length>0) {
            canCreate.value = false;
        }
    } catch (error) {
        error?.showAlert();
    } finally {
        isLoading.employee_payrolls.value = false;
    }
}
async function loadMonthlyPayroll() {
    try {
        monthly_payroll.value = await monthly_payrollsController.queryById(props.id, {}, false);
        tableTitle.value = `Bảng lương nhân viên ${monthly_payroll.value.text_payroll_month}`;
    } catch (error) {
        error?.showAlert();
    }
}
async function updateMonthlyPayroll() {
    try {
        monthly_payroll.value.finalized_day = date_helperUtil.formatDateForMySQL(new Date());
        monthly_payroll.value.is_finalized = true;
        await monthly_payrollsController.update(monthly_payroll.value.id, monthly_payroll.value);
        router.push({name: 'monthly_payrolls'});
    } catch (error) {
        
    }
}
async function loadEmployees() {
    try {
        employees.value = await employeesController.queryAll();
    } catch (error) {
        error?.showAlert();
    }
}
async function createEmployeePayrolls() {
    const year = monthly_payroll.value.text_payroll_month.split('/')[1];
    const month = monthly_payroll.value.text_payroll_month.split('/')[0];
    try {
        isLoading.create.value = true;
        await loadEmployees();

        for (const employee of employees.value) {
            const workdays = date_helperUtil.countWeekdaysInMonth(employee.arr_working_days, month, year);
            const employee_payroll = new EmployeePayroll({
                employee_id: employee.id, workdays, basic_salary: employee.basic_salary,
                payroll_month: monthly_payroll.value.payroll_month, department_id: employee.department_id,
                responsibility_allowance: employee.responsibility_allowance,
                monthly_payroll_id: props.id, position: employee.position
            })
            await employee_payrollsController.insert(employee_payroll);
        }
        canCreate.value = false;
        await loadEmployeePayrolls();
    } catch (error) {
        error?.showAlert();
    } finally {
        isLoading.create.value = false;
    }
}

// func
async function handleAction(selectedAction, row) {
    switch(selectedAction) {
        case "Chi tiết":
            router.push({ name: 'employee_payroll.edit', params: {id: row.id}})
        break;
        case 'Xuất PDF':
            employeePayrollPdfExport(row);
        break;
    }
}

onMounted(async () => {
    await loadMonthlyPayroll();
    await loadEmployeePayrolls();
    tableContent.total[6].value = number_heplerUtil.getFormattedNumber(
        employee_payrolls.value.reduce(
            (preVal, currVal) => Number(preVal)+Number(currVal.total_income), 0
        ));
    tableContent.total[10].value = number_heplerUtil.getFormattedNumber(
        employee_payrolls.value.reduce(
            (preVal, currVal) => Number(preVal)+Number(currVal.total_deduction), 0
        ));
    tableContent.total[11].value = number_heplerUtil.getFormattedNumber(
        employee_payrolls.value.reduce(
            (preVal, currVal) => Number(preVal)+Number(currVal.net_salary), 0
        ));
});
</script>