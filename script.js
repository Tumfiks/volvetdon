// ============================================
// VolvetMC Shop - Адаптивный магазин доната
// Версия: 2.0 (Полностью адаптивная)
// ============================================

class VolvetMCShop {
    constructor() {
        // Основные переменные
        this.cart = [];
        this.selectedServer = null;
        this.serverOnline = {
            lite: { online: 0, max: 25 },
            crit: { online: 0, max: 20 }
        };
        
        // Конфигурация серверов
        this.SERVER_CONFIG = {
            lite: {
                name: "Lite режим",
                ip: "VolvetMC.aternos.me",
                port: 29953,
                maxPlayers: 25,
                apiUrls: [
                    "https://api.mcsrvstat.us/2/{ip}:{port}",
                    "https://api.mcstatus.io/v2/status/java/{ip}:{port}"
                ]
            },
            crit: {
                name: "Crit режим",
                ip: "phoenix-pe.ru",
                port: 19132,
                maxPlayers: 20,
                apiUrls: [
                    "https://api.mcsrvstat.us/2/{ip}:{port}",
                    "https://api.mcstatus.io/v2/status/java/{ip}:{port}"
                ]
            }
        };
        
        // Состояние адаптивности
        this.isMobile = false;
        this.isTablet = false;
        this.isDesktop = true;
        
        // DOM элементы
        this.elements = {};
        
        // Инициализация
        this.init();
    }

    // ============================
    // ИНИЦИАЛИЗАЦИЯ
    // ============================
    
    init() {
        console.log("🚀 VolvetMC Shop инициализируется...");
        
        // Определяем тип устройства
        this.detectDevice();
        
        // Находим все DOM элементы
        this.findElements();
        
        // Загружаем сохраненные данные
        this.loadFromLocalStorage();
        
        // Настраиваем обработчики событий
        this.setupEventListeners();
        
        // Инициализируем онлайн серверов
        this.initOnline();
        
        // Запускаем адаптивные функции
        this.setupResponsiveFeatures();
        
        console.log("✅ VolvetMC Shop готов! Устройство: " + 
            (this.isMobile ? "Мобильное" : this.isTablet ? "Планшет" : "Десктоп"));
    }
    
    detectDevice() {
        const width = window.innerWidth;
        this.isMobile = width <= 768;
        this.isTablet = width > 768 && width <= 992;
        this.isDesktop = width > 992;
    }
    
    findElements() {
        // Основные элементы
        this.elements = {
            // Шапка
            currentServer: document.getElementById('currentServer'),
            currentOnline: document.getElementById('currentOnline'),
            changeServerBtn: document.getElementById('changeServerBtn'),
            cartIcon: document.getElementById('cartIcon'),
            cartCount: document.getElementById('cartCount'),
            mobileMenuBtn: document.getElementById('mobileMenuBtn'),
            
            // Выбор сервера
            serverSelection: document.getElementById('serverSelection'),
            shopSection: document.getElementById('shopSection'),
            liteOnline: document.getElementById('liteOnline'),
            critOnline: document.getElementById('critOnline'),
            btnSelectServers: document.querySelectorAll('.btn-select-server'),
            
            // Магазин
            navBtns: document.querySelectorAll('.nav-btn'),
            categoryContents: document.querySelectorAll('.category-content'),
            buyButtons: document.querySelectorAll('.btn-buy'),
            
            // Корзина
            cartModal: document.getElementById('cartModal'),
            cartItems: document.getElementById('cartItems'),
            cartBadge: document.getElementById('cartBadge'),
            itemsCount: document.getElementById('itemsCount'),
            summaryItems: document.getElementById('summaryItems'),
            totalPrice: document.getElementById('totalPrice'),
            finalPrice: document.getElementById('finalPrice'),
            checkoutPrice: document.getElementById('checkoutPrice'),
            cartServerName: document.getElementById('cartServerName'),
            goToShopBtn: document.getElementById('goToShopBtn'),
            closeCartBtn: document.getElementById('closeCartBtn'),
            clearCartBtn: document.getElementById('clearCartBtn'),
            checkoutBtn: document.getElementById('checkoutBtn'),
            
            // Оформление заказа
            purchaseModal: document.getElementById('purchaseModal'),
            purchaseServer: document.getElementById('purchaseServer'),
            purchaseProduct: document.getElementById('purchaseProduct'),
            purchasePrice: document.getElementById('purchasePrice'),
            instructionPrice: document.getElementById('instructionPrice'),
            closePurchaseBtn: document.getElementById('closePurchaseBtn'),
            cancelPurchaseBtn: document.getElementById('cancelPurchaseBtn'),
            confirmPurchaseBtn: document.getElementById('confirmPurchaseBtn'),
            
            // Уведомления
            notification: document.getElementById('notification'),
            notificationText: document.getElementById('notificationText')
        };
    }
    
