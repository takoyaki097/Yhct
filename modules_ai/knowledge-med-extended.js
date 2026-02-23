/**
 * FILE: knowledge/knowledge-med-extended.js
 * CHỨC NĂNG: Khởi tạo dữ liệu Dược mở rộng (Rich Data) & Migration logic.
 * NHIỆM VỤ: 
 * - Chuyển đổi dữ liệu cũ sang cấu trúc mới (có ID, Info).
 * - Nạp dữ liệu mẫu chi tiết (Tính vị, Quy kinh, Tương tác thuốc...).
 */

window.knowledge = window.knowledge || {};

// ============================================================
// 1. DỮ LIỆU MẪU ĐÔNG DƯỢC (RICH HERBS SAMPLE)
// ============================================================
const sampleRichHerbs = [
    {
        id: "herb_que_chi",
        name: "Quế Chi (Cành Quế)",
        category: "Giải Biểu",
        image: "", // Để trống để user tự up
        info: {
            tinh_vi: "Cay, Ngọt, Ấm (Tân Cam Ôn).",
            quy_kinh: "Phế, Tâm, Bàng Quang.",
            lieu_luong: "4 - 12g.",
            cong_nang: "Phát hãn giải cơ, ôn kinh thông dương, trợ dương hóa khí.",
            kieng_ky: "Bệnh ôn nhiệt, âm hư dương thịnh, phụ nữ có thai thận trọng.",
            phoi_hop: "Thường dùng với Bạch thược (Điều hòa dinh vệ), Ma hoàng (Phát hãn)."
        }
    },
    {
        id: "herb_bach_thuoc",
        name: "Bạch Thược",
        category: "Bổ Dưỡng",
        image: "",
        info: {
            tinh_vi: "Đắng, Chua, Hơi Hàn.",
            quy_kinh: "Can, Tỳ.",
            lieu_luong: "8 - 12g.",
            cong_nang: "Dưỡng huyết liễm âm, nhu can chỉ thống, bình can tiềm dương.",
            kieng_ky: "Ngực sườn đầy tức do hàn (dương hư) không dùng. Phản Lê lô.",
            phoi_hop: "Dùng với Cam thảo (Trị chân tay co rút, đau bụng)."
        }
    },
    {
        id: "herb_cam_thao",
        name: "Cam Thảo",
        category: "Bổ Dưỡng",
        image: "",
        info: {
            tinh_vi: "Ngọt, Bình (Sống), Ấm (Sao).",
            quy_kinh: "Tâm, Phế, Tỳ, Vị.",
            lieu_luong: "4 - 12g.",
            cong_nang: "Kiện tỳ ích khí, nhuận phế chỉ khái, giải độc, điều hòa các vị thuốc.",
            kieng_ky: "Thấp trệ đầy bụng, phù thũng không dùng. Kỵ Đại kích, Nguyên hoa, Cam toại.",
            phoi_hop: "Là sứ dược trong hầu hết các bài thuốc."
        }
    }
];

// ============================================================
// 2. DỮ LIỆU MẪU TÂY Y (RICH WESTERN MEDS SAMPLE)
// ============================================================
const sampleRichWest = [
    {
        id: "west_paracetamol_500",
        name: "Paracetamol 500mg",
        group: "Giảm Đau / Hạ Sốt",
        image: "",
        info: {
            chi_dinh: "Điều trị các chứng đau nhẹ đến vừa: Đau đầu, đau răng, đau cơ, đau bụng kinh. Hạ sốt.",
            chong_chi_dinh: "Mẫn cảm với Paracetamol. Suy gan nặng.",
            lieu_luong: "Người lớn: 1-2 viên/lần, cách nhau 4-6h. Tối đa 4g/ngày.",
            duong_dung: "Uống sau ăn.",
            tac_dung_phu: "Hiếm gặp. Dùng liều cao kéo dài gây hại gan.",
            tuong_tac: "Không uống rượu bia khi dùng thuốc."
        }
    },
    {
        id: "west_amoxicillin_500",
        name: "Amoxicillin 500mg",
        group: "Kháng Sinh (Beta-lactam)",
        image: "",
        info: {
            chi_dinh: "Nhiễm khuẩn đường hô hấp trên/dưới, tiết niệu, da và mô mềm.",
            chong_chi_dinh: "Dị ứng với Penicillin hoặc Cephalosporin.",
            lieu_luong: "Người lớn: 1 viên/lần x 2-3 lần/ngày. Uống đủ 5-7 ngày.",
            duong_dung: "Uống lúc no hoặc đói.",
            tac_dung_phu: "Tiêu chảy, buồn nôn, nổi mẩn ngứa.",
            tuong_tac: "Giảm tác dụng của thuốc tránh thai. Tăng tác dụng của thuốc chống đông."
        }
    },
    {
        id: "west_omeprazol_20",
        name: "Omeprazole 20mg",
        group: "Dạ Dày (PPI)",
        image: "",
        info: {
            chi_dinh: "Trào ngược dạ dày thực quản (GERD), loét dạ dày tá tràng.",
            chong_chi_dinh: "Mẫn cảm với thành phần thuốc.",
            lieu_luong: "1 viên/lần/ngày. Uống vào buổi sáng.",
            duong_dung: "Uống trước khi ăn 30 phút. Nuốt chửng, không nhai.",
            tac_dung_phu: "Đau đầu, buồn nôn, đầy hơi.",
            tuong_tac: "Có thể ảnh hưởng hấp thu các thuốc phụ thuộc pH dạ dày."
        }
    }
];

