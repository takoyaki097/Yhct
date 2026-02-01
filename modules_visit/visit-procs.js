/**
 * FILE: modules_visit/visit-procs.js
 * CHỨC NĂNG: Quản lý Thủ thuật & Vật tư tiêu hao (Tích hợp Kho).
 * THƯ MỤC: modules_visit/
 */

window.activeProcIndex = null;

// ============================================================
// 1. RENDER OPTION & ADD (CHỌN THỦ THUẬT)
// ============================================================
window.renderProcOptions = function() { 
    const area = document.getElementById('vProcOptionsArea'); 
    if (!area) return;
    
    const procs = window.config.procs || [];
    if (procs.length === 0) { 
        area.innerHTML = '<span class="text-xs text-gray-400 italic w-full text-center py-2">Chưa cấu hình dịch vụ.</span>'; 
        return; 
    } 
    
    area.innerHTML = procs.map((p, i) => 
        `<button type="button" onclick="window.addProcToVisit(${i})" class="bg-white border border-[#d7ccc8] text-[#5d4037] px-3 py-2 rounded-lg text-xs font-bold shadow-sm active:scale-95 transition-transform hover:bg-[#efebe9]">
            ${p.name} <span class="text-[10px] opacity-70 ml-1">(${p.price.toLocaleString()})</span>
        </button>`
    ).join(''); 
};

window.addProcToVisit = async function(index) { 
    if(!window.config.procs || !window.config.procs[index]) return;
    const p = window.config.procs[index]; 
    
    // Sao chép cấu hình vật tư mặc định (nếu có)
    let consumableConfig = null;
    
    // Kiểm tra xem thủ thuật này có gắn vật tư trong Config không
    if (p.consumables && p.consumables.itemId) {
        consumableConfig = { ...p.consumables }; // Clone object
        
        // Lấy tên và đơn vị mới nhất từ Kho để hiển thị
        if (window.Inventory && window.Inventory.getItem) {
            const item = window.Inventory.getItem(consumableConfig.itemId);
            if (item) {
                consumableConfig.itemName = item.name; 
                consumableConfig.unit = item.unit;
            }
        }
    }

    // Thêm vào danh sách khám
    window.currentVisit.procs.push({ 
        name: p.name, 
        price: p.price, 
        days: 1, 
        discount: 0, 
        note: '',
        consumables: consumableConfig // Gắn vật tư vào
    }); 
    
    await window.renderProcList(); 
    if(window.calcTotal) window.calcTotal();
    
    // Auto scroll
    const container = document.getElementById('vProcList');
    if(container) container.lastElementChild?.scrollIntoView({ behavior: 'smooth' });
};

