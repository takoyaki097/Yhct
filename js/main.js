/**
 * FILE: main.js
 * CHỨC NĂNG: Điểm khởi chạy của ứng dụng (Entry Point).
 * Tự động chạy khi trang web tải xong để khởi tạo dữ liệu và giao diện.
 */

window.onload = async function() {
    try {
        console.log("Đang khởi động YHCT Pro...");

        // 1. Khởi tạo Cơ sở dữ liệu & Cấu hình (từ database.js)
        const dbReady = await window.initAppDatabase();
        if (!dbReady) console.warn("Khởi tạo DB thất bại hoặc chưa có dữ liệu.");

        // 2. Thiết lập bộ lọc tháng mặc định
        if (window.renderMonthFilterList) {
            window.currentMonthFilter = window.getLocalDate().slice(0, 7); 
            window.renderMonthFilterList();
        }

        // 3. Hiển thị danh sách bệnh nhân
        if (window.render) window.render();

        // 4. Cập nhật giao diện Header
        if (window.updateHeader) window.updateHeader();

        // 5. Khởi tạo các giá trị mặc định cho form khám
        if (window.initDefaultValues) window.initDefaultValues();

        // 6. Gán sự kiện cho các Input nhập số
        if (window.setupNativeInputs) window.setupNativeInputs();

        // 7. Fix lỗi hiển thị cho iPad
        if (window.isIPad && window.isIPad()) {
            document.querySelectorAll('.song-input, textarea').forEach(input => {
                input.classList.add('ipad-input-fix');
            });
        }
        
        // 8. KHỞI ĐỘNG ĐỒNG HỒ SINH HỌC (NEW)
        // Chức năng này sẽ tự động vẽ SVG và chạy đồng hồ
        window.initBioClock();

        console.log("Ứng dụng đã sẵn sàng!");

    } catch (err) {
        console.error("Lỗi khởi động app (main.js):", err);
        alert("Có lỗi khi khởi động: " + err.message);
    }
};

/* ============================================================
   MODULE ĐỒNG HỒ SINH HỌC (BIO CLOCK CONTROLLER)
   ============================================================ */

/**
 * Khởi tạo và chạy vòng lặp thời gian cho Widget & Modal
 */
window.initBioClock = function() {
    // 1. Vẽ các múi giờ (SVG Sectors) vào Modal
    // Cần đợi 1 chút để DOM load xong (vì template được insert bằng JS)
    setTimeout(() => {
        window.drawBioClockSectors();
        window.updateBioClockState(); // Cập nhật trạng thái lần đầu
    }, 1000);

    // 2. Thiết lập vòng lặp cập nhật (Mỗi giây)
    // Dùng setInterval để cập nhật kim giây và giờ digital
    setInterval(() => {
        window.updateBioClockState();
    }, 1000);
};

/**
 * Mở Modal Đồng hồ to
 */
window.openBioClock = function() {
    const modal = document.getElementById('bioClockModal');
    if (modal) {
        modal.classList.add('active');
        // Vẽ lại lần nữa để đảm bảo kích thước đúng (phòng trường hợp resize)
        window.drawBioClockSectors();
        window.updateBioClockState();
    }
};

/**
 * Hàm chính: Cập nhật hiển thị theo thời gian thực
 */
