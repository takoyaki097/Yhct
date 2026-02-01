/**
 * FILE: modules_core/main.js
 * CHỨC NĂNG: Khởi động App, Bio Clock & Cấu hình nền tảng.
 * CẬP NHẬT: Đồng bộ hiển thị Giờ Can Chi (Tí Ngọ) chuẩn xác từ TimeEngine.
 */

// Cấu hình mặc định cho Đồng hồ sinh học
window.clockDefaults = {
    bgOp: 1, 
    handScale: 1, 
    handPivot: 84, // Tâm quay chuẩn 84%
    rOut: 196, 
    rIn: 90, 
    speed: 1.0,
    neonColor: '#ffd700',
    neonInt: 0.6
};

// ============================================================
// 1. APP INITIALIZATION (KHỞI ĐỘNG)
// ============================================================
window.onload = async function() {
    try {
        console.log("🚀 Đang khởi động YHCT Pro...");

        // 1. Khởi tạo DB (từ knowledge/database.js)
        const dbReady = await window.initAppDatabase();
        if (!dbReady) console.warn("⚠️ Cảnh báo: DB chưa sẵn sàng hoặc rỗng.");

        // 2. Render các thành phần UI cơ bản
        if (window.renderMonthFilterList) {
            // Mặc định lọc theo tháng hiện tại
            window.currentMonthFilter = window.getLocalDate().slice(0, 7); 
            window.renderMonthFilterList();
        }
        
        // Render danh sách bệnh nhân
        if (window.render) window.render();
        
        // Cập nhật Header (Ngày tháng, Giờ, Tên BS)
        if (window.updateHeader) window.updateHeader();
        
        // Khởi tạo các giá trị mặc định cho form khám
        if (window.initDefaultValues) window.initDefaultValues();
        
        // Cấu hình input số (cho mobile)
        if (window.setupNativeInputs) window.setupNativeInputs();

        // 3. Fix giao diện iPad (nếu có)
        if (window.isIPad && window.isIPad()) {
            document.querySelectorAll('.song-input, textarea').forEach(input => {
                input.classList.add('ipad-input-fix');
            });
        }
        
        // 4. Khởi động Đồng hồ sinh học & Live Editor
        window.initBioClock();

        // 5. Khởi động Kho (nếu có)
        if(window.Inventory && window.Inventory.init) {
            await window.Inventory.init();
        }

        console.log("✅ Ứng dụng đã sẵn sàng!");

    } catch (err) {
        console.error("❌ Lỗi khởi động (main.js):", err);
        alert("Có lỗi khi khởi động: " + err.message);
    }
};

// ============================================================
// 2. MODULE ĐỒNG HỒ SINH HỌC (BIO CLOCK LOGIC)
// ============================================================

window.initBioClock = function() {
    setTimeout(() => {
        window.setupClockSettingsListeners(); // Bắt sự kiện cài đặt
        window.drawBioClockSectors();         // Vẽ vùng sáng
        window.updateBioClockState();         // Chạy đồng hồ
    }, 1000);

    // Cập nhật mỗi giây
    setInterval(() => {
        window.updateBioClockState();
    }, 1000);
};

window.openBioClock = function() {
    const modal = document.getElementById('bioClockModal');
    if (modal) {
        modal.classList.add('active');
        window.drawBioClockSectors();
        window.updateBioClockState();
    }
};

window.toggleClockSettings = function() {
    const panel = document.getElementById('clockSettingsPanel');
    if (panel) panel.classList.toggle('hidden');
};

