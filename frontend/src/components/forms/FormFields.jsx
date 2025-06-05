import { defineComponent } from "vue";
import { Field } from "vee-validate";

const className = 'form-control';

export const BaseField = defineComponent({
    props: {
        label: {
            default: "",
            type: String,
        },
        type: {
            default: "text",
            type: String,
            validator: (type) => ['text', 'date', 'number', 'tel'].includes(type)
        },
        modelValue: {
            required: true,
            default: "",
            type: [String, Number]
        },
        placeholder: {
            default: 'Điền thông tin tại đây',
            type: String
        },
        name: {
            required: true,
            type: String
        }
    },
    emits: ['update:modelValue'],
    setup(props, { emit }) {
        return () => (
            <div>
                <label for={ props.name }>{ props.label }</label>
                <Field
                    class={ className }
                    type={ props.type }
                    value={ props.modelValue }
                    onUpdate:modelValue={
                        value => emit('update:modelValue', value)
                    }
                    placeholder={ props.placeholder }
                    name={ props.name }
                />
            </div>
        )
    }
});