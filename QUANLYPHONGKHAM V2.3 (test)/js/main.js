/**
 * FILE: main.js
 * CHỨC NĂNG: Điểm khởi chạy của ứng dụng (Entry Point).
 * Tự động chạy khi trang web tải xong để khởi tạo dữ liệu và giao diện.
 */

window.onload = async function() {
    try {
        console.log("Đang khởi động YHCT Pro...");

        // 1. Khởi tạo Cơ sở dữ liệu & Cấu hình (từ database.js)
        // Hàm này sẽ load data từ LocalForage và xử lý migration
        const dbReady = await window.initAppDatabase();
        
        if (!dbReady) {
            console.warn("Khởi tạo DB thất bại hoặc chưa có dữ liệu.");
        }

        // 2. Thiết lập bộ lọc tháng mặc định (từ patient.js)
        if (window.renderMonthFilterList) {
            // Mặc định chọn tháng hiện tại
            window.currentMonthFilter = window.getLocalDate().slice(0, 7); 
            window.renderMonthFilterList();
        }

        // 3. Hiển thị danh sách bệnh nhân (từ patient.js)
        if (window.render) {
            window.render();
        }

        // 4. Cập nhật giao diện Header (từ config.js)
        if (window.updateHeader) {
            window.updateHeader();
        }

        // 5. Khởi tạo các giá trị mặc định cho form khám (từ visit.js)
        if (window.initDefaultValues) {
            window.initDefaultValues();
        }

        // 6. Gán sự kiện cho các Input nhập số (từ visit.js)
        if (window.setupNativeInputs) {
            window.setupNativeInputs();
        }

        // 7. Inject các nút chức năng bổ sung (nếu cần thiết ngay lúc đầu)
        // Lưu ý: Các nút trong BackupModal đã được hardcode trong HTML mới nên không cần inject nữa.
        // Keypad Modal đã được inject qua ui-helpers khi gọi openKeypad.

        // 8. Fix lỗi hiển thị cho iPad (nếu phát hiện)
        if (window.isIPad && window.isIPad()) {
            document.querySelectorAll('.song-input, textarea').forEach(input => {
                input.classList.add('ipad-input-fix');
            });
        }

        console.log("Ứng dụng đã sẵn sàng!");

    } catch (err) {
        console.error("Lỗi khởi động app (main.js):", err);
        alert("Có lỗi khi khởi động: " + err.message);
    }
};

