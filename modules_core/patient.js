/**
 * FILE: modules_core/patient.js
 * CHỨC NĂNG: Quản lý bệnh nhân (CRUD, Search, Filter, History).
 * CẬP NHẬT: 
 * - [MỚI] Chức năng Sắp xếp (Sort): Mới nhất / Tên A-Z.
 * - [MỚI] Hiển thị chấm đỏ (🔴) báo hiệu khách có công nợ chưa thanh toán.
 */

window.searchTimeout = null;
window.currentMonthFilter = 'CURRENT';
window.currentSortMode = 'RECENT'; // Mặc định sắp xếp theo lần khám gần nhất

// --- 1. BỘ LỌC THÁNG (MONTH FILTER - NEW UI) ---

window.renderMonthFilterList = function() {
    const container = document.getElementById('monthFilterArea');
    if (!container) return;

    let months = new Set();
    // Mặc định thêm tháng hiện tại để không bị trống
    const currentMonth = window.getLocalDate().slice(0, 7);
    months.add(currentMonth);

    // Quét dữ liệu để lấy các tháng có bệnh nhân
    if (window.db && Array.isArray(window.db)) {
        window.db.forEach(p => {
            if (p.visits && p.visits.length > 0) {
                p.visits.forEach(v => {
                    if (v.date && v.date.length >= 7) {
                        months.add(v.date.slice(0, 7));
                    }
                });
            }
        });
    }

    // Sắp xếp giảm dần (Mới nhất lên đầu)
    const sortedMonths = Array.from(months).sort().reverse();

    // Tạo HTML với cấu trúc thanh trượt
    let html = `<div class="filter-scroll-track" id="filterScrollTrack">`;
    
    // Nút "Tất cả"
    const isAllActive = window.currentMonthFilter === 'ALL';
    html += `
        <button onclick="window.setMonthFilter('ALL')" 
                class="month-pill ${isAllActive ? 'active' : ''}" id="filter-btn-all">
            <span class="icon">📅</span> Tất cả
        </button>`;
    
    // Các nút tháng
    sortedMonths.forEach(m => {
        const [year, month] = m.split('-');
        const isActive = window.currentMonthFilter === m;
        // Format hiển thị: T1/2026
        const label = `T${parseInt(month)}/${year}`;
        // Nếu là tháng hiện tại thì thêm chữ "Nay" cho dễ nhìn
        const extraLabel = (m === currentMonth) ? ' (Nay)' : '';
        
        html += `
            <button onclick="window.setMonthFilter('${m}')" 
                    class="month-pill ${isActive ? 'active' : ''}" 
                    id="filter-btn-${m}">
                ${label}${extraLabel}
            </button>`;
    });

    html += `</div>`;
    container.innerHTML = html;

    // Tự động cuộn đến nút đang chọn (UX Improvement)
    setTimeout(() => {
        const activeBtn = container.querySelector('.month-pill.active');
        const track = document.getElementById('filterScrollTrack');
        if (activeBtn && track) {
            const scrollLeft = activeBtn.offsetLeft - (track.clientWidth / 2) + (activeBtn.clientWidth / 2);
            track.scrollTo({ left: scrollLeft, behavior: 'smooth' });
        }
    }, 100);
};

window.setMonthFilter = function(filter) {
    window.currentMonthFilter = filter;
    window.renderMonthFilterList(); 
    // Sau khi set filter, gọi render để lọc danh sách và update header
    window.render(); 
};

// [MỚI] Hàm xử lý thay đổi chế độ sắp xếp
window.setSortMode = function(mode) {
    window.currentSortMode = mode;
    window.render();
};

// --- 2. HIỂN THỊ DANH SÁCH BỆNH NHÂN (RENDER LIST) ---

window.debouncedRender = function() { 
    clearTimeout(window.searchTimeout); 
    window.searchTimeout = setTimeout(window.render, 250); 
};

