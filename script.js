const audio = document.getElementById('bg-audio');
const toggleBtn = document.getElementById('music-toggle');

// Попытка включить музыку при первом клике по странице
function tryPlay() {
    audio.play().then(() => {
        toggleBtn.textContent = '🔊';
        toggleBtn.classList.add('playing');
    }).catch(() => {
        // Браузер заблокировал автоплей — ждём клика пользователя
        toggleBtn.textContent = '🔇';
        toggleBtn.classList.remove('playing');
    });
}

// Клик по кнопке — вкл/выкл
toggleBtn.addEventListener('click', () => {
    if (audio.paused) {
        tryPlay();
    } else {
        audio.pause();
        toggleBtn.textContent = '🔇';
        toggleBtn.classList.remove('playing');
    }
});

// Пробуем запустить музыку при загрузке страницы (может блокироваться)
window.addEventListener('load', tryPlay);