/**
 * FILE: modules_visit/visit-meds.js
 * CHỨC NĂNG: Quản lý kê đơn thuốc.
 * CẬP NHẬT: Xóa bỏ giao diện cũ, chuyển hướng hoàn toàn sang KnowledgeUI (Split View).
 */

// ============================================================
// 1. CÁC HÀM RENDER LIST THUỐC TRONG PHIẾU KHÁM
// ============================================================

window.renderMedList = function(type) {
    if (type === 'east') return window.renderMedListEast();
    if (type === 'west') return window.renderMedListWest();
};

window.addMedRow = function(type) { 
    if(type === 'east') {
        window.currentVisit.rxEast.push({ name:"", qty:10, days:1, price:0, usage:"" }); 
    } else {
        window.currentVisit.rxWest.push({ name:"", qty:0, days:1, price:0, usage:"", doseS:0, doseT:0, doseC:0, doseO:0 }); 
    }
    window.renderMedList(type); 
    if(window.calcTotal) window.calcTotal(); 
    
    const container = document.getElementById(type==='east'?'vMedListEast':'vMedListWest'); 
    setTimeout(() => { if(container) container.scrollTop = container.scrollHeight; }, 100);
};

window.removeMed = function(type, i) { 
    (type==='east' ? window.currentVisit.rxEast : window.currentVisit.rxWest).splice(i,1); 
    window.renderMedList(type); 
    if(window.calcTotal) window.calcTotal(); 
    if (window.refreshAiSuggestion) window.refreshAiSuggestion(false);
};

window.updateMed = function(type, i, field, value) { 
    const meds = type==='east' ? window.currentVisit.rxEast : window.currentVisit.rxWest; 
    meds[i][field] = (field==='qty'||field==='price') ? parseFloat(value) : value; 
    if(window.calcTotal) window.calcTotal(); 
    
    if(type === 'east') {
        const container = document.getElementById('vMedListEast');
        const days = window.currentVisit.eastDays || 1;
        if(container && container.children[i]) {
            const totalDiv = container.children[i].querySelector('.proc-total-display');
            if(totalDiv) totalDiv.innerText = ((meds[i].qty||0)*(meds[i].price||0)*days).toLocaleString();
        }
    }
    if (field === 'name' && window.refreshAiSuggestion) window.refreshAiSuggestion(false);
};

window.toggleMedUsage = function(type, i, time) { 
    if (document.activeElement instanceof HTMLElement) document.activeElement.blur();
    const med = (type==='east' ? window.currentVisit.rxEast : window.currentVisit.rxWest)[i]; 
    let parts = (med.usage || '').split(',').map(p => p.trim()).filter(p => p); 
    const keywords = ['Sáng', 'Trưa', 'Chiều', 'Tối']; 
    let tParts = parts.filter(p => keywords.includes(p)); 
    let oParts = parts.filter(p => !keywords.includes(p)); 
    if (tParts.includes(time)) tParts = tParts.filter(t => t !== time); else tParts.push(time); 
    tParts.sort((a, b) => keywords.indexOf(a) - keywords.indexOf(b)); 
    med.usage = [...tParts, ...oParts].join(', '); 
    window.renderMedList(type); 
};

