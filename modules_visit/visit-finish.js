/**
 * FILE: modules_visit/visit-finish.js
 * CHUC NANG: Tinh toan tien, Luu benh an & Copy Zalo
 * CAP NHAT: Tich hop tinh tien Cong Sac Thuoc & Logic 2 nut thanh toan
 */

// [NEW] HÀM XỬ LÝ TRẠNG THÁI THANH TOÁN
window.setPaymentStatus = function(isPaid, skipConfirm = false) {
    // Nếu chọn Đã thanh toán và không phải đang load dữ liệu cũ (skipConfirm = false)
    if (isPaid && !skipConfirm) {
        if (!confirm("💰 Xác nhận khách đã thanh toán đủ tiền?")) {
            return; // Hủy nếu chọn No
        }
    }

    const stateInput = document.getElementById('vPaidState');
    const btnPaid = document.getElementById('btnPaid');
    const btnUnpaid = document.getElementById('btnUnpaid');

    if (stateInput && btnPaid && btnUnpaid) {
        stateInput.value = isPaid ? 'true' : 'false';

        // Update UI Classes
        if (isPaid) {
            // Active Paid Button (Xanh)
            btnPaid.className = "py-4 rounded-xl border border-[#2e7d32] bg-[#e8f5e9] text-[#1b5e20] font-black text-sm uppercase transition-all shadow-sm transform scale-[1.02]";
            // Deactive Unpaid (Xám mờ)
            btnUnpaid.className = "py-4 rounded-xl border border-gray-200 text-gray-400 font-bold text-sm uppercase transition-all bg-gray-50 opacity-60";
        } else {
            // Active Unpaid Button (Đỏ)
            btnUnpaid.className = "py-4 rounded-xl border border-[#c62828] bg-[#ffebee] text-[#b71c1c] font-black text-sm uppercase transition-all shadow-sm transform scale-[1.02]";
            // Deactive Paid (Xám mờ)
            btnPaid.className = "py-4 rounded-xl border border-gray-200 text-gray-400 font-bold text-sm uppercase transition-all bg-gray-50 opacity-60";
        }
    }
};

// --- 1. TINH TOAN TONG TIEN ---
window.calcTotal = function() {
    // 1. Tien Thu thuat
    let procTotal = 0; 
    window.currentVisit.procs.forEach(p => { 
        procTotal += Math.round((p.price||0)*(p.days||1)*(1-(p.discount||0)/100)); 
    });
    
    // 2. Tien Dong Y
    let eastTotal = 0;
    const eastDays = parseInt(document.getElementById('vEastDays').value)||1;
    const eastManual = parseInt(document.getElementById('vEastManualPrice').value)||0; 
    
    window.currentVisit.eastDays = eastDays;
    
    if (eastManual > 0) {
        eastTotal = eastManual * eastDays;
    } else {
        eastTotal = window.currentVisit.rxEast.reduce((a,m)=>a+((m.qty||0)*(m.price||0)),0) * eastDays;
    }
    
    // 3. Tien Tay Y
    let westTotal = 0;
    const westDays = parseInt(document.getElementById('vWestDays').value)||1;
    const westManual = parseInt(document.getElementById('vWestManualPrice').value)||0; 
    
    window.currentVisit.westDays = westDays;
    
    if (westManual > 0) {
        westTotal = westManual * westDays;
    } else {
        westTotal = window.currentVisit.rxWest.reduce((a,m)=>a+((m.qty||0)*(m.price||0)),0);
    }

    // 4. Tien Cong Sac Thuoc
    let sacTotal = 0;
    const isSac = document.getElementById('vIsSacThuoc') ? document.getElementById('vIsSacThuoc').checked : false;
    
    if (isSac) {
        const sQty = parseInt(document.getElementById('vSacQty').value) || 0;
        const sPrice = parseInt(document.getElementById('vSacPrice').value) || 0;
        sacTotal = sQty * sPrice;
        
        window.currentVisit.isSacThuoc = true;
        window.currentVisit.sacQty = sQty;
        window.currentVisit.sacPrice = sPrice;
    } else {
        window.currentVisit.isSacThuoc = false;
    }
    
    // Luu gia tri manual
    window.currentVisit.manualMedTotalEast = eastTotal; 
    window.currentVisit.manualMedTotalWest = westTotal;
    
    // Update UI
    document.getElementById('displayMedTotalEast').innerText = eastTotal.toLocaleString()+'đ'; 
    document.getElementById('displayMedTotalWest').innerText = westTotal.toLocaleString()+'đ'; 
    document.getElementById('displayProcTotal').innerText = procTotal.toLocaleString()+'đ';
    
    if(document.getElementById('displaySacTotal')) {
        document.getElementById('displaySacTotal').innerText = sacTotal.toLocaleString()+'đ';
    }
    
    // Tong cong & Chiet khau
    const total = eastTotal + westTotal + procTotal + sacTotal; 
    document.getElementById('displayGrandTotal').innerText = total.toLocaleString()+'đ';
    
    const disc = parseInt(document.getElementById('vDiscountPercent').value)||0; 
    const finalVal = Math.round(total*(1-disc/100));
    document.getElementById('finalTotal').innerText = finalVal.toLocaleString()+'đ';
    
    const eastContainer = document.getElementById('vMedListEast'); 
    if(eastContainer && eastContainer.children) {
        Array.from(eastContainer.children).forEach((el,i)=>{ 
            if(window.currentVisit.rxEast[i]) { 
                const m = window.currentVisit.rxEast[i];
                const td = el.querySelector('.proc-total-display'); 
                if(td) td.innerText = ((m.qty||0)*(m.price||0)*eastDays).toLocaleString(); 
            }
        });
    }
};

