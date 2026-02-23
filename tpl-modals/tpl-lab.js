/**
 * FILE: tpl-modals/tpl-lab.js
 * CHỨC NĂNG: Giao diện Phòng Lab Biện Chứng (Clinical Reasoning Lab UI)
 * CẬP NHẬT: Tái bố cục RESPONSIVE. 
 * - Mobile (Dọc): Xếp chồng 1 cột (Input trên, Output dưới).
 * - PC/Tablet (Ngang): Giữ nguyên 2 cột (Split-view).
 */

window.TPL_LAB = `
<div id="labModal" class="modal" style="z-index: 9500;">
    <div class="modal-box w-full max-w-6xl h-full md:h-[92vh] max-h-screen flex flex-col bg-[#fdfbf7] p-0 overflow-hidden shadow-2xl border border-gray-200 rounded-none md:rounded-2xl">
        
        <div class="modal-header bg-[#efebe9] border-b border-[#d7ccc8] px-4 md:px-5 py-3 flex justify-between items-center shadow-sm z-20 shrink-0">
            <h2 class="font-bold text-lg md:text-xl text-[#3e2723] uppercase flex items-center gap-2 tracking-wide truncate">
                <span class="text-2xl">🔬</span> Phòng Lab Biện Chứng
            </h2>
            <button onclick="document.getElementById('labModal').classList.remove('active')" class="w-8 h-8 rounded-full flex items-center justify-center text-gray-500 hover:bg-red-50 hover:text-red-500 transition-colors text-2xl">&times;</button>
        </div>
        
        <div class="flex flex-col md:flex-row flex-1 overflow-y-auto md:overflow-hidden custom-scrollbar">
            
            <div class="w-full md:w-1/3 md:w-[380px] bg-white md:border-r border-[#e0e0e0] flex flex-col z-10 shadow-sm md:shadow-lg shrink-0 md:overflow-y-auto custom-scrollbar">
                <div class="p-4 md:p-5 space-y-5 md:space-y-6 md:flex-1">
                    
                    <div class="lab-section">
                        <label class="text-xs font-bold text-[#8d6e63] uppercase tracking-wider mb-2 flex items-center gap-1"><span class="text-lg">👤</span> 1. Bệnh nhân & Thời gian</label>
                        <div class="flex gap-2 mb-3">
                            <button class="lab-tag flex-1 active" data-group="gender" data-value="male" onclick="window.LabUI.toggleTag(this)">👨 Nam (Dương)</button>
                            <button class="lab-tag flex-1" data-group="gender" data-value="female" onclick="window.LabUI.toggleTag(this)">👩 Nữ (Âm)</button>
                        </div>
                        <div class="p-3 bg-[#f8f9fa] rounded-xl border border-gray-200 relative group">
                            <div class="text-[10px] font-bold text-gray-500 uppercase mb-1">Hệ Tí Ngọ Lưu Chú (Giờ/Can/Chi)</div>
                            <div id="labTimeDisplay" class="font-bold text-[#5d4037] text-sm truncate">Đang tải thời gian...</div>
                            <div class="absolute top-2 right-2 flex gap-1 opacity-50 group-hover:opacity-100 transition-opacity md:opacity-50">
                                <button onclick="window.LabUI.syncCurrentTime()" class="p-1.5 bg-white border border-gray-300 rounded hover:bg-gray-100" title="Đồng bộ giờ hiện tại">🔄</button>
                                <input type="datetime-local" id="labCustomTime" onchange="window.LabUI.setCustomTime(this.value)" class="absolute inset-0 opacity-0 cursor-pointer">
                                <button class="p-1.5 bg-white border border-gray-300 rounded hover:bg-gray-100 pointer-events-none" title="Chọn giờ giả lập">⏱️</button>
                            </div>
                        </div>
                    </div>

                    <div class="lab-section">
                        <label class="text-xs font-bold text-[#8d6e63] uppercase tracking-wider mb-2 flex items-center gap-1"><span class="text-lg">🫀</span> 2. Tạng Phủ Bệnh (Kinh Chính)</label>
                        <div class="grid grid-cols-3 gap-2" id="labMeridianTags">
                            </div>
                        <div class="text-[10px] text-gray-400 mt-1 italic">* Chọn 1 tạng phủ gốc rễ.</div>
                    </div>

                    <div class="lab-section">
                        <label class="text-xs font-bold text-[#8d6e63] uppercase tracking-wider mb-2 flex items-center gap-1"><span class="text-lg">🎯</span> 3. Vùng Triệu Chứng (Tại Chỗ)</label>
                        <div class="grid grid-cols-2 gap-2">
                            <button class="lab-tag" data-group="bodyPart" data-value="dau" onclick="window.LabUI.toggleTag(this)">Đầu / Mặt</button>
                            <button class="lab-tag" data-group="bodyPart" data-value="co" onclick="window.LabUI.toggleTag(this)">Cổ Gáy</button>
                            <button class="lab-tag" data-group="bodyPart" data-value="vai" onclick="window.LabUI.toggleTag(this)">Vai / Tay</button>
                            <button class="lab-tag" data-group="bodyPart" data-value="lung" onclick="window.LabUI.toggleTag(this)">Lưng Trên</button>
                            <button class="lab-tag" data-group="bodyPart" data-value="thatlung" onclick="window.LabUI.toggleTag(this)">Thắt Lưng</button>
                            <button class="lab-tag" data-group="bodyPart" data-value="nguc" onclick="window.LabUI.toggleTag(this)">Ngực / Sườn</button>
                            <button class="lab-tag" data-group="bodyPart" data-value="bung" onclick="window.LabUI.toggleTag(this)">Bụng</button>
                            <button class="lab-tag" data-group="bodyPart" data-value="chan" onclick="window.LabUI.toggleTag(this)">Chân / Gối</button>
                        </div>
                    </div>

                    <div class="lab-section">
                        <label class="text-xs font-bold text-[#8d6e63] uppercase tracking-wider mb-2 flex items-center gap-1"><span class="text-lg">☯️</span> 4. Tính chất bệnh (Bát Cương)</label>
                        <div class="flex flex-wrap gap-2">
                            <button class="lab-tag flex-grow md:flex-none" data-group="factor" data-value="hu" onclick="window.LabUI.toggleTag(this)">Hư (Yếu)</button>
                            <button class="lab-tag flex-grow md:flex-none" data-group="factor" data-value="thuc" onclick="window.LabUI.toggleTag(this)">Thực (Mạnh)</button>
                            <button class="lab-tag flex-grow md:flex-none" data-group="factor" data-value="han" onclick="window.LabUI.toggleTag(this)">Hàn (Lạnh)</button>
                            <button class="lab-tag flex-grow md:flex-none" data-group="factor" data-value="nhiet" onclick="window.LabUI.toggleTag(this)">Nhiệt (Nóng)</button>
                            <button class="lab-tag flex-grow md:flex-none" data-group="factor" data-value="cap" onclick="window.LabUI.toggleTag(this)">Cấp (Dữ)</button>
                            <button class="lab-tag flex-grow md:flex-none" data-group="factor" data-value="man" onclick="window.LabUI.toggleTag(this)">Mãn (Lâu)</button>
                            <button class="lab-tag flex-grow md:flex-none" data-group="factor" data-value="khi" onclick="window.LabUI.toggleTag(this)">Khí Trệ</button>
                            <button class="lab-tag flex-grow md:flex-none" data-group="factor" data-value="huyet" onclick="window.LabUI.toggleTag(this)">Huyết Ứ</button>
                            <button class="lab-tag w-full" data-group="factor" data-value="bieuly" onclick="window.LabUI.toggleTag(this)">Kiêm Biểu/Lý</button>
                        </div>
                    </div>

                </div>
                
                <div class="p-4 border-t border-[#e0e0e0] bg-gray-50 md:bg-transparent flex gap-2 shrink-0 sticky md:static bottom-0 z-20">
                    <button onclick="window.LabUI.resetAll()" class="w-full px-4 py-3 bg-white border border-gray-300 text-gray-600 rounded-xl font-bold uppercase hover:bg-gray-100 transition-colors shadow-sm">Làm Mới Lựa Chọn</button>
                </div>
            </div>

            <div class="w-full md:flex-1 bg-[#f4f1ea] relative md:overflow-y-auto custom-scrollbar p-4 md:p-8 border-t md:border-t-0 border-[#d7ccc8]">
                
                <div id="labEmptyState" class="flex flex-col items-center justify-center py-10 md:h-full text-gray-400 opacity-70">
                    <span class="text-6xl md:text-7xl mb-4 grayscale">🧠</span>
                    <p class="text-sm md:text-base font-bold text-center uppercase tracking-widest text-[#8d6e63]">Hệ Thống Sẵn Sàng</p>
                    <p class="text-xs text-center mt-2 px-4">Chọn các yếu tố bệnh lý ở trên<br>để AI bắt đầu phân tích phác đồ.</p>
                </div>

                <div id="labResultBox" class="hidden space-y-6 animate-fade-in pb-8 md:pb-0">
                    
                    <div class="bg-white p-4 md:p-5 rounded-2xl border border-[#d7ccc8] shadow-md flex items-center justify-between relative overflow-hidden">
                        <div class="absolute left-0 top-0 w-2 h-full bg-[#5d4037]"></div>
                        <div class="pl-3">
                            <div class="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1 flex items-center gap-1">🧭 Nguyên Tắc Chọn Bên</div>
                            <div class="font-black text-xl md:text-2xl text-[#3e2723] truncate" id="labSideResult">...</div>
                        </div>
                        <div class="w-12 h-12 md:w-14 md:h-14 rounded-full bg-[#efebe9] flex items-center justify-center text-2xl md:text-3xl shadow-inner shrink-0">☯️</div>
                    </div>

                    <div class="bg-white p-4 md:p-5 rounded-2xl border border-[#d7ccc8] shadow-sm">
                        <h3 class="font-bold text-[#5d4037] uppercase text-sm mb-4 flex items-center gap-2 border-b border-dashed border-[#d7ccc8] pb-2">
                            <span>📍</span> Phương Huyệt Đề Xuất
                        </h3>
                        
                        <div class="mb-4">
                            <div class="text-xs font-bold text-indigo-700 uppercase mb-2">💎 Huyệt Đặc Hiệu (Trị Gốc)</div>
                            <div id="labSpecialPointsList" class="grid grid-cols-1 xl:grid-cols-2 gap-3"></div>
                        </div>

                        <div id="labLocalPointsSection" class="hidden">
                            <div class="text-xs font-bold text-teal-700 uppercase mb-2 border-t border-gray-100 pt-3">🎯 Huyệt Tại Chỗ (Trị Ngọn)</div>
                            <div id="labLocalPointsList" class="grid grid-cols-1 xl:grid-cols-2 gap-3"></div>
                        </div>
                        
                        <div id="labMethodAdvice" class="mt-4 pt-3 border-t border-dashed border-gray-200 text-sm font-bold text-[#e65100] bg-orange-50 p-3 rounded-xl flex items-start gap-2">
                        </div>
                    </div>

                    <div class="bg-[#f0f4f8] p-4 md:p-5 rounded-2xl border border-[#b0bec5] shadow-inner">
                        <h3 class="font-bold text-[#37474f] uppercase text-xs mb-3 flex items-center gap-2 border-b border-[#cfd8dc] pb-2">
                            <span>💡</span> Luận giải y lý
                        </h3>
                        <ul id="labReasoningList" class="space-y-3 text-sm text-[#455a64] leading-relaxed list-none pl-1">
                        </ul>
                    </div>
                    
                    <div class="flex justify-end pt-2">
                        <button onclick="window.LabUI.applyToVisit()" class="w-full md:w-auto px-6 py-4 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-xl font-black shadow-[0_8px_20px_rgba(22,163,74,0.3)] hover:shadow-[0_8px_25px_rgba(22,163,74,0.4)] active:scale-95 transition-all flex items-center justify-center gap-2 text-sm uppercase tracking-wide">
                            <span>📋</span> Chuyển Vào Đơn Thuốc
                        </button>
                    </div>

                </div>

            </div>
        </div>
    </div>
    
    <style>
        .lab-section { position: relative; }
        .lab-tag {
            padding: 10px 8px; border: 1px solid #e0e0e0; background: white; 
            border-radius: 10px; font-size: 11px; font-weight: 700; color: #757575;
            transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1); cursor: pointer; text-transform: uppercase;
            box-shadow: 0 2px 4px rgba(0,0,0,0.02); text-align: center;
            touch-action: manipulation; 
        }
        /* Tăng kích thước vùng bấm trên mobile */
        @media (max-width: 768px) {
            .lab-tag { padding: 12px 4px; font-size: 10px; }
        }
        .lab-tag:hover { background: #f8f9fa; border-color: #bdbdbd; transform: translateY(-1px); }
        .lab-tag.active { 
            background: #5d4037; color: white; border-color: #3e2723; 
            box-shadow: 0 4px 12px rgba(93, 64, 55, 0.3); transform: translateY(-2px);
        }
        .lab-point-card {
            display: flex; align-items: stretch; justify-content: space-between;
            background: white; border: 1px solid #e0e0e0; rounded-xl; overflow: hidden;
            transition: all 0.2s;
        }
        .lab-point-card:hover { border-color: #8d6e63; box-shadow: 0 4px 10px rgba(93,64,55,0.1); transform: translateX(2px); }
        .lab-point-badge { width: 40px; md:width: 50px; background: #efebe9; color: #5d4037; font-weight: 900; display: flex; align-items: center; justify-content: center; font-size: 11px; md:font-size: 12px; border-right: 1px solid #e0e0e0; shrink-0; }
        .lab-point-content { flex: 1; padding: 10px 12px; min-width: 0; }
    </style>
</div>
`;
