/**
 * FILE: modules_core/ui-helper.js
 * CHỨC NĂNG: Tiện ích UI (NumberPad, Password, Print A4, Toast, Draggable).
 * CẬP NHẬT: 
 * - Hoá đơn: Tính toán trực tiếp tiền Đông/Tây y (không lấy từ UI) để đảm bảo chính xác.
 * - Hoá đơn: Hiển thị chi tiết thủ thuật, nhưng gộp nhóm tiền thuốc.
 */

// --- 1. BIẾN TOÀN CỤC ---
window.nPadValue = "";        
window.nPadTargetId = null;   
window.nPadLimit = null;      
window.nPadCallback = null;
window.passwordCallback = null;

// --- 2. TIỆN ÍCH HỆ THỐNG ---

window.getLocalDate = function() {
    const now = new Date();
    const local = new Date(now.getTime() - (now.getTimezoneOffset() * 60000));
    return local.toISOString().split('T')[0];
};

window.isIPad = function() {
    return /iPad/.test(navigator.userAgent) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
};

window.closeModals = function() { 
    document.querySelectorAll('.modal').forEach(m => m.classList.remove('active')); 
};

// --- 3. BÀN PHÍM NHẬP SỐ (NUMBER PAD) ---

window.injectNumberPadModal = function() {
    if (document.getElementById('numberPadModal')) return;
    const div = document.createElement('div');
    div.id = 'numberPadModal';
    div.className = 'modal z-[3000]'; 
    div.innerHTML = `
        <div class="modal-box max-w-sm text-center bg-white rounded-3xl shadow-2xl p-6 border border-gray-100">
            <div class="flex justify-between items-center mb-4">
                <h3 id="nPadTitle" class="font-bold text-lg text-[#3e2723] uppercase tracking-widest">Nhập số</h3>
                <button onclick="window.closeNumberPadModal()" class="text-3xl text-gray-300 hover:text-red-500">&times;</button>
            </div>
            <input type="text" id="nPadDisplay" readonly class="w-full text-center text-4xl font-black text-[#3e2723] bg-gray-50 py-4 rounded-2xl mb-4 border-none shadow-inner">
            <div class="grid grid-cols-3 gap-3">
                <button onclick="window.nPadAdd('1')" class="h-16 rounded-2xl bg-white border border-gray-100 shadow-sm text-2xl font-bold active:bg-gray-100">1</button>
                <button onclick="window.nPadAdd('2')" class="h-16 rounded-2xl bg-white border border-gray-100 shadow-sm text-2xl font-bold active:bg-gray-100">2</button>
                <button onclick="window.nPadAdd('3')" class="h-16 rounded-2xl bg-white border border-gray-100 shadow-sm text-2xl font-bold active:bg-gray-100">3</button>
                <button onclick="window.nPadAdd('4')" class="h-16 rounded-2xl bg-white border border-gray-100 shadow-sm text-2xl font-bold active:bg-gray-100">4</button>
                <button onclick="window.nPadAdd('5')" class="h-16 rounded-2xl bg-white border border-gray-100 shadow-sm text-2xl font-bold active:bg-gray-100">5</button>
                <button onclick="window.nPadAdd('6')" class="h-16 rounded-2xl bg-white border border-gray-100 shadow-sm text-2xl font-bold active:bg-gray-100">6</button>
                <button onclick="window.nPadAdd('7')" class="h-16 rounded-2xl bg-white border border-gray-100 shadow-sm text-2xl font-bold active:bg-gray-100">7</button>
                <button onclick="window.nPadAdd('8')" class="h-16 rounded-2xl bg-white border border-gray-100 shadow-sm text-2xl font-bold active:bg-gray-100">8</button>
                <button onclick="window.nPadAdd('9')" class="h-16 rounded-2xl bg-white border border-gray-100 shadow-sm text-2xl font-bold active:bg-gray-100">9</button>
                <button onclick="window.nPadDel()" class="h-16 rounded-2xl bg-red-50 text-red-500 text-2xl font-bold">⌫</button>
                <button onclick="window.nPadAdd('0')" class="h-16 rounded-2xl bg-white border border-gray-100 shadow-sm text-2xl font-bold active:bg-gray-100">0</button>
                <button onclick="window.nPadOk()" class="h-16 rounded-2xl bg-[#3e2723] text-white text-xl font-bold shadow-lg">OK</button>
            </div>
        </div>`;
    document.body.appendChild(div);
};

