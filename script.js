document.addEventListener('DOMContentLoaded', () => {
    // --- 1. ЛОГИКА ВХОДА И ЗАПУСКА ВИДЕО ---
    const overlay = document.getElementById('enterOverlay');
    const enterText = document.getElementById('enterText');
    const bgVideo = document.getElementById('bgVideo');
    
    overlay.addEventListener('click', () => {
        document.body.classList.add('entered');
        setTimeout(() => { enterText.style.display = 'none'; }, 500);
        if (bgVideo) {
            bgVideo.muted = true;
            bgVideo.play().catch(e => console.log("Ошибка видео:", e));
        }
    });

    // --- 2. СЧЕТЧИК ПРОСМОТРОВ ---
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

    // --- 3. СНЕГ (ТОЛЬКО БЕЛЫЙ) ---
    const canvas = document.getElementById('snow-canvas');
    const ctx = canvas.getContext('2d');
    
    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    const particles = [];
    const particleCount = 120;

    class Snowflake {
        constructor() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.size = Math.random() * 2 + 0.5; 
            this.speedY = Math.random() * 1.2 + 0.3; 
            this.speedX = Math.random() * 0.6 - 0.3; 
            this.opacity = Math.random() * 0.5 + 0.2;
            this.wobble = Math.random() * Math.PI * 2;
            // Только белый цвет
            this.color = '255, 255, 255';
        }

        update() {
            this.y += this.speedY;
            this.wobble += 0.02;
            this.x += Math.sin(this.wobble) * 0.5 + this.speedX;

            if (this.y > canvas.height) {
                this.y = -10;
                this.x = Math.random() * canvas.width;
            }
            if (this.x > canvas.width) this.x = 0;
            if (this.x < 0) this.x = canvas.width;
        }

        draw() {
            ctx.fillStyle = `rgba(${this.color}, ${this.opacity})`;
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fill();
        }
    }

    for (let i = 0; i < particleCount; i++) {
        particles.push(new Snowflake());
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
});