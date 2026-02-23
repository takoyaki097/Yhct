/**
 * FILE: knowledge/acu-meridians-2.js
 * CHỨC NĂNG: Dữ liệu Huyệt vị - Phần 2 (6 Kinh sau: Bàng Quang, Thận, Tâm Bào, Tam Tiêu, Đởm, Can)
 * CƠ CHẾ: Tự động nối tiếp vào mảng window.knowledge.acupoints
 */

window.knowledge = window.knowledge || {};
window.knowledge.acupoints = window.knowledge.acupoints || [];

(function() {
    const dataPart2 = [
        // ============================================================
        // 7. TÚC THÁI DƯƠNG BÀNG QUANG KINH (BL - Bladder Meridian)
        // ============================================================
        { 
            id: 'BL1', name: 'Tình Minh', meridian: 'Bàng Quang', 
            type: 'Hội với Tiểu trường, Vị, Dương Kiểu, Âm Kiểu',
            function: 'Sơ phong, tiết nhiệt, minh mục.',
            indications: 'Đau mắt đỏ, mờ mắt, quáng gà, liệt mặt, chảy nước mắt khi ra gió.',
            tags: ['mắt', 'liệt mặt']
        },
        { 
            id: 'BL2', name: 'Toản Trúc', meridian: 'Bàng Quang', 
            type: '',
            function: 'Khu phong, minh mục, trấn kinh.',
            indications: 'Đau đầu vùng trán, đau mắt, liệt mặt, nấc.',
            tags: ['đau đầu', 'mắt', 'mặt', 'nấc']
        },
        { 
            id: 'BL10', name: 'Thiên Trụ', meridian: 'Bàng Quang', 
            type: '',
            function: 'Sơ khí hóa, thanh đầu mắt.',
            indications: 'Đau đầu, đau cứng cổ gáy, ngạt mũi, suy nhược thần kinh.',
            tags: ['đầu', 'cổ gáy', 'mũi']
        },
        { 
            id: 'BL11', name: 'Đại Trữ', meridian: 'Bàng Quang', 
            type: 'Hội của Xương',
            function: 'Khu phong tà, thư cân mạch, giải biểu.',
            indications: 'Sốt, ho, đau đầu, đau vai gáy, đau nhức xương khớp.',
            tags: ['sốt', 'xương', 'vai gáy']
        },
        { 
            id: 'BL12', name: 'Phong Môn', meridian: 'Bàng Quang', 
            type: 'Hội với Mạch Đốc',
            function: 'Khu phong, giải biểu, điều khí.',
            indications: 'Cảm mạo, ho, sốt, đau lưng trên, đau cổ gáy.',
            tags: ['cảm', 'lưng', 'cổ']
        },
        { 
            id: 'BL13', name: 'Phế Du', meridian: 'Bàng Quang', 
            type: 'Huyệt Du của Phế',
            function: 'Điều phế, lý khí, bổ hư lao.',
            indications: 'Ho, hen suyễn, lao phổi, đổ mồ hôi trộm, đau lưng trên.',
            tags: ['phế', 'ho', 'hen']
        },
        { 
            id: 'BL14', name: 'Quyết Âm Du', meridian: 'Bàng Quang', 
            type: 'Huyệt Du của Tâm Bào',
            function: 'Khoan hung, lý khí, ninh tâm.',
            indications: 'Đau tim, hồi hộp, ho, nôn mửa.',
            tags: ['tim', 'ngực']
        },
        { 
            id: 'BL15', name: 'Tâm Du', meridian: 'Bàng Quang', 
            type: 'Huyệt Du của Tâm',
            function: 'Dưỡng tâm, an thần, lý huyết.',
            indications: 'Mất ngủ, hồi hộp, mộng tinh, hay quên, động kinh.',
            tags: ['tim', 'ngủ', 'thần kinh']
        },
        { 
            id: 'BL17', name: 'Cách Du', meridian: 'Bàng Quang', 
            type: 'Hội của Huyết',
            function: 'Lý khí, khoan hung, hòa huyết.',
            indications: 'Nấc, nôn ra máu, thiếu máu, đau thắt lưng, đau dạ dày.',
            tags: ['máu', 'nấc', 'dạ dày']
        },
        { 
            id: 'BL18', name: 'Can Du', meridian: 'Bàng Quang', 
            type: 'Huyệt Du của Can',
            function: 'Bổ can đởm, tiềm dương, sáng mắt.',
            indications: 'Vàng da, đau mạn sườn, đau mắt đỏ, chảy máu cam, chóng mặt.',
            tags: ['can', 'mắt', 'vàng da']
        },
        { 
            id: 'BL19', name: 'Đởm Du', meridian: 'Bàng Quang', 
            type: 'Huyệt Du của Đởm',
            function: 'Thanh đởm hỏa, trừ thấp nhiệt.',
            indications: 'Vàng da, đắng miệng, đau mạn sườn, lao hạch.',
            tags: ['đởm', 'vàng da']
        },
        { 
            id: 'BL20', name: 'Tỳ Du', meridian: 'Bàng Quang', 
            type: 'Huyệt Du của Tỳ',
            function: 'Kiện tỳ, hóa thấp, nhiếp huyết.',
            indications: 'Đầy bụng, tiêu chảy, chán ăn, phù thũng, sa tạng phủ.',
            tags: ['tỳ', 'tiêu hóa', 'bụng']
        },
        { 
            id: 'BL21', name: 'Vị Du', meridian: 'Bàng Quang', 
            type: 'Huyệt Du của Vị',
            function: 'Điều trung khí, hóa thấp trệ.',
            indications: 'Đau dạ dày, nôn mửa, tiêu hóa kém, sôi bụng.',
            tags: ['dạ dày', 'bụng']
        },
        { 
            id: 'BL22', name: 'Tam Tiêu Du', meridian: 'Bàng Quang', 
            type: 'Huyệt Du của Tam Tiêu',
            function: 'Lợi thủy, hóa thấp.',
            indications: 'Đầy bụng, khó tiêu, nôn mửa, tiêu chảy, bí tiểu, phù thũng.',
            tags: ['tiêu hóa', 'tiểu', 'phù']
        },
        { 
            id: 'BL23', name: 'Thận Du', meridian: 'Bàng Quang', 
            type: 'Huyệt Du của Thận',
            function: 'Bổ thận khí, tráng dương, lợi thủy, sáng mắt, thính tai.',
            indications: 'Đau lưng, di tinh, liệt dương, ù tai, điếc tai, phù thũng, đái dầm.',
            tags: ['thận', 'lưng', 'sinh lý', 'tai']
        },
        { 
            id: 'BL25', name: 'Đại Trường Du', meridian: 'Bàng Quang', 
            type: 'Huyệt Du của Đại Trường',
            function: 'Lý trường vị, hóa trệ.',
            indications: 'Đau thắt lưng, táo bón, tiêu chảy, đau thần kinh tọa.',
            tags: ['lưng', 'táo bón', 'đau dây thần kinh']
        },
        { 
            id: 'BL28', name: 'Bàng Quang Du', meridian: 'Bàng Quang', 
            type: 'Huyệt Du của Bàng Quang',
            function: 'Điều bàng quang, lợi yêu tích.',
            indications: 'Đau vùng xương cùng, bí tiểu, đái dầm, tiêu chảy.',
            tags: ['tiểu', 'lưng']
        },
        { 
            id: 'BL32', name: 'Thứ Liêu', meridian: 'Bàng Quang', 
            type: '',
            function: 'Bổ hạ tiêu, cường yêu tất.',
            indications: 'Đau lưng cùng, đau bụng kinh, khí hư, di tinh, liệt dương.',
            tags: ['lưng', 'phụ khoa', 'sinh lý']
        },
        { 
            id: 'BL40', name: 'Ủy Trung', meridian: 'Bàng Quang', 
            type: 'Huyệt Hợp (Thổ) - Tổng huyệt vùng Lưng',
            function: 'Thanh huyết, thư cân, thông lạc, khu phong thấp.',
            indications: 'Đau thắt lưng, đau thần kinh tọa, đau đầu gối, trúng nắng, sốt cao.',
            tags: ['lưng', 'chân', 'sốt']
        },
        { 
            id: 'BL52', name: 'Chí Thất', meridian: 'Bàng Quang', 
            type: '',
            function: 'Bổ thận, ích tinh.',
            indications: 'Di tinh, liệt dương, đau thắt lưng, tiểu khó.',
            tags: ['thận', 'sinh lý', 'lưng']
        },
        { 
            id: 'BL57', name: 'Thừa Sơn', meridian: 'Bàng Quang', 
            type: '',
            function: 'Thư cân lạc, điều trường phủ.',
            indications: 'Chuột rút bắp chân, trĩ, táo bón, đau gót chân, đau thần kinh tọa.',
            tags: ['chân', 'trĩ', 'táo bón']
        },
        { 
            id: 'BL60', name: 'Côn Lôn', meridian: 'Bàng Quang', 
            type: 'Huyệt Kinh (Hỏa)',
            function: 'Khu phong, thông lạc, thư cân.',
            indications: 'Đau lưng, đau cổ gáy, đau cổ chân, đau đầu, khó sinh.',
            tags: ['lưng', 'cổ', 'chân']
        },
        { 
            id: 'BL62', name: 'Thân Mạch', meridian: 'Bàng Quang', 
            type: 'Giao hội với Dương Kiểu Mạch',
            function: 'Thanh nhiệt, an thần, khu phong.',
            indications: 'Động kinh, mất ngủ, đau đầu, đau lưng, chóng mặt.',
            tags: ['thần kinh', 'ngủ', 'đau đầu']
        },
        { 
            id: 'BL67', name: 'Chí Âm', meridian: 'Bàng Quang', 
            type: 'Huyệt Tỉnh (Kim)',
            function: 'Khu phong, thanh não, chỉnh thai.',
            indications: 'Đau đầu, ngạt mũi, ngôi thai ngược, khó sinh, di tinh.',
            tags: ['đầu', 'thai', 'sinh sản']
        },

        // ============================================================
        // 8. TÚC THIẾU ÂM THẬN KINH (KI - Kidney Meridian)
        // ============================================================
        { 
            id: 'KI1', name: 'Dũng Tuyền', meridian: 'Thận', 
            type: 'Huyệt Tỉnh (Mộc)',
            function: 'Giáng âm hỏa, thanh thận nhiệt, định thần chí.',
            indications: 'Ngất, sốt cao co giật, đau đỉnh đầu, mất ngủ, cao huyết áp.',
            tags: ['cấp cứu', 'huyết áp', 'ngủ', 'sốt']
        },
        { 
            id: 'KI2', name: 'Nhiên Cốc', meridian: 'Thận', 
            type: 'Huyệt Huỳnh (Hỏa)',
            function: 'Thanh thận nhiệt, lý hạ tiêu.',
            indications: 'Ngứa âm hộ, di tinh, liệt dương, kinh nguyệt không đều, ù tai.',
            tags: ['sinh lý', 'phụ khoa', 'tai']
        },
        { 
            id: 'KI3', name: 'Thái Khê', meridian: 'Thận', 
            type: 'Huyệt Nguyên - Huyệt Du (Thổ)',
            function: 'Tư thận âm, tráng thận dương, kiện yêu tất.',
            indications: 'Đau lưng mỏi gối, ù tai, di tinh, liệt dương, kinh nguyệt không đều, ho hen.',
            tags: ['thận hư', 'lưng', 'sinh lý', 'tai']
        },
        { 
            id: 'KI6', name: 'Chiếu Hải', meridian: 'Thận', 
            type: 'Giao hội với Âm Kiểu Mạch',
            function: 'Tư âm, thanh nhiệt, an thần.',
            indications: 'Mất ngủ, khô họng, táo bón, bí tiểu, rối loạn kinh nguyệt.',
            tags: ['ngủ', 'họng', 'tiêu hóa']
        },
        { 
            id: 'KI7', name: 'Phục Lưu', meridian: 'Thận', 
            type: 'Huyệt Kinh (Kim)',
            function: 'Bổ thận dương, lợi thủy, điều hãn.',
            indications: 'Phù thũng, mồ hôi trộm, không ra mồ hôi, tiêu chảy, đau thắt lưng.',
            tags: ['mồ hôi', 'thận', 'phù']
        },
        { 
            id: 'KI10', name: 'Âm Cốc', meridian: 'Thận', 
            type: 'Huyệt Hợp (Thủy)',
            function: 'Bổ thận, lợi hạ tiêu.',
            indications: 'Liệt dương, thoát vị, tiểu khó, đau đầu gối.',
            tags: ['sinh lý', 'tiểu', 'gối']
        },
        { 
            id: 'KI27', name: 'Du Phủ', meridian: 'Thận', 
            type: '',
            function: 'Lý khí, bình suyễn.',
            indications: 'Ho, hen suyễn, đau ngực, nôn mửa.',
            tags: ['ho', 'ngực']
        },

        // ============================================================
        // 9. THỦ QUYẾT ÂM TÂM BÀO KINH (PC - Pericardium Meridian)
        // ============================================================
        { 
            id: 'PC3', name: 'Khúc Trạch', meridian: 'Tâm Bào', 
            type: 'Huyệt Hợp (Thủy)',
            function: 'Thanh tâm hỏa, trừ phiền nhiệt, chỉ ẩu.',
            indications: 'Đau tim, sốt cao, nôn mửa, run tay, say nắng.',
            tags: ['tim', 'sốt', 'nôn']
        },
        { 
            id: 'PC4', name: 'Khích Môn', meridian: 'Tâm Bào', 
            type: 'Huyệt Khích',
            function: 'Ninh tâm, an thần, lương huyết.',
            indications: 'Đau tim kịch liệt, ho ra máu, nôn ra máu, sợ hãi.',
            tags: ['tim', 'máu', 'thần kinh']
        },
        { 
            id: 'PC5', name: 'Gian Sử', meridian: 'Tâm Bào', 
            type: 'Huyệt Kinh (Kim)',
            function: 'Hòa vị, hóa đàm, an thần.',
            indications: 'Đau tim, sốt rét, nôn mửa, động kinh, điên cuồng.',
            tags: ['tim', 'sốt', 'thần kinh']
        },
        { 
            id: 'PC6', name: 'Nội Quan', meridian: 'Tâm Bào', 
            type: 'Huyệt Lạc - Giao hội với Âm Duy Mạch',
            function: 'Định tâm, an thần, lý khí, hòa vị.',
            indications: 'Đau dạ dày, nôn, say xe, hồi hộp, mất ngủ, đau ngực, nấc.',
            tags: ['dạ dày', 'tim', 'ngủ', 'nôn']
        },
        { 
            id: 'PC7', name: 'Đại Lăng', meridian: 'Tâm Bào', 
            type: 'Huyệt Nguyên - Huyệt Du (Thổ)',
            function: 'Thanh tâm, định thần, lương huyết.',
            indications: 'Hôi miệng, đau tim, mất ngủ, cười nói lảm nhảm, mụn nhọt.',
            tags: ['miệng', 'tim', 'ngủ', 'mụn']
        },
        { 
            id: 'PC8', name: 'Lao Cung', meridian: 'Tâm Bào', 
            type: 'Huyệt Huỳnh (Hỏa)',
            function: 'Thanh tâm hỏa, trừ thấp nhiệt.',
            indications: 'Ra mồ hôi tay, hôi miệng, loét miệng, đau tim, động kinh.',
            tags: ['tay', 'miệng', 'tim']
        },
        { 
            id: 'PC9', name: 'Trung Xung', meridian: 'Tâm Bào', 
            type: 'Huyệt Tỉnh (Mộc)',
            function: 'Khai khiếu, thanh tâm, hồi dương.',
            indications: 'Trúng gió, hôn mê, sốt cao, cứng lưỡi, cấp cứu.',
            tags: ['cấp cứu', 'sốt', 'lưỡi']
        },

        // ============================================================
        // 10. THỦ THIẾU DƯƠNG TAM TIÊU KINH (TE/SJ - San Jiao Meridian)
        // ============================================================
        { 
            id: 'TE1', name: 'Quan Xung', meridian: 'Tam Tiêu', 
            type: 'Huyệt Tỉnh (Kim)',
            function: 'Sơ khí hóa, giải uất, thanh nhiệt.',
            indications: 'Đau đầu, đau họng, sốt cao, khô miệng, tâm phiền.',
            tags: ['đầu', 'họng', 'sốt']
        },
        { 
            id: 'TE2', name: 'Dịch Môn', meridian: 'Tam Tiêu', 
            type: 'Huyệt Huỳnh (Thủy)',
            function: 'Sơ phong, thanh nhiệt, thông lạc.',
            indications: 'Sốt, đau họng, đau tay, điếc tai.',
            tags: ['sốt', 'tai', 'họng']
        },
        { 
            id: 'TE3', name: 'Trung Chử', meridian: 'Tam Tiêu', 
            type: 'Huyệt Du (Mộc)',
            function: 'Lợi nhĩ, thông khiếu, sơ khí cơ.',
            indications: 'Ù tai, điếc, đau đầu, đau vai gáy, không giơ tay được.',
            tags: ['tai', 'vai gáy', 'đầu']
        },
        { 
            id: 'TE4', name: 'Dương Trì', meridian: 'Tam Tiêu', 
            type: 'Huyệt Nguyên',
            function: 'Thư cân, thông lạc, giải nhiệt.',
            indications: 'Đau cổ tay, đau vai, ù tai, điếc, tiêu khát.',
            tags: ['tay', 'tai', 'vai']
        },
        { 
            id: 'TE5', name: 'Ngoại Quan', meridian: 'Tam Tiêu', 
            type: 'Huyệt Lạc - Giao hội với Dương Duy Mạch',
            function: 'Giải biểu, khu phong, thông kinh lạc.',
            indications: 'Cảm mạo, sốt, đau đầu, đau vai gáy, đau sườn ngực.',
            tags: ['cảm', 'sốt', 'đầu', 'vai']
        },
        { 
            id: 'TE6', name: 'Chi Cấu', meridian: 'Tam Tiêu', 
            type: 'Huyệt Kinh (Hỏa)',
            function: 'Thanh nhiệt, thông phủ khí.',
            indications: 'Táo bón, đau mạn sườn, sốt cao, đau vai.',
            tags: ['táo bón', 'sườn', 'vai']
        },
        { 
            id: 'TE7', name: 'Hội Tông', meridian: 'Tam Tiêu', 
            type: 'Huyệt Khích',
            function: 'Lý khí, an thần, thông nhĩ.',
            indications: 'Điếc, đau tai, động kinh.',
            tags: ['tai', 'thần kinh']
        },
        { 
            id: 'TE10', name: 'Thiên Tỉnh', meridian: 'Tam Tiêu', 
            type: 'Huyệt Hợp (Thổ)',
            function: 'Hóa đàm, tiêu kết, an thần.',
            indications: 'Đau khuỷu tay, đau vai, lao hạch cổ, đau nửa đầu.',
            tags: ['khuỷu tay', 'đầu', 'hạch']
        },
        { 
            id: 'TE14', name: 'Kiên Liêu', meridian: 'Tam Tiêu', 
            type: '',
            function: 'Khu phong thấp, lợi khớp vai.',
            indications: 'Đau khớp vai, không giơ tay được, liệt tay.',
            tags: ['vai', 'tay']
        },
        { 
            id: 'TE17', name: 'Ế Phong', meridian: 'Tam Tiêu', 
            type: 'Giao hội với Đởm kinh',
            function: 'Khu phong, thông nhĩ, khai khiếu.',
            indications: 'Ù tai, điếc, liệt mặt, quai bị, đau răng.',
            tags: ['tai', 'mặt', 'răng']
        },
        { 
            id: 'TE21', name: 'Nhĩ Môn', meridian: 'Tam Tiêu', 
            type: '',
            function: 'Sơ tà nhiệt, thông nhĩ.',
            indications: 'Ù tai, điếc, viêm tai giữa, đau răng.',
            tags: ['tai', 'răng']
        },
        { 
            id: 'TE23', name: 'Ty Trúc Không', meridian: 'Tam Tiêu', 
            type: '',
            function: 'Thanh hỏa, minh mục, trấn kinh.',
            indications: 'Đau đầu, đau mắt đỏ, giật mí mắt, liệt mặt.',
            tags: ['mắt', 'đầu', 'mặt']
        },

        // ============================================================
        // 11. TÚC THIẾU DƯƠNG ĐỞM KINH (GB - Gallbladder Meridian)
        // ============================================================
        { 
            id: 'GB1', name: 'Đồng Tử Liêu', meridian: 'Đởm', 
            type: 'Hội với Thủ Thái Dương, Thủ Thiếu Dương',
            function: 'Khu phong, tiết nhiệt, minh mục.',
            indications: 'Đau đầu, đau mắt đỏ, quáng gà, liệt mặt.',
            tags: ['mắt', 'đầu', 'liệt mặt']
        },
        { 
            id: 'GB2', name: 'Thính Hội', meridian: 'Đởm', 
            type: '',
            function: 'Thông nhĩ, sơ phong, hoạt lạc.',
            indications: 'Ù tai, điếc, viêm tai giữa, liệt mặt, trật khớp hàm.',
            tags: ['tai', 'mặt', 'hàm']
        },
        { 
            id: 'GB8', name: 'Suất Cốc', meridian: 'Đởm', 
            type: 'Hội với Kinh Bàng Quang',
            function: 'Khu phong, trấn kinh, chỉ thống.',
            indications: 'Đau nửa đầu, say rượu, chóng mặt, nôn mửa.',
            tags: ['đau đầu', 'chóng mặt']
        },
        { 
            id: 'GB14', name: 'Dương Bạch', meridian: 'Đởm', 
            type: 'Hội với Kinh Vị, Đại Trường, Tam Tiêu',
            function: 'Khu phong, minh mục.',
            indications: 'Đau đầu vùng trán, quáng gà, sụp mi, liệt mặt.',
            tags: ['đầu', 'mắt', 'mặt']
        },
        { 
            id: 'GB20', name: 'Phong Trì', meridian: 'Đởm', 
            type: 'Hội với Mạch Dương Duy',
            function: 'Khu phong, giải biểu, thanh đầu mắt, sơ can.',
            indications: 'Đau vai gáy, đau đầu, cảm mạo, tăng huyết áp, rối loạn tiền đình.',
            tags: ['vai gáy', 'đầu', 'cảm', 'huyết áp']
        },
        { 
            id: 'GB21', name: 'Kiên Tỉnh', meridian: 'Đởm', 
            type: 'Hội với Kinh Vị, Tam Tiêu, Dương Duy',
            function: 'Thông kinh lạc, lợi cơ quan, hạ khí.',
            indications: 'Đau vai gáy, tắc tia sữa, sa tử cung, đau lưng trên.',
            tags: ['vai gáy', 'sữa', 'lưng']
        },
        { 
            id: 'GB24', name: 'Nhật Nguyệt', meridian: 'Đởm', 
            type: 'Huyệt Mộ của Đởm',
            function: 'Sơ đởm khí, hóa thấp nhiệt.',
            indications: 'Đau mạn sườn, nôn mửa, ợ chua, vàng da.',
            tags: ['sườn', 'gan', 'nôn']
        },
        { 
            id: 'GB30', name: 'Hoàn Khiêu', meridian: 'Đởm', 
            type: 'Hội với Kinh Bàng Quang',
            function: 'Thông kinh lạc, khu phong thấp, lợi yêu đùi.',
            indications: 'Đau thần kinh tọa, đau mông, liệt chi dưới.',
            tags: ['mông', 'chân', 'đau dây thần kinh']
        },
        { 
            id: 'GB31', name: 'Phong Thị', meridian: 'Đởm', 
            type: '',
            function: 'Khu phong thấp, lợi cơ khớp.',
            indications: 'Ngứa toàn thân, dị ứng, liệt nửa người, đau đùi.',
            tags: ['ngứa', 'dị ứng', 'liệt', 'chân']
        },
        { 
            id: 'GB34', name: 'Dương Lăng Tuyền', meridian: 'Đởm', 
            type: 'Huyệt Hợp (Thổ) - Hội của Cân',
            function: 'Thư cân, lợi đởm, thanh thấp nhiệt.',
            indications: 'Đau thần kinh tọa, đau khớp gối, liệt nửa người, đau mạn sườn, đắng miệng.',
            tags: ['đau dây thần kinh', 'khớp', 'liệt', 'sườn']
        },
        { 
            id: 'GB38', name: 'Dương Phụ', meridian: 'Đởm', 
            type: 'Huyệt Kinh (Hỏa)',
            function: 'Thanh can đởm hỏa.',
            indications: 'Đau nửa đầu, đau mắt đuôi, đau hông sườn, đau khớp gối.',
            tags: ['đầu', 'sườn', 'gối']
        },
        { 
            id: 'GB39', name: 'Huyền Chung', meridian: 'Đởm', 
            type: 'Hội của Tủy',
            function: 'Thanh tủy nhiệt, khu phong thấp.',
            indications: 'Đau cổ gáy, liệt chi dưới, đau thần kinh tọa, suy tủy.',
            tags: ['cổ gáy', 'chân', 'tủy']
        },
        { 
            id: 'GB40', name: 'Khâu Hư', meridian: 'Đởm', 
            type: 'Huyệt Nguyên',
            function: 'Sơ can, lợi đởm, thông lạc.',
            indications: 'Đau cổ chân, đau ngực sườn, sưng nách.',
            tags: ['chân', 'ngực', 'nách']
        },
        { 
            id: 'GB41', name: 'Túc Lâm Khấp', meridian: 'Đởm', 
            type: 'Huyệt Du (Mộc) - Giao hội với Đới Mạch',
            function: 'Thanh can hỏa, tiêu đờm nhiệt, thông mạch đới.',
            indications: 'Đau nửa đầu, đau mạn sườn, tắc tia sữa, đau mắt, kinh nguyệt không đều.',
            tags: ['đầu', 'sườn', 'sữa', 'mắt']
        },
        { 
            id: 'GB43', name: 'Hiệp Khê', meridian: 'Đởm', 
            type: 'Huyệt Huỳnh (Thủy)',
            function: 'Thanh nhiệt, tức phong.',
            indications: 'Đau đầu, chóng mặt, đau tai, sốt cao.',
            tags: ['đầu', 'tai', 'sốt']
        },
        { 
            id: 'GB44', name: 'Túc Khiếu Âm', meridian: 'Đởm', 
            type: 'Huyệt Tỉnh (Kim)',
            function: 'Thanh can đởm hỏa, tức phong, khai khiếu.',
            indications: 'Đau đầu, đau mắt, ù tai, mất ngủ, ác mộng.',
            tags: ['đầu', 'mắt', 'ngủ']
        },

        // ============================================================
        // 12. TÚC QUYẾT ÂM CAN KINH (LR - Liver Meridian)
        // ============================================================
        { 
            id: 'LR1', name: 'Đại Đôn', meridian: 'Can', 
            type: 'Huyệt Tỉnh (Mộc)',
            function: 'Sơ tiết quyết khí, lý hạ tiêu, định thần.',
            indications: 'Băng huyết, sa tử cung, thoát vị bẹn, đái dầm, động kinh.',
            tags: ['bụng dưới', 'tiểu', 'kinh nguyệt']
        },
        { 
            id: 'LR2', name: 'Hành Gian', meridian: 'Can', 
            type: 'Huyệt Huỳnh (Hỏa)',
            function: 'Tả can hỏa, thanh đầu mắt, lương huyết.',
            indications: 'Đau đầu đỉnh, mắt đỏ sưng đau, mất ngủ, cáu gắt, rong kinh.',
            tags: ['nóng', 'đau đầu', 'mắt', 'máu']
        },
        { 
            id: 'LR3', name: 'Thái Xung', meridian: 'Can', 
            type: 'Huyệt Nguyên - Huyệt Du (Thổ)',
            function: 'Bình can tức phong, lý huyết, thanh can hỏa.',
            indications: 'Cao huyết áp, đau đầu, chóng mặt, kinh nguyệt không đều, mất ngủ.',
            tags: ['huyết áp', 'stress', 'can', 'ngủ']
        },
        { 
            id: 'LR4', name: 'Trung Phong', meridian: 'Can', 
            type: 'Huyệt Kinh (Kim)',
            function: 'Sơ can, thông lạc.',
            indications: 'Đau cổ chân, đau bụng dưới, tiểu khó, di tinh.',
            tags: ['chân', 'tiểu', 'sinh lý']
        },
        { 
            id: 'LR5', name: 'Lãi Câu', meridian: 'Can', 
            type: 'Huyệt Lạc',
            function: 'Sơ can khí, thanh thấp nhiệt hạ tiêu.',
            indications: 'Ngứa âm hộ, kinh nguyệt không đều, đau cẳng chân.',
            tags: ['phụ khoa', 'chân']
        },
        { 
            id: 'LR8', name: 'Khúc Tuyền', meridian: 'Can', 
            type: 'Huyệt Hợp (Thủy)',
            function: 'Thanh thấp nhiệt, lợi bàng quang.',
            indications: 'Đau đầu gối, di tinh, liệt dương, sa tử cung, tiểu khó.',
            tags: ['gối', 'sinh lý', 'tiểu']
        },
        { 
            id: 'LR13', name: 'Chương Môn', meridian: 'Can', 
            type: 'Huyệt Mộ của Tỳ - Hội của Tạng',
            function: 'Sơ can, kiện tỳ, hóa tích trệ.',
            indications: 'Đầy bụng, đau mạn sườn, nôn mửa, tiêu chảy, gan to lách to.',
            tags: ['bụng', 'sườn', 'tiêu hóa']
        },
        { 
            id: 'LR14', name: 'Kỳ Môn', meridian: 'Can', 
            type: 'Huyệt Mộ của Can',
            function: 'Sơ can lợi khí, hóa đàm tiêu ứ.',
            indications: 'Đau mạn sườn, ợ chua, nôn mửa, viêm gan, trầm cảm.',
            tags: ['sườn', 'gan', 'nôn', 'stress']
        }
    ];

    // Nối dữ liệu vào mảng chính
    window.knowledge.acupoints = window.knowledge.acupoints.concat(dataPart2);
})();
