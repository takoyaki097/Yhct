/**
 * FILE: js/templates/tpl-modal-herb.js
 * CHỨC NĂNG: Giao diện HTML cho Modal Tra cứu Dược liệu.
 */
window.TPL_MODAL_HERB = `
<div id="herbModal" class="modal">
    <div class="modal-box w-full max-w-6xl h-[90vh] flex flex-col p-0 overflow-hidden bg-[#fafafa]">
        <div class="modal-header bg-white border-b px-4 py-3 flex justify-between items-center shadow-sm z-10">
            <div class="flex items-center gap-3">
                <div class="w-8 h-8 rounded-full bg-green-700 text-white flex items-center justify-center font-bold text-lg">🌿</div>
                <h3 class="font-bold text-[#3e2723] text-lg uppercase tracking-wide">Tra Cứu Dược Liệu</h3>
            </div>
            <button onclick="document.getElementById('herbModal').classList.remove('active')" class="w-8 h-8 rounded-full hover:bg-gray-100 flex items-center justify-center text-gray-500 font-bold text-xl">&times;</button>
        </div>

        <div class="flex-1 flex overflow-hidden">
            <div class="w-1/4 md:w-64 bg-white border-r border-gray-200 overflow-y-auto p-2 hidden md:block custom-scrollbar" id="herbSidebar">
                </div>

            <div class="flex-1 flex flex-col bg-[#fdfbf7]">
                <div class="p-3 bg-white border-b border-gray-200 flex gap-2 shadow-sm z-10">
                    <button class="md:hidden px-3 border border-gray-300 rounded bg-white text-gray-600" onclick="document.getElementById('herbSidebar').classList.toggle('hidden')">☰</button>
                    <div class="relative flex-1 group">
                        <span class="absolute left-3 top-2.5 text-gray-400 group-focus-within:text-[#5d4037]">🔍</span>
                        <input type="text" id="herbSearchInput" onkeyup="window.filterHerbs()" placeholder="Tìm vị thuốc (Tía tô, Nhân sâm...)..." class="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:bg-white focus:border-[#5d4037] focus:ring-1 focus:ring-[#5d4037] outline-none transition-all text-[#3e2723]">
                    </div>
                </div>

                <div class="p-4 flex-1 overflow-y-auto custom-scrollbar relative">
                    <h4 id="herbCurrentCategory" class="text-xs font-bold text-gray-500 uppercase mb-4 tracking-wider border-b border-dashed border-gray-300 pb-1 inline-block">Tất cả vị thuốc</h4>
                    
                    <div id="herbContent" class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 pb-10">
                        </div>
                </div>
            </div>
        </div>
    </div>
</div>`;
