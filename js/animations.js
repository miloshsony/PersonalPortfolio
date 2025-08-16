// Advanced Animation Controller
class AnimationController {
    constructor() {
        this.animations = new Map();
        this.observers = new Map();
        this.init();
    }
    
    init() {
        this.setupIntersectionObservers();
        this.setupParallaxEffects();
        this.setupHoverAnimations();
        this.setupTypingAnimation();
        this.createParticles();
    }
    
    // Intersection Observer for scroll-based animations
    setupIntersectionObservers() {
        const fadeInObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.animateFadeIn(entry.target);
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '-50px'
        });
        
        const slideInObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.animateSlideIn(entry.target);
                }
            });
        }, {
            threshold: 0.2,
            rootMargin: '-30px'
        });
        
        const scaleInObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.animateScaleIn(entry.target);
                }
            });
        }, {
            threshold: 0.3,
            rootMargin: '-20px'
        });
        
        // Apply observers to elements
        document.querySelectorAll('.fade-in').forEach(el => fadeInObserver.observe(el));
        document.querySelectorAll('.slide-in-left, .slide-in-right').forEach(el => slideInObserver.observe(el));
        document.querySelectorAll('.scale-in').forEach(el => scaleInObserver.observe(el));
        
        this.observers.set('fadeIn', fadeInObserver);
        this.observers.set('slideIn', slideInObserver);
        this.observers.set('scaleIn', scaleInObserver);
    }
    
    // Animation methods
    animateFadeIn(element) {
        element.style.opacity = '0';
        element.style.transform = 'translateY(30px)';
        
        requestAnimationFrame(() => {
            element.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
            element.style.opacity = '1';
            element.style.transform = 'translateY(0)';
        });
    }
    
    animateSlideIn(element) {
        const direction = element.classList.contains('slide-in-left') ? -50 : 50;
        
        element.style.opacity = '0';
        element.style.transform = `translateX(${direction}px)`;
        
        requestAnimationFrame(() => {
            element.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
            element.style.opacity = '1';
            element.style.transform = 'translateX(0)';
        });
    }
    
    animateScaleIn(element) {
        element.style.opacity = '0';
        element.style.transform = 'scale(0.8)';
        
        requestAnimationFrame(() => {
            element.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
            element.style.opacity = '1';
            element.style.transform = 'scale(1)';
        });
    }
    
    // Parallax effects
    setupParallaxEffects() {
        const parallaxElements = document.querySelectorAll('.parallax');
        
        if (parallaxElements.length > 0) {
            window.addEventListener('scroll', this.throttle(() => {
                const scrolled = window.pageYOffset;
                const rate = scrolled * -0.5;
                
                parallaxElements.forEach(element => {
                    element.style.transform = `translate3d(0, ${rate}px, 0)`;
                });
            }, 10));
        }
    }
    
    // Hover animations
    setupHoverAnimations() {
        // Enhanced button hover effects
        const buttons = document.querySelectorAll('.btn');
        buttons.forEach(button => {
            button.addEventListener('mouseenter', () => {
                this.addRippleEffect(button);
            });
        });
        
        // Card hover animations
        const cards = document.querySelectorAll('.project-card, .cert-card, .skill-category');
        cards.forEach(card => {
            card.addEventListener('mouseenter', () => {
                card.style.transform = 'translateY(-10px) scale(1.02)';
            });
            
            card.addEventListener('mouseleave', () => {
                card.style.transform = 'translateY(0) scale(1)';
            });
        });
        
        // Floating icon animations
        const floatingIcons = document.querySelectorAll('.floating-icon');
        floatingIcons.forEach((icon, index) => {
            this.animateFloatingIcon(icon, index);
        });
    }
    
    // Ripple effect for buttons
    addRippleEffect(button) {
        const ripple = document.createElement('div');
        const rect = button.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        
        ripple.style.position = 'absolute';
        ripple.style.borderRadius = '50%';
        ripple.style.background = 'rgba(255, 255, 255, 0.3)';
        ripple.style.transform = 'scale(0)';
        ripple.style.animation = 'ripple 0.6s linear';
        ripple.style.left = '50%';
        ripple.style.top = '50%';
        ripple.style.width = ripple.style.height = size + 'px';
        ripple.style.marginLeft = ripple.style.marginTop = -(size / 2) + 'px';
        
        button.appendChild(ripple);
        
        setTimeout(() => {
            ripple.remove();
        }, 600);
    }
    
    // Floating icon animation
    animateFloatingIcon(icon, index) {
        const duration = 3000 + (index * 500);
        const delay = index * 1000;
        
        setTimeout(() => {
            setInterval(() => {
                const randomX = (Math.random() - 0.5) * 20;
                const randomY = (Math.random() - 0.5) * 20;
                
                icon.style.transform = `translate(${randomX}px, ${randomY}px)`;
            }, duration);
        }, delay);
    }
    
    // Typing animation
    setupTypingAnimation() {
        const typingElements = document.querySelectorAll('.typing-text');
        
        typingElements.forEach(element => {
            const text = element.textContent;
            element.textContent = '';
            element.style.borderRight = '2px solid var(--secondary-color)';
            
            let i = 0;
            const typeWriter = () => {
                if (i < text.length) {
                    element.textContent += text.charAt(i);
                    i++;
                    setTimeout(typeWriter, 100);
                } else {
                    setTimeout(() => {
                        element.style.borderRight = 'none';
                    }, 1000);
                }
            };
            
            // Start typing when element is in view
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        setTimeout(typeWriter, 500);
                        observer.unobserve(element);
                    }
                });
            });
            
            observer.observe(element);
        });
    }
    
    // Create background particles
    createParticles() {
        const particleContainer = document.createElement('div');
        particleContainer.className = 'particle-container';
        particleContainer.style.position = 'fixed';
        particleContainer.style.top = '0';
        particleContainer.style.left = '0';
        particleContainer.style.width = '100%';
        particleContainer.style.height = '100%';
        particleContainer.style.pointerEvents = 'none';
        particleContainer.style.zIndex = '-1';
        
        document.body.appendChild(particleContainer);
        
        const createParticle = () => {
            const particle = document.createElement('div');
            particle.className = 'particle';
            particle.style.left = Math.random() * 100 + '%';
            particle.style.animationDuration = (Math.random() * 3 + 2) + 's';
            particle.style.opacity = Math.random() * 0.3 + 0.1;
            
            particleContainer.appendChild(particle);
            
            setTimeout(() => {
                particle.remove();
            }, 5000);
        };
        
        // Create particles periodically
        setInterval(createParticle, 500);
    }
    
    // Text reveal animation
    animateTextReveal(element) {
        const text = element.textContent;
        const letters = text.split('').map(letter => `<span>${letter}</span>`).join('');
        element.innerHTML = letters;
        
        const spans = element.querySelectorAll('span');
        spans.forEach((span, index) => {
            setTimeout(() => {
                span.style.transform = 'translateY(0)';
                span.style.opacity = '1';
            }, index * 50);
        });
    }
    
    // Progress bar animation
    animateProgressBar(progressBar, percentage) {
        progressBar.style.setProperty('--progress-width', percentage + '%');
        progressBar.classList.add('animate');
    }
    
    // Stagger animation for multiple elements
    staggerAnimation(elements, animationType = 'fadeIn', delay = 100) {
        elements.forEach((element, index) => {
            setTimeout(() => {
                switch (animationType) {
                    case 'fadeIn':
                        this.animateFadeIn(element);
                        break;
                    case 'slideIn':
                        this.animateSlideIn(element);
                        break;
                    case 'scaleIn':
                        this.animateScaleIn(element);
                        break;
                }
            }, index * delay);
        });
    }
    
    // Utility: Throttle function
    throttle(func, delay) {
        let timeoutId;
        let lastExecTime = 0;
        return function (...args) {
            const currentTime = Date.now();
            
            if (currentTime - lastExecTime > delay) {
                func.apply(this, args);
                lastExecTime = currentTime;
            } else {
                clearTimeout(timeoutId);
                timeoutId = setTimeout(() => {
                    func.apply(this, args);
                    lastExecTime = Date.now();
                }, delay - (currentTime - lastExecTime));
            }
        };
    }
    
    // Utility: Debounce function
    debounce(func, delay) {
        let timeoutId;
        return function (...args) {
            clearTimeout(timeoutId);
            timeoutId = setTimeout(() => func.apply(this, args), delay);
        };
    }
    
    // Clean up observers
    destroy() {
        this.observers.forEach(observer => observer.disconnect());
        this.observers.clear();
        this.animations.clear();
    }
}

