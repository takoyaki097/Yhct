window.TPL_SETTING_SUBMODALS = `
<div id="diseaseModal" class="modal" style="z-index: 2200;">
    <div class="modal-box w-full max-w-2xl h-[95vh] flex flex-col bg-[#fffcf7]">
        <div class="modal-header bg-[#f2ebe0] border-b border-[#d7ccc8]">
            <h2 id="diseaseModalTitle" class="font-bold text-xl text-[#3e2723]">Thêm bệnh mới</h2>
            <button onclick="window.closeDiseaseModal()" class="text-2xl cursor-pointer">&times;</button>
        </div>
        <div class="modal-body flex-1 overflow-y-auto p-5 space-y-5 custom-scrollbar">
            <input type="hidden" id="diseaseEditIndex">
            <div class="space-y-3">
                <div>
                    <label class="song-label">Tên bệnh</label>
                    <input type="text" id="diseaseName" class="song-input font-bold text-[#5d4037]" placeholder="Tên bệnh...">
                </div>
                <div>
                    <label class="song-label">Triệu chứng & Ghi chú</label>
                    <textarea id="diseaseSymptoms" class="song-input h-24" placeholder="Mô tả bệnh lý..."></textarea>
                </div>
            </div>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div class="bg-white p-3 rounded-xl border border-[#d7ccc8] shadow-sm">
                    <h3 class="font-bold text-[#3e2723] mb-2 uppercase text-xs border-b pb-1">Đông Y</h3>
                    <div id="diseaseEastNameContainer" class="mb-2">
                        <input type="text" id="diseaseEastName" class="text-xs w-full border-b border-dashed border-[#d7ccc8] outline-none py-1 text-[#5d4037] font-bold bg-transparent" placeholder="Tên bài thuốc...">
                    </div>
                    <div id="eastSettingsTabs" class="flex gap-2 overflow-x-auto pb-2 mb-2 border-b border-dashed border-[#d7ccc8] custom-scrollbar"></div>
                    
                    <div id="eastIngredientsContainer" class="space-y-1 mb-2 max-h-60 overflow-y-auto bg-gray-50 p-2 rounded custom-scrollbar"></div>
                    <button onclick="window.addEastIngredient()" class="btn-glass w-full py-2 text-xs text-[#5d4037]">+ Thêm vị</button>
                </div>
                <div class="bg-white p-3 rounded-xl border border-blue-200 shadow-sm">
                    <h3 class="font-bold text-blue-900 mb-2 uppercase text-xs border-b pb-1">Tây Y</h3>
                    <div id="westMedicinesContainer" class="space-y-1 mb-2 max-h-60 overflow-y-auto bg-blue-50 p-2 rounded custom-scrollbar"></div>
                    <button onclick="window.addWestMedicine()" class="btn-glass w-full py-2 text-xs text-blue-800">+ Thêm thuốc</button>
                </div>
            </div>
        </div>
        <div class="modal-footer border-t border-[#d7ccc8] p-3 flex justify-end gap-2 bg-[#f2ebe0]">
            <button onclick="window.closeDiseaseModal()" class="px-4 py-2 bg-gray-200 rounded text-gray-700 font-bold">Hủy</button>
            <button onclick="window.saveDisease()" class="px-6 py-2 btn-primary">Lưu</button>
        </div>
    </div>
</div>

<div id="samplePrescriptionModal" class="modal" style="z-index: 2300;">
    <div class="modal-box w-full max-w-md h-[80vh] flex flex-col bg-[#fffcf7]">
        <div class="modal-header bg-[#f2ebe0] border-b border-[#d7ccc8]">
            <h2 class="font-bold text-xl text-[#3e2723]">Soạn Bài Thuốc</h2>
            <button onclick="window.closeSamplePrescriptionModal()" class="text-2xl cursor-pointer">&times;</button>
        </div>
        <div class="modal-body flex-1 overflow-y-auto p-5 space-y-4 custom-scrollbar">
            <input type="hidden" id="samplePrescriptionIndex">
            <div>
                <label class="song-label">Tên bài thuốc</label>
                <input type="text" id="samplePrescriptionName" class="song-input font-bold text-[#5d4037] text-center" placeholder="Nhập tên bài thuốc...">
            </div>
            <div class="bg-white p-4 rounded-xl border border-[#d7ccc8] shadow-sm flex flex-col h-full min-h-[300px]">
                <h3 class="font-bold text-[#3e2723] mb-3 uppercase text-[10px] border-b border-dashed border-[#d7ccc8] pb-2">Vị thuốc & Liều lượng (Gam)</h3>
                <div id="sampleIngredientsContainer" class="flex-1 space-y-2 overflow-y-auto mb-3 custom-scrollbar"></div>
                <button onclick="window.addSampleIngredientItem()" class="btn-glass w-full py-3 text-xs text-[#5d4037] font-bold">+ THÊM DƯỢC LIỆU</button>
            </div>
        </div>
        <div class="modal-footer border-t border-[#d7ccc8] p-3 flex justify-end gap-2 bg-[#f2ebe0]">
            <button onclick="window.closeSamplePrescriptionModal()" class="px-4 py-2 bg-gray-200 rounded text-gray-700 font-bold">Hủy</button>
            <button onclick="window.saveSamplePrescription()" class="px-6 py-2 btn-primary">Lưu Bài Thuốc</button>
        </div>
    </div>
</div>
`;