window.openNumberPad = function(targetId, title, limitRange, currentVal, callback) {
    window.injectNumberPadModal();
    window.nPadTargetId = targetId;
    window.nPadLimit = limitRange;
    window.nPadCallback = callback;
    window.nPadValue = currentVal ? String(currentVal) : "";
    
    const titleEl = document.getElementById('nPadTitle');
    if(titleEl) titleEl.innerText = title || 'Nhập số';
    
    const dispEl = document.getElementById('nPadDisplay');
    if(dispEl) dispEl.value = window.nPadValue;
    
    document.getElementById('numberPadModal').classList.add('active');
};

window.nPadAdd = (n) => { window.nPadValue += n; document.getElementById('nPadDisplay').value = window.nPadValue; };
window.nPadDel = () => { window.nPadValue = window.nPadValue.slice(0, -1); document.getElementById('nPadDisplay').value = window.nPadValue; };
window.nPadOk = () => {
    if (window.nPadTargetId) {
        const target = document.getElementById(window.nPadTargetId);
        if (target) {
            target.value = window.nPadValue || 0;
            target.dispatchEvent(new Event('change', { bubbles: true }));
            target.dispatchEvent(new Event('input', { bubbles: true }));
        }
    }
    if (window.nPadCallback) window.nPadCallback(window.nPadValue);
    window.closeNumberPadModal();
};
window.closeNumberPadModal = () => {
    document.getElementById('numberPadModal').classList.remove('active');
    window.nPadValue = "";
};

// --- 4. MẬT KHẨU NATIVE ---

window.injectNativePasswordModal = function() {
    if (document.getElementById('nativePassModal')) return;
    const div = document.createElement('div');
    div.id = 'nativePassModal';
    div.className = 'modal z-[4000]'; 
    div.innerHTML = `
        <div class="modal-box max-w-xs bg-white rounded-3xl shadow-2xl p-6 text-center">
            <h3 class="font-bold text-[#3e2723] mb-4 uppercase tracking-widest">Xác thực mã Pin</h3>
            <input type="password" id="nativePassInput" inputmode="numeric" class="w-full h-14 text-center text-3xl border-none bg-gray-100 rounded-2xl focus:ring-2 focus:ring-[#5d4037] mb-6 tracking-[10px]" placeholder="****">
            <div class="flex gap-3">
                <button onclick="document.getElementById('nativePassModal').classList.remove('active')" class="flex-1 py-3 font-bold text-gray-400">Hủy</button>
                <button onclick="window.submitNativePassword()" class="flex-2 py-3 bg-[#3e2723] text-white rounded-xl font-bold px-6">Xác nhận</button>
            </div>
        </div>`;
    document.body.appendChild(div);
};

window.openNativePasswordInput = function(callback) {
    window.injectNativePasswordModal();
    window.passwordCallback = callback;
    const input = document.getElementById('nativePassInput');
    if(input) {
        input.value = '';
        setTimeout(() => input.focus(), 200);
    }
    document.getElementById('nativePassModal').classList.add('active');
};

window.submitNativePassword = function() {
    if (window.passwordCallback) window.passwordCallback(document.getElementById('nativePassInput').value);
    document.getElementById('nativePassModal').classList.remove('active');
};

// --- 5. HỆ THỐNG IN ẤN CHUẨN A4 ---

window.generatePrintHeader = function(clinicTitle, doctorName, date, patient, disease, symptoms) {
    return `
    <div style="display: flex; justify-content: space-between; align-items: flex-start; border-bottom: 2px solid #000; padding-bottom: 10px; margin-bottom: 20px; font-family: 'Times New Roman', serif; color: #000;">
        <div style="text-align: left;">
            <h1 style="margin: 0; font-size: 16pt; font-weight: bold; text-transform: uppercase;">${clinicTitle}</h1>
            <p style="margin: 2px 0; font-size: 11pt;"><b>Bác sĩ:</b> ${doctorName}</p>
        </div>
        <div style="text-align: right;">
            <p style="margin: 0; font-size: 10pt;">Ngày: <b>${date}</b></p>
            <p style="margin: 0; font-size: 9pt;">Mã BN: ${patient.phone ? patient.phone.slice(-4) : '....'}</p>
        </div>
    </div>
    <div style="text-align: center; margin-bottom: 20px;">
        <h2 style="font-size: 22pt; font-weight: bold; margin: 0; letter-spacing: 2px; color: #000;">ĐƠN THUỐC</h2>
    </div>
    <div style="margin-bottom: 20px; font-size: 12pt; line-height: 1.5; color: #000;">
        <div><b>Họ tên:</b> <span style="text-transform: uppercase; font-weight: bold;">${patient.name}</span> - <b>Năm sinh:</b> ${patient.year || '....'}</div>
        <div style="margin-top: 5px;"><b>Chẩn đoán:</b> ${disease}</div>
        ${symptoms ? `<div style="margin-top: 5px;"><b>Triệu chứng:</b> <i>${symptoms}</i></div>` : ''}
    </div>`;
};

