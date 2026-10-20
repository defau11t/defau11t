// Ждем, пока загрузится весь HTML
document.addEventListener('DOMContentLoaded', () => {

    // 1. Плавное появление сайта
    document.body.classList.add('loaded');

    // 2. Логика для кнопки звука
    const audioBtn = document.getElementById('audioBtn');
    const audioIcon = document.getElementById('audioIcon');
    const bgMusic = document.getElementById('bgMusic');
    let isPlaying = false;

    audioBtn.addEventListener('click', () => {
        if (isPlaying) {
            bgMusic.pause();
            audioIcon.classList.remove('fa-volume-high');
            audioIcon.classList.add('fa-volume-xmark'); // Иконка "выключен"
        } else {
            // В реальном проекте здесь будет воспроизведение
            bgMusic.play().catch(e => console.log("Аудио не добавлено или заблокировано браузером"));
            audioIcon.classList.remove('fa-volume-xmark');
            audioIcon.classList.add('fa-volume-high'); // Иконка "включен"
        }
        isPlaying = !isPlaying;
    });

    // 3. Эффект печатной машинки для никнейма (опционально)
    const usernameElement = document.getElementById('username');
    const text = "Default";
    usernameElement.innerHTML = "";
    let i = 0;

    function typeWriter() {
        if (i < text.length) {
            usernameElement.innerHTML += text.charAt(i);
            i++;
            setTimeout(typeWriter, 150); // Скорость печати (150мс)
        }
    }
    
    // Запускаем печать через полсекунды после загрузки
    setTimeout(typeWriter, 500); 

    // 4. Рандомный счетчик просмотров (просто для вида)
    // Прибавляет от 1 до 3 просмотров каждые 5 секунд
    const viewCountElement = document.getElementById('viewCount');
    let views = 20;
    
    setInterval(() => {
        views += Math.floor(Math.random() * 3) + 1;
        viewCountElement.textContent = views;
    }, 5000);
});