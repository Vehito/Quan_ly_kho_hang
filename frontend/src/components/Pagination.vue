<template>
	<div class="mt-2">
		<loading-screen :is-loading="isLoading">
			<nav aria-label="Page navigation example">
				<ul class="pagination justify-content-center">
				<li class="page-item" :class="{disable: active===1}">
					<a class="page-link" href="#" aria-label="Previous" @click.prevent="prevPage">
						<span aria-hidden="true">&laquo;</span>
						<span class="sr-only">Previous</span>
					</a>
				</li>
				<li
					v-for="n in pageCount"
					:key="n"
					@click="onClick(n)"
					class="page-item"
					:class="{ active: active === n }"
				>
					<a class="page-link" href="#">{{ n }}</a>
				</li>
				<li class="page-item" :class="{disable: active===pageCount}">
					<a class="page-link" href="#" aria-label="Next" @click.prevent="nextPage">
						<span aria-hidden="true">&raquo;</span>
						<span class="sr-only">Next</span>
					</a>
				</li>
				</ul>
			</nav>
		</loading-screen>
	</div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue';
import LoadingScreen from './loading/LoadingScreen.vue';

const props = defineProps({
  itemQuantity: { type: Number, required: true },
  pageItemLength: { type: Number, default: 10 },
  isLoading: { type: Boolean, default: false },
});
const emits = defineEmits(['onClick:index']);

const pageCount = computed(() => Math.ceil(props.itemQuantity / props.pageItemLength));
const active = ref(1);

// Reset active to 1 when loading starts
watch(() => props.isLoading, (newVal) => {
	if (newVal) {
		active.value = 1;
	}
});

// Emit event and update active
function onClick(n) {
	active.value = n;
	emits('onClick:index', n);
}

// Optional: Previous/Next
function prevPage() {
	if (active.value > 1) {
		onClick(active.value - 1);
	}
}

function nextPage() {
	if (active.value < pageCount.value) {
		onClick(active.value + 1);
	}
}

onMounted(() => {
  	active.value = 1;
});
</script>
