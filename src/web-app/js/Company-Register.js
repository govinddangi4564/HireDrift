// Get all elements
const pricingPage = document.getElementById('pricingPage');
const registrationPage = document.getElementById('registrationPage');
const selectedPlanName = document.getElementById('selectedPlanName');
const selectButtons = document.querySelectorAll('.select-btn');
const backBtn = document.getElementById('backBtn');
const registrationForm = document.getElementById('registrationForm');

function showMessage(text, type) {
    const messageDiv = document.getElementById('message');
    messageDiv.textContent = text;
    messageDiv.className = `message ${type}`;
    messageDiv.style.display = 'block';
    setTimeout(() => {
        messageDiv.style.display = 'none';
    }, 3000);
}

// Add click event to all plan buttons
selectButtons.forEach(button => {
    button.addEventListener('click', function () {
        const card = this.closest('.pricing-card');
        const planName = card.getAttribute('data-plan');

        // Update selected plan name
        selectedPlanName.textContent = planName + ' Plan';

        // Show registration page
        pricingPage.classList.add('hidden');
        registrationPage.classList.add('active');

        // Scroll to top
        window.scrollTo(0, 0);
    });
});

// Back button functionality
backBtn.addEventListener('click', function () {
    registrationPage.classList.remove('active');
    pricingPage.classList.remove('hidden');

    // Scroll to top
    window.scrollTo(0, 0);
});

// Form submission
registrationForm.addEventListener('submit', function (e) {
    e.preventDefault();

    const firstName = this.elements[0].value;
    const lastName = this.elements[1].value;
    const email = this.elements[2].value;
    const password = this.elements[3].value;
    const plan = selectedPlanName.textContent;

    // alert(`Registration Successful!\n\nName: ${firstName} ${lastName}\nEmail: ${email}\nPlan: ${plan}\n\nWelcome to HaiTalent!`);

    // Reset form
    this.reset();
});

companyRegister.addEventListener('click', function () {
    showMessage('Redirecting to company registration...', 'success');

    // In a real application, redirect to registration page
    setTimeout(() => {
        window.location.href = '../Index.html';
    }, 1500);
});

// Add hover effect to pricing cards
const pricingCards = document.querySelectorAll('.pricing-card');
pricingCards.forEach(card => {
    card.addEventListener('mouseenter', function () {
        this.style.transform = 'translateY(-5px)';
    });

    card.addEventListener('mouseleave', function () {
        this.style.transform = 'translateY(0)';
    });
});