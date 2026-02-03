/**
 * FILE: configs/config-disease.js
 * CHỨC NĂNG: Quản lý Thêm/Sửa/Xóa Bệnh mẫu và Thuốc mẫu (Đông y/Tây y).
 * PHỤ THUỘC: window.config, window.tempEastOptions, window.CONFIG_MEDICINE
 * CẬP NHẬT: Tích hợp chọn Bài thuốc mẫu vào form Bệnh.
 */

/* ==========================================================================
   PHẦN 1: QUẢN LÝ DANH MỤC BỆNH (DISEASE LIST)
   ========================================================================== */

// 1. Render danh sách bệnh ra màn hình cài đặt
window.renderDiseaseSettings = function() { 
    const l = document.getElementById('diseaseList'); 
    if(!l) return; 
    
    if(!window.config.diseases || window.config.diseases.length === 0) {
        l.innerHTML = '<div class="text-center text-gray-400 text-xs italic py-2">Chưa có bệnh mẫu nào</div>';
        return;
    }

    l.innerHTML = window.config.diseases.map((d,i)=>`
        <div class="flex justify-between items-center p-2 border border-gray-100 rounded bg-white shadow-sm mb-1 hover:bg-gray-50">
            <div class="font-bold text-sm text-[#3e2723] truncate flex-1 pr-2">${d.name} 
                <span class="text-[10px] font-normal text-gray-400 ml-1">(${d.eastOptions ? d.eastOptions.length : 0} bài)</span>
            </div>
            <div class="flex gap-1 flex-shrink-0">
                <button onclick="window.editDisease(${i})" class="text-[10px] px-2 py-1 bg-[#efebe9] rounded font-bold text-[#5d4037] hover:bg-[#d7ccc8] border border-[#d7ccc8]">SỬA</button>
                <button onclick="window.deleteDisease(${i})" class="text-[10px] px-2 py-1 bg-red-50 rounded text-red-600 hover:bg-red-100 border border-red-100">XÓA</button>
            </div>
        </div>`).join(''); 
};

// 2. Xóa một bệnh
window.deleteDisease = async function(i) { 
    if(confirm('Bạn có chắc muốn xóa bệnh này không?')){ 
        window.config.diseases.splice(i,1); 
        if(window.saveConfig) await window.saveConfig(); 
        window.renderDiseaseSettings(); 
    } 
};

// 3. Thêm nhanh bệnh mới (Inline)
window.addNewDiseaseInline = async function() {
    const input = document.getElementById('newDiseaseName');
    if (!input) return;
    
    const name = input.value.trim();
    if (!name) return alert("Vui lòng nhập tên bệnh!");
    
    // Tạo cấu trúc bệnh mới rỗng
    const newDisease = {
        name: name,
        sym: "",
        rxWest: [],
        eastOptions: [{name: "Bài thuốc 1", ingredients: []}] 
    };
    
    // Thêm vào config
    if (!window.config.diseases) window.config.diseases = [];
    window.config.diseases.push(newDisease);
    
    // Lưu và render lại
    if(window.saveConfig) await window.saveConfig();
    window.renderDiseaseSettings();
    
    // Reset input và mở modal sửa ngay
    input.value = "";
    window.editDisease(window.config.diseases.length - 1);
};

/* ==========================================================================
   [MỚI] LOGIC LIÊN KẾT BÀI THUỐC MẪU (INTEGRATION LOGIC)
   ========================================================================== */

// Hàm A: Nạp danh sách bài thuốc mẫu vào Dropdown
window.renderSampleSelectorInDiseaseModal = function() {
    const select = document.getElementById('diseaseSampleSelect');
    if (!select) return;

    // Lấy bài thuốc từ User Config trước, nếu không có thì lấy Mặc định hệ thống
    let samples = window.config.samplePrescriptions || [];
    if (samples.length === 0 && window.CONFIG_MEDICINE) {
        samples = window.CONFIG_MEDICINE.DEFAULT_EAST_SAMPLES;
    }

    // Render options
    let html = '<option value="">📥 Nạp bài mẫu...</option>';
    if (samples && samples.length > 0) {
        html += samples.map((s, i) => 
            `<option value="${i}">${s.name} (${s.ingredients ? s.ingredients.length : 0} vị)</option>`
        ).join('');
    } else {
        html += '<option value="" disabled>Chưa có bài mẫu</option>';
    }
    
    select.innerHTML = html;
};

