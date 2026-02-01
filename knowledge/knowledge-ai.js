/**
 * FILE: js/knowledge-ai.js
 * CHỨC NĂNG: Trí tuệ nhân tạo (AI Engine) - PHIÊN BẢN 2.0 (SMART LOGIC)
 * CẬP NHẬT: 
 * - Thêm từ điển đồng nghĩa (Synonyms).
 * - Thêm logic Biện chứng luận trị (Syndrome Analysis).
 * - Kết hợp Tứ chẩn (Mạch, Lưỡi, Vọng, Văn) để đưa ra bài thuốc.
 */

window.knowledge = window.knowledge || {};

// ============================================================
// 1. TỪ ĐIỂN ĐỒNG NGHĨA (SYNONYM DICTIONARY)
// ============================================================
const SYNONYMS = {
    'đau đầu': ['nhức đầu', 'đầu thống', 'nặng đầu', 'đau nửa đầu', 'váng đầu'],
    'mất ngủ': ['khó ngủ', 'thất miên', 'tỉnh giấc', 'trằn trọc', 'không ngủ được'],
    'đau lưng': ['mỏi lưng', 'yêu thống', 'đau eo', 'cứng lưng', 'đau thắt lưng'],
    'đau bụng': ['phúc thống', 'đau dạ dày', 'đau bao tử', 'lạnh bụng', 'sôi bụng'],
    'ho': ['khái', 'ho khan', 'ho có đờm', 'ngứa cổ', 'viêm họng'],
    'sốt': ['nóng', 'phát nhiệt', 'thân nhiệt cao', 'hâm hấp'],
    'lạnh': ['rét', 'ớn lạnh', 'sợ gió', 'tay chân lạnh', 'hàn'],
    'ăn kém': ['chán ăn', 'biếng ăn', 'ăn không ngon', 'đầy bụng', 'khó tiêu'],
    'mệt mỏi': ['uể oải', 'thiếu sức', 'đoản hơi', 'hụt hơi', 'người yếu'],
    'táo bón': ['đại tiện khó', 'bí đại tiện', 'phân khô'],
    'tiêu chảy': ['đi ngoài', 'ỉa chảy', 'phân lỏng', 'tả', 'kiết lỵ']
};

// ============================================================
// 2. CƠ SỞ DỮ LIỆU HỘI CHỨNG (SYNDROME RULES)
// ============================================================
/* Cấu trúc Rule:
   - required: Từ khóa bắt buộc phải có trong triệu chứng hoặc tứ chẩn.
   - score: Điểm cộng thêm nếu khớp các yếu tố (Mạch, Lưỡi...).
   - suggestion: Kết quả gợi ý (Huyệt, Thuốc, Lời khuyên).
*/
const SYNDROMES = [
    {
        id: 'than_duong_hu',
        name: 'Thận Dương Hư',
        triggers: ['đau lưng', 'mỏi gối', 'ù tai', 'lạnh', 'tiểu đêm', 'yếu sinh lý'],
        checks: {
            mach: ['Trầm', 'Nhược', 'Trì'],
            thiet: ['Nhợt', 'Bệu', 'Rêu trắng'],
            vong: ['Sắc mặt trắng', 'Sợ lạnh']
        },
        result: {
            herbs: ['Thục địa', 'Hoài sơn', 'Sơn thù', 'Phụ tử', 'Quế nhục', 'Đỗ trọng'],
            points: ['BL23', 'GV4', 'CV4', 'KI3', 'BL40'],
            msg: "❄️ Chẩn đoán: THẬN DƯƠNG HƯ. Cần ôn bổ thận dương (Bát vị quế phụ)."
        }
    },
    {
        id: 'than_am_hu',
        name: 'Thận Âm Hư',
        triggers: ['đau lưng', 'người nóng', 'mồ hôi trộm', 'khô họng', 'lòng bàn tay nóng'],
        checks: {
            mach: ['Tế', 'Sác'],
            thiet: ['Đỏ', 'Không rêu', 'Nứt'],
            vong: ['Gò má đỏ', 'Người gầy']
        },
        result: {
            herbs: ['Thục địa', 'Hoài sơn', 'Sơn thù', 'Đơn bì', 'Trạch tả', 'Phục linh'], // Lục vị
            points: ['KI3', 'SP6', 'KI6', 'BL23'],
            msg: "🔥 Chẩn đoán: THẬN ÂM HƯ. Cần tư âm bổ thận (Lục vị địa hoàng)."
        }
    },
    {
        id: 'can_hoa_vuong',
        name: 'Can Hỏa Vượng',
        triggers: ['đau đầu', 'hoa mắt', 'chóng mặt', 'cáu gắt', 'đỏ mặt', 'đắng miệng'],
        checks: {
            mach: ['Huyền', 'Sác'],
            thiet: ['Đỏ', 'Rêu vàng'],
            vong: ['Mắt đỏ']
        },
        result: {
            herbs: ['Long đởm thảo', 'Hoàng cầm', 'Chi tử', 'Sài hồ', 'Cam thảo'],
            points: ['LR2', 'LR3', 'GB20', 'GB34', 'LI11'],
            msg: "😡 Chẩn đoán: CAN HỎA VƯỢNG. Cần thanh can tả hỏa."
        }
    },
    {
        id: 'ty_vi_hu_han',
        name: 'Tỳ Vị Hư Hàn',
        triggers: ['đau bụng', 'lạnh bụng', 'ăn kém', 'tiêu chảy', 'nôn'],
        checks: {
            mach: ['Trầm', 'Trì', 'Nhu'],
            thiet: ['Nhợt', 'Rêu trắng', 'Ướt'],
            vong: ['Sắc mặt vàng', 'Người mệt']
        },
        result: {
            herbs: ['Đảng sâm', 'Bạch truật', 'Gừng khô', 'Cam thảo', 'Mộc hương'],
            points: ['ST36', 'CV12', 'SP6', 'BL20', 'BL21'],
            msg: "🥣 Chẩn đoán: TỲ VỊ HƯ HÀN. Cần ôn trung kiện tỳ."
        }
    },
    {
        id: 'phong_han_cam_mao',
        name: 'Cảm Mạo Phong Hàn',
        triggers: ['sốt', 'sợ lạnh', 'đau đầu', 'ngạt mũi', 'không mồ hôi'],
        checks: {
            mach: ['Phù', 'Khẩn'],
            thiet: ['Rêu trắng mỏng'],
            vong: []
        },
        result: {
            herbs: ['Tía tô', 'Kinh giới', 'Gừng tươi', 'Bạch chỉ', 'Quế chi'],
            points: ['GB20', 'LI4', 'LU7', 'BL12', 'BL13'],
            msg: "🌬️ Chẩn đoán: CẢM MẠO PHONG HÀN. Cần phát tán phong hàn."
        }
    }
];

