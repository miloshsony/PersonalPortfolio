// Main JavaScript functionality
class PortfolioApp {
    constructor() {
        this.navbar = document.getElementById('navbar');
        this.navToggle = document.getElementById('nav-toggle');
        this.navMenu = document.getElementById('nav-menu');
        this.contactForm = document.getElementById('contact-form');
        this.toast = document.getElementById('toast');
        this.modals = document.querySelectorAll('.modal');
        
        this.init();
    }
    
    init() {
        this.setupNavigation();
        this.setupContactForm();
        this.setupModals();
        this.setupScrollEffects();
        this.setupSmoothScroll();
        this.addEventListeners();
    }
    
    // Navigation Setup
    setupNavigation() {
        // Mobile menu toggle
        this.navToggle.addEventListener('click', () => {
            this.navMenu.classList.toggle('active');
            this.navToggle.classList.toggle('active');
            
            const expanded = this.navToggle.getAttribute('aria-expanded') === 'true';
            this.navToggle.setAttribute('aria-expanded', !expanded);
        });
        
        // Close mobile menu when clicking nav links
        const navLinks = document.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                this.navMenu.classList.remove('active');
                this.navToggle.classList.remove('active');
                this.navToggle.setAttribute('aria-expanded', 'false');
            });
        });
        
        // Close mobile menu when clicking outside
        document.addEventListener('click', (e) => {
            if (!this.navbar.contains(e.target)) {
                this.navMenu.classList.remove('active');
                this.navToggle.classList.remove('active');
                this.navToggle.setAttribute('aria-expanded', 'false');
            }
        });
        
        // Navbar scroll effect
        window.addEventListener('scroll', () => {
            if (window.scrollY > 50) {
                this.navbar.classList.add('scrolled');
            } else {
                this.navbar.classList.remove('scrolled');
            }
            
            this.updateActiveNavLink();
        });
    }
    
    // Update active navigation link based on scroll position
    updateActiveNavLink() {
        const sections = document.querySelectorAll('section[id]');
        const navLinks = document.querySelectorAll('.nav-link');
        
        let currentSection = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 100;
            const sectionHeight = section.offsetHeight;
            if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
                currentSection = section.getAttribute('id');
            }
        });
        
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${currentSection}`) {
                link.classList.add('active');
            }
        });
    }
    
    // Contact Form Setup
    setupContactForm() {
        this.contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleContactSubmit();
        });
        
        // Real-time validation
        const inputs = this.contactForm.querySelectorAll('input, textarea');
        inputs.forEach(input => {
            input.addEventListener('blur', () => this.validateField(input));
            input.addEventListener('input', () => this.clearFieldError(input));
        });
    }
    
    validateField(field) {
        const value = field.value.trim();
        const fieldName = field.getAttribute('name');
        let isValid = true;
        let errorMessage = '';
        
        // Required field validation
        if (!value) {
            isValid = false;
            errorMessage = `${this.capitalizeFirst(fieldName)} is required`;
        }
        
        // Email validation
        if (fieldName === 'email' && value) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(value)) {
                isValid = false;
                errorMessage = 'Please enter a valid email address';
            }
        }
        
        // Name validation
        if (fieldName === 'name' && value) {
            if (value.length < 2) {
                isValid = false;
                errorMessage = 'Name must be at least 2 characters long';
            }
        }
        
        // Message validation
        if (fieldName === 'message' && value) {
            if (value.length < 10) {
                isValid = false;
                errorMessage = 'Message must be at least 10 characters long';
            }
        }
        
        this.displayFieldError(field, errorMessage, !isValid);
        return isValid;
    }
    
    displayFieldError(field, message, hasError) {
        const errorElement = document.getElementById(`${field.name}-error`);
        
        if (hasError) {
            field.classList.add('error');
            errorElement.textContent = message;
            errorElement.classList.add('show');
        } else {
            field.classList.remove('error');
            errorElement.textContent = '';
            errorElement.classList.remove('show');
        }
    }
    
    clearFieldError(field) {
        field.classList.remove('error');
        const errorElement = document.getElementById(`${field.name}-error`);
        errorElement.classList.remove('show');
    }
    
    handleContactSubmit() {
        const formData = new FormData(this.contactForm);
        const name = formData.get('name').trim();
        const email = formData.get('email').trim();
        const message = formData.get('message').trim();
        
        // Validate all fields
        const nameValid = this.validateField(document.getElementById('name'));
        const emailValid = this.validateField(document.getElementById('email'));
        const messageValid = this.validateField(document.getElementById('message'));
        
        if (nameValid && emailValid && messageValid) {
            // Log to console (as requested)
            console.log('Contact Form Submission:', {
                name,
                email,
                message,
                timestamp: new Date().toISOString()
            });
            
            // Show success toast
            this.showToast('Thank you! Your message has been sent successfully.');
            
            // Open mailto as fallback
            const subject = encodeURIComponent('Portfolio Inquiry');
            const body = encodeURIComponent(`Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`);
            window.location.href = `mailto:miloshs.mca2426@saintgits.org?subject=${subject}&body=${body}`;
            
            // Reset form
            this.contactForm.reset();
        } else {
            this.showToast('Please fix the errors above and try again.', 'error');
        }
    }
    
    // Modal Setup
    setupModals() {
        // Project card click handlers
        const projectCards = document.querySelectorAll('.project-card');
        projectCards.forEach(card => {
            const projectBtn = card.querySelector('.project-btn');
            projectBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                const modalId = projectBtn.getAttribute('data-modal');
                this.openModal(`${modalId}-modal`);
            });
        });
        
        // Modal close handlers
        this.modals.forEach(modal => {
            const closeBtn = modal.querySelector('.modal-close');
            closeBtn.addEventListener('click', () => this.closeModal(modal.id));
            
            // Close on backdrop click
            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    this.closeModal(modal.id);
                }
            });
        });
        
        // Close modals on Escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.modals.forEach(modal => {
                    if (modal.classList.contains('active')) {
                        this.closeModal(modal.id);
                    }
                });
            }
        });
    }
    
    openModal(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.classList.add('active');
            document.body.style.overflow = 'hidden';
            
            // Focus management for accessibility
            const firstFocusable = modal.querySelector('.modal-close');
            if (firstFocusable) {
                firstFocusable.focus();
            }
        }
    }
    
    closeModal(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.classList.remove('active');
            document.body.style.overflow = '';
        }
    }
    
    // Scroll Effects
    setupScrollEffects() {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '-50px 0px'
        };
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate');
                }
            });
        }, observerOptions);
        
        // Observe elements for animation
        const animatedElements = document.querySelectorAll(
            '.fade-in, .slide-in-left, .slide-in-right, .scale-in'
        );
        
        animatedElements.forEach(el => observer.observe(el));
        
        // Add animation classes to elements
        this.addAnimationClasses();
    }
    
    addAnimationClasses() {
        // Hero section animations
        const heroContent = document.querySelector('.hero-content');
        if (heroContent) {
            heroContent.classList.add('fade-in');
        }
        
        // Section animations
        const sections = document.querySelectorAll('section:not(.hero)');
        sections.forEach((section, index) => {
            const content = section.querySelector('.container > *:first-child');
            if (content) {
                content.classList.add('fade-in');
                if (index % 2 === 0) {
                    content.classList.add('slide-in-left');
                } else {
                    content.classList.add('slide-in-right');
                }
            }
        });
        
        // Cards animations
        const cards = document.querySelectorAll(
            '.project-card, .cert-card, .skill-category, .stat-card'
        );
        cards.forEach((card, index) => {
            card.classList.add('scale-in', `stagger-${(index % 4) + 1}`);
        });
    }
    
    // Smooth Scroll
    setupSmoothScroll() {
        const links = document.querySelectorAll('a[href^="#"]');
        
        links.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                
                const targetId = link.getAttribute('href');
                const targetSection = document.querySelector(targetId);
                
                if (targetSection) {
                    const offsetTop = targetSection.offsetTop - 80;
                    
                    window.scrollTo({
                        top: offsetTop,
                        behavior: 'smooth'
                    });
                }
            });
        });
    }
    
    // Toast Notification
    showToast(message, type = 'success') {
        const toastMessage = this.toast.querySelector('.toast-message');
        toastMessage.textContent = message;
        
        // Update toast appearance based on type
        const toastContent = this.toast.querySelector('.toast-content');
        if (type === 'error') {
            toastContent.style.backgroundColor = '#EF4444';
        } else {
            toastContent.style.backgroundColor = 'var(--secondary-color)';
        }
        
        this.toast.classList.add('show');
        
        setTimeout(() => {
            this.toast.classList.remove('show');
        }, 5000);
    }
    
    // Event Listeners
    addEventListeners() {
        // Page load animations
        window.addEventListener('load', () => {
            document.querySelector('.hero .fade-in').classList.add('animate');
        });
        
        // Keyboard navigation
        document.addEventListener('keydown', (e) => {
            // Tab key navigation enhancement
            if (e.key === 'Tab') {
                document.body.classList.add('keyboard-navigation');
            }
        });
        
        document.addEventListener('mousedown', () => {
            document.body.classList.remove('keyboard-navigation');
        });
        
        // Performance optimization: debounce scroll events
        let scrollTimeout;
        window.addEventListener('scroll', () => {
            if (scrollTimeout) {
                clearTimeout(scrollTimeout);
            }
            scrollTimeout = setTimeout(() => {
                this.handleScroll();
            }, 10);
        });
    }
    
    handleScroll() {
        // Custom scroll handling if needed
        // This can be extended for additional scroll-based features
    }
    
    // Utility Functions
    capitalizeFirst(string) {
        return string.charAt(0).toUpperCase() + string.slice(1);
    }
    
    // Theme management (if needed in future)
    toggleTheme() {
        // Reserved for future dark mode implementation
        console.log('Theme toggle - reserved for future implementation');
    }
}

// Initialize the application
document.addEventListener('DOMContentLoaded', () => {
    new PortfolioApp();
});

// Service Worker Registration (for PWA features if needed)
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        // Uncomment if you want to add PWA features
        // navigator.serviceWorker.register('/sw.js');
    });
}

// Performance monitoring
const observer = new PerformanceObserver((list) => {
    for (const entry of list.getEntries()) {
        if (entry.entryType === 'navigation') {
            console.log('Page Load Performance:', {
                domContentLoaded: entry.domContentLoadedEventEnd - entry.domContentLoadedEventStart,
                loadComplete: entry.loadEventEnd - entry.loadEventStart,
                totalTime: entry.loadEventEnd - entry.fetchStart
            });
        }
    }
});

if (PerformanceObserver.supportedEntryTypes.includes('navigation')) {
    observer.observe({ type: 'navigation', buffered: true });
}
