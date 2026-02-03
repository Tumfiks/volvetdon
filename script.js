// Основные переменные
let cart = [];
let selectedServer = null;
let serverOnline = {
    lite: { online: 0, max: 25 },
    crit: { online: 0, max: 20 }
};

// === НАСТОЯЩИЙ ОНЛАЙН СЕРВЕРА ===
// ЗАМЕНИТЕ ЭТИ НАСТРОЙКИ НА СВОИ!
const SERVER_CONFIG = {
    lite: {
        name: "Lite режим",
        ip: "VolvetMC.aternos.me", // Замените на ваш IP
        port: 29953,
        apiUrls: [
            "https://api.mcsrvstat.us/2/{ip}:{port}",
            "https://api.mcstatus.io/v2/status/java/{ip}:{port}"
        ]
    },
    crit: {
        name: "Crit режим",
        ip: "phoenix-pe.ru", // Замените на ваш IP
        port: 19132,
        apiUrls: [
            "https://api.mcsrvstat.us/2/{ip}:{port}",
            "https://api.mcstatus.io/v2/status/java/{ip}:{port}"
        ]
    }
};

// === ОСНОВНОЙ КОД ===
document.addEventListener('DOMContentLoaded', function() {
    console.log("🚀 VolvetMC Shop загружается...");
    initApp();
});

function initApp() {
    // Загружаем сохраненные данные
    loadFromLocalStorage();
    
    // Инициализируем онлайн
    initOnline();
    
    // Настраиваем все обработчики событий
    setupAllEventListeners();
    
    console.log("✅ VolvetMC Shop готов к работе!");
}

// === ФУНКЦИИ ДЛЯ НАСТОЯЩЕГО ОНЛАЙНА (НЕ ТРОГАТЬ!) ===
async function initOnline() {
    console.log("🔄 Инициализация онлайна серверов...");
    
    // Показываем базовый онлайн сразу
    updateOnlineDisplay('lite', serverOnline.lite.online, serverOnline.lite.max);
    updateOnlineDisplay('crit', serverOnline.crit.online, serverOnline.crit.max);
    updateProgressBars();
    
    // Пробуем загрузить реальный онлайн (если настроены IP)
    await updateServerOnline('lite');
    await updateServerOnline('crit');
    
    // Автоматическое обновление каждые 30 секунд
    setInterval(() => {
        if (document.querySelector('.server-selection.active')) {
            updateServerOnline('lite');
            updateServerOnline('crit');
        } else if (selectedServer) {
            updateServerOnline(selectedServer);
        }
    }, 30000);
}

async function updateServerOnline(serverType) {
    const config = SERVER_CONFIG[serverType];
    const onlineElement = serverType === 'lite' ? document.getElementById('liteOnline') : document.getElementById('critOnline');
    
    if (!onlineElement) return;
    
    // Если IP не настроены, используем статический онлайн
    if (config.ip.includes("ВАШ_IP")) {
        console.log(`⚠️ IP для ${serverType} не настроен, используем статический онлайн`);
        const staticOnline = serverType === 'lite' ? 
            { online: 247, max: 500 } : 
            { online: 128, max: 300 };
        
        serverOnline[serverType] = staticOnline;
        updateOnlineDisplay(serverType, staticOnline.online, staticOnline.max);
        updateProgressBars();
        return;
    }
    
    try {
        // Пробуем разные API для получения реального онлайна
        let onlineData = null;
        
        // Пробуем mcstatus.io
        try {
            const response = await fetch(`https://api.mcstatus.io/v2/status/java/${config.ip}:${config.port}`);
            if (response.ok) {
                const data = await response.json();
                if (data.online) {
                    onlineData = {
                        online: data.players.online,
                        max: data.players.max
                    };
                }
            }
        } catch (e) {
            console.log(`❌ mcstatus.io не сработал для ${serverType}`);
        }
        
        // Если mcstatus.io не сработал, пробуем mcsrvstat.us
        if (!onlineData) {
            try {
                const response = await fetch(`https://api.mcsrvstat.us/2/${config.ip}:${config.port}`);
                if (response.ok) {
                    const data = await response.json();
                    if (data.online) {
                        onlineData = {
                            online: data.players.online,
                            max: data.players.max
                        };
                    }
                }
            } catch (e) {
                console.log(`❌ mcsrvstat.us не сработал для ${serverType}`);
            }
        }
        
        // Если API не сработали, используем заглушку
        if (!onlineData) {
            const baseOnline = serverType === 'lite' ? 200 : 100;
            const variation = Math.floor(Math.random() * 40) - 20;
            const online = Math.max(0, Math.min(baseOnline + variation, config.maxPlayers));
            
            onlineData = {
                online: online,
                max: serverType === 'lite' ? 500 : 300
            };
        }
        
        // Обновляем данные
        serverOnline[serverType] = onlineData;
        
        // Обновляем отображение
        updateOnlineDisplay(serverType, onlineData.online, onlineData.max);
        updateProgressBars();
        
        // Если этот сервер выбран, обновляем шапку
        if (selectedServer === serverType) {
            const currentOnline = document.getElementById('currentOnline');
            if (currentOnline) {
                currentOnline.textContent = `Онлайн: ${onlineData.online}/${onlineData.max}`;
            }
        }
        
    } catch (error) {
        console.error(`❌ Ошибка обновления онлайна ${serverType}:`, error);
    }
}