window.render = function() {
    if(!window.db) return;
    
    // Nếu chưa có filter (lần đầu vào), set là tháng hiện tại
    if (window.currentMonthFilter === 'CURRENT') {
        window.currentMonthFilter = window.getLocalDate().slice(0, 7);
    }

    const listContainer = document.getElementById('list');
    const searchInput = document.getElementById('search');
    const kw = searchInput ? searchInput.value.toLowerCase() : '';
    
    // A. LỌC DỮ LIỆU (FILTER)
    let filteredList = window.db.filter(p => {
        // 1. Logic tìm kiếm
        const matchesKeyword = p.name.toLowerCase().includes(kw) || (p.phone && p.phone.includes(kw));
        if (!matchesKeyword) return false;

        // 2. Logic lọc tháng
        if (window.currentMonthFilter === 'ALL') return true;
        if (kw.length > 0) return true; // Nếu đang tìm kiếm thì bỏ qua lọc tháng
        
        // Kiểm tra có lần khám nào trong tháng chọn không
        if (p.visits && p.visits.some(v => v.date && v.date.startsWith(window.currentMonthFilter))) {
            return true;
        }
        return false;
    });

    // B. SẮP XẾP DỮ LIỆU (SORT)
    filteredList.sort((a, b) => {
        if (window.currentSortMode === 'NAME') {
            return a.name.localeCompare(b.name);
        } else {
            // RECENT: Lấy ngày khám mới nhất của mỗi người để so sánh
            const dateA = (a.visits && a.visits.length > 0) ? a.visits[0].date : '0000-00-00';
            const dateB = (b.visits && b.visits.length > 0) ? b.visits[0].date : '0000-00-00';
            // Mới nhất lên đầu (Giảm dần)
            return dateB.localeCompare(dateA);
        }
    });

    // C. RENDER HTML
    let htmlContent = `
        <div class="flex justify-between items-center px-2 mb-3">
            <span class="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                ${filteredList.length} Bệnh nhân
            </span>
            <select onchange="window.setSortMode(this.value)" class="text-xs bg-transparent border-none font-bold text-[#5d4037] outline-none cursor-pointer">
                <option value="RECENT" ${window.currentSortMode==='RECENT'?'selected':''}>🕒 Mới khám trước</option>
                <option value="NAME" ${window.currentSortMode==='NAME'?'selected':''}>🅰️ Tên A-Z</option>
            </select>
        </div>
    `;

    const itemsHtml = filteredList.map(p => {
        // [MỚI] Kiểm tra nợ: Nếu có bất kỳ phiếu nào chưa trả (paid == false)
        const hasDebt = p.visits && p.visits.some(v => !v.paid);
        const debtBadge = hasDebt ? `<span class="w-2.5 h-2.5 bg-red-500 rounded-full inline-block ml-2 border border-white shadow-sm align-middle" title="Có khoản chưa thanh toán"></span>` : '';

        return `
        <div class="patient-row">
            <div class="p-info" onclick="window.viewHistory('${p.id}')">
                <h3 class="font-bold text-lg text-[#3e2723] flex items-center">
                    ${p.name} ${debtBadge}
                </h3>
                <p class="text-xs text-[#8d6e63]">
                    ${p.year ? 'SN ' + p.year : ''} ${p.phone ? '• ' + p.phone : ''}
                </p>
            </div>
            <div class="p-actions">
                <button onclick="window.handleEdit('${p.id}',event)" class="act-btn act-edit">SỬA</button>
                <button onclick="window.handleExam('${p.id}',event)" class="act-btn act-exam">KHÁM</button>
                <button onclick="window.handleDelete('${p.id}')" class="act-btn act-del">XÓA</button>
            </div>
        </div>`;
    }).join('');
    
    htmlContent += itemsHtml;

    // Empty State (Trạng thái trống)
    if(filteredList.length === 0) {
        if(kw) htmlContent = `<div class="text-center text-gray-400 mt-10 italic flex flex-col items-center"><span class="text-3xl mb-2">🔍</span>Không tìm thấy bệnh nhân nào khớp với "${kw}".</div>`;
        else htmlContent = `<div class="text-center text-gray-400 mt-10 italic flex flex-col items-center"><span class="text-3xl mb-2">📭</span>Không có bệnh nhân nào khám trong tháng này.<br>Chọn "Tất cả" hoặc thêm mới.</div>`;
    }

    listContainer.innerHTML = htmlContent;

    // Cập nhật nhãn tháng trên Header
    const monthLabel = document.getElementById('monthLabel');
    if(monthLabel) {
        if(window.currentMonthFilter === 'ALL') {
            monthLabel.innerText = "TẤT CẢ THỜI GIAN";
        } else {
            const [y, m] = window.currentMonthFilter.split('-');
            monthLabel.innerText = `DOANH THU THÁNG ${parseInt(m)}`;
        }
    }
    
    // Trigger cập nhật số tiền trên Header ngay khi render xong
    if(window.updateProfitDisplay) window.updateProfitDisplay();
};

