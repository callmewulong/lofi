<?php
// ==========================================================
// 🔰 Napthe.php - Xử lý gửi yêu cầu nạp thẻ tới Thesieure
// ✅ CHUẨN API Thesieure v2 - ĐÃ FIX LỖI TẠO CHỮ KÝ VÀ XỬ LÝ STATUS CODE
// ==========================================================

// Load cấu hình đối tác (Cần đảm bảo file này định nghĩa PARTNER_ID và SECRET_KEY)
// Vui lòng điều chỉnh đường dẫn file config này cho đúng
require_once __DIR__ . '/../config/partner_key_config.php'; 

// Cấu hình header JSON & CORS
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Headers: Content-Type");

// Hàm Ghi Log (Rất quan trọng cho việc Debug)
function write_log($data, $filename = 'thesieure_request_log.json') {
    $log_path = __DIR__ . '/../log/';
    if (!is_dir($log_path)) mkdir($log_path, 0775, true);
    $entry = "[" . date("Y-m-d H:i:s") . "] " . json_encode($data, JSON_UNESCAPED_UNICODE) . "\n";
    file_put_contents($log_path . $filename, $entry, FILE_APPEND | LOCK_EX);
}

// Chỉ chấp nhận POST
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    echo json_encode(["status" => 405, "message" => "Phương thức không hợp lệ!"]);
    exit();
}

// Lấy dữ liệu đầu vào từ JSON
$data = json_decode(file_get_contents("php://input"), true);

// Kiểm tra dữ liệu cần thiết
if (!isset($data['telco']) || !isset($data['code']) || !isset($data['serial']) || !isset($data['amount'])) {
    echo json_encode(["status" => 400, "message" => "Thiếu dữ liệu cần thiết!"]);
    exit();
}

// Gán biến
$telco  = trim($data['telco']);
$code   = trim($data['code']);
$serial = trim($data['serial']);
$amount = trim($data['amount']);

// Sinh request_id duy nhất
$request_id = time() . substr(md5(uniqid('', true)), 0, 10);


// --------------------------------------------------------------------
// ❌ LỖI TRONG CODE CŨ: Công thức cũ: md5(SECRET_KEY . $code . $serial) là SAI.
// ✅ LOGIC TẠO CHỮ KÝ ĐÚNG (API V2)
// --------------------------------------------------------------------
$dataPostForSign = [
    "request_id" => $request_id,
    "partner_id" => PARTNER_ID,
    "telco"      => $telco,
    "code"       => $code,
    "serial"     => $serial,
    "command"    => "charging"
];

// 1. Sắp xếp mảng theo key (Bắt buộc)
ksort($dataPostForSign); 

// 2. Nối SECRET_KEY (partner_key) với giá trị của các tham số đã sắp xếp
$signString = SECRET_KEY;
foreach ($dataPostForSign as $item) {
    $signString .= $item;
}

// 3. Mã hóa MD5
$finalSign = md5($signString);

// Tạo payload gửi API
$params = [
    "request_id" => $request_id,
    "partner_id" => PARTNER_ID,
    "telco"      => $telco,
    "code"       => $code,
    "serial"     => $serial,
    "amount"     => $amount,
    "sign"       => $finalSign, // Đã sử dụng chữ ký chính xác
    "command"    => "charging"
];
// --------------------------------------------------------------------


// URL endpoint API chính thức
$url = "https://thesieure.com/chargingws/v2";

// Gửi yêu cầu qua CURL
$ch = curl_init();
curl_setopt($ch, CURLOPT_URL, $url);
curl_setopt($ch, CURLOPT_POST, 1);
curl_setopt($ch, CURLOPT_POSTFIELDS, http_build_query($params));
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_TIMEOUT, 30);
curl_setopt($ch, CURLOPT_HTTPHEADER, ["Content-Type: application/x-www-form-urlencoded"]);

$response = curl_exec($ch);
$httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
$curlError = curl_error($ch);
curl_close($ch);

// Kiểm tra phản hồi từ API
if ($httpCode !== 200 || $response === false) {
    write_log(["error" => "Lỗi CURL", "curl_error" => $curlError, "request_data" => $params]);
    echo json_encode(["status" => 500, "message" => "Không thể kết nối đến Thesieure!"]);
    exit();
}

// Phân tích phản hồi
$response_data = json_decode($response, true);

// Nếu JSON không hợp lệ
if (!is_array($response_data)) {
    write_log(["error" => "Phản hồi không hợp lệ", "raw_response" => $response]);
    echo json_encode(["status" => 500, "message" => "Dữ liệu phản hồi không hợp lệ từ Thesieure!"]);
    exit();
}

// ✅ Xử lý trạng thái (theo tài liệu Thesieure: 1, 2, 3, 4, 99)
// LỖI CODE CŨ: sử dụng '00', '03', '04' là sai, mã đúng là 1, 2, 3, 4, 99.
$status = (int)($response_data['status'] ?? null);

switch ($status) {
    case 1:
        // Thẻ đúng (Rất hiếm, thường là chờ 99)
        echo json_encode([
            "status"  => "success",
            "message" => "Nạp thẻ thành công!",
            "data"    => $response_data
        ]);
        break;

    case 99:
        // Thẻ đang chờ xử lý
        echo json_encode([
            "status"  => "pending",
            "message" => "Thẻ đang được xử lý, vui lòng chờ callback!",
            "data"    => $response_data
        ]);
        break;

    case 2:
        // Thẻ sai mệnh giá
        echo json_encode([
            "status"  => "warning",
            "message" => "Thẻ đúng nhưng sai mệnh giá khai báo!",
            "data"    => $response_data
        ]);
        break;

    case 3:
        // Thẻ lỗi hoặc không tồn tại
        echo json_encode([
            "status"  => "error",
            "message" => "Thẻ lỗi hoặc không hợp lệ!",
            "data"    => $response_data
        ]);
        break;
    
    case 4:
        // Hệ thống bảo trì
        echo json_encode([
            "status"  => "error",
            "message" => "Hệ thống bảo trì!",
            "data"    => $response_data
        ]);
        break;

    default:
        // Trạng thái khác / lỗi hệ thống Thesieure
        write_log(["warning" => "Trạng thái không xác định", "response" => $response_data]);
        echo json_encode([
            "status"  => "error",
            "message" => "Lỗi Thesieure: " . ($response_data['message'] ?? 'Trạng thái giao dịch không xác định.'),
            "data"    => $response_data
        ]);
        break;
}
?>
