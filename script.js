// Основные переменные
let cart = [];
let selectedServer = null;
let serverOnline = {
    lite: { online: 0, max: 500 },
    crit: { online: 0, max: 300 }
};

// === НАСТОЯЩИЙ ОНЛАЙН ЧЕРЕЗ PHP ===

// Функция для получения онлайна через PHP
async function getServerOnline(server) {
    try {
        const response = await fetch(`get-online.php?server=${server}&_=${Date.now()}`, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Cache-Control': 'no-cache'
            },
            cache: 'no-cache'
        });
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        
        if (data.success === false) {
            console.warn(`Ошибка получения онлайна для ${server}:`, data.error);
            return { online: 0, max: server === 'lite' ? 500 : 300, status: 'error' };
        }
        
        return {
            online: data.online || 0,
            max: data.max || (server === 'lite' ? 500 : 300),
            status: data.status || 'offline',
            name: data.name || (server === 'lite' ? 'Lite режим' : 'Crit режим')
        };
        
    } catch (error) {
        console.error(`Ошибка при запросе онлайна для ${server}:`, error);
        
        // Возвращаем заглушку при ошибке
        return {
            online: 0,
            max: server === 'lite' ? 500 : 300,
            status: 'error',
            name: server === 'lite' ? 'Lite режим' : 'Crit режим'
        };
    }
}

// === ОСНОВНОЙ КОД ===
document.addEventListener('DOMContentLoaded', function() {
    console.log("🚀 VolvetMC Shop загружается...");
    initApp();
});

function initApp() {
    // Настраиваем адаптивность
    setupAdaptiveFeatures();
    
    // Загружаем сохраненные данные
    loadFromLocalStorage();
    
    // Инициализируем онлайн
    initOnline();
    
    // Настраиваем все обработчики событий
    setupAllEventListeners();
    
    console.log("✅ VolvetMC Shop готов к работе!");
}

// === АДАПТИВНЫЕ ФУНКЦИИ ===
function setupAdaptiveFeatures() {
    // Исправление 100vh на мобильных
    const setVH = () => {
        const vh = window.innerHeight * 0.01;
        document.documentElement.style.setProperty('--vh', `${vh}px`);
    };
    
    setVH();
    window.addEventListener('resize', setVH);
    window.addEventListener('orientationchange', setVH);
    
    // Улучшаем скролл на iOS
    document.querySelectorAll('.cart-items-container, .checkout-instruction').forEach(container => {
        container.addEventListener('touchmove', function(e) {
            if (this.scrollHeight > this.clientHeight) {
                e.stopPropagation();
            }
        }, { passive: false });
    });
}

// === ФУНКЦИИ ДЛЯ НАСТОЯЩЕГО ОНЛАЙНА ===
async function initOnline() {
    console.log("🔄 Инициализация онлайна серверов...");
    
    // Показываем базовый онлайн сразу
    updateOnlineDisplay('lite', serverOnline.lite.online, serverOnline.lite.max);
    updateOnlineDisplay('crit', serverOnline.crit.online, serverOnline.crit.max);
    updateProgressBars();
    
    // Загружаем реальный онлайн через PHP
    await updateAllServersOnline();
    
    // Автоматическое обновление каждые 30 секунд
    setInterval(async () => {
        if (document.querySelector('.server-selection.active')) {
            await updateAllServersOnline();
        } else if (selectedServer) {
            await updateServerOnlineDisplay(selectedServer);
        }
    }, 30000);
}

async function updateAllServersOnline() {
    try {
        await Promise.all([
            updateServerOnlineDisplay('lite'),
            updateServerOnlineDisplay('crit')
        ]);
    } catch (error) {
        console.error('Ошибка обновления онлайна всех серверов:', error);
    }
}

async function updateServerOnlineDisplay(serverType) {
    try {
        const data = await getServerOnline(serverType);
        
        // Обновляем данные
        serverOnline[serverType] = {
            online: data.online,
            max: data.max
        };
        
        // Обновляем отображение
        updateOnlineDisplay(serverType, data.online, data.max);
        updateProgressBars();
        
        // Если этот сервер выбран, обновляем шапку
        if (selectedServer === serverType) {
            updateCurrentOnlineDisplay();
        }
        
        return data;
        
    } catch (error) {
        console.error(`Ошибка обновления отображения онлайна для ${serverType}:`, error);
        
        // Показываем заглушку
        const onlineElement = serverType === 'lite' ? document.getElementById('liteOnline') : document.getElementById('critOnline');
        if (onlineElement) {
            onlineElement.textContent = "Ошибка";
            onlineElement.style.color = "#ef4444";
        }
    }
}

