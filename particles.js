// particles.js
const particleScene = new THREE.Scene();
const particleCamera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const particleRenderer = new THREE.WebGLRenderer({ canvas: document.getElementById('particlesCanvas'), alpha: true });
particleRenderer.setSize(window.innerWidth, window.innerHeight);

const particleCount = 9000;
const positions = new Float32Array(particleCount * 3);
const velocities = new Float32Array(particleCount * 3);
const colors = new Float32Array(particleCount * 3);
const originalPositions = new Float32Array(particleCount * 3);
const targetPositions = new Float32Array(particleCount * 3);

// Состояния анимации
let animationState = 'forming'; // 'forming' -> 'formed' -> 'dispersing' -> 'free'
let stateStartTime = 0;
let isPreloaderFinished = false;

// --- IIL буквы: расширенная область для размещения всех частиц ---
const IIL_AREAS = [];
(function generateIILAreas() {
    // Переворачиваем логотип (умножаем y на -1)
    // Создаем области букв IIL с большим количеством позиций для всех частиц
    const letterSpacing = 80;
    const letterHeight = 120;
    const strokeWidth = 20; // Увеличили толщину для больше места
    const jitterRange = 1; // Случайное смещение для естественности
    
    // I (левая) - x: -80
    for (let y = -letterHeight/2; y <= letterHeight/2; y += 3) { // Уменьшили шаг для больше точек
        for (let x = -strokeWidth/2; x <= strokeWidth/2; x += 2) {
            for (let z = -20; z <= 20; z += 4) { // Добавили глубину
                // Случайное смещение для естественности
                const jitterX = (Math.random() - 0.5) * jitterRange;
                const jitterY = (Math.random() - 0.5) * jitterRange;
                const jitterZ = (Math.random() - 0.5) * jitterRange;
                
                IIL_AREAS.push({ 
                    x: -letterSpacing + x + jitterX, 
                    y: -(y + jitterY), // Переворот по Y
                    z: z + jitterZ 
                });
            }
        }
    }
    
    // I (средняя) - x: 0
    for (let y = -letterHeight/2; y <= letterHeight/2; y += 3) {
        for (let x = -strokeWidth/2; x <= strokeWidth/2; x += 2) {
            for (let z = -20; z <= 20; z += 4) {
                const jitterX = (Math.random() - 0.5) * jitterRange;
                const jitterY = (Math.random() - 0.5) * jitterRange;
                const jitterZ = (Math.random() - 0.5) * jitterRange;
                
                IIL_AREAS.push({ 
                    x: x + jitterX, 
                    y: -(y + jitterY), // Переворот по Y
                    z: z + jitterZ 
                });
            }
        }
    }
    
    // L - x: 80
    // Вертикальная часть
    for (let y = -letterHeight/2; y <= letterHeight/2; y += 3) {
        for (let x = -strokeWidth/2; x <= strokeWidth/2; x += 2) {
            for (let z = -20; z <= 20; z += 4) {
                const jitterX = (Math.random() - 0.5) * jitterRange;
                const jitterY = (Math.random() - 0.5) * jitterRange;
                const jitterZ = (Math.random() - 0.5) * jitterRange;
                
                IIL_AREAS.push({ 
                    x: letterSpacing + x + jitterX, 
                    y: -(y + jitterY), // Переворот по Y
                    z: z + jitterZ 
                });
            }
        }
    }
    
    // Горизонтальная часть L
    for (let x = letterSpacing; x <= letterSpacing + 50; x += 3) { // Увеличили длину
        for (let y = letterHeight/2 - strokeWidth/2; y <= letterHeight/2 + strokeWidth/2; y += 2) {
            for (let z = -20; z <= 20; z += 4) {
                const jitterX = (Math.random() - 0.5) * jitterRange;
                const jitterY = (Math.random() - 0.5) * jitterRange;
                const jitterZ = (Math.random() - 0.5) * jitterRange;
                
                IIL_AREAS.push({ 
                    x: x + jitterX, 
                    y: -(y + jitterY), // Переворот по Y
                    z: z + jitterZ 
                });
            }
        }
    }
})();

const geometry = new THREE.BufferGeometry();

