// Orders Management JavaScript File

document.addEventListener('DOMContentLoaded', function() {
    // Verify user is logged in
    checkAuthentication123();
    
    // Load orders list
    loadOrders123();
    
    // Load todo list
    loadTodoList123();
    
    // Download orders button event
    const downloadBtn = document.getElementById('download-orders');
    if (downloadBtn) {
        downloadBtn.addEventListener('click', downloadOrders123);
    }
    
    // Add todo button event
    const addTodoBtn = document.getElementById('add-todo');
    if (addTodoBtn) {
        addTodoBtn.addEventListener('click', addTodo123);
    }
    
    // New todo input enter key event
    const newTodoInput = document.getElementById('new-todo');
    if (newTodoInput) {
        newTodoInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                addTodo123();
            }
        });
    }
    
    // Clear data button event
    const clearDataBtn = document.getElementById('clear-data');
    if (clearDataBtn) {
        clearDataBtn.addEventListener('click', clearUserData123);
    }
    
    // Todo list click event delegation
    const todoList = document.getElementById('todo-list');
    if (todoList) {
        todoList.addEventListener('click', function(e) {
            // Delete todo
            if (e.target.classList.contains('delete-todo')) {
                const todoId = e.target.getAttribute('data-id');
                deleteTodo123(todoId);
            }
            
            // Toggle complete/incomplete
            if (e.target.classList.contains('todo-checkbox')) {
                const todoId = e.target.getAttribute('data-id');
                toggleTodoStatus123(todoId);
            }
        });
    }
});

// Check if user is logged in, redirect to home page if not
function checkAuthentication123() {
    // Check login status using sessionStorage
    if (!sessionStorage.getItem('isLoggedIn')) {
        alert('Please login to access order management!');
        window.location.href = 'index.html';
    }
}

// Load user orders
function loadOrders123() {
    const orderList = document.getElementById('order-list');
    if (!orderList) return;
    
    // Get current user
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (!currentUser) {
        alert('User information not found!');
        return;
    }
    
    // Get orders data
    const orders = JSON.parse(localStorage.getItem('orders') || '[]');
    
    // Filter orders for current user
    const userOrders = orders.filter(order => order.username === currentUser.username);
    
    // Clear order list
    orderList.innerHTML = '';
    
    if (userOrders.length === 0) {
        orderList.innerHTML = '<p class="no-orders">You have no order records yet</p>';
        return;
    }
    
    // Sort by date descending (newest first)
    userOrders.sort((a, b) => new Date(b.dateCreated) - new Date(a.dateCreated));
    
    // Add orders to list
    userOrders.forEach(order => {
        const orderCard = document.createElement('div');
        orderCard.className = 'order-card';
        
        // Calculate total items in order
        const itemCount = order.items.reduce((total, item) => total + item.quantity, 0);
        
        // Format date
        const orderDate = new Date(order.dateCreated);
        const formattedDate = orderDate.toLocaleString();
        
        orderCard.innerHTML = `
            <div class="order-header">
                <h3>Order ID: ${order.id}</h3>
                <span class="order-status ${order.status}">${order.status === 'confirmed' ? 'Confirmed' : 'Pending'}</span>
            </div>
            <div class="order-info">
                <p>Date: ${formattedDate}</p>
                <p>Items: ${itemCount}</p>
                <p>Total: $${order.total.toFixed(2)}</p>
            </div>
            <button class="btn btn-view-details" data-id="${order.id}">View Details</button>
        `;
        
        orderList.appendChild(orderCard);
    });
    
    // Add view details button events
    const viewDetailsButtons = document.querySelectorAll('.btn-view-details');
    viewDetailsButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            const orderId = this.getAttribute('data-id');
            viewOrderDetails123(orderId);
        });
    });
}

// View order details
function viewOrderDetails123(orderId) {
    // Get order data
    const orders = JSON.parse(localStorage.getItem('orders') || '[]');
    const order = orders.find(o => o.id === orderId);
    
    if (!order) {
        alert('Order not found!');
        return;
    }
    
    // Create modal
    const modal = document.createElement('div');
    modal.className = 'modal';
    
    // Format date
    const orderDate = new Date(order.dateCreated);
    const formattedDate = orderDate.toLocaleString();
    
    // Get resources data
    const resources = JSON.parse(localStorage.getItem('resources') || '[]');
    
    // Build order items HTML
    let orderItemsHTML = '';
    order.items.forEach(item => {
        const resource = resources.find(r => r.id === item.resourceId);
        if (resource) {
            orderItemsHTML += `
                <div class="order-detail-item">
                    <div class="item-info">
                        <span class="item-name">${resource.name}</span>
                        <span class="item-price">$${resource.price.toFixed(2)} × ${item.quantity}</span>
                    </div>
                    <div class="item-subtotal">
                        $${(resource.price * item.quantity).toFixed(2)}
                    </div>
                </div>
            `;
        }
    });
    
    // Build modal content
    modal.innerHTML = `
        <div class="modal-content">
            <span class="close-modal">&times;</span>
            <div class="order-details">
                <h2>Order Details</h2>
                <div class="order-summary">
                    <p><strong>Order ID:</strong> ${order.id}</p>
                    <p><strong>Date:</strong> ${formattedDate}</p>
                    <p><strong>Status:</strong> ${order.status === 'confirmed' ? 'Confirmed' : 'Pending'}</p>
                </div>
                
                <div class="order-items">
                    <h3>Order Items</h3>
                    ${orderItemsHTML}
                </div>
                
                <div class="order-total">
                    <h3>Total: $${order.total.toFixed(2)}</h3>
                </div>
            </div>
        </div>
    `;
    
    // Add modal to page
    document.body.appendChild(modal);
    
    // Show modal
    setTimeout(() => {
        modal.classList.add('show');
    }, 10);
    
    // Close modal event
    const closeBtn = modal.querySelector('.close-modal');
    closeBtn.addEventListener('click', function() {
        modal.classList.remove('show');
        setTimeout(() => {
            document.body.removeChild(modal);
        }, 300);
    });
    
    // Click outside modal to close
    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            modal.classList.remove('show');
            setTimeout(() => {
                document.body.removeChild(modal);
            }, 300);
        }
    });
}

