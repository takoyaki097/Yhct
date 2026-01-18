/**
 * FILE: visit.js
 * CHỨC NĂNG: Quản lý quy trình Khám bệnh, Kê đơn, Thủ thuật & AI.
 * PHIÊN BẢN: Full (Không nén) - Tích hợp Knowledge Base mới.
 */

// --- 1. KHỞI TẠO BIẾN TRẠNG THÁI ---

window.currentVisit = { 
    step: 1, 
    rxEast: [], 
    rxWest: [], 
    procs: [], 
    acupoints: [], // Danh sách huyệt đã chọn
    manualMedTotalEast: 0, 
    manualMedTotalWest: 0,
    eastDays: 1, 
    westDays: 1,
    eastNote: "", 
    westNote: "",
    manualPriceEast: 0, 
    manualPriceWest: 0,
    tuChan: {vong:[],van:[],vanhoi:[],thiet:[],thietchan:[],machchan:[]} 
};

// Biến tạm dùng cho AI và Bộ lọc
let currentAiSuggestions = { points: [], herbs: [], messages: [] };
let currentAcupointFilter = { type: 'region', value: 'all' }; // Bộ lọc Huyệt
let currentHerbFilter = 'all'; // Bộ lọc Thuốc

// Cờ báo hiệu module đã sẵn sàng
window.visitModuleReady = true;

// --- 2. CẤU HÌNH INPUT NHẬP LIỆU (NATIVE) ---

window.setupNativeInputs = function() {
    const configs = [
        { id: 'vBpSys', handler: window.updateBpDisplay },
        { id: 'vBpDia', handler: window.updateBpDisplay },
        { id: 'vPulse', handler: null },
        { id: 'vHeight', handler: window.updateHeightWeightDisplay },
        { id: 'vWeight', handler: window.updateHeightWeightDisplay },
        { id: 'vEastDays', handler: window.calcTotal },
        { id: 'vWestDays', handler: window.calcTotal },
        { id: 'vEastManualPrice', handler: window.calcTotal },
        { id: 'vWestManualPrice', handler: window.calcTotal },
        { id: 'vCost', handler: window.calcTotal },
        { id: 'vDiscountPercent', handler: () => {
            const val = document.getElementById('vDiscountPercent').value;
            const btn = document.getElementById('discountBtn');
            if(btn) btn.innerText = val + "% ▼";
            window.calcTotal();
        }},
        { id: 'pYear', handler: null },
        { id: 'pPhone', handler: null, type: 'tel' }
    ];

    configs.forEach(cfg => {
        const el = document.getElementById(cfg.id);
        if (el) {
            el.type = cfg.type || 'number'; 
            if(el.type === 'number') {
                el.inputMode = 'decimal'; 
                el.pattern = '[0-9]*';
            } else if (el.type === 'tel') {
                el.inputMode = 'numeric';
                el.pattern = '[0-9]*';
            }
            el.removeAttribute('readonly');
            el.removeAttribute('onclick');
            el.onclick = null;
            if(cfg.handler) el.oninput = cfg.handler;
            el.onfocus = function() { this.select(); };
            el.style.pointerEvents = 'auto';
            el.style.backgroundColor = '#fff';
        }
    });

    // Hiện lại nút chiết khấu nếu bị ẩn
    const discInput = document.getElementById('vDiscountPercent');
    const discBtn = document.getElementById('discountBtn');
    if (discInput && discInput.type === 'hidden') {
        discInput.classList.remove('hidden');
        if(discBtn) discBtn.style.display = 'none'; 
    }
};

// --- 3. BẮT ĐẦU KHÁM (START VISIT) ---

