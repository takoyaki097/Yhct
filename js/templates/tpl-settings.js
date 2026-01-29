/**
 * FILE: js/templates/tpl-settings.js
 * CHỨC NĂNG: Cài đặt Giao diện, Chuyên môn và Hệ thống (Backup/Security)
 * CẬP NHẬT: Ẩn mật khẩu, Tích hợp Backup/Restore trực tiếp, Tối ưu Slider.
 */

window.TPL_SETTINGS = `
<div id="sModal" class="modal" style="z-index: 2000;">
    <div class="modal-box w-full max-w-lg h-[90vh] flex flex-col bg-[#fffcf7]">
        <div class="modal-header bg-[#f2ebe0] border-b border-[#d7ccc8] px-5 py-4 flex justify-between items-center">
            <h2 class="font-bold text-xl text-[#3e2723] uppercase tracking-widest">Thiết Lập</h2>
            <button onclick="window.closeModals()" class="text-2xl text-[#8d6e63] hover:text-red-600 transition-colors">&times;</button>
        </div>
        
        <div class="tabs px-5 py-3 bg-[#fff8e1] border-b border-[#ffe0b2]">
            <button class="tab-btn active" onclick="window.switchSettingsTab('tabUI', this)">Giao diện</button>
            <button class="tab-btn" onclick="window.switchSettingsTab('tabMed', this)">Chuyên môn</button>
            <button class="tab-btn" onclick="window.switchSettingsTab('tabBackup', this)">Hệ thống</button>
        </div>
        
        <div class="modal-body flex-1 overflow-y-auto p-5 custom-scrollbar">
            
            <div id="tabUI" class="settings-panel active space-y-6">
                <section>
                    <label class="song-label">Định danh phòng khám</label>
                    <div class="grid gap-3">
                        <input type="text" id="confTitle" class="song-input ipad-input-fix font-bold text-[#3e2723]" placeholder="Tên phòng khám">
                        <input type="text" id="confDoctor" class="song-input ipad-input-fix" placeholder="Bác sĩ phụ trách">
                    </div>
                </section>
                
                <section class="p-4 border border-[#d7ccc8] rounded-xl bg-white shadow-sm space-y-4">
                    <h3 class="font-bold text-[#5d4037] border-b border-dashed border-[#d7ccc8] pb-2 text-xs uppercase">Bảng màu Doanh thu</h3>
                    <div class="grid grid-cols-2 gap-4">
                        <div>
                            <label class="text-[10px] font-bold text-gray-400 uppercase mb-1 block">Màu chữ tiền</label>
                            <input type="color" id="profitTextColorInput" class="w-full h-10 rounded-lg cursor-pointer border-none p-1 bg-gray-50">
                        </div>
                        <div>
                            <label class="text-[10px] font-bold text-gray-400 uppercase mb-1 block">Màu nền hộp</label>
                            <input type="color" id="profitBgColorInput" class="w-full h-10 rounded-lg cursor-pointer border-none p-1 bg-gray-50">
                        </div>
                    </div>
                </section>

                <section class="p-4 border border-[#d7ccc8] rounded-xl bg-[#fdfbf7] shadow-sm space-y-5">
                    <h3 class="font-bold text-[#5d4037] border-b border-dashed border-[#d7ccc8] pb-2 text-xs uppercase">Hiệu ứng Header</h3>
                    
                    <div>
                        <div class="flex justify-between items-center mb-1">
                            <label class="text-xs font-bold text-[#5d4037]">Độ tối nền (Overlay)</label>
                            <span id="overlayValueDisplay" class="text-xs font-bold text-[#8d6e63]">0%</span>
                        </div>
                        <input type="range" id="headerOverlayInput" min="0" max="95" value="0" class="song-slider wood-range" oninput="window.updateHeaderOverlay(this.value)">
                    </div>

                    <div class="grid grid-cols-2 gap-6">
                        <div>
                            <div class="flex justify-between items-center mb-1">
                                <label class="text-[11px] font-bold text-[#5d4037]">Mờ Khung</label>
                                <span id="blurHeaderVal" class="text-[10px] font-bold">0px</span>
                            </div>
                            <input type="range" id="confBlurHeader" min="0" max="10" step="0.5" value="0" class="song-slider" oninput="document.getElementById('blurHeaderVal').innerText = this.value + 'px'">
                        </div>
                        <div>
                            <div class="flex justify-between items-center mb-1">
                                <label class="text-[11px] font-bold text-[#5d4037]">Mờ Thông Tin</label>
                                <span id="blurInfoVal" class="text-[10px] font-bold">0px</span>
                            </div>
                            <input type="range" id="confBlurInfo" min="0" max="10" step="0.5" value="0" class="song-slider" oninput="document.getElementById('blurInfoVal').innerText = this.value + 'px'">
                        </div>
                    </div>

                    <div class="pt-2 border-t border-dashed border-[#d7ccc8] mt-2">
                        <label class="song-label mb-2">Hình ảnh Header & QR</label>
                        <div class="grid grid-cols-2 gap-3">
                            <label class="cursor-pointer bg-white border border-[#d7ccc8] text-[#5d4037] py-2 rounded-lg text-[10px] font-bold text-center hover:bg-[#efebe9] shadow-sm">
                                🖼️ THAY NỀN
                                <input type="file" id="headerBgInput" accept="image/*" class="hidden" onchange="window.handleImageUpload(this, 'headerBgImage', null, true)">
                            </label>
                            <label class="cursor-pointer bg-white border border-[#d7ccc8] text-[#5d4037] py-2 rounded-lg text-[10px] font-bold text-center hover:bg-[#efebe9] shadow-sm">
                                🔳 THAY QR
                                <input type="file" id="qrInput" accept="image/*" class="hidden" onchange="window.handleImageUpload(this, 'qrCodeImage', 'previewQrSettings')">
                            </label>
                        </div>
                        <div class="flex justify-between mt-3 px-1">
                            <button onclick="window.clearHeaderImage()" class="text-[10px] text-red-500 font-bold hover:underline">Xóa nền</button>
                            <button onclick="window.clearQrImage()" class="text-[10px] text-red-500 font-bold hover:underline">Xóa QR</button>
                        </div>
                    </div>
                </section>
            </div>

            <div id="tabMed" class="settings-panel hidden space-y-6">
                <div>
                    <h3 class="font-bold text-[#3e2723] mb-2 uppercase border-b pb-1 text-[11px] tracking-widest">Danh mục Bệnh</h3>
                    <div id="diseaseList" class="space-y-2 mb-3 max-h-40 overflow-y-auto pr-1 bg-white border border-[#eee] rounded-lg p-2"></div>
                    <div class="flex gap-2">
                        <input type="text" id="newDiseaseName" placeholder="Tên bệnh mới..." class="song-input text-sm h-10 flex-1">
                        <button onclick="window.addNewDiseaseInline()" class="btn-primary py-1 px-4 text-xs h-10">Thêm</button>
                    </div>
                </div>

                <div class="bg-[#fffcf7] p-3 rounded border border-[#d7ccc8] shadow-sm">
                    <div class="flex justify-between items-center mb-2 border-b border-dashed border-[#d7ccc8] pb-1">
                        <h3 class="font-bold text-[#5d4037] uppercase text-[11px]">Bài thuốc mẫu</h3>
                        <button onclick="window.addNewSamplePrescriptionInline()" class="text-[10px] bg-[#5d4037] text-white px-3 py-1 rounded shadow-sm hover:bg-[#4e342e]">+ TẠO MỚI</button>
                    </div>
                    <div id="samplePrescriptionList" class="space-y-1 max-h-44 overflow-y-auto"></div>
                </div>

                <div>
                    <h3 class="font-bold text-[#3e2723] mb-2 uppercase border-b pb-1 text-[11px]">Thủ thuật & Vật tư</h3>
                    <div id="procList" class="space-y-2 mb-3 max-h-40 overflow-y-auto pr-1"></div>
                    <div class="flex gap-2 items-center">
                        <input type="text" id="newProcName" placeholder="Tên thủ thuật..." class="song-input text-sm flex-1 h-10">
                        <input type="number" id="newProcPrice" placeholder="Giá" class="song-input text-sm w-24 h-10 text-center">
                        <button onclick="window.addProc()" class="btn-primary py-1 px-4 text-xs h-10">Thêm</button>
                    </div>
                </div>
            </div>

            <div id="tabBackup" class="settings-panel hidden space-y-8">
                
                <div class="p-6 bg-white border border-red-100 rounded-2xl shadow-sm text-center">
                    <div class="w-14 h-14 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-3">
                        <span class="text-3xl">🛡️</span>
                    </div>
                    <h3 class="font-bold text-[#3e2723] uppercase text-xs tracking-widest mb-1">Mật khẩu Admin</h3>
                    <p class="text-[10px] text-gray-400 mb-5 italic">Dùng để bảo vệ quyền truy cập cài đặt</p>
                    
                    <input type="password" id="confPass" class="hidden" readonly>
                    <button onclick="window.openNativePasswordInput((p) => { document.getElementById('confPass').value = p; window.config.password = p; window.saveConfig(); alert('✅ Đã đổi mật khẩu thành công!'); })" 
                            class="w-full py-3 bg-white border-2 border-red-500 text-red-600 font-black rounded-xl hover:bg-red-50 transition-colors text-sm uppercase shadow-sm active:scale-95">
                        Thiết lập mật khẩu mới
                    </button>
                </div>

                <div class="space-y-4">
                    <h3 class="font-bold text-[#5d4037] uppercase text-[11px] tracking-widest text-center">Cơ sở dữ liệu</h3>
                    
                    <div class="grid grid-cols-2 gap-4">
                        <button onclick="window.exportToJSON()" 
                                class="flex flex-col items-center justify-center gap-3 p-6 bg-blue-50 border border-blue-200 rounded-2xl hover:bg-blue-100 transition-all shadow-sm group">
                            <span class="text-4xl group-hover:scale-110 transition-transform">💾</span>
                            <div class="text-center">
                                <span class="block font-black text-blue-800 text-xs uppercase">SAO LƯU</span>
                                <span class="block text-[9px] text-blue-500 font-bold">Tải file .JSON</span>
                            </div>
                        </button>

                        <label for="restoreFileInput" 
                               class="flex flex-col items-center justify-center gap-3 p-6 bg-green-50 border border-green-200 rounded-2xl cursor-pointer hover:bg-green-100 transition-all shadow-sm group">
                            <span class="text-4xl group-hover:scale-110 transition-transform">🔄</span>
                            <div class="text-center">
                                <span class="block font-black text-green-800 text-xs uppercase">KHÔI PHỤC</span>
                                <span class="block text-[9px] text-green-500 font-bold">Từ tệp sao lưu</span>
                            </div>
                            <input type="file" id="restoreFileInput" accept=".json" class="hidden" onchange="window.handleJSONFileSelect(event)">
                        </label>
                    </div>

                    <div class="pt-4 border-t border-dashed border-[#d7ccc8] mt-2">
                         <button onclick="window.exportToExcel()" class="w-full py-4 bg-[#f1f8e9] border border-[#c5e1a5] rounded-xl text-[#33691e] font-black text-xs hover:bg-[#dcedc8] flex items-center justify-center gap-2 shadow-sm uppercase tracking-wider">
                            <span>📊</span> Xuất Excel Bệnh Nhân
                        </button>
                        <p class="text-[9px] text-center text-red-400 font-bold italic mt-4 px-4">
                            * CHÚ Ý: Hành động "KHÔI PHỤC" sẽ xóa sạch dữ liệu hiện tại và thay bằng dữ liệu trong tệp.
                        </p>
                    </div>
                </div>
            </div>
        </div>
        
        <div class="modal-footer p-4 bg-[#f2ebe0] border-t border-[#d7ccc8] shadow-inner">
            <button onclick="window.saveSettings()" class="w-full py-4 btn-primary text-sm uppercase tracking-[4px] shadow-xl active:scale-95 transition-all font-black">
                Lưu Toàn Bộ Cấu Hình
            </button>
        </div>
    </div>
</div>

<div id="diseaseModal" class="modal" style="z-index: 2200;">
    <div class="modal-box w-full max-w-2xl h-[95vh] flex flex-col bg-[#fffcf7]">
        <div class="modal-header bg-[#f2ebe0] border-b border-[#d7ccc8]">
            <h2 id="diseaseModalTitle" class="font-bold text-xl text-[#3e2723]">Thêm bệnh mới</h2>
            <button onclick="window.closeDiseaseModal()" class="text-2xl cursor-pointer">&times;</button>
        </div>
        <div class="modal-body flex-1 overflow-y-auto p-5 space-y-5">
            <input type="hidden" id="diseaseEditIndex">
            <div class="space-y-3">
                <div>
                    <label class="song-label">Tên bệnh</label>
                    <input type="text" id="diseaseName" class="song-input font-bold text-[#5d4037]" placeholder="Tên bệnh...">
                </div>
                <div>
                    <label class="song-label">Triệu chứng & Ghi chú</label>
                    <textarea id="diseaseSymptoms" class="song-input h-24" placeholder="Mô tả bệnh lý..."></textarea>
                </div>
            </div>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div class="bg-white p-3 rounded-xl border border-[#d7ccc8] shadow-sm">
                    <h3 class="font-bold text-[#3e2723] mb-2 uppercase text-xs border-b pb-1">Đông Y</h3>
                    <div id="eastIngredientsContainer" class="space-y-1 mb-2 max-h-60 overflow-y-auto bg-gray-50 p-2 rounded"></div>
                    <button onclick="window.addEastIngredient()" class="btn-glass w-full py-2 text-xs text-[#5d4037]">+ Thêm vị</button>
                </div>
                <div class="bg-white p-3 rounded-xl border border-blue-200 shadow-sm">
                    <h3 class="font-bold text-blue-900 mb-2 uppercase text-xs border-b pb-1">Tây Y</h3>
                    <div id="westMedicinesContainer" class="space-y-1 mb-2 max-h-60 overflow-y-auto bg-blue-50 p-2 rounded"></div>
                    <button onclick="window.addWestMedicine()" class="btn-glass w-full py-2 text-xs text-blue-800">+ Thêm thuốc</button>
                </div>
            </div>
        </div>
        <div class="modal-footer border-t border-[#d7ccc8] p-3 flex justify-end gap-2 bg-[#f2ebe0]">
            <button onclick="window.closeDiseaseModal()" class="px-4 py-2 bg-gray-200 rounded text-gray-700 font-bold">Hủy</button>
            <button onclick="window.saveDisease()" class="px-6 py-2 btn-primary">Lưu</button>
        </div>
    </div>
</div>

<div id="samplePrescriptionModal" class="modal" style="z-index: 2300;">
    <div class="modal-box w-full max-w-md h-[80vh] flex flex-col bg-[#fffcf7]">
        <div class="modal-header bg-[#f2ebe0] border-b border-[#d7ccc8]">
            <h2 class="font-bold text-xl text-[#3e2723]">Soạn Bài Thuốc</h2>
            <button onclick="window.closeSamplePrescriptionModal()" class="text-2xl cursor-pointer">&times;</button>
        </div>
        <div class="modal-body flex-1 overflow-y-auto p-5 space-y-4">
            <input type="hidden" id="samplePrescriptionIndex">
            <div>
                <label class="song-label">Tên bài thuốc</label>
                <input type="text" id="samplePrescriptionName" class="song-input font-bold text-[#5d4037] text-center" placeholder="Nhập tên bài thuốc...">
            </div>
            <div class="bg-white p-4 rounded-xl border border-[#d7ccc8] shadow-sm flex flex-col h-full min-h-[300px]">
                <h3 class="font-bold text-[#3e2723] mb-3 uppercase text-[10px] border-b border-dashed border-[#d7ccc8] pb-2">Vị thuốc & Liều lượng (Gam)</h3>
                <div id="sampleIngredientsContainer" class="flex-1 space-y-2 overflow-y-auto mb-3"></div>
                <button onclick="window.addIngItem_Consistent()" class="btn-glass w-full py-3 text-xs text-[#5d4037] font-bold">+ THÊM DƯỢC LIỆU</button>
            </div>
        </div>
        <div class="modal-footer border-t border-[#d7ccc8] p-3 flex justify-end gap-2 bg-[#f2ebe0]">
            <button onclick="window.closeSamplePrescriptionModal()" class="px-4 py-2 bg-gray-200 rounded text-gray-700 font-bold">Hủy</button>
            <button onclick="window.saveSamplePrescription()" class="px-6 py-2 btn-primary">Lưu Bài Thuốc</button>
        </div>
    </div>
</div>
`;
// ============================================================
// 2. LOGIC JAVASCRIPT & XỬ LÝ (GIAO DIỆN & CRUD)
// ============================================================

