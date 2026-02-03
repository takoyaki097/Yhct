/**
 * FILE: modules_core/report.js
 * CHỨC NĂNG: Thống kê, Báo cáo đa chế độ (Range, Multi-month) & Xuất Excel.
 * CẬP NHẬT: Logic lọc tập trung, render checkbox tháng động, vẽ biểu đồ.
 */

let myChart = null;

// ============================================================
// 1. QUẢN LÝ GIAO DIỆN BỘ LỌC
// ============================================================

window.openStats = function() {
    document.getElementById('analyticsModal').classList.add('active');
    
    // A. Khởi tạo các giá trị mặc định cho Date Range
    const today = new Date();
    const firstDay = new Date(today.getFullYear(), today.getMonth(), 1); // Ngày 1 tháng này
    
    // Set giá trị mặc định cho input date (Từ ngày 1 -> Hôm nay)
    if(document.getElementById('reportStartDate')) 
        document.getElementById('reportStartDate').value = firstDay.toISOString().split('T')[0];
    if(document.getElementById('reportEndDate')) 
        document.getElementById('reportEndDate').value = window.getLocalDate();

    // B. Quét DB để tạo checkbox cho chế độ "Chọn Nhiều Tháng"
    window.initMultiMonthCheckboxes();
    
    // C. Mặc định chọn chế độ "Xem Nhanh" (Quick)
    document.getElementById('reportFilterMode').value = 'quick';
    window.toggleReportFilterMode();
    
    // D. Render báo cáo lần đầu
    window.renderAnalytics();
};

// Chuyển đổi hiển thị các ô input tùy theo chế độ lọc đang chọn
window.toggleReportFilterMode = function() {
    const mode = document.getElementById('reportFilterMode').value;
    
    // Ẩn tất cả các hộp filter con
    document.querySelectorAll('.filter-group').forEach(el => el.classList.add('hidden'));
    
    // Hiện hộp filter tương ứng
    const activeBox = document.getElementById(`filterBox_${mode}`);
    if(activeBox) activeBox.classList.remove('hidden');
};

// Hàm quét Database để tìm các tháng có dữ liệu và tạo Checkbox
window.initMultiMonthCheckboxes = function() {
    const container = document.getElementById('multiMonthContainer');
    if (!container || !window.db) return;

    // 1. Tìm tất cả các tháng có dữ liệu khám
    const months = new Set();
    window.db.forEach(p => {
        if (p.visits) {
            p.visits.forEach(v => {
                if (v.date && v.date.length >= 7) {
                    months.add(v.date.slice(0, 7)); // Lấy chuỗi YYYY-MM
                }
            });
        }
    });

    // Sắp xếp tháng giảm dần (Mới nhất lên đầu)
    const sortedMonths = Array.from(months).sort().reverse();

    if (sortedMonths.length === 0) {
        container.innerHTML = '<span class="text-xs text-gray-400">Chưa có dữ liệu khám.</span>';
        return;
    }

    // 2. Render Checkboxes
    let html = '';
    const currentMonth = window.getLocalDate().slice(0, 7);

    sortedMonths.forEach(m => {
        const [y, mo] = m.split('-');
        // Mặc định check tháng hiện tại để tiện theo dõi
        const isChecked = (m === currentMonth) ? 'checked' : '';
        
        html += `
        <label class="inline-flex items-center bg-white border border-gray-200 rounded px-3 py-1.5 cursor-pointer hover:border-[#5d4037] transition-colors select-none">
            <input type="checkbox" name="reportMonth" value="${m}" ${isChecked} class="w-4 h-4 accent-[#5d4037] mr-2">
            <span class="text-xs font-bold text-[#3e2723]">T${parseInt(mo)}/${y}</span>
        </label>`;
    });

    container.innerHTML = html;
};

// ============================================================
// 2. LOGIC LỌC DỮ LIỆU TRUNG TÂM (CORE FILTERING)
// ============================================================

