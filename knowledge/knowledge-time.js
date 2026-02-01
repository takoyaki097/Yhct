/**
 * FILE: knowledge/knowledge-time.js
 * CHỨC NĂNG: Xử lý Lịch Âm, Tứ Trụ (Năm/Tháng/Ngày/Giờ) & Dự báo Vận Khí Y Học.
 * CẬP NHẬT: Khôi phục hệ thống nhắc nhở phòng bệnh (Health Advice) và thuật toán tính Can Chi chi tiết.
 */

window.knowledge = window.knowledge || {};

// 1. ENGINE TÍNH TOÁN THỜI GIAN & CAN CHI (CORE)
window.knowledge.timeEngine = {
    // Dữ liệu Can Chi
    CAN: ["Giáp", "Ất", "Bính", "Đinh", "Mậu", "Kỷ", "Canh", "Tân", "Nhâm", "Quý"],
    CHI: ["Tý", "Sửu", "Dần", "Mão", "Thìn", "Tỵ", "Ngọ", "Mùi", "Thân", "Dậu", "Tuất", "Hợi"],
    
    // Thuật toán Ngũ Hổ Độn (Tính Can của Tháng Dần - tháng 1 âm)
    // Quy tắc: Giáp/Kỷ khởi Bính, Ất/Canh khởi Mậu...
    MONTH_START_MAP: { 0: 2, 5: 2, 1: 4, 6: 4, 2: 6, 7: 6, 3: 8, 8: 8, 4: 0, 9: 0 },

    // Thuật toán Ngũ Thử Độn (Tính Can của Giờ Tý)
    // Quy tắc: Giáp/Kỷ khởi Giáp, Ất/Canh khởi Bính...
    HOUR_START_MAP: { 0: 0, 5: 0, 1: 2, 6: 2, 2: 4, 7: 4, 3: 6, 8: 6, 4: 8, 9: 8 },

    /**
     * Hàm lõi: Lấy toàn bộ thông tin thời gian hiện tại
     * Trả về cả Dương lịch, Âm lịch, và Tứ Trụ (Can Chi đầy đủ)
     */
    getCurrentTimeFull: function() {
        const now = new Date();
        
        // Lấy ngày dương lịch
        let dd = now.getDate();
        let mm = now.getMonth() + 1;
        let yyyy = now.getFullYear();
        let hour = now.getHours();
        
        // Biến tạm cho Âm lịch (Mặc định bằng dương lịch nếu chưa convert)
        let lDay = dd, lMonth = mm, lYear = yyyy;
        
        // 1. Chuyển đổi Âm Lịch dùng Intl API (Chính xác cho trình duyệt hiện đại)
        try {
            const formatter = new Intl.DateTimeFormat('vi-VN', {
                calendar: 'chinese', 
                timeZone: 'Asia/Ho_Chi_Minh',
                day: 'numeric', 
                month: 'numeric', 
                year: 'numeric'
            });
            const parts = formatter.formatToParts(now);
            parts.forEach(p => {
                if (p.type === 'day') lDay = parseInt(p.value);
                if (p.type === 'month') lMonth = parseInt(p.value);
                if (p.type === 'relatedYear') lYear = parseInt(p.value);
            });
        } catch (e) { 
            console.error("Lỗi Intl Calendar:", e); 
        }

        // 2. Tính CAN CHI NGÀY (Công thức Julian Day Number)
        const a = Math.floor((14 - mm) / 12);
        const y = yyyy + 4800 - a;
        const m = mm + 12 * a - 3;
        const jd = dd + Math.floor((153 * m + 2) / 5) + 365 * y + Math.floor(y / 4) - Math.floor(y / 100) + Math.floor(y / 400) - 32045;
        
        // Can Ngày (0=Giáp... 9=Quý)
        const canNgayIdx = (jd + 9) % 10;
        // Chi Ngày (0=Tý... 11=Hợi)
        const chiNgayIdx = (jd + 1) % 12;

        // 3. Tính CAN CHI NĂM
        const canNamIdx = (lYear + 6) % 10;
        const chiNamIdx = (lYear + 8) % 12;

        // 4. Tính CAN CHI THÁNG (Ngũ Hổ Độn)
        // Tháng 1 Âm luôn là tháng Dần (Chi = 2).
        const startCanMonth = this.MONTH_START_MAP[canNamIdx];
        const canThangIdx = (startCanMonth + (lMonth - 1)) % 10;
        const chiThangIdx = (2 + (lMonth - 1)) % 12;

        // 5. Tính CAN CHI GIỜ (Ngũ Thử Độn)
        // 23h-1h là Tý, 1h-3h là Sửu...
        let chiGioIdx = Math.floor((hour + 1) / 2) % 12; // 0=Tý, 1=Sửu...
        
        // Xử lý giờ khe: Nếu >= 23h, Can Giờ phải tính theo Can Ngày HÔM SAU
        let baseCanNgayForHour = canNgayIdx;
        if (hour >= 23) {
            baseCanNgayForHour = (canNgayIdx + 1) % 10;
        }
        
        const startCanHour = this.HOUR_START_MAP[baseCanNgayForHour];
        const canGioIdx = (startCanHour + chiGioIdx) % 10;

        // KẾT QUẢ TRẢ VỀ
        return {
            // Hiển thị chuỗi
            dateStr: `${dd}/${mm}/${yyyy}`,
            lunarDateStr: `${lDay}/${lMonth}`,
            fullDateStr: `Ngày ${lDay}/${lMonth} Âm lịch`,
            
            // Giá trị số (Index) dùng để tính toán logic
            val: {
                yCan: canNamIdx, yChi: chiNamIdx,
                mCan: canThangIdx, mChi: chiThangIdx,
                dCan: canNgayIdx, dChi: chiNgayIdx,
                hCan: canGioIdx, hChi: chiGioIdx
            },

            // Chuỗi chữ (Text) hiển thị Tứ Trụ
            text: {
                year: `${this.CAN[canNamIdx]} ${this.CHI[chiNamIdx]}`,
                month: `${this.CAN[canThangIdx]} ${this.CHI[chiThangIdx]}`,
                day: `${this.CAN[canNgayIdx]} ${this.CHI[chiNgayIdx]}`,
                hour: `${this.CAN[canGioIdx]} ${this.CHI[chiGioIdx]}`
            },
            
            // Helper cho BioClock (Lấy tên Chi giờ hiện tại để map với zone)
            bioClockZone: this.CHI[chiGioIdx]
        };
    }
};

