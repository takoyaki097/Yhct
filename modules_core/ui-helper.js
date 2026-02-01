/**
 * FILE: modules_core/ui-helper.js
 * CHỨC NĂNG: Tiện ích UI (NumberPad, Password, Print A4, Toast, Draggable).
 * CẬP NHẬT: Nâng cấp Toast Notification hỗ trợ nút bấm "Hoàn tác" (Action Button).
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
    // Nếu có targetId, cập nhật input đó
    if (window.nPadTargetId) {
        const target = document.getElementById(window.nPadTargetId);
        if (target) {
            target.value = window.nPadValue || 0;
            target.dispatchEvent(new Event('change', { bubbles: true }));
            target.dispatchEvent(new Event('input', { bubbles: true }));
        }
    }
    // Nếu có callback riêng, gọi nó
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
    <div style="display: flex; justify-content: space-between; align-items: flex-start; border-bottom: 2px solid #000; padding-bottom: 10px; margin-bottom: 25px; font-family: 'Times New Roman', serif; color: #000; background: #fff;">
        <div style="text-align: left;">
            <h1 style="margin: 0; font-size: 18pt; font-weight: bold; text-transform: uppercase;">${clinicTitle}</h1>
            <p style="margin: 2px 0; font-size: 11pt;"><b>Bác sĩ:</b> ${doctorName}</p>
            <p style="margin: 0; font-size: 9pt; font-style: italic;">Đ/c: Việt Nam - Hotline: YHCT Pro</p>
        </div>
        <div style="text-align: right;">
            <p style="margin: 0; font-size: 10pt;">Ngày khám: <b>${date}</b></p>
            <p style="margin: 0; font-size: 9pt;">Mã BN: ${patient.phone ? patient.phone.slice(-4) : '....'}</p>
        </div>
    </div>
    <div style="text-align: center; margin-bottom: 30px; background: #fff;">
        <h2 style="font-size: 24pt; font-weight: bold; margin: 0; letter-spacing: 4px; color: #000;">ĐƠN THUỐC</h2>
    </div>
    <div style="margin-bottom: 25px; font-size: 12pt; line-height: 1.6; color: #000; background: #fff;">
        <div style="display: flex; margin-bottom: 5px;">
            <div style="flex: 2;"><b>Họ tên:</b> <span style="text-transform: uppercase; font-size: 14pt; font-weight: bold;">${patient.name}</span></div>
            <div style="flex: 1;"><b>Năm sinh:</b> ${patient.year || '....'}</div>
        </div>
        <div style="margin-bottom: 5px;"><b>Chẩn đoán:</b> ${disease}</div>
        ${symptoms ? `<div><b>Triệu chứng:</b> <i>${symptoms}</i></div>` : ''}
    </div>`;
};

window.generatePrintFooter = function(doctorName) {
    const today = new Date();
    return `
    <div style="margin-top: 50px; display: grid; grid-template-columns: 1fr 1fr; text-align: center; font-family: 'Times New Roman', serif; font-size: 12pt; color: #000; background: #fff;">
        <div><p><b>Người nhận thuốc</b></p><p style="font-size: 10pt; margin-top: 5px; color: #333;">(Ký, ghi rõ họ tên)</p></div>
        <div>
            <p><i>Ngày ${today.getDate()} tháng ${today.getMonth() + 1} năm ${today.getFullYear()}</i></p>
            <p><b>Bác sĩ điều trị</b></p>
            <div style="margin-top: 60px; font-weight: bold; font-size: 14pt;">${doctorName.replace('BS. ', '')}</div>
        </div>
    </div>`;
};

window.preparePrint = function(type) {
    const pid = document.getElementById('vPid').value; 
    const p = (window.db || []).find(x => x.id == pid); 
    if (!p) return alert("Chưa chọn bệnh nhân!");

    const visitData = window.currentVisit || { rxEast: [], rxWest: [], procs: [] };
    const clinicTitle = window.config.clinicTitle || 'PHÒNG KHÁM Y HỌC CỔ TRUYỀN';
    const doctorName = window.config.doctorName ? 'BS. ' + window.config.doctorName : 'BS. Đông Y';
    const visitDate = document.getElementById('vDate').value.split('-').reverse().join('/');
    const disease = document.getElementById('vDiseaseSelect').value || document.getElementById('vDiseaseInput').value;
    const symptoms = document.getElementById('vSpecial').value || '';
    
    const headerHtml = window.generatePrintHeader(clinicTitle, doctorName, visitDate, p, disease, symptoms);
    const footerHtml = window.generatePrintFooter(doctorName);

    // Ẩn tất cả section trước khi hiện cái cần in
    document.querySelectorAll('.print-section').forEach(el => el.classList.add('hidden'));

    if (type === 'east' || type === 'both') {
        const eastSec = document.getElementById('printEast');
        if (eastSec && visitData.rxEast.length > 0) {
            eastSec.classList.remove('hidden');
            const eastDays = document.getElementById('vEastDays').value || 1;
            let rows = visitData.rxEast.map((m, i) => `<tr style="border-bottom: 1px dashed #ccc;"><td style="width: 50px; text-align: center; padding: 8px 0;">${i+1}</td><td style="padding: 8px 0; font-weight: bold;">${m.name}</td><td style="width: 100px; text-align: right; padding-right: 20px; font-weight: bold;">${m.qty} g</td></tr>`).join('');
            eastSec.innerHTML = `${headerHtml}<div style="margin-bottom: 10px; font-weight: bold; font-size: 14pt; border-bottom: 1px solid #000; display: inline-block;">I. Thuốc Thang (${eastDays} thang)</div><table style="width: 100%; border-collapse: collapse;"><thead><tr style="border-bottom: 2px solid #000;"><th style="text-align: center;">STT</th><th style="text-align: left;">Tên vị thuốc</th><th style="text-align: right; padding-right: 20px;">Lượng</th></tr></thead><tbody>${rows}</tbody></table><div style="margin-top: 20px; font-size: 12pt;"><b>Cách dùng:</b> <i>${document.getElementById('vEastNote').value}</i></div>${footerHtml}`;
        }
    }

    if (type === 'west' || type === 'both') {
        const westSec = document.getElementById('printWest');
        if (westSec && visitData.rxWest.length > 0) {
            westSec.classList.remove('hidden');
            let rows = visitData.rxWest.map((m, i) => `<tr style="border-bottom: 1px dashed #ccc;"><td style="width: 40px; text-align: center; padding: 10px 0;">${i+1}</td><td style="padding: 10px 0;"><b>${m.name}</b></td><td style="width: 80px; text-align: center; padding: 10px 0;">${m.qty}v</td><td style="padding: 10px 0; font-style: italic; font-size: 10pt;">${m.usage || ''}</td></tr>`).join('');
            westSec.innerHTML = `${headerHtml}<div style="margin-bottom: 10px; font-weight: bold; font-size: 14pt; border-bottom: 1px solid #000; display: inline-block;">II. Thuốc Tây Y</div><table style="width: 100%; border-collapse: collapse;"><thead><tr style="border-bottom: 2px solid #000;"><th style="text-align: center;">STT</th><th style="text-align: left;">Tên thuốc</th><th style="text-align: center;">SL</th><th style="text-align: left;">Cách dùng</th></tr></thead><tbody>${rows}</tbody></table><div style="margin-top: 15px; font-size: 12pt;"><b>Lời dặn:</b> <i>${document.getElementById('vWestNote').value}</i></div>${footerHtml}`;
        }
    }
    
    // In hóa đơn (Invoice)
    if (type === 'invoice') {
        const invSec = document.getElementById('printInvoice');
        if(invSec) {
            invSec.classList.remove('hidden');
            const total = document.getElementById('displayGrandTotal').innerText;
            const final = document.getElementById('finalTotal').innerText;
            const paid = document.getElementById('vPaid').checked ? "Đã thanh toán" : "Chưa thanh toán";
            
            // Xây dựng nội dung hóa đơn
            let content = `<div style="text-align:center; margin-bottom:10px;"><h2 style="font-size:16pt; font-weight:bold; margin:0;">HÓA ĐƠN DỊCH VỤ</h2><p>${clinicTitle}</p></div>`;
            content += `<p>BN: <b>${p.name}</b> (${p.year})</p><p>Ngày: ${visitDate}</p><hr style="border-top:1px dashed #000;">`;
            
            // Item thuốc
            visitData.rxEast.forEach(m => { content += `<div style="display:flex; justify-content:space-between;"><span>${m.name}</span><span>${m.qty}g</span></div>`; });
            visitData.rxWest.forEach(m => { content += `<div style="display:flex; justify-content:space-between;"><span>${m.name}</span><span>${m.qty}v</span></div>`; });
            visitData.procs.forEach(m => { content += `<div style="display:flex; justify-content:space-between;"><span>${m.name}</span><span>${m.price.toLocaleString()}</span></div>`; });
            
            content += `<hr style="border-top:1px solid #000; margin:10px 0;"><div style="display:flex; justify-content:space-between; font-weight:bold; font-size:14pt;"><span>TỔNG CỘNG:</span><span>${final}</span></div>`;
            content += `<p style="text-align:center; margin-top:10px; font-style:italic;">(${paid})</p><p style="text-align:center;">Cảm ơn quý khách!</p>`;
            
            invSec.innerHTML = content;
        }
    }

    // Thực hiện lệnh in
    setTimeout(() => { 
        window.print(); 
    }, 500);
};

// --- 6. HỆ THỐNG THÔNG BÁO (TOAST) - CÓ NÚT HÀNH ĐỘNG (UPDATED) ---

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
    
    // Cấu hình class cơ bản
    let baseClass = `${colors[type] || colors.info} text-white p-3 rounded-2xl shadow-2xl text-sm font-bold transition-all duration-300 opacity-0 translate-y-4 pointer-events-auto flex items-center justify-between gap-3 min-w-[300px] border border-white/20`;
    
    toast.className = baseClass;
    
    // Tạo phần Text
    const textSpan = document.createElement('span');
    textSpan.innerText = message;
    textSpan.className = "flex-1";
    toast.appendChild(textSpan);

    // [MỚI] Nếu có action (Nút bấm), thêm vào Toast
    if (action && action.label && action.callback) {
        const btn = document.createElement('button');
        btn.innerText = action.label;
        btn.className = "bg-white/20 hover:bg-white/30 text-white px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-wider transition-colors border border-white/30 active:scale-95";
        btn.onclick = function(e) {
            e.stopPropagation();
            action.callback(); // Gọi hàm callback (Ví dụ: restoreSnapshot)
            toast.classList.add('opacity-0', 'translate-y-[-10px]');
            setTimeout(() => toast.remove(), 300);
        };
        toast.appendChild(btn);
    }

    container.appendChild(toast);
    
    // Animation In
    setTimeout(() => { toast.classList.remove('opacity-0', 'translate-y-4'); }, 10);
    
    // Thời gian tồn tại: Nếu có nút bấm thì lâu hơn (10s), bình thường 3s
    const duration = action ? 10000 : 3000;
    
    // Animation Out & Remove
    setTimeout(() => { 
        toast.classList.add('opacity-0', 'translate-y-[-10px]'); 
        setTimeout(() => toast.remove(), 300);
    }, duration);
};

// --- 7. TÍNH NĂNG KÉO THẢ (DRAGGABLE) ---

window.makeDraggable = function(elmntId, onClickCallback) {
    const elmnt = document.getElementById(elmntId);
    if (!elmnt) return;
    let pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0, isDragging = false;
    
    const startDrag = (e) => {
        const t = e.touches ? e.touches[0] : e;
        pos3 = t.clientX; pos4 = t.clientY;
        isDragging = false;
        
        document.onmouseup = document.ontouchend = () => {
            document.onmouseup = document.onmousemove = document.ontouchend = document.ontouchmove = null;
            if (!isDragging && onClickCallback) onClickCallback();
        };
        
        document.onmousemove = document.ontouchmove = (ev) => {
            isDragging = true;
            const moveT = ev.touches ? ev.touches[0] : ev;
            pos1 = pos3 - moveT.clientX; pos2 = pos4 - moveT.clientY;
            pos3 = moveT.clientX; pos4 = moveT.clientY;
            elmnt.style.top = (elmnt.offsetTop - pos2) + "px";
            elmnt.style.left = (elmnt.offsetLeft - pos1) + "px";
            elmnt.style.bottom = 'auto'; elmnt.style.right = 'auto';
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
