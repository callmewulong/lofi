// ✨ JS By Wu Long -->
/* =======================================================
 * 🌠 HIỆU ỨNG SAO BĂNG (Wu Long Optimized Edition)
 * ======================================================= */

// Tạo container chứa sao băng
let starContainer = document.getElementById('star-container');
if (!starContainer) {
    starContainer = document.createElement('div');
    starContainer.id = 'star-container';
    document.body.appendChild(starContainer);
}

let lastX = 0;
let lastY = 0;
let lastTime = 0;
const THROTTLE_DELAY = 30; // Giảm tần suất tạo sao để nhẹ hơn
const MAX_STARS = 100; // Giới hạn tối đa sao hiển thị cùng lúc

function createStar(x, y, dx, dy) {
    if (!starContainer) return;
    
    const stars = starContainer.querySelectorAll('.star');
    if (stars.length > MAX_STARS) stars[0].remove(); // Xóa sao cũ nhất

    const star = document.createElement('div');
    star.classList.add('star');
    starContainer.appendChild(star);

    // Vị trí ban đầu
    star.style.left = `${x}px`;
    star.style.top = `${y}px`;

    // Hướng bay
    const tx = dx * 6;
    const ty = dy * 6;
    star.style.setProperty('--tx', `${tx}px`);
    star.style.setProperty('--ty', `${ty}px`);

    // Màu ngẫu nhiên
    const colors = ['#8be9fd', '#ff79c6', '#a677ff', '#bd93f9', '#50fa7b', '#f1fa8c'];
    const color = colors[Math.floor(Math.random() * colors.length)];
    
    star.style.background = `linear-gradient(45deg, #fff, ${color})`;
    star.style.boxShadow = `
        0 0 15px #fff,
        0 0 35px ${color},
        0 0 60px ${color}
    `;

    setTimeout(() => star.remove(), 900); // Tự xóa sau 0.9s
}

function handleMove(x, y) {
    const now = Date.now();
    if (now - lastTime < THROTTLE_DELAY) return;

    const dx = x - lastX;
    const dy = y - lastY;

    if (Math.abs(dx) > 2 || Math.abs(dy) > 2) {
        createStar(x, y, dx, dy);
    }

    lastX = x;
    lastY = y;
    lastTime = now;
}

// PC
document.addEventListener('mousemove', (e) => {
    handleMove(e.clientX, e.clientY);
});

// Mobile (Cho phép scroll bình thường)
document.addEventListener(
    'touchmove',
    (e) => {
        const touch = e.touches[0];
        handleMove(touch.clientX, touch.clientY);
    },
    { passive: true }
);

/* =======================================================
 * 💬 HIỆU ỨNG ĐÁNH MÁY (Wu Long Optimized Edition)
 * ======================================================= */

document.addEventListener("DOMContentLoaded", () => {
  // Nội dung bạn muốn hiển thị
  const fullText = `Gia Tộc LOFI trên WePlay là nơi dành cho những người yêu âm nhạc và có lối sống chill thư giãn. Chúng mình tạo nên một không gian yên bình, nơi mọi người tìm thấy sự thư giãn, tránh xa sự ồn ào và chúng mình cùng nhau phát triển các dự án sáng tạo mang đậm chất Lofi Aesthetics.

👉🏻 ID Gia Tộc: V9999
🔰 Phòng Gia Tộc: V313031`;

  const typingElement = document.getElementById("typing-text");
  let charIndex = 0;
  const typingSpeed = 80; // Tốc độ đánh máy (ms)

  function typeWriter() {
    if (typingElement && charIndex < fullText.length) {
      const nextChar = fullText.charAt(charIndex);

      // Xuống dòng
      if (nextChar === "\n") typingElement.innerHTML += "<br>";
      else typingElement.innerHTML += nextChar;

      charIndex++;
      setTimeout(typeWriter, typingSpeed);
    }
  }

  // Gọi hàm sau khi DOM sẵn sàng
  typeWriter();
});

// =========================================
// 👀 6.Blink Animation for Anime Girl 
// =========================================
document.addEventListener('DOMContentLoaded', () => {
    const animeGirlImg = document.querySelector('.donate-character-img-main');
    
    // Kiểm tra xem có hình ảnh cô gái anime không
    if (!animeGirlImg) {
        console.warn("Không tìm thấy '.donate-character-img-main' để áp dụng hiệu ứng chớp mắt.");
        return;
    }
    const openEyeSrc = animeGirlImg.src; // Lấy đường dẫn hiện tại làm mắt mở
    // Đảm bảo đường dẫn này đúng với vị trí file ảnh chớp mắt
    const blinkEyeSrc = openEyeSrc.replace('donate_anime.png', 'donate_anime_blink.png'); 

    function blink() {
        // Chớp mắt (Mắt nhắm)
        animeGirlImg.src = blinkEyeSrc;
        setTimeout(() => {
            // Mở mắt lại
            animeGirlImg.src = openEyeSrc;
            // Đặt thời gian chờ ngẫu nhiên cho lần chớp mắt tiếp theo
            // Chớp mắt sau 3 đến 7 giây
            const nextBlinkTime = Math.random() * 4000 + 3000; 
            setTimeout(blink, nextBlinkTime);
        }, 200); // Mắt nhắm trong 200ms
    }

    // Bắt đầu chớp mắt lần đầu sau một khoảng thời gian ngẫu nhiên
    const initialBlinkTime = Math.random() * 4000 + 3000; 
    setTimeout(blink, initialBlinkTime);
});
// ✨ JS By Wu Long -->
