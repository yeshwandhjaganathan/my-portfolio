// =================================
// MAIN APPLICATION SCRIPT
// =================================

document.addEventListener('DOMContentLoaded', function() {
    // Initialize all components
    initNavigation();
    initScrollReveal();
    initTypewriter();
    initSkillsFilter();
    initCounters();
    initContactForm();
    initBackToTop();
    initParallax();
    setCurrentYear();
});



// =================================
// NAVIGATION FUNCTIONALITY
// =================================
function initNavigation() {
    const navbar = document.getElementById('mainNav');
    const navLinks = document.querySelectorAll('.nav-link[href^="#"]');
    
    // Handle scroll for navbar styling
    window.addEventListener('scroll', throttle(() => {
        if (window.scrollY > 100) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
        updateActiveNavLink();
    }, 16));
    
    // Smooth scroll for navigation links
    navLinks.forEach(link => {
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
                
                // Close mobile menu if open
                const navbarCollapse = document.querySelector('.navbar-collapse');
                if (navbarCollapse.classList.contains('show')) {
                    const bsCollapse = new bootstrap.Collapse(navbarCollapse);
                    bsCollapse.hide();
                }
            }
        });
    });
}

function updateActiveNavLink() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link[href^="#"]');
    
    let currentSection = '';
    sections.forEach(section => {
        const sectionTop = section.offsetTop - 100;
        const sectionHeight = section.clientHeight;
        
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

// =================================
// SCROLL REVEAL ANIMATIONS
// =================================
function initScrollReveal() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                
                // Special handling for skills animation
                if (entry.target.classList.contains('skill-item')) {
                    animateSkillProgress(entry.target);
                }
                
                // Special handling for counters
                if (entry.target.classList.contains('education-card')) {
                    animateCounters(entry.target);
                }
                
                // Timeline animation
                if (entry.target.classList.contains('timeline-content')) {
                    entry.target.classList.add('animate');
                }
            }
        });
    }, observerOptions);
    
    // Observe elements for reveal animations
    const revealElements = document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-scale, .skill-item, .education-card, .timeline-content');
    revealElements.forEach(el => {
        observer.observe(el);
    });
}

function animateSkillProgress(skillItem) {
    const progressBar = skillItem.querySelector('.skill-progress');
    if (progressBar) {
        const progressValue = progressBar.getAttribute('data-progress');
        progressBar.style.setProperty('--progress-width', `${progressValue}%`);
        progressBar.classList.add('animate');
    }
}

// =================================
// TYPEWRITER EFFECT
// =================================
function initTypewriter() {
    const typewriterElement = document.getElementById('typewriter');
    if (!typewriterElement) return;
    
    const roles = [
        'Python Developer',
        'Web Developer', 
        'AI/ML Enthusiast',
        'Problem Solver'
    ];
    
    let currentRoleIndex = 0;
    let currentCharIndex = 0;
    let isDeleting = false;
    let typewriterTimeout;
    
    function typeWriter() {
        const currentRole = roles[currentRoleIndex];
        
        if (isDeleting) {
            typewriterElement.textContent = currentRole.substring(0, currentCharIndex - 1);
            currentCharIndex--;
        } else {
            typewriterElement.textContent = currentRole.substring(0, currentCharIndex + 1);
            currentCharIndex++;
        }
        
        let typeSpeed = isDeleting ? 50 : 100;
        
        if (!isDeleting && currentCharIndex === currentRole.length) {
            typeSpeed = 2000;
            isDeleting = true;
        } else if (isDeleting && currentCharIndex === 0) {
            isDeleting = false;
            currentRoleIndex = (currentRoleIndex + 1) % roles.length;
            typeSpeed = 500;
        }
        
        typewriterTimeout = setTimeout(typeWriter, typeSpeed);
    }
    
    // Start typewriter effect after a short delay
    setTimeout(typeWriter, 1000);
}

// =================================
// SKILLS FILTER FUNCTIONALITY
// =================================
function initSkillsFilter() {
    const filterButtons = document.querySelectorAll('.skill-filters .btn');
    const skillItems = document.querySelectorAll('.skill-item');
    
    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            const filter = button.getAttribute('data-filter');
            
            // Update active button
            filterButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            
            // Filter skills
            skillItems.forEach((item, index) => {
                const category = item.getAttribute('data-category');
                
                if (filter === 'all' || category === filter) {
                    item.style.setProperty('--delay', index);
                    item.classList.remove('hidden');
                } else {
                    item.classList.add('hidden');
                }
            });
        });
    });
}

// =================================
// COUNTER ANIMATIONS
// =================================
function initCounters() {
    // This will be triggered by the intersection observer
}

