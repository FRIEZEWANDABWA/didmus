// ===== MAIN JAVASCRIPT FILE =====

// Global variables
let isScrolling = false;
let currentTheme = localStorage.getItem('theme') || 'dark';

// ===== INITIALIZATION =====
document.addEventListener('DOMContentLoaded', function() {
    initializeTheme();
    initializeNavigation();
    initializeScrollEffects();
    initializeAnimations();
    initializeCounters();
    initializeVoiceSearch();
    initializeNewsletterForm();
    initializeProgressBar();
    initializeLazyLoading();
    initializeParticles();
    initializeMobileFeatures();
    initializeAutoChatPopup();
});

// ===== THEME MANAGEMENT =====
function initializeTheme() {
    const themeToggle = document.getElementById('themeToggle');
    const html = document.documentElement;
    
    // Set initial theme
    html.setAttribute('data-theme', currentTheme);
    updateThemeIcon();
    
    // Theme toggle event listener
    themeToggle?.addEventListener('click', toggleTheme);
}

function toggleTheme() {
    const html = document.documentElement;
    const themeToggle = document.getElementById('themeToggle');
    
    currentTheme = currentTheme === 'dark' ? 'light' : 'dark';
    html.setAttribute('data-theme', currentTheme);
    localStorage.setItem('theme', currentTheme);
    
    updateThemeIcon();
    
    // Add animation effect
    themeToggle.style.transform = 'rotate(360deg)';
    setTimeout(() => {
        themeToggle.style.transform = 'rotate(0deg)';
    }, 300);
}

function updateThemeIcon() {
    const themeToggle = document.getElementById('themeToggle');
    
    if (themeToggle) {
        themeToggle.innerHTML = currentTheme === 'dark' 
            ? '<i class="fas fa-sun"></i><span class="theme-label">Light</span>' 
            : '<i class="fas fa-moon"></i><span class="theme-label">Dark</span>';
    }
}

// ===== NAVIGATION =====
function initializeNavigation() {
    const navbar = document.getElementById('navbar');
    const navToggle = document.getElementById('navToggle');
    const navMenu = document.getElementById('navMenu');
    const navLinks = document.querySelectorAll('.nav-link');
    const navLogo = document.querySelector('.nav-logo');
    
    // Navbar scroll effect
    window.addEventListener('scroll', () => {
        if (window.scrollY > 100) {
            navbar?.classList.add('scrolled');
        } else {
            navbar?.classList.remove('scrolled');
        }
    });
    
    // Mobile menu toggle
    navToggle?.addEventListener('click', (e) => {
        e.stopPropagation();
        const isActive = navMenu?.classList.contains('active');
        
        if (isActive) {
            navMenu.classList.remove('active');
            navToggle.classList.remove('active');
            document.body.style.overflow = 'auto';
        } else {
            navMenu?.classList.add('active');
            navToggle.classList.add('active');
            document.body.style.overflow = 'hidden';
        }
    });
    
    // Logo click handler
    navLogo?.addEventListener('click', (e) => {
        // Close mobile menu if open
        navMenu?.classList.remove('active');
        navToggle?.classList.remove('active');
        document.body.style.overflow = 'auto';
    });
    
    // Close mobile menu when clicking on links
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            const href = link.getAttribute('href');
            
            // Always close mobile menu when clicking links
            navMenu?.classList.remove('active');
            navToggle?.classList.remove('active');
            document.body.style.overflow = 'auto';
            
            // Handle anchor links on same page
            if (href.startsWith('#')) {
                e.preventDefault();
                const target = document.querySelector(href);
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            }
            // For other pages, let the default behavior happen
        });
    });
    
    // Close mobile menu when clicking outside
    document.addEventListener('click', (e) => {
        if (!navbar?.contains(e.target) && navMenu?.classList.contains('active')) {
            navMenu.classList.remove('active');
            navToggle?.classList.remove('active');
            document.body.style.overflow = 'auto';
        }
    });
    
    // Close mobile menu on escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && navMenu?.classList.contains('active')) {
            navMenu.classList.remove('active');
            navToggle?.classList.remove('active');
            document.body.style.overflow = 'auto';
        }
    });
    
    // Active link highlighting
    updateActiveNavLink();
    window.addEventListener('scroll', updateActiveNavLink);
}