// ============================================================
// 2. RENDER LIST (DANH SÁCH ĐÃ CHỌN)
// ============================================================
window.renderProcList = async function() { 
    const container = document.getElementById('vProcList'); 
    if (!container) return;

    // Đảm bảo kho đã load để lấy tên vật tư
    if (window.Inventory && window.Inventory.init && (!window.Inventory.data || window.Inventory.data.length === 0)) {
        await window.Inventory.init();
    }

    if (!window.currentVisit.procs.length) { 
        container.innerHTML = `<div class="text-center py-4 text-gray-400 text-sm italic border border-dashed border-gray-200 rounded-xl bg-gray-50">Chưa chọn thủ thuật nào</div>`; 
        return; 
    } 
    
    container.innerHTML = window.currentVisit.procs.map((p, i) => {
        let consHtml = '';
        
        // --- LOGIC HIỂN THỊ VẬT TƯ ---
        if (p.consumables) {
            // Tính toán tổng lượng trừ kho: (Định mức * Số lần làm)
            if (p.consumables.totalDeduct === undefined) {
                p.consumables.totalDeduct = (p.consumables.amount || 0) * (p.days || 1);
            }
            if (!p.consumables.itemName) p.consumables.itemName = "";

            // Nếu có ID kho -> Link với kho (Hiển thị tên Readonly). Nếu không -> Nhập tay.
            const isLinkedToInventory = !!p.consumables.itemId;
            
            const nameDisplay = isLinkedToInventory 
                ? `<span class="text-xs font-bold text-blue-800 truncate max-w-[100px]" title="${p.consumables.itemName}">${p.consumables.itemName}</span>`
                : `<input type="text" value="${p.consumables.itemName}" placeholder="Tên VT..." onchange="window.updateProcConsumableName(${i}, this.value)" class="w-20 text-xs bg-transparent border-b border-orange-300 outline-none text-[#e65100] placeholder-orange-300">`;

            consHtml = `
            <div class="flex items-center bg-orange-50 border border-orange-200 rounded px-2 h-[38px] flex-shrink-0 gap-1 animate-fade-in ml-2">
                <span class="text-xs">📦</span>
                ${nameDisplay}
                <input type="number" value="${p.consumables.totalDeduct}" min="0" step="0.1"
                    onchange="window.updateProcConsumableDeduct(${i}, this.value)"
                    class="w-10 text-center text-sm font-bold bg-transparent outline-none text-[#e65100] border-b border-orange-300 focus:border-orange-500" title="Số lượng trừ kho">
                <span class="text-[9px] text-gray-500 font-bold">${p.consumables.unit || ''}</span>
                <button onclick="window.removeProcConsumable(${i})" class="ml-1 text-red-400 hover:text-red-600 font-bold text-xs" title="Xóa vật tư">×</button>
            </div>`;
        } else {
            // Nút thêm vật tư thủ công
            consHtml = `
            <button onclick="window.addProcConsumable(${i})" 
                    class="flex-shrink-0 bg-white text-[#e65100] border border-dashed border-orange-200 px-2 h-[38px] rounded-lg text-[10px] font-bold hover:bg-orange-50 transition-colors flex items-center gap-1 ml-2" title="Thêm vật tư tiêu hao">
                <span>+ Vật tư</span>
            </button>`;
        }

        return `
        <div class="proc-card bg-white p-3 rounded-xl border border-gray-200 shadow-sm mb-3 relative group">
            <button onclick="window.removeProcedure(${i})" class="absolute top-2 right-2 text-gray-300 hover:text-red-500 font-bold px-2 text-lg">&times;</button>
            
            <div class="flex justify-between items-center mb-2 pr-8">
                <span class="font-bold text-[#3e2723]">${p.name}</span>
                <span class="text-xs text-gray-400 font-mono">${p.price.toLocaleString()}</span>
            </div>
            
            <div class="grid grid-cols-3 gap-2 mb-2">
                <div class="proc-input-group">
                    <label class="text-[9px] text-gray-400 uppercase font-bold text-center block">Lần/ngày</label>
                    <input type="text" value="${p.days||1}" readonly onclick="window.openNumberPad && window.openNumberPad(null, 'Số ngày', '1-100', ${p.days||1}, (val)=>{window.updateProcDays(${i}, val)})" class="text-center font-bold w-full border rounded p-1 bg-gray-50 text-sm cursor-pointer">
                </div>
                <div class="proc-input-group">
                    <label class="text-[9px] text-gray-400 uppercase font-bold text-center block">Giảm %</label>
                    <input type="text" value="${p.discount||0}" readonly onclick="window.openNumberPad && window.openNumberPad(null, 'Giảm (%)', '0-100', ${p.discount||0}, (val)=>{window.updateProcDiscount(${i}, val)})" class="text-center text-blue-600 font-bold w-full border-dashed border rounded p-1 bg-gray-50 text-sm cursor-pointer">
                </div>
                <div class="proc-input-group">
                    <label class="text-[9px] text-gray-400 uppercase font-bold text-center block">Tổng</label>
                    <div class="flex items-center justify-center font-bold text-[#3e2723] bg-[#efebe9] rounded h-[29px] text-sm">
                        ${Math.round(p.price*(p.days||1)*(1-(p.discount||0)/100)).toLocaleString()}
                    </div>
                </div>
            </div>
            
            <div class="grid grid-cols-4 gap-1 mb-2">
                ${['Sáng','Trưa','Chiều','Tối'].map(t => `<button class="py-1 rounded text-[10px] font-bold uppercase border cursor-pointer select-none transition-all ${ (p.note||'').includes(t) ? 'bg-[#5d4037] text-white border-[#5d4037] shadow-sm' : 'bg-white text-gray-400 border-gray-200 hover:bg-gray-50' }" onclick="window.toggleProcNote(${i},'${t}')">${t}</button>`).join('')}
            </div>
            
            <div class="flex items-center mt-2 pt-2 border-t border-gray-100 overflow-x-auto no-scrollbar">
                <button onclick="window.openAcupointForProc(${i})" 
                        class="flex-shrink-0 bg-[#e0f2f1] text-[#00695c] border border-[#b2dfdb] px-2 h-[38px] rounded-lg text-xs font-bold hover:bg-[#b2dfdb] transition-colors flex items-center gap-1 shadow-sm">
                    <span>📍 Huyệt</span>
                </button>
                
                ${consHtml}

                <input type="text" value="${p.note||''}" 
                       onchange="window.updateProcNoteText(${i}, this.value)" 
                       placeholder="Ghi chú thêm..." 
                       class="flex-1 text-sm h-[38px] px-2 border border-gray-200 rounded-lg outline-none focus:border-[#8d6e63] bg-gray-50 min-w-[80px] ml-2">
            </div>
        </div>
    `}).join(''); 
};

