document.addEventListener('DOMContentLoaded', function () {
    // --- 1. ELEMENT SELECTION ---
    const registrationForm = document.getElementById('registrationForm');
    const fullNameInput = document.getElementById('fullName');
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');
    const confirmPasswordInput = document.getElementById('confirmPassword');
    const termsCheckbox = document.getElementById('terms');

    // --- 2. MANUAL REGISTRATION FORM HANDLER ---
    registrationForm.addEventListener('submit', async (event) => {
        // Prevent the default form submission which reloads the page
        event.preventDefault();

        // Validate the form fields
        if (!validateForm()) return;

        // --- Data Collection ---
        const formData = {
            fullName: fullNameInput.value.trim(),
            email: emailInput.value.trim(),
            password: passwordInput.value,
            phone: document.getElementById('phone').value.trim(),
            newsletter: document.getElementById('newsletter').checked
        };

        // --- Backend Integration Point ---
        try {
            console.log('Submitting registration data to backend:', formData);

            /*
            // EXAMPLE: How to send data to a backend registration endpoint
            const response = await fetch('/api/register', { // Replace with your actual API endpoint
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Registration failed.');
            }

            const user = await response.json(); // Backend should return the new user object
            */

            // --- DEMO-ONLY LOGIC (Simulate user creation) ---
            const user = {
                name: formData.fullName,
                email: formData.email,
                picture: 'https://via.placeholder.com/150/7c3aed/ffffff?text=' + formData.fullName.charAt(0).toUpperCase(),
                phone: formData.phone,
                newsletter: formData.newsletter
            };

            // --- Create Session and Redirect ---
            // Store user data in sessionStorage to log them in for the current session
            sessionStorage.setItem('googleUser', JSON.stringify(user));

            alert('Registration successful! Welcome, ' + user.name);
            // Redirect to the home page, where they will now be logged in
            window.location.href = '../Index.html';

        } catch (error) {
            console.error('Registration Error:', error);
            alert(error.message);
        }
    });

    // --- 3. FORM VALIDATION LOGIC ---
    function validateForm() {
        // Checks for full name
        if (fullNameInput.value.trim() === '') {
            alert('Please enter your full name.');
            return false;
        }

        // Checks password length
        if (passwordInput.value.length < 8) {
            alert('Password must be at least 8 characters.');
            return false;
        }

        // Checks if passwords match
        if (passwordInput.value !== confirmPasswordInput.value) {
            alert('Passwords do not match.');
            return false;
        }

        // Checks if terms are agreed to
        if (!termsCheckbox.checked) {
            alert('You must agree to the Terms & Conditions.');
            return false;
        }

        // If all checks pass, the form is valid
        return true;
    }
});

// --- 4. GOOGLE SIGN-UP ACTIVATION ---
// This function is now in the global scope and will be called by the Google script
// once it has finished loading, thanks to the `data-callback` attribute.
function initializeGoogleSignUp() {
    const googleSignUpBtn = document.getElementById('googleSignUpBtn');

    const CLIENT_ID = '716638260025-otlb8qrc3p2fs6288oh4u1v1qe3upkh5.apps.googleusercontent.com';

    // Initialize the Google Identity Services client
    google.accounts.id.initialize({
        client_id: CLIENT_ID,
        callback: handleGoogleSignUpResponse, // Use a specific callback for sign-up
    });

    // Attach the click listener to the Google Sign-Up button
    googleSignUpBtn.addEventListener('click', () => {
        google.accounts.id.prompt(); // Trigger the Google One Tap UI
    });

    console.log('Google Sign-Up button is now active.');
}

// Callback function to handle the response from Google Sign-Up
function handleGoogleSignUpResponse(response) {
    try {
        // Decode the JWT to get user information
        const payload = JSON.parse(atob(response.credential.split('.')[1]));

        // Create a user object from the Google payload
        const user = {
            name: payload.name,
            email: payload.email,
            picture: payload.picture,
            phone: '', // Phone is not provided by Google, leave it empty
            newsletter: true // Default to true for new sign-ups
        };

        // Store the user data in sessionStorage to create a session
        sessionStorage.setItem('googleUser', JSON.stringify(user));

        alert('Sign-up with Google successful! Welcome, ' + user.name);
        // Redirect to the home page
        window.location.href = '../Index.html';

    } catch (error) {
        console.error('Error handling Google Sign-Up response:', error);
        alert('Failed to sign up with Google. Please try again.');
    }
}
