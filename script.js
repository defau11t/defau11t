const audio = document.getElementById('bg-audio');
const btn = document.getElementById('music-toggle');

btn.addEventListener('click', () => {
    if (audio.paused) {
        audio.play();
        btn.textContent = '🔊'; // Включаем звук
    } else {
        audio.pause();
        btn.textContent = '🔇'; // Выключаем звук
    }
});