// Hàm B: Xử lý khi chọn một bài mẫu -> Điền vào form
window.importSampleToDisease = function() {
    const select = document.getElementById('diseaseSampleSelect');
    const index = select.value;
    if (index === "") return;

    // Lấy nguồn dữ liệu
    let samples = window.config.samplePrescriptions || [];
    if (samples.length === 0 && window.CONFIG_MEDICINE) {
        samples = window.CONFIG_MEDICINE.DEFAULT_EAST_SAMPLES;
    }

    const selectedSample = samples[index];
    if (!selectedSample) return;

    // Xác nhận trước khi ghi đè
    if (confirm(`Bạn có muốn nạp bài thuốc "${selectedSample.name}" vào ô hiện tại không?\n(Dữ liệu cũ trong ô này sẽ bị thay thế)`)) {
        
        // 1. Cập nhật tên bài thuốc trên UI
        const nameInput = document.getElementById('diseaseEastName');
        if (nameInput) nameInput.value = selectedSample.name;

        // 2. Cập nhật biến tạm (tempEastOptions)
        if (window.currentEastOptionIndex > -1 && window.tempEastOptions[window.currentEastOptionIndex]) {
            window.tempEastOptions[window.currentEastOptionIndex].name = selectedSample.name;
            // Deep copy mảng ingredients để tránh tham chiếu
            window.tempEastOptions[window.currentEastOptionIndex].ingredients = JSON.parse(JSON.stringify(selectedSample.ingredients));
        }

        // 3. Render lại danh sách vị thuốc trên giao diện
        window.renderEastTabsInSettings();
        
        // Thông báo nhỏ (Optional)
        // if(window.showToast) window.showToast("Đã nạp bài thuốc thành công", "success");
    }

    // Reset dropdown về mặc định
    select.value = "";
};

/* ==========================================================================
   PHẦN 2: MODAL CHI TIẾT BỆNH (EDIT DISEASE MODAL)
   ========================================================================== */

// 1. Mở modal để thêm bệnh mới (Full UI)
window.addNewDisease = function() { 
    // Reset biến tạm
    window.tempEastOptions = [{name: "Bài thuốc 1", ingredients: []}];
    window.currentEastOptionIndex = 0;
    
    // Reset UI
    document.getElementById('diseaseModalTitle').innerText='Thêm bệnh mới';
    document.getElementById('diseaseEditIndex').value='';
    document.getElementById('diseaseName').value='';
    document.getElementById('diseaseSymptoms').value='';
    document.getElementById('diseaseEastName').value = '';
    
    // Clear containers
    document.getElementById('eastIngredientsContainer').innerHTML = '';
    document.getElementById('westMedicinesContainer').innerHTML = '';
    
    // Thêm dòng mặc định
    window.renderEastIngInSettings({});
    window.addWestMedicine();
    
    // Render Tabs Đông y
    window.renderEastTabsInSettings();
    
    // [UPDATE] Render Dropdown bài thuốc mẫu
    window.renderSampleSelectorInDiseaseModal();
    
    // Mở modal
    document.getElementById('diseaseModal').classList.add('active');
};

// 2. Mở modal để sửa bệnh có sẵn
window.editDisease = function(index) { 
    const d = window.config.diseases[index]; 
    if(!d) return;

    document.getElementById('diseaseModalTitle').innerText='Sửa bệnh'; 
    document.getElementById('diseaseEditIndex').value=index; 
    document.getElementById('diseaseName').value=d.name; 
    document.getElementById('diseaseSymptoms').value=d.sym; 
    
    // Clear containers
    document.getElementById('eastIngredientsContainer').innerHTML = '';
    document.getElementById('westMedicinesContainer').innerHTML = '';
    
    // Load thuốc Tây Y
    if(d.rxWest && d.rxWest.length){
        d.rxWest.forEach(m => window.renderWestMedInSettings(m));
    } else {
        window.addWestMedicine();
    }
    
    // Load thuốc Đông Y
    if(d.eastOptions && d.eastOptions.length) {
        window.tempEastOptions = JSON.parse(JSON.stringify(d.eastOptions));
        window.currentEastOptionIndex = 0;
    } else {
        window.tempEastOptions = [{name: "Bài 1", ingredients: []}];
        window.currentEastOptionIndex = 0;
    }
    
    window.renderEastTabsInSettings();
    
    // [UPDATE] Render Dropdown bài thuốc mẫu
    window.renderSampleSelectorInDiseaseModal();

    document.getElementById('diseaseModal').classList.add('active');
};

