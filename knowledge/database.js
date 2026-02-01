/**
 * FILE: knowledge/database.js
 * CHỨC NĂNG: Quản lý Lưu trữ, Khởi tạo dữ liệu, Sao lưu & Khôi phục.
 * CẬP NHẬT: 
 * - Cơ chế Snapshot & Undo (An toàn dữ liệu).
 * - [MỚI] Nhập & Đồng bộ dữ liệu từ Excel (Smart Sync).
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

/**
 * Tạo một bản sao lưu tạm thời trong RAM (Deep Clone)
 */
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

/**
 * Khôi phục dữ liệu từ bản chụp gần nhất
 */
window.restoreSnapshot = async function() {
    if (!window.dbSnapshot) {
        alert("Không có bản lưu tạm nào để hoàn tác!");
        return;
    }

    if (confirm("⚠️ Bạn có chắc chắn muốn quay lại trạng thái trước khi nhập liệu không?")) {
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
// 6. SAO LƯU & KHÔI PHỤC FILE (JSON)
// ============================================================

// --- XUẤT JSON (BACKUP) ---
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

// --- NHẬP JSON (RESTORE) ---
window.handleJSONFileSelect = function(event) {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async function(e) {
        try {
            const jsonContent = JSON.parse(e.target.result);
            if (!jsonContent.db && !jsonContent.config) throw new Error("File sai định dạng!");

            if (confirm(`Tìm thấy bản sao lưu ngày: ${jsonContent.timestamp || 'Cũ'}.\nBạn có muốn khôi phục không? (Dữ liệu hiện tại sẽ bị thay thế)`)) {
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
            alert("❌ Lỗi đọc file: " + err.message);
        }
    };
    reader.readAsText(file);
};

// ============================================================
// 7. XUẤT & ĐỒNG BỘ EXCEL (XLSX) - [MỚI]
// ============================================================

// A. XUẤT DANH SÁCH BỆNH NHÂN
window.exportPatientListToExcel = function() {
    if (!window.db || window.db.length === 0) { alert("Chưa có dữ liệu!"); return; }
    try {
        const data = window.db.map((p, index) => ({
            STT: index + 1,
            "Họ Tên": p.name,
            "Năm Sinh": p.year,
            "SĐT": p.phone,
            "Địa Chỉ": p.address,
            "Ghi Chú": `Đã khám ${p.visits ? p.visits.length : 0} lần`
        }));
        const ws = XLSX.utils.json_to_sheet(data);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "BenhNhan");
        XLSX.writeFile(wb, "YHCT_DS_BenhNhan.xlsx");
    } catch (e) { alert("Lỗi Excel: " + e.message); }
};

// B. NHẬP & ĐỒNG BỘ TỪ EXCEL (SMART SYNC)
window.handleExcelImport = function(event) {
    const file = event.target.files[0];
    if (!file) return;

    // 1. TẠO SNAPSHOT TRƯỚC (QUAN TRỌNG)
    window.createSnapshot();

    const reader = new FileReader();
    reader.onload = async function(e) {
        try {
            const data = new Uint8Array(e.target.result);
            const workbook = XLSX.read(data, {type: 'array'});
            const firstSheetName = workbook.SheetNames[0];
            const worksheet = workbook.Sheets[firstSheetName];
            const rows = XLSX.utils.sheet_to_json(worksheet);

            if (rows.length === 0) throw new Error("File Excel rỗng hoặc không đọc được!");

            let countNew = 0;
            let countUpdate = 0;

            // 2. DUYỆT & GỘP DỮ LIỆU
            rows.forEach(row => {
                // Mapping cột (Chấp nhận viết hoa/thường)
                const name = row['Họ Tên'] || row['Ho Ten'] || row['Name'];
                const phone = row['SĐT'] || row['SDT'] || row['Phone'] || '';
                const year = row['Năm Sinh'] || row['Nam Sinh'] || row['Year'] || '';
                const addr = row['Địa Chỉ'] || row['Dia Chi'] || row['Address'] || '';

                if (name) {
                    // Logic tìm trùng: Ưu tiên SĐT, nếu không có SĐT thì tìm Tên + Năm sinh
                    let existing = null;
                    if (phone) {
                        existing = window.db.find(p => p.phone === String(phone));
                    }
                    if (!existing && year) {
                        existing = window.db.find(p => p.name.toLowerCase() === String(name).toLowerCase() && p.year == year);
                    }

                    if (existing) {
                        // Cập nhật thông tin hành chính
                        existing.name = name; // Update tên cho chuẩn
                        if (phone) existing.phone = String(phone);
                        if (year) existing.year = year;
                        if (addr) existing.address = addr;
                        countUpdate++;
                    } else {
                        // Tạo mới
                        const newP = {
                            id: 'imp_' + Date.now() + Math.random().toString(36).substr(2, 5),
                            name: name,
                            year: year,
                            phone: phone ? String(phone) : '',
                            address: addr,
                            visits: []
                        };
                        window.db.unshift(newP); // Thêm lên đầu
                        countNew++;
                    }
                }
            });

            // 3. LƯU & RENDER
            await window.saveDb();
            window.render();
            
            // 4. HIỆN THÔNG BÁO KÈM NÚT HOÀN TÁC
            if (window.showToast) {
                window.showToast(
                    `✅ Đã nhập: ${countNew} mới, ${countUpdate} cập nhật.`, 
                    "success", 
                    { 
                        label: "HOÀN TÁC NGAY", 
                        callback: window.restoreSnapshot 
                    }
                );
            } else {
                alert(`Đã nhập xong!\nThêm mới: ${countNew}\nCập nhật: ${countUpdate}`);
            }

        } catch (err) {
            console.error(err);
            alert("❌ Lỗi nhập Excel: " + err.message + "\nVui lòng kiểm tra tiêu đề cột (Họ Tên, SĐT, Năm Sinh...)");
            // Nếu lỗi, tự động restore để an toàn
            window.restoreSnapshot(); 
        } finally {
            event.target.value = ''; // Reset input
        }
    };
    reader.readAsArrayBuffer(file);
};
