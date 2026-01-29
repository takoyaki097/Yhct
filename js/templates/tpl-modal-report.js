/**
 * FILE: js/templates/tpl-modal-report.js
 * CHỨC NĂNG: Template giao diện Modal Báo cáo & Thống kê doanh thu.
 */

window.TPL_MODAL_REPORT = `
<div id="analyticsModal" class="modal">
    <div class="modal-box w-full max-w-4xl h-[90vh] flex flex-col">
        <div class="modal-header">
            <h2 class="font-bold text-xl uppercase">Báo Cáo</h2>
            <button onclick="window.closeModals()" class="text-2xl cursor-pointer">&times;</button>
        </div>
        <div class="modal-body flex-1 overflow-y-auto p-4">
            <div class="flex flex-wrap gap-2 mb-4">
                <select id="anaTimeFilter" onchange="window.renderAnalytics()" class="song-input w-32">
                    <option value="today">Hôm nay</option>
                    <option value="month" selected>Tháng này</option>
                    <option value="all">Tất cả</option>
                </select>
                <select id="anaSortBy" onchange="window.renderAnalytics()" class="song-input w-40">
                    <option value="date_desc">📅 Mới nhất</option>
                    <option value="total_desc">💰 Doanh thu</option>
                </select>
                <button onclick="window.exportToExcel()" class="btn-glass text-green-700 px-4">Excel</button>
            </div>
            <div class="h-64 mb-4 border rounded-xl p-2 bg-white">
                <canvas id="analyticsChart"></canvas>
            </div>
            <div class="overflow-x-auto">
                <table class="w-full text-sm">
                    <thead>
                        <tr class="bg-gray-50 text-left text-xs uppercase text-gray-500">
                            <th class="p-2">Ngày</th>
                            <th class="p-2">Tên</th>
                            <th class="p-2">Tuổi</th>
                            <th class="p-2">Bệnh</th>
                            <th class="p-2 text-center">TT</th>
                            <th class="p-2 text-right">Tổng</th>
                            <th class="p-2 text-right">Lãi</th>
                        </tr>
                    </thead>
                    <tbody id="anaTableBody"></tbody>
                </table>
            </div>
        </div>
    </div>
</div>
`;
