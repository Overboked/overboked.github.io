// preloader.js
class PreloaderManager {
    constructor() {
        this.preloader = document.getElementById('preloader');
        this.progressFill = document.getElementById('progressFill');
        this.progressText = document.getElementById('progressText');
        this.currentProgress = 0;
        this.targetProgress = 0;
        this.isComplete = false;
        this.resources = [];
        this.loadedResources = 0;
        
        this.init();
    }

    init() {
        // Добавляем класс loading к body
        document.body.classList.add('loading');
        
        // Анимируем прогресс
        this.animateProgress();
        
        // Начинаем проверку загрузки ресурсов
        this.checkResources();
    }

    addResource(type, url) {
        this.resources.push({ type, url, loaded: false });
    }

    markResourceLoaded(url) {
        const resource = this.resources.find(r => r.url === url);
        if (resource && !resource.loaded) {
            resource.loaded = true;
            this.loadedResources++;
            this.updateProgress();
        }
    }

    updateProgress() {
        if (this.resources.length === 0) return;
        
        const percentage = (this.loadedResources / this.resources.length) * 100;
        this.setProgress(percentage);
        
        if (this.loadedResources >= this.resources.length) {
            this.complete();
        }
    }

    setProgress(percentage) {
        this.targetProgress = Math.min(percentage, 100);
    }

    animateProgress() {
        // Плавная анимация прогресса
        if (this.currentProgress < this.targetProgress) {
            this.currentProgress += (this.targetProgress - this.currentProgress) * 0.1;
        }
        
        this.progressFill.style.width = this.currentProgress + '%';
        this.progressText.textContent = `Loading... ${Math.round(this.currentProgress)}%`;
        
        if (!this.isComplete) {
            requestAnimationFrame(() => this.animateProgress());
        }
    }

    checkResources() {
        // Проверяем загрузку изображений
        const images = document.querySelectorAll('img');
        images.forEach(img => {
            if (img.src && img.src !== window.location.href) {
                this.addResource('image', img.src);
                
                if (img.complete) {
                    this.markResourceLoaded(img.src);
                } else {
                    img.onload = () => this.markResourceLoaded(img.src);
                    img.onerror = () => this.markResourceLoaded(img.src);
                }
            }
        });

        // Проверяем загрузку видео
        const videos = document.querySelectorAll('video');
        videos.forEach(video => {
            if (video.src) {
                this.addResource('video', video.src);
                
                if (video.readyState >= 3) {
                    this.markResourceLoaded(video.src);
                } else {
                    video.oncanplaythrough = () => this.markResourceLoaded(video.src);
                    video.onerror = () => this.markResourceLoaded(video.src);
                }
            }
        });

        // Добавляем базовые ресурсы
        this.addResource('dom', 'dom-content');
        
        // Минимальное время показа прелоадера (для эффекта)
        setTimeout(() => {
            this.markResourceLoaded('dom-content');
        }, 1500);

        // Фоллбэк: если ресурсов нет, завершаем через 2 секунды
        if (this.resources.length === 0) {
            setTimeout(() => {
                this.setProgress(100);
                this.complete();
            }, 2000);
        }
    }

    complete() {
        if (this.isComplete) return;
        this.isComplete = true;
        
        // Устанавливаем 100% и ждем
        this.setProgress(100);
        
        setTimeout(() => {
            // Скрываем прелоадер
            this.preloader.classList.add('hidden');
            document.body.classList.remove('loading');
            
            // Отправляем событие завершения прелоадера для частиц
            window.dispatchEvent(new CustomEvent('preloaderFinished'));
            
            // Запускаем анимации появления контента
            this.animateContentIn();
            
            // Удаляем прелоадер из DOM через секунду
            setTimeout(() => {
                if (this.preloader.parentNode) {
                    this.preloader.parentNode.removeChild(this.preloader);
                }
            }, 1000);
        }, 500);
    }

    animateContentIn() {
        // Анимация появления элементов
        const elements = [
            document.querySelector('.sidebar'),
            document.querySelector('.burger'),
            document.querySelector('.blurred-bar'),
            document.querySelector('main'),
            ...document.querySelectorAll('.section')
        ];

        elements.forEach((el, index) => {
            if (el) {
                setTimeout(() => {
                    el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
                    el.style.opacity = '1';
                    el.style.transform = 'translateY(0)';
                    el.style.pointerEvents = 'auto';
                }, index * 100);
            }
        });
    }
}

// Глобальная переменная для доступа из других скриптов
let preloaderManager;

// Запускаем прелоадер как можно раньше
document.addEventListener('DOMContentLoaded', () => {
    preloaderManager = new PreloaderManager();
});

// Экспортируем для использования в других скриптах
window.PreloaderManager = PreloaderManager;