// 1. Chuyển Tab Cài Đặt (Cập nhật logic ẩn/hiện)
window.switchSettingsTab = function(tabId, btn) {
    document.querySelectorAll('.settings-panel').forEach(p => {
        p.classList.add('hidden');
        p.classList.remove('active');
    });
    
    const target = document.getElementById(tabId);
    if(target) {
        target.classList.remove('hidden');
        target.classList.add('active');
    }
    
    document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
    if(btn) btn.classList.add('active');

    // Tự động cập nhật danh sách khi vào tab chuyên môn
    if (tabId === 'tabMed') {
        if(window.renderDiseaseList) window.renderDiseaseList();
        if(window.renderSamplePrescriptionSettingsList) window.renderSamplePrescriptionSettingsList();
        if(window.renderProcSettingsList) window.renderProcSettingsList();
    }
};

// 2. Render Danh sách bài thuốc mẫu
window.renderSamplePrescriptionSettingsList = function() {
    const listEl = document.getElementById('samplePrescriptionList');
    if (!listEl) return;

    let samples = window.config.samplePrescriptions || [];
    
    if (samples.length === 0) {
        listEl.innerHTML = `<div class="text-center text-gray-400 italic text-[10px] py-4">Chưa có bài thuốc mẫu.</div>`;
        return;
    }

    listEl.innerHTML = samples.map((s, idx) => `
        <div class="flex justify-between items-center p-2 mb-1 bg-white border border-gray-100 rounded-lg shadow-sm">
            <div class="min-w-0 flex-1">
                <div class="font-bold text-[#5d4037] text-xs truncate uppercase">${s.name}</div>
                <div class="text-[9px] text-gray-400 truncate">${s.ingredients.length} vị thuốc</div>
            </div>
            <div class="flex gap-1 shrink-0 ml-2">
                <button onclick="window.editSamplePrescription(${idx})" class="p-1.5 text-blue-600 hover:bg-blue-50 rounded">Sửa</button>
                <button onclick="window.deleteSamplePrescription(${idx})" class="p-1.5 text-red-600 hover:bg-red-50 rounded">Xóa</button>
            </div>
        </div>
    `).join('');
};

