/**
 * FILE: knowledge/database.js
 * CHỨC NĂNG: Quản lý Lưu trữ, Khởi tạo dữ liệu, Sao lưu & Khôi phục.
 * CẬP NHẬT: 
 * - Cơ chế Snapshot & Undo (An toàn dữ liệu).
 * - [MỚI] Xuất Excel chi tiết (Tài chính, Vật tư, Lãi lỗ).
 * - [MỚI] Nhập & Đồng bộ Excel thông minh (Không phá vỡ cấu trúc).
 */

// 1. CẤU HÌNH LOCALFORAGE
localforage.config({
    name: 'YHCT_Pro_App',
    storeName: 'data_store'
});

// Khởi tạo biến toàn cục
window.db = [];
// window.config đã được định nghĩa sơ bộ trong config-core.js

// Biến chứa bản chụp dữ liệu tạm thời (Undo Buffer)
window.dbSnapshot = null;

// ============================================================
// 2. KHỞI TẠO CƠ SỞ DỮ LIỆU (LOAD DATA)
// ============================================================
window.initAppDatabase = async function() {
    try {
        console.log("Đang tải dữ liệu...");
        
        // A. Load từ bộ nhớ
        const savedDb = await localforage.getItem('yhct_db_v49');
        const savedConfig = await localforage.getItem('yhct_cfg_v49');

        // B. Migration (Chuyển từ LocalStorage cũ nếu có)
        if (!savedDb && localStorage.getItem('yhct_db_v49')) {
            window.db = JSON.parse(localStorage.getItem('yhct_db_v49') || '[]');
            await localforage.setItem('yhct_db_v49', window.db);
        } else {
            window.db = savedDb || [];
        }

        if (!savedConfig && localStorage.getItem('yhct_cfg_v49')) {
            window.config = JSON.parse(localStorage.getItem('yhct_cfg_v49') || '{}');
            await localforage.setItem('yhct_cfg_v49', window.config);
        } else {
            // Merge với cấu hình mặc định để không bị lỗi thiếu key
            window.config = savedConfig ? { ...window.defaultConfig, ...savedConfig } : { ...window.defaultConfig };
        }

        // C. Xử lý tương thích dữ liệu cũ
        if (Array.isArray(window.config.diseases)) {
            window.config.diseases.forEach(d => {
                if (d && !d.eastOptions) d.eastOptions = [];
            });
        }
        if (!window.config.tuChan) window.config.tuChan = window.defaultConfig.tuChan;

        // D. Kiểm tra lần đầu sử dụng
        await window.checkFirstTimeUse();

        console.log("Tải dữ liệu thành công!");
        return true;

    } catch (err) {
        console.error("Lỗi khởi tạo DB:", err);
        alert("Lỗi khởi động dữ liệu: " + err.message);
        return false;
    }
};

// ============================================================
// 3. CÁC HÀM LƯU TRỮ (SAVE)
// ============================================================

window.saveDb = async function() { 
    try { 
        await localforage.setItem('yhct_db_v49', window.db);
        if(window.renderMonthFilterList) window.renderMonthFilterList(); 
    } catch(e) { 
        console.error(e); 
    } 
};

window.saveConfig = async function() { 
    try { 
        await localforage.setItem('yhct_cfg_v49', window.config); 
        if(window.updateHeader) window.updateHeader(); 
    } catch(e) { 
        console.error(e); 
    } 
};

// ============================================================
// 4. DỮ LIỆU MẪU (SAMPLE DATA)
// ============================================================

window.checkFirstTimeUse = async function() {
    if (!localStorage.getItem('yhct_first_time')) {
        await window.createSampleData(); 
        localStorage.setItem('yhct_first_time', 'false');
    }
};

