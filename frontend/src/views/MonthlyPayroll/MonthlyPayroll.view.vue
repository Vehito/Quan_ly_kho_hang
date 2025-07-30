<template>

</template>

<script setup>
// components
import CustomTable from '@/components/CustomTable.vue';

// controllers
import monthly_payrollsController from '@/controllers/monthly_payrolls.controller';
import { MonthlyPayroll } from '@/models/monthly_payrolls.model';

// ref
const monthlyPayrolls = ref([new MonthlyPayroll({})])

// asyn
async function loadMonthly(params) {
    
}
</script>