// ============================================================
// 2. RENDER ĐÔNG Y
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
            let btnClass = isActive ? "bg-gradient-to-br from-[#5d4037] to-[#3e2723] text-white shadow-md border-transparent scale-105" : "bg-gray-50 text-gray-400 border-gray-200 hover:bg-gray-100";
            return `<button class="flex-1 py-1.5 rounded-lg text-[10px] font-bold uppercase transition-all duration-200 transform border cursor-pointer ${btnClass}" onclick="window.toggleMedUsage('east',${i},'${t}')">${t}</button>`;
        }).join('');

        return `
        <div class="proc-card bg-white p-3 rounded-xl border border-gray-200 shadow-sm mb-2 relative">
            <button onclick="window.removeMed('east',${i})" class="absolute top-2 right-2 text-gray-300 hover:text-red-500 text-lg font-bold">&times;</button>
            <div class="flex justify-between items-end mb-3 border-b border-dashed border-gray-200 pb-2 pr-6">
                <input type="text" value="${m.name}" onchange="window.updateMed('east',${i},'name',this.value)" class="font-bold text-[#3e2723] text-base bg-transparent border-none outline-none w-full placeholder-gray-400" placeholder="Tên vị thuốc..." onfocus="this.blur=null">
            </div>
            <div class="grid grid-cols-3 gap-3 mb-3">
                <div class="proc-input-group"><label class="text-[9px] font-bold text-gray-400 uppercase block text-center">SL (g)</label><input type="number" value="${m.qty}" oninput="window.updateMed('east',${i},'qty',this.value)" class="w-full text-center font-bold border rounded py-1 bg-gray-50 text-[#3e2723]"></div>
                <div class="proc-input-group"><label class="text-[9px] font-bold text-gray-400 uppercase block text-center">Đơn giá</label><input type="number" value="${m.price||0}" oninput="window.updateMed('east',${i},'price',this.value)" class="w-full text-center text-gray-600 border rounded py-1 bg-gray-50"></div>
                <div class="proc-input-group"><label class="text-[9px] font-bold text-gray-400 uppercase block text-center">Thành tiền</label><div class="proc-total-display flex items-center justify-center font-bold text-[#3e2723] bg-gray-100 rounded h-[34px] text-sm">${((m.qty||0)*(m.price||0)*days).toLocaleString()}</div></div>
            </div>
            <div class="grid grid-cols-4 gap-2">${timeButtonsHtml}</div>
        </div>`;
    }).join('');
};

