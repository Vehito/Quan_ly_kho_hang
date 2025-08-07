<template>
<div class="page">
    <LoadingScreen :is-loading="isLoading">
        <EmployeePayrollForm
            v-if="employee_payroll"
            :employee-payroll="employee_payroll"
            @submit:employee_payroll="updateEmployeePayrolls"
        />
    </LoadingScreen>
</div>
</template>

<script setup>
import EmployeePayrollForm from '@/components/forms/EmployeePayrollForm.vue';
import LoadingScreen from '@/components/loading/LoadingScreen.vue';
import employee_payrollsController from '@/controllers/employee_payrolls.controller';
import router from '@/router';
import { onMounted, ref } from 'vue';
import { useRoute } from 'vue-router';

const props = defineProps({
    id: { required: true, type: String }
});

const route = useRoute();

const employee_payroll = ref(null);
const isLoading = ref(true);

async function getEmployeePayrolls(id) {
    try {
        isLoading.value = true;
        employee_payroll.value = await employee_payrollsController.queryById(Number(id));
    } catch (error) {
        console.log(error);
        router.push({
            name: "notfound",
            params: {
                pathMatch: route.path.split("/").slice(1)
            },
            query: route.query,
            hash: route.hash
        });
    } finally {
        isLoading.value = false;
    }
}


async function updateEmployeePayrolls(data) {
    try {
        await employee_payrollsController.update(employee_payroll.value.id, data);
        router.push({name: "monthly_payrolls", params: {id: data.monthly_payroll_id}});
    } catch (error) {
        error?.showAlert();
    }   
}

onMounted(async () => {
    await getEmployeePayrolls(props.id);
});
</script>