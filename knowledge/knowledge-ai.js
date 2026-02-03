/**
 * FILE: knowledge/knowledge-ai.js
 * CHỨC NĂNG: Trí tuệ nhân tạo (AI Engine) - PHIÊN BẢN 4.1
 * CẬP NHẬT: 
 * - Nạp Giáp Pháp hiển thị Full tên huyệt.
 * - Tự động tra cứu tên huyệt từ Database.
 */

window.knowledge = window.knowledge || {};

// ============================================================
// 1. TỪ ĐIỂN ĐỒNG NGHĨA (SYNONYMS)
// ============================================================
const SYNONYMS = {
    // Nhóm Đau
    'đau đầu': ['nhức đầu', 'đầu thống', 'nặng đầu', 'đau nửa đầu', 'váng đầu', 'choáng váng', 'đau đỉnh đầu', 'biêng biêng'],
    'đau lưng': ['mỏi lưng', 'yêu thống', 'đau eo', 'cứng lưng', 'đau thắt lưng', 'đau cột sống', 'cụp lưng', 'mỏi sống lưng'],
    'đau bụng': ['phúc thống', 'đau dạ dày', 'đau bao tử', 'lạnh bụng', 'sôi bụng', 'đau thượng vị', 'đầy hơi', 'chướng bụng', 'xót ruột'],
    'đau nhức': ['đau mỏi', 'nhức mỏi', 'tê bì', 'đau cơ', 'ê ẩm', 'mỏi người', 'đau khớp', 'sưng khớp'],
    'đau vai gáy': ['mỏi cổ', 'cứng cổ', 'đau cổ vai', 'ngoẹo cổ', 'lạc chẩm'],

    // Nhóm Hô hấp - Tai Mũi Họng
    'ho': ['khái', 'ho khan', 'ho có đờm', 'ngứa cổ', 'viêm họng', 'đau họng', 'khản tiếng', 'mất tiếng', 'ho gió'],
    'ngạt mũi': ['tắc mũi', 'sổ mũi', 'chảy nước mũi', 'viêm mũi', 'xoang', 'hắt hơi'],
    'khó thở': ['hen', 'suyễn', 'hụt hơi', 'tức ngực', 'đoản hơi', 'thở dốc'],

    // Nhóm Nhiệt - Hàn
    'sốt': ['nóng', 'phát nhiệt', 'thân nhiệt cao', 'hâm hấp', 'sốt cao', 'gai rét', 'vã mồ hôi'],
    'lạnh': ['rét', 'ớn lạnh', 'sợ gió', 'tay chân lạnh', 'hàn', 'thương hàn', 'lạnh sống lưng'],

    // Nhóm Tiêu hóa - Bài tiết
    'ăn kém': ['chán ăn', 'biếng ăn', 'ăn không ngon', 'đầy bụng', 'khó tiêu', 'trào ngược', 'ợ hơi', 'ợ chua', 'buồn nôn'],
    'táo bón': ['đại tiện khó', 'bí đại tiện', 'phân khô', 'bón', 'kiết'],
    'tiêu chảy': ['đi ngoài', 'ỉa chảy', 'phân lỏng', 'tả', 'kiết lỵ', 'đi tướt', 'phân sống'],
    'tiểu tiện': ['tiểu buốt', 'tiểu rắt', 'tiểu đêm', 'đái dầm', 'bí tiểu', 'tiểu nhiều'],

    // Nhóm Thần kinh - Tâm thần
    'mất ngủ': ['khó ngủ', 'thất miên', 'tỉnh giấc', 'trằn trọc', 'không ngủ được', 'ngủ kém', 'mộng mị', 'ác mộng'],
    'mệt mỏi': ['uể oải', 'thiếu sức', 'lờ đờ', 'suy nhược', 'hoa mắt', 'chóng mặt', 'xây xẩm'],
    'lo âu': ['hồi hộp', 'tim đập nhanh', 'đánh trống ngực', 'sợ hãi', 'hay quên', 'stress'],

    // Nhóm Viêm nhiễm
    'viêm': ['sưng', 'nóng', 'đỏ', 'đau', 'nhiễm trùng', 'mưng mủ', 'áp xe']
};

