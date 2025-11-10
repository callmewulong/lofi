<?php
// Napthe.php - Sử dụng file cấu hình
require_once __DIR__ . '/../config/partner_key_config.php'; // Điều chỉnh đường dẫn theo đúng vị trí của bạn

// Cấu hình header để nhận và trả về dữ liệu JSON
header("Content-Type: application/json");

// Thêm cài đặt CORS (giúp hỗ trợ yêu cầu từ các domain khác)
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Headers: Content-Type");

// Kiểm tra phương thức yêu cầu là POST
if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    // Lấy dữ liệu từ yêu cầu
    $data = json_decode(file_get_contents("php://input"), true);

    // Kiểm tra dữ liệu cần thiết
    if (!isset($data['telco']) || !isset($data['code']) || !isset($data['serial']) || !isset($data['amount'])) {
        echo json_encode(["status" => 400, "message" => "Thiếu dữ liệu cần thiết!"]);
        exit();
    }

    // Lấy giá trị từ dữ liệu yêu cầu
    $telco = $data['telco'];
    $code = $data['code'];
    $serial = $data['serial'];
    $amount = $data['amount'];

    // Tạo chữ ký MD5 (theo format Thesieure)
    $sign = md5(PARTNER_ID . $code . $serial . SECRET_KEY);

    // Tạo dữ liệu gửi yêu cầu
    $params = [
        "request_id" => (string)time(),
        "partner_id" => PARTNER_ID,
        "telco" => $telco,
        "code" => $code,
        "serial" => $serial,
        "amount" => $amount,
        "sign" => $sign,
        "command" => "charging"
    ];

    // Gửi yêu cầu tới Thesieure
    $url = "https://thesieure.com/chargingws/v2";
    $ch = curl_init();
    curl_setopt($ch, CURLOPT_URL, $url);
    curl_setopt($ch, CURLOPT_POST, 1);
    curl_setopt($ch, CURLOPT_POSTFIELDS, http_build_query($params));
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_HTTPHEADER, ["Content-Type: application/x-www-form-urlencoded"]);

    $response = curl_exec($ch);
    $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    curl_close($ch);

    // Kiểm tra kết quả phản hồi từ Thesieure
    if ($httpCode == 200) {
        echo $response;  // Trả về kết quả từ Thesieure
    } else {
        echo json_encode(["status" => 500, "message" => "Lỗi kết nối đến Thesieure!"]);
    }
} else {
    // Nếu không phải phương thức POST
    echo json_encode(["status" => 405, "message" => "Phương thức không hợp lệ!"]);
}
?>
