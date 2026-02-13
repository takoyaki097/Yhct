/**
 * FILE: templates/tpl-hub.js
 * CHỨC NĂNG: Giao diện Trung tâm Thông báo & Nút Hội tụ (Action Hub).
 * CẬP NHẬT: 
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
    </button>

    <div id="hubActions" class="flex flex-col items-end gap-3 transition-all duration-300 opacity-0 translate-y-10 pointer-events-none origin-bottom scale-90">
        
        <div class="flex items-center gap-3 group pointer-events-auto">
            <span class="bg-black/70 text-white text-[10px] font-bold px-2 py-1 rounded backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity translate-x-2 group-hover:translate-x-0 shadow-sm pointer-events-none select-none">Ghi chú</span>
            <button onclick="window.HubUI.openQuickNote()" class="w-10 h-10 rounded-full bg-[#fdfbf7] text-[#5d4037] border border-[#d7ccc8] shadow-lg flex items-center justify-center hover:bg-[#efebe9] active:scale-95 transition-all">📝</button>
        </div>

        <div class="flex items-center gap-3 group pointer-events-auto">
            <span class="bg-black/70 text-white text-[10px] font-bold px-2 py-1 rounded backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity translate-x-2 group-hover:translate-x-0 shadow-sm pointer-events-none select-none">Toàn màn hình</span>
            <button onclick="window.toggleFullScreen()" class="w-10 h-10 rounded-full bg-[#fdfbf7] text-[#5d4037] border border-[#d7ccc8] shadow-lg flex items-center justify-center hover:bg-[#efebe9] active:scale-95 transition-all">⛶</button>
        </div>

        <div class="flex items-center gap-3 group pointer-events-auto">
            <span class="bg-black/70 text-white text-[10px] font-bold px-2 py-1 rounded backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity translate-x-2 group-hover:translate-x-0 shadow-sm pointer-events-none select-none">Thông báo</span>
            <button onclick="window.HubUI.openNotifications()" class="w-12 h-12 rounded-full bg-[#3e2723] text-white border border-[#d7ccc8] shadow-lg flex items-center justify-center hover:bg-[#4e342e] active:scale-95 transition-all relative">
                🔔
                <span id="hubInnerBadge" style="pointer-events: none !important;" class="absolute top-0 right-0 w-3 h-3 bg-red-500 rounded-full border-2 border-[#3e2723] hidden"></span>
            </button>
        </div>

    </div>
</div>

<div id="notificationPanel" class="fixed inset-0 z-[9001] flex items-end sm:items-center justify-center sm:justify-end pointer-events-none opacity-0 invisible transition-all duration-300">
    <div class="absolute inset-0 bg-black/20 backdrop-blur-[2px] transition-opacity pointer-events-auto" onclick="window.HubUI.closeAll()"></div>
    <div class="w-full sm:w-[400px] h-[80vh] sm:h-[600px] bg-[#fdfbf7]/95 backdrop-blur-xl border-t sm:border border-[#d7ccc8] sm:rounded-l-2xl sm:rounded-tr-none shadow-2xl flex flex-col pointer-events-auto transform translate-y-full sm:translate-y-0 sm:translate-x-full transition-transform duration-300 sm:mr-5 mb-0 sm:mb-20 origin-bottom-right" id="notifBox">
        <div class="p-4 border-b border-[#d7ccc8] flex justify-between items-center bg-[#f2ebe0]/50">
            <div><h3 class="font-black text-[#3e2723] text-lg uppercase tracking-widest flex items-center gap-2">🔔 Thông Báo</h3><p class="text-[10px] text-[#8d6e63] font-bold uppercase tracking-wider" id="notifSubtitle">Cập nhật thời gian thực</p></div>
            <button onclick="window.HubUI.closeAll()" class="w-8 h-8 flex items-center justify-center rounded-full hover:bg-black/5 text-[#5d4037] text-xl transition-colors">&times;</button>
        </div>
        <div class="flex p-2 gap-2 bg-[#fff8e1]/30 border-b border-[#d7ccc8]">
            <button onclick="window.HubUI.switchTab('inventory')" id="tab-notif-inventory" class="flex-1 py-2 rounded-lg text-xs font-bold text-[#8d6e63] hover:bg-white/50 transition-all flex flex-col items-center gap-1 active relative"><span>📦 Kho</span><span class="w-1.5 h-1.5 bg-red-500 rounded-full opacity-0 transition-opacity badge-dot"></span></button>
            <button onclick="window.HubUI.switchTab('appoint')" id="tab-notif-appoint" class="flex-1 py-2 rounded-lg text-xs font-bold text-[#8d6e63] hover:bg-white/50 transition-all flex flex-col items-center gap-1 relative"><span>📅 Lịch Hẹn</span><span class="w-1.5 h-1.5 bg-red-500 rounded-full opacity-0 transition-opacity badge-dot"></span></button>
            <button onclick="window.HubUI.switchTab('debt')" id="tab-notif-debt" class="flex-1 py-2 rounded-lg text-xs font-bold text-[#8d6e63] hover:bg-white/50 transition-all flex flex-col items-center gap-1 relative"><span>💰 Công Nợ</span><span class="w-1.5 h-1.5 bg-red-500 rounded-full opacity-0 transition-opacity badge-dot"></span></button>
        </div>
        <div class="flex-1 overflow-y-auto p-4 custom-scrollbar bg-[#ffffff]/40 relative">
            <div id="notif-list-inventory" class="notif-section space-y-3 hidden animate-fade-in"></div>
            <div id="notif-list-appoint" class="notif-section space-y-3 hidden animate-fade-in"></div>
            <div id="notif-list-debt" class="notif-section space-y-3 hidden animate-fade-in"></div>
            <div id="notif-empty" class="absolute inset-0 flex flex-col items-center justify-center text-gray-400 pointer-events-none hidden"><span class="text-4xl mb-2 grayscale opacity-50">📭</span><span class="text-xs font-medium italic">Không có thông báo mới</span></div>
        </div>
        <div class="p-3 border-t border-[#d7ccc8] bg-[#f2ebe0]/30 text-center"><button onclick="window.NotificationEngine.refreshAll()" class="text-[10px] font-bold text-[#5d4037] hover:underline flex items-center justify-center gap-1 w-full py-2 transition-colors"><span>↻</span> Làm mới dữ liệu</button></div>
    </div>
</div>

<div id="quickNoteModal" class="fixed inset-0 z-[9002] flex items-center justify-center bg-black/60 backdrop-blur-[2px] opacity-0 invisible transition-all duration-300">
    <div class="bg-[#fdfbf7] w-[90%] max-w-sm rounded-2xl shadow-2xl p-4 border border-[#d7ccc8] transform scale-95 transition-transform duration-300" id="quickNoteBox">
        <div class="flex justify-between items-center mb-3 border-b border-dashed border-[#d7ccc8] pb-2"><h3 class="font-bold text-[#3e2723] uppercase text-xs tracking-wider">📝 Ghi Chú Nhanh</h3><div class="flex gap-2"><button onclick="window.HubUI.clearNote()" class="text-[10px] text-red-500 font-bold hover:bg-red-50 px-2 py-1 rounded transition-colors">Xóa</button><button onclick="window.HubUI.closeQuickNote()" class="text-lg text-gray-400 hover:text-[#5d4037] transition-colors">&times;</button></div></div>
        <textarea id="quickNoteArea" class="w-full h-40 bg-[#fff] border border-[#d7ccc8] rounded-xl p-3 text-sm text-[#3e2723] outline-none focus:border-[#5d4037] resize-none leading-relaxed placeholder-gray-300 shadow-inner" placeholder="Nhập ghi chú tạm thời (Ví dụ: Mua thêm kim châm 0.25, gọi lại cho BN A...)..."></textarea>
        <div class="mt-3 flex justify-end"><button onclick="window.HubUI.saveNote()" class="bg-[#5d4037] text-white px-4 py-2 rounded-xl text-xs font-bold shadow-sm hover:bg-[#4e342e] active:scale-95 transition-transform">Lưu Lại</button></div>
    </div>
</div>
`;
