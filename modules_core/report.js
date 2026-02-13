/**
 * FILE: modules_core/report.js
 * CHỨC NĂNG: Thống kê, Báo cáo đa chế độ (Range, Multi-month, TCM Deep Dive) & Xuất Excel.
 * CẬP NHẬT: Tách module Báo cáo thuốc Bắc chuyên sâu (Vốn, Lãi, Công sắc).
 */

let myChart = null;

// ============================================================
// 1. QUẢN LÝ GIAO DIỆN BỘ LỌC
// ============================================================

window.openStats = function() {
    document.getElementById('analyticsModal').classList.add('active');
    
    // A. Khởi tạo các giá trị mặc định cho Date Range
    const today = new Date();
    const firstDay = new Date(today.getFullYear(), today.getMonth(), 1); 
    
    if(document.getElementById('reportStartDate')) 
        document.getElementById('reportStartDate').value = firstDay.toISOString().split('T')[0];
    if(document.getElementById('reportEndDate')) 
        document.getElementById('reportEndDate').value = window.getLocalDate();

    // B. Quét DB để tạo checkbox cho chế độ "Chọn Nhiều Tháng"
    window.initMultiMonthCheckboxes();
    
    // C. Mặc định chọn chế độ "Xem Nhanh"
    document.getElementById('reportFilterMode').value = 'quick';
    window.toggleReportFilterMode();
    
    // D. Render báo cáo lần đầu
    window.renderAnalytics();
};

window.toggleReportFilterMode = function() {
    const mode = document.getElementById('reportFilterMode').value;
    
    // Ẩn tất cả filter box
    document.querySelectorAll('.filter-group').forEach(el => el.classList.add('hidden'));
    
    // Logic hiển thị filter tương ứng
    if (mode === 'quick') {
        document.getElementById('filterBox_quick').classList.remove('hidden');
    } else if (mode === 'multi') {
        document.getElementById('filterBox_multi').classList.remove('hidden');
    } else {
        // Cả 'range' và 'tcm_deep' đều dùng chung bộ chọn Ngày
        document.getElementById('filterBox_range').classList.remove('hidden');
    }

    // Ẩn/Hiện Biểu đồ & Sort (TCM Report không cần biểu đồ chung)
    const chartContainer = document.getElementById('chartContainer');
    const sortBox = document.getElementById('anaSortBy');
    const tableTitle = document.getElementById('tableTitle');
    
    if (mode === 'tcm_deep') {
        if(chartContainer) chartContainer.classList.add('hidden');
        if(sortBox) sortBox.parentElement.classList.add('hidden'); // Ẩn cả dòng sort
        if(tableTitle) tableTitle.innerText = "CHI TIẾT LỢI NHUẬN ĐƠN THUỐC BẮC";
    } else {
        if(chartContainer) chartContainer.classList.remove('hidden');
        if(sortBox) sortBox.parentElement.classList.remove('hidden');
        if(tableTitle) tableTitle.innerText = "CHI TIẾT PHIẾU KHÁM";
    }
};

window.initMultiMonthCheckboxes = function() {
    const container = document.getElementById('multiMonthContainer');
    if (!container || !window.db) return;

    const months = new Set();
    window.db.forEach(p => {
        if (p.visits) {
            p.visits.forEach(v => {
                if (v.date && v.date.length >= 7) months.add(v.date.slice(0, 7));
            });
        }
    });

    const sortedMonths = Array.from(months).sort().reverse();
    if (sortedMonths.length === 0) {
        container.innerHTML = '<span class="text-xs text-gray-400">Chưa có dữ liệu khám.</span>';
        return;
    }

    const currentMonth = window.getLocalDate().slice(0, 7);
    container.innerHTML = sortedMonths.map(m => {
        const [y, mo] = m.split('-');
        const isChecked = (m === currentMonth) ? 'checked' : '';
        return `
        <label class="inline-flex items-center bg-white border border-gray-200 rounded px-3 py-1.5 cursor-pointer hover:border-[#5d4037] transition-colors select-none">
            <input type="checkbox" name="reportMonth" value="${m}" ${isChecked} class="w-4 h-4 accent-[#5d4037] mr-2">
            <span class="text-xs font-bold text-[#3e2723]">T${parseInt(mo)}/${y}</span>
        </label>`;
    }).join('');
};

// ============================================================
// 2. LOGIC LỌC DỮ LIỆU (CORE FILTERING)
// ============================================================