    setupEventListeners() {
        // Адаптивные обработчики в зависимости от устройства
        if (this.isMobile) {
            this.setupMobileEventListeners();
        } else {
            this.setupDesktopEventListeners();
        }
        
        // Общие обработчики
        this.setupCommonEventListeners();
        
        // Обработчик изменения размера окна
        window.addEventListener('resize', () => this.handleResize());
    }
    
    setupDesktopEventListeners() {
        // Десктопные обработчики
        console.log("🖥️ Настройка десктопных обработчиков...");
        
        // Кнопки выбора сервера
        this.elements.btnSelectServers.forEach(btn => {
            btn.addEventListener('click', (e) => {
                const server = e.target.closest('.btn-select-server').dataset.server;
                this.selectServer(server);
            });
        });
        
        // Навигация магазина
        this.elements.navBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                const category = e.target.closest('.nav-btn').dataset.category;
                this.switchCategory(category);
            });
        });
    }
    
    setupMobileEventListeners() {
        // Мобильные обработчики
        console.log("📱 Настройка мобильных обработчиков...");
        
        // Кнопка мобильного меню
        if (this.elements.mobileMenuBtn) {
            this.elements.mobileMenuBtn.addEventListener('click', () => this.showMobileMenu());
        }
        
        // Тач-события для карточек товаров
        this.elements.buyButtons.forEach(btn => {
            btn.addEventListener('touchstart', (e) => {
                e.target.style.transform = 'scale(0.95)';
                e.target.style.opacity = '0.8';
            });
            
            btn.addEventListener('touchend', (e) => {
                e.target.style.transform = '';
                e.target.style.opacity = '1';
                
                if (!this.selectedServer) {
                    this.showNotification('Сначала выберите сервер!', 'warning');
                    this.showServerSelection();
                    return;
                }
                
                const product = e.target.closest('.btn-buy').dataset.product;
                const price = parseInt(e.target.closest('.btn-buy').dataset.price);
                this.addToCart(product, price);
            });
        });
        
        // Свайп для категорий
        this.setupSwipeGestures();
    }
    
    setupCommonEventListeners() {
        // Общие обработчики для всех устройств
        
        // Кнопки покупки (клик)
        this.elements.buyButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                if (!this.selectedServer) {
                    this.showNotification('Сначала выберите сервер!', 'warning');
                    this.showServerSelection();
                    return;
                }
                
                const product = e.target.closest('.btn-buy').dataset.product;
                const price = parseInt(e.target.closest('.btn-buy').dataset.price);
                this.addToCart(product, price);
            });
        });
        
        // Корзина
        if (this.elements.cartIcon) {
            this.elements.cartIcon.addEventListener('click', () => this.showCart());
        }
        
        if (this.elements.changeServerBtn) {
            this.elements.changeServerBtn.addEventListener('click', () => this.showServerSelection());
        }
        
        if (this.elements.closeCartBtn) {
            this.elements.closeCartBtn.addEventListener('click', () => this.hideCart());
        }
        
        if (this.elements.clearCartBtn) {
            this.elements.clearCartBtn.addEventListener('click', () => this.clearCart());
        }
        
        if (this.elements.checkoutBtn) {
            this.elements.checkoutBtn.addEventListener('click', () => this.checkout());
        }
        
        if (this.elements.goToShopBtn) {
            this.elements.goToShopBtn.addEventListener('click', () => {
                this.hideCart();
                this.showShop();
            });
        }
        
        // Оформление заказа
        if (this.elements.closePurchaseBtn) {
            this.elements.closePurchaseBtn.addEventListener('click', () => this.hidePurchaseModal());
        }
        
        if (this.elements.cancelPurchaseBtn) {
            this.elements.cancelPurchaseBtn.addEventListener('click', () => this.hidePurchaseModal());
        }
        
        if (this.elements.confirmPurchaseBtn) {
            this.elements.confirmPurchaseBtn.addEventListener('click', () => this.confirmPurchase());
        }
        
        // Закрытие модальных окон по клику вне
        document.addEventListener('click', (e) => {
            if (this.elements.cartModal && e.target === this.elements.cartModal) {
                this.hideCart();
            }
            if (this.elements.purchaseModal && e.target === this.elements.purchaseModal) {
                this.hidePurchaseModal();
            }
        });
        
        // Клавиша Escape для закрытия окон
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.hideCart();
                this.hidePurchaseModal();
                this.hideMobileMenu();
            }
        });
    }
    
    setupResponsiveFeatures() {
        // Адаптивные особенности
        
        if (this.isMobile) {
            // Для мобильных: оптимизация тач-интерфейса
            this.optimizeForTouch();
            
            // Улучшаем скролл
            this.setupSmoothScroll();
            
            // Предотвращаем зум на инпутах
            this.preventZoom();
            
            // Добавляем стили для мобильных
            this.addMobileStyles();
        }
        
        if (this.isTablet) {
            // Для планшетов: промежуточные настройки
            this.adjustTabletLayout();
        }
    }
    
    // ============================
    // АДАПТИВНЫЕ ФУНКЦИИ
    // ============================
    
    optimizeForTouch() {
        // Увеличиваем области касания для кнопок
        const touchElements = document.querySelectorAll('button, .nav-btn, .product-card, .server-card');
        touchElements.forEach(el => {
            el.style.minHeight = '44px';
            el.style.minWidth = '44px';
        });
        
        // Добавляем активные состояния для всех интерактивных элементов
        const interactiveElements = document.querySelectorAll('.btn-buy, .nav-btn, .btn-select-server, .server-card, .product-card');
        interactiveElements.forEach(el => {
            el.addEventListener('touchstart', function() {
                this.style.transform = 'scale(0.98)';
                this.style.opacity = '0.9';
                this.style.transition = 'all 0.1s ease';
            });
            
            el.addEventListener('touchend', function() {
                this.style.transform = '';
                this.style.opacity = '';
            });
        });
    }
    
    setupSwipeGestures() {
        // Свайп жесты для мобильных устройств
        let touchStartX = 0;
        let touchEndX = 0;
        
        const shopSection = document.querySelector('.shop');
        if (!shopSection) return;
        
        shopSection.addEventListener('touchstart', (e) => {
            touchStartX = e.changedTouches[0].screenX;
        });
        
        shopSection.addEventListener('touchend', (e) => {
            touchEndX = e.changedTouches[0].screenX;
            this.handleSwipe(touchStartX, touchEndX);
        });
    }
    
    handleSwipe(startX, endX) {
        const threshold = 50;
        const diff = startX - endX;
        
        if (Math.abs(diff) > threshold) {
            if (diff > 0) {
                // Свайп влево
                this.swipeToNextCategory();
            } else {
                // Свайп вправо
                this.swipeToPrevCategory();
            }
        }
    }
    
    swipeToNextCategory() {
        const categories = ['privileges', 'other', 'kits'];
        const currentCategory = this.getCurrentCategory();
        const currentIndex = categories.indexOf(currentCategory);
        
        if (currentIndex < categories.length - 1) {
            this.switchCategory(categories[currentIndex + 1]);
        }
    }
    
    swipeToPrevCategory() {
        const categories = ['privileges', 'other', 'kits'];
        const currentCategory = this.getCurrentCategory();
        const currentIndex = categories.indexOf(currentCategory);
        
        if (currentIndex > 0) {
            this.switchCategory(categories[currentIndex - 1]);
        }
    }
    
    getCurrentCategory() {
        const activeBtn = document.querySelector('.nav-btn.active');
        return activeBtn ? activeBtn.dataset.category : 'privileges';
    }
    
    setupSmoothScroll() {
        // Плавный скролл для мобильных
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function(e) {
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
    }
    
    preventZoom() {
        // Предотвращаем зум на инпутах
        document.querySelectorAll('input, textarea, select').forEach(el => {
            el.style.fontSize = '16px'; // Предотвращает зум в iOS
        });
    }
    
    addMobileStyles() {
        // Добавляем дополнительные стили для мобильных
        const style = document.createElement('style');
        style.textContent = `
            /* Стили для мобильных устройств */
            .mobile-view .server-card {
                margin: 10px 0;
                padding: 20px;
            }
            
            .mobile-view .products-grid {
                gap: 15px;
                padding: 10px;
            }
            
            .mobile-view .product-card {
                padding: 15px;
                margin-bottom: 10px;
            }
            
            .mobile-view .btn-buy {
                padding: 14px;
                font-size: 14px;
            }
            
            .mobile-view .cart-modal-content,
            .mobile-view .checkout-modal-content {
                border-radius: 0;
                width: 100%;
                height: 100%;
                max-height: 100vh;
                max-width: 100%;
                top: 0;
                transform: none;
            }
            
            .mobile-view .cart-modal-content {
                animation: slideInUp 0.3s ease;
            }
            
            .mobile-view .checkout-modal-content {
                animation: slideInUp 0.3s ease;
            }
            
            @keyframes slideInUp {
                from {
                    transform: translateY(100%);
                }
                to {
                    transform: translateY(0);
                }
            }
            
            /* Улучшаем скролл на мобильных */
            .mobile-view .cart-items-section {
                -webkit-overflow-scrolling: touch;
                overflow-y: auto;
            }
            
            /* Оптимизация тач-интерфейса */
            .mobile-view button {
                cursor: pointer;
                -webkit-tap-highlight-color: transparent;
            }
            
            .mobile-view button:active {
                transform: scale(0.95);
            }
            
            /* Улучшаем читаемость текста */
            .mobile-view h1, .mobile-view h2, .mobile-view h3 {
                line-height: 1.3;
            }
            
            .mobile-view p {
                line-height: 1.5;
            }
        `;
        document.head.appendChild(style);
    }
    
    adjustTabletLayout() {
        // Настройки для планшетов
        const productCards = document.querySelectorAll('.product-card');
        productCards.forEach(card => {
            card.style.minHeight = 'auto';
        });
        
        // Увеличиваем размер шрифта для планшетов
        document.querySelectorAll('.product-features li, .server-features p').forEach(el => {
            el.style.fontSize = '15px';
        });
    }
    
    handleResize() {
        // Обработка изменения размера окна
        const oldIsMobile = this.isMobile;
        const oldIsTablet = this.isTablet;
        
        this.detectDevice();
        
        // Если изменился тип устройства, перезагружаем обработчики
        if (oldIsMobile !== this.isMobile || oldIsTablet !== this.isTablet) {
            console.log("🔄 Изменение типа устройства, обновление интерфейса...");
            
            // Обновляем интерфейс
            this.updateResponsiveUI();
            
            // Перезагружаем обработчики
            this.reloadEventListeners();
        }
    }
    
    reloadEventListeners() {
        // Перезагрузка обработчиков событий
        this.removeEventListeners();
        this.setupEventListeners();
    }
    
    removeEventListeners() {
        // Упрощенное удаление обработчиков
        // В реальном проекте нужно вести учет всех обработчиков
        const elementsToRefresh = [
            'mobileMenuBtn',
            'cartIcon',
            'changeServerBtn',
            'closeCartBtn',
            'clearCartBtn',
            'checkoutBtn',
            'goToShopBtn',
            'closePurchaseBtn',
            'cancelPurchaseBtn',
            'confirmPurchaseBtn'
        ];
        
        elementsToRefresh.forEach(elementName => {
            if (this.elements[elementName]) {
                const newElement = this.elements[elementName].cloneNode(true);
                this.elements[elementName].parentNode.replaceChild(newElement, this.elements[elementName]);
                this.elements[elementName] = newElement;
            }
        });
    }
    
    updateResponsiveUI() {
        // Обновляем интерфейс в зависимости от устройства
        document.body.classList.remove('mobile-view', 'tablet-view', 'desktop-view');
        
        if (this.isMobile) {
            document.body.classList.add('mobile-view');
            
            // Скрываем элементы только для десктопа
            const desktopOnlyElements = document.querySelectorAll('.desktop-only');
            desktopOnlyElements.forEach(el => {
                el.style.display = 'none';
            });
            
            // Показываем элементы для мобильных
            const mobileElements = document.querySelectorAll('.mobile-only');
            mobileElements.forEach(el => {
                el.style.display = '';
            });
            
        } else if (this.isTablet) {
            document.body.classList.add('tablet-view');
            
        } else {
            document.body.classList.add('desktop-view');
            
            // Показываем элементы только для десктопа
            const desktopOnlyElements = document.querySelectorAll('.desktop-only');
            desktopOnlyElements.forEach(el => {
                el.style.display = '';
            });
            
            // Скрываем элементы для мобильных
            const mobileElements = document.querySelectorAll('.mobile-only');
            mobileElements.forEach(el => {
                el.style.display = 'none';
            });
        }
        
        // Обновляем отображение мобильного меню
        this.updateMobileMenu();
    }
    
    updateMobileMenu() {
        const mobileMenu = document.getElementById('mobileMenu');
        if (mobileMenu) {
            if (!this.isMobile) {
                this.hideMobileMenu();
                mobileMenu.style.display = 'none';
            }
        }
    }
    
    // ============================
    // ОСНОВНАЯ ЛОГИКА
    // ============================
    
    // Онлайн серверов
    async initOnline() {
        console.log("🔄 Инициализация онлайна серверов...");
        
        // Показываем базовый онлайн
        this.updateOnlineDisplay('lite', this.serverOnline.lite.online, this.serverOnline.lite.max);
        this.updateOnlineDisplay('crit', this.serverOnline.crit.online, this.serverOnline.crit.max);
        this.updateProgressBars();
        
        // Загружаем реальный онлайн
        await this.updateServerOnline('lite');
        await this.updateServerOnline('crit');
        
        // Автоматическое обновление
        setInterval(async () => {
            if (document.querySelector('.server-selection.active')) {
                await this.updateServerOnline('lite');
                await this.updateServerOnline('crit');
            } else if (this.selectedServer) {
                await this.updateServerOnline(this.selectedServer);
            }
        }, 30000);
    }
    
    async updateServerOnline(serverType) {
        const config = this.SERVER_CONFIG[serverType];
        
        try {
            let onlineData = null;
            
            // Пробуем разные API
            for (const apiUrl of config.apiUrls) {
                try {
                    const url = apiUrl.replace('{ip}', config.ip).replace('{port}', config.port);
                    const response = await fetch(url, { timeout: 5000 });
                    
                    if (response.ok) {
                        const data = await response.json();
                        if (data.online) {
                            onlineData = {
                                online: data.players?.online || 0,
                                max: data.players?.max || config.maxPlayers
                            };
                            break;
                        }
                    }
                } catch (error) {
                    console.log(`❌ API не сработало для ${serverType}`);
                }
            }
            
            // Если API не сработали, используем заглушку
            if (!onlineData) {
                const baseOnline = serverType === 'lite' ? 12 : 8;
                const variation = Math.floor(Math.random() * 8) - 4;
                const online = Math.max(0, Math.min(baseOnline + variation, config.maxPlayers));
                
                onlineData = {
                    online: online,
                    max: config.maxPlayers
                };
            }
            
            // Обновляем данные
            this.serverOnline[serverType] = onlineData;
            
            // Обновляем отображение
            this.updateOnlineDisplay(serverType, onlineData.online, onlineData.max);
            this.updateProgressBars();
            
            // Обновляем шапку если сервер выбран
            if (this.selectedServer === serverType && this.elements.currentOnline) {
                this.elements.currentOnline.textContent = `Онлайн: ${onlineData.online}/${onlineData.max}`;
            }
            
        } catch (error) {
            console.error(`❌ Ошибка обновления онлайна ${serverType}:`, error);
        }
    }
    
    updateOnlineDisplay(serverType, online, max) {
        const element = serverType === 'lite' ? this.elements.liteOnline : this.elements.critOnline;
        if (element) {
            element.textContent = `${online}/${max}`;
            element.style.color = "#fff";
        }
    }
    
    updateProgressBars() {
        // Lite режим
        const litePercent = (this.serverOnline.lite.online / this.serverOnline.lite.max) * 100;
        const liteBar = document.querySelector('.lite-mode .progress-fill');
        if (liteBar) {
            liteBar.style.width = `${litePercent}%`;
            liteBar.style.background = this.getProgressColor(litePercent);
        }
        
        // Crit режим
        const critPercent = (this.serverOnline.crit.online / this.serverOnline.crit.max) * 100;
        const critBar = document.querySelector('.crit-mode .progress-fill');
        if (critBar) {
            critBar.style.width = `${critPercent}%`;
            critBar.style.background = this.getProgressColor(critPercent);
        }
    }
    
    getProgressColor(percent) {
        if (percent >= 80) return 'linear-gradient(135deg, #ef4444 0%, #f97316 100%)';
        if (percent >= 50) return 'linear-gradient(135deg, #f59e0b 0%, #eab308 100%)';
        return 'linear-gradient(135deg, #10b981 0%, #22c55e 100%)';
    }
    
    // Управление серверами
    selectServer(server) {
        this.selectedServer = server;
        const serverName = server === 'lite' ? 'Lite режим' : 'Crit режим';
        const onlineData = this.serverOnline[server];
        
        // Обновляем шапку
        if (this.elements.currentServer) {
            this.elements.currentServer.textContent = serverName;
        }
        if (this.elements.currentOnline) {
            this.elements.currentOnline.textContent = `Онлайн: ${onlineData.online}/${onlineData.max}`;
        }
        
        // Показываем магазин
        this.showShop();
        
        // Сохраняем выбор
        this.saveToLocalStorage();
        
        // Уведомление
        this.showNotification(`Выбран сервер: ${serverName}`, 'success');
        
        // На мобильных скрываем меню выбора
        if (this.isMobile) {
            this.hideServerSelection();
        }
    }
    
    showShop() {
        if (this.elements.serverSelection) {
            this.elements.serverSelection.style.display = 'none';
        }
        if (this.elements.shopSection) {
            this.elements.shopSection.style.display = 'block';
            this.elements.shopSection.classList.add('active');
        }
        
        // Плавный скролл наверх
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
    
    showServerSelection() {
        if (this.elements.shopSection) {
            this.elements.shopSection.style.display = 'none';
            this.elements.shopSection.classList.remove('active');
        }
        if (this.elements.serverSelection) {
            this.elements.serverSelection.style.display = 'flex';
        }
        
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
    
    hideServerSelection() {
        if (this.elements.serverSelection && this.isMobile) {
            setTimeout(() => {
                this.elements.serverSelection.style.display = 'none';
            }, 300);
        }
    }
    
    // Навигация по категориям
    switchCategory(category) {
        // Обновляем активные кнопки
        this.elements.navBtns.forEach(btn => {
            btn.classList.remove('active');
            if (btn.dataset.category === category) {
                btn.classList.add('active');
            }
        });
        
        // Скрываем все категории
        this.elements.categoryContents.forEach(content => {
            content.classList.remove('active');
        });
        
        // Показываем выбранную категорию
        const activeCategory = document.getElementById(category);
        if (activeCategory) {
            activeCategory.classList.add('active');
        }
        
        // На мобильных скроллим к началу категории
        if (this.isMobile && activeCategory) {
            setTimeout(() => {
                activeCategory.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }, 100);
        }
    }
    
    // Корзина
    addToCart(product, price) {
        const item = {
            id: Date.now() + Math.random(),
            product: product,
            price: price,
            server: this.selectedServer,
            timestamp: new Date().toLocaleTimeString()
        };
        
        this.cart.push(item);
        this.updateCart();
        this.showNotification(`${product} добавлен в корзину!`, 'success');
        this.saveToLocalStorage();
        
        // На мобильных показываем корзину
        if (this.isMobile && this.cart.length === 1) {
            setTimeout(() => this.showCart(), 500);
        }
    }
    
    removeFromCart(id) {
        this.cart = this.cart.filter(item => item.id !== id);
        this.updateCart();
        this.saveToLocalStorage();
        this.showNotification('Товар удален из корзины', 'info');
    }
    
    clearCart() {
        if (this.cart.length === 0) {
            this.showNotification('Корзина уже пуста', 'info');
            return;
        }
        
        // На мобильных используем нативное подтверждение
        if (this.isMobile) {
            if (confirm('Очистить корзину?')) {
                this.cart = [];
                this.updateCart();
                this.saveToLocalStorage();
                this.hideCart();
                this.showNotification('Корзина очищена', 'info');
            }
        } else {
            // На десктопе можно использовать красивый диалог
            this.cart = [];
            this.updateCart();
            this.saveToLocalStorage();
            this.hideCart();
            this.showNotification('Корзина очищена', 'info');
        }
    }
    
    updateCart() {
        // Обновляем счетчики
        if (this.elements.cartCount) this.elements.cartCount.textContent = this.cart.length;
        if (this.elements.cartBadge) this.elements.cartBadge.textContent = this.cart.length;
        if (this.elements.itemsCount) this.elements.itemsCount.textContent = `${this.cart.length} товар${this.cart.length === 1 ? '' : 'а'}`;
        if (this.elements.summaryItems) this.elements.summaryItems.textContent = this.cart.length;
        
        // Обновляем цены
        const total = this.cart.reduce((sum, item) => sum + item.price, 0);
        if (this.elements.totalPrice) this.elements.totalPrice.textContent = total;
        if (this.elements.checkoutPrice) this.elements.checkoutPrice.textContent = `${total}⭐`;
        if (this.elements.finalPrice) this.elements.finalPrice.textContent = total;
        
        // Обновляем сервер в корзине
        if (this.elements.cartServerName) {
            this.elements.cartServerName.textContent = this.selectedServer ? 
                (this.selectedServer === 'lite' ? 'Lite режим' : 'Crit режим') : 
                'Не выбран';
        }
        
        // Обновляем список товаров
        if (!this.elements.cartItems) return;
        
        this.elements.cartItems.innerHTML = '';
        
        if (this.cart.length === 0) {
            this.elements.cartItems.innerHTML = `
                <div class="empty-cart">
                    <div class="empty-cart-icon">
                        <i class="fas fa-shopping-basket"></i>
                    </div>
                    <h4>Корзина пуста</h4>
                    <p>Добавьте товары из магазина</p>
                    <button class="btn-browse" id="goToShopBtn">
                        <i class="fas fa-store"></i> Перейти в магазин
                    </button>
                </div>
            `;
            
            // Добавляем обработчик для кнопки
            const goToShopBtn = document.getElementById('goToShopBtn');
            if (goToShopBtn) {
                goToShopBtn.addEventListener('click', () => {
                    this.hideCart();
                    this.showShop();
                });
            }
            
            return;
        }
        
        // Добавляем товары
        this.cart.forEach(item => {
            const itemElement = document.createElement('div');
            itemElement.className = 'cart-item';
            itemElement.innerHTML = `
                <div class="cart-item-info">
                    <div class="cart-item-name">
                        <i class="fas fa-box"></i>
                        <span>${item.product}</span>
                    </div>
                    <div class="cart-item-server">
                        ${item.server === 'lite' ? 'Lite' : 'Crit'} режим
                    </div>
                </div>
                <div class="cart-item-price">
                    <div class="cart-item-amount">
                        <span>${item.price}</span>
                        <i class="fas fa-star"></i>
                    </div>
                    <button class="btn-remove-item" data-id="${item.id}">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            `;
            this.elements.cartItems.appendChild(itemElement);
        });
        
        // Обработчики удаления
        document.querySelectorAll('.btn-remove-item').forEach(button => {
            button.addEventListener('click', (e) => {
                const id = e.target.closest('.btn-remove-item').dataset.id;
                this.removeFromCart(id);
            });
        });
        
        // Обновляем счетчик в мобильном меню
        const mobileCartCount = document.getElementById('mobileCartCount');
        if (mobileCartCount) {
            mobileCartCount.textContent = this.cart.length;
        }
    }
    
    showCart() {
        this.updateCart();
        if (this.elements.cartModal) {
            this.elements.cartModal.classList.add('show');
            document.body.style.overflow = 'hidden';
            
            // На мобильных добавляем класс для анимации
            if (this.isMobile) {
                document.body.classList.add('cart-open');
            }
        }
    }
    
    hideCart() {
        if (this.elements.cartModal) {
            this.elements.cartModal.classList.remove('show');
            document.body.style.overflow = 'auto';
            
            // На мобильных убираем класс
            if (this.isMobile) {
                document.body.classList.remove('cart-open');
            }
        }
    }
    
    checkout() {
        if (this.cart.length === 0) {
            this.showNotification('Корзина пуста!', 'warning');
            return;
        }
        
        if (!this.selectedServer) {
            this.showNotification('Сначала выберите сервер!', 'warning');
            this.showServerSelection();
            this.hideCart();
            return;
        }
        
        this.showPurchaseModal();
    }
    
    // Оформление заказа
    showPurchaseModal() {
        if (this.cart.length === 0 || !this.selectedServer) return;
        
        const total = this.cart.reduce((sum, item) => sum + item.price, 0);
        const products = this.cart.map(item => item.product).join(', ');
        const serverName = this.selectedServer === 'lite' ? 'Lite режим' : 'Crit режим';
        
        // Заполняем поля
        if (this.elements.purchaseServer) this.elements.purchaseServer.textContent = serverName;
        if (this.elements.purchaseProduct) this.elements.purchaseProduct.textContent = products;
        if (this.elements.purchasePrice) this.elements.purchasePrice.textContent = total;
        if (this.elements.instructionPrice) this.elements.instructionPrice.textContent = total;
        
        // Показываем окно
        this.hideCart();
        if (this.elements.purchaseModal) {
            this.elements.purchaseModal.classList.add('show');
            document.body.style.overflow = 'hidden';
            
            // На мобильных добавляем класс
            if (this.isMobile) {
                document.body.classList.add('purchase-open');
            }
        }
    }
    
    hidePurchaseModal() {
        if (this.elements.purchaseModal) {
            this.elements.purchaseModal.classList.remove('show');
            document.body.style.overflow = 'auto';
            
            // На мобильных убираем класс
            if (this.isMobile) {
                document.body.classList.remove('purchase-open');
            }
        }
    }
    
    confirmPurchase() {
        const total = this.cart.reduce((sum, item) => sum + item.price, 0);
        const serverName = this.selectedServer === 'lite' ? 'Lite режим' : 'Crit режим';
        const products = this.cart.map(item => item.product).join(', ');
        
        // Закрываем окно оплаты ПЕРВЫМ делом
        this.hidePurchaseModal();
        
        // Очищаем корзину
        this.cart = [];
        this.updateCart
