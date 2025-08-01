<template>
<div class="page">
        <ButtonCollapse :btn-classes="buttonCollapse.btnClass"
            :btn-texts="buttonCollapse.btnText" :ids="buttonCollapse.ids"
        >
        <template #default="{ index }">
            <FilterMenu :time-fields="true" init-time="year" @update:values="updateValues" />
        </template>
    </ButtonCollapse>
    <div class="mt-2">
        <h6 class="mb-2 text-center">{{ tableTitle }}</h6>
        <LoadingScreen :is-loading="isLoading.employee_payroll.value">
            <CustomTable :table-headers="tableHeaders" :table-rows="monthlyPayrolls">
                <template #custom="{ row }">
                    <DropdownBtn :dropdown-items="dropdownBtn.items"
                        @select:value="(selectedAction) => dropdownBtn.handleAction(selectedAction, row)"
                    >
                        <template #label>
                            <i class="fa-solid fa-bars"></i>
                        </template>
                    </DropdownBtn>
                </template>
            </CustomTable>
        </LoadingScreen>
        <Pagination :is-loading="isLoading.quantity.value" :item-quantity="numberOfItems" @on-click:index="changePage" />
    </div>
    <MonthlyPayrollForm @on-create="updateValues"/>
</div>
</template>

<script setup>
// components
import CustomTable from '@/components/CustomTable.vue';
import LoadingScreen from '@/components/loading/LoadingScreen.vue';
import FilterMenu from '@/components/FilterMenu.vue';
import ButtonCollapse from '@/components/ButtonCollapse.vue';
import { DropdownBtn } from '@/utils/buttons.util';
import Pagination from '@/components/Pagination.vue';
import MonthlyPayrollForm from '@/components/forms/MonthlyPayrollForm.vue';

// controllers
import monthly_payrollsController from '@/controllers/monthly_payrolls.controller';

// more
import { onMounted, ref } from 'vue';
import date_helperUtil from '@/utils/date_helper.util';
import router from '@/router';

// ref
const monthlyPayrolls = ref([]);
const isLoading = { employee_payroll: ref(true), quantity: ref(true) };
const numberOfItems = ref(0);
const tableTitle = ref('');

// var
const today = new Date();
const conditions = {start: undefined, end: undefined, limit: 10, offset: 0};
const buttonCollapse = {
    btnText: ['Bộ lọc'], btnClass: ['btn btn-outline-dark'], ids: ['filter_btn']
};
const tableHeaders = [
    { name: 'Mã số', key: 'id' },
    { name: 'Tên bảng lương', key: 'name' },
    { name: 'Ngày thanh toán', key: 'text_finalized_day' },
    { name: 'Tạo bởi', key: 'employee_name' },
    { name: 'Thời gian tạo', key: 'text_created_at' },
    { name: 'Số nhân viên', key: 'employee_payroll_quantity' },
    { name: 'Số tiền thực nhận', key: 'formatted_total_amount' },
];
const dropdownBtn = {
    items: ['Xem chi tiết', 'Xóa bảng lương'],
    handleAction(selectedAction, row) {
        switch(selectedAction) {
            case 'Xem chi tiết':
                const year = row.payroll_month.slice(0, 4);
                const month = Number(row.payroll_month.slice(5, 7))+1;
                router.push({ 
                    name: 'employee_payrolls',
                    params: {payroll_month: `${year}-${month}`}
                })
        }
    }
};

// asyn
async function loadMonthlyPayrolls() {
    try {
        isLoading.employee_payroll.value = true;
        monthlyPayrolls.value = await monthly_payrollsController.queryAll(conditions);
    } catch (error) {
        error?.showAlert();
    } finally {
        isLoading.employee_payroll.value = false;
    }
}
async function loadQuantity() {
    try {
        isLoading.quantity.value = true;
        numberOfItems.value = await monthly_payrollsController.queryCount(
            { start: conditions.start, end: conditions.end }, true
        );
        tableTitle.value = `Bảng lương từ ${conditions.start.split(' ')[0]} đến ${conditions.end.split(' ')[0]}`;
    } catch (error) {
        error?.showAlert();
    } finally {
        isLoading.quantity.value = false;
    }
}
async function updateValues(values) {
    conditions.offset = 0;
    conditions.start = date_helperUtil.formatDateForMySQL(values.start);
    conditions.end = date_helperUtil.formatDateForMySQL(values.end);
    await loadQuantity();
    await loadMonthlyPayrolls();
}
async function changePage(index) {
    conditions.offset = 10 * (index-1);
    await loadMonthlyPayrolls();
}

onMounted(async () => {
    const { start , end } = date_helperUtil.getPeriod('year');
    conditions.start = date_helperUtil.formatDateForMySQL(start);
    conditions.end = date_helperUtil.formatDateForMySQL(end);

    await loadQuantity();
    await loadMonthlyPayrolls();
});
</script>