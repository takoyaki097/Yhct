/**
 * FILE: js/templates/tpl-modal-lookup.js
 * CHỨC NĂNG: Giao diện Tra cứu Huyệt chuyên sâu & AI Tí Ngọ (No Map).
 * PHIÊN BẢN: 4.0 (Text-based + Advanced AI UI)
 */

window.TPL_MODAL_LOOKUP = `
<div id="acupointModal" class="modal">
    <div class="modal-box w-full max-w-6xl h-[90vh] flex flex-col overflow-hidden bg-[#fdfbf7]">
        
        <div class="modal-header bg-[#efebe9] border-b border-[#d7ccc8] py-3 flex justify-between items-center shadow-sm relative z-10">
            <div class="flex items-center gap-3">
                <div class="w-10 h-10 rounded-full bg-[#5d4037] text-white flex items-center justify-center text-xl shadow-inner">
                    ⚡
                </div>
                <div>
                    <h2 class="font-bold text-lg text-[#3e2723] uppercase leading-tight">Tra Cứu Huyệt & Tí Ngọ</h2>
                    <p class="text-[11px] text-[#5d4037] font-medium mt-0.5 flex items-center gap-1">
                        <span class="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                        <span id="acuTimeDisplay">Đang đồng bộ thời gian...</span>
                    </p>
                </div>
            </div>
            <button onclick="document.getElementById('acupointModal').classList.remove('active')" class="w-8 h-8 rounded-full flex items-center justify-center text-gray-500 hover:bg-red-50 hover:text-red-500 transition-colors text-xl font-bold">&times;</button>
        </div>
        
        <div class="flex-1 flex overflow-hidden">
            
            <div class="w-1/3 md:w-[320px] border-r border-[#e0e0e0] flex flex-col bg-white flex-shrink-0 z-10">
                <div class="p-3 border-b border-[#f0f0f0] bg-[#faf8f5]">
                    <div class="relative group">
                        <input type="text" id="acuSearchInput" onkeyup="window.renderAcupointList(this.value)" 
                               placeholder="🔍 Tìm huyệt, kinh lạc, bệnh..." 
                               class="w-full pl-9 pr-3 py-2.5 rounded-xl border border-[#d7ccc8] bg-white text-sm text-[#3e2723] placeholder-gray-400 focus:outline-none focus:border-[#5d4037] focus:ring-1 focus:ring-[#5d4037] transition-all shadow-sm group-hover:shadow-md">
                        <span class="absolute left-3 top-2.5 text-gray-400 text-xs font-bold border border-gray-300 rounded px-1">/</span>
                    </div>
                </div>
                <div class="flex-1 overflow-y-auto p-2 space-y-1 custom-scrollbar bg-[#ffffff]" id="acuListContainer">
                    <div class="text-center py-10 text-gray-400 text-xs">Đang tải dữ liệu...</div>
                </div>
            </div>

            <div class="flex-1 bg-[#fffcf7] relative overflow-y-auto custom-scrollbar">
                <div class="p-6 md:p-8 max-w-4xl mx-auto">
                
                    <div class="mb-8 bg-white border border-[#d7ccc8] rounded-2xl shadow-sm overflow-hidden">
                        <div class="bg-[#efebe9] px-4 py-2 border-b border-[#d7ccc8] flex justify-between items-center">
                            <h3 class="font-bold text-[#5d4037] text-sm uppercase flex items-center gap-2">
                                <span>☯️</span> Thời Châm (Real-time Analysis)
                            </h3>
                            <span class="text-[10px] bg-white px-2 py-0.5 rounded text-[#5d4037] border border-[#d7ccc8]">Tự động cập nhật</span>
                        </div>
                        
                        <div class="p-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div class="bg-[#f1f8e9] p-4 rounded-xl border border-[#c5e1a5] relative">
                                <div class="absolute top-0 right-0 bg-[#c5e1a5] text-[#33691e] text-[9px] font-bold px-2 py-0.5 rounded-bl-lg">THEO GIỜ (CHI)</div>
                                <div class="text-xs font-bold text-[#2e7d32] uppercase mb-2 border-b border-[#a5d6a7] pb-1 inline-block">1. Nạp Tử Pháp</div>
                                <div id="aiNaZiContent" class="text-sm space-y-2 text-[#1b5e20]">
                                    Đang tính toán...
                                </div>
                            </div>

                            <div class="bg-[#fff3e0] p-4 rounded-xl border border-[#ffe0b2] relative">
                                <div class="absolute top-0 right-0 bg-[#ffe0b2] text-[#e65100] text-[9px] font-bold px-2 py-0.5 rounded-bl-lg">THEO NGÀY (CAN)</div>
                                <div class="text-xs font-bold text-[#ef6c00] uppercase mb-2 border-b border-[#ffcc80] pb-1 inline-block">2. Nạp Giáp Pháp</div>
                                <div id="aiNaJiaContent" class="text-sm space-y-2 text-[#e65100]">
                                    Đang tính toán...
                                </div>
                            </div>
                        </div>
                    </div>

                    <div id="acupointDetailBox" class="hidden animate-fade-in-up">
                        <div class="flex flex-col md:flex-row md:items-baseline md:justify-between mb-4 border-b border-dashed border-[#d7ccc8] pb-4">
                            <div>
                                <h2 id="detailName" class="text-4xl font-black text-[#3e2723] uppercase tracking-tight font-serif">TÊN HUYỆT</h2>
                                <div class="mt-2 flex gap-2">
                                    <span id="detailMeridian" class="inline-flex items-center px-3 py-1 bg-[#5d4037] text-white text-xs font-bold rounded-lg shadow-sm"></span>
                                    <span id="detailType" class="inline-flex items-center px-3 py-1 bg-[#efebe9] text-[#5d4037] text-xs font-bold rounded-lg border border-[#d7ccc8]"></span>
                                </div>
                            </div>
                            <span id="detailId" class="text-3xl font-mono text-[#a1887f] font-bold opacity-50 mt-2 md:mt-0">ID</span>
                        </div>

                        <div class="grid gap-6">
                            <div class="group">
                                <label class="text-[11px] font-bold text-[#8d6e63] uppercase tracking-wider mb-2 block flex items-center gap-2">
                                    <span class="w-1.5 h-1.5 rounded-full bg-[#8d6e63]"></span> Tác Dụng / Chức Năng
                                </label>
                                <div class="p-5 bg-white rounded-xl border border-[#eee] shadow-sm text-[#3e2723] text-sm leading-relaxed group-hover:border-[#d7ccc8] transition-colors">
                                    <p id="detailFunction">...</p>
                                </div>
                            </div>
                            
                            <div class="group">
                                <label class="text-[11px] font-bold text-[#8d6e63] uppercase tracking-wider mb-2 block flex items-center gap-2">
                                    <span class="w-1.5 h-1.5 rounded-full bg-[#8d6e63]"></span> Chủ Trị Bệnh Chứng
                                </label>
                                <div class="p-5 bg-white rounded-xl border border-[#eee] shadow-sm text-[#3e2723] text-sm leading-relaxed group-hover:border-[#d7ccc8] transition-colors">
                                    <p id="detailIndications">...</p>
                                </div>
                            </div>

                            <div class="pt-4">
                                <button onclick="window.addAcupointToVisit()" class="w-full py-4 bg-gradient-to-r from-[#5d4037] to-[#4e342e] text-white font-bold rounded-xl shadow-lg hover:shadow-xl hover:scale-[1.01] transition-all active:scale-95 flex items-center justify-center gap-2 text-sm uppercase tracking-wide">
                                    <span>➕</span> Thêm Huyệt Này Vào Đơn Thuốc
                                </button>
                            </div>
                        </div>
                    </div>

                    <div id="acupointEmptyState" class="flex flex-col items-center justify-center py-20 text-gray-400 opacity-60">
                        <div class="text-6xl mb-4 grayscale">👈</div>
                        <p class="text-sm font-medium text-center">Chọn một huyệt từ danh sách bên trái<br>hoặc bấm vào gợi ý AI ở trên để xem chi tiết.</p>
                    </div>

                </div>
            </div>
        </div>
    </div>
    
    <style>
        /* Tinh chỉnh thanh cuộn cho Modal này */
        .custom-scrollbar::-webkit-scrollbar { width: 5px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #d7ccc8; border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #a1887f; }
    </style>
</div>
`;