// Размещаем ПОЛОВИНУ частиц внутри букв IIL, остальные - случайно
for (let i = 0; i < particleCount; i++) {
    if (i < particleCount / 5) {
        // Первая половина (4500 частиц) - внутри букв IIL
        const areaIndex = Math.floor(Math.random() * IIL_AREAS.length);
        const area = IIL_AREAS[areaIndex];
        
        positions[i * 3] = area.x;
        positions[i * 3 + 1] = area.y;
        positions[i * 3 + 2] = area.z;
    } else {
        // Вторая половина (4500 частиц) - случайное распределение по всему экрану
        positions[i * 3] = (Math.random() - 0.5) * 1000;
        positions[i * 3 + 1] = (Math.random() - 0.5) * 1000;
        positions[i * 3 + 2] = (Math.random() - 0.5) * 200;
    }
    
    // Сохраняем изначальные позиции
    originalPositions[i * 3] = positions[i * 3];
    originalPositions[i * 3 + 1] = positions[i * 3 + 1];
    originalPositions[i * 3 + 2] = positions[i * 3 + 2];
    
    velocities[i * 3] = 0;
    velocities[i * 3 + 1] = 0;
    velocities[i * 3 + 2] = 0;
    const rnd = Math.random() + 0.5;
    colors[i * 3] = rnd;
    colors[i * 3 + 1] = rnd;
    colors[i * 3 + 2] = rnd;
}
geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

const textureLoader = new THREE.TextureLoader();
const glowTexture = textureLoader.load('images/particle.png');
const material = new THREE.PointsMaterial({
    size: 8,
    map: glowTexture,
    vertexColors: true,
    transparent: true,
    opacity: 1.5,
    blending: THREE.AdditiveBlending,
    depthWrite: false
});
const points = new THREE.Points(geometry, material);
particleScene.add(points);

particleCamera.position.z = 500;
particleCamera.lookAt(0, 0, 0);

const simplex = new SimplexNoise();
let time = 0;

function curlNoise(x, y, z, t) {
    const scale = 0.001;
    const eps = 0.1;
    const nx = simplex.noise3D(y * scale + eps, z * scale, t) - simplex.noise3D(y * scale - eps, z * scale, t);
    const ny = simplex.noise3D(x * scale + eps, z * scale, t) - simplex.noise3D(x * scale - eps, z * scale, t);
    const nz = simplex.noise3D(x * scale + eps, y * scale, t) - simplex.noise3D(x * scale - eps, y * scale, t);
    return [nz - ny, nx - nz, ny - nx];
}

let mouse = { x: 0, y: 0 };
let mouseOnPlane = new THREE.Vector3();
const planeZ = new THREE.Plane(new THREE.Vector3(0, 0, 1), 0);
const raycaster = new THREE.Raycaster();
window.addEventListener('mousemove', (e) => {
    mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;
    raycaster.setFromCamera(mouse, particleCamera);
    raycaster.ray.intersectPlane(planeZ, mouseOnPlane);
});

// Создаем точки для интерактивного режима (меньше точек, сетка)
const IIL_POINTS = [];
(function generateIILPoints() {
    const letterSpacing = 80;
    const letterHeight = 120;
    const strokeWidth = 8;
    
    // I (левая)
    for (let y = -letterHeight/2; y <= letterHeight/2; y += 8) {
        for (let x = -strokeWidth/2; x <= strokeWidth/2; x += 4) {
            IIL_POINTS.push({ x: -letterSpacing + x, y: -y, z: 0 }); // Переворот по Y
        }
    }
    
    // I (средняя)
    for (let y = -letterHeight/2; y <= letterHeight/2; y += 8) {
        for (let x = -strokeWidth/2; x <= strokeWidth/2; x += 4) {
            IIL_POINTS.push({ x: x, y: -y, z: 0 }); // Переворот по Y
        }
    }
    
    // L - вертикальная часть
    for (let y = -letterHeight/2; y <= letterHeight/2; y += 8) {
        for (let x = -strokeWidth/2; x <= strokeWidth/2; x += 4) {
            IIL_POINTS.push({ x: letterSpacing + x, y: -y, z: 0 }); // Переворот по Y
        }
    }
    
    // L - горизонтальная часть
    for (let x = letterSpacing; x <= letterSpacing + 40; x += 8) {
        for (let y = letterHeight/2 - strokeWidth/2; y <= letterHeight/2 + strokeWidth/2; y += 4) {
            IIL_POINTS.push({ x: x, y: -y, z: 0 }); // Переворот по Y
        }
    }
})();