window.generatePrintFooter = function(doctorName) {
    const today = new Date();
    return `
    <div style="margin-top: 40px; display: grid; grid-template-columns: 1fr 1fr; text-align: center; font-family: 'Times New Roman', serif; font-size: 12pt; color: #000;">
        <div><p><b>Người nhận</b></p><p style="font-size: 10pt; margin-top: 5px;">(Ký tên)</p></div>
        <div>
            <p><i>Ngày ${today.getDate()} tháng ${today.getMonth() + 1} năm ${today.getFullYear()}</i></p>
            <p><b>Bác sĩ điều trị</b></p>
            <div style="margin-top: 60px; font-weight: bold;">${doctorName.replace('BS. ', '')}</div>
        </div>
    </div>`;
};

// Hàm định dạng tiền tệ
window.fmtMoney = function(n) {
    return parseInt(n || 0).toLocaleString('vi-VN');
};

window.preparePrint = function(type) {
    const pid = document.getElementById('vPid').value; 
    const p = (window.db || []).find(x => x.id == pid); 
    if (!p) return alert("Chưa chọn bệnh nhân!");

    const visitData = window.currentVisit || { rxEast: [], rxWest: [], procs: [] };
    const clinicTitle = window.config.clinicTitle || 'PHÒNG KHÁM YHCT';
    const doctorName = window.config.doctorName ? 'BS. ' + window.config.doctorName : 'BS. Đông Y';
    const visitDate = document.getElementById('vDate').value.split('-').reverse().join('/');
    const disease = document.getElementById('vDiseaseSelect').value || document.getElementById('vDiseaseInput').value;
    const symptoms = document.getElementById('vSpecial').value || '';
    
    // Header & Footer chung
    const headerHtml = window.generatePrintHeader(clinicTitle, doctorName, visitDate, p, disease, symptoms);
    const footerHtml = window.generatePrintFooter(doctorName);

    // Lấy thông tin đầu vào để tính toán lại chính xác
    const manualPriceEast = parseInt(document.getElementById('vEastManualPrice').value) || 0;
    const manualPriceWest = parseInt(document.getElementById('vWestManualPrice').value) || 0;
    const eastDays = parseInt(document.getElementById('vEastDays').value) || 1;
    const westDays = parseInt(document.getElementById('vWestDays').value) || 1;

    // --- TÍNH TOÁN LẠI TỔNG TIỀN (REAL-TIME CALCULATION) ---
    // Đảm bảo không phụ thuộc vào text hiển thị trên UI
    
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
        // Tây y: Tổng tiền = Tổng (SL * Đơn giá)
        calcWestTotal = visitData.rxWest.reduce((acc, cur) => acc + ((cur.qty||0) * (cur.price||0)), 0);
    }

    // 3. Tiền Thủ thuật
    let calcProcTotal = 0;
    visitData.procs.forEach(p => {
        calcProcTotal += Math.round((p.price||0)*(p.days||1)*(1-(p.discount||0)/100));
    });

    // 4. Tổng cộng và Thành tiền sau giảm giá
    const rawTotal = calcEastTotal + calcWestTotal + calcProcTotal;
    const discountPercent = parseInt(document.getElementById('vDiscountPercent').value) || 0;
    const finalTotal = Math.round(rawTotal * (1 - discountPercent/100));
    const paidText = document.getElementById('vPaid').checked ? "ĐÃ THANH TOÁN" : "CHƯA THANH TOÁN";


    // Ẩn tất cả section trước khi in
    document.querySelectorAll('.print-section').forEach(el => el.classList.add('hidden'));

    // --- 1. IN TOA ĐÔNG Y (Chi tiết Thuốc + Giá nếu có nhập tay) ---
    if (type === 'east') {
        const eastSec = document.getElementById('printEast');
        if (eastSec && visitData.rxEast.length > 0) {
            eastSec.classList.remove('hidden');
            
            // Render bảng thuốc
            let rows = visitData.rxEast.map((m, i) => 
                `<tr style="border-bottom: 1px dashed #ccc;">
                    <td style="width: 40px; text-align: center; padding: 6px 0;">${i+1}</td>
                    <td style="padding: 6px 0; font-weight: bold;">${m.name}</td>
                    <td style="width: 80px; text-align: right; padding-right: 10px;">${m.qty} g</td>
                </tr>`).join('');
            
            // Chỉ hiện giá nếu có nhập giá trọn gói
            let priceRow = '';
            if (manualPriceEast > 0) {
                priceRow = `<div style="text-align: right; font-weight: bold; margin-top: 10px; font-size: 12pt;">Thành tiền (${eastDays} thang): ${window.fmtMoney(calcEastTotal)} đ</div>`;
            }

            eastSec.innerHTML = `
                ${headerHtml}
                <div style="margin-bottom: 10px; font-weight: bold; font-size: 14pt; border-bottom: 1px solid #000; display: inline-block;">Đơn Thuốc YHCT (${eastDays} thang)</div>
                <table style="width: 100%; border-collapse: collapse; font-size: 12pt;">
                    <thead><tr style="border-bottom: 2px solid #000;"><th style="text-align: center;">STT</th><th style="text-align: left;">Vị thuốc</th><th style="text-align: right; padding-right: 10px;">Lượng</th></tr></thead>
                    <tbody>${rows}</tbody>
                </table>
                ${priceRow}
                <div style="margin-top: 15px; font-size: 12pt;"><b>Cách dùng:</b> <i>${document.getElementById('vEastNote').value}</i></div>
                ${footerHtml}`;
        }
    }

    // --- 2. IN TOA TÂY Y (Chi tiết Thuốc + Giá nếu có nhập tay) ---
    if (type === 'west') {
        const westSec = document.getElementById('printWest');
        if (westSec && visitData.rxWest.length > 0) {
            westSec.classList.remove('hidden');

            let rows = visitData.rxWest.map((m, i) => 
                `<tr style="border-bottom: 1px dashed #ccc;">
                    <td style="width: 40px; text-align: center; padding: 8px 0;">${i+1}</td>
                    <td style="padding: 8px 0;"><b>${m.name}</b></td>
                    <td style="width: 60px; text-align: center;">${m.qty}</td>
                    <td style="padding: 8px 0; font-style: italic;">${m.usage || ''}</td>
                </tr>`).join('');

            // Chỉ hiện giá nếu có nhập giá trọn gói
            let priceRow = '';
            if (manualPriceWest > 0) {
                priceRow = `<div style="text-align: right; font-weight: bold; margin-top: 10px; font-size: 12pt;">Thành tiền: ${window.fmtMoney(calcWestTotal)} đ</div>`;
            }

            westSec.innerHTML = `
                ${headerHtml}
                <div style="margin-bottom: 10px; font-weight: bold; font-size: 14pt; border-bottom: 1px solid #000; display: inline-block;">Đơn Thuốc Tây Y (${westDays} ngày)</div>
                <table style="width: 100%; border-collapse: collapse; font-size: 12pt;">
                    <thead><tr style="border-bottom: 2px solid #000;"><th style="text-align: center;">STT</th><th style="text-align: left;">Tên thuốc</th><th style="text-align: center;">SL</th><th style="text-align: left;">Cách dùng</th></tr></thead>
                    <tbody>${rows}</tbody>
                </table>
                ${priceRow}
                <div style="margin-top: 15px; font-size: 12pt;"><b>Lời dặn:</b> <i>${document.getElementById('vWestNote').value}</i></div>
                ${footerHtml}`;
        }
    }

    // --- 3. IN CẢ HAI (Chi tiết Thuốc + Tách riêng giá ĐY/TY/Tổng) ---
    if (type === 'both') {
        const bothSec = document.getElementById('printBoth');
        if(bothSec) {
            bothSec.classList.remove('hidden');
            let content = headerHtml;
            
            // Phần Đông Y
            if (visitData.rxEast.length > 0) {
                let rowsE = visitData.rxEast.map((m, i) => `<tr><td style="width:30px;text-align:center;">${i+1}</td><td>${m.name}</td><td style="text-align:right;">${m.qty}g</td></tr>`).join('');
                content += `
                <div style="margin-top:10px;">
                    <div style="font-weight:bold; font-size:13pt; border-bottom:1px solid #000; display:inline-block;">I. Đông Y (${eastDays} thang)</div>
                    <table style="width:100%; font-size:12pt; margin-top:5px;">${rowsE}</table>
                    <div style="font-size:11pt; margin-top:5px;"><i>HDSD: ${document.getElementById('vEastNote').value}</i></div>
                </div>`;
            }

            // Phần Tây Y
            if (visitData.rxWest.length > 0) {
                let rowsW = visitData.rxWest.map((m, i) => `<tr><td style="width:30px;text-align:center;">${i+1}</td><td><b>${m.name}</b></td><td style="text-align:center;">${m.qty}</td><td>${m.usage||''}</td></tr>`).join('');
                content += `
                <div style="margin-top:20px;">
                    <div style="font-weight:bold; font-size:13pt; border-bottom:1px solid #000; display:inline-block;">II. Tây Y (${westDays} ngày)</div>
                    <table style="width:100%; font-size:12pt; margin-top:5px;">${rowsW}</table>
                    <div style="font-size:11pt; margin-top:5px;"><i>Lời dặn: ${document.getElementById('vWestNote').value}</i></div>
                </div>`;
            }

            // Phần Tổng tiền: Hiển thị chi tiết từng khoản
            content += `<div style="border-top: 2px solid #000; padding-top: 10px; margin-top: 20px;">`;
            
            if (calcEastTotal > 0) {
                content += `<div style="text-align: right; font-size: 12pt;">Tiền thuốc Đông Y: <b>${window.fmtMoney(calcEastTotal)} đ</b></div>`;
            }
            if (calcWestTotal > 0) {
                content += `<div style="text-align: right; font-size: 12pt;">Tiền thuốc Tây Y: <b>${window.fmtMoney(calcWestTotal)} đ</b></div>`;
            }
            
            const medTotal = calcEastTotal + calcWestTotal;
            content += `<div style="text-align: right; font-weight: bold; font-size: 14pt; margin-top:5px;">Tổng cộng: ${window.fmtMoney(medTotal)} đ</div>`;
            content += `</div>`;
            
            content += footerHtml;
            bothSec.innerHTML = content;
        }
    }
    
    // --- 4. IN HÓA ĐƠN (Chi tiết thủ thuật, Thuốc gộp dòng) ---
    if (type === 'invoice') {
        const invSec = document.getElementById('printInvoice');
        if(invSec) {
            invSec.classList.remove('hidden');
            
            let content = `
                <div style="text-align:center; margin-bottom:15px;">
                    <h2 style="font-size:16pt; font-weight:bold; margin:0;">HÓA ĐƠN DỊCH VỤ</h2>
                    <p style="font-size:10pt; margin:5px 0;">${clinicTitle}</p>
                </div>
                <div style="border-bottom:1px dashed #000; padding-bottom:5px; margin-bottom:10px;">
                    <p style="margin:2px 0;">BN: <b>${p.name}</b> (${p.year})</p>
                    <p style="margin:2px 0;">Ngày: ${visitDate}</p>
                </div>
            `;

            // 1. Liệt kê chi tiết Thủ thuật / Dịch vụ
            if (visitData.procs && visitData.procs.length > 0) {
                content += `<div style="border-bottom:1px dashed #ccc; margin-bottom:5px; padding-bottom:5px; font-weight:bold;">Thủ Thuật / Dịch Vụ:</div>`;
                visitData.procs.forEach(p => {
                    const price = Math.round((p.price||0)*(p.days||1)*(1-(p.discount||0)/100));
                    content += `
                    <div style="display:flex; justify-content:space-between; margin-bottom:2px; padding-left:5px;">
                        <span>- ${p.name} ${p.days > 1 ? `(x${p.days})` : ''}</span>
                        <b>${window.fmtMoney(price)}</b>
                    </div>`;
                });
            }

            // 2. Thuốc Đông Y (Gộp nhóm, hiển thị số thang)
            if (calcEastTotal > 0) {
                 content += `
                <div style="display:flex; justify-content:space-between; margin-top:5px; border-top:1px dashed #ccc; padding-top:5px;">
                    <span>Thuốc Đông Y (${eastDays} thang)</span>
                    <b>${window.fmtMoney(calcEastTotal)}</b>
                </div>`;
            }
            
            // 3. Thuốc Tây Y (Gộp nhóm, hiển thị số ngày)
            if (calcWestTotal > 0) {
                 content += `
                <div style="display:flex; justify-content:space-between; margin-top:2px;">
                    <span>Thuốc Tây Y (${westDays} ngày)</span>
                    <b>${window.fmtMoney(calcWestTotal)}</b>
                </div>`;
            }
                
            // Tổng kết
            content += `
                <div style="border-top:2px solid #000; margin-top:10px; padding-top:5px; display:flex; justify-content:space-between; font-size:14pt; font-weight:bold;">
                    <span>TỔNG CỘNG:</span>
                    <span>${window.fmtMoney(finalTotal)} đ</span>
                </div>
                <div style="text-align:center; margin-top:15px; font-style:italic;">
                    <p style="font-weight:bold;">(${paid})</p>
                    <p>Cảm ơn quý khách!</p>
                </div>
            `;
            
            invSec.innerHTML = content;
        }
    }

    // Thực hiện lệnh in sau 500ms
    setTimeout(() => { 
        window.print(); 
    }, 500);
};