// 3. Đóng modal bệnh
window.closeDiseaseModal = function() {
    document.getElementById('diseaseModal').classList.remove('active');
    
    // Reset dọn dẹp bộ nhớ tạm
    window.tempEastOptions = [];
    window.currentEastOptionIndex = -1;
    
    // Reset Inputs
    document.getElementById('diseaseName').value = '';
    document.getElementById('diseaseSymptoms').value = '';
    document.getElementById('diseaseEastName').value = '';
    document.getElementById('diseaseEditIndex').value = '';
    
    // Xóa nội dung containers
    document.getElementById('eastIngredientsContainer').innerHTML = '';
    document.getElementById('westMedicinesContainer').innerHTML = '';
    document.getElementById('eastSettingsTabs').innerHTML = '';
    
    // Đảm bảo modal cha (Cài đặt) vẫn hiển thị
    const sModal = document.getElementById('sModal');
    if (sModal && sModal.classList.contains('active')) {
        sModal.style.display = 'flex';
    }
};

/* ==========================================================================
   PHẦN 3: QUẢN LÝ TABS BÀI THUỐC ĐÔNG Y (TRONG MODAL BỆNH)
   ========================================================================== */

window.renderEastTabsInSettings = function() { 
    const c = document.getElementById('eastIngredientsContainer');
    let t = document.getElementById('eastSettingsTabs');
    const n = document.getElementById('diseaseEastName');
    
    // Tạo container tab nếu chưa có
    if(!t && n && n.parentElement){
        t = document.createElement('div');
        t.id = 'eastSettingsTabs';
        t.className = 'flex gap-2 overflow-x-auto pb-2 mb-2 border-b border-dashed border-[#d7ccc8] custom-scrollbar';
        n.parentElement.insertBefore(t, n);
    }
    
    // Render các nút Tab
    if(t) {
        t.innerHTML = window.tempEastOptions.map((o,i)=>`
            <button onclick="window.switchEastPresetSettings(${i})" 
                    class="px-3 py-1 rounded-full text-xs font-bold whitespace-nowrap transition-colors
                    ${i===window.currentEastOptionIndex ? 'bg-[#5d4037] text-white shadow-sm' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}">
                ${o.name || 'Bài '+(i+1)}
            </button>`).join('') + 
            `<button onclick="window.addEastPresetInSettings()" 
                    class="px-3 py-1 rounded-full text-xs bg-green-50 text-green-700 border border-green-200 hover:bg-green-100">+ Thêm</button>
             ${window.tempEastOptions.length > 1 ? 
                '<button onclick="window.removeCurrentEastPreset()" class="px-2 py-1 text-xs text-red-500 ml-2 hover:text-red-700">Xóa</button>' : 
                ''}`;
    }
    
    // Đảm bảo luôn có ít nhất 1 bài
    if(window.tempEastOptions.length === 0) {
        window.tempEastOptions = [{name: "Bài 1", ingredients: []}];
        window.currentEastOptionIndex = 0;
    }
    
    // Hiển thị nội dung bài thuốc đang chọn
    if(window.tempEastOptions[window.currentEastOptionIndex]){
        const currentOpt = window.tempEastOptions[window.currentEastOptionIndex];
        if(n) n.value = currentOpt.name || '';
        
        c.innerHTML = '';
        
        if(currentOpt.ingredients.length === 0) {
            window.renderEastIngInSettings({});
        } else {
            currentOpt.ingredients.forEach(g => window.renderEastIngInSettings(g));
        }
    }
};

window.switchEastPresetSettings = function(i) { 
    window.saveCurrentTabToTemp(); 
    window.currentEastOptionIndex = i; 
    window.renderEastTabsInSettings(); 
};

window.addEastPresetInSettings = function() { 
    window.saveCurrentTabToTemp(); 
    window.tempEastOptions.push({name: `Bài ${window.tempEastOptions.length+1}`, ingredients: []}); 
    window.currentEastOptionIndex = window.tempEastOptions.length-1; 
    window.renderEastTabsInSettings(); 
};