// 2. ADAPTER TƯƠNG THÍCH NGƯỢC (Cho các module cũ vẫn gọi được)
window.knowledge.lunar = {
    getLunarDetails: function() {
        const t = window.knowledge.timeEngine.getCurrentTimeFull();
        return {
            date: t.dateStr,
            full: `${t.lunarDateStr} - Ngày ${t.text.day}`,
            canDayIdx: t.val.dCan,
            chiDayIdx: t.val.dChi
        };
    }
};

// 3. VẬN KHÍ & LỜI KHUYÊN SỨC KHỎE (YUNQI)
window.knowledge.yunQi = {
    // Tính chất của Vận theo Thiên Can năm (0=Giáp ... 9=Quý)
    stemNature: [
        'Thổ Thái Quá (Ẩm)', // Giáp
        'Kim Bất Cập (Phong)', // Ất
        'Thủy Thái Quá (Hàn)', // Bính
        'Mộc Bất Cập (Táo)', // Đinh
        'Hỏa Thái Quá (Thử)', // Mậu
        'Thổ Bất Cập (Phong)', // Kỷ
        'Kim Thái Quá (Táo)', // Canh
        'Thủy Bất Cập (Thấp)', // Tân
        'Mộc Thái Quá (Phong)', // Nhâm
        'Hỏa Bất Cập (Hàn)'  // Quý
    ],
    
    // [KHÔI PHỤC] Lời khuyên phòng bệnh tương ứng
    healthAdvice: [
        'Mưa ẩm nhiều. Phòng bệnh Tỳ Vị, đau bụng, phù thũng, nặng nề.', // Giáp - Thổ thái quá
        'Gió nhiều. Chú ý bệnh Can Đởm, đau sườn, đau mắt, chóng mặt.', // Ất - Kim bất cập (Mộc vượng)
        'Trời rét đậm. Phòng bệnh Thận, xương khớp, cảm lạnh, đau lưng.', // Bính - Thủy thái quá
        'Khô hanh. Chú ý bệnh Phế, ho khan, khô da, táo bón.', // Đinh - Mộc bất cập
        'Nắng nóng. Phòng bệnh Tâm, huyết áp cao, sốt, mụn nhọt.', // Mậu - Hỏa thái quá
        'Gió ẩm. Tỳ hư sinh thấp, rối loạn tiêu hóa, cơ bắp nhão.', // Kỷ - Thổ bất cập
        'Rất khô hanh. Phế khí vượng, dễ ho, viêm họng, nứt nẻ.', // Canh - Kim thái quá
        'Thấp trệ. Thận dương hư, đau lưng mỏi gối, tiểu đêm.', // Tân - Thủy bất cập
        'Gió lớn. Can khí động, dễ trúng gió, cao huyết áp, tai biến.', // Nhâm - Mộc thái quá
        'Khí lạnh. Tâm dương hư, người lạnh, hay hồi hộp, sợ gió.' // Quý - Hỏa bất cập
    ],

    getCurrentInfo: function() {
        const t = window.knowledge.timeEngine.getCurrentTimeFull();
        const canIdx = t.val.yCan;
        return { 
            year: `Năm ${t.text.year}`, 
            nature: `Vận ${this.stemNature[canIdx]}`,
            // Trả về lời khuyên để Header hiển thị
            advice: this.healthAdvice[canIdx] 
        };
    }
};