function updateActiveNavLink() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    
    // For homepage, highlight based on scroll position
    if (currentPage === 'index.html' || currentPage === '') {
        let current = 'home';
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            if (window.scrollY >= sectionTop - 200) {
                current = section.getAttribute('id');
            }
        });
        
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}` || 
                (current === 'home' && link.getAttribute('href') === '#home')) {
                link.classList.add('active');
            }
        });
    } else {
        // For other pages, highlight based on current page
        navLinks.forEach(link => {
            link.classList.remove('active');
            const linkHref = link.getAttribute('href');
            if (linkHref === currentPage || 
                (currentPage === 'index.html' && linkHref === '#home')) {
                link.classList.add('active');
            }
        });
    }
}

// ===== SCROLL EFFECTS =====
function initializeScrollEffects() {
    // Initialize AOS (Animate On Scroll)
    if (typeof AOS !== 'undefined') {
        AOS.init({
            duration: 1000,
            easing: 'ease-in-out',
            once: true,
            mirror: false
        });
    }
    
    // Parallax effect for hero section
    window.addEventListener('scroll', () => {
        if (isScrolling) return;
        
        isScrolling = true;
        requestAnimationFrame(() => {
            const scrolled = window.pageYOffset;
            const hero = document.querySelector('.hero');
            const heroVideo = document.querySelector('.hero-video');
            
            if (hero && heroVideo) {
                const rate = scrolled * -0.5;
                heroVideo.style.transform = `translateY(${rate}px)`;
            }
            
            isScrolling = false;
        });
    });
}

// ===== ANIMATIONS =====
function initializeAnimations() {
    // Intersection Observer for scroll animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
            }
        });
    }, observerOptions);
    
    // Observe elements for animation
    const animateElements = document.querySelectorAll('.quick-link-card, .news-card, .stat-item');
    animateElements.forEach(el => observer.observe(el));
    
    // Hover effects for cards
    const cards = document.querySelectorAll('.quick-link-card, .news-card');
    cards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            card.style.transform = 'translateY(-10px) scale(1.02)';
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'translateY(0) scale(1)';
        });
    });
}

// ===== COUNTERS =====
function initializeCounters() {
    const counters = document.querySelectorAll('.stat-number');
    const counterObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateCounter(entry.target);
                counterObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });
    
    counters.forEach(counter => counterObserver.observe(counter));
}

function animateCounter(element) {
    const target = parseInt(element.getAttribute('data-count'));
    const duration = 2000;
    const step = target / (duration / 16);
    let current = 0;
    
    const timer = setInterval(() => {
        current += step;
        if (current >= target) {
            current = target;
            clearInterval(timer);
        }
        
        element.textContent = Math.floor(current).toLocaleString();
    }, 16);
}

// ===== VOICE SEARCH =====
function initializeVoiceSearch() {
    const voiceSearchBtn = document.getElementById('voiceSearch');
    const voiceInputBtn = document.getElementById('voiceInput');
    
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
        console.log('Speech recognition not supported');
        return;
    }
    
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = 'en-US';
    
    function startVoiceRecognition(callback) {
        recognition.start();
        
        recognition.onresult = (event) => {
            const transcript = event.results[0][0].transcript;
            callback(transcript);
        };
        
        recognition.onerror = (event) => {
            console.error('Speech recognition error:', event.error);
        };
    }
    
    // Voice search in navigation
    voiceSearchBtn?.addEventListener('click', () => {
        voiceSearchBtn.classList.add('listening');
        voiceSearchBtn.innerHTML = '<i class="fas fa-circle" style="color: red;"></i>';
        
        startVoiceRecognition((transcript) => {
            handleVoiceSearch(transcript);
            voiceSearchBtn.classList.remove('listening');
            voiceSearchBtn.innerHTML = '<i class="fas fa-microphone"></i>';
        });
    });
    
    // Voice input in chat
    voiceInputBtn?.addEventListener('click', () => {
        voiceInputBtn.classList.add('listening');
        voiceInputBtn.innerHTML = '<i class="fas fa-circle" style="color: red;"></i>';
        
        startVoiceRecognition((transcript) => {
            const chatInput = document.getElementById('chatInput');
            if (chatInput) {
                chatInput.value = transcript;
            }
            voiceInputBtn.classList.remove('listening');
            voiceInputBtn.innerHTML = '<i class="fas fa-microphone"></i>';
        });
    });
}

function handleVoiceSearch(query) {
    const searchTerms = {
        'agenda': 'agenda.html',
        'policies': 'agenda.html',
        'about': 'about.html',
        'biography': 'about.html',
        'news': 'news.html',
        'events': 'news.html',
        'gallery': 'gallery.html',
        'photos': 'gallery.html',
        'contact': 'contact.html',
        'volunteer': 'get-involved.html',
        'donate': 'get-involved.html'
    };
    
    const lowerQuery = query.toLowerCase();
    for (const [term, page] of Object.entries(searchTerms)) {
        if (lowerQuery.includes(term)) {
            window.location.href = page;
            return;
        }
    }
    
    // If no match found, show search results or redirect to search page
    showNotification(`Searching for: "${query}"`, 'info');
}

// ===== NEWSLETTER FORM =====
function initializeNewsletterForm() {
    const newsletterForm = document.getElementById('newsletterForm');
    
    newsletterForm?.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const email = e.target.querySelector('input[type="email"]').value;
        
        if (validateEmail(email)) {
            // Simulate form submission
            showNotification('Thank you for subscribing! Check your email for the manifesto.', 'success');
            e.target.reset();
            
            // Here you would typically send the data to your backend
            console.log('Newsletter subscription:', email);
        } else {
            showNotification('Please enter a valid email address.', 'error');
        }
    });
}

function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

// ===== PROGRESS BAR =====
function initializeProgressBar() {
    const progressBar = document.getElementById('progressBar');
    
    window.addEventListener('scroll', () => {
        const scrollTop = window.pageYOffset;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const scrollPercent = (scrollTop / docHeight) * 100;
        
        if (progressBar) {
            progressBar.style.width = scrollPercent + '%';
        }
    });
}

// ===== LAZY LOADING =====
function initializeLazyLoading() {
    const images = document.querySelectorAll('img[loading="lazy"]');
    
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src || img.src;
                    img.classList.remove('lazy');
                    imageObserver.unobserve(img);
                }
            });
        });
        
        images.forEach(img => imageObserver.observe(img));
    }
}

// ===== PARTICLES SYSTEM =====
function initializeParticles() {
    const canvas = document.getElementById('particleCanvas');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    let particles = [];
    
    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    
    function createParticle() {
        return {
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            vx: (Math.random() - 0.5) * 0.5,
            vy: (Math.random() - 0.5) * 0.5,
            size: Math.random() * 2 + 1,
            opacity: Math.random() * 0.5 + 0.2
        };
    }
    
    function initParticles() {
        particles = [];
        for (let i = 0; i < 50; i++) {
            particles.push(createParticle());
        }
    }
    
    function updateParticles() {
        particles.forEach(particle => {
            particle.x += particle.vx;
            particle.y += particle.vy;
            
            if (particle.x < 0 || particle.x > canvas.width) particle.vx *= -1;
            if (particle.y < 0 || particle.y > canvas.height) particle.vy *= -1;
        });
    }
    
    function drawParticles() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        particles.forEach(particle => {
            ctx.beginPath();
            ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(255, 215, 0, ${particle.opacity})`;
            ctx.fill();
        });
        
        // Draw connections
        particles.forEach((particle, i) => {
            particles.slice(i + 1).forEach(otherParticle => {
                const dx = particle.x - otherParticle.x;
                const dy = particle.y - otherParticle.y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                if (distance < 100) {
                    ctx.beginPath();
                    ctx.moveTo(particle.x, particle.y);
                    ctx.lineTo(otherParticle.x, otherParticle.y);
                    ctx.strokeStyle = `rgba(255, 215, 0, ${0.1 * (1 - distance / 100)})`;
                    ctx.lineWidth = 1;
                    ctx.stroke();
                }
            });
        });
    }
    
    function animate() {
        updateParticles();
        drawParticles();
        requestAnimationFrame(animate);
    }
    
    resizeCanvas();
    initParticles();
    animate();
    
    window.addEventListener('resize', () => {
        resizeCanvas();
        initParticles();
    });
}

