// ✨ JS By Wu Long -->
/* =======================================================
 * 🖼️ TẠO AVATAR RANDOM (PFP)
 * ======================================================= */

// 1. Khai báo các phần tử DOM
const avatarImg = document.getElementById('random-avatar-img');
const generateBtn = document.getElementById('generate-pfp-btn');
const downloadBtn = document.getElementById('download-pfp-btn');

// 2. Tạo Thư Viện Avatar 999 Ảnh Tự Động
const AVATAR_ASSETS = [];
const basePath = 'image/avatar/pfp-generator/';

// Vòng lặp từ 1 đến 999
for (let i = 1; i <= 234; i++) { 
    // Định dạng số thành chuỗi 3 chữ số (ví dụ: 1 -> '001', 10 -> '010', 100 -> '100')
    const paddedNumber = i.toString().padStart(3, '0'); 
    AVATAR_ASSETS.push(`${basePath}${paddedNumber}.png`);
}

/**
 * Hàm lấy một phần tử ngẫu nhiên từ mảng.
 * @param {Array} arr 
 */
function getRandomElement(arr) {
    if (arr.length === 0) return null;
    return arr[Math.floor(Math.random() * arr.length)];
}

/**
 * Hàm tải và hiển thị ảnh ngẫu nhiên
 */
function generatePfpFromCompletedAssets() {
    if (!avatarImg) return;
    
    const randomUrl = getRandomElement(AVATAR_ASSETS);
    
    if (randomUrl) {
        // Gán ảnh mới cho thẻ <img>
        avatarImg.src = randomUrl;
        
        // Cập nhật đường link tải về (Download link)
        updateDownloadLink(randomUrl);
    } else {
         avatarImg.alt = "Lỗi: Không tìm thấy URL avatar.";
    }
}

/**
 * Cập nhật thuộc tính tải về cho nút Download
 * @param {string} url Đường dẫn của ảnh hiện tại
 */
function updateDownloadLink(url) {
    if (downloadBtn) {
        // Gán trực tiếp đường dẫn ảnh vào href
        downloadBtn.href = url;
        // Đặt tên file ngẫu nhiên
        downloadBtn.download = `lofi_pfp_${Date.now()}.png`;
    }
}

// Khởi tạo và gán sự kiện
if (generateBtn) {
    generateBtn.addEventListener('click', generatePfpFromCompletedAssets);
}

// Gọi lần đầu khi tải trang
generatePfpFromCompletedAssets();
// ✨ JS By Wu Long -->