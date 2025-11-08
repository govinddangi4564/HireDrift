// Professional Company Profile JS: Handles form submission, validation, and feedback

document.addEventListener('DOMContentLoaded', function () {
    const form = document.getElementById('companyProfileForm');
    const messageDiv = document.getElementById('message');

    form.addEventListener('submit', function (e) {
        e.preventDefault();
        messageDiv.textContent = '';
        messageDiv.style.color = '#d9534f';

        // Get form values
        const companyName = document.getElementById('companyName').value.trim();
        const companyEmail = document.getElementById('companyEmail').value.trim();
        const companyAddress = document.getElementById('companyAddress').value.trim();
        const companyDescription = document.getElementById('companyDescription').value.trim();
        const companyLogo = document.getElementById('companyLogo').files[0];
        const companyWebsite = document.getElementById('companyWebsite').value.trim();
        const companyContact = document.getElementById('companyContact').value.trim();

        // Validation
        if (!companyName || !companyEmail || !companyAddress) {
            messageDiv.textContent = 'Please fill in all required fields.';
            return;
        }
        if (companyWebsite && !/^https?:\/\/.+\..+/.test(companyWebsite)) {
            messageDiv.textContent = 'Please enter a valid website URL.';
            return;
        }
        if (companyContact && !/^\+?[0-9\-\s]{7,}$/.test(companyContact)) {
            messageDiv.textContent = 'Please enter a valid contact number.';
            return;
        }
        if (companyLogo && !companyLogo.type.startsWith('image/')) {
            messageDiv.textContent = 'Logo must be an image file.';
            return;
        }

        // Simulate saving profile (replace with actual backend integration)
        messageDiv.style.color = '#28a745';
        messageDiv.textContent = 'Profile updated successfully!';

        // Optionally, reset form after success
        // form.reset();
    });
});
