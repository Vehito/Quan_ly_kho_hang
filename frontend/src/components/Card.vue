<template>
    <LoadingScreen :is-loading="isLoading">
        <div class="card shadow mb-3" :class="classCard" style="max-width: 18rem;">
            <div class="card-header" :class="classHeader">{{ headerTitle }}</div>
            <div class="card-body">
                <h5 class="card-title" :class="classTitle">{{ cardTitle }}</h5>
                <p class="card-text" :class="classText">
                    {{ cardText }}
                </p>
            </div>
        </div>
    </LoadingScreen>
</template>

<script setup>
import LoadingScreen from './loading/LoadingScreen.vue';
defineProps({
    headerTitle: { type: String, default: 'Tiêu đề' },
    cardTitle: { type: String, default: '' },
    cardText: { type: String, default: '' },
    classCard: { type: String, default: '' },
    classHeader: { type: String, default: '' },
    classTitle: { type: String, default: '' },
    classText: { type: String, default: '' },
    isLoading: { type: Boolean, default: false },
})
</script>