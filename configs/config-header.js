/**
 * FILE: configs/config-header.js
 * CHỨC NĂNG: Quản lý hiển thị Header, Ảnh nền, QR Code và Bảo mật Doanh thu.
 * CẬP NHẬT: 
 * - Hiển thị Lời khuyên sức khỏe (Marquee).
 * - Hiển thị Tên Huyệt đầy đủ.
 * - [MỚI] Doanh thu Header tự động đồng bộ theo bộ lọc tháng (Dynamic Revenue).
 */

window.updateHeader = function() { 
    if (!window.config) return;
    
    // A. Cập nhật nội dung Text
    const titleEl = document.getElementById('displayTitle');
    if(titleEl) titleEl.innerText = window.config.clinicTitle || 'Phòng Khám'; 
    
    const drName = window.config.doctorName ? window.config.doctorName : 'Đông Y';
    const drEl = document.getElementById('displayDoctor');
    if(drEl) drEl.innerHTML = `<span class="text-[10px] font-bold uppercase block opacity-80 mb-0.5">Xin chào,</span><span class="font-black text-lg truncate block">BS. ${drName}</span>`;
    
    // B. Cập nhật thông tin chuyên môn
    if (window.knowledge) {
        // Ưu tiên dùng TimeEngine mới
        if (window.knowledge.timeEngine) {
            const timeData = window.knowledge.timeEngine.getCurrentTimeFull();
            
            // 1. Ngày & Âm lịch
            const elDate = document.getElementById('headerDate');
            const elLunar = document.getElementById('headerLunar');
            if(elDate) elDate.innerText = timeData.dateStr;
            if(elLunar) elLunar.innerText = timeData.fullDateStr;

            // 2. Vận Khí & Lời khuyên
            const elYunQi = document.getElementById('headerYunQi');
            if (window.knowledge.yunQi && elYunQi) {
                const yq = window.knowledge.yunQi.getCurrentInfo();
                const yearStr = timeData.text ? `Năm ${timeData.text.year}` : yq.year;
                const natureStr = yq.nature.includes('Vận') ? yq.nature.replace('Vận ', '') : yq.nature;
                
                if (yq.advice) {
                    elYunQi.innerHTML = `<div style="display:flex; align-items:center; width:100%; white-space:nowrap; overflow:hidden;">
                        <span style="font-weight:800; margin-right:5px; flex-shrink:0;">${yearStr} (${natureStr}):</span>
                        <marquee scrollamount="4" style="flex:1; font-weight:600; color:${window.config.profitTextColor || '#3e2723'};">${yq.advice}</marquee>
                    </div>`;
                } else {
                    elYunQi.innerText = `${yearStr} - ${natureStr}`; 
                }
            }

            // 3. Giờ Tí Ngọ (Có tra cứu tên huyệt)
            const elZiWu = document.getElementById('headerZiWu');
            if(elZiWu && window.knowledge.ziWuFlow) {
                let msg = "Đang tính toán...";
                const analysis = window.knowledge.ziWuFlow.getNaZiFa(timeData.bioClockZone); 
                
                if(analysis) {
                    // [LOGIC MỚI] Tra cứu tên huyệt từ mã (VD: LU9 -> Thái Uyên)
                    let openPointName = analysis.horary; // Mặc định là mã (VD: LU9)
                    
                    if (window.knowledge.acupoints) {
                        const pointInfo = window.knowledge.acupoints.find(p => p.id === analysis.horary);
                        if (pointInfo) {
                            openPointName = `${pointInfo.name} (${analysis.horary})`;
                        }
                    }
                    
                    msg = `Vượng ${analysis.meridian} - Khai: ${openPointName}`;
                }
                
                elZiWu.innerText = `${timeData.text.hour}: ${msg}`;
            }
        } 
        // Fallback cũ (Giữ nguyên để an toàn)
        else {
            if (window.knowledge.lunar) {
                const lunar = window.knowledge.lunar.getLunarDetails();
                document.getElementById('headerDate').innerText = lunar.date;
                document.getElementById('headerLunar').innerText = lunar.full;
            }
            if (window.knowledge.yunQi) {
                const yq = window.knowledge.yunQi.getCurrentInfo();
                document.getElementById('headerYunQi').innerText = `${yq.year} - ${yq.nature}`;
            }
            if (window.knowledge.ziWuFlow) {
                const ziWu = window.knowledge.ziWuFlow.getCurrentFlow();
                document.getElementById('headerZiWu').innerText = `Giờ ${ziWu.can} ${ziWu.chi}: ${ziWu.msg}`;
            }
        }
    }

    // C. Lợi nhuận & Màu sắc (Đã cập nhật logic tính toán)
    window.updateProfitDisplay();
    const profitBox = document.getElementById('profitBoxContainer');
    const headerCard = document.getElementById('mainHeaderCard');

    if (headerCard && window.config.profitTextColor) {
        headerCard.style.color = window.config.profitTextColor;
        headerCard.querySelectorAll('*').forEach(el => {
            if(!el.closest('#headerInfoBox') || el.tagName === 'MARQUEE') {
                el.style.color = window.config.profitTextColor;
                el.style.borderColor = window.config.profitTextColor; 
            }
        });
    }

    if (profitBox && window.config.profitBgColor) {
        profitBox.style.backgroundColor = window.config.profitBgColor;
        profitBox.style.borderColor = window.config.profitBgColor;
    }
    
    // D. Style & Blur
    const header = document.getElementById('mainHeader');
    const overlay = document.getElementById('headerOverlay');
    const infoBox = document.getElementById('headerInfoBox');
    
    if (window.config.headerBgImage) {
        header.style.backgroundImage = `url(${window.config.headerBgImage})`;
        if(overlay) overlay.style.opacity = (window.config.headerOverlayOpacity || 0) / 100;
        
        if(headerCard) {
            headerCard.classList.add('transparent-mode');
            const blurVal = window.config.headerBlur || 0;
            if (blurVal > 0) {
                const blurCss = `blur(${blurVal}px)`;
                headerCard.style.backdropFilter = blurCss;
                headerCard.style.webkitBackdropFilter = blurCss;
                headerCard.style.backgroundColor = 'rgba(255, 255, 255, 0.1)'; 
            } else {
                headerCard.style.backdropFilter = 'none';
                headerCard.style.webkitBackdropFilter = 'none';
                headerCard.style.backgroundColor = ''; 
            }
        }
        
        if(infoBox) {
            const infoBlurVal = window.config.headerInfoBlur || 0;
            if (infoBlurVal > 0) {
                const infoBlurCss = `blur(${infoBlurVal}px)`;
                infoBox.style.backdropFilter = infoBlurCss;
                infoBox.style.webkitBackdropFilter = infoBlurCss;
                infoBox.style.boxShadow = '0 4px 15px rgba(0,0,0,0.1)';
                infoBox.style.border = '1px solid rgba(255,255,255, 0.3)';
                infoBox.style.backgroundColor = `rgba(255, 255, 255, ${0.1 + (infoBlurVal/20)})`; 
            } else {
                infoBox.style.backdropFilter = 'none';
                infoBox.style.webkitBackdropFilter = 'none';
                infoBox.style.boxShadow = 'none';
                infoBox.style.backgroundColor = '';
                infoBox.style.border = '';
            }
        }
    } else {
        header.style.backgroundImage = 'none';
        if(overlay) overlay.style.opacity = 0;
        if(headerCard) {
            headerCard.classList.remove('transparent-mode');
            headerCard.style.backdropFilter = 'none';
            headerCard.style.webkitBackdropFilter = 'none';
            headerCard.style.backgroundColor = '';
        }
        if(infoBox) {
            infoBox.style.backdropFilter = 'none';
            infoBox.style.webkitBackdropFilter = 'none';
            infoBox.style.boxShadow = 'none';
            infoBox.style.backgroundColor = '';
            infoBox.style.border = '';
        }
    }
};

