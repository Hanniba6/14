// Resources JavaScript File

document.addEventListener('DOMContentLoaded', function() {
    // Handle resource details view
    handleResourceDetails();
    
    // Handle add to cart functionality
    handleAddToCart();
});

// Handle resource details view
function handleResourceDetails() {
    // Add click event listener to view details buttons
    document.addEventListener('click', function(e) {
        if (e.target.classList.contains('view-details')) {
            const resourceId = e.target.getAttribute('data-id');
            toggleResourceDetails(resourceId);
        }
    });
}

// Toggle resource details visibility
function toggleResourceDetails(resourceId) {
    const detailsElement = document.getElementById(`details-${resourceId}`);
    if (detailsElement) {
        const isVisible = detailsElement.style.display !== 'none';
        
        // Hide all resource details first
        const allDetails = document.querySelectorAll('.resource-details');
        allDetails.forEach(detail => {
            detail.style.display = 'none';
            detail.classList.remove('details-showing');
        });
        
        // Show the clicked resource details if it was hidden
        if (!isVisible) {
            detailsElement.style.display = 'block';
            detailsElement.classList.add('details-showing');
            
            // Scroll to the details
            setTimeout(() => {
                detailsElement.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
            }, 100);
        }
    }
}

// Handle add to cart functionality
function handleAddToCart() {
    // Add click event listener to add to cart buttons
    const addToCartButtons = document.querySelectorAll('.add-to-cart');
    
    addToCartButtons.forEach(button => {
        button.addEventListener('click', function() {
            const resourceId = this.getAttribute('data-id');
            const resourceName = this.getAttribute('data-name');
            const resourcePrice = parseFloat(this.getAttribute('data-price'));
            
            addResourceToCart(resourceId, resourceName, resourcePrice);
        });
    });
}

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
    }
    
    // Save to localStorage
    localStorage.setItem('cart', JSON.stringify(cart));
    
    // Show confirmation
    alert(`${resourceName} has been added to your cart!`);
} 