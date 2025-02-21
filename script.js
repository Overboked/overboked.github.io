const burger = document.getElementById('burger');
const sidebar = document.getElementById('sidebar');

burger.addEventListener('click', () => {
    sidebar.classList.toggle('active');
    burger.classList.toggle('active');
});

// Функция для перемешивания массива
function shuffleArray(array) {
    const shuffled = [...array];
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
    carousel.innerHTML = '';
    const projectFaces = {}; // Для "лиц" проектов
    const uniqueItems = []; // Для уникальных работ без projectId

    items.forEach(item => {
        if (item.projectId) {
            if (!projectFaces[item.projectId]) {
                projectFaces[item.projectId] = item; // Берем первую работу как лицо проекта
            }
        } else {
            uniqueItems.push(item); // Уникальные работы добавляем напрямую
        }
    });

    // Отображаем "лица" проектов
    Object.values(projectFaces).forEach(item => {
        const div = document.createElement('div');
        div.classList.add('carousel-item', 'has-project');
        div.setAttribute('data-category', item.category);
        div.setAttribute('data-project-id', item.projectId);
        div.setAttribute('data-title', item.title); // Добавляем атрибут для названия

        // Создаём текст для наведения
        const tooltip = document.createElement('div');
        tooltip.classList.add('item-tooltip');
        tooltip.textContent = `${item.title}, ${item.category}`;

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

        div.appendChild(tooltip);
        carousel.appendChild(div);
    });

    // Добавляем уникальные работы
    uniqueItems.forEach(item => {
        const div = document.createElement('div');
        div.classList.add('carousel-item');
        div.setAttribute('data-category', item.category);
        div.setAttribute('data-title', item.title); // Добавляем атрибут для названия

        // Создаём текст для наведения
        const tooltip = document.createElement('div');
        tooltip.classList.add('item-tooltip');
        tooltip.textContent = `${item.title}, ${item.category}`;

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

        div.appendChild(tooltip);
        carousel.appendChild(div);
    });

    // Обработчик для показа/скрытия текста при наведении
    const carouselItems = document.querySelectorAll('.carousel-item');
    carouselItems.forEach(item => {
        item.addEventListener('mouseenter', () => {
            const tooltip = item.querySelector('.item-tooltip');
            if (tooltip) tooltip.style.opacity = '1';
        });
        item.addEventListener('mouseleave', () => {
            const tooltip = item.querySelector('.item-tooltip');
            if (tooltip) tooltip.style.opacity = '0';
        });

        // Для мобильных: показываем tooltip при длительном тапе (hold), но не блокируем клик
        let touchTimer = null;
        item.addEventListener('touchstart', (e) => {
            const tooltip = item.querySelector('.item-tooltip');
            if (tooltip) {
                touchTimer = setTimeout(() => {
                    tooltip.style.opacity = '1';
                }, 500); // Показать через 0.5 секунды удержания
            }
        });
        item.addEventListener('touchend', () => {
            if (touchTimer) {
                clearTimeout(touchTimer);
                const tooltip = item.querySelector('.item-tooltip');
                if (tooltip) tooltip.style.opacity = '0';
            }
        });
        item.addEventListener('touchmove', () => {
            if (touchTimer) {
                clearTimeout(touchTimer);
                const tooltip = item.querySelector('.item-tooltip');
                if (tooltip) tooltip.style.opacity = '0';
            }
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
        modalTitle.textContent = 'Not found';
        modalDesc.textContent = 'No desc. yet';
        modalSoftware.textContent = '';
        modalImage.style.display = 'block';
        modalImage.src = src;
        modalVideo.style.display = 'none';
        modal.style.display = 'flex';
        return;
    }

    modalImage.style.display = 'none';
    modalVideo.style.display = 'none';
    modalTitle.textContent = portfolioItem.title;
    modalDesc.textContent = portfolioItem.desc;
    modalSoftware.textContent = `Made with: ${portfolioItem.software}`;

    // Создаём галерею в модальном окне
    const modalGallery = document.createElement('div');
    modalGallery.classList.add('modal-gallery');

    if (portfolioItem.projectId) {
        // Если есть projectId, показываем все рендеры проекта
        const projectItems = portfolioItems.filter(p => p.projectId === portfolioItem.projectId);
        projectItems.forEach(p => {
            const mediaDiv = document.createElement('div');
            mediaDiv.classList.add('modal-media');

            if (p.type === 'image') {
                const img = document.createElement('img');
                img.src = p.src;
                img.alt = p.title;
                mediaDiv.appendChild(img);
            } else if (p.type === 'video') {
                const video = document.createElement('video');
                video.controls = true;
                video.muted = true;
                video.playsInline = true;
                const source = document.createElement('source');
                source.src = p.src;
                source.type = 'video/webm';
                const fallbackSource = document.createElement('source');
                fallbackSource.src = p.src.replace('.webm', '.mp4');
                fallbackSource.type = 'video/mp4';
                video.appendChild(source);
                video.appendChild(fallbackSource);
                mediaDiv.appendChild(video);
            }

            modalGallery.appendChild(mediaDiv);
        });
    } else {
        // Если нет projectId (уникальная работа), показываем только эту работу
        const mediaDiv = document.createElement('div');
        mediaDiv.classList.add('modal-media');

        if (portfolioItem.type === 'image') {
            const img = document.createElement('img');
            img.src = portfolioItem.src;
            img.alt = portfolioItem.title;
            mediaDiv.appendChild(img);
        } else if (portfolioItem.type === 'video') {
            const video = document.createElement('video');
            video.controls = true;
            video.muted = true;
            video.playsInline = true;
            const source = document.createElement('source');
            source.src = portfolioItem.src;
            source.type = 'video/webm';
            const fallbackSource = document.createElement('source');
            fallbackSource.src = portfolioItem.src.replace('.webm', '.mp4');
            fallbackSource.type = 'video/mp4';
            video.appendChild(source);
            video.appendChild(fallbackSource);
            mediaDiv.appendChild(video);
        }

        modalGallery.appendChild(mediaDiv);
    }

    const modalContent = document.querySelector('.modal-content');
    modalContent.appendChild(modalGallery);
    modal.style.display = 'flex';
});


closeModal.addEventListener('click', () => {
    modal.style.display = 'none';
    modalVideo.pause();
    modalVideo.src = '';
    const modalContent = document.querySelector('.modal-content');
    const gallery = modalContent.querySelector('.modal-gallery');
    if (gallery) modalContent.removeChild(gallery);
});

modal.addEventListener('click', (e) => {
    if (e.target === modal) {
        modal.style.display = 'none';
        modalVideo.pause();
        modalVideo.src = '';
        const modalContent = document.querySelector('.modal-content');
        const gallery = modalContent.querySelector('.modal-gallery');
        if (gallery) modalContent.removeChild(gallery);
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
            const target = document.getElementById('works');
            if (target) {
                const targetPosition = target.offsetTop; // Позиция секции относительно верха
                const startPosition = window.scrollY; // Текущая позиция прокрутки
                const distance = targetPosition - startPosition; // Расстояние до цели
                const duration = 1000; // Длительность анимации в мс (1 секунда)
                let start = null;

                function smoothScroll(timestamp) {
                    if (start === null) start = timestamp;
                    const progress = timestamp - start;
                    const easeProgress = easeInOutQuad(progress, startPosition, distance, duration);

                    window.scrollTo(0, easeProgress);
                    if (progress < duration) {
                        requestAnimationFrame(smoothScroll);
                    }
                }

                // Функция для плавного перехода (квинтовая интерполяция)
                function easeInOutQuad(t, b, c, d) {
                    t /= d / 2;
                    if (t < 1) return c / 2 * t * t + b;
                    t--;
                    return -c / 2 * (t * (t - 2) - 1) + b;
                }

                requestAnimationFrame(smoothScroll);
            }
        });
    }
});