window.startVisit = function(pid, vid=null) {
    const p = window.db.find(x => x.id == pid); 
    if(!p) return;

    document.getElementById('vPid').value = pid; 
    document.getElementById('vVisitId').value = vid || '';
    document.getElementById('vPatientName').innerText = p.name;
    
    // Reset Dữ liệu
    window.currentVisit = { 
        step: 1, rxEast: [], rxWest: [], procs: [], acupoints: [],
        manualMedTotalEast: 0, manualMedTotalWest: 0,
        eastDays: 1, westDays: 1,
        eastNote: "", westNote: "",
        manualPriceEast: 0, manualPriceWest: 0,
        tuChan: {vong:[],van:[],vanhoi:[],thiet:[],thietchan:[],machchan:[]} 
    };
    currentAiSuggestions = { points: [], herbs: [], messages: [] };
    
    // Reset Giao diện
    document.getElementById('vDate').value = window.getLocalDate();
    document.getElementById('vDiseaseInput').value = ''; 
    document.getElementById('vSpecial').value = '';
    document.getElementById('vCost').value = 0; 
    document.getElementById('vDiscountPercent').value = 0;
    
    // Ẩn các box AI cũ
    const aiBox = document.getElementById('aiSuggestionBox');
    if(aiBox) aiBox.classList.add('hidden');
    const acuList = document.getElementById('vAcupointList');
    if(acuList) acuList.innerHTML = '';
    
    // Load danh sách bệnh mẫu
    if(window.config.diseases) {
        document.getElementById('vDiseaseSelect').innerHTML = '<option value="">-- Chọn bệnh mẫu --</option>' + window.config.diseases.map(d=>`<option value="${d.name}">${d.name}</option>`).join('');
    }
    
    window.initDefaultValues();

    // Nếu là Chế độ Sửa (Edit Mode)
    if(vid) {
        const v = p.visits.find(x => x.id == vid);
        if(v) {
            document.getElementById('vDate').value = v.date; 
            document.getElementById('vDiseaseInput').value = v.disease;
            document.getElementById('vSpecial').value = v.symptoms; 
            document.getElementById('vCost').value = v.cost;
            document.getElementById('vDiscountPercent').value = v.disc || 0; 
            
            if(v.tuChan) window.currentVisit.tuChan = v.tuChan;
            if(v.vong) document.getElementById('vVongExtra').value = v.vong;
            
            ['eastDays','westDays','manualPriceEast','manualPriceWest'].forEach(k => {
                if(v[k] !== undefined) window.currentVisit[k] = v[k];
            });
            window.currentVisit.eastNote = v.eastNote || "";
            window.currentVisit.westNote = v.westNote || "";
            
            document.getElementById('vEastDays').value = window.currentVisit.eastDays;
            document.getElementById('vWestDays').value = window.currentVisit.westDays;
            document.getElementById('vEastNote').value = window.currentVisit.eastNote;
            document.getElementById('vWestNote').value = window.currentVisit.westNote;
            document.getElementById('vEastManualPrice').value = window.currentVisit.manualPriceEast || "";
            document.getElementById('vWestManualPrice').value = window.currentVisit.manualPriceWest || "";

            // Deep Copy các mảng để tránh tham chiếu
            window.currentVisit.rxEast = JSON.parse(JSON.stringify(v.rxEast||[])); 
            window.currentVisit.rxWest = JSON.parse(JSON.stringify(v.rxWest||[]));
            window.currentVisit.procs = JSON.parse(JSON.stringify(v.procs||[]));
            window.currentVisit.acupoints = JSON.parse(JSON.stringify(v.acupoints||[]));
        }
    }
    
    // Render lại toàn bộ
    window.renderMedList('east'); 
    window.renderMedList('west'); 
    window.renderProcOptions();
    window.renderProcList();
    window.renderSelectedAcupoints(); // MỚI: Render huyệt
    window.calcTotal();
    window.setupNativeInputs();
    
    // Chuyển về Bước 1
    window.goToStep(1); 
    document.getElementById('vModal').classList.add('active');
};

// --- 4. TIỆN ÍCH UI CƠ BẢN ---

window.initDefaultValues = function() {
    if(!document.getElementById('vBpSys').value) {
        document.getElementById('vBpSys').value=120; 
        document.getElementById('vBpDia').value=80;
        document.getElementById('vPulse').value=80; 
        document.getElementById('vHeight').value=165; 
        document.getElementById('vWeight').value=60;
    }
    window.updateBpDisplay();
    window.updateHeightWeightDisplay();
};

window.updateBpDisplay = function() { 
    document.getElementById('displayBP').innerText = (document.getElementById('vBpSys').value||120)+'/'+(document.getElementById('vBpDia').value||80); 
};

window.updateHeightWeightDisplay = function() {
    const h = document.getElementById('vHeight').value, w = document.getElementById('vWeight').value;
    document.getElementById('displayHeightWeight').innerText = `${h}cm - ${w}kg`;
    if(h>0 && w>0) document.getElementById('displayBMI').innerText = 'BMI: ' + (w/((h/100)*(h/100))).toFixed(1);
};

// --- 5. ĐIỀU HƯỚNG & NAVIGATION ---

window.goToStep = function(s) {
    window.currentVisit.step = s;
    document.querySelectorAll('.step-content').forEach(e => { e.classList.remove('active'); e.classList.add('hidden'); });
    document.getElementById('step'+s).classList.remove('hidden'); 
    document.getElementById('step'+s).classList.add('active');
    
    document.querySelectorAll('.tab-btn').forEach((b,i) => b.classList.toggle('active', i+1===s));
    document.getElementById('btnBack').classList.toggle('hidden', s===1);
    document.getElementById('btnNext').classList.toggle('hidden', s===4);
    document.getElementById('btnSaveOnly').classList.toggle('hidden', s!==4);
    document.getElementById('btnPrint').classList.toggle('hidden', s!==4);
    
    if(s===1) window.renderTuchanChips();
    if(s===3||s===4) window.calcTotal();
    
    // Khi vào bước 3 (Điều trị): Inject nút & Chạy AI ngầm
    if(s===3) {
        window.injectCustomButtons(); 
        if(window.refreshAiSuggestion) window.refreshAiSuggestion(false); 
    }
    
    // Khi vào bước 4: Hiển thị QR nếu có
    if(s===4 && window.config.qrCodeImage) {
        document.getElementById('qrPaymentSection').classList.remove('hidden'); 
        document.getElementById('displayQrPayment').src = window.config.qrCodeImage; 
    }
};

window.nextStep = function() { if(window.currentVisit.step<4) window.goToStep(window.currentVisit.step+1); };
window.prevStep = function() { if(window.currentVisit.step>1) window.goToStep(window.currentVisit.step-1); };

// --- 6. TỨ CHẨN & BỆNH MẪU ---

window.renderTuchanChips = function() {
    ['vong','van','vanhoi','thiet','thietchan','machchan'].forEach(sec => {
        const c = document.getElementById(`tuchan${sec.charAt(0).toUpperCase()+sec.slice(1)}Buttons`);
        if(c) c.innerHTML = (window.config.tuChan[sec]||[]).map(t=>`
            <div class="tuchan-chip ${window.currentVisit.tuChan[sec].includes(t)?'active':''}" 
                 onclick="window.toggleTuchanChip('${sec}','${t.replace(/'/g,"\\'")}')">${t}</div>`).join('');
    });
};

