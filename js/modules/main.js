/**
 * FILE: js/main.js
 * CHỨC NĂNG: Xử lý Logic Đồng hồ, Live Editor & Upload File.
 * FULL FEATURES: Database Init, Clock Logic, FileReader, Dynamic Colors.
 */

// Cấu hình mặc định (có thêm màu neon)
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

window.onload = async function() {
    try {
        console.log("Đang khởi động YHCT Pro...");

        // 1. Khởi tạo DB
        const dbReady = await window.initAppDatabase();
        if (!dbReady) console.warn("Khởi tạo DB thất bại hoặc chưa có dữ liệu.");

        // 2. Render các thành phần UI
        if (window.renderMonthFilterList) {
            window.currentMonthFilter = window.getLocalDate().slice(0, 7); 
            window.renderMonthFilterList();
        }
        if (window.render) window.render();
        if (window.updateHeader) window.updateHeader();
        if (window.initDefaultValues) window.initDefaultValues();
        if (window.setupNativeInputs) window.setupNativeInputs();

        // 3. Fix iPad
        if (window.isIPad && window.isIPad()) {
            document.querySelectorAll('.song-input, textarea').forEach(input => {
                input.classList.add('ipad-input-fix');
            });
        }
        
        // 4. Khởi động Đồng hồ & Live Editor
        window.initBioClock();

        console.log("Ứng dụng đã sẵn sàng!");

    } catch (err) {
        console.error("Lỗi khởi động app (main.js):", err);
        alert("Có lỗi khi khởi động: " + err.message);
    }
};

/* ============================================================
   MODULE ĐỒNG HỒ SINH HỌC & LIVE EDITOR
   ============================================================ */

