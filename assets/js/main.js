document.addEventListener('DOMContentLoaded', function() {
    // Mobile menu toggle
    const mobileMenuButton = document.querySelector('button.md\\:hidden');
    const mobileMenu = document.createElement('div');
    mobileMenu.className = 'mobile-menu';
    mobileMenu.innerHTML = `
        <a href="/">Terminal</a>
        <a href="https://desktop.interactiveshell.com">Desktop</a>
        <a href="/drive">IDE Drive</a>
        <a href="/pricing">Pricing</a>
        <a href="/training">Training</a>
        <a href="/blog">Blog</a>
        <a href="/about">About</a>
        <a href="/contact">Contact</a>
    `;
    document.body.appendChild(mobileMenu);

    mobileMenuButton.addEventListener('click', () => {
        mobileMenu.classList.toggle('active');
    });

    // Cookie consent handling
    const cookieConsent = document.getElementById('cookie-consent');
    
    function acceptCookies() {
        try {
            localStorage.setItem('cookieConsent', 'accepted');
            cookieConsent.classList.add('hidden');
        } catch (error) {
            console.error('Error storing cookie consent:', error);
        }
    }

    // Check if user has already accepted cookies
    try {
        const consentGiven = localStorage.getItem('cookieConsent');
        if (consentGiven === 'accepted') {
            cookieConsent.classList.add('hidden');
        }
    } catch (error) {
        console.error('Error checking cookie consent:', error);
    }

    // Make acceptCookies function globally available
    window.acceptCookies = acceptCookies;

    // OS Selection buttons
    const osButtons = document.querySelectorAll('.os-button');
    osButtons.forEach(button => {
        button.addEventListener('click', () => {
            osButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
        });
    });

    // Close mobile menu when clicking outside
    document.addEventListener('click', (e) => {
        if (mobileMenu.classList.contains('active') && 
            !mobileMenu.contains(e.target) && 
            !mobileMenuButton.contains(e.target)) {
            mobileMenu.classList.remove('active');
        }
    });

    // Add smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            document.querySelector(this.getAttribute('href')).scrollIntoView({
                behavior: 'smooth'
            });
        });
    });
});
