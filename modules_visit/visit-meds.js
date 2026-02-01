/**
 * FILE: modules_visit/visit-meds.js
 * CHỨC NĂNG: Quản lý kê đơn thuốc (Đông y & Tây y), Bài thuốc mẫu (Giao diện Mới).
 * CẬP NHẬT: Thay thế Popup cũ bằng Modal Split View chuyên nghiệp.
 * PHIÊN BẢN: Full Code (No Omissions).
 */

// ============================================================
// 1. DISPATCHER & COMMON (HÀM CHUNG)
// ============================================================

window.renderMedList = function(type) {
    if (type === 'east') return window.renderMedListEast();
    if (type === 'west') return window.renderMedListWest();
};

window.addMedRow = function(type) { 
    if(type === 'east') {
        window.currentVisit.rxEast.push({ name:"", qty:10, days:1, price:0, usage:"" }); 
    } else {
        // Tây y có thêm các trường liều dùng Sáng/Trưa/Chiều/Tối
        window.currentVisit.rxWest.push({ name:"", qty:0, days:1, price:0, usage:"", doseS:0, doseT:0, doseC:0, doseO:0 }); 
    }
    window.renderMedList(type); 
    if(window.calcTotal) window.calcTotal(); 
    
    // Auto scroll xuống cuối danh sách
    const container = document.getElementById(type==='east'?'vMedListEast':'vMedListWest'); 
    setTimeout(() => { if(container) container.scrollTop = container.scrollHeight; }, 100);
};

window.removeMed = function(type, i) { 
    (type==='east' ? window.currentVisit.rxEast : window.currentVisit.rxWest).splice(i,1); 
    window.renderMedList(type); 
    if(window.calcTotal) window.calcTotal(); 
};

window.updateMed = function(type, i, field, value) { 
    const meds = type==='east' ? window.currentVisit.rxEast : window.currentVisit.rxWest; 
    meds[i][field] = (field==='qty'||field==='price') ? parseFloat(value) : value; 
    
    if(window.calcTotal) window.calcTotal(); 
    
    // Cập nhật hiển thị thành tiền ngay lập tức (cho Đông y)
    if(type === 'east') {
        const container = document.getElementById('vMedListEast');
        const days = window.currentVisit.eastDays || 1;
        if(container && container.children[i]) {
            const totalDiv = container.children[i].querySelector('.proc-total-display');
            if(totalDiv) totalDiv.innerText = ((meds[i].qty||0)*(meds[i].price||0)*days).toLocaleString();
        }
    }
};

// Hàm chọn giờ uống thuốc (cho từng vị/loại thuốc riêng lẻ)
window.toggleMedUsage = function(type, i, time) { 
    if (document.activeElement instanceof HTMLElement) document.activeElement.blur();
    const med = (type==='east' ? window.currentVisit.rxEast : window.currentVisit.rxWest)[i]; 
    
    let parts = (med.usage || '').split(',').map(p => p.trim()).filter(p => p); 
    const keywords = ['Sáng', 'Trưa', 'Chiều', 'Tối']; 
    
    let tParts = parts.filter(p => keywords.includes(p)); 
    let oParts = parts.filter(p => !keywords.includes(p)); 
    
    if (tParts.includes(time)) tParts = tParts.filter(t => t !== time); 
    else tParts.push(time); 
    
    // Sắp xếp lại theo thứ tự chuẩn
    tParts.sort((a, b) => keywords.indexOf(a) - keywords.indexOf(b)); 
    
    med.usage = [...tParts, ...oParts].join(', '); 
    window.renderMedList(type); 
};

// ============================================================
// 2. LOGIC ĐÔNG Y (EASTERN MEDICINE)
// ============================================================

