// Drag & Drop Upload
const uploadArea = document.getElementById('uploadArea');
const fileInput = document.getElementById('fileInput');
const fileList = document.getElementById('fileList');
const progress = document.getElementById('progress');

uploadArea.addEventListener('click', () => fileInput.click());
uploadArea.addEventListener('dragover', e => { e.preventDefault(); uploadArea.classList.add('dragover'); });
uploadArea.addEventListener('dragleave', () => uploadArea.classList.remove('dragover'));
uploadArea.addEventListener('drop', e => {
    e.preventDefault(); uploadArea.classList.remove('dragover');
    handleFiles(e.dataTransfer.files);
});
fileInput.addEventListener('change', e => handleFiles(e.target.files));

function handleFiles(files) {
    if (!files.length) return;
    const file = files[0];
    fileList.innerHTML = `<p><strong>${file.name}</strong> (${Math.round(file.size / 1024)} KB)</p>`;
    simulateUpload(file);
}

// Foating button
const scrollToTopBtn = document.getElementById("scrollToTopBtn");

// Show button when user scrolls down
window.addEventListener("scroll", () => {
    if (window.scrollY > 200) {
        scrollToTopBtn.classList.add("show");
    } else {
        scrollToTopBtn.classList.remove("show");
    }
});

// Scroll to top when button clicked
scrollToTopBtn.addEventListener("click", () => {
    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });
});

// Auto open popup after 5 seconds
setTimeout(() => {
    openPopup();
}, 5000);

// Function to open popup
function openPopup() {
    document.getElementById('overlay').classList.add('active');
    document.body.style.overflow = 'hidden'; // prevent scroll when popup is open
}

// Function to close popup (only via × button)
function closePopup() {
    document.getElementById('overlay').classList.remove('active');
    document.body.style.overflow = 'auto';
    history.replaceState(null, null, ' '); // remove #sign-in from URL
}

// Automatically open popup when URL contains #sign-in
window.addEventListener('load', () => {
    if (window.location.hash === '#sign-in') {
        openPopup();
    }
    
    // Initialize Google Sign-In
    initializeGoogleSignIn();
    
    // Check if user is already signed in on page load
    const savedUser = localStorage.getItem('googleUser');
    if (savedUser) {
        try {
            const user = JSON.parse(savedUser);
            googleUser = user;
            updateSignInButtonToProfile(user);
        } catch (error) {
            console.error('Error loading saved user:', error);
            localStorage.removeItem('googleUser');
        }
    }
});

// Google Sign-In Implementation
let googleUser = null;
let tokenClient = null;

// Function to initialize Google Sign-In
function initializeGoogleSignIn() {
    const googleSignInBtn = document.getElementById('googleSignInBtn');

    if (!googleSignInBtn) {
        console.warn('Google Sign-In button not found');
        return;
    }

    // Wait for Google Identity Services to load
    function waitForGoogle() {
        if (typeof google !== 'undefined' && google.accounts) {
            setupGoogleSignIn();
        } else {
            // Retry if Google Identity Services hasn't loaded yet
            setTimeout(waitForGoogle, 100);
        }
    }

    waitForGoogle();
}

function setupGoogleSignIn() {
    const googleSignInBtn = document.getElementById('googleSignInBtn');

    // IMPORTANT: Replace this with your actual Google Client ID
    // Get it from: https://console.cloud.google.com/apis/credentials
    // For development/testing, you can use a placeholder that will show instructions
    const CLIENT_ID = '716638260025-otlb8qrc3p2fs6288oh4u1v1qe3upkh5.apps.googleusercontent.com';

    // Check if Client ID is configured
    if (CLIENT_ID === 'YOUR_GOOGLE_CLIENT_ID.apps.googleusercontent.com') {
        // Show instructions if not configured
        googleSignInBtn.addEventListener('click', () => {
            alert('Google Sign-In Configuration Required!\n\n' +
                'To enable Google Sign-In:\n' +
                '1. Go to https://console.cloud.google.com/\n' +
                '2. Create a new project or select existing one\n' +
                '3. Enable Google+ API\n' +
                '4. Go to APIs & Services > Credentials\n' +
                '5. Create OAuth 2.0 Client ID\n' +
                '6. Add authorized JavaScript origins\n' +
                '7. Replace CLIENT_ID in Script.js (line ~95) with your Client ID');
        });
        return;
    }

    // Initialize Google Identity Services
    google.accounts.id.initialize({
        client_id: CLIENT_ID,
        callback: handleCredentialResponse,
    });

    // Initialize OAuth 2.0 token client for fallback
    tokenClient = google.accounts.oauth2.initTokenClient({
        client_id: CLIENT_ID,
        scope: 'email profile',
        callback: handleTokenResponse,
    });

    // Add click event listener to the button
    googleSignInBtn.addEventListener('click', () => {
        // Try to use One Tap first
        google.accounts.id.prompt((notification) => {
            if (notification.isNotDisplayed() || notification.isSkippedMoment() || notification.isDismissedMoment()) {
                // If One Tap is not available, use OAuth 2.0 popup
                if (tokenClient) {
                    tokenClient.requestAccessToken({ prompt: 'consent' });
                }
            }
        });
    });
}