window.createSampleData = async function() {
    if (!window.config.diseases || window.config.diseases.length === 0) {
        window.config.diseases = [
            {
                name: "Cảm mạo", sym: "Sốt, sợ lạnh", rxWest: [],
                eastOptions: [{ name: "Giải cảm", ingredients: [{name: "Tía tô", qty: 12, price: 0}] }]
            }
        ];
    }
    if (!window.config.procs || window.config.procs.length === 0) {
        window.config.procs = [{name: "Châm cứu", price: 100000}, {name: "Xoa bóp", price: 150000}];
    }
    await window.saveDb(); 
    await window.saveConfig();
};

// ============================================================
// 5. CƠ CHẾ SNAPSHOT & UNDO (AN TOÀN DỮ LIỆU)
// ============================================================

window.createSnapshot = function() {
    console.log("📸 Creating DB Snapshot...");
    try {
        window.dbSnapshot = {
            db: JSON.parse(JSON.stringify(window.db)),
            config: JSON.parse(JSON.stringify(window.config)),
            inventory: window.Inventory ? JSON.parse(JSON.stringify(window.Inventory.data)) : []
        };
        return true;
    } catch (e) {
        console.error("Snapshot failed:", e);
        return false;
    }
};

window.restoreSnapshot = async function() {
    if (!window.dbSnapshot) {
        alert("Không có bản lưu tạm nào để hoàn tác!");
        return;
    }

    if (confirm("⚠️ BẠN MUỐN HOÀN TÁC?\n\nDữ liệu sẽ quay về trạng thái trước khi bạn thực hiện thao tác nhập Excel.")) {
        console.log("↺ Restoring from Snapshot...");
        try {
            // 1. Phục hồi biến Runtime
            window.db = JSON.parse(JSON.stringify(window.dbSnapshot.db));
            window.config = JSON.parse(JSON.stringify(window.dbSnapshot.config));
            
            // 2. Phục hồi Kho (nếu có)
            if (window.Inventory && window.dbSnapshot.inventory) {
                window.Inventory.data = JSON.parse(JSON.stringify(window.dbSnapshot.inventory));
                await window.Inventory.save();
            }

            // 3. Lưu xuống ổ cứng
            await window.saveDb();
            await window.saveConfig();

            // 4. Cập nhật giao diện
            if (window.render) window.render();
            if (window.updateHeader) window.updateHeader();
            if (window.InventoryTpl && window.InventoryTpl.renderList) window.InventoryTpl.renderList();

            // 5. Xóa snapshot sau khi dùng
            window.dbSnapshot = null;
            
            if (window.showToast) window.showToast("✅ Đã hoàn tác thành công!", "success");

        } catch (e) {
            console.error("Restore failed:", e);
            alert("Lỗi khi hoàn tác: " + e.message);
        }
    }
};

// ============================================================
// 6. SAO LƯU & KHÔI PHỤC FILE JSON (CẤU TRÚC GỐC)
// ============================================================

window.exportToJSON = function() {
    try {
        const cleanConfig = JSON.parse(JSON.stringify(window.config || {}));
        // Loại bỏ ảnh base64 để file nhẹ
        cleanConfig.headerBgImage = null;
        cleanConfig.qrCodeImage = null;

        const dataToSave = {
            version: "v49_light",
            timestamp: new Date().toISOString(),
            db: window.db || [],
            config: cleanConfig,
            inventory: window.Inventory ? window.Inventory.data : []
        };
        
        const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(dataToSave));
        const downloadAnchorNode = document.createElement('a');
        const fileName = "YHCT_Backup_" + new Date().toISOString().slice(0,10) + ".json";
        
        downloadAnchorNode.setAttribute("href", dataStr);
        downloadAnchorNode.setAttribute("download", fileName);
        document.body.appendChild(downloadAnchorNode);
        downloadAnchorNode.click();
        downloadAnchorNode.remove();
        
    } catch (e) {
        console.error(e);
        alert("Lỗi xuất JSON: " + e.message);
    }
};

