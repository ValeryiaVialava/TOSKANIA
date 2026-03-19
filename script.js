
let treeLeft = document.querySelector('.tree-left');
let treeRight = document.querySelector('.tree-right');
let treeRight1 = document.querySelector('.tree-right1');

let titles = document.querySelectorAll('.main-title-container');

const navBar = document.querySelector('.nav-links');
const sections = document.querySelectorAll('section, header#home');
const navLinks = document.querySelectorAll('.nav-link');
const navToggle = document.createElement('div');

// mobile menu 
document.addEventListener('DOMContentLoaded', () => {
    const nav = document.querySelector('.nav-bar');
    if (nav && !document.querySelector('.nav-toggle')) {
        const toggle = document.createElement('div');
        toggle.className = 'nav-toggle';
        toggle.innerHTML = '<span></span><span></span><span></span>';
        nav.appendChild(toggle);

        toggle.addEventListener('click', () => {
            navBar.classList.toggle('mobile-active');
            toggle.classList.toggle('open');
        });

        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                navBar.classList.remove('mobile-active');
                toggle.classList.remove('open');
            });
        });
    }
});

window.addEventListener('scroll', () => {
    let value = window.scrollY;

    // Move trees sideways
    if (treeLeft) treeLeft.style.transform = `translateX(-${value}px)`;
    if (treeRight) treeRight.style.transform = `translateX(${value}px)`;
    if (treeRight1) treeRight1.style.transform = `translateX(${value}px)`;

    if (titles) {
        titles.forEach(title => {
            title.style.transform = `translateY(${value * 0.5}px)`;
        });
    }
    // Highlighting for landing page sections
    if (sections.length > 0) {
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            if (window.scrollY >= (sectionTop - 150)) {
                current = section.getAttribute('id');
            }
        });
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href').includes(current) && current !== '') {
                link.classList.add('active');
            }
        });
    }
});

// Highlight based on current page filename
document.addEventListener('DOMContentLoaded', () => {
    const path = window.location.pathname;
    const page = path.split("/").pop();
    navLinks.forEach(link => {
        const href = link.getAttribute('href');
        if (href === page || (page === '' && href === 'index.html')) {
            link.classList.add('active');
        }
    });
    const dropdownLinks = document.querySelectorAll('.dropdown-content a');
    dropdownLinks.forEach(link => {
        const href = link.getAttribute('href');
        if (href === page) {
            link.classList.add('active');
            // if we match a city, highlight the parent "Trasy"
            const trasyLink = document.querySelector('.nav-link-trasy');
            if (trasyLink) trasyLink.classList.add('active');
        }
    });

    // for Opis/Trasy anchors on home page
    if (page === 'index.html' || page === 'index.html' || page === '') {
        // scroll listener will handle via scroll event
    }
});

// smooth scroll
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const targetId = this.getAttribute('href');
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
            e.preventDefault();
            targetElement.scrollIntoView({
                behavior: 'smooth'
            });
        }
    });
});


const provinces = document.querySelectorAll('.province');
const tooltip = document.getElementById('tooltip');
const svgMap = document.getElementById('tuscany-map');

if (provinces.length > 0) {
    provinces.forEach(province => {
        // Tooltip
        if (tooltip) {
            province.addEventListener('mousemove', (e) => {
                tooltip.innerText = province.getAttribute('data-name');
                tooltip.style.opacity = '1';
                // Position tooltip near mouse cursor
                tooltip.style.left = e.pageX + 15 + 'px'; // +15 for offset
                tooltip.style.top = e.pageY + 15 + 'px';
            });

            province.addEventListener('mouseleave', () => {
                tooltip.style.opacity = '0';
            });
        }

        // Active Regions Logic (Labels & Links)
        if (province.classList.contains('active-region')) {
            province.addEventListener('click', () => {
                const url = province.getAttribute('data-url');
                if (url) {
                    window.location.href = url;
                }
            });
            province.addEventListener('mouseenter', () => {
                const label = document.getElementById(`label-${province.id}`);
                if (label) label.style.opacity = '1';
            });
            province.addEventListener('mouseleave', () => {
                const label = document.getElementById(`label-${province.id}`);
                if (label) label.style.opacity = '0';
            });
            const provinceId = province.id;
            if (!document.getElementById(`label-${provinceId}`)) {
                try {
                    const bbox = province.getBBox();
                    const centerX = bbox.x + bbox.width / 1.90;
                    const centerY = bbox.y + bbox.height / 1.90;

                    const text = document.createElementNS("http://www.w3.org/2000/svg", "text");
                    text.setAttribute("x", centerX);
                    text.setAttribute("y", centerY);
                    text.setAttribute("id", `label-${provinceId}`);
                    text.setAttribute("class", "province-label");
                    text.textContent = province.getAttribute('data-name').split(' ')[0];
                    svgMap.appendChild(text);
                } catch (e) {
                    console.error("Could not calculate BBox for", provinceId, e);
                }
            }
        }
    });
}