window.toggleTuchanChip = function(sec,t) {
    const idx = window.currentVisit.tuChan[sec].indexOf(t);
    if(idx===-1) window.currentVisit.tuChan[sec].push(t); 
    else window.currentVisit.tuChan[sec].splice(idx,1);
    window.renderTuchanChips();
};

window.loadDiseaseSuggestions = function() {
    const dName = document.getElementById('vDiseaseSelect').value;
    const box = document.getElementById('suggestedSymptomsBox');
    const preArea = document.getElementById('eastPresetsArea');
    
    if(!dName) { box.classList.add('hidden'); preArea.classList.add('hidden'); return; }
    
    const d = window.config.diseases.find(x => x.name === dName);
    if(d) {
        // Gợi ý triệu chứng
        if(d.sym) { 
            box.classList.remove('hidden'); 
            const syms = d.sym.split(',').map(s => s.trim()).filter(s => s);
            document.getElementById('symptomButtons').innerHTML = syms.map(s=>`<span onclick="window.addSymptom('${s}')" class="med-chip">+ ${s}</span>`).join(''); 
        } else box.classList.add('hidden');
        
        // Thuốc Tây mẫu
        window.currentVisit.rxWest = JSON.parse(JSON.stringify(d.rxWest||[])); 
        window.renderMedList('west');
        
        // Thuốc Đông mẫu
        if(d.eastOptions?.length) { 
            preArea.classList.remove('hidden'); 
            document.getElementById('eastPresetButtons').innerHTML = d.eastOptions.map((o,i)=>`
                <div class="med-chip ${i===0?'active-preset':''}" onclick="window.applyEasternSample(${i})">${o.name}</div>`).join(''); 
            if(d.eastOptions.length > 0) window.applyEasternSample(0);
        } else preArea.classList.add('hidden');
        
        window.calcTotal();
    }
};

window.addSymptom = function(text) {
    const el = document.getElementById('vSpecial');
    // Tránh thêm trùng lặp
    if (!el.value.includes(text)) {
        el.value = el.value ? el.value + ", " + text : text;
    }
};

window.applyEasternSample = function(i) {
    const btns = document.querySelectorAll('#eastPresetButtons .med-chip');
    btns.forEach((btn, idx) => idx === i ? btn.classList.add('active-preset') : btn.classList.remove('active-preset'));
    const d = window.config.diseases.find(x => x.name === document.getElementById('vDiseaseSelect').value);
    if(d && d.eastOptions[i]) { 
        window.currentVisit.rxEast = JSON.parse(JSON.stringify(d.eastOptions[i].ingredients)); 
        window.renderMedList('east'); 
        window.calcTotal(); 
    }
};

// --- 7. TÍNH NĂNG MỚI: AI, MODAL HUYỆT & MODAL THUỐC ---

// A. QUẢN LÝ MODAL HUYỆT (ACUPOINT)
window.openAcupointModal = function() {
    window.renderAcupointSidebar();
    window.filterAcupointGrid('region', 'all');
    window.refreshAiSuggestion(true); // Cập nhật AI để highlight
    
    // Hiển thị giờ Tí Ngọ trong Modal
    const timeInfo = window.knowledge.ziWuFlow ? window.knowledge.ziWuFlow.getCurrentFlow() : null;
    const subLabel = document.getElementById('acuTimeSuggestion');
    if(subLabel && timeInfo) {
        subLabel.innerText = `Giờ ${timeInfo.branch}: Huyệt Khai ${timeInfo.openPoint}`;
    }
    
    document.getElementById('acupointModal').classList.add('active');
};

window.filterAcupoints = function() { window.renderAcupointGrid(); };

window.renderAcupointSidebar = function() {
    const sb = document.getElementById('acuSidebar');
    if(!sb || !window.knowledge) return;

    let html = `<button onclick="window.filterAcupointGrid('region','all')" class="w-full text-left px-3 py-2 rounded text-sm font-bold hover:bg-gray-100 mb-1 ${currentAcupointFilter.value === 'all' ? 'bg-[#efebe9] text-[#3e2723]' : 'text-gray-600'}">Tất cả</button>`;
    
    html += `<div class="text-[10px] font-bold text-gray-400 uppercase mt-3 mb-1 px-2">Vùng Cơ Thể</div>`;
    window.knowledge.regions.forEach(r => {
        html += `<button onclick="window.filterAcupointGrid('region','${r}')" class="w-full text-left px-3 py-2 rounded text-sm hover:bg-gray-100 ${currentAcupointFilter.type==='region' && currentAcupointFilter.value===r ? 'bg-[#efebe9] font-bold text-[#5d4037]' : 'text-gray-600'}">${r}</button>`;
    });

    html += `<div class="text-[10px] font-bold text-gray-400 uppercase mt-3 mb-1 px-2">Đường Kinh</div>`;
    window.knowledge.meridians.forEach(m => {
        html += `<button onclick="window.filterAcupointGrid('meridian','${m}')" class="w-full text-left px-3 py-2 rounded text-sm hover:bg-gray-100 ${currentAcupointFilter.type==='meridian' && currentAcupointFilter.value===m ? 'bg-[#efebe9] font-bold text-[#5d4037]' : 'text-gray-600'}">${m}</button>`;
    });

    sb.innerHTML = html;
};

window.filterAcupointGrid = function(type, val) {
    currentAcupointFilter = { type: type, value: val };
    window.renderAcupointSidebar(); 
    window.renderAcupointGrid();
};

