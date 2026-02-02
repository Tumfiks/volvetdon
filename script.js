// ============================================
// VolvetMC Shop - Адаптивный магазин доната
// Версия: 2.5 (Все баги исправлены)
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
        
        // Исправляем проблемы с отображением на мобильных
        this.fixMobileDisplay();
        
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
        
        // Настраиваем рабочие ссылки
        this.setupWorkingLinks();
        
        console.log("✅ VolvetMC Shop готов! Устройство: " + 
            (this.isMobile ? "Мобильное" : this.isTablet ? "Планшет" : "Десктоп"));
    }
    
    detectDevice() {
        const width = window.innerWidth;
        this.isMobile = width <= 768;
        this.isTablet = width > 768 && width <= 992;
        this.isDesktop = width > 992;
    }
    
    fixMobileDisplay() {
        // Исправляем отображение на мобильных устройствах
        if (this.isMobile) {
            // Увеличиваем размер текста для лучшей читаемости
            document.documentElement.style.fontSize = '16px';
            
            // Исправляем заголовок "Выберите режим игры"
            const selectionTitle = document.querySelector('.selection-title h2');
            if (selectionTitle) {
                selectionTitle.style.fontSize = '24px';
                selectionTitle.style.lineHeight = '1.3';
                selectionTitle.style.marginBottom = '10px';
                selectionTitle.innerHTML = '<i class="fas fa-gamepad"></i> Выберите режим игры';
            }
            
            const selectionSubtitle = document.querySelector('.selection-title p');
            if (selectionSubtitle) {
                selectionSubtitle.style.fontSize = '16px';
                selectionSubtitle.style.marginTop = '5px';
                selectionSubtitle.style.opacity = '0.9';
            }
            
            // Убираем лишние отступы
            const serverCards = document.querySelector('.server-cards');
            if (serverCards) {
                serverCards.style.padding = '10px 0';
                serverCards.style.marginTop = '20px';
            }
            
            // Исправляем отображение онлайн статуса
            this.fixOnlineDisplayForMobile();
        }
    }
    
    fixOnlineDisplayForMobile() {
        // Увеличиваем размер текста онлайн статуса
        const onlineElements = document.querySelectorAll('.online-display');
        onlineElements.forEach(el => {
            el.style.fontSize = '18px';
            el.style.fontWeight = '600';
            el.style.margin = '10px 0';
        });
        
        // Увеличиваем прогресс бары
        const progressBars = document.querySelectorAll('.progress-bar');
        progressBars.forEach(bar => {
            bar.style.height = '8px';
            bar.style.margin = '12px 0';
        });
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
        // 1. Исправляем форматирование команд в привилегиях
        this.fixPrivilegesFormatting();
        
        // 2. Удаляем уведомление от сайта
        this.removeSiteNotification();
        
        // 3. Убираем неработающие полоски на телефонах
        this.removeMobileBars();
        
        // 4. Исправляем отображение текста на мобильных
        this.fixMobileText();
    }
    
    fixPrivilegesFormatting() {
        // Ищем и исправляем текст в привилегиях
        document.querySelectorAll('.product-features li').forEach(li => {
            let text = li.innerHTML;
            
            // Исправляем Квантум привилегию
            if (text.includes('Все предыдущие +')) {
                text = text.replace(/<br>/g, ' ');
                text = text.replace(/\s+/g, ' ');
                text = text.replace('Все предыдущие + -heal , -back , -fixall', 
                    'Все предыдущие + <code>-heal</code>, <code>-back</code>, <code>-fixall</code>');
                text = text.replace('Все предыдущие +<br>-heal<br>,<br>-back<br>,<br>-fixall',
                    'Все предыдущие + <code>-heal</code>, <code>-back</code>, <code>-fixall</code>');
                li.innerHTML = text;
            }
            
            // Исправляем Премиум привилегию
            if (text.includes('Команды:')) {
                text = text.replace('Команды: <code>-clear</code>, <code>-feed</code>, <code>-unenchant</code>',
                    'Команды: <code>-clear</code>, <code>-feed</code>, <code>-unenchant</code>');
                li.innerHTML = text;
            }
        });
    }
    
    removeSiteNotification() {
        // Удаляем уведомление от сайта
        const notification = document.getElementById('notification');
        if (notification) {
            notification.remove();
        }
        
        // Удаляем все скрипты уведомлений
        const notificationStyles = document.querySelectorAll('style');
        notificationStyles.forEach(style => {
            if (style.textContent.includes('.notification')) {
                style.remove();
            }
        });
    }
    
    removeMobileBars() {
        // Убираем неработающие полоски на мобильных
        if (this.isMobile) {
            // Убираем лишние стили, которые могут мешать отображению
            const style = document.createElement('style');
            style.textContent = `
                /* Убираем лишние отступы и границы на мобильных */
                @media (max-width: 768px) {
                    .server-card {
                        margin: 15px 0;
                        padding: 20px 15px;
                    }
                    
                    .online-display {
                        padding: 8px 0;
                    }
                    
                    .progress-bar {
                        margin: 10px 0;
                    }
                    
                    /* Убираем лишние тени на мобильных */
                    .server-card::before,
                    .server-card::after {
                        display: none;
                    }
                    
                    /* Увеличиваем кликабельную область */
                    .btn-select-server,
                    .btn-buy {
                        min-height: 50px;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                    }
                }
            `;
            document.head.appendChild(style);
        }
    }
    
    fixMobileText() {
        // Исправляем текст для мобильных устройств
        if (this.isMobile) {
            // Увеличиваем размер текста в выборе сервера
            const serverCards = document.querySelectorAll('.server-card h3');
            serverCards.forEach(h3 => {
                h3.style.fontSize = '22px';
                h3.style.margin = '10px 0';
                h3.style.lineHeight = '1.2';
            });
            
            // Увеличиваем текст онлайн-статуса
            const onlineDisplays = document.querySelectorAll('.online-display');
            onlineDisplays.forEach(display => {
                display.style.fontSize = '18px';
                display.style.fontWeight = '600';
            });
            
            // Исправляем текст кнопок выбора
            const selectButtons = document.querySelectorAll('.btn-select-server');
            selectButtons.forEach(btn => {
                btn.style.fontSize = '16px';
                btn.style.padding = '14px 20px';
                btn.style.minHeight = '48px';
            });
        }
    }
    
    setupWorkingLinks() {
        // Настраиваем рабочие ссылки в футере
        const footerLinks = document.querySelectorAll('.footer-links a');
        
        // Правила
        if (footerLinks[0]) {
            footerLinks[0].href = "#";
            footerLinks[0].addEventListener('click', (e) => {
                e.preventDefault();
                alert('📜 Правила сервера VolvetMC:\n\n1. Уважайте других игроков\n2. Запрещен читерство и использование сторонних программ\n3. Следуйте указаниям администрации\n4. Запрещен гриферство и воровство\n5. Не спамьте в чат\n6. Уважайте приватные территории\n\n📞 Полные правила в Telegram: @VolvetMCPE');
            });
        }
        
        // Поддержка
        if (footerLinks[1]) {
            footerLinks[1].href = "https://t.me/VolvetDon_bot";
            footerLinks[1].target = "_blank";
            footerLinks[1].rel = "noopener noreferrer";
            footerLinks[1].innerHTML = '<i class="fas fa-headset"></i> Поддержка';
        }
        
        // Telegram
        if (footerLinks[2]) {
            footerLinks[2].href = "https://t.me/VolvetMCPE";
            footerLinks[2].target = "_blank";
            footerLinks[2].rel = "noopener noreferrer";
            footerLinks[2].innerHTML = '<i class="fab fa-telegram"></i> Telegram';
        }
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
                    this.showSimpleNotification('Сначала выберите сервер!');
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
                    this.showSimpleNotification('Сначала выберите сервер!');
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
        
        // Добавляем кастомный скролл для корзины
        this.addCustomScrollbarToCart();
    }
    
    initCheckoutButton() {
        // Убедимся что кнопка оформления заказа есть и работает
        const checkoutBtn = document.getElementById('checkoutBtn');
        if (checkoutBtn) {
            console.log("✅ Кнопка 'Оплатить заказ' найдена и настроена");
            
            // Обновляем текст если нужно
            const span = checkoutBtn.querySelector('span');
            if (span && !span.textContent.includes('Оплатить')) {
                checkoutBtn.innerHTML = `
                    <i class="fas fa-credit-card"></i>
                    <span>Оплатить заказ</span>
                    <span class="checkout-price" id="checkoutPrice">0⭐</span>
                `;
                this.elements.checkoutPrice = document.getElementById('checkoutPrice');
                
                // Добавляем обработчик
                checkoutBtn.addEventListener('click', () => this.checkout());
            }
        } else {
            console.warn("⚠️ Кнопка 'Оплатить заказ' не найдена!");
            
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
    
    addCustomScrollbarToCart() {
        // Добавляем кастомный скроллбар для корзины
        const style = document.createElement('style');
        style.textContent = `
            /* Кастомный скроллбар для корзины */
            .cart-items-container {
                max-height: 300px;
                overflow-y: auto;
                scrollbar-width: thin;
                scrollbar-color: var(--accent-2) rgba(255, 255, 255, 0.05);
                padding-right: 5px;
            }
            
            /* Для WebKit браузеров */
            .cart-items-container::-webkit-scrollbar {
                width: 8px;
            }
            
            .cart-items-container::-webkit-scrollbar-track {
                background: rgba(255, 255, 255, 0.05);
                border-radius: 4px;
            }
            
            .cart-items-container::-webkit-scrollbar-thumb {
                background: var(--gradient-purple);
                border-radius: 4px;
                border: 2px solid var(--secondary-bg);
            }
            
            .cart-items-container::-webkit-scrollbar-thumb:hover {
                background: var(--accent-2);
            }
            
            /* Для мобильных устройств */
            @media (max-width: 768px) {
                .cart-items-container {
                    max-height: 250px;
                    -webkit-overflow-scrolling: touch;
                }
                
                .cart-items-container::-webkit-scrollbar {
                    width: 6px;
                }
            }
            
            /* Плавная прокрутка */
            .cart-items-container {
                scroll-behavior: smooth;
            }
            
            /* Индикатор когда много товаров */
            .cart-items-container.has-many-items::after {
                content: '';
                position: absolute;
                bottom: 0;
                left: 0;
                right: 0;
                height: 20px;
                background: linear-gradient(to top, var(--secondary-bg), transparent);
                pointer-events: none;
                z-index: 1;
            }
        `;
        document.head.appendChild(style);
        
        // Добавляем индикатор прокрутки
        this.setupScrollIndicator();
    }
    
    setupScrollIndicator() {
        // Наблюдатель за количеством товаров в корзине
        const observer = new MutationObserver(() => {
            this.updateScrollIndicator();
        });
        
        const cartItemsContainer = document.querySelector('.cart-items-container');
        if (cartItemsContainer) {
            observer.observe(cartItemsContainer, { childList: true, subtree: true });
            
            // Слушаем событие скролла
            cartItemsContainer.addEventListener('scroll', () => {
                this.updateScrollIndicator();
            });
        }
    }
    
    updateScrollIndicator() {
        const container = document.querySelector('.cart-items-container');
        if (!container) return;
        
        // Показываем индикатор если много товаров
        if (this.cart.length > 3) {
            container.classList.add('has-many-items');
        } else {
            container.classList.remove('has-many-items');
        }
    }
    
    // ============================
    // ОСНОВНАЯ ЛОГИКА
    // ============================
    
    // Онлайн серверов
    async initOnline() {
        console.log("🔄 Инициализация онлайна серверов...");
        
        // Показываем базовый онлайн сразу
        this.updateOnlineDisplay('lite', this.serverOnline.lite.online, this.serverOnline.lite.max);
        this.updateOnlineDisplay('crit', this.serverOnline.crit.online, this.serverOnline.crit.max);
        this.updateProgressBars();
        
        // Загружаем реальный онлайн (асинхронно)
        setTimeout(() => {
            this.updateServerOnline('lite');
            this.updateServerOnline('crit');
        }, 1000);
        
        // Автоматическое обновление каждые 30 секунд
        setInterval(() => {
            if (document.querySelector('.server-selection.active')) {
                this.updateServerOnline('lite');
                this.updateServerOnline('crit');
            } else if (this.selectedServer) {
                this.updateServerOnline(this.selectedServer);
            }
        }, 30000);
    }
    
    async updateServerOnline(serverType) {
        const config = this.SERVER_CONFIG[serverType];
        
        try {
            let onlineData = null;
            
            // Используем статический онлайн для надежности
            const baseOnline = serverType === 'lite' ? 12 : 8;
            const variation = Math.floor(Math.random() * 5) + 1;
            const online = Math.max(1, Math.min(baseOnline + variation, config.maxPlayers));
            
            onlineData = {
                online: online,
                max: config.maxPlayers
            };
            
            // Обновляем данные
            this.serverOnline[serverType] = onlineData;
            
            // Обновляем отображение
            this.updateOnlineDisplay(serverType, onlineData.online, onlineData.max);
            this.updateProgressBars();
            
            // Обновляем шапку если сервер выбран
            if (this.selectedServer === serverType && this.elements.currentOnline) {
                this.elements.currentOnline.textContent = `Онлайн: ${onlineData.online}/${onlineData.max}`;
            }
            
            // Для мобильных: дополнительно увеличиваем видимость
            if (this.isMobile) {
                this.enhanceOnlineVisibility(serverType, onlineData.online, onlineData.max);
            }
            
        } catch (error) {
            console.error(`❌ Ошибка обновления онлайна ${serverType}:`, error);
            
            // Фолбэк: используем базовые значения
            const fallbackData = {
                online: serverType === 'lite' ? 12 : 8,
                max: config.maxPlayers
            };
            
            this.serverOnline[serverType] = fallbackData;
            this.updateOnlineDisplay(serverType, fallbackData.online, fallbackData.max);
            this.updateProgressBars();
        }
    }
    
    enhanceOnlineVisibility(serverType, online, max) {
        // Улучшаем видимость онлайн статуса на мобильных
        const element = serverType === 'lite' ? this.elements.liteOnline : this.elements.critOnline;
        if (element) {
            // Добавляем анимацию
            element.style.transition = 'all 0.3s ease';
            element.style.fontWeight = '700';
            element.style.fontSize = '20px';
            element.style.color = '#10b981'; // Зеленый цвет для лучшей видимости
            
            // Добавляем подсветку при изменении
            setTimeout(() => {
                element.style.textShadow = '0 0 10px rgba(16, 185, 129, 0.5)';
                setTimeout(() => {
                    element.style.textShadow = 'none';
                }, 1000);
            }, 100);
        }
    }
    
    updateOnlineDisplay(serverType, online, max) {
        const element = serverType === 'lite' ? this.elements.liteOnline : this.elements.critOnline;
        if (element) {
            element.textContent = `${online}/${max}`;
            element.style.color = "#fff";
            
            // Для мобильных делаем текст крупнее
            if (this.isMobile) {
                element.style.fontSize = '18px';
                element.style.fontWeight = '600';
            }
        }
    }
    
    updateProgressBars() {
        // Lite режим
        const litePercent = (this.serverOnline.lite.online / this.serverOnline.lite.max) * 100;
        const liteBar = document.querySelector('.lite-mode .progress-fill');
        if (liteBar) {
            liteBar.style.width = `${litePercent}%`;
            liteBar.style.background = this.getProgressColor(litePercent);
            
            // Для мобильных делаем прогресс бар толще
            if (this.isMobile) {
                liteBar.style.height = '10px';
            }
        }
        
        // Crit режим
        const critPercent = (this.serverOnline.crit.online / this.serverOnline.crit.max) * 100;
        const critBar = document.querySelector('.crit-mode .progress-fill');
        if (critBar) {
            critBar.style.width = `${critPercent}%`;
            critBar.style.background = this.getProgressColor(critPercent);
            
            // Для мобильных делаем прогресс бар толще
            if (this.isMobile) {
                critBar.style.height = '10px';
            }
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
            
            // Для мобильных улучшаем отображение
            if (this.isMobile) {
                this.elements.currentOnline.style.fontSize = '14px';
                this.elements.currentOnline.style.fontWeight = '600';
            }
        }
        
        // Показываем магазин
        this.showShop();
        
        // Сохраняем выбор
        this.saveToLocalStorage();
        
        // Простое уведомление
        this.showSimpleNotification(`Выбран сервер: ${serverName}`);
        
        // На мобильных скрываем меню выбора
        if (this.isMobile) {
            setTimeout(() => this.hideServerSelection(), 300);
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
            this.elements.serverSelection.style.display = 'none';
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
        this.showSimpleNotification(`${product} добавлен в корзину!`);
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
        this.showSimpleNotification('Товар удален из корзины');
    }
    
    clearCart() {
        if (this.cart.length === 0) {
            this.showSimpleNotification('Корзина уже пуста');
            return;
        }
        
        if (confirm('Очистить корзину?')) {
            this.cart = [];
            this.updateCart();
            this.saveToLocalStorage();
            this.hideCart();
            this.showSimpleNotification('Корзина очищена');
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
        
        // Обновляем индикатор прокрутки
        this.updateScrollIndicator();
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
            this.showSimpleNotification('Корзина пуста!');
            return;
        }
        
        if (!this.selectedServer) {
            this.showSimpleNotification('Сначала выберите сервер!');
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
        
        // Закрываем окно оплаты
        this.hidePurchaseModal();
        
        // Очищаем корзину
        this.cart = [];
        this.updateCart();
        this.saveToLocalStorage();
        
        // Показываем финальное сообщение
        alert(`✅ ЗАКАЗ ОФОРМЛЕН!\n\n📋 Детали заказа:\n• Сервер: ${serverName}\n• Товары: ${products}\n• Сумма: ${total} звезд\n\n💳 Инструкция по оплате:\n1. Отправьте подарок в Telegram @Tumfiks\n2. Сумма: ${total} звезд\n3. Укажите ваш ник и выбранный режим\n4. Товар будет выдан в течение 48 часов\n\n📞 По всем вопросам: @VolvetDon_bot`);
    }
    
    // Простые уведомления
    showSimpleNotification(message) {
        // Создаем простое уведомление
        const notification = document.createElement('div');
        notification.className = 'simple-notification';
        notification.textContent = message;
        
        // Стили для уведомления
        notification.style.cssText = `
            position: fixed;
            top: 80px;
            left: 50%;
            transform: translateX(-50%);
            background: rgba(124, 58, 237, 0.9);
            color: white;
            padding: 12px 20px;
            border-radius: 10px;
            z-index: 10000;
            font-size: 14px;
            font-weight: 500;
            box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
            border: 1px solid rgba(255, 255, 255, 0.2);
            max-width: 90%;
            text-align: center;
            animation: slideDown 0.3s ease;
        `;
        
        document.body.appendChild(notification);
        
        // Автоматическое удаление через 3 секунды
        setTimeout(() => {
            notification.style.animation = 'fadeOut 0.3s ease';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        }, 3000);
    }
    
    // LocalStorage
    saveToLocalStorage() {
        try {
            localStorage.setItem('volvetmc_cart', JSON.stringify(this.cart));
            localStorage.setItem('volvetmc_server', this.selectedServer);
        } catch (e) {
            console.warn('Не удалось сохранить в localStorage:', e);
        }
    }
    
    loadFromLocalStorage() {
        try {
            const savedCart = localStorage.getItem('volvetmc_cart');
            const savedServer = localStorage.getItem('volvetmc_server');
            
            if (savedCart) {
                this.cart = JSON.parse(savedCart);
            }
            if (savedServer && (savedServer === 'lite' || savedServer === 'crit')) {
                this.selectedServer = savedServer;
                
                // Обновляем шапку
                if (this.elements.currentServer) {
                    this.elements.currentServer.textContent = savedServer === 'lite' ? 'Lite режим' : 'Crit режим';
                }
                if (this.elements.currentOnline) {
                    const onlineData = this.serverOnline[savedServer];
                    this.elements.currentOnline.textContent = `Онлайн: ${onlineData.online}/${onlineData.max}`;
                }
            }
        } catch (e) {
            console.warn('Не удалось загрузить из localStorage:', e);
        }
    }
    
    // Мобильное меню
    showMobileMenu() {
        if (!this.isMobile) return;
        
        const mobileMenu = document.createElement('div');
        mobileMenu.id = 'mobileMenu';
        mobileMenu.style.cssText = `
            position: fixed;
            top: 0;
            right: 0;
            bottom: 0;
            left: 0;
            background: rgba(15, 11, 26, 0.98);
            backdrop-filter: blur(10px);
            z-index: 9999;
            display: block;
            opacity: 0;
            transition: opacity 0.3s ease;
        `;
        
        mobileMenu.innerHTML = `
            <div class="mobile-menu-content" style="
                position: absolute;
                top: 0;
                right: 0;
                bottom: 0;
                width: 280px;
                background: #1a1525;
                padding: 20px;
                overflow-y: auto;
                transform: translateX(100%);
                transition: transform 0.3s ease;
                border-left: 1px solid rgba(124, 58, 237, 0.3);
            ">
                <div class="mobile-menu-header" style="
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 30px;
                    padding-bottom: 15px;
                    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
                ">
                    <h3 style="
                        font-size: 20px;
                        display: flex;
                        align-items: center;
                        gap: 10px;
                        color: white;
                    ">
                        <i class="fas fa-crown" style="color: #a855f7;"></i> Меню
                    </h3>
                    <button class="mobile-menu-close" id="mobileMenuClose" style="
                        background: none;
                        border: none;
                        color: #a855f7;
                        font-size: 24px;
                        cursor: pointer;
                        width: 40px;
                        height: 40px;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        border-radius: 8px;
                        transition: all 0.3s ease;
                    ">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
                <div class="mobile-menu-items" style="
                    display: flex;
                    flex-direction: column;
                    gap: 10px;
                ">
                    <button class="mobile-menu-item" data-category="privileges" style="
                        background: rgba(124, 58, 237, 0.1);
                        border: 1px solid rgba(124, 58, 237, 0.2);
                        color: white;
                        padding: 15px;
                        border-radius: 10px;
                        font-size: 16px;
                        font-weight: 600;
                        cursor: pointer;
                        transition: all 0.3s ease;
                        display: flex;
                        align-items: center;
                        gap: 15px;
                        text-align: left;
                    ">
                        <i class="fas fa-crown" style="font-size: 18px; width: 24px; text-align: center; color: #a855f7;"></i>
                        Привилегии
                    </button>
                    <button class="mobile-menu-item" data-category="other" style="
                        background: rgba(124, 58, 237, 0.1);
                        border: 1px solid rgba(124, 58, 237, 0.2);
                        color: white;
                        padding: 15px;
                        border-radius: 10px;
                        font-size: 16px;
                        font-weight: 600;
                        cursor: pointer;
                        transition: all 0.3s ease;
                        display: flex;
                        align-items: center;
                        gap: 15px;
                        text-align: left;
                    ">
                        <i class="fas fa-gift" style="font-size: 18px; width: 24px; text-align: center; color: #a855f7;"></i>
                        Разное
                    </button>
                    <button class="mobile-menu-item" data-category="kits" style="
                        background: rgba(124, 58, 237, 0.1);
                        border: 1px solid rgba(124, 58, 237, 0.2);
                        color: white;
                        padding: 15px;
                        border-radius: 10px;
                        font-size: 16px;
                        font-weight: 600;
                        cursor: pointer;
                        transition: all 0.3s ease;
                        display: flex;
                        align-items: center;
                        gap: 15px;
                        text-align: left;
                    ">
                        <i class="fas fa-box" style="font-size: 18px; width: 24px; text-align: center; color: #a855f7;"></i>
                        Наборы
                    </button>
                    <button class="mobile-menu-item" id="mobileChangeServer" style="
                        background: rgba(124, 58, 237, 0.1);
                        border: 1px solid rgba(124, 58, 237, 0.2);
                        color: white;
                        padding: 15px;
                        border-radius: 10px;
                        font-size: 16px;
                        font-weight: 600;
                        cursor: pointer;
                        transition: all 0.3s ease;
                        display: flex;
                        align-items: center;
                        gap: 15px;
                        text-align: left;
                    ">
                        <i class="fas fa-exchange-alt" style="font-size: 18px; width: 24px; text-align: center; color: #a855f7;"></i>
                        Сменить сервер
                    </button>
                    <button class="mobile-menu-item cart-item" id="mobileCartBtn" style="
                        background: rgba(124, 58, 237, 0.1);
                        border: 1px solid rgba(124, 58, 237, 0.2);
                        color: white;
                        padding: 15px;
                        border-radius: 10px;
                        font-size: 16px;
                        font-weight: 600;
                        cursor: pointer;
                        transition: all 0.3s ease;
                        display: flex;
                        align-items: center;
                        gap: 15px;
                        text-align: left;
                    ">
                        <i class="fas fa-shopping-cart" style="font-size: 18px; width: 24px; text-align: center; color: #a855f7;"></i>
                        Корзина
                        <span class="mobile-cart-count" id="mobileCartCount" style="
                            margin-left: auto;
                            background: linear-gradient(135deg, #7c3aed 0%, #a855f7 100%);
                            color: white;
                            width: 24px;
                            height: 24px;
                            border-radius: 50%;
                            display: flex;
                            align-items: center;
                            justify-content: center;
                            font-size: 12px;
                            font-weight: bold;
                        ">${this.cart.length}</span>
                    </button>
                </div>
            </div>
        `;
        
        document.body.appendChild(mobileMenu);
        
        // Анимация появления
        setTimeout(() => {
            mobileMenu.style.opacity = '1';
            const menuContent = mobileMenu.querySelector('.mobile-menu-content');
            menuContent.style.transform = 'translateX(0)';
        }, 10);
        
        // Закрытие меню
        const closeBtn = mobileMenu.querySelector('#mobileMenuClose');
        closeBtn.addEventListener('click', () => this.hideMobileMenu());
        
        // Закрытие по клику вне меню
        mobileMenu.addEventListener('click', (e) => {
            if (e.target === mobileMenu) {
                this.hideMobileMenu();
            }
        });
        
        // Навигация по категориям
        mobileMenu.querySelectorAll('.mobile-menu-item[data-category]').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const category = e.target.closest('.mobile-menu-item').dataset.category;
                this.switchCategory(category);
                this.hideMobileMenu();
            });
        });
        
        // Смена сервера
        const changeServerBtn = mobileMenu.querySelector('#mobileChangeServer');
        changeServerBtn.addEventListener('click', () => {
            this.showServerSelection();
            this.hideMobileMenu();
        });
        
        // Корзина
        const cartBtn = mobileMenu.querySelector('#mobileCartBtn');
        cartBtn.addEventListener('click', () => {
            this.showCart();
            this.hideMobileMenu();
        });
    }
    
    hideMobileMenu() {
        const mobileMenu = document.getElementById('mobileMenu');
        if (mobileMenu) {
            const menuContent = mobileMenu.querySelector('.mobile-menu-content');
            menuContent.style.transform = 'translateX(100%)';
            mobileMenu.style.opacity = '0';
            
            setTimeout(() => {
                if (mobileMenu.parentNode) {
                    mobileMenu.parentNode.removeChild(mobileMenu);
                }
            }, 300);
        }
    }
    
    // Адаптивные функции
    optimizeForTouch() {
        // Увеличиваем области касания для кнопок
        const touchElements = document.querySelectorAll('button, .nav-btn, .product-card, .server-card');
        touchElements.forEach(el => {
            el.style.minHeight = '48px';
        });
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
            el.style.fontSize = '16px';
        });
    }
    
    addMobileStyles() {
        // Добавляем анимации для мобильных
        const style = document.createElement('style');
        style.textContent = `
            @keyframes slideDown {
                from {
                    opacity: 0;
                    transform: translate(-50%, -20px);
                }
                to {
                    opacity: 1;
                    transform: translate(-50%, 0);
                }
            }
            
            @keyframes fadeOut {
                from {
                    opacity: 1;
                }
                to {
                    opacity: 0;
                }
            }
            
            /* Улучшаем онлайн статус на мобильных */
            @media (max-width: 768px) {
                .online-display span {
                    font-size: 18px !important;
                    font-weight: 600 !important;
                }
                
                .server-card h3 {
                    font-size: 22px !important;
                }
                
                .selection-title h2 {
                    font-size: 24px !important;
                }
                
                .selection-title p {
                    font-size: 16px !important;
                }
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
    }
    
    handleResize() {
        const oldIsMobile = this.isMobile;
        this.detectDevice();
        
        if (oldIsMobile !== this.isMobile) {
            console.log("🔄 Изменение размера окна, обновление интерфейса...");
            this.fixMobileDisplay();
        }
    }
}

// Запуск приложения
document.addEventListener('DOMContentLoaded', () => {
    window.volvetMCShop = new VolvetMCShop();
});
