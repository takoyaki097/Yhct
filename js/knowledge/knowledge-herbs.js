/**
 * FILE: js/knowledge-herbs.js
 * CHỨC NĂNG: Cơ sở dữ liệu Dược liệu (Mở rộng cho AI).
 * CẬP NHẬT: Thêm nhóm Hồi Dương, Thanh Nhiệt Tả Hỏa, Cố Tinh...
 */

window.knowledge = window.knowledge || {};

// 1. DANH MỤC THUỐC (HERB DATABASE)
window.knowledge.herbsDB = [
    // --- GIẢI BIỂU (Cảm mạo) ---
    { name: 'Tía tô', category: 'Giải Biểu', tags: ['cảm lạnh', 'an thai', 'giải độc cua cá'] },
    { name: 'Kinh giới', category: 'Giải Biểu', tags: ['cảm lạnh', 'dị ứng', 'cầm máu'] },
    { name: 'Gừng tươi', category: 'Giải Biểu', tags: ['ôn trung', 'nôn', 'lạnh bụng', 'cảm hàn'] },
    { name: 'Bạc hà', category: 'Giải Biểu', tags: ['đau đầu', 'đau mắt', 'cảm nhiệt'] },
    { name: 'Cát căn', category: 'Giải Biểu', tags: ['đau vai gáy', 'sốt', 'khát nước'] },
    { name: 'Bạch chỉ', category: 'Giải Biểu', tags: ['đau đầu', 'xoang', 'đau răng'] },
    { name: 'Kim ngân hoa', category: 'Giải Biểu', tags: ['mẩn ngứa', 'mụn nhọt', 'viêm họng'] },
    { name: 'Sài hồ', category: 'Giải Biểu', tags: ['sốt rét', 'giải uất', 'thăng dương'] },
    { name: 'Thuyền thoái', category: 'Giải Biểu', tags: ['mất tiếng', 'sốt cao co giật', 'sáng mắt'] },

    // --- BỔ DƯỠNG (Bổ Khí/Huyết/Âm/Dương) ---
    { name: 'Nhân sâm', category: 'Bổ Dưỡng', tags: ['đại bổ nguyên khí', 'suy nhược', 'cấp cứu'] },
    { name: 'Đảng sâm', category: 'Bổ Dưỡng', tags: ['bổ khí', 'kém ăn', 'mệt mỏi'] },
    { name: 'Hoàng kỳ', category: 'Bổ Dưỡng', tags: ['bổ khí', 'thăng dương', 'sa tử cung', 'mồ hôi trộm'] },
    { name: 'Bạch truật', category: 'Bổ Dưỡng', tags: ['kiện tỳ', 'táo bón', 'tiêu chảy', 'an thai'] },
    { name: 'Thục địa', category: 'Bổ Dưỡng', tags: ['bổ huyết', 'bổ thận', 'đen tóc', 'tinh huyết'] },
    { name: 'Đương quy', category: 'Bổ Dưỡng', tags: ['bổ huyết', 'hoạt huyết', 'đau bụng kinh', 'nhuận tràng'] },
    { name: 'Bạch thược', category: 'Bổ Dưỡng', tags: ['dưỡng huyết', 'giảm đau', 'chuột rút', 'liễm âm'] },
    { name: 'Kỷ tử', category: 'Bổ Dưỡng', tags: ['bổ mắt', 'bổ can thận', 'đẹp da', 'sinh tinh'] },
    { name: 'Đỗ trọng', category: 'Bổ Dưỡng', tags: ['đau lưng', 'bổ thận dương', 'an thai', 'mạnh gân cốt'] },
    { name: 'Nhục thung dung', category: 'Bổ Dưỡng', tags: ['bổ thận dương', 'nhuận tràng', 'liệt dương'] },
    { name: 'Hoài sơn', category: 'Bổ Dưỡng', tags: ['bổ tỳ', 'bổ thận', 'cố tinh', 'tiểu đường'] },
    { name: 'Sơn thù', category: 'Bổ Dưỡng', tags: ['ù tai', 'mồ hôi trộm', 'di tinh', 'bổ can thận'] },

    // --- ÔN LÝ & HỒI DƯƠNG (Trị Hàn) ---
    { name: 'Phụ tử', category: 'Ôn Lý', tags: ['hồi dương cứu nghịch', 'lạnh', 'đau nhức', 'bổ hỏa'] },
    { name: 'Quế nhục', category: 'Ôn Lý', tags: ['lạnh bụng', 'bổ thận dương', 'dẫn hỏa quy nguyên'] },
    { name: 'Gừng khô', category: 'Ôn Lý', tags: ['ôn trung', 'hồi dương', 'ho hàn'] },
    { name: 'Ngô thù du', category: 'Ôn Lý', tags: ['đau đỉnh đầu', 'nôn', 'lạnh bụng'] },

    // --- THANH NHIỆT & TẢ HỎA ---
    { name: 'Hoàng liên', category: 'Thanh Nhiệt', tags: ['tâm hỏa', 'đau mắt', 'kiết lỵ', 'nôn'] },
    { name: 'Hoàng cầm', category: 'Thanh Nhiệt', tags: ['phế nhiệt', 'an thai', 'ho ra máu'] },
    { name: 'Hoàng bá', category: 'Thanh Nhiệt', tags: ['thấp nhiệt', 'tiểu buốt', 'âm hư hỏa vượng'] },
    { name: 'Chi tử', category: 'Thanh Nhiệt', tags: ['bồn chồn', 'chảy máu cam', 'vàng da', 'lợi tiểu'] },
    { name: 'Long đởm thảo', category: 'Thanh Nhiệt', tags: ['can hỏa', 'đau mắt đỏ', 'đau mạn sườn'] },
    { name: 'Huyền sâm', category: 'Thanh Nhiệt', tags: ['viêm họng', 'táo bón', 'nổi hạch'] },
    { name: 'Sinh địa', category: 'Thanh Nhiệt', tags: ['lương huyết', 'chảy máu', 'khát nước'] },
    { name: 'Đơn bì', category: 'Thanh Nhiệt', tags: ['thanh nhiệt lương huyết', 'không mồ hôi', 'ứ huyết'] },

    // --- TRỪ ĐÀM & CHỈ KHÁI (Ho/Đờm) ---
    { name: 'Trần bì', category: 'Trừ Đàm', tags: ['ho đờm', 'đầy bụng', 'khó tiêu', 'lý khí'] },
    { name: 'Bán hạ', category: 'Trừ Đàm', tags: ['ho đờm nhiều', 'nôn mửa', 'trừ thấp'] },
    { name: 'Cát cánh', category: 'Trừ Đàm', tags: ['ho', 'viêm họng', 'mất tiếng', 'dẫn thuốc lên trên'] },
    { name: 'Hạnh nhân', category: 'Trừ Đàm', tags: ['ho suyễn', 'nhuận tràng'] },
    { name: 'Mạch môn', category: 'Trừ Đàm', tags: ['ho khan', 'bổ phổi', 'nhuận tràng', 'sinh tân dịch'] },
    { name: 'Bối mẫu', category: 'Trừ Đàm', tags: ['ho khan', 'tan đờm', 'viêm họng'] },

    // --- LÝ KHÍ & TIÊU HÓA ---
    { name: 'Hương phụ', category: 'Lý Khí', tags: ['đau bụng kinh', 'đau dạ dày', 'stress', 'sơ can'] },
    { name: 'Mộc hương', category: 'Lý Khí', tags: ['đau bụng', 'tiêu chảy', 'lỵ'] },
    { name: 'Sa nhân', category: 'Lý Khí', tags: ['an thai', 'đầy bụng', 'tiêu chảy'] },
    { name: 'Chỉ thực', category: 'Lý Khí', tags: ['táo bón', 'sa dạ dày', 'đầy trướng'] },
    { name: 'Hậu phác', category: 'Lý Khí', tags: ['đầy bụng', 'khó thở', 'táo bón'] },

    // --- HOẠT HUYẾT (Đau nhức/Chấn thương) ---
    { name: 'Xuyên khung', category: 'Hoạt Huyết', tags: ['đau đầu', 'đau nhức', 'hành khí', 'bổ huyết'] },
    { name: 'Ngưu tất', category: 'Hoạt Huyết', tags: ['đau lưng', 'đau gối', 'hạ huyết áp', 'dẫn thuốc đi xuống'] },
    { name: 'Đan sâm', category: 'Hoạt Huyết', tags: ['đau tim', 'mất ngủ', 'bổ huyết', 'thông kinh'] },
    { name: 'Ích mẫu', category: 'Hoạt Huyết', tags: ['kinh nguyệt', 'đẹp da', 'lợi tiểu', 'co tử cung'] },
    { name: 'Ngải cứu', category: 'Hoạt Huyết', tags: ['trừ hàn', 'đau bụng kinh', 'cầm máu', 'an thai'] },
    { name: 'Đào nhân', category: 'Hoạt Huyết', tags: ['táo bón', 'ho', 'ứ huyết'] },
    { name: 'Hồng hoa', category: 'Hoạt Huyết', tags: ['đau bụng kinh', 'ứ huyết', 'chấn thương'] },

    // --- AN THẦN & KHÁC ---
    { name: 'Lạc tiên', category: 'An Thần', tags: ['mất ngủ', 'an thần'] },
    { name: 'Vông nem', category: 'An Thần', tags: ['mất ngủ', 'trừ phong thấp'] },
    { name: 'Tâm sen', category: 'An Thần', tags: ['mất ngủ', 'thanh nhiệt', 'huyết áp cao'] },
    { name: 'Toan táo nhân', category: 'An Thần', tags: ['mất ngủ', 'mồ hôi trộm', 'dưỡng tâm'] },
    { name: 'Phục thần', category: 'An Thần', tags: ['mất ngủ', 'sợ hãi', 'hồi hộp'] },
    { name: 'Trạch tả', category: 'Lợi Thủy', tags: ['phù thũng', 'tiểu buốt', 'thanh nhiệt'] },
    { name: 'Phục linh', category: 'Lợi Thủy', tags: ['phù thũng', 'tiêu chảy', 'an thần', 'kiện tỳ'] }
];

// 2. DANH MỤC PHÂN LOẠI
window.knowledge.herbCategories = ['Giải Biểu', 'Bổ Dưỡng', 'Ôn Lý', 'Thanh Nhiệt', 'Trừ Đàm', 'Lý Khí', 'Hoạt Huyết', 'An Thần', 'Lợi Thủy'];