window.renderMedListEast = function() {
    const list = document.getElementById('vMedListEast');
    if (!list) return; 

    const data = window.currentVisit.rxEast;
    const days = window.currentVisit.eastDays || 1;
    
    if (data.length === 0) {
        list.innerHTML = `<div class="text-center py-6 text-gray-400 italic text-sm border-2 border-dashed border-gray-200 rounded-lg bg-gray-50">Chưa kê vị thuốc nào</div>`;
        return;
    }

    list.innerHTML = data.map((m,i)=> {
        const timeButtonsHtml = ['Sáng', 'Trưa', 'Chiều', 'Tối'].map(t => {
            const isActive = (m.usage || '').includes(t);
            let btnClass = "flex-1 py-1.5 rounded-lg text-[10px] font-bold uppercase transition-all duration-200 transform border cursor-pointer ";
            if (isActive) {
                btnClass += "text-white border-transparent shadow-md scale-105 ";
                if (t === 'Sáng') btnClass += "bg-gradient-to-br from-orange-400 to-yellow-400";
                else if (t === 'Trưa') btnClass += "bg-gradient-to-br from-red-500 to-pink-500";
                else if (t === 'Chiều') btnClass += "bg-gradient-to-br from-purple-500 to-pink-400";
                else if (t === 'Tối') btnClass += "bg-gradient-to-br from-blue-700 to-indigo-800";
            } else {
                btnClass += "bg-gray-50 text-gray-400 border-gray-200 hover:bg-gray-100 shadow-none scale-100";
            }
            return `<button class="${btnClass}" onclick="window.toggleMedUsage('east',${i},'${t}')">${t}</button>`;
        }).join('');

        return `
        <div class="proc-card bg-white p-3 rounded-xl border border-gray-200 shadow-sm mb-2 relative">
            <button onclick="window.removeMed('east',${i})" class="absolute top-2 right-2 text-gray-300 hover:text-red-500 text-lg font-bold">&times;</button>
            <div class="flex justify-between items-end mb-3 border-b border-dashed border-gray-200 pb-2 pr-6">
                <input type="text" value="${m.name}" onchange="window.updateMed('east',${i},'name',this.value)" class="font-bold text-[#3e2723] text-base bg-transparent border-none outline-none w-full placeholder-gray-400" placeholder="Tên vị thuốc..." onfocus="this.blur=null">
            </div>
            <div class="grid grid-cols-3 gap-3 mb-3">
                <div class="proc-input-group">
                    <label class="text-[9px] font-bold text-gray-400 uppercase block text-center">SL (g)</label>
                    <input type="number" value="${m.qty}" oninput="window.updateMed('east',${i},'qty',this.value)" onfocus="this.select()" class="w-full text-center font-bold border rounded py-1 bg-gray-50 text-[#3e2723]">
                </div>
                <div class="proc-input-group">
                    <label class="text-[9px] font-bold text-gray-400 uppercase block text-center">Đơn giá</label>
                    <input type="number" value="${m.price||0}" oninput="window.updateMed('east',${i},'price',this.value)" onfocus="this.select()" class="w-full text-center text-gray-600 border rounded py-1 bg-gray-50">
                </div>
                <div class="proc-input-group">
                    <label class="text-[9px] font-bold text-gray-400 uppercase block text-center">Thành tiền</label>
                    <div class="proc-total-display flex items-center justify-center font-bold text-[#3e2723] bg-gray-100 rounded h-[34px] text-sm">
                        ${((m.qty||0)*(m.price||0)*days).toLocaleString()}
                    </div>
                </div>
            </div>
            <div class="grid grid-cols-4 gap-2">${timeButtonsHtml}</div>
        </div>
    `;}).join('');
};