window.initBioClock = function() {
    setTimeout(() => {
        window.setupClockSettingsListeners(); // Bắt sự kiện cài đặt
        window.drawBioClockSectors();         // Vẽ vùng sáng
        window.updateBioClockState();         // Chạy đồng hồ
    }, 1000);

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

window.closeModals = function() {
    document.querySelectorAll('.modal').forEach(m => m.classList.remove('active'));
};

window.toggleClockSettings = function() {
    const panel = document.getElementById('clockSettingsPanel');
    if (panel) panel.classList.toggle('hidden');
};

/* --- XỬ LÝ UPLOAD HÌNH ẢNH (LIVE PREVIEW) --- */
window.handleUpload = function(input, targetId) {
    if (input.files && input.files[0]) {
        const reader = new FileReader();
        reader.onload = function(e) {
            const target = document.getElementById(targetId);
            if (target) {
                target.src = e.target.result; // Hiển thị ảnh ngay lập tức
                // Nếu là upload con giáp, thử kích hoạt animation để xem trước
                if(targetId.startsWith('gif_')) {
                    document.querySelectorAll('.char-video-wrapper').forEach(w => w.classList.remove('video-active'));
                    target.parentElement.classList.add('video-active');
                }
            }
        };
        reader.readAsDataURL(input.files[0]);
    }
};

/* --- RESET CÀI ĐẶT --- */
window.resetClockSettings = function() {
    const d = window.clockDefaults;
    // Reset biến màu CSS
    document.documentElement.style.setProperty('--neon-color', d.neonColor);
    document.documentElement.style.setProperty('--neon-intensity', d.neonInt);
    
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

/* --- LẮNG NGHE SỰ KIỆN THANH TRƯỢT & MÀU SẮC --- */
window.setupClockSettingsListeners = function() {
    // 1. Màu Sắc & Độ Đậm (Biến CSS)
    const inpCol = document.getElementById('inp_neonColor');
    if(inpCol) inpCol.oninput = function() {
        document.documentElement.style.setProperty('--neon-color', this.value);
    };
    
    const inpInt = document.getElementById('inp_neonInt');
    if(inpInt) inpInt.oninput = function() {
        document.getElementById('val_neonInt').innerText = this.value;
        document.documentElement.style.setProperty('--neon-intensity', this.value);
    };

    // 2. Độ mờ nền
    const inpBg = document.getElementById('inp_bgOp');
    if(inpBg) inpBg.oninput = function() {
        document.getElementById('val_bgOp').innerText = this.value;
        const img = document.getElementById('clockBgImg');
        if(img) img.style.opacity = this.value;
    };

    // 3. Kích thước Kim
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

    // 4. Tâm quay Kim (Pivot)
    const inpPivot = document.getElementById('inp_handPivot');
    if(inpPivot) inpPivot.oninput = function() {
        document.getElementById('val_handPivot').innerText = this.value + '%';
        document.querySelectorAll('.clock-hand').forEach(h => { 
            h.style.transformOrigin = `50% ${this.value}%`; 
        });
        window.updateBioClockState(); 
    };

    // 5. Bán kính Vòng sáng
    const handleRadiusChange = function() {
        if(this.id === 'inp_rOut') document.getElementById('val_rOut').innerText = this.value;
        if(this.id === 'inp_rIn') document.getElementById('val_rIn').innerText = this.value;
        window.drawBioClockSectors(); 
    };
    const inpROut = document.getElementById('inp_rOut');
    const inpRIn = document.getElementById('inp_rIn');
    if(inpROut) inpROut.oninput = handleRadiusChange;
    if(inpRIn) inpRIn.oninput = handleRadiusChange;

    // 6. Tốc độ Nhịp
    const inpSpeed = document.getElementById('inp_speed');
    if(inpSpeed) inpSpeed.oninput = function() {
        document.getElementById('val_speed').innerText = this.value + 's';
        const active = document.querySelector('.clock-zone.active-glow');
        if(active) active.style.animationDuration = this.value + 's';
    };
};

/* --- CẬP NHẬT TRẠNG THÁI ĐỒNG HỒ --- */
window.updateBioClockState = function() {
    const now = new Date();
    const h = now.getHours();
    const m = now.getMinutes();
    const s = now.getSeconds();

    const miniTimeEl = document.getElementById('miniDigitalTime');
    if (miniTimeEl) {
        miniTimeEl.innerText = `${h.toString().padStart(2,'0')}:${m.toString().padStart(2,'0')}:${s.toString().padStart(2,'0')}`;
    }

    if (window.knowledge && window.knowledge.bioClock) {
        const info = window.knowledge.bioClock.getCurrentBioInfo();
        
        const infoEl = document.getElementById('clockAdvice');
        const timeDisplayEl = document.getElementById('clockCurrentTime');
        const zoneNameEl = document.getElementById('clockZoneName');
        
        if (infoEl) infoEl.innerText = info.advice;
        if (timeDisplayEl) timeDisplayEl.innerText = `${h.toString().padStart(2,'0')}:${m.toString().padStart(2,'0')}`;
        if (zoneNameEl) zoneNameEl.innerText = `Giờ ${info.name} - ${info.meridian} Vượng`;

        // 1. Highlight Vùng Sáng (Neon)
        document.querySelectorAll('.clock-zone').forEach(el => {
            el.classList.remove('active-glow');
            el.style.animationDuration = ''; 
        });
        
        const activeZone = document.getElementById(`zone-${info.id}`);
        if (activeZone) {
            activeZone.classList.add('active-glow');
            // Áp dụng tốc độ hiện tại từ slider
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
/** * LOGIC QUẢN LÝ BÀI THUỐC MẪU TRONG CÀI ĐẶT 
 * (Dán đè hoặc thêm vào file tpl-settings.js hoặc main.js)
 */

// Hàm render danh sách khi mở tab Settings
window.renderSamplePrescriptionSettingsList = function() {
    const listEl = document.getElementById('samplePrescriptionList');
    if (!listEl) return;

    // Lấy dữ liệu từ Config User hoặc Default
    let samples = window.config.samplePrescriptions || [];
    
    // Nếu chưa có gì, nạp từ Default medicine
    if (samples.length === 0 && window.CONFIG_MEDICINE && window.CONFIG_MEDICINE.DEFAULT_EAST_SAMPLES) {
        // Chỉ gợi ý hiển thị, không lưu cứng trừ khi user bấm lưu
        samples = window.CONFIG_MEDICINE.DEFAULT_EAST_SAMPLES;
    }

    if (samples.length === 0) {
        listEl.innerHTML = `<div class="text-center text-gray-400 italic text-xs py-4">Chưa có bài thuốc mẫu nào.</div>`;
        return;
    }

    listEl.innerHTML = samples.map((s, idx) => `
        <div class="flex justify-between items-center p-2 border-b border-dashed border-gray-200 hover:bg-gray-50">
            <div class="overflow-hidden">
                <div class="font-bold text-[#5d4037] text-sm truncate">${s.name}</div>
                <div class="text-[10px] text-gray-500 truncate">${s.ingredients.map(i => i.name).join(', ')}</div>
            </div>
            <div class="flex gap-2 shrink-0">
                <button onclick="window.editSamplePrescription(${idx})" class="text-blue-600 hover:underline text-xs">Sửa</button>
                <button onclick="window.deleteSamplePrescription(${idx})" class="text-red-600 hover:underline text-xs">Xóa</button>
            </div>
        </div>
    `).join('');
};

// Hàm mở Modal thêm/sửa bài thuốc
window.currentSampleIndex = -1; // -1 là thêm mới

window.addNewSamplePrescriptionInline = function() {
    window.currentSampleIndex = -1;
    document.getElementById('samplePrescriptionName').value = "";
    document.getElementById('sampleIngredientsContainer').innerHTML = "";
    document.getElementById('samplePrescriptionModal').classList.add('active');
    
    // Thêm sẵn 1 dòng vị thuốc trống
    window.addSampleIngredientItem();
};

window.editSamplePrescription = function(idx) {
    window.currentSampleIndex = idx;
    
    // Lấy data từ nguồn đúng (User Config hoặc Default)
    let samples = window.config.samplePrescriptions;
    // Nếu config user rỗng nhưng đang hiển thị default
    if ((!samples || samples.length === 0) && window.CONFIG_MEDICINE) {
        samples = window.CONFIG_MEDICINE.DEFAULT_EAST_SAMPLES;
    }

    const sample = samples[idx];
    if(!sample) return;

    document.getElementById('samplePrescriptionName').value = sample.name;
    const container = document.getElementById('sampleIngredientsContainer');
    container.innerHTML = ""; // Clear cũ

    sample.ingredients.forEach(ing => {
        window.addSampleIngredientItem(ing.name, ing.qty);
    });

    document.getElementById('samplePrescriptionModal').classList.add('active');
};

window.addSampleIngredientItem = function(name = "", qty = "") {
    const container = document.getElementById('sampleIngredientsContainer');
    const div = document.createElement('div');
    div.className = "flex gap-2 items-center mb-2 sample-ing-row";
    div.innerHTML = `
        <input type="text" value="${name}" class="ing-name song-input flex-1 ipad-input-fix text-sm" placeholder="Vị thuốc...">
        <input type="number" value="${qty}" class="ing-qty song-input w-16 text-center ipad-input-fix text-sm" placeholder="g">
        <button onclick="this.parentElement.remove()" class="text-red-500 text-lg font-bold px-2">&times;</button>
    `;
    container.appendChild(div);
    
    // Focus vào ô tên nếu là thêm mới
    if(name === "") setTimeout(() => div.querySelector('.ing-name').focus(), 50);
};

window.closeSamplePrescriptionModal = function() {
    document.getElementById('samplePrescriptionModal').classList.remove('active');
};

window.saveSamplePrescription = function() {
    const name = document.getElementById('samplePrescriptionName').value.trim();
    if (!name) { alert("Vui lòng nhập tên bài thuốc!"); return; }

    const rows = document.querySelectorAll('.sample-ing-row');
    const ingredients = [];
    rows.forEach(row => {
        const n = row.querySelector('.ing-name').value.trim();
        const q = parseFloat(row.querySelector('.ing-qty').value) || 0;
        if (n) ingredients.push({ name: n, qty: q });
    });

    if (ingredients.length === 0) { alert("Bài thuốc phải có ít nhất 1 vị!"); return; }

    // Đảm bảo mảng config tồn tại
    if (!window.config.samplePrescriptions) {
        // Nếu user chưa có config riêng, clone từ default sang để bắt đầu edit
        window.config.samplePrescriptions = window.CONFIG_MEDICINE && window.CONFIG_MEDICINE.DEFAULT_EAST_SAMPLES 
            ? JSON.parse(JSON.stringify(window.CONFIG_MEDICINE.DEFAULT_EAST_SAMPLES)) 
            : [];
    }

    const newSample = { name, ingredients };

    if (window.currentSampleIndex === -1) {
        // Thêm mới
        window.config.samplePrescriptions.push(newSample);
    } else {
        // Cập nhật
        window.config.samplePrescriptions[window.currentSampleIndex] = newSample;
    }

    // Lưu Config
    window.saveConfig(); 
    
    // Render lại list
    window.renderSamplePrescriptionSettingsList();
    
    // Đóng modal
    window.closeSamplePrescriptionModal();
    window.showToast("✅ Đã lưu bài thuốc mẫu!", "success");
};

window.deleteSamplePrescription = function(idx) {
    if(!confirm("Bạn chắc chắn muốn xóa bài thuốc này?")) return;
    
    // Ensure config exists
    if (!window.config.samplePrescriptions && window.CONFIG_MEDICINE) {
         window.config.samplePrescriptions = JSON.parse(JSON.stringify(window.CONFIG_MEDICINE.DEFAULT_EAST_SAMPLES));
    }
    
    window.config.samplePrescriptions.splice(idx, 1);
    window.saveConfig();
    window.renderSamplePrescriptionSettingsList();
};

// --- QUAN TRỌNG: GẮN HÀM RENDER VÀO SỰ KIỆN CHUYỂN TAB ---
// Tìm hàm switchSettingsTab trong code cũ (nếu có) và bổ sung dòng gọi render
// Hoặc ghi đè lại như sau:

window.originalSwitchSettingsTab = window.switchSettingsTab; // Backup old function if exists

window.switchSettingsTab = function(tabId, btn) {
    // Ẩn tất cả panels
    document.querySelectorAll('.settings-panel').forEach(p => p.classList.add('hidden'));
    document.querySelectorAll('.settings-panel').forEach(p => p.classList.remove('active')); // Support cả class active cũ
    
    // Hiện panel được chọn
    const target = document.getElementById(tabId);
    if(target) {
        target.classList.remove('hidden');
        target.classList.add('active');
    }
    
    // Active button style
    document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
    if(btn) btn.classList.add('active');

    // [FIX] NẾU LÀ TAB CHUYÊN MÔN (tabMed) -> RENDER DANH SÁCH BÀI THUỐC
    if (tabId === 'tabMed') {
        // Render Disease List (Cũ)
        if(window.renderDiseaseList) window.renderDiseaseList();
        
        // Render Sample Prescriptions (Mới)
        if(window.renderSamplePrescriptionSettingsList) window.renderSamplePrescriptionSettingsList();
    }
};
