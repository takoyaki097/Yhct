/**
 * FILE: modules_print/print-templates.js
 * CHUC NANG: HTML mau cho ban in A4 & Hoa don
 */

window.fmtMoney = function(n) {
    return parseInt(n || 0).toLocaleString('vi-VN');
};

window.generatePrintHeader = function(clinicTitle, doctorName, date, patient, disease, symptoms) {
    return `
    <div style="display:flex; justify-content:space-between; align-items:flex-start; border-bottom:2px solid #000; padding-bottom:5px; margin-bottom:10px; font-family:'Times New Roman',serif; color:#000;">
        <div style="text-align:left;">
            <h1 style="margin:0; font-size:14pt; font-weight:bold; text-transform:uppercase;">${clinicTitle}</h1>
            <p style="margin:2px 0; font-size:10pt;"><b>BS:</b> ${doctorName}</p>
        </div>
        <div style="text-align:right;">
            <p style="margin:0; font-size:10pt;">Ngày: <b>${date}</b></p>
            <p style="margin:0; font-size:10pt;">Mã BN: ${patient.phone ? patient.phone.slice(-4) : '....'}</p>
        </div>
    </div>
    <div style="margin-bottom:10px; font-size:11pt; line-height:1.3; color:#000;">
        <div><b>Họ tên:</b> <span style="text-transform:uppercase; font-weight:bold;">${patient.name}</span> (${patient.year}) - <b>Đ/c:</b> ${patient.address || ''}</div>
        <div style="margin-top:3px;"><b>Chẩn đoán:</b> ${disease}</div>
        ${symptoms ? `<div style="margin-top:3px;"><b>Triệu chứng:</b> <i>${symptoms}</i></div>` : ''}
    </div>`;
};

window.generatePrintFooter = function(doctorName) {
    const today = new Date();
    return `
    <div style="margin-top:15px; display:grid; grid-template-columns:1fr 1fr; text-align:center; font-family:'Times New Roman',serif; font-size:11pt; color:#000; page-break-inside:avoid;">
        <div></div>
        <div>
            <p><i>Ngày ${today.getDate()} tháng ${today.getMonth() + 1} năm ${today.getFullYear()}</i></p>
            <p><b>Bác sĩ điều trị</b></p>
            <div style="margin-top:50px; font-weight:bold;">${doctorName.replace('BS. ', '')}</div>
        </div>
    </div>`;
};
