// Cars Page Specific JavaScript
document.addEventListener('DOMContentLoaded', () => {
    // Initialize AOS
    AOS.init({
        duration: 1000,
        once: true,
        offset: 100
    });

    const carsGrid = document.getElementById('carsGrid');
    const carTypeFilter = document.getElementById('carType');
    const priceRangeFilter = document.getElementById('priceRange');
    let cars = [];

    // Fetch cars from API
    async function fetchCars() {
        try {
            const response = await fetch('/api/cars/');
            const data = await response.json();
            cars = data;
            filterAndDisplayCars();
        } catch (error) {
            console.error('Error fetching cars:', error);
            carsGrid.innerHTML = '<div class="no-cars-found"><p>Error loading cars. Please try again later.</p></div>';
        }
    }

    // Create car card HTML
    function createCarCard(car) {
        const adminControls = document.querySelector('.admin-controls') ? `
            <a href="/car/edit/${car.id}/" class="btn btn-warning btn-sm">Edit</a>
            <a href="/car/delete/${car.id}/" class="btn btn-danger btn-sm" 
               onclick="return confirm('Are you sure you want to delete this car?')">Delete</a>
        ` : '';

        return `
            <div class="car-card" data-aos="fade-up">
                <div class="car-image-container">
                    <img src="${car.image}" alt="${car.name}" class="car-image">
                    <span class="car-status ${car.is_available ? 'available' : 'unavailable'}">
                        ${car.is_available ? 'Available' : 'Not Available'}
                    </span>
                </div>
                <div class="car-details">
                    <h2 class="car-name">${car.name}</h2>
                    <p class="car-type">${car.car_type}</p>
                    <p class="car-description">${car.description}</p>
                    <div class="car-info">
                        <p class="car-price">$${car.price_per_day}/day</p>
                        <div class="car-actions">
                            <a href="/car/${car.id}/" class="btn btn-primary btn-sm">View Details</a>
                            ${adminControls}
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    // Filter and display cars
    function filterAndDisplayCars() {
        const selectedType = carTypeFilter.value;
        const selectedPriceRange = priceRangeFilter.value;
        
        let filteredCars = cars.filter(car => {
            const typeMatch = selectedType === 'all' || car.car_type === selectedType;
            
            if (selectedPriceRange === 'all') return typeMatch;
            
            const price = parseFloat(car.price_per_day);
            const [minPrice, maxPrice] = selectedPriceRange.split('-');
            
            if (maxPrice === 'up') {
                return typeMatch && price >= parseFloat(minPrice);
            }
            
            return typeMatch && 
                   price >= parseFloat(minPrice) && 
                   price <= parseFloat(maxPrice);
        });

        carsGrid.innerHTML = filteredCars.length > 0
            ? filteredCars.map(car => createCarCard(car)).join('')
            : '<div class="no-cars-found"><p>No cars match your filters.</p></div>';

        // Refresh AOS animations
        AOS.refresh();
    }

    // Event listeners
    carTypeFilter.addEventListener('change', filterAndDisplayCars);
    priceRangeFilter.addEventListener('change', filterAndDisplayCars);

    // Initial load
    fetchCars();

    // Add hover effect to car cards
    carsGrid.addEventListener('mouseover', (e) => {
        const card = e.target.closest('.car-card');
        if (card) {
            const image = card.querySelector('.car-image');
            if (image) {
                image.style.transform = 'scale(1.1)';
            }
        }
    });

    carsGrid.addEventListener('mouseout', (e) => {
        const card = e.target.closest('.car-card');
        if (card) {
            const image = card.querySelector('.car-image');
            if (image) {
                image.style.transform = 'scale(1)';
            }
        }
    });
}); 