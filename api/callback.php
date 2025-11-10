<?php
// Cấu hình header để nhận và trả về dữ liệu JSON
header("Content-Type: application/json");

// Hàm ghi log vào file JSON
function write_log_file($data) {
    // 1. Chuyển đổi dữ liệu thành chuỗi JSON
    $log_entry = json_encode($data);
    
    // 2. Thêm dấu thời gian và ngắt dòng
    $log_line = "[" . date("Y-m-d H:i:s") . "] " . $log_entry . "\n";
    
    // 3. Định nghĩa tên và đường dẫn tệp log cố định
    $log_file_path = __DIR__ . '/../log/thesieure_callback_log.json';
    
    // 4. Ghi nội dung vào cuối tệp
    // FILE_APPEND: Thêm vào cuối tệp, không ghi đè
    file_put_contents($log_file_path, $log_line, FILE_APPEND | LOCK_EX);
}

// Kiểm tra phương thức yêu cầu là POST
if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    // Lấy dữ liệu từ yêu cầu
    $input_data = file_get_contents("php://input");
    $data = json_decode($input_data, true);

    // Ghi toàn bộ callback vào file để kiểm tra (Bước quan trọng)
    // Gọi hàm ghi log
    write_log_file($data); 

    // Kiểm tra dữ liệu callback
    if (isset($data['status'])) {
        $status = $data['status'];
        $message = isset($data['message']) ? $data['message'] : 'Không có thông báo';
        
        // --- Nơi Xử Lý Chính Thức ---
        // 1. Kiểm tra Status (1 là thành công, các mã khác xử lý theo yêu cầu)
        if ($status === 1 || $status === '1') { 
            // Ví dụ: Lấy các trường dữ liệu quan trọng
            $request_id = $data['request_id'] ?? null;
            $code = $data['code'] ?? null;
            $serial = $data['serial'] ?? null;
            $amount = $data['amount'] ?? null;

            // --- NƠI CẦN THÊM LOGIC LƯU VÀO DATABASE ---
            // Gọi hàm lưu dữ liệu vào database ở đây
            // update_transaction_status($request_id, $status, $amount); 
            // ---------------------------------------------
            
            // Phản hồi lại cho Thesieure
            echo json_encode(["status" => "success", "message" => "Callback nhận và xử lý thành công"]);
            exit();

        } elseif ($status === 2 || $status === '2') {
            // Thẻ sai mệnh giá
            echo json_encode(["status" => "error", "message" => "Sai mệnh giá thẻ"]);
        } elseif ($status === 3 || $status === '3') {
            // Thẻ lỗi
            echo json_encode(["status" => "error", "message" => "Thẻ lỗi"]);
        } elseif ($status === 4 || $status === '4') {
            // Bảo trì
            echo json_encode(["status" => "error", "message" => "Hệ thống bảo trì, vui lòng thử lại sau"]);
        } elseif ($status === 99 || $status === '99') {
            // Thẻ chờ xử lý
            echo json_encode(["status" => "pending", "message" => "Thẻ đang chờ xử lý"]);
        } else {
            // Trạng thái không hợp lệ
            echo json_encode(["status" => "error", "message" => "Trạng thái giao dịch không hợp lệ"]);
        }
        
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
