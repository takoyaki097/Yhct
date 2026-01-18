/**
 * FILE: knowledge.js
 * CHỨC NĂNG: Tàng Kinh Các - Cơ sở dữ liệu YHCT & AI Engine.
 * TÍNH NĂNG:
 * 1. Tra cứu Huyệt vị.
 * 2. Tính Ngũ Vận Lục Khí (Thiên Can Địa Chi).
 * 3. Tính Tí Ngọ Lưu Chú (Thời châm - Nạp Tử Pháp).
 * 4. AI Phân tích triệu chứng + Gợi ý thuốc/huyệt theo giờ.
 */

window.knowledge = window.knowledge || {};

// ============================================================
// 1. CƠ SỞ DỮ LIỆU HUYỆT VỊ (ACUPOINTS DATABASE)
// ============================================================
window.knowledge.acupoints = [
    // --- VÙNG ĐẦU MẶT ---
    { id: 'GV20', name: 'Bách Hội', meridian: 'Đốc', region: 'Đầu', tags: ['đau đầu', 'mất ngủ', 'sa tử cung', 'trĩ', 'choáng', 'huyết áp thấp'] },
    { id: 'EX-HN5', name: 'Thái Dương', meridian: 'Ngoài Kinh', region: 'Đầu', tags: ['đau đầu', 'đau nửa đầu', 'đau mắt'] },
    { id: 'EX-HN3', name: 'Ấn Đường', meridian: 'Ngoài Kinh', region: 'Mặt', tags: ['đau đầu', 'xoang', 'mất ngủ', 'an thần', 'ngạt mũi'] },
    { id: 'GB20', name: 'Phong Trì', meridian: 'Đởm', region: 'Cổ Gáy', tags: ['đau vai gáy', 'đau đầu', 'cảm mạo', 'tăng huyết áp', 'rối loạn tiền đình'] },
    { id: 'LI20', name: 'Nghênh Hương', meridian: 'Đại Trường', region: 'Mặt', tags: ['ngạt mũi', 'viêm mũi', 'xoang', 'mất khứu giác'] },
    { id: 'ST6', name: 'Giáp Xa', meridian: 'Vị', region: 'Mặt', tags: ['đau răng', 'liệt mặt', 'quai bị', 'nghiến răng'] },
    { id: 'ST4', name: 'Địa Thương', meridian: 'Vị', region: 'Mặt', tags: ['liệt mặt', 'chảy nước dãi', 'đau răng'] },
    { id: 'GV26', name: 'Nhân Trung', meridian: 'Đốc', region: 'Mặt', tags: ['ngất', 'choáng', 'cấp cứu', 'đau lưng cấp'] },
    { id: 'ST8', name: 'Đầu Duy', meridian: 'Vị', region: 'Đầu', tags: ['đau đầu', 'đau nửa đầu', 'chảy nước mắt'] },

    // --- VÙNG TAY & VAI ---
    { id: 'LI4', name: 'Hợp Cốc', meridian: 'Đại Trường', region: 'Tay', tags: ['đau đầu', 'đau răng', 'cảm mạo', 'sốt', 'liệt mặt', 'đau vai', 'tổng huyệt vùng mặt'] },
    { id: 'LI11', name: 'Khúc Trì', meridian: 'Đại Trường', region: 'Tay', tags: ['hạ sốt', 'dị ứng', 'mẩn ngứa', 'đau khuỷu tay', 'tăng huyết áp'] },
    { id: 'PC6', name: 'Nội Quan', meridian: 'Tâm Bào', region: 'Tay', tags: ['đau dạ dày', 'nôn', 'say xe', 'hồi hộp', 'mất ngủ', 'tim đập nhanh'] },
    { id: 'LU7', name: 'Liệt Khuyết', meridian: 'Phế', region: 'Tay', tags: ['ho', 'hen suyễn', 'đau cổ gáy', 'đau đầu', 'tổng huyệt cổ gáy'] },
    { id: 'HT7', name: 'Thần Môn', meridian: 'Tâm', region: 'Tay', tags: ['mất ngủ', 'hồi hộp', 'lo âu', 'tim đập nhanh', 'stress'] },
    { id: 'SI3', name: 'Hậu Khê', meridian: 'Tiểu Trường', region: 'Tay', tags: ['đau lưng', 'đau vai gáy', 'đau cổ', 'mồ hôi trộm'] },
    { id: 'LI15', name: 'Kiên Ngung', meridian: 'Đại Trường', region: 'Vai', tags: ['đau vai', 'liệt tay', 'không giơ tay được'] },
    { id: 'TE5', name: 'Ngoại Quan', meridian: 'Tam Tiêu', region: 'Tay', tags: ['đau đầu', 'đau vai', 'cảm mạo', 'ù tai'] },
    { id: 'LU9', name: 'Thái Uyên', meridian: 'Phế', region: 'Tay', tags: ['ho', 'hen', 'đau cổ tay', 'bổ phế'] },

    // --- VÙNG LƯNG ---
    { id: 'GV14', name: 'Đại Chùy', meridian: 'Đốc', region: 'Lưng', tags: ['sốt cao', 'cảm mạo', 'ho', 'hen', 'tăng sức đề kháng'] },
    { id: 'BL13', name: 'Phế Du', meridian: 'Bàng Quang', region: 'Lưng', tags: ['ho', 'hen', 'viêm phế quản', 'bổ phế'] },
    { id: 'BL15', name: 'Tâm Du', meridian: 'Bàng Quang', region: 'Lưng', tags: ['mất ngủ', 'hồi hộp', 'mộng tinh', 'bổ tâm'] },
    { id: 'BL18', name: 'Can Du', meridian: 'Bàng Quang', region: 'Lưng', tags: ['đau mắt', 'vàng da', 'đau mạn sườn', 'bổ can'] },
    { id: 'BL20', name: 'Tỳ Du', meridian: 'Bàng Quang', region: 'Lưng', tags: ['đầy bụng', 'khó tiêu', 'tiêu chảy', 'bổ tỳ'] },
    { id: 'BL23', name: 'Thận Du', meridian: 'Bàng Quang', region: 'Lưng', tags: ['đau lưng', 'ù tai', 'yếu sinh lý', 'di tinh', 'thận hư', 'đau đầu gối'] },
    { id: 'GV4', name: 'Mệnh Môn', meridian: 'Đốc', region: 'Lưng', tags: ['đau lưng', 'lạnh sống lưng', 'liệt dương', 'di tinh', 'bổ dương'] },

    // --- VÙNG NGỰC & BỤNG ---
    { id: 'CV17', name: 'Đản Trung', meridian: 'Nhâm', region: 'Ngực', tags: ['đau ngực', 'hen suyễn', 'ít sữa', 'hồi hộp', 'tức ngực'] },
    { id: 'CV12', name: 'Trung Quản', meridian: 'Nhâm', region: 'Bụng', tags: ['đau dạ dày', 'đầy bụng', 'nôn', 'ợ chua', 'viêm loét dạ dày'] },
    { id: 'ST25', name: 'Thiên Khu', meridian: 'Vị', region: 'Bụng', tags: ['tiêu chảy', 'táo bón', 'đau bụng', 'rối loạn tiêu hóa'] },
    { id: 'CV6', name: 'Khí Hải', meridian: 'Nhâm', region: 'Bụng', tags: ['suy nhược', 'đau bụng', 'tiểu đêm', 'bổ khí', 'lạnh bụng'] },
    { id: 'CV4', name: 'Quan Nguyên', meridian: 'Nhâm', region: 'Bụng', tags: ['bổ thận', 'tráng dương', 'suy nhược', 'kinh nguyệt không đều', 'tiểu đêm'] },

    // --- VÙNG CHÂN ---
    { id: 'ST36', name: 'Túc Tam Lý', meridian: 'Vị', region: 'Chân', tags: ['đau dạ dày', 'suy nhược', 'tăng sức đề kháng', 'tiêu hóa kém', 'đau gối', 'tổng huyệt tiêu hóa'] },
    { id: 'SP6', name: 'Tam Âm Giao', meridian: 'Tỳ', region: 'Chân', tags: ['mất ngủ', 'kinh nguyệt không đều', 'đau bụng kinh', 'bí tiểu', 'di tinh', 'dưỡng âm'] },
    { id: 'SP10', name: 'Huyết Hải', meridian: 'Tỳ', region: 'Chân', tags: ['ngứa', 'dị ứng', 'kinh nguyệt không đều', 'bổ huyết', 'đau gối'] },
    { id: 'LR3', name: 'Thái Xung', meridian: 'Can', region: 'Chân', tags: ['tăng huyết áp', 'đau đầu', 'chóng mặt', 'cáu gắt', 'mất ngủ', 'bình can'] },
    { id: 'KI1', name: 'Dũng Tuyền', meridian: 'Thận', region: 'Chân', tags: ['mất ngủ', 'hạ huyết áp', 'ngất', 'sốt cao co giật', 'nóng gan bàn chân'] },
    { id: 'KI3', name: 'Thái Khê', meridian: 'Thận', region: 'Chân', tags: ['đau lưng', 'ù tai', 'ho hen', 'bổ thận âm'] },
    { id: 'GB34', name: 'Dương Lăng Tuyền', meridian: 'Đởm', region: 'Chân', tags: ['đau thần kinh tọa', 'đau khớp gối', 'liệt nửa người', 'đau mạn sườn', 'chuột rút'] },
    { id: 'BL40', name: 'Ủy Trung', meridian: 'Bàng Quang', region: 'Chân', tags: ['đau lưng', 'đau thần kinh tọa', 'đau đầu gối', 'tổng huyệt vùng lưng'] },
    { id: 'GB30', name: 'Hoàn Khiêu', meridian: 'Đởm', region: 'Chân', tags: ['đau thần kinh tọa', 'đau mông', 'liệt chi dưới'] },
    { id: 'ST40', name: 'Phong Long', meridian: 'Vị', region: 'Chân', tags: ['trừ đờm', 'ho có đờm', 'hen suyễn', 'béo phì', 'đau đầu'] }
];

