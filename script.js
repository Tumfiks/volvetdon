/* CSS переменные для фиолетовой темы */
:root {
    --primary-bg: #0f0b1a;
    --secondary-bg: #1a1525;
    --accent-1: #7c3aed;
    --accent-2: #a855f7;
    --accent-3: #c084fc;
    --text-primary: #f8fafc;
    --text-secondary: #cbd5e1;
    --gradient-purple: linear-gradient(135deg, #7c3aed 0%, #a855f7 50%, #c084fc 100%);
    --gradient-blue: linear-gradient(135deg, #3b82f6 0%, #6366f1 50%, #8b5cf6 100%);
    --gradient-red: linear-gradient(135deg, #ef4444 0%, #f97316 50%, #ec4899 100%);
    --shadow-glow: 0 0 20px rgba(124, 58, 237, 0.3);
    --shadow-card: 0 10px 30px rgba(0, 0, 0, 0.5);
    --transition: all 0.3s ease;
}

/* Сброс и базовые стили */
* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

body {
    font-family: 'Montserrat', sans-serif;
    background: var(--primary-bg);
    color: var(--text-primary);
    line-height: 1.6;
    min-height: 100vh;
    overflow-x: hidden;
}

.container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 20px;
}

/* Шапка сайта */
.header {
    background: rgba(26, 21, 37, 0.95);
    backdrop-filter: blur(10px);
    padding: 15px 0;
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    z-index: 1000;
    box-shadow: 0 5px 20px rgba(0, 0, 0, 0.3);
    border-bottom: 1px solid rgba(124, 58, 237, 0.2);
}

.header .container {
    display: flex;
    justify-content: space-between;
    align-items: center;
    min-height: 60px;
}

.logo h1 {
    background: var(--gradient-purple);
    -webkit-background-clip: text;
    background-clip: text;
    color: transparent;
    font-size: 24px;
    font-weight: 800;
    display: flex;
    align-items: center;
    gap: 10px;
    white-space: nowrap;
}

.logo i {
    color: var(--accent-2);
}

.server-info {
    display: flex;
    align-items: center;
    gap: 15px;
}

.selected-server, .online-status {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 8px 15px;
    background: rgba(124, 58, 237, 0.1);
    border-radius: 10px;
    border: 1px solid rgba(124, 58, 237, 0.3);
    font-size: 14px;
    white-space: nowrap;
}

.selected-server i, .online-status i {
    color: var(--accent-2);
}

.btn-change-server {
    background: var(--gradient-purple);
    color: white;
    border: none;
    padding: 10px 15px;
    border-radius: 10px;
    cursor: pointer;
    font-weight: 600;
    transition: var(--transition);
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 14px;
    white-space: nowrap;
}

.btn-change-server:hover {
    transform: translateY(-2px);
    box-shadow: var(--shadow-glow);
}

.cart-icon {
    position: relative;
    font-size: 20px;
    color: var(--accent-2);
    cursor: pointer;
    transition: var(--transition);
    display: flex;
    align-items: center;
    justify-content: center;
    width: 40px;
    height: 40px;
}

.cart-icon:hover {
    color: var(--accent-3);
    transform: scale(1.1);
}

.cart-count {
    position: absolute;
    top: -5px;
    right: -5px;
    background: #ef4444;
    color: white;
    font-size: 12px;
    width: 20px;
    height: 20px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: bold;
}

/* Главный экран - Выбор сервера */
.server-selection {
    min-height: 100vh;
    display: flex;
    align-items: center;
    padding: 100px 0 40px;
    opacity: 1;
    transform: translateY(0);
}

.selection-title {
    text-align: center;
    margin-bottom: 50px;
    padding: 0 20px;
}

.selection-title h2 {
    font-size: 36px;
    margin-bottom: 10px;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 15px;
    flex-wrap: wrap;
}

.selection-title p {
    color: var(--text-secondary);
    font-size: 18px;
}

.server-cards {
    display: flex;
    justify-content: center;
    gap: 30px;
    flex-wrap: wrap;
    padding: 0 20px;
}

.server-card {
    background: rgba(255, 255, 255, 0.05);
    border-radius: 20px;
    padding: 30px;
    width: 100%;
    max-width: 380px;
    text-align: center;
    transition: var(--transition);
    border: 1px solid rgba(255, 255, 255, 0.1);
    position: relative;
}

.server-card::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 4px;
    border-radius: 20px 20px 0 0;
}

.lite-mode::before {
    background: var(--gradient-blue);
}

.crit-mode::before {
    background: var(--gradient-red);
}

.server-card:hover {
    transform: translateY(-5px);
    box-shadow: var(--shadow-card);
}

.server-icon {
    font-size: 50px;
    margin-bottom: 15px;
}

.lite-mode .server-icon {
    color: #3b82f6;
}

.crit-mode .server-icon {
    color: #ef4444;
}

.server-card h3 {
    font-size: 28px;
    margin-bottom: 15px;
    line-height: 1.2;
}

.online-display {
    font-size: 20px;
    margin-bottom: 10px;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 10px;
}

.online-display i {
    color: #10b981;
}

.progress-bar {
    height: 6px;
    background: rgba(255, 255, 255, 0.1);
    border-radius: 3px;
    margin: 15px 0;
    overflow: hidden;
}

.progress-fill {
    height: 100%;
    border-radius: 3px;
    transition: width 0.5s ease;
}

.lite-mode .progress-fill {
    background: var(--gradient-blue);
}

.crit-mode .progress-fill {
    background: var(--gradient-red);
}

.server-features {
    text-align: left;
    margin: 20px 0;
}

.server-features p {
    margin: 8px 0;
    display: flex;
    align-items: center;
    gap: 10px;
    color: var(--text-secondary);
    font-size: 14px;
}

.server-features i {
    color: #10b981;
}

.btn-select-server {
    background: var(--gradient-purple);
    color: white;
    border: none;
    padding: 12px 30px;
    border-radius: 10px;
    font-size: 16px;
    font-weight: 600;
    cursor: pointer;
    transition: var(--transition);
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 10px;
    width: 100%;
    margin-top: 20px;
}

.btn-select-server:hover {
    transform: translateY(-2px);
    box-shadow: var(--shadow-glow);
}

.lite-mode .btn-select-server {
    background: var(--gradient-blue);
}

.crit-mode .btn-select-server {
    background: var(--gradient-red);
}

/* Магазин */
.shop {
    display: none;
    padding: 100px 0 40px;
    min-height: 100vh;
}

.shop.active {
    display: block;
}

.shop-nav {
    display: flex;
    justify-content: center;
    gap: 10px;
    margin-bottom: 30px;
    background: rgba(26, 21, 37, 0.8);
    padding: 10px;
    border-radius: 10px;
    flex-wrap: wrap;
    overflow-x: auto;
    -webkit-overflow-scrolling: touch;
    scrollbar-width: none;
    -ms-overflow-style: none;
}

.shop-nav::-webkit-scrollbar {
    display: none;
}

.nav-btn {
    background: rgba(124, 58, 237, 0.1);
    color: var(--text-secondary);
    border: 2px solid transparent;
    padding: 10px 20px;
    border-radius: 8px;
    font-size: 14px;
    font-weight: 600;
    cursor: pointer;
    transition: var(--transition);
    display: flex;
    align-items: center;
    gap: 8px;
    white-space: nowrap;
    flex-shrink: 0;
}

.nav-btn:hover {
    background: rgba(124, 58, 237, 0.2);
    color: var(--text-primary);
}

.nav-btn.active {
    background: var(--gradient-purple);
    color: white;
    border-color: var(--accent-2);
}

.category-content {
    display: none;
}

.category-content.active {
    display: block;
}

.category-title {
    font-size: 28px;
    margin-bottom: 20px;
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 0 10px;
}

/* Карточки товаров */
.products-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
    gap: 20px;
    margin-bottom: 40px;
    padding: 0 10px;
}