// Initialize animation controller
document.addEventListener('DOMContentLoaded', () => {
    const animationController = new AnimationController();
    
    // Add to window for potential external access
    window.animationController = animationController;
});

// Custom CSS animations
const style = document.createElement('style');
style.textContent = `
    @keyframes ripple {
        to {
            transform: scale(4);
            opacity: 0;
        }
    }
    
    @keyframes particles {
        0% {
            transform: translateY(100vh) rotate(0deg);
            opacity: 1;
        }
        100% {
            transform: translateY(-100vh) rotate(720deg);
            opacity: 0;
        }
    }
    
    @keyframes float {
        0%, 100% {
            transform: translateY(0px);
        }
        50% {
            transform: translateY(-20px);
        }
    }
    
    .particle-container {
        overflow: hidden;
    }
    
    .particle {
        position: absolute;
        width: 4px;
        height: 4px;
        background-color: var(--secondary-color);
        border-radius: 50%;
        animation: particles linear infinite;
    }
    
    /* Keyboard navigation styles */
    .keyboard-navigation *:focus {
        outline: 2px solid var(--secondary-color) !important;
        outline-offset: 2px !important;
    }
    
    /* Reduced motion support */
    @media (prefers-reduced-motion: reduce) {
        .particle {
            animation: none;
        }
        
        .floating-icon {
            animation: none;
        }
        
        * {
            transition-duration: 0.01ms !important;
            animation-duration: 0.01ms !important;
        }
    }
`;

document.head.appendChild(style);
