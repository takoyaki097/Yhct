/**
 * FILE: modules_core/notification.js
 * CHỨC NĂNG: Engine xử lý thông báo trung tâm & UI Controller cho Nút Hub.
 * CẬP NHẬT: 
 * - Logic hiển thị số trực tiếp trong lòng nút (thay vì badge bên ngoài).
 * - Biến đổi số thành dấu '×' khi mở menu.
 */

// ============================================================
// 1. NOTIFICATION ENGINE (BỘ QUÉT DỮ LIỆU)
// ============================================================

window.NotificationEngine = {
    data: {
        inventory: [],
        appoint: [],
        debt: []
    },
    hiddenIds: new Set(), // Chứa ID các thông báo người dùng đã bấm 'X' (tạm ẩn)

    init: function() {
        console.log("🔔 Notification Engine Started...");
        
        // Tự động quét khi khởi động sau 1.5s (để DB load xong)
        setTimeout(() => this.refreshAll(), 1500);

        // Lắng nghe sự kiện toàn hệ thống để cập nhật lại
        window.addEventListener('inventory-updated', () => this.refreshAll());
        
        // Hook vào sự kiện click để cập nhật badge nếu cần thiết
        document.addEventListener('click', () => {
            // Logic phụ trợ nếu cần
        });
    },

    // Quét toàn bộ hệ thống
    scan: async function() {
        // Reset dữ liệu
        this.data = { inventory: [], appoint: [], debt: [] };
        
        // --- 1. QUÉT KHO (Dựa vào hàm getWarnings của inventory.js) ---
        if (window.Inventory && window.Inventory.getWarnings) {
            // Cảnh báo trước 60 ngày hết hạn
            const warnings = window.Inventory.getWarnings(60); 
            
            // A. Hàng sắp hết / Hết hàng
            if (warnings.lowStock) {
                warnings.lowStock.forEach(item => {
                    this.data.inventory.push({
                        id: `inv_low_${item.id}`,
                        type: item.totalStock <= 0 ? 'danger' : 'warning',
                        title: item.totalStock <= 0 ? 'Hết hàng' : 'Sắp hết hàng',
                        desc: `${item.name} (Còn: ${item.totalStock} ${item.unit})`,
                        actionLabel: 'Nhập kho',
                        actionFn: `window.HubUI.closeAll(); InventoryTpl.openItemModal('${item.id}')`
                    });
                });
            }

            // B. Hàng sắp hết hạn
            if (warnings.expiring) {
                warnings.expiring.forEach(batch => {
                    this.data.inventory.push({
                        id: `inv_exp_${batch.batchId}`,
                        type: 'warning',
                        title: 'Sắp hết hạn sử dụng',
                        desc: `${batch.itemName} (Lô: ${batch.lotNumber}) - Còn ${batch.daysLeft} ngày`,
                        actionLabel: 'Kiểm tra',
                        actionFn: `window.HubUI.closeAll(); InventoryTpl.openItemModal('${batch.itemId}')`
                    });
                });
            }
        }

        // --- 2. QUÉT BỆNH NHÂN (Lịch hẹn & Công nợ) ---
        if (window.db && Array.isArray(window.db)) {
            const today = window.getLocalDate(); // YYYY-MM-DD
            
            // Tính ngày mai
            const tomorrowDate = new Date();
            tomorrowDate.setDate(tomorrowDate.getDate() + 1);
            const tomorrow = tomorrowDate.toISOString().split('T')[0];

            window.db.forEach(p => {
                if (p.visits && p.visits.length > 0) {
                    p.visits.forEach(v => {
                        // A. Công Nợ (Chưa thanh toán)
                        if (v.paid === false) { // So sánh chính xác boolean false
                            // Chỉ báo nếu số tiền > 0
                            if (parseInt(v.total) > 0) {
                                this.data.debt.push({
                                    id: `debt_${v.id}`,
                                    type: 'danger',
                                    title: `Chưa thanh toán (${v.date})`,
                                    desc: `BN: ${p.name} - Số tiền: ${parseInt(v.total).toLocaleString()}đ`,
                                    actionLabel: 'Thu nhanh',
                                    actionFn: `window.NotificationEngine.quickPay('${p.id}', '${v.id}')`
                                });
                            }
                        }

                        // B. Lịch Hẹn (Tái khám)
                        // Logic: Nếu ngày khám trùng hôm nay hoặc mai
                        if (v.date === today || v.date === tomorrow) {
                            const isToday = v.date === today;
                            this.data.appoint.push({
                                id: `appt_${v.id}`,
                                type: 'info',
                                title: isToday ? 'Lịch khám Hôm nay' : 'Lịch khám Ngày mai',
                                desc: `BN: ${p.name} - ${v.disease || 'Chưa chẩn đoán'}`,
                                actionLabel: 'Xem hồ sơ',
                                actionFn: `window.HubUI.closeAll(); window.startVisit('${p.id}', '${v.id}')`
                            });
                        }
                    });
                }
            });
        }
    },

    // Hàm làm mới dữ liệu và vẽ lại UI
    refreshAll: async function() {
        await this.scan();
        window.HubUI.updateBadge();
        
        // Nếu Panel đang mở thì render lại list luôn để thấy thay đổi ngay
        const panel = document.getElementById('notificationPanel');
        if (panel && panel.classList.contains('active')) {
            window.HubUI.renderCurrentTab();
        }
    },

    // Hành động: Thu tiền nhanh (Không cần mở hồ sơ)
    quickPay: async function(pid, vid) {
        if (!confirm("Xác nhận đã thu tiền cho phiếu khám này?")) return;
        
        const p = window.db.find(x => String(x.id) === String(pid));
        if (p) {
            const v = p.visits.find(x => String(x.id) === String(vid));
            if (v) {
                v.paid = true; // Cập nhật trạng thái
                await window.saveDb(); // Lưu DB xuống ổ cứng
                
                if(window.showToast) window.showToast("💰 Đã cập nhật thu tiền!", "success");
                
                // Refresh lại để mất thông báo dòng đó
                this.refreshAll(); 
                
                // Nếu đang mở danh sách bệnh nhân thì render lại để mất chấm đỏ nợ
                if(window.render) window.render();
            }
        }
    },

    // Hành động: Ẩn thông báo (Dismiss)
    dismiss: function(id) {
        this.hiddenIds.add(id);
        this.refreshAll();
    }
};

