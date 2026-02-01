window.TPL_SETTING_TAB_MED = `
<div id="tabMed" class="settings-panel hidden space-y-6">
    <div>
        <h3 class="font-bold text-[#3e2723] mb-2 uppercase border-b pb-1 text-[11px] tracking-widest">Danh mục Bệnh</h3>
        <div id="diseaseList" class="space-y-2 mb-3 max-h-40 overflow-y-auto pr-1 bg-white border border-[#eee] rounded-lg p-2 custom-scrollbar"></div>
        <div class="flex gap-2">
            <input type="text" id="newDiseaseName" placeholder="Tên bệnh mới..." class="song-input text-sm h-10 flex-1">
            <button onclick="window.addNewDiseaseInline()" class="btn-primary py-1 px-4 text-xs h-10 shadow-sm">Thêm Nhanh</button>
        </div>
    </div>

    <div class="bg-[#fffcf7] p-3 rounded border border-[#d7ccc8] shadow-sm">
        <div class="flex justify-between items-center mb-2 border-b border-dashed border-[#d7ccc8] pb-1">
            <h3 class="font-bold text-[#5d4037] uppercase text-[11px]">Bài thuốc mẫu</h3>
            <button onclick="window.addNewSamplePrescriptionInline()" class="text-[10px] bg-[#5d4037] text-white px-3 py-1 rounded shadow-sm hover:bg-[#4e342e]">+ TẠO MỚI</button>
        </div>
        <div id="samplePrescriptionList" class="space-y-1 max-h-44 overflow-y-auto custom-scrollbar"></div>
    </div>

    <div>
        <h3 class="font-bold text-[#3e2723] mb-2 uppercase border-b pb-1 text-[11px]">Thủ thuật & Vật tư</h3>
        <div id="procList" class="space-y-2 mb-3 max-h-40 overflow-y-auto pr-1 custom-scrollbar"></div>
        <div class="flex gap-2 items-center">
            <input type="text" id="newProcName" placeholder="Tên thủ thuật..." class="song-input text-sm flex-1 h-10">
            <input type="number" id="newProcPrice" placeholder="Giá" class="song-input text-sm w-24 h-10 text-center">
            <button onclick="window.addProc()" class="btn-primary py-1 px-4 text-xs h-10 shadow-sm">Thêm</button>
        </div>
    </div>
    
    <div class="mt-4 pt-4 border-t border-dashed border-[#d7ccc8]">
        <h3 class="font-bold text-[#3e2723] mb-3 uppercase text-[11px]">Cấu hình Tứ Chẩn</h3>
        <div class="grid grid-cols-2 gap-4">
            <div>
                <label class="text-[10px] font-bold text-gray-500 uppercase">Vọng (Nhìn)</label>
                <div id="setting_list_vong" class="max-h-32 overflow-y-auto border rounded p-1 bg-white mb-1"></div>
                <div class="flex gap-1"><input type="text" id="setting_new_vong" class="border rounded px-1 w-full text-xs h-7"><button onclick="window.addTuChanItem('vong')" class="bg-gray-200 px-2 rounded text-xs">+</button></div>
            </div>
            <div>
                <label class="text-[10px] font-bold text-gray-500 uppercase">Văn (Nghe/Ngửi)</label>
                <div id="setting_list_van" class="max-h-32 overflow-y-auto border rounded p-1 bg-white mb-1"></div>
                <div class="flex gap-1"><input type="text" id="setting_new_van" class="border rounded px-1 w-full text-xs h-7"><button onclick="window.addTuChanItem('van')" class="bg-gray-200 px-2 rounded text-xs">+</button></div>
            </div>
            <div>
                <label class="text-[10px] font-bold text-gray-500 uppercase">Vấn (Hỏi)</label>
                <div id="setting_list_vanhoi" class="max-h-32 overflow-y-auto border rounded p-1 bg-white mb-1"></div>
                <div class="flex gap-1"><input type="text" id="setting_new_vanhoi" class="border rounded px-1 w-full text-xs h-7"><button onclick="window.addTuChanItem('vanhoi')" class="bg-gray-200 px-2 rounded text-xs">+</button></div>
            </div>
            <div>
                <label class="text-[10px] font-bold text-gray-500 uppercase">Thiết (Sờ/Mạch)</label>
                <div id="setting_list_machchan" class="max-h-32 overflow-y-auto border rounded p-1 bg-white mb-1"></div>
                <div class="flex gap-1"><input type="text" id="setting_new_machchan" class="border rounded px-1 w-full text-xs h-7"><button onclick="window.addTuChanItem('machchan')" class="bg-gray-200 px-2 rounded text-xs">+</button></div>
            </div>
        </div>
    </div>
</div>
`;
