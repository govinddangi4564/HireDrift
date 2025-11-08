const loginForm = document.getElementById('loginForm');
const registerBtn = document.getElementById('registerBtn');
const messageDiv = document.getElementById('message');

const allowedEmail = "hr@gmail.com"; // <-- set your allowed Gmail here
const allowedPassword = "123456"; // optional: set a password if needed

function showMessage(text, type) {
    const messageDiv = document.getElementById('message');
    messageDiv.textContent = text;
    messageDiv.className = `message ${type}`;
    messageDiv.style.display = 'block';
    setTimeout(() => {
        messageDiv.style.display = 'none';
    }, 3000);
}

loginForm.addEventListener('submit', function (e) {
    e.preventDefault();

    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value.trim();

    // Check if email matches allowed one
    if (email === allowedEmail && password === allowedPassword) {
        showMessage('Login successful! Redirecting...', 'success');
        console.log('Login attempt:', { email, password });

        setTimeout(() => {
            window.location.href = './dashboard.html';
        }, 1500);
    } else {
        showMessage('Invalid email or password!', 'error');
        console.log('Unauthorized login attempt:', { email });
    }
});

registerBtn.addEventListener('click', function () {
    showMessage('Redirecting to company registration...', 'success');
    console.log('Navigating to company registration page');

    // In a real application, redirect to registration page
    setTimeout(() => {
        window.location.href = 'Company-Register.html';
    }, 1500);
});