// --- CÁC HÀM XỬ LÝ SỰ KIỆN ---

window.handleImageUpload = function(input, configKey, previewId, isHeader = false) {
    const file = input.files[0]; if (!file) return;
    const reader = new FileReader();
    reader.onload = function(e) {
        window.config[configKey] = e.target.result;
        if (previewId) document.getElementById(previewId).src = e.target.result;
        if (isHeader) window.updateHeader();
        if(window.saveConfig) window.saveConfig();
    };
    reader.readAsDataURL(file);
};

window.updateHeaderOverlay = function(value) {
    window.config.headerOverlayOpacity = value;
    document.getElementById('overlayValueDisplay').innerText = value + '%';
    document.getElementById('headerOverlay').style.opacity = value / 100;
};

window.clearHeaderImage = function() {
    window.config.headerBgImage = null; document.getElementById('headerBgInput').value = "";
    window.updateHeader(); if(window.saveConfig) window.saveConfig();
};

window.clearQrImage = function() {
    window.config.qrCodeImage = null; document.getElementById('qrInput').value = "";
    document.getElementById('previewQrSettings').src = ""; if(window.saveConfig) window.saveConfig();
};

window.handleProfitBoxClick = async function() { 
    if(!window.config.password) { 
        window.config.profitVisible = !window.config.profitVisible; 
        if(window.saveConfig) await window.saveConfig(); 
        window.updateProfitDisplay(); 
    } else { 
        if(window.config.profitVisible) { 
            window.config.profitVisible = false; 
            if(window.saveConfig) await window.saveConfig(); 
            window.updateProfitDisplay(); 
        } else {
            if(window.openNativePasswordInput) {
                window.openNativePasswordInput((inputPass) => {
                    if (inputPass === window.config.password) {
                        window.config.profitVisible = true; 
                        window.updateProfitDisplay(); 
                        window.saveConfig(); 
                    } else { alert("Sai mật khẩu!"); }
                });
            }
        }
    } 
};

// [UPDATED] Hàm tính toán Doanh thu động theo bộ lọc
window.updateProfitDisplay = function() {
    const l = document.getElementById('profitLabel'); 
    if(!l) return;
    
    if(window.config.profitVisible || !window.config.password) {
        let t = 0; 
        
        // 1. Xác định bộ lọc hiện tại
        let filter = window.currentMonthFilter;
        
        // Nếu filter chưa được set hoặc là 'CURRENT', lấy tháng hiện tại theo chuẩn YYYY-MM
        if (!filter || filter === 'CURRENT') {
            filter = window.getLocalDate().slice(0, 7);
        }

        if(window.db) {
            window.db.forEach(p => {
                if (p.visits) {
                    p.visits.forEach(v => { 
                        // Chỉ tính các phiếu đã thanh toán
                        if (v.paid) {
                            let shouldInclude = false;
                            
                            if (filter === 'ALL') {
                                // Nếu chọn Tất cả -> Cộng hết
                                shouldInclude = true;
                            } else {
                                // Nếu chọn Tháng cụ thể -> So sánh chuỗi ngày (VD: "2026-01-31" startsWith "2026-01")
                                if (v.date && v.date.startsWith(filter)) {
                                    shouldInclude = true;
                                }
                            }

                            if (shouldInclude) {
                                t += ((v.total || 0) - (v.cost || 0)); 
                            }
                        }
                    });
                }
            });
        }
        l.innerText = t.toLocaleString();
    } else { 
        l.innerText = '******'; 
    }
};
