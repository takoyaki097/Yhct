/**
 * FILE: modules_visit/visit-finish.js
 * CHỨC NĂNG: Tính toán tiền, Lưu bệnh án (kèm trừ kho), In ấn & Copy Zalo.
 * THƯ MỤC: modules_visit/
 */

// ============================================================
// 1. TÍNH TOÁN TỔNG TIỀN (CALCULATE TOTAL)
// ============================================================

window.calcTotal = function() {
    // 1. Tính tiền Thủ thuật
    let procTotal = 0; 
    window.currentVisit.procs.forEach(p => { 
        procTotal += Math.round((p.price||0)*(p.days||1)*(1-(p.discount||0)/100)); 
    });
    
    // 2. Tính tiền Đông Y
    let eastTotal = 0;
    const eastDays = parseInt(document.getElementById('vEastDays').value)||1;
    const eastManual = parseInt(document.getElementById('vEastManualPrice').value)||0; 
    
    window.currentVisit.eastDays = eastDays;
    
    // Nếu nhập giá tay trọn gói thì lấy giá tay, ngược lại tính tổng các vị thuốc
    if (eastManual > 0) {
        eastTotal = eastManual * eastDays;
    } else {
        eastTotal = window.currentVisit.rxEast.reduce((a,m)=>a+((m.qty||0)*(m.price||0)),0) * eastDays;
    }
    
    // 3. Tính tiền Tây Y
    let westTotal = 0;
    const westDays = parseInt(document.getElementById('vWestDays').value)||1;
    const westManual = parseInt(document.getElementById('vWestManualPrice').value)||0; 
    
    window.currentVisit.westDays = westDays;
    
    if (westManual > 0) {
        westTotal = westManual * westDays;
    } else {
        // Tây y thường tính theo đơn vị viên/ngày * số ngày, hoặc tổng số viên * đơn giá
        // Ở đây giả định qty là TỔNG SỐ VIÊN đã kê
        westTotal = window.currentVisit.rxWest.reduce((a,m)=>a+((m.qty||0)*(m.price||0)),0);
    }
    
    // Lưu các giá trị tính được vào biến toàn cục để dùng khi Save
    window.currentVisit.manualMedTotalEast = eastTotal; 
    window.currentVisit.manualMedTotalWest = westTotal;
    
    // 4. Cập nhật UI hiển thị tổng từng phần
    document.getElementById('displayMedTotalEast').innerText = eastTotal.toLocaleString()+'đ'; 
    document.getElementById('displayMedTotalWest').innerText = westTotal.toLocaleString()+'đ'; 
    document.getElementById('displayProcTotal').innerText = procTotal.toLocaleString()+'đ';
    
    // 5. Tính tổng cộng và Chiết khấu
    const total = eastTotal + westTotal + procTotal; 
    document.getElementById('displayGrandTotal').innerText = total.toLocaleString()+'đ';
    
    const disc = parseInt(document.getElementById('vDiscountPercent').value)||0; 
    const finalVal = Math.round(total*(1-disc/100));
    document.getElementById('finalTotal').innerText = finalVal.toLocaleString()+'đ';
    
    // 6. Cập nhật hiển thị thành tiền trên từng dòng thuốc Đông y (để đồng bộ khi đổi số thang)
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

// ============================================================
// 2. LƯU & IN (SAVE & PRINT)
// ============================================================

window.saveOnly = function() { window.processSave(false); }; 
window.saveAndPrint = function() { window.processSave(true); };

window.processSave = async function(print) {
    try {
        const pid = document.getElementById('vPid').value; 
        if(!pid) throw new Error("Mất kết nối bệnh nhân. Vui lòng chọn lại bệnh nhân."); 
        
        // Tính toán lại lần cuối trước khi lưu
        window.calcTotal();
        
        // --- [INVENTORY LOGIC START] ---
        // Xử lý Trừ Kho & Hoàn Trả Kho
        let newInventoryLogs = []; // Chứa log giao dịch mới để lưu vào visit
        let oldVisitData = null; 
        
        // Tìm bệnh nhân để lấy dữ liệu cũ (nếu đang sửa đơn cũ)
        const pIdx = window.db.findIndex(x => String(x.id) === String(pid));
        if(pIdx === -1) throw new Error("Không tìm thấy bệnh nhân trong CSDL.");
        
        const visitId = parseInt(document.getElementById('vVisitId').value);
        if(visitId && window.db[pIdx].visits) {
             oldVisitData = window.db[pIdx].visits.find(v => v.id === visitId);
        }

        if (window.Inventory) {
            // A. Nếu đang Sửa đơn cũ: Hoàn trả (Restore) toàn bộ vật tư của đơn cũ về kho trước
            if (oldVisitData && oldVisitData.inventoryLogs) {
                console.log("🔄 Đang hoàn trả kho cho đơn cũ trước khi cập nhật...");
                await window.Inventory.restoreItems(oldVisitData.inventoryLogs);
            }

            // B. Trừ kho cho đơn mới (Consume)
            
            // 1. Trừ thuốc Đông y
            const eastDays = parseInt(document.getElementById('vEastDays').value) || 1;
            for (let med of window.currentVisit.rxEast) {
                // Tìm item trong kho khớp tên
                const invItem = window.Inventory.findItemByName(med.name);
                if (invItem) {
                    // Đông y tính theo gam * số thang
                    const amountToDeduct = (med.qty || 0) * eastDays;
                    if(amountToDeduct > 0) {
                        const logs = await window.Inventory.consumeItem(invItem.id, amountToDeduct);
                        if(logs) newInventoryLogs = newInventoryLogs.concat(logs);
                    }
                }
            }
            
            // 2. Trừ thuốc Tây y
            for (let med of window.currentVisit.rxWest) {
                const invItem = window.Inventory.findItemByName(med.name);
                if (invItem) {
                    // Tây y: qty là tổng số viên đã tính toán
                    const amountToDeduct = med.qty || 0; 
                     if(amountToDeduct > 0) {
                        const logs = await window.Inventory.consumeItem(invItem.id, amountToDeduct);
                        if(logs) newInventoryLogs = newInventoryLogs.concat(logs);
                    }
                }
            }

            // 3. Trừ Vật tư thủ thuật
            for (let proc of window.currentVisit.procs) {
                // Kiểm tra xem thủ thuật này có gắn với vật tư nào không
                // Logic: proc.consumables = { itemId: '...', totalDeduct: ... }
                if (proc.consumables && proc.consumables.itemId && proc.consumables.totalDeduct > 0) {
                     const logs = await window.Inventory.consumeItem(proc.consumables.itemId, proc.consumables.totalDeduct);
                     if(logs) newInventoryLogs = newInventoryLogs.concat(logs);
                }
            }
        }
        // --- [INVENTORY LOGIC END] ---

        // Tạo object Visit để lưu
        const visit = {
            id: visitId || Date.now(),
            date: document.getElementById('vDate').value,
            disease: document.getElementById('vDiseaseSelect').value || document.getElementById('vDiseaseInput').value,
            symptoms: document.getElementById('vSpecial').value,
            
            // Tứ chẩn
            tuChan: window.currentVisit.tuChan, 
            vong: document.getElementById('vVongExtra').value,
            van: document.getElementById('vVanExtra').value,
            vanhoi: document.getElementById('vVanHoiExtra').value,
            thiet: document.getElementById('vThietExtra').value,
            thietchan: document.getElementById('vThietChanExtra').value,
            machchan: document.getElementById('vMachChanExtra').value,
            
            // Dữ liệu thuốc & thủ thuật
            rxEast: window.currentVisit.rxEast, 
            rxWest: window.currentVisit.rxWest, 
            procs: window.currentVisit.procs, 
            acupoints: window.currentVisit.acupoints,
            
            // Log kho (để sau này hoàn trả nếu xóa)
            inventoryLogs: newInventoryLogs,

            // Cấu hình đơn thuốc
            eastDays: parseInt(document.getElementById('vEastDays').value) || 1, 
            westDays: parseInt(document.getElementById('vWestDays').value) || 1,
            eastNote: document.getElementById('vEastNote').value, 
            westNote: document.getElementById('vWestNote').value,
            manualPriceEast: parseInt(document.getElementById('vEastManualPrice').value) || 0, 
            manualPriceWest: parseInt(document.getElementById('vWestManualPrice').value) || 0,
            
            // Tài chính
            medPriceEast: window.currentVisit.manualMedTotalEast, 
            medPriceWest: window.currentVisit.manualMedTotalWest,
            total: parseInt(document.getElementById('finalTotal').innerText.replace(/[^\d]/g,'')), 
            cost: parseInt(document.getElementById('vCost').value) || 0,
            disc: parseInt(document.getElementById('vDiscountPercent').value) || 0, 
            paid: document.getElementById('vPaid').checked
        };
        
        // Cập nhật Database
        if(!window.db[pIdx].visits) window.db[pIdx].visits = []; 
        
        // Kiểm tra xem là cập nhật hay tạo mới
        const vIdx = window.db[pIdx].visits.findIndex(v => v.id === visit.id); 
        if(vIdx > -1) window.db[pIdx].visits[vIdx] = visit; 
        else window.db[pIdx].visits.unshift(visit); 
        
        // Lưu xuống Database (LocalForage)
        if(window.saveDb) await window.saveDb(); 
        
        // Xử lý sau khi lưu
        if(print) { 
            if(window.preparePrint) window.preparePrint('invoice'); 
        } else { 
            if(window.showToast) window.showToast("✅ Đã lưu & Trừ kho thành công!", "success"); 
            else alert("Đã lưu & Cập nhật kho!"); 
            
            if(window.closeModals) window.closeModals(); 
            
            // Refresh lại danh sách bên ngoài nếu cần
            if(window.render) window.render(); 
        } 
        
    } catch(e) { 
        console.error(e); 
        alert("Lỗi khi lưu: " + e.message); 
    }
};

// ============================================================
// 3. HELPER HOÀN TRẢ KHO (Dùng cho chức năng Xóa bệnh án bên ngoài)
// ============================================================

window.restoreInventoryFromVisit = async function(visitData) {
    if (visitData && visitData.inventoryLogs && window.Inventory) {
        await window.Inventory.restoreItems(visitData.inventoryLogs);
        console.log("✅ Đã hoàn trả kho từ phiếu khám đã xóa.");
    }
};

// ============================================================
// 4. TÍNH NĂNG ZALO (COPY TO CLIPBOARD)
// ============================================================

window.copyToZalo = function() {
    try {
        const pName = document.getElementById('vPatientName').innerText;
        const disease = document.getElementById('vDiseaseSelect').value || document.getElementById('vDiseaseInput').value;
        const symptoms = document.getElementById('vSpecial').value;
        
        let msg = `🏥 *PHÒNG KHÁM YHCT*\n----------------\n👤 BN: ${pName}\n🩺 Chẩn đoán: ${disease}\n`;
        if(symptoms) msg += `📝 Triệu chứng: ${symptoms}\n`;
        msg += `----------------\n`;
        
        // Phần Đông Y
        if (window.currentVisit.rxEast && window.currentVisit.rxEast.length > 0) {
            msg += `🌿 *ĐƠN THUỐC ĐÔNG Y* (${document.getElementById('vEastDays').value} thang)\n`;
            window.currentVisit.rxEast.forEach((m, i) => { msg += `${i+1}. ${m.name}: ${m.qty}g\n`; });
            const noteE = document.getElementById('vEastNote').value; 
            if(noteE) msg += `💡 HDSD: ${noteE}\n`; 
            msg += `\n`;
        }
        
        // Phần Tây Y
        if (window.currentVisit.rxWest && window.currentVisit.rxWest.length > 0) {
            msg += `💊 *ĐƠN THUỐC TÂY Y* (${document.getElementById('vWestDays').value} ngày)\n`;
            window.currentVisit.rxWest.forEach((m, i) => { msg += `${i+1}. ${m.name} (${m.qty} viên): ${m.usage || ''}\n`; });
            const noteW = document.getElementById('vWestNote').value; 
            if(noteW) msg += `💡 Lời dặn: ${noteW}\n`; 
            msg += `\n`;
        }
        
        // Phần Thủ thuật
        if (window.currentVisit.procs && window.currentVisit.procs.length > 0) {
            msg += `💆 *TRỊ LIỆU*\n`;
            window.currentVisit.procs.forEach((p, i) => { msg += `${i+1}. ${p.name}\n`; });
            msg += `\n`;
        }
        
        msg += `🗓 Ngày khám: ${document.getElementById('vDate').value}\n----------------\nCảm ơn quý khách!`;

        // Thực hiện Copy
        navigator.clipboard.writeText(msg).then(() => { 
            if(window.showToast) window.showToast("✅ Đã copy nội dung Zalo!", "success"); 
            else alert("Đã copy Zalo!"); 
        }).catch(err => { 
            console.error(err); 
            alert("Lỗi copy: Không hỗ trợ trên trình duyệt này.");
        });
        
    } catch (e) { 
        alert("Lỗi Zalo: " + e.message); 
    }
};