// --- 6. HỆ THỐNG THÔNG BÁO (TOAST) ---

window.showToast = function(message, type = 'info', action = null) {
    let container = document.getElementById('toast-container');
    if (!container) {
        container = document.createElement('div');
        container.id = 'toast-container';
        container.className = 'fixed bottom-24 left-1/2 -translate-x-1/2 z-[9999] flex flex-col gap-2 pointer-events-none items-center w-full max-w-sm px-4';
        document.body.appendChild(container);
    }
    
    const toast = document.createElement('div');
    const colors = { success: 'bg-green-600', error: 'bg-red-600', info: 'bg-[#5d4037]', warning: 'bg-yellow-600' };
    
    let baseClass = `${colors[type] || colors.info} text-white p-3 rounded-2xl shadow-2xl text-sm font-bold transition-all duration-300 opacity-0 translate-y-4 pointer-events-auto flex items-center justify-between gap-3 min-w-[300px] border border-white/20`;
    
    toast.className = baseClass;
    
    const textSpan = document.createElement('span');
    textSpan.innerText = message;
    textSpan.className = "flex-1";
    toast.appendChild(textSpan);

    if (action && action.label && action.callback) {
        const btn = document.createElement('button');
        btn.innerText = action.label;
        btn.className = "bg-white/20 hover:bg-white/30 text-white px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-wider transition-colors border border-white/30 active:scale-95";
        btn.onclick = function(e) {
            e.stopPropagation();
            action.callback(); 
            toast.classList.add('opacity-0', 'translate-y-[-10px]');
            setTimeout(() => toast.remove(), 300);
        };
        toast.appendChild(btn);
    }

    container.appendChild(toast);
    
    setTimeout(() => { toast.classList.remove('opacity-0', 'translate-y-4'); }, 10);
    
    const duration = action ? 10000 : 3000;
    
    setTimeout(() => { 
        toast.classList.add('opacity-0', 'translate-y-[-10px]'); 
        setTimeout(() => toast.remove(), 300);
    }, duration);
};

