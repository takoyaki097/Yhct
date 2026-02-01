/**
 * FILE: templates/tpl-inventory.js
 * CHỨC NĂNG: Giao diện Quản lý kho (Responsive Ultimate).
 * CẬP NHẬT: 
 * - Nâng ngưỡng Breakpoint lên XL (1280px). 
 * - iPad ngang (1024px) vẫn hiện nút Menu ☰ thay vì ghim cứng cột trái.
 */

window.InventoryTpl = {
    currentFilter: 'all',

    // Hàm gọi chính để mở Modal Kho
    open: async function() {
        // Đảm bảo dữ liệu mới nhất
        await window.Inventory.init();
        
        const html = `
            <div id="inventoryModalContent" class="flex flex-col h-full bg-[#fdfbf7]">
                
                <div class="p-3 bg-white border-b border-[#d7ccc8] flex gap-3 items-center shadow-sm z-20 shrink-0">
                    
                    <button class="xl:hidden w-10 h-10 flex items-center justify-center border border-[#d7ccc8] rounded-lg text-[#5d4037] active:bg-[#efebe9] transition-colors" 
                            onclick="document.getElementById('invSidebar').classList.toggle('hidden'); document.getElementById('invSidebarOverlay').classList.toggle('hidden');">
                        ☰
                    </button>

                    <div class="relative flex-1 group">
                        <span class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#5d4037]">🔍</span>
                        <input type="text" id="invSearchInput" onkeyup="InventoryTpl.handleSearch()" 
                            placeholder="Tìm thuốc, vật tư..." 
                            class="w-full pl-10 pr-3 py-2.5 bg-[#fcfbf9] border border-[#d7ccc8] rounded-xl text-sm outline-none focus:border-[#5d4037] focus:bg-white transition-all shadow-inner">
                    </div>

                    <button onclick="InventoryTpl.openItemModal()" 
                        class="bg-[#5d4037] text-white h-10 px-4 rounded-xl text-sm font-bold shadow-sm hover:bg-[#4e342e] flex items-center gap-2 active:scale-95 transition-transform whitespace-nowrap">
                        <span class="text-lg">+</span> <span class="hidden sm:inline">Thêm</span>
                    </button>
                </div>

                <div class="flex-1 flex overflow-hidden relative">
                    
                    <div id="invSidebar" class="hidden xl:block w-64 bg-white border-r border-[#d7ccc8] overflow-y-auto custom-scrollbar flex-shrink-0 absolute xl:static inset-y-0 left-0 z-30 shadow-2xl xl:shadow-none transition-all h-full">
                        <div class="p-2 space-y-1">
                            <div class="px-3 py-2 text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-2 flex justify-between items-center">
                                <span>Danh mục</span>
                                <button class="xl:hidden text-lg text-gray-400 w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100" 
                                        onclick="document.getElementById('invSidebar').classList.add('hidden'); document.getElementById('invSidebarOverlay').classList.add('hidden');">&times;</button>
                            </div>
                            ${this.renderSidebarBtn('all', '📦 Tất cả')}
                            ${this.renderSidebarBtn('dong_duoc', '🌿 Đông dược')}
                            ${this.renderSidebarBtn('tan_duoc', '💊 Tân dược')}
                            ${this.renderSidebarBtn('vtyt', '💉 Vật tư y tế')}
                        </div>

                        <div class="mt-4 mx-2 p-3 bg-[#fefebe0] rounded-xl border border-[#d7ccc8] text-center mb-4">
                            <div class="text-[9px] text-gray-500 uppercase font-bold mb-1">Tổng giá trị kho</div>
                            <div class="font-mono font-black text-[#3e2723] text-base" id="invTotalValue">
                                ${this.formatMoney(this.calculateTotalValue())}
                            </div>
                        </div>
                    </div>

                    <div id="invSidebarOverlay" class="hidden xl:hidden absolute inset-0 bg-black/30 z-20 backdrop-blur-sm transition-opacity"
                         onclick="document.getElementById('invSidebar').classList.add('hidden'); this.classList.add('hidden');">
                    </div>

                    <div class="flex-1 flex flex-col bg-[#f8f6f4] relative w-full min-w-0">
                        <div class="grid grid-cols-12 gap-2 px-3 py-2 bg-[#ece0d1] text-[9px] font-bold text-[#5d4037] uppercase tracking-wider border-b border-[#d7ccc8] shrink-0">
                            <div class="col-span-6 md:col-span-5 pl-1">Tên Hàng</div>
                            <div class="col-span-3 md:col-span-2 text-center">Đơn Vị</div>
                            <div class="col-span-3 md:col-span-2 text-center">Tồn</div>
                            <div class="hidden md:block md:col-span-3 text-right pr-2">Tác vụ</div>
                        </div>

                        <div id="invListContainer" class="flex-1 overflow-y-auto p-2 space-y-2 custom-scrollbar pb-20">
                            </div>
                    </div>
                </div>
            </div>
        `;

        // Render Modal
        if (window.UIHelper && window.UIHelper.showModal) {
            window.UIHelper.showModal("Kho & Thuốc", html);
        } else {
            const modalId = 'inventoryModalMain';
            let existing = document.getElementById(modalId);
            if(existing) existing.remove();

            document.body.insertAdjacentHTML('beforeend', `
                <div id="${modalId}" class="modal active" style="z-index:3000;">
                    <div class="modal-box w-full max-w-6xl h-[90vh] flex flex-col p-0 overflow-hidden bg-[#fafafa]">
                        <div class="bg-[#5d4037] text-[#f2ebe0] px-4 py-3 flex justify-between items-center shadow-md shrink-0">
                            <div class="flex items-center gap-2">
                                <span class="text-xl">📦</span>
                                <h2 class="font-bold text-lg uppercase tracking-wide">Quản Lý Kho</h2>
                            </div>
                            <button onclick="document.getElementById('${modalId}').remove()" class="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors">&times;</button>
                        </div>
                        <div class="flex-1 overflow-hidden relative">
                            ${html}
                        </div>
                    </div>
                </div>
            `);
        }

        this.renderList();
    },

    // Render nút Sidebar
    renderSidebarBtn: function(type, label) {
        const isActive = this.currentFilter === type;
        return `
            <button onclick="InventoryTpl.switchFilter('${type}')" 
                class="w-full text-left px-3 py-3 rounded-lg text-xs font-bold transition-all mb-1 flex items-center justify-between group
                ${isActive ? 'bg-[#5d4037] text-white shadow-md' : 'text-gray-600 hover:bg-gray-100 hover:text-[#5d4037]'}">
                <span>${label}</span>
                ${isActive ? '<span>●</span>' : ''}
            </button>
        `;
    },

    switchFilter: function(type) {
        this.currentFilter = type;
        
        // Update Active Class thủ công
        const btns = document.querySelectorAll('#invSidebar button[onclick*="switchFilter"]');
        const labels = {
            'all': '📦 Tất cả', 
            'dong_duoc': '🌿 Đông dược', 
            'tan_duoc': '💊 Tân dược', 
            'vtyt': '💉 Vật tư y tế'
        };
        
        btns.forEach((btn) => {
            const onClickText = btn.getAttribute('onclick');
            const btnType = onClickText.match(/'([^']+)'/)[1];
            
            if(btnType === type) {
                btn.className = "w-full text-left px-3 py-3 rounded-lg text-xs font-bold transition-all mb-1 flex items-center justify-between group bg-[#5d4037] text-white shadow-md";
                btn.innerHTML = `<span>${labels[btnType]}</span><span>●</span>`;
            } else {
                btn.className = "w-full text-left px-3 py-3 rounded-lg text-xs font-bold transition-all mb-1 flex items-center justify-between group text-gray-600 hover:bg-gray-100 hover:text-[#5d4037]";
                btn.innerHTML = `<span>${labels[btnType]}</span>`;
            }
        });

        // Tự động đóng sidebar sau khi chọn (Chỉ trên Mobile/iPad)
        const sb = document.getElementById('invSidebar');
        const ov = document.getElementById('invSidebarOverlay');
        
        // Kiểm tra nếu sidebar đang ở chế độ absolute (Mobile/iPad) thì mới đóng
        if(sb && window.getComputedStyle(sb).position === 'absolute') {
            sb.classList.add('hidden');
            if(ov) ov.classList.add('hidden');
        }

        this.renderList();
    },

    renderList: function() {
        const container = document.getElementById('invListContainer');
        if (!container) return;

        const keyword = document.getElementById('invSearchInput')?.value || '';
        const items = window.Inventory.search(keyword, this.currentFilter);

        if (items.length === 0) {
            container.innerHTML = `
                <div class="flex flex-col items-center justify-center h-full text-gray-400 opacity-60 min-h-[300px]">
                    <span class="text-4xl mb-2 grayscale">📭</span>
                    <span class="text-xs italic">Không tìm thấy dữ liệu</span>
                </div>`;
            return;
        }

        container.innerHTML = items.map(item => {
            const isLowStock = item.totalStock <= item.minStock;
            const rowClass = isLowStock ? 'bg-red-50/50 border-red-100' : 'bg-white border-gray-200';
            
            return `
                <div onclick="InventoryTpl.openItemModal('${item.id}')" 
                     class="grid grid-cols-12 gap-2 px-3 py-3 ${rowClass} border rounded-xl hover:shadow-md hover:border-[#d7ccc8] transition-all items-center group cursor-pointer relative mb-2">
                    
                    <div class="col-span-6 md:col-span-5 min-w-0">
                        <div class="font-bold text-[#3e2723] text-sm truncate">${item.name}</div>
                        <div class="text-[10px] text-gray-400 font-mono mt-0.5 flex gap-2">
                            <span>Giá: ${this.formatMoney(item.price)}</span>
                            ${item.batches && item.batches.length > 0 ? `<span class="bg-gray-100 px-1 rounded text-gray-600">${item.batches.length} lô</span>` : ''}
                        </div>
                    </div>

                    <div class="col-span-3 md:col-span-2 text-center">
                        <span class="text-[10px] bg-gray-100 px-2 py-1 rounded text-gray-600 border border-gray-200">
                            ${item.unit}
                        </span>
                    </div>

                    <div class="col-span-3 md:col-span-2 text-center">
                        <span class="font-black text-sm ${isLowStock ? 'text-red-600' : 'text-[#3e2723]'}">
                            ${item.totalStock}
                        </span>
                        ${isLowStock ? '<span class="block text-[8px] text-red-500 font-bold uppercase tracking-wide">Sắp hết</span>' : ''}
                    </div>

                    <div class="col-span-0 md:col-span-3 hidden md:flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button onclick="event.stopPropagation(); InventoryTpl.openItemModal('${item.id}')" class="px-2 py-1 bg-blue-50 text-blue-600 rounded text-[10px] font-bold border border-blue-100 hover:bg-blue-100">Sửa</button>
                        <button onclick="event.stopPropagation(); InventoryTpl.deleteItem('${item.id}')" class="px-2 py-1 bg-red-50 text-red-600 rounded text-[10px] font-bold border border-red-100 hover:bg-red-100">Xóa</button>
                    </div>
                    
                    <div class="absolute right-2 top-1/2 -translate-y-1/2 text-gray-300 md:hidden text-lg">›</div>
                </div>
            `;
        }).join('');
    },

    handleSearch: function() {
        if(this.debounceTimer) clearTimeout(this.debounceTimer);
        this.debounceTimer = setTimeout(() => { this.renderList(); }, 300);
    },

    // ============================================================
    // MODAL THÊM / SỬA CHI TIẾT
    // ============================================================
    
    openItemModal: function(itemId = null) {
        const item = itemId ? window.Inventory.getItem(itemId) : {
            id: '', name: '', type: this.currentFilter === 'all' ? 'vtyt' : this.currentFilter,
            unit: 'Cái', price: 0, minStock: 5, batches: []
        };
        const isEdit = !!itemId;

        let batchesHtml = item.batches && item.batches.length > 0 ? item.batches.map(b => `
            <tr class="border-b border-gray-50 text-xs hover:bg-gray-50">
                <td class="py-2 px-2 font-mono font-bold text-[#3e2723]">${b.lotNumber}</td>
                <td class="py-2 px-2 text-center text-gray-500">${b.expiryDate || '-'}</td>
                <td class="py-2 px-2 text-right font-black">${b.quantity}</td>
                <td class="py-2 px-2 text-right">
                    <button onclick="InventoryTpl.deleteBatch('${item.id}', '${b.id}')" class="text-red-400 hover:text-red-600 font-bold px-2">×</button>
                </td>
            </tr>
        `).join('') : `<tr><td colspan="4" class="text-center py-4 text-xs text-gray-400 italic">Chưa có lô hàng.</td></tr>`;

        const html = `
            <div class="fixed inset-0 z-[6000] flex items-center justify-center bg-black/60 backdrop-blur-sm" id="itemDetailModal">
                <div class="bg-white w-[95%] max-w-lg rounded-2xl shadow-2xl overflow-hidden animate-pop-in flex flex-col max-h-[90vh]">
                    <div class="bg-[#5d4037] text-white px-5 py-3 flex justify-between items-center shrink-0">
                        <h3 class="font-bold text-sm uppercase tracking-wider">${isEdit ? '✏️ Cập Nhật' : '➕ Thêm Mới'}</h3>
                        <button onclick="document.getElementById('itemDetailModal').remove()" class="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white">&times;</button>
                    </div>
                    
                    <div class="p-5 overflow-y-auto custom-scrollbar flex-1 bg-[#fdfbf7]">
                        <div class="space-y-3">
                            <div>
                                <label class="text-[10px] font-bold text-gray-400 uppercase block mb-1">Tên hàng hóa *</label>
                                <input type="text" id="inpName" value="${item.name}" class="w-full border border-gray-300 rounded-lg p-2 focus:border-[#5d4037] outline-none font-bold text-[#3e2723] bg-white">
                            </div>
                            <div class="grid grid-cols-2 gap-3">
                                <div>
                                    <label class="text-[10px] font-bold text-gray-400 uppercase block mb-1">Loại</label>
                                    <select id="inpType" class="w-full border border-gray-300 rounded-lg p-2 outline-none text-sm bg-white">
                                        <option value="vtyt" ${item.type==='vtyt'?'selected':''}>💉 Vật tư</option>
                                        <option value="dong_duoc" ${item.type==='dong_duoc'?'selected':''}>🌿 Đông dược</option>
                                        <option value="tan_duoc" ${item.type==='tan_duoc'?'selected':''}>💊 Tân dược</option>
                                    </select>
                                </div>
                                <div>
                                    <label class="text-[10px] font-bold text-gray-400 uppercase block mb-1">Đơn vị</label>
                                    <input type="text" id="inpUnit" value="${item.unit}" list="unitList" class="w-full border border-gray-300 rounded-lg p-2 outline-none text-sm text-center bg-white">
                                    <datalist id="unitList"><option value="Cái"><option value="Hộp"><option value="Gói"><option value="Viên"><option value="Chai"></datalist>
                                </div>
                            </div>
                            <div class="grid grid-cols-2 gap-3">
                                <div><label class="text-[10px] font-bold text-gray-400 uppercase block mb-1">Giá vốn</label><input type="number" id="inpPrice" value="${item.price}" class="w-full border border-gray-300 rounded-lg p-2 outline-none text-sm font-mono bg-white"></div>
                                <div><label class="text-[10px] font-bold text-gray-400 uppercase block mb-1">Cảnh báo tồn</label><input type="number" id="inpMinStock" value="${item.minStock}" class="w-full border border-gray-300 rounded-lg p-2 outline-none text-sm text-center bg-white"></div>
                            </div>
                        </div>

                        ${isEdit ? `
                        <div class="mt-4 pt-4 border-t border-dashed border-[#d7ccc8]">
                            <div class="flex justify-between items-center mb-2">
                                <h4 class="font-bold text-[#5d4037] text-xs uppercase">📦 Danh sách Lô</h4>
                                <button onclick="document.getElementById('addBatchForm').classList.toggle('hidden')" class="text-[10px] bg-blue-100 text-blue-700 px-2 py-1 rounded font-bold hover:bg-blue-200">+ Nhập lô</button>
                            </div>
                            <div id="addBatchForm" class="hidden bg-blue-50 p-2 rounded mb-2 border border-blue-100">
                                <div class="grid grid-cols-3 gap-2 mb-2">
                                    <input type="text" id="batchLot" placeholder="Mã lô" class="text-xs border p-1 rounded bg-white">
                                    <input type="date" id="batchExp" class="text-xs border p-1 rounded bg-white">
                                    <input type="number" id="batchQty" placeholder="SL" class="text-xs border p-1 rounded font-bold bg-white">
                                </div>
                                <button onclick="InventoryTpl.handleAddBatch('${item.id}')" class="w-full bg-blue-600 text-white text-xs font-bold py-1.5 rounded hover:bg-blue-700">Lưu</button>
                            </div>
                            <div class="border rounded overflow-hidden bg-white"><table class="w-full"><tbody>${batchesHtml}</tbody></table></div>
                        </div>
                        ` : `<div class="mt-4 p-3 bg-orange-50 text-orange-800 text-[10px] rounded text-center border border-orange-100">Lưu thông tin trước khi nhập lô.</div>`}
                    </div>

                    <div class="p-3 bg-white border-t border-[#e0e0e0] flex gap-2 shrink-0">
                        ${isEdit ? `<button onclick="InventoryTpl.deleteItem('${item.id}')" class="px-4 py-2 bg-red-50 text-red-600 rounded-lg font-bold text-xs hover:bg-red-100">Xóa</button>` : ''}
                        <button onclick="InventoryTpl.saveItem('${item.id}')" class="flex-1 px-4 py-2 bg-[#5d4037] text-white rounded-lg font-bold text-sm hover:bg-[#4e342e] shadow-sm">💾 LƯU</button>
                    </div>
                </div>
            </div>
        `;
        
        const old = document.getElementById('itemDetailModal');
        if(old) old.remove();
        document.body.insertAdjacentHTML('beforeend', html);
    },

    // ============================================================
    // LOGIC XỬ LÝ (Controller)
    // ============================================================

    saveItem: async function(existingId) {
        const name = document.getElementById('inpName').value.trim();
        const type = document.getElementById('inpType').value;
        const unit = document.getElementById('inpUnit').value;
        const price = document.getElementById('inpPrice').value;
        const minStock = document.getElementById('inpMinStock').value;

        if(!name) return alert("Vui lòng nhập tên hàng hóa!");

        const data = { name, type, unit, price, minStock };

        if (existingId) {
            await window.Inventory.updateItem(existingId, data);
        } else {
            const newItem = await window.Inventory.addItem(data);
            document.getElementById('itemDetailModal').remove();
            this.openItemModal(newItem.id); 
            return;
        }

        document.getElementById('itemDetailModal').remove();
        this.renderList();
        this.updateTotalValue();
    },

    deleteItem: async function(id) {
        if(confirm("Bạn có chắc chắn muốn xóa mặt hàng này?")) {
            await window.Inventory.deleteItem(id);
            const modal = document.getElementById('itemDetailModal');
            if(modal) modal.remove();
            this.renderList();
            this.updateTotalValue();
        }
    },

    handleAddBatch: async function(itemId) {
        const lotNumber = document.getElementById('batchLot').value;
        const expiryDate = document.getElementById('batchExp').value;
        const quantity = document.getElementById('batchQty').value;
        if(!quantity) return alert("Chưa nhập số lượng!");
        await window.Inventory.addBatch(itemId, { lotNumber, expiryDate, quantity });
        document.getElementById('itemDetailModal').remove();
        this.openItemModal(itemId);
        this.renderList(); 
        this.updateTotalValue();
    },

    deleteBatch: async function(itemId, batchId) {
        if(!confirm("Xóa lô này?")) return;
        await window.Inventory.deleteBatch(itemId, batchId);
        document.getElementById('itemDetailModal').remove();
        this.openItemModal(itemId);
        this.renderList();
        this.updateTotalValue();
    },

    calculateTotalValue: function() {
        return window.Inventory.data.reduce((sum, item) => sum + (item.totalStock * (item.price || 0)), 0);
    },

    updateTotalValue: function() {
        const el = document.getElementById('invTotalValue');
        if(el) el.innerText = this.formatMoney(this.calculateTotalValue());
    },

    formatMoney: function(num) {
        return (num || 0).toLocaleString('vi-VN') + ' ₫';
    }
};
