// Initialize AOS
AOS.init({
    offset: 100,
    duration: 800,
    easing: 'ease-in-sine',
    delay: 100,
});

// Theme Toggle
const themeToggle = document.getElementById('themeToggle');
const body = document.body;
const themeIcon = themeToggle.querySelector('i');

// Check for saved theme preference
const savedTheme = localStorage.getItem('theme');
if (savedTheme === 'dark') {
    body.classList.add('dark-mode');
    themeIcon.classList.replace('fa-sun', 'fa-moon');
}

themeToggle.addEventListener('click', () => {
    body.classList.toggle('dark-mode');
    const isDark = body.classList.contains('dark-mode');
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
    themeIcon.classList.toggle('fa-sun');
    themeIcon.classList.toggle('fa-moon');
});

// Mobile Menu Toggle
const mobileMenuToggle = document.querySelector('.mobile-nav-toggle');
const mobileMenu = document.querySelector('.mobile-menu');

mobileMenuToggle.addEventListener('click', () => {
    mobileMenu.classList.toggle('active');
    const icon = mobileMenuToggle.querySelector('i');
    icon.classList.toggle('fa-bars');
    icon.classList.toggle('fa-times');
});

// Close mobile menu when clicking outside
document.addEventListener('click', (e) => {
    if (!mobileMenu.contains(e.target) && !mobileMenuToggle.contains(e.target)) {
        mobileMenu.classList.remove('active');
        const icon = mobileMenuToggle.querySelector('i');
        icon.classList.replace('fa-times', 'fa-bars');
    }
});

// Car List Functionality
const carList = [
    {
        name: "Luxury Car 1",
        price: "100",
        image: "white-car.png"
    },
    {
        name: "Sports Car 1",
        price: "150",
        image: "car5.png"
    },
    {
        name: "Premium Car 1",
        price: "120",
        image: "car6.png"
    }
];

function createCarCard(car) {
    return `
        <div class="car-card" data-aos="fade-up">
            <div class="car-image-container">
                <img src="assets/${car.image}" alt="${car.name}" class="car-image">
            </div>
            <div class="car-details">
                <h2 class="car-name">${car.name}</h2>
                <div class="car-info">
                    <p class="car-price">$${car.price}/Day</p>
                    <a href="#" class="learn-more">Details</a>
                </div>
            </div>
            <p class="car-distance">12Km</p>
        </div>
    `;
}

function displayCars() {
    const carsGrid = document.getElementById('carsGrid');
    carsGrid.innerHTML = carList.map(car => createCarCard(car)).join('');
}

// Refresh cars button
const refreshButton = document.getElementById('refreshCars');
refreshButton.addEventListener('click', displayCars);

// Initial car display
displayCars();

// Testimonials Functionality
const testimonials = [
    {
        name: "John Doe",
        image: "https://picsum.photos/200",
        description: "Amazing service and great cars! Would definitely recommend."
    },
    {
        name: "Jane Smith",
        image: "https://picsum.photos/201",
        description: "Best car rental service I've ever used. Very professional."
    },
    {
        name: "Mike Johnson",
        image: "https://picsum.photos/202",
        description: "Excellent experience from start to finish. Will use again!"
    }
];

function createTestimonialCard(testimonial) {
    return `
        <div class="testimonial-card" data-aos="fade-up">
            <img src="${testimonial.image}" alt="${testimonial.name}" class="testimonial-image">
            <div class="rating">⭐⭐⭐⭐⭐</div>
            <p>${testimonial.description}</p>
            <h3>${testimonial.name}</h3>
        </div>
    `;
}

function displayTestimonials() {
    const testimonialsGrid = document.getElementById('testimonialsGrid');
    testimonialsGrid.innerHTML = testimonials.map(testimonial => createTestimonialCard(testimonial)).join('');
}

// Initial testimonials display
displayTestimonials();

// Company Info
const companyInfo = {
    name: "Car Rental Services",
    email: "info@carrentalservices.com",
    country: "United States",
    phonenumber: "+1 234 567 8900"
};

// Update company info in footer
document.getElementById('companyName').textContent = companyInfo.name;
document.getElementById('companyEmail').textContent = companyInfo.email;
document.getElementById('companyLocation').textContent = companyInfo.country;
document.getElementById('companyPhone').textContent = companyInfo.phonenumber;

// Refresh AOS on dynamic content
document.addEventListener('DOMContentLoaded', () => {
    AOS.refresh();
}); 