window.handleJSONFileSelect = function(event) {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async function(e) {
        try {
            const jsonContent = JSON.parse(e.target.result);
            if (!jsonContent.db && !jsonContent.config) throw new Error("File sai định dạng!");

            if (confirm(`Tìm thấy bản sao lưu ngày: ${jsonContent.timestamp || 'Cũ'}.\nBạn có muốn khôi phục không?`)) {
                if (jsonContent.db) {
                    window.db = jsonContent.db;
                    await localforage.setItem('yhct_db_v49', window.db);
                }
                if (jsonContent.config) {
                    const currentBg = window.config.headerBgImage;
                    const currentQr = window.config.qrCodeImage;
                    window.config = { ...window.defaultConfig, ...jsonContent.config };
                    // Giữ lại ảnh cũ
                    if (!window.config.headerBgImage && currentBg) window.config.headerBgImage = currentBg;
                    if (!window.config.qrCodeImage && currentQr) window.config.qrCodeImage = currentQr;
                    await localforage.setItem('yhct_cfg_v49', window.config);
                }
                if (jsonContent.inventory && window.Inventory) {
                    await localforage.setItem('yhct_inventory', jsonContent.inventory);
                    if(window.Inventory.init) await window.Inventory.init();
                }
                alert("✅ Khôi phục thành công! Ứng dụng sẽ tự tải lại.");
                location.reload();
            }
        } catch (err) {
            console.error(err);
            alert("❌ Lỗi đọc file JSON: " + err.message);
        }
    };
    reader.readAsText(file);
};

// ============================================================
// 7. XUẤT & ĐỒNG BỘ EXCEL (CHI TIẾT CHUYÊN SÂU)
// ============================================================

// --- HELPER: CHUẨN HÓA DỮ LIỆU THÀNH CHUỖI ---
window.flattenMeds = function(list) {
    if (!list || list.length === 0) return "";
    return list.map(m => `${m.name}(${m.qty}${m.days > 1 ? 'x'+m.days : ''})`).join("; ");
};

window.flattenProcs = function(list) {
    if (!list || list.length === 0) return "";
    return list.map(p => `${p.name}`).join("; ");
};

window.flattenConsumables = function(visit) {
    if (!visit.inventoryLogs || visit.inventoryLogs.length === 0) return "";
    // Cần lookup tên item từ kho
    if (!window.Inventory) return "Có log kho (chi tiết xem trong app)";
    
    // Gộp các log trùng item
    const summary = {};
    visit.inventoryLogs.forEach(log => {
        const item = window.Inventory.getItem(log.itemId);
        const name = item ? item.name : (log.itemName || "Vật tư");
        if (!summary[name]) summary[name] = 0;
        summary[name] += (log.amount || 0);
    });
    
    return Object.entries(summary).map(([k, v]) => `${k}(${v})`).join("; ");
};

