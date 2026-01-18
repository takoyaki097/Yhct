/**
 * FILE: patient.js
 * CHỨC NĂNG: Quản lý danh sách bệnh nhân, tìm kiếm, bộ lọc tháng và lịch sử khám.
 * CẬP NHẬT: Sửa label tháng hiển thị đầy đủ "THÁNG X".
 */

// --- 1. BIẾN TOÀN CỤC CỦA MODULE ---
let searchTimeout;
let currentMonthFilter = 'CURRENT'; // Giá trị: 'ALL', 'CURRENT' (YYYY-MM), hoặc 'YYYY-MM' cụ thể

// --- 2. BỘ LỌC THÁNG (MONTH FILTER) ---

window.renderMonthFilterList = function() {
    const container = document.getElementById('monthFilterArea');
    if (!container) return;

    // 1. Thu thập tất cả các tháng có trong dữ liệu khám
    let months = new Set();
    
    // Luôn thêm tháng hiện tại để không bị trống
    const currentMonth = window.getLocalDate().slice(0, 7);
    months.add(currentMonth);

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

    // 2. Sắp xếp tháng giảm dần (mới nhất lên đầu)
    const sortedMonths = Array.from(months).sort().reverse();

    // 3. Tạo HTML cho các nút bấm
    let html = `<button onclick="window.setMonthFilter('ALL')" class="month-chip ${currentMonthFilter === 'ALL' ? 'active' : ''}">Tất cả</button>`;
    
    sortedMonths.forEach(m => {
        const [year, month] = m.split('-');
        const label = `T${parseInt(month)}/${year}`;
        html += `<button onclick="window.setMonthFilter('${m}')" class="month-chip ${currentMonthFilter === m ? 'active' : ''}">${label}</button>`;
    });

    container.innerHTML = html;
};

window.setMonthFilter = function(filter) {
    currentMonthFilter = filter;
    window.renderMonthFilterList(); // Render lại để cập nhật trạng thái active của nút
    window.render(); // Render lại danh sách bệnh nhân
};

// --- 3. HIỂN THỊ DANH SÁCH BỆNH NHÂN (RENDER LIST) ---

// Debounce giúp tránh giật lag khi gõ tìm kiếm liên tục
window.debouncedRender = function() { 
    clearTimeout(searchTimeout); 
    searchTimeout = setTimeout(window.render, 250); 
};