// --- GLOBAL USAGE BUTTONS (Cho cả đơn thuốc - phần Ghi chú/Cách dùng chung) ---
window.toggleGlobalEastUsage = function(timeStr) {
    const el = document.getElementById('vEastNote'); 
    let currentText = el.value || '';
    let parts = currentText.split(/,|;/).map(s => s.trim()).filter(s => s); 
    const keywords = ['Sáng', 'Trưa', 'Chiều', 'Tối']; 
    
    let timeParts = parts.filter(x => keywords.includes(x)); 
    let otherParts = parts.filter(x => !keywords.includes(x)); 
    
    if (timeParts.includes(timeStr)) timeParts = timeParts.filter(t => t !== timeStr); 
    else timeParts.push(timeStr); 
    
    timeParts.sort((a,b) => keywords.indexOf(a) - keywords.indexOf(b)); 
    el.value = [...otherParts, ...timeParts].join(', '); 
    
    window.syncGlobalTimeButtons(timeParts);
};

window.syncGlobalTimeButtons = function(activeTimes) {
    const container = document.getElementById('globalEastTimeGroup');
    if(!container) return;
    
    Array.from(container.children).forEach(btn => {
        const keyword = btn.innerText.trim();
        const isActive = activeTimes.includes(keyword);
        
        // Reset class
        btn.className = "time-btn-large flex items-center justify-center transition-all duration-200 border cursor-pointer select-none";
        
        if(isActive) {
            btn.classList.add('text-white', 'border-transparent', 'shadow-md', 'font-bold');
            if (keyword === 'Sáng') btn.classList.add('bg-gradient-to-br', 'from-orange-400', 'to-yellow-400');
            else if (keyword === 'Trưa') btn.classList.add('bg-gradient-to-br', 'from-red-500', 'to-pink-500');
            else if (keyword === 'Chiều') btn.classList.add('bg-gradient-to-br', 'from-purple-500', 'to-pink-400');
            else if (keyword === 'Tối') btn.classList.add('bg-gradient-to-br', 'from-blue-700', 'to-indigo-800');
        } else {
            btn.classList.add('bg-white', 'text-gray-400', 'border-gray-200', 'hover:bg-gray-50');
        }
    });
};

window.updateGlobalButtonsFromText = function() {
    const el = document.getElementById('vEastNote');
    if(!el) return;
    const text = el.value || '';
    const parts = text.split(/,|;/).map(s => s.trim());
    const keywords = ['Sáng','Trưa','Chiều','Tối'];
    const activeTimes = keywords.filter(k => parts.includes(k));
    window.syncGlobalTimeButtons(activeTimes);
};

/* ==========================================================================
   3. [UPDATED] GIAO DIỆN BÀI THUỐC MẪU (MODAL SPLIT VIEW)
   Thay thế cho Popup cũ bằng Modal chuyên nghiệp (Tương tự Tra cứu Huyệt)
   ========================================================================== */

window.selectedSampleIndex = null;

// Hàm mở Modal (Thay thế logic popup cũ)
window.showSamplePrescriptionPopup = function(btnElement) {
    // Đảm bảo template đã được nạp
    const modal = document.getElementById('sampleMedModal');
    if(!modal) { alert("Lỗi: Template Bài thuốc mẫu chưa được nạp (Kiểm tra template-loader.js)."); return; }

    // Reset UI Modal
    document.getElementById('sampleSearchInput').value = '';
    window.selectedSampleIndex = null;
    document.getElementById('sampleMedDetailBox').classList.add('hidden');
    document.getElementById('sampleMedEmptyState').classList.remove('hidden');

    // Render danh sách
    window.renderSampleMedList();
    modal.classList.add('active');
};

