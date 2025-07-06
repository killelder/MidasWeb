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
        // Use embedded data to avoid CORS issues
        this.slides = [
            {
                "image": "assets/hero/hero-1.webp",
                "title": "米達斯酒品",
                "subtitle": "品味世界，傳承經典"
            },
            {
                "image": "assets/hero/hero-2.webp",
                "title": "精選進口酒品",
                "subtitle": "來自世界各地的頂級佳釀"
            },
            {
                "image": "assets/hero/hero-3.webp",
                "title": "專業服務",
                "subtitle": "為您提供最優質的酒品體驗"
            }
        ];
        this.renderSlides();
    }

    renderSlides() {
        const slideshowContainer = document.querySelector('.hero-slideshow');
        slideshowContainer.innerHTML = '';

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
        // Use embedded data to avoid CORS issues
        const wineries = [
            {
                "id": 1,
                "name": "Welland 澳洲巴羅薩谷酒莊",
                "image": "assets/wineries/D-IMG07_1735774028.webp",
                "description": "Welland 是一座充滿靈魂的酒莊，位於南澳巴羅薩谷邊緣，擁有近百年歷史的老藤葡萄園，曾經供應給多家著名酒廠，卻一度面臨被拆除的命運；直到一群熱愛土地與葡萄酒的夥伴挺身而出，才讓這片珍貴的老藤得以重生，他們用心修復藤蔓、重建灌溉，將歷史與風土轉化為風味深邃、富有故事感的酒款，每一口都是對時間與土地的致敬。"
            },
            {
                "id": 2,
                "name": "Lot 1 Wines 精品酒莊",
                "image": "assets/wineries/Lot 1 Wines_1633326278.jpg",
                "description": "Lot 1 Wines 是一個專注於小批量精品酒款的酒莊，以其獨特的釀造工藝和對品質的堅持而聞名。酒莊採用傳統手工釀造方法，每一瓶酒都經過精心挑選和調配，呈現出獨特的風味層次和優雅的口感，是葡萄酒愛好者的理想選擇。"
            },
            {
                "id": 3,
                "name": "精選合作酒莊",
                "image": "assets/wineries/2025-01-02_10-03-47_1735774454.webp",
                "description": "我們與多家國際知名酒莊建立了長期合作關係，致力於為客戶提供最優質的葡萄酒選擇。這些酒莊都擁有悠久的釀酒歷史和卓越的品質保證，每一款酒都經過嚴格的品質控制和專業的品酒師評選，確保為您帶來最佳的品酒體驗。"
            }
        ];
        this.renderWineries(wineries);
    }

    async loadWines() {
        // Use embedded data to avoid CORS issues
        const wines = [
            {
                "id": 1,
                "name": "法國波爾多紅酒 2018",
                "image": "assets/wines/wine-1.webp",
                "price": "NT$ 2,800",
                "description": "來自法國波爾多產區的精選紅酒，具有濃郁的果香和優雅的單寧結構，適合搭配紅肉料理。"
            },
            {
                "id": 2,
                "name": "義大利奇揚地經典 2019",
                "image": "assets/wines/wine-2.jpg",
                "price": "NT$ 1,980",
                "description": "義大利托斯卡尼產區的經典奇揚地紅酒，口感平衡，帶有櫻桃和香料的複雜香氣。"
            },
            {
                "id": 3,
                "name": "西班牙里奧哈珍藏 2017",
                "image": "assets/wines/wine-3.webp",
                "price": "NT$ 3,200",
                "description": "西班牙里奧哈產區的珍藏級紅酒，經過長時間橡木桶陳年，擁有濃郁的香草和果實香氣。"
            },
            {
                "id": 4,
                "name": "澳洲西拉精選 2020",
                "image": "assets/wines/wine-4.webp",
                "price": "NT$ 2,400",
                "description": "澳洲巴羅薩谷產區的西拉葡萄酒，口感濃郁豐滿，帶有黑莓和胡椒的特色風味。"
            },
            {
                "id": 5,
                "name": "法國香檳 Brut",
                "image": "assets/wines/wine-5.jpg",
                "price": "NT$ 4,500",
                "description": "法國香檳產區的精品香檳，氣泡細膩，口感清新，適合慶祝場合或搭配海鮮。"
            },
            {
                "id": 6,
                "name": "德國雷司令白酒 2021",
                "image": "assets/wines/wine-6.webp",
                "price": "NT$ 1,680",
                "description": "德國摩澤爾產區的雷司令白酒，酸度平衡，帶有清新的果香和礦物質風味。"
            }
        ];
        this.renderWines(wines);
    }

    renderWineries(wineries) {
        const container = document.getElementById('wineries-container');
        
        if (wineries.length === 0) {
            container.innerHTML = '<p style="text-align: center; color: #666;">莊園資料載入中...</p>';
            return;
        }

        container.innerHTML = wineries.map(winery => `
            <div class="winery-card">
                <img src="${winery.image}" alt="${winery.name}">
                <div class="winery-info">
                    <h3>${winery.name}</h3>
                    <p>${winery.description}</p>
                </div>
            </div>
        `).join('');
    }

    renderWines(wines) {
        const container = document.getElementById('wines-container');
        
        if (wines.length === 0) {
            container.innerHTML = '<p style="text-align: center; color: #666;">酒品資料載入中...</p>';
            return;
        }

        container.innerHTML = wines.map(wine => `
            <div class="wine-card">
                <img src="${wine.image}" alt="${wine.name}">
                <div class="wine-info">
                    <h3>${wine.name}</h3>
                    <div class="price">${wine.price}</div>
                    <p>${wine.description}</p>
                </div>
            </div>
        `).join('');
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
    new DataLoader();
    new ContactForm();
    new AnimationObserver();
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