// ============================================================
// 3. ACTIONS & CONSUMABLES (XỬ LÝ SỰ KIỆN)
// ============================================================

// --- CÁC HÀM VẬT TƯ ---
window.addProcConsumable = function(index) {
    if (!window.currentVisit.procs[index].consumables) {
        // Tạo object vật tư trống (nhập tay)
        window.currentVisit.procs[index].consumables = {
            itemName: "", 
            totalDeduct: 1,
            unit: ""
        };
        window.renderProcList();
    }
};

window.removeProcConsumable = function(index) {
    if (confirm("Xóa vật tư này khỏi thủ thuật?")) {
        delete window.currentVisit.procs[index].consumables;
        window.renderProcList();
    }
};

window.updateProcConsumableName = function(index, val) {
    if (window.currentVisit.procs[index].consumables) {
        window.currentVisit.procs[index].consumables.itemName = val;
    }
};

window.updateProcConsumableDeduct = function(index, val) {
    const qty = parseFloat(val);
    if (qty < 0 || isNaN(qty)) return;
    if (window.currentVisit.procs[index].consumables) {
        window.currentVisit.procs[index].consumables.totalDeduct = qty;
    }
};

// --- CÁC HÀM CẬP NHẬT THỦ THUẬT ---
window.removeProcedure = function(i) { 
    if(confirm("Xóa thủ thuật này?")) { 
        window.currentVisit.procs.splice(i,1); 
        window.renderProcList(); 
        if(window.calcTotal) window.calcTotal(); 
    } 
};

window.updateProcDays = function(i,v) { 
    const days = parseInt(v)||0; 
    window.currentVisit.procs[i].days = days;
    
    // Tự động nhân số lượng vật tư nếu có cấu hình định mức (amount)
    if (window.currentVisit.procs[i].consumables && window.currentVisit.procs[i].consumables.amount) {
        const cons = window.currentVisit.procs[i].consumables;
        cons.totalDeduct = (cons.amount || 0) * days;
    }
    
    window.renderProcList(); 
    if(window.calcTotal) window.calcTotal(); 
};

window.updateProcDiscount = function(i,v) { 
    let d=parseInt(v)||0; if(d>100) d=100; 
    window.currentVisit.procs[i].discount=d; 
    window.renderProcList(); 
    if(window.calcTotal) window.calcTotal(); 
};

window.toggleProcNote = function(i,t) { 
    let p = window.currentVisit.procs[i]; 
    let parts = (p.note||'').split(',').map(s=>s.trim()).filter(s=>s); 
    
    const k=['Sáng','Trưa','Chiều','Tối']; 
    let tp=parts.filter(x=>k.includes(x)); 
    let op=parts.filter(x=>!k.includes(x)); 
    
    if(tp.includes(t)) tp=tp.filter(x=>x!==t); else tp.push(t); 
    
    tp.sort((a,b)=>k.indexOf(a)-k.indexOf(b)); 
    p.note=[...tp,...op].join(', '); 
    
    window.renderProcList(); 
};

window.updateProcNoteText = function(i,v) { window.currentVisit.procs[i].note = v; };

// Mở Modal Huyệt để chọn huyệt cho thủ thuật này
window.openAcupointForProc = function(index) { 
    window.activeProcIndex = index; 
    if(window.openAcupointModal) window.openAcupointModal(); 
};