// Handle credential response from Google One Tap
function handleCredentialResponse(response) {
    try {
        // Decode the JWT token to get user info
        const payload = JSON.parse(atob(response.credential.split('.')[1]));

        // Store user info
        googleUser = {
            name: payload.name,
            email: payload.email,
            picture: payload.picture,
            sub: payload.sub
        };

        // Display user info
        displayUserInfo(googleUser);

        // Close the popup after successful sign-in
        setTimeout(() => {
            closePopup();
        }, 2000);
    } catch (error) {
        console.error('Error handling credential response:', error);
        alert('Failed to sign in with Google. Please try again.');
    }
}

// Handle token response from OAuth 2.0 flow
function handleTokenResponse(tokenResponse) {
    if (tokenResponse.error) {
        console.error('Google Sign-In error:', tokenResponse.error);
        alert('Failed to sign in with Google: ' + tokenResponse.error);
        return;
    }

    // Fetch user info using the access token
    fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
        headers: {
            'Authorization': `Bearer ${tokenResponse.access_token}`
        }
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to fetch user info');
            }
            return response.json();
        })
        .then(data => {
            googleUser = {
                name: data.name,
                email: data.email,
                picture: data.picture,
                id: data.id
            };
            displayUserInfo(googleUser);

            // Close the popup after successful sign-in
            setTimeout(() => {
                closePopup();
            }, 2000);
        })
        .catch(error => {
            console.error('Error fetching user info:', error);
            alert('Failed to sign in with Google. Please try again.');
        });
}

// Display user information after successful sign-in
function displayUserInfo(user) {
    const userInfoDiv = document.getElementById('user-info');
    if (userInfoDiv && user) {
        userInfoDiv.innerHTML = `
            <div style="text-align: center; padding: 20px; background: #f9fafb; border-radius: 12px; margin-top: 20px;">
                <img src="${user.picture}" alt="${user.name}" style="width: 80px; height: 80px; border-radius: 50%; margin-bottom: 10px; border: 3px solid #7c3aed;">
                <h3 style="margin: 10px 0; color: #1f2937; font-size: 20px;">Welcome, ${user.name}!</h3>
                <p style="color: #6b7280; margin: 5px 0; font-size: 14px;">${user.email}</p>
                <p style="color: #22c55e; margin-top: 10px; font-weight: 600; font-size: 14px;">✓ Successfully signed in with Google</p>
            </div>
        `;
    }
    
    // Update the sign-in button to profile button
    updateSignInButtonToProfile(user);
}

// Update sign-in button to profile button after successful sign-in
function updateSignInButtonToProfile(user) {
    const signInBtn = document.getElementById('sign-in');
    if (signInBtn && user) {
        // Remove onclick attribute and add new event listener
        signInBtn.removeAttribute('onclick');
        signInBtn.innerHTML = `
            <img src="${user.picture}" alt="Profile" style="width: 24px; height: 24px; border-radius: 50%; margin-right: 8px; border: 2px solid #7c3aed;">
            <span>Profile</span>
        `;
        signInBtn.onclick = (e) => {
            e.preventDefault();
            openProfilePopup();
        };
        
        // Store user data in localStorage for persistence
        localStorage.setItem('googleUser', JSON.stringify(user));
    }
}

