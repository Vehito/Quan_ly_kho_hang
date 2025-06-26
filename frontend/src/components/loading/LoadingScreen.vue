<template>
  	<div class="loading-overlay" v-if="isLoading">
    	<div class="spinner-border text-primary" role="status">
      		<span class="visually-hidden"></span>
    	</div>
		Đang tải...
  </div>

	<slot v-else></slot>
</template>

<script setup>
const props = defineProps({
	isLoading: { type: Boolean, required: true }
})
</script>