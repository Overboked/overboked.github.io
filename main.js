import { createScene } from './modelloader.js';

document.addEventListener('DOMContentLoaded', function () {
    fetch('config.json')
        .then(response => response.json())
        .then(config => {
            config.models.forEach((modelUrl, index) => {
                createScene(`model-container${index + 1}`, modelUrl, config.hdriTexture);
            });
        })
        .catch(error => console.error('Ошибка при загрузке конфигурационного файла:', error));
});
