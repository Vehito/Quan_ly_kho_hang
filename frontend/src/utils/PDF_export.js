import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { base64Font } from "@/assets/fonts/TimesNewRoman";
import { base64FontBold } from "@/assets/fonts/TimesNewRomanBold";

export function shipmentPdfExport(
//  tableHeaders: [
//      { name: "ID", key: "id" },
//      { name: "Tên sản phẩm", key: "name" },
//      { name: "Giá", key: "price" }
//  ]
    shipment, tableHeaders, isImport
) {
    const doc = new jsPDF();
    doc.addFileToVFS("TimesNewRoman.ttf", base64Font);
    doc.addFont("TimesNewRoman.ttf", 'TimesNewRoman', 'normal');
    doc.addFileToVFS("TimesNewRoman.ttf", base64FontBold);
    doc.addFont("TimesNewRoman.ttf", 'TimesNewRoman', 'bold');
    doc.setFont("TimesNewRoman");
    const pageWidth = doc.internal.pageSize.getWidth();
    const padding = 20;

    // info shipment
    const tableTitle = isImport ? 'ĐƠN NHẬP' : 'ĐƠN XUẤT';
    const fileName = `Don_${isImport ? 'nhap' : 'xuat'}_${shipment.id}`;
    const object = isImport ? 'Nhà cung cấp' : 'Khách hàng';
    const objectName = `${isImport ? 'supplier' : 'customer'}_name`;

    // headers
    const headers = tableHeaders.map(header => header.name);

    // rows
    const rows = shipment.listItem.map((row) => 
        tableHeaders.map((header) => row[header.key])
    );

    autoTable(doc, {
        didDrawPage: function () {
            // title
            doc.setFontSize(15);
            doc.setFont('TimesNewRoman', 'bold');
            const textWidth = doc.getTextWidth(tableTitle);
            const x = (pageWidth - textWidth) / 2;
            
            // info shipment
            doc.text(tableTitle, x, 15);
            doc.setFontSize(12);
            // row1
            const yRow1 = 30;
                // text 1
                doc.text(`Mã đơn hàng: ${shipment.id}`, padding, yRow1);
                // text2
                const text2r1 = `Thời gian ${shipment.text_created_at}`;
                const textWidth2r1 = doc.getTextWidth(text2r1);
                const x2r1 = (pageWidth - textWidth2r1 - padding);
                doc.text(text2r1, x2r1, yRow1);

            // row2
            const yRow2 = 40;
                // text1
                doc.text(`Người tạo: ${shipment.employee_name}`, padding, yRow2);
                // text2
                const text2r2 = `${object}: ${shipment[objectName]}`;
                const textWidth2r2 = doc.getTextWidth(text2r2);
                const x2r2 = (pageWidth - textWidth2r2 - padding);
                doc.text(text2r2, x2r2, yRow2);
        },
        head: [headers], body: rows,
        startY: 50,
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

    doc.save(fileName);
}