// Hàm này trả về danh sách phiếu khám (visits) đã được lọc theo tiêu chí hiện tại
window.getFilteredData = function() {
    if (!window.db) return [];

    const mode = document.getElementById('reportFilterMode').value;
    const sortType = document.getElementById('anaSortBy').value;
    let filteredVisits = [];

    // 1. Gom tất cả visits từ tất cả bệnh nhân (Flatten Data)
    const allVisits = [];
    window.db.forEach(p => {
        if (p.visits) {
            p.visits.forEach(v => {
                allVisits.push({
                    ...v,
                    patientName: p.name,
                    patientYear: p.year,
                    timestamp: new Date(v.date).getTime()
                });
            });
        }
    });

    // 2. Áp dụng bộ lọc dựa trên Mode
    if (mode === 'quick') {
        // --- CHẾ ĐỘ NHANH ---
        const type = document.getElementById('anaTimeFilter').value;
        const now = new Date();
        const todayStr = window.getLocalDate();
        const currentMonthStr = todayStr.slice(0, 7);
        
        // Tính tháng trước
        const lastMonthDate = new Date(now.getFullYear(), now.getMonth() - 1, 1);
        const lastMonthStr = lastMonthDate.toISOString().slice(0, 7);

        filteredVisits = allVisits.filter(v => {
            if (type === 'all') return true;
            if (type === 'today') return v.date === todayStr;
            if (type === 'this_month') return v.date.startsWith(currentMonthStr);
            if (type === 'last_month') return v.date.startsWith(lastMonthStr);
            return true;
        });

    } else if (mode === 'range') {
        // --- CHẾ ĐỘ KHOẢNG NGÀY ---
        const start = document.getElementById('reportStartDate').value;
        const end = document.getElementById('reportEndDate').value;
        
        if (start && end) {
            // So sánh chuỗi ngày (YYYY-MM-DD) hoạt động tốt
            filteredVisits = allVisits.filter(v => v.date >= start && v.date <= end);
        } else {
            filteredVisits = allVisits; // Nếu chưa chọn ngày thì lấy hết
        }

    } else if (mode === 'multi') {
        // --- CHẾ ĐỘ ĐA THÁNG ---
        // Lấy danh sách các tháng được check trong UI
        const checkboxes = document.querySelectorAll('input[name="reportMonth"]:checked');
        const selectedMonths = Array.from(checkboxes).map(cb => cb.value); // VD: ['2026-01', '2026-02']

        if (selectedMonths.length > 0) {
            filteredVisits = allVisits.filter(v => {
                const vMonth = v.date.slice(0, 7);
                return selectedMonths.includes(vMonth);
            });
        } else {
            filteredVisits = []; // Không chọn tháng nào -> Rỗng
        }
    }

    // 3. Sắp xếp kết quả
    filteredVisits.sort((a, b) => {
        if (sortType === 'date_asc') return a.timestamp - b.timestamp; // Cũ nhất trước
        if (sortType === 'total_desc') return b.total - a.total; // Doanh thu cao trước
        return b.timestamp - a.timestamp; // Mặc định: Mới nhất trước (date_desc)
    });

    return filteredVisits;
};

// ============================================================
// 3. RENDER GIAO DIỆN & BIỂU ĐỒ
// ============================================================

// Hàm điều phối chính: Lấy dữ liệu -> Vẽ bảng -> Vẽ biểu đồ
window.renderAnalytics = function() {
    const visits = window.getFilteredData();
    window.renderAnalyticsTable(visits);
    window.renderAnalyticsChart(visits);
};

// Render bảng chi tiết
window.renderAnalyticsTable = function(visits) {
    const tbody = document.getElementById('anaTableBody');
    if (!tbody) return;

    if (visits.length === 0) {
        tbody.innerHTML = '<tr><td colspan="6" class="text-center py-8 text-gray-400 italic">Không có dữ liệu trong khoảng thời gian này.</td></tr>';
        return;
    }

    let totalRev = 0, totalProfit = 0;

    const html = visits.map(v => {
        const profit = (v.total || 0) - (v.cost || 0);
        totalRev += (v.total || 0);
        totalProfit += profit;

        return `
            <tr class="hover:bg-gray-50 transition-colors border-b border-gray-50">
                <td class="p-3 whitespace-nowrap text-gray-600 font-mono text-xs">${v.date}</td>
                <td class="p-3 font-bold text-[#3e2723]">${v.patientName} <span class="text-gray-400 font-normal text-xs">(${v.patientYear || '?'})</span></td>
                <td class="p-3 text-gray-600 text-xs max-w-[150px] truncate" title="${v.disease}">${v.disease || ''}</td>
                <td class="p-3 text-center">${v.paid ? '<span class="text-green-500 font-bold">✓</span>' : '<span class="text-red-400 font-bold">✗</span>'}</td>
                <td class="p-3 text-right font-mono font-bold text-[#3e2723]">${(v.total||0).toLocaleString()}</td>
                <td class="p-3 text-right font-mono text-green-700">${profit.toLocaleString()}</td>
            </tr>
        `;
    }).join('');

    const footer = `
        <tr class="bg-[#fdfbf7] font-bold text-[#5d4037] border-t-2 border-[#d7ccc8]">
            <td class="p-3 text-right uppercase text-xs tracking-wider" colspan="4">Tổng cộng (${visits.length} phiếu)</td>
            <td class="p-3 text-right text-base">${totalRev.toLocaleString()}</td>
            <td class="p-3 text-right text-base">${totalProfit.toLocaleString()}</td>
        </tr>
    `;

    tbody.innerHTML = html + footer;
};