// --- 2. LUU PHIEU KHAM ---
window.saveOnly = function() { window.processSave(false); }; 
window.saveAndPrint = function() { window.processSave(true); };

window.processSave = async function(print) {
    try {
        const pid = document.getElementById('vPid').value; 
        if(!pid) throw new Error("Mất kết nối bệnh nhân. Vui lòng chọn lại bệnh nhân."); 
        
        // [VALIDATION MỚI] Kiểm tra đã chọn trạng thái thanh toán chưa
        // Giá trị vPaidState sẽ là "true", "false" hoặc rỗng ""
        const paidStateStr = document.getElementById('vPaidState').value;
        
        if (paidStateStr === "") {
            // Tự động chuyển sang tab 4 (Kết thúc) để người dùng thấy
            if (window.goToStep) window.goToStep(4);
            
            // Dùng setTimeout nhỏ để UI kịp chuyển tab trước khi hiện alert
            setTimeout(() => {
                alert("⚠️ CHƯA XÁC NHẬN THANH TOÁN!\n\nVui lòng chọn:\n[CHƯA THANH TOÁN] hoặc [ĐÃ THANH TOÁN]");
            }, 100);
            return; // Dừng lại, không lưu
        }

        window.calcTotal();
        
        const pIdx = window.db.findIndex(x => String(x.id) === String(pid));
        if(pIdx === -1) throw new Error("Không tìm thấy bệnh nhân trong CSDL.");
        
        const visitId = parseInt(document.getElementById('vVisitId').value);
        let oldVisitData = null;
        if(visitId && window.db[pIdx].visits) {
             oldVisitData = window.db[pIdx].visits.find(v => v.id === visitId);
        }

        let newInventoryLogs = [];
        if (window.processInventoryConsumption) {
            newInventoryLogs = await window.processInventoryConsumption(window.currentVisit, oldVisitData);
        }

        const isSac = document.getElementById('vIsSacThuoc') ? document.getElementById('vIsSacThuoc').checked : false;
        const sacQty = isSac ? (parseInt(document.getElementById('vSacQty').value) || 0) : 0;
        const sacPrice = isSac ? (parseInt(document.getElementById('vSacPrice').value) || 0) : 0;

        // Chuyển đổi trạng thái thanh toán từ chuỗi sang boolean
        const isPaid = (paidStateStr === 'true');

        const visit = {
            id: visitId || Date.now(),
            date: document.getElementById('vDate').value,
            disease: document.getElementById('vDiseaseSelect').value || document.getElementById('vDiseaseInput').value,
            symptoms: document.getElementById('vSpecial').value,
            
            tuChan: window.currentVisit.tuChan, 
            vong: document.getElementById('vVongExtra').value,
            van: document.getElementById('vVanExtra').value,
            vanhoi: document.getElementById('vVanHoiExtra').value,
            thiet: document.getElementById('vThietExtra').value,
            thietchan: document.getElementById('vThietChanExtra').value,
            machchan: document.getElementById('vMachChanExtra').value,
            
            rxEast: window.currentVisit.rxEast, 
            rxWest: window.currentVisit.rxWest, 
            procs: window.currentVisit.procs, 
            acupoints: window.currentVisit.acupoints,
            inventoryLogs: newInventoryLogs,

            eastDays: parseInt(document.getElementById('vEastDays').value) || 1, 
            westDays: parseInt(document.getElementById('vWestDays').value) || 1,
            eastNote: document.getElementById('vEastNote').value, 
            westNote: document.getElementById('vWestNote').value,
            manualPriceEast: parseInt(document.getElementById('vEastManualPrice').value) || 0, 
            manualPriceWest: parseInt(document.getElementById('vWestManualPrice').value) || 0,
            
            isSacThuoc: isSac,
            sacQty: sacQty,
            sacPrice: sacPrice,

            medPriceEast: window.currentVisit.manualMedTotalEast, 
            medPriceWest: window.currentVisit.manualMedTotalWest,
            total: parseInt(document.getElementById('finalTotal').innerText.replace(/[^\d]/g,'')), 
            cost: parseInt(document.getElementById('vCost').value) || 0,
            disc: parseInt(document.getElementById('vDiscountPercent').value) || 0, 
            
            // [UPDATE] Lưu trạng thái thanh toán chuẩn xác
            paid: isPaid
        };
        
        if(!window.db[pIdx].visits) window.db[pIdx].visits = []; 
        const vIdx = window.db[pIdx].visits.findIndex(v => v.id === visit.id); 
        if(vIdx > -1) window.db[pIdx].visits[vIdx] = visit; 
        else window.db[pIdx].visits.unshift(visit); 
        
        if(window.saveDb) await window.saveDb(); 
        
        if(print) { 
            if(window.preparePrint) window.preparePrint('invoice'); 
        } else { 
            if(window.showToast) window.showToast("✅ Đã lưu & Cập nhật thành công!", "success"); 
            else alert("Đã lưu thành công!");
            
            if(window.closeModals) window.closeModals(); 
            if(window.render) window.render(); 
        } 
        
    } catch(e) { 
        console.error(e); 
        alert("Lỗi khi lưu: " + e.message); 
    }
};

