/**
 * FILE: knowledge/acu-extra-points.js
 * CHỨC NĂNG: Dữ liệu Huyệt vị - Phần 4 (Huyệt Ngoài Kinh & Danh sách Kinh Lạc)
 * CƠ CHẾ: Tự động nối tiếp vào mảng window.knowledge.acupoints và khởi tạo danh sách kinh.
 */

window.knowledge = window.knowledge || {};
window.knowledge.acupoints = window.knowledge.acupoints || [];

(function() {
    const dataPart4 = [
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

    // Nối dữ liệu vào mảng chính
    window.knowledge.acupoints = window.knowledge.acupoints.concat(dataPart4);

    // ============================================================
    // DANH SÁCH KINH LẠC (Dùng cho bộ lọc Sidebar)
    // ============================================================
    window.knowledge.meridians = [
        'Phế', 'Đại Trường', 'Vị', 'Tỳ', 'Tâm', 'Tiểu Trường', 
        'Bàng Quang', 'Thận', 'Tâm Bào', 'Tam Tiêu', 'Đởm', 'Can', 
        'Nhâm', 'Đốc', 'Ngoài Kinh'
    ];
})();
