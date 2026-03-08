// ============================================
// DREAMHOME REAL ESTATE - FRONTEND JAVASCRIPT
// ============================================

// Change from localhost to your live API URL when deployed
//const API_URL = 'http://localhost:3000/api';
const API_URL = 'https://dreamhome-backend-1-zl8h.onrender.com/api';

// ============================================
// SMOOTH SCROLLING
// ============================================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        document.querySelector(this.getAttribute('href')).scrollIntoView({
            behavior: 'smooth'
        });
    });
});

// ============================================
// MOVING BACKGROUND EFFECT
// ============================================

// Parallax effect on scroll
window.addEventListener('scroll', function() {
    const hero = document.querySelector('.hero');
    const scrollPosition = window.pageYOffset;
    
    if (hero) {
        hero.style.backgroundPositionY = scrollPosition * 0.5 + 'px';
    }
});

// Mouse movement effect on hero section
const hero = document.querySelector('.hero');

if (hero) {
    hero.addEventListener('mousemove', function(e) {
        const x = (window.innerWidth - e.pageX * 2) / 100;
        const y = (window.innerHeight - e.pageY * 2) / 100;
        
        hero.style.backgroundPosition = `${50 + x}% ${50 + y}%`;
    });
}

// ============================================
// PROPERTY MODAL FUNCTIONALITY
// ============================================

// Get modal elements
const propertyModal = document.getElementById('property-modal');
const contactModal = document.getElementById('contact-modal');
const closeBtn = document.querySelector('.close-btn');
const contactAgentBtn = document.getElementById('contact-agent-btn');

const modalImg = document.getElementById('modal-img');
const modalPrice = document.getElementById('modal-price');
const modalAddress = document.getElementById('modal-address');
const modalDescription = document.getElementById('modal-description');
const modalBeds = document.getElementById('modal-beds');
const modalBaths = document.getElementById('modal-baths');
const modalSqft = document.getElementById('modal-sqft');

// Add click event to all property cards
document.querySelectorAll('.card').forEach(card => {
    card.addEventListener('click', function() {
        // Get property data from the card
        const img = this.querySelector('.card-img').src;
        const price = this.querySelector('.price').textContent;
        const address = this.querySelector('.address').textContent;
        const description = this.querySelector('p').textContent;
        const beds = this.querySelector('span:nth-child(1)').textContent;
        const baths = this.querySelector('span:nth-child(2)').textContent;
        const sqft = this.querySelector('span:nth-child(3)').textContent;

        // Set modal content
        modalImg.src = img;
        modalPrice.textContent = price;
        modalAddress.textContent = address;
        modalDescription.textContent = description;
        modalBeds.textContent = beds;
        modalBaths.textContent = baths;
        modalSqft.textContent = sqft;

        // Show property modal
        propertyModal.style.display = 'block';
        document.body.style.overflow = 'hidden';
    });
});

// ============================================
// CONTACT AGENT BUTTON FUNCTIONALITY
// ============================================

contactAgentBtn.addEventListener('click', function() {
    // Close property modal
    propertyModal.style.display = 'none';
    
    // Open contact modal
    contactModal.style.display = 'block';
    document.body.style.overflow = 'hidden';
    
    // Pre-fill message with property info
    const messageInput = document.getElementById('agent-message');
    const propertyInfo = `I am interested in: ${modalAddress.textContent} (${modalPrice.textContent})`;
    messageInput.value = propertyInfo;
});

// ============================================
// CLOSE MODALS
// ============================================

// Close modals when clicking X button
closeBtn.addEventListener('click', function() {
    propertyModal.style.display = 'none';
    contactModal.style.display = 'none';
    document.body.style.overflow = 'auto';
});

// Close modals when clicking outside the modal content
window.addEventListener('click', function(e) {
    if (e.target === propertyModal) {
        propertyModal.style.display = 'none';
        document.body.style.overflow = 'auto';
    }
    if (e.target === contactModal) {
        contactModal.style.display = 'none';
        document.body.style.overflow = 'auto';
    }
});

// Close modals with Escape key
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
        propertyModal.style.display = 'none';
        contactModal.style.display = 'none';
        document.body.style.overflow = 'auto';
    }
});

// ============================================
// CONTACT FORM SUBMISSION (Main Form) - MODERN
// ============================================

document.getElementById('contact-form').addEventListener('submit', async function(e) {
    e.preventDefault();
    
    const form = e.target;
    const submitBtn = document.getElementById('submitBtn');
    const formMessage = document.getElementById('formMessage');
    
    // Get form data
    const formData = {
        name: form.name.value,
        email: form.email.value,
        phone: form.phone.value,
        message: form.message.value
    };
    
    // Validate form
    if (!formData.name || !formData.email || !formData.message) {
        showFormMessage('Please fill all required fields', 'error');
        return;
    }
    
    // Show loading state
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<span class="spinner"></span> Sending...';
    formMessage.style.display = 'none';
    
    try {
        // Send to backend
        const response = await fetch(`${API_URL}/contact`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        });
        
        const result = await response.json();
        
        if (result.success) {
            // Success!
            showFormMessage('Message sent successfully! We will contact you soon.', 'success');
            submitBtn.innerHTML = 'Message Sent ✓';
            form.reset();
            
            // Reset button after 3 seconds
            setTimeout(() => {
                submitBtn.disabled = false;
                submitBtn.innerHTML = 'Send Message';
            }, 3000);
        } else {
            throw new Error(result.message || 'Failed to send message');
        }
    } catch (error) {
        // Error!
        console.error('Error:', error);
        showFormMessage('Failed to send message. Please try again.', 'error');
        submitBtn.disabled = false;
        submitBtn.innerHTML = 'Send Message';
    }
});

// Show inline message
function showFormMessage(message, type) {
    const formMessage = document.getElementById('formMessage');
    formMessage.textContent = message;
    formMessage.className = `form-message ${type}`;
    formMessage.style.display = 'block';
    
    // Auto-hide success message after 5 seconds
    if (type === 'success') {
        setTimeout(() => {
            formMessage.style.display = 'none';
        }, 5000);
    }
}

// ============================================
// CONTACT AGENT FORM SUBMISSION (Modal Form)
// ============================================

document.getElementById('agent-contact-form').addEventListener('submit', function(e) {
    e.preventDefault();
    
    // Get form values
    const name = document.getElementById('agent-name').value;
    const email = document.getElementById('agent-email').value;
    const phone = document.getElementById('agent-phone').value;
    const message = document.getElementById('agent-message').value;
    
    // Create email link
    const subject = encodeURIComponent('Property Inquiry from Website');
    const body = encodeURIComponent(`Name: ${name}\nEmail: ${email}\nPhone: ${phone}\n\nMessage:\n${message}`);
    const mailtoLink = `mailto:dreamhouse@re.com?subject=${subject}&body=${body}`;
    
    // Open email client
    window.location.href = mailtoLink;
    
    // Show success message
    alert('Thank you! Your email client will open to send the message.');
    
    // Close contact modal
    contactModal.style.display = 'none';
    document.body.style.overflow = 'auto';
    
    // Reset form
    document.getElementById('agent-contact-form').reset();
});