/**
 * FILE: modules_visit/visit-map.js
 * CHỨC NĂNG: Logic Tra cứu Huyệt & Dược liệu (Kết nối với Knowledge Base).
 * THƯ MỤC: modules_visit/
 */

// ============================================================
// 0. KHỞI TẠO STATE
// ============================================================

window.selectedAcupointId = null;
window.acuFilterState = { regions: [], meridians: [] };

// ============================================================
// A. LOGIC TRA CỨU HUYỆT (ACUPOINTS)
// ============================================================

// Hàm nhận diện vùng cơ thể dựa trên ID huyệt
window.detectAcupointRegion = function(p) {
    if (p.region) return p.region;
    const id = p.id; const code = id.replace(/[0-9].*/, ''); const num = parseInt(id.match(/\d+/)) || 0;
    
    if (['LU', 'HT', 'PC'].includes(code)) return 'Tay';
    if (code === 'LI') return num <= 11 ? 'Tay' : (num <= 16 ? 'Vai' : 'Mặt');
    if (code === 'SI') return num <= 8 ? 'Tay' : (num <= 15 ? 'Vai' : 'Mặt');
    if (code === 'TE') return num <= 10 ? 'Tay' : (num <= 15 ? 'Vai' : 'Đầu');
    if (code === 'ST') return num <= 8 ? 'Mặt' : (num <= 30 ? 'Bụng' : 'Chân');
    if (code === 'SP') return num <= 11 ? 'Chân' : 'Bụng';
    if (code === 'BL') return num <= 10 ? 'Đầu' : (num <= 35 ? 'Lưng' : 'Chân');
    if (code === 'KI') return num <= 10 ? 'Chân' : 'Bụng';
    if (code === 'GB') return num <= 20 ? 'Đầu' : (num === 21 ? 'Vai' : (num <= 29 ? 'Bụng' : 'Chân'));
    if (code === 'LR') return num <= 12 ? 'Chân' : 'Bụng';
    if (code === 'GV') return num <= 14 ? 'Lưng' : 'Đầu';
    if (code === 'CV') return num <= 21 ? 'Bụng' : 'Cổ Gáy';
    if (id.includes('EX-HN')) return 'Đầu';
    if (id.includes('EX-UE')) return 'Tay';
    if (id.includes('EX-LE')) return 'Chân';
    if (id.includes('EX-B')) return 'Lưng';
    return 'Khác';
};

window.openAcupointModal = function() {
    let modal = document.getElementById('acupointModal');
    if(!modal) { alert("Lỗi: Không tìm thấy giao diện Huyệt (Kiểm tra template-loader.js)."); return; }

    // Reset UI
    const searchInput = document.getElementById('acuSearchInput');
    if(searchInput) searchInput.value = '';
    window.selectedAcupointId = null;
    
    document.getElementById('acupointDetailBox')?.classList.add('hidden');
    document.getElementById('acupointEmptyState')?.classList.remove('hidden');

    modal.classList.add('active');
    modal.style.zIndex = "3000"; // Đảm bảo nổi lên trên cùng

    window.renderAcupointSidebar();
    window.renderAcupointList();
    
    // Chạy AI Tí Ngọ ngay khi mở
    try { if(window.runZiWuAI) window.runZiWuAI(); } catch(e){ console.error(e); }
};

