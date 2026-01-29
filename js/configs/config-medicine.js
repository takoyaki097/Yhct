/**
 * FILE: js/configs/config-medicine.js
 * CHỨC NĂNG: Cấu hình danh mục thuốc Tây (Phân loại chi tiết) & Bài thuốc mẫu Đông y.
 * CẬP NHẬT: Thêm nhóm Corticoid, Suy giãn tĩnh mạch, Vitamin.
 */

window.CONFIG_MEDICINE = {
    // ============================================================
    // 1. CẤU HÌNH GỢI Ý THUỐC TÂY (WESTERN MEDICINE GROUPS)
    // Dữ liệu này dùng cho Modal Tra Cứu Thuốc 2 Cột
    // ============================================================
    WEST_GROUPS: [
        { 
            id: "khang_sinh",
            name: "Kháng Sinh", 
            color: "bg-red-100 text-red-800 hover:bg-red-200 border-red-200",
            items: [
                "Amoxicillin 500mg", 
                "Augmentin 1g", 
                "Augmentin 625mg",
                "Cephalexin 500mg", 
                "Azithromycin 500mg", 
                "Cefixim 200mg", 
                "Klamentin 1g", 
                "Levofloxacin 500mg", 
                "Doxycyclin 100mg",
                "Ciprofloxacin 500mg",
                "Clarithromycin 500mg"
            ] 
        },
        { 
            id: "giam_dau",
            name: "Giảm Đau / Kháng Viêm", 
            color: "bg-orange-100 text-orange-800 hover:bg-orange-200 border-orange-200",
            items: [
                "Paracetamol 500mg", 
                "Ibuprofen 400mg", 
                "Meloxicam 7.5mg", 
                "Diclofenac 50mg", 
                "Efferalgan 500mg", 
                "Hapacol 250mg", 
                "Celecoxib 200mg", 
                "Piroxicam 20mg",
                "Alaxan"
            ] 
        },
        { 
            id: "corticoid",
            name: "Corticoid (Chống viêm)", 
            color: "bg-pink-100 text-pink-800 hover:bg-pink-200 border-pink-200",
            items: [
                "Prednisolon 5mg", 
                "Methylprednisolon 16mg (Medrol)", 
                "Methylprednisolon 4mg", 
                "Dexamethason 0.5mg", 
                "Betamethason"
            ] 
        },
        { 
            id: "di_ung",
            name: "Chống Dị Ứng / Kháng Histamin", 
            color: "bg-purple-100 text-purple-800 hover:bg-purple-200 border-purple-200",
            items: [
                "Loratadin 10mg", 
                "Fexofenadin 60mg", 
                "Fexofenadin 180mg", 
                "Desloratadin 5mg", 
                "Cetirizin 10mg", 
                "Chlorpheniramin 4mg"
            ] 
        },
        { 
            id: "da_day",
            name: "Dạ Dày / Tiêu Hóa", 
            color: "bg-green-100 text-green-800 hover:bg-green-200 border-green-200",
            items: [
                "Omeprazole 20mg", 
                "Esomeprazole 40mg (Nexium)", 
                "Pantoprazole 40mg", 
                "Domperidon 10mg", 
                "Phosphalugel (Sữa)", 
                "Yumangel (Thuốc chữ Y)", 
                "Berberin", 
                "Men vi sinh Enterogermina",
                "Smecta"
            ] 
        },
        { 
            id: "tinh_mach",
            name: "Tim Mạch / Tĩnh Mạch", 
            color: "bg-blue-100 text-blue-800 hover:bg-blue-200 border-blue-200",
            items: [
                "Daflon 500mg", 
                "Rutin C", 
                "Ginkgo Biloba", 
                "Venpoten", 
                "Vitamin C 500mg",
                "Amlodipin 5mg",
                "Losartan 50mg"
            ] 
        },
        { 
            id: "vitamin",
            name: "Vitamin & Bổ Trợ", 
            color: "bg-yellow-100 text-yellow-800 hover:bg-yellow-200 border-yellow-200",
            items: [
                "Vitamin 3B (B1-B6-B12)", 
                "Vitamin E 400IU", 
                "Canxi + D3", 
                "Sắt (Feron)", 
                "Magie B6", 
                "Kẽm (Zinc)"
            ] 
        }
    ],

    // ============================================================
    // 2. BÀI THUỐC MẪU ĐÔNG Y (DEFAULT EASTERN SAMPLES)
    // Dữ liệu này dùng để nạp nhanh vào toa Đông y
    // ============================================================
    DEFAULT_EAST_SAMPLES: [
        {
            name: "Lục Vị Địa Hoàng Hoàn",
            ingredients: [
                { name: "Thục địa", qty: 32 },
                { name: "Sơn thù", qty: 16 },
                { name: "Hoài sơn", qty: 16 },
                { name: "Mẫu đơn bì", qty: 12 },
                { name: "Trạch tả", qty: 12 },
                { name: "Phục linh", qty: 12 }
            ]
        },
        {
            name: "Bát Vị Quế Phụ (Thận Khí Hoàn)",
            ingredients: [
                { name: "Thục địa", qty: 32 },
                { name: "Sơn thù", qty: 16 },
                { name: "Hoài sơn", qty: 16 },
                { name: "Mẫu đơn bì", qty: 12 },
                { name: "Trạch tả", qty: 12 },
                { name: "Phục linh", qty: 12 },
                { name: "Nhục quế", qty: 4 },
                { name: "Phụ tử chế", qty: 4 }
            ]
        },
        {
            name: "Bổ Trung Ích Khí",
            ingredients: [
                { name: "Hoàng kỳ", qty: 20 },
                { name: "Nhân sâm", qty: 12 },
                { name: "Bạch truật", qty: 12 },
                { name: "Đương quy", qty: 12 },
                { name: "Trần bì", qty: 6 },
                { name: "Sài hồ", qty: 6 },
                { name: "Thăng ma", qty: 6 },
                { name: "Cam thảo", qty: 6 }
            ]
        },
        {
            name: "Quy Tỳ Thang",
            ingredients: [
                { name: "Bạch truật", qty: 12 },
                { name: "Phục thần", qty: 12 },
                { name: "Hoàng kỳ", qty: 12 },
                { name: "Long nhãn", qty: 12 },
                { name: "Toan táo nhân", qty: 12 },
                { name: "Nhân sâm", qty: 12 },
                { name: "Mộc hương", qty: 6 },
                { name: "Cam thảo", qty: 6 },
                { name: "Đương quy", qty: 12 },
                { name: "Viễn chí", qty: 6 },
                { name: "Đại táo", qty: 3 },
                { name: "Sinh khương", qty: 3 }
            ]
        },
        {
            name: "Độc Hoạt Tang Ký Sinh",
            ingredients: [
                { name: "Độc hoạt", qty: 12 },
                { name: "Tang ký sinh", qty: 16 },
                { name: "Phòng phong", qty: 12 },
                { name: "Tần giao", qty: 12 },
                { name: "Tế tân", qty: 4 },
                { name: "Quế chi", qty: 6 },
                { name: "Ngưu tất", qty: 12 },
                { name: "Đỗ trọng", qty: 12 },
                { name: "Đương quy", qty: 12 },
                { name: "Thược dược", qty: 12 },
                { name: "Xuyên khung", qty: 8 },
                { name: "Nhân sâm", qty: 12 },
                { name: "Phục linh", qty: 12 },
                { name: "Cam thảo", qty: 6 },
                { name: "Sinh địa", qty: 12 }
            ]
        },
        {
            name: "Huyết Phủ Trục Ứ Thang",
            ingredients: [
                { name: "Đương quy", qty: 12 },
                { name: "Sinh địa", qty: 12 },
                { name: "Đào nhân", qty: 12 },
                { name: "Hồng hoa", qty: 10 },
                { name: "Chỉ xác", qty: 8 },
                { name: "Xích thược", qty: 8 },
                { name: "Sài hồ", qty: 4 },
                { name: "Cam thảo", qty: 4 },
                { name: "Cát cánh", qty: 6 },
                { name: "Xuyên khung", qty: 6 },
                { name: "Ngưu tất", qty: 12 }
            ]
        }
    ]
};
