<script setup>
    const props = defineProps({
        isLoading: { type: Boolean, required: true }
    });
</script>

<template>
    <div v-if="isLoading" class="loading-field d-flex align-items-center">
        <strong>Đang tải...</strong>
        <div class="spinner-border ml-auto" role="status" aria-hidden="true"></div>
    </div>
    <slot v-else name="custom-field"></slot>
</template>

<style scoped>
.loading-field {
    min-width: 300px;
}
</style>
