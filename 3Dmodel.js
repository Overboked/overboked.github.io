// Инициализация сцены для модели
const modelScene = new THREE.Scene();
const modelCamera = new THREE.PerspectiveCamera(30, 1, 1, 1000);
const modelCanvas = document.getElementById('modelCanvas1');
const modelRenderer = new THREE.WebGLRenderer({ 
    canvas: modelCanvas, 
    alpha: true, 
    antialias: true 
});
modelRenderer.setPixelRatio(window.devicePixelRatio > 2 ? window.devicePixelRatio : 2);
modelRenderer.shadowMap.enabled = true;
modelRenderer.shadowMap.type = THREE.PCFSoftShadowMap;
modelRenderer.toneMapping = THREE.ACESFilmicToneMapping;
modelRenderer.toneMappingExposure = 1;

// === Глобальные переменные для postprocessing ===
let composer, renderPass, bloomPass;

// Адаптивный размер
function updateModelRendererSize() {
    const container = document.querySelector('.hero-model');
    if (!container) return;
    const width = container.clientWidth;
    const height = container.clientHeight;
    // Устанавливаем физический размер canvas для высокой четкости
    modelRenderer.setSize(width, height, false);
    modelRenderer.domElement.width = width * window.devicePixelRatio;
    modelRenderer.domElement.height = height * window.devicePixelRatio;
    modelCamera.aspect = width / height;
    modelCamera.updateProjectionMatrix();
}

// Ждем загрузки DOM
document.addEventListener('DOMContentLoaded', () => {
    updateModelRendererSize();
});
window.addEventListener('resize', updateModelRendererSize);

// Прозрачный фон
modelScene.background = null;

// Улучшенное освещение
const ambientLight = new THREE.AmbientLight(0x404040, 0.4);
modelScene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
directionalLight.position.set(5, 5, 5);
directionalLight.castShadow = true;
directionalLight.shadow.mapSize.width = 2048;
directionalLight.shadow.mapSize.height = 2048;
modelScene.add(directionalLight);

const pointLight1 = new THREE.PointLight(0xffcc00, 0.5, 100);
pointLight1.position.set(-5, 5, 5);
modelScene.add(pointLight1);

const pointLight2 = new THREE.PointLight(0x00ccff, 0.3, 100);
pointLight2.position.set(5, -5, -5);
modelScene.add(pointLight2);

// Переменные для интерактивности
let mouseX = 0;
let mouseY = 0;
let targetRotationX = 0;
let targetRotationY = 0;

// Загрузка модели
let model;
const loader = new THREE.GLTFLoader();
let modelLoadedAndRendered = false;
let modelLoadedAndRenderedTimeout = false;

// Уведомляем прелоадер о начале загрузки модели
if (window.preloaderManager) {
    window.preloaderManager.addResource('3d-model', 'models/main.glb');
}