// 3. Logic Thêm/Sửa Bài thuốc
window.currentSampleIndex = -1; 

window.addNewSamplePrescriptionInline = function() {
    window.currentSampleIndex = -1;
    document.getElementById('samplePrescriptionName').value = "";
    document.getElementById('sampleIngredientsContainer').innerHTML = "";
    document.getElementById('samplePrescriptionModal').classList.add('active');
    window.addIngItem_Consistent(); 
};

window.editSamplePrescription = function(idx) {
    window.currentSampleIndex = idx;
    const samples = window.config.samplePrescriptions || [];
    const sample = samples[idx];
    if(!sample) return;

    document.getElementById('samplePrescriptionName').value = sample.name;
    const container = document.getElementById('sampleIngredientsContainer');
    container.innerHTML = ""; 

    sample.ingredients.forEach(ing => {
        window.addIngItem_Consistent(ing.name, ing.qty);
    });

    document.getElementById('samplePrescriptionModal').classList.add('active');
};

// Thêm dòng vị thuốc vào modal soạn thảo
window.addIngItem_Consistent = function(name = "", qty = "") {
    const container = document.getElementById('sampleIngredientsContainer');
    const div = document.createElement('div');
    
    div.className = "flex items-center gap-2 mb-2 p-2 bg-[#fdfbf7] rounded-xl border border-gray-100";
    div.innerHTML = `
        <input type="text" value="${name}" class="flex-1 text-xs font-bold text-[#3e2723] bg-transparent outline-none border-b border-dashed border-gray-200" placeholder="Tên vị...">
        <div class="flex items-center gap-1 w-16">
            <input type="number" value="${qty}" class="w-full text-center bg-white rounded border border-gray-100 text-xs font-bold py-1" placeholder="0">
            <span class="text-[9px] text-gray-400">g</span>
        </div>
        <button onclick="this.parentElement.remove()" class="text-gray-300 hover:text-red-500 text-lg">&times;</button>
    `;
    
    container.appendChild(div);
    if(name === "") div.querySelector('input[type="text"]').focus();
};

