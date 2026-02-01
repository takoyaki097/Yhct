/**
 * FILE: tpl-settings/index.js
 * CHỨC NĂNG: Tổng hợp giao diện Cài đặt từ các file con.
 * ĐẢM BẢO: File này phải được load SAU các file tab-*.js và sub-modals.js
 */

const mainSettingsModal = `
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
            ${window.TPL_SETTING_TAB_UI || ''}
            ${window.TPL_SETTING_TAB_MED || ''}
            ${window.TPL_SETTING_TAB_SYSTEM || ''}
        </div>
        
        <div class="modal-footer p-4 bg-[#f2ebe0] border-t border-[#d7ccc8] shadow-inner">
            <button onclick="window.saveSettings()" class="w-full py-4 btn-primary text-sm uppercase tracking-[4px] shadow-xl active:scale-95 transition-all font-black">
                Lưu Toàn Bộ Cấu Hình
            </button>
        </div>
    </div>
</div>
`;

// Gán vào biến toàn cục để template-loader.js sử dụng
window.TPL_SETTINGS = mainSettingsModal + (window.TPL_SETTING_SUBMODALS || '');