.product-card {
    background: rgba(255, 255, 255, 0.05);
    border-radius: 15px;
    padding: 20px;
    transition: var(--transition);
    border: 1px solid rgba(255, 255, 255, 0.1);
    position: relative;
}

.product-card:hover {
    transform: translateY(-5px);
    border-color: var(--accent-2);
}

.product-card.popular {
    border: 2px solid var(--accent-2);
}

.product-card.vip {
    border: 2px solid #fbbf24;
}

.product-badge {
    position: absolute;
    top: -10px;
    right: 15px;
    background: var(--gradient-purple);
    color: white;
    padding: 4px 12px;
    border-radius: 15px;
    font-size: 11px;
    font-weight: 600;
}

.popular .product-badge {
    background: var(--accent-2);
}

.vip .product-badge {
    background: #fbbf24;
}

.product-card h3 {
    font-size: 20px;
    margin-bottom: 10px;
    display: flex;
    align-items: center;
    gap: 8px;
    line-height: 1.3;
}

.product-price {
    font-size: 18px;
    color: #fbbf24;
    margin-bottom: 15px;
    display: flex;
    align-items: center;
    gap: 5px;
}

.product-features {
    list-style: none;
    margin-bottom: 20px;
}

.product-features li {
    margin-bottom: 8px;
    display: flex;
    align-items: center;
    gap: 10px;
    font-size: 14px;
    color: var(--text-secondary);
    line-height: 1.4;
}

