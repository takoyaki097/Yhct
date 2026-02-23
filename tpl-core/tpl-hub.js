/**
 * FILE: templates/tpl-hub.js
 * CHỨC NĂNG: Giao diện Trung tâm Thông báo & Nút Hội tụ (Action Hub).
 * CẬP NHẬT: 
 * - Tích hợp nút mở Phòng Lab Biện Chứng (Clinical Lab).
 * - Tăng kích thước nút (w-16).
 * - Giảm opacity của số xuống 0.9.
 */

window.TPL_HUB_FIXED = `
<div id="floatingHubContainer" style="touch-action: none;" class="fixed bottom-5 right-5 z-[9000] flex flex-col-reverse items-end gap-3 pointer-events-none">
    
    <button id="hubMainBtn" 
            class="w-16 h-16 rounded-full btn-water-droplet flex items-center justify-center transition-all duration-300 pointer-events-auto relative group">
        
        <span id="hubMainLabel" style="pointer-events: none !important; opacity: 0.9;" 
              class="text-2xl font-black text-[#3e2723] transition-all duration-300 select-none scale-100">
            0
        </span>
        
        <div style="pointer-events: none !important;" class="absolute inset-0 rounded-full border-2 border-white/40 animate-ping opacity-75 z-0"></div>
        <span id="hubInnerBadge" class="hidden absolute top-0 right-0 w-3 h-3 bg-red-500 border-2 border-white rounded-full"></span>
    </button>

    <div id="hubActions" class="flex flex-col items-end gap-3 transition-all duration-300 opacity-0 translate-y-10 pointer-events-none origin-bottom scale-90">
        
        <div class="flex items-center gap-3 group/item">
            <span class="bg-white/90 backdrop-blur text-[#5d4037] text-xs font-bold px-3 py-1.5 rounded-lg shadow-sm opacity-0 group-hover/item:opacity-100 transition-opacity pointer-events-none border border-[#d7ccc8] translate-x-2 group-hover/item:translate-x-0">Phòng Lab Biện Chứng</span>
            <button onclick="window.LabUI.open()" class="w-12 h-12 rounded-full btn-water-droplet flex items-center justify-center text-xl hover:scale-110 transition-transform pointer-events-auto shadow-lg border border-white/60">
                🔬
            </button>
        </div>

        <div class="flex items-center gap-3 group/item">
            <span class="bg-white/90 backdrop-blur text-[#5d4037] text-xs font-bold px-3 py-1.5 rounded-lg shadow-sm opacity-0 group-hover/item:opacity-100 transition-opacity pointer-events-none border border-[#d7ccc8] translate-x-2 group-hover/item:translate-x-0">Ghi chú nhanh</span>
            <button onclick="window.HubUI.openQuickNote()" class="w-12 h-12 rounded-full btn-water-droplet flex items-center justify-center text-xl hover:scale-110 transition-transform pointer-events-auto shadow-lg border border-white/60">
                📝
            </button>
        </div>

        <div class="flex items-center gap-3 group/item">
            <span class="bg-white/90 backdrop-blur text-[#5d4037] text-xs font-bold px-3 py-1.5 rounded-lg shadow-sm opacity-0 group-hover/item:opacity-100 transition-opacity pointer-events-none border border-[#d7ccc8] translate-x-2 group-hover/item:translate-x-0">Toàn màn hình</span>
            <button onclick="window.toggleFullScreen()" class="w-12 h-12 rounded-full btn-water-droplet flex items-center justify-center text-xl hover:scale-110 transition-transform pointer-events-auto shadow-lg border border-white/60">
                🔲
            </button>
        </div>

        <div class="flex items-center gap-3 group/item">
            <span class="bg-white/90 backdrop-blur text-[#5d4037] text-xs font-bold px-3 py-1.5 rounded-lg shadow-sm opacity-0 group-hover/item:opacity-100 transition-opacity pointer-events-none border border-[#d7ccc8] translate-x-2 group-hover/item:translate-x-0">Thông báo & Việc cần làm</span>
            <button onclick="window.HubUI.openNotifications()" class="w-12 h-12 rounded-full btn-water-droplet flex items-center justify-center text-xl hover:scale-110 transition-transform pointer-events-auto shadow-lg border border-white/60 relative">
                🔔
            </button>
        </div>

    </div>
</div>

<div id="notificationPanel" class="fixed inset-0 z-[9001] flex items-center justify-center bg-black/60 backdrop-blur-[2px] opacity-0 invisible transition-all duration-300">
    <div class="bg-[#fdfbf7] w-[95%] max-w-md h-[80vh] rounded-2xl shadow-2xl flex flex-col border border-[#d7ccc8] transform translate-y-10 transition-transform duration-300" id="notifBox">
        <div class="p-4 border-b border-dashed border-[#d7ccc8] flex justify-between items-center shrink-0">
            <h3 class="font-bold text-[#3e2723] uppercase tracking-widest flex items-center gap-2">
                <span class="text-xl">🔔</span> Trung tâm thông báo
            </h3>
            <button onclick="window.HubUI.closeAll()" class="text-2xl text-gray-400 hover:text-red-500 transition-colors">&times;</button>
        </div>

        <div class="flex gap-2 p-3 bg-gray-50 border-b border-gray-200 shrink-0">
            <button id="tab-notif-appoint" onclick="window.HubUI.switchTab('appoint')" class="flex-1 py-2 rounded-lg text-xs font-bold text-[#5d4037] border border-transparent transition-all relative">
                Khám bệnh
                <span class="badge-dot w-2 h-2 rounded-full bg-red-500 absolute top-1 right-1 opacity-0 transition-opacity"></span>
            </button>
            <button id="tab-notif-debt" onclick="window.HubUI.switchTab('debt')" class="flex-1 py-2 rounded-lg text-xs font-bold text-[#5d4037] border border-transparent transition-all relative">
                Công nợ
                <span class="badge-dot w-2 h-2 rounded-full bg-red-500 absolute top-1 right-1 opacity-0 transition-opacity"></span>
            </button>
            <button id="tab-notif-inventory" onclick="window.HubUI.switchTab('inventory')" class="flex-1 py-2 rounded-lg text-xs font-bold text-[#5d4037] border border-transparent transition-all relative">
                Kho thuốc
                <span class="badge-dot w-2 h-2 rounded-full bg-red-500 absolute top-1 right-1 opacity-0 transition-opacity"></span>
            </button>
        </div>

        <div class="flex-1 p-3 overflow-y-auto custom-scrollbar bg-[#f9f9f9]">
            <div id="notif-empty" class="h-full flex flex-col items-center justify-center text-gray-400 opacity-60 hidden">
                <span class="text-5xl mb-2">📭</span>
                <span class="text-xs font-bold uppercase tracking-wider">Không có thông báo</span>
            </div>
            <div id="notif-list-appoint" class="flex flex-col gap-2"></div>
            <div id="notif-list-debt" class="flex flex-col gap-2 hidden"></div>
            <div id="notif-list-inventory" class="flex flex-col gap-2 hidden"></div>
        </div>

        <div class="p-3 bg-white border-t border-gray-200 shrink-0"><button onclick="window.NotificationEngine.refreshAll()" class="w-full py-2 bg-[#efebe9] text-[#5d4037] rounded-lg text-xs font-bold hover:bg-[#d7ccc8] transition-colors border border-[#d7ccc8]">Làm mới dữ liệu</button></div>
    </div>
</div>

<div id="quickNoteModal" class="fixed inset-0 z-[9002] flex items-center justify-center bg-black/60 backdrop-blur-[2px] opacity-0 invisible transition-all duration-300">
    <div class="bg-[#fdfbf7] w-[90%] max-w-sm rounded-2xl shadow-2xl p-4 border border-[#d7ccc8] transform scale-95 transition-transform duration-300" id="quickNoteBox">
        <div class="flex justify-between items-center mb-3 border-b border-dashed border-[#d7ccc8] pb-2"><h3 class="font-bold text-[#3e2723] uppercase text-xs tracking-wider">📝 Ghi Chú Nhanh</h3><div class="flex gap-2"><button onclick="window.HubUI.clearNote()" class="text-[10px] text-red-500 font-bold hover:bg-red-50 px-2 py-1 rounded transition-colors">Xóa</button><button onclick="window.HubUI.closeQuickNote()" class="text-lg text-gray-400 hover:text-[#5d4037] transition-colors">&times;</button></div></div>
        <textarea id="quickNoteArea" class="w-full h-40 bg-[#fff] border border-[#d7ccc8] rounded-xl p-3 text-sm text-[#3e2723] outline-none focus:border-[#5d4037] resize-none leading-relaxed placeholder-gray-300 shadow-inner" placeholder="Nhập nội dung ghi chú nhanh tại đây..."></textarea>
        <div class="mt-3 flex gap-2"><button onclick="window.HubUI.closeQuickNote()" class="flex-1 py-2 rounded-xl text-gray-500 font-bold bg-white border border-gray-200 hover:bg-gray-50 text-xs uppercase">Hủy</button><button onclick="window.HubUI.saveNote()" class="flex-1 py-2 rounded-xl bg-[#5d4037] text-white font-bold hover:bg-[#4e342e] shadow-md text-xs uppercase">Lưu Ghi Chú</button></div>
    </div>
</div>
`;
