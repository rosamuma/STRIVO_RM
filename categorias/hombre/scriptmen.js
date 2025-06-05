const products = [
    {
        id: 1,
        brand: 'Nike',
        title: 'Raqueta de tennis para adulto',
        price: 84999,
        oldPrice: null,
        discount: null,
        image: './image/raqueta.jpg',
        category: 'Deportes',
        popularity: 8
    },
    {
        id: 2,
        brand: 'Adidas',
        title: 'Pelotas de tennis paquete x3 unidades',
        price: 34999,
        oldPrice: 50999,
        discount: 30,
        image: './image/pelotas_tenis.jpeg',
        category: 'Deportes',
        popularity: 7
    },
    {
        id: 3,
        brand: 'Nike',
        title: 'Conjunto Sportswear Basic',
        price: 224999,
        oldPrice: null,
        discount: null,
        image: './image/conjunto.jpg',
        category: 'Ropa',
        popularity: 9
    },
    {
        id: 4,
        brand: 'Decathlon',
        title: 'Malla de tenis 3 Metros de Nailon',
        price: 279999,
        oldPrice: 307999,
        discount: 10,
        image: './image/malla.jpg',
        category: 'Deportes',
        popularity: 6
    },
    {
        id: 5,
        brand: 'Under Armour',
        title: 'Camiseta deportiva de compresión',
        price: 129999,
        oldPrice: 159999,
        discount: 20,
        image: './image/Camiseta1.jpg',
        category: 'Ropa',
        popularity: 8
    },
    {
        id: 6,
        brand: 'Nike',
        title: 'Zapatos deportivos rojos',
        price: 199999,
        oldPrice: null,
        discount: null,
        image: './image/zapatos2.jpg',
        category: 'Calzado',
        popularity: 7
    },
    {
        id: 7,
        brand: 'Puma',
        title: 'Medias de algodon',
        price: 349999,
        oldPrice: 399999,
        discount: 15,
        image: './image/medias.jpg',
        category: 'Ropa',
        popularity: 9
    },
    {
        id: 8,
        brand: 'Adidas',
        title: 'Chaqueta reflectiva roja',
        price: 89999,
        oldPrice: null,
        discount: null,
        image: './image/chaqueta.jpg',
        category: 'Ropa',
        popularity: 6
    },
    {
        id: 9,
        brand: 'Nike',
        title: 'Gorra deportiva ajustable',
        price: 59999,
        oldPrice: 79999,
        discount: 25,
        image: './image/gorra.jpg',
        category: 'Accesorios',
        popularity: 8
    },
    {
        id: 10,
        brand: 'Head',
        title: 'Pantalones ajustables',
        price: 599999,
        oldPrice: 699999,
        discount: 15,
        image: './image/pantalones.jpg',
        category: 'Ropa',
        popularity: 9
    },
    {
        id: 11,
        brand: 'New Balance',
        title: 'Kit de mancuernas de hierro para levantamiento de pesas de 20kg Corength negro',
        price: 329999,
        oldPrice: null,
        discount: null,
        image: './image/mancuernas.jpg',
        category: 'Deportes',
        popularity: 7
    },
    {
        id: 12,
        brand: 'nike',
        title: 'Guayos de futbol',
        price: 179999,
        oldPrice: 209999,
        discount: 15,
        image: './image/guayos.jpg',
        category: 'Calzado',
        popularity: 8
    }
];

// Estado de la aplicación
const state = {
    currentPage: 1,
    itemsPerPage: 4,
    totalPages: Math.ceil(products.length / 4),
    sortBy: 'popularity', // Default sorting
    filters: {
        categories: ['Deportes', 'Calzado', 'Ropa', 'Accesorios'],
        priceOrder: '',
        withDiscount: false,
        sizes: [''],
        brands: ['']
    }
};

// Funciones de utilidad para formatear precios
function formatPrice(price) {
    return '$ ' + price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
}

