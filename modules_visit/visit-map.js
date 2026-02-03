/**
 * FILE: modules_visit/visit-map.js
 * CHỨC NĂNG: Logic AI Suggestions (Giao diện Điều trị).
 * CẬP NHẬT: 
 * - Hiển thị huyệt ĐÃ CHỌN trong bảng Phương Huyệt (ưu tiên).
 * - Xóa bảng Tí Ngọ ở màn hình này để gọn gàng.
 */

window.currentAiSuggestions = { points: [], herbs: [], west: [], messages: [], syndromeFound: null };

// BRIDGE
window.openAcupointModal = function() { if (window.KnowledgeUI) window.KnowledgeUI.open('acu'); else alert("Đang tải..."); };
window.openHerbModal = function() { if (window.KnowledgeUI) window.KnowledgeUI.open('herb'); else alert("Đang tải..."); };

// AI ENGINE (TAB KHÁM BỆNH)
window.refreshAiSuggestion = function(showHighlightOnly = false) {
    if (!window.knowledge || !window.knowledge.analyze) return;
    
    const symptoms = document.getElementById('vSpecial') ? document.getElementById('vSpecial').value : "";
    const tuChanData = window.currentVisit ? window.currentVisit.tuChan : {};
    
    const result = window.knowledge.analyze(symptoms, tuChanData);
    
    if (result) {
        window.currentAiSuggestions = result;
        const aiBox = document.getElementById('aiSuggestionBox');
        const aiText = document.getElementById('aiSuggestionText');
        
        if (aiBox && aiText) {
            let htmlContent = "";
            
            // 1. Chẩn đoán & Lời khuyên
            if (result.syndromeFound) {
                htmlContent += `<div class="font-bold text-red-600 mb-2 border-b border-red-200 pb-1 flex items-center gap-2 text-xs uppercase tracking-wide"><span class="text-lg">🔍</span> ${result.syndromeFound}</div>`;
            }
            if (result.messages.length > 0) {
                htmlContent += `<div class="mb-3 text-[#3e2723] space-y-1 text-xs">${result.messages.map(m => `<div class="flex gap-2"><span class="text-blue-500 font-bold">•</span><span>${m}</span></div>`).join('')}</div>`;
            }

            // --- HELPER: NÚT TOGGLE ---
            const createToggleBtn = (type, value, label) => {
                let isSelected = false;
                let onClickFn = "";
                
                if (type === 'point') {
                    isSelected = window.currentVisit.acupoints.some(p => p.id === value);
                    onClickFn = `window.KnowledgeBridge.toggleItem('${value}', 'point')`;
                } else if (type === 'herb') {
                    isSelected = window.currentVisit.rxEast.some(h => h.name.toLowerCase() === value.toLowerCase());
                    onClickFn = `window.KnowledgeBridge.toggleItem('${value}', 'herb')`;
                } else if (type === 'west') {
                    isSelected = window.currentVisit.rxWest.some(w => w.name.toLowerCase() === value.toLowerCase());
                    onClickFn = `window.KnowledgeBridge.toggleItem('${value}', 'west')`;
                }

                if (isSelected) {
                    return `<button onclick="${onClickFn}" class="px-2 py-1 rounded text-[10px] font-bold border flex items-center gap-1 transition-all bg-green-600 text-white border-green-700 shadow-sm hover:bg-green-700 active:scale-95 mb-1 mr-1"><span>✓</span> ${label}</button>`;
                } else {
                    return `<button onclick="${onClickFn}" class="px-2 py-1 rounded text-[10px] font-bold border bg-white border-gray-300 text-gray-700 hover:bg-[#5d4037] hover:text-white hover:border-[#5d4037] transition-all shadow-sm active:scale-95 mb-1 mr-1">+ ${label}</button>`;
                }
            };

            // 2. RENDER PHƯƠNG HUYỆT (GỘP: ĐÃ CHỌN + GỢI Ý)
            
            // A. Lấy danh sách ID huyệt đã chọn
            const selectedPointIds = window.currentVisit.acupoints.map(p => p.id);
            // B. Lấy danh sách ID huyệt gợi ý (loại bỏ trùng với đã chọn)
            const suggestedPointIds = result.points.filter(id => !selectedPointIds.includes(id));
            // C. Gộp lại: Đã chọn lên trước
            const allDisplayPoints = [...selectedPointIds, ...suggestedPointIds];

            if (allDisplayPoints.length > 0) {
                htmlContent += `<div class="mb-3"><div class="text-[10px] font-bold text-gray-500 uppercase mb-1 border-b border-dashed border-gray-200 pb-1 flex justify-between"><span>📍 Phương Huyệt</span></div><div class="flex flex-wrap gap-1">`;
                
                htmlContent += allDisplayPoints.map(id => {
                    let name = id;
                    // Lấy tên hiển thị: Nếu đã chọn thì lấy tên trong object, nếu không thì tra cứu
                    if (selectedPointIds.includes(id)) {
                        const p = window.currentVisit.acupoints.find(x => x.id === id);
                        if(p) name = p.name;
                    } else if (window.knowledge.acupoints) { 
                        const p = window.knowledge.acupoints.find(x => x.id === id); 
                        if(p) name = `${p.name}`; 
                    }
                    return createToggleBtn('point', id, name);
                }).join('');
                
                htmlContent += `</div></div>`;
            }

            // 3. RENDER THUỐC (Tương tự logic trên hoặc giữ nguyên gợi ý)
            if (result.herbs.length > 0) {
                htmlContent += `<div class="mb-3"><div class="text-[10px] font-bold text-gray-500 uppercase mb-1 border-b border-dashed border-gray-200 pb-1">🌿 Đông Dược</div><div class="flex flex-wrap gap-1">${result.herbs.map(h => createToggleBtn('herb', h, h)).join('')}</div></div>`;
            }

            if (result.west.length > 0) {
                htmlContent += `<div class="mb-2"><div class="text-[10px] font-bold text-gray-500 uppercase mb-1 border-b border-dashed border-gray-200 pb-1">💊 Tân Dược</div><div class="flex flex-wrap gap-1">${result.west.map(w => createToggleBtn('west', w, w)).join('')}</div></div>`;
            }

            if (htmlContent) { aiBox.classList.remove('hidden'); aiText.innerHTML = htmlContent; } 
            else { aiBox.classList.add('hidden'); }
        }
    }
};
