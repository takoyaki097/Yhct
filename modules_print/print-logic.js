{
type: uploaded file
fileName: modules_print.zip/modules_print/print-logic.js
fullContent:
/**
 * FILE: modules_print/print-logic.js
 * CHUC NANG: Logic chuan bi du lieu, tinh toan & goi lenh in.
 * CẬP NHẬT: Hiển thị phí Sắc thuốc trên Hóa đơn & Ghi chú trên Đơn thuốc.
 */

window.preparePrint = function(type) {
    try {
        const pid = document.getElementById('vPid').value; 
        const p = (window.db || []).find(x => x.id == pid); 
        if (!p) return alert("Chưa chọn bệnh nhân!");

        // Lấy dữ liệu Visit hiện tại
        const visitData = window.currentVisit || { rxEast: [], rxWest: [], procs: [] };
        
        // Thông tin phòng khám
        const clinicTitle = window.config.clinicTitle || 'PHÒNG KHÁM YHCT';
        const doctorName = window.config.doctorName ? 'BS. ' + window.config.doctorName : 'BS. Đông Y';
        const visitDate = document.getElementById('vDate').value.split('-').reverse().join('/');
        const disease = document.getElementById('vDiseaseSelect').value || document.getElementById('vDiseaseInput').value;
        const symptoms = document.getElementById('vSpecial').value || '';
        
        // Header & Footer chung
        const headerHtml = window.generatePrintHeader(clinicTitle, doctorName, visitDate, p, disease, symptoms);
        const footerHtml = window.generatePrintFooter(doctorName);

        // Lấy thông tin đầu vào từ giao diện
        const manualPriceEast = parseInt(document.getElementById('vEastManualPrice').value) || 0;
        const manualPriceWest = parseInt(document.getElementById('vWestManualPrice').value) || 0;
        const eastDays = parseInt(document.getElementById('vEastDays').value) || 1;
        const westDays = parseInt(document.getElementById('vWestDays').value) || 1;

        // [MỚI] Lấy thông tin Sắc thuốc
        const decCheck = document.getElementById('vDecoctionCheck');
        const isDecoction = decCheck ? decCheck.checked : false;
        const decCount = isDecoction ? (parseInt(document.getElementById('vDecoctionCount').value) || 0) : 0;
        const decPrice = isDecoction ? (parseInt(document.getElementById('vDecoctionPrice').value) || 0) : 0;
        const decTotal = decCount * decPrice;

        // --- TÍNH TOÁN TIỀN ---
        // 1. Tiền Đông Y
        let calcEastTotal = 0;
        if (manualPriceEast > 0) {
            calcEastTotal = manualPriceEast * eastDays;
        } else {
            const sumIng = visitData.rxEast.reduce((acc, cur) => acc + ((cur.qty||0) * (cur.price||0)), 0);
            calcEastTotal = sumIng * eastDays;
        }

        // 2. Tiền Tây Y
        let calcWestTotal = 0;
        if (manualPriceWest > 0) {
            calcWestTotal = manualPriceWest * westDays;
        } else {
            calcWestTotal = visitData.rxWest.reduce((acc, cur) => acc + ((cur.qty||0) * (cur.price||0)), 0);
        }

        // 3. Tiền Thủ thuật
        let calcProcTotal = 0;
        visitData.procs.forEach(p => {
            calcProcTotal += Math.round((p.price||0)*(p.days||1)*(1-(p.discount||0)/100));
        });

        // 4. Tổng cộng (Bao gồm Sắc thuốc)
        const rawTotal = calcEastTotal + calcWestTotal + calcProcTotal + decTotal;
        const discountPercent = parseInt(document.getElementById('vDiscountPercent').value) || 0;
        const finalTotal = Math.round(rawTotal * (1 - discountPercent/100));

        // Ẩn tất cả section trước khi in
        document.querySelectorAll('.print-section').forEach(el => el.classList.add('hidden'));

        // ============================================================
        // TYPE 1: IN ĐƠN ĐÔNG Y
        // ============================================================
        if (type === 'east') {
            const container = document.getElementById('printEast');
            container.classList.remove('hidden');
            
            let rows = visitData.rxEast.map((m, i) => 
                `<tr style="border-bottom:1px dotted #ccc;">
                    <td style="width:30px; text-align:center;">${i+1}</td>
                    <td style="font-weight:bold;">${m.name}</td>
                    <td style="width:60px; text-align:right;">${m.qty} g</td>
                </tr>`).join('');
            
            // [MỚI] Thêm ghi chú sắc thuốc vào phần Hướng dẫn
            let guideText = document.getElementById('vEastNote').value;
            if (isDecoction) {
                guideText = `<b>[YÊU CẦU: SẮC THUỐC ĐÓNG TÚI - ${decCount} LẦN]</b><br>` + guideText;
            }

            // Hiển thị thành tiền nếu có nhập giá trọn gói hoặc có sắc thuốc
            let priceRow = "";
            if (manualPriceEast > 0 || decTotal > 0) {
                // Nếu có sắc thuốc, hiển thị tách dòng cho rõ
                let detailPrice = "";
                if(decTotal > 0) detailPrice = `<br><span style="font-weight:normal; font-size:10pt;">(Tiền thuốc: ${window.fmtMoney(calcEastTotal)} + Công sắc: ${window.fmtMoney(decTotal)})</span>`;
                
                priceRow = `<div style="text-align:right; font-weight:bold; margin-top:10px; font-size:12pt;">
                    Tổng tiền Đông Y: ${window.fmtMoney(calcEastTotal + decTotal)} đ ${detailPrice}
                </div>`;
            }

            container.innerHTML = `
                ${headerHtml}
                <div style="text-align:center; margin-bottom:10px;"><h2 style="margin:0; font-size:16pt; text-transform:uppercase;">Đơn Thuốc Đông Y</h2><p>(${eastDays} thang)</p></div>
                <table style="width:100%; border-collapse:collapse; font-size:11pt;">
                    <thead><tr style="border-bottom:1px solid #000;"><th style="text-align:center;">STT</th><th style="text-align:left;">Vị thuốc</th><th style="text-align:right;">KL</th></tr></thead>
                    <tbody>${rows}</tbody>
                </table>
                <div style="margin-top:10px; font-size:11pt;"><b>Hướng dẫn:</b> <i>${guideText}</i></div>
                ${priceRow}
                ${footerHtml}`;
        }

        // ============================================================
        // TYPE 2: IN ĐƠN TÂY Y
        // ============================================================
        else if (type === 'west') {
            const container = document.getElementById('printWest');
            container.classList.remove('hidden');

            let rows = visitData.rxWest.map((m, i) => 
                `<tr style="border-bottom:1px dotted #ccc;">
                    <td style="width:30px; text-align:center; vertical-align:top; padding-top:5px;">${i+1}</td>
                    <td style="padding-top:5px;">
                        <div style="font-weight:bold;">${m.name}</div>
                        <div style="font-size:10pt; font-style:italic;">${m.usage || ''}</div>
                    </td>
                    <td style="width:50px; text-align:center; vertical-align:top; padding-top:5px; font-weight:bold;">${m.qty}</td>
                </tr>`).join('');

            let priceRow = manualPriceWest > 0 ? `<div style="text-align:right; font-weight:bold; margin-top:10px; font-size:12pt;">Thành tiền: ${window.fmtMoney(calcWestTotal)} đ</div>` : '';

            container.innerHTML = `
                ${headerHtml}
                <div style="text-align:center; margin-bottom:10px;"><h2 style="margin:0; font-size:16pt; text-transform:uppercase;">Đơn Thuốc Tây Y</h2><p>(Dùng trong ${westDays} ngày)</p></div>
                <table style="width:100%; border-collapse:collapse; font-size:11pt;">
                    <thead><tr style="border-bottom:1px solid #000;"><th style="text-align:center;">STT</th><th style="text-align:left;">Tên thuốc / Cách dùng</th><th style="text-align:center;">SL</th></tr></thead>
                    <tbody>${rows}</tbody>
                </table>
                <div style="margin-top:10px; font-size:11pt;"><b>Lời dặn:</b> <i>${document.getElementById('vWestNote').value}</i></div>
                ${priceRow}
                ${footerHtml}`;
        }

        // ============================================================
        // TYPE 3: IN CẢ HAI
        // ============================================================
        else if (type === 'both') {
            const container = document.getElementById('printBoth');
            container.classList.remove('hidden');
            
            let content = headerHtml;
            
            // Đông Y
            if (visitData.rxEast.length > 0) {
                let rowsE = visitData.rxEast.map((m, i) => `${m.name}(${m.qty}g)`).join(', ');
                let guideE = document.getElementById('vEastNote').value;
                if (isDecoction) guideE = `<b>[YÊU CẦU SẮC THUỐC: ${decCount} LẦN]</b>. ` + guideE;

                content += `<div style="margin-bottom:15px; border:1px solid #ccc; padding:10px; border-radius:5px;">
                    <div style="font-weight:bold; border-bottom:1px dashed #ccc; padding-bottom:5px; margin-bottom:5px;">I. ĐÔNG Y (${eastDays} thang)</div>
                    <div style="text-align:justify; font-size:11pt;">${rowsE}</div>
                    <div style="font-size:10pt; margin-top:5px; font-style:italic;">HDSD: ${guideE}</div>
                </div>`;
            }
            
            // Tây Y
            if (visitData.rxWest.length > 0) {
                let rowsW = visitData.rxWest.map((m, i) => `<div><b>${i+1}. ${m.name}</b> (${m.qty} viên): <i>${m.usage}</i></div>`).join('');
                content += `<div style="margin-bottom:15px; border:1px solid #ccc; padding:10px; border-radius:5px;">
                    <div style="font-weight:bold; border-bottom:1px dashed #ccc; padding-bottom:5px; margin-bottom:5px;">II. TÂY Y (${westDays} ngày)</div>
                    <div style="font-size:11pt;">${rowsW}</div>
                    <div style="font-size:10pt; margin-top:5px; font-style:italic;">Lời dặn: ${document.getElementById('vWestNote').value}</div>
                </div>`;
            }
            
            content += `<div style="text-align:right; font-size:14pt; font-weight:bold; border-top:2px solid #000; padding-top:10px;">Tổng cộng: ${window.fmtMoney(finalTotal)} đ</div>`;
            content += footerHtml;
            container.innerHTML = content;
        }
        
        // ============================================================
        // TYPE 4: IN HÓA ĐƠN
        // ============================================================
        else if (type === 'invoice') {
            const container = document.getElementById('printInvoice');
            if (!container) return alert("Lỗi: Không tìm thấy khung in hóa đơn!");
            
            container.classList.remove('hidden');
            
            let content = `<div style="text-align:center; margin-bottom:10px;">
                <h2 style="font-size:14pt; font-weight:bold; margin:0;">HÓA ĐƠN DỊCH VỤ</h2>
                <p style="font-size:10pt; margin:0;">${clinicTitle}</p>
            </div>
            <div style="border-bottom:1px dashed #000; padding-bottom:5px; margin-bottom:10px; font-size:10pt;">
                <p style="margin:2px 0;">Khách hàng: <b>${p.name}</b></p>
                <p style="margin:2px 0;">Ngày: ${visitDate}</p>
            </div>
            <div style="font-size:10pt;">`;

            // Dịch vụ
            if (visitData.procs && visitData.procs.length > 0) {
                visitData.procs.forEach(p => {
                    const price = Math.round((p.price||0)*(p.days||1)*(1-(p.discount||0)/100));
                    content += `<div style="display:flex; justify-content:space-between; margin-bottom:4px;">
                        <span>${p.name} ${p.days > 1 ? `(x${p.days})` : ''}</span>
                        <b>${window.fmtMoney(price)}</b>
                    </div>`;
                });
            }
            
            // Thuốc Đông Y
            if (calcEastTotal > 0) {
                 content += `<div style="display:flex; justify-content:space-between; margin-bottom:4px;">
                    <span>Thuốc Đông Y (${eastDays} thang)</span>
                    <b>${window.fmtMoney(calcEastTotal)}</b>
                 </div>`;
            }

            // [MỚI] Công sắc thuốc
            if (decTotal > 0) {
                content += `<div style="display:flex; justify-content:space-between; margin-bottom:4px;">
                    <span>Công sắc thuốc (${decCount} lần)</span>
                    <b>${window.fmtMoney(decTotal)}</b>
                </div>`;
            }

            // Thuốc Tây Y
            if (calcWestTotal > 0) {
                 content += `<div style="display:flex; justify-content:space-between; margin-bottom:4px;">
                    <span>Thuốc Tây Y (${westDays} ngày)</span>
                    <b>${window.fmtMoney(calcWestTotal)}</b>
                 </div>`;
            }
            
            content += `</div>`; 

            // Tổng kết
            if (discountPercent > 0) {
                content += `<div style="display:flex; justify-content:space-between; font-size:10pt; margin-top:5px; font-style:italic;">
                    <span>Giảm giá:</span><span>-${discountPercent}%</span>
                </div>`;
            }

            content += `<div style="border-top:2px solid #000; margin-top:10px; padding-top:5px; display:flex; justify-content:space-between; font-size:12pt; font-weight:bold;">
                <span>TỔNG CỘNG:</span><span>${window.fmtMoney(finalTotal)} đ</span>
            </div>`;

            // QR Code
            const qrImage = window.config.qrCodeImage || '';
            if (qrImage) {
                content += `<div style="text-align:center; margin-top:15px;">
                    <img src="${qrImage}" style="width:120px; height:120px; object-fit:contain; border:1px solid #ccc;">
                    <p style="font-size:9pt; margin-top:5px; font-style:italic;">Quét mã để thanh toán</p>
                </div>`;
            }

            content += `<div style="text-align:center; margin-top:10px; font-style:italic; font-size:10pt;"><p>Cảm ơn quý khách!</p></div>`;
            
            container.innerHTML = content;
        }

        setTimeout(() => { 
            window.print(); 
        }, 500);
        
    } catch(e) { 
        console.error(e); 
        alert("Lỗi khi tạo bản in: " + e.message); 
    }
};
}
