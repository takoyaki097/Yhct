/**
 * FILE: knowledge/acu-extra-vessels.js
 * CHỨC NĂNG: Dữ liệu Huyệt vị - Phần 3 (Mạch Nhâm, Mạch Đốc)
 * CƠ CHẾ: Tự động nối tiếp vào mảng window.knowledge.acupoints
 */

window.knowledge = window.knowledge || {};
window.knowledge.acupoints = window.knowledge.acupoints || [];

(function() {
    const dataPart3 = [
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
        }
    ];

    // Nối dữ liệu vào mảng chính
    window.knowledge.acupoints = window.knowledge.acupoints.concat(dataPart3);
})();