// Инициализация целевых позиций для формирования букв
function initializeLetterFormation() {
    // Назначаем ближайшие частицы к точкам букв
    const used = new Set();
    
    for (let j = 0; j < Math.min(IIL_POINTS.length, particleCount); j++) {
        let minDist = Infinity, minIdx = -1;
        
        for (let i = 0; i < particleCount; i++) {
            if (used.has(i)) continue;
            
            const dx = originalPositions[i * 3] - IIL_POINTS[j].x;
            const dy = originalPositions[i * 3 + 1] - IIL_POINTS[j].y;
            const dz = originalPositions[i * 3 + 2] - IIL_POINTS[j].z;
            const dist = dx*dx + dy*dy + dz*dz;
            
            if (dist < minDist) {
                minDist = dist;
                minIdx = i;
            }
        }
        
        if (minIdx !== -1) {
            used.add(minIdx);
            targetPositions[minIdx * 3] = IIL_POINTS[j].x;
            targetPositions[minIdx * 3 + 1] = IIL_POINTS[j].y;
            targetPositions[minIdx * 3 + 2] = IIL_POINTS[j].z;
        }
    }
    
    // Остальные частицы остаются на своих местах
    for (let i = 0; i < particleCount; i++) {
        if (!used.has(i)) {
            targetPositions[i * 3] = originalPositions[i * 3];
            targetPositions[i * 3 + 1] = originalPositions[i * 3 + 1];
            targetPositions[i * 3 + 2] = originalPositions[i * 3 + 2];
        }
    }
}

// Функция для обработки завершения прелоадера
window.addEventListener('preloaderFinished', () => {
    isPreloaderFinished = true;
    stateStartTime = Date.now();
    animationState = 'forming';
    initializeLetterFormation();
});

const IIL_COUNT = IIL_POINTS.length;

