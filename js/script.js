// 網站載入警示視窗
function showWelcomeAlert() {
    console.log('showWelcomeAlert 函數被調用');
    
    // 檢查是否已經顯示過警示（使用 localStorage 避免重複顯示）
    const hasShownAlert = localStorage.getItem('midasWelcomeAlert');
    console.log('hasShownAlert:', hasShownAlert);
    
    if (!hasShownAlert) {
        console.log('準備顯示年齡確認視窗');
        // 延遲一下讓頁面完全載入
        setTimeout(() => {
            console.log('顯示年齡確認視窗');
            
            // 顯示年齡確認對話框
            const isAdult = confirm('未滿18歲請勿飲酒，是否滿18歲？\n\n請注意：\n• 飲酒過量，有害健康\n• 禁止酒駕，安全回家\n• 未成年請勿飲酒');
            
            if (isAdult) {
                console.log('用戶確認已滿18歲');
                // 記錄已顯示過警示
                localStorage.setItem('midasWelcomeAlert', 'true');
                console.log('年齡確認完成，警示視窗已顯示並記錄');
            } else {
                console.log('用戶未滿18歲，返回上一頁');
                // 返回上一頁
                if (window.history.length > 1) {
                    window.history.back();
                } else {
                    // 如果沒有上一頁，則關閉視窗或導向其他頁面
                    window.close();
                    // 如果無法關閉視窗，則導向 Google
                    if (!window.closed) {
                        window.location.href = 'https://www.google.com';
                    }
                }
            }
        }, 1000);
    } else {
        console.log('警示視窗已經顯示過，跳過');
    }
}

// 頁面載入完成後顯示警示
let alertShown = false; // 防止重複顯示

document.addEventListener('DOMContentLoaded', () => {
    console.log('DOMContentLoaded 事件觸發');
    if (!alertShown) {
        showWelcomeAlert();
        alertShown = true;
    }
});

