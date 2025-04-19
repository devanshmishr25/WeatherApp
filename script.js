document.addEventListener('DOMContentLoaded', function() {
    const locationInput = document.getElementById('location-input');
    const searchBtn = document.getElementById('search-btn');
    const weatherCard = document.getElementById('weather-card');
    const loadingElement = document.getElementById('loading');
    const errorMessage = document.getElementById('error-message');
    
    // Weather data elements
    const cityElement = document.getElementById('city');
    const countryElement = document.getElementById('country');
    const temperatureElement = document.getElementById('temperature');
    const feelsLikeElement = document.getElementById('feels-like');
    const weatherIconElement = document.getElementById('weather-icon');
    const conditionTextElement = document.getElementById('condition-text');
    const humidityElement = document.getElementById('humidity');
    const windElement = document.getElementById('wind');
    const uvElement = document.getElementById('uv');
    const airQualityElement = document.getElementById('air-quality');
    
    // API key and base URL
    const apiKey = '   ';
    const apiUrl = '   ';
    
    // Function to fetch weather data
    async function getWeatherData(location) {
        showLoading();
        
        try {
            const response = await fetch(`${apiUrl}?key=${apiKey}&q=${location}&aqi=yes`);
            
            if (!response.ok) {
                throw new Error('Location not found');
            }
            
            const data = await response.json();
            updateWeatherUI(data);
            hideLoading();
            showWeatherCard();
        } catch (error) {
            hideLoading();
            showError();
            console.error('Error fetching weather data:', error);
        }
    }
    
    // Function to update the UI with weather data
    function updateWeatherUI(data) {
        // Location data
        cityElement.textContent = data.location.name;
        countryElement.textContent = `${data.location.region}, ${data.location.country}`;
        
        // Temperature data
        temperatureElement.textContent = `${data.current.temp_c}°C`;
        feelsLikeElement.textContent = `Feels like: ${data.current.feelslike_c}°C`;
        
        // Weather condition
        weatherIconElement.src = `https:${data.current.condition.icon}`;
        conditionTextElement.textContent = data.current.condition.text;
        
        // Additional info
        humidityElement.textContent = `${data.current.humidity}%`;
        windElement.textContent = `${data.current.wind_kph} km/h`;
        uvElement.textContent = data.current.uv;
        
        // Air quality
        const aqi = data.current.air_quality.us_epa_index;
        let aqiText;
        
        switch(aqi) {
            case 1:
                aqiText = 'Good';
                break;
            case 2:
                aqiText = 'Moderate';
                break;
            case 3:
                aqiText = 'Unhealthy for sensitive';
                break;
            case 4:
                aqiText = 'Unhealthy';
                break;
            case 5:
                aqiText = 'Very Unhealthy';
                break;
            case 6:
                aqiText = 'Hazardous';
                break;
            default:
                aqiText = 'Unknown';
        }
        
        airQualityElement.textContent = aqiText;
    }
    
    // UI helper functions
    function showLoading() {
        weatherCard.classList.add('hidden');
        errorMessage.classList.add('hidden');
        loadingElement.classList.remove('hidden');
    }
    
    function hideLoading() {
        loadingElement.classList.add('hidden');
    }
    
    function showWeatherCard() {
        weatherCard.classList.remove('hidden');
    }
    
    function showError() {
        errorMessage.classList.remove('hidden');
    }
    
    // Event listeners
    searchBtn.addEventListener('click', function() {
        const location = locationInput.value.trim();
        if (location) {
            getWeatherData(location);
        }
    });
    
    locationInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            const location = locationInput.value.trim();
            if (location) {
                getWeatherData(location);
            }
        }
    });
    
    // Optional: Get user's current location weather on page load
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(position => {
            const coords = `${position.coords.latitude},${position.coords.longitude}`;
            getWeatherData(coords);
        }, error => {
            // Default to London if geolocation is denied or unavailable
            getWeatherData('London');
        });
    } else {
        // Default to London if geolocation is not supported
        getWeatherData('London');
    }
});
