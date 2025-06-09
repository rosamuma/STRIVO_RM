// script.js

// Datos de productos
const products = {
    1: {
        id: 1,
        name: 'Tenis Courtblock Bold - Mujer Sportwear',
        color: 'Rosa palo',
        size: 'S',
        price: 279999,
        image: '../image/zapatos2.jpg',
        description: 'Tenis deportivos cómodos y elegantes, perfectos para el uso diario y actividades deportivas.',
        brand: 'Adidas',
        material: 'Sintético y textil',
        category: 'Calzado deportivo'
    },
    2: {
        id: 2,
        name: 'Chaqueta de tejido Woven - Mujer adidas',
        color: 'rojo',
        size: 'XL',
        price: 495999,
        image: '../image/chaqueta.jpg',
        description: 'Chaqueta de tejido resistente, ideal para días frescos y actividades al aire libre.',
        brand: 'Adidas',
        material: '100% Poliéster',
        category: 'Ropa deportiva'
    }
};

// Estado del carrito
let cartState = {
    items: [
        { id: 1, quantity: 2 },
        { id: 2, quantity: 1 }
    ],
    promoCode: null,
    promoDiscount: 0
};

// Códigos promocionales válidos
const promoCodes = {
    'DESCUENTO10': 0.10,
    'WELCOME20': 0.20,
    'STRIVO15': 0.15,
    'VERANO25': 0.25
};

// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', function() {
    updateCartDisplay();
    setupEventListeners();
});

// Configurar event listeners
function setupEventListeners() {
    // Event listeners para botones de cantidad
    document.addEventListener('click', function(e) {
        if (e.target.classList.contains('quantity-btn')) {
            handleQuantityChange(e);
        }
        
        if (e.target.classList.contains('remove-item')) {
            e.preventDefault();
            handleRemoveItem(e);
        }
        
        if (e.target.classList.contains('view-details')) {
            e.preventDefault();
            handleViewDetails(e);
        }
    });
}

// Manejar cambios de cantidad
function handleQuantityChange(e) {
    const action = e.target.dataset.action;
    const cartItem = e.target.closest('.cart-item');
    const productId = parseInt(cartItem.dataset.id);
    const quantitySpan = cartItem.querySelector('.quantity');
    let currentQuantity = parseInt(quantitySpan.textContent);
    
    if (action === 'increase') {
        currentQuantity++;
    } else if (action === 'decrease' && currentQuantity > 1) {
        currentQuantity--;
    }
    
    // Actualizar el estado del carrito
    const cartItemIndex = cartState.items.findIndex(item => item.id === productId);
    if (cartItemIndex !== -1) {
        cartState.items[cartItemIndex].quantity = currentQuantity;
    }
    
    quantitySpan.textContent = currentQuantity;
    updateCartDisplay();
    
    // Animación visual
    cartItem.style.transform = 'scale(1.02)';
    setTimeout(() => {
        cartItem.style.transform = 'scale(1)';
    }, 150);
}

// Manejar eliminación de productos
function handleRemoveItem(e) {
    const productId = parseInt(e.target.dataset.id);
    const cartItem = document.querySelector(`.cart-item[data-id="${productId}"]`);
    
    // Confirmar eliminación
    if (confirm('¿Estás seguro de que quieres eliminar este producto del carrito?')) {
        // Animación de salida
        cartItem.classList.add('fade-out');
        
        setTimeout(() => {
            // Eliminar del estado
            cartState.items = cartState.items.filter(item => item.id !== productId);
            
            // Eliminar del DOM
            cartItem.remove();
            
            updateCartDisplay();
            
            // Mostrar mensaje
            showNotification('Producto eliminado del carrito', 'success');
            
            // Si no hay más productos, mostrar mensaje vacío
            if (cartState.items.length === 0) {
                showEmptyCart();
            }
        }, 500);
    }
}

// Manejar vista de detalles
function handleViewDetails(e) {
    const productId = parseInt(e.target.dataset.id);
    const product = products[productId];
    
    if (product) {
        showProductDetails(product);
    }
}