window.getFilteredData = function() {
    if (!window.db) return [];

    const mode = document.getElementById('reportFilterMode').value;
    const sortType = document.getElementById('anaSortBy').value;
    
    // 1. Flatten Data
    const allVisits = [];
    window.db.forEach(p => {
        if (p.visits) {
            p.visits.forEach(v => {
                allVisits.push({ ...v, patientName: p.name, patientYear: p.year, timestamp: new Date(v.date).getTime() });
            });
        }
    });

    let filteredVisits = [];

    // 2. Filter Logic
    if (mode === 'quick') {
        const type = document.getElementById('anaTimeFilter').value;
        const todayStr = window.getLocalDate();
        const currentMonthStr = todayStr.slice(0, 7);
        const lastMonthDate = new Date(); lastMonthDate.setMonth(lastMonthDate.getMonth() - 1);
        const lastMonthStr = lastMonthDate.toISOString().slice(0, 7);

        filteredVisits = allVisits.filter(v => {
            if (type === 'today') return v.date === todayStr;
            if (type === 'this_month') return v.date.startsWith(currentMonthStr);
            if (type === 'last_month') return v.date.startsWith(lastMonthStr);
            return true;
        });
    } else if (mode === 'range' || mode === 'tcm_deep') {
        const start = document.getElementById('reportStartDate').value;
        const end = document.getElementById('reportEndDate').value;
        if (start && end) filteredVisits = allVisits.filter(v => v.date >= start && v.date <= end);
        else filteredVisits = allVisits;
        
        // Nếu là mode thuốc bắc, lọc thêm điều kiện có thuốc Đông y
        if (mode === 'tcm_deep') {
            filteredVisits = filteredVisits.filter(v => v.rxEast && v.rxEast.length > 0);
        }
    } else if (mode === 'multi') {
        const selectedMonths = Array.from(document.querySelectorAll('input[name="reportMonth"]:checked')).map(cb => cb.value);
        if (selectedMonths.length > 0) filteredVisits = allVisits.filter(v => selectedMonths.includes(v.date.slice(0, 7)));
    }

    // 3. Sorting (Chỉ áp dụng cho các mode thường, mode TCM sẽ sort theo ngày mặc định)
    if (mode !== 'tcm_deep') {
        filteredVisits.sort((a, b) => {
            if (sortType === 'date_asc') return a.timestamp - b.timestamp;
            if (sortType === 'total_desc') return b.total - a.total;
            return b.timestamp - a.timestamp;
        });
    } else {
        // Sort TCM: Mới nhất lên đầu
        filteredVisits.sort((a, b) => b.timestamp - a.timestamp);
    }

    return filteredVisits;
};

// ============================================================
// 3. RENDER GIAO DIỆN CHÍNH
// ============================================================

window.renderAnalytics = function() {
    const mode = document.getElementById('reportFilterMode').value;
    const visits = window.getFilteredData();
    
    if (mode === 'tcm_deep') {
        window.renderTCMReport(visits);
    } else {
        window.renderStandardReport(visits);
        window.renderAnalyticsChart(visits);
    }
};

