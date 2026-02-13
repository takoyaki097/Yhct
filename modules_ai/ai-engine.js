/**
 * FILE: modules_ai/ai-engine.js
 * CHUC NANG: Xu ly ngon ngu tu nhien & Dua ra goi y
 */

window.knowledge = window.knowledge || {};

// Ham chuan hoa van ban (Dung tu dien Synonyms)
window.knowledge.normalizeText = function(text) {
    if (!text) return "";
    let processedText = text.toLowerCase();
    const dict = window.AI_DICTIONARY || {};
    for (const [standardKey, variations] of Object.entries(dict)) {
        variations.forEach(variant => {
            const regex = new RegExp(variant, 'g');
            processedText = processedText.replace(regex, standardKey);
        });
    }
    return processedText;
};

// Ham lay ten day du huyet
window.knowledge.getFullPointName = function(code) {
    if (!code) return "";
    const id = code.split(' ')[0];
    if (window.knowledge.acupoints) {
        const p = window.knowledge.acupoints.find(x => x.id === id);
        if (p) return `<b>${id} - ${p.name}</b>`;
    }
    return `<b>${code}</b>`;
};

// HAM PHAN TICH CHINH (Main Engine)
window.knowledge.analyze = function(symptomText, tuChanData = {}) {
    const cleanText = window.knowledge.normalizeText(symptomText || "");
    const timeFlow = window.knowledge.ziWuFlow ? window.knowledge.ziWuFlow.getCurrentAnalysis() : null;

    let result = {
        points: [], herbs: [], west: [], messages: [], 
        syndromeFound: null, timeBasedSuggestion: null 
    };

    // 1. Phan tich hoi chung (Dung database Syndromes)
    let bestSyndrome = null;
    let maxScore = 0;
    const syndromes = window.AI_SYNDROMES || [];
    
    syndromes.forEach(syn => {
        let score = 0;
        syn.triggers.forEach(t => { if (cleanText.includes(t)) score += 2; });
        if (score > maxScore && score > 0) { maxScore = score; bestSyndrome = syn; }
    });

    if (bestSyndrome) {
        result.syndromeFound = bestSyndrome.name;
        result.herbs.push(...bestSyndrome.result.herbs);
        result.points.push(...bestSyndrome.result.points);
        if (bestSyndrome.result.west) result.west.push(...bestSyndrome.result.west);
        result.messages.push(bestSyndrome.result.msg);
    } else {
        // Fallback don gian
        if (cleanText.includes('đau')) { result.points.push('LI4', 'LR3'); result.west.push('Paracetamol 500mg'); }
        if (cleanText.includes('sốt')) { result.points.push('GV14', 'LI11'); }
    }

    // 2. Tinh toan Thoi Cham (Neu co)
    if (timeFlow && timeFlow.naZi) {
        const getFn = window.knowledge.getFullPointName;
        result.timeBasedSuggestion = `
            <div class="mb-2 p-2 bg-[#e8f5e9] rounded border border-green-200 text-sm">
                <div class="font-bold text-[#2e7d32] uppercase mb-1">🕒 Thời Châm: ${timeFlow.timeInfo}</div>
                <div>Kinh Vượng: <b>${timeFlow.naZi.meridian}</b></div>
                <div>Huyệt Khai: ${getFn(timeFlow.naZi.horary)}</div>
            </div>`;
        const openPointId = timeFlow.naZi.horary.split(' ')[0];
        if(openPointId) result.points.unshift(openPointId);
    }

    // Khu trung lap
    result.points = [...new Set(result.points)];
    result.herbs = [...new Set(result.herbs)];
    result.west = [...new Set(result.west)];

    return result;
};
