// Animate progress bars when they come into view
const observerOptions = {
    threshold: 0.5
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const fills = entry.target.querySelectorAll('.progress-fill');
            fills.forEach(fill => {
                const width = fill.getAttribute('data-width');
                setTimeout(() => {
                    fill.style.width = width + '%';
                }, 100);
            });
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

const progressBars = document.querySelector('.progress-bars');
if (progressBars) {
    observer.observe(progressBars);
}

// Add parallax effect to hero
// document.addEventListener('mousemove', (e) => {
//     const hero = document.querySelector('.hero::before');
//     const x = e.clientX / window.innerWidth;
//     const y = e.clientY / window.innerHeight;
//     document.querySelector('.hero-why-sbert').style.setProperty('--x', x);
//     document.querySelector('.hero-why-sbert').style.setProperty('--y', y);
// });