<script setup>
import { Field } from "vee-validate";
const props = defineProps({
    label: { default: "", type: String },
    options: { default: [], type: Array },
    type: {
        default: "text",
        type: String,
        validator: (type) => ['text', 'date', 'number', 'tel', 'password', 'select', 'textarea', 'hidden'].includes(type)
    },
    modelValue: {
        required: true,
        default: "",
        type: [String, Number, Date, Boolean]
    },
    placeholder: { default: 'Điền thông tin tại đây', type: String },
    name: { required: true, type: String },
    icon: { type: String, required: false },
});

const emits = defineEmits(["update:modelValue"]);
</script>

<template>
    <div v-if="type==='select'">
        <label class="form-label" :for="name">{{ label }}</label>
        <Field
            class="form-control"
            as="select"
            :value="modelValue ?? ''"
            :name="name"
            :id="name"
            @update:modelValue="value => emits('update:modelValue', value)"
            @change=""
        >
            <option disabled>--{{ placeholder ?? label }}--</option>
            <option 
                v-for="option in options"
                :key="option.id"
                :value="option.id">{{ option.name }}</option>
        </Field>
    </div>

    <div v-else-if="type==='textarea'">
        <label class="form-label" :for="name">{{ label }}</label>
        <Field
            class="form-control"
            as="textarea"
            :name="name"
            :id="name"
            :placeholder="placeholder"
            rows="3"
            :value="modelValue"
            @input="e=> emits('update:modelValue', e.target.value)"
        />
    </div>

    <div v-else>
        <label class="form-label" :for=name>{{ label }}</label>
        <Field
            class="form-control"
            :type="type"
            :value="modelValue"
            @update:modelValue="value => emits('update:modelValue', value)"
            :placeholder="placeholder"
            :name="name"
            :id="name"
        />
    </div>
</template>

 <style scoped>
.select {
    border: solid 1px rgb(128, 128, 128, .3);
    border-radius: 30px;
    padding: 8px;
}
</style>