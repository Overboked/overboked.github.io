document.addEventListener('DOMContentLoaded', () => {
    const blogGrid = document.getElementById('blogGrid');
    const burger = document.getElementById('burger');
    const sidebar = document.getElementById('sidebar');

    // Обработчик бургер-меню (тот же, что в script.js)
    burger.addEventListener('click', () => {
        sidebar.classList.toggle('active');
        burger.classList.toggle('active');
    });

    // Генерация блогов
    function generateBlogPosts(posts) {
        blogGrid.innerHTML = '';
        posts.forEach(post => {
            const postDiv = document.createElement('div');
            postDiv.classList.add('blog-post');
            postDiv.setAttribute('data-category', post.category);

            postDiv.innerHTML = `
                <img src="${post.image}" alt="${post.title}" loading="lazy">
                <h3>${post.title}</h3>
                <p>${post.date} | ${post.category} | ${post.author}</p>
                <p class="post-excerpt">${post.content.substring(0, 100)}...</p>
            `;

            postDiv.addEventListener('click', () => {
                showBlogModal(post);
            });

            blogGrid.appendChild(postDiv);
        });
    }

    // Фильтрация блогов по категориям (аналогично работам)
    const categoryButtons = document.querySelectorAll('.category-btn');
    categoryButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            e.preventDefault();
            categoryButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');

            const category = button.getAttribute('data-category');
            let filteredPosts = blogPosts;

            if (category !== 'all') {
                filteredPosts = blogPosts.filter(post => post.category.toLowerCase() === category.toLowerCase());
            }

            generateBlogPosts(filteredPosts);
        });
    });

    // Инициализация с фильтром "All"
    generateBlogPosts(blogPosts);

    // Модальное окно для полного блога
    const modal = document.getElementById('modal');
    const modalImage = document.getElementById('modalImage');
    const modalVideo = document.getElementById('modalVideo');
    const modalTitle = document.getElementById('modalTitle');
    const modalDesc = document.getElementById('modalDesc');
    const modalSoftware = document.getElementById('modalSoftware');
    const closeModal = document.getElementById('closeModal');

    function showBlogModal(post) {
        modalImage.style.display = 'block';
        modalVideo.style.display = 'none';
        modalTitle.textContent = post.title;
        modalDesc.textContent = post.content;
        modalSoftware.textContent = `Автор: ${post.author} | Дата: ${post.date}`;
        modalImage.src = post.image;
        modal.style.display = 'flex';
    }

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
});