// video Slider Logic
document.addEventListener('DOMContentLoaded', () => {
    let items = document.querySelectorAll('.slider .list .item');
    let next = document.getElementById('next');
    let prev = document.getElementById('prev');
    let countItem = items.length;
    let itemActive = 0;

    if (items.length > 0 && next && prev) {
        items[itemActive].classList.add('active');
        next.onclick = function () {
            itemActive = itemActive + 1;
            if (itemActive >= countItem) {
                itemActive = 0;
            }
            showSlider();
        }
        prev.onclick = function () {
            itemActive = itemActive - 1;
            if (itemActive < 0) {
                itemActive = countItem - 1;
            }
            showSlider();
        }

        let refreshInterval = setInterval(() => {
            next.click();
        }, 5000);
        function showSlider() {
            let itemActiveOld = document.querySelector('.slider .list .item.active');
            if (itemActiveOld) itemActiveOld.classList.remove('active');
            items[itemActive].classList.add('active');
            clearInterval(refreshInterval);
            refreshInterval = setInterval(() => {
                next.click();
            }, 5000);
        }
    }
});

// Lightbox
document.addEventListener('DOMContentLoaded', () => {
    if (!document.getElementById('lightbox')) {
        const lightbox = document.createElement('div');
        lightbox.id = 'lightbox';
        lightbox.className = 'lightbox-overlay';
        lightbox.innerHTML = `
            <span class="lightbox-close" id="lightboxClose">&times;</span>
            <img class="lightbox-content" id="lightboxImg" src="" alt="Expanded Image">
        `;
        document.body.appendChild(lightbox);

        const closeBtn = document.getElementById('lightboxClose');
        const lightboxImg = document.getElementById('lightboxImg');

        const closeLightbox = () => {
            lightbox.classList.remove('active');
            setTimeout(() => {
                if (!lightbox.classList.contains('active')) {
                    lightboxImg.src = ''; // Clear src after animation
                }
            }, 300);
        };

        if (closeBtn) closeBtn.addEventListener('click', closeLightbox);
        lightbox.addEventListener('click', (e) => {
            if (e.target === lightbox) closeLightbox();
        });

        // open logic for all gallery images
        const galleryImgs = document.querySelectorAll('.gallery-scroll .gallery-item img');
        if (galleryImgs.length > 0) {
            galleryImgs.forEach(img => {
                img.addEventListener('click', () => {
                    if (lightboxImg) lightboxImg.src = img.src;
                    lightbox.classList.add('active');
                });
            });
        }
        // esscape key to close
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') closeLightbox();
        });
    }
});

// gallery scroll
document.addEventListener('DOMContentLoaded', () => {
    const photoGallery = document.getElementById('photoGallery');
    const galNext = document.querySelector('.gallery-btn.next');
    const galPrev = document.querySelector('.gallery-btn.prev');

    if (photoGallery && galNext && galPrev) {
        galNext.addEventListener('click', () => {
            photoGallery.scrollBy({ left: 415, behavior: 'smooth' });
        });

        galPrev.addEventListener('click', () => {
            photoGallery.scrollBy({ left: -415, behavior: 'smooth' });
        });
    }
});