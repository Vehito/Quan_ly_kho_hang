<script setup>
import AppHeader from "@/components/AppHeader.vue";
import SideBar from "./components/SideBar.vue";
import { ref } from "vue";

const sidebarIndex = ref(0);

function updateSidebarIndex(index) {
	sidebarIndex.value = index;
}
</script>

<template>
	<div id="app container">
		<SideBar @click:index="index => updateSidebarIndex(index)"/>
		<AppHeader :sidebar-index="sidebarIndex"/>
		<div class="page">
			<RouterView />
		</div>
	</div>
</template>

<style scoped>
.page {
	margin: auto;
  	margin-left: 110px;
	position: relative;
  	min-height: 100%;
	padding: 10px;
}

.fields {
    border: .5px solid rgb(128, 128, 128, .5);
    border-radius: 10px;
    padding: 10px;
    width: fit-content;
}
</style>
