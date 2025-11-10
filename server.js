// ✨ Lofi Family - API Gạch Thẻ Thesieure (By Wu Long)
import express from "express";
import bodyParser from "body-parser";
import axios from "axios";
import md5 from "md5";
import cors from "cors";

const app = express();
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// 🔐 Cấu hình tài khoản Thesieure
const PARTNER_ID = "69719821569"; // 🆔 ID API của bạn
const SECRET_KEY = "e94612d92cf38ba2237bfc90895dd2dc"; // 🔑 Secret Key của bạn
const API_URL = "https://thesieure.com/chargingws/v2";

// 💳 Route xử lý nạp thẻ
app.post("/api/napthe", async (req, res) => {
  try {
    const { telco, code, serial, amount } = req.body;

    if (!telco || !code || !serial || !amount) {
      return res.status(400).json({ status: 400, message: "Thiếu dữ liệu cần thiết!" });
    }

    const request_id = Date.now().toString();
    const command = "charging";

    // 🧮 Tạo chữ ký MD5 theo đúng chuẩn mới:
    // B1: Sắp xếp các trường theo thứ tự a-z (ksort)
    // B2: Ghép SECRET_KEY + tất cả giá trị (đã sắp xếp)
    const dataToSign = {
      request_id,
      code,
      partner_id: PARTNER_ID,
      serial,
      telco,
      command,
    };

    const sortedValues = Object.values(Object.fromEntries(Object.entries(dataToSign).sort()));
    let signStr = SECRET_KEY;
    sortedValues.forEach((val) => (signStr += val));
    const sign = md5(signStr);

    // 📨 Gửi yêu cầu đến Thesieure
    const params = new URLSearchParams({
      ...dataToSign,
      amount,
      sign,
    });

    const response = await axios.post(API_URL, params, {
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
    });

    const data = response.data;
    console.log("📩 Phản hồi từ Thesieure:", data);

    // 🔍 Xử lý mã trạng thái đúng theo tài liệu mới nhất
    switch (data.status) {
      case 99:
        return res.json({ status: "pending", message: "Gửi thẻ thành công, đợi duyệt.", data });
      case 1:
        return res.json({ status: "success", message: "Nạp thẻ thành công!", data });
      case 2:
        return res.json({ status: "warning", message: "Thành công nhưng sai mệnh giá!", data });
      case 3:
        return res.json({ status: "error", message: "Thẻ lỗi hoặc không hợp lệ!", data });
      case 4:
        return res.json({ status: "error", message: "Hệ thống bảo trì!", data });
      default:
        return res.json({ status: "error", message: "Lỗi không xác định!", data });
    }
  } catch (error) {
    console.error("❌ Lỗi khi gửi API:", error.message);
    return res.status(500).json({ status: 500, message: "Lỗi kết nối đến Thesieure!" });
  }
});

// ✅ Route callback từ Thesieure
app.post("/callback/thesieure", (req, res) => {
  console.log("🔁 Callback nhận từ Thesieure:", req.body);
  res.status(200).send("OK");
});

// 🚀 Khởi động server
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`✅ Server chạy tại: http://127.0.0.1:${PORT}`);
});
