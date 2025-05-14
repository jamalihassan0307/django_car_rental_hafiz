// Cars Page Specific JavaScript
document.addEventListener('DOMContentLoaded', () => {
    // Initialize AOS
    AOS.init({
        duration: 1000,
        once: true,
        offset: 100
    });

    // Car Data
    const carList = [
        {
            name: "Luxury Car 1",
            price: "100",
            image: "white-car.png",
            type: "luxury",
            distance: "12Km"
        },
        {
            name: "Sports Car 1",
            price: "150",
            image: "car5.png",
            type: "sports",
            distance: "8Km"
        },
        {
            name: "Premium Car 1",
            price: "120",
            image: "car6.png",
            type: "luxury",
            distance: "15Km"
        },
        {
            name: "SUV 1",
            price: "200",
            image: "car1.png",
            type: "suv",
            distance: "20Km"
        },
        {
            name: "Sports Car 2",
            price: "180",
            image: "car2.png",
            type: "sports",
            distance: "5Km"
        }
    ];

    let currentPage = 1;
    const carsPerPage = 6;
    let filteredCars = [...carList];

    // Create car card HTML
    function createCarCard(car) {
        return `
            <div class="car-card" data-aos="fade-up">
                <div class="car-image-container">
                    <img src="../assets/${car.image}" alt="${car.name}" class="car-image">
                    <span class="car-distance">${car.distance}</span>
                </div>
                <div class="car-details">
                    <h2 class="car-name">${car.name}</h2>
                    <div class="car-info">
                        <p class="car-price">$${car.price}/Day</p>
                        <a href="#" class="learn-more">Details</a>
                    </div>
                </div>
            </div>
        `;
    }

    // Display cars with pagination
    function displayCars() {
        const carsGrid = document.getElementById('carsGrid');
        const start = (currentPage - 1) * carsPerPage;
        const end = start + carsPerPage;
        const paginatedCars = filteredCars.slice(start, end);
        
        carsGrid.innerHTML = paginatedCars.map(car => createCarCard(car)).join('');
        
        // Show/hide load more button
        const loadMoreBtn = document.getElementById('loadMore');
        if (end >= filteredCars.length) {
            loadMoreBtn.style.display = 'none';
        } else {
            loadMoreBtn.style.display = 'block';
        }

        // Refresh AOS
        AOS.refresh();
    }

    // Filter cars
    function filterCars() {
        const typeFilter = document.getElementById('carType').value;
        const priceFilter = document.getElementById('priceRange').value;

        filteredCars = carList.filter(car => {
            const matchesType = typeFilter === 'all' || car.type === typeFilter;
            
            if (priceFilter === 'all') return matchesType;

            const [minPrice, maxPrice] = priceFilter.split('-').map(Number);
            const carPrice = Number(car.price);
            
            return matchesType && carPrice >= minPrice && carPrice <= maxPrice;
        });

        currentPage = 1;
        displayCars();
    }

    // Event Listeners
    document.getElementById('carType').addEventListener('change', filterCars);
    document.getElementById('priceRange').addEventListener('change', filterCars);
    document.getElementById('refreshCars').addEventListener('click', () => {
        document.getElementById('carType').value = 'all';
        document.getElementById('priceRange').value = 'all';
        filteredCars = [...carList];
        currentPage = 1;
        displayCars();
    });

    document.getElementById('loadMore').addEventListener('click', () => {
        currentPage++;
        displayCars();
    });

    // Initial display
    displayCars();

    // Add hover effect to car cards
    const carsGrid = document.getElementById('carsGrid');
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