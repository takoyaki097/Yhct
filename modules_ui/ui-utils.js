/**
 * FILE: modules_ui/ui-utils.js
 * CHUC NANG: Tien ich he thong, Thong bao (Toast) & Hieu ung
 */

// --- 1. TIEN ICH HE THONG ---

window.getLocalDate = function() {
    const now = new Date();
    const local = new Date(now.getTime() - (now.getTimezoneOffset() * 60000));
    return local.toISOString().split('T')[0];
};

window.isIPad = function() {
    return /iPad/.test(navigator.userAgent) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
};

window.closeModals = function() { 
    document.querySelectorAll('.modal').forEach(m => m.classList.remove('active')); 
};

// --- 2. HE THONG THONG BAO (TOAST) ---

window.showToast = function(message, type = 'info', action = null) {
    let container = document.getElementById('toast-container');
    if (!container) {
        container = document.createElement('div');
        container.id = 'toast-container';
        container.className = 'fixed bottom-24 left-1/2 -translate-x-1/2 z-[9999] flex flex-col gap-2 pointer-events-none items-center w-full max-w-sm px-4';
        document.body.appendChild(container);
    }
    
    const toast = document.createElement('div');
    const colors = { success: 'bg-green-600', error: 'bg-red-600', info: 'bg-[#5d4037]', warning: 'bg-yellow-600' };
    
    let baseClass = `${colors[type] || colors.info} text-white p-3 rounded-2xl shadow-2xl text-sm font-bold transition-all duration-300 opacity-0 translate-y-4 pointer-events-auto flex items-center justify-between gap-3 min-w-[300px] border border-white/20`;
    
    toast.className = baseClass;
    
    const textSpan = document.createElement('span');
    textSpan.innerText = message;
    textSpan.className = "flex-1";
    toast.appendChild(textSpan);

    if (action && action.label && action.callback) {
        const btn = document.createElement('button');
        btn.innerText = action.label;
        btn.className = "bg-white/20 hover:bg-white/30 text-white px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-wider transition-colors border border-white/30 active:scale-95";
        btn.onclick = function(e) {
            e.stopPropagation();
            action.callback(); 
            toast.classList.add('opacity-0', 'translate-y-[-10px]');
            setTimeout(() => toast.remove(), 300);
        };
        toast.appendChild(btn);
    }

    container.appendChild(toast);
    
    setTimeout(() => { toast.classList.remove('opacity-0', 'translate-y-4'); }, 10);
    
    const duration = action ? 10000 : 3000;
    
    setTimeout(() => { 
        toast.classList.add('opacity-0', 'translate-y-[-10px]'); 
        setTimeout(() => toast.remove(), 300);
    }, duration);
};

// --- 3. TINH NANG KEO THA (DRAGGABLE) ---

window.makeDraggable = function(elmntId, onClickCallback) {
    const elmnt = document.getElementById(elmntId);
    if (!elmnt) return;
    let pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0, isDragging = false;
    
    const startDrag = (e) => {
        const t = e.touches ? e.touches[0] : e;
        pos3 = t.clientX; 
        pos4 = t.clientY;
        isDragging = false;
        
        document.onmouseup = document.ontouchend = () => {
            document.onmouseup = document.onmousemove = document.ontouchend = document.ontouchmove = null;
            if (!isDragging && onClickCallback) onClickCallback();
        };
        
        document.onmousemove = document.ontouchmove = (ev) => {
            if (ev.touches) {
                ev.preventDefault(); 
            }

            isDragging = true;
            const moveT = ev.touches ? ev.touches[0] : ev;
            
            pos1 = pos3 - moveT.clientX; 
            pos2 = pos4 - moveT.clientY;
            pos3 = moveT.clientX; 
            pos4 = moveT.clientY;
            
            elmnt.style.top = (elmnt.offsetTop - pos2) + "px";
            elmnt.style.left = (elmnt.offsetLeft - pos1) + "px";
            
            elmnt.style.bottom = 'auto'; 
            elmnt.style.right = 'auto';
        };
    };

    elmnt.onmousedown = elmnt.ontouchstart = startDrag;
};

// --- 4. TOAN MAN HINH ---

window.toggleFullScreen = function() {
    if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen().catch(() => {});
    } else {
        document.exitFullscreen();
    }
};
