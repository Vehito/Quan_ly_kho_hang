<script setup>
import { Field } from "vee-validate";
import LoadingField from "../loading/LoadingField.vue";
const props = defineProps({
    label: { default: "", type: String },
    options: { default: [], type: Array },
    isLoading: { type: Boolean, default: false },
    type: {
        default: "text",
        type: String,
        validator: (type) => ['text', 'date', 'number', 'tel', 'password', 'select', 'textarea', 'checkbox', 'hidden'].includes(type)
    },
    modelValue: {
        required: false,
        default: "",
        type: [String, Number, Date, Boolean, null]
    },
    placeholder: { default: 'Điền thông tin tại đây', type: String },
    name: { required: true, type: String },
    icon: { type: String, required: false },
    disabled: { type: Boolean, default: false },
});

const emits = defineEmits(["update:modelValue"]);
</script>

<template>
    <label class="form-label" :for="name"><strong>{{ label }}</strong></label>
    <LoadingField :isLoading="isLoading">
        <template #custom-field>
            <div v-if="type==='select'">
                <Field
                    class="form-control shadow"
                    :disabled="disabled"
                    as="select"
                    :value="modelValue ?? ''"
                    :name="name"
                    :id="name"
                    @update:modelValue="value => emits('update:modelValue', value)"
                >
                    <option disabled>--{{ placeholder ?? label }}--</option>
                    <option 
                        v-for="option in options"
                        :key="option.id"
                        :value="option.id">{{ option.name }}</option>
                </Field>
            </div>

            <div v-else-if="type==='hidden'">
                <Field
                    class="form-control"
                    :name="name"
                    :id="name"
                    hidden
                    :model-value="modelValue ?? ''"
                    disable
                />
            </div>

            <div v-else-if="type==='textarea'">
                <Field
                    class="form-control shadow"
                    as="textarea"
                    :disabled="disabled"
                    :name="name"
                    :id="name"
                    :placeholder="placeholder"
                    rows="3"
                    :value="modelValue"
                    @input="e=> emits('update:modelValue', e.target.value)"
                />
            </div>

            <div v-else-if="type === 'checkbox'">
                <div class="row">
                    <div v-for="(option, index) in options" class="col" :key="index">
                        <Field
                            class="form-control shadow"
                            type="checkbox"
                            :name="name"
                            :value="option.id"
                            :disabled="disabled"
                            v-slot="{ field }"
                        >
                            <input 
                                @input="e => emits('update:modelValue', { value: e.target.checked ? option.id : undefined, index: index })"
                                type="checkbox" v-bind="field" :checked="option.checked ?? false" />
                            {{ option.name }}
                        </Field>
                        <hr>
                    </div>
                </div>
            </div>

            <div v-else>
                <Field
                    class="form-control shadow"
                    :type="type"
                    :value="modelValue"
                    :disabled="disabled"
                    @update:modelValue="value => emits('update:modelValue', value)"
                    :placeholder="placeholder"
                    :name="name"
                    :id="name"
                />
            </div>
        </template>
    </LoadingField>
</template>

<style scoped>
.select {
    border: solid 1px rgb(128, 128, 128, .3);
    border-radius: 30px;
    padding: 8px;
}
</style>