.product-features i {
    color: var(--accent-2);
    width: 20px;
    flex-shrink: 0;
}

.btn-buy {
    background: var(--gradient-purple);
    color: white;
    border: none;
    padding: 12px;
    border-radius: 8px;
    font-size: 14px;
    font-weight: 600;
    cursor: pointer;
    transition: var(--transition);
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    min-height: 44px;
}

.btn-buy:hover {
    transform: translateY(-2px);
    box-shadow: var(--shadow-glow);
}

/* Карточки наборов */
.kit-card {
    border: 2px solid rgba(124, 58, 237, 0.3);
}

.kit-card .product-features li i {
    color: #10b981;
}

/* === КРАСИВАЯ КОРЗИНА === */

/* Модальное окно корзины */
.cart-modal {
    display: none;
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 2000;
}

.cart-modal.show {
    display: block;
}

.cart-modal-overlay {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(15, 11, 26, 0.95);
    backdrop-filter: blur(10px);
    animation: fadeIn 0.3s ease;
}

.cart-modal-content {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background: var(--secondary-bg);
    width: 95%;
    max-width: 480px;
    max-height: 90vh;
    border-radius: 20px;
    border: 1px solid rgba(124, 58, 237, 0.3);
    box-shadow: 0 25px 50px rgba(0, 0, 0, 0.5);
    overflow: hidden;
    animation: slideIn 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}

/* Заголовок корзины */
.cart-header {
    background: var(--gradient-purple);
    padding: 20px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.cart-header-main {
    display: flex;
    align-items: center;
    gap: 15px;
}

.cart-icon-header {
    position: relative;
    width: 50px;
    height: 50px;
    background: rgba(255, 255, 255, 0.1);
    border-radius: 12px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 24px;
    color: white;
    flex-shrink: 0;
}

.cart-badge {
    position: absolute;
    top: -8px;
    right: -8px;
    background: #ef4444;
    color: white;
    font-size: 12px;
    font-weight: bold;
    width: 24px;
    height: 24px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    border: 2px solid var(--secondary-bg);
}

.cart-title h3 {
    font-size: 22px;
    font-weight: 700;
    color: white;
    margin: 0 0 5px 0;
    line-height: 1.2;
}

.cart-title p {
    font-size: 14px;
    color: rgba(255, 255, 255, 0.8);
    margin: 0;
}

.cart-close-btn {
    background: rgba(255, 255, 255, 0.1);
    border: none;
    width: 40px;
    height: 40px;
    border-radius: 10px;
    color: white;
    font-size: 18px;
    cursor: pointer;
    transition: all 0.3s ease;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
}

.cart-close-btn:hover {
    background: rgba(255, 255, 255, 0.2);
    transform: rotate(90deg);
}

/* Информация о сервере */
.cart-server-info {
    padding: 15px 20px;
    background: rgba(124, 58, 237, 0.05);
    border-bottom: 1px solid rgba(255, 255, 255, 0.05);
}

.server-info-card {
    display: flex;
    align-items: center;
    gap: 15px;
    padding: 12px;
    background: rgba(255, 255, 255, 0.05);
    border-radius: 12px;
    border: 1px solid rgba(124, 58, 237, 0.2);
}

.server-info-card i {
    font-size: 20px;
    color: var(--accent-2);
    width: 40px;
    height: 40px;
    background: rgba(124, 58, 237, 0.1);
    border-radius: 10px;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
}

.server-info-content {
    flex: 1;
    min-width: 0;
}

.server-label {
    display: block;
    font-size: 12px;
    color: var(--text-secondary);
    margin-bottom: 4px;
}

.server-name {
    font-size: 16px;
    font-weight: 600;
    color: var(--text-primary);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}

/* Список товаров */
.cart-items-section {
    padding: 20px;
    max-height: 250px;
    overflow-y: auto;
    -webkit-overflow-scrolling: touch;
}

.section-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 15px;
}

