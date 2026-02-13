/**
 * FILE: templates/template-loader.js
 * CHỨC NĂNG: Tổng hợp giao diện & Logic Kéo thả (Final Perfected).
 * CẬP NHẬT: Tăng ngưỡng rung tay lên 15px để thao tác bấm dễ hơn, không bị tính nhầm là kéo.
 */

window.setupHubDraggable = function() {
    const btn = document.getElementById('hubMainBtn');       
    const container = document.getElementById('floatingHubContainer'); 
    
    if (!btn || !container) return;

    // Chống xung đột hệ thống (iOS/Android)
    const antiSystemStyles = {
        'touchAction': 'none',
        'webkitTouchCallout': 'none',
        'webkitUserSelect': 'none',
        'userSelect': 'none',
        'webkitTapHighlightColor': 'transparent'
    };
    Object.assign(btn.style, antiSystemStyles);
    Object.assign(container.style, antiSystemStyles);

    btn.oncontextmenu = (e) => { e.preventDefault(); return false; };
    btn.onclick = (e) => { e.preventDefault(); e.stopPropagation(); };

    // [TINH CHỈNH] Tăng lên 15px. Dưới 15px vẫn tính là Click.
    // Giúp người dùng bấm thoải mái hơn mà không sợ bị trượt nút đi.
    const MOVE_THRESHOLD = 15; 
    
    let startX = 0, startY = 0;
    let initialLeft = 0, initialTop = 0;
    let isDragging = false;

    btn.onpointerdown = function(e) {
        if (e.button !== 0) return;
        e.preventDefault(); e.stopPropagation();

        startX = e.clientX;
        startY = e.clientY;
        const rect = container.getBoundingClientRect();
        initialLeft = rect.left;
        initialTop = rect.top;

        isDragging = false; 

        btn.setPointerCapture(e.pointerId);
        container.style.transition = 'none';
        btn.style.transition = 'none';
        btn.style.transform = 'scale(0.95)'; // Hiệu ứng nhấn xuống

        btn.onpointermove = onMove;
        btn.onpointerup = onEnd;
        btn.onpointercancel = onEnd;
    };

    function onMove(e) {
        e.preventDefault(); e.stopPropagation();
        
        const dx = e.clientX - startX;
        const dy = e.clientY - startY;
        const dist = Math.sqrt(dx*dx + dy*dy);

        // Chưa vượt 15px -> Vẫn coi là đang Click
        if (!isDragging && dist < MOVE_THRESHOLD) return;

        // Vượt 15px -> Chính thức Kéo
        if (!isDragging) {
            isDragging = true;
            container.style.bottom = 'auto';
            container.style.right = 'auto';
            container.style.width = container.offsetWidth + 'px'; 
        }

        let newLeft = initialLeft + dx;
        let newTop = initialTop + dy;

        // Giới hạn màn hình
        const winW = window.innerWidth;
        const winH = window.innerHeight;
        // Trừ đi 64px (kích thước nút) để không bị kéo mất
        if (newLeft < 5) newLeft = 5;
        if (newTop < 5) newTop = 5;
        if (newLeft + 64 > winW) newLeft = winW - 64; 
        if (newTop + 64 > winH) newTop = winH - 64;

        container.style.left = newLeft + 'px';
        container.style.top = newTop + 'px';
    }

    function onEnd(e) {
        e.preventDefault(); e.stopPropagation();
        
        btn.releasePointerCapture(e.pointerId);
        btn.style.transform = ''; // Trả lại kích thước nút
        container.style.transition = ''; // Bật lại transition cho mượt

        if (!isDragging) {
            // NẾU LÀ CLICK -> MỞ MENU
            if (window.HubUI && window.HubUI.toggleMenu) {
                window.HubUI.toggleMenu();
            }
        }
        
        isDragging = false;
        btn.onpointermove = null;
        btn.onpointerup = null;
        btn.onpointercancel = null;
    }
};

// ... (Giữ nguyên phần còn lại của file: makeDraggable chung và loadAllModals) ...
// Copy phần dưới này vào nếu ông lỡ xóa:

window.makeDraggable = function(elmntId, onClickCallback) {
    const elmnt = document.getElementById(elmntId);
    if (!elmnt) return;
    elmnt.style.touchAction = 'none';
    
    let startX = 0, startY = 0;
    let initialLeft = 0, initialTop = 0;
    let isDragging = false;

    elmnt.onpointerdown = function(e) {
        if (e.button !== 0) return;
        e.preventDefault(); e.stopPropagation();
        startX = e.clientX; startY = e.clientY;
        const rect = elmnt.getBoundingClientRect();
        initialLeft = rect.left; initialTop = rect.top;
        isDragging = false;
        elmnt.setPointerCapture(e.pointerId);
        elmnt.style.transition = 'none';
        
        elmnt.onpointermove = function(ev) {
            ev.preventDefault();
            const dx = ev.clientX - startX;
            const dy = ev.clientY - startY;
            if (Math.sqrt(dx*dx + dy*dy) > 5) isDragging = true;
            if (isDragging) {
                elmnt.style.bottom = 'auto'; elmnt.style.right = 'auto';
                elmnt.style.left = (initialLeft + dx) + 'px';
                elmnt.style.top = (initialTop + dy) + 'px';
            }
        };

        elmnt.onpointerup = function(ev) {
            elmnt.releasePointerCapture(ev.pointerId);
            elmnt.onpointermove = null; elmnt.onpointerup = null;
            elmnt.style.transition = '';
            if (!isDragging && onClickCallback) onClickCallback();
        };
    };
};

