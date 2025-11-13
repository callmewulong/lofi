// ✨ JS By Wu Long -->
/* =======================================================
 * 📦 DOM CONTENT LOADED - KHỞI TẠO CHUNG
 * ======================================================= */
document.addEventListener("DOMContentLoaded", () => {
/* =======================================================
 * 🎉 Tạo popup cảm ơn tự động bằng JavaScript
 * ======================================================= */
  const popup = document.createElement("div");
  popup.id = "success-popup-feedback"; // ✅ Giữ ID riêng biệt cho form góp ý
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
  const feedbackBtn = document.getElementById("feedback-btn");
  const feedbackModal = document.getElementById("feedback-modal");
  const closeFeedback = document.querySelector(".close-feedback");
  const feedbackForm = document.getElementById("feedback-form");

  if (feedbackBtn && feedbackModal && feedbackForm && closeFeedback) {
    feedbackBtn.addEventListener("click", () => {
      feedbackModal.style.display = "flex";
    });

    closeFeedback.addEventListener("click", () => {
      feedbackModal.style.display = "none";
    });

    window.addEventListener("click", (e) => {
      if (e.target === feedbackModal) feedbackModal.style.display = "none";
    });
  }

  // ✅ Xử lý gửi Form qua Formspree
  if (feedbackForm) {
    feedbackForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      const formData = new FormData(feedbackForm);

      const submitBtn = feedbackForm.querySelector(".glow-button");
      const originalText = submitBtn.innerHTML;

      // ✅ Gọi đúng popup đã tạo
      const popup = document.getElementById("success-popup-feedback");
      if (!submitBtn || !popup) return;

      // 1. Khi nhấn gửi → đổi nút sang “Đang gửi” + hiệu ứng nhịp tim
      submitBtn.innerHTML = '<span>Gửi Góp Ý</span>';
      submitBtn.classList.add("sending");
      submitBtn.disabled = true;

      // 2. Promise hiệu ứng 3 giây
      const delayPromise = new Promise((resolve) => setTimeout(resolve, 3000));

      // 3. Gửi dữ liệu tới Formspree
      let response, isSuccess = false;
      try {
        response = await fetch(feedbackForm.action, {
          method: feedbackForm.method,
          body: formData,
          headers: { Accept: "application/json" },
        });
        isSuccess = response.ok;
      } catch (error) {
        console.error("Lỗi gửi form:", error);
        isSuccess = false;
      }

      // 4. Chờ 3s hiệu ứng
      await delayPromise;

      // 5. Kết quả
      if (isSuccess) {
        popup.style.display = "flex"; // ✅ Hiện popup cảm ơn
        feedbackForm.reset();
        feedbackModal.style.display = "none";
        setTimeout(() => (popup.style.display = "none"), 6000);
      } else {
        alert("⚠️ Gửi không thành công hoặc đã xảy ra lỗi kết nối. Vui lòng thử lại sau!");
      }

      // 6. Trả nút về bình thường
      submitBtn.innerHTML = originalText;
      submitBtn.classList.remove("sending");
      submitBtn.disabled = false;
    });
  }

  /* =======================================================
   * Khởi động các hiệu ứng khác
   * ======================================================= */
  if (typeof createDots === "function") createDots();
  if (typeof startSlideShow === "function") startSlideShow();
  if (typeof typeWriter === "function") typeWriter();
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
