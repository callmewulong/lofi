// ✨ JS By Wu Long -->
/* =======================================================
 * 🌗 CHUYỂN ĐỔI CHẾ ĐỘ SÁNG / TỐI (Light / Dark Mode)
 * ======================================================= */
const body = document.getElementById('page-body');
const modeToggle = document.getElementById('mode-toggle');
const modeIcon = modeToggle ? modeToggle.querySelector('i') : null;

/**
 * Đặt chế độ sáng/tối cho trang
 * @param {string} theme 'light' hoặc 'dark'
 */
const setTheme = (theme) => {
    const isLight = theme === 'light';
    
    body.classList.toggle('light-mode', isLight);
    
    if (modeIcon) {
        modeIcon.classList.toggle('fa-sun', !isLight);
        modeIcon.classList.toggle('fa-moon', isLight);
    }
    
    localStorage.setItem('theme', theme);
};

// Khởi tạo theme khi tải trang
setTheme(localStorage.getItem('theme') || 'dark');

// Sự kiện đổi chế độ sáng / tối
if (modeToggle) {
    modeToggle.addEventListener('click', () => {
        const current = body.classList.contains('light-mode') ? 'light' : 'dark';
        setTheme(current === 'light' ? 'dark' : 'light');
    });
}
// ✨ JS By Wu Long -->