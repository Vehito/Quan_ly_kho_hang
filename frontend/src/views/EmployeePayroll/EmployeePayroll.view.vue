<template>
<div class="page">
    <h5 class="text-center mt-3 mb-5">{{ tableTitle }}</h5>
    <LoadingScreen :is-loading="isLoading.employee_payrolls.value">
        <CustomTable2 :table-content="tableContent">
            <template #custom="{row}">
                <DropdownBtn
                    :dropdown-items="['Chi tiết']"
                    @select:value="(selectedAction) => handleAction(selectedAction, row)"
                >
                    <template #label>
                        <i class="fa-solid fa-bars"></i>
                    </template>
                </DropdownBtn>
            </template>
        </CustomTable2>
    </LoadingScreen>

    <div class="ml-5">
        <LoadingButton :is-loading="isLoading.create.value"
            :btn-text="createBtn.btnText" :class-content="createBtn.classContent"
        >
            <button :class="createBtn.classContent"
                :disabled="{canCreate}"
                @click="createEmployeePayrolls"    
            >
                {{ createBtn.btnText }}
            </button>
        </LoadingButton>
    </div>
</div>
</template>

<script setup>
// text_payroll_month; Ex: 01/08/2025 -> 2025/07
const props = defineProps({payroll_month: { type: String, required: true }});

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

// ref
const tableTitle = ref('');
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
            { key: 'formatted_total_income', colspan: 1, rowspan: 2},
            { key: 'formatted_social_insurance', colspan: 1, rowspan: 1},
            { key: 'formatted_unemloyment_insurance', colspan: 1, rowspan: 1},
            { key: 'formatted_other_deductions', colspan: 1, rowspan: 2},
            { key: 'formatted_total_deduction', colspan: 1, rowspan: 2},
            { key: 'formatted_net_salary', colspan: 1, rowspan: 2},
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
    data: []
};
const canCreate= ref(true);

// var
const createBtn = {
    btnText: 'Tạo bảng lương nhân viên',
    classContent: 'btn btn-outline-primary'
}

// async
async function loadEmployeePayrolls() {
    try {
        isLoading.employee_payrolls.value = true;
        employee_payrolls.value = await employee_payrollsController.queryAll(
            {payroll_month: date_helperUtil.formatDateForMySQL(props.payroll_month+'-01')}
        );
        tableTitle.value = `Bảng lương nhân viên ${props.payroll_month}`
        tableContent.data = employee_payrolls.value;
        if(employee_payrolls.value.length>0) {
            canCreate.value = false;
        }
        console.log(employee_payrolls.value);
    } catch (error) {
        error?.showAlert();
    } finally {
        isLoading.employee_payrolls.value = false;
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
    const year = props.payroll_month.slice(0, 4);
    const month = props.payroll_month.slice(5, 7);
    try {
        isLoading.create.value = true;
        await loadEmployees();
        for (const employee of employees.value) {
            const workdays = date_helperUtil.countWeekdaysInMonth(employee.arr_working_days, month, year);
            const employee_payroll = new EmployeePayroll({
                employee_id: employee.id, workdays, basic_salary: employee.basic_salary,
                payroll_month: props.payroll_month+'-01',
                responsibility_allowance: employee.responsibility_allowance
            })
            await employee_payrollsController.insert(employee_payroll);
        }
        canCreate.value = false
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
            router.push({ name: 'product.detail', params: {id: row.id}})
        break;
        case "Thay đổi sản phẩm":
            router.push({ name: 'product.edit', params: {id: row.id}})
        break;
        case "Xóa sản phẩm":
            const reply = window.confirm(`Bạn có muốn xóa sản phẩm ${row.name}?`);
            if(!reply) {
                return false;
            } else {
                await productsController.delete(row.id);
                await getProducts();
            }
        break;
    }
}

onMounted(async () => {
    await loadEmployeePayrolls();
});
</script>