function animateParticles() {
    requestAnimationFrame(animateParticles);
    time += 0.001;
    
    const currentTime = Date.now();
    const timeSinceStateStart = currentTime - stateStartTime;
    
    if (!isPreloaderFinished) {
        // До завершения прелоадера - обычная анимация curl noise
        for (let i = 0; i < particleCount; i++) {
            const x = positions[i * 3];
            const y = positions[i * 3 + 1];
            const z = positions[i * 3 + 2];
            const [nx, ny, nz] = curlNoise(x, y, z, time);
            
            velocities[i * 3] += nx * 0.1;
            velocities[i * 3 + 1] += ny * 0.1;
            velocities[i * 3 + 2] += nz * 0.1;
            
            // Ограничение скорости
            const speedLimit = 1.5;
            velocities[i * 3] = Math.max(-speedLimit, Math.min(speedLimit, velocities[i * 3]));
            velocities[i * 3 + 1] = Math.max(-speedLimit, Math.min(speedLimit, velocities[i * 3 + 1]));
            velocities[i * 3 + 2] = Math.max(-speedLimit, Math.min(speedLimit, velocities[i * 3 + 2]));
            
            // Обновление позиции
            positions[i * 3] += velocities[i * 3];
            positions[i * 3 + 1] += velocities[i * 3 + 1];
            positions[i * 3 + 2] += velocities[i * 3 + 2];
            
            // Границы
            const boundary = 1000;
            if (positions[i * 3] > boundary) positions[i * 3] = -boundary;
            if (positions[i * 3] < -boundary) positions[i * 3] = boundary;
            if (positions[i * 3 + 1] > boundary) positions[i * 3 + 1] = -boundary;
            if (positions[i * 3 + 1] < -boundary) positions[i * 3 + 1] = boundary;
            if (positions[i * 3 + 2] > boundary) positions[i * 3 + 2] = -boundary;
            if (positions[i * 3 + 2] < -boundary) positions[i * 3 + 2] = boundary;
        }
    } else {
        // После прелоадера - управление состояниями
        switch (animationState) {
            case 'forming':
                // Формирование букв IIL (2 секунды)
                if (timeSinceStateStart < 100) {
                    const progress = timeSinceStateStart / 2000;
                    const easeProgress = 1 - Math.pow(1 - progress, 3); // ease-out cubic
                    
                    for (let i = 0; i < particleCount; i++) {
                        const targetX = targetPositions[i * 3];
                        const targetY = targetPositions[i * 3 + 1];
                        const targetZ = targetPositions[i * 3 + 2];
                        const startX = originalPositions[i * 3];
                        const startY = originalPositions[i * 3 + 1];
                        const startZ = originalPositions[i * 3 + 2];
                        
                        positions[i * 3] = startX + (targetX - startX) * easeProgress;
                        positions[i * 3 + 1] = startY + (targetY - startY) * easeProgress;
                        positions[i * 3 + 2] = startZ + (targetZ - startZ) * easeProgress;
                    }
                } else {
                    animationState = 'formed';
                    stateStartTime = currentTime;
                }
                break;
                
            case 'formed':
                // Удержание формы букв (3 секунды)
                if (timeSinceStateStart < 100) {
                    // Частицы остаются в позициях букв с небольшим дрожанием
                    for (let i = 0; i < particleCount; i++) {
                        const jitter = 2;
                        positions[i * 3] = targetPositions[i * 3] + (Math.random() - 0.5) * jitter;
                        positions[i * 3 + 1] = targetPositions[i * 3 + 1] + (Math.random() - 0.5) * jitter;
                        positions[i * 3 + 2] = targetPositions[i * 3 + 2] + (Math.random() - 0.5) * jitter;
                    }
                } else {
                    animationState = 'dispersing';
                    stateStartTime = currentTime;
                }
                break;
                
            case 'dispersing':
                // Рассеивание (1.5 секунды)
                if (timeSinceStateStart < 150) {
                    const progress = timeSinceStateStart / 1500;
                    const easeProgress = Math.pow(progress, 2); // ease-in quadratic
                    
                    for (let i = 0; i < particleCount; i++) {
                        const [nx, ny, nz] = curlNoise(positions[i * 3], positions[i * 3 + 1], positions[i * 3 + 2], time);
                        
                        velocities[i * 3] = velocities[i * 3] * 0.95 + nx * 0.2 * easeProgress;
                        velocities[i * 3 + 1] = velocities[i * 3 + 1] * 0.95 + ny * 0.2 * easeProgress;
                        velocities[i * 3 + 2] = velocities[i * 3 + 2] * 0.95 + nz * 0.2 * easeProgress;
                        
                        positions[i * 3] += velocities[i * 3];
                        positions[i * 3 + 1] += velocities[i * 3 + 1];
                        positions[i * 3 + 2] += velocities[i * 3 + 2];
                    }
                } else {
                    animationState = 'free';
                    stateStartTime = currentTime;
                }
                break;
                
            case 'free':
                // Свободное движение с curl noise и взаимодействием с мышью
                performNormalAnimation();
                break;
        }
    }
    
    geometry.attributes.position.needsUpdate = true;
    particleRenderer.render(particleScene, particleCamera);
}

