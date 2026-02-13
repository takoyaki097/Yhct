/**
 * FILE: modules_ai/ai-data-syndromes.js
 * CHUC NANG: Co so du lieu Hoi chung & Phac do dieu tri
 */

window.AI_SYNDROMES = [
    // --- NHOM CAM MAO & HO HAP ---
    {
        id: 'cam_mao_phong_han',
        name: 'Cảm Mạo Phong Hàn (Cảm lạnh)',
        triggers: ['sốt', 'sợ lạnh', 'đau đầu', 'ngạt mũi', 'không mồ hôi', 'đau vai gáy', 'hắt hơi', 'rêu trắng'],
        result: {
            herbs: ['Tía tô', 'Kinh giới', 'Gừng tươi', 'Quế chi', 'Bạch chỉ', 'Hương phụ'],
            west: ['Paracetamol 500mg (Hạ sốt/Đau đầu)', 'Vitamin C 500mg (Tăng đề kháng)', 'Chlorpheniramin 4mg (Sổ mũi)'],
            points: ['GB20', 'LI4', 'LU7', 'BL12', 'BL13'],
            msg: "🌬️ Chẩn đoán: CẢM MẠO PHONG HÀN. Cần phát tán phong hàn, giải biểu. Nên ăn cháo hành tía tô."
        }
    },
    {
        id: 'cam_mao_phong_nhiet',
        name: 'Cảm Mạo Phong Nhiệt (Cảm nóng)',
        triggers: ['sốt cao', 'đau họng', 'khát nước', 'mồ hôi', 'rêu vàng', 'ho có đờm', 'nước tiểu vàng'],
        result: {
            herbs: ['Kim ngân hoa', 'Liên kiều', 'Bạc hà', 'Cát căn', 'Sài hồ'],
            west: ['Paracetamol 500mg', 'Ibuprofen 400mg', 'Oresol (Bù nước)'],
            points: ['GV14', 'LI11', 'LI4', 'LU5', 'LU10'],
            msg: "🔥 Chẩn đoán: CẢM MẠO PHONG NHIỆT. Cần thanh nhiệt giải độc, tân lương giải biểu."
        }
    },

    // --- NHOM TIEU HOA ---
    {
        id: 'viem_da_day',
        name: 'Đau Dạ Dày / Tỳ Vị Hư Hàn',
        triggers: ['đau bụng', 'lạnh bụng', 'ăn kém', 'nôn', 'ợ chua', 'trào ngược', 'đau thượng vị'],
        result: {
            herbs: ['Nghệ (Khương hoàng)', 'Mật ong', 'Hoài sơn', 'Cam thảo', 'Trần bì', 'Mộc hương'],
            west: ['Omeprazole 20mg (Giảm axit)', 'Phosphalugel (Sữa dạ dày)', 'Domperidon 10mg (Chống nôn)'],
            points: ['ST36', 'CV12', 'PC6', 'SP4', 'BL21'],
            msg: "🥣 Gợi ý: Các thuốc nhóm ức chế bơm proton (PPI) hoặc trung hòa axit. Đông y dùng phép Ôn trung kiện tỳ."
        }
    },
    {
        id: 'roi_loan_tieu_hoa',
        name: 'Rối Loạn Tiêu Hóa / Tỳ Hư Thấp Trệ',
        triggers: ['tiêu chảy', 'đi ngoài', 'đau bụng', 'sôi bụng', 'phân sống', 'người nặng nề'],
        result: {
            herbs: ['Bạch truật', 'Hoài sơn', 'Mộc hương', 'Sa nhân', 'Trần bì', 'Biển đậu'],
            west: ['Smecta (Cầm tiêu chảy)', 'Berberin (Kháng khuẩn)', 'Men vi sinh (Enterogermina)'],
            points: ['ST25', 'ST36', 'SP9', 'CV6'],
            msg: "💧 Gợi ý: Bù nước điện giải (Oresol) nếu tiêu chảy nhiều. Kiêng đồ tanh, mỡ, sữa."
        }
    },

    // --- NHOM CO XUONG KHOP ---
    {
        id: 'dau_lung_cap',
        name: 'Đau Lưng Cấp / Thận Hư',
        triggers: ['đau lưng', 'mỏi gối', 'ù tai', 'yếu sinh lý', 'mang vác nặng', 'tiểu đêm', 'lạnh sống lưng'],
        result: {
            herbs: ['Đỗ trọng', 'Ngưu tất', 'Tục đoạn', 'Thục địa', 'Ba kích', 'Cẩu tích'],
            west: ['Paracetamol 500mg', 'Ibuprofen 400mg (Kháng viêm)', 'Vitamin 3B (Bổ thần kinh)', 'Eperisone 50mg (Giãn cơ)'],
            points: ['BL23', 'GV4', 'KI3', 'BL40', 'GV26', 'GB34'],
            msg: "⚡ Gợi ý: Kết hợp thuốc giãn cơ và vitamin nhóm B liều cao. Châm cứu bổ Thận, thông kinh lạc."
        }
    },
    {
        id: 'dau_than_kinh_toa',
        name: 'Đau Thần Kinh Tọa',
        triggers: ['đau lưng lan xuống chân', 'tê bì', 'đau mông', 'khó cúi', 'rễ thần kinh'],
        result: {
            herbs: ['Độc hoạt', 'Tang ký sinh', 'Ngưu tất', 'Phòng phong', 'Tế tân'],
            west: ['Meloxicam 7.5mg', 'Gabapentin (Giảm đau thần kinh)', 'Vitamin 3B'],
            points: ['BL23', 'GB30', 'BL40', 'GB34', 'BL60'],
            msg: "🦴 Gợi ý: Bài Độc Hoạt Tang Ký Sinh. Tránh mang vác nặng, nên tập vật lý trị liệu."
        }
    },
    {
        id: 'hoi_chung_co_vai_gay',
        name: 'Hội Chứng Cổ Vai Gáy',
        triggers: ['đau vai gáy', 'cứng cổ', 'ngoẹo cổ', 'đau lan xuống tay', 'tê tay'],
        result: {
            herbs: ['Cát căn', 'Khương hoạt', 'Bạch thược', 'Cam thảo', 'Quế chi'],
            west: ['Eperisone 50mg (Giãn cơ)', 'Paracetamol', 'Miếng dán Salonpas'],
            points: ['GB20', 'GB21', 'SI3', 'LI4', 'TE5'],
            msg: "💆 Gợi ý: Xoa bóp bấm huyệt vùng cổ gáy. Bài Quyên Tí Thang hoặc Cát Căn Thang."
        }
    },

    // --- NHOM THAN KINH & TIM MACH ---
    {
        id: 'mat_ngu_tam_ty',
        name: 'Mất Ngủ (Tâm Tỳ Hư)',
        triggers: ['mất ngủ', 'hồi hộp', 'hay quên', 'ăn kém', 'mệt mỏi', 'lo âu', 'sắc mặt vàng'],
        result: {
            herbs: ['Lạc tiên', 'Vông nem', 'Tâm sen', 'Long nhãn', 'Táo nhân', 'Viễn chí'],
            west: ['Rotunda (Bình vôi)', 'Magie B6 (An thần)', 'Ginkgo Biloba (Hoạt huyết)', 'Melatonin'],
            points: ['HT7', 'PC6', 'SP6', 'GV20', 'EX-HN (An Miên)'],
            msg: "🌙 Gợi ý: Dùng các thảo dược an thần nhẹ hoặc thuốc bổ não. Kiêng trà/cà phê tối. Bài Quy Tỳ Thang."
        }
    },
    {
        id: 'huyet_ap_cao',
        name: 'Tăng Huyết Áp / Can Dương Thượng Cang',
        triggers: ['đau đầu', 'chóng mặt', 'hoa mắt', 'mặt đỏ', 'cáu gắt', 'ù tai', 'nóng phừng'],
        result: {
            herbs: ['Câu đằng', 'Hạ khô thảo', 'Hoa hòe', 'Ngưu tất', 'Cúc hoa', 'Kỷ tử'],
            west: ['Amlodipin 5mg', 'Losartan 50mg', 'Lợi tiểu'],
            points: ['LR3', 'LI11', 'GB20', 'KI1', 'PC6'],
            msg: "🔴 Cảnh báo: Đo huyết áp ngay. Đông y dùng phép Bình can tiềm dương (Thiên ma câu đằng ẩm)."
        }
    },
    {
        id: 'thieu_mau_nao',
        name: 'Thiểu Năng Tuần Hoàn Não',
        triggers: ['hoa mắt', 'chóng mặt', 'xây xẩm', 'đau đầu', 'buồn nôn', 'quên'],
        result: {
            herbs: ['Đương quy', 'Xuyên khung', 'Bạch thược', 'Thục địa', 'Kỷ tử'],
            west: ['Ginkgo Biloba', 'Piracetam', 'Cinnarizin (Rối loạn tiền đình)'],
            points: ['GV20', 'EX-HN5', 'GB20', 'ST36'],
            msg: "🧠 Gợi ý: Bổ huyết hoạt huyết. Bài Tứ Vật Thang gia giảm."
        }
    }
];
