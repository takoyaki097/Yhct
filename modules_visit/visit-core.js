/**
 * FILE: modules_visit/visit-core.js
 * CHỨC NĂNG: Core Logic - Khởi tạo ca khám, Quản lý State, Navigation & Tứ chẩn.
 * THƯ MỤC: modules_visit/
 * CẬP NHẬT: Reset và Load trạng thái thanh toán cho UI 2 nút (Paid/Unpaid).
 */

// ============================================================
// 1. KHỞI TẠO BIẾN TRẠNG THÁI (GLOBAL STATE)
// ============================================================

window.currentVisit = { 
    step: 1, 
    rxEast: [], rxWest: [], procs: [], acupoints: [], 
    manualMedTotalEast: 0, manualMedTotalWest: 0,
    eastDays: 1, westDays: 1,
    eastNote: "", westNote: "",
    manualPriceEast: 0, manualPriceWest: 0,
    isSacThuoc: false, sacQty: 0, sacPrice: 10000,
    tuChan: {vong:[],van:[],vanhoi:[],thiet:[],thietchan:[],machchan:[]} 
};

window.currentAiSuggestions = { points: [], herbs: [], messages: [], syndromeFound: null };
window.currentAcupointFilter = { type: 'region', value: 'all' }; 
window.currentHerbFilter = 'all'; 
window.currentBodyView = 'front'; 

window.visitModuleReady = true;

// ============================================================
// 2. CẤU HÌNH INPUT NHẬP LIỆU (NATIVE HELPERS)
// ============================================================

window.setupNativeInputs = function() {
    const configs = [
        { id: 'vBpSys', handler: window.updateBpDisplay },
        { id: 'vBpDia', handler: window.updateBpDisplay },
        { id: 'vPulse', handler: null },
        { id: 'vHeight', handler: window.updateHeightWeightDisplay },
        { id: 'vWeight', handler: window.updateHeightWeightDisplay },
        
        { id: 'vEastDays', handler: () => {
            const days = parseInt(document.getElementById('vEastDays').value) || 1;
            const sacQtyInput = document.getElementById('vSacQty');
            if (sacQtyInput && document.getElementById('vIsSacThuoc').checked) {
                sacQtyInput.value = days;
            }
            window.calcTotal();
        }},
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
        { id: 'vSacQty', handler: window.calcTotal },
        { id: 'vSacPrice', handler: window.calcTotal },
        { id: 'pYear', handler: null },
        { id: 'pPhone', handler: null, type: 'tel' }
    ];

    configs.forEach(cfg => {
        const el = document.getElementById(cfg.id);
        if (el) {
            el.type = cfg.type || 'number'; 
            if(el.type === 'number') { el.inputMode = 'decimal'; el.pattern = '[0-9]*'; } 
            else if (el.type === 'tel') { el.inputMode = 'numeric'; el.pattern = '[0-9]*'; }
            el.removeAttribute('readonly'); el.onclick = null;
            if(cfg.handler) el.oninput = cfg.handler;
            el.onfocus = function() { this.select(); };
            el.style.pointerEvents = 'auto'; el.style.backgroundColor = '#fff';
        }
    });
};

window.initDefaultValues = function() {
    const sys = document.getElementById('vBpSys');
    if(sys && !sys.value) {
        document.getElementById('vBpSys').value=120; document.getElementById('vBpDia').value=80;
        document.getElementById('vPulse').value=80; document.getElementById('vHeight').value=165; document.getElementById('vWeight').value=60;
    }
    window.updateBpDisplay(); window.updateHeightWeightDisplay();
};

window.updateBpDisplay = function() { 
    const sys = document.getElementById('vBpSys') ? document.getElementById('vBpSys').value : 120;
    const dia = document.getElementById('vBpDia') ? document.getElementById('vBpDia').value : 80;
    const disp = document.getElementById('displayBP');
    if(disp) disp.innerText = sys + '/' + dia;
};