window.renderAcupointGrid = function() {
    const container = document.getElementById('acuContent');
    const title = document.getElementById('acuCurrentCategory');
    if(!container || !window.knowledge) return;

    title.innerText = currentAcupointFilter.value === 'all' ? 'Tất cả huyệt' : currentAcupointFilter.value;
    
    const searchKw = (document.getElementById('acuSearchInput') ? document.getElementById('acuSearchInput').value : '').toLowerCase();
    
    let points = window.knowledge.acupoints.filter(p => {
        if (searchKw && !p.name.toLowerCase().includes(searchKw) && !p.id.toLowerCase().includes(searchKw)) return false;
        if (!searchKw) {
            if (currentAcupointFilter.value === 'all') return true;
            if (currentAcupointFilter.type === 'region') return p.region === currentAcupointFilter.value;
            if (currentAcupointFilter.type === 'meridian') return p.meridian === currentAcupointFilter.value;
        }
        return true;
    });

    container.innerHTML = points.map(p => {
        const isSelected = window.currentVisit.acupoints.some(x => x.id === p.id);
        const isSuggested = currentAiSuggestions.points.includes(p.id);
        
        return `
        <button onclick="window.toggleAcupoint('${p.id}', '${p.name}')" 
            class="relative flex flex-col items-center justify-center p-3 rounded-xl border transition-all duration-300
            ${isSelected ? 'bg-[#5d4037] text-white border-[#3e2723] shadow-md' : 'bg-white text-gray-700 border-[#eee] hover:border-[#d7ccc8] hover:shadow-sm'}
            ${isSuggested && !isSelected ? 'highlight-suggestion' : ''}">
            
            ${isSuggested ? '<span class="absolute -top-1 -right-1 flex h-3 w-3"><span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-yellow-400 opacity-75"></span><span class="relative inline-flex rounded-full h-3 w-3 bg-yellow-500"></span></span>' : ''}
            <span class="font-bold text-sm">${p.name}</span>
            <span class="text-[10px] opacity-70 mt-1">${p.id} • ${p.region}</span>
        </button>`;
    }).join('');
};

window.toggleAcupoint = function(id, name) {
    const idx = window.currentVisit.acupoints.findIndex(x => x.id === id);
    if(idx > -1) window.currentVisit.acupoints.splice(idx, 1);
    else window.currentVisit.acupoints.push({ id: id, name: name });
    window.renderAcupointGrid();
    window.renderSelectedAcupoints();
};

window.renderSelectedAcupoints = function() {
    const list = document.getElementById('vAcupointList');
    if(list) {
        list.innerHTML = window.currentVisit.acupoints.map(p => `
            <span class="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-teal-50 text-teal-700 border border-teal-100">
                ${p.name}
                <button onclick="window.toggleAcupoint('${p.id}', '${p.name}')" class="ml-2 text-teal-400 hover:text-red-500 font-black">&times;</button>
            </span>`).join('');
    }
};

// B. QUẢN LÝ MODAL THUỐC (HERB MODAL - NEW)
window.openHerbModal = function() {
    window.renderHerbSidebar();
    window.filterHerbGrid('all');
    window.refreshAiSuggestion(true);
    document.getElementById('herbModal').classList.add('active');
};

window.filterHerbs = function() { window.renderHerbGrid(); };

window.renderHerbSidebar = function() {
    const sb = document.getElementById('herbSidebar');
    if(!sb || !window.knowledge) return;

    let html = `<button onclick="window.filterHerbGrid('all')" class="w-full text-left px-3 py-2 rounded text-sm font-bold hover:bg-gray-100 mb-1 ${currentHerbFilter === 'all' ? 'bg-[#efebe9] text-[#3e2723]' : 'text-gray-600'}">Tất cả</button>`;
    html += `<div class="text-[10px] font-bold text-gray-400 uppercase mt-3 mb-1 px-2">Nhóm Thuốc</div>`;
    
    if(window.knowledge.herbCategories) {
        window.knowledge.herbCategories.forEach(c => {
            html += `<button onclick="window.filterHerbGrid('${c}')" class="w-full text-left px-3 py-2 rounded text-sm hover:bg-gray-100 ${currentHerbFilter===c ? 'bg-[#efebe9] font-bold text-[#5d4037]' : 'text-gray-600'}">${c}</button>`;
        });
    }
    sb.innerHTML = html;
};

window.filterHerbGrid = function(val) {
    currentHerbFilter = val;
    window.renderHerbSidebar();
    window.renderHerbGrid();
};

window.renderHerbGrid = function() {
    const container = document.getElementById('herbContent');
    const title = document.getElementById('herbCurrentCategory');
    if(!container || !window.knowledge || !window.knowledge.herbsDB) return;

    title.innerText = currentHerbFilter === 'all' ? 'Tất cả vị thuốc' : currentHerbFilter;
    
    const searchKw = (document.getElementById('herbSearchInput') ? document.getElementById('herbSearchInput').value : '').toLowerCase();
    
    let herbs = window.knowledge.herbsDB.filter(h => {
        if (searchKw && !h.name.toLowerCase().includes(searchKw)) return false;
        if (!searchKw && currentHerbFilter !== 'all' && h.category !== currentHerbFilter) return false;
        return true;
    });

    container.innerHTML = herbs.map(h => {
        const isSuggested = currentAiSuggestions.herbs.includes(h.name);
        return `
        <button onclick="window.addSuggestedMed('east', '${h.name}'); alert('Đã thêm ${h.name} vào đơn!');" 
            class="relative flex flex-col items-center justify-center p-3 rounded-xl border transition-all duration-300 bg-white text-gray-700 border-[#eee] hover:border-[#d7ccc8] hover:shadow-sm 
            ${isSuggested ? 'highlight-suggestion' : ''}">
            
            ${isSuggested ? '<span class="absolute -top-1 -right-1 flex h-3 w-3"><span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-yellow-400 opacity-75"></span><span class="relative inline-flex rounded-full h-3 w-3 bg-yellow-500"></span></span>' : ''}
            
            <span class="font-bold text-sm">${h.name}</span>
            <span class="text-[10px] opacity-70 mt-1">${h.category}</span>
        </button>`;
    }).join('');
};