// ============================================================
// 2. CƠ SỞ DỮ LIỆU HỘI CHỨNG & PHÁC ĐỒ (RULES)
// ============================================================
const SYNDROMES = [
    // --- NHÓM CẢM MẠO & HÔ HẤP ---
    {
        id: 'cam_mao_phong_han',
        name: 'Cảm Mạo Phong Hàn (Cảm lạnh)',
        triggers: ['sốt', 'sợ lạnh', 'đau đầu', 'ngạt mũi', 'không mồ hôi', 'đau vai gáy', 'hắt hơi', 'rêu trắng'],
        result: {
            herbs: ['Tía tô', 'Kinh giới', 'Gừng tươi', 'Quế chi', 'Bạch chỉ', 'Hương phụ'],
            west: ['Paracetamol 500mg (Hạ sốt/Đau đầu)', 'Vitamin C 500mg (Tăng đề kháng)', 'Chlorpheniramin 4mg (Sổ mũi)'],
            points: ['GB20', 'LI4', 'LU7', 'BL12', 'BL13'],
            msg: "🌬️ Chẩn đoán: CẢM MẠO PHONG HÀN. Cần phát tán phong hàn, giải biểu. Nên ăn cháo hành tía tô."
        }
    },
    {
        id: 'cam_mao_phong_nhiet',
        name: 'Cảm Mạo Phong Nhiệt (Cảm nóng)',
        triggers: ['sốt cao', 'đau họng', 'khát nước', 'mồ hôi', 'rêu vàng', 'ho có đờm', 'nước tiểu vàng'],
        result: {
            herbs: ['Kim ngân hoa', 'Liên kiều', 'Bạc hà', 'Cát căn', 'Sài hồ'],
            west: ['Paracetamol 500mg', 'Ibuprofen 400mg', 'Oresol (Bù nước)'],
            points: ['GV14', 'LI11', 'LI4', 'LU5', 'LU10'],
            msg: "🔥 Chẩn đoán: CẢM MẠO PHONG NHIỆT. Cần thanh nhiệt giải độc, tân lương giải biểu."
        }
    },

    // --- NHÓM TIÊU HÓA ---
    {
        id: 'viem_da_day',
        name: 'Đau Dạ Dày / Tỳ Vị Hư Hàn',
        triggers: ['đau bụng', 'lạnh bụng', 'ăn kém', 'nôn', 'ợ chua', 'trào ngược', 'đau thượng vị'],
        result: {
            herbs: ['Nghệ (Khương hoàng)', 'Mật ong', 'Hoài sơn', 'Cam thảo', 'Trần bì', 'Mộc hương'],
            west: ['Omeprazole 20mg (Giảm axit)', 'Phosphalugel (Sữa dạ dày)', 'Domperidon 10mg (Chống nôn)'],
            points: ['ST36', 'CV12', 'PC6', 'SP4', 'BL21'],
            msg: "🥣 Gợi ý: Các thuốc nhóm ức chế bơm proton (PPI) hoặc trung hòa axit. Đông y dùng phép Ôn trung kiện tỳ."
        }
    },
    {
        id: 'roi_loan_tieu_hoa',
        name: 'Rối Loạn Tiêu Hóa / Tỳ Hư Thấp Trệ',
        triggers: ['tiêu chảy', 'đi ngoài', 'đau bụng', 'sôi bụng', 'phân sống', 'người nặng nề'],
        result: {
            herbs: ['Bạch truật', 'Hoài sơn', 'Mộc hương', 'Sa nhân', 'Trần bì', 'Biển đậu'],
            west: ['Smecta (Cầm tiêu chảy)', 'Berberin (Kháng khuẩn)', 'Men vi sinh (Enterogermina)'],
            points: ['ST25', 'ST36', 'SP9', 'CV6'],
            msg: "💧 Gợi ý: Bù nước điện giải (Oresol) nếu tiêu chảy nhiều. Kiêng đồ tanh, mỡ, sữa."
        }
    },

    // --- NHÓM CƠ XƯƠNG KHỚP ---
    {
        id: 'dau_lung_cap',
        name: 'Đau Lưng Cấp / Thận Hư',
        triggers: ['đau lưng', 'mỏi gối', 'ù tai', 'yếu sinh lý', 'mang vác nặng', 'tiểu đêm', 'lạnh sống lưng'],
        result: {
            herbs: ['Đỗ trọng', 'Ngưu tất', 'Tục đoạn', 'Thục địa', 'Ba kích', 'Cẩu tích'],
            west: ['Paracetamol 500mg', 'Ibuprofen 400mg (Kháng viêm)', 'Vitamin 3B (Bổ thần kinh)', 'Eperisone 50mg (Giãn cơ)'],
            points: ['BL23', 'GV4', 'KI3', 'BL40', 'GV26', 'GB34'],
            msg: "⚡ Gợi ý: Kết hợp thuốc giãn cơ và vitamin nhóm B liều cao. Châm cứu bổ Thận, thông kinh lạc."
        }
    },
    {
        id: 'dau_than_kinh_toa',
        name: 'Đau Thần Kinh Tọa',
        triggers: ['đau lưng lan xuống chân', 'tê bì', 'đau mông', 'khó cúi', 'rễ thần kinh'],
        result: {
            herbs: ['Độc hoạt', 'Tang ký sinh', 'Ngưu tất', 'Phòng phong', 'Tế tân'],
            west: ['Meloxicam 7.5mg', 'Gabapentin (Giảm đau thần kinh)', 'Vitamin 3B'],
            points: ['BL23', 'GB30', 'BL40', 'GB34', 'BL60'],
            msg: "🦴 Gợi ý: Bài Độc Hoạt Tang Ký Sinh. Tránh mang vác nặng, nên tập vật lý trị liệu."
        }
    },
    {
        id: 'hoi_chung_co_vai_gay',
        name: 'Hội Chứng Cổ Vai Gáy',
        triggers: ['đau vai gáy', 'cứng cổ', 'ngoẹo cổ', 'đau lan xuống tay', 'tê tay'],
        result: {
            herbs: ['Cát căn', 'Khương hoạt', 'Bạch thược', 'Cam thảo', 'Quế chi'],
            west: ['Eperisone 50mg (Giãn cơ)', 'Paracetamol', 'Miếng dán Salonpas'],
            points: ['GB20', 'GB21', 'SI3', 'LI4', 'TE5'],
            msg: "💆 Gợi ý: Xoa bóp bấm huyệt vùng cổ gáy. Bài Quyên Tí Thang hoặc Cát Căn Thang."
        }
    },

    // --- NHÓM THẦN KINH & TIM MẠCH ---
    {
        id: 'mat_ngu_tam_ty',
        name: 'Mất Ngủ (Tâm Tỳ Hư)',
        triggers: ['mất ngủ', 'hồi hộp', 'hay quên', 'ăn kém', 'mệt mỏi', 'lo âu', 'sắc mặt vàng'],
        result: {
            herbs: ['Lạc tiên', 'Vông nem', 'Tâm sen', 'Long nhãn', 'Táo nhân', 'Viễn chí'],
            west: ['Rotunda (Bình vôi)', 'Magie B6 (An thần)', 'Ginkgo Biloba (Hoạt huyết)', 'Melatonin'],
            points: ['HT7', 'PC6', 'SP6', 'GV20', 'EX-HN (An Miên)'],
            msg: "🌙 Gợi ý: Dùng các thảo dược an thần nhẹ hoặc thuốc bổ não. Kiêng trà/cà phê tối. Bài Quy Tỳ Thang."
        }
    },
    {
        id: 'huyet_ap_cao',
        name: 'Tăng Huyết Áp / Can Dương Thượng Cang',
        triggers: ['đau đầu', 'chóng mặt', 'hoa mắt', 'mặt đỏ', 'cáu gắt', 'ù tai', 'nóng phừng'],
        result: {
            herbs: ['Câu đằng', 'Hạ khô thảo', 'Hoa hòe', 'Ngưu tất', 'Cúc hoa', 'Kỷ tử'],
            west: ['Amlodipin 5mg', 'Losartan 50mg', 'Lợi tiểu'],
            points: ['LR3', 'LI11', 'GB20', 'KI1', 'PC6'],
            msg: "🔴 Cảnh báo: Đo huyết áp ngay. Đông y dùng phép Bình can tiềm dương (Thiên ma câu đằng ẩm)."
        }
    },
    {
        id: 'thieu_mau_nao',
        name: 'Thiểu Năng Tuần Hoàn Não',
        triggers: ['hoa mắt', 'chóng mặt', 'xây xẩm', 'đau đầu', 'buồn nôn', 'quên'],
        result: {
            herbs: ['Đương quy', 'Xuyên khung', 'Bạch thược', 'Thục địa', 'Kỷ tử'],
            west: ['Ginkgo Biloba', 'Piracetam', 'Cinnarizin (Rối loạn tiền đình)'],
            points: ['GV20', 'EX-HN5', 'GB20', 'ST36'],
            msg: "🧠 Gợi ý: Bổ huyết hoạt huyết. Bài Tứ Vật Thang gia giảm."
        }
    }
];

