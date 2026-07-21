const canvas = document.getElementById('fishCanvas');
const ctx = canvas.getContext('2d');

// 調整畫布大小為全螢幕
function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}
window.addEventListener('resize', resizeCanvas);
resizeCanvas();

// 預載入金魚的圖片
const fishImage = new Image();
fishImage.src = 'images/fish.png'; // 確保圖片路徑正確

// 定義金魚群的資料
const fishes = [
    {
        x: 200, y: 200,             // 金魚初始位置
        anchorX: 600, anchorY: 300,   // 線的另一端（固定點）
        vx: 0.6, vy: 0.15,          // ★ 速度調慢（原本為 2.0 / 0.5）
        size: 120,                  // 金魚尺寸
        angle: 0,                   // 用於垂直方向的微幅上下波浪律動
        url: '../naomi.github.io/game/blueday.html'        // 點擊跳轉的專案頁面
    },
    {
        x: 600, y: 400,
        anchorX: 500, anchorY: 350,
        vx: -0.5, vy: -0.1,         // ★ 速度調慢（原本為 -1.8 / -0.4）
        size: 110,                  // 金魚尺寸
        angle: Math.PI / 2,
        url: '../naomi.github.io/game/flymetothemoon.html'
    },
    {
        x: 300, y: 400,
        anchorX: 700, anchorY: 400,
        vx: -0.5, vy: -0.15,         // ★ 速度調慢（原本為 -1.8 / -0.4）
        size: 110,                  // 金魚尺寸
        angle: 0,
        url: '../naomi.github.io/game/youknowtomuch.html'
    },
    {
        x: 1000, y: 600,
        anchorX: 1000, anchorY: 250,
        vx: -0.5, vy: -0.1,         // ★ 速度調慢（原本為 -1.8 / -0.4）
        size: 110,                  // 金魚尺寸
        angle: Math.PI / 2,
        url: '../naomi.github.io/animation/hypothermia.html'
    },
    {
        x: 1500, y: 300,
        anchorX: 900, anchorY: 150,
        vx: -0.8, vy: -0.1,         // ★ 速度調慢（原本為 -1.8 / -0.4）
        size: 110,                  // 金魚尺寸
        angle: Math.PI / 2,
        url: '../naomi.github.io/animation/fused.html'
    },
    {
        x: 1200, y: 150,
        anchorX: 700, anchorY: 200,
        vx: -0.8, vy: -0.4,         // ★ 速度調慢（原本為 -1.8 / -0.4）
        size: 110,                  // 金魚尺寸
        angle: Math.PI / 2,
        url: '../naomi.github.io/animation/animationproject.html'
    },
    {
        x: 500, y: 100,
        anchorX: 800, anchorY: 170,
        vx: -0.8, vy: -0.2,         // ★ 速度調慢（原本為 -1.8 / -0.4）
        size: 110,                  // 金魚尺寸
        angle: Math.PI / 2,
        url: '../naomi.github.io/illustration.html'
    },
    {
        x: 1400, y: 100,
        anchorX: 600, anchorY: 400,
        vx: -0.8, vy: -0.15,         // ★ 速度調慢（原本為 -1.8 / -0.4）
        size: 110,                  // 金魚尺寸
        angle: Math.PI / 2,
        url: '../naomi.github.io/others.html'
    },
    {
        x: 300, y: 240,
        anchorX: 800, anchorY: 300,
        vx: -0.8, vy: -0.4,         // ★ 速度調慢（原本為 -1.8 / -0.4）
        size: 110,                  // 金魚尺寸
        angle: Math.PI / 2,
        url: '../naomi.github.io/others/plumblossomtrial.html'
    },
    {
        x: 700, y: 400,
        anchorX: 750, anchorY: 270,
        vx: -0.9, vy: -0.3,         // ★ 速度調慢（原本為 -1.8 / -0.4）
        size: 110,                  // 金魚尺寸
        angle: Math.PI / 2,
        url: '../naomi.github.io/others/warmbreathdesign.html'
    }
];