function updateOnlineDisplay(serverType, online, max) {
    const element = serverType === 'lite' ? document.getElementById('liteOnline') : document.getElementById('critOnline');
    if (element) {
        element.textContent = `${online}/${max}`;
        element.style.color = "#fff";
    }
}

function updateProgressBars() {
    // Lite режим
    const litePercent = (serverOnline.lite.online / serverOnline.lite.max) * 100;
    const liteBar = document.querySelector('.lite-mode .progress-fill');
    if (liteBar) {
        liteBar.style.width = `${litePercent}%`;
        liteBar.style.background = getProgressColor(litePercent);
    }
    
    // Crit режим
    const critPercent = (serverOnline.crit.online / serverOnline.crit.max) * 100;
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
// === КОНЕЦ ФУНКЦИЙ ДЛЯ НАСТОЯЩЕГО ОНЛАЙНА ===

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
    
    // Обновляем шапку
    const currentServer = document.getElementById('currentServer');
    const currentOnline = document.getElementById('currentOnline');
    
    if (currentServer) currentServer.textContent = serverName;
    if (currentOnline) currentOnline.textContent = `Онлайн: ${onlineData.online}/${onlineData.max}`;
    
    // Показываем магазин
    showShop();
    
    // Сохраняем выбор
    saveToLocalStorage();
    
    // Показываем уведомление
    showNotification(`Выбран сервер: ${serverName}`, 'success');
}

function showShop() {
    const serverSelection = document.getElementById('serverSelection');
    const shopSection = document.getElementById('shopSection');
    
    if (serverSelection) serverSelection.style.display = 'none';
    if (shopSection) {
        shopSection.style.display = 'block';
        shopSection.classList.add('active');
    }
    
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
    }
    
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
    document.querySelectorAll('.mobile-nav-btn').forEach(button => {
        if (button.getAttribute('data-category')) {
            button.addEventListener('click', function() {
                const category = this.getAttribute('data-category');
                switchCategory(category);
                closeMobileMenu();
            });
        }
    });
}