window.updateHeightWeightDisplay = function() {
    const h = document.getElementById('vHeight').value, w = document.getElementById('vWeight').value;
    const disp = document.getElementById('displayHeightWeight');
    if(disp) disp.innerText = `${h}cm - ${w}kg`;
    
    const bmiDisp = document.getElementById('displayBMI');
    if(h>0 && w>0 && bmiDisp) bmiDisp.innerText = 'BMI: ' + (w/((h/100)*(h/100))).toFixed(1);
};

// ============================================================
// 3. BẮT ĐẦU KHÁM (START VISIT)
// ============================================================

window.startVisit = function(pid, vid=null) {
    const p = window.db.find(x => x.id == pid); if(!p) return;
    document.getElementById('vPid').value = pid; 
    document.getElementById('vVisitId').value = vid || '';
    document.getElementById('vPatientName').innerText = p.name;
    
    // Reset Data
    window.currentVisit = { 
        step: 1, rxEast: [], rxWest: [], procs: [], acupoints: [],
        manualMedTotalEast: 0, manualMedTotalWest: 0, eastDays: 1, westDays: 1,
        eastNote: "", westNote: "", manualPriceEast: 0, manualPriceWest: 0,
        isSacThuoc: false, sacQty: 1, sacPrice: 10000,
        tuChan: {vong:[],van:[],vanhoi:[],thiet:[],thietchan:[],machchan:[]} 
    };
    window.currentAiSuggestions = { points: [], herbs: [], messages: [], syndromeFound: null };
    
    // Reset UI Elements
    document.getElementById('vDate').value = window.getLocalDate();
    document.getElementById('vDiseaseInput').value = ''; 
    document.getElementById('vSpecial').value = '';
    document.getElementById('vCost').value = 0; 
    document.getElementById('vDiscountPercent').value = 0;
    document.getElementById('vEastDays').value = 1;
    document.getElementById('vWestDays').value = 1;
    document.getElementById('vEastManualPrice').value = ""; 
    document.getElementById('vWestManualPrice').value = ""; 
    document.getElementById('vEastNote').value = "";
    document.getElementById('vWestNote').value = "";
    
    const elSacCheck = document.getElementById('vIsSacThuoc');
    const elSacQty = document.getElementById('vSacQty');
    const elSacPrice = document.getElementById('vSacPrice');
    const elSacArea = document.getElementById('sacThuocArea');
    
    if(elSacCheck) elSacCheck.checked = false;
    if(elSacQty) elSacQty.value = 1;
    if(elSacPrice) elSacPrice.value = 10000;
    if(elSacArea) elSacArea.classList.add('hidden');

    ['displayMedTotalEast','displayMedTotalWest','displayProcTotal','displayGrandTotal','finalTotal'].forEach(id => {
        const el = document.getElementById(id);
        if(el) el.innerText = '0đ';
    });
    
    const aiBox = document.getElementById('aiSuggestionBox');
    if(aiBox) aiBox.classList.add('hidden');
    const acuList = document.getElementById('vAcupointList');
    if(acuList) acuList.innerHTML = '';
    
    // [NEW] Reset 2 nút thanh toán về trạng thái chưa chọn (Mặc định)
    const paidState = document.getElementById('vPaidState');
    const btnPaid = document.getElementById('btnPaid');
    const btnUnpaid = document.getElementById('btnUnpaid');
    
    if (paidState && btnPaid && btnUnpaid) {
        paidState.value = ""; // Xóa giá trị cũ để ép chọn lại
        // Reset style về mặc định (xám nhạt)
        btnPaid.className = "py-4 rounded-xl border border-gray-200 text-gray-500 font-bold text-sm uppercase transition-all hover:bg-gray-50";
        btnUnpaid.className = "py-4 rounded-xl border border-gray-200 text-gray-500 font-bold text-sm uppercase transition-all hover:bg-gray-50";
    }

    if(window.config.diseases) {
        document.getElementById('vDiseaseSelect').innerHTML = '<option value="">-- Chọn bệnh mẫu --</option>' + window.config.diseases.map(d=>`<option value="${d.name}">${d.name}</option>`).join('');
    }
    
    window.initDefaultValues();

    if(vid) {
        const v = p.visits.find(x => x.id == vid);
        if(v) {
            document.getElementById('vDate').value = v.date; 
            document.getElementById('vDiseaseInput').value = v.disease;
            document.getElementById('vSpecial').value = v.symptoms; 
            document.getElementById('vCost').value = v.cost;
            document.getElementById('vDiscountPercent').value = v.disc || 0; 
            
            // [NEW] Load trạng thái thanh toán cũ vào UI
            if (window.setPaymentStatus) {
                // Tham số thứ 2 là 'true' -> Bỏ qua hộp thoại confirm khi đang load dữ liệu
                window.setPaymentStatus(v.paid, true); 
            }
            
            if(v.tuChan) window.currentVisit.tuChan = v.tuChan;
            if(v.vong) document.getElementById('vVongExtra').value = v.vong;
            
            ['eastDays','westDays','manualPriceEast','manualPriceWest'].forEach(k => { if(v[k] !== undefined) window.currentVisit[k] = v[k]; });
            window.currentVisit.eastNote = v.eastNote || ""; window.currentVisit.westNote = v.westNote || "";
            
            document.getElementById('vEastDays').value = window.currentVisit.eastDays;
            document.getElementById('vWestDays').value = window.currentVisit.westDays;
            document.getElementById('vEastNote').value = window.currentVisit.eastNote;
            document.getElementById('vWestNote').value = window.currentVisit.westNote;
            document.getElementById('vEastManualPrice').value = window.currentVisit.manualPriceEast || "";
            document.getElementById('vWestManualPrice').value = window.currentVisit.manualPriceWest || "";

            if (v.isSacThuoc) {
                window.currentVisit.isSacThuoc = true;
                window.currentVisit.sacQty = v.sacQty || v.eastDays || 1;
                window.currentVisit.sacPrice = v.sacPrice || 10000;
                
                if(elSacCheck) elSacCheck.checked = true;
                if(elSacQty) elSacQty.value = window.currentVisit.sacQty;
                if(elSacPrice) elSacPrice.value = window.currentVisit.sacPrice;
                if(elSacArea) elSacArea.classList.remove('hidden');
            }

            window.currentVisit.rxEast = JSON.parse(JSON.stringify(v.rxEast||[])); 
            window.currentVisit.rxWest = JSON.parse(JSON.stringify(v.rxWest||[]));
            window.currentVisit.procs = JSON.parse(JSON.stringify(v.procs||[]));
            window.currentVisit.acupoints = JSON.parse(JSON.stringify(v.acupoints||[]));
        }
    } 
    
    if(window.renderMedList) window.renderMedList('east'); 
    if(window.renderMedList) window.renderMedList('west'); 
    if(window.renderProcOptions) window.renderProcOptions();
    if(window.renderProcList) window.renderProcList(); 
    if(window.renderSelectedAcupoints) window.renderSelectedAcupoints(); 
    if(window.calcTotal) window.calcTotal(); 
    
    window.setupNativeInputs();
    if(window.updateGlobalButtonsFromText) window.updateGlobalButtonsFromText();

    window.goToStep(1); 
    document.getElementById('vModal').classList.add('active');
};

