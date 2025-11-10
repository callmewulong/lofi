// ✨ JS By Wu Long -->
/* =======================================================
 * 🎵 ĐIỀU KHIỂN ÂM NHẠC LOFI
 * ======================================================= */
const music = document.getElementById('lofi-music');
const musicToggle = document.getElementById('music-toggle');
const musicIcon = musicToggle ? musicToggle.querySelector('i') : null;
let isPlaying = false;

const toggleMusic = async () => {
    if (!music || !musicIcon) return;
    
    try {
        if (isPlaying) {
            music.pause();
            musicIcon.classList.replace('fa-pause', 'fa-play');
        } else {
            await music.play();
            musicIcon.classList.replace('fa-play', 'fa-pause');
        }
        isPlaying = !isPlaying;
    } catch (error) {
        // Xử lý lỗi khi trình duyệt chặn tự động phát
        console.error("Lỗi tự động phát nhạc:", error);
        alert('🔇 Trình duyệt đã chặn tính năng tự động phát nhạc.\nVui lòng bấm nút Play lại để kích hoạt.');
    }
};

if (musicToggle) {
    musicToggle.addEventListener('click', toggleMusic);
}
// ✨ JS By Wu Long -->