// C. AI REFRESH & GỢI Ý
window.refreshAiSuggestion = function(showHighlightOnly = false) {
    const symptoms = document.getElementById('vSpecial').value;
    
    if (window.knowledge && window.knowledge.analyze) {
        const result = window.knowledge.analyze(symptoms);
        if (result) {
            currentAiSuggestions = result;
            
            // Cập nhật Box thông báo chung (Step 3)
            const aiBox = document.getElementById('aiSuggestionBox');
            const aiText = document.getElementById('aiSuggestionText');
            if (aiBox && aiText) {
                if (result.messages.length > 0) {
                    aiBox.classList.remove('hidden');
                    aiText.innerHTML = result.messages.map(m => `<div>${m}</div>`).join('');
                } else {
                    aiBox.classList.add('hidden');
                }
            }

            // Nếu đang mở Modal Huyệt -> Render lại để highlight
            if (document.getElementById('acupointModal').classList.contains('active')) {
                window.renderAcupointGrid();
            }
            // Nếu đang mở Modal Thuốc -> Render lại để highlight
            if (document.getElementById('herbModal').classList.contains('active')) {
                window.renderHerbGrid();
            }
        }
    }
};

window.updateYunQiDisplay = function() {
    const label = document.getElementById('yunQiLabel');
    if (label && window.knowledge) {
        const yearInfo = window.knowledge.yunQi ? window.knowledge.yunQi.getCurrentInfo() : {text:'', nature:''};
        const timeInfo = window.knowledge.ziWuFlow ? window.knowledge.ziWuFlow.getCurrentFlow() : null;
        
        let html = `<span class="text-[#3e2723] font-bold">${yearInfo.text}</span>`;
        if (timeInfo) html += ` • <span class="text-[#1b5e20] font-bold">Giờ ${timeInfo.branch} (${timeInfo.meridian})</span>`;
        
        label.innerHTML = html;
        label.title = timeInfo ? timeInfo.msg : "";
    }
};

// --- 8. QUẢN LÝ DANH SÁCH THUỐC ---

window.renderMedList = function(type) {
    const list = document.getElementById(type==='east'?'vMedListEast':'vMedListWest');
    const data = type==='east' ? window.currentVisit.rxEast : window.currentVisit.rxWest;
    const days = type==='east' ? window.currentVisit.eastDays : window.currentVisit.westDays;
    
    if (data.length === 0) {
        list.innerHTML = `<div class="text-center py-6 text-gray-400 italic text-sm border-2 border-dashed border-gray-200 rounded-lg bg-gray-50">Chưa kê vị thuốc nào</div>`;
        return;
    }

    list.innerHTML = data.map((m,i)=>`
        <div class="proc-card">
            <button onclick="window.removeMed('${type}',${i})" class="proc-del-btn">&times;</button>
            <div class="flex justify-between items-end mb-3 border-b border-dashed border-gray-200 pb-2">
                <input type="text" value="${m.name}" onchange="window.updateMed('${type}',${i},'name',this.value)" class="font-bold text-[#3e2723] text-lg bg-transparent border-none outline-none w-full placeholder-gray-400" placeholder="Tên thuốc..." onfocus="this.blur=null">
            </div>
            <div class="grid grid-cols-3 gap-3 mb-3">
                <div class="proc-input-group"><label>SL (${type==='east'?'g':'v'})</label><input type="number" value="${m.qty}" oninput="window.updateMed('${type}',${i},'qty',this.value)" onfocus="this.select()" class="proc-input text-center font-bold"></div>
                <div class="proc-input-group"><label>Đơn giá</label><input type="number" value="${m.price||0}" oninput="window.updateMed('${type}',${i},'price',this.value)" onfocus="this.select()" class="proc-input text-center text-right pr-2 font-mono"></div>
                <div class="proc-input-group"><label>Thành tiền</label><div class="proc-total-display flex items-center justify-center font-bold text-[#3e2723] bg-gray-100 rounded-lg h-[40px]">${((m.qty||0)*(m.price||0)*days).toLocaleString()}</div></div>
            </div>
            <div class="med-usage-row">
                ${['Sáng','Trưa','Chiều','Tối'].map(t => `<button class="time-btn-large ${(m.usage||'').includes(t)?'active':''}" onclick="window.toggleMedUsage('${type}',${i},'${t}')">${t}</button>`).join('')}
            </div>
        </div>
    `).join('');
};

window.addMedRow = function(type) { 
    (type==='east' ? window.currentVisit.rxEast : window.currentVisit.rxWest).push({ name:"", qty:10, days:1, price:0, usage:"" }); 
    window.renderMedList(type); 
    window.calcTotal(); 
};

// Hàm thêm thuốc từ Gợi ý AI (trong Modal)
window.addSuggestedMed = function(type, name) {
    const list = type === 'east' ? window.currentVisit.rxEast : window.currentVisit.rxWest;
    const exists = list.some(m => m.name.toLowerCase() === name.toLowerCase());
    if (exists) { 
        // Nếu đã có thì không thêm nữa (hoặc có thể tăng số lượng tùy logic)
        return; 
    }
    list.push({ name: name, qty: 10, days: 1, price: 0, usage: "" });
    window.renderMedList(type); 
    window.calcTotal();
    // Cuộn xuống
    const container = document.getElementById(type === 'east' ? 'vMedListEast' : 'vMedListWest'); 
    setTimeout(() => { container.scrollTop = container.scrollHeight; }, 100);
};