window.closeSamplePrescriptionModal = function() {
    document.getElementById('samplePrescriptionModal').classList.remove('active');
};

window.saveSamplePrescription = function() {
    const name = document.getElementById('samplePrescriptionName').value.trim();
    if (!name) { alert("Vui lòng nhập tên bài thuốc!"); return; }

    const rows = document.getElementById('sampleIngredientsContainer').children;
    const ingredients = [];
    
    for(let row of rows) {
        const n = row.querySelector('input[type="text"]').value.trim();
        const q = parseFloat(row.querySelector('input[type="number"]').value) || 0;
        if (n) ingredients.push({ name: n, qty: q });
    }

    if (ingredients.length === 0) { alert("Bài thuốc phải có ít nhất 1 vị!"); return; }

    if (!window.config.samplePrescriptions) window.config.samplePrescriptions = [];

    const newSample = { name, ingredients };
    if (window.currentSampleIndex === -1) {
        window.config.samplePrescriptions.push(newSample);
    } else {
        window.config.samplePrescriptions[window.currentSampleIndex] = newSample;
    }

    window.saveConfig(); 
    window.renderSamplePrescriptionSettingsList();
    window.closeSamplePrescriptionModal();
    if(window.showToast) window.showToast("✅ Đã lưu bài thuốc mẫu!", "success");
};

window.deleteSamplePrescription = function(idx) {
    if(!confirm("Xóa bài thuốc này?")) return;
    window.config.samplePrescriptions.splice(idx, 1);
    window.saveConfig();
    window.renderSamplePrescriptionSettingsList();
};
