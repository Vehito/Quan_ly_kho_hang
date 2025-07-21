<script setup>
import AppHeader from "@/components/AppHeader.vue";
import SideBar from "./components/SideBar.vue";
import { ref } from "vue";

const listItem = ref([]);

function updateSidebarIndex(list) {
	listItem.value = list;
}
</script>

<template>
	<div id="app container">
		<SideBar @click:list-item="listItem => updateSidebarIndex(listItem)"/>
		<AppHeader :list-item="listItem"/>
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