/* --- CẬP NHẬT TRẠNG THÁI KIM & TEXT --- */
window.updateBioClockState = function() {
    const now = new Date();
    const h = now.getHours();
    const m = now.getMinutes();
    const s = now.getSeconds();

    // Widget Mini bên ngoài
    const miniTimeEl = document.getElementById('miniDigitalTime');
    if (miniTimeEl) {
        miniTimeEl.innerText = `${h.toString().padStart(2,'0')}:${m.toString().padStart(2,'0')}:${s.toString().padStart(2,'0')}`;
    }

    // Modal Fullscreen
    if (window.knowledge && window.knowledge.bioClock) {
        const info = window.knowledge.bioClock.getCurrentBioInfo();
        
        const infoEl = document.getElementById('clockAdvice');
        const timeDisplayEl = document.getElementById('clockCurrentTime');
        const zoneNameEl = document.getElementById('clockZoneName');
        
        if (infoEl) infoEl.innerText = info.advice;
        if (timeDisplayEl) timeDisplayEl.innerText = `${h.toString().padStart(2,'0')}:${m.toString().padStart(2,'0')}`;
        
        // --- [FIX] ĐỒNG BỘ TÊN GIỜ CAN CHI VỚI HEADER ---
        let displayZoneName = `Giờ ${info.name}`; // Mặc định cũ (VD: Giờ Tý)
        
        if (window.knowledge.timeEngine) {
            // Lấy giờ Can Chi chính xác từ TimeEngine (VD: Giáp Tý)
            const timeData = window.knowledge.timeEngine.getCurrentTimeFull();
            if (timeData && timeData.text && timeData.text.hour) {
                displayZoneName = `Giờ ${timeData.text.hour}`;
            }
        }
        
        if (zoneNameEl) zoneNameEl.innerText = `${displayZoneName} - ${info.meridian} Vượng`;
        // ------------------------------------------------

        // 1. Highlight Vùng Sáng (Neon Effect)
        document.querySelectorAll('.clock-zone').forEach(el => {
            el.classList.remove('active-glow');
            el.style.animationDuration = ''; 
        });
        
        const activeZone = document.getElementById(`zone-${info.id}`);
        if (activeZone) {
            activeZone.classList.add('active-glow');
            // Áp dụng tốc độ từ slider
            const speedInput = document.getElementById('inp_speed');
            if(speedInput) activeZone.style.animationDuration = speedInput.value + 's';
        }

        // 2. Kích hoạt GIF 12 con giáp (Phóng to & Sáng)
        document.querySelectorAll('.char-video-wrapper').forEach(wrapper => {
            wrapper.classList.remove('video-active');
        });
        const currentWrapper = document.querySelector(`.char-video-wrapper.char-${info.id}`);
        if (currentWrapper) {
            currentWrapper.classList.add('video-active');
        }
    }

    // 3. Quay Kim (theo Pivot Setting)
    const degS = s * 6;
    const degM = m * 6 + s * 0.1;
    const degH = (h % 12) * 30 + m * 0.5;

    let pivotVal = window.clockDefaults.handPivot;
    const pivotInput = document.getElementById('inp_handPivot');
    if (pivotInput) pivotVal = pivotInput.value;

    const setRot = (id, deg) => {
        const el = document.getElementById(id);
        if (el) {
            el.style.transform = `translate(-50%, -${pivotVal}%) rotate(${deg}deg)`;
        }
    };

    setRot('handSecond', degS);
    setRot('handMinute', degM);
    setRot('handHour', degH);
};

window.drawBioClockSectors = function() {
    const container = document.getElementById('clockOverlayGroup');
    if (!container) return; 
    container.innerHTML = ''; 

    const zones = ['ty', 'suu', 'dan', 'mao', 'thin', 'ty_ran', 'ngo', 'mui', 'than', 'dau', 'tuat', 'hoi'];

    let rOut = window.clockDefaults.rOut; 
    let rIn = window.clockDefaults.rIn;   
    
    const inpROut = document.getElementById('inp_rOut');
    const inpRIn = document.getElementById('inp_rIn');
    
    if(inpROut) rOut = parseInt(inpROut.value);
    if(inpRIn) rIn = parseInt(inpRIn.value);

    function createDonutPath(startAngle, endAngle) {
        const startRad = (startAngle - 90) * Math.PI / 180.0;
        const endRad = (endAngle - 90) * Math.PI / 180.0;
        const x1 = rOut * Math.cos(startRad);
        const y1 = rOut * Math.sin(startRad);
        const x2 = rOut * Math.cos(endRad);
        const y2 = rOut * Math.sin(endRad);
        const x3 = rIn * Math.cos(endRad);
        const y3 = rIn * Math.sin(endRad);
        const x4 = rIn * Math.cos(startRad);
        const y4 = rIn * Math.sin(startRad);
        return `M ${x1} ${y1} A ${rOut} ${rOut} 0 0 1 ${x2} ${y2} L ${x3} ${y3} A ${rIn} ${rIn} 0 0 0 ${x4} ${y4} Z`;
    }

    zones.forEach((id, index) => {
        const startDeg = (index * 30 - 15);
        const endDeg = startDeg + 30;
        const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
        path.setAttribute("d", createDonutPath(startDeg, endDeg));
        path.setAttribute("id", `zone-${id}`);
        path.setAttribute("class", "clock-zone");
        path.setAttribute("fill", "rgba(0,0,0,0)"); 
        container.appendChild(path);
    });
    
    window.updateBioClockState();
};

