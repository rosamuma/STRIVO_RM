// Script principal para la página de producto
// Funciones organizadas de manera intuitiva y fácil de entender

// ===========================================
// 1. VARIABLES GLOBALES Y ELEMENTOS DEL DOM
// ===========================================

// Elementos principales que vamos a manipular
const mainImage = document.getElementById('mainImage');
const thumbnailImages = document.querySelectorAll('.thumbnail-img');
const colorOptions = document.querySelectorAll('.color-option');
const sizeButtons = document.querySelectorAll('.size-btn');
const quantityInput = document.getElementById('quantityInput');
const decreaseBtn = document.getElementById('decreaseBtn');
const increaseBtn = document.getElementById('increaseBtn');
const addToCartBtn = document.querySelector('.btn-add-cart');
const wishlistBtn = document.querySelector('.btn-wishlist');

// ===========================================
// 2. FUNCIONES PARA CAMBIAR IMÁGENES
// ===========================================

// Función para cambiar la imagen principal cuando se hace clic en thumbnails
function changeMainImage(newImageSrc) {
    // Añadir efecto de transición suave
    mainImage.style.opacity = '0.7';
    
    setTimeout(() => {
        mainImage.src = newImageSrc;
        mainImage.style.opacity = '1';
    }, 150);
}

// Función para actualizar qué thumbnail está activo
function updateActiveThumbnail(clickedThumbnail) {
    // Remover clase 'active' de todos los thumbnails
    thumbnailImages.forEach(thumb => thumb.classList.remove('active'));
    
    // Añadir clase 'active' al thumbnail clickeado
    clickedThumbnail.classList.add('active');
}

// ===========================================
// 3. FUNCIONES PARA SELECCIÓN DE TALLA
// ===========================================

// Función para manejar la selección de tallas
function selectSize(clickedButton) {
    // Remover clase 'active' de todos los botones de talla
    sizeButtons.forEach(btn => btn.classList.remove('active'));
    
    // Añadir clase 'active' al botón clickeado
    clickedButton.classList.add('active');
    
    // Mostrar mensaje de confirmación (opcional)
    console.log(`Talla seleccionada: ${clickedButton.textContent}`);
}

// ===========================================
// 4. FUNCIONES PARA SELECCIÓN DE COLOR
// ===========================================

// Función para cambiar color del producto
function selectColor(clickedColorOption) {
    // Remover clase 'active' de todas las opciones de color
    colorOptions.forEach(option => option.classList.remove('active'));
    
    // Añadir clase 'active' a la opción clickeada
    clickedColorOption.classList.add('active');
    
    // Obtener la nueva imagen del atributo data-image
    const newImage = clickedColorOption.getAttribute('data-image');
    const colorName = clickedColorOption.getAttribute('data-color');
    
    // Cambiar la imagen principal
    if (newImage) {
        changeMainImage(newImage);
    }
    
    console.log(`Color seleccionado: ${colorName}`);
}

// ===========================================
// 5. FUNCIONES PARA CANTIDAD DEL PRODUCTO
// ===========================================

// Función para aumentar la cantidad
function increaseQuantity() {
    let currentValue = parseInt(quantityInput.value);
    quantityInput.value = currentValue + 1;
    
    // Añadir efecto visual al botón
    increaseBtn.style.transform = 'scale(0.95)';
    setTimeout(() => {
        increaseBtn.style.transform = 'scale(1)';
    }, 100);
}

// Función para disminuir la cantidad
function decreaseQuantity() {
    let currentValue = parseInt(quantityInput.value);
    
    // No permitir que baje de 1
    if (currentValue > 1) {
        quantityInput.value = currentValue - 1;
        
        // Añadir efecto visual al botón
        decreaseBtn.style.transform = 'scale(0.95)';
        setTimeout(() => {
            decreaseBtn.style.transform = 'scale(1)';
        }, 100);
    }
}

// Función para validar que solo se ingresen números en el input
function validateQuantityInput() {
    let value = parseInt(quantityInput.value);
    
    // Si no es un número válido o es menor a 1, establecer en 1
    if (isNaN(value) || value < 1) {
        quantityInput.value = 1;
    }
}

// ===========================================
// 6. FUNCIONES PARA ACCIONES DEL CARRITO
// ===========================================

// Función para agregar producto al carrito
function addToCart() {
    // Obtener información del producto seleccionado
    const selectedSize = document.querySelector('.size-btn.active');
    const selectedColor = document.querySelector('.color-option.active');
    const quantity = quantityInput.value;
    
    // Verificar que se haya seleccionado una talla
    if (!selectedSize) {
        alert('Por favor selecciona una talla');
        return;
    }
    
    // Crear objeto con información del producto
    const productInfo = {
        name: 'Chaqueta Sportstyle Underarmour mujer',
        size: selectedSize.textContent,
        color: selectedColor ? selectedColor.getAttribute('data-color') : 'negro',
        quantity: quantity,
        price: '279.999'
    };
    
    // Mostrar confirmación
    showAddToCartConfirmation(productInfo);
    
    // Aquí podrías agregar lógica para enviar al carrito real
    console.log('Producto agregado al carrito:', productInfo);
}

