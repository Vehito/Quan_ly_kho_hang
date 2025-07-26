<script setup>
import LoadingScreen from '../loading/LoadingScreen.vue';
import { ChartObject} from './ChartObject';
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale
} from 'chart.js'
import { Bar } from 'vue-chartjs';
// import * as chartConfig from './chartConfig.js';
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend)

// props
const props = defineProps({
    isLoading: { type: Boolean, default: false },
    data: { type: ChartObject, required: true },
})
</script>

<template>
    <LoadingScreen :is-loading="isLoading">
        <Bar :data="data"/>
    </LoadingScreen>
</template>