window.updateBioClockState = function() {
    const now = new Date();
    const h = now.getHours();
    const m = now.getMinutes();
    const s = now.getSeconds();

    // --- A. Cập nhật Widget Mini (Góc màn hình) ---
    const miniTimeEl = document.getElementById('miniDigitalTime');
    if (miniTimeEl) {
        // Format HH:mm:ss
        const timeStr = `${h.toString().padStart(2,'0')}:${m.toString().padStart(2,'0')}:${s.toString().padStart(2,'0')}`;
        miniTimeEl.innerText = timeStr;
    }

    // --- B. Cập nhật Modal lớn (Nếu DOM đã tồn tại) ---
    if (window.knowledge && window.knowledge.bioClock) {
        const info = window.knowledge.bioClock.getCurrentBioInfo();
        
        // 1. Cập nhật Text Thông tin (Theo ID mới trong tpl-resources.js)
        const infoEl = document.getElementById('clockAdvice');
        const timeDisplayEl = document.getElementById('clockCurrentTime');
        const zoneNameEl = document.getElementById('clockZoneName');
        
        // Chỉ cập nhật nếu element tồn tại
        if (infoEl) infoEl.innerText = info.advice;
        
        if (timeDisplayEl) {
            // Hiển thị giờ to: 14:30
            timeDisplayEl.innerText = `${h.toString().padStart(2,'0')}:${m.toString().padStart(2,'0')}`;
        }
        
        if (zoneNameEl) {
            // Hiển thị tên giờ: Giờ Mùi - Tiểu Trường Kinh Vượng
            zoneNameEl.innerText = `Giờ ${info.name} - ${info.meridian} Vượng`;
        }

        // 2. Highlight múi giờ (Glow effect)
        // Xóa hết class active cũ
        document.querySelectorAll('.clock-zone').forEach(el => el.classList.remove('active-glow'));
        
        // Active múi giờ hiện tại
        const activeZone = document.getElementById(`zone-${info.id}`);
        if (activeZone) {
            activeZone.classList.add('active-glow');
        }
    }

    // 3. Xoay kim đồng hồ (Chu kỳ 24 giờ)
    // Công thức: (Giờ * 60 + Phút) * (360 độ / 1440 phút)
    // Lưu ý: 0h (Tý) ở đỉnh (0 độ). 1 vòng = 24h.
    const totalMinutes = h * 60 + m;
    const degrees = totalMinutes * 0.25; // 360 / 1440 = 0.25 độ mỗi phút
    
    const hand = document.getElementById('clockHand');
    if (hand) {
        hand.style.transform = `translate(-50%, -100%) rotate(${degrees}deg)`;
    }
};

/**
 * [FIXED] Hàm vẽ 12 hình rẻ quạt (SVG) - Trong suốt hoàn toàn
 * Đã sửa lỗi fill transparent để không che mất ảnh đồng hồ
 */
window.drawBioClockSectors = function() {
    const container = document.getElementById('clockOverlayGroup');
    // Nếu chưa có container hoặc đã vẽ rồi thì dừng
    if (!container || container.children.length > 0) return; 

    const zones = [
        'ty', 'suu', 'dan', 'mao', 'thin', 'ty_ran', 
        'ngo', 'mui', 'than', 'dau', 'tuat', 'hoi'
    ];

    // Cấu hình bán kính (Khớp với ảnh 500x500 hoặc scale tương ứng)
    const radiusOuter = 240; // Bán kính ngoài
    const radiusInner = 90;  // Bán kính trong (trừ phần tâm Âm Dương)
    
    // Hàm tạo chuỗi path SVG hình rẻ quạt (donut slice)
    function createSectorPath(startAngle, endAngle) {
        // Chuyển độ sang radian (trừ 90 để 0 độ bắt đầu từ đỉnh 12h)
        const startRad = (startAngle - 90) * Math.PI / 180.0;
        const endRad = (endAngle - 90) * Math.PI / 180.0;

        const x1 = radiusOuter * Math.cos(startRad);
        const y1 = radiusOuter * Math.sin(startRad);
        const x2 = radiusOuter * Math.cos(endRad);
        const y2 = radiusOuter * Math.sin(endRad);

        const x3 = radiusInner * Math.cos(endRad);
        const y3 = radiusInner * Math.sin(endRad);
        const x4 = radiusInner * Math.cos(startRad);
        const y4 = radiusInner * Math.sin(startRad);

        // Vẽ lệnh SVG: Move -> Arc Lớn -> Line vào trong -> Arc Nhỏ -> Close
        return `M ${x1} ${y1} A ${radiusOuter} ${radiusOuter} 0 0 1 ${x2} ${y2} L ${x3} ${y3} A ${radiusInner} ${radiusInner} 0 0 0 ${x4} ${y4} Z`;
    }

    // Vòng lặp vẽ 12 múi
    zones.forEach((id, index) => {
        // Mỗi cung 30 độ. Tý (index 0) là trung tâm đỉnh => Từ -15 đến 15 độ.
        const startDeg = index * 30 - 15;
        const endDeg = startDeg + 30;

        const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
        path.setAttribute("d", createSectorPath(startDeg, endDeg));
        path.setAttribute("id", `zone-${id}`);
        path.setAttribute("class", "clock-zone");
        
        // --- [FIX QUAN TRỌNG] ---
        // Set màu nền là trong suốt (transparent) để không bị đen sì
        path.setAttribute("fill", "rgba(0,0,0,0)"); 
        path.setAttribute("stroke", "rgba(255,255,255,0.05)"); // Viền mờ cực nhẹ

        // Thêm tooltip đơn giản (hiện khi hover chuột)
        const title = document.createElementNS("http://www.w3.org/2000/svg", "title");
        title.textContent = `Giờ ${id.toUpperCase().replace('_', ' ')}`; 
        path.appendChild(title);

        container.appendChild(path);
    });
};
