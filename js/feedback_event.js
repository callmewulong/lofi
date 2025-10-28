// ✨ JS By Wu Long -->
/* =======================================================
 * 📦 DOM CONTENT LOADED - KHỞI TẠO CHUNG
 * ======================================================= */
    document.addEventListener("DOMContentLoaded", () => {
    /* =======================================================
     * 🎉 Tạo popup cảm ơn tự động bằng JavaScript
     * ======================================================= */
    const popup = document.createElement("div");
    popup.id = "success-popup";
    popup.className = "popup-message";
    popup.innerHTML = `
      <div class="popup-content">
        <h4>🎉 Cảm ơn bạn đã gửi góp ý!</h4>
        <p>Chúng mình sẽ liên hệ bạn sớm nhất có thể!</p>
      </div>
    `;
    document.body.appendChild(popup);

    /* =======================================================
     * 💌 Form Góp Ý Sự Kiện + Popup Thành Công
     * ======================================================= */
    const feedbackBtn = document.getElementById('feedback-btn');
    const feedbackModal = document.getElementById('feedback-modal');
    const closeFeedback = document.querySelector('.close-feedback');
    const feedbackForm = document.getElementById('feedback-form');

    if (!feedbackBtn || !feedbackModal || !feedbackForm || !closeFeedback) {
        // Chỉ return nếu thiếu các element quan trọng
        // (Khối này vốn không có return nên tôi sẽ không thay đổi logic)
    } else {
        feedbackBtn.addEventListener('click', () => {
            feedbackModal.style.display = 'flex';
        });

        closeFeedback.addEventListener('click', () => {
            feedbackModal.style.display = 'none';
        });

        window.addEventListener('click', (e) => {
            if (e.target === feedbackModal) feedbackModal.style.display = 'none';
        });
    }

    // Xử lý gửi Form qua Formspree
    if (feedbackForm) {
        feedbackForm.addEventListener("submit", async (e) => {
            e.preventDefault();
            const formData = new FormData(feedbackForm);

            const submitBtn = feedbackForm.querySelector('.glow-button');
            const originalText = submitBtn.innerHTML; // Lưu nội dung HTML gốc (có thể chứa <span>)
            const popup = document.getElementById("success-popup");
            if (!submitBtn || !popup) return; // Bảo vệ

            // 1. Khi nhấn gửi → đổi nút sang “Đang gửi” + Hiệu ứng nhịp tim (Sử dụng CSS .sending)
            submitBtn.innerHTML = '<span>Gửi Góp Ý</span>'; // Tạm đóng chữ cũ vào span để CSS ẩn
            submitBtn.classList.add('sending');
            submitBtn.disabled = true; // Vô hiệu hóa nút

            // 2. TẠO PROMISE ĐỂ CHỜ 3 GIÂY CHO HIỆU ỨNG
            const delayPromise = new Promise(resolve => setTimeout(resolve, 3000));
            
            // 3. THỰC HIỆN GỬI DỮ LIỆU LÊN SERVER CÙNG LÚC VỚI HIỆU ỨNG
            let response, isSuccess = false;
            try {
                response = await fetch(feedbackForm.action, {
                    method: feedbackForm.method,
                    body: formData,
                    headers: { "Accept": "application/json" },
                });
                isSuccess = response.ok;
            } catch (error) {
                console.error("Lỗi gửi form:", error);
                isSuccess = false;
            }

            // 4. CHỜ CHO DÙ GỬI THÀNH CÔNG/LỖI VÀ CHẮC CHẮN ĐÃ QUA 6 GIÂY
            await delayPromise;

            // 5. HIỂN THỊ POPUP VÀ XỬ LÝ KẾT QUẢ SAU KHI ĐÃ CHỜ 6S
            if (isSuccess) {
                popup.style.display = "flex"; // Hiện popup cảm ơn
                feedbackForm.reset();
                feedbackModal.style.display = "none";
                setTimeout(() => (popup.style.display = "none"), 6000); // Ẩn popup sau 6s
            } else {
                alert("⚠️ Gửi không thành công hoặc đã xảy ra lỗi kết nối. Vui lòng thử lại sau!");
            }
            
            // 6. ✅ TRẢ NÚT VỀ LẠI BÌNH THƯỜNG
            submitBtn.innerHTML = originalText;
            submitBtn.classList.remove('sending');
            submitBtn.disabled = false;
        });
    }

    /* Khởi động SlideShow */
    createDots();
    startSlideShow();

    /* Khởi động Typewriter */
    typeWriter();
    
    // ... (Code khởi tạo AOS đã có) ...
});

// Thông báo mặc định cho ô bắt buộc
const ideaInput = document.getElementById("idea");
if (ideaInput) {
    ideaInput.oninvalid = function (e) {
        e.target.setCustomValidity("🌸 Hãy chia sẻ ý tưởng của bạn nhé!");
    };
    ideaInput.oninput = function (e) {
        e.target.setCustomValidity("");
    };
}
// ✨ JS By Wu Long -->
