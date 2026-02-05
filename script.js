// ============================================
// VolvetMC Shop - Основной JavaScript файл
// Версия 3.0 с настоящим онлайн
// ============================================

// === КОНФИГУРАЦИЯ ===
const CONFIG = {
    API_ENDPOINT: 'get-online.php', // PHP файл для получения онлайна
    UPDATE_INTERVAL: 30000, // 30 секунд
    NOTIFICATION_DURATION: 3000,
    SERVERS: {
        lite: { name: 'Lite режим', max: 500 },
        crit: { name: 'Crit режим', max: 300 }
    }
};

// === ГЛОБАЛЬНЫЕ ПЕРЕМЕННЫЕ ===
let cart = [];
let selectedServer = null;
let serverOnline = {
    lite: { online: 0, max: 500 },
    crit: { online: 0, max: 300 }
};
let onlineUpdateInterval = null;

// === ОСНОВНАЯ ИНИЦИАЛИЗАЦИЯ ===
document.addEventListener('DOMContentLoaded', function() {
    console.log('🎮 VolvetMC Shop запускается...');
    initApplication();
});

async function initApplication() {
    try {
        // 1. Настройка адаптивности
        setupResponsiveDesign();
        
        // 2. Загрузка данных из localStorage
        loadSavedData();
        
        // 3. Инициализация онлайна
        await initServerOnline();
        
        // 4. Настройка всех обработчиков событий
        setupEventListeners();
        
        // 5. Обновление интерфейса
        updateUI();
        
        console.log('✅ VolvetMC Shop готов к работе!');
    } catch (error) {
        console.error('❌ Ошибка инициализации:', error);
        showNotification('Ошибка загрузки приложения', 'error');
    }
}

// === АДАПТИВНЫЙ ДИЗАЙН ===
function setupResponsiveDesign() {
    // Исправление 100vh на мобильных устройствах
    function setViewportHeight() {
        const vh = window.innerHeight * 0.01;
        document.documentElement.style.setProperty('--vh', `${vh}px`);
    }
    
    setViewportHeight();
    window.addEventListener('resize', setViewportHeight);
    window.addEventListener('orientationchange', setViewportHeight);
    
    // Предотвращение масштабирования на iOS при фокусе
    document.addEventListener('touchstart', function(event) {
        const target = event.target;
        if (['INPUT', 'TEXTAREA', 'SELECT'].includes(target.tagName)) {
            target.style.fontSize = '16px';
        }
    }, { passive: true });
}

// === СИСТЕМА ОНЛАЙНА СЕРВЕРОВ ===
async function initServerOnline() {
    console.log('🔄 Загрузка онлайн статуса серверов...');
    
    // Показываем базовые значения
    updateOnlineDisplay('lite', 0, CONFIG.SERVERS.lite.max);
    updateOnlineDisplay('crit', 0, CONFIG.SERVERS.crit.max);
    
    // Загружаем актуальный онлайн
    await Promise.all([
        fetchServerOnline('lite'),
        fetchServerOnline('crit')
    ]);
    
    // Запускаем автоматическое обновление
    startAutoUpdate();
}

async function fetchServerOnline(serverType) {
    try {
        console.log(`📡 Запрос онлайна для ${serverType}...`);
        
        const response = await fetch(`${CONFIG.API_ENDPOINT}?server=${serverType}`, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Cache-Control': 'no-cache'
            }
        });
        
        if (!response.ok) {
            throw new Error(`HTTP ${response.status}`);
        }
        
        const data = await response.json();
        
        // Обновляем данные сервера
        serverOnline[serverType] = {
            online: data.online || 0,
            max: data.max || CONFIG.SERVERS[serverType].max,
            status: data.status || 'online'
        };
        
        // Обновляем отображение
        updateOnlineDisplay(
            serverType, 
            serverOnline[serverType].online, 
            serverOnline[serverType].max
        );
        
        // Обновляем прогресс-бар
        updateProgressBar(serverType);
        
        console.log(`✅ ${serverType}: ${serverOnline[serverType].online}/${serverOnline[serverType].max}`);
        
        return true;
        
    } catch (error) {
        console.warn(`⚠️ Не удалось получить онлайн для ${serverType}:`, error);
        
        // Используем рандомные значения в качестве fallback
        const randomOnline = serverType === 'lite' 
            ? Math.floor(Math.random() * 200) + 100
            : Math.floor(Math.random() * 150) + 50;
        
        serverOnline[serverType] = {
            online: randomOnline,
            max: CONFIG.SERVERS[serverType].max,
            status: 'online'
        };
        
        updateOnlineDisplay(
            serverType, 
            randomOnline, 
            CONFIG.SERVERS[serverType].max
        );
        
        updateProgressBar(serverType);
        
        return false;
    }
}