function animateCounters(container) {
    const counters = container.querySelectorAll('.counter');
    
    counters.forEach(counter => {
        const target = parseFloat(counter.closest('[data-target]')?.getAttribute('data-target') || 0);
        const duration = 2000;
        const step = target / (duration / 16);
        let current = 0;
        
        const updateCounter = () => {
            current += step;
            if (current >= target) {
                counter.textContent = target.toFixed(1);
            } else {
                counter.textContent = current.toFixed(1);
                requestAnimationFrame(updateCounter);
            }
        };
        
        updateCounter();
    });
}

// =================================
// CONTACT FORM FUNCTIONALITY
// =================================
function initContactForm() {
    const contactForm = document.getElementById('contactForm');
    if (!contactForm) return;
    
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        // Validate form
        if (!contactForm.checkValidity()) {
            e.stopPropagation();
            contactForm.classList.add('was-validated');
            showToast('errorToast');
            return;
        }
        
        // Get form data
        const formData = new FormData(contactForm);
        const name = formData.get('name');
        const email = formData.get('email');
        const subject = formData.get('subject');
        const message = formData.get('message');
        
        // Create mailto link
        const mailtoLink = `mailto:yeshwandhjaganathan@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(`From: ${name} (${email})\n\nMessage:\n${message}`)}`;
        
        // Open email client
        window.location.href = mailtoLink;
        
        // Show success message
        showToast('successToast');
        
        // Reset form
        contactForm.reset();
        contactForm.classList.remove('was-validated');
    });
}

function showToast(toastId) {
    const toastElement = document.getElementById(toastId);
    if (toastElement) {
        const toast = new bootstrap.Toast(toastElement);
        toast.show();
    }
}

// =================================
// BACK TO TOP FUNCTIONALITY
// =================================
function initBackToTop() {
    const backToTopButton = document.getElementById('backToTop');
    if (!backToTopButton) return;
    
    window.addEventListener('scroll', throttle(() => {
        if (window.scrollY > 500) {
            backToTopButton.classList.add('show');
        } else {
            backToTopButton.classList.remove('show');
        }
    }, 16));
    
    backToTopButton.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

// =================================
// PARALLAX EFFECT
// =================================
function initParallax() {
    const heroSection = document.querySelector('.hero-section');
    if (!heroSection) return;
    
    window.addEventListener('scroll', throttle(() => {
        const scrolled = window.pageYOffset;
        const rate = scrolled * -0.5;
        
        const bgShapes = heroSection.querySelector('.hero-bg-shapes');
        if (bgShapes) {
            bgShapes.style.transform = `translateY(${rate}px)`;
        }
    }, 16));
}

// =================================
// UTILITY FUNCTIONS
// =================================
function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

function setCurrentYear() {
    const yearElement = document.getElementById('currentYear');
    if (yearElement) {
        yearElement.textContent = new Date().getFullYear();
    }
}

// =================================
// ACCESSIBILITY ENHANCEMENTS
// =================================
document.addEventListener('keydown', (e) => {
    // ESC key to close any open modals or menus
    if (e.key === 'Escape') {
        const openCollapse = document.querySelector('.navbar-collapse.show');
        if (openCollapse) {
            const bsCollapse = new bootstrap.Collapse(openCollapse);
            bsCollapse.hide();
        }
    }
});

// Focus management for better accessibility
document.addEventListener('focusin', (e) => {
    const target = e.target;
    if (target.matches('a, button, input, textarea, select')) {
        target.style.outline = '2px solid var(--primary-color)';
        target.style.outlineOffset = '2px';
    }
});

document.addEventListener('focusout', (e) => {
    const target = e.target;
    if (target.matches('a, button, input, textarea, select')) {
        target.style.outline = '';
        target.style.outlineOffset = '';
    }
});

// =================================
// PERFORMANCE OPTIMIZATIONS
// =================================
// Lazy load images (if any were added)
if ('IntersectionObserver' in window) {
    const lazyImages = document.querySelectorAll('img[data-src]');
    const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.remove('lazy');
                imageObserver.unobserve(img);
            }
        });
    });
    
    lazyImages.forEach(img => imageObserver.observe(img));
}

// Preload critical resources
function preloadCriticalResources() {
    const criticalUrls = [
        'https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.1/font/bootstrap-icons.css'
    ];
    
    criticalUrls.forEach(url => {
        const link = document.createElement('link');
        link.rel = 'preload';
        link.href = url;
        link.as = 'style';
        document.head.appendChild(link);
    });
}

// Call preload function
preloadCriticalResources();

// =================================
// ERROR HANDLING
// =================================
window.addEventListener('error', (e) => {
    console.error('JavaScript error:', e.error);
    // Could implement error reporting here
});

window.addEventListener('unhandledrejection', (e) => {
    console.error('Unhandled promise rejection:', e.reason);
    e.preventDefault();
});

// =================================
// CONSOLE SIGNATURE
// =================================
console.log('%c✨ Portfolio by YESHWANDH J S', 'color: #6366f1; font-size: 16px; font-weight: bold;');
console.log('%c🚀 Built with vanilla JavaScript, CSS, and Bootstrap 5', 'color: #64748b; font-size: 12px;');
