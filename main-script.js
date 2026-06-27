// ===================================================
// 板塊一：金魚畫布動畫（加入安全檢查，避免在 Game 頁面報錯）
// ===================================================
const canvas = document.getElementById('homeFishCanvas');

// 💡 只有當畫布存在時（主頁），才執行金魚動畫
if (canvas) {
    const ctx = canvas.getContext('2d');

    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = canvas.clientHeight;
    }
    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();

    const fishImage = new Image();
    fishImage.src = 'images/mainfish.png';

    const FISH_COUNT = 10;
    const FISH_SIZE = 80;
    const MIN_SPEED = 0.4;
    const MAX_SPEED = 1.0;

    const fishes = [];

    for (let i = 0; i < FISH_COUNT; i++) {
        fishes.push({
            x: Math.random() * (window.innerWidth + FISH_SIZE * 2),
            y: FISH_SIZE / 2 + Math.random() * (canvas.height - FISH_SIZE),
            speed: MIN_SPEED + Math.random() * (MAX_SPEED - MIN_SPEED),
            angle: Math.random() * Math.PI * 2
        });
    }

    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        fishes.forEach(fish => {
            fish.x -= fish.speed;
            fish.angle += 0.015;
            fish.y += Math.sin(fish.angle) * 0.15;

            if (fish.x < -FISH_SIZE) {
                fish.x = canvas.width + FISH_SIZE;
                fish.y = FISH_SIZE / 2 + Math.random() * (canvas.height - FISH_SIZE);
                fish.speed = MIN_SPEED + Math.random() * (MAX_SPEED - MIN_SPEED);
            }

            if (fishImage.complete && fishImage.naturalWidth > 0) {
                ctx.save();
                ctx.translate(fish.x, fish.y);
                ctx.scale(-1, 1);
                ctx.drawImage(fishImage, -FISH_SIZE / 2, -FISH_SIZE / 2, FISH_SIZE, FISH_SIZE);
                ctx.restore();
            }
        });

        requestAnimationFrame(animate);
    }

    fishImage.onload = () => { animate(); };
    if (fishImage.complete) { animate(); }
}


// ===================================================
// 板塊二：紅色連線網絡（同樣加入安全檢查）
// ===================================================
const netCanvas = document.getElementById('networkCanvas');

// 💡 只有當網絡畫布存在時（主頁），才執行連線動畫
if (netCanvas) {
    const netCtx = netCanvas.getContext('2d');
    const menuButtons = document.querySelectorAll('.menu-btn');
    const buttonLinks = [];

    function resizeNetCanvas() {
        netCanvas.width = window.innerWidth;
        netCanvas.height = window.innerHeight;
        initNetwork();
    }

    function initNetwork() {
        buttonLinks.length = 0;
        menuButtons.forEach(() => {
            const lineCount = Math.floor(Math.random() * 3) + 3;
            const targetX = Math.random() * window.innerWidth;
            const targetY = Math.random() * window.innerHeight;

            const linesInfo = [];
            for (let i = 0; i < lineCount; i++) {
                const side = Math.floor(Math.random() * 4);
                const percent = Math.random();
                linesInfo.push({ side, percent });
            }

            buttonLinks.push({ lines: linesInfo, targetX: targetX, targetY: targetY });
        });
    }

    function drawNetworkLines() {
        netCtx.clearRect(0, 0, netCanvas.width, netCanvas.height);
        const page2Rect = document.getElementById('page2').getBoundingClientRect();

        menuButtons.forEach((btn, index) => {
            const linkData = buttonLinks[index];
            if (!linkData) return;

            const rect = btn.getBoundingClientRect();
            const left = rect.left;
            const right = rect.right;
            const top = rect.top - page2Rect.top;
            const bottom = rect.bottom - page2Rect.top;
            const width = rect.width;
            const height = rect.height;

            netCtx.strokeStyle = '#ff3b30';
            netCtx.lineWidth = 1.5;

            linkData.lines.forEach(line => {
                let startX = 0; let startY = 0;
                switch (line.side) {
                    case 0: startX = left + width * line.percent; startY = top; break;
                    case 1: startX = left + width * line.percent; startY = bottom; break;
                    case 2: startX = left; startY = top + height * line.percent; break;
                    case 3: startX = right; startY = top + height * line.percent; break;
                }
                netCtx.beginPath();
                netCtx.moveTo(startX, startY);
                netCtx.lineTo(linkData.targetX, linkData.targetY);
                netCtx.stroke();
            });

            netCtx.fillRect(linkData.targetX - 3, linkData.targetY - 3, 6, 6);
        });

        requestAnimationFrame(drawNetworkLines);
    }

    window.addEventListener('resize', resizeNetCanvas);
    resizeNetCanvas();
    drawNetworkLines();
}


// ===================================================
// 🛠️ 全域通用：右側導覽列交互 與 復古錯誤彈窗邏輯
// （這段放在最下面，確保在任何頁面都能正常運作）
// ===================================================
const menuToggle = document.getElementById('menuToggle');
const sidebarOverlay = document.getElementById('sidebarOverlay');
const contractTrigger = document.getElementById('contractTrigger');
const retroModal = document.getElementById('retroModal');
const modalXClose = document.getElementById('modalXClose');
const modalOkClose = document.getElementById('modalOkClose');

// 確保選單按鈕存在才綁定點擊事件
if (menuToggle && sidebarOverlay) {
    menuToggle.addEventListener('click', () => {
        menuToggle.classList.toggle('active');
        sidebarOverlay.classList.toggle('open');
    });
}

// 點擊 Contract 字樣開啟郵件彈窗
if (contractTrigger && retroModal) {
    contractTrigger.addEventListener('click', () => {
        retroModal.classList.add('show');
    });
}

// 點擊右上角 X 關閉彈窗
if (modalXClose && retroModal) {
    modalXClose.addEventListener('click', () => {
        retroModal.classList.remove('show');
    });
}

// 點擊 Send 按鈕：喚醒系統預設 Email App 並帶入收件者
if (modalOkClose && retroModal) {
    modalOkClose.addEventListener('click', () => {
        const yourEmail = "naomiya978@gmail.com"; // 📌 這裡輸入你收信的 Email
        const subject = encodeURIComponent("Contact from Naomi's World");

        window.location.href = `mailto:${yourEmail}?subject=${subject}`;
        retroModal.classList.remove('show');
    });
}