window.toggleGlobalEastUsage = function(timeStr) {
    const el = document.getElementById('vEastNote'); 
    let currentText = el.value || '';
    let parts = currentText.split(/,|;/).map(s => s.trim()).filter(s => s); 
    const keywords = ['Sáng', 'Trưa', 'Chiều', 'Tối']; 
    let timeParts = parts.filter(x => keywords.includes(x)); 
    let otherParts = parts.filter(x => !keywords.includes(x)); 
    if (timeParts.includes(timeStr)) timeParts = timeParts.filter(t => t !== timeStr); else timeParts.push(timeStr); 
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
        btn.className = `time-btn-large flex items-center justify-center transition-all duration-200 border cursor-pointer select-none ${isActive ? 'bg-[#5d4037] text-white border-transparent shadow-md font-bold' : 'bg-white text-gray-400 border-gray-200 hover:bg-gray-50'}`;
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

// ============================================================
// 3. RENDER TÂY Y (Đã xóa logic cũ, trỏ về KnowledgeUI)
// ============================================================

window.renderMedListWest = function() {
    const list = document.getElementById('vMedListWest');
    if (!list) return; 
    
    // Nút mở Modal MỚI (KnowledgeUI)
    window.injectWestControls();
    
    const data = window.currentVisit.rxWest;
    if (data.length === 0) {
        list.innerHTML = `<div class="text-center py-6 text-gray-400 italic text-sm border-2 border-dashed border-gray-200 rounded-lg bg-gray-50">Chưa kê thuốc nào</div>`;
        return;
    }
    
    list.innerHTML = data.map((m, i) => {
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
    window.recalcWestRow(index);
    const usageText = window.generateUsageText(meds[index]);
    meds[index].usage = usageText; 
    document.getElementById(`westUsageText_${index}`).innerText = usageText;
};

window.recalcWestRow = function(index) {
    const meds = window.currentVisit.rxWest;
    const m = meds[index];
    const days = parseInt(document.getElementById('vWestDays').value) || 1;
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

// [QUAN TRỌNG] GỌI MODAL MỚI KHI BẤM NÚT
window.injectWestControls = function() {
    const listContainer = document.getElementById('vMedListWest');
    if(!listContainer) return;
    const parent = listContainer.parentElement;
    
    // Nếu chưa có nút, chèn vào
    if(!parent.querySelector('#btnOpenWestLookup')) {
        const btnDiv = document.createElement('div');
        btnDiv.className = "mb-3";
        // Gọi thẳng KnowledgeUI.open('west')
        btnDiv.innerHTML = `
            <button id="btnOpenWestLookup" onclick="window.KnowledgeUI.open('west')" class="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg shadow-md flex items-center justify-center gap-2 transition-all">
                <span>💊 TRA CỨU THUỐC & AI</span>
            </button>
        `;
        parent.insertBefore(btnDiv, listContainer);
    }
};

// Logic bài thuốc mẫu (Giữ nguyên vì dùng modal riêng)
window.selectedSampleIndex = null;
window.showSamplePrescriptionPopup = function() {
    const modal = document.getElementById('sampleMedModal');
    if(!modal) return;
    document.getElementById('sampleSearchInput').value = '';
    window.selectedSampleIndex = null;
    document.getElementById('sampleMedDetailBox').classList.add('hidden');
    document.getElementById('sampleMedEmptyState').classList.remove('hidden');
    window.renderSampleMedList();
    modal.classList.add('active');
};
window.renderSampleMedList = function(keyword = '') {
    const listContainer = document.getElementById('sampleMedListContainer');
    if(!listContainer) return;
    let samples = window.config.samplePrescriptions || [];
    if (samples.length === 0 && window.CONFIG_MEDICINE) samples = window.CONFIG_MEDICINE.DEFAULT_EAST_SAMPLES;
    const kw = keyword.toLowerCase().trim();
    const filtered = samples.map((s, idx) => ({ ...s, originalIndex: idx })).filter(s => s.name.toLowerCase().includes(kw));
    if(filtered.length === 0) { listContainer.innerHTML = `<div class="text-center py-10 text-gray-400 text-xs italic">Không tìm thấy.</div>`; return; }
    listContainer.innerHTML = filtered.map(s => {
        const isActive = (window.selectedSampleIndex === s.originalIndex);
        const bgClass = isActive ? 'bg-[#5d4037] text-white' : 'bg-white text-[#3e2723] hover:bg-[#efebe9]';
        return `<div onclick="window.showSampleMedDetail(${s.originalIndex})" class="p-3 mb-2 rounded-xl border cursor-pointer transition-all duration-200 group ${bgClass}"><div class="font-bold text-sm leading-tight">${s.name}</div><div class="text-[10px] opacity-70">${s.ingredients ? s.ingredients.length : 0} vị</div></div>`;
    }).join('');
};
window.showSampleMedDetail = function(index) {
    let samples = window.config.samplePrescriptions || [];
    if (samples.length === 0 && window.CONFIG_MEDICINE) samples = window.CONFIG_MEDICINE.DEFAULT_EAST_SAMPLES;
    const sample = samples[index]; if(!sample) return;
    window.selectedSampleIndex = index;
    window.renderSampleMedList(document.getElementById('sampleSearchInput').value); 
    document.getElementById('detailSampleName').innerText = sample.name;
    document.getElementById('detailSampleCount').innerText = sample.ingredients.length;
    document.getElementById('detailSampleIngredients').innerHTML = sample.ingredients.map(ing => `<div class="bg-white p-3 rounded-xl border border-gray-200 shadow-sm flex justify-between items-center"><span class="font-bold text-[#3e2723] text-sm">${ing.name}</span><span class="font-mono font-black text-[#e65100] bg-orange-50 px-2 py-0.5 rounded text-sm">${ing.qty}g</span></div>`).join('');
    document.getElementById('sampleMedEmptyState').classList.add('hidden');
    document.getElementById('sampleMedDetailBox').classList.remove('hidden');
};
window.applySelectedSampleToVisit = function() {
    if(window.selectedSampleIndex === null) return;
    let samples = window.config.samplePrescriptions || [];
    if (samples.length === 0 && window.CONFIG_MEDICINE) samples = window.CONFIG_MEDICINE.DEFAULT_EAST_SAMPLES;
    const sample = samples[window.selectedSampleIndex]; if(!sample) return;
    sample.ingredients.forEach(ing => {
        const exists = window.currentVisit.rxEast.some(i => i.name.toLowerCase() === ing.name.toLowerCase());
        if (!exists) window.currentVisit.rxEast.push({ name: ing.name, qty: ing.qty || 10, days: 1, price: 0, usage: "" });
    });
    window.renderMedList('east'); if(window.calcTotal) window.calcTotal();
    document.getElementById('sampleMedModal').classList.remove('active');
    if(window.showToast) window.showToast(`✅ Đã áp dụng bài: ${sample.name}`, "success");
    if(window.refreshAiSuggestion) window.refreshAiSuggestion(false);
};