window.renderAcupointSidebar = function() {
    const listContainer = document.getElementById('acuListContainer');
    if(!listContainer) return;

    let sidebar = document.getElementById('acuFilterSidebar');
    if(!sidebar) {
        sidebar = document.createElement('div');
        sidebar.id = 'acuFilterSidebar';
        sidebar.className = "p-2 bg-white border-b border-gray-200 mb-2 flex-shrink-0";
        listContainer.parentElement.insertBefore(sidebar, listContainer);
    }

    const regions = ['Đầu', 'Mặt', 'Cổ Gáy', 'Vai', 'Tay', 'Ngực', 'Bụng', 'Lưng', 'Chân'];
    const meridians = ['Phế', 'Đại Trường', 'Vị', 'Tỳ', 'Tâm', 'Tiểu Trường', 'Bàng Quang', 'Thận', 'Tâm Bào', 'Tam Tiêu', 'Đởm', 'Can', 'Nhâm', 'Đốc'];

    const createCheckboxes = (type, items, selectedItems) => items.map(item => `
        <label class="flex items-center gap-2 p-2 rounded hover:bg-gray-100 cursor-pointer">
            <input type="checkbox" value="${item}" ${selectedItems.includes(item)?'checked':''} onchange="window.toggleAcuFilter('${type}', '${item}')" class="w-4 h-4 accent-[#5d4037] rounded border-gray-300">
            <span class="text-xs text-gray-700 font-medium">${item}</span>
        </label>`).join('');

    sidebar.innerHTML = `
        <div class="flex gap-2">
            <details class="group relative w-1/2">
                <summary class="list-none flex justify-between items-center px-3 py-2 bg-gray-50 border border-gray-300 rounded-lg cursor-pointer text-xs font-bold text-[#5d4037] hover:bg-gray-100 select-none">
                    <span class="truncate">📍 Vùng (${window.acuFilterState.regions.length || 'Tất cả'})</span><span class="transition-transform group-open:rotate-180 ml-1">▼</span>
                </summary>
                <div class="absolute top-full left-0 w-[200%] z-50 mt-1 bg-white border border-gray-300 rounded-lg shadow-xl max-h-60 overflow-y-auto p-1 grid grid-cols-2 gap-1">
                    ${createCheckboxes('regions', regions, window.acuFilterState.regions)}
                </div>
                <div class="fixed inset-0 z-40 hidden group-open:block" onclick="this.parentElement.removeAttribute('open')"></div>
            </details>
            <details class="group relative w-1/2">
                <summary class="list-none flex justify-between items-center px-3 py-2 bg-gray-50 border border-gray-300 rounded-lg cursor-pointer text-xs font-bold text-[#5d4037] hover:bg-gray-100 select-none">
                    <span class="truncate">⚡ Kinh (${window.acuFilterState.meridians.length || 'Tất cả'})</span><span class="transition-transform group-open:rotate-180 ml-1">▼</span>
                </summary>
                <div class="absolute top-full right-0 w-[200%] md:w-[150%] z-50 mt-1 bg-white border border-gray-300 rounded-lg shadow-xl max-h-60 overflow-y-auto p-1 grid grid-cols-1 gap-1">
                    ${createCheckboxes('meridians', meridians, window.acuFilterState.meridians)}
                </div>
                <div class="fixed inset-0 z-40 hidden group-open:block" onclick="this.parentElement.removeAttribute('open')"></div>
            </details>
        </div>
        <div class="flex flex-wrap gap-1 mt-2 ${window.acuFilterState.regions.length + window.acuFilterState.meridians.length === 0 ? 'hidden' : ''}">
            ${[...window.acuFilterState.regions, ...window.acuFilterState.meridians].map(tag => `<span class="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] bg-[#efebe9] text-[#5d4037] border border-[#d7ccc8]">${tag} <button onclick="window.removeAcuFilterTag('${tag}')" class="ml-1 font-bold hover:text-red-500">&times;</button></span>`).join('')}
            <button onclick="window.clearAllAcuFilters()" class="text-[10px] text-red-500 underline ml-auto">Xóa hết</button>
        </div>`;
};

window.toggleAcuFilter = function(type, value) {
    const list = window.acuFilterState[type];
    const idx = list.indexOf(value);
    if (idx > -1) list.splice(idx, 1); else list.push(value); 
    window.renderAcupointSidebar(); window.renderAcupointList();    
};

window.removeAcuFilterTag = function(value) {
    if (window.acuFilterState.regions.includes(value)) window.acuFilterState.regions = window.acuFilterState.regions.filter(i => i !== value);
    else if (window.acuFilterState.meridians.includes(value)) window.acuFilterState.meridians = window.acuFilterState.meridians.filter(i => i !== value);
    window.renderAcupointSidebar(); window.renderAcupointList();
};

window.clearAllAcuFilters = function() {
    window.acuFilterState.regions = []; window.acuFilterState.meridians = [];
    window.renderAcupointSidebar(); window.renderAcupointList();
};

