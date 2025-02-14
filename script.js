// Set up the scene, camera, and renderer
const scene = new THREE.Scene();
//const camera = new THREE.PerspectiveCamera(75, 2, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
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



document.addEventListener('DOMContentLoaded', function() {
    const sidebarToggle = document.getElementById('sidebarToggle');
    const sidebar = document.getElementById('sidebar');
    const buttons = document.querySelectorAll('.category-button');
    const curve = document.querySelector('.curve');
    const carousel = document.getElementById('carousel');
    const modalOverlay = document.getElementById('modalOverlay');
    const modal = document.getElementById('modal');
    const modalImage = document.getElementById('modalImage');
    const modalTitle = document.getElementById('modalTitle');
    const modalDescription = document.getElementById('modalDescription');
    const modalSoftware = document.getElementById('modalSoftware');
    const modalAdditionalImages = document.getElementById('modalAdditionalImages');
    const closeModal = document.querySelector('.close');

    const content = {
        art: Array.from({ length: 10 }, (_, i) => `images/art/art${i + 1}.webp`),
        interiors: Array.from({ length: 9 }, (_, i) => `images/interiors/interior${i + 1}.webp`),
        videos: Array.from({ length: 5 }, (_, i) => `videos/video${i + 1}.mp4`),
        vfx: Array.from({ length: 4 }, (_, i) => `videos/vfx/vfx${i + 1}.mp4`)
    };

    const imageData = {
        'art1.webp': {
            title: 'Happy days #5',
            description: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry.',
            software: 'Cinema 4D, Photoshop',
            additionalImages: ['icons/Cinema4D.webp', 'icons/Photoshop.webp']
        },
        'interior1.webp': {
            title: 'Interior Project 1',
            description: 'Description of Interior Project 1.',
            software: 'SketchUp, V-Ray',
            additionalImages: ['interiors/additional3.jpg', 'interiors/additional4.jpg']
        }
        
        // Добавьте данные для остальных изображений
    };

    sidebarToggle.addEventListener('click', function() {
        sidebar.classList.toggle('active');
    });

    buttons.forEach(button => {
        button.addEventListener('click', function() {
            buttons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');

            const category = this.getAttribute('data-category');
            const rect = button.getBoundingClientRect();
            const offsetLeft = rect.left + window.scrollX - curve.parentElement.getBoundingClientRect().left;
            const buttonWidth = rect.width;

            // Устанавливаем позицию круга по центру кнопки
            curve.style.transform = `translateX(${offsetLeft + buttonWidth / 2 - 50}px)`;

            carousel.classList.add('fade-out');
            setTimeout(() => {
                updateCarousel(category);
                carousel.classList.remove('fade-out');
            }, 300); // Время должно совпадать с длительностью анимации
        });
    });

    function updateCarousel(category) {
        carousel.innerHTML = '';
        content[category].forEach(media => {
            const mediaElement = document.createElement(media.endsWith('.mp4') ? 'video' : 'img');
            mediaElement.src = `${media}`;
            mediaElement.alt = category;
            if (media.endsWith('.mp4')) {
                mediaElement.controls = true;
            }
            mediaElement.addEventListener('click', openImageModal);
            carousel.appendChild(mediaElement);
        });
    }

    

    function openImageModal(event) {
        const target = event.target;
        const mediaSrc = target.src;
        const mediaName = mediaSrc.split('/').pop();
        const data = imageData[mediaName];
    
        // Удаляем текущий элемент контента в модальном окне
        const existingContent = modalImage.firstChild;
        if (existingContent) {
            existingContent.remove();
        }
    
        if (target.tagName === 'VIDEO') {
            // Если это видео, создаем элемент video
            const video = document.createElement('video');
            video.src = mediaSrc;
            video.controls = true;
            video.classList.add('modal-content-media');
            modalImage.appendChild(video);
        } else {
            // Если это изображение, создаем элемент img
            const img = document.createElement('img');
            img.src = mediaSrc;
            img.classList.add('modal-content-media');
            modalImage.appendChild(img);
        }
    
        if (data) {
            modalTitle.textContent = data.title;
            modalDescription.textContent = data.description;
            modalSoftware.textContent = data.software;
    
            // Очищаем и добавляем дополнительные изображения
            modalAdditionalImages.innerHTML = '';
            if (data.additionalImages) {
                data.additionalImages.forEach(imgSrc => {
                    const img = document.createElement('img');
                    img.src = `images/${imgSrc}`;
                    modalAdditionalImages.appendChild(img);
                });
            }
        } else {
            modalTitle.textContent = '';
            modalDescription.textContent = '';
            modalSoftware.textContent = '';
            modalAdditionalImages.innerHTML = '';
        }
    
        modalOverlay.classList.add('active');
        modal.classList.add('active');
    }
    
    
    
    
    
    
    

    closeModal.addEventListener('click', function() {
        modalOverlay.classList.remove('active');
        modal.classList.remove('active');
    });

    window.addEventListener('click', function(event) {
        if (event.target === modalOverlay) {
            modalOverlay.classList.remove('active');
            modal.classList.remove('active');
        }
    });

    // Инициализация карусели с первой категорией
    updateCarousel('art');

    
});