// Render danh sách bài thuốc bên trái (Sidebar)
window.renderSampleMedList = function(keyword = '') {
    const listContainer = document.getElementById('sampleMedListContainer');
    if(!listContainer) return;

    // Lấy dữ liệu: Ưu tiên config người dùng, fallback sang hệ thống nếu trống
    let samples = window.config.samplePrescriptions || [];
    if (samples.length === 0 && window.CONFIG_MEDICINE && window.CONFIG_MEDICINE.DEFAULT_EAST_SAMPLES) {
        samples = window.CONFIG_MEDICINE.DEFAULT_EAST_SAMPLES;
    }

    // Filter theo từ khóa
    const kw = keyword.toLowerCase().trim();
    const filtered = samples.map((s, idx) => ({ ...s, originalIndex: idx })).filter(s => {
        return s.name.toLowerCase().includes(kw);
    });

    if(filtered.length === 0) {
        listContainer.innerHTML = `<div class="text-center py-10 text-gray-400 text-xs italic">Không tìm thấy bài thuốc nào.</div>`;
        return;
    }

    listContainer.innerHTML = filtered.map(s => {
        const isActive = (window.selectedSampleIndex === s.originalIndex);
        const bgClass = isActive ? 'bg-[#5d4037] text-white shadow-md border-transparent' : 'bg-white text-[#3e2723] hover:bg-[#efebe9] border-[#e0e0e0]';
        const countTextClass = isActive ? 'text-white/70' : 'text-gray-400';

        return `
        <div onclick="window.showSampleMedDetail(${s.originalIndex})" class="p-3 mb-2 rounded-xl border cursor-pointer transition-all duration-200 group ${bgClass}">
            <div class="font-bold text-sm leading-tight mb-1">${s.name}</div>
            <div class="text-[10px] font-mono ${countTextClass} flex justify-between items-center">
                <span>${s.ingredients ? s.ingredients.length : 0} vị</span>
                ${isActive ? '<span>●</span>' : ''}
            </div>
        </div>`;
    }).join('');
};

// Hiển thị chi tiết bên phải (Detail View)
window.showSampleMedDetail = function(index) {
    let samples = window.config.samplePrescriptions || [];
    if (samples.length === 0 && window.CONFIG_MEDICINE) samples = window.CONFIG_MEDICINE.DEFAULT_EAST_SAMPLES;
    
    const sample = samples[index];
    if(!sample) return;

    window.selectedSampleIndex = index;
    // Re-render list để cập nhật trạng thái active (highlight)
    window.renderSampleMedList(document.getElementById('sampleSearchInput').value); 

    // Fill Data vào Detail Box
    document.getElementById('detailSampleName').innerText = sample.name;
    document.getElementById('detailSampleCount').innerText = sample.ingredients.length;

    // Render Grid Thành phần
    const grid = document.getElementById('detailSampleIngredients');
    grid.innerHTML = sample.ingredients.map(ing => `
        <div class="bg-white p-3 rounded-xl border border-gray-200 shadow-sm flex justify-between items-center">
            <span class="font-bold text-[#3e2723] text-sm">${ing.name}</span>
            <span class="font-mono font-black text-[#e65100] bg-orange-50 px-2 py-0.5 rounded text-sm">${ing.qty}g</span>
        </div>
    `).join('');

    // Switch View
    document.getElementById('sampleMedEmptyState').classList.add('hidden');
    document.getElementById('sampleMedDetailBox').classList.remove('hidden');
};

// Áp dụng bài thuốc đã chọn vào đơn thuốc hiện tại
window.applySelectedSampleToVisit = function() {
    if(window.selectedSampleIndex === null) return;

    let samples = window.config.samplePrescriptions || [];
    if (samples.length === 0 && window.CONFIG_MEDICINE) samples = window.CONFIG_MEDICINE.DEFAULT_EAST_SAMPLES;
    const sample = samples[window.selectedSampleIndex];

    if(!sample) return;

    // Thêm từng vị thuốc vào danh sách khám hiện tại
    sample.ingredients.forEach(ing => {
        window.currentVisit.rxEast.push({
            name: ing.name, qty: ing.qty || 10, days: 1, price: 0, usage: ""
        });
    });

    // Render lại giao diện khám và tính lại tiền
    window.renderMedList('east');
    if(window.calcTotal) window.calcTotal();
    
    // Đóng Modal
    document.getElementById('sampleMedModal').classList.remove('active');
    
    // Scroll xuống cuối danh sách thuốc
    const container = document.getElementById('vMedListEast'); 
    setTimeout(() => { if(container) container.scrollTop = container.scrollHeight; }, 100);
    
    if(window.showToast) window.showToast(`✅ Đã thêm bài thuốc: ${sample.name}`, "success");
};