// Download order history
function downloadOrders123() {
    // Get current user
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (!currentUser) {
        alert('User information not found!');
        return;
    }
    
    // Get orders data
    const orders = JSON.parse(localStorage.getItem('orders') || '[]');
    
    // Filter orders for current user
    const userOrders = orders.filter(order => order.username === currentUser.username);
    
    if (userOrders.length === 0) {
        alert('You have no order records!');
        return;
    }
    
    // Create export data
    const exportData = {
        username: currentUser.username,
        exportDate: new Date().toISOString(),
        orders: userOrders
    };
    
    // Create and download file
    const dataStr = JSON.stringify(exportData, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    
    const exportFileDefaultName = `orders_${currentUser.username}_${new Date().toISOString().split('T')[0]}.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
}

// Load todo list
function loadTodoList123() {
    const todoList = document.getElementById('todo-list');
    if (!todoList) return;
    
    // Get current user
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (!currentUser) return;
    
    // Get todos from localStorage
    const todos = JSON.parse(localStorage.getItem(`todos_${currentUser.username}`) || '[]');
    
    // Clear todo list
    todoList.innerHTML = '';
    
    // Add todos to list
    todos.forEach(todo => {
        const todoItem = document.createElement('li');
        todoItem.className = `todo-item ${todo.completed ? 'completed' : ''}`;
        todoItem.innerHTML = `
            <input type="checkbox" class="todo-checkbox" data-id="${todo.id}" ${todo.completed ? 'checked' : ''}>
            <span class="todo-text">${todo.text}</span>
            <button class="delete-todo" data-id="${todo.id}">&times;</button>
        `;
        todoList.appendChild(todoItem);
    });
}

// Add new todo
function addTodo123() {
    const newTodoInput = document.getElementById('new-todo');
    if (!newTodoInput) return;
    
    const todoText = newTodoInput.value.trim();
    if (!todoText) return;
    
    // Get current user
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (!currentUser) return;
    
    // Get existing todos
    const todos = JSON.parse(localStorage.getItem(`todos_${currentUser.username}`) || '[]');
    
    // Create new todo
    const newTodo = {
        id: Date.now().toString(),
        text: todoText,
        completed: false,
        dateCreated: new Date().toISOString()
    };
    
    // Add to todos array
    todos.push(newTodo);
    
    // Save to localStorage
    localStorage.setItem(`todos_${currentUser.username}`, JSON.stringify(todos));
    
    // Clear input
    newTodoInput.value = '';
    
    // Reload todo list
    loadTodoList123();
}

// Delete todo
function deleteTodo123(todoId) {
    // Get current user
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (!currentUser) return;
    
    // Get existing todos
    const todos = JSON.parse(localStorage.getItem(`todos_${currentUser.username}`) || '[]');
    
    // Remove todo
    const updatedTodos = todos.filter(todo => todo.id !== todoId);
    
    // Save to localStorage
    localStorage.setItem(`todos_${currentUser.username}`, JSON.stringify(updatedTodos));
    
    // Reload todo list
    loadTodoList123();
}

// Toggle todo status
function toggleTodoStatus123(todoId) {
    // Get current user
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (!currentUser) return;
    
    // Get existing todos
    const todos = JSON.parse(localStorage.getItem(`todos_${currentUser.username}`) || '[]');
    
    // Find and update todo
    const updatedTodos = todos.map(todo => {
        if (todo.id === todoId) {
            return { ...todo, completed: !todo.completed };
        }
        return todo;
    });
    
    // Save to localStorage
    localStorage.setItem(`todos_${currentUser.username}`, JSON.stringify(updatedTodos));
    
    // Reload todo list
    loadTodoList123();
}

// Clear user data
function clearUserData123() {
    if (!confirm('Are you sure you want to clear all your data? This action cannot be undone.')) {
        return;
    }
    
    // Get current user
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (!currentUser) return;
    
    // Clear cart
    localStorage.removeItem('cart');
    
    // Clear orders
    const orders = JSON.parse(localStorage.getItem('orders') || '[]');
    const updatedOrders = orders.filter(order => order.username !== currentUser.username);
    localStorage.setItem('orders', JSON.stringify(updatedOrders));
    
    // Clear todos
    localStorage.removeItem(`todos_${currentUser.username}`);
    
    // Reload page
    location.reload();
} 