// --- 3. THAO TÁC BỆNH NHÂN (CRUD) ---

window.handleEdit = function(id, e) { 
    e.stopPropagation(); 
    window.openPatientModal(id); 
};

window.handleExam = function(id, e) { 
    e.stopPropagation(); 
    if(window.startVisit) window.startVisit(id); 
    else alert("Chức năng khám chưa được tải xong (visit-core.js).");
};

window.handleDelete = async function(id) { 
    if(confirm('Cảnh báo: Xóa bệnh nhân sẽ mất toàn bộ lịch sử khám!\nBạn có chắc chắn muốn xóa?')) { 
        
        // [INVENTORY UPDATE] Hoàn trả kho cho TẤT CẢ các lần khám của bệnh nhân này trước khi xóa
        const p = window.db.find(x => String(x.id) === String(id));
        if (p && p.visits && window.restoreInventoryFromVisit) {
            console.log(`♻️ Đang hoàn trả kho cho ${p.visits.length} lần khám của bệnh nhân ${p.name}...`);
            for (const visit of p.visits) {
                await window.restoreInventoryFromVisit(visit);
            }
        }

        window.db = window.db.filter(x => String(x.id) !== String(id)); 
        if(window.saveDb) await window.saveDb(); 
        window.render(); 
    } 
};

window.openPatientModal = function(id = null) {
    document.getElementById('pEditId').value = id || '';
    if(id) { 
        const p = window.db.find(x => x.id == id); 
        document.getElementById('pName').value = p.name; 
        document.getElementById('pYear').value = p.year; 
        document.getElementById('pPhone').value = p.phone; 
        document.getElementById('pAddress').value = p.address; 
    } else { 
        document.getElementById('pName').value = ''; 
        document.getElementById('pYear').value = ''; 
        document.getElementById('pPhone').value = ''; 
        document.getElementById('pAddress').value = ''; 
    }
    document.getElementById('pModal').classList.add('active');
    setTimeout(() => document.getElementById('pName').focus(), 100);
};

window.savePatient = async function() {
    const name = document.getElementById('pName').value.trim(); 
    if(!name) return alert("Vui lòng nhập tên bệnh nhân!");
    
    const id = document.getElementById('pEditId').value;
    
    const p = { 
        id: id || Date.now().toString(), 
        name: name, 
        year: document.getElementById('pYear').value, 
        phone: document.getElementById('pPhone').value, 
        address: document.getElementById('pAddress').value,
        visits: id ? window.db.find(x => x.id == id).visits : [] 
    };

    if(id) {
        const idx = window.db.findIndex(x => x.id == id);
        if(idx !== -1) window.db[idx] = p;
    } else {
        window.db.unshift(p);
    }

    if(window.saveDb) await window.saveDb(); 
    if(window.closeModals) window.closeModals(); 
    
    document.getElementById('search').value = '';
    window.render();
};

// --- 4. LỊCH SỬ KHÁM BỆNH (HISTORY) ---