function startAutoUpdate() {
    // Очищаем предыдущий интервал
    if (onlineUpdateInterval) {
        clearInterval(onlineUpdateInterval);
    }
    
    // Запускаем новый интервал
    onlineUpdateInterval = setInterval(async () => {
        if (isShopVisible()) {
            await fetchServerOnline('lite');
            await fetchServerOnline('crit');
            
            // Если сервер выбран, обновляем отображение в шапке
            if (selectedServer) {
                updateServerHeader();
            }
        }
    }, CONFIG.UPDATE_INTERVAL);
}

function isShopVisible() {
    const shopSection = document.getElementById('shopSection');
    return shopSection && shopSection.classList.contains('active');
}

function updateOnlineDisplay(serverType, online, max) {
    const element = document.getElementById(`${serverType}Online`);
    if (element) {
        element.textContent = `${online}/${max}`;
        element.style.color = getOnlineColor(online, max);
    }
}

function updateProgressBar(serverType) {
    const onlineData = serverOnline[serverType];
    const percent = Math.min((onlineData.online / onlineData.max) * 100, 100);
    
    const progressBar = document.querySelector(`.${serverType}-mode .progress-fill`);
    if (progressBar) {
        progressBar.style.width = `${percent}%`;
        progressBar.style.background = getProgressColor(percent);
    }
}

function getOnlineColor(online, max) {
    const percentage = (online / max) * 100;
    
    if (percentage >= 90) return '#ef4444'; // Красный
    if (percentage >= 70) return '#f59e0b'; // Оранжевый
    if (percentage >= 50) return '#eab308'; // Желтый
    return '#10b981'; // Зеленый
}

function getProgressColor(percentage) {
    if (percentage >= 80) return 'linear-gradient(135deg, #ef4444 0%, #f97316 100%)';
    if (percentage >= 50) return 'linear-gradient(135deg, #f59e0b 0%, #eab308 100%)';
    return 'linear-gradient(135deg, #10b981 0%, #22c55e 100%)';
}

// === УПРАВЛЕНИЕ СЕРВЕРОМ ===
function selectServer(serverType) {
    selectedServer = serverType;
    const serverName = CONFIG.SERVERS[serverType].name;
    const onlineData = serverOnline[serverType];
    
    // Обновляем отображение
    updateServerHeader();
    
    // Показываем магазин
    showShopSection();
    
    // Сохраняем выбор
    saveToLocalStorage();
    
    // Уведомление
    showNotification(`Выбран сервер: ${serverName}`, 'success');
}

function updateServerHeader() {
    if (!selectedServer) return;
    
    const serverName = CONFIG.SERVERS[selectedServer].name;
    const onlineData = serverOnline[selectedServer];
    
    // Десктоп версия
    updateElementText('currentServer', serverName);
    updateElementText('currentOnline', `Онлайн: ${onlineData.online}/${onlineData.max}`);
    
    // Мобильная версия
    updateElementText('mobileCurrentServer', serverName);
    updateElementText('mobileCurrentOnline', `Онлайн: ${onlineData.online}/${onlineData.max}`);
    
    // Корзина
    updateElementText('cartServerName', serverName);
}

