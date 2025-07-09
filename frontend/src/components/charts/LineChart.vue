<script setup>
import LoadingScreen from '../loading/LoadingScreen.vue';
import { ChartObject} from './ChartObject';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import { Line } from 'vue-chartjs';
// import * as chartConfig from './chartConfig.js';
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

// props
const props = defineProps({
    isLoading: { type: Boolean, default: false },
    data: { type: ChartObject, required: true },
})
</script>

<template>
    <LoadingScreen :is-loading="isLoading">
        <Line :data="data"/>
    </LoadingScreen>
</template>