// ===== UTILITY FUNCTIONS =====
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fas fa-${getNotificationIcon(type)}"></i>
            <span>${message}</span>
            <button class="notification-close">
                <i class="fas fa-times"></i>
            </button>
        </div>
    `;
    
    document.body.appendChild(notification);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        notification.remove();
    }, 5000);
    
    // Manual close
    notification.querySelector('.notification-close').addEventListener('click', () => {
        notification.remove();
    });
}

function getNotificationIcon(type) {
    const icons = {
        success: 'check-circle',
        error: 'exclamation-circle',
        warning: 'exclamation-triangle',
        info: 'info-circle'
    };
    return icons[type] || 'info-circle';
}

// ===== PERFORMANCE OPTIMIZATION =====
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
    }
}

// ===== ACCESSIBILITY ENHANCEMENTS =====
function initializeAccessibility() {
    // Skip to main content link
    const skipLink = document.createElement('a');
    skipLink.href = '#main';
    skipLink.className = 'skip-link';
    skipLink.textContent = 'Skip to main content';
    document.body.insertBefore(skipLink, document.body.firstChild);
    
    // Keyboard navigation for custom elements
    const interactiveElements = document.querySelectorAll('.btn, .nav-link, .card-link');
    interactiveElements.forEach(element => {
        element.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                element.click();
            }
        });
    });
    
    // Focus management for modals and dropdowns
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            // Close any open modals or dropdowns
            const chatWindow = document.getElementById('chatWindow');
            if (chatWindow && chatWindow.classList.contains('active')) {
                chatWindow.classList.remove('active');
            }
        }
    });
}

// ===== ERROR HANDLING =====
window.addEventListener('error', (e) => {
    console.error('JavaScript error:', e.error);
    // You could send this to an error tracking service
});

window.addEventListener('unhandledrejection', (e) => {
    console.error('Unhandled promise rejection:', e.reason);
    // You could send this to an error tracking service
});

// ===== ANALYTICS INTEGRATION =====
function trackEvent(eventName, eventData = {}) {
    // Google Analytics 4 event tracking
    if (typeof gtag !== 'undefined') {
        gtag('event', eventName, eventData);
    }
    
    // Custom analytics tracking
    console.log('Event tracked:', eventName, eventData);
}

// Track page interactions
document.addEventListener('click', (e) => {
    const target = e.target.closest('a, button');
    if (target) {
        const eventData = {
            element_type: target.tagName.toLowerCase(),
            element_text: target.textContent.trim(),
            element_class: target.className
        };
        trackEvent('click', eventData);
    }
});

// ===== INITIALIZATION COMPLETE =====
console.log('Didmus Barasa Campaign Website - JavaScript Initialized Successfully');

// ===== MOBILE FEATURES =====
function initializeMobileFeatures() {
    // Prevent zoom on input focus (iOS)
    const inputs = document.querySelectorAll('input, select, textarea');
    inputs.forEach(input => {
        input.addEventListener('focus', () => {
            if (window.innerWidth < 768) {
                const viewport = document.querySelector('meta[name=viewport]');
                viewport.setAttribute('content', 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no');
            }
        });
        
        input.addEventListener('blur', () => {
            if (window.innerWidth < 768) {
                const viewport = document.querySelector('meta[name=viewport]');
                viewport.setAttribute('content', 'width=device-width, initial-scale=1.0');
            }
        });
    });
    
    // Improve touch scrolling
    document.body.style.webkitOverflowScrolling = 'touch';
    
    // Add touch feedback to buttons
    const buttons = document.querySelectorAll('.btn, .nav-link, .filter-btn');
    buttons.forEach(button => {
        button.addEventListener('touchstart', () => {
            button.style.transform = 'scale(0.95)';
        });
        
        button.addEventListener('touchend', () => {
            setTimeout(() => {
                button.style.transform = 'scale(1)';
            }, 100);
        });
    });
}

// ===== AUTO CHAT POPUP =====
function initializeAutoChatPopup() {
    const chatWindow = document.getElementById('chatWindow');
    const chatToggle = document.getElementById('chatToggle');
    
    // Auto-popup chat after 4 seconds on first visit
    if (!localStorage.getItem('chatShown')) {
        setTimeout(() => {
            if (chatWindow && !chatWindow.classList.contains('active')) {
                chatWindow.classList.add('auto-show', 'active');
                
                // Auto-minimize after 4 seconds
                setTimeout(() => {
                    chatWindow.classList.remove('auto-show', 'active');
                    localStorage.setItem('chatShown', 'true');
                }, 4000);
            }
        }, 4000);
    }
    
    // Enhanced chat toggle for mobile
    chatToggle?.addEventListener('click', (e) => {
        e.stopPropagation();
        const isActive = chatWindow?.classList.contains('active');
        
        if (isActive) {
            chatWindow.classList.remove('active');
        } else {
            chatWindow?.classList.add('active');
            
            // Focus on input for better mobile experience
            setTimeout(() => {
                const chatInput = document.getElementById('chatInput');
                if (window.innerWidth > 768) {
                    chatInput?.focus();
                }
            }, 300);
        }
    });
}

// Export functions for use in other modules
window.DidmusWebsite = {
    toggleTheme,
    showNotification,
    trackEvent,
    debounce,
    throttle
};