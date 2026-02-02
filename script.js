// ============================================
// VolvetMC Shop - Адаптивный магазин доната
// Версия: 2.1 (Исправленная)
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
        
        // Исправляем баги с HTML
        this.fixHTMLBugs();
        
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
            confirmPurchaseBtn: document.getElementById('confirmPurchaseBtn')
        };
    }
    
    fixHTMLBugs() {
        // Исправляем баги в HTML (пробелы между командами в привилегиях)
        this.fixPrivilegesFormatting();
    }
    
    fixPrivilegesFormatting() {
        // Исправляем форматирование команд в привилегиях
        const fixes = {
            // Квантум привилегия
            'Все предыдущие + -heal, -back, -fixall': 'Все предыдущие + <code>-heal</code>, <code>-back</code>, <code>-fixall</code>',
            // Премиум привилегия  
            'Команды: -clear, -feed, -unenchant': 'Команды: <code>-clear</code>, <code>-feed</code>, <code>-unenchant</code>'
        };
        
        // Ищем и исправляем тексты
        document.querySelectorAll('.product-features li').forEach(li => {
            const text = li.innerHTML;
            for (const [wrong, correct] of Object.entries(fixes)) {
                if (text.includes(wrong)) {
                    li.innerHTML = text.replace(wrong, correct);
                }
            }
        });
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
                    this.showNotification('Сначала выберите сервер!');
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
                    this.showNotification('Сначала выберите сервер!');
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
        
        // Инициализируем кнопку "Оплатить заказ"
        this.initCheckoutButton();
    }
    
    initCheckoutButton() {
        // Убедимся что кнопка оформления заказа есть и работает
        const checkoutBtn = document.getElementById('checkoutBtn');
        if (checkoutBtn) {
            console.log("✅ Кнопка 'Оформить заказ' найдена и настроена");
        } else {
            console.warn("⚠️ Кнопка 'Оформить заказ' не найдена!");
            
            // Создаем кнопку если ее нет
            this.createCheckoutButton();
        }
    }
    
    createCheckoutButton() {
        // Создаем кнопку оформления заказа в корзине
        const cartActions = document.querySelector('.cart-actions');
        if (cartActions) {
            const checkoutBtn = document.createElement('button');
            checkoutBtn.id = 'checkoutBtn';
            checkoutBtn.className = 'btn-checkout';
            checkoutBtn.innerHTML = `
                <i class="fas fa-credit-card"></i>
                <span>Оплатить заказ</span>
                <span class="checkout-price" id="checkoutPrice">0⭐</span>
            `;
            
            checkoutBtn.addEventListener('click', () => this.checkout());
            cartActions.appendChild(checkoutBtn);
            
            this.elements.checkoutBtn = checkoutBtn;
            this.elements.checkoutPrice = document.getElementById('checkoutPrice');
            
            console.log("✅ Кнопка 'Оплатить заказ' создана");
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
        const categories = ['privile