// ============================================================
// 4. LOGIC TÂY Y (WESTERN MEDICINE)
// ============================================================

window.renderMedListWest = function() {
    const list = document.getElementById('vMedListWest');
    if (!list) return; 
    
    // Đảm bảo nút Tra cứu nhanh được thêm vào
    window.injectWestControls();
    
    const data = window.currentVisit.rxWest;
    if (data.length === 0) {
        list.innerHTML = `<div class="text-center py-6 text-gray-400 italic text-sm border-2 border-dashed border-gray-200 rounded-lg bg-gray-50">Chưa kê thuốc nào</div>`;
        return;
    }
    
    list.innerHTML = data.map((m, i) => {
        m.doseS = m.doseS || 0; m.doseT = m.doseT || 0; m.doseC = m.doseC || 0; m.doseO = m.doseO || 0; 
        
        return `
        <div class="proc-card p-3 relative bg-white border border-gray-200 rounded-xl shadow-sm mb-3">
            <button onclick="window.removeMed('west',${i})" class="absolute top-2 right-2 text-gray-300 hover:text-red-500 font-bold text-lg">&times;</button>
            
            <div class="mb-2 pr-8">
                <input type="text" value="${m.name}" onchange="window.updateMed('west',${i},'name',this.value)" class="font-bold text-[#1565c0] text-base bg-transparent border-b border-dashed border-gray-300 w-full outline-none placeholder-blue-200" placeholder="Tên thuốc...">
            </div>
            
            <div class="bg-blue-50 rounded-lg p-2 mb-2">
                <div class="flex justify-between text-[10px] text-blue-800 font-bold mb-1 px-1"><span class="w-1/4 text-center">SÁNG</span><span class="w-1/4 text-center">TRƯA</span><span class="w-1/4 text-center">CHIỀU</span><span class="w-1/4 text-center">TỐI</span></div>
                <div class="grid grid-cols-4 gap-2">
                    <input type="number" value="${m.doseS||''}" placeholder="-" oninput="window.updateWestDose(${i}, 'doseS', this.value)" class="text-center font-bold text-blue-900 bg-white border border-blue-200 rounded py-1 focus:border-blue-500 outline-none">
                    <input type="number" value="${m.doseT||''}" placeholder="-" oninput="window.updateWestDose(${i}, 'doseT', this.value)" class="text-center font-bold text-blue-900 bg-white border border-blue-200 rounded py-1 focus:border-blue-500 outline-none">
                    <input type="number" value="${m.doseC||''}" placeholder="-" oninput="window.updateWestDose(${i}, 'doseC', this.value)" class="text-center font-bold text-blue-900 bg-white border border-blue-200 rounded py-1 focus:border-blue-500 outline-none">
                    <input type="number" value="${m.doseO||''}" placeholder="-" oninput="window.updateWestDose(${i}, 'doseO', this.value)" class="text-center font-bold text-blue-900 bg-white border border-blue-200 rounded py-1 focus:border-blue-500 outline-none">
                </div>
            </div>
            
            <div class="flex justify-between items-center gap-2">
                <div class="text-xs text-gray-500 italic flex-1 truncate" id="westUsageText_${i}">${window.generateUsageText(m)}</div>
                <div class="flex items-center gap-1 bg-gray-100 px-2 py-1 rounded border border-gray-300">
                    <span class="text-[10px] text-gray-500 font-bold">TỔNG:</span>
                    <span class="font-black text-base text-[#3e2723]" id="westTotal_${i}">${m.qty}</span>
                    <span class="text-[10px] text-gray-500">v</span>
                </div>
            </div>
        </div>`;
    }).join('');
};

