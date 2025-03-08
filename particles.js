// particles.js
const particleScene = new THREE.Scene();
const particleCamera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const particleRenderer = new THREE.WebGLRenderer({ canvas: document.getElementById('particlesCanvas'), alpha: true });
particleRenderer.setSize(window.innerWidth, window.innerHeight);

// Загрузка текстуры свечения
const textureLoader = new THREE.TextureLoader();
const glowTexture = textureLoader.load('images/particle.png', () => {
    console.log('Текстура загружена');
}, undefined, (error) => {
    console.error('Ошибка загрузки текстуры:', error);
});

const particleCount = 5000;
const particles = []; // Массив для хранения спрайтов
const velocities = new Float32Array(particleCount * 3);


let particlesVisible = true;


for (let i = 0; i < particleCount; i++) {
    // Генерация случайного цвета для каждой частицы
    const rnd = Math.random()+0.5;
    const r = rnd; // Красный канал (0-1)
    const g = rnd; // Зелёный канал (0-1)
    const b = rnd; // Синий канал (0-1)
    const color = new THREE.Color(r, g, b);

    // Создание материала с уникальным цветом
    const spriteMaterial = new THREE.SpriteMaterial({
        map: glowTexture, // Текстура свечения
        color: color, // Случайный цвет
        transparent: true,
        opacity: 2,
        blending: THREE.AdditiveBlending, // Эффект наложения для свечения
        depthWrite: false // Улучшает наложение
    });

    const sprite = new THREE.Sprite(spriteMaterial);
    sprite.position.set(
        (Math.random() - 0.5) * 2000,
        (Math.random() - 0.5) * 2000,
        (Math.random() - 0.5) * 2000
    );
    sprite.scale.set(5, 5, 5); // Размер спрайта (настройте под нужный эффект)

    // Инициализация начальных скоростей
    velocities[i * 3] = 0;
    velocities[i * 3 + 1] = 0;
    velocities[i * 3 + 2] = 0;

    particleScene.add(sprite);
    particles.push(sprite);
}

particleCamera.position.z = 500;

const simplex = new SimplexNoise();
let time = 0;

function curlNoise(x, y, z, t) {
    const scale = 0.001;
    const eps = 0.1;
    const nx = simplex.noise3D(y * scale + eps, z * scale, t) - simplex.noise3D(y * scale - eps, z * scale, t);
    const ny = simplex.noise3D(x * scale + eps, z * scale, t) - simplex.noise3D(x * scale - eps, z * scale, t);
    const nz = simplex.noise3D(x * scale + eps, y * scale, t) - simplex.noise3D(x * scale - eps, y * scale, t);
    return [nz - ny, nx - nz, ny - nx]; // Curl = ∇ × Noise
}

function animateParticles() {
    requestAnimationFrame(animateParticles);
    time += 0.001;

    particles.forEach((particle, i) => {
        const x = particle.position.x;
        const y = particle.position.y;
        const z = particle.position.z;

        const [nx, ny, nz] = curlNoise(x, y, z, time);

        velocities[i * 3] += nx * .1;
        velocities[i * 3 + 1] += ny * .1;
        velocities[i * 3 + 2] += nz * .1;

        const speedLimit = 1.5;
        velocities[i * 3] = Math.max(-speedLimit, Math.min(speedLimit, velocities[i * 3]));
        velocities[i * 3 + 1] = Math.max(-speedLimit, Math.min(speedLimit, velocities[i * 3 + 1]));
        velocities[i * 3 + 2] = Math.max(-speedLimit, Math.min(speedLimit, velocities[i * 3 + 2]));

        particle.position.x += velocities[i * 3];
        particle.position.y += velocities[i * 3 + 1];
        particle.position.z += velocities[i * 3 + 2];

        const boundary = 1000;
        if (particle.position.x > boundary) particle.position.x = -boundary;
        if (particle.position.x < -boundary) particle.position.x = boundary;
        if (particle.position.y > boundary) particle.position.y = -boundary;
        if (particle.position.y < -boundary) particle.position.y = boundary;
        if (particle.position.z > boundary) particle.position.z = -boundary;
        if (particle.position.z < -boundary) particle.position.z = boundary;
    });

    particleRenderer.render(particleScene, particleCamera);
}
animateParticles();

// Обработчик переключателя
document.getElementById('toggleParticles').addEventListener('change', (event) => {
    particlesVisible = event.target.checked;
    particles.forEach(particle => {
        particle.visible = particlesVisible; // Включаем/выключаем видимость
    });
});

window.addEventListener('resize', () => {
    particleCamera.aspect = window.innerWidth / window.innerHeight;
    particleCamera.updateProjectionMatrix();
    particleRenderer.setSize(window.innerWidth, window.innerHeight);
});