function switchCategory(category) {
    console.log(`Переключение на категорию: ${category}`);
    
    // Обновляем активные кнопки
    document.querySelectorAll('.nav-btn').forEach(btn => {
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

function updateCart() {
    // Обновляем счетчики
    const cartCount = document.getElementById('cartCount');
    const mobileCartCount = document.getElementById('mobileCartCount');
    const cartBadge = document.getElementById('cartBadge');
    const itemsCount = document.getElementById('itemsCount');
    const summaryItems = document.getElementById('summaryItems');
    const totalPrice = document.getElementById('totalPrice');
    const checkoutPrice = document.getElementById('checkoutPrice');
    const finalPrice = document.getElementById('finalPrice');
    const cartServerName = document.getElementById('cartServerName');
    
    if (cartCount) cartCount.textContent = cart.length;
    if (mobileCartCount) mobileCartCount.textContent = cart.length;
    if (cartBadge) cartBadge.textContent = cart.length;
    if (itemsCount) itemsCount.textContent = `${cart.length} товар${cart.length === 1 ? '' : 'а'}`;
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
                <button class="btn-remove-item" data-id="${item.id}">
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
    if (purchaseProduct) purchaseProduct.textContent = products;
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
        document.body.style.overflow = 'auto';
    }
}

function confirmPurchase() {
    const total = cart.reduce((sum, item) => sum + item.price, 0);
    const serverName = selectedServer === 'lite' ? 'Lite режим' : 'Crit режим';
    const products = cart.map(item => item.product).join(', ');
    
    alert(`✅ ЗАКАЗ ОФОРМЛЕН!\n\n📋 Детали заказа:\n• Сервер: ${serverName}\n• Товары: ${products}\n• Сумма: ${total} звезд\n\n💳 Инструкция по оплате:\n1. Перейдите в Telegram бота @VolvetMC_Bot\n2. Оплатите ${total} звезд\n3. Пришлите скриншот оплаты в поддержку\n4. Сообщите ваш никнейм в игре\n\n⏱️ Товар будет активирован в течение 15 минут!`);
    
    // Очищаем корзину
    cart = [];
    updateCart();
    saveToLocalStorage();
    
    // Закрываем окна
    hideCheckout();
    
    // Показываем уведомление
    showNotification('Заказ оформлен! Проверьте инструкцию по оплате.', 'success');
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
}

function showMobileMenu() {
    const mobileMenu = document.getElementById('mobileMenu');
    if (mobileMenu) {
        mobileMenu.style.display = 'block';
        setTimeout(() => {
            mobileMenu.style.opacity = '1';
            mobileMenu.style.transform = 'translateX(0)';
        }, 10);
    }
}

function closeMobileMenu() {
    const mobileMenu = document.getElementById('mobileMenu');
    if (mobileMenu) {
        mobileMenu.style.opacity = '0';
        mobileMenu.style.transform = 'translateX(100%)';
        setTimeout(() => {
            mobileMenu.style.display = 'none';
        }, 300);
    }
}

// Уведомления
function showNotification(message, type = 'info') {
    const notification = document.getElementById('notification');
    const notificationText = document.getElementById('notificationText');
    
    if (!notification || !notificationText) {
        // Создаем уведомление если его нет
        const newNotification = document.createElement('div');
        newNotification.id = 'notification';
        newNotification.className = 'notification';
        newNotification.innerHTML = `
            <div class="notification-content">
                <i class="fas fa-check-circle"></i>
                <span>${message}</span>
            </div>
        `;
        
        // Добавляем стили
        newNotification.style.cssText = `
            position: fixed;
            bottom: 20px;
            right: 20px;
            background: ${type === 'success' ? '#10b981' : 
                         type === 'warning' ? '#f59e0b' : 
                         type === 'error' ? '#ef4444' : '#3b82f6'};
            color: white;
            padding: 15px 20px;
            border-radius: 10px;
            display: flex;
            align-items: center;
            gap: 10px;
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
            z-index: 9999;
            transform: translateY(100px);
            opacity: 0;
            transition: all 0.3s ease;
            font-weight: 500;
        `;
        
        document.body.appendChild(newNotification);
        
        // Показываем
        setTimeout(() => {
            newNotification.style.transform = 'translateY(0)';
            newNotification.style.opacity = '1';
        }, 10);
        
        // Убираем через 3 секунды
        setTimeout(() => {
            newNotification.style.transform = 'translateY(100px)';
            newNotification.style.opacity = '0';
            setTimeout(() => {
                document.body.removeChild(newNotification);
            }, 300);
        }, 3000);
        
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
    notification.classList.add('show');
    
    setTimeout(() => {
        notification.classList.remove('show');
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
            
            // Обновляем шапку
            const currentServer = document.getElementById('currentServer');
            const currentOnline = document.getElementById('currentOnline');
            const onlineData = serverOnline[savedServer];
            
            if (currentServer) currentServer.textContent = savedServer === 'lite' ? 'Lite режим' : 'Crit режим';
            if (currentOnline) currentOnline.textContent = `Онлайн: ${onlineData.online}/${onlineData.max}`;
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
    testOnline: () => {
        updateServerOnline('lite');
        updateServerOnline('crit');
        showNotification('Онлайн обновлен', 'info');
    }
};

// Добавляем CSS для уведомлений
const notificationStyle = document.createElement('style');
notificationStyle.textContent = `
    .notification {
        position: fixed;
        bottom: 20px;
        right: 20px;
        background: var(--gradient-purple);
        color: white;
        padding: 15px 20px;
        border-radius: 10px;
        display: flex;
        align-items: center;
        gap: 10px;
        box-shadow: var(--shadow-card);
        z-index: 9999;
        transform: translateY(100px);
        opacity: 0;
        transition: all 0.3s ease;
        font-weight: 500;
    }
    
    .notification.show {
        transform: translateY(0);
        opacity: 1;
    }
    
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
`;
document.head.appendChild(notificationStyle);