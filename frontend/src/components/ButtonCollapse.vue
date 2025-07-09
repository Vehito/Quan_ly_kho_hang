<template>
  <p class="row">
    <button
      v-for="(btnText, index) in btnTexts"
      :key="index"
      class="btn col mr-3"
      :class="btnClasses[index] ?? ''"
      type="button"
      data-toggle="collapse"
      :data-target="'#' + ids[index]"
      :aria-controls="ids[index]"
      :title="btnText"
    >
      {{ btnText }}
    </button>
  </p>

<div class="row">
    <div v-for="(btnText, index) in btnTexts" :key="index" class="col-12">
        <div
            class="collapse"
            :id="ids[index]"
        >
            <slot :index="index"></slot>
        </div>
    </div>
</div>
</template>

<script setup>

const props = defineProps({
	btnClasses: { type: Array, default: () => [] },
	btnTexts: { type: Array, required: true },
	ids: { type: Array, required: true }
});

</script>
