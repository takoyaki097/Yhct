/**
 * FILE: js/config-disease.js
 * CHỨC NĂNG: Quản lý Thêm/Sửa/Xóa Bệnh mẫu và Thuốc mẫu (Đông y/Tây y).
 * PHỤ THUỘC: window.config, window.tempEastOptions (từ config-core.js)
 */

// --- 1. QUẢN LÝ DANH SÁCH BỆNH (SETTINGS PANEL) ---

window.renderDiseaseSettings = function() { 
    const l = document.getElementById('diseaseList'); 
    if(!l) return; 
    
    if(!window.config.diseases || window.config.diseases.length === 0) {
        l.innerHTML = '<div class="text-center text-gray-400 text-xs italic py-2">Chưa có bệnh mẫu nào</div>';
        return;
    }

    l.innerHTML = window.config.diseases.map((d,i)=>`
        <div class="flex justify-between items-center p-3 border rounded bg-white shadow-sm mb-1">
            <div class="font-bold text-sm text-[#3e2723]">${d.name} 
                <span class="text-xs font-normal text-gray-500">(${d.eastOptions ? d.eastOptions.length : 0} bài)</span>
            </div>
            <div class="flex gap-2">
                <button onclick="window.editDisease(${i})" class="text-xs px-3 py-1 bg-[#efebe9] rounded font-bold text-[#5d4037] hover:bg-[#d7ccc8]">SỬA</button>
                <button onclick="window.deleteDisease(${i})" class="text-xs px-3 py-1 bg-red-50 rounded text-red-600 hover:bg-red-100">XÓA</button>
            </div>
        </div>`).join(''); 
};

window.deleteDisease = async function(i) { 
    if(confirm('Bạn có chắc muốn xóa bệnh này không?')){ 
        window.config.diseases.splice(i,1); 
        if(window.saveConfig) await window.saveConfig(); 
        window.renderDiseaseSettings(); 
    } 
};

// --- 2. MỞ/ĐÓNG MODAL BỆNH (DISEASE MODAL) ---

window.addNewDisease = function() { 
    // Reset biến tạm (tempEastOptions từ config-core.js)
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
    
    // Mở modal
    document.getElementById('diseaseModal').classList.add('active');
};

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
    
    // Load thuốc Đông Y (Deep copy để không sửa trực tiếp vào config khi chưa Lưu)
    if(d.eastOptions && d.eastOptions.length) {
        window.tempEastOptions = JSON.parse(JSON.stringify(d.eastOptions));
        window.currentEastOptionIndex = 0;
    } else {
        window.tempEastOptions = [{name: "Bài 1", ingredients: []}];
        window.currentEastOptionIndex = 0;
    }
    
    window.renderEastTabsInSettings();
    document.getElementById('diseaseModal').classList.add('active');
};

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

// --- 3. QUẢN LÝ TABS ĐÔNG Y (EAST TABS) ---

window.renderEastTabsInSettings = function() { 
    const c = document.getElementById('eastIngredientsContainer');
    let t = document.getElementById('eastSettingsTabs');
    const n = document.getElementById('diseaseEastName');
    
    // Tạo div tabs nếu chưa có
    if(!t && n && n.parentElement){
        t = document.createElement('div');
        t.id = 'eastSettingsTabs';
        t.className = 'flex gap-2 overflow-x-auto pb-2 mb-2 border-b border-dashed border-[#d7ccc8]';
        n.parentElement.insertBefore(t, n);
    }
    
    if(t) {
        // Render buttons
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
    
    // Fallback nếu data rỗng
    if(window.tempEastOptions.length === 0) {
        window.tempEastOptions = [{name: "Bài 1", ingredients: []}];
        window.currentEastOptionIndex = 0;
    }
    
    // Render nội dung bài thuốc hiện tại
    if(window.tempEastOptions[window.currentEastOptionIndex]){
        const currentOpt = window.tempEastOptions[window.currentEastOptionIndex];
        if(n) n.value = currentOpt.name || '';
        
        c.innerHTML = ''; // Clear cũ
        
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

window.saveCurrentTabToTemp = function() {
    if(window.currentEastOptionIndex === -1 || !window.tempEastOptions[window.currentEastOptionIndex]) return;
    
    // 1. Lưu tên bài thuốc
    const n = document.getElementById('diseaseEastName');
    if(n) window.tempEastOptions[window.currentEastOptionIndex].name = n.value.trim();
    
    // 2. Lưu danh sách vị thuốc từ DOM
    const ig = [];
    document.querySelectorAll('#eastIngredientsContainer .med-row-grid').forEach(r => {
        // Selector chính xác dựa trên class HTML
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

// --- 4. RENDER INPUT THUỐC (INGREDIENTS UI) ---

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

// --- 5. LƯU BỆNH (FINAL SAVE) ---

window.saveDisease = async function() { 
    const n = document.getElementById('diseaseName').value.trim();
    if(!n) return alert('Vui lòng nhập tên bệnh');
    
    const s = document.getElementById('diseaseSymptoms').value.trim();
    
    // 1. Lưu dữ liệu tab Đông Y hiện tại vào biến tạm
    window.saveCurrentTabToTemp();
    
    // 2. Thu thập dữ liệu Tây Y từ DOM
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
    
    // 3. Chuẩn hóa dữ liệu Đông Y
    // Lọc bỏ các bài thuốc rỗng tên (nếu cần), hoặc giữ nguyên
    let eastOpts = window.tempEastOptions;
    if(eastOpts.length === 0) eastOpts.push({name: "Bài thuốc", ingredients: []});
    
    // 4. Tạo object Bệnh
    const d = {
        name: n,
        sym: s,
        rxWest: w,
        eastOptions: eastOpts
    };
    
    // 5. Cập nhật vào config
    const i = document.getElementById('diseaseEditIndex').value;
    if(i !== ''){
        window.config.diseases[i] = d; // Cập nhật
    } else {
        window.config.diseases.push(d); // Thêm mới
    }
    
    // 6. Lưu xuống DB
    if(window.saveConfig) await window.saveConfig();
    
    // 7. Cập nhật giao diện Settings bên dưới
    window.renderDiseaseSettings();
    
    // 8. Đóng modal
    window.closeDiseaseModal();
};