// Mostrar detalles del producto en modal
function showProductDetails(product) {
    const modalBody = document.getElementById('productModalBody');
    const cartItem = cartState.items.find(item => item.id === product.id);
    const quantity = cartItem ? cartItem.quantity : 0;
    
    modalBody.innerHTML = `
        <div class="row">
            <div class="col-md-4">
                <img src="${product.image}" class="img-fluid rounded" alt="${product.name}">
            </div>
            <div class="col-md-8">
                <h5>${product.name}</h5>
                <p class="text-muted mb-2"><strong>Marca:</strong> ${product.brand}</p>
                <p class="text-muted mb-2"><strong>Color:</strong> ${product.color}</p>
                <p class="text-muted mb-2"><strong>Talla:</strong> ${product.size}</p>
                <p class="text-muted mb-2"><strong>Material:</strong> ${product.material}</p>
                <p class="text-muted mb-2"><strong>Categoría:</strong> ${product.category}</p>
                <p class="mb-3">${product.description}</p>
                <div class="d-flex justify-content-between align-items-center">
                    <span class="h5 text-danger mb-0">$${formatPrice(product.price)}</span>
                    <span class="text-muted">Cantidad en carrito: ${quantity}</span>
                </div>
            </div>
        </div>
    `;
    
    const modal = new bootstrap.Modal(document.getElementById('productModal'));
    modal.show();
}

// Aplicar código promocional
function applyPromoCode() {
    const promoInput = document.getElementById('promoInput');
    const promoCode = promoInput.value.trim().toUpperCase();
    const promoMessage = document.getElementById('promoMessage');
    
    if (promoCode === '') {
        showPromoMessage('Por favor ingresa un código promocional', 'danger');
        return;
    }
    
    if (promoCodes[promoCode]) {
        cartState.promoCode = promoCode;
        cartState.promoDiscount = promoCodes[promoCode];
        updateCartDisplay();
        showPromoMessage(`¡Código aplicado! Descuento del ${(promoCodes[promoCode] * 100)}%`, 'success');
        promoInput.value = '';
    } else {
        showPromoMessage('Código promocional inválido', 'danger');
    }
}

// Mostrar mensaje de código promocional
function showPromoMessage(message, type) {
    const promoMessage = document.getElementById('promoMessage');
    promoMessage.innerHTML = `<div class="alert alert-${type} py-2 px-3 mb-0">${message}</div>`;
    
    setTimeout(() => {
        promoMessage.innerHTML = '';
    }, 3000);
}

// Actualizar display del carrito
function updateCartDisplay() {
    const subtotal = calculateSubtotal();
    const promoDiscount = subtotal * cartState.promoDiscount;
    const subtotalAfterPromo = subtotal - promoDiscount;
    const iva = subtotalAfterPromo * 0.19;
    const shipping = 32999.45;
    const total = subtotalAfterPromo + iva + shipping;
    const totalItems = cartState.items.reduce((sum, item) => sum + item.quantity, 0);
    
    // Actualizar elementos del DOM
    document.getElementById('total-items').textContent = totalItems;
    document.getElementById('subtotal').textContent = `${formatPrice(subtotal)}`;
    document.getElementById('promo-discount').textContent = promoDiscount > 0 ? `-${formatPrice(promoDiscount)}` : '$0';
    document.getElementById('iva').textContent = `${formatPrice(iva)}`;
    document.getElementById('shipping').textContent = `${formatPrice(shipping)}`;
    document.getElementById('total').textContent = `${formatPrice(total)}`;
    
    // Actualizar badge del carrito
    const cartBadge = document.querySelector('.cart-badge');
    if (cartBadge) {
        cartBadge.textContent = totalItems;
    }
    
    // Cambiar color del descuento promocional
    const promoDiscountElement = document.getElementById('promo-discount');
    if (promoDiscount > 0) {
        promoDiscountElement.classList.add('text-success');
        promoDiscountElement.classList.remove('text-muted');
    } else {
        promoDiscountElement.classList.remove('text-success');
        promoDiscountElement.classList.add('text-muted');
    }
}

// Calcular subtotal
function calculateSubtotal() {
    return cartState.items.reduce((sum, item) => {
        const product = products[item.id];
        return sum + (product.price * item.quantity);
    }, 0);
}

// Formatear precio
function formatPrice(price) {
    return new Intl.NumberFormat('es-CO', {
        minimumFractionDigits: 0,
        maximumFractionDigits: 2
    }).format(price);
}