// ============================================================
// 3. AI HELPER FUNCTIONS
// ============================================================

// Hàm chuẩn hóa văn bản đầu vào: Thay thế từ đồng nghĩa về từ gốc
window.knowledge.normalizeText = function(text) {
    if (!text) return "";
    let processedText = text.toLowerCase();
    
    // Duyệt qua từ điển đồng nghĩa để thay thế
    for (const [standardKey, variations] of Object.entries(SYNONYMS)) {
        variations.forEach(variant => {
            // Thay thế tất cả các biến thể tìm thấy bằng từ chuẩn
            // Dùng RegExp để thay thế toàn bộ (global)
            const regex = new RegExp(variant, 'g');
            processedText = processedText.replace(regex, standardKey);
        });
    }
    return processedText;
};

// ============================================================
// 4. MAIN ANALYSIS ENGINE (TỔNG HỢP & GỢI Ý)
// ============================================================

/* analyze() nhận vào:
   - symptomText: Chuỗi mô tả triệu chứng (String)
   - tuChanData: Object chứa dữ liệu Tứ chẩn (Mảng các string)
     { machchan: [], thietchan: [], vong: [], ... }
*/
window.knowledge.analyze = function(symptomText, tuChanData = {}) {
    // 1. Chuẩn hóa dữ liệu đầu vào
    const rawText = symptomText || "";
    const cleanText = window.knowledge.normalizeText(rawText); // Đã quy đổi về từ chuẩn
    
    // Lấy thông tin Tí Ngọ từ file knowledge-time.js
    const flow = window.knowledge.ziWuFlow ? window.knowledge.ziWuFlow.getCurrentFlow() : null;

    let result = {
        points: [],   // ID các huyệt gợi ý
        herbs: [],    // Tên các vị thuốc gợi ý
        messages: [], // Các thông điệp/chẩn đoán
        syndromeFound: null // Hội chứng tìm thấy (nếu có)
    };

    // --- A. GỢI Ý TỪ THỜI GIAN (ALWAYS ON) ---
    if (flow) {
        result.messages.push(`⏰ <b>${flow.msg}</b>`);
        // Luôn gợi ý huyệt Khai (Horary Point) của giờ hiện tại
        if(flow.openPoint && flow.openPoint !== 'N/A') {
             // Cần map tên huyệt sang ID nếu có thể, tạm thời push tên huyệt
             // (Logic nâng cao sẽ map Name -> ID ở knowledge-acupoints.js)
        }
    }

    // --- B. PHÂN TÍCH HỘI CHỨNG (PATTERN MATCHING) ---
    let bestSyndrome = null;
    let maxScore = 0;

    SYNDROMES.forEach(syn => {
        let score = 0;
        let matchedTriggers = 0;

        // B1. Check Triệu chứng (Triggers) - Quan trọng nhất
        // Tìm trong text đã chuẩn hóa
        syn.triggers.forEach(t => {
            if (cleanText.includes(t)) {
                score += 2; // Khớp triệu chứng chính +2 điểm
                matchedTriggers++;
            }
        });

        // B2. Check Tứ chẩn (Checks) - Dữ liệu bổ trợ
        if (tuChanData) {
            // Check Mạch
            if (tuChanData.machchan && syn.checks.mach) {
                tuChanData.machchan.forEach(m => {
                    // Check lỏng (contains) vì user có thể chọn "Mạch Trầm Nhược"
                    if (syn.checks.mach.some(ck => m.includes(ck))) score += 1;
                });
            }
            // Check Lưỡi (Thiệt chẩn + Thiết)
            if (tuChanData.thietchan && syn.checks.thiet) {
                tuChanData.thietchan.forEach(t => {
                    if (syn.checks.thiet.some(ck => t.includes(ck))) score += 1;
                });
            }
            // Check Vọng/Văn
            if (tuChanData.vong && syn.checks.vong) {
                tuChanData.vong.forEach(v => {
                    if (syn.checks.vong.some(ck => v.includes(ck))) score += 1;
                });
            }
        }

        // Logic chọn hội chứng: Phải có ít nhất 1 triệu chứng chính VÀ điểm cao nhất
        if (matchedTriggers > 0 && score > maxScore) {
            maxScore = score;
            bestSyndrome = syn;
        }
    });

    // --- C. TỔNG HỢP KẾT QUẢ ---
    
    // 1. Nếu tìm ra Hội chứng -> Ưu tiên hiển thị
    if (bestSyndrome) {
        result.syndromeFound = bestSyndrome.name;
        result.herbs.push(...bestSyndrome.result.herbs);
        result.points.push(...bestSyndrome.result.points);
        result.messages.push(bestSyndrome.result.msg);
    } 
    // 2. Nếu không tìm ra Hội chứng -> Chạy chế độ "Đối chứng lập phương" (Symptom-based)
    else {
        // Fallback: Quét từ khóa đơn lẻ như cũ nhưng dùng text đã chuẩn hóa
        
        // Hô hấp
        if (cleanText.includes('ho') || cleanText.includes('sốt') || cleanText.includes('cảm')) {
            result.points.push('LI4', 'LU7', 'GB20', 'BL13');
            result.herbs.push('Bạc hà', 'Kinh giới', 'Tía tô');
            if(cleanText.includes('đờm')) result.herbs.push('Trần bì', 'Bán hạ');
        }
        // Đau nhức
        if (cleanText.includes('đau đầu')) {
            result.points.push('LI4', 'GB20', 'EX-HN5'); // Hợp Cốc, Phong Trì, Thái Dương
            result.herbs.push('Xuyên khung', 'Bạch chỉ');
            result.messages.push("💡 Gợi ý: Đau đầu dùng Xuyên khung dẫn thuốc lên đầu.");
        }
        if (cleanText.includes('đau lưng')) {
            result.points.push('BL23', 'BL40', 'KI3');
            result.herbs.push('Đỗ trọng', 'Ngưu tất');
        }
        // Tiêu hóa
        if (cleanText.includes('đau bụng') || cleanText.includes('tiêu hóa')) {
            result.points.push('ST36', 'CV12', 'PC6');
            result.herbs.push('Mộc hương', 'Sa nhân');
        }
        // Thần kinh
        if (cleanText.includes('mất ngủ')) {
            result.points.push('HT7', 'PC6', 'GV20');
            result.herbs.push('Lạc tiên', 'Vông nem', 'Tâm sen');
        }
    }

    // --- D. LOGIC THỜI CHÂM BỔ SUNG ---
    if (flow) {
        // Nếu đau dạ dày vào giờ Vị -> Gợi ý mạnh
        if ((cleanText.includes('đau bụng') || cleanText.includes('dạ dày')) && flow.meridian === 'Vị (Stomach)') {
            result.messages.push("⚡ <b>Thời điểm vàng:</b> Đang là giờ Vị, châm Túc Tam Lý (ST36) đạt hiệu quả tối đa!");
            if(!result.points.includes('ST36')) result.points.unshift('ST36');
        }
        // Nếu đau lưng vào giờ Thận
        if (cleanText.includes('đau lưng') && flow.meridian === 'Thận (Kidney)') {
             result.messages.push("⚡ <b>Thời điểm vàng:</b> Đang là giờ Thận, châm Thái Khê (KI3) bổ Thận cực tốt.");
             if(!result.points.includes('KI3')) result.points.unshift('KI3');
        }
    }

    // Lọc trùng lặp
    result.points = [...new Set(result.points)];
    result.herbs = [...new Set(result.herbs)];
    result.messages = [...new Set(result.messages)];

    return result;
};

console.log("AI Engine 2.0 Loaded: Synonyms & Syndrome Analysis Ready.");