// Render biểu đồ cột (Chart.js)
window.renderAnalyticsChart = function(visits) {
    const ctx = document.getElementById('analyticsChart');
    if (!ctx) return;

    // Gộp dữ liệu theo Ngày để vẽ biểu đồ
    const dataMap = {}; 
    visits.forEach(v => {
        if (!dataMap[v.date]) dataMap[v.date] = { rev: 0, prof: 0 };
        dataMap[v.date].rev += (v.total || 0);
        dataMap[v.date].prof += ((v.total || 0) - (v.cost || 0));
    });

    // Sắp xếp ngày tăng dần (để biểu đồ chạy từ trái sang phải theo thời gian)
    const sortedDates = Object.keys(dataMap).sort();
    
    const labels = sortedDates.map(d => {
        const parts = d.split('-'); // YYYY-MM-DD
        return `${parts[2]}/${parts[1]}`; // DD/MM
    });
    const dataRev = sortedDates.map(d => dataMap[d].rev);
    const dataProf = sortedDates.map(d => dataMap[d].prof);

    // Hủy biểu đồ cũ nếu có để vẽ lại
    if (myChart) myChart.destroy();

    myChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [
                {
                    label: 'Doanh Thu',
                    data: dataRev,
                    backgroundColor: 'rgba(93, 64, 55, 0.8)',
                    borderRadius: 4,
                    order: 2
                },
                {
                    label: 'Lợi Nhuận',
                    data: dataProf,
                    type: 'line', // Vẽ đường lợi nhuận đè lên cột doanh thu
                    borderColor: '#2e7d32',
                    backgroundColor: 'rgba(46, 125, 50, 0.1)',
                    borderWidth: 2,
                    pointBackgroundColor: '#fff',
                    pointBorderColor: '#2e7d32',
                    pointRadius: 4,
                    tension: 0.3, // Đường cong mềm
                    fill: true,
                    order: 1
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { position: 'top', labels: { boxWidth: 12, usePointStyle: true } },
                tooltip: { 
                    mode: 'index', 
                    intersect: false,
                    callbacks: {
                        label: function(context) {
                            return context.dataset.label + ': ' + context.parsed.y.toLocaleString() + ' đ';
                        }
                    }
                }
            },
            scales: {
                y: { beginAtZero: true, grid: { color: '#f0f0f0' } },
                x: { grid: { display: false } }
            },
            interaction: {
                mode: 'nearest',
                axis: 'x',
                intersect: false
            }
        }
    });
};

// ============================================================
// 4. XUẤT EXCEL (Sử dụng dữ liệu đã lọc)
// ============================================================

window.exportToExcel = function() {
    // Lấy đúng dữ liệu đang hiển thị trên bảng
    const visits = window.getFilteredData();
    
    if (visits.length === 0) { 
        alert("Không có dữ liệu để xuất!"); 
        return; 
    }

    // Chuẩn bị dữ liệu cho Excel
    const data = visits.map(v => ({
        'Ngày': v.date,
        'Họ Tên': v.patientName,
        'Năm Sinh': v.patientYear,
        'Chẩn Đoán': v.disease,
        'Tổng Tiền': v.total,
        'Tiền Vốn': v.cost || 0,
        'Lợi Nhuận': (v.total || 0) - (v.cost || 0),
        'Trạng Thái': v.paid ? 'Đã thu' : 'Nợ'
    }));

    const ws = XLSX.utils.json_to_sheet(data);
    
    // Chỉnh độ rộng cột
    const wscols = [
        {wch:12}, // Ngày
        {wch:20}, // Tên
        {wch:10}, // Năm sinh
        {wch:25}, // Chẩn đoán
        {wch:12}, // Tổng tiền
        {wch:12}, // Vốn
        {wch:12}, // Lãi
        {wch:10}  // Trạng thái
    ];
    ws['!cols'] = wscols;

    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "BaoCao_YHCT");
    
    // Tạo tên file có timestamp
    const timeStr = new Date().toISOString().slice(0,19).replace(/:/g,"-");
    XLSX.writeFile(wb, `BaoCao_YHCT_${timeStr}.xlsx`);
};