window.removeCurrentEastPreset = function() { 
    if(window.tempEastOptions.length <= 1) return;
    if(confirm("Bạn chắc chắn muốn xóa bài thuốc này?")){ 
        window.tempEastOptions.splice(window.currentEastOptionIndex, 1); 
        window.currentEastOptionIndex = 0; 
        window.renderEastTabsInSettings(); 
    } 
};

// Lưu dữ liệu từ DOM vào biến tạm trước khi chuyển Tab
window.saveCurrentTabToTemp = function() {
    if(window.currentEastOptionIndex === -1 || !window.tempEastOptions[window.currentEastOptionIndex]) return;
    
    const n = document.getElementById('diseaseEastName');
    if(n) window.tempEastOptions[window.currentEastOptionIndex].name = n.value.trim();
    
    const ig = [];
    document.querySelectorAll('#eastIngredientsContainer .med-row-grid').forEach(r => {
        const nameInput = r.querySelector('.east-ingredient-name');
        const qtyInput = r.querySelector('.east-ingredient-qty');
        const priceInput = r.querySelector('.east-ingredient-price');
        
        const na = nameInput ? nameInput.value.trim() : '';
        const q = qtyInput ? parseInt(qtyInput.value) || 0 : 0;
        const p = priceInput ? parseInt(priceInput.value) || 0 : 0;
        
        if(na) ig.push({name: na, qty: q, days: 1, price: p});
    });
    
    window.tempEastOptions[window.currentEastOptionIndex].ingredients = ig;
};

/* ==========================================================================
   PHẦN 4: HELPER RENDER CÁC DÒNG INPUT THUỐC
   ========================================================================== */

window.renderEastIngInSettings = function(ing={}) { 
    const c = document.getElementById('eastIngredientsContainer');
    const d = document.createElement('div');
    d.className = 'disease-ingredient-row med-row-grid';
    d.innerHTML = `
        <button onclick="this.parentElement.remove()" class="med-delete-btn" tabindex="-1">&times;</button>
        <div class="med-row-name">
            <input type="text" class="song-input ipad-input-fix east-ingredient-name" placeholder="Tên vị..." value="${ing.name||''}">
        </div>
        <div class="med-input-group">
            <label>SL</label>
            <input type="number" class="med-input-large ipad-input-fix east-ingredient-qty" value="${ing.qty||10}">
        </div>
        <div class="med-input-group">
            <label>ĐG</label>
            <input type="number" class="med-input-large ipad-input-fix east-ingredient-price" value="${ing.price||0}">
        </div>`;
    c.appendChild(d);
};

window.addEastIngredient = function() { 
    window.renderEastIngInSettings({}); 
};

window.renderWestMedInSettings = function(med={}) { 
    const c = document.getElementById('westMedicinesContainer');
    const d = document.createElement('div');
    d.className = 'disease-ingredient-row med-row-grid';
    d.innerHTML = `
        <button onclick="this.parentElement.remove()" class="med-delete-btn" tabindex="-1">&times;</button>
        <div class="med-row-name">
            <input type="text" class="song-input ipad-input-fix west-medicine-name" placeholder="Tên thuốc..." value="${med.name||''}">
        </div>
        <div class="med-input-group">
            <label>SL</label>
            <input type="number" class="med-input-large ipad-input-fix west-medicine-qty" value="${med.qty||2}">
        </div>
        <div class="med-input-group">
            <label>ĐG</label>
            <input type="number" class="med-input-large ipad-input-fix west-medicine-price" value="${med.price||0}">
        </div>`;
    c.appendChild(d);
};

window.addWestMedicine = function() { 
    window.renderWestMedInSettings({}); 
};

// Lưu toàn bộ Bệnh vào Config
window.saveDisease = async function() { 
    const n = document.getElementById('diseaseName').value.trim();
    if(!n) return alert('Vui lòng nhập tên bệnh');
    
    const s = document.getElementById('diseaseSymptoms').value.trim();
    
    window.saveCurrentTabToTemp();
    
    const w = [];
    document.querySelectorAll('#westMedicinesContainer .med-row-grid').forEach(r => {
        const nameInput = r.querySelector('.west-medicine-name');
        const qtyInput = r.querySelector('.west-medicine-qty');
        const priceInput = r.querySelector('.west-medicine-price');
        
        const na = nameInput ? nameInput.value.trim() : '';
        const q = qtyInput ? parseInt(qtyInput.value) || 0 : 0;
        const p = priceInput ? parseInt(priceInput.value) || 0 : 0;
        
        if(na) w.push({name: na, qty: q, days: 1, price: p});
    });
    
    let eastOpts = window.tempEastOptions;
    if(eastOpts.length === 0) eastOpts.push({name: "Bài thuốc", ingredients: []});
    
    const d = {
        name: n,
        sym: s,
        rxWest: w,
        eastOptions: eastOpts
    };
    
    const i = document.getElementById('diseaseEditIndex').value;
    if(i !== ''){
        window.config.diseases[i] = d; 
    } else {
        window.config.diseases.push(d); 
    }
    
    if(window.saveConfig) await window.saveConfig();
    window.renderDiseaseSettings();
    window.closeDiseaseModal();
};