// ============================================================
// 4. NAVIGATION (CHUYỂN TAB 1-2-3-4)
// ============================================================

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
    if(s===3||s===4) if(window.calcTotal) window.calcTotal();
    
    if(s===3) {
        if(window.injectCustomButtons) window.injectCustomButtons(); 
        try { if(window.refreshAiSuggestion) window.refreshAiSuggestion(false); } catch(e){}
        if(window.updateGlobalButtonsFromText) window.updateGlobalButtonsFromText();
    }
    if(s===4 && window.config.qrCodeImage) {
        document.getElementById('qrPaymentSection').classList.remove('hidden'); 
        document.getElementById('displayQrPayment').src = window.config.qrCodeImage; 
    }
};

window.nextStep = function() { if(window.currentVisit.step<4) window.goToStep(window.currentVisit.step+1); };
window.prevStep = function() { if(window.currentVisit.step>1) window.goToStep(window.currentVisit.step-1); };

// ============================================================
// 5. TỨ CHẨN (DIAGNOSIS UI)
// ============================================================

window.renderTuchanChips = function() {
    ['vong','van','vanhoi','thiet','thietchan','machchan'].forEach(sec => {
        const c = document.getElementById(`tuchan${sec.charAt(0).toUpperCase()+sec.slice(1)}Buttons`);
        if(c && window.config.tuChan[sec]) {
             c.innerHTML = window.config.tuChan[sec].map(t=>`
            <div class="tuchan-chip ${window.currentVisit.tuChan[sec].includes(t)?'active':''}" 
                 onclick="window.toggleTuchanChip('${sec}','${t.replace(/'/g,"\\'")}')">${t}</div>`).join('');
        }
    });
};

