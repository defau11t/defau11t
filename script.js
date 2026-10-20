document.addEventListener('DOMContentLoaded', () => {
    // --- 1. ЛОГИКА ВХОДА (Клик по экрану + запуск видео) ---
    const overlay = document.getElementById('enterOverlay');
    const enterText = document.getElementById('enterText');
    const bgVideo = document.getElementById('bgVideo');
    
    overlay.addEventListener('click', () => {
        // Добавляем класс для анимаций
        document.body.classList.add('entered');
        
        // Убираем текст
        setTimeout(() => { 
            enterText.style.display = 'none'; 
        }, 500);

        // Запускаем видео: меняем autoplay=0 на autoplay=1
        if (bgVideo) {
            const videoSrc = bgVideo.src;
            if (!videoSrc.includes('autoplay=1')) {
                bgVideo.src = videoSrc.replace('autoplay=0', 'autoplay=1');
            }
        }
    });

    // --- 2. КНОПКА ЗВУКА (Визуальная) ---
    const audioBtn = document.getElementById('audioBtn');
    const audioIcon = document.getElementById('audioIcon');
    let isPlaying = false;
    
    audioBtn.addEventListener('click', () => {
        isPlaying = !isPlaying;
        if (isPlaying) {
            audioIcon.classList.remove('fa-volume-high');
            audioIcon.classList.add('fa-volume-xmark');
        } else {
            audioIcon.classList.remove('fa-volume-xmark');
            audioIcon.classList.add('fa-volume-high');
        }
    });

    // --- 3. СЧЕТЧИК ПРОСМОТРОВ (С 0) ---
    const viewCountElement = document.getElementById('viewCount');
    const viewsContainer = document.getElementById('viewsContainer');

    let currentViews = localStorage.getItem('siteViews');
    
    if (currentViews === null) {
        currentViews = 0;
    } else {
        currentViews = parseInt(currentViews);
    }

    const hasVisited = sessionStorage.getItem('hasVisited');

    if (!hasVisited) {
        currentViews += 1;
        localStorage.setItem('siteViews', currentViews);
        sessionStorage.setItem('hasVisited', 'true');
        
        setTimeout(() => {
            viewCountElement.textContent = currentViews;
            viewsContainer.classList.add('bump');
            
            setTimeout(() => {
                viewsContainer.classList.remove('bump');
            }, 500);
        }, 1500); 
        
    } else {
        viewCountElement.textContent = currentViews;
    }

    // --- 4. ИНТЕГРАЦИЯ С DISCORD ---
    const discordId = '928916025070735390'; 
    const apiUrl = `https://api.lanyard.rest/v1/users/${discordId}`;

    async function fetchDiscordStatus() {
        try {
            const response = await fetch(apiUrl);
            const data = await response.json();

            if (data.success) {
                const user = data.data;
                
                const avatarUrl = user.discord_user.avatar 
                    ? `https://cdn.discordapp.com/avatars/${discordId}/${user.discord_user.avatar}.png?size=128` 
                    : 'https://cdn.discordapp.com/embed/avatars/0.png';
                document.getElementById('discord-avatar').src = avatarUrl;

                document.getElementById('discord-username').textContent = user.discord_user.username;

                const statusDot = document.getElementById('discord-status-dot');
                const statusText = document.getElementById('discord-status-text');
                
                const colors = {
                    online: '#23a559',
                    idle: '#f0b232',
                    dnd: '#f23f43',
                    offline: '#80848e'
                };

                statusDot.style.backgroundColor = colors[user.discord_status] || colors.offline;

                if (user.discord_status === 'offline') {
                    statusText.textContent = 'Не в сети';
                } else if (user.activities && user.activities.length > 0) {
                    const activity = user.activities[0];
                    statusText.textContent = `Играет в ${activity.name}`;
                } else {
                    statusText.textContent = 'В сети';
                }
            }
        } catch (error) {
            console.error('Ошибка Discord API:', error);
            document.getElementById('discord-status-text').textContent = 'Ошибка сети';
        }
    }

    fetchDiscordStatus();
    setInterval(fetchDiscordStatus, 15000);
});