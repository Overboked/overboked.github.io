const BLOG_PATH = 'blog-posts/';

const blogPosts = [
    {
        id: 'post-1',
        title: 'POST - 1',
        date: '2023-10-15',
        content: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industrys standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.',
        category: 'Art',
        image: `images/art/daylight.webp`,
        author: 'IIL Workshop',
        contentBlocks: [
            { 
                type: 'text', 
                content: 'В этой статье я расскажу, как я моделировал и рендерил дракона для моего последнего проекта, используя Blender и ZBrush...' 
            },
            { 
                type: 'image', 
                src: `images/art/daylight.webp`, 
                alt: 'Скульптинг дракона в ZBrush' 
            },
            { 
                type: 'text', 
                content: 'После скульптинга я перешёл к текстурированию...' 
            },
            { 
                type: 'image-text', 
                layout: 'image-left', 
                src: `images/art/daylight.webp`, 
                alt: 'Текстурированный дракон', 
                content: 'Вот как выглядел дракон после текстурирования...' 
            },
            { 
                type: 'image', 
                src: `images/art/daylight.webp`, 
                alt: 'Анимация дракона'
             },
            { 
                type: 'text', 
                content: 'Наконец, я добавил анимацию, чтобы показать движение крыльев и хвоста.' 
            },
            { 
                type: 'image-text', 
                layout: 'image-right', 
                src: `images/art/daylight.webp`, 
                alt: 'Финальный рендер дракона', 
                content: 'Финальный рендер был сделан в Blender...' 
            }
        ]
    },
    {
        id: 'post-2',
        title: 'POST - 2',
        date: '2023-11-01',
        content: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industrys standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.',
        category: 'Interiors',
        image: `images/art/baked.webp`,
        author: 'IIL Workshop',
        contentBlocks: [
            { 
                type: 'text', 
                content: 'Здесь я делюсь советами по созданию реалистичных 3D-интерьеров с помощью 3ds Max и V-Ray...' 
            },
            { 
                type: 'image', 
                src: `images/art/daylight.webp`, 
                alt: 'Освещение интерьера' 
            },
            { 
                type: 'text', 
                content: 'Освещение играет ключевую роль...' 
            },
            { 
                type: 'video-text', 
                layout: 'image-left', 
                src: `${BLOG_PATH}interior_walkthrough.webm`, 
                alt: 'Виртуальный тур по интерьеру', 
                content: 'Этот видеоролик демонстрирует виртуальный тур по интерьеру.' 
            }
        ]
    }
];