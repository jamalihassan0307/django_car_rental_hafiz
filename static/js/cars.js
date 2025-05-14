// Cars Page Specific JavaScript
document.addEventListener('DOMContentLoaded', function() {
    const carTypeSelect = document.getElementById('carType');
    const priceRangeSelect = document.getElementById('priceRange');
    const carsGrid = document.getElementById('carsGrid');
    let isLoading = false;

    // Add event listeners for filters
    carTypeSelect.addEventListener('change', updateCars);
    priceRangeSelect.addEventListener('change', updateCars);

    function updateCars() {
        if (isLoading) return;
        isLoading = true;

        const type = carTypeSelect.value;
        const priceRange = priceRangeSelect.value;

        // Show loading state
        carsGrid.innerHTML = '<div class="loading">Loading cars...</div>';

        fetch(`/api/cars/?type=${type}&price_range=${priceRange}`)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                displayCars(data.cars);
            })
            .catch(error => {
                console.error('Error fetching cars:', error);
                carsGrid.innerHTML = `
                    <div class="error-message">
                        <p>Unable to load cars. Please try again.</p>
                        <button onclick="updateCars()" class="btn btn-primary">Retry</button>
                    </div>
                `;
            })
            .finally(() => {
                isLoading = false;
            });
    }

    function displayCars(cars) {
        if (cars.length === 0) {
            carsGrid.innerHTML = '<div class="no-cars-found"><p>No cars match your criteria.</p></div>';
            return;
        }

        carsGrid.innerHTML = cars.map(car => `
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
                            ${document.querySelector('.admin-controls') ? `
                                <a href="/car/edit/${car.id}/" class="btn btn-warning btn-sm">Edit</a>
                                <a href="/car/delete/${car.id}/" class="btn btn-danger btn-sm" 
                                   onclick="return confirm('Are you sure you want to delete this car?')">Delete</a>
                            ` : ''}
                        </div>
                    </div>
                </div>
            </div>
        `).join('');
    }

    // Initialize AOS
    AOS.init({
        duration: 1000,
        once: true,
        offset: 100
    });

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
    updateCars();
}); 