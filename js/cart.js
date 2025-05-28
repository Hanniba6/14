// Shopping Cart JavaScript File

document.addEventListener('DOMContentLoaded', function() {
    // Load cart contents
    loadCart123();
    
    // Clear cart button event
    const clearCartBtn = document.getElementById('clear-cart');
    if (clearCartBtn) {
        clearCartBtn.addEventListener('click', clearCart123);
    }
    
    // Checkout button event
    const checkoutBtn = document.getElementById('checkout');
    if (checkoutBtn) {
        checkoutBtn.addEventListener('click', proceedToCheckout123);
    }
    
    // Cart item event delegation (change quantity, delete)
    const cartItems = document.getElementById('cart-items');
    if (cartItems) {
        cartItems.addEventListener('click', function(e) {
            // Increase quantity
            if (e.target.classList.contains('increase-quantity')) {
                const itemId = e.target.getAttribute('data-id');
                const itemType = e.target.getAttribute('data-type') || 'course';
                updateCartItemQuantity123(itemId, 1, itemType);
            }
            
            // Decrease quantity
            if (e.target.classList.contains('decrease-quantity')) {
                const itemId = e.target.getAttribute('data-id');
                const itemType = e.target.getAttribute('data-type') || 'course';
                updateCartItemQuantity123(itemId, -1, itemType);
            }
            
            // Remove item
            if (e.target.classList.contains('cart-item-remove')) {
                const itemId = e.target.getAttribute('data-id');
                const itemType = e.target.getAttribute('data-type') || 'course';
                removeFromCart123(itemId, itemType);
            }
        });
    }
    
    // Verify if user is logged in
    checkAuthentication123();
    
    // Load recommended courses
    loadRecommendedCourses123();

    // Add to cart buttons for resources
    document.addEventListener('click', function(e) {
        if (e.target.classList.contains('add-to-cart')) {
            const itemId = e.target.getAttribute('data-id');
            const itemName = e.target.getAttribute('data-name');
            const itemPrice = parseFloat(e.target.getAttribute('data-price'));
            const itemType = itemId.startsWith('resource') ? 'resource' : 'course';
            
            if (itemType === 'resource') {
                addResourceToCart(itemId, itemName, itemPrice);
            } else {
                addToCart123(itemId);
            }
        }
    });
});

// Add resource to cart
function addResourceToCart(resourceId, resourceName, resourcePrice) {
    // Check login status
    if (!sessionStorage.getItem('isLoggedIn')) {
        alert('Please login first to add resources to your cart!');
        return;
    }
    
    // Get cart from localStorage
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    
    // Check if resource already in cart
    const resourceIndex = cart.findIndex(item => item.resourceId === resourceId);
    
    if (resourceIndex !== -1) {
        // Resource already in cart, increase quantity
        cart[resourceIndex].quantity += 1;
        alert(`Increased quantity of ${resourceName} in your cart!`);
    } else {
        // Add new resource to cart
        cart.push({
            resourceId: resourceId,
            resourceName: resourceName,
            price: resourcePrice,
            quantity: 1,
            type: 'resource',
            dateAdded: new Date().toISOString()
        });
        alert(`${resourceName} has been added to your cart!`);
    }
    
    // Save to localStorage
    localStorage.setItem('cart', JSON.stringify(cart));
}

// Check if user is logged in, redirect to home page if not
function checkAuthentication123() {
    // Check login status using sessionStorage
    if (!sessionStorage.getItem('isLoggedIn')) {
        alert('Please login to access your cart!');
        window.location.href = 'index.html';
    }
}

// Load cart contents
function loadCart123() {
    const cartItemsContainer = document.getElementById('cart-items');
    const cartTotalAmount = document.getElementById('cart-total-amount');
    
    if (!cartItemsContainer) return;
    
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    const courses = JSON.parse(localStorage.getItem('courses') || '[]');
    
    cartItemsContainer.innerHTML = '';
    
    if (cart.length === 0) {
        cartItemsContainer.innerHTML = '<p class="empty-cart">Your cart is empty</p>';
        if (cartTotalAmount) cartTotalAmount.textContent = '$0.00';
        return;
    }
    
    let total = 0;
    
    cart.forEach(item => {
        if (item.type === 'resource') {
            // Handle resource items
            const itemTotal = item.price * item.quantity;
            total += itemTotal;
            
            const cartItem = document.createElement('div');
            cartItem.className = 'cart-item';
            
            cartItem.innerHTML = `
                <div class="cart-item-image">
                    <img src="img/resources/${item.resourceId}.jpg" alt="${item.resourceName}" onerror="this.src='img/placeholder.jpg'">
                </div>
                <div class="cart-item-details">
                    <h3 class="cart-item-title">${item.resourceName}</h3>
                    <p class="cart-item-price">$${item.price.toFixed(2)}</p>
                    <div class="cart-item-quantity">
                        <span class="quantity-btn decrease-quantity" data-id="${item.resourceId}" data-type="resource">-</span>
                        <span class="quantity-value">${item.quantity}</span>
                        <span class="quantity-btn increase-quantity" data-id="${item.resourceId}" data-type="resource">+</span>
                        <span class="cart-item-remove" data-id="${item.resourceId}" data-type="resource">Remove</span>
                    </div>
                </div>
                <div class="cart-item-subtotal">
                    <p>Subtotal: $${itemTotal.toFixed(2)}</p>
                </div>
            `;
            
            cartItemsContainer.appendChild(cartItem);
        } else {
            // Handle course items
            const course = courses.find(c => c.id === item.courseId);
            if (!course) return;
            
            const itemTotal = course.price * item.quantity;
            total += itemTotal;
            
            const cartItem = document.createElement('div');
            cartItem.className = 'cart-item';
            
            cartItem.innerHTML = `
                <div class="cart-item-image">
                    <img src="${course.image}" alt="${course.name}" onerror="this.src='img/placeholder.jpg'">
                </div>
                <div class="cart-item-details">
                    <h3 class="cart-item-title">${course.name}</h3>
                    <p class="cart-item-price">$${course.price.toFixed(2)}</p>
                    <div class="cart-item-quantity">
                        <span class="quantity-btn decrease-quantity" data-id="${course.id}" data-type="course">-</span>
                        <span class="quantity-value">${item.quantity}</span>
                        <span class="quantity-btn increase-quantity" data-id="${course.id}" data-type="course">+</span>
                        <span class="cart-item-remove" data-id="${course.id}" data-type="course">Remove</span>
                    </div>
                </div>
                <div class="cart-item-subtotal">
                    <p>Subtotal: $${itemTotal.toFixed(2)}</p>
                </div>
            `;
            
            cartItemsContainer.appendChild(cartItem);
        }
    });
    
    if (cartTotalAmount) {
        cartTotalAmount.textContent = `$${total.toFixed(2)}`;
    }
}

