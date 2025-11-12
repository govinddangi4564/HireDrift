// Registration elements only
const registrationPage = document.getElementById('registrationPage');
const selectedPlanName = document.getElementById('selectedPlanName');
const backBtn = document.getElementById('backBtn');
const registrationForm = document.getElementById('registrationForm');

// Ensure a plan is selected; otherwise, go to plans page
(function initRegistrationFromPlan() {
    try {
        const savedPlanRaw = localStorage.getItem('companyPlan');
        if (!savedPlanRaw) {
            window.location.href = './plans.html';
            return;
        }
        const plan = JSON.parse(savedPlanRaw);
        if (!plan || !plan.name) {
            window.location.href = './plans.html';
            return;
        }
        selectedPlanName.textContent = plan.name + ' Plan';
        window.scrollTo(0, 0);
    } catch (_) {
        window.location.href = './plans.html';
    }
})();

/**
 * ============================================================================
 * COMPANY REGISTRATION - BACKEND INTEGRATION
 * ============================================================================
 *
 * 1. API Endpoint: POST /api/companies/register
 *
 * 2. Request Body:
 *    {
 *      "firstName": "John",
 *      "lastName": "Doe",
 *      "email": "john.doe@company.com",
 *      "password": "secure_password",
 *      "plan": "Agency Plan"
 *    }
 *
 * 3. Success Response (201 Created):
 *    {
 *      "token": "your_jwt_token_for_auto_login",
 *      "company": { "id": "new-company-id", "name": "John Doe's Company" }
 *    }
 */

function showMessage(text, type) {
    const messageDiv = document.getElementById('message');
    messageDiv.textContent = text;
    messageDiv.className = `message ${type}`;
    messageDiv.style.display = 'block';
    setTimeout(() => {
        messageDiv.style.display = 'none';
    }, 3000);
}

// Back button: go to plans page
backBtn.addEventListener('click', function () {
    window.location.href = './plans.html';
});

// Form submission
registrationForm.addEventListener('submit', function (e) {
    e.preventDefault();

    const firstName = this.elements[0].value;
    const lastName = this.elements[1].value;
    const email = this.elements[2].value;
    const password = this.elements[3].value;
    const plan = selectedPlanName.textContent;

    // TODO: Replace this with a backend API call.
    // =================================================
    // const registrationData = { firstName, lastName, email, password, plan };
    // fetch('/api/companies/register', {
    //     method: 'POST',
    //     headers: { 'Content-Type': 'application/json' },
    //     body: JSON.stringify(registrationData)
    // })
    // .then(response => response.json())
    // .then(data => {
    //     sessionStorage.setItem('companyAuthToken', data.token); // Auto-login
    //     showMessage('Registration successful! Redirecting...', 'success');
    //     setTimeout(() => window.location.href = './dashboard.html', 1500);
    // })
    // .catch(error => showMessage('Registration failed!', 'error'));
    // =================================================

    // DEMO: Simulate successful registration and redirect
    showMessage('Redirecting to company registration...', 'success');
    sessionStorage.setItem('isCompanyLoggedIn', 'true'); // Set session flag

    // In a real application, redirect to registration page
    setTimeout(() => {
        window.location.href = './dashboard.html';
    }, 1500);

    // Reset form
    this.reset();
});