window.toggleTuchanChip = function(sec,t) {
    const idx = window.currentVisit.tuChan[sec].indexOf(t);
    if(idx===-1) window.currentVisit.tuChan[sec].push(t); 
    else window.currentVisit.tuChan[sec].splice(idx,1);
    window.renderTuchanChips();
    try { if(window.refreshAiSuggestion) window.refreshAiSuggestion(false); } catch(e){}
};

// ============================================================
// 6. XỬ LÝ BỆNH MẪU (DISEASE PRESETS)
// ============================================================

window.loadDiseaseSuggestions = function() {
    const dName = document.getElementById('vDiseaseSelect').value;
    const box = document.getElementById('suggestedSymptomsBox');
    const preArea = document.getElementById('eastPresetsArea');
    
    if(!dName) { 
        if(box) box.classList.add('hidden'); 
        if(preArea) preArea.classList.add('hidden'); 
        return; 
    }
    
    const d = window.config.diseases.find(x => x.name === dName);
    if(d) {
        if(d.sym && box) { 
            box.classList.remove('hidden'); 
            const syms = d.sym.split(',').map(s => s.trim()).filter(s => s);
            document.getElementById('symptomButtons').innerHTML = syms.map(s=>`<span onclick="window.addSymptom('${s}')" class="med-chip cursor-pointer bg-green-100 text-green-800 px-2 py-1 rounded text-xs hover:bg-green-200">+ ${s}</span>`).join(''); 
        } else if(box) box.classList.add('hidden');
        
        window.currentVisit.rxWest = JSON.parse(JSON.stringify(d.rxWest||[])); 
        if(window.renderMedList) window.renderMedList('west');
        
        if(d.eastOptions?.length && preArea) { 
            preArea.classList.remove('hidden'); 
            document.getElementById('eastPresetButtons').innerHTML = d.eastOptions.map((o,i)=>`
                <div class="med-chip cursor-pointer px-3 py-1 rounded border border-gray-300 text-xs font-bold hover:bg-gray-100 ${i===0?'bg-[#5d4037] text-white border-transparent':''}" onclick="window.applyEasternSample(${i})">${o.name}</div>`).join(''); 
            if(d.eastOptions.length > 0) window.applyEasternSample(0);
        } else if(preArea) preArea.classList.add('hidden');
        
        if(window.calcTotal) window.calcTotal();
    }
};

window.addSymptom = function(text) {
    const el = document.getElementById('vSpecial');
    if (!el.value.includes(text)) {
        el.value = el.value ? el.value + ", " + text : text;
        try { if(window.refreshAiSuggestion) window.refreshAiSuggestion(false); } catch(e){}
    }
};

window.applyEasternSample = function(i) {
    const container = document.getElementById('eastPresetButtons');
    if(container) {
        const btns = container.querySelectorAll('div');
        btns.forEach((btn, idx) => {
            if(idx === i) btn.className = "med-chip cursor-pointer px-3 py-1 rounded text-xs font-bold bg-[#5d4037] text-white border-transparent shadow-sm";
            else btn.className = "med-chip cursor-pointer px-3 py-1 rounded border border-gray-300 text-xs font-bold hover:bg-gray-100 bg-white text-gray-600";
        });
    }
    
    const d = window.config.diseases.find(x => x.name === document.getElementById('vDiseaseSelect').value);
    if(d && d.eastOptions[i]) { 
        window.currentVisit.rxEast = JSON.parse(JSON.stringify(d.eastOptions[i].ingredients)); 
        if(window.renderMedList) window.renderMedList('east'); 
        if(window.calcTotal) window.calcTotal(); 
    }
};