window.updateWestDose = function(index, field, value) {
    const meds = window.currentVisit.rxWest;
    meds[index][field] = parseFloat(value) || 0;
    
    // Tính lại tổng số lượng
    window.recalcWestRow(index);
    
    // Cập nhật text hướng dẫn
    const usageText = window.generateUsageText(meds[index]);
    meds[index].usage = usageText; 
    document.getElementById(`westUsageText_${index}`).innerText = usageText;
};

window.recalcWestRow = function(index) {
    const meds = window.currentVisit.rxWest;
    const m = meds[index];
    const days = parseInt(document.getElementById('vWestDays').value) || 1;
    
    // Tổng ngày = (Sáng + Trưa + Chiều + Tối) * Số ngày thuốc
    const dailyTotal = (m.doseS||0) + (m.doseT||0) + (m.doseC||0) + (m.doseO||0);
    m.qty = dailyTotal * days;
    
    const totalEl = document.getElementById(`westTotal_${index}`);
    if(totalEl) totalEl.innerText = m.qty;
    
    if(window.calcTotal) window.calcTotal();
};

window.generateUsageText = function(m) {
    let parts = [];
    if(m.doseS > 0) parts.push(`Sáng ${m.doseS}`);
    if(m.doseT > 0) parts.push(`Trưa ${m.doseT}`);
    if(m.doseC > 0) parts.push(`Chiều ${m.doseC}`);
    if(m.doseO > 0) parts.push(`Tối ${m.doseO}`);
    
    if(parts.length === 0) return "Chưa nhập liều dùng";
    return "Uống: " + parts.join(', ') + " (viên)";
};

window.injectWestControls = function() {
    const listContainer = document.getElementById('vMedListWest');
    if(!listContainer) return;
    const parent = listContainer.parentElement;
    
    if(!parent.querySelector('#btnOpenWestLookup')) {
        const btnDiv = document.createElement('div');
        btnDiv.className = "mb-3";
        btnDiv.innerHTML = `
            <button id="btnOpenWestLookup" onclick="window.openWestLookupModal()" class="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg shadow-md flex items-center justify-center gap-2 transition-all">
                <span>💊 TRA CỨU THUỐC NHANH</span>
            </button>
        `;
        parent.insertBefore(btnDiv, listContainer);
    }
};

