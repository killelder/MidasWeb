// Mobile Navigation Toggle
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');

hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navMenu.classList.toggle('active');
});

// Close mobile menu when clicking on a link
document.querySelectorAll('.nav-link').forEach(n => n.addEventListener('click', () => {
    hamburger.classList.remove('active');
    navMenu.classList.remove('active');
}));

// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Hero Slideshow
class HeroSlideshow {
    constructor() {
        this.slides = [];
        this.currentSlide = 0;
        this.slideInterval = null;
        this.init();
    }

    async init() {
        await this.loadHeroData();
        this.setupSlideshow();
        this.setupNavigation();
        this.setupDots();
        this.startAutoSlide();
    }

    async loadHeroData() {
        try {
            const response = await fetch('data/hero.json');
            const data = await response.json();
            this.slides = data.slides;
            this.renderSlides();
        } catch (error) {
            console.error('Error loading hero data:', error);
            // Fallback to empty slides if loading fails
            this.slides = [];
            this.renderSlides();
        }
    }

    renderSlides() {
        const slideshowContainer = document.querySelector('.hero-slideshow');
        slideshowContainer.innerHTML = '';

        if (this.slides.length === 0) {
            slideshowContainer.innerHTML = '<div class="slide active"><div class="slide-content"><h1>米達斯酒品</h1><p>品味世界，傳承經典</p></div></div>';
            return;
        }

        this.slides.forEach((slide, index) => {
            const slideElement = document.createElement('div');
            slideElement.className = `slide ${index === 0 ? 'active' : ''}`;
            slideElement.innerHTML = `
                <img src="${slide.image}" alt="${slide.title}">
                <div class="slide-content">
                    <h1>${slide.title}</h1>
                    <p>${slide.subtitle}</p>
                </div>
            `;
            slideshowContainer.appendChild(slideElement);
        });
    }

    setupSlideshow() {
        this.slideElements = document.querySelectorAll('.slide');
    }

    setupNavigation() {
        const prevBtn = document.querySelector('.prev-btn');
        const nextBtn = document.querySelector('.next-btn');

        prevBtn.addEventListener('click', () => {
            this.prevSlide();
        });

        nextBtn.addEventListener('click', () => {
            this.nextSlide();
        });
    }

    setupDots() {
        const dotsContainer = document.querySelector('.hero-dots');
        dotsContainer.innerHTML = '';

        this.slides.forEach((_, index) => {
            const dot = document.createElement('div');
            dot.className = `dot ${index === 0 ? 'active' : ''}`;
            dot.addEventListener('click', () => {
                this.goToSlide(index);
            });
            dotsContainer.appendChild(dot);
        });

        this.dotElements = document.querySelectorAll('.dot');
    }

    goToSlide(index) {
        this.slideElements[this.currentSlide].classList.remove('active');
        this.dotElements[this.currentSlide].classList.remove('active');

        this.currentSlide = index;

        this.slideElements[this.currentSlide].classList.add('active');
        this.dotElements[this.currentSlide].classList.add('active');
    }

    nextSlide() {
        const nextIndex = (this.currentSlide + 1) % this.slides.length;
        this.goToSlide(nextIndex);
    }

    prevSlide() {
        const prevIndex = (this.currentSlide - 1 + this.slides.length) % this.slides.length;
        this.goToSlide(prevIndex);
    }

    startAutoSlide() {
        this.slideInterval = setInterval(() => {
            this.nextSlide();
        }, 5000);
    }

    stopAutoSlide() {
        if (this.slideInterval) {
            clearInterval(this.slideInterval);
        }
    }
}

// Data Loading Functions
class DataLoader {
    constructor() {
        this.loadWineries();
        this.loadWines();
    }

    async loadWineries() {
        try {
            const response = await fetch('data/wineries.json');
            const data = await response.json();
            this.renderWineries(data.wineries);
        } catch (error) {
            console.error('Error loading wineries data:', error);
            this.renderWineries([]);
        }
    }

    async loadWines() {
        try {
            const response = await fetch('data/wines.json');
            const data = await response.json();
            this.renderWines(data.wines);
        } catch (error) {
            console.error('Error loading wines data:', error);
            this.renderWines([]);
        }
    }

    renderWineries(wineries) {
        const container = document.getElementById('wineries-container');
        
        if (!container) {
            console.error('Wineries container not found!');
            return;
        }
        
        if (wineries.length === 0) {
            container.innerHTML = '<p style="text-align: center; color: #666;">莊園資料載入中...</p>';
            return;
        }

        const html = wineries.map(winery => `
            <div class="winery-card">
                <img src="${winery.image}" alt="${winery.name}">
                <div class="winery-info">
                    <h3>${winery.name}</h3>
                    <p>${winery.description}</p>
                </div>
            </div>
        `).join('');
        
        container.innerHTML = html;
        
        // Trigger animation observer for newly created elements
        setTimeout(() => {
            const cards = container.querySelectorAll('.winery-card');
            cards.forEach(card => {
                if (window.animationObserver) {
                    window.animationObserver.observer.observe(card);
                }
            });
        }, 100);
    }

    renderWines(wines) {
        const container = document.getElementById('wines-container');
        
        if (!container) {
            console.error('Wines container not found!');
            return;
        }
        
        if (wines.length === 0) {
            container.innerHTML = '<p style="text-align: center; color: #666;">酒品資料載入中...</p>';
            return;
        }

        const html = wines.map(wine => `
            <div class="wine-card">
                <img src="${wine.image}" alt="${wine.name}">
                <div class="wine-info">
                    <h3>${wine.name}</h3>
                    <div class="price">${wine.price}</div>
                    <p>${wine.description}</p>
                </div>
            </div>
        `).join('');
        
        container.innerHTML = html;
        
        // Trigger animation observer for newly created elements
        setTimeout(() => {
            const cards = container.querySelectorAll('.wine-card');
            cards.forEach(card => {
                if (window.animationObserver) {
                    window.animationObserver.observer.observe(card);
                }
            });
        }, 100);
    }
}

// Contact Form Handler
class ContactForm {
    constructor() {
        this.form = document.querySelector('#contact form');
        this.init();
    }

    init() {
        if (this.form) {
            this.form.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleSubmit();
            });
        }
    }

    handleSubmit() {
        const formData = new FormData(this.form);
        const data = Object.fromEntries(formData);
        
        // Here you would typically send the data to your backend
        console.log('Form submitted with data:', data);
        
        // Show success message
        alert('感謝您的訊息，我們會盡快回覆您！');
        this.form.reset();
    }
}

// Intersection Observer for animations
class AnimationObserver {
    constructor() {
        this.observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate');
                }
            });
        }, {
            threshold: 0.1
        });

        this.observeElements();
    }

    observeElements() {
        const elements = document.querySelectorAll('.winery-card, .wine-card, .custom-content, .contact-content');
        elements.forEach(el => {
            this.observer.observe(el);
        });
    }
}

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new HeroSlideshow();
    window.animationObserver = new AnimationObserver();
    new DataLoader();
    new ContactForm();
});

// Add smooth reveal animations
const style = document.createElement('style');
style.textContent = `
    .winery-card,
    .wine-card,
    .custom-content,
    .contact-content {
        opacity: 0;
        transform: translateY(20px);
        transition: opacity 0.6s ease, transform 0.6s ease;
    }

    .winery-card.animate,
    .wine-card.animate,
    .custom-content.animate,
    .contact-content.animate {
        opacity: 1;
        transform: translateY(0);
    }
`;
document.head.appendChild(style);