window.knowledge.regions = ['Đầu', 'Mặt', 'Cổ Gáy', 'Vai', 'Tay', 'Ngực', 'Bụng', 'Lưng', 'Chân'];
window.knowledge.meridians = ['Phế', 'Đại Trường', 'Vị', 'Tỳ', 'Tâm', 'Tiểu Trường', 'Bàng Quang', 'Thận', 'Tâm Bào', 'Tam Tiêu', 'Đởm', 'Can', 'Nhâm', 'Đốc', 'Ngoài Kinh'];

// ============================================================
// 2. NGŨ VẬN LỤC KHÍ (YUNQI ENGINE)
// ============================================================
window.knowledge.yunQi = {
    stems: ["Giáp", "Ất", "Bính", "Đinh", "Mậu", "Kỷ", "Canh", "Tân", "Nhâm", "Quý"],
    branches: ["Tý", "Sửu", "Dần", "Mão", "Thìn", "Tỵ", "Ngọ", "Mùi", "Thân", "Dậu", "Tuất", "Hợi"],
    stemNature: {
        0: { element: 'Thổ', nature: 'Thái Quá (Ẩm thấp)' }, 1: { element: 'Kim', nature: 'Bất Cập (Gió nhiều)' },
        2: { element: 'Thủy', nature: 'Thái Quá (Lạnh giá)' }, 3: { element: 'Mộc', nature: 'Bất Cập (Nóng khô)' },
        4: { element: 'Hỏa', nature: 'Thái Quá (Oi bức)' }, 5: { element: 'Thổ', nature: 'Bất Cập (Gió ẩm)' },
        6: { element: 'Kim', nature: 'Thái Quá (Khô hanh)' }, 7: { element: 'Thủy', nature: 'Bất Cập (Mưa nhiều)' },
        8: { element: 'Mộc', nature: 'Thái Quá (Gió lớn)' }, 9: { element: 'Hỏa', nature: 'Bất Cập (Sương lạnh)' }
    },
    getCurrentInfo: function() {
        const date = new Date();
        const year = date.getFullYear();
        let stemIndex = (year - 4) % 10;
        let branchIndex = (year - 4) % 12;
        if (stemIndex < 0) stemIndex += 10;
        if (branchIndex < 0) branchIndex += 12;
        const stem = this.stems[stemIndex];
        const branch = this.branches[branchIndex];
        const nature = this.stemNature[stemIndex];
        return { text: `Năm ${stem} ${branch}`, nature: `Vận ${nature.element} ${nature.nature}` };
    }
};