// ============================================================
// 3. AI HELPER FUNCTIONS (XỬ LÝ NGÔN NGỮ TỰ NHIÊN)
// ============================================================

window.knowledge.normalizeText = function(text) {
    if (!text) return "";
    let processedText = text.toLowerCase();
    for (const [standardKey, variations] of Object.entries(SYNONYMS)) {
        variations.forEach(variant => {
            const regex = new RegExp(variant, 'g');
            processedText = processedText.replace(regex, standardKey);
        });
    }
    return processedText;
};

// Hàm lấy tên đầy đủ của huyệt (VD: "LU9" -> "LU9 - Thái Uyên")
window.knowledge.getFullPointName = function(code) {
    if (!code) return "";
    const id = code.split(' ')[0]; // Lấy ID sạch (bỏ phần chú thích cũ trong ngoặc nếu có)
    
    // Tìm trong database huyệt
    if (window.knowledge.acupoints) {
        const p = window.knowledge.acupoints.find(x => x.id === id);
        if (p) {
            // Nếu code gốc có thêm thông tin trong ngoặc (VD: "GB44 (Tỉnh)") thì nối thêm vào
            const suffix = code.includes('(') ? ` <span class="text-xs opacity-70">${code.substring(code.indexOf('('))}</span>` : '';
            return `<b>${id} - ${p.name}</b>${suffix}`;
        }
    }
    return `<b>${code}</b>`;
};

