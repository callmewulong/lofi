<?php
// Cấu hình header để nhận và trả về dữ liệu JSON
header("Content-Type: application/json");

// Kiểm tra phương thức yêu cầu là POST
if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    // Lấy dữ liệu từ yêu cầu
    $data = json_decode(file_get_contents("php://input"), true);

    // Kiểm tra dữ liệu callback
    if (isset($data['status'])) {
        $status = $data['status'];
        $message = isset($data['message']) ? $data['message'] : 'Không có thông báo';

        // Ghi nhận hoặc xử lý thông báo callback ở đây
        // Ví dụ, bạn có thể lưu thông tin vào cơ sở dữ liệu hoặc log

        // Phản hồi lại để xác nhận với Thesieure rằng bạn đã nhận được callback
        echo json_encode(["status" => "success", "message" => "Callback nhận thành công"]);
    } else {
        echo json_encode(["status" => "error", "message" => "Thiếu thông tin callback"]);
    }
} else {
    // Nếu không phải là phương thức POST
    echo json_encode(["status" => "error", "message" => "Yêu cầu không hợp lệ"]);
}
?>