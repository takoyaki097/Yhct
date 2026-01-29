/**
 * FILE: js/config-core.js
 * CHỨC NĂNG: Cấu hình mặc định & Dữ liệu tĩnh.
 * CẬP NHẬT: Mở rộng danh mục Tứ Chẩn để khớp với AI Biện chứng luận trị.
 */

window.config = window.config || {}; 

// --- 1. CÁC BIẾN TOÀN CỤC ---
window.tempEastOptions = [];
window.currentEastOptionIndex = -1;

// --- 2. BẢNG MÀU MỸ HỌC NHÀ TỐNG ---
window.songPalette = [
    { color: '#3e2723', name: 'Mặc (Đen mực)' },
    { color: '#5d4037', name: 'Gỗ đàn hương' },
    { color: '#8d6e63', name: 'Đất nung' },
    { color: '#263238', name: 'Xanh mực' },
    { color: '#1b5e20', name: 'Tùng (Xanh thông)' },
    { color: '#827717', name: 'Thu hương' },
    { color: '#e65100', name: 'Chu sa (Đỏ cam)' },
    { color: '#bf360c', name: 'Gạch nung' },
    { color: '#006064', name: 'Lam ngọc (Đậm)' },
    { color: '#004d40', name: 'Lục bảo' },
    { color: '#f2ebe0', name: 'Giấy tuyên (Sáng)' },
    { color: '#d7ccc8', name: 'Trắng sứ' },
    { color: '#fff9c4', name: 'Vàng nhạt' },
    { color: '#e0f2f1', name: 'Ngọc bích nhạt' },
    { color: '#ffffff', name: 'Trắng tinh' }
];

// --- 3. CẤU HÌNH MẶC ĐỊNH (DEFAULT CONFIG) ---
window.defaultConfig = {
    clinicTitle: 'Phòng Khám YHCT',
    doctorName: 'Đông Y',
    diseases: [],
    procs: [],
    // [UPDATE] Dữ liệu Tứ chẩn chuẩn hóa cho AI
    tuChan: {
        vong: [
            'Sắc mặt hồng nhuận', 'Sắc mặt xanh tái', 'Sắc mặt vàng', 'Sắc mặt đỏ', 
            'Sắc mặt nhợt', 'Sắc mặt sạm đen', 'Người gầy', 'Người béo bệu', 
            'Mắt đỏ', 'Môi nhợt', 'Sợ lạnh', 'Thích mát'
        ],
        van: [
            'Tiếng nói to rõ', 'Tiếng nói nhỏ yếu', 'Nói sảng', 'Hơi thở hôi', 
            'Ho khan', 'Ho có đờm', 'Thở thô', 'Đoản hơi', 'Nấc cụt'
        ],
        vanhoi: [
            'Ăn ngon', 'Ăn kém', 'Đầy bụng', 'Khát nước', 'Không khát', 
            'Thích uống nóng', 'Thích uống lạnh', 'Đắng miệng', 
            'Đại tiện táo', 'Đại tiện lỏng', 'Phân sống', 'Tiểu vàng', 'Tiểu trong dài',
            'Ngủ kém', 'Mất ngủ', 'Hay mơ', 'Đau đầu', 'Đau lưng', 'Ù tai'
        ],
        thiet: [
            'Da nóng', 'Da lạnh', 'Lòng bàn tay nóng', 'Chân tay lạnh', 
            'Bụng mềm', 'Bụng cứng', 'Đau cự án', 'Đau thiện án', 'Ra mồ hôi trộm'
        ],
        thietchan: [
            'Lưỡi đỏ', 'Lưỡi nhợt', 'Lưỡi tím', 'Lưỡi bệu', 'Có dấu răng',
            'Rêu trắng mỏng', 'Rêu trắng dày', 'Rêu vàng', 'Rêu nhớt', 'Không rêu', 'Nứt gai'
        ],
        machchan: [
            'Phù', 'Trầm', 'Trì', 'Sác', 'Hoạt', 'Huyền', 
            'Tế', 'Nhược', 'Hư', 'Thực', 'Nhu', 'Khẩn'
        ]
    },
    // Cấu hình giao diện
    headerOverlayOpacity: 0,
    headerBgImage: null,
    headerBlur: 0,
    headerInfoBlur: 0,
    qrCodeImage: null,
    profitVisible: false,
    password: '',
    profitTextColor: '#3e2723',
    profitBgColor: '#ffffff'
};