function performNormalAnimation() {
    // Оригинальная логика анимации с IIL при наведении мыши
    // --- Найти частицы в радиусе ---
    const particlesInRadius = [];
    const cam = particleCamera.position;
    for (let i = 0; i < particleCount; i++) {
        const x = positions[i * 3];
        const y = positions[i * 3 + 1];
        const z = positions[i * 3 + 2];
        const dirz = z - cam.z;
        if (Math.abs(dirz) > 1e-6) {
            const t = -cam.z / dirz;
            if (t > 0 && t < 2) {
                const projX = cam.x + (x - cam.x) * t;
                const projY = cam.y + (y - cam.y) * t;
                const dx = projX - mouseOnPlane.x;
                const dy = projY - mouseOnPlane.y;
                const dist = Math.sqrt(dx*dx + dy*dy);
                if (dist < 180) particlesInRadius.push({ i, projX, projY });
            }
        }
    }
    // --- Назначить ближайшие частицы к точкам букв ---
    const used = new Set();
    for (let j = 0; j < Math.min(IIL_POINTS.length, particlesInRadius.length); j++) {
        // Найти ближайшую неиспользованную частицу к точке буквы
        let minDist = Infinity, minIdx = -1;
        for (let k = 0; k < particlesInRadius.length; k++) {
            if (used.has(k)) continue;
            const dx = particlesInRadius[k].projX - (mouseOnPlane.x + IIL_POINTS[j].x);
            const dy = particlesInRadius[k].projY - (mouseOnPlane.y + IIL_POINTS[j].y);
            const d = dx*dx + dy*dy;
            if (d < minDist) { minDist = d; minIdx = k; }
        }
        if (minIdx !== -1) {
            used.add(minIdx);
            const i = particlesInRadius[minIdx].i;
            const x = positions[i * 3];
            const y = positions[i * 3 + 1];
            const z = positions[i * 3 + 2];
            const dirz = z - cam.z;
            if (Math.abs(dirz) > 1e-6) {
                const t = -cam.z / dirz;
                if (t > 0 && t < 2) {
                    const projX = cam.x + (x - cam.x) * t;
                    const projY = cam.y + (y - cam.y) * t;
                    const dx = (mouseOnPlane.x + IIL_POINTS[j].x) - projX;
                    const dy = (mouseOnPlane.y + IIL_POINTS[j].y) - projY;
                    const dist = Math.sqrt(dx*dx + dy*dy) + 1e-6;
                    const force = 6.0 * (1 - Math.min(dist/40,1));
                    velocities[i * 3] = velocities[i * 3] * 0.4 + dx / dist * force;
                    velocities[i * 3 + 1] = velocities[i * 3 + 1] * 0.4 + dy / dist * force;
                    velocities[i * 3 + 2] = velocities[i * 3 + 2] * 0.4 + curlNoise(x, y, z, time)[2] * 0.03;
                }
            }
        }
    }
    // --- Обычное поведение для остальных ---
    for (let i = 0; i < particleCount; i++) {
        let isLetter = false;
        for (let k of used) if (particlesInRadius[k].i === i) isLetter = true;
        if (!isLetter) {
            const x = positions[i * 3];
            const y = positions[i * 3 + 1];
            const z = positions[i * 3 + 2];
            const [nx, ny, nz] = curlNoise(x, y, z, time);
            velocities[i * 3] += nx * .1;
            velocities[i * 3 + 1] += ny * .1;
            velocities[i * 3 + 2] += nz * .1;
            const cam = particleCamera.position;
            const dirz = z - cam.z;
            if (Math.abs(dirz) > 1e-6) {
                const t = -cam.z / dirz;
                if (t > 0 && t < 2) {
                    const projX = cam.x + (x - cam.x) * t;
                    const projY = cam.y + (y - cam.y) * t;
                    const dx = projX - mouseOnPlane.x;
                    const dy = projY - mouseOnPlane.y;
                    const dist = Math.sqrt(dx*dx + dy*dy);
                    const influenceRadius = 200;
                    if (dist < influenceRadius) {
                        const force = (1 - dist / influenceRadius) * 8.0;
                        velocities[i * 3] += dx / dist * force;
                        velocities[i * 3 + 1] += dy / dist * force;
                    }
                }
            }
        }
        // Ограничение скорости
        const speedLimit = 1.5;
        velocities[i * 3] = Math.max(-speedLimit, Math.min(speedLimit, velocities[i * 3]));
        velocities[i * 3 + 1] = Math.max(-speedLimit, Math.min(speedLimit, velocities[i * 3 + 1]));
        velocities[i * 3 + 2] = Math.max(-speedLimit, Math.min(speedLimit, velocities[i * 3 + 2]));
        // Обновление позиции
        positions[i * 3] += velocities[i * 3];
        positions[i * 3 + 1] += velocities[i * 3 + 1];
        positions[i * 3 + 2] += velocities[i * 3 + 2];
        // Границы
        const boundary = 1000;
        if (positions[i * 3] > boundary) positions[i * 3] = -boundary;
        if (positions[i * 3] < -boundary) positions[i * 3] = boundary;
        if (positions[i * 3 + 1] > boundary) positions[i * 3 + 1] = -boundary;
        if (positions[i * 3 + 1] < -boundary) positions[i * 3 + 1] = boundary;
        if (positions[i * 3 + 2] > boundary) positions[i * 3 + 2] = -boundary;
        if (positions[i * 3 + 2] < -boundary) positions[i * 3 + 2] = boundary;
    }
}

animateParticles();

document.getElementById('toggleParticles').addEventListener('change', (event) => {
    points.visible = event.target.checked;
});

window.addEventListener('resize', () => {
    particleCamera.aspect = window.innerWidth / window.innerHeight;
    particleCamera.updateProjectionMatrix();
    particleRenderer.setSize(window.innerWidth, window.innerHeight);
});