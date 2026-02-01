/**
 * FILE: modules_core/report.js
 * CHỨC NĂNG: Thống kê, Báo cáo, Vẽ biểu đồ, Xuất Excel.
 * THƯ MỤC: modules_core/
 */

// --- 1. BIẾN TOÀN CỤC CHO CHART ---
let myChart = null;

// --- 2. HÀM RENDER CHÍNH ---
window.openStats = function() {
    document.getElementById('analyticsModal').classList.add('active');
    window.renderAnalytics();
};

window.renderAnalytics = function() {
    if (!window.db) return;

    const filterType = document.getElementById('anaTimeFilter').value; // 'today', 'month', 'all'
    const sortType = document.getElementById('anaSortBy').value;       
    
    // TÍNH TOÁN CHỈ SỐ BỆNH NHÂN
    const patientStats = {};
    window.db.forEach(p => {
        const visits = p.visits || [];
        const totalSpent = visits.reduce((sum, v) => sum + (v.total || 0), 0);
        patientStats[p.id] = {
            visitCount: visits.length,
            totalLifeTimeSpent: totalSpent
        };
    });

    // GOM DỮ LIỆU CHUYẾN KHÁM (FLATTEN DATA)
    let allVisits = [];
    window.db.forEach(p => {
        if (p.visits && p.visits.length > 0) {
            p.visits.forEach(v => {
                allVisits.push({
                    ...v,
                    patientName: p.name,
                    patientYear: parseInt(p.year) || 0,
                    timestamp: new Date(v.date).getTime(),
                    pVisitCount: patientStats[p.id].visitCount,
                    pTotalSpent: patientStats[p.id].totalLifeTimeSpent
                });
            });
        }
    });

    // LỌC DỮ LIỆU (FILTER THỜI GIAN)
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();
    const todayStr = window.getLocalDate();

    let filteredVisits = allVisits.filter(v => {
        if (!v.date) return false;
        const vDate = new Date(v.date);
        
        if (filterType === 'today') {
            return v.date === todayStr;
        } else if (filterType === 'month') {
            return vDate.getMonth() === currentMonth && vDate.getFullYear() === currentYear;
        } else {
            return true; // 'all'
        }
    });

    // SẮP XẾP DỮ LIỆU (SORTING LOGIC)
    filteredVisits.sort((a, b) => {
        switch (sortType) {
            case 'date_desc': return b.timestamp - a.timestamp;
            case 'total_desc': return b.total - a.total;
            default: return b.timestamp - a.timestamp;
        }
    });

    window.renderAnalyticsTable(filteredVisits);
    window.renderAnalyticsChart(filteredVisits, filterType);
};

// --- 3. RENDER BẢNG DỮ LIỆU ---
window.renderAnalyticsTable = function(visits) {
    const tbody = document.getElementById('anaTableBody');
    if (!tbody) return;

    let totalRevenue = 0;
    let totalProfit = 0;

    const html = visits.map(v => {
        const profit = (v.total || 0) - (v.cost || 0);
        totalRevenue += (v.total || 0);
        totalProfit += profit;

        let badge = '';
        if (v.pTotalSpent > 5000000) badge = '<span class="text-[9px] bg-yellow-100 text-yellow-700 px-1 rounded ml-1 border border-yellow-200">VIP</span>';

        return `
            <tr class="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                <td class="p-2 whitespace-nowrap text-gray-600 text-xs">${v.date}</td>
                <td class="p-2 font-bold text-[#3e2723]">
                    ${v.patientName} ${badge}
                </td>
                <td class="p-2 text-center text-gray-500">${v.patientYear || '-'}</td>
                <td class="p-2 text-gray-600 max-w-[150px] truncate text-xs" title="${v.disease}">${v.disease || ''}</td>
                <td class="p-2 text-center">
                    ${v.paid ? '<span class="text-green-600 font-bold">✓</span>' : '<span class="text-red-500 font-bold">✗</span>'}
                </td>
                <td class="p-2 text-right font-mono font-bold text-[#3e2723]">${(v.total || 0).toLocaleString()}</td>
                <td class="p-2 text-right font-mono text-green-700">${profit.toLocaleString()}</td>
            </tr>
        `;
    }).join('');

    const footerRow = `
        <tr class="bg-[#f2ebe0] font-bold text-[#5d4037] border-t-2 border-[#d7ccc8]">
            <td class="p-2" colspan="5">TỔNG CỘNG (${visits.length} lượt)</td>
            <td class="p-2 text-right">${totalRevenue.toLocaleString()}</td>
            <td class="p-2 text-right">${totalProfit.toLocaleString()}</td>
        </tr>
    `;

    tbody.innerHTML = html + footerRow;
};