// ============================================================
// 3. ENGINE KHỞI TẠO & MIGRATION
// ============================================================

window.initRichDataEngine = function() {
    console.log("🚀 Initializing Knowledge Base 2.0 Data...");

    // A. XỬ LÝ ĐÔNG DƯỢC (HERBS)
    // ----------------------------------------------------
    if (!window.knowledge.herbsDB) window.knowledge.herbsDB = [];
    
    // 1. Gộp dữ liệu mẫu mới vào (nếu chưa có)
    sampleRichHerbs.forEach(newItem => {
        const exists = window.knowledge.herbsDB.some(old => 
            (old.id === newItem.id) || (old.name.toLowerCase() === newItem.name.toLowerCase())
        );
        if (!exists) {
            window.knowledge.herbsDB.unshift(newItem);
        }
    });

    // 2. Chuẩn hóa dữ liệu cũ (Migration)
    // Biến các object {name, category} đơn giản thành object full {id, info...}
    window.knowledge.herbsDB = window.knowledge.herbsDB.map(h => {
        // Nếu đã chuẩn rồi thì giữ nguyên
        if (h.id && h.info) return h;

        // Nếu chưa chuẩn (dữ liệu cũ từ herbs-data.js)
        return {
            id: h.id || ('sys_herb_' + Math.random().toString(36).substr(2, 9)),
            name: h.name,
            category: h.category, // Giữ category cũ làm group
            group: h.category,    // Mapping sang trường group mới
            image: "",
            info: {
                tinh_vi: (h.tags && h.tags.length) ? h.tags.join(', ') : "", // Tạm lấy tags làm tính vị
                quy_kinh: "",
                lieu_luong: "6 - 12g", // Mặc định an toàn
                cong_nang: "Đang cập nhật...",
                kieng_ky: "",
                phoi_hop: ""
            },
            isSystem: true // Đánh dấu là dữ liệu hệ thống
        };
    });


    // B. XỬ LÝ TÂY Y (WESTERN MEDS)
    // ----------------------------------------------------
    // Tây Y cũ nằm trong window.CONFIG_MEDICINE.WEST_GROUPS (dạng lồng nhau)
    // Ta cần "phẳng hóa" (Flatten) nó ra thành window.knowledge.westDB
    
    window.knowledge.westDB = []; // Reset hoặc khởi tạo mới

    // 1. Hút dữ liệu từ Config cũ (nếu có)
    if (window.CONFIG_MEDICINE && window.CONFIG_MEDICINE.WEST_GROUPS) {
        window.CONFIG_MEDICINE.WEST_GROUPS.forEach(group => {
            if (group.items && Array.isArray(group.items)) {
                group.items.forEach(itemName => {
                    // Tạo ID từ tên (slugify)
                    const tempId = 'sys_west_' + itemName.toLowerCase().replace(/[^a-z0-9]+/g, '_');
                    
                    window.knowledge.westDB.push({
                        id: tempId,
                        name: itemName,
                        group: group.name, // Lấy tên nhóm từ Config (VD: Kháng Sinh)
                        image: "",
                        info: {
                            chi_dinh: "Thuốc thuộc nhóm " + group.name,
                            lieu_luong: "Theo chỉ định bác sĩ",
                            duong_dung: "Uống",
                            chong_chi_dinh: "",
                            tac_dung_phu: ""
                        },
                        isSystem: true
                    });
                });
            }
        });
    }

    // 2. Gộp dữ liệu mẫu mới (Rich Data)
    // Dữ liệu mẫu sẽ ghi đè dữ liệu cũ nếu trùng tên (để lấy thông tin chi tiết hơn)
    sampleRichWest.forEach(richItem => {
        const idx = window.knowledge.westDB.findIndex(old => old.name.toLowerCase() === richItem.name.toLowerCase());
        if (idx !== -1) {
            // Update: Giữ ID cũ, cập nhật info mới
            window.knowledge.westDB[idx] = { 
                ...window.knowledge.westDB[idx], 
                ...richItem,
                id: window.knowledge.westDB[idx].id // Giữ ID hệ thống đã tạo
            };
        } else {
            // Thêm mới hoàn toàn
            window.knowledge.westDB.unshift(richItem);
        }
    });


    // C. XỬ LÝ HUYỆT (ACUPOINTS)
    // ----------------------------------------------------
    // Dữ liệu huyệt nằm trong window.knowledge.acupoints (đã có từ các file knowledge-*.js)
    // Ta chỉ cần đảm bảo nó có trường 'info' để UI mới không lỗi
    if (window.knowledge.acupoints) {
        window.knowledge.acupoints = window.knowledge.acupoints.map(p => {
            if (p.info) return p; // Đã chuẩn
            
            return {
                ...p,
                // Mapping các trường cũ (function, indications) vào info mới
                info: {
                    vi_tri: "Đang cập nhật vị trí...",
                    tac_dung: p.function || "",
                    chu_tri: p.indications || "",
                    phuong_phap: "Châm cứu"
                }
            };
        });
    }

    console.log(`✅ Data Ready: ${window.knowledge.herbsDB.length} Herbs, ${window.knowledge.westDB.length} West Meds.`);
};

// Tự động chạy khi file được load (đảm bảo chạy sau khi các file dữ liệu gốc đã load)
// Sử dụng setTimeout để đẩy xuống cuối hàng đợi
setTimeout(() => {
    if (window.initRichDataEngine) window.initRichDataEngine();
}, 1000);
