/**
 * FILE: knowledge/knowledge-ziwu.js
 * CHỨC NĂNG: Bộ máy tính toán Tí Ngọ Lưu Chú (Zi Wu Liu Zhu Engine).
 * NHIỆM VỤ: Tính toán huyệt Khai, huyệt Bổ/Tả theo giờ và Thiên Can/Địa Chi.
 */

window.knowledge = window.knowledge || {};

window.knowledge.ziWuFlow = {
    // Dữ liệu 12 Kinh và Huyệt Ngũ Du (Tỉnh, Huỳnh, Du, Kinh, Hợp)
    meridiansData: {
        'Tý': { 
            id: 'GB', name: 'Đởm', element: 'Mộc', type: 'Dương', 
            points: { 'Kim': 'GB44', 'Thủy': 'GB43', 'Mộc': 'GB41', 'Hỏa': 'GB38', 'Thổ': 'GB34' }, 
            source: 'GB40' 
        },
        'Sửu': { 
            id: 'LR', name: 'Can', element: 'Mộc', type: 'Âm', 
            points: { 'Mộc': 'LR1', 'Hỏa': 'LR2', 'Thổ': 'LR3', 'Kim': 'LR4', 'Thủy': 'LR8' }, 
            source: 'LR3' 
        },
        'Dần': { 
            id: 'LU', name: 'Phế', element: 'Kim', type: 'Âm', 
            points: { 'Mộc': 'LU11', 'Hỏa': 'LU10', 'Thổ': 'LU9', 'Kim': 'LU8', 'Thủy': 'LU5' }, 
            source: 'LU9' 
        },
        'Mão': { 
            id: 'LI', name: 'Đại Trường', element: 'Kim', type: 'Dương', 
            points: { 'Kim': 'LI1', 'Thủy': 'LI2', 'Mộc': 'LI3', 'Hỏa': 'LI5', 'Thổ': 'LI11' }, 
            source: 'LI4' 
        },
        'Thìn': { 
            id: 'ST', name: 'Vị', element: 'Thổ', type: 'Dương', 
            points: { 'Kim': 'ST45', 'Thủy': 'ST44', 'Mộc': 'ST43', 'Hỏa': 'ST41', 'Thổ': 'ST36' }, 
            source: 'ST42' 
        },
        'Tỵ': { 
            id: 'SP', name: 'Tỳ', element: 'Thổ', type: 'Âm', 
            points: { 'Mộc': 'SP1', 'Hỏa': 'SP2', 'Thổ': 'SP3', 'Kim': 'SP5', 'Thủy': 'SP9' }, 
            source: 'SP3' 
        },
        'Ngọ': { 
            id: 'HT', name: 'Tâm', element: 'Hỏa', type: 'Âm', 
            points: { 'Mộc': 'HT9', 'Hỏa': 'HT8', 'Thổ': 'HT7', 'Kim': 'HT4', 'Thủy': 'HT3' }, 
            source: 'HT7' 
        },
        'Mùi': { 
            id: 'SI', name: 'Tiểu Trường', element: 'Hỏa', type: 'Dương', 
            points: { 'Kim': 'SI1', 'Thủy': 'SI2', 'Mộc': 'SI3', 'Hỏa': 'SI5', 'Thổ': 'SI8' }, 
            source: 'SI4' 
        },
        'Thân': { 
            id: 'BL', name: 'Bàng Quang', element: 'Thủy', type: 'Dương', 
            points: { 'Kim': 'BL67', 'Thủy': 'BL66', 'Mộc': 'BL65', 'Hỏa': 'BL60', 'Thổ': 'BL40' }, 
            source: 'BL64' 
        },
        'Dậu': { 
            id: 'KI', name: 'Thận', element: 'Thủy', type: 'Âm', 
            points: { 'Mộc': 'KI1', 'Hỏa': 'KI2', 'Thổ': 'KI3', 'Kim': 'KI7', 'Thủy': 'KI10' }, 
            source: 'KI3' 
        },
        'Tuất': { 
            id: 'PC', name: 'Tâm Bào', element: 'Hỏa', type: 'Âm', 
            points: { 'Mộc': 'PC9', 'Hỏa': 'PC8', 'Thổ': 'PC7', 'Kim': 'PC5', 'Thủy': 'PC3' }, 
            source: 'PC7' 
        },
        'Hợi': { 
            id: 'TE', name: 'Tam Tiêu', element: 'Hỏa', type: 'Dương', 
            points: { 'Kim': 'TE1', 'Thủy': 'TE2', 'Mộc': 'TE3', 'Hỏa': 'TE6', 'Thổ': 'TE10' }, 
            source: 'TE4' 
        }
    },

    elementsOrder: ['Mộc', 'Hỏa', 'Thổ', 'Kim', 'Thủy'],
    
    // Quy luật Nạp Giáp (Na Jia Fa) - Mở huyệt theo Thiên Can
    naJiaOpenPoints: {
        'Giáp': { meridian: 'Đởm (Mộc Dương)', points: ['GB44 (Tỉnh)', 'GB43 (Huỳnh)', 'GB41 (Du)', 'GB38 (Kinh)', 'GB34 (Hợp)'] },
        'Ất':   { meridian: 'Can (Mộc Âm)',    points: ['LR1 (Tỉnh)', 'LR2 (Huỳnh)', 'LR3 (Du)', 'LR4 (Kinh)', 'LR8 (Hợp)'] },
        'Bính': { meridian: 'Tiểu Trường (Hỏa Dương)', points: ['SI1 (Tỉnh)', 'SI2 (Huỳnh)', 'SI3 (Du)', 'SI5 (Kinh)', 'SI8 (Hợp)'] },
        'Đinh': { meridian: 'Tâm (Hỏa Âm)',    points: ['HT9 (Tỉnh)', 'HT8 (Huỳnh)', 'HT7 (Du)', 'HT4 (Kinh)', 'HT3 (Hợp)'] },
        'Mậu':  { meridian: 'Vị (Thổ Dương)',  points: ['ST45 (Tỉnh)', 'ST44 (Huỳnh)', 'ST43 (Du)', 'ST41 (Kinh)', 'ST36 (Hợp)'] },
        'Kỷ':   { meridian: 'Tỳ (Thổ Âm)',     points: ['SP1 (Tỉnh)', 'SP2 (Huỳnh)', 'SP3 (Du)', 'SP5 (Kinh)', 'SP9 (Hợp)'] },
        'Canh': { meridian: 'Đại Trường (Kim Dương)', points: ['LI1 (Tỉnh)', 'LI2 (Huỳnh)', 'LI3 (Du)', 'LI5 (Kinh)', 'LI11 (Hợp)'] },
        'Tân':  { meridian: 'Phế (Kim Âm)',    points: ['LU11 (Tỉnh)', 'LU10 (Huỳnh)', 'LU9 (Du)', 'LU8 (Kinh)', 'LU5 (Hợp)'] },
        'Nhâm': { meridian: 'Bàng Quang (Thủy Dương)', points: ['BL67 (Tỉnh)', 'BL66 (Huỳnh)', 'BL65 (Du)', 'BL60 (Kinh)', 'BL40 (Hợp)'] },
        'Quý':  { meridian: 'Thận (Thủy Âm)',  points: ['KI1 (Tỉnh)', 'KI2 (Huỳnh)', 'KI3 (Du)', 'KI7 (Kinh)', 'KI10 (Hợp)'] }
    },

    // ============================================================
    // CÁC HÀM XỬ LÝ LOGIC (METHODS)
    // ============================================================

    // 1. TÍNH CAN GIỜ (Theo Ngũ Hổ Độn: Giáp Kỷ khởi Giáp Tý...)
    getHourStem: function(dayStemIdx, hourBranchIdx) {
        // dayStemIdx: 0=Giáp, 1=Ất...
        const stems = window.knowledge.lunar.can; 
        const startStemIdx = (dayStemIdx % 5) * 2;
        const currentStemIdx = (startStemIdx + hourBranchIdx) % 10;
        return stems[currentStemIdx];
    },

    // 2. NẠP TỬ PHÁP (NA ZI FA) - Tính toán theo CHI của giờ (Vượng suy)
    getNaZiFa: function(hourBranch) {
        const meridian = this.meridiansData[hourBranch];
        if (!meridian) return null;

        const el = meridian.element; 
        const elIdx = this.elementsOrder.indexOf(el);
        
        // Con hư bổ mẹ, Mẹ thực tả con
        const motherEl = this.elementsOrder[(elIdx - 1 + 5) % 5];
        const sonEl = this.elementsOrder[(elIdx + 1) % 5];
        const selfEl = el;

        return {
            method: 'Nạp Tử',
            meridian: meridian.name,
            horary: `${meridian.points[selfEl]}`, // Huyệt Khai (Bản hành)
            tonify: `${meridian.points[motherEl]}`, // Huyệt Bổ (Mẹ)
            sedate: `${meridian.points[sonEl]}`, // Huyệt Tả (Con)
            source: `${meridian.source}` // Huyệt Nguyên
        };
    },

    // 3. NẠP GIÁP PHÁP (NA JIA FA) - Tính toán theo CAN của giờ
    getNaJiaFa: function(hourStem) {
        const openInfo = this.naJiaOpenPoints[hourStem];
        if (!openInfo) return null;
        return {
            method: 'Nạp Giáp',
            stem: hourStem,
            meridian: openInfo.meridian,
            points: openInfo.points 
        };
    },

    // 4. API TỔNG HỢP CHO MODAL TRA CỨU
    getCurrentAnalysis: function() {
        const now = new Date();
        const hour = now.getHours();
        
        // Lấy thông tin ngày từ knowledge-time.js
        const lunarInfo = window.knowledge.lunar.getLunarDetails();
        
        // Tính Chi giờ (23-1h = Tý)
        let branchIdx = Math.floor((hour + 1) / 2) % 12;
        const branches = window.knowledge.lunar.chi;
        const currentBranch = branches[branchIdx]; 
        
        // Tính Can giờ
        const currentStem = this.getHourStem(lunarInfo.canDayIdx, branchIdx);

        const naZiResult = this.getNaZiFa(currentBranch);
        const naJiaResult = this.getNaJiaFa(currentStem);

        return {
            stem: currentStem,
            branch: currentBranch,
            timeInfo: `Giờ ${currentStem} ${currentBranch} (${hour}h)`,
            naZi: naZiResult,
            naJia: naJiaResult
        };
    },

    // --- [QUAN TRỌNG] BẢN VÁ LỖI CHO HEADER ---
    // Hàm này giữ cấu trúc dữ liệu trả về giống phiên bản cũ
    // để file configs/config-header.js gọi không bị lỗi
    getCurrentFlow: function() {
        const analysis = this.getCurrentAnalysis();
        const naZi = analysis.naZi;
        
        return {
            can: analysis.stem,
            chi: analysis.branch,
            // Header hiển thị dòng chữ chạy dựa vào biến 'msg'
            msg: naZi ? `Vượng ${naZi.meridian} - Khai: ${naZi.horary} - Bổ: ${naZi.tonify}` : "Đang tính toán...",
            openPoint: naZi ? naZi.horary : "",
            meridian: naZi ? naZi.meridian : ""
        };
    }
};
