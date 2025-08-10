<template>
<div :style="{ height: height + 'px', width: width + 'px', overflowY: 'auto' }"
    class="shadow">
    <slot></slot>
</div>
</template>

<script setup>
defineProps({
    height: { type: Number, default: 'auto' },
    width: { type: Number, default: 'auto' },
})
</script>