window.renderAcupointList = function(searchKeyword = null) {
    const container = document.getElementById('acuListContainer');
    if (!container) return;
    
    // Kiểm tra dữ liệu đã nạp chưa (từ knowledge/*.js)
    if (!window.knowledge || !window.knowledge.acupoints) { container.innerHTML = '<div class="text-center text-xs text-gray-400 py-4">Đang tải dữ liệu...</div>'; return; }

    const input = document.getElementById('acuSearchInput');
    const kw = (searchKeyword !== null ? searchKeyword : (input ? input.value : '')).toLowerCase().trim();
    
    const filtered = window.knowledge.acupoints.filter(p => {
        let matchSearch = kw ? (p.name.toLowerCase().includes(kw) || p.id.toLowerCase().includes(kw) || (p.tags && p.tags.some(t => t.includes(kw)))) : true;
        p.region = window.detectAcupointRegion(p);
        let matchRegion = window.acuFilterState.regions.length > 0 ? window.acuFilterState.regions.includes(p.region) : true;
        let matchMeridian = window.acuFilterState.meridians.length > 0 ? window.acuFilterState.meridians.includes(p.meridian) : true;
        return matchSearch && matchRegion && matchMeridian;
    });

    if (filtered.length === 0) { container.innerHTML = `<div class="text-center py-8 opacity-50"><div class="text-2xl mb-2">🔍</div><div class="text-xs text-gray-500">Không tìm thấy kết quả</div></div>`; return; }

    container.innerHTML = filtered.map(p => {
        const isSelected = (window.selectedAcupointId === p.id);
        const bg = isSelected ? 'bg-[#5d4037] text-white border-[#3e2723] shadow-md' : 'bg-white border-[#eee] text-[#3e2723] hover:bg-[#efebe9] hover:border-[#d7ccc8]';
        return `<div onclick="window.showAcupointDetail('${p.id}')" class="p-3 mb-2 rounded-xl border cursor-pointer transition-all duration-200 group ${bg}">
            <div class="flex justify-between items-center"><span class="font-bold text-sm group-hover:scale-105 transition-transform origin-left">${p.name}</span><span class="font-mono text-[10px] font-bold opacity-70 border px-1 rounded ${isSelected ? 'border-white/30' : 'border-gray-200'}">${p.id}</span></div>
            <div class="text-[10px] mt-1 ${isSelected?'text-white/80':'text-gray-500'} flex items-center gap-1 truncate"><span>${p.meridian}</span> • <span class="font-medium">${p.region}</span></div>
        </div>`;
    }).join('');
};

window.showAcupointDetail = function(id) {
    const p = window.knowledge.acupoints.find(x => x.id === id); if (!p) return;
    window.selectedAcupointId = id;
    
    // Highlight item trong list
    window.renderAcupointList(document.getElementById('acuSearchInput')?.value); 

    document.getElementById('detailName').innerText = p.name;
    document.getElementById('detailId').innerText = p.id;
    document.getElementById('detailMeridian').innerText = "Kinh " + p.meridian;
    
    const typeEl = document.getElementById('detailType');
    if (typeEl) { 
        if(p.type) {
            typeEl.innerText = p.type;
            typeEl.classList.remove('hidden'); 
        } else {
            typeEl.classList.add('hidden'); 
        }
    }
    
    document.getElementById('detailFunction').innerText = p.function || '...';
    document.getElementById('detailIndications').innerText = p.indications || '...';

    // Chuyển UI sang trạng thái hiển thị chi tiết
    document.getElementById('acupointEmptyState')?.classList.add('hidden');
    const box = document.getElementById('acupointDetailBox');
    if(box) { 
        box.classList.remove('hidden'); 
        if(window.innerWidth < 768) box.scrollIntoView({behavior:'smooth', block:'start'}); 
    }
};

window.addAcupointToVisit = function() {
    if (!window.selectedAcupointId) return;
    const p = window.knowledge.acupoints.find(x => x.id === window.selectedAcupointId); if (!p) return;
    
    // Nếu đang chọn thủ thuật (bên tab Khám), thêm vào ghi chú thủ thuật
    if (window.activeProcIndex !== null && window.activeProcIndex !== undefined && window.currentVisit.procs[window.activeProcIndex]) {
        const proc = window.currentVisit.procs[window.activeProcIndex];
        let note = proc.note || "";
        if (!note.includes(p.name)) {
            if (note.trim() && !note.trim().endsWith(",")) note += ", ";
            proc.note = note + p.name;
            // Gọi render lại bên visit-procs.js
            if (window.renderProcList) window.renderProcList();
            if (window.showToast) window.showToast(`✅ Đã thêm [${p.name}] vào ${proc.name}`, "success");
        } else {
            if (window.showToast) window.showToast(`⚠️ [${p.name}] đã có trong ghi chú`, "warning");
        }
        return;
    }
    
    // Mặc định: Thêm vào danh sách huyệt chung
    if (!window.currentVisit.acupoints) window.currentVisit.acupoints = [];
    if (!window.currentVisit.acupoints.some(x => x.id === p.id)) {
        window.currentVisit.acupoints.push({ id: p.id, name: p.name });
        // Gọi render lại bên visit-core.js (nếu có hàm này, hiện tại ta dùng inline render hoặc chưa implement hàm render list huyệt)
        // Update: Ta sẽ hiển thị huyệt đã chọn trong ô Gợi ý AI hoặc list riêng nếu cần.
        if (window.showToast) window.showToast(`✅ Đã thêm [${p.name}] vào hồ sơ`, "success");
    }
};