// 也監聽 window load 事件作為備用
window.addEventListener('load', () => {
    console.log('window load 事件觸發');
    if (!alertShown) {
        showWelcomeAlert();
        alertShown = true;
    }
});

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
        this.lastHeroUpdate = null;
        this.updateInterval = 30000; // 每30秒檢查一次更新
        this.init();
    }

    async init() {
        await this.loadHeroData();
        this.setupSlideshow();
        this.setupNavigation();
        this.setupDots();
        this.startAutoSlide();
        
        // 啟動自動更新檢查
        this.startAutoUpdate();
    }

    startAutoUpdate() {
        setInterval(() => {
            this.checkForUpdates();
        }, this.updateInterval);
    }
    
    async checkForUpdates() {
        try {
            // 檢查hero數據更新 - 使用內容比較
            const heroResponse = await fetch('data/hero.json', {
                cache: 'no-cache'
            });
            
            if (heroResponse.ok) {
                const heroText = await heroResponse.text();
                const heroHash = this.simpleHash(heroText);
                
                if (this.lastHeroUpdate !== heroHash) {
                    console.log('檢測到hero數據更新，重新加載...');
                    this.lastHeroUpdate = heroHash;
                    const data = JSON.parse(heroText);
                    this.slides = data.slides;
                    this.renderSlides();
                    this.setupSlideshow();
                    this.setupDots();
                }
            }
        } catch (error) {
            console.error('檢查hero更新時出錯:', error);
        }
    }
    
    simpleHash(str) {
        let hash = 0;
        for (let i = 0; i < str.length; i++) {
            const char = str.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash = hash & hash; // Convert to 32bit integer
        }
        return hash.toString();
    }

    async loadHeroData() {
        try {
            const response = await fetch('data/hero.json', {
                cache: 'no-cache'
            });
            const data = await response.json();
            this.slides = data.slides;
            
            // 設置初始hash值
            const responseText = await fetch('data/hero.json', {
                cache: 'no-cache'
            }).then(r => r.text());
            this.lastHeroUpdate = this.simpleHash(responseText);
            
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
                <img src="${slide.image}" alt="${slide.title}" loading="${index === 0 ? 'eager' : 'lazy'}">
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
        this.lastWineriesUpdate = null;
        this.lastWinesUpdate = null;
        this.updateInterval = 30000; // 每30秒檢查一次更新
        
        this.loadWineries();
        this.loadWines();
        
        // 啟動自動更新檢查
        this.startAutoUpdate();
    }
    
    startAutoUpdate() {
        setInterval(() => {
            this.checkForUpdates();
        }, this.updateInterval);
    }
    
    async checkForUpdates() {
        try {
            // 檢查酒莊數據更新 - 使用內容比較
            const wineriesResponse = await fetch('data/wineries.json', {
                cache: 'no-cache'
            });
            
            if (wineriesResponse.ok) {
                const wineriesText = await wineriesResponse.text();
                const wineriesHash = this.simpleHash(wineriesText);
                
                if (this.lastWineriesUpdate !== wineriesHash) {
                    console.log('檢測到酒莊數據更新，重新加載...');
                    this.lastWineriesUpdate = wineriesHash;
                    this.renderWineries(JSON.parse(wineriesText).wineries);
                    //this.showUpdateNotification('酒莊資料已更新');
                }
            }
            
            // 檢查酒品數據更新 - 使用內容比較
            const winesResponse = await fetch('data/wines.json', {
                cache: 'no-cache'
            });
            
            if (winesResponse.ok) {
                const winesText = await winesResponse.text();
                const winesHash = this.simpleHash(winesText);
                
                if (this.lastWinesUpdate !== winesHash) {
                    console.log('檢測到酒品數據更新，重新加載...');
                    this.lastWinesUpdate = winesHash;
                    this.renderWines(JSON.parse(winesText).wines);
                    //this.showUpdateNotification('酒品資料已更新');
                }
            }
        } catch (error) {
            console.log('檢查更新時發生錯誤:', error);
        }
    }
    
    // 簡單的字符串哈希函數
    simpleHash(str) {
        let hash = 0;
        for (let i = 0; i < str.length; i++) {
            const char = str.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash = hash & hash; // 轉換為32位整數
        }
        return hash.toString();
    }
    
    // 顯示更新通知
    showUpdateNotification(message) {
        // 創建通知元素
        const notification = document.createElement('div');
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: #c6a777;
            color: white;
            padding: 15px 20px;
            border-radius: 5px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            z-index: 10000;
            font-weight: bold;
            transform: translateX(100%);
            transition: transform 0.3s ease;
        `;
        notification.textContent = message;
        
        // 添加到頁面
        document.body.appendChild(notification);
        
        // 顯示動畫
        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
        }, 100);
        
        // 3秒後自動隱藏
        setTimeout(() => {
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        }, 3000);
    }

    async loadWineries() {
        try {
            console.log('開始加載酒莊數據...');
            // 使用智能緩存控制，自動檢測文件變化
            const response = await fetch('data/wineries.json', {
                cache: 'no-cache',
                headers: {
                    'Cache-Control': 'no-cache'
                }
            });
            console.log('HTTP響應狀態:', response.status, response.statusText);
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const data = await response.json();
            console.log('成功加載酒莊數據:', data);
            console.log('酒莊數量:', data.wineries ? data.wineries.length : 0);
            
            if (data.wineries) {
                data.wineries.forEach((winery, index) => {
                    console.log(`酒莊 ${index + 1}:`, winery.name, '圖片:', winery.image);
                });
            }
            
            this.renderWineries(data.wineries);
        } catch (error) {
            console.error('加載酒莊數據時發生錯誤:', error);
            console.error('錯誤詳情:', error.message);
            this.renderWineries([]);
        }
    }

    async loadWines() {
        try {
            const response = await fetch('data/wines.json', {
                cache: 'no-cache',
                headers: {
                    'Cache-Control': 'no-cache'
                }
            });
            const data = await response.json();
            this.renderWines(data.wines);
        } catch (error) {
            console.error('Error loading wines data:', error);
            this.renderWines([]);
        }
    }

    renderWineries(wineries) {
        console.log('開始渲染酒莊，數據:', wineries);
        const container = document.getElementById('wineries-container');
        
        if (!container) {
            console.error('找不到酒莊容器元素!');
            return;
        }
        
        console.log('找到酒莊容器:', container);
        
        if (!wineries || wineries.length === 0) {
            console.log('酒莊數據為空，顯示載入中訊息');
            container.innerHTML = '<p style="text-align: center; color: #666;">莊園資料載入中...</p>';
            return;
        }

        console.log('開始生成酒莊HTML...');
        const html = wineries.map((winery, index) => {
            console.log(`生成酒莊 ${index + 1} HTML:`, winery.name);
            return `
                <div class="winery-card">
                    <img src="${winery.image}" alt="${winery.name}" loading="lazy">
                    <div class="winery-info">
                        <h3>${winery.name}</h3>
                        <p>${winery.description}</p>
                    </div>
                </div>
            `;
        }).join('');
        
        console.log('生成的HTML長度:', html.length);
        container.innerHTML = html;
        console.log('HTML已插入到容器中');
        
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

        // 生成酒品結構化數據
        this.generateWineStructuredData(wines);

        const html = wines.map((wine, index) => `
            <div class="wine-card">
                <img src="${wine.image}" alt="${wine.name}" loading="lazy">
                <div class="wine-info">
                    <h3>${wine.name}</h3>
                    <div class="price">${wine.price}</div>
                    <p>${wine.description}</p>
                    ${wine.awards && wine.awards.length > 0 ? `
                        <div class="awards-container">
                            <div class="awards-header">
                                <span class="awards-count">🏆 ${wine.awards.length} 個獎項</span>
                            </div>
                            ${wine.awards.map((award, awardIndex) => {
                                const hasDetail = award.detail && award.detail.trim() !== '';
                                return `
                                    <div class="award ${hasDetail ? 'clickable' : 'no-detail'}" ${hasDetail ? `onclick=\"showAwardDetails('${wine.name}', '${award.name}', '${award.detail}')\"` : ''}>
                                        <span class="award-icon">🏆</span><span class="award-text">${award.name}</span>
                                    </div>
                                `;
                            }).join('')}
                        </div>
                    ` : ''}
                    ${(wine.aroma || wine.flavor) ? `
                        <div class="wine-details-toggle" onclick="toggleWineDetails(${index})">
                            <span class="toggle-text">查看風味詳情</span>
                            <span class="toggle-icon">▼</span>
                        </div>
                        <div class="wine-details" id="wine-details-${index}" style="display: none;">
                            ${wine.aroma ? `<div class="detail-item">
                                <div class="detail-icon"></div>
                                <div class="detail-content">
                                    <span class="detail-label">香氣特徵</span>
                                    <span class="detail-value">${wine.aroma}</span>
                                </div>
                            </div>` : ''}
                            ${wine.flavor ? `<div class="detail-item">
                                <div class="detail-icon"></div>
                                <div class="detail-content">
                                    <span class="detail-label">風味特色</span>
                                    <span class="detail-value">${wine.flavor}</span>
                                </div>
                            </div>` : ''}
                        </div>
                    ` : ''}
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

    generateWineStructuredData(wines) {
        // 移除現有的酒品結構化數據
        const existingScript = document.querySelector('script[data-wine-structured-data]');
        if (existingScript) {
            existingScript.remove();
        }

        // 創建新的結構化數據
        const wineProducts = wines.map(wine => ({
            "@type": "Product",
            "name": wine.name,
            "description": wine.description,
            "image": wine.image,
            "offers": {
                "@type": "Offer",
                "price": wine.price.replace(/[^\d]/g, ''), // 提取數字
                "priceCurrency": "TWD",
                "availability": "https://schema.org/InStock"
            },
            "brand": {
                "@type": "Brand",
                "name": "米達斯酒品"
            },
            "category": "葡萄酒"
        }));

        const structuredData = {
            "@context": "https://schema.org",
            "@type": "ItemList",
            "name": "米達斯酒品精選酒品",
            "description": "專業進口酒商精選的優質酒品",
            "itemListElement": wineProducts.map((wine, index) => ({
                "@type": "ListItem",
                "position": index + 1,
                "item": wine
            }))
        };

        // 添加到頁面
        const script = document.createElement('script');
        script.type = 'application/ld+json';
        script.textContent = JSON.stringify(structuredData);
        script.setAttribute('data-wine-structured-data', 'true');
        document.head.appendChild(script);
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

// 切換風味詳情的全局函數
function toggleWineDetails(index) {
    const detailsElement = document.getElementById(`wine-details-${index}`);
    const toggleElement = detailsElement.previousElementSibling;
    const toggleText = toggleElement.querySelector('.toggle-text');
    const toggleIcon = toggleElement.querySelector('.toggle-icon');
    
    if (detailsElement.style.display === 'none') {
        detailsElement.style.display = 'block';
        toggleText.textContent = '收起風味詳情';
        toggleIcon.textContent = '▲';
        toggleElement.classList.add('active');
    } else {
        detailsElement.style.display = 'none';
        toggleText.textContent = '查看風味詳情';
        toggleIcon.textContent = '▼';
        toggleElement.classList.remove('active');
    }
}

// 顯示獲獎詳情的全局函數
function showAwardDetails(wineName, awardName, awardDetail) {
    const modal = document.createElement('div');
    modal.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0,0,0,0.7);
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 10001;
        opacity: 0;
        transition: opacity 0.3s ease;
    `;
    
    const content = document.createElement('div');
    content.style.cssText = `
        background: white;
        padding: 30px;
        border-radius: 10px;
        max-width: 450px;
        text-align: center;
        transform: scale(0.8);
        transition: transform 0.3s ease;
    `;
    
    content.innerHTML = `
        <div style="font-size: 3rem; margin-bottom: 20px;">🏆</div>
        <h3 style="color: #070322; margin-bottom: 15px;">${wineName}</h3>
        <div style="background: linear-gradient(135deg, #c6a777, #d4b88a); color: white; padding: 15px; border-radius: 10px; margin-bottom: 20px;">
            <p style="font-weight: bold; font-size: 1.1rem; margin: 0;">${awardName}</p>
        </div>
        <p style="color: #666; margin-bottom: 25px; line-height: 1.6;">${awardDetail}</p>
        <button onclick="this.closest('.award-modal').remove()" style="
            background: #c6a777;
            color: white;
            border: none;
            padding: 10px 20px;
            border-radius: 5px;
            cursor: pointer;
            font-weight: bold;
            transition: background-color 0.3s ease;
        " onmouseover="this.style.background='#a8956a'" onmouseout="this.style.background='#c6a777'">關閉</button>
    `;
    
    modal.appendChild(content);
    modal.classList.add('award-modal');
    document.body.appendChild(modal);
    
    // 動畫效果
    setTimeout(() => {
        modal.style.opacity = '1';
        content.style.transform = 'scale(1)';
    }, 10);
    
    // 點擊背景關閉
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.remove();
        }
    });
}

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM已加載完成，開始初始化...');
    new HeroSlideshow();
    window.animationObserver = new AnimationObserver();
    console.log('創建DataLoader實例...');
    new DataLoader();
    new ContactForm();
    console.log('所有組件初始化完成');
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

    .award.clickable {
        cursor: pointer;
        transition: all 0.3s ease;
    }

    .award.clickable:hover {
        background-color: rgba(198, 167, 119, 0.1);
        transform: translateY(-2px);
        box-shadow: 0 4px 8px rgba(0,0,0,0.1);
    }

    .award.no-detail {
        cursor: default;
        opacity: 0.7;
    }
`;
document.head.appendChild(style);