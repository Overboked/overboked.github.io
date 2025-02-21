const ART_PATH = 'images/art/';
const ARCHVIZ_PATH = 'images/archviz/';
const VIDEO_PATH = 'videos/';
const VFX_PATH = 'videos/vfx/';
const PACKS_PATH = 'images/packs/';

const portfolioItems = [
    // Art (уникальные изображения)
    { type: 'image', category: 'art', src: `${ART_PATH}art1.webp`, title: 'Dragon Sculpture', desc: 'Детализированная модель дракона', software: 'Blender, ZBrush' },
    { type: 'image', category: 'art', src: `${ART_PATH}art2.webp`, title: 'Spaceship', desc: 'Космический корабль в стиле sci-fi', software: 'Maya' },
    { type: 'image', category: 'art', src: `${ART_PATH}art3.webp`, title: 'Forest Creature', desc: 'Существо из леса', software: 'Blender' },
    { type: 'image', category: 'art', src: `${ART_PATH}art4.webp`, title: '1', desc: 'Робот-стражник', software: 'ZBrush, Substance Painter' },
    { type: 'image', category: 'art', src: `${ART_PATH}art5.webp`, title: '2', desc: 'Робот-стражник', software: 'ZBrush, Substance Painter' },
    { type: 'image', category: 'art', src: `${ART_PATH}art6.webp`, title: '3', desc: 'Робот-стражник', software: 'ZBrush, Substance Painter' },
    { type: 'image', category: 'art', src: `${ART_PATH}art7.webp`, title: '4', desc: 'Робот-стражник', software: 'ZBrush, Substance Painter' },
    { type: 'image', category: 'art', src: `${ART_PATH}art8.webp`, title: '5', desc: 'Робот-стражник', software: 'ZBrush, Substance Painter' },
    { type: 'image', category: 'art', src: `${ART_PATH}art9.webp`, title: 'Kate', desc: 'Робот-стражник', software: 'ZBrush, Substance Painter' },
    { type: 'image', category: 'art', src: `${ART_PATH}1.webp`, title: '6', desc: 'Робот-стражник', software: 'ZBrush, Substance Painter' },
    { type: 'image', category: 'art', src: `${ART_PATH}2.webp`, title: '6', desc: 'Робот-стражник', software: 'ZBrush, Substance Painter' },
    { type: 'image', category: 'art', src: `${ART_PATH}daylight.webp`, title: '6', desc: 'Робот-стражник', software: 'ZBrush, Substance Painter' },
    { type: 'image', category: 'art', src: `${ART_PATH}flower_1.webp`, title: '6', desc: 'Робот-стражник', software: 'ZBrush, Substance Painter' },
    { type: 'image', category: 'art', src: `${ART_PATH}knight.webp`, title: '6', desc: 'Робот-стражник', software: 'ZBrush, Substance Painter' },
    { type: 'image', category: 'art', src: `${ART_PATH}Landscape_1.webp`, title: '6', desc: 'Робот-стражник', software: 'ZBrush, Substance Painter' },


    { type: 'image', category: 'art', src: `${ART_PATH}Art_Landscape.webp`, title: '6', desc: 'Робот-стражник', software: 'ZBrush, Substance Painter' },
    { type: 'image', category: 'art', src: `${ART_PATH}city 1.webp`, title: '6', desc: 'Робот-стражник', software: 'ZBrush, Substance Painter' },
    { type: 'image', category: 'art', src: `${ART_PATH}city 2.webp`, title: '6', desc: 'Робот-стражник', software: 'ZBrush, Substance Painter' },
    { type: 'image', category: 'art', src: `${ART_PATH}fullhd.webp`, title: '6', desc: 'Робот-стражник', software: 'ZBrush, Substance Painter' },
    { type: 'image', category: 'art', src: `${ART_PATH}holders.webp`, title: '6', desc: 'Робот-стражник', software: 'ZBrush, Substance Painter' },
    { type: 'image', category: 'art', src: `${ART_PATH}render.webp`, title: '6', desc: 'Робот-стражник', software: 'ZBrush, Substance Painter' },
    { type: 'image', category: 'art', src: `${ART_PATH}ruthlessness.webp`, title: '6', desc: 'Робот-стражник', software: 'ZBrush, Substance Painter' },
    { type: 'image', category: 'art', src: `${ART_PATH}v0.2.webp`, title: '6', desc: 'Робот-стражник', software: 'ZBrush, Substance Painter' },
    { type: 'image', category: 'art', src: `${ART_PATH}Vulitsya.webp`, title: '6', desc: 'Робот-стражник', software: 'ZBrush, Substance Painter' },
    { type: 'image', category: 'art', src: `${ART_PATH}wallpapper.webp`, title: '6', desc: 'Робот-стражник', software: 'ZBrush, Substance Painter' },


    //Scooter
    { type: 'image', category: 'modeling', src: `${PACKS_PATH}scooter/scooter_1.webp`, title: '6', desc: 'Робот-стражник', software: 'ZBrush, Substance Painter',projectId: 'scooter_1' },
    { type: 'image', category: 'modeling', src: `${PACKS_PATH}scooter/scooter_2.webp`, title: '6', desc: 'Робот-стражник', software: 'ZBrush, Substance Painter',projectId: 'scooter_1' },
    { type: 'image', category: 'modeling', src: `${PACKS_PATH}scooter/scooter_3.webp`, title: '6', desc: 'Робот-стражник', software: 'ZBrush, Substance Painter',projectId: 'scooter_1' },
    { type: 'image', category: 'modeling', src: `${PACKS_PATH}scooter/scooter_4.webp`, title: '6', desc: 'Робот-стражник', software: 'ZBrush, Substance Painter',projectId: 'scooter_1' },
    { type: 'image', category: 'modeling', src: `${PACKS_PATH}scooter/scooter_5.webp`, title: '6', desc: 'Робот-стражник', software: 'ZBrush, Substance Painter',projectId: 'scooter_1' },
    { type: 'image', category: 'modeling', src: `${PACKS_PATH}scooter/scooter_6.webp`, title: '6', desc: 'Робот-стражник', software: 'ZBrush, Substance Painter',projectId: 'scooter_1' },

    { type: 'image', category: 'modeling', src: `${ART_PATH}3.webp`, title: '6', desc: 'Робот-стражник', software: 'ZBrush, Substance Painter' },

    // archviz
    { type: 'image', category: 'archviz', src: `${ARCHVIZ_PATH}interior1.webp`, title: 'Living Room', desc: 'Современная гостиная', software: '3ds Max, V-Ray' },
    { type: 'image', category: 'archviz', src: `${ARCHVIZ_PATH}interior2.webp`, title: 'Living Room', desc: 'Современная гостиная', software: '3ds Max, V-Ray' },
    { type: 'image', category: 'archviz', src: `${ARCHVIZ_PATH}interior3.webp`, title: 'Living Room', desc: 'Современная гостиная', software: '3ds Max, V-Ray' },
    { type: 'image', category: 'archviz', src: `${ARCHVIZ_PATH}interior4.webp`, title: 'Living Room', desc: 'Современная гостиная', software: '3ds Max, V-Ray' },
    { type: 'image', category: 'archviz', src: `${ARCHVIZ_PATH}interior5.webp`, title: 'Living Room', desc: 'Современная гостиная', software: '3ds Max, V-Ray' },
    { type: 'image', category: 'archviz', src: `${ARCHVIZ_PATH}interior6.webp`, title: 'Living Room', desc: 'Современная гостиная', software: '3ds Max, V-Ray' },
    { type: 'image', category: 'archviz', src: `${ARCHVIZ_PATH}interior7.webp`, title: 'Living Room', desc: 'Современная гостиная', software: '3ds Max, V-Ray' },
    { type: 'image', category: 'archviz', src: `${ARCHVIZ_PATH}interior8.webp`, title: 'Living Room', desc: 'Современная гостиная', software: '3ds Max, V-Ray' },
    { type: 'image', category: 'archviz', src: `${ARCHVIZ_PATH}interior9.webp`, title: 'Living Room', desc: 'Современная гостиная', software: '3ds Max, V-Ray' },

    // Videos
    { type: 'video', category: 'videos', src: `${VIDEO_PATH}video1.webm`, title: 'Character Animation', desc: 'Анимация персонажа', software: 'Blender, After Effects' },
    { type: 'video', category: 'videos', src: `${VIDEO_PATH}video2.webm`, title: 'Flythrough', desc: 'Пролет через сцену', software: 'Maya' },
    { type: 'video', category: 'videos', src: `${VIDEO_PATH}video3.webm`, title: 'Flythrough', desc: 'Пролет через сцену', software: 'Maya' },
    { type: 'video', category: 'videos', src: `${VIDEO_PATH}video4.webm`, title: 'Flythrough', desc: 'Пролет через сцену', software: 'Maya' },
    { type: 'video', category: 'videos', src: `${VIDEO_PATH}video5.webm`, title: 'Flythrough', desc: 'Пролет через сцену', software: 'Maya' },
    { type: 'video', category: 'videos', src: `${VIDEO_PATH}abstract_flames.webm`, title: 'Flythrough', desc: 'Пролет через сцену', software: 'Maya' },
    { type: 'video', category: 'videos', src: `${VIDEO_PATH}Elden.webm`, title: 'Flythrough', desc: 'Пролет через сцену', software: 'Maya' },
    { type: 'video', category: 'videos', src: `${VIDEO_PATH}Flip_donut.webm`, title: 'Flythrough', desc: 'Пролет через сцену', software: 'Maya' },
    { type: 'video', category: 'videos', src: `${VIDEO_PATH}treasure.webm`, title: 'Flythrough', desc: 'Пролет через сцену', software: 'Maya' },
    { type: 'video', category: 'videos', src: `${VIDEO_PATH}nft.webm`, title: 'Flythrough', desc: 'Пролет через сцену', software: 'Maya' },

    { type: 'video', category: 'videos', src: `${VIDEO_PATH}ThelaceCover.webm`, title: 'Flythrough', desc: 'Пролет через сцену', software: 'Maya',projectId: 'TheLace_1'  },
    { type: 'video', category: 'videos', src: `${VIDEO_PATH}ThelaceCover1.webm`, title: 'Flythrough', desc: 'Пролет через сцену', software: 'Maya',projectId: 'TheLace_1'  },
    { type: 'video', category: 'videos', src: `${VIDEO_PATH}Thelace2.webm`, title: 'Flythrough', desc: 'Пролет через сцену', software: 'Maya',projectId: 'TheLace_1'  },

    // VFX
    { type: 'video', category: 'vfx', src: `${VFX_PATH}vfx1.webm`, title: 'Explosion', desc: 'Реалистичная симуляция взрыва', software: 'Houdini' },
    { type: 'video', category: 'vfx', src: `${VFX_PATH}vfx2.webm`, title: 'Water Simulation', desc: 'Симуляция воды', software: 'Nuke, Houdini' },
    { type: 'video', category: 'vfx', src: `${VFX_PATH}vfx3.webm`, title: 'Water Simulation', desc: 'Симуляция воды', software: 'Nuke, Houdini' },
    { type: 'video', category: 'vfx', src: `${VFX_PATH}vfx4.webm`, title: 'Water Simulation', desc: 'Симуляция воды', software: 'Nuke, Houdini' },
];

// Здесь добавь свои 40 уникальных работ с реальными путями, названиями, описаниями и ПО.