// ============================================================
// 3. TÍ NGỌ LƯU CHÚ (ZI WU LIU ZHU - CHRONO ACUPUNCTURE)
// ============================================================
window.knowledge.ziWuFlow = {
    // Bảng tra cứu 12 canh giờ (Nạp Tử Pháp - Theo giờ vượng tạng phủ)
    hours: {
        23: { branch: 'Tý', meridian: 'Đởm', element: 'Mộc', openPoint: 'GB44 (Túc Khiếu Âm)', msg: 'Giờ Tý (23h-1h): Đởm vượng. Nên ngủ say để dưỡng Mật.' },
        0:  { branch: 'Tý', meridian: 'Đởm', element: 'Mộc', openPoint: 'GB44 (Túc Khiếu Âm)', msg: 'Giờ Tý (23h-1h): Đởm vượng. Nên ngủ say để dưỡng Mật.' },
        1:  { branch: 'Sửu', meridian: 'Can', element: 'Mộc', openPoint: 'LR1 (Đại Đôn)', msg: 'Giờ Sửu (1h-3h): Can vượng. Ngủ sâu để dưỡng Huyết.' },
        2:  { branch: 'Sửu', meridian: 'Can', element: 'Mộc', openPoint: 'LR1 (Đại Đôn)', msg: 'Giờ Sửu (1h-3h): Can vượng. Ngủ sâu để dưỡng Huyết.' },
        3:  { branch: 'Dần', meridian: 'Phế', element: 'Kim', openPoint: 'LU11 (Thiếu Thương)', msg: 'Giờ Dần (3h-5h): Phế vượng. Dễ ho vào giờ này.' },
        4:  { branch: 'Dần', meridian: 'Phế', element: 'Kim', openPoint: 'LU11 (Thiếu Thương)', msg: 'Giờ Dần (3h-5h): Phế vượng. Dễ ho vào giờ này.' },
        5:  { branch: 'Mão', meridian: 'Đại Trường', element: 'Kim', openPoint: 'LI1 (Thương Dương)', msg: 'Giờ Mão (5h-7h): Đại Trường vượng. Nên đi vệ sinh.' },
        6:  { branch: 'Mão', meridian: 'Đại Trường', element: 'Kim', openPoint: 'LI1 (Thương Dương)', msg: 'Giờ Mão (5h-7h): Đại Trường vượng. Nên đi vệ sinh.' },
        7:  { branch: 'Thìn', meridian: 'Vị', element: 'Thổ', openPoint: 'ST45 (Lệ Đoài)', msg: 'Giờ Thìn (7h-9h): Vị vượng. Giờ tốt nhất để ăn sáng.' },
        8:  { branch: 'Thìn', meridian: 'Vị', element: 'Thổ', openPoint: 'ST45 (Lệ Đoài)', msg: 'Giờ Thìn (7h-9h): Vị vượng. Giờ tốt nhất để ăn sáng.' },
        9:  { branch: 'Tỵ', meridian: 'Tỳ', element: 'Thổ', openPoint: 'SP1 (Ẩn Bạch)', msg: 'Giờ Tỵ (9h-11h): Tỳ vượng. Tinh thần minh mẫn, làm việc tốt.' },
        10: { branch: 'Tỵ', meridian: 'Tỳ', element: 'Thổ', openPoint: 'SP1 (Ẩn Bạch)', msg: 'Giờ Tỵ (9h-11h): Tỳ vượng. Tinh thần minh mẫn, làm việc tốt.' },
        11: { branch: 'Ngọ', meridian: 'Tâm', element: 'Hỏa', openPoint: 'HT9 (Thiếu Xung)', msg: 'Giờ Ngọ (11h-13h): Tâm vượng. Nên nghỉ trưa ngắn dưỡng Tim.' },
        12: { branch: 'Ngọ', meridian: 'Tâm', element: 'Hỏa', openPoint: 'HT9 (Thiếu Xung)', msg: 'Giờ Ngọ (11h-13h): Tâm vượng. Nên nghỉ trưa ngắn dưỡng Tim.' },
        13: { branch: 'Mùi', meridian: 'Tiểu Trường', element: 'Hỏa', openPoint: 'SI1 (Thiếu Trạch)', msg: 'Giờ Mùi (13h-15h): Tiểu Trường vượng. Hấp thu dinh dưỡng.' },
        14: { branch: 'Mùi', meridian: 'Tiểu Trường', element: 'Hỏa', openPoint: 'SI1 (Thiếu Trạch)', msg: 'Giờ Mùi (13h-15h): Tiểu Trường vượng. Hấp thu dinh dưỡng.' },
        15: { branch: 'Thân', meridian: 'Bàng Quang', element: 'Thủy', openPoint: 'BL67 (Chí Âm)', msg: 'Giờ Thân (15h-17h): Bàng Quang vượng. Nên uống nước thải độc.' },
        16: { branch: 'Thân', meridian: 'Bàng Quang', element: 'Thủy', openPoint: 'BL67 (Chí Âm)', msg: 'Giờ Thân (15h-17h): Bàng Quang vượng. Nên uống nước thải độc.' },
        17: { branch: 'Dậu', meridian: 'Thận', element: 'Thủy', openPoint: 'KI1 (Dũng Tuyền)', msg: 'Giờ Dậu (17h-19h): Thận vượng. Giờ tốt nhất để dưỡng Thận tàng tinh.' },
        18: { branch: 'Dậu', meridian: 'Thận', element: 'Thủy', openPoint: 'KI1 (Dũng Tuyền)', msg: 'Giờ Dậu (17h-19h): Thận vượng. Giờ tốt nhất để dưỡng Thận tàng tinh.' },
        19: { branch: 'Tuất', meridian: 'Tâm Bào', element: 'Hỏa', openPoint: 'PC9 (Trung Xung)', msg: 'Giờ Tuất (19h-21h): Tâm Bào vượng. Giữ tinh thần vui vẻ.' },
        20: { branch: 'Tuất', meridian: 'Tâm Bào', element: 'Hỏa', openPoint: 'PC9 (Trung Xung)', msg: 'Giờ Tuất (19h-21h): Tâm Bào vượng. Giữ tinh thần vui vẻ.' },
        21: { branch: 'Hợi', meridian: 'Tam Tiêu', element: 'Hỏa', openPoint: 'TE1 (Quan Xung)', msg: 'Giờ Hợi (21h-23h): Tam Tiêu vượng. Nên đi ngủ để dưỡng sinh.' },
        22: { branch: 'Hợi', meridian: 'Tam Tiêu', element: 'Hỏa', openPoint: 'TE1 (Quan Xung)', msg: 'Giờ Hợi (21h-23h): Tam Tiêu vượng. Nên đi ngủ để dưỡng sinh.' }
    },

    getCurrentFlow: function() {
        const h = new Date().getHours();
        return this.hours[h];
    }
};

