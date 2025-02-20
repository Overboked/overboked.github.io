// Бургер-меню
const burger = document.getElementById('burger');
const sidebar = document.getElementById('sidebar');

burger.addEventListener('click', () => {
    sidebar.classList.toggle('active');
    burger.classList.toggle('active');
});

// Функция для перемешивания массива (алгоритм Фишера-Йетса)
function shuffleArray(array) {
    const shuffled = [...array]; // Создаем копию массива
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
}

// Перемешиваем portfolioItems сразу при загрузке
const shuffledPortfolioItems = shuffleArray(portfolioItems);

// Генерация карусели
const carousel = document.getElementById('carousel');
function generateCarousel(items) {
    const scrollPosition = window.scrollY; // Сохраняем текущую позицию прокрутки
    carousel.innerHTML = '';
    items.forEach(item => {
        const div = document.createElement('div');
        div.classList.add('carousel-item');
        div.setAttribute('data-category', item.category);

        if (item.type === 'image') {
            const img = document.createElement('img');
            img.src = item.src;
            img.alt = item.title;
            img.loading = 'lazy';
            div.appendChild(img);
        } else if (item.type === 'video') {
            const video = document.createElement('video');
            video.muted = true;
            video.controls = true;
            video.loading = 'lazy';
            video.playsInline = true;
            video.autoplay = true;
            video.loop = true;
            const source = document.createElement('source');
            source.src = item.src;
            source.type = 'video/webm';
            const fallbackSource = document.createElement('source');
            fallbackSource.src = item.src.replace('.webm', '.mp4');
            fallbackSource.type = 'video/mp4';
            video.appendChild(source);
            video.appendChild(fallbackSource);
            div.appendChild(video);
        }

        carousel.appendChild(div);
    });
    
    // Восстанавливаем позицию прокрутки с помощью requestAnimationFrame для плавности
    requestAnimationFrame(() => {
        window.scrollTo({
            top: scrollPosition,
            behavior: 'auto' // Используем 'auto' для мгновенного восстановления (или 'smooth' для плавного)
        });
    });
}

// Инициализация карусели с перемешанными работами
generateCarousel(shuffledPortfolioItems);

// Фильтрация категорий
const categoryButtons = document.querySelectorAll('.category-btn');
categoryButtons.forEach(button => {
    button.addEventListener('click', (e) => {
        e.preventDefault(); // Предотвращаем стандартное поведение
        categoryButtons.forEach(btn => btn.classList.remove('active'));
        button.classList.add('active');

        const category = button.getAttribute('data-category');
        let filteredItems;

        if (category === 'all') {
            filteredItems = shuffleArray(shuffledPortfolioItems);
        } else {
            filteredItems = portfolioItems.filter(item => item.category === category);
        }

        generateCarousel(filteredItems);
    });
});

// Модальное окно
const modal = document.getElementById('modal');
const modalImage = document.getElementById('modalImage');
const modalVideo = document.getElementById('modalVideo');
const modalTitle = document.getElementById('modalTitle');
const modalDesc = document.getElementById('modalDesc');
const modalSoftware = document.getElementById('modalSoftware');
const closeModal = document.getElementById('closeModal');

carousel.addEventListener('click', (e) => {
    const item = e.target.closest('.carousel-item');
    if (!item) return;

    const img = item.querySelector('img');
    const video = item.querySelector('video');
    const src = img ? img.src : (video ? video.querySelector('source').src : null);

    if (!src) {
        console.error('Не удалось найти src для элемента:', item);
        return;
    }

    const relativeSrc = src.replace(window.location.origin + '/', '');
    const portfolioItem = portfolioItems.find(p => p.src === relativeSrc);

    if (!portfolioItem) {
        console.error('Элемент не найден в portfolioItems:', relativeSrc);
        modalTitle.textContent = 'Работа не найдена';
        modalDesc.textContent = 'Информация отсутствует';
        modalSoftware.textContent = '';
        modalImage.style.display = 'block';
        modalImage.src = src;
        modalVideo.style.display = 'none';
        modal.style.display = 'flex';
        return;
    }

    modalImage.style.display = portfolioItem.type === 'image' ? 'block' : 'none';
    modalVideo.style.display = portfolioItem.type === 'video' ? 'block' : 'none';

    if (portfolioItem.type === 'video') {
        modalVideo.src = portfolioItem.src;
        modalVideo.muted = true;
        modalVideo.controls = true;
        modalVideo.playsInline = true;
        modalVideo.play();
    } else {
        modalImage.src = portfolioItem.src;
    }

    modalTitle.textContent = portfolioItem.title;
    modalDesc.textContent = portfolioItem.desc;
    modalSoftware.textContent = `Сделано в: ${portfolioItem.software}`;
    modal.style.display = 'flex';
});

