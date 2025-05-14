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
    let retryCount = 0;
    const maxRetries = 3;

    // Fetch cars from API with retry logic
    async function fetchCars() {
        try {
            const response = await fetch('/api/cars/');
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            cars = data;
            filterAndDisplayCars();
            retryCount = 0; // Reset retry count on successful fetch
        } catch (error) {
            console.error('Error fetching cars:', error);
            if (retryCount < maxRetries) {
                retryCount++;
                console.log(`Retrying fetch (${retryCount}/${maxRetries})...`);
                setTimeout(fetchCars, 1000 * retryCount); // Exponential backoff
            } else {
                carsGrid.innerHTML = `
                    <div class="no-cars-found">
                        <p>Unable to load cars at the moment. Please try refreshing the page.</p>
                        <button onclick="window.location.reload()" class="btn btn-primary mt-3">
                            <i class="fas fa-sync-alt"></i> Refresh Page
                        </button>
                    </div>`;
            }
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

        if (filteredCars.length === 0) {
            carsGrid.innerHTML = `
                <div class="no-cars-found">
                    <p>No cars match your filters.</p>
                    <button onclick="resetFilters()" class="btn btn-primary mt-3">
                        <i class="fas fa-filter"></i> Reset Filters
                    </button>
                </div>`;
        } else {
            carsGrid.innerHTML = filteredCars.map(car => createCarCard(car)).join('');
        }

        // Refresh AOS animations
        AOS.refresh();
    }

    // Reset filters function
    window.resetFilters = function() {
        carTypeFilter.value = 'all';
        priceRangeFilter.value = 'all';
        filterAndDisplayCars();
    };

    // Event listeners
    carTypeFilter.addEventListener('change', filterAndDisplayCars);
    priceRangeFilter.addEventListener('change', filterAndDisplayCars);

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

    // Initial load
    fetchCars();
}); 