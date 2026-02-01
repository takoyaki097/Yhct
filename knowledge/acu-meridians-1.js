/**
 * FILE: knowledge/acu-meridians-1.js
 * CHỨC NĂNG: Dữ liệu Huyệt vị - Phần 1 (6 Kinh đầu: Phế, Đại Trường, Vị, Tỳ, Tâm, Tiểu Trường)
 * CƠ CHẾ: Tự động nối tiếp vào mảng window.knowledge.acupoints
 */

window.knowledge = window.knowledge || {};
window.knowledge.acupoints = window.knowledge.acupoints || [];

(function() {
    const dataPart1 = [
        // ============================================================
        // 1. THỦ THÁI ÂM PHẾ KINH (LU - Lung Meridian)
        // ============================================================
        { 
            id: 'LU1', name: 'Trung Phủ', meridian: 'Phế', 
            type: 'Huyệt Mộ của Phế',
            function: 'Thanh tuyên phế khí, tả hung trung nhiệt.',
            indications: 'Ho, hen suyễn, đau tức ngực, viêm phế quản, đau vai.',
            tags: ['ho', 'hen', 'ngực', 'viêm phế quản']
        },
        { 
            id: 'LU2', name: 'Vân Môn', meridian: 'Phế', 
            type: '',
            function: 'Tuyên phế, chỉ khái, bình suyễn.',
            indications: 'Ho, hen, đau ngực, đau vai.',
            tags: ['ho', 'vai']
        },
        { 
            id: 'LU3', name: 'Thiên Phủ', meridian: 'Phế', 
            type: '',
            function: 'Tuyên thông phế khí.',
            indications: 'Hen suyễn, chảy máu cam, đau cánh tay.',
            tags: ['máu cam', 'tay']
        },
        { 
            id: 'LU4', name: 'Hiệp Bạch', meridian: 'Phế', 
            type: '',
            function: 'Khoan hung, lý khí.',
            indications: 'Đau tim, đau ngực, ho, khó thở.',
            tags: ['tim', 'ngực']
        },
        { 
            id: 'LU5', name: 'Xích Trạch', meridian: 'Phế', 
            type: 'Huyệt Hợp (Thủy)',
            function: 'Thanh nhiệt thượng tiêu, giáng khí nghịch, trừ đàm.',
            indications: 'Ho ra máu, sốt cao, co giật, đau khuỷu tay, viêm họng.',
            tags: ['sốt', 'ho máu', 'khuỷu tay', 'co giật']
        },
        { 
            id: 'LU6', name: 'Khổng Tối', meridian: 'Phế', 
            type: 'Huyệt Khích',
            function: 'Nhuận phế, chỉ huyết, thanh nhiệt.',
            indications: 'Ho ra máu, mất tiếng, viêm họng, trĩ.',
            tags: ['máu', 'họng', 'trĩ']
        },
        { 
            id: 'LU7', name: 'Liệt Khuyết', meridian: 'Phế', 
            type: 'Huyệt Lạc - Tổng huyệt đầu gáy',
            function: 'Tuyên phế, khu phong, thông kinh lạc.',
            indications: 'Đau đầu, cứng cổ gáy, liệt mặt, ho, viêm họng, tiểu máu.',
            tags: ['đau đầu', 'cổ gáy', 'liệt mặt', 'cảm']
        },
        { 
            id: 'LU8', name: 'Kinh Cừ', meridian: 'Phế', 
            type: 'Huyệt Kinh (Kim)',
            function: 'Tuyên phế, lợi yết hầu.',
            indications: 'Ho, đau họng, đau cổ tay, sốt không ra mồ hôi.',
            tags: ['họng', 'tay', 'sốt']
        },
        { 
            id: 'LU9', name: 'Thái Uyên', meridian: 'Phế', 
            type: 'Huyệt Nguyên - Huyệt Du (Thổ) - Hội của Mạch',
            function: 'Bổ phế, hóa đàm, chỉ khái, lý huyết.',
            indications: 'Ho, nhiều đàm, đau ngực, mạch yếu (vô mạch), đau cổ tay.',
            tags: ['bổ phế', 'đàm', 'mạch', 'ho']
        },
        { 
            id: 'LU10', name: 'Ngư Tế', meridian: 'Phế', 
            type: 'Huyệt Huỳnh (Hỏa)',
            function: 'Thanh phế nhiệt, lợi yết hầu.',
            indications: 'Đau họng, mất tiếng, sốt, ho ra máu.',
            tags: ['họng', 'sốt', 'mất tiếng']
        },
        { 
            id: 'LU11', name: 'Thiếu Thương', meridian: 'Phế', 
            type: 'Huyệt Tỉnh (Mộc)',
            function: 'Sơ tiết hỏa tà, lợi yết hầu, khai khiếu.',
            indications: 'Đau họng, sốt cao, trúng gió, chảy máu cam, cấp cứu ngất.',
            tags: ['cấp cứu', 'sốt', 'họng', 'trúng gió']
        },

        // ============================================================
        // 2. THỦ DƯƠNG MINH ĐẠI TRƯỜNG KINH (LI - Large Intestine)
        // ============================================================
        { 
            id: 'LI1', name: 'Thương Dương', meridian: 'Đại Trường', 
            type: 'Huyệt Tỉnh (Kim)',
            function: 'Thanh nhiệt, khai khiếu, sơ tiết tà nhiệt.',
            indications: 'Đau răng, đau họng, sốt cao, ngất xỉu, ngón tay tê.',
            tags: ['răng', 'sốt', 'ngất']
        },
        { 
            id: 'LI2', name: 'Nhị Gian', meridian: 'Đại Trường', 
            type: 'Huyệt Huỳnh (Thủy)',
            function: 'Tán tà nhiệt, lợi họng.',
            indications: 'Đau răng, chảy máu cam, đau họng.',
            tags: ['răng', 'mũi', 'họng']
        },
        { 
            id: 'LI3', name: 'Tam Gian', meridian: 'Đại Trường', 
            type: 'Huyệt Du (Mộc)',
            function: 'Tiết nhiệt, lợi yết.',
            indications: 'Đau răng, đau họng, đầy bụng, sôi bụng.',
            tags: ['bụng', 'răng']
        },
        { 
            id: 'LI4', name: 'Hợp Cốc', meridian: 'Đại Trường', 
            type: 'Huyệt Nguyên - Tổng huyệt vùng mặt',
            function: 'Trấn thống, thanh tiết phế khí, thông giáng trường vị.',
            indications: 'Đau đầu, đau răng, liệt mặt, sốt, cảm mạo, đau bụng, kích thích đẻ.',
            tags: ['giảm đau', 'mặt', 'răng', 'cảm', 'bụng']
        },
        { 
            id: 'LI5', name: 'Dương Khê', meridian: 'Đại Trường', 
            type: 'Huyệt Kinh (Hỏa)',
            function: 'Thanh nhiệt, khu phong.',
            indications: 'Đau cổ tay, đau mắt đỏ, đau răng, đau đầu.',
            tags: ['tay', 'mắt', 'đầu']
        },
        { 
            id: 'LI6', name: 'Thiên Lịch', meridian: 'Đại Trường', 
            type: 'Huyệt Lạc',
            function: 'Thanh phế khí, điều thủy đạo.',
            indications: 'Chảy máu cam, điếc tai, phù thũng.',
            tags: ['tai', 'mũi', 'phù']
        },
        { 
            id: 'LI7', name: 'Ôn Lưu', meridian: 'Đại Trường', 
            type: 'Huyệt Khích',
            function: 'Thanh nhiệt, tiêu sưng.',
            indications: 'Đau đầu, sưng mặt, đau vai, sôi bụng.',
            tags: ['đầu', 'mặt', 'bụng']
        },
        { 
            id: 'LI10', name: 'Thủ Tam Lý', meridian: 'Đại Trường', 
            type: '',
            function: 'Thông kinh lạc, lợi tràng vị.',
            indications: 'Đau vai cánh tay, liệt tay, đau bụng, nôn mửa.',
            tags: ['tay', 'liệt', 'bụng']
        },
        { 
            id: 'LI11', name: 'Khúc Trì', meridian: 'Đại Trường', 
            type: 'Huyệt Hợp (Thổ)',
            function: 'Khu phong, thanh nhiệt, hòa vinh dưỡng huyết, tiêu độc.',
            indications: 'Sốt cao, dị ứng, mẩn ngứa, tăng huyết áp, liệt tay.',
            tags: ['ngứa', 'huyết áp', 'sốt', 'dị ứng']
        },
        { 
            id: 'LI14', name: 'Tí Nhu', meridian: 'Đại Trường', 
            type: '',
            function: 'Thông lạc, minh mục.',
            indications: 'Đau vai, bệnh về mắt, lao hạch.',
            tags: ['vai', 'mắt']
        },
        { 
            id: 'LI15', name: 'Kiên Ngung', meridian: 'Đại Trường', 
            type: '',
            function: 'Thanh nhiệt, tán phong, thông lợi khớp vai.',
            indications: 'Đau khớp vai, liệt tay, mẩn ngứa.',
            tags: ['vai', 'tay']
        },
        { 
            id: 'LI20', name: 'Nghênh Hương', meridian: 'Đại Trường', 
            type: 'Hội với kinh Vị',
            function: 'Thông khiếu, tán phong nhiệt.',
            indications: 'Ngạt mũi, viêm mũi xoang, chảy máu cam, liệt mặt.',
            tags: ['mũi', 'xoang', 'mặt']
        },

        // ============================================================
        // 3. TÚC DƯƠNG MINH VỊ KINH (ST - Stomach Meridian)
        // ============================================================
        { 
            id: 'ST1', name: 'Thừa Khấp', meridian: 'Vị', 
            type: '',
            function: 'Khu phong, tản hỏa, minh mục.',
            indications: 'Đau mắt đỏ, quáng gà, chảy nước mắt, liệt mặt.',
            tags: ['mắt', 'liệt mặt']
        },
        { 
            id: 'ST2', name: 'Tứ Bạch', meridian: 'Vị', 
            type: '',
            function: 'Khu phong, minh mục, lợi đởm.',
            indications: 'Đau mắt, liệt mặt, đau đầu, giun chui ống mật.',
            tags: ['mắt', 'liệt mặt']
        },
        { 
            id: 'ST4', name: 'Địa Thương', meridian: 'Vị', 
            type: '',
            function: 'Khu phong tà, thông khí trệ.',
            indications: 'Liệt mặt, méo miệng, chảy dãi, đau răng.',
            tags: ['mặt', 'miệng', 'răng']
        },
        { 
            id: 'ST6', name: 'Giáp Xa', meridian: 'Vị', 
            type: '',
            function: 'Sơ phong, hoạt lạc, lợi răng hàm.',
            indications: 'Đau răng, cứng hàm, liệt mặt, quai bị.',
            tags: ['răng', 'hàm', 'quai bị']
        },
        { 
            id: 'ST7', name: 'Hạ Quan', meridian: 'Vị', 
            type: '',
            function: 'Sơ phong, hoạt lạc, thông khiếu.',
            indications: 'Ù tai, điếc, đau răng, trật khớp hàm.',
            tags: ['tai', 'hàm']
        },
        { 
            id: 'ST8', name: 'Đầu Duy', meridian: 'Vị', 
            type: '',
            function: 'Khu phong, tiết hỏa, chỉ thống.',
            indications: 'Đau đầu, chóng mặt, chảy nước mắt.',
            tags: ['đầu', 'mắt']
        },
        { 
            id: 'ST21', name: 'Lương Môn', meridian: 'Vị', 
            type: '',
            function: 'Điều trung khí, hóa tích trệ.',
            indications: 'Đau dạ dày, nôn mửa, chán ăn.',
            tags: ['dạ dày', 'ăn']
        },
        { 
            id: 'ST25', name: 'Thiên Khu', meridian: 'Vị', 
            type: 'Huyệt Mộ của Đại Trường',
            function: 'Sơ điều đại trường, lý khí tiêu trệ.',
            indications: 'Đau bụng, tiêu chảy, táo bón, kiết lỵ, kinh nguyệt không đều.',
            tags: ['bụng', 'tiêu chảy', 'táo bón']
        },
        { 
            id: 'ST29', name: 'Quy Lai', meridian: 'Vị', 
            type: '',
            function: 'Điều kinh, lý hạ tiêu.',
            indications: 'Đau bụng kinh, bế kinh, sa tử cung, thoát vị bẹn.',
            tags: ['kinh nguyệt', 'bụng dưới']
        },
        { 
            id: 'ST34', name: 'Lương Khâu', meridian: 'Vị', 
            type: 'Huyệt Khích',
            function: 'Thông điều vị khí, khu phong hóa thấp.',
            indications: 'Đau dạ dày cấp, đau đầu gối, tắc tia sữa.',
            tags: ['dạ dày', 'gối', 'sữa']
        },
        { 
            id: 'ST35', name: 'Độc Tỵ', meridian: 'Vị', 
            type: '',
            function: 'Thông kinh lạc, lợi khớp gối.',
            indications: 'Đau khớp gối, viêm khớp gối.',
            tags: ['gối']
        },
        { 
            id: 'ST36', name: 'Túc Tam Lý', meridian: 'Vị', 
            type: 'Huyệt Hợp (Thổ) - Tổng huyệt bụng trên',
            function: 'Lý tỳ vị, điều trung khí, bổ hư nhược, khu phong hóa thấp.',
            indications: 'Đau dạ dày, nôn mửa, tiêu hóa kém, suy nhược cơ thể, liệt chân.',
            tags: ['dạ dày', 'bổ dưỡng', 'tiêu hóa', 'chân']
        },
        { 
            id: 'ST37', name: 'Thượng Cự Hư', meridian: 'Vị', 
            type: 'Huyệt Hợp dưới của Đại Trường',
            function: 'Lý tỳ vị, thanh thấp nhiệt.',
            indications: 'Đau bụng, tiêu chảy, viêm ruột thừa, liệt chân.',
            tags: ['ruột', 'bụng', 'chân']
        },
        { 
            id: 'ST39', name: 'Hạ Cự Hư', meridian: 'Vị', 
            type: 'Huyệt Hợp dưới của Tiểu Trường',
            function: 'Lý tiểu trường, trừ thấp nhiệt.',
            indications: 'Đau bụng dưới, kiết lỵ, viêm tuyến vú, liệt chân.',
            tags: ['bụng', 'kiết lỵ']
        },
        { 
            id: 'ST40', name: 'Phong Long', meridian: 'Vị', 
            type: 'Huyệt Lạc',
            function: 'Hóa đàm thấp, định thần chí, hòa vị khí.',
            indications: 'Ho có đờm, hen suyễn, béo phì, chóng mặt, điên cuồng.',
            tags: ['đàm', 'béo phì', 'hen', 'chóng mặt']
        },
        { 
            id: 'ST41', name: 'Giải Khê', meridian: 'Vị', 
            type: 'Huyệt Kinh (Hỏa)',
            function: 'Hóa thấp trệ, thanh vị nhiệt.',
            indications: 'Đau cổ chân, đầy bụng, đau đầu, mặt đỏ.',
            tags: ['chân', 'đầu', 'bụng']
        },
        { 
            id: 'ST43', name: 'Hãm Cốc', meridian: 'Vị', 
            type: 'Huyệt Du (Mộc)',
            function: 'Kiện tỳ, lợi thấp.',
            indications: 'Sưng mặt, đau bụng, phù bàn chân.',
            tags: ['phù', 'bụng']
        },
        { 
            id: 'ST44', name: 'Nội Đình', meridian: 'Vị', 
            type: 'Huyệt Huỳnh (Thủy)',
            function: 'Thanh vị nhiệt, hóa tích trệ.',
            indications: 'Đau răng, chảy máu cam, đau bụng, sốt, đau họng.',
            tags: ['răng', 'sốt', 'bụng', 'họng']
        },
        { 
            id: 'ST45', name: 'Lệ Đoài', meridian: 'Vị', 
            type: 'Huyệt Tỉnh (Kim)',
            function: 'Sơ tiết tà nhiệt, trấn định thần chí.',
            indications: 'Mất ngủ, hay mơ, sốt cao, đau răng, chảy máu cam.',
            tags: ['mất ngủ', 'sốt', 'mộng mị']
        },

        // ============================================================
        // 4. TÚC THÁI ÂM TỲ KINH (SP - Spleen Meridian)
        // ============================================================
        { 
            id: 'SP1', name: 'Ẩn Bạch', meridian: 'Tỳ', 
            type: 'Huyệt Tỉnh (Mộc)',
            function: 'Kiện tỳ, thống huyết, ninh tâm, định thần.',
            indications: 'Rong kinh, băng huyết, đầy bụng, mất ngủ, hay mơ, trẻ em kinh phong.',
            tags: ['kinh nguyệt', 'máu', 'ngủ', 'bụng']
        },
        { 
            id: 'SP2', name: 'Đại Đô', meridian: 'Tỳ', 
            type: 'Huyệt Huỳnh (Hỏa)',
            function: 'Kiện tỳ, hòa trung, thanh nhiệt.',
            indications: 'Đầy bụng, đau dạ dày, sốt không ra mồ hôi, người nặng nề.',
            tags: ['bụng', 'sốt', 'dạ dày']
        },
        { 
            id: 'SP3', name: 'Thái Bạch', meridian: 'Tỳ', 
            type: 'Huyệt Nguyên - Huyệt Du (Thổ)',
            function: 'Ích tỳ thổ, tiêu đàm, điều khí cơ.',
            indications: 'Đau dạ dày, đầy bụng, tiêu chảy, táo bón, người nặng nề, đau khớp.',
            tags: ['tỳ hư', 'bụng', 'tiêu hóa', 'khớp']
        },
        { 
            id: 'SP4', name: 'Công Tôn', meridian: 'Tỳ', 
            type: 'Huyệt Lạc - Giao hội với Mạch Xung',
            function: 'Lý khí, hòa vị, điều huyết.',
            indications: 'Đau dạ dày, nôn mửa, đau bụng, kinh nguyệt không đều, đau tim.',
            tags: ['dạ dày', 'tim', 'kinh nguyệt']
        },
        { 
            id: 'SP5', name: 'Thương Khâu', meridian: 'Tỳ', 
            type: 'Huyệt Kinh (Kim)',
            function: 'Kiện tỳ hóa thấp.',
            indications: 'Đầy bụng, sôi bụng, tiêu chảy, đau cổ chân, lưỡi cứng.',
            tags: ['bụng', 'chân', 'lưỡi']
        },
        { 
            id: 'SP6', name: 'Tam Âm Giao', meridian: 'Tỳ', 
            type: 'Giao hội 3 kinh âm chân (Tỳ, Can, Thận)',
            function: 'Bổ tỳ thổ, dưỡng can thận, điều huyết thất, khu phong thấp.',
            indications: 'Rối loạn kinh nguyệt, mất ngủ, di tinh, đái dầm, trướng bụng, suy nhược.',
            tags: ['phụ khoa', 'thận', 'ngủ', 'bổ dưỡng']
        },
        { 
            id: 'SP8', name: 'Địa Cơ', meridian: 'Tỳ', 
            type: 'Huyệt Khích',
            function: 'Hòa tỳ lý huyết, điều bào cung.',
            indications: 'Đau bụng kinh, kinh nguyệt không đều, đau lưng, bí tiểu.',
            tags: ['kinh nguyệt', 'lưng', 'tiểu']
        },
        { 
            id: 'SP9', name: 'Âm Lăng Tuyền', meridian: 'Tỳ', 
            type: 'Huyệt Hợp (Thủy)',
            function: 'Vận trung tiêu, hóa thấp trệ, lợi thủy.',
            indications: 'Phù thũng, bí tiểu, viêm đường tiết niệu, đau đầu gối, chán ăn.',
            tags: ['thấp', 'phù', 'tiểu', 'gối']
        },
        { 
            id: 'SP10', name: 'Huyết Hải', meridian: 'Tỳ', 
            type: '',
            function: 'Điều huyết, thanh huyết, tuyên thông hạ tiêu.',
            indications: 'Kinh nguyệt không đều, ngứa dị ứng, mề đay, đau mặt trong đùi.',
            tags: ['máu', 'ngứa', 'dị ứng', 'kinh nguyệt']
        },
        { 
            id: 'SP15', name: 'Đại Hoành', meridian: 'Tỳ', 
            type: '',
            function: 'Ôn trung, lý khí, thông điều phủ khí.',
            indications: 'Táo bón, tiêu chảy, đau bụng, liệt ruột.',
            tags: ['táo bón', 'bụng']
        },
        { 
            id: 'SP21', name: 'Đại Bao', meridian: 'Tỳ', 
            type: 'Đại Lạc của Tỳ',
            function: 'Thống nhiếp chư lạc, điều khí huyết.',
            indications: 'Đau toàn thân, yếu sức, đau mạn sườn, khó thở.',
            tags: ['đau', 'sườn', 'mệt']
        },

        // ============================================================
        // 5. THỦ THIẾU ÂM TÂM KINH (HT - Heart Meridian)
        // ============================================================
        { 
            id: 'HT1', name: 'Cực Tuyền', meridian: 'Tâm', 
            type: '',
            function: 'Khoan hung, lý khí, thông kinh lạc.',
            indications: 'Đau tim, hôi nách, liệt tay, đau sườn ngực.',
            tags: ['tim', 'nách', 'tay']
        },
        { 
            id: 'HT3', name: 'Thiếu Hải', meridian: 'Tâm', 
            type: 'Huyệt Hợp (Thủy)',
            function: 'Sơ tâm khí, hóa đàm, ninh thần.',
            indications: 'Đau khuỷu tay, đau vùng tim, run tay, hay quên.',
            tags: ['khuỷu tay', 'tim', 'run']
        },
        { 
            id: 'HT4', name: 'Linh Đạo', meridian: 'Tâm', 
            type: 'Huyệt Kinh (Kim)',
            function: 'An thần, định chí, thanh tâm.',
            indications: 'Đau tim, mất tiếng đột ngột, đau cổ tay.',
            tags: ['tim', 'tiếng', 'tay']
        },
        { 
            id: 'HT5', name: 'Thông Lý', meridian: 'Tâm', 
            type: 'Huyệt Lạc',
            function: 'Ninh tâm, an thần, hòa vinh, lợi thiệt.',
            indications: 'Tim đập nhanh, hồi hộp, mất tiếng, cứng lưỡi, đau cổ tay.',
            tags: ['tim', 'lưỡi', 'tiếng']
        },
        { 
            id: 'HT6', name: 'Âm Khích', meridian: 'Tâm', 
            type: 'Huyệt Khích',
            function: 'Thanh tâm hỏa, an thần chí, cố biểu.',
            indications: 'Đau vùng tim kịch liệt, chảy máu mũi, ra mồ hôi trộm.',
            tags: ['tim', 'máu', 'mồ hôi']
        },
        { 
            id: 'HT7', name: 'Thần Môn', meridian: 'Tâm', 
            type: 'Huyệt Nguyên - Huyệt Du (Thổ)',
            function: 'Thanh tâm nhiệt, an thần chí, điều khí nghịch.',
            indications: 'Mất ngủ, hồi hộp, lo âu, tim đập nhanh, hay quên, hysteria.',
            tags: ['tim', 'ngủ', 'stress', 'an thần']
        },
        { 
            id: 'HT8', name: 'Thiếu Phủ', meridian: 'Tâm', 
            type: 'Huyệt Huỳnh (Hỏa)',
            function: 'Thanh tâm hỏa, trừ thấp nhiệt.',
            indications: 'Tiểu dầm, tiểu khó, ngứa âm hộ, lòng bàn tay nóng.',
            tags: ['tiểu', 'nóng', 'ngứa']
        },
        { 
            id: 'HT9', name: 'Thiếu Xung', meridian: 'Tâm', 
            type: 'Huyệt Tỉnh (Mộc)',
            function: 'Khai khiếu, thanh thần, tiết nhiệt.',
            indications: 'Sốt cao, hôn mê, trúng gió, đau vùng tim, cấp cứu.',
            tags: ['cấp cứu', 'tim', 'sốt', 'ngất']
        },

        // ============================================================
        // 6. THỦ THÁI DƯƠNG TIỂU TRƯỜNG KINH (SI - Small Intestine)
        // ============================================================
        { 
            id: 'SI1', name: 'Thiếu Trạch', meridian: 'Tiểu Trường', 
            type: 'Huyệt Tỉnh (Kim)',
            function: 'Thanh nhiệt, thông sữa, khai khiếu.',
            indications: 'Thiếu sữa, đau mắt đỏ, đau đầu, sốt cao, hôn mê.',
            tags: ['sữa', 'mắt', 'sốt']
        },
        { 
            id: 'SI2', name: 'Tiền Cốc', meridian: 'Tiểu Trường', 
            type: 'Huyệt Huỳnh (Thủy)',
            function: 'Thanh nhiệt, tán phong.',
            indications: 'Sốt, đau họng, chảy máu cam, đau ngón tay.',
            tags: ['sốt', 'họng', 'tay']
        },
        { 
            id: 'SI3', name: 'Hậu Khê', meridian: 'Tiểu Trường', 
            type: 'Huyệt Du (Mộc) - Giao hội mạch Đốc',
            function: 'Thanh thần chí, cố biểu, thư cân.',
            indications: 'Đau cứng cổ gáy, đau lưng, ù tai, mồ hôi trộm, sốt rét.',
            tags: ['cổ gáy', 'lưng', 'tai', 'sốt']
        },
        { 
            id: 'SI4', name: 'Uyển Cốt', meridian: 'Tiểu Trường', 
            type: 'Huyệt Nguyên',
            function: 'Thanh thấp nhiệt, sơ tà khí.',
            indications: 'Vàng da, đau cổ tay, đau cứng cổ, đái tháo đường.',
            tags: ['tay', 'cổ', 'vàng da']
        },
        { 
            id: 'SI5', name: 'Dương Cốc', meridian: 'Tiểu Trường', 
            type: 'Huyệt Kinh (Hỏa)',
            function: 'Thanh nhiệt, tiêu sưng.',
            indications: 'Sưng cổ tay, ù tai, điếc tai, sốt cao.',
            tags: ['tay', 'tai', 'sốt']
        },
        { 
            id: 'SI6', name: 'Dưỡng Lão', meridian: 'Tiểu Trường', 
            type: 'Huyệt Khích',
            function: 'Thư cân, minh mục.',
            indications: 'Mắt mờ, đau lưng, đau vai, đau cổ tay cấp.',
            tags: ['mắt', 'lưng', 'tay']
        },
        { 
            id: 'SI7', name: 'Chi Chính', meridian: 'Tiểu Trường', 
            type: 'Huyệt Lạc',
            function: 'Thanh thần chí, giải biểu nhiệt.',
            indications: 'Đau khuỷu tay, hoa mắt, chóng mặt, buồn phiền.',
            tags: ['tay', 'thần kinh']
        },
        { 
            id: 'SI8', name: 'Tiểu Hải', meridian: 'Tiểu Trường', 
            type: 'Huyệt Hợp (Thổ)',
            function: 'Tán phong, trừ thấp, định thần.',
            indications: 'Đau khuỷu tay, đau vai, động kinh, đau thần kinh trụ.',
            tags: ['khuỷu tay', 'vai', 'thần kinh']
        },
        { 
            id: 'SI9', name: 'Kiên Trinh', meridian: 'Tiểu Trường', 
            type: '',
            function: 'Tán kết, khu phong, hoạt lạc.',
            indications: 'Đau khớp vai, không giơ tay được, hôi nách, liệt tay.',
            tags: ['vai', 'nách', 'tay']
        },
        { 
            id: 'SI10', name: 'Nhu Du', meridian: 'Tiểu Trường', 
            type: 'Hội với mạch Dương Duy',
            function: 'Thông lạc, hoạt huyết.',
            indications: 'Đau vai, yếu cánh tay.',
            tags: ['vai', 'tay']
        },
        { 
            id: 'SI11', name: 'Thiên Tông', meridian: 'Tiểu Trường', 
            type: '',
            function: 'Giải uất, thông khí trệ, thông sữa.',
            indications: 'Đau vai, đau lưng trên, viêm tuyến vú, tắc tia sữa.',
            tags: ['vai', 'lưng', 'sữa']
        },
        { 
            id: 'SI18', name: 'Quyền Liêu', meridian: 'Tiểu Trường', 
            type: '',
            function: 'Khu phong, thông lạc, tiêu thũng.',
            indications: 'Liệt mặt, đau răng, co giật cơ mặt, đau dây thần kinh V.',
            tags: ['mặt', 'răng']
        },
        { 
            id: 'SI19', name: 'Thính Cung', meridian: 'Tiểu Trường', 
            type: 'Hội với kinh Tam Tiêu, Đởm',
            function: 'Thông khiếu, thông nhĩ.',
            indications: 'Ù tai, điếc, viêm tai giữa, đau răng.',
            tags: ['tai', 'răng']
        }
    ];

    // Nối dữ liệu vào mảng chính
    window.knowledge.acupoints = window.knowledge.acupoints.concat(dataPart1);
})();
