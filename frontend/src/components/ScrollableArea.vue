<template>
<div :style="{ height: height + 'px', width: width + 'px', overflowY: 'auto', border: '1px solid #ccc' }"
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