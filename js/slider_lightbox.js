// ✨ JS By Wu Long -->
/* =======================================================
 * 📸 SLIDE ẢNH TỰ ĐỘNG (Carousel)
 * ======================================================= */
const carouselInner = document.getElementById('carousel-inner');
const prevSlideBtn = document.getElementById('prev-slide');
const nextSlideBtn = document.getElementById('next-slide');
const carouselDots = document.getElementById('carousel-dots');
const carouselItems = document.querySelectorAll('.carousel-item');

let currentSlide = 0;
let slideInterval;
const totalSlides = carouselItems.length;

/** Tạo các chấm điều hướng */
const createDots = () => {
    if (!carouselDots) return;
    
    carouselDots.innerHTML = '';
    
    for (let i = 0; i < totalSlides; i++) {
        const dot = document.createElement('span');
        dot.classList.add('dot');
        dot.dataset.slideIndex = i;
        
        dot.addEventListener('click', () => {
            stopSlideShow();
            goToSlide(i);
            startSlideShow();
        });
        
        carouselDots.appendChild(dot);
    }
    updateDots();
};

/** Cập nhật trạng thái active cho chấm điều hướng */
const updateDots = () => {
    document.querySelectorAll('.dot').forEach((dot, i) => {
        dot.classList.toggle('active', i === currentSlide);
    });
};

/** Chuyển đến slide theo index */
const goToSlide = (index) => {
    if (!carouselInner) return;
    
    currentSlide = (index + totalSlides) % totalSlides; // Đảm bảo quay vòng
    carouselInner.style.transform = `translateX(-${currentSlide * 100}%)`;
    updateDots();
};

const nextSlide = () => goToSlide(currentSlide + 1);
const prevSlide = () => goToSlide(currentSlide - 1);

const startSlideShow = () => (slideInterval = setInterval(nextSlide, 5000));
const stopSlideShow = () => clearInterval(slideInterval);

// Điều khiển nút chuyển ảnh
if (nextSlideBtn) {
    nextSlideBtn.addEventListener('click', () => {
        stopSlideShow();
        nextSlide();
        startSlideShow();
    });
}
if (prevSlideBtn) {
    prevSlideBtn.addEventListener('click', () => {
        stopSlideShow();
        prevSlide();
        startSlideShow();
    });
}

// Khi tất cả nội dung HTML đã tải
document.addEventListener("DOMContentLoaded", () => {
    createDots();      // Tạo chấm điều hướng
    startSlideShow();  // Chạy tự động
});

/* =======================================================
 * 💥 PHÓNG TO ẢNH TRONG SLIDER (Lightbox)
 * ======================================================= */
const modal = document.getElementById('imageModal');
const modalImg = document.getElementById('modalImage');

// Khi click ảnh trong slider → Mở modal
document.querySelectorAll('.carousel-item img').forEach((img) => {
    img.addEventListener('click', () => {
        if (!modal || !modalImg) return;
        
        modal.style.display = 'block';
        modal.style.opacity = '1';
        modalImg.src = img.src;
    });
});

// Khi click ra ngoài ảnh → Đóng
if (modal) {
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.style.opacity = '0';
            setTimeout(() => (modal.style.display = 'none'), 300);
        }
    });
}

// Khi nhấn ESC → Đóng
document.addEventListener('keydown', (e) => {
    if (modal && e.key === 'Escape' && modal.style.display === 'block') {
        modal.style.opacity = '0';
        setTimeout(() => (modal.style.display = 'none'), 300);
    }
});
// ✨ JS By Wu Long -->
