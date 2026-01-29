/**
 * FILE: js/knowledge/knowledge-time.js
 * CHỨC NĂNG: Bộ máy tính toán thời gian & Y Lý (TCM Time Engine).
 * PHIÊN BẢN: 3.1 (FIXED: Đã khôi phục hàm getCurrentFlow cho Header)
 * * MODULES:
 * 1. knowledge.lunar: Lịch Âm, Can Chi (Năm, Tháng, Ngày).
 * 2. knowledge.yunQi: Ngũ Vận Lục Khí (Khí hậu năm).
 * 3. knowledge.ziWuFlow: Tí Ngọ Lưu Chú (Thời châm, Huyệt Bổ/Tả/Nguyên).
 * 4. knowledge.bioClock: Đồng hồ sinh học 12 canh giờ.
 */

window.knowledge = window.knowledge || {};

// ============================================================
// 1. CÔNG CỤ LỊCH ÂM (LUNAR CALENDAR UTILS)
// ============================================================
window.knowledge.lunar = {
    can: ["Giáp", "Ất", "Bính", "Đinh", "Mậu", "Kỷ", "Canh", "Tân", "Nhâm", "Quý"],
    chi: ["Tý", "Sửu", "Dần", "Mão", "Thìn", "Tỵ", "Ngọ", "Mùi", "Thân", "Dậu", "Tuất", "Hợi"],

    getLunarDetails: function() {
        const today = new Date();
        const dd = today.getDate();
        const mm = today.getMonth() + 1;
        const yyyy = today.getFullYear();

        // 1. LẤY NGÀY ÂM TỪ INTL API
        let lDay = dd, lMonth = mm, lYear = yyyy;
        try {
            const formatter = new Intl.DateTimeFormat('vi-VN', {
                calendar: 'chinese',
                timeZone: 'Asia/Ho_Chi_Minh',
                day: 'numeric', month: 'numeric', year: 'numeric'
            });
            const parts = formatter.formatToParts(today);
            parts.forEach(p => {
                if (p.type === 'day') lDay = parseInt(p.value);
                if (p.type === 'month') lMonth = parseInt(p.value);
                if (p.type === 'relatedYear') lYear = parseInt(p.value);
                else if (p.type === 'year' && !lYear) lYear = parseInt(p.value.replace(/[^0-9]/g, ''));
            });
        } catch (e) { console.error("Lỗi Intl:", e); }

        // 2. TÍNH CAN CHI (Công thức Julian Day)
        const a = Math.floor((14 - mm) / 12);
        const y = yyyy + 4800 - a;
        const m = mm + 12 * a - 3;
        const jd = dd + Math.floor((153 * m + 2) / 5) + 365 * y + Math.floor(y / 4) - Math.floor(y / 100) + Math.floor(y / 400) - 32045;
        
        const canNgayIdx = (jd + 9) % 10;
        const chiNgayIdx = (jd + 1) % 12;
        const canNamIdx = (lYear + 6) % 10;
        const chiNamIdx = (lYear + 8) % 12;

        return {
            date: `${dd}/${mm}/${yyyy}`,
            lunarDate: `${lDay}/${lMonth}/${lYear}`,
            canDayIdx: canNgayIdx,
            chiDayIdx: chiNgayIdx,
            full: `${lDay}/${lMonth} ÂL - Ngày ${this.can[canNgayIdx]} ${this.chi[chiNgayIdx]}`
        };
    }
};

// ============================================================
// 2. NGŨ VẬN LỤC KHÍ (YUNQI ENGINE)
// ============================================================
window.knowledge.yunQi = {
    stemNature: {
        0: 'Thổ Thái Quá (Ẩm thấp)', 1: 'Kim Bất Cập (Gió nhiều)',
        2: 'Thủy Thái Quá (Lạnh giá)', 3: 'Mộc Bất Cập (Nóng khô)',
        4: 'Hỏa Thái Quá (Oi bức)', 5: 'Thổ Bất Cập (Gió ẩm)',
        6: 'Kim Thái Quá (Khô hanh)', 7: 'Thủy Bất Cập (Mưa nhiều)',
        8: 'Mộc Thái Quá (Gió lớn)', 9: 'Hỏa Bất Cập (Sương lạnh)'
    },
    getCurrentInfo: function() {
        const year = new Date().getFullYear();
        const stemIdx = (year - 4) % 10;
        const branchIdx = (year - 4) % 12;
        const s = stemIdx < 0 ? stemIdx + 10 : stemIdx;
        const stems = window.knowledge.lunar.can;
        const branches = window.knowledge.lunar.chi;
        // Fix lỗi branchIdx âm
        const b = branchIdx < 0 ? branchIdx + 12 : branchIdx;
        
        return { 
            year: `Năm ${stems[s]} ${branches[b]}`, 
            nature: `Vận ${this.stemNature[s]}` 
        };
    }
};

