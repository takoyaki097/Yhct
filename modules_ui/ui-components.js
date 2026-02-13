/**
 * FILE: modules_ui/ui-components.js
 * CHUC NANG: Cac thanh phan UI nhap lieu (NumberPad, Password Input)
 */

// --- 1. BIEN TOAN CUC ---
window.nPadValue = "";        
window.nPadTargetId = null;   
window.nPadLimit = null;      
window.nPadCallback = null;
window.passwordCallback = null;

// --- 2. BAN PHIM SO (NUMBER PAD) ---
window.injectNumberPadModal = function() {
    if (document.getElementById('numberPadModal')) return;
    const div = document.createElement('div');
    div.id = 'numberPadModal';
    div.className = 'modal z-[3000]'; 
    div.innerHTML = `
        <div class="modal-box max-w-sm text-center bg-white rounded-3xl shadow-2xl p-6 border border-gray-100">
            <div class="flex justify-between items-center mb-4">
                <h3 id="nPadTitle" class="font-bold text-lg text-[#3e2723] uppercase tracking-widest">Nhập số</h3>
                <button onclick="window.closeNumberPadModal()" class="text-3xl text-gray-300 hover:text-red-500">&times;</button>
            </div>
            <input type="text" id="nPadDisplay" readonly class="w-full text-center text-4xl font-black text-[#3e2723] bg-gray-50 py-4 rounded-2xl mb-4 border-none shadow-inner">
            <div class="grid grid-cols-3 gap-3">
                <button onclick="window.nPadAdd('1')" class="h-16 rounded-2xl bg-white border border-gray-100 shadow-sm text-2xl font-bold active:bg-gray-100">1</button>
                <button onclick="window.nPadAdd('2')" class="h-16 rounded-2xl bg-white border border-gray-100 shadow-sm text-2xl font-bold active:bg-gray-100">2</button>
                <button onclick="window.nPadAdd('3')" class="h-16 rounded-2xl bg-white border border-gray-100 shadow-sm text-2xl font-bold active:bg-gray-100">3</button>
                <button onclick="window.nPadAdd('4')" class="h-16 rounded-2xl bg-white border border-gray-100 shadow-sm text-2xl font-bold active:bg-gray-100">4</button>
                <button onclick="window.nPadAdd('5')" class="h-16 rounded-2xl bg-white border border-gray-100 shadow-sm text-2xl font-bold active:bg-gray-100">5</button>
                <button onclick="window.nPadAdd('6')" class="h-16 rounded-2xl bg-white border border-gray-100 shadow-sm text-2xl font-bold active:bg-gray-100">6</button>
                <button onclick="window.nPadAdd('7')" class="h-16 rounded-2xl bg-white border border-gray-100 shadow-sm text-2xl font-bold active:bg-gray-100">7</button>
                <button onclick="window.nPadAdd('8')" class="h-16 rounded-2xl bg-white border border-gray-100 shadow-sm text-2xl font-bold active:bg-gray-100">8</button>
                <button onclick="window.nPadAdd('9')" class="h-16 rounded-2xl bg-white border border-gray-100 shadow-sm text-2xl font-bold active:bg-gray-100">9</button>
                <button onclick="window.nPadDel()" class="h-16 rounded-2xl bg-red-50 text-red-500 text-2xl font-bold">⌫</button>
                <button onclick="window.nPadAdd('0')" class="h-16 rounded-2xl bg-white border border-gray-100 shadow-sm text-2xl font-bold active:bg-gray-100">0</button>
                <button onclick="window.nPadOk()" class="h-16 rounded-2xl bg-[#3e2723] text-white text-xl font-bold shadow-lg">OK</button>
            </div>
        </div>`;
    document.body.appendChild(div);
};

window.openNumberPad = function(targetId, title, limitRange, currentVal, callback) {
    window.injectNumberPadModal();
    window.nPadTargetId = targetId;
    window.nPadLimit = limitRange;
    window.nPadCallback = callback;
    window.nPadValue = currentVal ? String(currentVal) : "";
    
    const titleEl = document.getElementById('nPadTitle');
    if(titleEl) titleEl.innerText = title || 'Nhập số';
    
    const dispEl = document.getElementById('nPadDisplay');
    if(dispEl) dispEl.value = window.nPadValue;
    
    document.getElementById('numberPadModal').classList.add('active');
};

window.nPadAdd = (n) => { window.nPadValue += n; document.getElementById('nPadDisplay').value = window.nPadValue; };
window.nPadDel = () => { window.nPadValue = window.nPadValue.slice(0, -1); document.getElementById('nPadDisplay').value = window.nPadValue; };
window.nPadOk = () => {
    if (window.nPadTargetId) {
        const target = document.getElementById(window.nPadTargetId);
        if (target) {
            target.value = window.nPadValue || 0;
            target.dispatchEvent(new Event('change', { bubbles: true }));
            target.dispatchEvent(new Event('input', { bubbles: true }));
        }
    }
    if (window.nPadCallback) window.nPadCallback(window.nPadValue);
    window.closeNumberPadModal();
};
window.closeNumberPadModal = () => {
    document.getElementById('numberPadModal').classList.remove('active');
    window.nPadValue = "";
};

// --- 3. MAT KHAU NATIVE (PASSWORD INPUT) ---
window.injectNativePasswordModal = function() {
    if (document.getElementById('nativePassModal')) return;
    const div = document.createElement('div');
    div.id = 'nativePassModal';
    div.className = 'modal z-[4000]'; 
    div.innerHTML = `
        <div class="modal-box max-w-xs bg-white rounded-3xl shadow-2xl p-6 text-center">
            <h3 class="font-bold text-[#3e2723] mb-4 uppercase tracking-widest">Xác thực mã Pin</h3>
            <input type="password" id="nativePassInput" inputmode="numeric" class="w-full h-14 text-center text-3xl border-none bg-gray-100 rounded-2xl focus:ring-2 focus:ring-[#5d4037] mb-6 tracking-[10px]" placeholder="****">
            <div class="flex gap-3">
                <button onclick="document.getElementById('nativePassModal').classList.remove('active')" class="flex-1 py-3 font-bold text-gray-400">Hủy</button>
                <button onclick="window.submitNativePassword()" class="flex-2 py-3 bg-[#3e2723] text-white rounded-xl font-bold px-6">Xác nhận</button>
            </div>
        </div>`;
    document.body.appendChild(div);
};

window.openNativePasswordInput = function(callback) {
    window.injectNativePasswordModal();
    window.passwordCallback = callback;
    const input = document.getElementById('nativePassInput');
    if(input) {
        input.value = '';
        setTimeout(() => input.focus(), 200);
    }
    document.getElementById('nativePassModal').classList.add('active');
};

window.submitNativePassword = function() {
    if (window.passwordCallback) window.passwordCallback(document.getElementById('nativePassInput').value);
    document.getElementById('nativePassModal').classList.remove('active');
};