.section-header h4 {
    font-size: 18px;
    font-weight: 600;
    color: var(--text-primary);
    display: flex;
    align-items: center;
    gap: 10px;
}

.section-header h4 i {
    color: var(--accent-2);
}

.items-count {
    font-size: 14px;
    color: var(--text-secondary);
    background: rgba(124, 58, 237, 0.1);
    padding: 5px 12px;
    border-radius: 20px;
    white-space: nowrap;
}

/* Элементы корзины */
.cart-items {
    display: flex;
    flex-direction: column;
    gap: 12px;
}

.cart-item {
    background: rgba(255, 255, 255, 0.05);
    border-radius: 12px;
    padding: 15px;
    border: 1px solid rgba(255, 255, 255, 0.1);
    transition: all 0.3s ease;
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 15px;
}

.cart-item:hover {
    border-color: var(--accent-2);
}

.cart-item-info {
    flex: 1;
    min-width: 0;
}

.cart-item-name {
    font-size: 16px;
    font-weight: 600;
    color: var(--text-primary);
    margin-bottom: 5px;
    display: flex;
    align-items: center;
    gap: 8px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}

.cart-item-name i {
    color: var(--accent-2);
    font-size: 14px;
    flex-shrink: 0;
}

.cart-item-server {
    font-size: 12px;
    color: var(--text-secondary);
    background: rgba(124, 58, 237, 0.1);
    padding: 2px 8px;
    border-radius: 10px;
    display: inline-block;
    white-space: nowrap;
}

.cart-item-price {
    display: flex;
    align-items: center;
    gap: 15px;
    flex-shrink: 0;
}

.cart-item-amount {
    font-size: 18px;
    font-weight: 700;
    color: #fbbf24;
    display: flex;
    align-items: center;
    gap: 5px;
    white-space: nowrap;
}

.btn-remove-item {
    background: rgba(239, 68, 68, 0.1);
    border: none;
    width: 32px;
    height: 32px;
    border-radius: 8px;
    color: #ef4444;
    cursor: pointer;
    transition: all 0.3s ease;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
}

.btn-remove-item:hover {
    background: rgba(239, 68, 68, 0.2);
    transform: scale(1.1);
}

/* Пустая корзина */
.empty-cart {
    text-align: center;
    padding: 30px 20px;
}

.empty-cart-icon {
    width: 80px;
    height: 80px;
    background: rgba(124, 58, 237, 0.1);
    border-radius: 20px;
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 0 auto 20px;
    font-size: 36px;
    color: var(--accent-2);
}

.empty-cart h4 {
    font-size: 20px;
    font-weight: 600;
    color: var(--text-primary);
    margin-bottom: 10px;
}

.empty-cart p {
    color: var(--text-secondary);
    margin-bottom: 20px;
}

.btn-browse {
    background: var(--gradient-purple);
    color: white;
    border: none;
    padding: 12px 25px;
    border-radius: 10px;
    font-size: 14px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s ease;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 10px;
    margin: 0 auto;
    min-height: 44px;
}

.btn-browse:hover {
    transform: translateY(-2px);
    box-shadow: var(--shadow-glow);
}

/* Итоговая сумма */
.cart-summary {
    padding: 0 20px 20px;
}

.summary-card {
    background: rgba(255, 255, 255, 0.05);
    border-radius: 15px;
    padding: 20px;
    border: 1px solid rgba(124, 58, 237, 0.2);
}

.summary-header {
    margin-bottom: 15px;
}

.summary-header h4 {
    font-size: 18px;
    font-weight: 600;
    color: var(--text-primary);
    display: flex;
    align-items: center;
    gap: 10px;
}

.summary-header h4 i {
    color: var(--accent-2);
}

.summary-items {
    margin-bottom: 15px;
}

.summary-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 8px 0;
    border-bottom: 1px solid rgba(255, 255, 255, 0.05);
}

.summary-row:last-child {
    border-bottom: none;
}

.row-label {
    color: var(--text-secondary);
    font-size: 14px;
    white-space: nowrap;
}

.row-value {
    font-weight: 600;
    color: var(--text-primary);
    display: flex;
    align-items: center;
    gap: 5px;
    white-space: nowrap;
}

.row-value i {
    color: #fbbf24;
}

.summary-discount {
    background: rgba(59, 130, 246, 0.1);
    border-radius: 10px;
    padding: 12px;
    margin-top: 15px;
    display: flex;
    align-items: center;
    gap: 10px;
    font-size: 13px;
    color: #3b82f6;
    border: 1px solid rgba(59, 130, 246, 0.2);
    line-height: 1.4;
}

