/**
 * FILE: templates/template-loader.js
 * CHỨC NĂNG: Tổng hợp giao diện Modal + Nút Full Screen + Widget Đồng hồ.
 * THƯ MỤC: templates/
 * CẬP NHẬT: Thêm tpl-modal-sample.js vào danh sách tải.
 */

window.loadAllModals = function() {
    // 1. Lấy nội dung các template con (Đã tách file)
    const tplVisit = window.TPL_VISIT || "";
    const tplPatient = window.TPL_PATIENT || "";
    
    // Template settings (được gộp từ tpl-settings/index.js)
    const tplSettings = window.TPL_SETTINGS || "";
    
    // Inventory (Kiểm tra nếu module Inventory có hàm getTemplate - dùng cho phiên bản cũ hoặc custom)
    // Lưu ý: Nếu InventoryTpl.open() render trực tiếp thì biến này có thể rỗng, không ảnh hưởng.
    const tplInventory = (window.InventoryTpl && window.InventoryTpl.getTemplate) ? window.InventoryTpl.getTemplate() : ""; 
    
    // Các template tiện ích khác
    const tplLookup = window.TPL_MODAL_LOOKUP || ""; 
    const tplClock = window.TPL_MODAL_CLOCK || "";   
    const tplReport = window.TPL_MODAL_REPORT || ""; 
    const tplHerb = window.TPL_MODAL_HERB || "";

    // [MỚI] Template Bài thuốc mẫu giao diện Split View
    const tplSample = window.TPL_MODAL_SAMPLE || "";

    // 2. Template in ấn (Giữ nguyên)
    const tplPrint = `
    <div id="printArea" class="hidden">
        <div id="printEast" class="print-section hidden bg-white p-8 max-w-[210mm] mx-auto font-serif text-[#000]"></div>
        <div id="printWest" class="print-section hidden bg-white p-8 max-w-[210mm] mx-auto font-sans text-[#000]"></div>
        <div id="printBoth" class="print-section hidden bg-white p-8 max-w-[210mm] mx-auto text-[#000]"></div>
        <div id="printInvoice" class="print-section hidden bg-white p-8 max-w-[80mm] mx-auto text-[#000] font-mono text-xs"></div>
    </div>`;

    // 3. Input backup ẩn
    const tplBackupInput = `<input type="file" id="jsonFileInput" style="display:none" onchange="window.handleJSONFileSelect(event)">`;

    // 4. Nút Full Screen
    const tplFullScreenBtn = `
    <button id="floatingFullScreenBtn" title="Toàn màn hình" style="position: fixed; bottom: 20px; right: 20px; z-index: 9000; width: 40px; height: 40px; border-radius: 50%; background: #3e2723; color: #fff; border: 2px solid #fff; box-shadow: 0 4px 15px rgba(0,0,0,0.3); font-size: 20px; display: flex; align-items: center; justify-content: center; cursor: pointer;">⛶</button>`;

    // 5. Widget Đồng hồ Mini
    const tplBioClockWidget = `
    <div id="miniBioClockWidget" title="Xem chi tiết Giờ tạng phủ" style="position: fixed; bottom: 20px; left: 20px; z-index: 9000; display: flex; flex-direction: column; align-items: center; cursor: pointer;">
        <div class="mini-clock-face" style="position: relative; width: 80px; height: 80px; margin-bottom: 5px;">
            <img src="images/clock_bg.png" style="width: 100%; height: 100%; border-radius: 50%; box-shadow: 0 4px 10px rgba(0,0,0,0.3); object-fit: cover;">
            <div style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; border-radius: 50%; border: 2px solid rgba(255, 255, 255, 0.6); animation: pulse-ring 2s infinite;"></div>
        </div>
        <div id="miniDigitalTime" style="background: rgba(62, 39, 35, 0.9); color: #fff; padding: 2px 8px; border-radius: 12px; font-family: monospace; font-weight: bold; font-size: 14px; border: 1px solid #d7ccc8;">--:--:--</div>
    </div>
    <style>@keyframes pulse-ring { 0% { transform: scale(1); opacity: 0.8; } 100% { transform: scale(1.3); opacity: 0; } }</style>`;

    // 6. GỘP VÀ CHÈN VÀO BODY
    // [QUAN TRỌNG] Đã thêm tplSample vào chuỗi kết hợp
    const fullTemplate = tplVisit + tplPatient + tplSettings + tplInventory +
                         tplLookup + tplClock + tplReport + tplHerb + tplSample +
                         tplPrint + tplBackupInput + tplFullScreenBtn + tplBioClockWidget;
    
    document.body.insertAdjacentHTML('beforeend', fullTemplate);
    
    // Kích hoạt tính năng kéo thả (nếu có module ui-helper)
    if(window.makeDraggable) {
        window.makeDraggable('miniBioClockWidget', function() { if(window.openBioClock) window.openBioClock(); });
        window.makeDraggable('floatingFullScreenBtn', function() { if(window.toggleFullScreen) window.toggleFullScreen(); });
    } else {
        // Fallback nếu chưa có ui-helper
        const clockWidget = document.getElementById('miniBioClockWidget');
        if(clockWidget) clockWidget.onclick = window.openBioClock;
        
        const fsBtn = document.getElementById('floatingFullScreenBtn');
        if(fsBtn) fsBtn.onclick = window.toggleFullScreen;
    }
};
