document.addEventListener('DOMContentLoaded', function() {
    // Inicializar componentes
    initProductModal();
    initQuantityButtons();
    initAddToCartButtons();
    initSlideEffects();
});

/**
 * Inicializa el comportamiento del modal de productos
 * Actualiza la información del producto en el modal según el producto seleccionado
 */
function initProductModal() {
    // Obtener todos los botones "Ver detalles"
    const detailButtons = document.querySelectorAll('[data-bs-toggle="modal"]');
    
    // Agregar evento click a cada botón
    detailButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Obtener información del producto desde el contenedor padre
            const productCard = this.closest('.product-card');
            const productImage = productCard.querySelector('img').src;
            const productTitle = productCard.querySelector('.card-title').textContent;
            const productCategory = productCard.querySelector('.card-text').textContent;
            const productPrice = productCard.querySelector('.price').textContent;
            
            // Actualizar el modal con la información del producto
            document.getElementById('modalProductImage').src = productImage;
            document.getElementById('modalProductTitle').textContent = productTitle;
            document.getElementById('modalProductPrice').textContent = productPrice;
            
            // Reiniciar cantidad a 1
            document.getElementById('productQuantity').value = 1;
        });
    });
}

/**
 * Inicializa los botones de incremento y decremento de cantidad
 */
function initQuantityButtons() {
    // Botón para decrementar la cantidad
    document.getElementById('decreaseQuantity').addEventListener('click', function() {
        const quantityInput = document.getElementById('productQuantity');
        const currentValue = parseInt(quantityInput.value);
        
        // Asegurarse de que la cantidad no sea menor que 1
        if (currentValue > 1) {
            quantityInput.value = currentValue - 1;
        }
    });
    
    // Botón para incrementar la cantidad
    document.getElementById('increaseQuantity').addEventListener('click', function() {
        const quantityInput = document.getElementById('productQuantity');
        const currentValue = parseInt(quantityInput.value);
        
        // Incrementar la cantidad
        quantityInput.value = currentValue + 1;
    });
    
    // Validar entrada manual para asegurar que sea un número positivo
    document.getElementById('productQuantity').addEventListener('change', function() {
        if (this.value < 1 || isNaN(this.value)) {
            this.value = 1;
        }
    });
}

/**
 * Inicializa los botones "Añadir al carrito"
 */
function initAddToCartButtons() {
    // Botón en el modal
    const addToCartBtn = document.querySelector('.modal-body .btn-brown');
    
    addToCartBtn.addEventListener('click', function() {
        // Obtener información del producto
        const productTitle = document.getElementById('modalProductTitle').textContent;
        const productQuantity = document.getElementById('productQuantity').value;
        
        // Simular la adición al carrito
        addToCart(productTitle, productQuantity);
        
        // Cerrar el modal
        const modal = bootstrap.Modal.getInstance(document.getElementById('productModal'));
        modal.hide();
    });
}

/**
 * Añade un producto al carrito de compras
 * @param {string} productName - Nombre del producto
 * @param {number} quantity - Cantidad a añadir
 */
function addToCart(productName, quantity) {
    // En una implementación real, aquí se actualizaría el carrito en localStorage o se enviaría al servidor
    
    // Actualizar contador de carrito (ejemplo visual)
    const cartBadge = document.querySelector('.fa-shopping-bag').nextElementSibling;
    const currentCount = parseInt(cartBadge.textContent || '0');
    cartBadge.textContent = currentCount + parseInt(quantity);
    
    // Mostrar confirmación al usuario
    showNotification(`${quantity} ${productName} añadido al carrito`);
}

/**
 * Muestra una notificación temporal al usuario
 * @param {string} message - Mensaje a mostrar
 */
function showNotification(message) {
    // Crear elemento de notificación
    const notification = document.createElement('div');
    notification.className = 'alert alert-success alert-dismissible fade show position-fixed';
    notification.style.right = '20px';
    notification.style.bottom = '20px';
    notification.style.zIndex = '1050';
    notification.style.maxWidth = '300px';
    
    notification.innerHTML = `
        ${message}
        <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
    `;
    
    // Añadir al DOM
    document.body.appendChild(notification);
    
    // Eliminar después de 3 segundos
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
}

/**
 * Inicializa efectos de aparición en scroll
 */
function initSlideEffects() {
    // Obtener todos los elementos que deberían tener animación
    const elements = document.querySelectorAll('.product-card, .category-card');
    
    // Comprobar si el navegador soporta IntersectionObserver
    if ('IntersectionObserver' in window) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('fade-in');
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1 });
        
        elements.forEach(element => {
            observer.observe(element);
        });
    } else {
        // Fallback para navegadores más antiguos
        elements.forEach(element => {
            element.classList.add('fade-in');
        });
    }
}

/**
 * Función para manejar la suscripción al newsletter
 */
document.addEventListener('DOMContentLoaded', function() {
    const subscriptionForm = document.querySelector('.subscription-form');
    
    if (subscriptionForm) {
        subscriptionForm.addEventListener('submit', function(event) {
            event.preventDefault();
            
            // Obtener el email
            const emailInput = this.querySelector('input[type="email"]');
            const email = emailInput.value;
            
            // En un caso real, aquí se enviaría la solicitud al servidor
            console.log('Suscripción solicitada para:', email);
            
            // Mostrar confirmación
            showNotification('¡Gracias por suscribirte! Hemos enviado un correo de confirmación.');
            
            // Limpiar el formulario
            emailInput.value = '';
        });
    }
});