function updateOnlineDisplay(serverType, online, max) {
    const element = serverType === 'lite' ? document.getElementById('liteOnline') : document.getElementById('critOnline');
    if (element) {
        element.textContent = `${online}/${max}`;
        
        // Цвет в зависимости от заполненности
        const percent = (online / max) * 100;
        if (percent >= 80) {
            element.style.color = "#ef4444";
        } else if (percent >= 50) {
            element.style.color = "#f59e0b";
        } else {
            element.style.color = "#10b981";
        }
    }
}

function updateProgressBars() {
    // Lite режим
    const litePercent = Math.min((serverOnline.lite.online / serverOnline.lite.max) * 100, 100);
    const liteBar = document.querySelector('.lite-mode .progress-fill');
    if (liteBar) {
        liteBar.style.width = `${litePercent}%`;
        liteBar.style.background = getProgressColor(litePercent);
    }
    
    // Crit режим
    const critPercent = Math.min((serverOnline.crit.online / serverOnline.crit.max) * 100, 100);
    const critBar = document.querySelector('.crit-mode .progress-fill');
    if (critBar) {
        critBar.style.width = `${critPercent}%`;
        critBar.style.background = getProgressColor(critPercent);
    }
}

function getProgressColor(percent) {
    if (percent >= 80) return 'linear-gradient(135deg, #ef4444 0%, #f97316 100%)';
    if (percent >= 50) return 'linear-gradient(135deg, #f59e0b 0%, #eab308 100%)';
    return 'linear-gradient(135deg, #10b981 0%, #22c55e 100%)';
}

// === ФУНКЦИИ ДЛЯ РАБОТЫ САЙТА ===
function setupAllEventListeners() {
    console.log("🔄 Настройка обработчиков событий...");
    
    // 1. Кнопки выбора сервера
    setupServerSelection();
    
    // 2. Навигация по категориям
    setupCategoryNavigation();
    
    // 3. Кнопки покупки
    setupBuyButtons();
    
    // 4. Корзина
    setupCartFunctionality();
    
    // 5. Оформление заказа
    setupCheckoutFunctionality();
    
    // 6. Мобильное меню
    setupMobileMenu();
    
    console.log("✅ Все обработчики настроены!");
}

// 1. Выбор сервера
function setupServerSelection() {
    // Кнопки выбора сервера
    document.querySelectorAll('.btn-select-server').forEach(button => {
        button.addEventListener('click', function() {
            const server = this.getAttribute('data-server');
            selectServer(server);
        });
    });
    
    // Кнопка смены сервера
    const changeServerBtn = document.getElementById('changeServerBtn');
    if (changeServerBtn) {
        changeServerBtn.addEventListener('click', showServerSelection);
    }
}

function selectServer(server) {
    selectedServer = server;
    const serverName = server === 'lite' ? 'Lite режим' : 'Crit режим';
    const onlineData = serverOnline[server];
    
    // Обновляем все отображения сервера
    updateServerDisplay(serverName, onlineData);
    
    // Показываем магазин
    showShop();
    
    // Сохраняем выбор
    saveToLocalStorage();
    
    // Показываем уведомление
    showNotification(`Выбран сервер: ${serverName}`, 'success');
}

function updateServerDisplay(serverName, onlineData) {
    // Десктоп
    const currentServer = document.getElementById('currentServer');
    const currentOnline = document.getElementById('currentOnline');
    
    if (currentServer) currentServer.textContent = serverName;
    if (currentOnline) currentOnline.textContent = `Онлайн: ${onlineData.online}/${onlineData.max}`;
    
    // Мобильное меню
    const mobileCurrentServer = document.getElementById('mobileCurrentServer');
    const mobileCurrentOnline = document.getElementById('mobileCurrentOnline');
    
    if (mobileCurrentServer) mobileCurrentServer.textContent = serverName;
    if (mobileCurrentOnline) mobileCurrentOnline.textContent = `Онлайн: ${onlineData.online}/${onlineData.max}`;
}