// --- A. BÁO CÁO THƯỜNG (STANDARD) ---
window.renderStandardReport = function(visits) {
    // 1. Reset Header
    const headerRow = document.getElementById('reportHeaderRow');
    if(headerRow) {
        headerRow.innerHTML = `
            <th class="p-3 border-b border-[#d7ccc8]">Ngày</th>
            <th class="p-3 border-b border-[#d7ccc8]">Bệnh Nhân</th>
            <th class="p-3 border-b border-[#d7ccc8]">Chẩn Đoán</th>
            <th class="p-3 border-b border-[#d7ccc8] text-center">TT</th>
            <th class="p-3 border-b border-[#d7ccc8] text-right">Doanh Thu</th>
            <th class="p-3 border-b border-[#d7ccc8] text-right">Lợi Nhuận</th>
        `;
    }

    const tbody = document.getElementById('anaTableBody');
    if (!tbody) return;

    if (visits.length === 0) {
        tbody.innerHTML = '<tr><td colspan="6" class="text-center py-8 text-gray-400 italic">Không có dữ liệu.</td></tr>';
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
            </tr>`;
    }).join('');

    const footer = `
        <tr class="bg-[#fdfbf7] font-bold text-[#5d4037] border-t-2 border-[#d7ccc8]">
            <td class="p-3 text-right uppercase text-xs tracking-wider" colspan="4">Tổng cộng</td>
            <td class="p-3 text-right text-base">${totalRev.toLocaleString()}</td>
            <td class="p-3 text-right text-base">${totalProfit.toLocaleString()}</td>
        </tr>`;
    tbody.innerHTML = html + footer;
};

// --- B. BÁO CÁO THUỐC BẮC CHUYÊN SÂU (TCM DEEP) ---
window.renderTCMReport = function(visits) {
    // 1. Đổi Header Bảng
    const headerRow = document.getElementById('reportHeaderRow');
    if(headerRow) {
        headerRow.innerHTML = `
            <th class="p-3 border-b border-[#d7ccc8]">Ngày/BN</th>
            <th class="p-3 border-b border-[#d7ccc8]">Đơn Thuốc & CĐ</th>
            <th class="p-3 border-b border-[#d7ccc8] text-center">Thang</th>
            <th class="p-3 border-b border-[#d7ccc8] text-right text-gray-500">Vốn</th>
            <th class="p-3 border-b border-[#d7ccc8] text-right text-orange-600">Công Sắc</th>
            <th class="p-3 border-b border-[#d7ccc8] text-right">Tổng Thu</th>
            <th class="p-3 border-b border-[#d7ccc8] text-right text-green-700">Tiền Lời</th>
        `;
    }

    const tbody = document.getElementById('anaTableBody');
    if (!tbody) return;

    if (visits.length === 0) {
        tbody.innerHTML = '<tr><td colspan="7" class="text-center py-8 text-gray-400 italic">Không có đơn thuốc Bắc nào trong khoảng này.</td></tr>';
        return;
    }

    // Biến tổng kết
    let sumTotal = 0;   // Tổng thu thực tế (của riêng phần thuốc bắc + sắc)
    let sumCost = 0;    // Tổng vốn
    let sumSac = 0;     // Tổng tiền công sắc
    let sumProfit = 0;  // Tổng lợi nhuận

    const html = visits.map((v, index) => {
        // Tính toán các chỉ số
        // 1. Doanh thu thuốc (Không tính sắc): Lấy medPriceEast (đã tính ở visit-finish.js)
        const medRevenue = v.medPriceEast || 0;
        
        // 2. Tiền công sắc: Lấy từ state đã lưu
        const sacRevenue = (v.isSacThuoc && v.sacQty && v.sacPrice) ? (v.sacQty * v.sacPrice) : 0;
        
        // 3. Vốn: Lấy v.cost (Giá vốn tổng). 
        // Lưu ý: Nếu đơn có cả Tây y thì v.cost là tổng vốn. Ở đây ta tạm chấp nhận v.cost là vốn của đơn này.
        const cost = v.cost || 0;
        
        // 4. Tổng thu dòng này (Thuốc + Sắc)
        const rowTotal = medRevenue + sacRevenue;
        
        // 5. Lợi nhuận (Tổng thu - Vốn) 
        // *Lưu ý: Tiền sắc cũng được tính vào doanh thu để trừ vốn, phần còn lại là lãi ròng.
        const profit = rowTotal - cost;

        // Cộng dồn tổng
        sumTotal += rowTotal;
        sumCost += cost;
        sumSac += sacRevenue;
        sumProfit += profit;

        // Xử lý hiển thị tên bài thuốc tóm tắt
        let prescriptionSummary = `${v.rxEast.length} vị`;
        if (v.rxEast.length > 0) prescriptionSummary = `${v.rxEast[0].name} ... (+${v.rxEast.length-1})`;

        return `
            <tr class="hover:bg-gray-50 transition-colors border-b border-gray-50">
                <td class="p-3">
                    <div class="font-bold text-[#3e2723] text-sm">${v.patientName}</div>
                    <div class="text-[10px] text-gray-500 font-mono">${v.date}</div>
                </td>
                <td class="p-3">
                    <div class="text-xs font-bold text-[#5d4037] truncate max-w-[180px]">${v.disease}</div>
                    <div class="flex items-center gap-2 mt-1">
                        <span class="text-[10px] bg-gray-100 px-2 rounded text-gray-600">${prescriptionSummary}</span>
                        <button onclick="window.showPrescriptionDetail('${v.patientName}', ${index})" class="text-[10px] text-blue-600 hover:underline font-bold">Xem chi tiết</button>
                    </div>
                </td>
                <td class="p-3 text-center font-bold text-[#3e2723]">${v.eastDays}</td>
                <td class="p-3 text-right font-mono text-xs text-gray-500">${cost.toLocaleString()}</td>
                <td class="p-3 text-right font-mono text-xs text-orange-600 font-bold">${sacRevenue > 0 ? sacRevenue.toLocaleString() : '-'}</td>
                <td class="p-3 text-right font-mono font-bold text-[#3e2723]">${rowTotal.toLocaleString()}</td>
                <td class="p-3 text-right font-mono text-green-700 font-bold">${profit.toLocaleString()}</td>
            </tr>`;
    }).join('');

    // Dòng tổng kết chuyên sâu
    const footer = `
        <tr class="bg-[#fdfbf7] border-t-2 border-[#d7ccc8]">
            <td class="p-3 text-right uppercase text-[10px] font-bold tracking-wider text-gray-500" colspan="3">Tổng kết kỳ báo cáo</td>
            <td class="p-3 text-right text-xs font-bold text-gray-500">${sumCost.toLocaleString()}</td>
            <td class="p-3 text-right text-xs font-bold text-orange-600">${sumSac.toLocaleString()}</td>
            <td class="p-3 text-right text-sm font-black text-[#3e2723]">${sumTotal.toLocaleString()}</td>
            <td class="p-3 text-right text-sm font-black text-green-700 bg-green-50">${sumProfit.toLocaleString()}</td>
        </tr>
    `;
    tbody.innerHTML = html + footer;
    
    // Lưu tạm danh sách visits hiện tại vào biến window để popup dùng lại
    window.currentReportVisits = visits;
};

// ============================================================
// 4. POPUP CHI TIẾT ĐƠN THUỐC
// ============================================================

window.showPrescriptionDetail = function(pName, index) {
    const visits = window.currentReportVisits || [];
    const v = visits[index];
    if (!v) return;

    const modal = document.getElementById('viewPrescriptionModal');
    const content = document.getElementById('prescriptionDetailContent');
    
    if (modal && content) {
        let html = `
            <div class="mb-3 pb-2 border-b border-dashed border-gray-200">
                <div class="font-bold text-[#3e2723] text-sm uppercase">BN: ${pName}</div>
                <div class="text-xs text-gray-500">Chẩn đoán: ${v.disease}</div>
            </div>
            <table class="w-full text-xs">
                <thead class="bg-gray-50 text-gray-500 font-bold">
                    <tr><th class="py-1 text-left">Vị thuốc</th><th class="py-1 text-right">SL (g)</th></tr>
                </thead>
                <tbody class="divide-y divide-gray-100">
        `;
        
        v.rxEast.forEach(m => {
            html += `<tr><td class="py-1.5 font-medium text-[#3e2723]">${m.name}</td><td class="py-1.5 text-right font-mono">${m.qty}</td></tr>`;
        });
        
        html += `</tbody></table>`;
        
        if (v.eastNote) {
            html += `<div class="mt-3 p-2 bg-yellow-50 text-[10px] text-yellow-800 italic rounded border border-yellow-100">Note: ${v.eastNote}</div>`;
        }

        content.innerHTML = html;
        modal.classList.add('active');
    }
};

// ============================================================
// 5. RENDER BIỂU ĐỒ & XUẤT EXCEL (GIỮ NGUYÊN TỪ CŨ)
// ============================================================

window.renderAnalyticsChart = function(visits) {
    const ctx = document.getElementById('analyticsChart');
    if (!ctx) return;
    
    // Hủy biểu đồ cũ nếu có
    if (myChart) { myChart.destroy(); myChart = null; }

    const dataMap = {}; 
    visits.forEach(v => {
        if (!dataMap[v.date]) dataMap[v.date] = { rev: 0, prof: 0 };
        dataMap[v.date].rev += (v.total || 0);
        dataMap[v.date].prof += ((v.total || 0) - (v.cost || 0));
    });

    const sortedDates = Object.keys(dataMap).sort();
    const labels = sortedDates.map(d => `${d.split('-')[2]}/${d.split('-')[1]}`);
    const dataRev = sortedDates.map(d => dataMap[d].rev);
    const dataProf = sortedDates.map(d => dataMap[d].prof);

    myChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [
                { label: 'Doanh Thu', data: dataRev, backgroundColor: 'rgba(93, 64, 55, 0.8)', borderRadius: 4, order: 2 },
                { label: 'Lợi Nhuận', data: dataProf, type: 'line', borderColor: '#2e7d32', backgroundColor: 'rgba(46, 125, 50, 0.1)', borderWidth: 2, tension: 0.3, fill: true, order: 1 }
            ]
        },
        options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { position: 'top' } }, scales: { y: { beginAtZero: true } } }
    });
};

window.exportToExcel = function() {
    const visits = window.getFilteredData();
    if (visits.length === 0) { alert("Không có dữ liệu để xuất!"); return; }

    const data = visits.map(v => ({
        'Ngày': v.date, 'Họ Tên': v.patientName, 'Năm Sinh': v.patientYear,
        'Chẩn Đoán': v.disease, 'Tổng Tiền': v.total, 'Tiền Vốn': v.cost || 0,
        'Lợi Nhuận': (v.total || 0) - (v.cost || 0), 'Trạng Thái': v.paid ? 'Đã thu' : 'Nợ'
    }));

    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "BaoCao_YHCT");
    XLSX.writeFile(wb, `BaoCao_YHCT_${new Date().toISOString().slice(0,19).replace(/:/g,"-")}.xlsx`);
};
