<template>
<button v-if="isLoading" :class="classContent" type="button" disabled>
    <span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
    {{ btnText ?? 'Loading...' }}
</button>
<slot v-else></slot>
</template>

<script setup>
const props = defineProps({
    btnText: { type: String, required: true },
    classContent: { type: String, default: "btn btn-primary" },
    isLoading: { type: Boolean, default: false }
})
</script>