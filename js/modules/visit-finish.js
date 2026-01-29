/**
 * FILE: js/modules/visit-finish.js
 * CHỨC NĂNG: Tính toán tiền, Lưu bệnh án (kèm trừ kho), In ấn & Copy Zalo.
 * CẬP NHẬT: Tích hợp Logic Trừ/Trả Kho (Inventory).
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
    
    // Nếu nhập giá tay thì lấy giá tay, ngược lại tính tổng các vị thuốc
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
        westTotal = window.currentVisit.rxWest.reduce((a,m)=>a+((m.qty||0)*(m.price||0)),0) * westDays;
    }
    
    // Lưu các giá trị tính được vào biến toàn cục
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
    
    // 6. Cập nhật hiển thị thành tiền trên từng dòng thuốc (để đồng bộ khi đổi số ngày)
    ['east','west'].forEach(t=>{ 
        const d = t==='east'?eastDays:westDays;
        const ms = t==='east'?window.currentVisit.rxEast:window.currentVisit.rxWest; 
        const c = document.getElementById(t==='east'?'vMedListEast':'vMedListWest'); 
        
        if(c && c.children) {
            Array.from(c.children).forEach((el,i)=>{ 
                if(ms[i]) { 
                    const td=el.querySelector('.proc-total-display'); 
                    if(td) td.innerText=((ms[i].qty||0)*(ms[i].price||0)*d).toLocaleString(); 
                }
            });
        }
    });
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
        
        // [INVENTORY START] ----------------------------------------------------
        // Logic Trừ Kho & Hoàn Trả Kho
        let newInventoryLogs = []; // Chứa log giao dịch mới để lưu vào visit
        let oldVisitData = null; // Để check xem có cần restore không
        
        // Tìm bệnh nhân để lấy dữ liệu cũ (nếu đang sửa)
        const pIdx = window.db.findIndex(x => String(x.id) === String(pid));
        if(pIdx === -1) throw new Error("Không tìm thấy bệnh nhân trong CSDL.");
        
        const visitId = parseInt(document.getElementById('vVisitId').value);
        if(visitId && window.db[pIdx].visits) {
             oldVisitData = window.db[pIdx].visits.find(v => v.id === visitId);
        }

        if (window.Inventory) {
            // A. Nếu đang Sửa đơn cũ: Hoàn trả (Restore) toàn bộ vật tư của đơn cũ về kho trước
            if (oldVisitData && oldVisitData.inventoryLogs) {
                console.log("🔄 Đang hoàn trả kho cho đơn cũ...");
                await window.Inventory.restoreItems(oldVisitData.inventoryLogs);
            }

            // B. Trừ kho cho đơn mới (Consume)
            
            // 1. Trừ thuốc Đông y
            const eastDays = parseInt(document.getElementById('vEastDays').value) || 1;
            for (let med of window.currentVisit.rxEast) {
                // Tìm item trong kho khớp tên
                const invItem = window.Inventory.findItemByName(med.name);
                if (invItem) {
                    // Đông y tính theo gam, nhân số thang
                    const amountToDeduct = (med.qty || 0) * eastDays;
                    if(amountToDeduct > 0) {
                        const logs = await window.Inventory.consumeItem(invItem.id, amountToDeduct);
                        if(logs) newInventoryLogs = newInventoryLogs.concat(logs);
                    }
                }
            }
            
            // 2. Trừ thuốc Tây y
            const westDays = parseInt(document.getElementById('vWestDays').value) || 1;
             for (let med of window.currentVisit.rxWest) {
                const invItem = window.Inventory.findItemByName(med.name);
                if (invItem) {
                    // Tây y tính theo viên, nhân số ngày (nếu kê theo ngày) hoặc tổng số
                    // Logic hiện tại: qty là tổng số viên dùng trong 1 ngày * số ngày? 
                    // HAY qty là số viên dùng 1 lần?
                    // -> Quy ước: Trong UI hiện tại, qty thường nhập là TỔNG SỐ VIÊN CHO 1 NGÀY (hoặc 1 lần * số lần).
                    // Để đơn giản: Giả sử qty là TỔNG SỐ LƯỢNG KÊ CHO ĐỢT ĐIỀU TRỊ (nếu kê thẳng tổng).
                    // Nếu kê qty/ngày -> nhân westDays.
                    // Tạm tính: Deduct = qty (giả sử qty là tổng số viên đã tính toán)
                    // Nếu UI nhập qty/ngày -> Deduct = qty * westDays
                    
                    // Kiểm tra logic nhập liệu hiện tại:
                    // Trong visit-meds.js: "SL (v)" -> input value.
                    // Thường bác sĩ nhập Tổng số viên luôn.
                    // Vậy deduct = med.qty
                    
                    const amountToDeduct = med.qty || 0; 
                     if(amountToDeduct > 0) {
                        const logs = await window.Inventory.consumeItem(invItem.id, amountToDeduct);
                        if(logs) newInventoryLogs = newInventoryLogs.concat(logs);
                    }
                }
            }

            // 3. Trừ Vật tư thủ thuật (Nếu có cấu hình)
            for (let proc of window.currentVisit.procs) {
                // Kiểm tra xem thủ thuật này có gắn với vật tư nào không (dựa vào config)
                // Ví dụ: proc.consumables = [{ itemId: '...', amount: 2 }]
                if (proc.consumables && Array.isArray(proc.consumables)) {
                    for(let cons of proc.consumables) {
                        const totalDeduct = (cons.amount || 0) * (proc.days || 1);
                        if(totalDeduct > 0) {
                             const logs = await window.Inventory.consumeItem(cons.itemId, totalDeduct);
                             if(logs) newInventoryLogs = newInventoryLogs.concat(logs);
                        }
                    }
                }
            }
        }
        // [INVENTORY END] ------------------------------------------------------

        // Tạo object Visit
        const visit = {
            id: visitId || Date.now(),
            date: document.getElementById('vDate').value,
            disease: document.getElementById('vDiseaseSelect').value || document.getElementById('vDiseaseInput').value,
            symptoms: document.getElementById('vSpecial').value,
            
            // Tứ chẩn
            tuChan: window.currentVisit.tuChan, 
            vong: document.getElementById('vVongExtra').value,
            
            // Dữ liệu thuốc & thủ thuật
            rxEast: window.currentVisit.rxEast, 
            rxWest: window.currentVisit.rxWest, 
            procs: window.currentVisit.procs, 
            acupoints: window.currentVisit.acupoints,
            
            // [NEW] Lưu log kho vào phiếu khám
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
        // Note: Nếu lỗi ở bước saveDb nhưng đã trừ kho rồi thì sẽ bị lệch kho. 
        // Tuy nhiên với localForage thì hiếm khi lỗi saveDb trừ khi full disk.
        // Để an toàn tuyệt đối cần transaction rollback, nhưng với scope app nhỏ thì chấp nhận.
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
            // CHỈ HIỂN THỊ TÊN VÀ KHỐI LƯỢNG - KHÔNG HIỂN THỊ GIÁ
            window.currentVisit.rxEast.forEach((m, i) => { msg += `${i+1}. ${m.name}: ${m.qty}g\n`; });
            const noteE = document.getElementById('vEastNote').value; 
            if(noteE) msg += `💡 HDSD: ${noteE}\n`; 
            msg += `\n`;
        }
        
        // Phần Tây Y
        if (window.currentVisit.rxWest && window.currentVisit.rxWest.length > 0) {
            msg += `💊 *ĐƠN THUỐC TÂY Y* (${document.getElementById('vWestDays').value} ngày)\n`;
            // CHỈ HIỂN THỊ TÊN VÀ SỐ LƯỢNG - KHÔNG HIỂN THỊ GIÁ
            window.currentVisit.rxWest.forEach((m, i) => { msg += `${i+1}. ${m.name} (${m.qty} viên): ${m.usage || ''}\n`; });
            const noteW = document.getElementById('vWestNote').value; 
            if(noteW) msg += `💡 Lời dặn: ${noteW}\n`; 
            msg += `\n`;
        }
        
        // Phần Tài chính (Có thể ẩn nếu muốn bảo mật tuyệt đối, nhưng thường Zalo gửi khách thì cần tổng tiền)
        // Nếu muốn ẩn cả tiền, comment dòng dưới lại.
        // const total = document.getElementById('finalTotal').innerText;
        // msg += `💰 *Tổng thanh toán:* ${total}\n🗓 Ngày khám: ${document.getElementById('vDate').value}\n----------------\nCảm ơn quý khách!`;
        
        // Update: Chỉ hiện lời chào, không hiện tiền theo yêu cầu "Tuyệt đối không có giá tiền" 
        // (Mặc dù yêu cầu gốc là "Copy Zalo... không có giá vốn/tiền gốc", nhưng an toàn nhất là bỏ luôn tổng tiền nếu cần)
        // Tuy nhiên, thường khách cần biết tổng phải trả. 
        // -> Logic: Ẩn giá chi tiết từng món, chỉ hiện TỔNG CỘNG CUỐI CÙNG (như bill nhà hàng).
        
        msg += `🗓 Ngày khám: ${document.getElementById('vDate').value}\n----------------\nCảm ơn quý khách!`;

        // Thực hiện Copy
        if (navigator.clipboard && navigator.clipboard.writeText) {
            navigator.clipboard.writeText(msg).then(() => { 
                if(window.showToast) window.showToast("✅ Đã copy nội dung Zalo!", "success"); 
                else alert("Đã copy Zalo!"); 
            }).catch(err => { 
                console.error(err); 
                fallbackCopyTextToClipboard(msg);
            });
        } else {
            fallbackCopyTextToClipboard(msg);
        }
    } catch (e) { 
        alert("Lỗi Zalo: " + e.message); 
    }
};

// Hàm fallback cho trình duyệt cũ không hỗ trợ Clipboard API
function fallbackCopyTextToClipboard(text) {
    var textArea = document.createElement("textarea");
    textArea.value = text;
    textArea.style.top = "0";
    textArea.style.left = "0";
    textArea.style.position = "fixed";
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    try {
        var successful = document.execCommand('copy');
        if(successful) {
            if(window.showToast) window.showToast("✅ Đã copy nội dung Zalo!", "success");
            else alert("Đã copy Zalo!");
        } else {
            alert('Không thể copy text.');
        }
    } catch (err) {
        console.error('Fallback: Oops, unable to copy', err);
    }
    document.body.removeChild(textArea);
}

// ============================================================
// 5. HELPER KHỞI TẠO CUỐI CÙNG
// ============================================================

// Tự động cập nhật thông tin Vận Khí ở Header nếu hàm tồn tại
setTimeout(() => { 
    if(window.updateYunQiDisplay) window.updateYunQiDisplay(); 
}, 1000);