// ============================================================
// 2. HUB UI CONTROLLER (QUẢN LÝ GIAO DIỆN)
// ============================================================

window.HubUI = {
    currentTab: 'inventory', // inventory | appoint | debt

    // --- A. MAIN BUTTON & MENU ---
    toggleMenu: function() {
        const container = document.getElementById('floatingHubContainer');
        const label = document.getElementById('hubMainLabel'); // Nhãn số ở giữa nút
        if (!container || !label) return;
        
        const isActive = container.classList.contains('active');
        
        if (isActive) {
            // Đang mở -> ĐÓNG LẠI
            container.classList.remove('active');
            // Gọi updateBadge để tính toán và hiển thị lại con số chính xác
            this.updateBadge();
        } else {
            // Đang đóng -> MỞ RA
            container.classList.add('active');
            
            // Biến con số thành dấu '×' (đóng)
            // Hiệu ứng chuyển đổi
            label.style.transform = 'scale(0.5)';
            setTimeout(() => {
                label.innerHTML = '&times;'; // Dấu nhân đẹp
                label.classList.remove('text-[#3e2723]', 'animate-pulse');
                label.classList.add('text-red-600'); // Dấu đóng màu đỏ cho nổi bật
                label.style.transform = 'scale(1.3)'; // Phóng to dấu X
            }, 100);
        }
    },

    // --- B. NOTIFICATION PANEL ---
    openNotifications: function() {
        // Đóng menu tròn trước
        const container = document.getElementById('floatingHubContainer');
        if(container) {
            container.classList.remove('active');
            // Reset lại nút về trạng thái số (đóng menu)
            this.updateBadge();
        }
        
        // Mở Panel chữ nhật
        const panel = document.getElementById('notificationPanel');
        if(panel) panel.classList.add('active');
        
        // Render dữ liệu
        this.switchTab(this.currentTab);
        window.NotificationEngine.refreshAll();
    },

    closeAll: function() {
        const panel = document.getElementById('notificationPanel');
        if(panel) panel.classList.remove('active');
        
        const container = document.getElementById('floatingHubContainer');
        if(container) container.classList.remove('active');
        
        this.updateBadge();
    },

    switchTab: function(tabName) {
        this.currentTab = tabName;
        
        // Update Tab UI styling
        ['inventory', 'appoint', 'debt'].forEach(t => {
            const btn = document.getElementById(`tab-notif-${t}`);
            const list = document.getElementById(`notif-list-${t}`);
            
            if (btn && list) {
                if (t === tabName) {
                    btn.classList.add('active', 'bg-white', 'shadow-sm');
                    btn.classList.remove('hover:bg-white/50');
                    list.classList.remove('hidden');
                } else {
                    btn.classList.remove('active', 'bg-white', 'shadow-sm');
                    btn.classList.add('hover:bg-white/50');
                    list.classList.add('hidden');
                }
            }
        });

        this.renderCurrentTab();
    },

    renderCurrentTab: function() {
        const type = this.currentTab;
        const data = window.NotificationEngine.data[type] || [];
        const container = document.getElementById(`notif-list-${type}`);
        const emptyState = document.getElementById('notif-empty');
        
        if (!container || !emptyState) return;

        // Lọc bỏ những cái đã bấm Dismiss
        const visibleData = data.filter(item => !window.NotificationEngine.hiddenIds.has(item.id));

        // Cập nhật chấm đỏ trên các Tab con
        this.updateTabDots();

        if (visibleData.length === 0) {
            container.innerHTML = '';
            container.classList.add('hidden');
            emptyState.classList.remove('hidden');
            return;
        }

        emptyState.classList.add('hidden');
        container.classList.remove('hidden');

        container.innerHTML = visibleData.map(item => `
            <div class="notif-item type-${item.type} flex justify-between items-start gap-3 group animate-fade-in">
                
                <div class="flex-1">
                    <div class="flex items-center gap-2 mb-1">
                        <div class="notif-icon w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold shadow-sm">
                            ${item.type === 'danger' ? '!' : (item.type === 'warning' ? '⚠' : 'i')}
                        </div>
                        <h4 class="text-xs font-bold text-[#3e2723] uppercase leading-tight">${item.title}</h4>
                        <span class="w-1.5 h-1.5 bg-red-500 rounded-full animate-pulse notif-badge"></span>
                    </div>
                    
                    <p class="text-[11px] text-gray-600 pl-8 leading-relaxed font-medium">
                        ${item.desc}
                    </p>

                    <div class="pl-8 mt-2 flex gap-2 opacity-80 group-hover:opacity-100 transition-opacity">
                        ${item.actionLabel ? `
                        <button onclick="${item.actionFn}" class="notif-action-btn">
                            <span>⚡</span> ${item.actionLabel}
                        </button>` : ''}
                    </div>
                </div>

                <button onclick="window.NotificationEngine.dismiss('${item.id}')" class="text-gray-300 hover:text-red-400 text-lg leading-none px-1" title="Bỏ qua">&times;</button>
            </div>
        `).join('');
    },

    // [CẬP NHẬT] Hàm hiển thị số trực tiếp lên nút chính
    updateBadge: function() {
        const data = window.NotificationEngine.data;
        // Tổng số thông báo chưa ẩn
        const total = [...data.inventory, ...data.appoint, ...data.debt]
            .filter(i => !window.NotificationEngine.hiddenIds.has(i.id)).length;

        const label = document.getElementById('hubMainLabel');
        if (label) {
            // Chỉ cập nhật nếu menu đang ĐÓNG (nếu mở thì đang hiện dấu X)
            const container = document.getElementById('floatingHubContainer');
            if (!container || !container.classList.contains('active')) {
                
                // Hiệu ứng scale nhẹ để chuyển đổi
                label.style.transform = 'scale(0.8)';
                
                setTimeout(() => {
                    if (total > 0) {
                        // CÓ THÔNG BÁO: Hiện số, màu đỏ, rung
                        label.innerText = total > 99 ? '99+' : total;
                        label.classList.remove('text-[#3e2723]');
                        label.classList.add('text-red-600', 'animate-pulse');
                    } else {
                        // KHÔNG CÓ: Hiện số 0, màu nâu bình tĩnh
                        label.innerText = '0';
                        label.classList.add('text-[#3e2723]');
                        label.classList.remove('text-red-600', 'animate-pulse');
                    }
                    label.style.transform = 'scale(1)';
                }, 100);
            }
        }

        // Cập nhật chấm nhỏ bên trong menu con (cho nút Chuông bên trong)
        const innerBadge = document.getElementById('hubInnerBadge');
        if (innerBadge) {
            if (total > 0) innerBadge.classList.remove('hidden');
            else innerBadge.classList.add('hidden');
        }
    },

    updateTabDots: function() {
        ['inventory', 'appoint', 'debt'].forEach(t => {
            const count = (window.NotificationEngine.data[t] || [])
                .filter(i => !window.NotificationEngine.hiddenIds.has(i.id)).length;
            const btn = document.getElementById(`tab-notif-${t}`);
            if (btn) {
                const dot = btn.querySelector('.badge-dot');
                if (dot) dot.style.opacity = count > 0 ? '1' : '0';
            }
        });
    },

    // --- C. QUICK NOTE (GHI CHÚ NHANH) ---
    openQuickNote: function() {
        // Đóng menu tròn
        const container = document.getElementById('floatingHubContainer');
        if(container) {
            container.classList.remove('active');
            this.updateBadge(); // Reset icon về số
        }
        
        const modal = document.getElementById('quickNoteModal');
        if(modal) {
            modal.classList.add('active');
            // Load note cũ
            const savedNote = localStorage.getItem('yhct_quick_note') || '';
            const area = document.getElementById('quickNoteArea');
            if(area) {
                area.value = savedNote;
                setTimeout(() => area.focus(), 300);
            }
        }
    },

    saveNote: function() {
        const area = document.getElementById('quickNoteArea');
        if(area) {
            const val = area.value;
            localStorage.setItem('yhct_quick_note', val);
            this.closeQuickNote();
            if(window.showToast) window.showToast("✅ Đã lưu ghi chú", "success");
        }
    },

    clearNote: function() {
        const area = document.getElementById('quickNoteArea');
        if(area) {
            area.value = '';
            localStorage.removeItem('yhct_quick_note');
            area.focus();
        }
    },

    closeQuickNote: function() {
        const modal = document.getElementById('quickNoteModal');
        if(modal) modal.classList.remove('active');
    }
};

// Khởi động Engine khi file load xong
setTimeout(() => {
    if (window.NotificationEngine) window.NotificationEngine.init();
}, 1000);
