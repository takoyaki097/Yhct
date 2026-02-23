/**
 * FILE: modules_ui/lab-controller.js
 * CHỨC NĂNG: Bộ điều khiển (Controller) cho Phòng Lab Biện Chứng.
 * CẬP NHẬT: Tự động tra cứu và hiển thị TÊN THẬT của huyệt (Thái Uyên, Khổng Tối...) 
 * kết hợp với vai trò biện chứng (Huyệt Nguyên, Huyệt Khích) giúp UI rõ ràng hơn.
 */

window.LabUI = {
    lastResult: null,
    isCustomTime: false,
    customDateObj: null,

    // 1. Khởi tạo & Mở Modal
    open: function() {
        const modal = document.getElementById('labModal');
        if (!modal) return alert("Chưa tải giao diện Lab!");
        
        modal.classList.add('active');
        
        // Render danh sách Kinh Lạc nếu chưa có
        const meridianContainer = document.getElementById('labMeridianTags');
        if (meridianContainer && meridianContainer.innerHTML.trim() === '') {
            this.renderMeridianTags();
        }

        // Đồng bộ giờ hiện tại (nếu chưa chọn giờ giả lập)
        if (!this.isCustomTime) {
            this.syncCurrentTime();
        }
    },

    // 2. Render Danh sách Tạng Phủ (Kinh Lạc)
    renderMeridianTags: function() {
        const container = document.getElementById('labMeridianTags');
        if (!container || !window.ClinicalEngine) return;
        
        const meridians = Object.keys(window.ClinicalEngine.meridianData);
        container.innerHTML = meridians.map(code => {
            const m = window.ClinicalEngine.meridianData[code];
            return `<button class="lab-tag w-full" data-group="meridian" data-value="${code}" onclick="window.LabUI.toggleTag(this)">${m.name}</button>`;
        }).join('');
    },

    // 3. Xử lý logic Click Thẻ (Tags)
    toggleTag: function(btn) {
        const group = btn.dataset.group;
        
        // Nhóm Gender & Meridian: Radio (Chỉ chọn 1)
        if (group === 'gender' || group === 'meridian') {
            document.querySelectorAll(`.lab-tag[data-group="${group}"]`).forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
        } 
        // Nhóm Factor & BodyPart: Checkbox (Chọn nhiều)
        else {
            btn.classList.toggle('active');
        }
        
        // Tự động phân tích ngay khi có sự thay đổi
        this.analyze();
    },

    // 4. Xử lý Thời gian (Tí Ngọ)
    syncCurrentTime: function() {
        this.isCustomTime = false;
        this.customDateObj = null;
        
        let timeStr = "Đang đồng bộ...";
        if (window.knowledge && window.knowledge.timeEngine) {
            const t = window.knowledge.timeEngine.getCurrentTimeFull();
            timeStr = `${t.text.hour} (${t.dateStr})`;
        }
        document.getElementById('labTimeDisplay').innerText = timeStr;
        this.analyze();
    },

    setCustomTime: function(val) {
        if (!val) return;
        this.isCustomTime = true;
        this.customDateObj = new Date(val);
        
        // Format hiển thị đơn giản (Giả lập)
        const d = this.customDateObj;
        const h = d.getHours();
        const min = d.getMinutes();
        const dateStr = `${d.getDate()}/${d.getMonth()+1}/${d.getFullYear()}`;
        
        document.getElementById('labTimeDisplay').innerText = `[Giả lập] ${h}:${min < 10 ? '0'+min : min} - ${dateStr}`;
        this.analyze();
    },

    // 5. Reset toàn bộ
    resetAll: function() {
        document.querySelectorAll('.lab-tag').forEach(b => b.classList.remove('active'));
        // Default Nam
        const defaultGender = document.querySelector('.lab-tag[data-group="gender"][data-value="male"]');
        if (defaultGender) defaultGender.classList.add('active');
        
        this.syncCurrentTime();
        
        document.getElementById('labEmptyState').classList.remove('hidden');
        document.getElementById('labResultBox').classList.add('hidden');
        this.lastResult = null;
    },

    // 6. GỌI ENGINE PHÂN TÍCH (THE CORE)
    analyze: function() {
        if (!window.ClinicalEngine) return;

        // Thu thập Input
        const genderBtn = document.querySelector('.lab-tag[data-group="gender"].active');
        const meridianBtn = document.querySelector('.lab-tag[data-group="meridian"].active');
        const factorBtns = document.querySelectorAll('.lab-tag[data-group="factor"].active');
        const partBtns = document.querySelectorAll('.lab-tag[data-group="bodyPart"].active');

        // Cần ít nhất 1 Tạng/Phủ hoặc 1 vùng đau để luận trị
        if (!meridianBtn && partBtns.length === 0) {
            document.getElementById('labEmptyState').classList.remove('hidden');
            document.getElementById('labResultBox').classList.add('hidden');
            return;
        }

        const inputs = {
            gender: genderBtn ? genderBtn.dataset.value : 'male',
            meridian: meridianBtn ? meridianBtn.dataset.value : null,
            factors: Array.from(factorBtns).map(b => b.dataset.value),
            bodyParts: Array.from(partBtns).map(b => b.dataset.value)
        };

        // Chạy AI Biện chứng (Lấy từ bộ não ai-reasoning)
        const result = window.ClinicalEngine.analyze(inputs) || {
            points: [], localPoints: [], reasoning: [], sideAdvice: "Tùy chứng", methodAdvice: ""
        };

        // Bổ sung phân tích Thời Châm (Tí Ngọ Lưu Chú)
        if (!this.isCustomTime && window.knowledge && window.knowledge.ziWuFlow) {
            const ziwu = window.knowledge.ziWuFlow.getCurrentAnalysis();
            if (ziwu && ziwu.naZi) {
                // Thêm huyệt khai vào ĐẦU danh sách đặc hiệu
                result.points.unshift({
                    code: ziwu.naZi.horary,
                    name: 'Huyệt Khai (Tí Ngọ)',
                    method: 'Mở',
                    desc: `Kinh ${ziwu.naZi.meridian} đang vượng lúc ${ziwu.timeInfo}.`
                });
                result.reasoning.unshift(`<b>Thời châm:</b> Mở huyệt ${ziwu.naZi.horary} thuận theo sự vận hành khí huyết Tí Ngọ Lưu Chú hiện tại.`);
            }
        }

        // [MỚI] TỰ ĐỘNG TÌM VÀ GẮN TÊN THẬT CỦA HUYỆT VÀO KẾT QUẢ
        const attachRealNames = (pts) => {
            if (!pts) return;
            pts.forEach(p => {
                if (!p.code) return;
                const id = p.code.split(' ')[0]; // Lấy mã ID sạch (VD: LU9)
                if (window.knowledge && window.knowledge.acupoints) {
                    const acu = window.knowledge.acupoints.find(x => x.id === id);
                    if (acu && !p.name.includes(acu.name)) {
                        // Kết hợp Tên thật và Vai trò AI gán. VD: "Thái Uyên (Huyệt Mẹ)"
                        p.name = `${acu.name} (${p.name})`;
                    }
                }
            });
        };

        attachRealNames(result.points);
        attachRealNames(result.localPoints);

        this.renderResult(result);
    },

    // 7. Render Kết quả ra UI
    renderResult: function(result) {
        document.getElementById('labEmptyState').classList.add('hidden');
        document.getElementById('labResultBox').classList.remove('hidden');

        // 7.1. Bên châm
        document.getElementById('labSideResult').innerHTML = result.sideAdvice || "Tùy chứng";

        // Helper render 1 Huyệt thành thẻ Card
        const renderPointCard = (p) => `
            <div class="lab-point-card">
                <div class="lab-point-badge">${p.code}</div>
                <div class="lab-point-content">
                    <div class="flex justify-between items-start mb-1">
                        <span class="font-bold text-[#3e2723] text-sm">${p.name}</span>
                        <span class="text-[10px] font-black uppercase px-2 py-0.5 rounded border ${
                            p.method.includes('Bổ') ? 'bg-green-50 text-green-700 border-green-200' :
                            p.method.includes('Tả') ? 'bg-red-50 text-red-700 border-red-200' :
                            p.method.includes('Cứu') ? 'bg-orange-50 text-orange-700 border-orange-200' :
                            'bg-gray-100 text-gray-600 border-gray-200'
                        }">${p.method}</span>
                    </div>
                    <div class="text-[10px] text-gray-500 leading-tight">${p.desc}</div>
                </div>
            </div>
        `;

        // 7.2. Danh sách Huyệt Đặc Hiệu (Quân/Thần)
        const specialList = document.getElementById('labSpecialPointsList');
        if (result.points.length > 0) {
            specialList.innerHTML = result.points.map(renderPointCard).join('');
        } else {
            specialList.innerHTML = '<div class="text-xs text-gray-400 italic">Chưa xác định huyệt trị gốc (Hãy chọn thêm Tạng Phủ).</div>';
        }

        // 7.3. Danh sách Huyệt Tại Chỗ (Tá)
        const localSection = document.getElementById('labLocalPointsSection');
        const localList = document.getElementById('labLocalPointsList');
        if (result.localPoints && result.localPoints.length > 0) {
            localSection.classList.remove('hidden');
            localList.innerHTML = result.localPoints.map(renderPointCard).join('');
        } else {
            localSection.classList.add('hidden');
        }

        // 7.4. Lý luận
        const reasonHtml = result.reasoning.map(r => `<li>${r}</li>`).join('');
        document.getElementById('labReasoningList').innerHTML = reasonHtml;
        document.getElementById('labMethodAdvice').innerHTML = `<span>💡</span> <b>Phương pháp châm cứu:</b> ${result.methodAdvice}`;
        
        // Lưu tạm kết quả để dùng cho nút Áp dụng
        this.lastResult = result;
    },
    
    // 8. Chuyển Phác đồ vào Đơn thuốc
    applyToVisit: function() {
        if (!this.lastResult) return alert("Chưa có kết quả phác đồ!");
        
        // Cảnh báo nếu chưa vào phòng khám
        if (!window.currentVisit || !document.getElementById('vModal').classList.contains('active')) {
            return alert("Vui lòng mở phiếu khám của một bệnh nhân trước khi áp dụng phác đồ!");
        }
        
        let count = 0;
        const allPoints = [...(this.lastResult.points || []), ...(this.lastResult.localPoints || [])];

        allPoints.forEach(p => {
            // Tách mã ID (nếu p.code có dạng "BL23 (Thận Du)" thì chỉ lấy "BL23")
            const code = p.code.split(' ')[0];
            const exists = window.currentVisit.acupoints.some(x => x.id === code);
            
            if (!exists) {
                // Đẩy vào phương huyệt hiện tại, đính kèm luôn phương pháp (Bổ/Tả) vào Tên huyệt
                window.currentVisit.acupoints.push({ 
                    id: code, 
                    name: `${p.name} [${p.method}]` 
                });
                count++;
            }
        });
        
        // Gọi hàm update UI ở tab Điều trị
        if (window.renderSelectedAcupoints) window.renderSelectedAcupoints();
        
        // Toast Notification
        if (window.showToast) window.showToast(`✅ Đã nạp ${count} huyệt vào phương huyệt!`, "success");
        
        // Đóng Modal Lab
        document.getElementById('labModal').classList.remove('active');
    }
};