// ============================================================
// B. AI TÍ NGỌ (ZI WU FLOW AI)
// ============================================================

window.getAcuNameDisplay = function(s) {
    if (!s) return "---";
    let id = s.split(' ')[0], suffix = s.includes('(') ? s.substring(s.indexOf('(')) : '';
    let p = window.knowledge.acupoints.find(x => x.id === id);
    return p ? `${p.name} <span class="text-[10px] opacity-70 font-mono">(${id})</span>${suffix}` : s;
};

window.runZiWuAI = function() {
    // Đảm bảo module Knowledge đã load
    if (!window.knowledge || !window.knowledge.ziWuFlow) return;
    
    const a = window.knowledge.ziWuFlow.getCurrentAnalysis();
    document.getElementById('acuTimeDisplay').innerText = a.timeInfo;
    
    // Hiển thị Nạp Tử
    if (a.naZi) {
        const line = (l, v, c) => `<div class="flex items-start gap-2 text-xs mb-1.5 border-b border-dashed border-gray-200 pb-1 last:border-0"><span class="font-bold opacity-70 w-16 text-right flex-shrink-0">${l}:</span><span class="font-bold cursor-pointer hover:underline ${c}" onclick="window.showAcupointDetail('${v.split(' ')[0]}')">${window.getAcuNameDisplay(v)}</span></div>`;
        document.getElementById('aiNaZiContent').innerHTML = `<div class="mb-2 pb-2 border-b border-[#a5d6a7] border-dashed"><span class="font-bold text-[#1b5e20] text-sm">Vượng: Kinh ${a.naZi.meridian}</span></div>` + line('Huyệt Khai', a.naZi.horary, 'text-[#2e7d32]') + line('Hư Bổ', a.naZi.tonify, 'text-blue-700') + line('Thực Tả', a.naZi.sedate, 'text-red-700') + line('Nguyên', a.naZi.source, 'text-purple-700');
    }
    
    // Hiển thị Nạp Giáp
    if (a.naJia) {
        document.getElementById('aiNaJiaContent').innerHTML = `<div class="mb-2 pb-2 border-b border-[#ffcc80] border-dashed"><span class="font-bold text-[#e65100] text-sm">Can Giờ: ${a.naJia.stem}</span><span class="text-[10px] ml-1 opacity-80">(Mở kinh ${a.naJia.meridian})</span></div><div class="flex flex-wrap gap-1">${Object.values(a.naJia.points).map(pt => {
            let id = pt.split(' ')[0], p = window.knowledge.acupoints.find(x=>x.id===id);
            return `<span class="inline-block bg-white px-2 py-1 rounded border border-[#ffe0b2] text-[11px] font-bold mr-1 mb-1 cursor-pointer hover:bg-[#ffe0b2] text-[#e65100] transition-colors shadow-sm" onclick="window.showAcupointDetail('${id}')">${p?p.name:id} <span class="text-[9px] opacity-60 font-normal">(${id})</span></span>`;
        }).join('')}</div>`;
    }
};

// ============================================================
// C. QUẢN LÝ DƯỢC LIỆU (HERB LOOKUP)
// ============================================================

window.openHerbModal = function() { 
    const m = document.getElementById('herbModal');
    if(m) {
        window.renderHerbSidebar(); 
        window.filterHerbGrid('all'); 
        
        // Gọi AI gợi ý thuốc
        try { if(window.refreshAiSuggestion) window.refreshAiSuggestion(true); } catch(e){}
        
        m.style.zIndex = "3000";
        m.classList.add('active'); 
    } else {
        alert("Lỗi: Không tìm thấy giao diện Thuốc (Kiểm tra template-loader.js).");
    }
};

window.filterHerbs = function() { window.renderHerbGrid(); };

