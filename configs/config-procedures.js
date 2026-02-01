/**
 * FILE: js/config-procedures.js
 * CHỨC NĂNG: Quản lý Cấu hình Thủ thuật (Dịch vụ) và Tứ chẩn (Vọng/Văn/Vấn/Thiết).
 * PHỤ THUỘC: window.config (từ config-core.js), window.Inventory (từ inventory.js)
 */

// ============================================================
// 1. QUẢN LÝ THỦ THUẬT (PROCEDURES)
// ============================================================

window.renderProcSettings = async function() { 
    const l = document.getElementById('procList'); 
    if(!l) return; 

    // Đảm bảo dữ liệu kho đã sẵn sàng để binding
    if(window.Inventory && window.Inventory.init) {
        await window.Inventory.init();
    }
    
    // Lấy danh sách Vật tư y tế (VTYT) từ kho để nạp vào Select box
    // Chúng ta lấy cả 'vtyt', 'dong_duoc', 'tan_duoc' phòng trường hợp dùng thuốc làm thủ thuật (vd: thủy châm)
    // Nhưng ưu tiên VTYT. Ở đây ta lấy tất cả item có trong kho.
    const inventoryItems = window.Inventory ? window.Inventory.data : [];
    
    // Hàm tạo options cho thẻ Select
    const createOptions = (selectedId) => {
        let html = `<option value="">-- Không sử dụng vật tư --</option>`;
        inventoryItems.forEach(item => {
            const isSelected = item.id === selectedId;
            const stockLabel = item.totalStock <= 0 ? '(Hết hàng)' : `(Còn: ${item.totalStock})`;
            html += `<option value="${item.id}" ${isSelected?'selected':''}>${item.name} ${stockLabel}</option>`;
        });
        return html;
    };

    if(!window.config.procs || window.config.procs.length === 0) {
        l.innerHTML = '<div class="text-center text-gray-400 text-xs italic py-2">Chưa có thủ thuật nào</div>';
        return;
    }

    l.innerHTML = window.config.procs.map((p,i) => {
        // Safe access
        const cons = p.consumables || { itemId: "", amount: 0 }; 
        const selectedItem = inventoryItems.find(x => x.id === cons.itemId);
        const isWarning = selectedItem && selectedItem.totalStock < (cons.amount || 1);

        return `
        <div class="flex flex-col p-3 border rounded bg-white mb-2 shadow-sm relative group">
            <div class="flex justify-between items-center mb-2">
                <div class="text-sm font-bold text-[#5d4037]">
                    ${i+1}. ${p.name} 
                    <span class="font-normal text-gray-500 ml-1">(${(p.price||0).toLocaleString()}đ)</span>
                </div>
                <button onclick="window.deleteProc(${i})" class="text-xs px-2 py-1 bg-red-50 rounded text-red-600 hover:bg-red-100 font-bold">Xóa</button>
            </div>
            
            <div class="flex items-center gap-2 bg-gray-50 p-2 rounded border border-dashed border-gray-300">
                <div class="text-[10px] font-bold text-gray-500 uppercase whitespace-nowrap">Tiêu hao:</div>
                
                <select onchange="window.updateProcConsumable(${i}, 'itemId', this.value)" 
                    class="flex-1 text-xs border border-gray-300 rounded px-1 py-1 outline-none focus:border-[#5d4037] bg-white">
                    ${createOptions(cons.itemId)}
                </select>

                <input type="number" value="${cons.amount || 0}" min="0" placeholder="SL"
                    onchange="window.updateProcConsumable(${i}, 'amount', this.value)"
                    class="w-12 text-xs border border-gray-300 rounded px-1 py-1 text-center outline-none focus:border-[#5d4037]">
                
                <span class="text-[10px] text-gray-500">${selectedItem ? selectedItem.unit : ''}</span>
            </div>
            
            ${isWarning ? `<div class="text-[10px] text-red-500 mt-1 italic flex items-center gap-1">⚠️ Cảnh báo: Kho không đủ định mức này!</div>` : ''}
        </div>`;
    }).join(''); 
};

