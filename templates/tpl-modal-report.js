/**
 * FILE: templates/tpl-modal-report.js
 * CHỨC NĂNG: Template giao diện Báo cáo (Đã thêm chế độ Báo cáo Thuốc Bắc chuyên sâu).
 */

window.TPL_MODAL_REPORT = `
<div id="analyticsModal" class="modal">
    <div class="modal-box w-full max-w-6xl h-[90vh] flex flex-col bg-[#fffcf7]">
        <div class="modal-header bg-[#f2ebe0] border-b border-[#d7ccc8] px-5 py-4 flex justify-between items-center">
            <h2 class="font-bold text-xl text-[#3e2723] uppercase tracking-widest flex items-center gap-2">
                <span>📊</span> Báo Cáo & Thống Kê
            </h2>
            <button onclick="window.closeModals()" class="text-2xl text-[#8d6e63] hover:text-red-600 transition-colors">&times;</button>
        </div>
        
        <div class="modal-body flex-1 overflow-y-auto p-5 custom-scrollbar">
            
            <div class="bg-white p-4 rounded-xl border border-[#d7ccc8] shadow-sm mb-6">
                <div class="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between mb-3 border-b border-dashed border-gray-200 pb-3">
                    
                    <div class="flex items-center gap-2">
                        <span class="text-xs font-bold text-[#5d4037] uppercase">Chế độ xem:</span>
                        <select id="reportFilterMode" onchange="window.toggleReportFilterMode(); window.renderAnalytics();" class="song-input h-9 text-xs font-bold w-52 py-1 bg-[#fdfbf7]">
                            <option value="quick">⚡ Xem Nhanh</option>
                            <option value="range">📅 Khoảng Ngày</option>
                            <option value="multi">🗂️ Chọn Nhiều Tháng</option>
                            <option value="tcm_deep">🌿 BC Lợi Nhuận Thuốc Bắc</option>
                        </select>
                    </div>

                    <button onclick="window.exportToExcel()" class="btn-glass text-green-700 px-4 py-2 text-xs flex items-center gap-2 h-9">
                        <span>📥</span> Xuất Excel
                    </button>
                </div>

                <div class="flex flex-wrap items-end gap-3">
                    
                    <div id="filterBox_quick" class="filter-group flex items-center gap-2">
                        <select id="anaTimeFilter" onchange="window.renderAnalytics()" class="song-input h-10 w-40 text-sm">
                            <option value="this_month" selected>Tháng này</option>
                            <option value="today">Hôm nay</option>
                            <option value="last_month">Tháng trước</option>
                            <option value="all">Tất cả thời gian</option>
                        </select>
                    </div>

                    <div id="filterBox_range" class="filter-group hidden flex items-center gap-2">
                        <div>
                            <label class="text-[10px] font-bold text-gray-400 block mb-1">Từ ngày</label>
                            <input type="date" id="reportStartDate" class="song-input h-10 text-sm w-36">
                        </div>
                        <span class="text-gray-400">➜</span>
                        <div>
                            <label class="text-[10px] font-bold text-gray-400 block mb-1">Đến ngày</label>
                            <input type="date" id="reportEndDate" class="song-input h-10 text-sm w-36">
                        </div>
                        <button onclick="window.renderAnalytics()" class="btn-primary h-10 px-4 mt-auto text-xs">LỌC</button>
                    </div>

                    <div id="filterBox_multi" class="filter-group hidden w-full">
                        <div class="text-[10px] font-bold text-gray-400 mb-2 uppercase">Chọn các tháng cần xem:</div>
                        <div id="multiMonthContainer" class="flex flex-wrap gap-2 max-h-32 overflow-y-auto p-2 bg-gray-50 border border-gray-200 rounded-lg custom-scrollbar">
                            <div class="text-xs text-gray-400 italic">Đang tải dữ liệu...</div>
                        </div>
                        <div class="mt-2 text-right">
                            <button onclick="window.renderAnalytics()" class="btn-primary h-8 px-4 text-xs">ÁP DỤNG</button>
                        </div>
                    </div>

                </div>
            </div>

            <div id="chartContainer" class="h-72 mb-6 border border-[#e0e0e0] rounded-xl p-3 bg-white shadow-sm relative">
                <h3 class="absolute top-3 left-4 text-xs font-bold text-gray-400 uppercase tracking-widest">Biểu đồ doanh thu</h3>
                <canvas id="analyticsChart"></canvas>
            </div>

            <div class="flex justify-between items-center mb-2">
                <h3 class="font-bold text-[#5d4037] text-sm uppercase border-l-4 border-[#5d4037] pl-2" id="tableTitle">Chi tiết phiếu khám</h3>
                <select id="anaSortBy" onchange="window.renderAnalytics()" class="text-xs bg-transparent font-bold text-[#5d4037] border-none outline-none cursor-pointer">
                    <option value="date_desc">▼ Mới nhất</option>
                    <option value="date_asc">▲ Cũ nhất</option>
                    <option value="total_desc">💰 Doanh thu cao</option>
                </select>
            </div>
            
            <div class="overflow-x-auto bg-white border border-[#e0e0e0] rounded-xl shadow-sm min-h-[300px]">
                <table class="w-full text-sm text-left">
                    <thead class="bg-[#f2ebe0] text-[#5d4037] font-bold text-xs uppercase sticky top-0 z-10 shadow-sm">
                        <tr id="reportHeaderRow">
                            <th class="p-3">Ngày</th>
                            <th class="p-3">Bệnh Nhân</th>
                            <th class="p-3">Chẩn Đoán</th>
                            <th class="p-3 text-center">TT</th>
                            <th class="p-3 text-right">Doanh Thu</th>
                            <th class="p-3 text-right">Lợi Nhuận</th>
                        </tr>
                    </thead>
                    <tbody id="anaTableBody" class="divide-y divide-gray-100"></tbody>
                </table>
            </div>
        </div>
    </div>
</div>

<div id="viewPrescriptionModal" class="modal" style="z-index: 9999;">
    <div class="modal-box w-full max-w-md bg-white rounded-xl shadow-2xl p-0 overflow-hidden transform scale-95 transition-transform duration-200">
        <div class="bg-[#5d4037] text-white px-4 py-3 flex justify-between items-center">
            <h3 class="font-bold text-sm uppercase tracking-widest">Chi tiết đơn thuốc</h3>
            <button onclick="document.getElementById('viewPrescriptionModal').classList.remove('active')" class="text-white hover:text-red-200 text-xl font-bold">&times;</button>
        </div>
        <div class="p-4 max-h-[60vh] overflow-y-auto custom-scrollbar" id="prescriptionDetailContent">
            </div>
        <div class="bg-gray-50 p-3 text-center border-t border-gray-100">
            <button onclick="document.getElementById('viewPrescriptionModal').classList.remove('active')" class="text-xs font-bold text-gray-500 hover:text-[#5d4037] uppercase">Đóng lại</button>
        </div>
    </div>
</div>
`;