window.renderHerbSidebar = function() {
    const sb = document.getElementById('herbSidebar'); 
    if(!sb || !window.knowledge) return;
    
    if (typeof window.currentHerbFilter === 'undefined') window.currentHerbFilter = 'all';
    
    let html = `<button onclick="window.filterHerbGrid('all')" class="w-full text-left px-3 py-2 rounded text-sm font-bold hover:bg-gray-100 mb-1 ${window.currentHerbFilter === 'all' ? 'bg-[#efebe9] text-[#3e2723]' : 'text-gray-600'}">Tất cả</button><div class="text-[10px] font-bold text-gray-400 uppercase mt-3 mb-1 px-2">Nhóm Thuốc</div>`;
    
    if(window.knowledge.herbCategories) { 
        window.knowledge.herbCategories.forEach(c => { 
            html += `<button onclick="window.filterHerbGrid('${c}')" class="w-full text-left px-3 py-2 rounded text-sm hover:bg-gray-100 ${window.currentHerbFilter===c ? 'bg-[#efebe9] font-bold text-[#5d4037]' : 'text-gray-600'}">${c}</button>`; 
        }); 
    }
    sb.innerHTML = html;
};

window.filterHerbGrid = function(val) { 
    window.currentHerbFilter = val; 
    window.renderHerbSidebar(); 
    window.renderHerbGrid(); 
};

window.renderHerbGrid = function() {
    const container = document.getElementById('herbContent'), title = document.getElementById('herbCurrentCategory');
    if(!container || !window.knowledge || !window.knowledge.herbsDB) return;
    
    if(title) title.innerText = window.currentHerbFilter === 'all' ? 'Tất cả vị thuốc' : window.currentHerbFilter;
    
    const kw = document.getElementById('herbSearchInput')?.value.toLowerCase() || '';
    
    let herbs = window.knowledge.herbsDB.filter(h => {
        if (kw && !h.name.toLowerCase().includes(kw)) return false;
        if (!kw && window.currentHerbFilter !== 'all' && h.category !== window.currentHerbFilter) return false;
        return true;
    });
    
    // Lấy gợi ý từ AI (nếu có)
    const sug = window.currentAiSuggestions?.herbs || [];

    container.innerHTML = herbs.map(h => {
        const isSug = sug.includes(h.name);
        return `<button onclick="window.addSuggestedMed('east', '${h.name}');" class="relative flex flex-col items-center justify-center p-3 rounded-xl border transition-all duration-300 bg-white text-gray-700 border-[#eee] hover:border-[#d7ccc8] hover:shadow-sm ${isSug ? 'highlight-suggestion ring-1 ring-yellow-400 bg-yellow-50' : ''}">
            ${isSug ? '<span class="absolute -top-1 -right-1 flex h-3 w-3"><span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-yellow-400 opacity-75"></span><span class="relative inline-flex rounded-full h-3 w-3 bg-yellow-500"></span></span>' : ''}
            <span class="font-bold text-sm text-center">${h.name}</span><span class="text-[10px] opacity-70 mt-1 truncate max-w-full">${h.category}</span>
        </button>`;
    }).join('');
};

window.refreshAiSuggestion = function(showHighlightOnly = false) {
    if (!window.knowledge || !window.knowledge.analyze) return;
    
    const symptoms = document.getElementById('vSpecial') ? document.getElementById('vSpecial').value : "";
    const tuChanData = window.currentVisit ? window.currentVisit.tuChan : {};
    
    // Gọi AI Engine
    const result = window.knowledge.analyze(symptoms, tuChanData);
    
    if (result) {
        window.currentAiSuggestions = result;
        const aiBox = document.getElementById('aiSuggestionBox'), aiText = document.getElementById('aiSuggestionText');
        
        if (aiBox && aiText) {
            let htmlContent = "";
            if (result.syndromeFound) htmlContent += `<div class="font-bold text-red-600 mb-1 border-b border-red-200 pb-1 flex items-center gap-2"><span>🔍</span> ${result.syndromeFound}</div>`;
            if (result.messages.length > 0) htmlContent += result.messages.map(m => `<div>${m}</div>`).join('');
            
            if (htmlContent) { aiBox.classList.remove('hidden'); aiText.innerHTML = htmlContent; } 
            else { aiBox.classList.add('hidden'); }
        }
        
        // Refresh lại các list để hiển thị highlight
        if (document.getElementById('acupointModal')?.classList.contains('active')) window.renderAcupointList();
        if (document.getElementById('herbModal')?.classList.contains('active')) window.renderHerbGrid();
    }
};