window.addProc = async function() { 
    const n = document.getElementById('newProcName').value.trim(); 
    const p = parseInt(document.getElementById('newProcPrice').value); 
    
    if(n && !isNaN(p)) { 
        // Thêm vào mảng, khởi tạo consumables rỗng
        window.config.procs.push({
            name: n, 
            price: p,
            consumables: { itemId: "", amount: 0 } 
        }); 
        
        // Reset input
        document.getElementById('newProcName').value = ''; 
        document.getElementById('newProcPrice').value = ''; 
        
        // Render lại và Lưu
        await window.renderProcSettings(); 
        if(window.saveConfig) await window.saveConfig(); 
    } else {
        alert("Vui lòng nhập tên và giá thủ thuật hợp lệ.");
    }
};

// Hàm cập nhật cấu hình vật tư cho thủ thuật
window.updateProcConsumable = async function(index, field, value) {
    if (!window.config.procs[index].consumables) {
        window.config.procs[index].consumables = { itemId: "", amount: 0 };
    }

    if (field === 'amount') value = parseFloat(value) || 0;
    
    window.config.procs[index].consumables[field] = value;

    // Auto save
    if(window.saveConfig) await window.saveConfig();
    
    // Render lại để cập nhật cảnh báo tồn kho (nếu cần thiết, hoặc bỏ qua để đỡ giật màn hình)
    // Ở đây ta gọi render lại để update UI trạng thái
    await window.renderProcSettings();
};

window.deleteProc = async function(i) { 
    if(confirm('Bạn có chắc muốn xóa thủ thuật này?')) { 
        window.config.procs.splice(i,1); 
        await window.renderProcSettings(); 
        if(window.saveConfig) await window.saveConfig(); 
    } 
};

// ============================================================
// 2. QUẢN LÝ TỨ CHẨN (FOUR EXAMINATIONS CONFIG)
// ============================================================

window.renderTuChanConfig = function() { 
    // Các key tương ứng với cấu trúc dữ liệu trong window.config.tuChan
    const keys = ['vong', 'van', 'vanhoi', 'thiet', 'thietchan', 'machchan'];
    
    keys.forEach(k => { 
        const c = document.getElementById('setting_list_'+k); 
        if(!c) return; 
        
        const items = window.config.tuChan[k] || [];
        
        if(items.length === 0) {
            c.innerHTML = '<div class="text-xs text-gray-400 italic">Chưa có dữ liệu</div>';
        } else {
            c.innerHTML = items.map((v,i)=>`
                <div class="flex justify-between items-center bg-gray-50 p-2 mb-1 rounded border border-gray-100 group hover:bg-white hover:border-[#d7ccc8] transition-colors">
                    <span class="text-sm text-gray-700">${v}</span>
                    <button onclick="window.deleteTuChanItem('${k}',${i})" class="text-xs text-gray-400 hover:text-red-500 font-bold px-2 py-1 opacity-0 group-hover:opacity-100 transition-opacity">&times;</button>
                </div>`).join(''); 
        }
    }); 
};

window.addTuChanItem = async function(k) { 
    const i = document.getElementById('setting_new_'+k); 
    const v = i.value.trim(); 
    
    if(!v) return; 
    
    // Đảm bảo mảng tồn tại
    if(!window.config.tuChan[k]) window.config.tuChan[k] = []; 
    
    // Thêm và Lưu
    window.config.tuChan[k].push(v); 
    if(window.saveConfig) await window.saveConfig(); 
    
    // Reset input & Render
    i.value = ''; 
    window.renderTuChanConfig(); 
};

window.deleteTuChanItem = async function(k,i) { 
    if(confirm('Xóa mục này?')){ 
        window.config.tuChan[k].splice(i,1); 
        if(window.saveConfig) await window.saveConfig(); 
        window.renderTuChanConfig(); 
    } 
};