window.viewHistory = function(pid) {
    const p = window.db.find(x => x.id == pid);
    if (!p) return;

    document.getElementById('hName').innerText = p.name;
    
    const totalVisits = p.visits ? p.visits.length : 0;
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();
    
    const visitsThisMonth = p.visits ? p.visits.filter(v => {
        const d = new Date(v.date);
        return d.getMonth() === currentMonth && d.getFullYear() === currentYear;
    }).length : 0;

    const summaryHtml = `
        <div class="flex justify-between bg-[#fffcf7] p-4 rounded-xl mb-4 border border-[#d7ccc8] text-xs font-bold text-[#5d4037] shadow-sm">
            <div class="flex flex-col items-center">
                <span class="text-[10px] text-gray-400 uppercase">Tổng lượt</span>
                <span class="text-xl font-black">${totalVisits}</span>
            </div>
            <div class="w-[1px] bg-[#d7ccc8]"></div>
            <div class="flex flex-col items-center">
                <span class="text-[10px] text-gray-400 uppercase">Tháng này</span>
                <span class="text-xl font-black">${visitsThisMonth}</span>
            </div>
        </div>
    `;

    const listHtml = p.visits?.map((v, i) => {
        const stt = totalVisits - i;
        
        const bgClass = v.paid ? 'bg-white border-[#eee]' : 'bg-red-50 border-red-200';
        const paidStatus = v.paid ? '' : '<span class="text-red-500 font-bold ml-2 text-[10px] bg-red-100 px-1 rounded">NỢ</span>';

        return `
        <div class="${bgClass} p-3 rounded-xl border mb-3 shadow-sm relative pl-4 transition-all hover:shadow-md">
            <div class="flex justify-between items-center mb-1">
                <span class="text-[10px] font-bold text-gray-400 bg-gray-100 px-1.5 rounded">#${stt}</span>
                <span class="text-xs font-bold text-[#8d6e63] font-mono">${v.date}</span>
            </div>
            
            <div class="flex justify-between items-start mb-2">
                <div class="font-bold text-[#3e2723] text-sm serif pr-2">${v.disease || 'Chưa chẩn đoán'}</div>
                <div class="text-right">
                    <div class="font-black text-[#3e2723] text-sm font-mono">${parseInt(v.total).toLocaleString()}đ</div>
                    ${paidStatus}
                </div>
            </div>

            <div class="text-[11px] text-gray-500 bg-[#f9f9f9] p-2 rounded mb-2 border border-dotted border-gray-200">
                ${v.rxEast?.length ? `<div class="truncate">🌿 ĐY: ${v.rxEast.length} vị</div>` : ''} 
                ${v.rxWest?.length ? `<div class="truncate">💊 TY: ${v.rxWest.length} loại</div>` : ''} 
                ${v.procs?.length ? `<div class="truncate">💆 TT: ${v.procs.length} dịch vụ</div>` : ''}
            </div>

            <div class="flex gap-2 justify-end pt-2 border-t border-dashed border-gray-200">
                <button onclick="window.closeModals();window.startVisit('${pid}',${v.id})" 
                        class="px-3 py-1.5 bg-[#efebe9] text-[#5d4037] text-[10px] uppercase rounded-lg font-bold border border-[#d7ccc8] hover:bg-[#d7ccc8]">
                    Xem / Sửa
                </button>
                <button onclick="window.deleteVisit('${pid}',${v.id})" 
                        class="px-3 py-1.5 bg-white text-red-600 text-[10px] uppercase rounded-lg font-bold border border-red-100 hover:bg-red-50">
                    Xóa
                </button>
            </div>
        </div>`;
    }).join('') || '<div class="flex flex-col items-center justify-center py-10 text-gray-300"><span class="text-4xl mb-2">📭</span><span class="text-xs">Chưa có lịch sử</span></div>';
    
    document.getElementById('hContent').innerHTML = summaryHtml + listHtml;
    document.getElementById('hModal').classList.add('active');
};

window.deleteVisit = async function(pid, vid) { 
    if(confirm("Bạn có chắc muốn xóa lịch sử khám này không? Hành động không thể hoàn tác.")) { 
        const p = window.db.find(x => x.id == pid); 
        if (p && p.visits) {
            // [INVENTORY UPDATE] Tìm visit sắp xóa và hoàn trả kho
            const visitToDelete = p.visits.find(v => v.id == vid);
            if (visitToDelete && window.restoreInventoryFromVisit) {
                await window.restoreInventoryFromVisit(visitToDelete);
            }

            // Xóa khỏi danh sách
            p.visits = p.visits.filter(v => v.id != vid); 
            
            if(window.saveDb) await window.saveDb(); 
            window.viewHistory(pid); 
            window.render(); 
        }
    } 
};
