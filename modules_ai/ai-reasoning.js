/**
 * FILE: modules_ai/ai-reasoning.js
 * CHỨC NĂNG: Bộ não Biện chứng luận trị (Clinical Reasoning Engine).
 * NHIỆM VỤ: 
 * 1. Chứa Database huyệt đặc hiệu (Ngũ du, Nguyên, Lạc, Khích, Mộ, Du).
 * 2. Chứa Database huyệt tại chỗ (Local Points Mapping).
 * 3. Thuật toán tính trọng số chọn bên (Tả/Hữu) dựa trên Nam/Nữ và Khí/Huyết.
 * 4. Logic chọn huyệt theo Bát cương (Hư/Thực/Hàn/Nhiệt/Cấp/Mãn).
 */

window.ClinicalEngine = {
    
    // ============================================================
    // 1. CƠ SỞ DỮ LIỆU KINH LẠC (MERIDIAN KNOWLEDGE GRAPH)
    // ============================================================
    meridianData: {
        'LU': { name: 'Phế', element: 'Kim', type: 'yin', mother: 'LU9', child: 'LU5', yuan: 'LU9', luo: 'LU7', xi: 'LU6', mo: 'LU1', shu: 'BL13', pair: 'LI' },
        'LI': { name: 'Đại Trường', element: 'Kim', type: 'yang', mother: 'LI11', child: 'LI2', yuan: 'LI4', luo: 'LI6', xi: 'LI7', mo: 'ST25', shu: 'BL25', pair: 'LU' },
        'ST': { name: 'Vị', element: 'Thổ', type: 'yang', mother: 'ST41', child: 'ST45', yuan: 'ST42', luo: 'ST40', xi: 'ST34', mo: 'CV12', shu: 'BL21', pair: 'SP' },
        'SP': { name: 'Tỳ', element: 'Thổ', type: 'yin', mother: 'SP2', child: 'SP5', yuan: 'SP3', luo: 'SP4', xi: 'SP8', mo: 'LR13', shu: 'BL20', pair: 'ST' },
        'HT': { name: 'Tâm', element: 'Hỏa', type: 'yin', mother: 'HT9', child: 'HT7', yuan: 'HT7', luo: 'HT5', xi: 'HT6', mo: 'CV14', shu: 'BL15', pair: 'SI' },
        'SI': { name: 'Tiểu Trường', element: 'Hỏa', type: 'yang', mother: 'SI3', child: 'SI8', yuan: 'SI4', luo: 'SI7', xi: 'SI6', mo: 'CV4', shu: 'BL27', pair: 'HT' },
        'BL': { name: 'Bàng Quang', element: 'Thủy', type: 'yang', mother: 'BL67', child: 'BL65', yuan: 'BL64', luo: 'BL58', xi: 'BL63', mo: 'CV3', shu: 'BL28', pair: 'KI' },
        'KI': { name: 'Thận', element: 'Thủy', type: 'yin', mother: 'KI7', child: 'KI1', yuan: 'KI3', luo: 'KI4', xi: 'KI5', mo: 'GB25', shu: 'BL23', pair: 'BL' },
        'PC': { name: 'Tâm Bào', element: 'Hỏa', type: 'yin', mother: 'PC9', child: 'PC7', yuan: 'PC7', luo: 'PC6', xi: 'PC4', mo: 'CV17', shu: 'BL14', pair: 'TE' },
        'TE': { name: 'Tam Tiêu', element: 'Hỏa', type: 'yang', mother: 'TE3', child: 'TE10', yuan: 'TE4', luo: 'TE5', xi: 'TE7', mo: 'CV5', shu: 'BL22', pair: 'PC' },
        'GB': { name: 'Đởm', element: 'Mộc', type: 'yang', mother: 'GB43', child: 'GB38', yuan: 'GB40', luo: 'GB37', xi: 'GB36', mo: 'GB24', shu: 'BL19', pair: 'LR' },
        'LR': { name: 'Can', element: 'Mộc', type: 'yin', mother: 'LR8', child: 'LR2', yuan: 'LR3', luo: 'LR5', xi: 'LR6', mo: 'LR14', shu: 'BL18', pair: 'GB' }
    },

    // ============================================================
    // 2. CƠ SỞ DỮ LIỆU HUYỆT TẠI CHỖ (LOCAL POINTS MAPPING)
    // ============================================================
    localPointsMap: {
        'dau': { name: 'Đầu / Mặt', points: ['GV20 (Bách Hội)', 'EX-HN5 (Thái Dương)', 'EX-HN3 (Ấn Đường)', 'GB20 (Phong Trì)'] },
        'co':  { name: 'Cổ Gáy',    points: ['GB20 (Phong Trì)', 'BL10 (Thiên Trụ)', 'GV14 (Đại Chùy)', 'SI16 (Thiên Song)'] },
        'vai': { name: 'Vai / Tay', points: ['LI15 (Kiên Ngung)', 'GB21 (Kiên Tỉnh)', 'SI9 (Kiên Trinh)', 'LI11 (Khúc Trì)'] },
        'lung':{ name: 'Lưng Trên', points: ['BL13 (Phế Du)', 'BL15 (Tâm Du)', 'BL17 (Cách Du)', 'GV12 (Thân Trụ)'] },
        'thatlung': { name: 'Thắt Lưng', points: ['BL23 (Thận Du)', 'BL25 (Đại Trường Du)', 'GV4 (Mệnh Môn)', 'GV3 (Yêu Dương Quan)'] },
        'nguc':{ name: 'Ngực / Sườn', points: ['CV17 (Đản Trung)', 'LU1 (Trung Phủ)', 'LR14 (Kỳ Môn)', 'GB24 (Nhật Nguyệt)'] },
        'bung':{ name: 'Bụng',      points: ['CV12 (Trung Quản)', 'ST25 (Thiên Khu)', 'CV6 (Khí Hải)', 'CV4 (Quan Nguyên)'] },
        'chan':{ name: 'Chân / Gối',points: ['ST36 (Túc Tam Lý)', 'GB34 (Dương Lăng Tuyền)', 'SP9 (Âm Lăng Tuyền)', 'BL40 (Ủy Trung)'] }
    },

    // ============================================================
    // 3. THUẬT TOÁN PHÂN TÍCH (CORE ALGORITHM)
    // ============================================================
    /**
     * @param {Object} inputs 
     * - gender: 'male' | 'female'
     * - meridian: 'LU' | 'LI' ... (Kinh bị bệnh)
     * - factors: ['hu', 'thuc', 'han', 'nhiet', 'cap', 'man', 'khi', 'huyet', 'bieuly']
     * - bodyParts: ['dau', 'lung'...]
     */
    analyze: function(inputs) {
        const result = {
            points: [],         // Danh sách huyệt đề xuất (Đặc hiệu)
            localPoints: [],    // Danh sách huyệt tại chỗ
            reasoning: [],      // Giải thích lý do chọn huyệt
            sideAdvice: "",     // Lời khuyên chọn bên (Trái/Phải)
            methodAdvice: ""    // Lời khuyên phương pháp (Châm/Cứu)
        };

        const mid = inputs.meridian;
        const data = this.meridianData[mid];
        const factors = inputs.factors || [];
        const parts = inputs.bodyParts || [];

        // --- BƯỚC 1: XÁC ĐỊNH HUYỆT ĐẶC HIỆU (TRỊ GỐC) ---
        if (data) {
            // 1.1. Quy tắc Hư/Thực (Ngũ Hành Tương Sinh)
            if (factors.includes('hu')) {
                // Hư thì bổ Mẹ
                result.points.push({ code: data.mother, name: 'Huyệt Mẹ', method: 'Bổ', desc: `Kinh ${data.name} Hư $\\rightarrow$ Bổ Mẹ (Hư tắc bổ mẫu).` });
                // Bổ thêm Nguyên để dưỡng khí
                result.points.push({ code: data.yuan, name: 'Huyệt Nguyên', method: 'Bổ', desc: 'Bồi bổ nguyên khí của kinh.' });
            } 
            else if (factors.includes('thuc')) {
                // Thực thì tả Con
                result.points.push({ code: data.child, name: 'Huyệt Con', method: 'Tả', desc: `Kinh ${data.name} Thực $\\rightarrow$ Tả Con (Thực tắc tả tử).` });
            } 
            else {
                // Không rõ hư thực -> Bình bổ bình tả huyệt Nguyên
                result.points.push({ code: data.yuan, name: 'Huyệt Nguyên', method: 'Bình', desc: 'Điều hòa kinh khí (Nguyên huyệt).' });
            }

            // 1.2. Quy tắc Cấp tính (Huyệt Khích)
            if (factors.includes('cap')) { 
                result.points.push({ code: data.xi, name: 'Huyệt Khích', method: 'Tả mạnh', desc: 'Bệnh cấp tính/đau dữ dội $\\rightarrow$ Dùng huyệt Khích thông kinh chỉ thống.' });
            }

            // 1.3. Quy tắc Mộ - Du (Âm Dương tương phối)
            // Bệnh Phủ (Dương), Bệnh Cấp, Bệnh Nhiệt -> Chọn Mộ (Ở Bụng/Âm)
            if (data.type === 'yang' || factors.includes('cap') || factors.includes('nhiet')) {
                result.points.push({ code: data.mo, name: 'Huyệt Mộ', method: 'Châm', desc: 'Dương bệnh trị Âm (Lấy huyệt Mộ ở bụng/ngực).' });
            }
            // Bệnh Tạng (Âm), Bệnh Mãn (Hư), Bệnh Hàn -> Chọn Du (Ở Lưng/Dương)
            if (data.type === 'yin' || factors.includes('man') || factors.includes('han') || factors.includes('hu')) {
                result.points.push({ code: data.shu, name: 'Huyệt Du', method: 'Cứu/Ôn châm', desc: 'Âm bệnh trị Dương (Lấy huyệt Du ở lưng).' });
            }

            // 1.4. Quy tắc Nguyên - Lạc (Chủ khách)
            if (factors.includes('bieuly')) {
                const pairData = this.meridianData[data.pair];
                if (pairData) {
                    result.points.push({ code: pairData.luo, name: 'Huyệt Lạc (Khách)', method: 'Bình', desc: `Phối hợp Lạc huyệt kinh ${pairData.name} (Chủ khách nguyên lạc).` });
                }
            }
        }

        // --- BƯỚC 2: XÁC ĐỊNH HUYỆT TẠI CHỖ (TRỊ NGỌN) ---
        parts.forEach(partKey => {
            const map = this.localPointsMap[partKey];
            if (map) {
                map.points.forEach(p => {
                    // Tách mã và tên (VD: "BL23 (Thận Du)" -> code="BL23")
                    const code = p.split(' ')[0];
                    result.localPoints.push({ code: code, name: p, method: 'A thị', desc: `Huyệt cục bộ vùng ${map.name}.` });
                });
            }
        });

        // --- BƯỚC 3: XÁC ĐỊNH HUYỆT CỨU CÁNH (NHÂM ĐỐC) ---
        if (factors.includes('hu') || factors.includes('man')) {
            // Hư lao suy nhược -> Bổ Nhâm Đốc
            if (factors.includes('han') || factors.includes('duonghu')) {
                result.points.push({ code: 'GV4', name: 'Mệnh Môn', method: 'Cứu', desc: 'Ôn bổ Thận Dương, bồi nguyên khí (Hư lao).' });
            } else {
                result.points.push({ code: 'CV6', name: 'Khí Hải', method: 'Bổ', desc: 'Bổ Khí toàn thân (Biển của khí).' });
                result.points.push({ code: 'CV4', name: 'Quan Nguyên', method: 'Bổ', desc: 'Bổ Thận, dưỡng Âm, hồi dương.' });
            }
        }

        // --- BƯỚC 4: TÍNH TOÁN TRỌNG SỐ CHỌN BÊN (SCORING) ---
        // Logic: Tả (Trái) = Dương/Khí. Hữu (Phải) = Âm/Huyết.
        let leftScore = 0;
        let rightScore = 0;
        let reasons = [];

        // 4.1. Tiên thiên (Nam Tả - Nữ Hữu)
        if (inputs.gender === 'male') {
            leftScore += 1;
            reasons.push("Nam giới ứng với Dương (Tả).");
        } else if (inputs.gender === 'female') {
            rightScore += 1;
            reasons.push("Nữ giới ứng với Âm (Hữu).");
        }

        // 4.2. Hậu thiên (Bệnh lý Khí/Huyết - Trọng số cao)
        if (factors.includes('khi')) {
            leftScore += 3;
            reasons.push("Bệnh thuộc Khí $\\rightarrow$ Trọng bên Trái.");
        }
        if (factors.includes('huyet')) {
            rightScore += 3;
            reasons.push("Bệnh thuộc Huyết $\\rightarrow$ Trọng bên Phải.");
        }

        // 4.3. Vị trí Tạng Phủ (Dương trung chi dương...)
        // Tạng Dương/Trên -> Thiên Trái. Tạng Âm/Dưới -> Thiên Phải.
        if (['HT', 'LU', 'PC', 'SI', 'LI', 'TE'].includes(mid)) {
            leftScore += 0.5;
        }
        if (['LR', 'KI', 'SP', 'BL', 'ST', 'GB'].includes(mid)) {
            rightScore += 0.5;
        }

        // 4.4. Kết luận Bên
        if (leftScore > rightScore + 1) { // Chênh lệch rõ rệt (>1 điểm)
            result.sideAdvice = "👈 Ưu tiên châm bên TRÁI";
            result.reasoning.push(`<b>Chọn bên TRÁI:</b> Vì thiên về Dương/Khí (Điểm khí: ${leftScore} > ${rightScore}).`);
        } else if (rightScore > leftScore + 1) {
            result.sideAdvice = "👉 Ưu tiên châm bên PHẢI";
            result.reasoning.push(`<b>Chọn bên PHẢI:</b> Vì thiên về Âm/Huyết (Điểm huyết: ${rightScore} > ${leftScore}).`);
        } else {
            result.sideAdvice = "👐 Châm cả HAI BÊN";
            result.reasoning.push("<b>Cân bằng:</b> Khí huyết hoặc Âm dương chưa lệch hẳn, hoặc bệnh lý phức tạp $\\rightarrow$ Châm cả hai bên để điều hòa.");
        }
        
        // Thêm lý giải chi tiết từ các bước trên
        reasons.forEach(r => result.reasoning.push(r));


        // --- BƯỚC 5: PHƯƠNG PHÁP THỦ THUẬT ---
        let methods = [];
        if (factors.includes('han')) methods.push("Cứu ngải (Ôn) để trừ hàn");
        if (factors.includes('nhiet')) methods.push("Châm nặn máu hoặc châm tả để thanh nhiệt");
        if (factors.includes('huyet')) methods.push("Kết hợp châm Cách Du (Huyết hội)");
        if (factors.includes('khi')) methods.push("Kết hợp châm Đản Trung (Khí hội)");
        if (factors.includes('thuc') && factors.includes('cap')) methods.push("Kích thích mạnh (Tả)");
        if (factors.includes('hu')) methods.push("Kích thích nhẹ, lưu kim lâu (Bổ)");

        result.methodAdvice = methods.length > 0 ? methods.join(". ") : "Châm bình bổ bình tả.";

        return result;
    }
};
