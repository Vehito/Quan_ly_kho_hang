<script setup>
import AppHeader from "@/components/AppHeader.vue";
import SideBar from "./components/SideBar.vue";
</script>

<template>
	<div id="app">
		<SideBar />
		<AppHeader />
		<div class="container mt-3">
			<RouterView />
		</div>
	</div>
</template>

<style scoped>
.page {
	margin: auto;
  	margin-left: 150px;
	position: relative;
  	min-height: 100%;
}
</style>
