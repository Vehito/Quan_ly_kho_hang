<script setup>
    const props = defineProps({
        name: { type: String, default: "" },

//      tableHeaders: [
//          { name: "ID", key: "id" },
//          { name: "Tên sản phẩm", key: "name" },
//          { name: "Giá", key: "price" }
//      ]
        tableHeaders: { type: Array, required: true, default: [] },
        tableRows: { type: Array, required: true, default: [] },

//      changedTextStyles: ['text-danger', 'text-primary']
        changedTextStyles: { type: Array, required: false },

//      changedColumns: [0, 3, 5]
        changedColumns: {type: Array, required: false},
        changingCondition: { type: Function, required: false }
    });
    const emits = defineEmits(['clickBtn']);

    function checkCondition(columnIndex, cellValue) {
        if(!props.changedColumns) return;
        const changedColumns = props.changedColumns;
        const shouldChange = 
            changedColumns.includes(columnIndex) &&
            props.changingCondition(cellValue);
        return shouldChange ? 
            props.changedTextStyles[changedColumns.indexOf(columnIndex)] : ''
    }
</script>

<template>
    <table class="table table-bordered">
        <thead class="thead-dark">
            <th
                scope="col"
                v-for="(tableHeader, index) in tableHeaders"
                :key="index"
                class="text-center"
            >
                {{ tableHeader.name }}
            </th>

        </thead>

        <tbody>
            <tr
                v-for="(tableRow, index) in tableRows"
                :key="index"
            >
                <th scope="row">
                    {{ Object.values(tableRow)[0] ?? tableRow.values().next().value }}
                </th>

                <td
                    v-for="(header, index) in tableHeaders.slice(1)"
                    :key="index"
                    :class="typeof(tableRow[header.key]) === 'string' ? 'text-left' : 'text-right'"
                >
                    <span 
                        :class="checkCondition(index, tableRow[header.key])"
                    >
                        {{ tableRow[header.key] }}
                    </span>
                </td>

                <td>
                    <slot name="custom" :row="tableRow"></slot>
                </td>
            </tr>
        </tbody>
    </table>
</template>

<style scoped>
td, th {
    width: 50px;
    height: 20px;
    padding: 5px;
}
</style>
