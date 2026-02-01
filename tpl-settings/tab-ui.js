window.TPL_SETTING_TAB_UI = `
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
                <div id="paletteTextContainer" class="color-swatch-grid"></div>
            </div>
            <div>
                <label class="text-[10px] font-bold text-gray-400 uppercase mb-1 block">Màu nền hộp</label>
                <input type="color" id="profitBgColorInput" class="w-full h-10 rounded-lg cursor-pointer border-none p-1 bg-gray-50">
                <div id="paletteBgContainer" class="color-swatch-grid"></div>
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
                <input type="range" id="confBlurHeader" min="0" max="20" step="1" value="0" class="song-slider" oninput="document.getElementById('blurHeaderVal').innerText = this.value + 'px'">
            </div>
            <div>
                <div class="flex justify-between items-center mb-1">
                    <label class="text-[11px] font-bold text-[#5d4037]">Mờ Thông Tin</label>
                    <span id="blurInfoVal" class="text-[10px] font-bold">0px</span>
                </div>
                <input type="range" id="confBlurInfo" min="0" max="20" step="1" value="0" class="song-slider" oninput="document.getElementById('blurInfoVal').innerText = this.value + 'px'">
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
            <div class="mt-2 text-center">
                <img id="previewQrSettings" class="h-20 mx-auto object-contain border rounded bg-white">
            </div>
        </div>
    </section>
</div>
`;
