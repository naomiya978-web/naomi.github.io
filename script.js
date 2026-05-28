const canvas = document.getElementById('fishCanvas');
const ctx = canvas.getContext('2d');

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}
window.addEventListener('resize', resizeCanvas);
resizeCanvas();

const fishImage = new Image();
fishImage.src = 'images/Fish.png';

const fishes = [
    {
        x: 200, y: 200,
        anchorX: 600, anchorY: 300,
        vx: 0.6, vy: 0.15,
        size: 120,
        angle: 0,
        url: 'project1.html'
    },
    {
        x: 600, y: 400,
        anchorX: 500, anchorY: 350,
        vx: -0.5, vy: -0.1,
        size: 110,
        angle: Math.PI / 2,
        url: 'project2.html'
    },
    {
        x: 300, y: 400,
        anchorX: 700, anchorY: 400,
        vx: -0.5, vy: -0.15,
        size: 110,
        angle: 0,
        url: 'project3.html'
    },
    {
        x: 1000, y: 600,
        anchorX: 1000, anchorY: 350,
        vx: -0.5, vy: -0.1,
        size: 110,
        angle: Math.PI / 2,
        url: 'project2.html'
    }
];

function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    fishes.forEach(fish => {
        fish.x += fish.vx;

        fish.angle += 0.01;
        fish.y += fish.vy + Math.sin(fish.angle) * 0.2;

        const halfSize = fish.size / 2;
        if (fish.x - halfSize < 0) {
            fish.x = halfSize;
            fish.vx = -fish.vx;
        } else if (fish.x + halfSize > canvas.width) {
            fish.x = canvas.width - halfSize;
            fish.vx = -fish.vx;
        }

        if (fish.y - halfSize < 0 || fish.y + halfSize > canvas.height) {
            fish.vy = -fish.vy;
        }

        ctx.beginPath();
        ctx.arc(fish.anchorX, fish.anchorY, 4, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(255, 59, 48, 0.6)';
        ctx.fill();

        ctx.beginPath();
        ctx.moveTo(fish.anchorX, fish.anchorY);
        ctx.lineTo(fish.x, fish.y);

        ctx.strokeStyle = 'rgba(255, 59, 48, 0.6)';
        ctx.lineWidth = 1.5;
        ctx.stroke();

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

fishImage.onload = () => {
    animate();
};
animate();

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

canvas.addEventListener('mousemove', function (event) {
    const rect = canvas.getBoundingClientRect();
    const mouseX = event.clientX - rect.left;
    const mouseY = event.clientY - rect.top;

    let isHoveringFish = false;

    for (let i = 0; i < fishes.length; i++) {
        const fish = fishes[i];
        const distance = Math.sqrt((mouseX - fish.x) ** 2 + (mouseY - fish.y) ** 2);

        if (distance < fish.size / 2) {
            isHoveringFish = true;
            break;
        }
    }

    // 根據偵測結果改變滑鼠樣式
    if (isHoveringFish) {
        canvas.style.cursor = 'pointer';
    } else {
        canvas.style.cursor = 'default';
    }
});