/* --- LIVE EDITOR LISTENERS (CÀI ĐẶT ĐỒNG HỒ) --- */
window.setupClockSettingsListeners = function() {
    const inpCol = document.getElementById('inp_neonColor');
    if(inpCol) inpCol.oninput = function() {
        document.documentElement.style.setProperty('--neon-color', this.value);
    };
    
    const inpInt = document.getElementById('inp_neonInt');
    if(inpInt) inpInt.oninput = function() {
        document.getElementById('val_neonInt').innerText = this.value;
        document.documentElement.style.setProperty('--neon-intensity', this.value);
    };

    const inpBg = document.getElementById('inp_bgOp');
    if(inpBg) inpBg.oninput = function() {
        document.getElementById('val_bgOp').innerText = this.value;
        const img = document.getElementById('clockBgImg');
        if(img) img.style.opacity = this.value;
    };

    const inpScale = document.getElementById('inp_handScale');
    if(inpScale) inpScale.oninput = function() {
        document.getElementById('val_handScale').innerText = this.value;
        const s = parseFloat(this.value);
        const hH = document.getElementById('handHour');
        const hM = document.getElementById('handMinute');
        const hS = document.getElementById('handSecond');
        if(hH) hH.style.height = (25 * s) + '%';
        if(hM) hM.style.height = (35 * s) + '%';
        if(hS) hS.style.height = (40 * s) + '%';
    };

    const inpPivot = document.getElementById('inp_handPivot');
    if(inpPivot) inpPivot.oninput = function() {
        document.getElementById('val_handPivot').innerText = this.value + '%';
        document.querySelectorAll('.clock-hand').forEach(h => { 
            h.style.transformOrigin = `50% ${this.value}%`; 
        });
        window.updateBioClockState(); 
    };

    const handleRadiusChange = function() {
        if(this.id === 'inp_rOut') document.getElementById('val_rOut').innerText = this.value;
        if(this.id === 'inp_rIn') document.getElementById('val_rIn').innerText = this.value;
        window.drawBioClockSectors(); 
    };
    const inpROut = document.getElementById('inp_rOut');
    const inpRIn = document.getElementById('inp_rIn');
    if(inpROut) inpROut.oninput = handleRadiusChange;
    if(inpRIn) inpRIn.oninput = handleRadiusChange;

    const inpSpeed = document.getElementById('inp_speed');
    if(inpSpeed) inpSpeed.oninput = function() {
        document.getElementById('val_speed').innerText = this.value + 's';
        const active = document.querySelector('.clock-zone.active-glow');
        if(active) active.style.animationDuration = this.value + 's';
    };
};

window.resetClockSettings = function() {
    const d = window.clockDefaults;
    document.documentElement.style.setProperty('--neon-color', d.neonColor);
    document.documentElement.style.setProperty('--neon-intensity', d.neonInt);
    
    // Reset inputs
    const ids = { 
        'inp_bgOp': d.bgOp, 'inp_handScale': d.handScale, 'inp_handPivot': d.handPivot, 
        'inp_rOut': d.rOut, 'inp_rIn': d.rIn, 'inp_speed': d.speed,
        'inp_neonColor': d.neonColor, 'inp_neonInt': d.neonInt
    };
    
    for (const [id, val] of Object.entries(ids)) {
        const el = document.getElementById(id);
        if (el) { el.value = val; el.dispatchEvent(new Event('input')); }
    }
};

// ============================================================
// 3. FILE UPLOAD HANDLER (XỬ LÝ ẢNH)
// ============================================================
window.handleUpload = function(input, targetId) {
    if (input.files && input.files[0]) {
        const reader = new FileReader();
        reader.onload = function(e) {
            const target = document.getElementById(targetId);
            if (target) {
                target.src = e.target.result;
                // Nếu là upload con giáp, thử kích hoạt animation
                if(targetId.startsWith('gif_')) {
                    document.querySelectorAll('.char-video-wrapper').forEach(w => w.classList.remove('video-active'));
                    target.parentElement.classList.add('video-active');
                }
            }
        };
        reader.readAsDataURL(input.files[0]);
    }
};
