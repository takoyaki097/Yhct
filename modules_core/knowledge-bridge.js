/**
 * FILE: modules_core/knowledge-bridge.js
 * CHỨC NĂNG: Cầu nối Logic - Quản lý tương tác Thêm/Xóa Thuốc & Huyệt.
 * CẬP NHẬT: 
 * - Tự động chèn nút Thêm/Xóa vào chân trang chi tiết (Sticky Footer).
 * - Xử lý logic Toggle (Có rồi thì Xóa, Chưa có thì Thêm).
 * - Đồng bộ trạng thái hiển thị trên toàn hệ thống (AI Box, List, Detail).
 */

// ============================================================
// 1. MONKEY PATCHING: TỰ ĐỘNG CHÈN NÚT VÀO KNOWLEDGE UI
// ============================================================

// Chúng ta can thiệp vào hàm renderDetail của KnowledgeUI để chèn nút bấm
if (window.KnowledgeUI && !window.KnowledgeUI._originalRenderDetail) {
    // Lưu lại hàm gốc
    window.KnowledgeUI._originalRenderDetail = window.KnowledgeUI.renderDetail;

    // Ghi đè hàm mới
    window.KnowledgeUI.renderDetail = function(id) {
        // 1. Gọi hàm gốc để hiển thị nội dung (Ảnh, Thông tin thuốc, AI Tí Ngọ...)
        this._originalRenderDetail.call(this, id);

        // 2. Chèn thanh công cụ (Toolbar) vào cuối panel chi tiết
        // Chỉ hiện khi đang ở chế độ xem (View), không hiện khi đang sửa (Edit)
        if (this.state.mode === 'view') {
            const container = document.getElementById('kbRightPanel');
            const item = this.getItem(id);
            if (!item) return;

            // --- KIỂM TRA TRẠNG THÁI: Đã có trong đơn thuốc chưa? ---
            let isAdded = false;
            if (this.state.type === 'herb') {
                isAdded = window.currentVisit.rxEast.some(x => x.name.toLowerCase() === item.name.toLowerCase());
            } else if (this.state.type === 'west') {
                isAdded = window.currentVisit.rxWest.some(x => x.name.toLowerCase() === item.name.toLowerCase());
            } else if (this.state.type === 'acu') {
                isAdded = window.currentVisit.acupoints.some(x => x.id === item.id);
            }

            // --- CẤU HÌNH NÚT BẤM ---
            // Nếu đã có -> Màu Đỏ (Xóa). Nếu chưa -> Màu Xanh/Nâu (Thêm)
            const btnColor = isAdded ? 'bg-red-600 hover:bg-red-700 border-red-700' : 'bg-[#5d4037] hover:bg-[#4e342e] border-[#3e2723]';
            const btnIcon = isAdded ? '🗑️' : '✅';
            const btnLabel = isAdded ? 'XÓA KHỎI ĐƠN' : 'THÊM VÀO ĐƠN';
            
            // Hàm gọi khi bấm nút
            const action = `window.KnowledgeBridge.toggleItem('${item.id || item.name}', '${this.state.type}')`;

            // HTML Toolbar dính dưới đáy (Sticky)
            const toolbarHtml = `
            <div class="sticky bottom-0 bg-white/95 backdrop-blur border-t border-[#d7ccc8] p-4 mt-6 -mx-6 -mb-8 shadow-[0_-4px_20px_rgba(0,0,0,0.05)] flex justify-end gap-3 z-20 transition-all duration-300">
                <button onclick="window.KnowledgeUI.close()" class="px-5 py-3 rounded-xl font-bold text-gray-500 hover:bg-gray-100 border border-transparent hover:border-gray-200 transition-colors text-xs uppercase">
                    Đóng
                </button>
                <button onclick="${action}" class="px-6 py-3 text-white font-bold rounded-xl shadow-lg active:scale-95 transition-all flex items-center gap-2 border text-xs uppercase tracking-wide ${btnColor}">
                    <span class="text-base">${btnIcon}</span> ${btnLabel}
                </button>
            </div>`;
            
            // Tìm vị trí chèn (thường là div có class p-6 hoặc p-8)
            const detailContent = container.querySelector('.custom-scrollbar > div'); // Lấy div con đầu tiên
            if (detailContent) {
                detailContent.insertAdjacentHTML('beforeend', toolbarHtml);
            }
        }
    };
}

// ============================================================
// 2. LOGIC XỬ LÝ TRUNG TÂM (CONTROLLER)
// ============================================================

