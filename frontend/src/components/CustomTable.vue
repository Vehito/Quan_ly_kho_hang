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

//      changeContents: { keyA: 'valueA', keyB: 'valueB',... }
        changeColumns: { type: Array, required: false, default: [] },
        changingCondition: { type: Function, required: false }
    });
    const emits = defineEmits(['clickBtn']);

    function checkCondition(key, cellValue) {
        if(props.changeColumns.find((col) => col === key) === undefined) return;
        return props.changingCondition(key, cellValue);
    }
</script>

<template>
    <table class="table table-sm table-bordered table-hover">
        <thead class="thead-light">
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
                    {{ tableRow[Object.values(tableHeaders)[0].key] }}
                </th>

                <td
                    v-for="(header, index) in tableHeaders.slice(1)"
                    :key="index"
                    :class="typeof(tableRow[header.key]) === 'string' ? 'text-left' : 'text-right'"
                >
                    <span 
                        :class="checkCondition(header.key, tableRow[header.key])"
                    >
                        {{ tableRow[header.key] }}
                    </span>
                </td>

                <slot name="custom" :row="tableRow"></slot>
            </tr>
        </tbody>
    </table>
</template>
<!-- 
<style scoped>
td, th {
    width: 50px;
    height: 20px;
    padding: 5px;
}
</style> -->