/* ==========================================================================
   PHẦN 5: QUẢN LÝ BÀI THUỐC MẪU (SAMPLE PRESCRIPTIONS)
   ========================================================================== */

// 1. Render danh sách bài thuốc mẫu
window.renderSamplePrescriptionSettings = function() {
    const list = document.getElementById('samplePrescriptionList');
    if (!list) return;

    // Lấy danh sách cá nhân
    const userSamples = window.config.samplePrescriptions || [];
    
    // Kiểm tra danh sách hệ thống (để hiện nút Import)
    const systemSamples = window.CONFIG_MEDICINE ? window.CONFIG_MEDICINE.DEFAULT_EAST_SAMPLES : [];
    const hasSystemData = systemSamples && systemSamples.length > 0;

    let html = '';

    // Nút Reset/Nạp lại luôn hiển thị nếu có dữ liệu hệ thống
    if (hasSystemData) {
        html += `
        <div class="mb-3 pb-2 border-b border-dashed border-gray-200 flex justify-end">
            <button onclick="window.importSystemSamples()" class="text-[10px] text-blue-600 hover:text-blue-800 underline flex items-center gap-1 bg-blue-50 px-2 py-1 rounded">
                <span>♻️</span> Nạp/Khôi phục dữ liệu mẫu (${systemSamples.length} bài)
            </button>
        </div>`;
    }

    if (userSamples.length === 0) {
        html += `<div class="text-center text-gray-400 text-xs italic py-4">Chưa có bài thuốc cá nhân.</div>`;
    } else {
        html += userSamples.map((s, i) => `
            <div class="flex justify-between items-center p-2 border border-gray-100 rounded bg-white shadow-sm mb-1 hover:bg-gray-50 group">
                <div class="font-bold text-xs text-[#3e2723] truncate flex-1 pr-2 cursor-pointer" onclick="window.editSamplePrescription(${i})">
                    ${i + 1}. ${s.name} 
                    <span class="text-[10px] font-normal text-gray-400 ml-1">(${s.ingredients ? s.ingredients.length : 0} vị)</span>
                </div>
                <div class="flex gap-1 flex-shrink-0">
                    <button onclick="window.editSamplePrescription(${i})" class="text-[9px] px-2 py-1 bg-[#efebe9] rounded font-bold text-[#5d4037] hover:bg-[#d7ccc8] border border-[#d7ccc8]">SỬA</button>
                    <button onclick="window.deleteSamplePrescription(${i})" class="text-[9px] px-2 py-1 bg-red-50 rounded text-red-600 hover:bg-red-100 border border-red-100">XÓA</button>
                </div>
            </div>`).join('');
    }

    list.innerHTML = html;
};

// Hàm Import dữ liệu từ config-medicine.js
window.importSystemSamples = async function() {
    if (!window.CONFIG_MEDICINE || !window.CONFIG_MEDICINE.DEFAULT_EAST_SAMPLES) {
        alert("Lỗi: Không tìm thấy dữ liệu mẫu trong file config-medicine.js!");
        return;
    }

    if(confirm("Hành động này sẽ thay thế danh sách bài thuốc mẫu hiện tại bằng danh sách chuẩn từ hệ thống.\n\nBạn có chắc chắn không?")) {
        // Deep copy để tránh tham chiếu
        window.config.samplePrescriptions = JSON.parse(JSON.stringify(window.CONFIG_MEDICINE.DEFAULT_EAST_SAMPLES));
        
        if (window.saveConfig) await window.saveConfig();
        window.renderSamplePrescriptionSettings();
        if(window.showToast) window.showToast("✅ Đã khôi phục dữ liệu mẫu!", "success");
    }
};