function updateCurrentOnlineDisplay() {
    if (!selectedServer) return;
    
    const onlineData = serverOnline[selectedServer];
    const serverName = selectedServer === 'lite' ? 'Lite режим' : 'Crit режим';
    updateServerDisplay(serverName, onlineData);
}

function showShop() {
    const serverSelection = document.getElementById('serverSelection');
    const shopSection = document.getElementById('shopSection');
    
    if (serverSelection) {
        serverSelection.style.display = 'none';
        serverSelection.classList.remove('active');
    }
    if (shopSection) {
        shopSection.style.display = 'block';
        shopSection.classList.add('active');
    }
    
    // Закрываем мобильное меню если открыто
    closeMobileMenu();
    
    // Плавный скролл вверх
    window.scrollTo({ top: 0, behavior: 'smooth' });
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
        serverSelection.classList.add('active');
    }
    
    // Закрываем мобильное меню если открыто
    closeMobileMenu();
    
    // Закрываем корзину если открыта
    hideCart();
    
    // Плавный скролл вверх
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// 2. Навигация по категориям
function setupCategoryNavigation() {
    // Десктоп навигация
    document.querySelectorAll('.nav-btn').forEach(button => {
        button.addEventListener('click', function() {
            const category = this.getAttribute('data-category');
            switchCategory(category);
        });
    });
    
    // Мобильная навигация
    document.querySelectorAll('.mobile-nav-btn[data-category]').forEach(button => {
        button.addEventListener('click', function() {
            const category = this.getAttribute('data-category');
            switchCategory(category);
            closeMobileMenu();
            
            // Если магазин не показан, показываем его
            const shopSection = document.getElementById('shopSection');
            if (shopSection && !shopSection.classList.contains('active')) {
                showShop();
            }
        });
    });
}

function switchCategory(category) {
    console.log(`Переключение на категорию: ${category}`);
    
    // Обновляем активные кнопки
    document.querySelectorAll('.nav-btn, .mobile-nav-btn').forEach(btn => {
        btn.classList.remove('active');
        if (btn.getAttribute('data-category') === category) {
            btn.classList.add('active');
        }
    });
    
    // Скрываем все категории
    document.querySelectorAll('.category-content').forEach(content => {
        content.classList.remove('active');
    });
    
    // Показываем выбранную категорию
    const activeCategory = document.getElementById(category);
    if (activeCategory) {
        activeCategory.classList.add('active');
    }
}

