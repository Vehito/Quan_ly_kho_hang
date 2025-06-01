<script setup>
import AppHeader from "@/components/AppHeader.vue";
import SideBar from "./components/SideBar.vue";
</script>

<template>
	<div id="app">
		<SideBar />
		<AppHeader />
		<div class="container mt-3 mct">
			<RouterView />
		</div>
	</div>
</template>

<style scoped>
.page {
	margin: auto;
}
/*main content wrapper*/
.mct {
  margin-left: 200px;
  position: relative;
  min-height: 100%;
}
</style>