.summary-discount i {
    font-size: 14px;
    flex-shrink: 0;
}

.summary-total {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 15px;
    background: rgba(124, 58, 237, 0.1);
    border-radius: 10px;
    margin-top: 15px;
    border: 1px solid rgba(124, 58, 237, 0.2);
}

.total-label {
    font-size: 16px;
    font-weight: 600;
    color: var(--text-primary);
    white-space: nowrap;
}

.total-amount {
    font-size: 24px;
    font-weight: 700;
    color: #fbbf24;
    display: flex;
    align-items: center;
    gap: 8px;
    white-space: nowrap;
}

.total-amount i {
    font-size: 20px;
}

/* Кнопки действий */
.cart-actions {
    padding: 0 20px 20px;
    display: flex;
    gap: 15px;
}

.btn-clear-cart {
    flex: 1;
    background: rgba(239, 68, 68, 0.1);
    border: 1px solid rgba(239, 68, 68, 0.2);
    color: #ef4444;
    padding: 15px;
    border-radius: 12px;
    font-size: 14px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s ease;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 10px;
    min-height: 44px;
}

.btn-clear-cart:hover {
    background: rgba(239, 68, 68, 0.2);
    transform: translateY(-2px);
}

.btn-checkout {
    flex: 2;
    background: var(--gradient-purple);
    border: none;
    color: white;
    padding: 15px;
    border-radius: 12px;
    font-size: 14px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s ease;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 10px;
    position: relative;
    overflow: hidden;
    min-height: 44px;
}

.btn-checkout:hover {
    transform: translateY(-2px);
    box-shadow: var(--shadow-glow);
}

.checkout-price {
    background: rgba(255, 255, 255, 0.2);
    padding: 5px 12px;
    border-radius: 20px;
    font-weight: 700;
    white-space: nowrap;
}

/* Окно оформления заказа */
.checkout-modal {
    display: none;
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 2001;
}

.checkout-modal.show {
    display: block;
}

.checkout-modal-overlay {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(15, 11, 26, 0.98);
    backdrop-filter: blur(15px);
    animation: fadeIn 0.3s ease;
}

.checkout-modal-content {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background: var(--secondary-bg);
    width: 95%;
    max-width: 500px;
    max-height: 90vh;
    border-radius: 20px;
    border: 1px solid rgba(124, 58, 237, 0.3);
    box-shadow: 0 25px 50px rgba(0, 0, 0, 0.5);
    overflow: hidden;
    animation: slideIn 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}

