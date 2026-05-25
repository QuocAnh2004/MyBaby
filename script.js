document.addEventListener("DOMContentLoaded", () => {

    // ─── 1. PHÁT NHẠC NỀN KHI NGƯỜI DÙNG CLICK ───
    document.addEventListener('click', function() {
        var audio = document.getElementById('bg-music');
        if (audio && audio.paused) {
            audio.play().then(() => {
                console.log("Nhạc đang phát thành công!");
            }).catch(function(error) {
                console.log("Trình duyệt chặn phát nhạc: ", error);
            });
        }
    }, { once: true });

    // --- 1. TYPEWRITER EFFECT ---
    const textTarget = document.getElementById("typewriter");
    // PERSONALIZATION PLACEHOLDER
    const message = "Hello [GIRLFRIEND_NAME], I have a special invitation just for you...";
    let index = 0;

    function typeWriter() {
        if (index < message.length) {
            textTarget.innerHTML += message.charAt(index);
            index++;
            setTimeout(typeWriter, 70); // Adjust typing speed here (ms)
        }
    }
    // Fire typewriter shortly after initialization
    setTimeout(typeWriter, 500);

    // Smooth Scroll Button Action
    document.getElementById("explore-btn").addEventListener("click", () => {
        document.getElementById("timeline-section").scrollIntoView({ behavior: "smooth" });
    });


    // --- 2. TIMELINE SCROLL REVEAL INTERACTION ---
    const revealItems = document.querySelectorAll(".scroll-reveal");

    const scrollObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add("active");
                // Optional: Stop observing once revealed to maintain state
                scrollObserver.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.15 // Triggers when 15% of the element layout is visible
    });

    revealItems.forEach(item => scrollObserver.observe(item));


    // --- 3. THE IMPOSSIBLE "NO" BUTTON (RUNAWAY SYSTEM) ---
    const noBtn = document.getElementById("no-btn");

    function teleportButton(e) {
        // Flag the button styling as dynamically detached/absolute
        noBtn.classList.add("runaway");

        // Define padding boundaries to avoid immediate border clips
        const padding = 80;
        const btnWidth = noBtn.offsetWidth;
        const btnHeight = noBtn.offsetHeight;

        // Calculate maximum viewport metrics safely
        const maxTop = window.innerHeight - btnHeight - padding;
        const maxLeft = window.innerWidth - btnWidth - padding;

        // Generate randomized math points inside safe spaces
        let randomTop = Math.floor(Math.random() * (maxTop - padding)) + padding;
        let randomLeft = Math.floor(Math.random() * (maxLeft - padding)) + padding;

        // Fallback checks just in case points approach negative spaces
        randomTop = Math.max(padding, randomTop);
        randomLeft = Math.max(padding, randomLeft);

        // Map updates to style bindings instantly
        noBtn.style.top = `${randomTop}px`;
        noBtn.style.left = `${randomLeft}px`;
    }

    // Attach tracking across platforms (Desktop hovers & Mobile active touches)
    noBtn.addEventListener("mouseenter", teleportButton);
    noBtn.addEventListener("touchstart", (e) => {
        e.preventDefault(); // Suppresses default native tapping selections
        teleportButton();
    });


    // --- 4. THE SUCCESS MODAL & HEART CONFETTI ENGINE ---
    const yesBtn = document.getElementById("yes-btn");
    const canvas = document.getElementById("animationCanvas");
    const ctx = canvas.getContext("2d");
    let animationActive = false;
    let heartsArray = [];

    // Initialize/sync canvas dimensions with the actual screen scope
    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    window.addEventListener("resize", resizeCanvas);
    resizeCanvas();

    // Heart object modeling blueprint
    class FallingHeart {
        constructor() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * -canvas.height - 20;
            this.size = Math.random() * 15 + 10;
            this.speedY = Math.random() * 3 + 2;
            this.speedX = Math.sin(Math.random() * 2) * 1;
            this.opacity = Math.random() * 0.6 + 0.4;
            // Generate structural varieties of romantic pink palettes
            const colors = ['#FF4B6E', '#FF85A1', '#FFB3C6', '#F72585', '#B76E79'];
            this.color = colors[Math.floor(Math.random() * colors.length)];
        }

        update() {
            this.y += this.speedY;
            this.x += this.speedX;
            // Recycle items once falling off-bounds
            if (this.y > canvas.height) {
                this.y = -20;
                this.x = Math.random() * canvas.width;
            }
        }

        draw() {
            ctx.save();
            ctx.globalAlpha = this.opacity;
            ctx.fillStyle = this.color;
            ctx.beginPath();
            // Traditional canvas heart geometry sequence
            const topY = this.y - this.size / 2;
            ctx.moveTo(this.x, this.y);
            ctx.bezierCurveTo(this.x - this.size, topY, this.x - this.size, topY + this.size, this.x, this.y + this.size);
            ctx.bezierCurveTo(this.x + this.size, topY + this.size, this.x + this.size, topY, this.x, this.y);
            ctx.closePath();
            ctx.fill();
            ctx.restore();
        }
    }

    function initHearts() {
        heartsArray = [];
        for (let i = 0; i < 75; i++) { // Render count density
            heartsArray.push(new FallingHeart());
        }
    }

    function handleHeartsLoop() {
        if (!animationActive) return;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        heartsArray.forEach(heart => {
            heart.update();
            heart.draw();
        });
        
        requestAnimationFrame(handleHeartsLoop);
    }

    // Success deployment action
    yesBtn.addEventListener("click", () => {
        // 1. Fire Falling Celebration Hearts
        if (!animationActive) {
            animationActive = true;
            initHearts();
            handleHeartsLoop();
        }

        // 2. Open Bootstrap Modal securely
        const successModal = new bootstrap.Modal(document.getElementById('successModal'));
        successModal.show();
    });
});