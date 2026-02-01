/**
 * FILE: templates/tpl-modal-sample.js
 * CHỨC NĂNG: Giao diện Modal Bài thuốc mẫu (Split View: Danh sách - Chi tiết).
 * PHONG CÁCH: Giống Modal Tra cứu Huyệt & AI.
 */

window.TPL_MODAL_SAMPLE = `
<div id="sampleMedModal" class="modal" style="z-index: 3000;">
    <div class="modal-box w-full max-w-5xl h-[85vh] flex flex-col p-0 bg-[#fdfbf7] overflow-hidden">
        
        <div class="modal-header bg-[#efebe9] border-b border-[#d7ccc8] px-4 py-3 flex justify-between items-center shadow-sm shrink-0 z-10">
            <div class="flex items-center gap-3">
                <div class="w-10 h-10 rounded-full bg-[#5d4037] text-white flex items-center justify-center text-xl shadow-inner">
                    📚
                </div>
                <div>
                    <h2 class="font-bold text-lg text-[#3e2723] uppercase leading-tight">Thư Viện Bài Thuốc</h2>
                    <p class="text-[11px] text-[#5d4037] font-medium mt-0.5 opacity-80">
                        Chọn bài thuốc để áp dụng vào đơn
                    </p>
                </div>
            </div>
            <button onclick="document.getElementById('sampleMedModal').classList.remove('active')" class="w-8 h-8 rounded-full flex items-center justify-center text-gray-500 hover:bg-red-50 hover:text-red-500 transition-colors text-xl font-bold">&times;</button>
        </div>

        <div class="flex flex-1 overflow-hidden">
            
            <div class="w-1/3 md:w-[320px] border-r border-[#e0e0e0] flex flex-col bg-white flex-shrink-0 z-10">
                <div class="p-3 border-b border-[#f0f0f0] bg-[#faf8f5]">
                    <div class="relative group">
                        <span class="absolute left-3 top-2.5 text-gray-400 text-xs">🔍</span>
                        <input type="text" id="sampleSearchInput" onkeyup="window.renderSampleMedList(this.value)" 
                               placeholder="Tìm bài thuốc..." 
                               class="w-full pl-8 pr-3 py-2.5 rounded-xl border border-[#d7ccc8] bg-white text-sm text-[#3e2723] placeholder-gray-400 focus:outline-none focus:border-[#5d4037] focus:ring-1 focus:ring-[#5d4037] transition-all shadow-sm">
                    </div>
                </div>
                <div class="flex-1 overflow-y-auto p-2 space-y-1 custom-scrollbar bg-[#ffffff]" id="sampleMedListContainer">
                    </div>
                <div class="p-2 border-t border-gray-100 bg-gray-50 text-center">
                    <button onclick="window.openSettings(); window.switchSettingsTab('tabMed', document.querySelector('.tab-btn:nth-child(2)')); document.getElementById('sampleMedModal').classList.remove('active');" 
                            class="text-[10px] text-blue-600 hover:text-blue-800 underline font-bold">
                        ⚙️ Quản lý / Thêm mới bài thuốc
                    </button>
                </div>
            </div>

            <div class="flex-1 bg-[#fffcf7] relative overflow-y-auto custom-scrollbar flex flex-col">
                
                <div id="sampleMedDetailBox" class="hidden flex-1 flex flex-col">
                    <div class="p-6 md:p-8 flex-1">
                        <div class="mb-6 border-b border-dashed border-[#d7ccc8] pb-4">
                            <h2 id="detailSampleName" class="text-3xl md:text-4xl font-black text-[#3e2723] uppercase tracking-tight font-serif mb-2">
                                TÊN BÀI THUỐC
                            </h2>
                            <span class="inline-block bg-[#efebe9] text-[#5d4037] text-xs font-bold px-3 py-1 rounded-full border border-[#d7ccc8]">
                                <span id="detailSampleCount">0</span> vị thuốc
                            </span>
                        </div>

                        <div class="mb-4">
                            <label class="text-[11px] font-bold text-[#8d6e63] uppercase tracking-wider mb-3 block">Thành phần & Liều lượng</label>
                            <div id="detailSampleIngredients" class="grid grid-cols-2 md:grid-cols-3 gap-3">
                                </div>
                        </div>
                    </div>

                    <div class="p-4 bg-white border-t border-[#e0e0e0] flex justify-end gap-3 sticky bottom-0 shadow-[0_-4px_10px_rgba(0,0,0,0.05)]">
                        <button onclick="document.getElementById('sampleMedModal').classList.remove('active')" class="px-6 py-3 rounded-xl font-bold text-gray-500 hover:bg-gray-100 transition-colors">Hủy</button>
                        <button onclick="window.applySelectedSampleToVisit()" class="px-8 py-3 bg-gradient-to-r from-[#5d4037] to-[#4e342e] text-white font-bold rounded-xl shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all active:scale-95 flex items-center gap-2 text-sm uppercase tracking-wide">
                            <span>✅ Chọn Bài Này</span>
                        </button>
                    </div>
                </div>

                <div id="sampleMedEmptyState" class="flex flex-col items-center justify-center h-full text-gray-400 opacity-60">
                    <div class="text-6xl mb-4 grayscale">👈</div>
                    <p class="text-sm font-medium text-center">Chọn một bài thuốc từ danh sách bên trái<br>để xem chi tiết thành phần.</p>
                </div>

            </div>
        </div>
    </div>
</div>
`;
