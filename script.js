// DOM Elements
const hamburger = document.querySelector('.hamburger');
const navLinks = document.querySelector('.nav-links');
const ctaButton = document.getElementById('ctaBtn');
const contactForm = document.getElementById('contactForm');
const formResponse = document.getElementById('formResponse');
const themeToggle = document.getElementById('themeToggle');
const statNumbers = document.querySelectorAll('.stat-number');

// State
let isMenuOpen = false;
let isDarkMode = false;

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

function initializeApp() {
    setupEventListeners();
    setupScrollAnimations();
    animateStatNumbers();
    checkThemePreference();
    setupSmoothScrolling();
    console.log('Testing Deploy Project initialized successfully!');
}

// Event Listeners Setup
function setupEventListeners() {
    // Mobile menu toggle
    hamburger.addEventListener('click', toggleMobileMenu);
    
    // CTA button click
    ctaButton.addEventListener('click', handleCtaClick);
    
    // Contact form submission
    contactForm.addEventListener('submit', handleFormSubmission);
    
    // Theme toggle
    themeToggle.addEventListener('click', toggleTheme);
    
    // Window events
    window.addEventListener('scroll', handleScroll);
    window.addEventListener('resize', handleResize);
    
    // Navigation links smooth scroll
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', handleSmoothScroll);
    });
}

// Mobile Menu Functions
function toggleMobileMenu() {
    isMenuOpen = !isMenuOpen;
    navLinks.classList.toggle('active');
    
    // Animate hamburger icon
    const spans = hamburger.querySelectorAll('span');
    if (isMenuOpen) {
        spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
        spans[1].style.opacity = '0';
        spans[2].style.transform = 'rotate(-45deg) translate(7px, -6px)';
    } else {
        spans[0].style.transform = 'none';
        spans[1].style.opacity = '1';
        spans[2].style.transform = 'none';
    }
}

// CTA Button Handler
function handleCtaClick() {
    // Add click animation
    ctaButton.style.transform = 'scale(0.95)';
    setTimeout(() => {
        ctaButton.style.transform = '';
    }, 150);
    
    // Show alert and scroll to contact
    showNotification('Welcome! Let\'s get you started.', 'success');
    setTimeout(() => {
        document.getElementById('contact').scrollIntoView({
            behavior: 'smooth'
        });
    }, 1000);
}

// Form Submission Handler
function handleFormSubmission(e) {
    e.preventDefault();
    
    const formData = new FormData(contactForm);
    const name = formData.get('name');
    const email = formData.get('email');
    const message = formData.get('message');
    
    // Validate form
    if (!name || !email || !message) {
        showFormResponse('Please fill in all fields.', 'error');
        return;
    }
    
    // Simulate form submission
    const submitBtn = contactForm.querySelector('.submit-btn');
    const originalText = submitBtn.textContent;
    
    submitBtn.innerHTML = '<span class="loading"></span> Sending...';
    submitBtn.disabled = true;
    
    // Simulate API call
    setTimeout(() => {
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
        
        showFormResponse(`Thank you, ${name}! Your message has been sent successfully.`, 'success');
        contactForm.reset();
        
        // Log form data (for testing purposes)
        console.log('Form submitted:', { name, email, message });
    }, 2000);
}

// Form Response Display
function showFormResponse(message, type) {
    formResponse.textContent = message;
    formResponse.className = `form-response ${type}`;
    formResponse.classList.add('show');
    
    setTimeout(() => {
        formResponse.classList.remove('show');
    }, 5000);
}

// Theme Toggle
function toggleTheme() {
    isDarkMode = !isDarkMode;
    document.documentElement.setAttribute('data-theme', isDarkMode ? 'dark' : 'light');
    themeToggle.textContent = isDarkMode ? '☀️' : '🌙';
    
    // Save preference
    localStorage.setItem('theme', isDarkMode ? 'dark' : 'light');
    
    showNotification(`Switched to ${isDarkMode ? 'dark' : 'light'} mode`, 'success');
}