// Modal Tra cứu thuốc Tây (2 cột)
window.openWestLookupModal = function() {
    // Nếu modal chưa có trong DOM, tạo mới
    if (!document.getElementById('westLookupModal')) {
        const modalHtml = `
        <div id="westLookupModal" class="modal z-[3000]">
            <div class="modal-box w-full max-w-4xl h-[80vh] flex flex-col bg-white rounded-xl overflow-hidden shadow-2xl">
                <div class="flex justify-between items-center p-3 bg-blue-800 text-white shadow-md z-10">
                    <h3 class="font-bold text-lg uppercase flex items-center gap-2"><span>💊</span> Danh mục thuốc Tây Y</h3>
                    <button onclick="document.getElementById('westLookupModal').classList.remove('active')" class="text-2xl hover:text-red-300 w-8 h-8 flex items-center justify-center rounded-full hover:bg-blue-700">&times;</button>
                </div>
                <div class="flex flex-1 overflow-hidden">
                    <div class="w-1/3 bg-gray-50 border-r border-gray-200 overflow-y-auto p-2 space-y-2" id="westGroupList"></div>
                    <div class="w-2/3 bg-white overflow-y-auto p-4 flex flex-col">
                        <div class="relative mb-4"><span class="absolute left-3 top-2.5 text-gray-400">🔍</span><input type="text" id="westSearchInput" onkeyup="window.filterWestItems()" placeholder="Tìm tên thuốc..." class="w-full pl-9 p-2 border border-blue-200 rounded-lg focus:border-blue-500 outline-none shadow-sm"></div>
                        <div id="westItemList" class="grid grid-cols-2 gap-3 pb-10"><div class="col-span-2 text-center text-gray-400 mt-10 italic">Chọn một nhóm bên trái để xem thuốc...</div></div>
                    </div>
                </div>
            </div>
        </div>`;
        document.body.insertAdjacentHTML('beforeend', modalHtml);
    }
    
    // Nạp dữ liệu nhóm thuốc từ Config
    const groups = (window.CONFIG_MEDICINE && window.CONFIG_MEDICINE.WEST_GROUPS) ? window.CONFIG_MEDICINE.WEST_GROUPS : [];
    const groupListEl = document.getElementById('westGroupList');
    
    if(groups.length === 0) {
        groupListEl.innerHTML = `<div class="p-4 text-center text-sm text-gray-500">Chưa có config thuốc (config-medicine.js)</div>`;
    } else {
        groupListEl.innerHTML = groups.map((g, idx) => `
            <button onclick="window.selectWestGroup(${idx})" class="w-full text-left p-3 rounded-lg border border-transparent hover:bg-white hover:shadow-sm transition-all ${g.color} font-bold text-sm relative group-btn flex items-center justify-between" id="grp-btn-${idx}">
                <span>${g.name}</span><span class="text-xs opacity-60">➤</span>
            </button>
        `).join('');
    }
    
    document.getElementById('westLookupModal').classList.add('active');
    
    // Auto select nhóm đầu tiên
    setTimeout(() => {
        if(groups.length > 0) window.selectWestGroup(0);
        document.getElementById('westSearchInput').focus();
    }, 100);
};

window.selectWestGroup = function(idx) {
    document.querySelectorAll('.group-btn').forEach(b => b.classList.remove('ring-2', 'ring-blue-400', 'bg-white', 'shadow-md'));
    const activeBtn = document.getElementById(`grp-btn-${idx}`);
    if(activeBtn) activeBtn.classList.add('ring-2', 'ring-blue-400', 'bg-white', 'shadow-md');
    
    const group = window.CONFIG_MEDICINE.WEST_GROUPS[idx];
    const container = document.getElementById('westItemList');
    
    container.innerHTML = group.items.map(item => `
        <button onclick="window.addSuggestedMed('west', '${item}');" class="p-3 text-left border border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-all flex flex-col group shadow-sm bg-white">
            <span class="font-bold text-gray-800 group-hover:text-blue-800">${item}</span>
            <span class="text-[10px] text-gray-400 mt-1 flex items-center gap-1"><span class="w-1.5 h-1.5 rounded-full bg-green-400 inline-block"></span> Thêm vào đơn</span>
        </button>
    `).join('');
};

window.filterWestItems = function() {
    const keyword = document.getElementById('westSearchInput').value.toLowerCase();
    const buttons = document.getElementById('westItemList').querySelectorAll('button');
    buttons.forEach(btn => {
        const text = btn.innerText.toLowerCase();
        btn.style.display = text.includes(keyword) ? 'flex' : 'none';
    });
};

window.addSuggestedMed = function(type, name) {
    const list = type === 'east' ? window.currentVisit.rxEast : window.currentVisit.rxWest;
    
    if(type === 'east') {
        list.push({ name: name, qty: 10, days: 1, price: 0, usage: "" });
    } else {
        list.push({ name: name, qty: 0, days: 1, price: 0, usage: "", doseS:0, doseT:0, doseC:0, doseO:0 });
    }
    
    window.renderMedList(type); 
    if(window.calcTotal) window.calcTotal();
    
    const container = document.getElementById(type==='east'?'vMedListEast':'vMedListWest'); 
    setTimeout(() => { if(container) container.scrollTop = container.scrollHeight; }, 100);
    
    if(window.showToast) window.showToast(`✅ Đã thêm thuốc: ${name}`, "success");
};