// Mostrar notificación
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `alert alert-${type} position-fixed`;
    notification.style.cssText = `
        top: 20px;
        right: 20px;
        z-index: 9999;
        min-width: 300px;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    `;
    notification.innerHTML = `
        <div class="d-flex justify-content-between align-items-center">
            <span>${message}</span>
            <button type="button" class="btn-close" onclick="this.parentElement.parentElement.remove()"></button>
        </div>
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        if (notification.parentElement) {
            notification.remove();
        }
    }, 4000);
}

// Mostrar carrito vacío
function showEmptyCart() {
    const cartItems = document.getElementById('cart-items');
    cartItems.innerHTML = `
        <div class="text-center py-5">
            <i class="fas fa-shopping-cart fa-3x text-muted mb-3"></i>
            <h5 class="text-muted">Tu carrito está vacío</h5>
            <p class="text-muted mb-4">¡Agrega algunos productos para comenzar!</p>
            <a href="../index.html" class="btn btn-dark">
                <i class="fas fa-arrow-left me-2"></i>Ir de compras
            </a>
        </div>
    `;
    
    // Ocultar el resumen si no hay productos
    const resumeCard = document.querySelector('.col-lg-4 .card');
    if (resumeCard) {
        resumeCard.style.display = 'none';
    }
}

// Proceder al checkout
function proceedToCheckout() {
    const selectedPaymentMethod = document.querySelector('input[name="paymentMethod"]:checked');
    
    if (!selectedPaymentMethod) {
        showNotification('Por favor selecciona un método de pago', 'warning');
        return;
    }
    
    if (cartState.items.length === 0) {
        showNotification('Tu carrito está vacío', 'warning');
        return;
    }
    
    // Simular proceso de checkout
    const checkoutBtn = document.querySelector('.btn-dark.w-100');
    const originalText = checkoutBtn.innerHTML;
    
    checkoutBtn.innerHTML = '<i class="fas fa-spinner fa-spin me-2"></i>Procesando...';
    checkoutBtn.disabled = true;
    
    setTimeout(() => {
        showNotification('¡Pedido procesado exitosamente! Serás redirigido al pago.', 'success');
        
        setTimeout(() => {
            // Aquí normalmente redirigiríamos a la página de pago
            // window.location.href = 'checkout.html';
            console.log('Redirigiendo al checkout...');
            
            // Restaurar botón
            checkoutBtn.innerHTML = originalText;
            checkoutBtn.disabled = false;
        }, 2000);
    }, 1500);
}

// Event listener para Enter en el campo de código promocional
document.addEventListener('DOMContentLoaded', function() {
    const promoInput = document.getElementById('promoInput');
    if (promoInput) {
        promoInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                applyPromoCode();
            }
        });
    }
});

// Función para remover código promocional
function removePromoCode() {
    cartState.promoCode = null;
    cartState.promoDiscount = 0;
    updateCartDisplay();
    showNotification('Código promocional removido', 'info');
}

// Función para guardar carrito (simulación)
function saveCart() {
    const cartData = {
        items: cartState.items,
        promoCode: cartState.promoCode,
        promoDiscount: cartState.promoDiscount,
        timestamp: new Date().toISOString()
    };
    
    // En una aplicación real, esto se enviaría al servidor
    console.log('Carrito guardado:', cartData);
}

// Función para cargar carrito (simulación)
function loadCart() {
    // En una aplicación real, esto cargaría del servidor o localStorage
    console.log('Carrito cargado');
}

// Event listeners adicionales
document.addEventListener('DOMContentLoaded', function() {
    // Tooltip para botones
    const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
    const tooltipList = tooltipTriggerList.map(function(tooltipTriggerEl) {
        return new bootstrap.Tooltip(tooltipTriggerEl);
    });
    
    // Confirmar salida si hay cambios
    window.addEventListener('beforeunload', function(e) {
        if (cartState.items.length > 0) {
            saveCart();
        }
    });
    
    // Actualizar display inicial
    updateCartDisplay();
});

// Función para agregar producto al carrito (para futuro uso)
function addToCart(productId, quantity = 1) {
    const existingItem = cartState.items.find(item => item.id === productId);
    
    if (existingItem) {
        existingItem.quantity += quantity;
    } else {
        cartState.items.push({ id: productId, quantity: quantity });
    }
    
    updateCartDisplay();
    showNotification('Producto agregado al carrito', 'success');
}

// Función para obtener información del carrito
function getCartInfo() {
    const subtotal = calculateSubtotal();
    const totalItems = cartState.items.reduce((sum, item) => sum + item.quantity, 0);
    
    return {
        items: cartState.items,
        totalItems: totalItems,
        subtotal: subtotal,
        promoCode: cartState.promoCode,
        promoDiscount: cartState.promoDiscount
    };
}

// Función de búsqueda (para la barra de búsqueda)
function performSearch() {
    const searchInput = document.querySelector('.search-input');
    const searchTerm = searchInput.value.trim();
    
    if (searchTerm) {
        showNotification(`Buscando: "${searchTerm}"`, 'info');
        // Aquí normalmente redirigiría a una página de resultados
        // window.location.href = `search.html?q=${encodeURIComponent(searchTerm)}`;
    }
}

// Event listener para búsqueda
document.addEventListener('DOMContentLoaded', function() {
    const searchInput = document.querySelector('.search-input');
    const searchIcon = document.querySelector('.search-icon');
    
    if (searchInput) {
        searchInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                performSearch();
            }
        });
    }
    
    if (searchIcon) {
        searchIcon.addEventListener('click', performSearch);
    }
});