// 3. Кнопки покупки
function setupBuyButtons() {
    document.querySelectorAll('.btn-buy').forEach(button => {
        button.addEventListener('click', function() {
            if (!selectedServer) {
                showNotification('Сначала выберите сервер!', 'warning');
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
        server: selectedServer,
        timestamp: new Date().toLocaleTimeString()
    };
    
    cart.push(item);
    updateCart();
    showNotification(`${product} добавлен в корзину!`, 'success');
    saveToLocalStorage();
}

// 4. Корзина
function setupCartFunctionality() {
    // Иконка корзины
    const cartIcon = document.getElementById('cartIcon');
    if (cartIcon) {
        cartIcon.addEventListener('click', showCart);
    }
    
    // Кнопка "Перейти в магазин" в пустой корзине
    const goToShopBtn = document.getElementById('goToShopBtn');
    if (goToShopBtn) {
        goToShopBtn.addEventListener('click', function() {
            hideCart();
            showShop();
        });
    }
    
    // Закрытие корзины
    const closeCartBtn = document.getElementById('closeCartBtn');
    if (closeCartBtn) {
        closeCartBtn.addEventListener('click', hideCart);
    }
    
    // Очистка корзины
    const clearCartBtn = document.getElementById('clearCartBtn');
    if (clearCartBtn) {
        clearCartBtn.addEventListener('click', function() {
            if (cart.length === 0) {
                showNotification('Корзина уже пуста', 'info');
                return;
            }
            
            if (confirm('Вы уверены, что хотите очистить корзину?')) {
                cart = [];
                updateCart();
                saveToLocalStorage();
                hideCart();
                showNotification('Корзина очищена', 'info');
            }
        });
    }
    
    // Оформление заказа из корзины
    const checkoutBtn = document.getElementById('checkoutBtn');
    if (checkoutBtn) {
        checkoutBtn.addEventListener('click', function() {
            if (cart.length === 0) {
                showNotification('Корзина пуста!', 'warning');
                return;
            }
            
            if (!selectedServer) {
                showNotification('Сначала выберите сервер!', 'warning');
                showServerSelection();
                hideCart();
                return;
            }
            
            showCheckout();
        });
    }
    
    // Закрытие по клику вне корзины
    document.addEventListener('click', function(event) {
        const cartModal = document.getElementById('cartModal');
        if (cartModal && event.target === cartModal) {
            hideCart();
        }
    });
    
    // Закрытие по клавише ESC
    document.addEventListener('keydown', function(event) {
        if (event.key === 'Escape') {
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
    
    // Закрываем мобильное меню если открыто
    closeMobileMenu();
}

function hideCart() {
    const cartModal = document.getElementById('cartModal');
    if (cartModal) {
        cartModal.classList.remove('show');
        document.body.style.overflow = '';
    }
}

function updateCart() {
    // Обновляем счетчики
    const cartCount = document.getElementById('cartCount');
    const mobileCartCount = document.getElementById('mobileCartCount');
    const mobileNavCartCount = document.getElementById('mobileNavCartCount');
    const cartBadge = document.getElementById('cartBadge');
    const itemsCount = document.getElementById('itemsCount');
    const summaryItems = document.getElementById('summaryItems');
    const totalPrice = document.getElementById('totalPrice');
    const checkoutPrice = document.getElementById('checkoutPrice');
    const finalPrice = document.getElementById('finalPrice');
    const cartServerName = document.getElementById('cartServerName');
    
    if (cartCount) cartCount.textContent = cart.length;
    if (mobileCartCount) mobileCartCount.textContent = cart.length;
    if (mobileNavCartCount) mobileNavCartCount.textContent = cart.length;
    if (cartBadge) cartBadge.textContent = cart.length;
    if (itemsCount) {
        const word = cart.length === 1 ? 'товар' : cart.length >= 2 && cart.length <= 4 ? 'товара' : 'товаров';
        itemsCount.textContent = `${cart.length} ${word}`;
    }
    if (summaryItems) summaryItems.textContent = cart.length;
    
    const total = cart.reduce((sum, item) => sum + item.price, 0);
    if (totalPrice) totalPrice.textContent = total;
    if (checkoutPrice) checkoutPrice.textContent = `${total}⭐`;
    if (finalPrice) finalPrice.textContent = total;
    
    // Обновляем сервер в корзине
    if (cartServerName) {
        cartServerName.textContent = selectedServer ? 
            (selectedServer === 'lite' ? 'Lite режим' : 'Crit режим') : 
            'Не выбран';
    }
    
    // Обновляем список товаров
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
        
        // Добавляем обработчик для кнопки
        const goToShopBtn = document.getElementById('goToShopBtn');
        if (goToShopBtn) {
            goToShopBtn.addEventListener('click', function() {
                hideCart();
                showShop();
            });
        }
        
        return;
    }
    
    // Добавляем товары в корзину
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
                <button class="btn-remove-item" data-id="${item.id}" aria-label="Удалить товар">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        `;
        cartItems.appendChild(itemElement);
    });
    
    // Добавляем обработчики удаления
    document.querySelectorAll('.btn-remove-item').forEach(button => {
        button.addEventListener('click', function() {
            const id = parseInt(this.getAttribute('data-id'));
            removeFromCart(id);
        });
    });
}

function removeFromCart(id) {
    cart = cart.filter(item => item.id !== id);
    updateCart();
    saveToLocalStorage();
    showNotification('Товар удален из корзины', 'info');
}

// 5. Оформление заказа
function setupCheckoutFunctionality() {
    // Закрытие окна оформления
    const closePurchaseBtn = document.getElementById('closePurchaseBtn');
    if (closePurchaseBtn) {
        closePurchaseBtn.addEventListener('click', hideCheckout);
    }
    
    // Отмена оформления
    const cancelPurchaseBtn = document.getElementById('cancelPurchaseBtn');
    if (cancelPurchaseBtn) {
        cancelPurchaseBtn.addEventListener('click', hideCheckout);
    }
    
    // Подтверждение покупки
    const confirmPurchaseBtn = document.getElementById('confirmPurchaseBtn');
    if (confirmPurchaseBtn) {
        confirmPurchaseBtn.addEventListener('click', confirmPurchase);
    }
    
    // Закрытие по клику вне окна
    document.addEventListener('click', function(event) {
        const purchaseModal = document.getElementById('purchaseModal');
        if (purchaseModal && event.target === purchaseModal) {
            hideCheckout();
        }
    });
    
    // Закрытие по клавише ESC
    document.addEventListener('keydown', function(event) {
        if (event.key === 'Escape') {
            hideCheckout();
        }
    });
}

function showCheckout() {
    if (cart.length === 0 || !selectedServer) return;
    
    const total = cart.reduce((sum, item) => sum + item.price, 0);
    const products = cart.map(item => item.product).join(', ');
    const serverName = selectedServer === 'lite' ? 'Lite режим' : 'Crit режим';
    
    // Заполняем поля
    const purchaseServer = document.getElementById('purchaseServer');
    const purchaseProduct = document.getElementById('purchaseProduct');
    const purchasePrice = document.getElementById('purchasePrice');
    const instructionPrice = document.getElementById('instructionPrice');
    
    if (purchaseServer) purchaseServer.textContent = serverName;
    if (purchaseProduct) purchaseProduct.textContent = products.length > 50 ? products.substring(0, 47) + '...' : products;
    if (purchasePrice) purchasePrice.textContent = total;
    if (instructionPrice) instructionPrice.textContent = total;
    
    // Показываем окно
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
        document.body.style.overflow = '';
    }
}

function confirmPurchase() {
    const total = cart.reduce((sum, item) => sum + item.price, 0);
    const serverName = selectedServer === 'lite' ? 'Lite режим' : 'Crit режим';
    const products = cart.map(item => item.product).join(', ');
    
    const message = `✅ ЗАКАЗ ОФОРМЛЕН!\n\n📋 Детали заказа:\n• Сервер: ${serverName}\n• Товары: ${products}\n• Сумма: ${total} звезд\n\n💳 Инструкция по оплате:\n1. Перейдите в Telegram бота @VolvetDon_bot\n2. Оплатите ${total} звезд\n3. Пришлите скриншот оплаты в поддержку\n4. Сообщите ваш никнейм в игре\n\n⏱️ Товар будет активирован в течение 15 минут!`;
    
    // Показываем сообщение
    if (window.confirm(message)) {
        // Очищаем корзину
        cart = [];
        updateCart();
        saveToLocalStorage();
        
        // Закрываем окна
        hideCheckout();
        
        // Показываем уведомление
        showNotification('Заказ оформлен! Проверьте инструкцию по оплате.', 'success');
        
        // Возвращаем в магазин
        setTimeout(() => {
            showShop();
        }, 1000);
    }
}

// 6. Мобильное меню
function setupMobileMenu() {
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const mobileMenuClose = document.getElementById('mobileMenuClose');
    const mobileMenu = document.getElementById('mobileMenu');
    const mobileChangeServer = document.getElementById('mobileChangeServer');
    const mobileCartBtn = document.getElementById('mobileCartBtn');
    
    if (mobileMenuBtn) {
        mobileMenuBtn.addEventListener('click', showMobileMenu);
    }
    
    if (mobileMenuClose) {
        mobileMenuClose.addEventListener('click', closeMobileMenu);
    }
    
    if (mobileChangeServer) {
        mobileChangeServer.addEventListener('click', function() {
            showServerSelection();
            closeMobileMenu();
        });
    }
    
    if (mobileCartBtn) {
        mobileCartBtn.addEventListener('click', function() {
            showCart();
            closeMobileMenu();
        });
    }
    
    // Закрытие по клику вне меню
    if (mobileMenu) {
        mobileMenu.addEventListener('click', function(event) {
            if (event.target === mobileMenu) {
                closeMobileMenu();
            }
        });
    }
    
    // Закрытие по клавише ESC
    document.addEventListener('keydown', function(event) {
        if (event.key === 'Escape') {
            closeMobileMenu();
        }
    });
}

function showMobileMenu() {
    const mobileMenu = document.getElementById('mobileMenu');
    if (mobileMenu) {
        mobileMenu.style.display = 'flex';
        mobileMenu.style.transform = 'translateX(100%)';
        
        // Анимация
        requestAnimationFrame(() => {
            mobileMenu.classList.add('show');
            mobileMenu.style.transform = 'translateX(0)';
        });
        
        document.body.style.overflow = 'hidden';
    }
}

function closeMobileMenu() {
    const mobileMenu = document.getElementById('mobileMenu');
    if (mobileMenu) {
        mobileMenu.classList.remove('show');
        mobileMenu.style.transform = 'translateX(100%)';
        
        // Ждем окончания анимации
        setTimeout(() => {
            if (!mobileMenu.classList.contains('show')) {
                mobileMenu.style.display = 'none';
                document.body.style.overflow = '';
            }
        }, 300);
    }
}

// Уведомления
function showNotification(message, type = 'info') {
    const notification = document.getElementById('notification');
    const notificationText = document.getElementById('notificationText');
    
    if (!notification || !notificationText) {
        createNotification(message, type);
        return;
    }
    
    // Если уведомление уже существует
    notificationText.textContent = message;
    
    const colors = {
        success: '#10b981',
        warning: '#f59e0b',
        error: '#ef4444',
        info: '#3b82f6'
    };
    
    notification.style.background = colors[type] || colors.info;
    
    // Показываем уведомление
    notification.classList.add('show');
    
    // Убираем через 3 секунды
    setTimeout(() => {
        notification.classList.remove('show');
    }, 3000);
}

function createNotification(message, type) {
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fas fa-check-circle"></i>
            <span>${message}</span>
        </div>
    `;
    
    const colors = {
        success: '#10b981',
        warning: '#f59e0b',
        error: '#ef4444',
        info: '#3b82f6'
    };
    
    notification.style.cssText = `
        position: fixed;
        bottom: 20px;
        right: 20px;
        background: ${colors[type] || colors.info};
        color: white;
        padding: 14px 18px;
        border-radius: 10px;
        display: flex;
        align-items: center;
        gap: 10px;
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
        z-index: 4000;
        transform: translateY(100px);
        opacity: 0;
        transition: all 0.3s ease;
        font-weight: 500;
        font-size: 14px;
        max-width: 320px;
    `;
    
    document.body.appendChild(notification);
    
    // Показываем
    setTimeout(() => {
        notification.style.transform = 'translateY(0)';
        notification.style.opacity = '1';
    }, 10);
    
    // Убираем через 3 секунды
    setTimeout(() => {
        notification.style.transform = 'translateY(100px)';
        notification.style.opacity = '0';
        setTimeout(() => {
            if (notification.parentNode) {
                document.body.removeChild(notification);
            }
        }, 300);
    }, 3000);
}

// LocalStorage
function saveToLocalStorage() {
    try {
        localStorage.setItem('volvetmc_cart', JSON.stringify(cart));
        localStorage.setItem('volvetmc_server', selectedServer);
    } catch (e) {
        console.warn('Не удалось сохранить в localStorage:', e);
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
            
            // Обновляем отображение сервера
            const serverName = savedServer === 'lite' ? 'Lite режим' : 'Crit режим';
            const onlineData = serverOnline[savedServer];
            updateServerDisplay(serverName, onlineData);
        }
    } catch (e) {
        console.warn('Не удалось загрузить из localStorage:', e);
    }
}

// Глобальные функции для отладки
window.debug = {
    cart: () => {
        console.log('Корзина:', cart);
        console.log('Выбранный сервер:', selectedServer);
        console.log('Онлайн:', serverOnline);
    },
    clear: () => {
        localStorage.clear();
        cart = [];
        selectedServer = null;
        updateCart();
        location.reload();
    },
    testOnline: async () => {
        await updateAllServersOnline();
        showNotification('Онлайн обновлен', 'info');
    },
    testPHP: async (server = 'lite') => {
        const result = await getServerOnline(server);
        console.log(`PHP результат для ${server}:`, result);
        showNotification(`PHP тест: ${result.online}/${result.max}`, 'info');
    }
};