// Update cart item quantity
function updateCartItemQuantity123(itemId, change, itemType = 'course') {
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    let itemIndex;
    
    if (itemType === 'resource') {
        itemIndex = cart.findIndex(item => item.resourceId === itemId);
    } else {
        itemIndex = cart.findIndex(item => item.courseId === itemId);
    }
    
    if (itemIndex === -1) return;
    
    cart[itemIndex].quantity += change;
    
    // If quantity is less than or equal to 0, remove item
    if (cart[itemIndex].quantity <= 0) {
        cart.splice(itemIndex, 1);
    }
    
    // Save to localStorage
    localStorage.setItem('cart', JSON.stringify(cart));
    
    // Reload cart
    loadCart123();
}

// Remove item from cart
function removeFromCart123(itemId, itemType = 'course') {
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    let newCart;
    
    if (itemType === 'resource') {
        newCart = cart.filter(item => item.resourceId !== itemId);
    } else {
        newCart = cart.filter(item => item.courseId !== itemId);
    }
    
    // Save to localStorage
    localStorage.setItem('cart', JSON.stringify(newCart));
    
    // Reload cart
    loadCart123();
}

// Clear cart
function clearCart123() {
    if (confirm('Are you sure you want to clear your cart?')) {
        localStorage.setItem('cart', '[]');
        loadCart123();
    }
}

// Calculate cart total
function calculateCartTotal123() {
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    const courses = JSON.parse(localStorage.getItem('courses') || '[]');
    
    let total = 0;
    
    cart.forEach(item => {
        if (item.type === 'resource') {
            total += item.price * item.quantity;
        } else {
            const course = courses.find(c => c.id === item.courseId);
            if (course) {
                total += course.price * item.quantity;
            }
        }
    });
    
    return total;
}

// Load recommended courses
function loadRecommendedCourses123() {
    const recommendedCoursesContainer = document.getElementById('recommended-courses');
    if (!recommendedCoursesContainer) return;
    
    const courses = JSON.parse(localStorage.getItem('courses') || '[]');
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    
    // Filter out courses that are already in cart
    const cartCourseIds = cart.map(item => item.courseId);
    const availableCourses = courses.filter(course => !cartCourseIds.includes(course.id));
    
    // Display up to 4 recommended courses
    const recommendedCourses = availableCourses.slice(0, 4);
    
    recommendedCoursesContainer.innerHTML = '';
    
    recommendedCourses.forEach(course => {
        const courseElement = document.createElement('div');
        courseElement.className = 'course-card';
        
        courseElement.innerHTML = `
            <img src="${course.image}" alt="${course.name}" onerror="this.src='img/placeholder.jpg'">
            <h3>${course.name}</h3>
            <p class="course-price">$${course.price.toFixed(2)}</p>
            <button class="btn add-to-cart" data-id="${course.id}">Add to Cart</button>
        `;
        
        recommendedCoursesContainer.appendChild(courseElement);
    });
    
    // Add event listeners to "Add to Cart" buttons
    const addToCartButtons = recommendedCoursesContainer.querySelectorAll('.add-to-cart');
    addToCartButtons.forEach(button => {
        button.addEventListener('click', function() {
            const courseId = this.getAttribute('data-id');
            addToCart123(courseId);
        });
    });
}

// Add course to cart
function addToCart123(courseId) {
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    const existingItem = cart.find(item => item.courseId === courseId);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            courseId: courseId,
            quantity: 1
        });
    }
    
    localStorage.setItem('cart', JSON.stringify(cart));
    loadCart123();
    loadRecommendedCourses123();
}

// Proceed to checkout
function proceedToCheckout123() {
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    
    if (cart.length === 0) {
        alert('Your cart is empty!');
        return;
    }
    
    // Get current user
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (!currentUser) {
        alert('Please login to proceed with checkout!');
        return;
    }
    
    // Save order data
    const orderData = {
        orderId: 'ORD-' + Date.now(),
        customer: currentUser,
        items: cart,
        total: calculateCartTotal123(),
        status: 'Processing',
        date: new Date().toISOString()
    };
    
    // Save temporary order
    localStorage.setItem('tempOrder', JSON.stringify(orderData));
    
    // Redirect to confirmation page
    window.location.href = 'confirmation.html';
} 