.checkout-header {
    background: var(--gradient-purple);
    padding: 20px;
    display: flex;
    align-items: center;
    gap: 15px;
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.checkout-icon {
    width: 50px;
    height: 50px;
    background: rgba(255, 255, 255, 0.1);
    border-radius: 15px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 24px;
    color: white;
    flex-shrink: 0;
}

.checkout-title {
    flex: 1;
    min-width: 0;
}

.checkout-title h3 {
    font-size: 22px;
    font-weight: 700;
    color: white;
    margin: 0 0 5px 0;
    line-height: 1.2;
}

.checkout-title p {
    font-size: 14px;
    color: rgba(255, 255, 255, 0.8);
    margin: 0;
}

.checkout-close {
    background: rgba(255, 255, 255, 0.1);
    border: none;
    width: 40px;
    height: 40px;
    border-radius: 10px;
    color: white;
    font-size: 18px;
    cursor: pointer;
    transition: all 0.3s ease;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
}

.checkout-close:hover {
    background: rgba(255, 255, 255, 0.2);
    transform: rotate(90deg);
}

.checkout-details {
    padding: 20px;
}

.detail-card {
    background: rgba(255, 255, 255, 0.05);
    border-radius: 15px;
    padding: 20px;
    border: 1px solid rgba(124, 58, 237, 0.2);
}

.detail-item {
    display: flex;
    align-items: center;
    gap: 15px;
    padding: 12px 0;
    border-bottom: 1px solid rgba(255, 255, 255, 0.05);
}

.detail-item:last-child {
    border-bottom: none;
}

.detail-icon {
    width: 40px;
    height: 40px;
    background: rgba(124, 58, 237, 0.1);
    border-radius: 10px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: var(--accent-2);
    font-size: 18px;
    flex-shrink: 0;
}

.detail-content {
    flex: 1;
    min-width: 0;
}

.detail-label {
    display: block;
    font-size: 13px;
    color: var(--text-secondary);
    margin-bottom: 4px;
}

.detail-value {
    font-size: 16px;
    font-weight: 600;
    color: var(--text-primary);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}

.total-item .detail-value {
    color: #fbbf24;
    font-size: 20px;
    display: flex;
    align-items: center;
    gap: 5px;
}

.total-item .detail-value i {
    font-size: 18px;
}

.checkout-instruction {
    padding: 0 20px 20px;
}

.instruction-card {
    background: rgba(59, 130, 246, 0.1);
    border-radius: 15px;
    padding: 20px;
    border: 1px solid rgba(59, 130, 246, 0.2);
}

.instruction-header {
    display: flex;
    align-items: center;
    gap: 10px;
    margin-bottom: 20px;
}

.instruction-header i {
    font-size: 20px;
    color: #3b82f6;
}

.instruction-header h4 {
    font-size: 18px;
    font-weight: 600;
    color: #3b82f6;
    margin: 0;
}

.instruction-steps {
    display: flex;
    flex-direction: column;
    gap: 15px;
}

.step {
    display: flex;
    align-items: flex-start;
    gap: 12px;
}

.step-number {
    width: 30px;
    height: 30px;
    background: #3b82f6;
    color: white;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 14px;
    font-weight: 700;
    flex-shrink: 0;
}

.step-content {
    flex: 1;
    min-width: 0;
}

.step-content strong {
    display: block;
    font-size: 14px;
    color: white;
    margin-bottom: 5px;
    line-height: 1.3;
}

.step-content p {
    font-size: 14px;
    color: rgba(255, 255, 255, 0.8);
    margin: 0;
    line-height: 1.4;
}

.instruction-note {
    margin-top: 15px;
    padding: 12px;
    background: rgba(251, 191, 36, 0.1);
    border-radius: 10px;
    display: flex;
    align-items: flex-start;
    gap: 10px;
    color: #fbbf24;
    font-size: 13px;
    border: 1px solid rgba(251, 191, 36, 0.2);
    line-height: 1.4;
}

.instruction-note i {
    font-size: 14px;
    flex-shrink: 0;
    margin-top: 2px;
}

.checkout-actions {
    padding: 0 20px 20px;
    display: flex;
    gap: 15px;
}

.btn-cancel {
    flex: 1;
    background: rgba(255, 255, 255, 0.05);
    border: 1px solid rgba(255, 255, 255, 0.1);
    color: var(--text-secondary);
    padding: 15px;
    border-radius: 12px;
    font-size: 14px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s ease;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 10px;
    min-height: 44px;
}

.btn-cancel:hover {
    background: rgba(255, 255, 255, 0.1);
    color: var(--text-primary);
    transform: translateY(-2px);
}

.btn-confirm {
    flex: 2;
    background: var(--gradient-purple);
    border: none;
    color: white;
    padding: 15px;
    border-radius: 12px;
    font-size: 14px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s ease;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 10px;
    position: relative;
    overflow: hidden;
    min-height: 44px;
}

.btn-confirm:hover {
    transform: translateY(-2px);
    box-shadow: var(--shadow-glow);
}

/* Футер */
.footer {
    background: rgba(26, 21, 37, 0.95);
    padding: 30px 0 15px;
    margin-top: 40px;
    border-top: 1px solid rgba(124, 58, 237, 0.2);
}

.footer-content {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 20px;
    text-align: center;
}

.footer-logo h3 {
    font-size: 20px;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 10px;
    margin-bottom: 5px;
}

.footer-logo p {
    color: var(--text-secondary);
    font-size: 14px;
}

.footer-links {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    gap: 15px;
}

.footer-links a {
    color: var(--text-secondary);
    text-decoration: none;
    font-size: 14px;
    display: flex;
    align-items: center;
    gap: 8px;
    transition: var(--transition);
    white-space: nowrap;
}

.footer-links a:hover {
    color: var(--accent-2);
}

.footer-info {
    width: 100%;
}

.footer-info .warning {
    color: #fbbf24;
    font-size: 14px;
    font-weight: 600;
    padding: 10px 20px;
    background: rgba(251, 191, 36, 0.1);
    border-radius: 10px;
    display: inline-block;
    line-height: 1.4;
}

/* Уведомление */
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
    z-index: 3000;
    transform: translateY(100px);
    opacity: 0;
    transition: all 0.3s ease;
    font-weight: 500;
    max-width: calc(100vw - 40px);
}