function checkThemePreference() {
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    isDarkMode = savedTheme ? savedTheme === 'dark' : prefersDark;
    
    if (isDarkMode) {
        document.documentElement.setAttribute('data-theme', 'dark');
        themeToggle.textContent = '☀️';
    }
}

// Scroll Animations
function setupScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, observerOptions);
    
    // Add fade-in class to elements and observe them
    const animateElements = document.querySelectorAll('.feature-card, .stat-item, .about p');
    animateElements.forEach(el => {
        el.classList.add('fade-in');
        observer.observe(el);
    });
}

// Animated Statistics
function animateStatNumbers() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateNumber(entry.target);
                observer.unobserve(entry.target);
            }
        });
    });
    
    statNumbers.forEach(stat => observer.observe(stat));
}

function animateNumber(element) {
    const target = parseInt(element.getAttribute('data-target'));
    const duration = 2000;
    const step = target / (duration / 16);
    let current = 0;
    
    const timer = setInterval(() => {
        current += step;
        element.textContent = Math.floor(current);
        
        if (current >= target) {
            element.textContent = target;
            clearInterval(timer);
        }
    }, 16);
}

// Smooth Scrolling
function setupSmoothScrolling() {
    // Already handled in event listeners
}

function handleSmoothScroll(e) {
    e.preventDefault();
    const targetId = this.getAttribute('href');
    const targetElement = document.querySelector(targetId);
    
    if (targetElement) {
        const offsetTop = targetElement.offsetTop - 80; // Account for fixed header
        window.scrollTo({
            top: offsetTop,
            behavior: 'smooth'
        });
        
        // Close mobile menu if open
        if (isMenuOpen) {
            toggleMobileMenu();
        }
    }
}

// Scroll Handler
function handleScroll() {
    const header = document.querySelector('header');
    const scrollTop = window.pageYOffset;
    
    // Add/remove shadow on scroll
    if (scrollTop > 100) {
        header.style.background = isDarkMode ? 'rgba(17, 24, 39, 0.95)' : 'rgba(255, 255, 255, 0.95)';
        header.style.backdropFilter = 'blur(10px)';
    } else {
        header.style.background = '';
        header.style.backdropFilter = '';
    }
}

// Resize Handler
function handleResize() {
    // Close mobile menu on resize to desktop
    if (window.innerWidth > 768 && isMenuOpen) {
        toggleMobileMenu();
    }
}

// Notification System
function showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: ${type === 'success' ? '#10b981' : type === 'error' ? '#ef4444' : '#6366f1'};
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        z-index: 10000;
        transform: translateX(100%);
        transition: transform 0.3s ease;
        max-width: 300px;
        font-weight: 500;
    `;
    
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Auto remove
    setTimeout(() => {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }, 3000);
}

// Utility Functions
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Performance optimized scroll handler
const debouncedScrollHandler = debounce(handleScroll, 10);
window.addEventListener('scroll', debouncedScrollHandler);

// Easter Egg - Konami Code
let konamiCode = [];
const targetCode = [
    'ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown',
    'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight',
    'KeyB', 'KeyA'
];

document.addEventListener('keydown', (e) => {
    konamiCode.push(e.code);
    if (konamiCode.length > targetCode.length) {
        konamiCode.shift();
    }
    
    if (JSON.stringify(konamiCode) === JSON.stringify(targetCode)) {
        showNotification('🎉 Konami Code activated! You found the easter egg!', 'success');
        document.body.style.filter = 'hue-rotate(180deg)';
        setTimeout(() => {
            document.body.style.filter = '';
        }, 3000);
        konamiCode = [];
    }
});

// Export functions for testing (if needed)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        toggleMobileMenu,
        handleCtaClick,
        toggleTheme,
        animateNumber,
        showNotification
    };
}