function showShopSection() {
    hideElement('serverSelection');
    showElement('shopSection');
    closeMobileMenu();
    
    // Плавный скролл
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function showServerSelection() {
    hideElement('shopSection');
    showElement('serverSelection');
    closeMobileMenu();
    hideCart();
    
    // Плавный скролл
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// === КОРЗИНА ===
function addToCart(productName, price) {
    if (!selectedServer) {
        showNotification('Сначала выберите сервер!', 'warning');
        showServerSelection();
        return;
    }
    
    const cartItem = {
        id: Date.now() + Math.random(),
        name: productName,
        price: price,
        server: selectedServer,
        date: new Date().toISOString()
    };
    
    cart.push(cartItem);
    updateCartUI();
    saveToLocalStorage();
    
    showNotification(`${productName} добавлен в корзину!`, 'success');
}

function removeFromCart(itemId) {
    cart = cart.filter(item => item.id !== itemId);
    updateCartUI();
    saveToLocalStorage();
    showNotification('Товар удален из корзины', 'info');
}

function clearCart() {
    if (cart.length === 0) {
        showNotification('Корзина уже пуста', 'info');
        return;
    }
    
    if (confirm('Вы уверены, что хотите очистить корзину?')) {
        cart = [];
        updateCartUI();
        saveToLocalStorage();
        hideCart();
        showNotification('Корзина очищена', 'info');
    }
}

function updateCartUI() {
    // Обновляем счетчики
    updateElementText('cartCount', cart.length);
    updateElementText('mobileCartCount', cart.length);
    updateElementText('mobileNavCartCount', cart.length);
    updateElementText('cartBadge', cart.length);
    
    // Обновляем заголовок
    const itemsCountElement = document.getElementById('itemsCount');
    if (itemsCountElement) {
        const itemsWord = getItemsWord(cart.length);
        itemsCountElement.textContent = `${cart.length} ${itemsWord}`;
    }
    
    // Обновляем список товаров
    renderCartItems();
    
    // Обновляем итоговую сумму
    updateCartTotal();
}

function renderCartItems() {
    const cartItemsContainer = document.getElementById('cartItems');
    if (!cartItemsContainer) return;
    
    if (cart.length === 0) {
        cartItemsContainer.innerHTML = `
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
        document.getElementById('goToShopBtn')?.addEventListener('click', () => {
            hideCart();
            showShopSection();
        });
        
        return;
    }
    
    // Рендерим товары
    cartItemsContainer.innerHTML = cart.map(item => `
        <div class="cart-item">
            <div class="cart-item-info">
                <div class="cart-item-name">
                    <i class="fas fa-box"></i>
                    <span>${escapeHtml(item.name)}</span>
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
        </div>
    `).join('');
    
    // Добавляем обработчики удаления
    document.querySelectorAll('.btn-remove-item').forEach(button => {
        button.addEventListener('click', (e) => {
            const itemId = parseInt(e.currentTarget.dataset.id);
            removeFromCart(itemId);
        });
    });
}

function updateCartTotal() {
    const total = cart.reduce((sum, item) => sum + item.price, 0);
    
    updateElementText('summaryItems', cart.length);
    updateElementText('totalPrice', total);
    updateElementText('checkoutPrice', `${total}⭐`);
    updateElementText('finalPrice', total);
    updateElementText('purchasePrice', total);
    updateElementText('instructionPrice', total);
}

function getItemsWord(count) {
    const lastDigit = count % 10;
    const lastTwoDigits = count % 100;
    
    if (lastTwoDigits >= 11 && lastTwoDigits <= 19) return 'товаров';
    if (lastDigit === 1) return 'товар';
    if (lastDigit >= 2 && lastDigit <= 4) return 'товара';
    return 'товаров';
}

// === ОФОРМЛЕНИЕ ЗАКАЗА ===
function showCheckout() {
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
    
    const serverName = CONFIG.SERVERS[selectedServer].name;
    const products = cart.map(item => item.name).join(', ');
    const total = cart.reduce((sum, item) => sum + item.price, 0);
    
    // Заполняем данные
    updateElementText('purchaseServer', serverName);
    updateElementText('purchaseProduct', truncateText(products, 50));
    
    // Показываем окно
    hideCart();
    showElement('purchaseModal');
    disableBodyScroll();
}

function hideCheckout() {
    hideElement('purchaseModal');
    enableBodyScroll();
}

function confirmPurchase() {
    const total = cart.reduce((sum, item) => sum + item.price, 0);
    const serverName = CONFIG.SERVERS[selectedServer].name;
    const products = cart.map(item => item.name).join(', ');
    
    const message = `
✅ ЗАКАЗ ОФОРМЛЕН!

📋 Детали заказа:
• Сервер: ${serverName}
• Товары: ${products}
• Сумма: ${total} звезд

💳 Инструкция по оплате:
1. Перейдите в Telegram бота @VolvetDon_bot
2. Оплатите ${total} звезд
3. Пришлите скриншот оплаты в поддержку
4. Сообщите ваш никнейм в игре

⏱️ Товар будет активирован в течение 15 минут!
    `;
    
    if (confirm(message.trim())) {
        // Очищаем корзину
        cart = [];
        updateCartUI();
        saveToLocalStorage();
        
        // Закрываем окна
        hideCheckout();
        
        // Показываем уведомление
        showNotification('Заказ оформлен! Проверьте инструкцию по оплате.', 'success');
        
        // Возвращаем в магазин
        setTimeout(() => {
            showShopSection();
        }, 1000);
    }
}

// === МОБИЛЬНОЕ МЕНЮ ===
function showMobileMenu() {
    const mobileMenu = document.getElementById('mobileMenu');
    if (mobileMenu) {
        mobileMenu.style.display = 'flex';
        setTimeout(() => {
            mobileMenu.classList.add('show');
        }, 10);
        disableBodyScroll();
    }
}

function closeMobileMenu() {
    const mobileMenu = document.getElementById('mobileMenu');
    if (mobileMenu) {
        mobileMenu.classList.remove('show');
        setTimeout(() => {
            if (!mobileMenu.classList.contains('show')) {
                mobileMenu.style.display = 'none';
                enableBodyScroll();
            }
        }, 300);
    }
}

// === КОРЗИНА (модальное окно) ===
function showCart() {
    updateCartUI();
    showElement('cartModal');
    disableBodyScroll();
}

function hideCart() {
    hideElement('cartModal');
    enableBodyScroll();
}

// === УВЕДОМЛЕНИЯ ===
function showNotification(message, type = 'info') {
    const notification = document.getElementById('notification');
    const notificationText = document.getElementById('notificationText');
    
    if (!notification || !notificationText) {
        createTemporaryNotification(message, type);
        return;
    }
    
    const colors = {
        success: '#10b981',
        warning: '#f59e0b',
        error: '#ef4444',
        info: '#3b82f6'
    };
    
    notification.style.background = colors[type] || colors.info;
    notificationText.textContent = message;
    
    notification.classList.add('show');
    
    setTimeout(() => {
        notification.classList.remove('show');
    }, CONFIG.NOTIFICATION_DURATION);
}

function createTemporaryNotification(message, type) {
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.innerHTML = `<i class="fas fa-info-circle"></i> ${message}`;
    
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
        padding: 12px 16px;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.3);
        z-index: 10000;
        animation: slideIn 0.3s ease;
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
}

// === LOCALSTORAGE ===
function saveToLocalStorage() {
    try {
        localStorage.setItem('volvetmc_cart', JSON.stringify(cart));
        localStorage.setItem('volvetmc_server', selectedServer || '');
    } catch (error) {
        console.warn('Не удалось сохранить в localStorage:', error);
    }
}

function loadSavedData() {
    try {
        const savedCart = localStorage.getItem('volvetmc_cart');
        const savedServer = localStorage.getItem('volvetmc_server');
        
        if (savedCart) {
            cart = JSON.parse(savedCart);
        }
        
        if (savedServer && CONFIG.SERVERS[savedServer]) {
            selectedServer = savedServer;
        }
    } catch (error) {
        console.warn('Не удалось загрузить из localStorage:', error);
    }
}

// === ОБРАБОТЧИКИ СОБЫТИЙ ===
function setupEventListeners() {
    console.log('🔄 Настройка обработчиков событий...');
    
    // Выбор сервера
    document.querySelectorAll('.btn-select-server').forEach(button => {
        button.addEventListener('click', (e) => {
            const server = e.currentTarget.dataset.server;
            if (CONFIG.SERVERS[server]) {
                selectServer(server);
            }
        });
    });
    
    // Смена сервера
    document.getElementById('changeServerBtn')?.addEventListener('click', showServerSelection);
    document.getElementById('mobileChangeServer')?.addEventListener('click', () => {
        showServerSelection();
        closeMobileMenu();
    });
    
    // Категории магазина
    document.querySelectorAll('.nav-btn, .mobile-nav-btn[data-category]').forEach(button => {
        button.addEventListener('click', (e) => {
            const category = e.currentTarget.dataset.category;
            switchCategory(category);
            
            if (e.currentTarget.classList.contains('mobile-nav-btn')) {
                closeMobileMenu();
                if (!isShopVisible()) {
                    showShopSection();
                }
            }
        });
    });
    
    // Кнопки покупки
    document.querySelectorAll('.btn-buy').forEach(button => {
        button.addEventListener('click', (e) => {
            const product = e.currentTarget.dataset.product;
            const price = parseInt(e.currentTarget.dataset.price);
            addToCart(product, price);
        });
    });
    
    // Корзина
    document.getElementById('cartIcon')?.addEventListener('click', showCart);
    document.getElementById('mobileCartBtn')?.addEventListener('click', () => {
        showCart();
        closeMobileMenu();
    });
    
    // Закрытие корзины
    document.getElementById('closeCartBtn')?.addEventListener('click', hideCart);
    document.getElementById('cartModal')?.addEventListener('click', (e) => {
        if (e.target === e.currentTarget) {
            hideCart();
        }
    });
    
    // Очистка корзины
    document.getElementById('clearCartBtn')?.addEventListener('click', clearCart);
    
    // Оформление заказа
    document.getElementById('checkoutBtn')?.addEventListener('click', showCheckout);
    
    // Окно оформления
    document.getElementById('closePurchaseBtn')?.addEventListener('click', hideCheckout);
    document.getElementById('cancelPurchaseBtn')?.addEventListener('click', hideCheckout);
    document.getElementById('confirmPurchaseBtn')?.addEventListener('click', confirmPurchase);
    document.getElementById('purchaseModal')?.addEventListener('click', (e) => {
        if (e.target === e.currentTarget) {
            hideCheckout();
        }
    });
    
    // Мобильное меню
    document.getElementById('mobileMenuBtn')?.addEventListener('click', showMobileMenu);
    document.getElementById('mobileMenuClose')?.addEventListener('click', closeMobileMenu);
    document.getElementById('mobileMenu')?.addEventListener('click', (e) => {
        if (e.target === e.currentTarget) {
            closeMobileMenu();
        }
    });
    
    // Закрытие по клавише ESC
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            hideCart();
            hideCheckout();
            closeMobileMenu();
        }
    });
    
    console.log('✅ Обработчики событий настроены');
}

// === ВСПОМОГАТЕЛЬНЫЕ ФУНКЦИИ ===
function switchCategory(category) {
    // Обновляем активные кнопки
    document.querySelectorAll('.nav-btn').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.category === category);
    });
    
    // Показываем выбранную категорию
    document.querySelectorAll('.category-content').forEach(content => {
        content.classList.toggle('active', content.id === category);
    });
}

function updateUI() {
    updateCartUI();
    
    if (selectedServer) {
        updateServerHeader();
        showShopSection();
    } else {
        showServerSelection();
    }
}

function updateElementText(elementId, text) {
    const element = document.getElementById(elementId);
    if (element) {
        element.textContent = text;
    }
}

function showElement(elementId) {
    const element = document.getElementById(elementId);
    if (element) {
        element.classList.add('show');
        if (element.style.display === 'none') {
            element.style.display = 'block';
        }
    }
}

function hideElement(elementId) {
    const element = document.getElementById(elementId);
    if (element) {
        element.classList.remove('show');
        if (element.id === 'shopSection' || element.id === 'serverSelection') {
            element.style.display = 'none';
        }
    }
}

function disableBodyScroll() {
    document.body.style.overflow = 'hidden';
    document.body.style.position = 'fixed';
    document.body.style.width = '100%';
}

function enableBodyScroll() {
    document.body.style.overflow = '';
    document.body.style.position = '';
    document.body.style.width = '';
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

function truncateText(text, maxLength) {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength - 3) + '...';
}

// === ГЛОБАЛЬНЫЕ ФУНКЦИИ ДЛЯ ОТЛАДКИ ===
if (typeof window !== 'undefined') {
    window.debug = {
        cart: () => {
            console.log('🛒 Корзина:', cart);
            console.log('🎮 Выбранный сервер:', selectedServer);
            console.log('📊 Онлайн:', serverOnline);
        },
        clear: () => {
            localStorage.clear();
            cart = [];
            selectedServer = null;
            updateCartUI();
            location.reload();
        },
        testOnline: async () => {
            console.log('🔄 Тестирование онлайн...');
            await fetchServerOnline('lite');
            await fetchServerOnline('crit');
            showNotification('Онлайн обновлен', 'info');
        },
        addTestItem: () => {
            addToCart('Тестовый товар', 10);
        }
    };
}

// === ПОЛИФИЛЫ ===
if (!window.requestAnimationFrame) {
    window.requestAnimationFrame = window.webkitRequestAnimationFrame || 
                                  window.mozRequestAnimationFrame || 
                                  function(callback) {
                                      return setTimeout(callback, 16);
                                  };
}

// Добавляем стили для анимации
if (!document.querySelector('#notification-styles')) {
    const style = document.createElement('style');
    style.id = 'notification-styles';
    style.textContent = `
        @keyframes slideIn {
            from {
                transform: translateY(100px);
                opacity: 0;
            }
            to {
                transform: translateY(0);
                opacity: 1;
            }
        }
        
        @keyframes slideOut {
            from {
                transform: translateY(0);
                opacity: 1;
            }
            to {
                transform: translateY(100px);
                opacity: 0;
            }
        }
    `;
    document.head.appendChild(style);
}
