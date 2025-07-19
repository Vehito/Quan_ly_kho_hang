<template>
    <LoadingButton :is-loading="isLoading"
        :btn-text="btnText" :class-content="classContent"
    >
        <button :class="classContent" @click="exportPDF">{{ btnText }}
            <i class="fa-solid fa-file-pdf"></i>
        </button>
    </LoadingButton>
</template>

<script setup>
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { base64Font } from '@/assets/fonts/TimesNewRoman';
import { base64FontBold } from '@/assets/fonts/TimesNewRomanBold';
import LoadingButton from './loading/LoadingButton.vue';
import { ref } from 'vue';

const props = defineProps({
    tableHeaders: { type: Array, required: true, default: [] },
    fileName: { type: String, default: 'Danh_sach.pdf' },
    loadFunc: { type: Function, required: true },
    tableTitle: { type: String, required: true }
});
const classContent = 'btn btn-outline-success';
const btnText = 'Xuất file PDF  ';
const isLoading = ref(false);

async function loadRows() {
    try {
        return await props.loadFunc();
    } catch (error) {
        error?.showAlert();
        isLoading.value = false;
        return [];
    }
}

async function exportPDF() {
    isLoading.value = true;
    const doc = new jsPDF();

    doc.addFileToVFS("TimesNewRoman.ttf", base64Font);
    doc.addFont("TimesNewRoman.ttf", 'TimesNewRoman', 'normal');
    doc.addFileToVFS("TimesNewRoman.ttf", base64FontBold);
    doc.addFont("TimesNewRoman.ttf", 'TimesNewRoman', 'bold');
    doc.setFont("TimesNewRoman");

    // headers
    const headers = props.tableHeaders.map(header => header.name);

    // rows
    const tableRows = await loadRows();
    if(tableRows?.length===0) {
        isLoading.value = false;
        return;
    }
    const rows = tableRows.map((row) => 
        props.tableHeaders.map((header) => row[header.key])
    );

    autoTable(doc, {
        didDrawPage: function () {
            const pageWidth = doc.internal.pageSize.getWidth();
            const text = props.tableTitle;
            const textWidth = doc.getTextWidth(text);
            const x = (pageWidth - textWidth) / 2;

            doc.setFontSize(15);
            doc.setFont('TimesNewRoman', 'bold');
            doc.text(text, x, 15);
        },
        head: [headers], body: rows,
        startY: 20,
        headStyles: {
            font: 'TimesNewRoman',
            fontStyle: 'bold',
            fontSize: 13,
            halign: 'center',
            fillColor: [150, 150, 150],
        },
        styles: {
            font: "TimesNewRoman",
            fontSize: 12,
            cellPadding: 3,
            lineWidth: 0.2,
            lineColor: [0, 0, 0],
            textColor: [0, 0, 0]
        },
    });

    doc.save(props.fileName);
    isLoading.value = false;
}

</script>