window.loadAllModals = function() {
    const tplVisit = window.TPL_VISIT || "";
    const tplPatient = window.TPL_PATIENT || "";
    const tplSettings = window.TPL_SETTINGS || "";
    const tplInventory = (window.InventoryTpl && window.InventoryTpl.getTemplate) ? window.InventoryTpl.getTemplate() : ""; 
    const tplLookup = window.TPL_MODAL_LOOKUP || ""; 
    const tplClock = window.TPL_MODAL_CLOCK || "";   
    const tplReport = window.TPL_MODAL_REPORT || ""; 
    const tplHerb = window.TPL_MODAL_HERB || "";
    const tplSample = window.TPL_MODAL_SAMPLE || "";
    const tplHub = window.TPL_HUB_FIXED || window.TPL_HUB || ""; 
    const tplPrint = `<div id="printArea" class="hidden">...</div>`; // Rút gọn cho ngắn
    const tplBackupInput = `<input type="file" id="jsonFileInput" style="display:none" onchange="window.handleJSONFileSelect(event)">`;
    const tplBioClockWidget = `<div id="miniBioClockWidget" ...>...</div>`; // Rút gọn

    // Lưu ý: Đoạn HTML Print và Clock ông giữ nguyên như cũ nhé, tôi rút gọn ở đây để dễ nhìn logic chính
    // Logic chính là chèn fullTemplate
    
    // (Giả lập code cũ để ông copy paste cho dễ, ông cứ dùng file cũ cũng được, chỉ cần thay hàm setupHubDraggable thôi)
    // Tốt nhất là ông chỉ cần thay hàm setupHubDraggable ở trên cùng là được.
};

// ĐỂ AN TOÀN, TÔI SẼ VIẾT LẠI LOADALLMODALS ĐẦY ĐỦ DƯỚI ĐÂY:
window.loadAllModals = function() {
    const tplVisit = window.TPL_VISIT || "";
    const tplPatient = window.TPL_PATIENT || "";
    const tplSettings = window.TPL_SETTINGS || "";
    const tplInventory = (window.InventoryTpl && window.InventoryTpl.getTemplate) ? window.InventoryTpl.getTemplate() : ""; 
    const tplLookup = window.TPL_MODAL_LOOKUP || ""; 
    const tplClock = window.TPL_MODAL_CLOCK || "";   
    const tplReport = window.TPL_MODAL_REPORT || ""; 
    const tplHerb = window.TPL_MODAL_HERB || "";
    const tplSample = window.TPL_MODAL_SAMPLE || "";
    const tplHub = window.TPL_HUB_FIXED || window.TPL_HUB || ""; 

    const tplPrint = `
    <div id="printArea" class="hidden">
        <div id="printEast" class="print-section hidden bg-white p-8 max-w-[210mm] mx-auto font-serif text-[#000]"></div>
        <div id="printWest" class="print-section hidden bg-white p-8 max-w-[210mm] mx-auto font-sans text-[#000]"></div>
        <div id="printBoth" class="print-section hidden bg-white p-8 max-w-[210mm] mx-auto text-[#000]"></div>
        <div id="printInvoice" class="print-section hidden bg-white p-8 max-w-[80mm] mx-auto text-[#000] font-mono text-xs"></div>
    </div>`;

    const tplBackupInput = `<input type="file" id="jsonFileInput" style="display:none" onchange="window.handleJSONFileSelect(event)">`;

    const tplBioClockWidget = `
    <div id="miniBioClockWidget" title="Xem chi tiết Giờ tạng phủ" style="position: fixed; bottom: 20px; left: 20px; z-index: 8000; display: flex; flex-direction: column; align-items: center; cursor: pointer;">
        <div class="mini-clock-face" style="position: relative; width: 80px; height: 80px; margin-bottom: 5px;">
            <img src="images/clock_bg.png" style="width: 100%; height: 100%; border-radius: 50%; box-shadow: 0 4px 10px rgba(0,0,0,0.3); object-fit: cover;">
            <div style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; border-radius: 50%; border: 2px solid rgba(255, 255, 255, 0.6); animation: pulse-ring 2s infinite;"></div>
        </div>
        <div id="miniDigitalTime" style="background: rgba(62, 39, 35, 0.9); color: #fff; padding: 2px 8px; border-radius: 12px; font-family: monospace; font-weight: bold; font-size: 14px; border: 1px solid #d7ccc8;">--:--:--</div>
    </div>
    <style>@keyframes pulse-ring { 0% { transform: scale(1); opacity: 0.8; } 100% { transform: scale(1.3); opacity: 0; } }</style>`;

    const fullTemplate = tplVisit + tplPatient + tplSettings + tplInventory +
                         tplLookup + tplClock + tplReport + tplHerb + tplSample +
                         tplHub + tplPrint + tplBackupInput + tplBioClockWidget;
    
    document.body.insertAdjacentHTML('beforeend', fullTemplate);
    
    window.makeDraggable('miniBioClockWidget', function() { 
        if(window.openBioClock) window.openBioClock(); 
    });

    if(window.setupHubDraggable) {
        window.setupHubDraggable();
    }
};
