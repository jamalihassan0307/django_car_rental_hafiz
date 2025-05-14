// Contact Page Specific JavaScript
document.addEventListener('DOMContentLoaded', () => {
    // Initialize AOS
    AOS.init({
        duration: 1000,
        once: true,
        offset: 100
    });

    // Form Validation and Submission
    const contactForm = document.querySelector('.contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();

            // Get form values
            const name = document.getElementById('name').value;
            const email = document.getElementById('email').value;
            const subject = document.getElementById('subject').value;
            const message = document.getElementById('message').value;

            // Basic validation
            if (!name || !email || !subject || !message) {
                alert('Please fill in all fields');
                return;
            }

            // Email validation
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                alert('Please enter a valid email address');
                return;
            }

            // Simulate form submission
            const submitButton = contactForm.querySelector('button[type="submit"]');
            const originalText = submitButton.textContent;
            submitButton.textContent = 'Sending...';
            submitButton.disabled = true;

            // Simulate API call
            setTimeout(() => {
                alert('Message sent successfully!');
                contactForm.reset();
                submitButton.textContent = originalText;
                submitButton.disabled = false;
            }, 2000);
        });
    }

    // Add hover effects to info items
    const infoItems = document.querySelectorAll('.info-item');
    infoItems.forEach(item => {
        item.addEventListener('mouseover', () => {
            const icon = item.querySelector('i');
            icon.style.transform = 'scale(1.2) rotate(5deg)';
            icon.style.transition = 'transform 0.3s ease';
        });

        item.addEventListener('mouseout', () => {
            const icon = item.querySelector('i');
            icon.style.transform = 'scale(1) rotate(0deg)';
        });
    });

    // Add input focus effects
    const formInputs = document.querySelectorAll('.form-group input, .form-group textarea');
    formInputs.forEach(input => {
        input.addEventListener('focus', () => {
            input.parentElement.style.transform = 'translateX(5px)';
            input.parentElement.style.transition = 'transform 0.3s ease';
        });

        input.addEventListener('blur', () => {
            input.parentElement.style.transform = 'translateX(0)';
        });
    });

    // Real-time character count for message
    const messageTextarea = document.getElementById('message');
    if (messageTextarea) {
        const maxLength = 500;
        let charCountDiv = document.createElement('div');
        charCountDiv.className = 'char-count';
        charCountDiv.style.textAlign = 'right';
        charCountDiv.style.fontSize = '0.8rem';
        charCountDiv.style.color = 'var(--dark-gray)';
        messageTextarea.parentElement.appendChild(charCountDiv);

        function updateCharCount() {
            const remaining = maxLength - messageTextarea.value.length;
            charCountDiv.textContent = `${remaining} characters remaining`;
            if (remaining < 50) {
                charCountDiv.style.color = 'var(--primary-color)';
            } else {
                charCountDiv.style.color = 'var(--dark-gray)';
            }
        }

        messageTextarea.addEventListener('input', updateCharCount);
        updateCharCount();
    }
}); 