// --- 4. VẼ BIỂU ĐỒ (CHART.JS) ---
window.renderAnalyticsChart = function(visits, filterType) {
    const ctx = document.getElementById('analyticsChart');
    if (!ctx) return;

    let labels = [];
    let dataRevenue = [];
    let dataProfit = [];
    let groupingMap = {};

    if (filterType === 'today') {
        const chartData = visits.slice(0, 15); 
        chartData.forEach((v) => {
            labels.push(v.patientName);
            dataRevenue.push(v.total || 0);
            dataProfit.push((v.total || 0) - (v.cost || 0));
        });
    } else if (filterType === 'month') {
        visits.forEach(v => {
            const day = parseInt(v.date.split('-')[2]); 
            if (!groupingMap[day]) groupingMap[day] = { rev: 0, prof: 0 };
            groupingMap[day].rev += (v.total || 0);
            groupingMap[day].prof += ((v.total || 0) - (v.cost || 0));
        });
        Object.keys(groupingMap).sort((a,b) => a-b).forEach(day => {
            labels.push(`Ngày ${day}`);
            dataRevenue.push(groupingMap[day].rev);
            dataProfit.push(groupingMap[day].prof);
        });
    } else {
        visits.forEach(v => {
            const dateParts = v.date.split('-');
            const key = `${dateParts[0]}-${dateParts[1]}`; 
            if (!groupingMap[key]) groupingMap[key] = { rev: 0, prof: 0 };
            groupingMap[key].rev += (v.total || 0);
            groupingMap[key].prof += ((v.total || 0) - (v.cost || 0));
        });
        Object.keys(groupingMap).sort().forEach(key => {
            const [year, month] = key.split('-');
            labels.push(`T${month}/${year}`);
            dataRevenue.push(groupingMap[key].rev);
            dataProfit.push(groupingMap[key].prof);
        });
    }

    if (myChart) myChart.destroy();

    myChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [
                {
                    label: 'Doanh thu',
                    data: dataRevenue,
                    backgroundColor: 'rgba(93, 64, 55, 0.7)',
                    borderColor: 'rgba(93, 64, 55, 1)',
                    borderWidth: 1,
                    borderRadius: 4
                },
                {
                    label: 'Lợi nhuận',
                    data: dataProfit,
                    backgroundColor: 'rgba(121, 142, 135, 0.7)',
                    borderColor: 'rgba(121, 142, 135, 1)',
                    borderWidth: 1,
                    borderRadius: 4
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { position: 'bottom' },
                title: { display: true, text: 'Biểu đồ Doanh thu' }
            },
            scales: {
                y: { beginAtZero: true }
            }
        }
    });
};

// --- 5. CÔNG CỤ XUẤT EXCEL ---

window.exportToExcel = function() {
    if(!window.db) return;
    const filterType = document.getElementById('anaTimeFilter').value;
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();
    const todayStr = window.getLocalDate();

    let data = [];
    window.db.forEach(p => {
        if(p.visits) {
            p.visits.forEach(v => {
                let include = false;
                const vDate = new Date(v.date);
                if (filterType === 'today' && v.date === todayStr) include = true;
                else if (filterType === 'month' && vDate.getMonth() === currentMonth && vDate.getFullYear() === currentYear) include = true;
                else if (filterType === 'all') include = true;

                if(include) {
                    data.push({
                        'Ngày': v.date,
                        'Họ Tên': p.name,
                        'Năm Sinh': p.year,
                        'Chẩn Đoán': v.disease,
                        'Tổng Tiền': v.total,
                        'Vốn': v.cost || 0,
                        'Lợi Nhuận': (v.total || 0) - (v.cost || 0)
                    });
                }
            });
        }
    });

    if(data.length === 0) { alert("Không có dữ liệu để xuất!"); return; }

    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "BaoCao");
    XLSX.writeFile(wb, `BaoCao_YHCT_${window.getLocalDate()}.xlsx`);
};
