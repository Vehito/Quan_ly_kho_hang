<template>
<div class="page">
    <div class="mt-3">
        <h5 class="text-center">Lịch tuần nhân viên</h5>
        <LoadingScreen :is-loading="isLoading">
            <CustomTable :table-headers="tableHeaders"
                :table-rows="tableRows" :change-columns="changeColumns"
                :changing-condition="changingCondition"
            >
            <template #custom="{ row }">
                <button class="btn btn-outline-dark"
                    @click="router.push({ name: 'employee.edit', params: {id: row.id} })"
                >
                    Xem chi tiết
                </button>
            </template>
            </CustomTable>
        </LoadingScreen>
    </div>
</div>
</template>

<script setup>
// component
import CustomTable from '@/components/CustomTable.vue';
import LoadingScreen from '@/components/loading/LoadingScreen.vue';

// controller
import employeesController from '@/controllers/employees.controller';
import { Employee } from '@/models/employees.model';
import router from '@/router';

// more
import { computed, onMounted, ref } from 'vue';

// ref
const employees = ref([]);
const isLoading = ref(true);

// var
const arrDateInWeek = Employee.arrDateInWeek;
const tableHeaders = [
    { name: 'Mã nhân viên', key: 'id' }, { name: 'Tên nhân viên', key: 'name' },
    { name: 'T2', key: 'T2' }, { name: 'T3', key: 'T3' }, { name: 'T4', key: 'T4' },
    { name: 'T5', key: 'T5' }, { name: 'T6', key: 'T6' }, { name: 'T7', key: 'T7' },
    { name: 'CN', key: 'CN' }, { name: 'Số ngày làm việc', key: 'days' },
];
const tableRows = computed(
    () => employees.value.flatMap((employee) => {
        const result = { id: employee.id, name: employee.name, days: 0 };
        const status = employee.arr_working_days_status;
        for (const index in arrDateInWeek) {
            if(status[index]) {
                result[arrDateInWeek[index]] = arrDateInWeek[index];
                result.days++;
            } else {
                result[arrDateInWeek[index]] = 'X';
            }
        }
        return result;
    })
);
const changeColumns = ['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN'];
function changingCondition(key, value) {
    if(value!=='X') {
        return 'text-success text-center';
    } else {
        return 'text-danger text-center';
    }
}

// async
async function loadEmployees() {
    try {
        isLoading.value = true;
        employees.value = await employeesController.queryAll();
    } catch (error) {
        error?.showAlert();
    } finally {
        isLoading.value = false;
    }
}

onMounted(async () => {
    await loadEmployees();
})
</script>