window.render = function() {
    if(!window.db) return;
    
    // Nếu chưa có filter tháng hiện tại, set mặc định là tháng này
    if (currentMonthFilter === 'CURRENT') {
        currentMonthFilter = window.getLocalDate().slice(0, 7);
    }

    const list = document.getElementById('list');
    const searchInput = document.getElementById('search');
    const kw = searchInput ? searchInput.value.toLowerCase() : '';
    
    list.innerHTML = window.db.map(p => {
        // 1. Lọc theo từ khóa tìm kiếm (Tên hoặc SĐT)
        const matchesKeyword = p.name.toLowerCase().includes(kw) || (p.phone && p.phone.includes(kw));
        
        if (!matchesKeyword) return '';

        // 2. Lọc theo tháng (Chỉ hiện bệnh nhân có lịch sử khám trong tháng đó)
        let showPatient = false;

        if (currentMonthFilter === 'ALL') {
            showPatient = true; 
        } else {
            // Nếu bệnh nhân có ít nhất 1 lần khám trùng khớp với tháng đang chọn
            if (p.visits && p.visits.some(v => v.date && v.date.startsWith(currentMonthFilter))) {
                showPatient = true;
            }
            // Mở rộng: Nếu đang tìm kiếm (có kw), thì bỏ qua filter tháng để tìm được bệnh nhân cũ
            if (kw.length > 0) showPatient = true; 
        }

        if(showPatient) {
            return `
            <div class="patient-row">
                <div class="p-info" onclick="window.viewHistory('${p.id}')">
                    <h3 class="font-bold text-lg text-[#3e2723]">${p.name}</h3>
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
        }
        return '';
    }).join('');
    
    // Xử lý trạng thái trống
    if(list.innerHTML === '') {
        if(kw) list.innerHTML = `<div class="text-center text-gray-400 mt-10 italic">Không tìm thấy bệnh nhân nào khớp với "${kw}".</div>`;
        else list.innerHTML = `<div class="text-center text-gray-400 mt-10 italic">Không có bệnh nhân nào khám trong tháng này.<br>Chọn "Tất cả" hoặc thêm mới.</div>`;
    }

    // Cập nhật label tháng trên giao diện
    const monthLabel = document.getElementById('monthLabel');
    if(monthLabel) {
        // ĐỔI TỪ 'T' SANG 'THÁNG '
        monthLabel.innerText = `THÁNG ${new Date().getMonth()+1}`;
    }
    
    // Cập nhật hiển thị lợi nhuận (nếu hàm tồn tại)
    if(window.updateProfitDisplay) window.updateProfitDisplay();
};

// --- 4. THAO TÁC BỆNH NHÂN (CRUD) ---

window.handleEdit = function(id, e) { 
    e.stopPropagation(); // Ngăn sự kiện click lan ra ngoài (tránh mở lịch sử)
    window.openPatientModal(id); 
};

window.handleExam = function(id, e) { 
    e.stopPropagation(); 
    // Hàm startVisit nằm ở file visit.js
    if(window.startVisit) window.startVisit(id); 
    else alert("Chức năng khám chưa được tải xong, vui lòng đợi...");
};

window.handleDelete = async function(id) { 
    if(confirm('Cảnh báo: Xóa bệnh nhân sẽ mất toàn bộ lịch sử khám!\nBạn có chắc chắn muốn xóa?')) { 
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
        // Reset form để thêm mới
        document.getElementById('pName').value = ''; 
        document.getElementById('pYear').value = ''; 
        document.getElementById('pPhone').value = ''; 
        document.getElementById('pAddress').value = ''; 
    }
    document.getElementById('pModal').classList.add('active');
    // Focus vào tên để nhập luôn
    setTimeout(() => document.getElementById('pName').focus(), 100);
};

window.savePatient = async function() {
    const name = document.getElementById('pName').value; 
    if(!name) return alert("Vui lòng nhập tên bệnh nhân!");
    
    const id = document.getElementById('pEditId').value;
    
    // Tạo object bệnh nhân
    const p = { 
        id: id || Date.now().toString(), 
        name: name, 
        year: document.getElementById('pYear').value, 
        phone: document.getElementById('pPhone').value, 
        address: document.getElementById('pAddress').value,
        // Giữ nguyên lịch sử khám cũ nếu là sửa, tạo mảng rỗng nếu là mới
        visits: id ? window.db.find(x => x.id == id).visits : [] 
    };

    if(id) {
        // Cập nhật
        const idx = window.db.findIndex(x => x.id == id);
        if(idx !== -1) window.db[idx] = p;
    } else {
        // Thêm mới vào đầu danh sách
        window.db.unshift(p);
    }

    if(window.saveDb) await window.saveDb(); 
    if(window.closeModals) window.closeModals(); 
    
    // Reset bộ lọc về 'ALL' hoặc giữ nguyên, rồi render lại
    // Nếu thêm mới thì nên clear search để thấy bệnh nhân vừa thêm
    document.getElementById('search').value = '';
    window.render();
};

// --- 5. LỊCH SỬ KHÁM BỆNH (HISTORY) ---

window.viewHistory = function(pid) {
    const p = window.db.find(x => x.id == pid);
    if (!p) return;

    document.getElementById('hName').innerText = p.name;
    
    const totalVisits = p.visits ? p.visits.length : 0;
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();
    
    // Đếm số lần khám trong tháng này
    const visitsThisMonth = p.visits ? p.visits.filter(v => {
        const d = new Date(v.date);
        return d.getMonth() === currentMonth && d.getFullYear() === currentYear;
    }).length : 0;

    const summaryHtml = `
        <div class="flex justify-between bg-gray-50 p-3 rounded-lg mb-3 border border-gray-200 text-xs font-bold text-[#5d4037]">
            <span>Tổng số lần khám: ${totalVisits}</span>
            <span>Tháng này: ${visitsThisMonth}</span>
        </div>
    `;

    const listHtml = p.visits?.map((v, i) => {
        const stt = totalVisits - i; // Đếm ngược STT
        
        return `
        <div class="p-4 rounded-xl border border-[#eee] bg-white mb-2 shadow-sm relative pl-6">
            <div class="absolute top-3 -left-2 bg-[#8d6e63] text-white w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold shadow-md border-2 border-white z-10">
                ${stt}
            </div>
            <div class="flex justify-between text-xs font-bold text-[#8d6e63] mb-1">
                <span>📅 ${v.date}</span>
                <span>${parseInt(v.total).toLocaleString()}đ</span>
            </div>
            <div class="font-bold text-[#5d4037] mb-1 serif">${v.disease}</div>
            <div class="text-xs text-gray-600 mb-2">
                ${v.rxEast?.length ? `Đông Y: ${v.rxEast.length} vị` : ''} 
                ${v.rxWest?.length ? ` • Tây Y: ${v.rxWest.length} loại` : ''} 
                ${v.procs?.length ? ` • Thủ thuật: ${v.procs.length}` : ''}
            </div>
            <div class="flex gap-2 justify-end mt-2">
                <button onclick="window.closeModals();window.startVisit('${pid}',${v.id})" 
                        class="px-3 py-1 bg-[#efebe9] text-[#5d4037] text-xs rounded font-bold border hover:bg-[#d7ccc8]">Sửa / Xem lại</button>
                <button onclick="window.deleteVisit('${pid}',${v.id})" 
                        class="px-3 py-1 bg-white text-red-600 text-xs rounded font-bold border border-red-100 hover:bg-red-50">Xóa</button>
            </div>
        </div>`;
    }).join('') || '<p class="text-center text-gray-400 py-4">Chưa có lịch sử khám bệnh</p>';
    
    document.getElementById('hContent').innerHTML = summaryHtml + listHtml;
    document.getElementById('hModal').classList.add('active');
};

window.deleteVisit = async function(pid, vid) { 
    if(confirm("Bạn có chắc muốn xóa lịch sử khám này không? Hành động không thể hoàn tác.")) { 
        const p = window.db.find(x => x.id == pid); 
        if (p && p.visits) {
            p.visits = p.visits.filter(v => v.id != vid); 
            if(window.saveDb) await window.saveDb(); 
            // Render lại popup lịch sử và danh sách bên ngoài
            window.viewHistory(pid); 
            window.render(); 
        }
    } 
};
