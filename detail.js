document.addEventListener('DOMContentLoaded', function() {
    const urlParams = new URLSearchParams(window.location.search);
    const countryCode = urlParams.get('country');
    const countryDetailDiv = document.getElementById('country-detail');
    const neighborCountriesDiv = document.getElementById('neighbor-countries');
    const errorMessageDiv = document.getElementById('error-message');

    if (!countryCode) {
        console.error('Country code is missing in the URL');
        errorMessageDiv.innerText = 'Country code is missing in the URL';
        return;
    }

    const apiUrl = `https://restcountries.com/v3.1/alpha/${countryCode}`;

    // Show loading indicator
    countryDetailDiv.innerHTML = '<p>Loading...</p>';

    fetch(apiUrl)
        .then(response => response.json())
        .then(data => {
            if (!data || !data[0]) {
                console.error('Invalid API response:', data);
                errorMessageDiv.innerText = 'Invalid API response';
                return;
            }

            const country = data[0];

            const name = country.name.common ? `<h1>${country.name.common}</h1>` : '<h1>Unknown Country</h1>';
            const flag = country.flags ? `<img class='flag-img' src="${country.flags.svg}" alt="${country.name.common}">` : '';
            const nativeName = country.name.nativeName ? `<p>Native Name: ${Object.values(country.name.nativeName)[0].common}</p>` : '';
            const capital = country.capital ? `<p>Capital: ${country.capital[0]}</p>` : '';
            const population = country.population ? `<p>Population: ${country.population}</p>` : '';
            const region = country.region ? `<p>Region: ${country.region}</p>` : '';
            const subregion = country.subregion ? `<p>Sub-region: ${country.subregion}</p>` : '';
            const area = country.area ? `<p>Area: ${country.area} Km²</p>` : '';
            const countryCodeDisplay = country.idd ? `<p>Country Code: ${country.idd.root}${country.idd.suffixes[0]}</p>` : '';
            const languages = country.languages ? `<p>Languages: ${Object.values(country.languages).join(', ')}</p>` : '';
            const currencies = country.currencies ? `<p>Currencies: ${Object.values(country.currencies).map(c => c.name).join(', ')}</p>` : '';
            const timezones = country.timezones ? `<p>Timezones: ${country.timezones.join(', ')}</p>` : '';

            countryDetailDiv.innerHTML = `
                <div class="name">
                    ${name}
                    <div id="country-info">
                        <div>${flag}</div>
                        <div class="info-details">
                            ${nativeName}
                            ${capital}
                            ${population}
                            ${region}
                            ${subregion}
                            ${area}
                            ${countryCodeDisplay}
                            ${languages}
                            ${currencies}
                            ${timezones}
                        </div>
                    </div>
                </div>
            `;

            if (country.borders && country.borders.length > 0) {
                fetch(`https://restcountries.com/v3.1/alpha?codes=${country.borders.join(',')}`)
                    .then(response => response.json())
                    .then(neighboringCountries => {
                        if (neighboringCountries.length > 0) {
                            const neighborFlagsDiv = document.createElement('div');
                            neighborFlagsDiv.id = 'neighbor-flags';

                            neighboringCountries.forEach(neighbor => {
                                const neighborFlag = document.createElement('img');
                                neighborFlag.src = neighbor.flags ? neighbor.flags.svg : '';
                                neighborFlag.alt = neighbor.name ? neighbor.name.common : 'Unknown Country';
                                neighborFlag.title = neighbor.name ? neighbor.name.common : 'Unknown Country';
                                neighborFlagsDiv.appendChild(neighborFlag);
                            });

                            neighborCountriesDiv.innerHTML = `<h2>Neighbour Countries</h2>`;
                            neighborCountriesDiv.appendChild(neighborFlagsDiv);
                        } else {
                            neighborCountriesDiv.innerHTML = '<p>No Neighboring Countries</p>';
                        }
                    })
                    .catch(error => {
                        console.error('Error fetching neighboring countries:', error);
                        errorMessageDiv.innerText = 'Error fetching neighboring countries: ' + error.message;
                        neighborCountriesDiv.innerHTML = '<p>No Neighboring Countries</p>';
                    });
            } else {
                neighborCountriesDiv.innerHTML = '<p>No Neighboring Countries</p>';
            }
        })
        .catch(error => {
            console.error('Error fetching country details:', error);
            errorMessageDiv.innerText = 'Error fetching country details: ' + error.message;
        });
});