// --- 3. COPY ZALO ---
window.copyToZalo = function() {
    try {
        const pName = document.getElementById('vPatientName').innerText;
        const disease = document.getElementById('vDiseaseSelect').value || document.getElementById('vDiseaseInput').value;
        const symptoms = document.getElementById('vSpecial').value;
        
        let msg = `🏥 *PHÒNG KHÁM YHCT*\n----------------\n👤 BN: ${pName}\n🩺 Chẩn đoán: ${disease}\n`;
        if(symptoms) msg += `📝 Triệu chứng: ${symptoms}\n`;
        msg += `----------------\n`;
        
        if (window.currentVisit.rxEast && window.currentVisit.rxEast.length > 0) {
            msg += `🌿 *ĐƠN THUỐC ĐÔNG Y* (${document.getElementById('vEastDays').value} thang)\n`;
            window.currentVisit.rxEast.forEach((m, i) => { msg += `${i+1}. ${m.name}: ${m.qty}g\n`; });
            
            if (document.getElementById('vIsSacThuoc') && document.getElementById('vIsSacThuoc').checked) {
                msg += `🔥 Hỗ trợ sắc thuốc: ${document.getElementById('vSacQty').value} lần\n`;
            }

            const noteE = document.getElementById('vEastNote').value; 
            if(noteE) msg += `💡 HDSD: ${noteE}\n`; 
            msg += `\n`;
        }
        
        if (window.currentVisit.rxWest && window.currentVisit.rxWest.length > 0) {
            msg += `💊 *ĐƠN THUỐC TÂY Y* (${document.getElementById('vWestDays').value} ngày)\n`;
            window.currentVisit.rxWest.forEach((m, i) => { msg += `${i+1}. ${m.name} (${m.qty} viên): ${m.usage || ''}\n`; });
            const noteW = document.getElementById('vWestNote').value; 
            if(noteW) msg += `💡 Lời dặn: ${noteW}\n`; 
            msg += `\n`;
        }
        
        if (window.currentVisit.procs && window.currentVisit.procs.length > 0) {
            msg += `💆 *TRỊ LIỆU*\n`;
            window.currentVisit.procs.forEach((p, i) => { msg += `${i+1}. ${p.name}\n`; });
            msg += `\n`;
        }
        
        msg += `🗓 Ngày khám: ${document.getElementById('vDate').value}\n----------------\nCảm ơn quý khách!`;

        navigator.clipboard.writeText(msg).then(() => { 
            if(window.showToast) window.showToast("✅ Đã copy nội dung Zalo!", "success"); 
            else alert("Đã copy Zalo!"); 
        }).catch(err => { 
            console.error(err); 
            alert("Lỗi copy: Trình duyệt không hỗ trợ.");
        });
        
    } catch (e) { 
        alert("Lỗi Zalo: " + e.message); 
    }
};