// --- 7. TÍNH NĂNG KÉO THẢ (DRAGGABLE) - ĐÃ FIX LỖI CUỘN TRANG ---

window.makeDraggable = function(elmntId, onClickCallback) {
    const elmnt = document.getElementById(elmntId);
    if (!elmnt) return;
    let pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0, isDragging = false;
    
    const startDrag = (e) => {
        const t = e.touches ? e.touches[0] : e;
        pos3 = t.clientX; 
        pos4 = t.clientY;
        isDragging = false;
        
        document.onmouseup = document.ontouchend = () => {
            document.onmouseup = document.onmousemove = document.ontouchend = document.ontouchmove = null;
            if (!isDragging && onClickCallback) onClickCallback();
        };
        
        document.onmousemove = document.ontouchmove = (ev) => {
            if (ev.touches) {
                ev.preventDefault(); 
            }

            isDragging = true;
            const moveT = ev.touches ? ev.touches[0] : ev;
            
            pos1 = pos3 - moveT.clientX; 
            pos2 = pos4 - moveT.clientY;
            pos3 = moveT.clientX; 
            pos4 = moveT.clientY;
            
            elmnt.style.top = (elmnt.offsetTop - pos2) + "px";
            elmnt.style.left = (elmnt.offsetLeft - pos1) + "px";
            
            elmnt.style.bottom = 'auto'; 
            elmnt.style.right = 'auto';
        };
    };

    elmnt.onmousedown = elmnt.ontouchstart = startDrag;
};

window.toggleFullScreen = function() {
    if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen().catch(() => {});
    } else {
        document.exitFullscreen();
    }
};
