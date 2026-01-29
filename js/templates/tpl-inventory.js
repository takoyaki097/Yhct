/**
 * TEMPLATE GIAO DIỆN QUẢN LÝ KHO
 * Layout: Sidebar trái (Phân loại) - Content phải (Danh sách)
 */

window.InventoryTpl = {
    currentFilter: 'all', // all, dong_duoc, tan_duoc, vtyt

    // Hàm gọi chính để mở Modal Kho
    open: async function() {
        // Đảm bảo dữ liệu mới nhất
        await window.Inventory.init();
        
        const html = `
            <div class="flex h-[70vh] -m-4">
                <div class="w-1/4 min-w-[150px] bg-[#f8f4f0] border-r border-[#d7ccc8] flex flex-col">
                    <div class="p-3 border-b border-[#d7ccc8] bg-[#ece0d1]">
                        <h3 class="font-bold text-[#5d4037] uppercase text-xs">Phân loại</h3>
                    </div>
                    <div class="flex-1 overflow-y-auto p-2 space-y-1">
                        ${this.renderSidebarItem('all', '📦 Tất cả')}
                        ${this.renderSidebarItem('dong_duoc', '🌿 Đông dược')}
                        ${this.renderSidebarItem('tan_duoc', '💊 Tân dược')}
                        ${this.renderSidebarItem('vtyt', '💉 Vật tư y tế')}
                    </div>
                    <div class="p-3 border-t border-[#d7ccc8] text-center">
                        <div class="text-[10px] text-gray-500">Tổng vốn tồn kho:</div>
                        <div class="font-mono font-bold text-[#5d4037] text-lg" id="invTotalValue">
                            ${this.formatMoney(this.calculateTotalValue())}
                        </div>
                    </div>
                </div>

                <div class="w-3/4 flex flex-col bg-white">
                    <div class="p-3 border-b border-dashed border-[#d7ccc8] flex gap-2 items-center justify-between">
                        <div class="relative flex-1 max-w-sm">
                            <span class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">🔍</span>
                            <input type="text" id="invSearchInput" onkeyup="InventoryTpl.handleSearch()" 
                                placeholder="Tìm tên thuốc, vật tư..." 
                                class="w-full pl-9 pr-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[#5d4037]">
                        </div>
                        <button onclick="InventoryTpl.openItemModal()" 
                            class="bg-[#5d4037] hover:bg-[#4e342e] text-white px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2 shadow-sm">
                            <span>➕</span> Thêm Mới
                        </button>
                    </div>

                    <div class="grid grid-cols-12 gap-2 px-4 py-2 bg-[#fdfbf7] text-[10px] font-bold text-gray-500 uppercase tracking-wider border-b">
                        <div class="col-span-5">Tên hàng hóa</div>
                        <div class="col-span-2 text-center">Đơn vị</div>
                        <div class="col-span-2 text-center">Tồn kho</div>
                        <div class="col-span-3 text-right">Thao tác</div>
                    </div>

                    <div id="invListContainer" class="flex-1 overflow-y-auto p-2 space-y-1">
                        </div>
                </div>
            </div>
        `;

        // Sử dụng UIHelper để hiện Modal (giả định hàm này có sẵn trong project của bạn)
        // Nếu project dùng cách khác, bạn hãy chỉnh lại phần này.
        if (window.UIHelper && window.UIHelper.showModal) {
            window.UIHelper.showModal("Quản Lý Kho & Vật Tư", html);
        } else {
            // Fallback nếu chưa có hàm showModal chuẩn
            document.body.insertAdjacentHTML('beforeend', `
                <div id="tempInvModal" class="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
                    <div class="bg-white w-[90%] max-w-5xl rounded-xl shadow-2xl overflow-hidden animate-fade-in relative">
                        <button onclick="document.getElementById('tempInvModal').remove()" class="absolute top-2 right-2 text-2xl text-gray-500 hover:text-red-500">&times;</button>
                        <div class="p-4 bg-[#5d4037] text-white font-bold text-lg">Quản Lý Kho</div>
                        <div class="p-0">${html}</div>
                    </div>
                </div>
            `);
        }

        // Render lần đầu
        this.renderList();
    },

    // Render 1 nút trong sidebar
    renderSidebarItem: function(type, label) {
        const isActive = this.currentFilter === type;
        const activeClass = isActive ? 'bg-[#5d4037] text-white shadow-md' : 'hover:bg-[#d7ccc8]/30 text-[#5d4037]';
        return `
            <button onclick="InventoryTpl.switchFilter('${type}')" 
                class="w-full text-left px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${activeClass}">
                ${label}
            </button>
        `;
    },

    // Chuyển tab lọc
    switchFilter: function(type) {
        this.currentFilter = type;
        // Re-open để render lại cả sidebar (để update active state) và list
        // Hoặc tối ưu hơn là chỉ update class và gọi renderList
        // Ở đây ta đóng modal hiện tại và mở lại hoặc dùng DOM update. 
        // Để đơn giản ta update DOM trực tiếp:
        document.querySelectorAll('#tempInvModal button[onclick^="InventoryTpl.switchFilter"]').forEach(btn => {
            if(btn.textContent.includes(type === 'all' ? 'Tất cả' : (type==='dong_duoc'?'Đông dược':(type==='tan_duoc'?'Tân dược':'Vật tư')))) {
                btn.className = "w-full text-left px-3 py-2.5 rounded-lg text-sm font-medium transition-all bg-[#5d4037] text-white shadow-md";
            } else {
                btn.className = "w-full text-left px-3 py-2.5 rounded-lg text-sm font-medium transition-all hover:bg-[#d7ccc8]/30 text-[#5d4037]";
            }
        });
        
        // Cập nhật lại giao diện Sidebar nếu cần thiết (phức tạp), ở đây ta chỉ cần renderList lại
        const sidebar = document.querySelector('.w-1\\/4'); // Hacky selector, better to re-render whole content
        if(sidebar) sidebar.innerHTML = sidebar.innerHTML; // Force redraw if needed, but logic above manages classes.
        
        // Cách tốt nhất: Gọi lại renderSidebarItem logic vào 1 hàm updateSidebar, nhưng để đơn giản:
        // Ta đóng và mở lại nội dung body modal (nếu muốn nhanh)
        // Nhưng tốt nhất là render lại list:
        this.renderList();
        
        // Update lại class visual cho sidebar (manual fix cho mượt)
        // (Code phía trên đã xử lý class cơ bản)
    },

    // Render danh sách item
    renderList: function() {
        const container = document.getElementById('invListContainer');
        if (!container) return;

        const keyword = document.getElementById('invSearchInput')?.value || '';
        const items = window.Inventory.search(keyword, this.currentFilter);

        if (items.length === 0) {
            container.innerHTML = `<div class="text-center p-10 text-gray-400 italic">Không tìm thấy mặt hàng nào.</div>`;
            return;
        }

        container.innerHTML = items.map(item => {
            // Check cảnh báo
            const isLowStock = item.totalStock <= item.minStock;
            const stockClass = isLowStock ? 'text-red-600 font-bold' : 'text-[#3e2723]';
            const batchesCount = item.batches ? item.batches.length : 0;
            
            // Icon loại
            let typeIcon = '📦';
            if(item.type === 'dong_duoc') typeIcon = '🌿';
            if(item.type === 'tan_duoc') typeIcon = '💊';
            if(item.type === 'vtyt') typeIcon = '💉';

            return `
                <div class="grid grid-cols-12 gap-2 px-4 py-3 bg-white border border-gray-100 rounded-lg hover:shadow-md transition-all items-center group">
                    <div class="col-span-5">
                        <div class="font-bold text-[#3e2723] truncate flex items-center gap-2">
                            <span class="text-base">${typeIcon}</span> ${item.name}
                        </div>
                        <div class="text-[10px] text-gray-500 flex gap-2">
                            <span>Lô: ${batchesCount}</span> | 
                            <span>Giá vốn: ${this.formatMoney(item.price)}</span>
                        </div>
                    </div>
                    <div class="col-span-2 text-center text-sm bg-gray-50 py-1 rounded text-gray-600">
                        ${item.unit}
                    </div>
                    <div class="col-span-2 text-center text-base ${stockClass}">
                        ${item.totalStock}
                    </div>
                    <div class="col-span-3 text-right opacity-0 group-hover:opacity-100 transition-opacity flex justify-end gap-1">
                        <button onclick="InventoryTpl.openItemModal('${item.id}')" class="p-1.5 hover:bg-blue-50 text-blue-600 rounded" title="Sửa / Nhập Lô">
                            ✏️
                        </button>
                        <button onclick="InventoryTpl.deleteItem('${item.id}')" class="p-1.5 hover:bg-red-50 text-red-600 rounded" title="Xóa">
                            🗑️
                        </button>
                    </div>
                </div>
            `;
        }).join('');
    },

    handleSearch: function() {
        // Debounce simple
        if(this.debounceTimer) clearTimeout(this.debounceTimer);
        this.debounceTimer = setTimeout(() => {
            this.renderList();
        }, 300);
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

        // Render danh sách lô hàng (nếu đang sửa)
        let batchesHtml = '';
        if (isEdit && item.batches) {
            batchesHtml = item.batches.map(b => `
                <tr class="border-b border-gray-100 text-sm">
                    <td class="py-2 px-2 font-mono">${b.lotNumber}</td>
                    <td class="py-2 px-2 text-center">${b.expiryDate || '-'}</td>
                    <td class="py-2 px-2 text-right font-bold">${b.quantity}</td>
                    <td class="py-2 px-2 text-right">
                        <button onclick="InventoryTpl.deleteBatch('${item.id}', '${b.id}')" class="text-red-500 hover:text-red-700 text-xs">Xóa</button>
                    </td>
                </tr>
            `).join('');
        }
        if (!batchesHtml) batchesHtml = `<tr><td colspan="4" class="text-center py-4 text-xs text-gray-400">Chưa có lô hàng nào.</td></tr>`;

        const html = `
            <div class="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 backdrop-blur-sm" id="itemDetailModal">
                <div class="bg-white w-[95%] max-w-2xl rounded-xl shadow-2xl overflow-hidden animate-pop-in">
                    <div class="bg-[#5d4037] text-white px-6 py-4 flex justify-between items-center">
                        <h3 class="font-bold text-lg">${isEdit ? '✏️ Cập Nhật Hàng Hóa' : '➕ Thêm Hàng Hóa Mới'}</h3>
                        <button onclick="document.getElementById('itemDetailModal').remove()" class="text-white/70 hover:text-white text-2xl">&times;</button>
                    </div>
                    
                    <div class="p-6 overflow-y-auto max-h-[80vh]">
                        <div class="grid grid-cols-2 gap-4 mb-6">
                            <div class="col-span-2 md:col-span-1">
                                <label class="block text-xs font-bold text-gray-500 uppercase mb-1">Tên hàng hóa</label>
                                <input type="text" id="inpName" value="${item.name}" class="w-full border border-gray-300 rounded p-2 focus:border-[#5d4037] outline-none font-bold text-[#3e2723]">
                            </div>
                            <div class="col-span-2 md:col-span-1">
                                <label class="block text-xs font-bold text-gray-500 uppercase mb-1">Phân loại</label>
                                <select id="inpType" class="w-full border border-gray-300 rounded p-2 focus:border-[#5d4037] outline-none">
                                    <option value="vtyt" ${item.type==='vtyt'?'selected':''}>💉 Vật tư y tế</option>
                                    <option value="dong_duoc" ${item.type==='dong_duoc'?'selected':''}>🌿 Đông dược</option>
                                    <option value="tan_duoc" ${item.type==='tan_duoc'?'selected':''}>💊 Tân dược</option>
                                </select>
                            </div>
                            <div>
                                <label class="block text-xs font-bold text-gray-500 uppercase mb-1">Đơn vị tính</label>
                                <input type="text" id="inpUnit" value="${item.unit}" list="unitList" class="w-full border border-gray-300 rounded p-2 outline-none">
                                <datalist id="unitList"><option value="Cái"><option value="Hộp"><option value="Gói"><option value="Gram"><option value="Chai"></datalist>
                            </div>
                            <div>
                                <label class="block text-xs font-bold text-gray-500 uppercase mb-1">Giá vốn (VNĐ)</label>
                                <input type="number" id="inpPrice" value="${item.price}" class="w-full border border-gray-300 rounded p-2 outline-none">
                            </div>
                            <div>
                                <label class="block text-xs font-bold text-gray-500 uppercase mb-1">Cảnh báo khi tồn dưới</label>
                                <input type="number" id="inpMinStock" value="${item.minStock}" class="w-full border border-gray-300 rounded p-2 outline-none">
                            </div>
                        </div>

                        ${isEdit ? `
                        <div class="border-t pt-4">
                            <div class="flex justify-between items-center mb-2">
                                <h4 class="font-bold text-[#5d4037]">📦 Danh sách Lô hàng (Batches)</h4>
                                <button onclick="document.getElementById('addBatchForm').classList.toggle('hidden')" 
                                    class="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded hover:bg-blue-200">
                                    + Nhập lô
                                </button>
                            </div>
                            
                            <div id="addBatchForm" class="hidden bg-gray-50 p-3 rounded mb-3 border border-blue-100">
                                <div class="grid grid-cols-3 gap-2 mb-2">
                                    <input type="text" id="batchLot" placeholder="Số lô (VD: A01)" class="text-sm border p-1 rounded">
                                    <input type="date" id="batchExp" class="text-sm border p-1 rounded">
                                    <input type="number" id="batchQty" placeholder="Số lượng" class="text-sm border p-1 rounded">
                                </div>
                                <button onclick="InventoryTpl.handleAddBatch('${item.id}')" class="w-full bg-blue-600 text-white text-xs py-2 rounded hover:bg-blue-700">Lưu Lô Mới</button>
                            </div>

                            <div class="border rounded overflow-hidden">
                                <table class="w-full">
                                    <thead class="bg-gray-100 text-xs text-gray-500 uppercase">
                                        <tr>
                                            <th class="py-2 px-2 text-left">Số lô</th>
                                            <th class="py-2 px-2 text-center">Hạn dùng</th>
                                            <th class="py-2 px-2 text-right">Tồn</th>
                                            <th class="py-2 px-2"></th>
                                        </tr>
                                    </thead>
                                    <tbody>${batchesHtml}</tbody>
                                </table>
                            </div>
                        </div>
                        ` : `<div class="p-4 bg-orange-50 text-orange-800 text-xs rounded border border-orange-100 text-center">
                                Bạn cần lưu thông tin chung trước khi nhập lô hàng.
                             </div>`
                        }
                    </div>

                    <div class="p-4 bg-gray-50 border-t flex justify-end gap-3">
                        <button onclick="document.getElementById('itemDetailModal').remove()" class="px-4 py-2 text-gray-600 hover:bg-gray-200 rounded text-sm">Hủy</button>
                        <button onclick="InventoryTpl.saveItem('${item.id}')" class="px-6 py-2 bg-[#5d4037] text-white rounded font-bold shadow hover:bg-[#4e342e]">
                            💾 Lưu Thông Tin
                        </button>
                    </div>
                </div>
            </div>
        `;
        
        document.body.insertAdjacentHTML('beforeend', html);
    },

    // ============================================================
    // LOGIC XỬ LÝ (Controller)
    // ============================================================

    saveItem: async function(existingId) {
        const name = document.getElementById('inpName').value;
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
            // Sau khi add xong thì đóng và mở lại ngay để nhập lô nếu muốn
            document.getElementById('itemDetailModal').remove();
            this.openItemModal(newItem.id); // Re-open as edit mode
            return;
        }

        document.getElementById('itemDetailModal').remove();
        this.renderList();
        this.updateTotalValue();
    },

    deleteItem: async function(id) {
        if(await window.Inventory.deleteItem(id)) {
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
        
        // Refresh modal bằng cách đóng mở lại (hơi thô nhưng an toàn)
        document.getElementById('itemDetailModal').remove();
        this.openItemModal(itemId);
        this.renderList(); // Update background list
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

    // Tính tổng giá trị kho
    calculateTotalValue: function() {
        return window.Inventory.data.reduce((sum, item) => {
            return sum + (item.totalStock * item.price);
        }, 0);
    },

    updateTotalValue: function() {
        const el = document.getElementById('invTotalValue');
        if(el) el.innerText = this.formatMoney(this.calculateTotalValue());
    },

    formatMoney: function(num) {
        return (num || 0).toLocaleString('vi-VN') + ' ₫';
    }
};