// ============================================================
// 4. MAIN ANALYSIS ENGINE (BỘ XỬ LÝ TRUNG TÂM)
// ============================================================

window.knowledge.analyze = function(symptomText, tuChanData = {}) {
    const rawText = symptomText || "";
    const cleanText = window.knowledge.normalizeText(rawText);
    
    const timeFlow = window.knowledge.ziWuFlow ? window.knowledge.ziWuFlow.getCurrentAnalysis() : null;

    let result = {
        points: [], herbs: [], west: [], messages: [], 
        syndromeFound: null, timeBasedSuggestion: null 
    };

    // --- A. PHÂN TÍCH HỘI CHỨNG ---
    let bestSyndrome = null;
    let maxScore = 0;
    SYNDROMES.forEach(syn => {
        let score = 0;
        syn.triggers.forEach(t => { if (cleanText.includes(t)) score += 2; });
        if (score > maxScore && score > 0) { maxScore = score; bestSyndrome = syn; }
    });

    if (bestSyndrome) {
        result.syndromeFound = bestSyndrome.name;
        result.herbs.push(...bestSyndrome.result.herbs);
        result.points.push(...bestSyndrome.result.points);
        if (bestSyndrome.result.west) result.west.push(...bestSyndrome.result.west);
        result.messages.push(bestSyndrome.result.msg);
    } else {
        if (cleanText.includes('đau')) { result.points.push('LI4', 'LR3'); result.west.push('Paracetamol 500mg'); }
        if (cleanText.includes('sốt')) { result.points.push('GV14', 'LI11'); }
    }

    // --- B. TÍNH TOÁN THỜI CHÂM (CHI TIẾT) ---
    if (timeFlow) {
        const getFn = window.knowledge.getFullPointName;

        let timeMsg = `
        <div class="border-b border-dashed border-[#8d6e63] pb-2 mb-3">
            <div class="text-sm font-black text-[#3e2723] uppercase flex items-center gap-2">
                <span class="text-xl">🕒</span> ${timeFlow.timeInfo}
            </div>
            <div class="text-xs text-[#5d4037] mt-1 font-medium italic opacity-80">
                Dự báo luồng khí huyết đang vận hành trong kinh mạch.
            </div>
        </div>`;
        
        // 1. Nạp Tử (Theo Giờ)
        if (timeFlow.naZi) {
            timeMsg += `
            <div class="mb-4 bg-[#e8f5e9] p-3 rounded-xl border border-[#c8e6c9]">
                <div class="flex items-center gap-2 mb-2">
                    <span class="bg-[#2e7d32] text-white text-[10px] font-bold px-2 py-0.5 rounded">QUAN TRỌNG</span>
                    <span class="font-bold text-[#1b5e20] text-sm uppercase">1. Nạp Tử (Theo Giờ)</span>
                </div>
                
                <div class="grid grid-cols-1 gap-2 text-sm">
                    <div class="flex justify-between border-b border-green-200 pb-1">
                        <span class="text-gray-600">Kinh Vượng:</span>
                        <span class="font-bold text-[#2e7d32] uppercase">Kinh ${timeFlow.naZi.meridian}</span>
                    </div>
                    
                    <div class="py-1">
                        <div class="text-[#1b5e20] font-bold mb-1 flex items-center gap-1">🌟 Huyệt Khai (Chủ Huyệt):</div>
                        <div class="bg-white p-2 rounded border border-green-300 text-base text-center shadow-sm text-[#2e7d32]">
                            ${getFn(timeFlow.naZi.horary)}
                        </div>
                    </div>

                    <div class="grid grid-cols-2 gap-2 mt-1">
                        <div class="bg-white p-2 rounded border border-green-100">
                            <span class="block text-[10px] font-bold text-blue-600 uppercase">Hư thì Bổ</span>
                            <div class="text-xs font-medium text-[#3e2723] mt-1">${getFn(timeFlow.naZi.tonify)}</div>
                        </div>
                        <div class="bg-white p-2 rounded border border-green-100">
                            <span class="block text-[10px] font-bold text-red-600 uppercase">Thực thì Tả</span>
                            <div class="text-xs font-medium text-[#3e2723] mt-1">${getFn(timeFlow.naZi.sedate)}</div>
                        </div>
                        <div class="bg-white p-2 rounded border border-green-100 col-span-2">
                            <span class="block text-[10px] font-bold text-purple-600 uppercase">Huyệt Nguyên (Điều hòa)</span>
                            <div class="text-xs font-medium text-[#3e2723] mt-1">${getFn(timeFlow.naZi.source)}</div>
                        </div>
                    </div>
                </div>
            </div>`;
            
            // Auto add Open Point to Suggestions
            const openPointId = timeFlow.naZi.horary.split(' ')[0];
            if(openPointId) result.points.unshift(openPointId);
        }

        // 2. Nạp Giáp (Theo Ngày)
        if (timeFlow.naJia) {
            timeMsg += `
            <div class="bg-[#fff3e0] p-3 rounded-xl border border-[#ffe0b2]">
                <div class="flex items-center gap-2 mb-2">
                    <span class="bg-[#e65100] text-white text-[10px] font-bold px-2 py-0.5 rounded">THAM KHẢO</span>
                    <span class="font-bold text-[#e65100] text-sm uppercase">2. Nạp Giáp (Theo Ngày)</span>
                </div>
                <div class="text-sm text-[#3e2723]">
                    <p class="mb-1">Can ngày: <b>${timeFlow.naJia.stem}</b> ➤ Mở kinh: <b>${timeFlow.naJia.meridian}</b></p>
                    <div class="bg-white p-2 rounded border border-orange-200 text-xs text-orange-900 mt-1 break-words leading-relaxed">
                        ${timeFlow.naJia.points ? timeFlow.naJia.points.map(p => getFn(p)).join('<br/>') : 'Không có huyệt mở đặc biệt.'}
                    </div>
                </div>
            </div>`;
        }

        result.timeBasedSuggestion = timeMsg;
    }

    result.points = [...new Set(result.points)];
    result.herbs = [...new Set(result.herbs)];
    result.west = [...new Set(result.west)];

    return result;
};
