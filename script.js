document.addEventListener('DOMContentLoaded', function() {
    const apiUrl = 'https://restcountries.com/v3.1/all';
    fetch(apiUrl)
        .then(response => response.json())
        .then(data => {
            const countriesList = document.getElementById('countries-list');
            const allCountries = [].concat(...data); // Combine all arrays into one

            // Sort countries alphabetically by their common name
            allCountries.sort((a, b) => {
                if (a.name.common < b.name.common) return -1;
                if (a.name.common > b.name.common) return 1;
                return 0;
            });

            console.log(allCountries);

            allCountries.forEach(country => {
                const countryDiv = document.createElement('div');
                countryDiv.classList.add('country');

                const currencyName = country.currencies ? Object.values(country.currencies)[0].name : 'N/A';
                const flagImg = country.flags ? country.flags.svg : '';
                const mapUrl = country.maps ? country.maps.googleMaps : '#';

                const now = new Date();
                const optionsDate = { day: 'numeric', month: 'short', year: 'numeric' };
                const formattedDate = formatWithOrdinal(now.getDate()) + ' ' + now.toLocaleDateString('en-GB', optionsDate).replace(/\d+/, ''); 
                const optionsTime = { hour: 'numeric', minute: 'numeric', hour12: true };
                const formattedTime = now.toLocaleTimeString('en-US', optionsTime);

                countryDiv.innerHTML = `
                <div class="details-info">    
                    <div class="flag_Img">
                        <img class="flag-img" src="${flagImg}" alt="${country.name.common}">
                    </div>
                    <div class='details'>
                        <h2 class='sub-heading'>${country.name.common}</h2>
                        <p class='sub-details'>Currency: ${currencyName}</p>
                        <p class='sub-details'>Current date and time : ${formattedDate} ${formattedTime}</p>

                        <div class="btn">
                            <button class="btn-button" onclick="showMap('${mapUrl}')">Show Map</button>
                            <button class="btn-button2" onclick="viewDetail('${country.cca3}')">Detail</button>
                        </div>
                    </div>
                </div>
                `;
                countriesList.appendChild(countryDiv);
            });
        })
        .catch(error => {
            console.error('Error fetching data:', error);
            document.getElementById('error-message').innerText = 'Error fetching data: ' + error.message;
        });

    document.getElementById('search').addEventListener('input', function(event) {
        const searchQuery = event.target.value.toLowerCase();
        const countryDivs = document.querySelectorAll('.country');
        countryDivs.forEach(div => {
            const countryName = div.querySelector('h2').innerText.toLowerCase();
            if (countryName.includes(searchQuery)) {
                div.style.display = 'block';
            } else {
                div.style.display = 'none';
            }
        });
    });
});

function showMap(url) {
    if (url !== '#') {
        window.open(url, '_blank');
    } else {
        alert('Map not available');
    }
}

function formatWithOrdinal(day) {
    const suffixes = ["th", "st", "nd", "rd"];
    const v = day % 100;
    return day + (suffixes[(v - 20) % 10] || suffixes[v] || suffixes[0]);
}

function viewDetail(cca3) {
    window.location.href = `detail.html?country=${cca3}`;
}