loader.load(
    'models/main.glb',
    (gltf) => {
        model = gltf.scene;

        // Включаем тени для модели
        model.traverse((child) => {
            if (child.isMesh) {
                child.castShadow = true;
                child.receiveShadow = true;
            }
        });

        // Автоматическое масштабирование
        const box = new THREE.Box3().setFromObject(model);
        const size = box.getSize(new THREE.Vector3());
        const maxDim = Math.max(size.x, size.y, size.z);
        const scale = 3 / maxDim;
        model.scale.set(scale, scale, scale);

        // Центрирование: ставим низ модели на Y=0, центрируем по X и Z
        const center = box.getCenter(new THREE.Vector3());
        const min = box.min;
        model.position.set(-center.x, -min.y, -center.z);

        modelScene.add(model);
        console.log('Модель загружена:', model);

        // === Смена эмиссии материала при скролле ===
        function lerpColor(a, b, t) {
            return new THREE.Color(
                a.r + (b.r - a.r) * t,
                a.g + (b.g - a.g) * t,
                a.b + (b.b - a.b) * t
            );
        }
        const emissiveA = new THREE.Color('rgb(0, 0, 0)'); // начальная эмиссия
        const emissiveB = new THREE.Color('#e91e63'); // конечная эмиссия
        window.addEventListener('scroll', () => {
            const scrollMax = document.body.scrollHeight - window.innerHeight;
            const scroll = Math.max(0, Math.min(window.scrollY, scrollMax));
            const t = scrollMax > 0 ? scroll / scrollMax : 0;
            const newEmissive = lerpColor(emissiveA, emissiveB, t*0);
            model.traverse(child => {
                if (child.isMesh && child.material && child.material.emissive) {
                    child.material.emissive.copy(newEmissive);
                }
            });
        });

        // Позиция камеры (смотрит немного сверху и чуть правее)
        const cameraY = maxDim * 1.5; // поднять камеру выше модели
        const cameraX = maxDim * 4; // сместить немного вправо
        modelCamera.position.set(cameraX, cameraY, maxDim * 4);
        modelCamera.lookAt(2.5, 2, 0); // смотреть чуть выше пола
    },
    (progress) => {
        const percentage = (progress.loaded / progress.total * 100);
        console.log(`Загрузка: ${percentage.toFixed(2)}%`);
        
        // Обновляем прогресс прелоадера
        if (window.preloaderManager && percentage < 100) {
            window.preloaderManager.setProgress(percentage * 0.6); // 60% от общего прогресса
        }
    },
    (error) => {
        console.error('Ошибка загрузки модели:', error);
        
        // Уведомляем прелоадер об ошибке (считаем как загруженный)
        if (window.preloaderManager) {
            window.preloaderManager.markResourceLoaded('models/main.glb');
        }
        
        // Создаем fallback геометрию
        createFallbackGeometry();
    }
);

// Создание запасной геометрии, если модель не загрузилась
function createFallbackGeometry() {
    const geometry = new THREE.TorusKnotGeometry(1, 0.3, 100, 16);
    const material = new THREE.MeshPhongMaterial({ 
        color: 0xffcc00,
        shininess: 100
    });
    model = new THREE.Mesh(geometry, material);
    model.castShadow = true;
    model.receiveShadow = true;
    modelScene.add(model);
    modelCamera.position.z = 100;
}

// Обработка движения мыши для интерактивности
document.addEventListener('mousemove', (event) => {
    mouseX = (event.clientX / window.innerWidth) * 2 - 1;
    mouseY = -(event.clientY / window.innerHeight) * 2 + 1;
    
    targetRotationY = mouseX * 0.5;
    targetRotationX = mouseY * 0.3;
});

// Анимация с интерактивностью
function animateModel() {
    requestAnimationFrame(animateModel);
    if (model) {
        model.rotation.y += (targetRotationY - model.rotation.y) * 0.05;
        model.rotation.x += (targetRotationX - model.rotation.x) * 0.05;
        model.rotation.y += 0.003;
        model.position.y = Math.sin(Date.now() * 0.001) * 0.1;
        // После первого успешного рендера модели уведомляем прелоадер с задержкой
        if (!modelLoadedAndRendered && !modelLoadedAndRenderedTimeout && window.preloaderManager) {
            modelLoadedAndRenderedTimeout = true;
            setTimeout(() => {
                window.preloaderManager.markResourceLoaded('models/main.glb');
                modelLoadedAndRendered = true;
            }, 150); // 150 мс задержка для гарантии отрисовки
        }
    }
    pointLight1.intensity = 0.5 + Math.sin(Date.now() * 0.002) * 0.2;
    pointLight2.intensity = 0.3 + Math.cos(Date.now() * 0.003) * 0.1;
    modelRenderer.render(modelScene, modelCamera);
}

// Запускаем анимацию после загрузки DOM
document.addEventListener('DOMContentLoaded', () => {
    animateModel();
});