.notification.show {
    transform: translateY(0);
    opacity: 1;
}

/* Анимации */
@keyframes fadeIn {
    from {
        opacity: 0;
    }
    to {
        opacity: 1;
    }
}

@keyframes slideIn {
    from {
        opacity: 0;
        transform: translate(-50%, -60%);
    }
    to {
        opacity: 1;
        transform: translate(-50%, -50%);
    }
}

/* ============================================= */
/* АДАПТИВНОСТЬ ПОД РАЗНЫЕ УСТРОЙСТВА */
/* ============================================= */

/* Большие планшеты и маленькие ноутбуки (1024px и меньше) */
@media (max-width: 1024px) {
    .container {
        padding: 0 15px;
    }
    
    .server-card {
        max-width: 340px;
    }
    
    .products-grid {
        grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
    }
}

/* Планшеты (768px и меньше) */
@media (max-width: 768px) {
    .header .container {
        padding: 0 15px;
        min-height: 70px;
    }
    
    .logo h1 {
        font-size: 20px;
    }
    
    .selected-server, .online-status {
        display: none;
    }
    
    .btn-change-server {
        display: none;
    }
    
    .server-info {
        gap: 10px;
    }
    
    .selection-title h2 {
        font-size: 28px;
    }
    
    .selection-title p {
        font-size: 16px;
    }
    
    .server-cards {
        gap: 20px;
    }
    
    .server-card {
        padding: 25px 20px;
    }
    
    .server-card h3 {
        font-size: 24px;
    }
    
    .online-display {
        font-size: 18px;
    }
    
    .shop-nav {
        justify-content: flex-start;
        padding: 8px;
    }
    
    .nav-btn {
        padding: 10px 15px;
        font-size: 13px;
    }
    
    .category-title {
        font-size: 24px;
    }
    
    .products-grid {
        grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
        gap: 15px;
    }
    
    .product-card {
        padding: 15px;
    }
    
    .product-card h3 {
        font-size: 18px;
    }
    
    .product-price {
        font-size: 16px;
    }
    
    .product-features li {
        font-size: 13px;
    }
    
    .cart-modal-content,
    .checkout-modal-content {
        width: 95%;
        max-width: 95%;
        margin: 10px;
    }
    
    .cart-actions,
    .checkout-actions {
        flex-direction: column;
    }
    
    .btn-clear-cart,
    .btn-checkout,
    .btn-cancel,
    .btn-confirm {
        width: 100%;
    }
    
    .footer-links {
        flex-direction: column;
        align-items: center;
        gap: 10px;
    }
}