window.updateMed = function(type,i,f,v) { 
    const meds = type==='east' ? window.currentVisit.rxEast : window.currentVisit.rxWest; 
    meds[i][f] = (f==='qty'||f==='price') ? parseFloat(v) : v; 
    window.calcTotal(); 
    // Update DOM trực tiếp cho mượt
    const container = document.getElementById(type==='east'?'vMedListEast':'vMedListWest'); 
    if(container && container.children[i]) { 
        const totalDiv = container.children[i].querySelector('.proc-total-display'); 
        const days = type==='east' ? window.currentVisit.eastDays : window.currentVisit.westDays; 
        if(totalDiv) totalDiv.innerText = ((meds[i].qty||0)*(meds[i].price||0)*days).toLocaleString(); 
    } 
};

window.toggleMedUsage = function(type,i,time) { 
    const med = (type==='east' ? window.currentVisit.rxEast : window.currentVisit.rxWest)[i]; 
    let parts = (med.usage || '').split(',').map(p => p.trim()).filter(p => p); 
    const keywords = ['Sáng', 'Trưa', 'Chiều', 'Tối']; 
    let tParts = parts.filter(p => keywords.includes(p)); 
    let oParts = parts.filter(p => !keywords.includes(p)); 
    if (tParts.includes(time)) tParts = tParts.filter(t => t !== time); 
    else tParts.push(time); 
    tParts.sort((a, b) => keywords.indexOf(a) - keywords.indexOf(b)); 
    med.usage = [...tParts, ...oParts].join(', '); 
    window.renderMedList(type); 
};

window.removeMed = function(type,i) { 
    (type==='east' ? window.currentVisit.rxEast : window.currentVisit.rxWest).splice(i,1); 
    window.renderMedList(type); 
    window.calcTotal(); 
};

// --- 9. THỦ THUẬT ---

window.renderProcOptions = function() { 
    const area = document.getElementById('vProcOptionsArea'); 
    if (!window.config.procs || !window.config.procs.length) { area.innerHTML = '<span class="text-xs text-gray-400 italic w-full text-center">Chưa có dịch vụ.</span>'; return; } 
    area.innerHTML = window.config.procs.map((p, i) => `<button onclick="window.addProcToVisit(${i})" class="bg-white border border-[#d7ccc8] text-[#5d4037] px-3 py-2 rounded-lg text-xs font-bold shadow-sm active:scale-95 transition-transform hover:bg-[#efebe9]">${p.name} <span class="text-[10px] opacity-70 ml-1">(${p.price.toLocaleString()})</span></button>`).join(''); 
};

window.addProcToVisit = function(index) { 
    const p = window.config.procs[index]; 
    window.currentVisit.procs.push({ name: p.name, price: p.price, days: 1, discount: 0, note: '' }); 
    window.renderProcList(); 
    window.calcTotal(); 
};

window.renderProcList = function() { 
    const container = document.getElementById('vProcList'); 
    if (!window.currentVisit.procs.length) { 
        container.innerHTML = `<div class="text-center py-8 text-gray-400 text-sm italic border-2 border-dashed border-gray-200 rounded-xl bg-gray-50">Chưa chọn thủ thuật</div>`; 
        return; 
    } 
    container.innerHTML = window.currentVisit.procs.map((p, i) => `
        <div class="proc-card">
            <button onclick="window.removeProcedure(${i})" class="proc-del-btn">&times;</button>
            <div class="flex justify-between items-end mb-3 border-b border-dashed border-gray-200 pb-2">
                <span class="font-bold text-[#3e2723] text-lg">${p.name}</span>
                <span class="text-xs text-gray-400 font-mono">${p.price.toLocaleString()}đ/lần</span>
            </div>
            <div class="grid grid-cols-3 gap-3 mb-3">
                <div class="proc-input-group">
                    <label>Số ngày</label>
                    <input type="text" 
                           value="${p.days||1}" 
                           onfocus="this.select()" 
                           onclick="window.openNumberPad && window.openNumberPad(null, 'Số ngày', '1-100', ${p.days||1}, (val)=>{window.updateProcDays(${i}, val)})" 
                           readonly 
                           class="proc-input text-center font-bold">
                </div>
                <div class="proc-input-group">
                    <label>Giảm (%)</label>
                    <input type="text" 
                           value="${p.discount||0}" 
                           onfocus="this.select()" 
                           onclick="window.openNumberPad && window.openNumberPad(null, 'Giảm (%)', '0-100', ${p.discount||0}, (val)=>{window.updateProcDiscount(${i}, val)})" 
                           readonly 
                           class="proc-input text-center text-blue-600 font-bold border-dashed">
                </div>
                <div class="proc-input-group">
                    <label>Thành tiền</label>
                    <div class="proc-total-display flex items-center justify-center font-bold text-[#3e2723] bg-gray-100 rounded-lg h-[40px]">
                        ${Math.round(p.price*(p.days||1)*(1-(p.discount||0)/100)).toLocaleString()}
                    </div>
                </div>
            </div>
            <div class="med-usage-row mb-3">
                ${['Sáng','Trưa','Chiều','Tối'].map(t => 
                    `<button class="time-btn-large ${(p.note||'').includes(t)?'active':''}" onclick="window.toggleProcNote(${i},'${t}')">${t}</button>`
                ).join('')}
            </div>
            <input type="text" 
                   value="${p.note||''}" 
                   onchange="window.updateProcNoteText(${i}, this.value)" 
                   placeholder="Ghi chú..." 
                   class="w-full text-xs py-2 border-b border-dashed border-gray-300 outline-none bg-transparent">
        </div>
    `).join(''); 
};

