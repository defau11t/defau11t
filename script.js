document.addEventListener('DOMContentLoaded', () => {
    // --- 1. ЛОГИКА ВХОДА И ЗАПУСКА ВИДЕО ---
    const overlay = document.getElementById('enterOverlay');
    const enterText = document.getElementById('enterText');
    const bgVideo = document.getElementById('bgVideo');
    
    overlay.addEventListener('click', () => {
        document.body.classList.add('entered');
        
        setTimeout(() => { 
            enterText.style.display = 'none'; 
        }, 500);

        if (bgVideo) {
            bgVideo.muted = true; // Начинаем без звука
            bgVideo.play().catch(e => {
                console.log("Ошибка запуска видео (возможно, файл bg.mp4 не найден):", e);
            });
        }
    });

    // --- 2. КНОПКА ЗВУКА ---
    const audioBtn = document.getElementById('audioBtn');
    const audioIcon = document.getElementById('audioIcon');
    let isPlaying = false;
    
    audioBtn.addEventListener('click', () => {
        isPlaying = !isPlaying;
        if (isPlaying) {
            audioIcon.classList.remove('fa-volume-xmark');
            audioIcon.classList.add('fa-volume-high');
            if (bgVideo) bgVideo.muted = false; 
        } else {
            audioIcon.classList.remove('fa-volume-high');
            audioIcon.classList.add('fa-volume-xmark');
            if (bgVideo) bgVideo.muted = true; 
        }
    });

    // --- 3. СЧЕТЧИК ПРОСМОТРОВ ---
    const viewCountElement = document.getElementById('viewCount');
    const viewsContainer = document.getElementById('viewsContainer');
    let currentViews = localStorage.getItem('siteViews');
    
    if (currentViews === null) { currentViews = 0; } 
    else { currentViews = parseInt(currentViews); }

    const hasVisited = sessionStorage.getItem('hasVisited');

    if (!hasVisited) {
        currentViews += 1;
        localStorage.setItem('siteViews', currentViews);
        sessionStorage.setItem('hasVisited', 'true');
        
        setTimeout(() => {
            viewCountElement.textContent = currentViews;
            viewsContainer.classList.add('bump');
            setTimeout(() => { viewsContainer.classList.remove('bump'); }, 500);
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
                
                const colors = { online: '#23a559', idle: '#f0b232', dnd: '#f23f43', offline: '#747f8d' };
                statusDot.style.backgroundColor = colors[user.discord_status] || colors.offline;

                if (user.discord_status === 'offline') statusText.textContent = 'Offline';
                else if (user.activities && user.activities.length > 0) statusText.textContent = `Playing ${user.activities[0].name}`;
                else statusText.textContent = 'Online';
            }
        } catch (error) {
            console.error('Ошибка Discord API:', error);
        }
    }
    fetchDiscordStatus();
    setInterval(fetchDiscordStatus, 15000);

    // --- 5. ЭФФЕКТ СНЕГА (Мелкий и редкий, как в guns.lol) ---
    const canvas = document.getElementById('snow-canvas');
    const ctx = canvas.getContext('2d');
    
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const particles = [];
    const particleCount = 60; // Меньше частиц для элегантности

    class Particle {
        constructor() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.size = Math.random() * 1.5 + 0.5; // Мелкие частицы
            this.speedY = Math.random() * 0.8 + 0.2; // Медленное падение
            this.speedX = Math.random() * 0.4 - 0.2;
            this.opacity = Math.random() * 0.4 + 0.1; // Едва заметные
        }

        update() {
            this.y += this.speedY;
            this.x += this.speedX;

            if (this.y > canvas.height) {
                this.y = 0;
                this.x = Math.random() * canvas.width;
            }
            if (this.x > canvas.width) this.x = 0;
            if (this.x < 0) this.x = canvas.width;
        }

        draw() {
            ctx.fillStyle = `rgba(255, 255, 255, ${this.opacity})`;
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fill();
        }
    }

    for (let i = 0; i < particleCount; i++) {
        particles.push(new Particle());
    }

    function animateSnow() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        particles.forEach(p => {
            p.update();
            p.draw();
        });
        requestAnimationFrame(animateSnow);
    }

    animateSnow();

    window.addEventListener('resize', () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    });
});