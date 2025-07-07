document.addEventListener('DOMContentLoaded', () => {
    const blogGrid = document.getElementById('blogGrid');
    const burger = document.getElementById('burger');
    const sidebar = document.getElementById('sidebar');

    burger.addEventListener('click', () => {
        sidebar.classList.toggle('active');
        burger.classList.toggle('active');
    });

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
                <p class="post-excerpt">${post.contentBlocks[0].content ? post.contentBlocks[0].content.substring(0, 100) + '...' : 'Посмотреть пост...'}</p>
            `;

            postDiv.addEventListener('click', () => {
                showBlogModal(post);
            });

            blogGrid.appendChild(postDiv);
        });
    }

    const blogCategoryButtons = document.querySelectorAll('.category-btn');
    blogCategoryButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            e.preventDefault();
            blogCategoryButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');

            const category = button.getAttribute('data-category');
            let filteredPosts = blogPosts;

            if (category !== 'all') {
                filteredPosts = blogPosts.filter(post => post.category.toLowerCase() === category.toLowerCase());
            }

            generateBlogPosts(filteredPosts);
        });
    });

    generateBlogPosts(blogPosts);

    const modal = document.getElementById('modal');
    const modalTitle = document.getElementById('modalTitle');
    const modalDesc = document.getElementById('modalDesc');
    const modalSoftware = document.getElementById('modalSoftware');
    const closeModal = document.getElementById('closeModal');

    function showBlogModal(post) {
        if (!modal || !modalTitle || !modalDesc || !modalSoftware) {
            console.error('Модальное окно или его элементы не найдены');
            return;
        }

        modalDesc.innerHTML = '';
        modalTitle.textContent = post.title;
        modalSoftware.textContent = `Автор: ${post.author} | Дата: ${post.date}`;

        post.contentBlocks.forEach(block => {
            if (block.type === 'text') {
                const textDiv = document.createElement('div');
                textDiv.classList.add('modal-text');
                textDiv.textContent = block.content;
                modalDesc.appendChild(textDiv);
            } else if (block.type === 'image') {
                const imageDiv = document.createElement('div');
                imageDiv.classList.add('modal-image');
                const img = document.createElement('img');
                img.src = block.src;
                img.alt = block.alt;
                img.loading = 'lazy';
                imageDiv.appendChild(img);
                modalDesc.appendChild(imageDiv);
            } else if (block.type === 'video') {
                const videoDiv = document.createElement('div');
                videoDiv.classList.add('modal-video');
                const video = document.createElement('video');
                video.controls = true;
                video.muted = true;
                video.playsInline = true;
                const source = document.createElement('source');
                source.src = block.src;
                source.type = 'video/webm';
                const fallbackSource = document.createElement('source');
                fallbackSource.src = block.src.replace('.webm', '.mp4');
                fallbackSource.type = 'video/mp4';
                video.appendChild(source);
                video.appendChild(fallbackSource);
                videoDiv.appendChild(video);
                modalDesc.appendChild(videoDiv);
            } else if (block.type === 'image-text' || block.type === 'video-text') {
                const mediaTextDiv = document.createElement('div');
                mediaTextDiv.classList.add('modal-image-text', block.layout);

                let mediaElement;
                if (block.type === 'image-text') {
                    mediaElement = document.createElement('img');
                    mediaElement.src = block.src;
                    mediaElement.alt = block.alt;
                    mediaElement.loading = 'lazy';
                } else if (block.type === 'video-text') {
                    mediaElement = document.createElement('video');
                    mediaElement.controls = true;
                    mediaElement.muted = true;
                    mediaElement.playsInline = true;
                    const source = document.createElement('source');
                    source.src = block.src;
                    source.type = 'video/webm';
                    const fallbackSource = document.createElement('source');
                    fallbackSource.src = block.src.replace('.webm', '.mp4');
                    fallbackSource.type = 'video/mp4';
                    mediaElement.appendChild(source);
                    mediaElement.appendChild(fallbackSource);
                }

                const textDiv = document.createElement('div');
                textDiv.classList.add('modal-text');
                textDiv.textContent = block.content;

                if (block.layout === 'image-left') {
                    mediaTextDiv.appendChild(mediaElement);
                    mediaTextDiv.appendChild(textDiv);
                } else if (block.layout === 'image-right') {
                    mediaTextDiv.appendChild(textDiv);
                    mediaTextDiv.appendChild(mediaElement);
                }

                modalDesc.appendChild(mediaTextDiv);
            }
        });

        modal.style.display = 'flex';
    }

    if (closeModal) {
        closeModal.addEventListener('click', () => {
            if (modal) modal.style.display = 'none';
            const videos = modal.querySelectorAll('video');
            videos.forEach(video => {
                video.pause();
                video.src = '';
            });
        });
    }

    if (modal) {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.style.display = 'none';
                const videos = modal.querySelectorAll('video');
                videos.forEach(video => {
                    video.pause();
                    video.src = '';
                });
            }
        });
    }
});