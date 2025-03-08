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

// Функция для генерации карусели
function generateCarousel(items) {
    carousel.innerHTML = '';
    const projectFaces = {}; // Для "лиц" проектов
    const allItems = [];    // Для итогового списка

    // Сначала определяем "лица" проектов из исходного массива portfolioItems
    portfolioItems.forEach(item => {
        if (item.projectId && !projectFaces[item.projectId]) {
            projectFaces[item.projectId] = item; // Фиксируем первую работу как "лицо"
        }
    });

    // Теперь добавляем элементы из переданного массива items, но с учётом фиксированных "лиц"
    items.forEach(item => {
        if (item.projectId) {
            // Если это элемент проекта, добавляем только "лицо"
            if (item === projectFaces[item.projectId]) {
                allItems.push(item);
            }
        } else {
            // Уникальные работы добавляем напрямую
            allItems.push(item);
        }
    });

    // Отображаем элементы
    allItems.forEach(item => {
        const div = document.createElement('div');
        div.classList.add('carousel-item');
        if (item.projectId) {
            div.classList.add('has-project');
            div.setAttribute('data-project-id', item.projectId);
        }
        div.setAttribute('data-category', item.category);
        div.setAttribute('data-title', item.title);

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
            video.controls = false;
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

    // Обработчики для тултипов (без изменений)
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

        let touchTimer = null;
        item.addEventListener('touchstart', (e) => {
            const tooltip = item.querySelector('.item-tooltip');
            if (tooltip) {
                touchTimer = setTimeout(() => {
                    tooltip.style.opacity = '1';
                }, 500);
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

// Инициализация карусели
const shuffledPortfolioItems = shuffleArray(portfolioItems);
generateCarousel(shuffledPortfolioItems);

// Фильтрация категорий
const categoryButtons = document.querySelectorAll('.category-btn');
categoryButtons.forEach(button => {
    button.addEventListener('click', (e) => {
        e.preventDefault();
        categoryButtons.forEach(btn => btn.classList.remove('active'));
        button.classList.add('active');

        const category = button.getAttribute('data-category');
        let filteredItems;

        if (category === 'all') {
            filteredItems = shuffleArray(portfolioItems); // Перемешиваем все работы
        } else {
            filteredItems = portfolioItems.filter(item => item.category === category);
        }

        generateCarousel(filteredItems);
    });
});
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
                video.autoplay = true;
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
            video.autoplay = true;
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