/* Мобильные телефоны (480px и меньше) */
@media (max-width: 480px) {
    .header .container {
        padding: 0 10px;
        min-height: 60px;
    }
    
    .logo h1 {
        font-size: 18px;
    }
    
    .cart-icon {
        width: 36px;
        height: 36px;
        font-size: 18px;
    }
    
    .cart-count {
        width: 18px;
        height: 18px;
        font-size: 11px;
        top: -4px;
        right: -4px;
    }
    
    .server-selection {
        padding: 80px 0 30px;
    }
    
    .selection-title h2 {
        font-size: 24px;
    }
    
    .selection-title p {
        font-size: 14px;
    }
    
    .server-card {
        padding: 20px 15px;
        margin: 0 10px;
    }
    
    .server-card h3 {
        font-size: 22px;
    }
    
    .server-icon {
        font-size: 40px;
    }
    
    .online-display {
        font-size: 16px;
    }
    
    .server-features p {
        font-size: 13px;
    }
    
    .btn-select-server {
        padding: 10px 20px;
        font-size: 15px;
    }
    
    .shop {
        padding-top: 80px;
    }
    
    .nav-btn {
        padding: 8px 12px;
        font-size: 12px;
    }
    
    .category-title {
        font-size: 20px;
    }
    
    .products-grid {
        grid-template-columns: 1fr;
        padding: 0 5px;
    }
    
    .product-card {
        padding: 15px;
    }
    
    .product-card h3 {
        font-size: 17px;
    }
    
    .product-price {
        font-size: 15px;
    }
    
    .btn-buy {
        padding: 10px;
        font-size: 13px;
    }
    
    .cart-header,
    .cart-server-info,
    .cart-items-section,
    .cart-summary,
    .cart-actions,
    .checkout-header,
    .checkout-details,
    .checkout-instruction,
    .checkout-actions {
        padding: 15px;
    }
    
    .cart-title h3 {
        font-size: 18px;
    }
    
    .cart-icon-header {
        width: 40px;
        height: 40px;
        font-size: 20px;
    }
    
    .cart-badge {
        width: 20px;
        height: 20px;
        font-size: 11px;
        top: -6px;
        right: -6px;
    }
    
    .cart-item {
        flex-direction: column;
        align-items: stretch;
        gap: 10px;
    }
    
    .cart-item-price {
        width: 100%;
        justify-content: space-between;
    }
    
    .checkout-header {
        flex-direction: column;
        text-align: center;
        gap: 10px;
    }
    
    .checkout-icon {
        width: 40px;
        height: 40px;
        font-size: 20px;
    }
    
    .checkout-title h3 {
        font-size: 20px;
    }
    
    .detail-item {
        gap: 10px;
    }
    
    .detail-icon {
        width: 36px;
        height: 36px;
        font-size: 16px;
    }
    
    .detail-label {
        font-size: 12px;
    }
    
    .detail-value {
        font-size: 15px;
    }
    
    .total-item .detail-value {
        font-size: 18px;
    }
    
    .instruction-card {
        padding: 15px;
    }
    
    .instruction-header h4 {
        font-size: 16px;
    }
    
    .instruction-steps {
        gap: 12px;
    }
    
    .step {
        gap: 10px;
    }
    
    .step-number {
        width: 26px;
        height: 26px;
        font-size: 12px;
    }
    
    .step-content strong,
    .step-content p {
        font-size: 13px;
    }
    
    .instruction-note {
        font-size: 12px;
        padding: 10px;
    }
    
    .footer {
        padding: 25px 0 15px;
    }
    
    .footer-logo h3 {
        font-size: 18px;
    }
    
    .footer-info .warning {
        font-size: 13px;
        padding: 8px 15px;
    }
    
    .notification {
        left: 20px;
        right: 20px;
        max-width: calc(100vw - 40px);
    }
}

/* Очень маленькие телефоны (360px и меньше) */
@media (max-width: 360px) {
    .logo h1 {
        font-size: 16px;
    }
    
    .server-card {
        padding: 15px 12px;
    }
    
    .server-card h3 {
        font-size: 20px;
    }
    
    .server-features p {
        font-size: 12px;
    }
    
    .nav-btn {
        padding: 6px 10px;
        font-size: 11px;
    }
    
    .product-features li {
        font-size: 12px;
    }
    
    .cart-item-name {
        font-size: 15px;
    }
    
    .cart-item-amount {
        font-size: 16px;
    }
    
    .total-amount {
        font-size: 20px;
    }
    
    .checkout-price {
        font-size: 12px;
        padding: 4px 8px;
    }
}

/* Портретная ориентация на мобильных */
@media (max-height: 600px) and (orientation: portrait) {
    .server-selection,
    .shop {
        padding: 70px 0 20px;
        min-height: auto;
    }
    
    .cart-modal-content,
    .checkout-modal-content {
        max-height: 85vh;
    }
    
    .cart-items-section {
        max-height: 200px;
    }
}

/* Ландшафтная ориентация на мобильных */
@media (max-height: 500px) and (orientation: landscape) {
    .header {
        padding: 10px 0;
    }
    
    .server-selection {
        padding: 60px 0 15px;
    }
    
    .server-card {
        padding: 15px;
        max-width: 300px;
    }
    
    .cart-modal-content,
    .checkout-modal-content {
        max-height: 80vh;
    }
    
    .cart-items-section {
        max-height: 150px;
    }
}

/* Улучшение для касаний на мобильных */
@media (hover: none) and (pointer: coarse) {
    .btn-select-server,
    .btn-buy,
    .nav-btn,
    .btn-change-server,
    .btn-checkout,
    .btn-confirm,
    .btn-cancel,
    .btn-clear-cart,
    .btn-browse {
        min-height: 44px;
    }
    
    .cart-icon,
    .btn-remove-item,
    .cart-close-btn,
    .checkout-close {
        min-width: 44px;
        min-height: 44px;
    }
    
    .product-card:hover,
    .server-card:hover,
    .cart-item:hover {
        transform: none;
    }
    
    .btn-select-server:hover,
    .btn-buy:hover,
    .btn-change-server:hover,
    .btn-checkout:hover,
    .btn-confirm:hover,
    .btn-cancel:hover,
    .btn-clear-cart:hover,
    .btn-browse:hover {
        transform: translateY(0);
    }
}