// Función para renderizar productos
function renderProducts() {
    const productsContainer = document.getElementById('products-grid');
    productsContainer.innerHTML = '';
    
    // Ordenar productos
    let sortedProducts = [...products];
    
    switch (state.sortBy) {
        case 'popularity':
            sortedProducts.sort((a, b) => b.popularity - a.popularity);
            break;
        case 'price-asc':
            sortedProducts.sort((a, b) => a.price - b.price);
            break;
        case 'price-desc':
            sortedProducts.sort((a, b) => b.price - a.price);
            break;
        case 'discount':
            sortedProducts.sort((a, b) => {
                // Primero los que tienen descuento, ordenados por % de descuento
                if (a.discount && b.discount) return b.discount - a.discount;
                if (a.discount) return -1;
                if (b.discount) return 1;
                return 0;
            });
            break;
    }
    
    // Filtrar productos si fuera necesario
    // Por ahora solo aplicamos los filtros visuales que se ven en la imagen
    if (state.filters.categories.length > 0) {
        sortedProducts = sortedProducts.filter(product => 
            state.filters.categories.includes(product.category)
        );
    }
    
    if (state.filters.withDiscount) {
        sortedProducts = sortedProducts.filter(product => product.discount !== null);
    }
    
    // Paginación
    const startIndex = (state.currentPage - 1) * state.itemsPerPage;
    const endIndex = startIndex + state.itemsPerPage;
    const paginatedProducts = sortedProducts.slice(startIndex, endIndex);
    
    // Actualizar el número de páginas según los filtros aplicados
    state.totalPages = Math.ceil(sortedProducts.length / state.itemsPerPage);
    document.getElementById('total-pages').textContent = state.totalPages;
    document.getElementById('current-page').textContent = state.currentPage;
    
    // Renderizar los productos filtrados y paginados
    paginatedProducts.forEach(product => {
        const productCard = document.createElement('div');
        productCard.className = 'col-md-6 col-lg-3';
        
        let discountBadge = '';
        let priceDisplay = '';
        
        if (product.discount) {
            discountBadge = `<div class="discount-badge">${product.discount}% de descuento</div>`;
            priceDisplay = `
                <div class="price-container">
                    <span class="current-price">${formatPrice(product.price)}</span>
                    <span class="old-price">${formatPrice(product.oldPrice)}</span>
                </div>
            `;
        } else {
            priceDisplay = `
                <div class="price-container">
                    <span class="current-price">${formatPrice(product.price)}</span>
                </div>
            `;
        }
        
        productCard.innerHTML = `
            <div class="product-card">
                <div class="product-img" style="background-image: url(${product.image})">
                    ${discountBadge}
                    <div class="buy-overlay">
                        <button class="btn btn-light buy-btn"> <a href="./comprar.html"></a> Comprar ahora</button>
                    </div>
                </div>
                <span class="brand">${product.brand}</span>
                <h3 class="product-title">${product.title}</h3>
                ${priceDisplay}
            </div>
        `;
        
        productsContainer.appendChild(productCard);
    });
    
    // Actualizar estado de los botones de paginación
    document.getElementById('prev-page').disabled = state.currentPage === 1;
    document.getElementById('next-page').disabled = state.currentPage === state.totalPages;
}

// Event listeners para la paginación
document.getElementById('prev-page').addEventListener('click', () => {
    if (state.currentPage > 1) {
        state.currentPage--;
        renderProducts();
        // window.scrollTo({top: 0, behavior: 'smooth'});
    }
});

document.getElementById('next-page').addEventListener('click', () => {
    if (state.currentPage < state.totalPages) {
        state.currentPage++;
        renderProducts();
        // window.scrollTo({top: 0, behavior: 'smooth'});
    }
});

// Event listeners para el ordenamiento
document.querySelectorAll('.dropdown-item2').forEach(item => {
    item.addEventListener('click', (event) => {
        event.preventDefault();
        const sortType = event.target.getAttribute('data-sort');
        state.sortBy = sortType;
        state.currentPage = 1; // Volver a la primera página al cambiar el orden
        
        // Actualizar texto del botón de ordenar
        const sortingText = event.target.textContent;
        document.getElementById('sortingDropdown').innerHTML = `${sortingText} `;
        
        renderProducts();
    });
});

// Event listeners para los filtros
document.querySelectorAll('.filter-options input[type="checkbox"]').forEach(checkbox => {
    checkbox.addEventListener('change', () => {
        // Actualizar los filtros según los checkboxes seleccionados
        
        // Filtrar por categoría
        const categoryCheckboxes = document.querySelectorAll('#categoriaCollapse input[type="checkbox"]:checked');
        state.filters.categories = Array.from(categoryCheckboxes).map(cb => cb.nextSibling.textContent.trim());
        
        // Filtrar por precio
        const priceOrderCheckboxes = document.querySelectorAll('#precioCollapse input[type="checkbox"]:checked');
        if (priceOrderCheckboxes.length > 0) {
            const priceLabel = priceOrderCheckboxes[0].nextSibling.textContent.trim();
            if (priceLabel === 'De menor a mayor') {
                state.sortBy = 'price-asc';
            } else if (priceLabel === 'De mayor a Menor') {
                state.sortBy = 'price-desc';
            } else if (priceLabel === 'Con descuento') {
                state.filters.withDiscount = true;
            } else {
                state.filters.withDiscount = false;
            }
        }
        
        // Filtrar por talla
        const sizeCheckboxes = document.querySelectorAll('#tallaCollapse input[type="checkbox"]:checked');
        state.filters.sizes = Array.from(sizeCheckboxes).map(cb => cb.nextSibling.textContent.trim());
        
        // Resetear a la primera página y renderizar
        state.currentPage = 1;
        renderProducts();
    });
});

// Efecto de acordeón para los filtros
document.querySelectorAll('.accordion-header').forEach(header => {
    header.addEventListener('click', () => {
        const target = header.getAttribute('data-bs-target');
        const content = document.querySelector(target);
        
        if (content.classList.contains('show')) {
            content.classList.remove('show');
            header.querySelector('i').classList.remove('fa-chevron-down');
            header.querySelector('i').classList.add('fa-chevron-up');
        } else {
            content.classList.add('show');
            header.querySelector('i').classList.remove('fa-chevron-up');
            header.querySelector('i').classList.add('fa-chevron-down');
        }
    });
});

// Funcionalidad de los botones de compra
document.addEventListener('click', (event) => {
    if (event.target.classList.contains('buy-btn')) {
        const productCard = event.target.closest('.product-card');
        const productTitle = productCard.querySelector('.product-title').textContent;
        
        // Simulación de añadir al carrito
        // alert(`Producto añadido al carrito: ${productTitle}`);
        window.location.href = './compra.html';
    }
});

// Inicializar la página
document.addEventListener('DOMContentLoaded', () => {
    renderProducts();
});