// Function to open profile popup
function openProfilePopup() {
    if (!googleUser) {
        // If no user data, try to load from localStorage
        const savedUser = localStorage.getItem('googleUser');
        if (savedUser) {
            try {
                googleUser = JSON.parse(savedUser);
            } catch (error) {
                console.error('Error loading saved user:', error);
                alert('Please sign in first.');
                openPopup();
                return;
            }
        } else {
            alert('Please sign in first.');
            openPopup();
            return;
        }
    }
    
    const profileOverlay = document.getElementById('profileOverlay');
    const profileContent = document.getElementById('profileContent');
    
    if (profileOverlay && profileContent && googleUser) {
        // Display only essential profile information
        profileContent.innerHTML = `
            <div class="profile-header">
                <img src="${googleUser.picture}" alt="${googleUser.name}" class="profile-picture">
                <h2>${googleUser.name}</h2>
            </div>
            <div class="profile-details">
                <div class="profile-detail-item">
                    <div class="profile-detail-label">
                        <i class="fa-solid fa-envelope"></i>
                        <span>Email</span>
                    </div>
                    <div class="profile-detail-value">${googleUser.email}</div>
                </div>
                <div class="profile-detail-item">
                    <div class="profile-detail-label">
                        <i class="fa-solid fa-user"></i>
                        <span>Account Type</span>
                    </div>
                    <div class="profile-detail-value">Google Account</div>
                </div>
            </div>
            <div class="profile-actions">
                <button onclick="logout()" class="logout-btn">
                    <i class="fa-solid fa-sign-out-alt"></i>
                    Sign Out
                </button>
            </div>
        `;
        
        profileOverlay.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
}

// Function to close profile popup
function closeProfilePopup() {
    const profileOverlay = document.getElementById('profileOverlay');
    if (profileOverlay) {
        profileOverlay.classList.remove('active');
        document.body.style.overflow = 'auto';
    }
}

// Function to logout
function logout() {
    // Clear user data
    googleUser = null;
    localStorage.removeItem('googleUser');
    
    // Reset sign-in button
    const signInBtn = document.getElementById('sign-in');
    if (signInBtn) {
        signInBtn.innerHTML = `
            <i class="fa-solid fa-user"></i>
            Sign In
        `;
        signInBtn.onclick = (e) => {
            e.preventDefault();
            openPopup();
        };
    }
    
    // Close profile popup
    closeProfilePopup();
    
    // Show success message
    alert('Successfully signed out!');
}

// ✅ Removed the overlay click listener
// Now the popup closes only when the close button is clicked


/*
  Behavior:
  - Wait for a user interaction (scroll / wheel / touch / key) before starting to observe.
  - Then use IntersectionObserver to add .in-view (and unobserve after).
  - Fallback: throttled getBoundingClientRect checks if IntersectionObserver isn't available.
*/
(function () {
    document.addEventListener('DOMContentLoaded', () => {
        const items = Array.from(document.querySelectorAll('.scroll-item'));
        if (!items.length) return;

        // Throttle helper
        function throttle(fn, wait) {
            let last = 0;
            return function (...args) {
                const now = Date.now();
                if (now - last >= wait) {
                    last = now;
                    fn.apply(this, args);
                }
            };
        }

        // Start observing once the user interacts (scroll/wheel/touch/keydown)
        let started = false;
        function startObserving() {
            if (started) return;
            started = true;
            window.removeEventListener('scroll', onFirstScroll);
            window.removeEventListener('wheel', startObserving);
            window.removeEventListener('touchstart', startObserving);
            window.removeEventListener('keydown', startObserving);

            initObserver();
        }

        // small helper to detect a meaningful initial scroll
        function onFirstScroll() {
            if (window.pageYOffset > 5) startObserving(); // user scrolled a bit
        }

        // Attach listeners that will trigger the observer to start
        window.addEventListener('scroll', onFirstScroll, { passive: true });
        window.addEventListener('wheel', startObserving, { passive: true });
        window.addEventListener('touchstart', startObserving, { passive: true });
        window.addEventListener('keydown', startObserving);

        function initObserver() {
            if ('IntersectionObserver' in window) {
                const io = new IntersectionObserver((entries, obs) => {
                    entries.forEach(entry => {
                        if (entry.isIntersecting) {
                            entry.target.classList.add('in-view');
                            obs.unobserve(entry.target); // one-time animation
                        }
                    });
                }, {
                    threshold: 0.15,
                    rootMargin: '0px 0px -10% 0px'
                });
                items.forEach(i => io.observe(i));
            } else {
                // fallback for old browsers: check on scroll
                const check = throttle(() => {
                    items.forEach(el => {
                        if (el.classList.contains('in-view')) return;
                        const r = el.getBoundingClientRect();
                        if (r.top < window.innerHeight * 0.85 && r.bottom > 0) {
                            el.classList.add('in-view');
                        }
                    });
                }, 180);
                window.addEventListener('scroll', check, { passive: true });
                check(); // run once
            }
        }

        // If user navigates via anchor (hash) or clicks a link that moves the page,
        // startObserving so we attach the observer.
        window.addEventListener('hashchange', startObserving);
    });
})();

const toggleBtn = document.getElementById('toggle');
const body = document.body;

// Mode toggle
toggleBtn.addEventListener('click', () => {
    body.classList.toggle('dark');
    const darkMode = body.classList.contains('dark');
    document.querySelector('.icon').textContent = darkMode ? '☀️' : '🌑';
});

// Draggable floating behavior
let isDragging = false;
let offsetX, offsetY;

toggleBtn.addEventListener('mousedown', (e) => {
    isDragging = true;
    offsetX = e.clientX - toggleBtn.getBoundingClientRect().left;
    offsetY = e.clientY - toggleBtn.getBoundingClientRect().top;
    toggleBtn.style.transition = 'none';
});

document.addEventListener('mousemove', (e) => {
    if (!isDragging) return;

    let x = e.clientX - offsetX;
    let y = e.clientY - offsetY;

    // Keep inside screen
    const maxX = window.innerWidth - toggleBtn.offsetWidth;
    const maxY = window.innerHeight - toggleBtn.offsetHeight;

    x = Math.max(0, Math.min(x, maxX));
    y = Math.max(0, Math.min(y, maxY));

    toggleBtn.style.left = `${x}px`;
    toggleBtn.style.top = `${y}px`;
    toggleBtn.style.right = 'auto';
    toggleBtn.style.bottom = 'auto';
});

document.addEventListener('mouseup', () => {
    isDragging = false;
    toggleBtn.style.transition = 'background-color 0.8s, color 0.3s';
});



// Resume Text: Managed by backend NLP
function simulateUpload(file) {
    progress.style.width = '0%';
    let percent = 0;
    const interval = setInterval(() => {
        percent += 10;
        progress.style.width = percent + '%';
        if (percent >= 100) {
            clearInterval(interval);
            document.getElementById('resumeText').value = `Uploaded file: ${file.name}\n(Note: Backend will extract text using NLP parser here.)`;
        }
    }, 200);
}

// Simple Resume Analysis Simulation
function analyze() {
    const jd = document.getElementById('jobDesc').value.toLowerCase();
    const resume = document.getElementById('resumeText').value.toLowerCase();
    if (!jd || !resume) { alert("Please enter both JD and Resume."); return; }

    const jdWords = jd.split(/\W+/).filter(w => w.length > 2);
    const resumeWords = resume.split(/\W+/).filter(w => w.length > 2);
    const matched = jdWords.filter(w => resumeWords.includes(w));
    const score = Math.round((matched.length / jdWords.length) * 100);

    document.getElementById('result').innerHTML =
        `<strong>Match Score:</strong> ${score}%<br><br>
         <strong>Matched Skills:</strong> ${matched.join(', ') || 'None'}<br><br>
         <strong>Remarks:</strong> ${score > 70 ? 'Highly Suitable' : score > 40 ? 'Moderately Suitable' : 'Needs Improvement'}`;

    drawChart(score);
}

document.addEventListener('DOMContentLoaded', () => {

    /**
     * Updates a single score display: the circle, the number, and the badge.
     * @param {string} circleId The ID of the SVG path element for the progress circle.
     * @param {number} percentage The score value (0-100).
     */
    function updateScoreDisplay(circleId, percentage) {
        const circle = document.getElementById(circleId);
        if (!circle) return;

        const scoreItem = circle.closest('.score-item');
        if (!scoreItem) return;

        const valueElement = scoreItem.querySelector('.score-value');
        const badgeElement = scoreItem.querySelector('.score-badge');

        // 1. Animate the progress circle
        const offset = 100 - percentage;
        circle.style.strokeDashoffset = offset;

        // 2. Update the score number
        valueElement.textContent = percentage;

        // 3. Update the badge text and color
        badgeElement.classList.remove('badge-average', 'badge-good', 'badge-excellent');

        if (percentage === 0) {
            badgeElement.textContent = '';
            circle.style.stroke = '#e5e7eb'; // Default/inactive color
        } else if (percentage < 40 && percentage > 0) {
            badgeElement.textContent = 'WEAK';
            badgeElement.classList.add('badge-weak');
            circle.style.stroke = '#f97316'; // Orange
        } else if (percentage < 75 && percentage > 40) {
            badgeElement.textContent = 'AVERAGE';
            badgeElement.classList.add('badge-average');
            circle.style.stroke = '#f97316'; // Orange
        } else if (percentage < 90) {
            badgeElement.textContent = 'GOOD';
            badgeElement.classList.add('badge-good');
            circle.style.stroke = '#22c55e'; // Green
        } else {
            badgeElement.textContent = 'EXCELLENT';
            badgeElement.classList.add('badge-excellent');
            circle.style.stroke = '#22c55e'; // Green
        }
    }

    /**
     * Sets all scores on the page. This is the main function you will call
     * from your backend integration after fetching the data.
     * @param {object} scores - An object where keys are circle IDs and values are scores.
     * e.g., { 'impact-circle': 85, 'brevity-circle': 95, ... }
     */
    function setAllScores(scores) {
        for (const [id, score] of Object.entries(scores)) {
            updateScoreDisplay(id, score);
        }
    }

    // --- INITIALIZATION ---
    // On page load, set all scores to 0.
    const initialScores = {
        'impact-circle': 0,
        'brevity-circle': 0,
        'style-circle': 0,
        'soft-skills-circle': 0,
    };
    setAllScores(initialScores);


    // --- BACKEND SIMULATION (FOR DEMO PURPOSES) ---
    // This is an example to show how you would update the scores.
    // In your real application, you would REMOVE this setTimeout block
    // and call `setAllScores` with the data you fetch from your Python backend.
    setTimeout(() => {
        const backendScores = {
            'impact-circle': 10,
            'brevity-circle': 45,
            'style-circle': 94,
            'soft-skills-circle': 100,
        };
        setAllScores(backendScores);
    }, 1500); // Simulate a 1.5-second delay before scores arrive.
});


// Key Features Video Popup
const features = document.querySelectorAll('#features .feature');
const videoModal = document.getElementById('videoModal');
const featureVideo = document.getElementById('featureVideo');
const closeVideo = document.getElementById('closeVideo');

const videoMap = {
    'AI-Powered Matching': './videos/ai_matching.mp4',
    'Bias Mitigation': './videos/bias_mitigation.mp4',
    'Explainable Results': './videos/explainable_results.mp4',
    'Visual Reports': './videos/visual_reports.mp4'
};

features.forEach(feature => {
    feature.style.cursor = 'pointer';
    feature.addEventListener('click', () => {
        const title = feature.querySelector('h3').textContent.trim();
        const videoSrc = videoMap[title];
        if (videoSrc) {
            featureVideo.src = videoSrc;
            videoModal.style.display = 'flex';

            // ADDED: Apply to both body and html element
            document.body.style.overflow = 'hidden';
            document.documentElement.style.overflow = 'hidden';

            featureVideo.play();
        }
    });
});

closeVideo.addEventListener('click', () => {
    featureVideo.pause();
    videoModal.style.display = 'none';

    // ADDED: Reset both elements
    document.body.style.overflow = '';
    document.documentElement.style.overflow = '';

    featureVideo.src = '';
});

// "Click outside to close" listener remains removed
closeVideo.addEventListener('click', () => {
    featureVideo.pause();
    videoModal.style.display = 'none';
    document.body.style.overflow = ''; // ADDED: Re-enables page scrolling
    featureVideo.src = '';
});