// Función para mostrar confirmación de agregado al carrito
function showAddToCartConfirmation(product) {
    // Cambiar temporalmente el texto del botón
    const originalText = addToCartBtn.textContent;
    addToCartBtn.textContent = '¡Agregado!';
    addToCartBtn.style.background = 'linear-gradient(135deg, #28a745, #20c997)';
    
    // Restaurar después de 2 segundos
    setTimeout(() => {
        addToCartBtn.textContent = originalText;
        addToCartBtn.style.background = 'linear-gradient(135deg, #333, #555)';
    }, 2000);
}

// Función para agregar a lista de deseos
function addToWishlist() {
    const heartIcon = wishlistBtn.querySelector('i');
    
    // Cambiar el icono y color
    if (heartIcon.classList.contains('fas')) {
        // Ya está en favoritos, remover
        heartIcon.classList.remove('fas');
        heartIcon.classList.add('far');
        wishlistBtn.style.background = 'white';
        wishlistBtn.style.color = '#dc3545';
        console.log('Removido de favoritos');
    } else {
        // Agregar a favoritos
        heartIcon.classList.remove('far');
        heartIcon.classList.add('fas');
        wishlistBtn.style.background = '#dc3545';
        wishlistBtn.style.color = 'white';
        console.log('Agregado a favoritos');
    }
}

// ===========================================
// 7. FUNCIONES PARA DESCRIPCIÓN Y ACORDEONES
// ===========================================

// Función para toggle de la descripción
function toggleDescription() {
    const descriptionContent = document.querySelector('.description-content');
    const toggleIcon = document.querySelector('.description-toggle i');
    
    if (descriptionContent.style.display === 'none') {
        descriptionContent.style.display = 'block';
        toggleIcon.classList.remove('fa-chevron-down');
        toggleIcon.classList.add('fa-chevron-up');
    } else {
        descriptionContent.style.display = 'none';
        toggleIcon.classList.remove('fa-chevron-up');
        toggleIcon.classList.add('fa-chevron-down');
    }
}

// ===========================================
// 8. FUNCIONES DE BÚSQUEDA
// ===========================================

// Función para manejar la búsqueda
function handleSearch() {
    const searchInput = document.querySelector('.search-input');
    const searchTerm = searchInput.value.trim();
    
    if (searchTerm) {
        console.log(`Buscando: ${searchTerm}`);
        // Aquí podrías implementar la lógica de búsqueda real
        alert(`Buscando: ${searchTerm}`);
    }
}

// ===========================================
// 9. EVENT LISTENERS - CONFIGURACIÓN DE EVENTOS
// ===========================================

// Función principal que configura todos los event listeners
function setupEventListeners() {
    
    // 9.1 Eventos para las imágenes thumbnail
    thumbnailImages.forEach(thumbnail => {
        thumbnail.addEventListener('click', function() {
            const newImageSrc = this.getAttribute('data-main');
            changeMainImage(newImageSrc);
            updateActiveThumbnail(this);
        });
    });
    
    // 9.2 Eventos para selección de tallas
    sizeButtons.forEach(button => {
        button.addEventListener('click', function() {
            selectSize(this);
        });
    });
    
    // 9.3 Eventos para selección de colores
    colorOptions.forEach(option => {
        option.addEventListener('click', function() {
            selectColor(this);
        });
    });
    
    // 9.4 Eventos para cantidad
    if (increaseBtn) {
        increaseBtn.addEventListener('click', increaseQuantity);
    }
    
    if (decreaseBtn) {
        decreaseBtn.addEventListener('click', decreaseQuantity);
    }
    
    if (quantityInput) {
        quantityInput.addEventListener('change', validateQuantityInput);
        quantityInput.addEventListener('blur', validateQuantityInput);
    }
    
    // 9.5 Eventos para botones de acción
    if (addToCartBtn) {
        addToCartBtn.addEventListener('click', addToCart);
    }
    
    if (wishlistBtn) {
        wishlistBtn.addEventListener('click', addToWishlist);
    }
    
    // 9.6 Evento para toggle de descripción
    const descriptionToggle = document.querySelector('.description-toggle');
    if (descriptionToggle) {
        descriptionToggle.addEventListener('click', toggleDescription);
    }
    
    // 9.7 Evento para búsqueda
    const searchInput = document.querySelector('.search-input');
    const searchIcon = document.querySelector('.search-icon');
    
    if (searchInput) {
        searchInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                handleSearch();
            }
        });
    }
    
    if (searchIcon) {
        searchIcon.addEventListener('click', handleSearch);
    }
}

// ===========================================
// 10. FUNCIÓN DE INICIALIZACIÓN
// ===========================================

// Función que se ejecuta cuando la página está completamente cargada
function initializePage() {
    console.log('Página de producto inicializada');
    
    // Configurar todos los event listeners
    setupEventListeners();
    
    // Configuraciones iniciales
    console.log('Event listeners configurados correctamente');
    
    // Verificar que todos los elementos importantes existan
    if (!mainImage) {
        console.error('No se encontró la imagen principal');
    }
    
    if (thumbnailImages.length === 0) {
        console.error('No se encontraron imágenes thumbnail');
    }
    
    if (sizeButtons.length === 0) {
        console.error('No se encontraron botones de talla');
    }
}

// ===========================================
// 11. EJECUCIÓN AL CARGAR LA PÁGINA
// ===========================================

// Esperar a que el DOM esté completamente cargado
document.addEventListener('DOMContentLoaded', initializePage);

// También funcionar si el script se carga después del DOM
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializePage);
} else {
    initializePage();
}