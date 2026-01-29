/**
 * FILE: js/knowledge/knowledge-acupoints.js
 * CHỨC NĂNG: CSDL Huyệt vị Full (Text-based).
 * DỮ LIỆU: Bao gồm Tên, Kinh, Loại huyệt, Tác dụng, Chủ trị, Từ khóa.
 * PHẦN 1: Khởi tạo + Phế + Đại Trường + Vị.
 */

window.knowledge = window.knowledge || {};

window.knowledge.acupoints = [
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
    },
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
    },
    // ============================================================
    // 13. MẠCH NHÂM (CV/REN - Conception Vessel)
    // ============================================================
    { 
        id: 'CV3', name: 'Trung Cực', meridian: 'Nhâm', 
        type: 'Huyệt Mộ của Bàng Quang',
        function: 'Trợ khí hóa, điều huyết thất, lợi bàng quang.',
        indications: 'Di tinh, liệt dương, viêm bàng quang, bí tiểu, đau bụng kinh.',
        tags: ['tiểu', 'sinh lý', 'bụng dưới']
    },
    { 
        id: 'CV4', name: 'Quan Nguyên', meridian: 'Nhâm', 
        type: 'Huyệt Mộ của Tiểu Trường',
        function: 'Bổ thận, tráng dương, điều khí, hồi dương.',
        indications: 'Suy nhược toàn thân, chân tay lạnh, tiểu đêm, di tinh, cấp cứu.',
        tags: ['bổ dưỡng', 'thận', 'sinh lý', 'cấp cứu']
    },
    { 
        id: 'CV6', name: 'Khí Hải', meridian: 'Nhâm', 
        type: 'Biển của Khí',
        function: 'Ích nguyên khí, bổ thận hư, hòa vinh huyết.',
        indications: 'Suy nhược, đau bụng quanh rốn, tiểu đêm, táo bón, chân tay lạnh.',
        tags: ['bổ khí', 'bụng', 'thận']
    },
    { 
        id: 'CV8', name: 'Thần Khuyết', meridian: 'Nhâm', 
        type: '',
        function: 'Ôn dương, cứu nghịch, vận bài tiết.',
        indications: 'Tiêu chảy cấp (cứu), đau bụng lạnh, sôi bụng, trúng gió.',
        tags: ['tiêu chảy', 'bụng', 'cứu']
    },
    { 
        id: 'CV12', name: 'Trung Quản', meridian: 'Nhâm', 
        type: 'Huyệt Mộ của Vị - Hội của Phủ',
        function: 'Hòa vị khí, hóa tích trệ, điều thăng giáng.',
        indications: 'Đau dạ dày, đầy bụng, nôn mửa, ợ chua, tiêu chảy.',
        tags: ['dạ dày', 'bụng', 'nôn']
    },
    { 
        id: 'CV17', name: 'Đản Trung', meridian: 'Nhâm', 
        type: 'Huyệt Mộ của Tâm Bào - Hội của Khí',
        function: 'Khoan hung, lý khí, thông sữa.',
        indications: 'Đau ngực, hen suyễn, ít sữa, hồi hộp, khó thở.',
        tags: ['ngực', 'sữa', 'hen']
    },
    { 
        id: 'CV22', name: 'Thiên Đột', meridian: 'Nhâm', 
        type: 'Hội với Mạch Âm Duy',
        function: 'Tuyên phế, hóa đàm, lợi yết hầu.',
        indications: 'Ho, hen suyễn, viêm họng, khản tiếng, nghẹn.',
        tags: ['ho', 'họng', 'hen']
    },
    { 
        id: 'CV23', name: 'Liêm Tuyền', meridian: 'Nhâm', 
        type: 'Hội với Mạch Âm Duy',
        function: 'Lợi thiệt, thanh hỏa, hóa đàm.',
        indications: 'Cứng lưỡi, nói khó, chảy dãi, nuốt khó.',
        tags: ['lưỡi', 'nói', 'họng']
    },
    { 
        id: 'CV24', name: 'Thừa Tương', meridian: 'Nhâm', 
        type: 'Hội với kinh Vị, Đại Trường, Đốc',
        function: 'Khu phong, trấn thống.',
        indications: 'Liệt mặt, méo miệng, đau răng, chảy dãi, sưng nướu.',
        tags: ['mặt', 'răng', 'miệng']
    },

    // ============================================================
    // 14. MẠCH ĐỐC (GV/DU - Governing Vessel)
    // ============================================================
    { 
        id: 'GV1', name: 'Trường Cường', meridian: 'Đốc', 
        type: 'Huyệt Lạc',
        function: 'Thông nhâm đốc, điều trường phủ.',
        indications: 'Trĩ, sa trực tràng, tiêu chảy, đau lưng cùng.',
        tags: ['trĩ', 'lưng', 'tiêu hóa']
    },
    { 
        id: 'GV3', name: 'Yêu Dương Quan', meridian: 'Đốc', 
        type: '',
        function: 'Ôn thận, lợi yêu tất.',
        indications: 'Đau thắt lưng, liệt dương, di tinh, kinh nguyệt không đều.',
        tags: ['lưng', 'sinh lý']
    },
    { 
        id: 'GV4', name: 'Mệnh Môn', meridian: 'Đốc', 
        type: '',
        function: 'Bổ nguyên khí, tráng thận dương, cố tinh.',
        indications: 'Đau lưng, lạnh sống lưng, liệt dương, di tinh, khí hư.',
        tags: ['thận', 'lưng', 'sinh lý', 'lạnh']
    },
    { 
        id: 'GV14', name: 'Đại Chùy', meridian: 'Đốc', 
        type: 'Hội của các kinh Dương',
        function: 'Giải biểu, thông dương, thanh tâm, định thần.',
        indications: 'Sốt cao, cảm mạo, ho, hen, cứng cổ gáy, tăng sức đề kháng.',
        tags: ['sốt', 'cảm', 'cổ gáy', 'miễn dịch']
    },
    { 
        id: 'GV15', name: 'Á Môn', meridian: 'Đốc', 
        type: 'Hội với Mạch Dương Duy',
        function: 'Lợi thiệt, thanh thần chí.',
        indications: 'Câm điếc, cứng lưỡi, đau gáy, chảy máu cam.',
        tags: ['nói', 'cổ gáy']
    },
    { 
        id: 'GV16', name: 'Phong Phủ', meridian: 'Đốc', 
        type: 'Hội với Mạch Dương Duy',
        function: 'Khu phong tà, thanh thần chí.',
        indications: 'Đau đầu, đau gáy, trúng gió, ngạt mũi, hay quên.',
        tags: ['đau đầu', 'trúng gió', 'cổ gáy']
    },
    { 
        id: 'GV20', name: 'Bách Hội', meridian: 'Đốc', 
        type: 'Hội của các kinh Dương',
        function: 'Thăng dương, cố thoát, bình can, tức phong.',
        indications: 'Đau đầu, hoa mắt, mất ngủ, sa tử cung, trĩ, choáng ngất.',
        tags: ['đau đầu', 'trĩ', 'thăng dương', 'ngủ']
    },
    { 
        id: 'GV23', name: 'Thượng Tinh', meridian: 'Đốc', 
        type: '',
        function: 'Tàn phong nhiệt, thanh tỵ khiếu.',
        indications: 'Chảy máu cam, ngạt mũi, đau mắt đỏ, đau đầu.',
        tags: ['mũi', 'mắt', 'đầu']
    },
    { 
        id: 'GV26', name: 'Nhân Trung', meridian: 'Đốc', 
        type: 'Hội với kinh Vị, Đại Trường',
        function: 'Khai khiếu, thanh nhiệt, định thần.',
        indications: 'Ngất, choáng, trụy mạch, méo miệng, đau lưng cấp.',
        tags: ['cấp cứu', 'ngất', 'lưng', 'mặt']
    },

    // ============================================================
    // 15. HUYỆT NGOÀI KINH (EX - Extra Points)
    // ============================================================
    { 
        id: 'EX-HN1', name: 'Tứ Thần Thông', meridian: 'Ngoài Kinh', 
        type: 'Vùng Đầu',
        function: 'Trấn tĩnh, an thần, minh mục.',
        indications: 'Đau đầu, chóng mặt, mất ngủ, suy giảm trí nhớ.',
        tags: ['đầu', 'ngủ', 'trí nhớ']
    },
    { 
        id: 'EX-HN3', name: 'Ấn Đường', meridian: 'Ngoài Kinh', 
        type: 'Vùng Mặt',
        function: 'Trừ phong nhiệt, định thần chí.',
        indications: 'Đau đầu, viêm xoang, mất ngủ, trẻ em kinh phong.',
        tags: ['đầu', 'xoang', 'ngủ']
    },
    { 
        id: 'EX-HN5', name: 'Thái Dương', meridian: 'Ngoài Kinh', 
        type: 'Vùng Đầu',
        function: 'Sơ giải đầu phong, minh mục, chỉ thống.',
        indications: 'Đau đầu, đau nửa đầu, đau mắt, liệt mặt.',
        tags: ['đầu', 'mắt']
    },
    { 
        id: 'EX-HN', name: 'An Miên', meridian: 'Ngoài Kinh', 
        type: 'Vùng Cổ (Sau tai)',
        function: 'An thần, định chí.',
        indications: 'Mất ngủ, đau đầu, chóng mặt, hồi hộp.',
        tags: ['ngủ', 'thần kinh']
    },
    { 
        id: 'EX-UE7', name: 'Yêu Thống', meridian: 'Ngoài Kinh', 
        type: 'Vùng Tay',
        function: 'Khu phong, hoạt lạc, chỉ thống.',
        indications: 'Đau lưng cấp, giãn dây chằng thắt lưng.',
        tags: ['lưng', 'cấp cứu']
    },
    { 
        id: 'EX-UE9', name: 'Bát Tà', meridian: 'Ngoài Kinh', 
        type: 'Vùng Tay (Kẽ ngón)',
        function: 'Thanh nhiệt, khu phong, thông lạc.',
        indications: 'Tê ngón tay, sưng đau bàn tay, đau đầu, đau răng.',
        tags: ['tay', 'tê']
    },
    { 
        id: 'EX-UE11', name: 'Thập Tuyên', meridian: 'Ngoài Kinh', 
        type: 'Vùng Tay (Đầu ngón)',
        function: 'Khai khiếu, thanh nhiệt, tức phong.',
        indications: 'Sốt cao, say nắng, tê đầu ngón tay, cấp cứu ngất.',
        tags: ['sốt', 'cấp cứu', 'tê']
    },
    { 
        id: 'EX-LE2', name: 'Hạc Đỉnh', meridian: 'Ngoài Kinh', 
        type: 'Vùng Chân (Trên gối)',
        function: 'Thông lợi khớp gối.',
        indications: 'Đau khớp gối, yếu chân, liệt chi dưới.',
        tags: ['gối', 'chân']
    },
    { 
        id: 'EX-LE4', name: 'Nội Tất Nhãn', meridian: 'Ngoài Kinh', 
        type: 'Vùng Chân (Gối)',
        function: 'Thông lợi khớp gối.',
        indications: 'Đau khớp gối, sưng gối, viêm khớp.',
        tags: ['gối']
    },
    { 
        id: 'EX-LE6', name: 'Đởm Nang', meridian: 'Ngoài Kinh', 
        type: 'Vùng Chân',
        function: 'Lợi đởm, thông ống mật.',
        indications: 'Viêm túi mật, giun chui ống mật, đau mạn sườn.',
        tags: ['đởm', 'mật', 'sườn']
    },
    { 
        id: 'EX-B2', name: 'Giáp Tích', meridian: 'Ngoài Kinh', 
        type: 'Vùng Lưng (Cạnh cột sống)',
        function: 'Điều chỉnh chức năng tạng phủ tương ứng.',
        indications: 'Đau lưng, đau cột sống, bệnh lý tạng phủ theo đốt sống.',
        tags: ['lưng', 'cột sống']
    }
];

// Danh sách kinh lạc để lọc
window.knowledge.meridians = [
    'Phế', 'Đại Trường', 'Vị', 'Tỳ', 'Tâm', 'Tiểu Trường', 
    'Bàng Quang', 'Thận', 'Tâm Bào', 'Tam Tiêu', 'Đởm', 'Can', 
    'Nhâm', 'Đốc', 'Ngoài Kinh'
];
