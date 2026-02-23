/**
 * FILE: js/templates/tpl-modal-clock.js
 * CHỨC NĂNG: Template giao diện Đồng hồ sinh học & Dưỡng sinh theo giờ.
 * ĐƯỢC TÁCH TỪ: tpl-resources.js
 */

window.TPL_MODAL_CLOCK = `
<div id="bioClockModal" class="modal bio-modal-backdrop">
    <div class="bio-modal-container relative">
        <button onclick="window.closeModals()" class="bio-close-btn">&times;</button>
        
        <button onclick="window.toggleClockSettings()" class="absolute top-5 left-5 z-50 w-10 h-10 rounded-full bg-black/50 text-white border border-white/30 hover:bg-black/70 flex items-center justify-center text-xl transition-all" title="Cài đặt giao diện">
            ⚙️
        </button>

        <div class="bio-clock-wrapper">
            <div class="relative w-[320px] h-[320px] md:w-[450px] md:h-[450px]">
                <img id="clockBgImg" src="images/clock_bg.png" class="absolute top-0 left-0 w-full h-full object-cover rounded-full transition-opacity" style="z-index: 1;">
                
                <svg class="absolute top-0 left-0 w-full h-full pointer-events-none" style="z-index: 2;" viewBox="0 0 500 500">
                    <g id="clockOverlayGroup" transform="translate(250,250)"></g>
                </svg>

                <div id="clockVideoLayer" class="absolute top-0 left-0 w-full h-full pointer-events-none" style="z-index: 3;">
                    <div class="char-video-wrapper char-ty"><img id="gif_ty" src="videos/char_ty.gif"></div>
                    <div class="char-video-wrapper char-suu"><img id="gif_suu" src="videos/char_suu.gif"></div>
                    <div class="char-video-wrapper char-dan"><img id="gif_dan" src="videos/char_dan.gif"></div>
                    <div class="char-video-wrapper char-mao"><img id="gif_mao" src="videos/char_mao.gif"></div>
                    <div class="char-video-wrapper char-thin"><img id="gif_thin" src="videos/char_thin.gif"></div>
                    <div class="char-video-wrapper char-ty_ran"><img id="gif_ty_ran" src="videos/char_ty_ran.gif"></div>
                    <div class="char-video-wrapper char-ngo"><img id="gif_ngo" src="videos/char_ngo.gif"></div>
                    <div class="char-video-wrapper char-mui"><img id="gif_mui" src="videos/char_mui.gif"></div>
                    <div class="char-video-wrapper char-than"><img id="gif_than" src="videos/char_than.gif"></div>
                    <div class="char-video-wrapper char-dau"><img id="gif_dau" src="videos/char_dau.gif"></div>
                    <div class="char-video-wrapper char-tuat"><img id="gif_tuat" src="videos/char_tuat.gif"></div>
                    <div class="char-video-wrapper char-hoi"><img id="gif_hoi" src="videos/char_hoi.gif"></div>
                </div>

                <img id="handHour" src="images/hand_hour.png" class="clock-hand" alt="H" style="z-index: 5;">
                <img id="handMinute" src="images/hand_minute.png" class="clock-hand" alt="M" style="z-index: 6;">
                <img id="handSecond" src="images/hand_second.png" class="clock-hand" alt="S" style="z-index: 7;">
                
                <div class="clock-center-dot" style="z-index: 8;"></div>
            </div>
        </div>

        <div class="bio-info-card">
            <h2 class="text-xl md:text-2xl font-bold text-[#ffecb3] uppercase mb-1 font-serif text-center tracking-widest">Dưỡng Sinh Theo Giờ</h2>
            <div class="w-16 h-0.5 bg-[#ffecb3] mx-auto mb-3 opacity-50"></div>
            <div class="text-center space-y-1">
                <span class="text-3xl font-black text-white block mb-1" id="clockCurrentTime">--:--</span>
                <span class="text-lg text-[#ffcc80] font-bold block" id="clockZoneName">Đang tải...</span>
                <p class="text-sm md:text-base text-gray-200 italic leading-relaxed px-4" id="clockAdvice">...</p>
            </div>
        </div>

        <div id="clockSettingsPanel" class="hidden absolute bottom-5 left-1/2 transform -translate-x-1/2 w-[90%] max-w-md bg-black/90 backdrop-blur-md border border-white/20 rounded-xl p-4 text-white z-[100] shadow-2xl animate-fade-in-up">
            <div class="flex justify-between items-center mb-3 border-b border-white/20 pb-2">
                <h3 class="font-bold text-sm uppercase text-yellow-400">⚡ Cài Đặt Đồng Hồ</h3>
                <button onclick="window.toggleClockSettings()" class="text-gray-400 hover:text-white">&times;</button>
            </div>
            
            <div class="space-y-4 text-xs">
                <div class="p-2 bg-white/5 rounded border border-white/10">
                    <h4 class="font-bold text-yellow-200 mb-2">🎨 Màu Sắc & Ánh Sáng</h4>
                    <div class="grid grid-cols-2 gap-3">
                        <div>
                            <label class="block mb-1">Màu Neon</label>
                            <input type="color" id="inp_neonColor" value="#ffd700">
                        </div>
                        <div>
                            <label class="block mb-1">Độ Đậm: <span id="val_neonInt">0.6</span></label>
                            <input type="range" id="inp_neonInt" min="0.1" max="1" step="0.1" value="0.6">
                        </div>
                    </div>
                </div>

                <div class="p-2 bg-white/5 rounded border border-white/10">
                    <h4 class="font-bold text-blue-200 mb-2">📐 Cấu Trúc</h4>
                    <div class="grid grid-cols-2 gap-3">
                        <div><label>Tâm Kim (%): <span id="val_handPivot">84</span></label><input type="range" id="inp_handPivot" min="50" max="100" value="84"></div>
                        <div><label>Tốc độ (s): <span id="val_speed">1.0</span></label><input type="range" id="inp_speed" min="0.1" max="3" step="0.1" value="1"></div>
                        <div><label>Vòng Ngoài: <span id="val_rOut">196</span></label><input type="range" id="inp_rOut" min="100" max="250" value="196"></div>
                        <div><label>Vòng Trong: <span id="val_rIn">90</span></label><input type="range" id="inp_rIn" min="0" max="150" value="90"></div>
                        <div><label>Độ mờ nền: <span id="val_bgOp">1.0</span></label><input type="range" id="inp_bgOp" min="0.1" max="1" step="0.1" value="1"></div>
                        <div><label>Cỡ Kim: <span id="val_handScale">1.0</span></label><input type="range" id="inp_handScale" min="0.5" max="1.5" step="0.05" value="1"></div>
                    </div>
                </div>

                <div class="p-2 bg-white/5 rounded border border-white/10">
                    <h4 class="font-bold text-green-200 mb-2">🖼️ Thay Thế Hình Ảnh</h4>
                    <div class="mb-3 border-b border-white/10 pb-2">
                        <label class="block mb-1 text-gray-300">Thay Mặt Đồng Hồ:</label>
                        <label for="up_bg" class="custom-file-upload">📂 Chọn ảnh nền mới...</label>
                        <input type="file" id="up_bg" accept="image/*" onchange="window.handleUpload(this, 'clockBgImg')">
                    </div>
                    <div class="h-32 overflow-y-auto pr-1">
                        <label class="block mb-1 text-gray-300">Thay 12 Con Giáp (GIF):</label>
                        <div class="grid grid-cols-2 gap-2">
                            <div><label for="up_ty" class="custom-file-upload">Tý (Chuột)</label><input type="file" id="up_ty" accept="image/gif" onchange="window.handleUpload(this, 'gif_ty')"></div>
                            <div><label for="up_suu" class="custom-file-upload">Sửu (Trâu)</label><input type="file" id="up_suu" accept="image/gif" onchange="window.handleUpload(this, 'gif_suu')"></div>
                            <div><label for="up_dan" class="custom-file-upload">Dần (Hổ)</label><input type="file" id="up_dan" accept="image/gif" onchange="window.handleUpload(this, 'gif_dan')"></div>
                            <div><label for="up_mao" class="custom-file-upload">Mão (Mèo)</label><input type="file" id="up_mao" accept="image/gif" onchange="window.handleUpload(this, 'gif_mao')"></div>
                            <div><label for="up_thin" class="custom-file-upload">Thìn (Rồng)</label><input type="file" id="up_thin" accept="image/gif" onchange="window.handleUpload(this, 'gif_thin')"></div>
                            <div><label for="up_ty_ran" class="custom-file-upload">Tỵ (Rắn)</label><input type="file" id="up_ty_ran" accept="image/gif" onchange="window.handleUpload(this, 'gif_ty_ran')"></div>
                            <div><label for="up_ngo" class="custom-file-upload">Ngọ (Ngựa)</label><input type="file" id="up_ngo" accept="image/gif" onchange="window.handleUpload(this, 'gif_ngo')"></div>
                            <div><label for="up_mui" class="custom-file-upload">Mùi (Dê)</label><input type="file" id="up_mui" accept="image/gif" onchange="window.handleUpload(this, 'gif_mui')"></div>
                            <div><label for="up_than" class="custom-file-upload">Thân (Khỉ)</label><input type="file" id="up_than" accept="image/gif" onchange="window.handleUpload(this, 'gif_than')"></div>
                            <div><label for="up_dau" class="custom-file-upload">Dậu (Gà)</label><input type="file" id="up_dau" accept="image/gif" onchange="window.handleUpload(this, 'gif_dau')"></div>
                            <div><label for="up_tuat" class="custom-file-upload">Tuất (Chó)</label><input type="file" id="up_tuat" accept="image/gif" onchange="window.handleUpload(this, 'gif_tuat')"></div>
                            <div><label for="up_hoi" class="custom-file-upload">Hợi (Lợn)</label><input type="file" id="up_hoi" accept="image/gif" onchange="window.handleUpload(this, 'gif_hoi')"></div>
                        </div>
                    </div>
                </div>
            </div>
            
            <div class="mt-3 text-center flex justify-between">
                <button onclick="window.resetClockSettings()" class="text-[10px] text-red-400 hover:text-white">Reset Mặc định</button>
                <span class="text-[10px] text-gray-500 italic">Ảnh sẽ mất khi tải lại trang</span>
            </div>
        </div>
    </div>
    
    <style>
        @keyframes fadeInUp { from { opacity: 0; transform: translate(-50%, 20px); } to { opacity: 1; transform: translate(-50%, 0); } }
        .animate-fade-in-up { animation: fadeInUp 0.3s ease-out; }
    </style>
</div>
`;
