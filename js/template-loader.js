/**
 * FILE: js/template-loader.js
 * CHỨC NĂNG: Tổng hợp giao diện Modal + Nút Full Screen
 */

window.loadAllModals = function() {
    const tplVisit = window.TPL_VISIT || "";
    const tplPatient = window.TPL_PATIENT || "";
    const tplSettings = window.TPL_SETTINGS || "";
    const tplResources = window.TPL_RESOURCES || "";

    const tplPrint = `
    <div id="printArea" class="hidden">
        <div id="printEast" class="print-section hidden bg-white p-8 max-w-[210mm] mx-auto font-serif text-[#000]"></div>
        <div id="printWest" class="print-section hidden bg-white p-8 max-w-[210mm] mx-auto font-sans text-[#000]"></div>
        <div id="printBoth" class="print-section hidden bg-white p-8 max-w-[210mm] mx-auto text-[#000]"></div>
        <div id="printInvoice" class="print-section hidden bg-white p-8 max-w-[80mm] mx-auto text-[#000] font-mono text-xs"></div>
    </div>
    `;

    const tplBackupInput = `
    <input type="file" id="jsonFileInput" style="display:none" onchange="window.handleJSONFileSelect(event)">
    `;

    // --- NÚT BẤM FULL SCREEN MỚI (Nổi góc phải dưới) ---
    const tplFullScreenBtn = `
    <button onclick="window.toggleFullScreen()" 
            style="position: fixed; bottom: 20px; right: 20px; z-index: 9000; 
                   width: 50px; height: 50px; border-radius: 50%; 
                   background: #3e2723; color: #fff; border: 2px solid #fff;
                   box-shadow: 0 4px 15px rgba(0,0,0,0.3); font-size: 24px;
                   display: flex; align-items: center; justify-content: center; cursor: pointer;">
        ⛶
    </button>
    `;

    // Tổng hợp lại
    const fullTemplate = tplVisit + tplPatient + tplSettings + tplResources + tplPrint + tplBackupInput + tplFullScreenBtn;

    document.body.insertAdjacentHTML('beforeend', fullTemplate);
    console.log("✅ Đã nạp giao diện và nút Full Screen!");
};
