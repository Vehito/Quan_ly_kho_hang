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
	<div id="app" class="container">
		<div class="row">
			<div class="col">
				<SideBar @click:index="index => updateSidebarIndex(index)"/>
			</div>
			<div class="col-10">
				<AppHeader :sidebar-index="sidebarIndex"/>
				<div class="mt-3">
					<RouterView />
				</div>
			</div>
		</div>
	</div>
</template>

<style scoped>
/* .page {
	margin: auto;
  	margin-left: 150px;
	position: relative;
  	min-height: 100%;
} */

.fields {
    border: .5px solid rgb(128, 128, 128, .5);
    border-radius: 10px;
    padding: 10px;
    width: fit-content;
}
</style>
