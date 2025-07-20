import { defineComponent } from "vue";

export const DropdownBtn = defineComponent({
    props: {
        dropdownItems: { required: true, type: Array },
    },
    emits: ['select:value'],
    setup(props, { emit, slots }) {
        return () => (
            <div class="dropdown">
                <button 
                    class="btn btn-block btn-outline-dark dropdown-toggle"
                    type="button"
                    id="dropdownMenuButton"
                    data-toggle="dropdown" 
                    aria-haspopup="true" 
                    aria-expanded="false"
                >
                    { slots.label ? slots.label() : 'Dropdown button' }
                </button>
                <div class="dropdown-menu" aria-labelledby="dropdownMenuButton">
                    {
                        props.dropdownItems.map((item, index) => (
                            <a 
                                class="dropdown-item"
                                key={ index }
                                onClick={() => emit("select:value", item)}
                            >
                                { item }
                            </a>
                        ))
                    }
                </div>
            </div>
        );
    }
});