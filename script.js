// Set up the scene, camera, and renderer
const scene = new THREE.Scene();
//const camera = new THREE.PerspectiveCamera(75, 2, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ alpha: true });
renderer.setSize(1400, 900); // Фиксированные размеры рендерера
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.outputEncoding = THREE.sRGBEncoding;

const camera = new THREE.PerspectiveCamera(75, 1, 0.1, 1000);

// Функция для изменения фокусного расстояния
function setFocalLength(focalLength) {
    const filmWidth = 36; // Стандартная ширина кадра для полнокадровой камеры (в мм)
    const fov = 2 * Math.atan(filmWidth / (2 * focalLength)) * (180 / Math.PI);
    camera.fov = fov;
    camera.updateProjectionMatrix();
}

// Устанавливаем новое фокусное расстояние (например, 50 мм)
setFocalLength(90);


document.getElementById('model-container').appendChild(renderer.domElement);

// Load the HDR environment map
const hdriLoader = new THREE.RGBELoader();
const pmremGenerator = new THREE.PMREMGenerator(renderer);
pmremGenerator.compileEquirectangularShader();

hdriLoader.load('textures/hdri.hdr', function(texture) {
    const envMap = pmremGenerator.fromEquirectangular(texture).texture;
    pmremGenerator.dispose();
    texture.dispose();

    scene.environment = envMap;
});

// Load the GLTF model
const loader = new THREE.GLTFLoader();
loader.load('models/main.glb', function(gltf) {
    const model = gltf.scene;

    // Вычисляем центр модели
    const box = new THREE.Box3().setFromObject(model);
    const center = box.getCenter(new THREE.Vector3());

    // Перемещаем модель так, чтобы её центр совпадал с началом координат
    model.position.sub(center);

    // Проверяем и корректируем масштаб модели
    const size = box.getSize(new THREE.Vector3());
    const maxSize = Math.max(size.x, size.y, size.z);
    const scaleFactor = 1.0 / maxSize; // Масштабируем модель так, чтобы она помещалась в единичный куб
    model.scale.set(scaleFactor, scaleFactor, scaleFactor);

    // Если модель сжата по оси X, корректируем масштаб
    model.scale.x *= 1.25; // Увеличиваем масштаб по оси X на 25%

    scene.add(model);

    // Adjust camera position to fit the model
    camera.position.set(1.5, 0.5, 2.5);

    // Add orbit controls
    const controls = new THREE.OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.01;
    controls.enableZoom = false; // Отключаем зум
    controls.enablePan = false;  // Отключаем перемещение камеры
    controls.autoRotate = true;
    controls.autoRotateSpeed = 0.2;
    controls.target.set(0, 0, 0); // Устанавливаем центр вращения в начало координат

    // Animation loop
    function animate() {
        requestAnimationFrame(animate);
        controls.update();
        renderer.render(scene, camera);
    }
    animate();
});




// Обновляем соотношение сторон камеры при изменении размера окна
window.addEventListener('resize', function() {
    const width = window.innerWidth;
    const height = window.innerHeight;
    renderer.setSize(width, height);
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
});

// Устанавливаем начальное соотношение сторон камеры
const width = window.innerWidth*0.8;
const height = window.innerHeight;
camera.aspect = width / height;
camera.updateProjectionMatrix();

// Функция для добавления изображений в сетку
function addImagesToGrid(numberOfImages) {
    const imageGrid = document.getElementById('image-grid');
    for (let i = 1; i <= numberOfImages; i++) {
        const imgElement = document.createElement('div');
        imgElement.classList.add('image-item');
        imgElement.innerHTML = `<img src="renders/render (${i}).png" alt="Render ${i}">`;
        imageGrid.appendChild(imgElement);
    }
}

// Укажите количество изображений, которые нужно добавить
const numberOfImages = 9; // Измените это значение на нужное количество изображений
addImagesToGrid(numberOfImages);