// --- A. XUẤT EXCEL CHI TIẾT (EXPORT) ---
// Thay thế hàm exportPatientListToExcel cũ
window.exportPatientListToExcel = function() {
    if (!window.db || window.db.length === 0) { alert("Chưa có dữ liệu!"); return; }
    
    try {
        const flatData = [];
        
        // Duyệt từng bệnh nhân
        window.db.forEach(p => {
            // Nếu bệnh nhân chưa khám lần nào, vẫn xuất 1 dòng thông tin cơ bản
            if (!p.visits || p.visits.length === 0) {
                flatData.push({
                    "Mã BN": p.id,
                    "Họ Tên": p.name,
                    "Năm Sinh": p.year,
                    "SĐT": p.phone,
                    "Địa Chỉ": p.address,
                    "Ghi Chú": "Chưa có lịch sử khám"
                });
            } else {
                // Nếu có lịch sử khám, xuất từng dòng chi tiết
                p.visits.forEach(v => {
                    const cost = v.cost || 0;
                    const total = v.total || 0;
                    const profit = total - cost;
                    
                    flatData.push({
                        "Mã BN": p.id,
                        "Họ Tên": p.name,
                        "Năm Sinh": p.year,
                        "SĐT": p.phone,
                        "Địa Chỉ": p.address,
                        
                        "Mã PK": v.id, // ID Phiếu khám
                        "Ngày Khám": v.date,
                        "Chẩn Đoán": v.disease,
                        "Triệu Chứng": v.symptoms,
                        
                        "Đông Y": window.flattenMeds(v.rxEast),
                        "Tây Y": window.flattenMeds(v.rxWest),
                        "Thủ Thuật": window.flattenProcs(v.procs),
                        "Vật Tư Tiêu Hao": window.flattenConsumables(v),
                        
                        "Tổng Thu": total,
                        "Tiền Vốn": cost,
                        "Tiền Lãi": profit,
                        "Trạng Thái": v.paid ? "Đã thu" : "Nợ",
                        "Ghi Chú": v.note || "" // Dùng để note thông tin thêm
                    });
                });
            }
        });

        const ws = XLSX.utils.json_to_sheet(flatData);
        
        // Auto-width columns (ước lượng)
        const wscols = [
            {wch:15}, {wch:20}, {wch:10}, {wch:15}, {wch:20}, // Info
            {wch:15}, {wch:15}, {wch:20}, {wch:25}, // Visit Info
            {wch:30}, {wch:30}, {wch:20}, {wch:25}, // Detail
            {wch:12}, {wch:12}, {wch:12}, {wch:10}  // Finance
        ];
        ws['!cols'] = wscols;

        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "ChiTietPhongKham");
        
        const fileName = `YHCT_ChiTiet_${new Date().toISOString().slice(0,10)}.xlsx`;
        XLSX.writeFile(wb, fileName);
        
    } catch (e) { 
        console.error(e);
        alert("Lỗi Xuất Excel: " + e.message); 
    }
};

