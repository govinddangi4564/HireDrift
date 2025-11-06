document.addEventListener('DOMContentLoaded', () => {
    // --- 1. ELEMENT SELECTION ---
    const profilePicture = document.getElementById('profilePicture');
    const userName = document.getElementById('userName');
    const userEmail = document.getElementById('userEmail');
    const fullNameInput = document.getElementById('fullName');
    const phoneInput = document.getElementById('phone');
    const newsletterToggle = document.getElementById('newsletterToggle');
    const editButton = document.getElementById('editButton');
    const saveButton = document.getElementById('saveButton');
    const profileForm = document.getElementById('profileForm');
    const logoutButton = document.getElementById('logoutButton');

    let currentUser = null;

    // --- 2. LOAD USER DATA ---
    // Function to load user data from sessionStorage and populate the form
    function loadUserData() {
        const savedUser = sessionStorage.getItem('googleUser');

        if (savedUser) {
            currentUser = JSON.parse(savedUser);

            // Populate display elements
            profilePicture.src = currentUser.picture || 'https://via.placeholder.com/120';
            userName.textContent = currentUser.name || 'User Name';
            userEmail.textContent = currentUser.email || 'user.email@example.com';

            // Populate form fields
            fullNameInput.value = currentUser.name || '';
            phoneInput.value = currentUser.phone || ''; // Assuming phone can be stored
            newsletterToggle.checked = currentUser.newsletter || false; // Set the newsletter toggle

        } else {
            // If no user data is found, redirect to the home page to log in
            alert('You are not logged in. Redirecting to home page.');
            window.location.href = '../Index.html';
        }
    }

    // --- 3. EVENT LISTENERS ---

    // Edit Button: Enable form fields for editing
    editButton.addEventListener('click', () => {
        fullNameInput.disabled = false;
        phoneInput.disabled = false;

        // Toggle button visibility
        editButton.style.display = 'none';
        saveButton.style.display = 'inline-flex';

        fullNameInput.focus(); // Focus on the first editable field
    });

    // Form Submission (Save Changes)
    profileForm.addEventListener('submit', (e) => {
        e.preventDefault();

        // Update the currentUser object with new values
        currentUser.name = fullNameInput.value.trim();
        currentUser.phone = phoneInput.value.trim();
        currentUser.newsletter = newsletterToggle.checked; // Get the updated newsletter preference

        // Save the updated user object back to sessionStorage
        sessionStorage.setItem('googleUser', JSON.stringify(currentUser));

        // TODO: Add a backend API call here to save the data permanently
        // For example:
        // await fetch('/api/update-profile', {
        //     method: 'POST',
        //     headers: { 'Content-Type': 'application/json' },
        //     body: JSON.stringify(currentUser)
        // });

        // Disable form fields again
        fullNameInput.disabled = true;
        phoneInput.disabled = true;

        // Toggle button visibility
        saveButton.style.display = 'none';
        editButton.style.display = 'inline-flex';

        // Update the display name
        userName.textContent = currentUser.name;

        alert('Profile updated successfully!');
    });

    // Logout Button
    logoutButton.addEventListener('click', () => {
        // Clear session storage
        sessionStorage.removeItem('googleUser');

        // TODO: Call backend to invalidate session if necessary

        // Redirect to home page
        alert('You have been logged out.');
        window.location.href = '../Index.html';
    });

    // --- 4. INITIALIZATION ---
    loadUserData();
});