// 動態更新與繪製
function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    fishes.forEach(fish => {
        // 1. 位置更新：讓金魚依照速度前進
        fish.x += fish.vx;

        // 讓 Y 軸帶有一點自然的波浪上下律動（頻率與幅度也同步調順）
        fish.angle += 0.01;
        fish.y += fish.vy + Math.sin(fish.angle) * 0.2;

        // 2. 邊緣碰撞偵測（左右反轉）
        const halfSize = fish.size / 2;
        if (fish.x - halfSize < 0) {
            fish.x = halfSize;
            fish.vx = -fish.vx;
        } else if (fish.x + halfSize > canvas.width) {
            fish.x = canvas.width - halfSize;
            fish.vx = -fish.vx;
        }

        // 上下邊緣限制
        if (fish.y - halfSize < 0 || fish.y + halfSize > canvas.height) {
            fish.vy = -fish.vy;
        }

        // 3. 畫固定不動的「點」
        ctx.beginPath();
        ctx.arc(fish.anchorX, fish.anchorY, 4, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(255, 59, 48, 0.6)'; // 錨點維持白色（可依喜好換色）
        ctx.fill();

        // 4. 畫連接金魚與點的「線」
        ctx.beginPath();
        ctx.moveTo(fish.anchorX, fish.anchorY);
        ctx.lineTo(fish.x, fish.y);

        // ★ 線條顏色改為紅色（使用帶透明度的 rgba 紅色，看起來更有神祕感）
        ctx.strokeStyle = 'rgba(255, 59, 48, 0.6)';
        ctx.lineWidth = 1.5; // 稍微加粗一點點讓紅線更明顯
        ctx.stroke();

        // 5. 畫金魚（配合移動方向進行水平翻轉）
        if (fishImage.complete) {
            ctx.save();
            ctx.translate(fish.x, fish.y);

            if (fish.vx < 0) {
                ctx.scale(-1, 1);
            }

            ctx.drawImage(fishImage, -fish.size / 2, -fish.size / 2, fish.size, fish.size);
            ctx.restore();
        }
    });

    requestAnimationFrame(animate);
}

// 啟動動畫
fishImage.onload = () => {
    animate();
};
animate();

// 點擊偵測
canvas.addEventListener('click', function (event) {
    const rect = canvas.getBoundingClientRect();
    const mouseX = event.clientX - rect.left;
    const mouseY = event.clientY - rect.top;

    for (let i = 0; i < fishes.length; i++) {
        const fish = fishes[i];
        const distance = Math.sqrt((mouseX - fish.x) ** 2 + (mouseY - fish.y) ** 2);

        if (distance < fish.size / 2) {
            window.location.href = fish.url;
            break;
        }
    }
});

// 監聽滑鼠移動，當滑鼠碰到金魚時改變游標狀態
canvas.addEventListener('mousemove', function (event) {
    const rect = canvas.getBoundingClientRect();
    const mouseX = event.clientX - rect.left;
    const mouseY = event.clientY - rect.top;

    let isHoveringFish = false;

    // 檢查滑鼠有沒有碰到任何一隻金魚
    for (let i = 0; i < fishes.length; i++) {
        const fish = fishes[i];
        const distance = Math.sqrt((mouseX - fish.x) ** 2 + (mouseY - fish.y) ** 2);

        // 如果滑鼠與金魚中心點的距離小於金魚半徑，代表滑鼠正停在魚身上
        if (distance < fish.size / 2) {
            isHoveringFish = true;
            break; // 只要碰到一隻就足夠判斷了
        }
    }

    // 根據偵測結果改變滑鼠樣式
    if (isHoveringFish) {
        canvas.style.cursor = 'pointer';  // 變成小手
    } else {
        canvas.style.cursor = 'default';  // 變回普通箭頭
    }
});
