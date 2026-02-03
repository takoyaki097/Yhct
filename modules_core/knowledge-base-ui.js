/**
 * FILE: modules_core/knowledge-base-ui.js
 * CHỨC NĂNG: Giao diện Knowledge Base 2.0 (Split View) + AI Thông Minh.
 * CẬP NHẬT: 
 * - Tích hợp cứng nút Thêm/Xóa vào chân trang chi tiết (Không cần file bridge).
 * - Hiển thị full tên huyệt (Mã + Tên) trong bảng AI Tí Ngọ.
 */

window.KnowledgeUI = {
    state: { mode: 'view', type: 'herb', selectedId: null, filterGroup: 'all', searchTerm: '' },
    tempData: {},

    // --- CÁC HÀM CƠ BẢN ---
    open: function(type = 'herb') {
        this.state.type = type;
        this.state.mode = 'view';
        this.state.selectedId = null;
        this.state.filterGroup = 'all';
        this.state.searchTerm = '';
        this.renderModalStructure();
        this.renderSidebar();
        this.renderRightPanel(null); 
        document.getElementById('kbModal').classList.add('active');
    },

    close: function() {
        document.getElementById('kbModal').classList.remove('active');
        // Refresh lại dữ liệu bên ngoài khi đóng
        if(window.renderMedList) { window.renderMedList('east'); window.renderMedList('west'); }
        if(window.renderSelectedAcupoints) window.renderSelectedAcupoints();
        if(window.refreshAiSuggestion) window.refreshAiSuggestion(false);
    },

    getAllItems: function() {
        let items = [];
        const type = this.state.type;
        if (type === 'herb' && window.knowledge?.herbsDB) items = [...window.knowledge.herbsDB];
        else if (type === 'acu' && window.knowledge?.acupoints) items = [...window.knowledge.acupoints];
        else if (type === 'west' && window.knowledge?.westDB) items = [...window.knowledge.westDB];

        if (!window.config.userKnowledge) window.config.userKnowledge = { herbs: [], west: [], acu: [] };
        let userItems = type === 'herb' ? window.config.userKnowledge.herbs : (type === 'west' ? window.config.userKnowledge.west : window.config.userKnowledge.acu) || [];

        const combinedMap = new Map();
        items.forEach(i => combinedMap.set(i.id || ('sys_'+i.name), { ...i, id: i.id || ('sys_'+i.name), isSystem: true }));
        userItems.forEach(i => combinedMap.set(i.id, { ...i, isUser: true }));
        
        return Array.from(combinedMap.values());
    },

    getItem: function(idOrName) { 
        const all = this.getAllItems();
        return all.find(i => i.id === idOrName) || all.find(i => i.name === idOrName);
    },

    getGroups: function() {
        const groups = new Set();
        this.getAllItems().forEach(i => {
            let g = this.state.type === 'herb' ? (i.category || i.group) : (this.state.type === 'acu' ? (i.meridian || i.group) : i.group);
            if (g) groups.add(g);
        });
        return Array.from(groups).sort();
    },

    // --- RENDER KHUNG MODAL ---
    renderModalStructure: function() {
        if (!document.getElementById('kbModal')) {
            const html = `
            <div id="kbModal" class="modal" style="z-index: 3000;">
                <div class="modal-box w-full max-w-6xl h-[90vh] flex flex-col p-0 bg-[#fdfbf7] overflow-hidden">
                    <div class="modal-header bg-[#efebe9] border-b border-[#d7ccc8] px-4 py-3 flex justify-between items-center shadow-sm shrink-0 z-10">
                        <div class="flex items-center gap-3">
                            <div class="w-10 h-10 rounded-full bg-[#5d4037] text-white flex items-center justify-center text-xl shadow-inner" id="kbHeaderIcon">📚</div>
                            <div>
                                <h2 class="font-bold text-lg text-[#3e2723] uppercase leading-tight" id="kbHeaderTitle">Thư Viện</h2>
                                <p class="text-[10px] text-[#5d4037] opacity-70">Hệ thống Tra cứu & AI Hỗ trợ</p>
                            </div>
                        </div>
                        <button onclick="window.KnowledgeUI.close()" class="w-8 h-8 rounded-full flex items-center justify-center text-gray-500 hover:bg-red-50 hover:text-red-500 transition-colors text-xl font-bold">&times;</button>
                    </div>
                    
                    <div class="flex flex-1 overflow-hidden">
                        <div class="w-1/3 md:w-[320px] border-r border-[#e0e0e0] flex flex-col bg-white flex-shrink-0 z-10">
                            <div class="p-3 border-b border-[#f0f0f0] bg-[#faf8f5] space-y-2">
                                <button onclick="window.KnowledgeUI.startAdd()" class="w-full py-2 bg-[#5d4037] text-white rounded-lg text-xs font-bold shadow-sm hover:bg-[#4e342e] flex items-center justify-center gap-2 active:scale-95 transition-transform">
                                    <span>➕</span> THÊM MỚI
                                </button>
                                <div class="relative group">
                                    <span class="absolute left-3 top-2.5 text-gray-400 text-xs">🔍</span>
                                    <input type="text" id="kbSearch" onkeyup="window.KnowledgeUI.renderSidebar()" placeholder="Tìm kiếm..." class="w-full pl-8 pr-3 py-2 rounded-xl border border-[#d7ccc8] bg-white text-sm text-[#3e2723] focus:border-[#5d4037] outline-none transition-all shadow-sm">
                                </div>
                                <select id="kbGroupFilter" onchange="window.KnowledgeUI.renderSidebar()" class="w-full py-1.5 px-2 rounded-lg border border-[#eee] text-xs font-bold text-[#5d4037] bg-white outline-none cursor-pointer"></select>
                            </div>
                            <div class="flex-1 overflow-y-auto p-2 space-y-1 custom-scrollbar bg-[#ffffff]" id="kbListContainer"></div>
                        </div>
                        
                        <div class="flex-1 bg-[#fffcf7] relative overflow-y-auto custom-scrollbar flex flex-col" id="kbRightPanel"></div>
                    </div>
                </div>
            </div>`;
            document.body.insertAdjacentHTML('beforeend', html);
        }
        
        const icons = { herb: '🌿', west: '💊', acu: '⚡' };
        const titles = { herb: 'Đông Dược', west: 'Thuốc Tây', acu: 'Huyệt Vị & Thời Châm' };
        document.getElementById('kbHeaderIcon').innerText = icons[this.state.type];
        document.getElementById('kbHeaderTitle').innerText = titles[this.state.type];
    },

    renderSidebar: function() {
        const container = document.getElementById('kbListContainer');
        this.state.searchTerm = document.getElementById('kbSearch')?.value || '';
        this.state.filterGroup = document.getElementById('kbGroupFilter')?.value || 'all';
        
        const items = this.getAllItems();
        
        const groupSelect = document.getElementById('kbGroupFilter');
        if (groupSelect && groupSelect.children.length <= 1) {
             const groups = this.getGroups();
             groupSelect.innerHTML = `<option value="all">📂 Tất cả nhóm (${items.length})</option>` + 
                groups.map(g => `<option value="${g}">${g}</option>`).join('');
        }

        const filtered = items.filter(i => {
            const iGroup = (this.state.type === 'herb' ? (i.category || i.group) : (this.state.type === 'acu' ? (i.meridian || i.group) : i.group)) || '';
            const matchGroup = this.state.filterGroup === 'all' || iGroup === this.state.filterGroup;
            const kw = this.state.searchTerm.toLowerCase();
            const matchSearch = !kw || (i.name && i.name.toLowerCase().includes(kw));
            return matchGroup && matchSearch;
        });

        if (filtered.length === 0) {
            container.innerHTML = `<div class="text-center py-10 text-gray-400 text-xs italic">Không tìm thấy dữ liệu.</div>`;
            return;
        }

        container.innerHTML = filtered.map(i => {
            const isActive = this.state.selectedId === i.id;
            const bgClass = isActive ? 'bg-[#5d4037] text-white shadow-md border-transparent' : 'bg-white text-[#3e2723] hover:bg-[#efebe9] border-[#e0e0e0]';
            const subText = (this.state.type === 'herb' ? (i.category || i.group) : (this.state.type === 'acu' ? (i.meridian || i.group) : i.group)) || 'Chưa phân nhóm';
            
            let isAdded = false;
            if (this.state.type === 'herb') isAdded = window.currentVisit.rxEast.some(x => x.name === i.name);
            else if (this.state.type === 'west') isAdded = window.currentVisit.rxWest.some(x => x.name === i.name);
            else if (this.state.type === 'acu') isAdded = window.currentVisit.acupoints.some(x => x.id === i.id);

            return `
            <div onclick="window.KnowledgeUI.selectItem('${i.id}')" class="p-3 mb-1 rounded-xl border cursor-pointer transition-all duration-200 group ${bgClass}">
                <div class="font-bold text-sm leading-tight mb-1 flex justify-between items-start">
                    <span>${i.name}</span>
                    ${isAdded ? '<span class="text-[10px] bg-green-500 text-white px-1.5 rounded-full shadow-sm">✓</span>' : (i.image ? '<span class="text-[10px] opacity-70">📷</span>' : '')}
                </div>
                <div class="text-[10px] opacity-70 truncate flex justify-between">
                    <span>${subText}</span>
                    ${isActive ? '<span>●</span>' : ''}
                </div>
            </div>`;
        }).join('');
    },

    selectItem: function(id) {
        this.state.selectedId = id;
        this.state.mode = 'view';
        this.renderSidebar(); 
        this.renderRightPanel(id); 
    },

    // --- AI PANEL (ĐÃ NÂNG CẤP FULL TÊN + NÚT BẤM) ---
    _getAiPanelHtml: function(currentItem = null) {
        let showAi = false;
        let aiContent = '';

        // HELPER TẠO NÚT BẤM
        const createToggleBtn = (type, rawId, context = '') => {
            let isSelected = false;
            let onClickFn = "";
            let cleanId = rawId; 
            let suffix = "";

            if (rawId.includes('(')) {
                cleanId = rawId.split(' ')[0];
                suffix = rawId.substring(rawId.indexOf('('));
            }

            // Tự động tìm tên đầy đủ
            let displayName = cleanId;
            let itemObj = this.getItem(cleanId);
            if (itemObj) displayName = `${cleanId} - ${itemObj.name}`;
            
            // Thêm hậu tố (Tỉnh, Huỳnh...) nếu có
            if (suffix) displayName += ` <span class="opacity-70 text-[9px]">${suffix}</span>`;

            // Logic kiểm tra đã chọn hay chưa
            if (type === 'point') {
                isSelected = window.currentVisit.acupoints.some(p => p.id === cleanId);
                onClickFn = `window.KnowledgeBridge.toggleItem('${cleanId}', 'point')`;
            } else if (type === 'herb') {
                isSelected = window.currentVisit.rxEast.some(h => h.name.toLowerCase() === cleanId.toLowerCase());
                onClickFn = `window.KnowledgeBridge.toggleItem('${cleanId}', 'herb')`;
            } else if (type === 'west') {
                isSelected = window.currentVisit.rxWest.some(w => w.name.toLowerCase() === cleanId.toLowerCase());
                onClickFn = `window.KnowledgeBridge.toggleItem('${cleanId}', 'west')`;
            }

            // Render nút bấm
            if (isSelected) {
                return `<button onclick="${onClickFn}" class="mb-1 mr-1 px-3 py-1.5 rounded-lg text-xs font-bold border flex items-center gap-2 transition-all bg-green-600 text-white border-green-700 shadow-md hover:bg-green-700 active:scale-95 w-full text-left justify-between">
                    <span>${displayName}</span> <span class="bg-white/20 px-1.5 rounded text-[10px]">✓</span>
                </button>`;
            } else {
                return `<button onclick="${onClickFn}" class="mb-1 mr-1 px-3 py-1.5 rounded-lg text-xs font-bold border flex items-center gap-2 transition-all bg-white border-gray-300 text-gray-700 hover:bg-[#5d4037] hover:text-white hover:border-[#5d4037] shadow-sm active:scale-95 w-full text-left justify-between">
                    <span>${displayName}</span> <span class="opacity-50 text-[10px]">+</span>
                </button>`;
            }
        };

        // 1. AI TÍ NGỌ (Real-time Clock)
        if (this.state.type === 'acu') {
            const timeFlow = window.knowledge.ziWuFlow ? window.knowledge.ziWuFlow.getCurrentAnalysis() : null;
            if (timeFlow) {
                showAi = true;
                const renderRow = (label, points) => {
                    if (!points) return '';
                    const arr = Array.isArray(points) ? points : [points];
                    return `<div class="mb-2"><div class="text-[10px] font-bold text-gray-500 uppercase mb-1">${label}</div><div class="grid grid-cols-1 gap-1">${arr.map(p => createToggleBtn('point', p)).join('')}</div></div>`;
                };

                aiContent += `
                <div class="mb-4 bg-white border border-[#d7ccc8] rounded-xl shadow-sm overflow-hidden">
                    <div class="bg-[#efebe9] px-3 py-2 border-b border-[#d7ccc8] flex justify-between items-center">
                        <h3 class="font-bold text-[#5d4037] text-xs uppercase flex items-center gap-1"><span>☯️</span> Thời Châm (Real-time)</h3>
                        <span class="text-[9px] bg-white px-2 py-0.5 rounded text-[#5d4037] border border-[#d7ccc8]">${timeFlow.timeInfo}</span>
                    </div>
                    <div class="p-3 grid grid-cols-1 md:grid-cols-2 gap-3">
                        <div class="bg-[#f1f8e9] p-3 rounded-lg border border-[#c5e1a5]">
                            <div class="text-[10px] font-bold text-[#2e7d32] uppercase mb-2 border-b border-[#a5d6a7] pb-1">1. Nạp Tử (Theo Giờ)</div>
                            <div class="text-xs font-bold text-[#1b5e20] mb-2">Vượng: Kinh ${timeFlow.naZi ? timeFlow.naZi.meridian : '...'}</div>
                            ${timeFlow.naZi ? `
                                ${renderRow('🌟 Huyệt Khai (Chủ)', timeFlow.naZi.horary)}
                                <div class="grid grid-cols-2 gap-2">
                                    ${renderRow('Hư Bổ (Mẹ)', timeFlow.naZi.tonify)}
                                    ${renderRow('Thực Tả (Con)', timeFlow.naZi.sedate)}
                                </div>
                                ${renderRow('Huyệt Nguyên', timeFlow.naZi.source)}
                            ` : 'Đang tính toán...'}
                        </div>
                        <div class="bg-[#fff3e0] p-3 rounded-lg border border-[#ffe0b2]">
                            <div class="text-[10px] font-bold text-[#ef6c00] uppercase mb-2 border-b border-[#ffcc80] pb-1">2. Nạp Giáp (Theo Ngày)</div>
                            <div class="text-xs font-bold text-[#e65100] mb-2">Can: ${timeFlow.naJia ? timeFlow.naJia.stem : '...'} ➤ Mở: ${timeFlow.naJia ? timeFlow.naJia.meridian : '...'}</div>
                            ${timeFlow.naJia ? renderRow('Các huyệt mở', timeFlow.naJia.points) : 'Không có huyệt mở.'}
                        </div>
                    </div>
                </div>`;
            }
        }

        // 2. AI GỢI Ý TRIỆU CHỨNG
        const symptomInput = document.getElementById('vSpecial');
        const visitSymptoms = symptomInput ? symptomInput.value : '';
        const tuChan = window.currentVisit.tuChan || {};
        
        let analysis = null;
        if (window.knowledge && window.knowledge.analyze) {
            analysis = window.knowledge.analyze(visitSymptoms, tuChan);
        }

        if (analysis) {
            const createSmallToggle = (type, id) => {
                let displayName = id;
                let itemObj = this.getItem(id);
                if(itemObj) displayName = itemObj.name;
                
                let isSelected = false;
                let onClickFn = "";
                if (type === 'point') {
                    isSelected = window.currentVisit.acupoints.some(p => p.id === id);
                    onClickFn = `window.KnowledgeBridge.toggleItem('${id}', 'point')`;
                    displayName = id + " " + displayName; 
                } else if (type === 'herb') {
                    isSelected = window.currentVisit.rxEast.some(h => h.name.toLowerCase() === id.toLowerCase());
                    onClickFn = `window.KnowledgeBridge.toggleItem('${id}', 'herb')`;
                } else if (type === 'west') {
                    isSelected = window.currentVisit.rxWest.some(w => w.name.toLowerCase() === id.toLowerCase());
                    onClickFn = `window.KnowledgeBridge.toggleItem('${id}', 'west')`;
                }

                if (isSelected) return `<button onclick="${onClickFn}" class="px-2 py-1 bg-green-600 text-white rounded text-xs font-bold mr-1 mb-1 border border-green-700 shadow-sm">✓ ${displayName}</button>`;
                return `<button onclick="${onClickFn}" class="px-2 py-1 bg-white text-gray-700 rounded text-xs border border-gray-300 mr-1 mb-1 hover:bg-[#5d4037] hover:text-white shadow-sm">+ ${displayName}</button>`;
            };

            let suggestHtml = '';
            if (this.state.type === 'herb' && analysis.herbs.length > 0) {
                suggestHtml = `<div class="flex flex-wrap">${analysis.herbs.map(h => createSmallToggle('herb', h)).join('')}</div>`;
            } else if (this.state.type === 'west' && analysis.west.length > 0) {
                suggestHtml = `<div class="flex flex-wrap">${analysis.west.map(w => createSmallToggle('west', w)).join('')}</div>`;
            } else if (this.state.type === 'acu' && analysis.points.length > 0) {
                suggestHtml = `<div class="flex flex-wrap">${analysis.points.map(id => createSmallToggle('point', id)).join('')}</div>`;
            }

            if (suggestHtml) {
                showAi = true;
                aiContent += `<div class="mb-4 bg-[#e0f7fa] border border-[#b2ebf2] rounded-xl p-3 shadow-sm"><div class="flex items-center gap-2 mb-2 pb-1 border-b border-[#80deea]"><span class="text-lg">💡</span><h4 class="text-xs font-bold text-[#006064] uppercase">Gợi ý theo triệu chứng ${analysis.syndromeFound ? `(${analysis.syndromeFound})` : ''}</h4></div>${suggestHtml}</div>`;
            }
        }

        return showAi ? aiContent : '';
    },

    // --- PANEL CHI TIẾT (VIEW MODE) ---
    renderRightPanel: function(id = null) {
        const container = document.getElementById('kbRightPanel');
        const item = id ? this.getItem(id) : null;
        const aiBoxHtml = this._getAiPanelHtml(item);
        
        let detailHtml = '';
        
        if (item) {
            let info = item.info || {}; 
            const displayGroup = (this.state.type === 'herb' ? (item.category || item.group) : (this.state.type === 'acu' ? (item.meridian || item.group) : item.group)) || 'Chưa phân nhóm';

            // ... (Phần render ảnh và info text giữ nguyên như bản trước) ...
            const imgHtml = item.image 
                ? `<div class="w-full h-64 md:h-80 bg-gray-100 mb-6 rounded-xl overflow-hidden shadow-inner relative group border border-gray-200"><img src="${item.image}" class="w-full h-full object-contain mix-blend-multiply"></div>` 
                : `<div class="w-full h-48 border-2 border-dashed border-[#d7ccc8] rounded-xl flex flex-col items-center justify-center bg-gray-50 relative cursor-pointer hover:bg-gray-100 transition-colors" onclick="document.getElementById('kbImgInput').click()"><span class="text-4xl text-gray-300 mb-2">📷</span><span class="text-xs text-gray-400 font-bold">Chạm để tải ảnh</span><input type="file" id="kbImgInput" accept="image/*" class="hidden" onchange="window.KnowledgeUI.handleImageUpload(this)"></div>`;

            let contentBody = '';
            if (this.state.type === 'herb') {
                contentBody = `<div class="grid grid-cols-2 gap-4 mb-4"><div class="bg-orange-50 p-3 rounded-lg border border-orange-100"><span class="block text-[10px] font-bold text-orange-400 uppercase">Tính Vị</span><div class="font-bold text-[#5d4037] text-sm">${info.tinh_vi || '---'}</div></div><div class="bg-blue-50 p-3 rounded-lg border border-blue-100"><span class="block text-[10px] font-bold text-blue-600 uppercase">Quy Kinh</span><div class="font-bold text-blue-900 text-sm">${info.quy_kinh || '---'}</div></div></div><div class="bg-green-50 p-3 rounded-lg border border-green-100 mb-4 flex items-center justify-between"><span class="text-[10px] font-bold text-green-600 uppercase">Liều lượng</span><div class="font-black text-green-800 text-base">${info.lieu_luong || '---'}</div></div><div class="space-y-4"><div class="group"><h4 class="text-xs font-bold text-[#8d6e63] uppercase border-b border-dashed border-[#d7ccc8] pb-1 mb-2">Công Năng & Chủ Trị</h4><p class="text-sm text-[#3e2723] bg-white p-4 rounded-xl border border-[#eee] shadow-sm text-justify leading-relaxed">${info.cong_nang || item.function || '...'}</p></div>${info.phoi_hop ? `<div class="group"><h4 class="text-xs font-bold text-indigo-500 uppercase border-b border-dashed border-indigo-100 pb-1 mb-2">Phối Hợp</h4><p class="text-sm text-[#3e2723] bg-indigo-50 p-4 rounded-xl border border-indigo-100 text-justify">${info.phoi_hop}</p></div>` : ''}${info.kieng_ky ? `<div class="group"><h4 class="text-xs font-bold text-red-500 uppercase border-b border-dashed border-red-200 pb-1 mb-2">Kiêng Kỵ</h4><p class="text-sm text-red-800 bg-red-50 p-4 rounded-xl border border-red-100 text-justify font-medium">${info.kieng_ky}</p></div>` : ''}</div>`;
            } else if (this.state.type === 'west') {
                contentBody = `<div class="bg-blue-50 p-4 rounded-xl border border-blue-100 mb-4 shadow-sm"><span class="block text-[10px] font-bold text-blue-600 uppercase mb-1">Chỉ Định Điều Trị</span><div class="font-bold text-blue-900 text-sm leading-relaxed">${info.chi_dinh || '...'}</div></div><div class="grid grid-cols-2 gap-4 mb-4"><div class="bg-gray-50 p-3 rounded-lg border border-gray-200"><label class="text-[10px] font-bold text-gray-500 uppercase block">Liều dùng</label><div class="text-sm font-bold text-[#3e2723]">${info.lieu_luong || '...'}</div></div><div class="bg-gray-50 p-3 rounded-lg border border-gray-200"><label class="text-[10px] font-bold text-gray-500 uppercase block">Đường dùng</label><div class="text-sm font-bold text-[#3e2723]">${info.duong_dung || 'Uống'}</div></div></div><div class="space-y-4">${info.chong_chi_dinh ? `<div class="group"><h4 class="text-xs font-bold text-red-600 uppercase border-b border-dashed border-red-200 pb-1 mb-2">⛔ Chống Chỉ Định</h4><div class="text-sm text-red-700 bg-red-50 p-3 rounded-xl border border-red-100 font-medium">${info.chong_chi_dinh}</div></div>` : ''}${info.tuong_tac ? `<div class="group"><h4 class="text-xs font-bold text-orange-600 uppercase border-b border-dashed border-orange-200 pb-1 mb-2">⚠️ Tương Tác Thuốc</h4><div class="text-sm text-orange-900 bg-orange-50 p-3 rounded-xl border border-orange-100 italic">${info.tuong_tac}</div></div>` : ''}${info.tac_dung_phu ? `<div class="group"><h4 class="text-xs font-bold text-gray-500 uppercase border-b border-dashed border-gray-300 pb-1 mb-2">Tác Dụng Phụ</h4><div class="text-sm text-gray-600 bg-white p-3 rounded-xl border border-gray-200">${info.tac_dung_phu}</div></div>` : ''}</div>`;
            } else if (this.state.type === 'acu') {
                contentBody = `<div class="bg-[#f2ebe0] p-4 rounded-xl border border-[#d7ccc8] mb-4 shadow-sm"><span class="block text-[10px] font-bold text-[#8d6e63] uppercase">Vị trí</span><div class="text-sm text-[#3e2723] mt-1 font-medium text-justify">${info.vi_tri || 'Đang cập nhật vị trí...'}</div></div><div class="group"><h4 class="text-xs font-bold text-[#8d6e63] uppercase border-b border-dashed border-[#d7ccc8] pb-1 mb-2">Tác Dụng & Chủ Trị</h4><p class="text-sm text-[#3e2723] bg-white p-4 rounded-xl border border-[#eee] text-justify leading-relaxed"><b>Tác dụng:</b> ${item.function || info.tac_dung || ''}<br/><br/><b>Chủ trị:</b> ${item.indications || info.chu_tri || ''}</p></div>`;
            }

            // --- [QUAN TRỌNG] NÚT STICKY FOOTER TÍCH HỢP SẴN ---
            let isAdded = false;
            if (this.state.type === 'herb') isAdded = window.currentVisit.rxEast.some(x => x.name.toLowerCase() === item.name.toLowerCase());
            else if (this.state.type === 'west') isAdded = window.currentVisit.rxWest.some(x => x.name.toLowerCase() === item.name.toLowerCase());
            else if (this.state.type === 'acu') isAdded = window.currentVisit.acupoints.some(x => x.id === item.id);

            const btnClass = isAdded ? 'bg-red-600 border-red-700 hover:bg-red-700' : 'bg-[#5d4037] border-[#3e2723] hover:bg-[#4e342e]';
            const btnLabel = isAdded ? 'XÓA KHỎI ĐƠN' : 'THÊM VÀO ĐƠN';
            const btnIcon = isAdded ? '🗑️' : '✅';
            const action = `window.KnowledgeBridge.toggleItem('${item.id || item.name}', '${this.state.type}')`;

            detailHtml = `
                <div class="mb-6 border-b border-dashed border-[#d7ccc8] pb-4 flex justify-between items-start">
                    <div><h2 class="text-3xl font-black text-[#3e2723] uppercase tracking-tight font-serif mb-1">${item.name}</h2><span class="inline-block bg-[#efebe9] text-[#5d4037] text-xs font-bold px-3 py-1 rounded-full border border-[#d7ccc8]">${displayGroup}</span></div>
                    <button onclick="window.KnowledgeUI.startEdit('${item.id}')" class="bg-white border border-[#d7ccc8] text-[#5d4037] px-4 py-2 rounded-xl text-xs font-bold shadow-sm hover:bg-[#efebe9] flex items-center gap-1"><span>✏️</span> Sửa</button>
                </div>
                ${imgHtml}
                ${contentBody}
                
                <div class="sticky bottom-0 bg-white/95 backdrop-blur border-t border-[#d7ccc8] p-4 mt-6 -mx-6 -mb-8 shadow-[0_-4px_20px_rgba(0,0,0,0.05)] flex justify-end gap-3 z-20">
                    <button onclick="window.KnowledgeUI.close()" class="px-5 py-3 rounded-xl font-bold text-gray-500 hover:bg-gray-100 border border-transparent hover:border-gray-200 transition-colors text-xs uppercase">Đóng</button>
                    <button onclick="${action}" class="px-6 py-3 text-white font-bold rounded-xl shadow-lg active:scale-95 transition-all flex items-center gap-2 border text-xs uppercase tracking-wide ${btnClass}"><span class="text-base">${btnIcon}</span> ${btnLabel}</button>
                </div>
                <div class="h-10"></div>`; 
        } else {
            detailHtml = `<div class="flex flex-col items-center justify-center py-20 text-gray-400 opacity-60"><div class="text-6xl mb-4 grayscale">👈</div><p class="text-sm font-medium text-center">Chọn mục bên trái để xem chi tiết.</p></div>`;
        }

        container.innerHTML = `<div class="p-6 md:p-8 flex-1 h-full overflow-y-auto custom-scrollbar">${aiBoxHtml}${detailHtml}</div>`;
    },

    // --- FORM SỬA / THÊM (EDIT MODE) - GIỮ NGUYÊN CODE CHUẨN ---
    handleImageUpload: function(input) { if (input.files && input.files[0]) { const reader = new FileReader(); reader.readAsDataURL(input.files[0]); reader.onload = (e) => { this.tempData.image = e.target.result; this.renderEditForm(); }; } },
    startAdd: function() { this.state.mode = 'add'; this.state.selectedId = null; this.tempData = { id: 'u_'+Date.now(), name: '', group: '', image: '', info: {} }; this.renderEditForm(); },
    startEdit: function(id) { const item = this.getItem(id); if(!item) return; this.state.mode = 'edit'; this.tempData = JSON.parse(JSON.stringify(item)); if(!this.tempData.group) this.tempData.group = (this.state.type==='herb'?this.tempData.category:this.tempData.meridian); this.renderEditForm(); },
    
    renderEditForm: function() { 
        const container = document.getElementById('kbRightPanel'); const d = this.tempData; if(!d.info) d.info = {}; const groups = this.getGroups(); const dl = `<datalist id="groupSuggestions">${groups.map(g=>`<option value="${g}">`).join('')}</datalist>`;
        const createInput = (label, key, isArea = false, placeholder="") => {
            const val = d.info[key] || (this.state.type==='acu' ? (key==='tac_dung' ? d.function : (key==='chu_tri' ? d.indications : '')) : '') || '';
            const onChg = `onchange="if(!window.KnowledgeUI.tempData.info) window.KnowledgeUI.tempData.info={}; window.KnowledgeUI.tempData.info['${key}']=this.value"`;
            if(isArea) return `<div><label class="song-label">${label}</label><textarea class="song-input h-20" placeholder="${placeholder}" ${onChg}>${val}</textarea></div>`;
            return `<div><label class="song-label">${label}</label><input type="text" class="song-input" value="${val}" placeholder="${placeholder}" ${onChg}></div>`;
        };
        let dynamicFields = '';
        if (this.state.type === 'herb') { dynamicFields = `<div class="grid grid-cols-2 gap-4 mb-4">${createInput('Tính vị', 'tinh_vi', false, 'VD: Cay, ấm...')}${createInput('Quy kinh', 'quy_kinh', false, 'VD: Phế, Tỳ...')}</div>${createInput('Liều lượng', 'lieu_luong', false, 'VD: 4 - 12g')}${createInput('Công năng & Chủ trị', 'cong_nang', true, 'Tác dụng chính...')}${createInput('Phối hợp', 'phoi_hop', true, 'Dùng chung với...')}${createInput('Kiêng kỵ', 'kieng_ky', true, 'Phụ nữ có thai, người âm hư...')}`; } 
        else if (this.state.type === 'west') { dynamicFields = `${createInput('Chỉ định điều trị', 'chi_dinh', true, 'Dùng cho bệnh gì...')}<div class="grid grid-cols-2 gap-4 mb-4">${createInput('Liều lượng', 'lieu_luong', false, 'VD: 1 viên/lần...')}${createInput('Đường dùng', 'duong_dung', false, 'VD: Uống sau ăn...')}</div>${createInput('⛔ Chống chỉ định', 'chong_chi_dinh', true, 'Người mẫn cảm, suy gan...')}${createInput('⚠️ Tương tác thuốc', 'tuong_tac', true, 'Không uống rượu bia...')}${createInput('Tác dụng phụ', 'tac_dung_phu', true, 'Buồn nôn, chóng mặt...')}`; } 
        else if (this.state.type === 'acu') { dynamicFields = `${createInput('Vị trí huyệt', 'vi_tri', true, 'Mô tả cách xác định...')}${createInput('Tác dụng', 'tac_dung', true, 'Khu phong, tán hàn...')}${createInput('Chủ trị', 'chu_tri', true, 'Đau đầu, đau lưng...')}`; }

        container.innerHTML = `<div class="p-6 md:p-8 flex-1 bg-[#fffcf7] flex flex-col h-full"><div class="flex justify-between items-center mb-4 border-b border-[#d7ccc8] pb-2"><h3 class="font-bold text-lg text-[#3e2723] uppercase">${this.state.mode==='add'?'Thêm Mới':'Chỉnh Sửa'}</h3><div class="flex gap-2">${this.state.mode==='edit'?`<button onclick="window.KnowledgeUI.deleteItem()" class="text-red-500 font-bold text-xs px-3 py-2 border border-red-100 rounded hover:bg-red-50">Xóa</button>`:''}<button onclick="window.KnowledgeUI.saveItem()" class="bg-[#5d4037] text-white px-6 py-2 rounded-xl font-bold shadow-lg hover:bg-[#4e342e]">LƯU</button></div></div><div class="flex-1 overflow-y-auto custom-scrollbar pr-2 pb-10 space-y-4"><div class="mb-4"><label class="song-label">Hình ảnh minh họa</label><div class="w-full h-48 border-2 border-dashed border-[#d7ccc8] rounded-xl flex flex-col items-center justify-center bg-gray-50 relative overflow-hidden group hover:bg-gray-100 cursor-pointer" onclick="document.getElementById('kbImgInputEdit').click()">${d.image ? `<img src="${d.image}" class="w-full h-full object-contain mix-blend-multiply">` : `<span class="text-4xl text-gray-300 mb-2">📷</span><span class="text-xs text-gray-400">Chạm để tải ảnh</span>`} <input type="file" id="kbImgInputEdit" accept="image/*" class="hidden" onchange="window.KnowledgeUI.handleImageUpload(this)"></div></div><div class="grid grid-cols-2 gap-4"><div><label class="song-label">Tên thuốc/huyệt *</label><input type="text" class="song-input font-bold" value="${d.name||''}" onchange="window.KnowledgeUI.tempData.name=this.value"></div><div><label class="song-label">Nhóm/Phân loại *</label><input type="text" list="groupSuggestions" class="song-input font-bold" value="${d.group||''}" onchange="window.KnowledgeUI.tempData.group=this.value"> ${dl}</div></div><div class="pt-4 border-t border-dashed border-[#d7ccc8]">${dynamicFields}</div></div></div>`;
    },

    saveItem: async function() { const d=this.tempData; if(!d.name||!d.group) { alert("Vui lòng nhập tên và nhóm!"); return; } if(!window.config.userKnowledge) window.config.userKnowledge={herbs:[],west:[],acu:[]}; let k=this.state.type==='herb'?'herbs':(this.state.type==='west'?'west':'acu'); let list=window.config.userKnowledge[k]; const idx=list.findIndex(x=>x.id===d.id); const itemToSave={...d, info:d.info||{}}; if(this.state.type==='herb') itemToSave.category=d.group; else if(this.state.type==='acu') itemToSave.meridian=d.group; if(idx>-1) list[idx]=itemToSave; else list.push(itemToSave); if(window.saveConfig) await window.saveConfig(); this.renderSidebar(); this.selectItem(d.id); if(window.showToast) window.showToast("✅ Đã lưu dữ liệu!", "success"); },
    deleteItem: async function() { if(!confirm("Bạn có chắc muốn xóa mục này?")) return; let k=this.state.type==='herb'?'herbs':(this.state.type==='west'?'west':'acu'); window.config.userKnowledge[k]=window.config.userKnowledge[k].filter(i=>i.id!==this.tempData.id); await window.saveConfig(); this.state.selectedId=null; this.renderSidebar(); this.renderRightPanel(null); }
};
