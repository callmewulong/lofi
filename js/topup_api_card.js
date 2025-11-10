// ✨ JS By Wu Long -->
// ✨ Popup + Gửi API Nạp Thẻ (By Wu Long)
document.addEventListener("DOMContentLoaded", () => {
  const topupBtn = document.getElementById("topup-btn");
  const topupModal = document.getElementById("topup-modal");
  const topupForm = document.getElementById("topup-form");

  if (!topupBtn || !topupModal || !topupForm) return; // tránh lỗi nếu popup chưa load

  const closeBtn = topupModal.querySelector(".close-feedback");

  /* ==========================
     🎯 Mở / Đóng Popup
  ========================== */
  topupBtn.addEventListener("click", () => {
    topupModal.style.display = "flex";
  });

  closeBtn?.addEventListener("click", closeTopupModal);
  window.addEventListener("click", (e) => {
    if (e.target === topupModal) closeTopupModal();
  });

  function closeTopupModal() {
    // Ẩn popup
    topupModal.style.display = "none";

    // 🧹 Xóa dữ liệu form
    topupModal.querySelectorAll("input, select, textarea").forEach(el => (el.value = ""));

    // 🧹 Xóa toàn bộ cảnh báo (⚠️ ...)
    topupModal.querySelectorAll(".error-text, .error-message, small, .warning").forEach(el => {
      el.textContent = "";
      el.style.display = "none";
    });
  }

  /* ==========================
     💳 Xử lý gửi form nạp thẻ
  ========================== */
  const formFields = {
    telco: "⚠️ Bạn chưa chọn nhà mạng!",
    amount: "⚠️ Bạn chưa chọn mệnh giá!",
    serial: "⚠️ Bạn chưa nhập serial!",
    code: "⚠️ Bạn chưa nhập mã thẻ!",
  };

  // Xóa lỗi khi người dùng nhập lại
  Object.keys(formFields).forEach(id => {
    const field = document.getElementById(id);
    if (!field) return;

    ["input", "change"].forEach(evt =>
      field.addEventListener(evt, () => {
        const nextError = field.nextElementSibling;
        if (nextError?.classList.contains("error-text")) nextError.remove();
      })
    );
  });

  topupForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  topupForm.querySelectorAll(".error-text").forEach(el => el.remove());

  let valid = true;
  for (const id of Object.keys(formFields)) {
    const field = document.getElementById(id);
    if (!field.value.trim()) {
      valid = false;
      const error = document.createElement("div");
      error.className = "error-text";
      error.textContent = formFields[id];
      error.style.cssText = `
        color: #a677ff;
        font-size: 0.85rem;
        margin-top: 4px;
        margin-bottom: 10px;
        text-align: left;
        animation: fadeInError 0.3s ease;
      `;
      field.insertAdjacentElement("afterend", error);
    }
  }
  if (!valid) return;

  const data = {
    telco: document.getElementById("telco")?.value || "",
    amount: document.getElementById("amount")?.value || "",
    serial: document.getElementById("serial")?.value || "",
    code: document.getElementById("code")?.value || "",
  };

  const submitBtn = topupForm.querySelector(".glow-button");
  submitBtn.disabled = true;
  submitBtn.classList.add("sending");

  // 💓 Đợi hiệu ứng “Đang gửi...” trong 3 giây
  await new Promise(resolve => setTimeout(resolve, 3000));

  try {
    const response = await fetch("http://127.0.0.1:3000/api/napthe", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    const result = await response.json();
    if (result.status === 99) {
      showPopupMessage("💜 Nạp thẻ thành công!", "Cảm ơn bạn đã ủng hộ Gia Tộc Lofi 💫");
      topupForm.reset();
    } else {
      showPopupMessage("⚠️ Thông báo", result.message || "Nạp thẻ thất bại, vui lòng thử lại!");
    }
  } catch (err) {
    console.error(err);
    showPopupMessage("❌ Lỗi Kết Nối", "Không thể gửi dữ liệu đến server Node.js");
  } finally {
    submitBtn.disabled = false;
    submitBtn.classList.remove("sending");
    closeTopupModal();
  }
});

  /* ✨ Hiệu ứng hiện lỗi mượt */
  const style = document.createElement("style");
  style.textContent = `
  @keyframes fadeInError {
    from { opacity: 0; transform: translateY(-4px); }
    to { opacity: 1; transform: translateY(0); }
  }
  `;
  document.head.appendChild(style);

  /* ==========================
     ✨ Hàm popup thông báo nhỏ
  ========================== */
  function showPopupMessage(title, text) {
    let popup = document.getElementById("success-popup-topup");
    if (!popup) {
      popup = document.createElement("div");
      popup.id = "success-popup-topup";
      popup.className = "popup-message";
      popup.innerHTML = `
        <div class="popup-content">
          <h4>${title}</h4>
          <p>${text}</p>
        </div>
      `;
      document.body.appendChild(popup);
    } else {
      popup.querySelector("h4").innerHTML = title;
      popup.querySelector("p").innerHTML = text;
    }
    popup.style.display = "flex";
    setTimeout(() => (popup.style.display = "none"), 3000);
  }
});
// ✨ JS By Wu Long -->