// 4. ĐỒNG HỒ SINH HỌC (BIO CLOCK DATA)
window.knowledge.bioClock = {
    zones: [
        { id: 'ty', name: 'Tý', meridian: 'Đởm Kinh', advice: 'Nên ngủ say để Đởm kinh tạo máu.' },
        { id: 'suu', name: 'Sửu', meridian: 'Can Kinh', advice: 'Ngủ sâu dưỡng Can, thải độc máu.' },
        { id: 'dan', name: 'Dần', meridian: 'Phế Kinh', advice: 'Phế vận chuyển khí huyết. Nên ngủ say.' },
        { id: 'mao', name: 'Mão', meridian: 'Đại Trường', advice: 'Nên thức dậy, uống nước ấm, đại tiện.' },
        { id: 'thin', name: 'Thìn', meridian: 'Vị Kinh', advice: 'Ăn sáng đầy đủ dinh dưỡng.' },
        { id: 'ty_ran', name: 'Tỵ', meridian: 'Tỳ Kinh', advice: 'Làm việc, học tập hiệu quả nhất.' },
        { id: 'ngo', name: 'Ngọ', meridian: 'Tâm Kinh', advice: 'Ăn trưa, ngủ ngắn 15-30p dưỡng tim.' },
        { id: 'mui', name: 'Mùi', meridian: 'Tiểu Trường', advice: 'Làm việc nhẹ, uống nước.' },
        { id: 'than', name: 'Thân', meridian: 'Bàng Quang', advice: 'Uống trà, thải độc, vận động nhẹ.' },
        { id: 'dau', name: 'Dậu', meridian: 'Thận Kinh', advice: 'Tập dưỡng sinh, ăn tối nhẹ, bổ thận.' },
        { id: 'tuat', name: 'Tuất', meridian: 'Tâm Bào', advice: 'Thư giãn, ngâm chân, đọc sách.' },
        { id: 'hoi', name: 'Hợi', meridian: 'Tam Tiêu', advice: 'Dừng làm việc, chuẩn bị ngủ.' }
    ],

    getCurrentBioInfo: function() {
        const t = window.knowledge.timeEngine.getCurrentTimeFull();
        // Mapping index chi (0=Tý ... 11=Hợi) sang ID của zone
        const map = ['ty','suu','dan','mao','thin','ty_ran','ngo','mui','than','dau','tuat','hoi'];
        const id = map[t.val.hChi];
        return this.zones.find(z => z.id === id);
    }
};