closeModal.addEventListener('click', () => {
    modal.style.display = 'none';
    modalVideo.pause();
    modalVideo.src = '';
});

modal.addEventListener('click', (e) => {
    if (e.target === modal) {
        modal.style.display = 'none';
        modalVideo.pause();
        modalVideo.src = '';
    }
});

// Three.js
let model = null; // Глобальная переменная для модели

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ canvas: document.getElementById('modelCanvas'), alpha: true });

renderer.setSize(600, 400);
scene.background = null;

const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(ambientLight);
const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
directionalLight.position.set(5, 5, 5).normalize();
scene.add(directionalLight);

const loader = new THREE.GLTFLoader();
loader.load(
    'models/main.glb', // Укажи реальный путь к файлу (замени на корректный)
    (gltf) => {
        model = gltf.scene;
        scene.add(model);
        console.log('Модель успешно загружена:', model);

        const box = new THREE.Box3().setFromObject(model);
        const center = box.getCenter(new THREE.Vector3());
        const size = box.getSize(new THREE.Vector3());
        const maxDim = Math.max(size.x, size.y, size.z);
        const scale = 5 / maxDim;
        model.scale.set(scale, scale, scale);
        model.position.sub(center.multiplyScalar(scale));
        model.position.x += 2; // Смещение вправо
        model.rotation.y = Math.PI / 4; // Начальный угол

        // Настраиваем цветовые пространства для текстур
        model.traverse((child) => {
            if (child.isMesh && child.material) {
                const material = child.material;
                if (material.map) material.map.colorSpace = THREE.SRGBColorSpace;
                if (material.normalMap) material.normalMap.colorSpace = THREE.NoColorSpace;
                if (material.roughnessMap) material.roughnessMap.colorSpace = THREE.NoColorSpace;
                if (material.metalnessMap) material.metalnessMap.colorSpace = THREE.NoColorSpace;
                if (material.emissiveMap) material.emissiveMap.colorSpace = THREE.SRGBColorSpace;
            }
        });

        camera.position.z = maxDim * 2;
    },
    (progress) => {
        console.log('Прогресс загрузки модели:', progress.loaded / progress.total * 100 + '%');
    },
    (error) => {
        console.error('Ошибка загрузки модели:', error);
        // Если модель не загрузилась, показываем заглушку
        const canvas = document.getElementById('modelCanvas');
        if (canvas) {
            canvas.style.background = '#333'; // Серый фон как заглушка
            canvas.textContent = 'Модель не загружена. Проверь путь или файл.';
        }
    }
);

const controls = new THREE.OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.05;
controls.enableZoom = false;
controls.enablePan = false;
controls.enableRotate = false;

function animate() {
    requestAnimationFrame(animate);
    controls.update();
    
    if (model) {
        model.rotation.y += 0.01; // Вращение модели
    }
    
    renderer.render(scene, camera);
}
animate();

window.addEventListener('resize', () => {
    const width = document.querySelector('.hero-model').clientWidth;
    const height = 400;
    renderer.setSize(width, height);
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
});

document.addEventListener('DOMContentLoaded', () => {
    const scrollToWorks = document.getElementById('scrollToWorks');
    if (scrollToWorks) {
        scrollToWorks.addEventListener('click', (e) => {
            e.preventDefault(); // Предотвращаем стандартный переход
            const target = document.getElementById('services');
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth', // Плавная прокрутка
                    block: 'start' // Начинаем сверху секции
                });
            }
        });
    }
});