// This script manages the functionality of the "Forgot Password" page,
// including form submission, UI updates, and a countdown timer for resending the email.

document.addEventListener('DOMContentLoaded', () => {

    // --- 1. ELEMENT SELECTION ---
    // Get references to all the necessary HTML elements.
    const forgotPasswordForm = document.getElementById('forgotPasswordForm');
    const successMessage = document.getElementById('successMessage');
    const emailInput = document.getElementById('email');
    const sentEmailSpan = document.getElementById('sentEmail');
    const resendBtn = document.getElementById('resendBtn');
    const resendTimer = document.getElementById('resendTimer');
    const countdownSpan = document.getElementById('countdown');

    let userEmail = ''; // To store the user's email for the resend action
    let countdownTimer = null; // To hold the interval ID for the countdown

    // --- 2. FORM SUBMISSION HANDLER ---
    // This function is triggered when the user clicks the "Send Reset Link" button.
    forgotPasswordForm.addEventListener('submit', async (e) => {
        e.preventDefault(); // Prevent the default browser form submission

        userEmail = emailInput.value;
        if (!userEmail) {
            alert('Please enter a valid email address.');
            return;
        }

        // --- Backend Integration Point 1: Send Reset Link ---
        // This is where you would call your backend API to initiate the password reset process.
        // The backend should handle sending the actual email with a unique reset token.
        try {
            /*
            // EXAMPLE: How to send the email to your backend API
            const response = await fetch('/api/forgot-password', { // Replace with your actual API endpoint
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: userEmail }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to send reset link. Please try again.');
            }
            */

            // On successful API call, update the UI to show the success message.
            console.log('Password reset requested for:', userEmail);

            sentEmailSpan.textContent = userEmail;
            forgotPasswordForm.classList.add('hidden');
            successMessage.classList.remove('hidden');

            startResendTimer(); // Start the countdown for the "Resend" button

        } catch (error) {
            console.error('Forgot Password Error:', error);
            alert(error.message); // Display any errors to the user
        }
    });

    // --- 3. RESEND EMAIL HANDLER ---
    // This function is triggered when the user clicks the "Resend Email" button.
    resendBtn.addEventListener('click', async () => {
        const resendBtnText = document.getElementById('resendBtnText');

        resendBtnText.textContent = 'Sending...';
        resendBtn.disabled = true;

        // --- Backend Integration Point 2: Resend Reset Link ---
        // This would call the same backend endpoint as before to resend the email.
        try {
            // Simulate API call delay for demo purposes
            await new Promise(resolve => setTimeout(resolve, 1500));
            console.log('Password reset email resent to:', userEmail);

            // Update UI to show confirmation
            resendBtnText.innerHTML = '<i class="fas fa-check mr-2"></i>Email Sent!';
            startResendTimer(); // Restart the countdown

            // Reset button text after a short delay
            setTimeout(() => {
                resendBtnText.innerHTML = '<i class="fas fa-redo mr-2"></i>Resend Email';
            }, 2000);

        } catch (error) {
            console.error('Resend Email Error:', error);
            alert(error.message);
            resendBtnText.textContent = 'Resend Email'; // Reset button text on error
        }
    });

    // --- 4. COUNTDOWN TIMER LOGIC ---
    // Manages the 60-second countdown before the user can resend the email.
    function startResendTimer() {
        let timeLeft = 60;
        resendBtn.disabled = true;
        resendTimer.classList.remove('hidden');
        countdownSpan.textContent = timeLeft;

        if (countdownTimer) clearInterval(countdownTimer); // Clear any existing timer

        countdownTimer = setInterval(() => {
            timeLeft--;
            countdownSpan.textContent = timeLeft;
            if (timeLeft <= 0) {
                clearInterval(countdownTimer);
                resendBtn.disabled = false;
                resendTimer.classList.add('hidden');
            }
        }, 1000);
    }
});