window.KnowledgeBridge = {
    
    // Hàm xử lý chính: Thêm hoặc Xóa item
    toggleItem: function(idOrName, type) {
        // Kiểm tra an toàn: Phải mở phiếu khám trước
        if (!document.getElementById('vModal').classList.contains('active')) {
            alert("Vui lòng mở phiếu khám (Nút 'KHÁM') trước khi chọn thuốc/huyệt!"); 
            return;
        }

        const ui = window.KnowledgeUI;
        // 1. Tìm item object (Ưu tiên ID, fallback sang Tên)
        let item = ui ? ui.getItem(idOrName) : null;
        
        // Nếu không tìm thấy trong DB (trường hợp AI gợi ý tên thuốc chưa có trong kho), tìm trong danh sách tổng
        if (!item && ui && ui.getAllItems) {
            const all = ui.getAllItems();
            item = all.find(i => i.name.toLowerCase() === idOrName.toLowerCase() || i.id === idOrName);
        }
        
        // Fallback cuối cùng: Tạo item ảo để vẫn thêm được vào đơn
        if (!item) item = { id: idOrName, name: idOrName };

        let msg = "";
        let isRemoved = false;

        // --- A. XỬ LÝ ĐÔNG DƯỢC (HERB) ---
        if (type === 'herb') {
            const list = window.currentVisit.rxEast;
            const idx = list.findIndex(x => x.name.toLowerCase() === item.name.toLowerCase());
            
            if (idx > -1) {
                // ĐÃ CÓ -> XÓA
                list.splice(idx, 1);
                msg = `Đã xóa vị: ${item.name}`; isRemoved = true;
            } else {
                // CHƯA CÓ -> THÊM
                let qty = 10; // Mặc định 10g
                // Thông minh: Thử đọc số gam từ trường 'Liều lượng' (VD: "Dùng 8-12g")
                if (item.info && item.info.lieu_luong) {
                    const match = item.info.lieu_luong.match(/\d+/g);
                    if (match && match.length > 0) {
                        qty = parseInt(match[match.length-1]); // Lấy số lớn nhất (max dose)
                    }
                }
                list.push({ name: item.name, qty: qty, price: 0, days: 1, usage: "" });
                msg = `Đã thêm: ${item.name}`;
            }
            // Render lại danh sách thuốc bên ngoài
            if (window.renderMedList) window.renderMedList('east');
        }

        // --- B. XỬ LÝ TÂY DƯỢC (WEST) ---
        else if (type === 'west') {
            const list = window.currentVisit.rxWest;
            const idx = list.findIndex(x => x.name.toLowerCase() === item.name.toLowerCase());
            
            if (idx > -1) {
                list.splice(idx, 1);
                msg = `Đã xóa thuốc: ${item.name}`; isRemoved = true;
            } else {
                let usageText = "";
                if (item.info && item.info.duong_dung) usageText = item.info.duong_dung;
                
                list.push({
                    name: item.name, qty: 10, // Mặc định 10 viên
                    usage: usageText,
                    doseS: 0, doseT: 0, doseC: 0, doseO: 0, days: 1, price: 0
                });
                msg = `Đã thêm: ${item.name}`;
            }
            if (window.renderMedList) window.renderMedList('west');
        }

        // --- C. XỬ LÝ HUYỆT (POINT/ACU) ---
        else if (type === 'point' || type === 'acu') {
            if (!window.currentVisit.acupoints) window.currentVisit.acupoints = [];
            const list = window.currentVisit.acupoints;
            const idx = list.findIndex(x => x.id === item.id);
            
            if (idx > -1) {
                list.splice(idx, 1);
                msg = `Đã xóa huyệt: ${item.name}`; isRemoved = true;
            } else {
                list.push({ id: item.id, name: item.name });
                msg = `Đã thêm huyệt: ${item.name}`;
            }
            // Render lại danh sách huyệt bên ngoài (nếu có)
            if (window.renderSelectedAcupoints) window.renderSelectedAcupoints();
        }

        // --- D. CẬP NHẬT HỆ THỐNG & UI ---
        
        // 1. Tính lại tổng tiền
        if (window.calcTotal) window.calcTotal();
        
        // 2. Hiện thông báo Toast
        if (window.showToast) window.showToast(isRemoved ? `🗑️ ${msg}` : `✅ ${msg}`, isRemoved ? "info" : "success");

        // 3. [QUAN TRỌNG] Cập nhật giao diện KnowledgeUI ngay lập tức
        // Để nút đổi màu và chữ (Thêm -> Xóa)
        if (ui && document.getElementById('kbModal').classList.contains('active')) {
            if (ui.state.selectedId === item.id || ui.state.selectedId === idOrName) {
                // Nếu đang xem đúng item đó -> Render lại panel phải
                ui.renderRightPanel(ui.state.selectedId);
            } else {
                // Nếu đang xem cái khác hoặc ở list -> Render lại sidebar (dấu check)
                ui.renderSidebar();
            }
        }
        
        // 4. [QUAN TRỌNG] Cập nhật bảng AI ở màn hình chính (Tab Khám)
        // Để các nút gợi ý cũng đổi màu theo
        if (window.refreshAiSuggestion) window.refreshAiSuggestion(false);
    }
};

// ============================================================
// 3. OVERRIDE CÁC HÀM MỞ MODAL CŨ (CHUYỂN HƯỚNG SANG MỚI)
// ============================================================

window.openHerbModal = () => { 
    if (window.KnowledgeUI) window.KnowledgeUI.open('herb'); 
    else alert("Đang tải dữ liệu..."); 
};

window.openWestLookupModal = () => { 
    if (window.KnowledgeUI) window.KnowledgeUI.open('west'); 
    else alert("Đang tải dữ liệu..."); 
};

window.openAcupointModal = () => { 
    if (window.KnowledgeUI) window.KnowledgeUI.open('acu'); 
    else alert("Đang tải dữ liệu..."); 
};
