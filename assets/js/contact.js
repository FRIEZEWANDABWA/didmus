// Contact page functionality
document.addEventListener('DOMContentLoaded', function() {
    initializeContactForm();
    initializeFAQ();
    initializeMap();
});

function initializeContactForm() {
    const contactForm = document.querySelector('.message-form');
    
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const formData = new FormData(contactForm);
        const name = formData.get('name');
        const email = formData.get('email');
        const subject = formData.get('subject');
        const message = formData.get('message');
        
        // Basic validation
        if (!name || !email || !subject || !message) {
            showNotification('Please fill in all required fields', 'error');
            return;
        }
        
        if (!validateEmail(email)) {
            showNotification('Please enter a valid email address', 'error');
            return;
        }
        
        // Simulate form submission
        showNotification('Sending your message...', 'info');
        
        // Simulate AI-powered instant FAQ response
        setTimeout(() => {
            const aiResponse = generateAIResponse(subject, message);
            if (aiResponse) {
                showNotification('Message sent! Here\'s a quick answer: ' + aiResponse, 'success');
            } else {
                showNotification('Message sent successfully! We will respond within 24 hours.', 'success');
            }
            
            contactForm.reset();
        }, 2000);
    });
}

function initializeFAQ() {
    const faqItems = document.querySelectorAll('.faq-item');
    
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        const answer = item.querySelector('.faq-answer');
        const icon = question.querySelector('i');
        
        question.addEventListener('click', () => {
            const isOpen = item.classList.contains('open');
            
            // Close all other FAQ items
            faqItems.forEach(otherItem => {
                otherItem.classList.remove('open');
                otherItem.querySelector('.faq-answer').style.maxHeight = '0';
                otherItem.querySelector('.faq-question i').style.transform = 'rotate(0deg)';
            });
            
            // Toggle current item
            if (!isOpen) {
                item.classList.add('open');
                answer.style.maxHeight = answer.scrollHeight + 'px';
                icon.style.transform = 'rotate(180deg)';
            }
        });
    });
}

function initializeMap() {
    // Add click handler for map interactions
    const mapContainer = document.querySelector('.map-container');
    
    if (mapContainer) {
        mapContainer.addEventListener('click', () => {
            // Track map interaction
            if (typeof gtag !== 'undefined') {
                gtag('event', 'map_interaction', {
                    event_category: 'engagement',
                    event_label: 'office_location'
                });
            }
        });
    }
}

function generateAIResponse(subject, message) {
    const responses = {
        'volunteering': 'You can volunteer by filling out our volunteer form on the Get Involved page or calling our office at +254 700 000 000.',
        'media': 'For media inquiries, please contact our press team directly at info@didmusbarasa.co.ke or call +254 700 000 000.',
        'policy': 'You can find detailed policy information on our My Agenda page. For specific questions, our team will respond with detailed answers.',
        'event': 'Check our News & Events page for upcoming events, or call our office to inquire about specific event details.',
        'general': 'Thank you for your message. Our team will review it and respond appropriately within 24 hours.'
    };
    
    // Simple keyword matching for AI response
    const lowerMessage = message.toLowerCase();
    const lowerSubject = subject.toLowerCase();
    
    if (lowerSubject.includes('volunteer') || lowerMessage.includes('volunteer')) {
        return responses.volunteering;
    } else if (lowerSubject.includes('media') || lowerMessage.includes('media')) {
        return responses.media;
    } else if (lowerSubject.includes('policy') || lowerMessage.includes('policy')) {
        return responses.policy;
    } else if (lowerSubject.includes('event') || lowerMessage.includes('event')) {
        return responses.event;
    }
    
    return responses.general;
}

function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

// Add smooth scrolling for internal links
document.addEventListener('click', (e) => {
    if (e.target.matches('a[href^="#"]')) {
        e.preventDefault();
        
        const targetId = e.target.getAttribute('href').substring(1);
        const targetElement = document.getElementById(targetId);
        
        if (targetElement) {
            targetElement.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    }
});

// Phone number formatting
document.addEventListener('input', (e) => {
    if (e.target.type === 'tel') {
        let value = e.target.value.replace(/\D/g, '');
        
        // Format Kenyan phone numbers
        if (value.startsWith('254')) {
            value = '+' + value;
        } else if (value.startsWith('0')) {
            value = '+254' + value.substring(1);
        } else if (value.length > 0 && !value.startsWith('+')) {
            value = '+254' + value;
        }
        
        e.target.value = value;
    }
});