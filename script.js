// ============================================
// VolvetMC Shop - Простая рабочая версия
// ============================================

document.addEventListener('DOMContentLoaded', function() {
    console.log("🚀 VolvetMC Shop загружается...");
    
    // Основные переменные
    let cart = [];
    let selectedServer = null;
    let serverOnline = {
        lite: { online: 12, max: 25 },
        crit: { online: 8, max: 20 }
    };
    
    // ============================
    // ИСПРАВЛЕНИЕ БАГОВ ПРИ ЗАГРУЗКЕ
    // ============================
    
    // 1. Исправляем текст в привилегиях
    function fixPrivilegesText() {
        // Исправляем Квантум привилегию
        const quantumCard = document.querySelector('.product-card:nth-child(4)');
        if (quantumCard) {
            const features = quantumCard.querySelectorAll('.product-features li');
            features.forEach(li => {
                if (li.textContent.includes('Все предыдущие')) {
                    li.innerHTML = 'Все предыдущие + <code>-heal</code>, <code>-back</code>, <code>-fixall</code>';
                }
            });
        }
        
        // Исправляем Премиум привилегию
        const premiumCard = document.querySelector('.product-card.popular');
        if (premiumCard) {
            const features = premiumCard.querySelectorAll('.product-features li');
            features.forEach(li => {
                if (li.textContent.includes('Команды:')) {
                    li.innerHTML = 'Команды: <code>-clear</code>, <code>-feed</code>, <code>-unenchant</code>';
                }
            });
        }
    }
    
    // 2. Удаляем старое уведомление
    function removeOldNotification() {
        const notification = document.getElementById('notification');
        if (notification) {
            notification.remove();
        }
    }
    
    // 3. Исправляем отображение на мобильных
    function fixMobileDisplay() {
        if (window.innerWidth <= 768) {
            // Увеличиваем текст онлайн статуса
            document.querySelectorAll('.online-display span').forEach(span => {
                span.style.fontSize = '18px';
                span.style.fontWeight = '600';
                span.style.color = '#fff';
            });
            
            // Увеличиваем заголовок выбора сервера
            const selectionTitle = document.querySelector('.selection-title h2');
            if (selectionTitle) {
                selectionTitle.style.fontSize = '24px';
            }
            
            const selectionSubtitle = document.querySelector('.selection-title p');
            if (selectionSubtitle) {
                selectionSubtitle.style.fontSize = '16px';
            }
        }
    }
    
    // 4. Настраиваем рабочие ссылки
    function setupLinks() {
        // Поддержка - Telegram бот
        const supportLink = document.querySelector('.footer-links a:nth-child(2)');
        if (supportLink) {
            supportLink.href = "https://t.me/VolvetDon_bot";
            supportLink.target = "_blank";
        }
        
        // Telegram канал
        const telegramLink = document.querySelector('.footer-links a:nth-child(3)');
        if (telegramLink) {
            telegramLink.href = "https://t.me/VolvetMCPE";
            telegramLink.target = "_blank";
        }
        
        // Правила - показывает alert
        const rulesLink = document.querySelector('.footer-links a:nth-child(1)');
        if (rulesLink) {
            rulesLink.addEventListener('click', function(e) {
                e.preventDefault();
                alert('📜 Правила сервера:\n\n1. Уважайте других игроков\n2. Не используйте читы\n3. Слушайтесь администрацию\n4. Не гриферьте\n\n📞 Подробнее в Telegram: @VolvetMCPE');
            });
        }
    }
    
    // 5. Создаем кнопку оплаты если ее нет
    function ensureCheckoutButton() {
        let checkoutBtn = document.getElementById('checkoutBtn');
        if (!checkoutBtn) {
            const cartActions = document.querySelector('.cart-actions');
            if (cartActions) {
                checkoutBtn = document.createElement('button');
                checkoutBtn.id = 'checkoutBtn';
                checkoutBtn.className = 'btn-checkout';
                checkoutBtn.innerHTML = `
                    <i class="fas fa-credit-card"></i>
                    <span>Оплатить заказ</span>
                    <span class="checkout-price" id="checkoutPrice">0⭐</span>
                `;
                cartActions.appendChild(checkoutBtn);
            }
        }
    }
    
    // 6. Добавляем кастомный скролл
    function addCustomScrollbar() {
        const style = document.createElement('style');
        style.textContent = `
            .cart-items-container {
                max-height: 300px;
                overflow-y: auto;
                padding-right: 5px;
            }
            
            .cart-items-container::-webkit-scrollbar {
                width: 8px;
            }
            
            .cart-items-container::-webkit-scrollbar-track {
                background: rgba(255, 255, 255, 0.05);
                border-radius: 4px;
            }
            
            .cart-items-container::-webkit-scrollbar-thumb {
                background: linear-gradient(135deg, #7c3aed 0%, #a855f7 100%);
                border-radius: 4px;
            }
            
            @media (max-width: 768px) {
                .cart-items-container {
                    max-height: 250px;
                }
            }
        `;
        document.head.appendChild(style);
    }
    
    // ============================
    // ОСНОВНОЙ КОД
    // ============================
    
    // Инициализация онлайн
    function initOnline() {
        // Показываем онлайн сразу
        updateOnlineDisplay('lite', serverOnline.lite.online, serverOnline.lite.max);
        updateOnlineDisplay('crit', serverOnline.crit.online, serverOnline.crit.max);
        updateProgressBars();
        
        // Обновляем каждые 30 секунд
        setInterval(() => {
            updateServerOnline('lite');
            updateServerOnline('crit');
        }, 30000);
    }
    
    function updateServerOnline(serverType) {
        const baseOnline = serverType === 'lite' ? 12 : 8;
        const variation = Math.floor(Math.random() * 5);
        const online = Math.max(1, Math.min(baseOnline + variation, 
            serverType === 'lite' ? 25 : 20));
        
        serverOnline[serverType] = {
            online: online,
            max: serverType === 'lite' ? 25 : 20
        };
        
        updateOnlineDisplay(serverType, online, serverOnline[serverType].max);
        updateProgressBars();
        
        if (selectedServer === serverType) {
            updateHeaderOnline();
        }
    }
    
    function updateOnlineDisplay(serverType, online, max) {
        const element = serverType === 'lite' ? 
            document.getElementById('liteOnline') : 
            document.getElementById('critOnline');
        if (element) {
            element.textContent = `${online}/${max}`;
            element.style.color = "#fff";
            element.style.fontWeight = "600";
        }
    }
    
    function updateProgressBars() {
        // Lite режим
        const litePercent = (serverOnline.lite.online / serverOnline.lite.max) * 100;
        const liteBar = document.querySelector('.lite-mode .progress-fill');
        if (liteBar) {
            liteBar.style.width = `${litePercent}%`;
        }
        
        // Crit режим
        const critPercent = (serverOnline.crit.online / serverOnline.crit.max) * 100;
        const critBar = document.querySelector('.crit-mode .progress-fill');
        if (critBar) {
            critBar.style.width = `${critPercent}%`;
        }
    }
    
    function updateHeaderOnline() {
        const currentOnline = document.getElementById('currentOnline');
        if (currentOnline && selectedServer) {
            const onlineData = serverOnline[selectedServer];
            currentOnline.textContent = `Онлайн: ${onlineData.online}/${onlineData.max}`;
        }
    }
    
    // Выбор сервера
    function setupServerSelection() {
        document.querySelectorAll('.btn-select-server').forEach(button => {
            button.addEventListener('click', function() {
                const server = this.getAttribute('data-server');
                selectServer(server);
            });
        });
        
        const changeServerBtn = document.getElementById('changeServerBtn');
        if (changeServerBtn) {
            changeServerBtn.addEventListener('click', showServerSelection);
        }
    }
    
    function selectServer(server) {
        selectedServer = server;
        const serverName = server === 'lite' ? 'Lite режим' : 'Crit режим';
        const onlineData = serverOnline[server];
        
        // Обновляем шапку
        const currentServer = document.getElementById('currentServer');
        const currentOnline = document.getElementById('currentOnline');
        
        if (currentServer) currentServer.textContent = serverName;
        if (currentOnline) currentOnline.textContent = `Онлайн: ${onlineData.online}/${onlineData.max}`;
        
        // Показываем магазин
        showShop();
        
        // Сохраняем
        saveToLocalStorage();
        
        // Простое уведомление
        showNotification(`Выбран сервер: ${serverName}`);
    }
    
    function showShop() {
        const serverSelection = document.getElementById('serverSelection');
        const shopSection = document.getElementById('shopSection');
        
        if (serverSelection) serverSelection.style.display = 'none';
        if (shopSection) {
            shopSection.style.display = 'block';
            shopSection.classList.add('active');
        }
    }
    
    function showServerSelection() {
        const serverSelection = document.getElementById('serverSelection');
        const shopSection = document.getElementById('shopSection');
        
        if (shopSection) {
            shopSection.style.display = 'none';
            shopSection.classList.remove('active');
        }
        if (serverSelection) {
            serverSelection.style.display = 'flex';
        }
    }
    
    // Навигация по магазину
    function setupCategoryNavigation() {
        document.querySelectorAll('.nav-btn').forEach(button => {
            button.addEventListener('click', function() {
                const category = this.getAttribute('data-category');
                switchCategory(category);
            });
        });
    }
    
    function switchCategory(category) {
        // Кнопки
        document.querySelectorAll('.nav-btn').forEach(btn => {
            btn.classList.remove('active');
            if (btn.getAttribute('data-category') === category) {
                btn.classList.add('active');
            }
        });
        
        // Контент
        document.querySelectorAll('.category-content').forEach(content => {
            content.classList.remove('active');
        });
        
        const activeCategory = document.getElementById(category);
        if (activeCategory) {
            activeCategory.classList.add('active');
        }
    }
    
    // Корзина
    function setupBuyButtons() {
        document.querySelectorAll('.btn-buy').forEach(button => {
            button.addEventListener('click', function() {
                if (!selectedServer) {
                    showNotification('Сначала выберите сервер!');
                    showServerSelection();
                    return;
                }
                
                const product = this.getAttribute('data-product');
                const price = parseInt(this.getAttribute('data-price'));
                addToCart(product, price);
            });
        });
    }
    
    function addToCart(product, price) {
        const item = {
            id: Date.now(),
            product: product,
            price: price,
            server: selectedServer
        };
        
        cart.push(item);
        updateCart();
        showNotification(`${product} добавлен в корзину!`);
        saveToLocalStorage();
    }
    
    function removeFromCart(id) {
        cart = cart.filter(item => item.id !== id);
        updateCart();
        saveToLocalStorage();
        showNotification('Товар удален из корзины');
    }
    
    function updateCart() {
        // Счетчики
        const cartCount = document.getElementById('cartCount');
        const cartBadge = document.getElementById('cartBadge');
        const itemsCount = document.getElementById('itemsCount');
        const summaryItems = document.getElementById('summaryItems');
        const totalPrice = document.getElementById('totalPrice');
        const checkoutPrice = document.getElementById('checkoutPrice');
        const finalPrice = document.getElementById('finalPrice');
        const cartServerName = document.getElementById('cartServerName');
        
        if (cartCount) cartCount.textContent = cart.length;
        if (cartBadge) cartBadge.textContent = cart.length;
        if (itemsCount) itemsCount.textContent = `${cart.length} товар${cart.length === 1 ? '' : 'а'}`;
        if (summaryItems) summaryItems.textContent = cart.length;
        
        const total = cart.reduce((sum, item) => sum + item.price, 0);
        if (totalPrice) totalPrice.textContent = total;
        if (checkoutPrice) checkoutPrice.textContent = `${total}⭐`;
        if (finalPrice) finalPrice.textContent = total;
        
        if (cartServerName) {
            cartServerName.textContent = selectedServer ? 
                (selectedServer === 'lite' ? 'Lite режим' : 'Crit режим') : 
                'Не выбран';
        }
        
        // Список товаров
        const cartItems = document.getElementById('cartItems');
        if (!cartItems) return;
        
        cartItems.innerHTML = '';
        
        if (cart.length === 0) {
            cartItems.innerHTML = `
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
            
            document.getElementById('goToShopBtn').addEventListener('click', function() {
                hideCart();
                showShop();
            });
            
            return;
        }
        
        cart.forEach(item => {
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
            cartItems.appendChild(itemElement);
        });
        
        document.querySelectorAll('.btn-remove-item').forEach(button => {
            button.addEventListener('click', function() {
                const id = parseInt(this.getAttribute('data-id'));
                removeFromCart(id);
            });
        });
    }
    
    function setupCartFunctionality() {
        const cartIcon = document.getElementById('cartIcon');
        if (cartIcon) {
            cartIcon.addEventListener('click', showCart);
        }
        
        const closeCartBtn = document.getElementById('closeCartBtn');
        if (closeCartBtn) {
            closeCartBtn.addEventListener('click', hideCart);
        }
        
        const clearCartBtn = document.getElementById('clearCartBtn');
        if (clearCartBtn) {
            clearCartBtn.addEventListener('click', function() {
                if (cart.length === 0) {
                    showNotification('Корзина уже пуста');
                    return;
                }
                
                if (confirm('Очистить корзину?')) {
                    cart = [];
                    updateCart();
                    saveToLocalStorage();
                    hideCart();
                    showNotification('Корзина очищена');
                }
            });
        }
        
        const checkoutBtn = document.getElementById('checkoutBtn');
        if (checkoutBtn) {
            checkoutBtn.addEventListener('click', function() {
                if (cart.length === 0) {
                    showNotification('Корзина пуста!');
                    return;
                }
                
                if (!selectedServer) {
                    showNotification('Сначала выберите сервер!');
                    showServerSelection();
                    hideCart();
                    return;
                }
                
                showCheckout();
            });
        }
        
        document.addEventListener('click', function(event) {
            const cartModal = document.getElementById('cartModal');
            if (cartModal && event.target === cartModal) {
                hideCart();
            }
        });
    }
    
    function showCart() {
        updateCart();
        const cartModal = document.getElementById('cartModal');
        if (cartModal) {
            cartModal.classList.add('show');
            document.body.style.overflow = 'hidden';
        }
    }
    
    function hideCart() {
        const cartModal = document.getElementById('cartModal');
        if (cartModal) {
            cartModal.classList.remove('show');
            document.body.style.overflow = 'auto';
        }
    }
    
    // Оформление заказа
    function setupCheckoutFunctionality() {
        const closePurchaseBtn = document.getElementById('closePurchaseBtn');
        if (closePurchaseBtn) {
            closePurchaseBtn.addEventListener('click', hideCheckout);
        }
        
        const cancelPurchaseBtn = document.getElementById('cancelPurchaseBtn');
        if (cancelPurchaseBtn) {
            cancelPurchaseBtn.addEventListener('click', hideCheckout);
        }
        
        const confirmPurchaseBtn = document.getElementById('confirmPurchaseBtn');
        if (confirmPurchaseBtn) {
            confirmPurchaseBtn.addEventListener('click', confirmPurchase);
        }
        
        document.addEventListener('click', function(event) {
            const purchaseModal = document.getElementById('purchaseModal');
            if (purchaseModal && event.target === purchaseModal) {
                hideCheckout();
            }
        });
    }
    
    function showCheckout() {
        if (cart.length === 0 || !selectedServer) return;
        
        const total = cart.reduce((sum, item) => sum + item.price, 0);
        const products = cart.map(item => item.product).join(', ');
        const serverName = selectedServer === 'lite' ? 'Lite режим' : 'Crit режим';
        
        const purchaseServer = document.getElementById('purchaseServer');
        const purchaseProduct = document.getElementById('purchaseProduct');
        const purchasePrice = document.getElementById('purchasePrice');
        const instructionPrice = document.getElementById('instructionPrice');
        
        if (purchaseServer) purchaseServer.textContent = serverName;
        if (purchaseProduct) purchaseProduct.textContent = products;
        if (purchasePrice) purchasePrice.textContent = total;
        if (instructionPrice) instructionPrice.textContent = total;
        
        hideCart();
        const purchaseModal = document.getElementById('purchaseModal');
        if (purchaseModal) {
            purchaseModal.classList.add('show');
            document.body.style.overflow = 'hidden';
        }
    }
    
    function hideCheckout() {
        const purchaseModal = document.getElementById('purchaseModal');
        if (purchaseModal) {
            purchaseModal.classList.remove('show');
            document.body.style.overflow = 'auto';
        }
    }
    
    function confirmPurchase() {
        const total = cart.reduce((sum, item) => sum + item.price, 0);
        const serverName = selectedServer === 'lite' ? 'Lite режим' : 'Crit режим';
        const products = cart.map(item => item.product).join(', ');
        
        // Закрываем окно
        hideCheckout();
        
        // Очищаем корзину
        cart = [];
        updateCart();
        saveToLocalStorage();
        
        // Показываем инструкцию
        alert(`✅ ЗАКАЗ ОФОРМЛЕН!\n\n📋 Детали заказа:\n• Сервер: ${serverName}\n• Товары: ${products}\n• Сумма: ${total} звезд\n\n💳 Инструкция по оплате:\n1. Отправьте подарок в Telegram @Tumfiks\n2. Сумма: ${total} звезд\n3. Укажите ваш ник и режим\n4. Товар будет выдан в течение 48 часов\n\n📞 Поддержка: @VolvetDon_bot`);
    }
    
    // Простые уведомления
    function showNotification(message) {
        // Удаляем старое уведомление если есть
        const oldNotification = document.querySelector('.simple-notification');
        if (oldNotification) {
            oldNotification.remove();
        }
        
        // Создаем новое
        const notification = document.createElement('div');
        notification.className = 'simple-notification';
        notification.textContent = message;
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
        
        // Удаляем через 3 секунды
        setTimeout(() => {
            notification.style.animation = 'fadeOut 0.3s ease';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        }, 3000);
    }
    
    // Добавляем стили для анимаций
    function addNotificationStyles() {
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
            
            /* Гарантируем отображение онлайн статуса на мобильных */
            @media (max-width: 768px) {
                #liteOnline, #critOnline {
                    font-size: 18px !important;
                    font-weight: 600 !important;
                    color: #fff !important;
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
    
    // LocalStorage
    function saveToLocalStorage() {
        try {
            localStorage.setItem('volvetmc_cart', JSON.stringify(cart));
            localStorage.setItem('volvetmc_server', selectedServer);
        } catch (e) {
            console.warn('Не удалось сохранить:', e);
        }
    }
    
    function loadFromLocalStorage() {
        try {
            const savedCart = localStorage.getItem('volvetmc_cart');
            const savedServer = localStorage.getItem('volvetmc_server');
            
            if (savedCart) {
                cart = JSON.parse(savedCart);
            }
            if (savedServer && (savedServer === 'lite' || savedServer === 'crit')) {
                selectedServer = savedServer;
                
                const currentServer = document.getElementById('currentServer');
                const currentOnline = document.getElementById('currentOnline');
                const onlineData = serverOnline[savedServer];
                
                if (currentServer) currentServer.textContent = savedServer === 'lite' ? 'Lite режим' : 'Crit режим';
                if (currentOnline) currentOnline.textContent = `Онлайн: ${onlineData.online}/${onlineData.max}`;
            }
        } catch (e) {
            console.warn('Не удалось загрузить:', e);
        }
    }
    
    // ============================
    // ЗАПУСК
    // ============================
    
    // Исправляем баги сразу
    fixPrivilegesText();
    removeOldNotification();
    fixMobileDisplay();
    setupLinks();
    ensureCheckoutButton();
    addCustomScrollbar();
    addNotificationStyles();
    
    // Загружаем сохраненное
    loadFromLocalStorage();
    
    // Настраиваем обработчики
    setupServerSelection();
    setupCategoryNavigation();
    setupBuyButtons();
    setupCartFunctionality();
    setupCheckoutFunctionality();
    
    // Инициализируем онлайн
    initOnline();
    
    // Обновляем корзину
    updateCart();
    
    console.log("✅ VolvetMC Shop готов!");
});
