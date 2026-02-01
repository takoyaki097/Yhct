window.TPL_SETTING_TAB_SYSTEM = `
<div id="tabBackup" class="settings-panel hidden space-y-8">
    
    <div class="p-6 bg-white border border-red-100 rounded-2xl shadow-sm text-center">
        <div class="w-14 h-14 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-3">
            <span class="text-3xl">🛡️</span>
        </div>
        <h3 class="font-bold text-[#3e2723] uppercase text-xs tracking-widest mb-1">Mật khẩu Admin</h3>
        <p class="text-[10px] text-gray-400 mb-5 italic">Dùng để bảo vệ quyền truy cập cài đặt & doanh thu</p>
        
        <input type="password" id="confPass" class="hidden" readonly>
        <button onclick="window.openNativePasswordInput((p) => { document.getElementById('confPass').value = p; window.config.password = p; window.saveConfig(); alert('✅ Đã đổi mật khẩu thành công!'); })" 
                class="w-full py-3 bg-white border-2 border-red-500 text-red-600 font-black rounded-xl hover:bg-red-50 transition-colors text-sm uppercase shadow-sm active:scale-95">
            Thiết lập mật khẩu mới
        </button>
    </div>

    <div class="space-y-4">
        <h3 class="font-bold text-[#5d4037] uppercase text-[11px] tracking-widest text-center">Cơ sở dữ liệu (JSON)</h3>
        
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
    </div>

    <div class="space-y-4 pt-4 border-t border-dashed border-[#d7ccc8]">
        <h3 class="font-bold text-[#5d4037] uppercase text-[11px] tracking-widest text-center">Đồng bộ Excel (XLSX)</h3>
        
        <div class="grid grid-cols-2 gap-4">
            <button onclick="window.exportPatientListToExcel()" class="py-4 bg-[#f1f8e9] border border-[#c5e1a5] rounded-xl text-[#33691e] font-black text-xs hover:bg-[#dcedc8] flex flex-col items-center justify-center gap-1 shadow-sm uppercase tracking-wider">
                <span class="text-xl">📊</span> Xuất Danh Sách
            </button>

            <label for="excelImportInput" class="py-4 bg-[#fff3e0] border border-[#ffe0b2] rounded-xl text-[#e65100] font-black text-xs hover:bg-[#ffe0b2] flex flex-col items-center justify-center gap-1 shadow-sm uppercase tracking-wider cursor-pointer active:scale-95 transition-transform">
                <span class="text-xl">📥</span> Nhập / Đồng bộ
                <input type="file" id="excelImportInput" accept=".xlsx, .xls" class="hidden" onchange="window.handleExcelImport(event)">
            </label>
        </div>
        
        <p class="text-[9px] text-center text-gray-400 italic px-4">
            * Chức năng "NHẬP / ĐỒNG BỘ" sẽ gộp dữ liệu từ Excel vào phần mềm. Nếu trùng SĐT/Tên sẽ cập nhật thông tin mới nhất.
        </p>
    </div>
</div>
`;