window.removeProcedure = function(i) { 
    if(confirm("Xóa thủ thuật này?")) { 
        window.currentVisit.procs.splice(i,1); 
        window.renderProcList(); 
        window.calcTotal(); 
    } 
};

window.updateProcDays = function(i,v) { 
    window.currentVisit.procs[i].days = parseInt(v)||0; 
    window.renderProcList(); 
    window.calcTotal(); 
};

window.updateProcDiscount = function(i,v) { 
    let d=parseInt(v)||0; 
    if(d>100) d=100; 
    window.currentVisit.procs[i].discount=d; 
    window.renderProcList(); 
    window.calcTotal(); 
};

window.toggleProcNote = function(i,t) { 
    let p = window.currentVisit.procs[i]; 
    let parts = (p.note||'').split(',').map(s=>s.trim()).filter(s=>s); 
    let k=['Sáng','Trưa','Chiều','Tối']; 
    let tp=parts.filter(x=>k.includes(x)); 
    let op=parts.filter(x=>!k.includes(x)); 
    if(tp.includes(t)) tp=tp.filter(x=>x!==t); 
    else tp.push(t); 
    tp.sort((a,b)=>k.indexOf(a)-k.indexOf(b)); 
    p.note=[...tp,...op].join(', '); 
    window.renderProcList(); 
};

window.updateProcNoteText = function(i,v) { 
    window.currentVisit.procs[i].note = v; 
};

// --- 10. TÍNH TOÁN TỔNG (CORE CALCULATION) ---

window.calcTotal = function() {
    // 1. Thủ thuật
    let procTotal = 0; 
    window.currentVisit.procs.forEach(p => { 
        procTotal += Math.round((p.price||0)*(p.days||1)*(1-(p.discount||0)/100)); 
    });
    
    // 2. Đông Y
    let eastTotal = 0, eastDays = parseInt(document.getElementById('vEastDays').value)||1, eastManual = parseInt(document.getElementById('vEastManualPrice').value)||0; 
    window.currentVisit.eastDays = eastDays;
    eastTotal = eastManual > 0 ? eastManual * eastDays : window.currentVisit.rxEast.reduce((a,m)=>a+((m.qty||0)*(m.price||0)),0) * eastDays;
    
    // 3. Tây Y
    let westTotal = 0, westDays = parseInt(document.getElementById('vWestDays').value)||1, westManual = parseInt(document.getElementById('vWestManualPrice').value)||0; 
    window.currentVisit.westDays = westDays;
    westTotal = westManual > 0 ? westManual * westDays : window.currentVisit.rxWest.reduce((a,m)=>a+((m.qty||0)*(m.price||0)),0) * westDays;
    
    // Lưu kết quả tạm
    window.currentVisit.manualMedTotalEast = eastTotal; 
    window.currentVisit.manualMedTotalWest = westTotal;
    
    // Hiển thị
    document.getElementById('displayMedTotalEast').innerText = eastTotal.toLocaleString()+'đ'; 
    document.getElementById('displayMedTotalWest').innerText = westTotal.toLocaleString()+'đ'; 
    document.getElementById('displayProcTotal').innerText = procTotal.toLocaleString()+'đ';
    
    const total = eastTotal + westTotal + procTotal; 
    document.getElementById('displayGrandTotal').innerText = total.toLocaleString()+'đ';
    
    const disc = parseInt(document.getElementById('vDiscountPercent').value)||0; 
    document.getElementById('finalTotal').innerText = Math.round(total*(1-disc/100)).toLocaleString()+'đ';
    
    // Cập nhật giá hiển thị trên từng Card (Live Update)
    ['east','west'].forEach(t=>{ 
        const d = t==='east'?eastDays:westDays, ms = t==='east'?window.currentVisit.rxEast:window.currentVisit.rxWest; 
        const c = document.getElementById(t==='east'?'vMedListEast':'vMedListWest'); 
        if(c) Array.from(c.children).forEach((el,i)=>{ 
            if(ms[i]) { 
                const td=el.querySelector('.proc-total-display'); 
                if(td) td.innerText=((ms[i].qty||0)*(ms[i].price||0)*d).toLocaleString(); 
            }
        }); 
    });
};

// --- 11. CÁC NÚT BỔ TRỢ (CUSTOM BUTTONS) ---

window.injectCustomButtons = function() {
    const s3 = document.getElementById('step3'); 
    if(s3 && !document.getElementById('btnProcOnly')) { 
        const d = document.createElement('div'); d.className='mb-4'; 
        d.innerHTML=`<button id="btnProcOnly" onclick="window.setOnlyProcedures()" class="w-full py-3 bg-teal-50 text-teal-700 font-bold rounded-xl border border-teal-200 shadow-sm uppercase text-sm hover:bg-teal-100 transition-colors">✨ Chỉ làm thủ thuật (Xóa thuốc)</button>`; 
        s3.insertBefore(d, s3.firstChild); 
    }
    // Nút ClearRx Đông Y
    const eastSection = document.getElementById('vMedListEast').parentElement; 
    if (eastSection) { 
        const headerControls = eastSection.querySelector('.rx-header-controls'); 
        if (headerControls && !document.getElementById('btnClearEast')) { 
            const titleDiv = headerControls.firstElementChild; 
            if(titleDiv) { 
                const btn = document.createElement('button'); btn.id = 'btnClearEast'; 
                btn.className = 'text-[10px] bg-gray-200 text-gray-600 px-2 py-1 rounded ml-2 hover:bg-gray-300 font-bold border border-gray-300'; 
                btn.innerText = '✘ Bỏ toa này'; 
                btn.onclick = function() { window.clearRx('east'); }; 
                titleDiv.appendChild(btn); 
            } 
        } 
    }
    // Nút ClearRx Tây Y
    const westSection = document.getElementById('vMedListWest').parentElement; 
    if (westSection) { 
        const headerControls = westSection.querySelector('.rx-header-controls'); 
        if (headerControls && !document.getElementById('btnClearWest')) { 
            const titleDiv = headerControls.firstElementChild; 
            if(titleDiv) { 
                const btn = document.createElement('button'); btn.id = 'btnClearWest'; 
                btn.className = 'text-[10px] bg-blue-100 text-blue-600 px-2 py-1 rounded ml-2 hover:bg-blue-200 font-bold border border-blue-200'; 
                btn.innerText = '✘ Bỏ toa này'; 
                btn.onclick = function() { window.clearRx('west'); }; 
                titleDiv.appendChild(btn); 
            } 
        } 
    }
};