// 2. Thêm nhanh bài thuốc mẫu
window.addNewSamplePrescriptionInline = async function() {
    if (!window.config.samplePrescriptions) window.config.samplePrescriptions = [];
    
    const newSample = {
        name: "Bài thuốc mới " + (window.config.samplePrescriptions.length + 1),
        ingredients: []
    };
    
    window.config.samplePrescriptions.push(newSample);
    
    if (window.saveConfig) await window.saveConfig();
    window.renderSamplePrescriptionSettings();
    window.editSamplePrescription(window.config.samplePrescriptions.length - 1);
};

// 3. Xóa bài thuốc mẫu
window.deleteSamplePrescription = async function(index) {
    if (confirm("Bạn có chắc chắn muốn xóa bài thuốc mẫu này?")) {
        window.config.samplePrescriptions.splice(index, 1);
        if (window.saveConfig) await window.saveConfig();
        window.renderSamplePrescriptionSettings();
    }
};

// 4. Mở Modal Sửa bài thuốc mẫu
window.editSamplePrescription = function(index) {
    const sample = window.config.samplePrescriptions[index];
    if (!sample) return;

    document.getElementById('samplePrescriptionIndex').value = index;
    document.getElementById('samplePrescriptionName').value = sample.name;
    
    const container = document.getElementById('sampleIngredientsContainer');
    container.innerHTML = '';
    
    if (sample.ingredients && sample.ingredients.length > 0) {
        sample.ingredients.forEach(ing => window.renderSampleIngredientRow(ing));
    } else {
        window.renderSampleIngredientRow();
    }

    document.getElementById('samplePrescriptionModal').classList.add('active');
};

// 5. Đóng Modal bài thuốc mẫu
window.closeSamplePrescriptionModal = function() {
    document.getElementById('samplePrescriptionModal').classList.remove('active');
    document.getElementById('sampleIngredientsContainer').innerHTML = '';
};

// 6. Render dòng thuốc trong Modal bài thuốc mẫu
window.renderSampleIngredientRow = function(ing = {}) {
    const container = document.getElementById('sampleIngredientsContainer');
    const div = document.createElement('div');
    div.className = 'flex items-center gap-2 mb-2 med-row-sample';
    div.innerHTML = `
        <button onclick="this.parentElement.remove()" class="w-6 h-6 flex items-center justify-center text-red-400 hover:text-red-600 font-bold bg-gray-100 rounded-full" tabindex="-1">&times;</button>
        <input type="text" class="song-input h-8 text-xs font-bold text-[#3e2723] flex-1 sample-ing-name" placeholder="Tên vị thuốc..." value="${ing.name || ''}">
        <input type="number" class="song-input h-8 w-16 text-center text-xs font-bold sample-ing-qty" placeholder="Gam" value="${ing.qty || 12}">
    `;
    container.appendChild(div);
    // Auto focus nếu là dòng mới
    if (!ing.name) {
        setTimeout(() => div.querySelector('.sample-ing-name').focus(), 50);
    }
};

// Nút thêm dòng
window.addSampleIngredientItem = function() {
    window.renderSampleIngredientRow();
};

// 7. Lưu bài thuốc mẫu
window.saveSamplePrescription = async function() {
    const index = document.getElementById('samplePrescriptionIndex').value;
    const name = document.getElementById('samplePrescriptionName').value.trim();
    
    if (!name) return alert("Vui lòng nhập tên bài thuốc!");
    
    const ingredients = [];
    document.querySelectorAll('#sampleIngredientsContainer .med-row-sample').forEach(row => {
        const nameInput = row.querySelector('.sample-ing-name').value.trim();
        const qtyInput = parseFloat(row.querySelector('.sample-ing-qty').value) || 0;
        
        if (nameInput) {
            ingredients.push({ name: nameInput, qty: qtyInput });
        }
    });

    if (window.config.samplePrescriptions && window.config.samplePrescriptions[index]) {
        window.config.samplePrescriptions[index].name = name;
        window.config.samplePrescriptions[index].ingredients = ingredients;
        
        if (window.saveConfig) await window.saveConfig();
        window.renderSamplePrescriptionSettings(); 
        window.closeSamplePrescriptionModal();
        
        if(window.showToast) window.showToast("Đã lưu bài thuốc mẫu!", "success");
    }
};
