import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { base64Font } from "@/assets/fonts/TimesNewRoman";
import { base64FontBold } from "@/assets/fonts/TimesNewRomanBold";
import date_helperUtil from "./date_helper.util";

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

    const today = new Date();

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

    rows.push(isImport 
        ? ['Tổng cộng', '', '', '', '', shipment.formatted_total]
        : ['Tổng cộng', '', '', '', shipment.formatted_total]
    );

    autoTable(doc, {
        didDrawPage: function () {
            // title
            doc.setFontSize(15);
            doc.setFont('TimesNewRoman', 'bold');
            let textWidth = doc.getTextWidth(tableTitle);
            let x = (pageWidth - textWidth) / 2;
            doc.text(tableTitle, x, 15);

            // print time
            doc.setFontSize(12);
            const timeText = `Thời gian in: ${date_helperUtil.getStringDateTime(today)}`
            textWidth = doc.getTextWidth(timeText);
            x = (pageWidth - textWidth) / 2;
            doc.text(timeText, x, 20);

            // info shipment
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
            fillColor: [200, 200, 200],
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

export function employeePayrollPdfExport(employeePayroll) {
    const doc = new jsPDF();

    doc.addFileToVFS("TimesNewRoman.ttf", base64Font);
    doc.addFont("TimesNewRoman.ttf", 'TimesNewRoman', 'normal');
    doc.addFileToVFS("TimesNewRoman.ttf", base64FontBold);
    doc.addFont("TimesNewRoman.ttf", 'TimesNewRoman', 'bold');
    doc.setFont("TimesNewRoman");
    const pageWidth = doc.internal.pageSize.getWidth();
    const padding = 20;

    // Tiêu đề
    doc.setFontSize(20);
    doc.setFont('TimesNewRoman', 'bold');
    doc.text(`${employeePayroll.text_payroll_month} Hằng tháng (Bảng lương)`,
        105, 20, { align: "center" });

    // Tên công ty
    doc.setFontSize(10);
    doc.setFont('TimesNewRoman', 'normal');
    doc.text("CÔNG TY CỔ PHẦN ABC", 200, 30, { align: "right" });

    // Bảng nhân viên
    const empInfo = [
        [
            "Mã nhân viên", employeePayroll.employee_id,
            "Tên", employeePayroll.employee_name,
        ],
        [
            "Phòng ban", employeePayroll.department_name,
            "Tình trạng", employeePayroll.text_recorded_payment
        ]
    ];
    autoTable(doc, {
        startY: 40,
        head: [],
        body: empInfo,
        styles: {
            font: "TimesNewRoman",
            fontSize: 12,
            cellPadding: 3,
            lineWidth: 0.2,
            lineColor: [0, 0, 0],
            textColor: [0, 0, 0]
        },
        theme: "grid",
        tableLineWidth: 0.1,
        columnStyles: {
            0: {
                font: 'TimesNewRoman',
                fontStyle: 'bold',
                fontSize: 13,
                halign: 'center',
                fillColor: [200, 200, 200],
            },
            2: { 
                font: 'TimesNewRoman',
                fontStyle: 'bold',
                fontSize: 13,
                halign: 'center',
                fillColor: [200, 200, 200],
            },
            4: { 
                font: 'TimesNewRoman',
                fontStyle: 'bold',
                fontSize: 13,
                halign: 'center',
                fillColor: [200, 200, 200],
            },
            6: { 
                font: 'TimesNewRoman',
                fontStyle: 'bold',
                fontSize: 13,
                halign: 'center',
                fillColor: [200, 200, 200],
            },
        },
    });

    // Bảng tổng kết
    const totalInfo = [
        ["Tổng thu nhập", employeePayroll.formatted_total_income,
         "Tổng giảm trừ", employeePayroll.formatted_total_deduction,
         "Số tiền thực nhận", employeePayroll.formatted_net_salary
        ]
    ];
    autoTable(doc, {
        startY: 70,
        head: [],
        body: totalInfo,
        styles: {
            font: "TimesNewRoman",
            fontSize: 12,
            cellPadding: 3,
            lineWidth: 0.2,
            lineColor: [0, 0, 0],
            textColor: [0, 0, 0]
        },
        theme: "grid",
        tableLineWidth: 0.1,
columnStyles: {
            0: {
                font: 'TimesNewRoman',
                fontStyle: 'bold',
                fontSize: 13,
                halign: 'center',
                fillColor: [200, 200, 200],
            },
            2: { 
                font: 'TimesNewRoman',
                fontStyle: 'bold',
                fontSize: 13,
                halign: 'center',
                fillColor: [200, 200, 200],
            },
            4: { 
                font: 'TimesNewRoman',
                fontStyle: 'bold',
                fontSize: 13,
                halign: 'center',
                fillColor: [200, 200, 200],
            },
        },
    });

    // Phụ cấp
    const allowanceInfo = [
        ["Lương cơ bản theo hợp đồng", "", employeePayroll.formatted_basic_month_salary],
        ["Phụ cấp cơm trưa", "", employeePayroll.formatted_lunch_allowance],
        ["Phụ cấp trách nhiệm", "", employeePayroll.formatted_resposibility_allowances],
        [
            "Phụ cấp khác", 
            employeePayroll.other_allowances_description,
            employeePayroll.formatted_other_allowances
        ],
        ["Tổng cộng", '', employeePayroll.formatted_total_income]
    ];
    autoTable(doc, {
        startY: 90,
        head: [["Tên mục phụ cấp", "Ghi chú", "Số tiền"]],
        body: allowanceInfo,
        headStyles: {
            font: 'TimesNewRoman',
            fontStyle: 'bold',
            fontSize: 13,
            halign: 'center',
            fillColor: [200, 200, 200],
        },
        styles: {
            font: "TimesNewRoman",
            fontSize: 12,
            cellPadding: 3,
            lineWidth: 0.2,
            lineColor: [0, 0, 0],
            textColor: [0, 0, 0]
        },
        theme: "grid"
    });

    // Khấu trừ
    const deductionInfo = [
        ["Bảo hiểm y tế", "", employeePayroll.formatted_health_insurance],
        ["Bảo hiểm xã hội", "", employeePayroll.formatted_social_insurance],
        ["Bảo hiểm thất nghiệp", "", employeePayroll.formatted_unemloyment_insurance],
        ["Thuế thu nhập cá nhân", "", employeePayroll.formatted_persenal_tax_deduction],
        [
            "Khấu trừ khác", 
            employeePayroll.other_dedutions_description,
            employeePayroll.formatted_other_deductions
        ],
        ["Tổng cộng", '', employeePayroll.formatted_total_income]
    ];
    autoTable(doc, {
        startY: doc.lastAutoTable.finalY + 10,
        head: [["Tên mục khấu trừ", 'Ghi chú', "Số tiền"]],
        body: deductionInfo,
        headStyles: {
            font: 'TimesNewRoman',
            fontStyle: 'bold',
            fontSize: 13,
            halign: 'center',
            fillColor: [200, 200, 200],
        },
        styles: {
            font: "TimesNewRoman",
            fontSize: 12,
            cellPadding: 3,
            lineWidth: 0.2,
            lineColor: [0, 0, 0],
            textColor: [0, 0, 0]
        },
        theme: "grid"
    });

    doc.save(`bang_luong_${employeePayroll.employee_id}.pdf`);
}

export function monthlyPayrollDetailPdfExport(monthlyPayroll) {
    
}