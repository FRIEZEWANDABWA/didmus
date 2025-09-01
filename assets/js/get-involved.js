// Get Involved page functionality
document.addEventListener('DOMContentLoaded', function() {
    initializeDonationForm();
    initializeVolunteerForm();
    initializeSocialSharing();
});

function initializeDonationForm() {
    const amountButtons = document.querySelectorAll('.amount-btn');
    const customAmountInput = document.getElementById('custom-amount');
    const methodButtons = document.querySelectorAll('.method-btn');
    
    // Amount selection
    amountButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            e.preventDefault();
            
            // Remove active class from all buttons
            amountButtons.forEach(btn => btn.classList.remove('active'));
            // Add active class to clicked button
            button.classList.add('active');
            
            // Set custom amount input
            const amount = button.getAttribute('data-amount');
            customAmountInput.value = amount;
        });
    });
    
    // Custom amount input
    customAmountInput.addEventListener('input', () => {
        // Remove active class from preset buttons when custom amount is entered
        amountButtons.forEach(btn => btn.classList.remove('active'));
    });
    
    // Payment method selection
    methodButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            e.preventDefault();
            
            // Remove active class from all buttons
            methodButtons.forEach(btn => btn.classList.remove('active'));
            // Add active class to clicked button
            button.classList.add('active');
        });
    });
    
    // Form submission
    const donateForm = document.querySelector('.donate-form');
    donateForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const amount = customAmountInput.value;
        const method = document.querySelector('.method-btn.active').getAttribute('data-method');
        
        if (!amount || amount < 100) {
            showNotification('Please enter a valid amount (minimum KES 100)', 'error');
            return;
        }
        
        // Simulate payment processing
        showNotification('Processing your contribution...', 'info');
        
        setTimeout(() => {
            showNotification('Thank you for your contribution! You will receive a confirmation shortly.', 'success');
            donateForm.reset();
            amountButtons.forEach(btn => btn.classList.remove('active'));
        }, 2000);
    });
}

function initializeVolunteerForm() {
    const volunteerForm = document.querySelector('.volunteer-form');
    
    volunteerForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const formData = new FormData(volunteerForm);
        const interests = formData.getAll('interests');
        
        if (interests.length === 0) {
            showNotification('Please select at least one area of interest', 'error');
            return;
        }
        
        // Simulate form submission
        showNotification('Processing your volunteer application...', 'info');
        
        setTimeout(() => {
            showNotification('Thank you for volunteering! We will contact you within 24 hours.', 'success');
            volunteerForm.reset();
        }, 2000);
    });
}

function initializeSocialSharing() {
    const shareButtons = document.querySelectorAll('.share-btn');
    
    shareButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            e.preventDefault();
            
            const platform = button.classList[1]; // Get platform class
            const url = button.href;
            
            // Open sharing window
            window.open(url, `share-${platform}`, 'width=600,height=400,scrollbars=yes,resizable=yes');
            
            // Track sharing event
            if (typeof gtag !== 'undefined') {
                gtag('event', 'share', {
                    method: platform,
                    content_type: 'campaign_page'
                });
            }
        });
    });
}

function copyLink() {
    const linkInput = document.getElementById('campaign-link');
    
    // Select and copy the text
    linkInput.select();
    linkInput.setSelectionRange(0, 99999); // For mobile devices
    
    try {
        document.execCommand('copy');
        showNotification('Campaign link copied to clipboard!', 'success');
    } catch (err) {
        // Fallback for modern browsers
        navigator.clipboard.writeText(linkInput.value).then(() => {
            showNotification('Campaign link copied to clipboard!', 'success');
        }).catch(() => {
            showNotification('Failed to copy link. Please copy manually.', 'error');
        });
    }
}

// Smooth scrolling for anchor links
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