// ============================================================
// 3. TÍ NGỌ LƯU CHÚ (ZI WU FLOW - FULL ENGINE)
// ============================================================
window.knowledge.ziWuFlow = {
    // Dữ liệu 12 Kinh và Huyệt Ngũ Du
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
    
    // Quy luật Nạp Giáp (Na Jia Fa)
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

    // 1. TÍNH CAN GIỜ (Theo Ngũ Hổ Độn)
    getHourStem: function(dayStemIdx, hourBranchIdx) {
        const stems = window.knowledge.lunar.can; 
        const startStemIdx = (dayStemIdx % 5) * 2;
        const currentStemIdx = (startStemIdx + hourBranchIdx) % 10;
        return stems[currentStemIdx];
    },

    // 2. NẠP TỬ PHÁP (NA ZI FA) - Tính toán theo CHI của giờ
    getNaZiFa: function(hourBranch) {
        const meridian = this.meridiansData[hourBranch];
        if (!meridian) return null;

        const el = meridian.element; 
        const elIdx = this.elementsOrder.indexOf(el);
        const motherEl = this.elementsOrder[(elIdx - 1 + 5) % 5];
        const sonEl = this.elementsOrder[(elIdx + 1) % 5];
        const selfEl = el;

        return {
            method: 'Nạp Tử',
            meridian: meridian.name,
            horary: `${meridian.points[selfEl]}`, 
            tonify: `${meridian.points[motherEl]}`, 
            sedate: `${meridian.points[sonEl]}`, 
            source: `${meridian.source}`
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

    // 4. API TỔNG HỢP CHO MODAL TRA CỨU (New Version)
    getCurrentAnalysis: function() {
        const now = new Date();
        const hour = now.getHours();
        const lunarInfo = window.knowledge.lunar.getLunarDetails();
        
        let branchIdx = Math.floor((hour + 1) / 2) % 12;
        const branches = window.knowledge.lunar.chi;
        const currentBranch = branches[branchIdx]; 
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

    // --- [QUAN TRỌNG] BẢN VÁ LỖI CHO HEADER CŨ ---
    // Hàm này giữ tên cũ để config-header.js gọi được, không bị crash
    getCurrentFlow: function() {
        const analysis = this.getCurrentAnalysis();
        const naZi = analysis.naZi;
        
        // Trả về định dạng cũ mà Header đang mong đợi
        return {
            can: analysis.stem,
            chi: analysis.branch,
            // Header dùng 'msg' để hiển thị dòng chạy chữ
            msg: naZi ? `Vượng ${naZi.meridian} - Khai: ${naZi.horary} - Bổ: ${naZi.tonify}` : "Đang tính toán...",
            // Các trường phụ để tương thích ngược nếu cần
            openPoint: naZi ? naZi.horary : "",
            meridian: naZi ? naZi.meridian : ""
        };
    }
};

// ============================================================
// 4. MODULE ĐỒNG HỒ SINH HỌC (BIO CLOCK)
// ============================================================
window.knowledge.bioClock = {
    zones: [
        { id: 'ty', name: 'Tý', timeRange: '23:00 - 01:00', meridian: 'Đởm Kinh', advice: 'Nên ngủ say để Đởm kinh tạo máu.' },
        { id: 'suu', name: 'Sửu', timeRange: '01:00 - 03:00', meridian: 'Can Kinh', advice: 'Ngủ sâu dưỡng Can, thải độc máu.' },
        { id: 'dan', name: 'Dần', timeRange: '03:00 - 05:00', meridian: 'Phế Kinh', advice: 'Phế vận chuyển khí huyết. Nên ngủ say.' },
        { id: 'mao', name: 'Mão', timeRange: '05:00 - 07:00', meridian: 'Đại Trường', advice: 'Nên thức dậy, uống nước ấm, đại tiện.' },
        { id: 'thin', name: 'Thìn', timeRange: '07:00 - 09:00', meridian: 'Vị Kinh', advice: 'Ăn sáng đầy đủ dinh dưỡng.' },
        { id: 'ty_ran', name: 'Tỵ', timeRange: '09:00 - 11:00', meridian: 'Tỳ Kinh', advice: 'Làm việc, học tập hiệu quả nhất.' },
        { id: 'ngo', name: 'Ngọ', timeRange: '11:00 - 13:00', meridian: 'Tâm Kinh', advice: 'Ăn trưa, ngủ ngắn 15-30p dưỡng tim.' },
        { id: 'mui', name: 'Mùi', timeRange: '13:00 - 15:00', meridian: 'Tiểu Trường', advice: 'Làm việc nhẹ, uống nước.' },
        { id: 'than', name: 'Thân', timeRange: '15:00 - 17:00', meridian: 'Bàng Quang', advice: 'Uống trà, thải độc, vận động nhẹ.' },
        { id: 'dau', name: 'Dậu', timeRange: '17:00 - 19:00', meridian: 'Thận Kinh', advice: 'Tập dưỡng sinh, ăn tối nhẹ, bổ thận.' },
        { id: 'tuat', name: 'Tuất', timeRange: '19:00 - 21:00', meridian: 'Tâm Bào', advice: 'Thư giãn, ngâm chân, đọc sách.' },
        { id: 'hoi', name: 'Hợi', timeRange: '21:00 - 23:00', meridian: 'Tam Tiêu', advice: 'Dừng làm việc, chuẩn bị ngủ.' }
    ],

    getCurrentZoneId: function() {
        const h = new Date().getHours();
        if (h >= 23 || h < 1) return 'ty';
        if (h >= 1 && h < 3) return 'suu';
        if (h >= 3 && h < 5) return 'dan';
        if (h >= 5 && h < 7) return 'mao';
        if (h >= 7 && h < 9) return 'thin';
        if (h >= 9 && h < 11) return 'ty_ran';
        if (h >= 11 && h < 13) return 'ngo';
        if (h >= 13 && h < 15) return 'mui';
        if (h >= 15 && h < 17) return 'than';
        if (h >= 17 && h < 19) return 'dau';
        if (h >= 19 && h < 21) return 'tuat';
        if (h >= 21 && h < 23) return 'hoi';
        return 'ty';
    },

    getCurrentBioInfo: function() {
        const id = this.getCurrentZoneId();
        return this.zones.find(z => z.id === id);
    }
};
