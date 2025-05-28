// Hanniba - Authentication related JavaScript file

document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM Content Loaded');
    
    // Check if current page is logout page
    if (window.location.pathname.includes('logout.html')) {
        // Ensure user is logged out
        localStorage.removeItem('currentUser');
        sessionStorage.removeItem('isLoggedIn');
        
        // Redirect to home page after 3 seconds
        setTimeout(function() {
            window.location.href = 'index.html';
        }, 3000);
    } else {
        // Normal initialization for other pages
        // Ensure users array exists in localStorage
        if (!localStorage.getItem('users')) {
            // Create default test user
            const testUser = {
                id: 'test-001',
                username: 'test',
                password: 'Test@123'
            };
            localStorage.setItem('users', JSON.stringify([testUser]));
        }
        
        // Initialize auth forms
        initializeAuthForms();
        
        // Check if user is logged in
        checkAuthentication123();
    }
});

function initializeAuthForms() {
    // Get login and register buttons and form containers
    const loginBtn = document.getElementById('login-btn');
    const registerBtn = document.getElementById('register-btn');
    const loginForm = document.getElementById('login-form');
    const registerForm = document.getElementById('register-form');
    const authForms = document.getElementById('auth-forms');
    
    console.log('Login button:', loginBtn);
    console.log('Register button:', registerBtn);
    console.log('Login form:', loginForm);
    console.log('Register form:', registerForm);
    
    // Initially hide auth forms if user is logged in
    if (localStorage.getItem('currentUser')) {
        if (authForms) authForms.style.display = 'none';
    }
    
    // Login button click event
    if (loginBtn) {
        loginBtn.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            console.log('Login button clicked');
            if (loginForm) {
                loginForm.style.display = 'block';
                console.log('Login form displayed');
            }
            if (registerForm) {
                registerForm.style.display = 'none';
                console.log('Register form hidden');
            }
            if (authForms) {
                authForms.style.display = 'flex';
            }
        });
    }
    
    // Register button click event
    if (registerBtn) {
        registerBtn.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            console.log('Register button clicked');
            if (loginForm) {
                loginForm.style.display = 'none';
                console.log('Login form hidden');
            }
            if (registerForm) {
                registerForm.style.display = 'block';
                console.log('Register form displayed');
            }
            if (authForms) {
                authForms.style.display = 'flex';
            }
        });
    }
    
    // Login form submit handler
    const loginFormElement = document.getElementById('loginForm');
    if (loginFormElement) {
        loginFormElement.addEventListener('submit', function(e) {
            e.preventDefault();
            const username = document.getElementById('login-username').value;
            const password = document.getElementById('login-password').value;
            console.log('Login attempt:', username);
            login123(username, password);
        });
    }

    // Register form submit handler
    const registerFormElement = document.getElementById('registerForm');
    if (registerFormElement) {
        registerFormElement.addEventListener('submit', function(e) {
            e.preventDefault();
            const username = document.getElementById('register-username').value;
            const password = document.getElementById('register-password').value;
            const confirmPassword = document.getElementById('register-confirm-password').value;
            
            if (password !== confirmPassword) {
                alert('Passwords do not match!');
                return;
            }
            
            console.log('Register attempt:', username);
            register123(username, password);
        });
    }
    
    // Add password match validation
    const confirmPasswordInput = document.getElementById('register-confirm-password');
    if (confirmPasswordInput) {
        confirmPasswordInput.addEventListener('input', validatePasswordMatch123);
    }
}

function checkAuthentication123() {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    const authLinks = document.getElementById('auth-links');
    const userInfo = document.getElementById('user-info');
    const usernameDisplay = document.getElementById('username-display');
    const authRequiredElements = document.querySelectorAll('.auth-required');
    const authForms = document.getElementById('auth-forms');

    console.log('Checking authentication for user:', currentUser);
    console.log('Auth links element:', authLinks);
    console.log('User info element:', userInfo);
    console.log('Auth forms element:', authForms);

    if (currentUser) {
        // User is logged in
        if (authLinks) authLinks.style.display = 'none';
        if (userInfo) {
            userInfo.style.display = 'block';
            usernameDisplay.textContent = currentUser.username;
        }
        if (authRequiredElements) {
            authRequiredElements.forEach(element => {
                element.style.display = 'block';
            });
        }
        if (authForms) authForms.style.display = 'none';
        
        // Ensure session storage is set
        sessionStorage.setItem('isLoggedIn', 'true');
    } else {
        // User is not logged in
        if (authLinks) authLinks.style.display = 'block';
        if (userInfo) userInfo.style.display = 'none';
        if (authRequiredElements) {
            authRequiredElements.forEach(element => {
                element.style.display = 'none';
            });
        }
        if (authForms) {
            authForms.style.display = 'flex';
            // Ensure login form is displayed and register form is hidden
            const loginForm = document.getElementById('login-form');
            const registerForm = document.getElementById('register-form');
            if (loginForm) loginForm.style.display = 'block';
            if (registerForm) registerForm.style.display = 'none';
        }
        
        // Clear session storage
        sessionStorage.removeItem('isLoggedIn');
    }
}

function login123(username, password) {
    // Get user data from localStorage
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    console.log('Available users:', users);
    const user = users.find(u => u.username === username && u.password === password);

    if (user) {
        // Login successful
        const currentUser = {
            id: user.id,
            username: user.username
        };
        localStorage.setItem('currentUser', JSON.stringify(currentUser));
        sessionStorage.setItem('isLoggedIn', 'true');
        checkAuthentication123();
        alert('Login successful!');
    } else {
        // Login failed
        alert('Invalid username or password!');
    }
}

function register123(username, password) {
    // Get existing users from localStorage
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    console.log('Current users:', users);

    // Check if username already exists
    if (users.some(user => user.username === username)) {
        alert('Username already exists!');
        return;
    }

    // Create new user object
    const newUser = {
        id: Date.now().toString(),
        username: username,
        password: password
    };

    // Add new user
    users.push(newUser);
    localStorage.setItem('users', JSON.stringify(users));
    console.log('Updated users:', users);

    // Auto login
    const currentUser = {
        id: newUser.id,
        username: newUser.username
    };
    localStorage.setItem('currentUser', JSON.stringify(currentUser));
    sessionStorage.setItem('isLoggedIn', 'true');
    checkAuthentication123();
    alert('Registration successful!');
}

function logout123() {
    // Clear user login status
    localStorage.removeItem('currentUser');
    sessionStorage.removeItem('isLoggedIn');
    
    // Redirect to logout page
    window.location.href = 'logout.html';
}

// Password match validation
function validatePasswordMatch123() {
    const password = document.getElementById('register-password').value;
    const confirmPassword = document.getElementById('register-confirm-password').value;
    const confirmInput = document.getElementById('register-confirm-password');
    
    if (password !== confirmPassword) {
        confirmInput.setCustomValidity('Passwords do not match');
    } else {
        confirmInput.setCustomValidity('');
    }
}

// Update user display
function updateUserDisplay123() {
    const authLinks = document.getElementById('auth-links');
    const userInfo = document.getElementById('user-info');
    const usernameDisplay = document.getElementById('username-display');
    
    if (!authLinks || !userInfo || !usernameDisplay) return;
    
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    
    if (currentUser) {
        // User is logged in
        authLinks.style.display = 'none';
        userInfo.style.display = 'block';
        usernameDisplay.textContent = currentUser.username;
    } else {
        // User is not logged in
        authLinks.style.display = 'block';
        userInfo.style.display = 'none';
    }
} 