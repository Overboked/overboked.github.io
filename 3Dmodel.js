// Инициализация сцены для модели
const modelScene = new THREE.Scene();
const modelCamera = new THREE.PerspectiveCamera(75, 1, 0.1, 1000);
const modelCanvas = document.getElementById('modelCanvas');
const modelRenderer = new THREE.WebGLRenderer({ canvas: modelCanvas, alpha: true });
modelRenderer.setPixelRatio(window.devicePixelRatio);

// Адаптивный размер
function updateModelRendererSize() {
    const container = document.querySelector('.hero-model');
    const width = container.clientWidth;
    const height = container.clientHeight;
    modelRenderer.setSize(width, height);
    modelCamera.aspect = width / height;
    modelCamera.updateProjectionMatrix();
}
updateModelRendererSize();
window.addEventListener('resize', updateModelRendererSize);

// Прозрачный фон
modelScene.background = null;

// Освещение
const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
modelScene.add(ambientLight);
const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
directionalLight.position.set(5, 5, 5);
modelScene.add(directionalLight);

// Загрузка модели
let model;
const loader = new THREE.GLTFLoader();
loader.load(
    'models/main.glb',
    (gltf) => {
        model = gltf.scene;

        // Автоматическое масштабирование
        const box = new THREE.Box3().setFromObject(model);
        const size = box.getSize(new THREE.Vector3());
        const maxDim = Math.max(size.x, size.y, size.z);
        const scale = 5 / maxDim; // Увеличиваем масштаб
        model.scale.set(scale, scale, scale);

        // Центрирование
        const center = box.getCenter(new THREE.Vector3());
        model.position.sub(center);

        modelScene.add(model);
        console.log('Модель загружена:', model);

        // Позиция камеры
        modelCamera.position.z = maxDim * 2;
    },
    (progress) => {
        console.log(`Загрузка: ${(progress.loaded / progress.total * 100).toFixed(2)}%`);
    },
    (error) => {
        console.error('Ошибка загрузки модели:', error);
        modelCanvas.style.background = '#333';
        modelCanvas.textContent = 'Ошибка загрузки модели';
    }
);

// Анимация
function animateModel() {
    requestAnimationFrame(animateModel);
    if (model) {
        model.rotation.y += 0.005;
    }
    modelRenderer.render(modelScene, modelCamera);
}
animateModel();