// ============================================================
// 4. AI ANALYSIS ENGINE (TỔNG HỢP & GỢI Ý)
// ============================================================
window.knowledge.analyze = function(symptomText) {
    if (!symptomText) return null;
    const text = symptomText.toLowerCase();
    
    // Lấy thông tin Tí Ngọ
    const flow = this.ziWuFlow.getCurrentFlow();

    let result = {
        points: [], herbs: [], messages: []
    };

    // --- 1. GỢI Ý CHUNG TỪ THỜI GIAN (ALWAYS ON) ---
    result.messages.push(`⏰ ${flow.msg}`);

    // --- 2. PHÂN TÍCH TRIỆU CHỨNG & THỜI CHÂM ---

    // A. NHÓM CẢM MẠO / HÔ HẤP (Phế)
    if (text.includes('cảm') || text.includes('hắt hơi') || text.includes('sổ mũi') || text.includes('phổi') || text.includes('ho')) {
        result.points.push('LI4', 'LI20', 'GB20', 'LU7', 'GV14', 'BL13');
        if (flow.meridian === 'Phế') {
            result.points.push('LU1', 'LU9');
            result.messages.push("⚡ Đang là giờ PHẾ (3-5h): Châm Thái Uyên (LU9) hiệu quả cao.");
        }
        if (text.includes('lạnh') || text.includes('rét')) {
            result.herbs.push('Tía tô', 'Kinh giới', 'Gừng tươi', 'Bạch chỉ');
            result.messages.push("❄️ Cảm Phong Hàn: Khu phong tán hàn (Tía tô, Gừng).");
        } else if (text.includes('nóng') || text.includes('sốt')) {
            result.herbs.push('Kim ngân hoa', 'Liên kiều', 'Bạc hà', 'Cát căn');
            result.messages.push("🔥 Cảm Phong Nhiệt: Thanh nhiệt giải biểu.");
        }
        if (text.includes('đờm')) {
             result.points.push('ST40'); 
             result.herbs.push('Trần bì', 'Bán hạ');
        } else if (text.includes('ho khan')) {
             result.herbs.push('Mạch môn', 'Tang diệp');
        }
    }

    // B. NHÓM CƠ XƯƠNG KHỚP (Tý chứng)
    if (text.includes('đau đầu')) {
        result.points.push('LI4', 'GB20', 'EX-HN5');
        if (text.includes('đỉnh đầu')) { result.points.push('GV20'); result.herbs.push('Cảo bản'); }
        if (text.includes('sau gáy')) { result.points.push('GB20'); result.herbs.push('Cát căn', 'Khương hoạt'); }
        if (text.includes('thái dương')) { result.points.push('EX-HN5'); result.herbs.push('Xuyên khung', 'Sài hồ'); }
    }
    if (text.includes('đau lưng') || text.includes('thận')) {
        result.points.push('BL23', 'GV4', 'BL40', 'KI3');
        if (flow.meridian === 'Thận') {
            result.points.push('KI1');
            result.messages.push("⚡ Đang là giờ THẬN (17-19h): Châm Dũng Tuyền/Thái Khê cực tốt bổ thận.");
        }
        if (text.includes('lạnh')) {
            result.herbs.push('Đỗ trọng', 'Ngưu tất', 'Quế chi', 'Phụ tử');
            result.messages.push("❄️ Đau lưng Hàn: Cần ôn bổ thận dương.");
        } else {
            result.herbs.push('Đỗ trọng', 'Ngưu tất', 'Tang ký sinh');
        }
    }

    // C. NHÓM TIÊU HÓA (Tỳ Vị)
    if (text.includes('đau bụng') || text.includes('dạ dày') || text.includes('đầy hơi') || text.includes('tiêu hóa')) {
        result.points.push('ST36', 'CV12', 'PC6', 'ST25');
        if (flow.meridian === 'Vị') {
             result.points.push('ST45');
             result.messages.push("⚡ Đang là giờ VỊ (7-9h): Thời điểm vàng trị dạ dày. Châm Túc Tam Lý!");
        }
        if (text.includes('lạnh') || text.includes('sôi bụng')) {
            result.herbs.push('Gừng nướng', 'Mộc hương', 'Sa nhân', 'Trần bì');
            result.messages.push("💡 Tỳ vị hư hàn: Dùng thuốc lý khí ôn trung.");
        } else if (text.includes('ợ chua') || text.includes('nóng')) {
            result.herbs.push('Hoàng liên', 'Mẫu lệ', 'Ô tặc cốt');
        }
    }

    // D. NHÓM THẦN KINH (Tâm)
    if (text.includes('mất ngủ') || text.includes('tim') || text.includes('hồi hộp')) {
        result.points.push('HT7', 'PC6', 'GV20', 'SP6');
        result.herbs.push('Lạc tiên', 'Vông nem', 'Tâm sen', 'Toan táo nhân');
        if (flow.meridian === 'Tâm') {
             result.messages.push("⚡ Giờ TÂM (11-13h): Nên dưỡng thần, tránh kích động.");
        } else if (flow.meridian === 'Thận') {
             result.messages.push("⚡ Giờ Dậu (17-19h): Châm Thận (Dũng Tuyền) dẫn hỏa quy nguyên, trị mất ngủ.");
        }
    }

    // E. NHÓM HUYẾT / PHỤ KHOA
    if (text.includes('kinh nguyệt') || text.includes('đau bụng kinh') || text.includes('huyết')) {
        result.points.push('SP6', 'CV4', 'SP10', 'BL17');
        result.herbs.push('Hương phụ', 'Ngải cứu', 'Ích mẫu', 'Đương quy');
        if (text.includes('xanh xao') || text.includes('chóng mặt')) {
            result.herbs.push('Thục địa', 'Đương quy', 'Bạch thược', 'Xuyên khung'); // Tứ vật
            result.messages.push("💡 Huyết hư: Dùng bài Tứ vật thang.");
        }
    }

    // Lọc trùng
    result.points = [...new Set(result.points)];
    result.herbs = [...new Set(result.herbs)];
    result.messages = [...new Set(result.messages)];

    return result;
};

console.log("Knowledge Base Loaded: YunQi & ZiWu Connected.");