window.setOnlyProcedures = function() { 
    if(confirm("Xóa toàn bộ thuốc?")) { 
        window.clearRx('east',false); 
        window.clearRx('west',false); 
    } 
};

window.clearRx = function(type, ask=true) { 
    if(ask && !confirm("Xóa thuốc?")) return; 
    if(type==='east') { 
        window.currentVisit.rxEast=[]; 
        window.currentVisit.eastDays=1; 
        document.getElementById('vEastDays').value=1; 
        document.getElementById('vEastManualPrice').value=""; 
        document.getElementById('vEastNote').value=""; 
    } else { 
        window.currentVisit.rxWest=[]; 
        window.currentVisit.westDays=1; 
        document.getElementById('vWestDays').value=1; 
        document.getElementById('vWestManualPrice').value=""; 
        document.getElementById('vWestNote').value=""; 
    } 
    window.renderMedList(type); 
    window.calcTotal(); 
};

window.toggleGlobalEastUsage = function(t) { 
    const el=document.getElementById('vEastNote'); 
    let p=(el.value||'').split(',').map(s=>s.trim()).filter(s=>s), k=['Sáng','Trưa','Chiều','Tối'], tp=p.filter(x=>k.includes(x)), op=p.filter(x=>!k.includes(x)); 
    if(tp.includes(t)) tp=tp.filter(x=>x!==t); else tp.push(t); 
    tp.sort((a,b)=>k.indexOf(a)-k.indexOf(b)); 
    el.value=[...op, ...tp].join(', '); 
};

// --- 12. LƯU & XỬ LÝ DATABASE ---

window.saveOnly = function() { 
    window.processSave(false); 
}; 

window.saveAndPrint = function() { 
    window.processSave(true); 
};

window.processSave = async function(print) {
    try {
        const pid = document.getElementById('vPid').value; 
        if(!pid) throw new Error("Mất kết nối bệnh nhân"); 
        window.calcTotal();
        
        const visit = {
            id: parseInt(document.getElementById('vVisitId').value) || Date.now(),
            date: document.getElementById('vDate').value,
            disease: document.getElementById('vDiseaseSelect').value || document.getElementById('vDiseaseInput').value,
            symptoms: document.getElementById('vSpecial').value,
            tuChan: window.currentVisit.tuChan, 
            vong: document.getElementById('vVongExtra').value,
            rxEast: window.currentVisit.rxEast, 
            rxWest: window.currentVisit.rxWest, 
            procs: window.currentVisit.procs, 
            acupoints: window.currentVisit.acupoints,
            eastDays: parseInt(document.getElementById('vEastDays').value) || 1, 
            westDays: parseInt(document.getElementById('vWestDays').value) || 1,
            eastNote: document.getElementById('vEastNote').value, 
            westNote: document.getElementById('vWestNote').value,
            manualPriceEast: parseInt(document.getElementById('vEastManualPrice').value) || 0, 
            manualPriceWest: parseInt(document.getElementById('vWestManualPrice').value) || 0,
            medPriceEast: window.currentVisit.manualMedTotalEast, 
            medPriceWest: window.currentVisit.manualMedTotalWest,
            total: parseInt(document.getElementById('finalTotal').innerText.replace(/[^\d]/g,'')), 
            cost: parseInt(document.getElementById('vCost').value) || 0,
            disc: parseInt(document.getElementById('vDiscountPercent').value) || 0, 
            paid: document.getElementById('vPaid').checked
        };
        
        const pIdx = window.db.findIndex(x => String(x.id) === String(pid));
        if(pIdx > -1) { 
            if(!window.db[pIdx].visits) window.db[pIdx].visits = []; 
            const vIdx = window.db[pIdx].visits.findIndex(v => v.id === visit.id); 
            if(vIdx > -1) window.db[pIdx].visits[vIdx] = visit; 
            else window.db[pIdx].visits.unshift(visit); 
            
            if(window.saveDb) await window.saveDb(); 
            
            if(print) { 
                if(window.preparePrint) window.preparePrint('invoice'); 
            } else { 
                alert("Đã lưu thông tin khám bệnh!"); 
                if(window.closeModals) window.closeModals(); 
                if(window.render) window.render(); 
            } 
        }
    } catch(e) { 
        alert("Lỗi: " + e.message); 
        console.error(e); 
    }
};

// Kích hoạt Vận Khí ngay khi file này load xong
setTimeout(() => { if(window.updateYunQiDisplay) window.updateYunQiDisplay(); }, 1000);