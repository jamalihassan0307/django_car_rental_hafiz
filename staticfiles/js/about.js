// About Page Specific JavaScript
document.addEventListener('DOMContentLoaded', () => {
    // Initialize AOS for About page
    AOS.init({
        duration: 1000,
        once: true,
        offset: 100
    });

    // Add parallax effect to about image
    const aboutImage = document.querySelector('.about-image img');
    if (aboutImage) {
        window.addEventListener('scroll', () => {
            const scrolled = window.pageYOffset;
            const rate = scrolled * 0.5;
            aboutImage.style.transform = `translate3d(0px, ${rate}px, 0px)`;
        });
    }

    // Add smooth scroll to buttons
    const buttons = document.querySelectorAll('.btn');
    buttons.forEach(button => {
        button.addEventListener('click', (e) => {
            e.preventDefault();
            const href = button.getAttribute('href');
            if (href) {
                document.querySelector(href).scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });

    // Add hover effect to about text
    const aboutText = document.querySelector('.about-text');
    if (aboutText) {
        aboutText.addEventListener('mouseover', () => {
            aboutText.style.transform = 'scale(1.02)';
            aboutText.style.transition = 'transform 0.3s ease';
        });

        aboutText.addEventListener('mouseout', () => {
            aboutText.style.transform = 'scale(1)';
        });
    }

    // Add counter animation to numbers in text
    const numbers = document.querySelectorAll('.about-text strong');
    numbers.forEach(number => {
        const finalNumber = parseInt(number.textContent);
        let currentNumber = 0;
        const increment = finalNumber / 50;
        const timer = setInterval(() => {
            if (currentNumber < finalNumber) {
                currentNumber += increment;
                number.textContent = Math.floor(currentNumber);
            } else {
                number.textContent = finalNumber;
                clearInterval(timer);
            }
        }, 30);
    });
}); 