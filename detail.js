document.addEventListener('DOMContentLoaded', function() {
    const urlParams = new URLSearchParams(window.location.search);
    const countryCode = urlParams.get('country');
    if (!countryCode) {
        console.error('Country code is missing in the URL');
        return;
    }
    const apiUrl = `https://restcountries.com/v3.1/alpha/${countryCode}`;

    fetch(apiUrl)
        .then(response => response.json())
        .then(data => {
            if (!data || !data[0]) {
                console.error('Invalid API response:', data);
                return;
            }

            const country = data[0];
            const countryDetailDiv = document.getElementById('country-detail');

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

            const neighborCountriesDiv = document.getElementById('neighbor-countries');
            if (country.borders && country.borders.length > 0) {
                fetch(`https://restcountries.com/v3.1/alpha?codes=${country.borders.join(',')}`)
                    .then(response => response.json())
                    .then(neighboringCountries => {
                        if (neighboringCountries.length > 0) {
                            const neighborFlagsDiv = document.createElement('div');
                            neighborFlagsDiv.id = 'neighbor-flags';

                            neighboringCountries.forEach(neighbor => {
                                const neighborFlag = document.createElement('img');
                                neighborFlag.src = neighbor.flags.svg;
                                neighborFlag.alt = neighbor.name.common;
                                neighborFlag.title = neighbor.name.common;
                                neighborFlagsDiv.appendChild(neighborFlag);
                            });

                            neighborCountriesDiv.innerHTML = `<h2>Neighbour Countries</h2>`;
                            neighborCountriesDiv.appendChild(neighborFlagsDiv);
                        } else {
                            neighborCountriesDiv.style.display = 'none';
                        }
                    })
                    .catch(error => console.error('Error fetching neighboring countries:', error));
            } else {
                neighborCountriesDiv.style.display = 'none';
            }
        })
        .catch(error => {
            console.error('Error fetching country details:', error);
            document.getElementById('error-message').innerText = 'Error fetching data: ' + error.message;
        });
});