// --- B. NHẬP & ĐỒNG BỘ THÔNG MINH (SAFE IMPORT) ---
window.handleExcelImport = function(event) {
    const file = event.target.files[0];
    if (!file) return;

    // 1. TẠO SNAPSHOT TRƯỚC KHI LÀM BẤT CỨ ĐIỀU GÌ
    window.createSnapshot();

    const reader = new FileReader();
    reader.onload = async function(e) {
        try {
            const data = new Uint8Array(e.target.result);
            const workbook = XLSX.read(data, {type: 'array'});
            const firstSheetName = workbook.SheetNames[0];
            const worksheet = workbook.Sheets[firstSheetName];
            const rows = XLSX.utils.sheet_to_json(worksheet);

            if (rows.length === 0) throw new Error("File Excel rỗng!");

            let countNewP = 0;
            let countUpdateP = 0;
            let countUpdateV = 0;

            // 2. DUYỆT TỪNG DÒNG EXCEL
            rows.forEach(row => {
                // Mapping cột (linh hoạt viết hoa/thường)
                const pid = row['Mã BN'] || row['Ma BN'];
                const vid = row['Mã PK'] || row['Ma PK'];
                
                const name = row['Họ Tên'] || row['Ho Ten'];
                const phone = row['SĐT'] || row['SDT'];
                const year = row['Năm Sinh'] || row['Nam Sinh'];
                const addr = row['Địa Chỉ'] || row['Dia Chi'];
                
                // --- XỬ LÝ BỆNH NHÂN ---
                let patient = null;
                
                // Tìm theo ID trước
                if (pid) {
                    patient = window.db.find(p => String(p.id) === String(pid));
                }
                // Nếu không có ID, tìm theo SĐT hoặc Tên+Năm sinh
                if (!patient && phone) {
                    patient = window.db.find(p => p.phone === String(phone));
                }
                if (!patient && name && year) {
                    patient = window.db.find(p => p.name.toLowerCase() === String(name).toLowerCase() && p.year == year);
                }

                if (patient) {
                    // Cập nhật thông tin hành chính
                    if (name) patient.name = name;
                    if (phone) patient.phone = String(phone);
                    if (year) patient.year = year;
                    if (addr) patient.address = addr;
                    countUpdateP++;
                } else if (name) {
                    // Tạo mới bệnh nhân
                    patient = {
                        id: pid || ('imp_' + Date.now() + Math.random().toString(36).substr(2, 4)),
                        name: name,
                        year: year || '',
                        phone: phone ? String(phone) : '',
                        address: addr || '',
                        visits: []
                    };
                    window.db.unshift(patient);
                    countNewP++;
                }

                // --- XỬ LÝ LẦN KHÁM (VISIT) ---
                if (patient && row['Ngày Khám']) {
                    const dateStr = row['Ngày Khám'];
                    let visit = null;

                    // Tìm visit theo ID
                    if (vid) {
                        visit = patient.visits.find(v => String(v.id) === String(vid));
                    }
                    // Nếu không có ID, tìm theo Ngày khám (chính xác)
                    if (!visit && dateStr) {
                        visit = patient.visits.find(v => v.date === dateStr);
                    }

                    // Dữ liệu cần update (Chỉ update các trường đơn giản, tránh hỏng cấu trúc mảng thuốc)
                    const diagnosis = row['Chẩn Đoán'] || row['Chan Doan'];
                    const symptoms = row['Triệu Chứng'] || row['Trieu Chung'];
                    const total = row['Tổng Thu'] || row['Tong Thu'];
                    const cost = row['Tiền Vốn'] || row['Tien Von'];
                    const status = row['Trạng Thái'] || row['Trang Thai'];
                    
                    // Xử lý ghi chú thuốc (Nếu có thay đổi trên excel, ghi vào note để bác sĩ biết)
                    const extraNote = row['Ghi Chú'] || "";
                    
                    if (visit) {
                        // Cập nhật visit cũ
                        if (diagnosis) visit.disease = diagnosis;
                        if (symptoms) visit.symptoms = symptoms;
                        if (total !== undefined) visit.total = parseInt(total);
                        if (cost !== undefined) visit.cost = parseInt(cost);
                        if (status) visit.paid = (String(status).toLowerCase().includes('thu') || String(status) === '1');
                        if (extraNote) visit.note = extraNote;
                        countUpdateV++;
                    } else {
                        // Tạo visit mới (Lưu ý: Không thể import mảng thuốc từ chuỗi text, nên sẽ để trống)
                        const newVisit = {
                            id: vid || Date.now(),
                            date: dateStr,
                            disease: diagnosis || "Được import từ Excel",
                            symptoms: symptoms || "",
                            rxEast: [], // Không dám parse string -> array
                            rxWest: [],
                            procs: [],
                            total: parseInt(total) || 0,
                            cost: parseInt(cost) || 0,
                            paid: (String(status).toLowerCase().includes('thu') || String(status) === '1'),
                            // Lưu nội dung thuốc vào ghi chú để tham khảo
                            note: `${extraNote} [Đông Y: ${row['Đông Y']||''}] [Tây Y: ${row['Tây Y']||''}]`
                        };
                        patient.visits.unshift(newVisit);
                        countUpdateV++;
                    }
                }
            });

            // 3. LƯU & RENDER
            await window.saveDb();
            window.render();
            
            // 4. HIỆN THÔNG BÁO KÈM NÚT HOÀN TÁC
            if (window.showToast) {
                window.showToast(
                    `✅ Xong: ${countNewP} BN mới, cập nhật ${countUpdateV} phiếu.`, 
                    "success", 
                    { label: "HOÀN TÁC", callback: window.restoreSnapshot }
                );
            } else {
                alert(`Đồng bộ thành công!\n- Bệnh nhân mới: ${countNewP}\n- Phiếu khám cập nhật: ${countUpdateV}`);
            }

        } catch (err) {
            console.error(err);
            alert("❌ Lỗi nhập Excel: " + err.message + "\nHãy đảm bảo file đúng định dạng xuất ra từ phần mềm.");
            window.restoreSnapshot(); 
        } finally {
            event.target.value = ''; 
        }
    };
    reader.readAsArrayBuffer(file);
};
