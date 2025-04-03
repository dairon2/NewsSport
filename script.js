document.addEventListener('DOMContentLoaded', function() {
    // Elementos DOM
    const sportSelect = document.getElementById('sportSelect');
    const loadButton = document.getElementById('loadButton');
    const loadingElement = document.getElementById('loading');
    const dataContainer = document.getElementById('dataContainer');
    
    // URLs de las APIs para diferentes deportes
    const apiUrls = {
        soccer: 'https://www.thesportsdb.com/api/v1/json/3/all_leagues.php',
        basketball: 'https://www.thesportsdb.com/api/v1/json/3/search_all_teams.php?l=NBA',
        tennis: 'https://www.thesportsdb.com/api/v1/json/3/all_sports.php'
    };
    
    // Evento click para el botón de cargar
    loadButton.addEventListener('click', function() {
        const selectedSport = sportSelect.value;
        loadSportData(selectedSport);
    });
    
    // Función para cargar datos deportivos
    function loadSportData(sport) {
        // Mostrar cargando y limpiar contenedor
        loadingElement.style.display = 'block';
        dataContainer.innerHTML = '';
        
        // Realizar la petición a la API
        fetch(apiUrls[sport])
            .then(response => {
                if (!response.ok) {
                    throw new Error('Error en la respuesta de la API');
                }
                return response.json();
            })
            .then(data => {
                // Ocultar el cargando
                loadingElement.style.display = 'none';
                
                // Procesar y mostrar los datos según el deporte
                switch(sport) {
                    case 'soccer':
                        displaySoccerData(data);
                        break;
                    case 'basketball':
                        displayBasketballData(data);
                        break;
                    case 'tennis':
                        displayTennisData(data);
                        break;
                }
            })
            .catch(error => {
                // Manejar errores
                loadingElement.style.display = 'none';
                dataContainer.innerHTML = `<div class="error-message">Error al cargar los datos: ${error.message}</div>`;
                console.error('Error:', error);
            });
    }
    
    // Función para mostrar datos de fútbol
    function displaySoccerData(data) {
        if (data.leagues && data.leagues.length > 0) {
            const leagues = data.leagues.slice(0, 10); // Limitar a 10 ligas para el ejemplo
            
            let html = '<h2>Ligas de Fútbol</h2>';
            html += '<table>';
            html += '<thead><tr><th>Liga</th><th>País</th><th>Tipo</th></tr></thead>';
            html += '<tbody>';
            
            leagues.forEach(league => {
                html += `<tr>
                    <td>${league.strLeague}</td>
                    <td>${league.strCountry}</td>
                    <td>${league.strLeagueType || 'No especificado'}</td>
                </tr>`;
            });
            
            html += '</tbody></table>';
            dataContainer.innerHTML = html;
        } else {
            dataContainer.innerHTML = '<div class="error-message">No se encontraron datos de ligas de fútbol.</div>';
        }
    }
    
    // Función para mostrar datos de baloncesto
    function displayBasketballData(data) {
        if (data.teams && data.teams.length > 0) {
            let html = '<h2>Equipos de la NBA</h2>';
            
            data.teams.forEach(team => {
                html += `<div class="team">
                    <h3>${team.strTeam}</h3>
                    <p><strong>Fundado:</strong> ${team.intFormedYear}</p>
                    <p><strong>Estadio:</strong> ${team.strStadium}</p>
                    <p><strong>Descripción:</strong> ${team.strDescriptionEN ? team.strDescriptionEN.substring(0, 150) + '...' : 'No disponible'}</p>
                </div>`;
            });
            
            dataContainer.innerHTML = html;
        } else {
            dataContainer.innerHTML = '<div class="error-message">No se encontraron datos de equipos de baloncesto.</div>';
        }
    }
    
    // Función para mostrar datos de tenis
    function displayTennisData(data) {
        if (data.sports && data.sports.length > 0) {
            // Buscamos información específica de tenis
            const tennisSport = data.sports.find(sport => sport.strSport.toLowerCase() === 'tennis');
            
            if (tennisSport) {
                let html = `<div class="sport">
                    <h2>${tennisSport.strSport}</h2>
                    <p><strong>Formato:</strong> ${tennisSport.strFormat}</p>
                    <p>${tennisSport.strSportDescription}</p>
                </div>`;
                dataContainer.innerHTML = html;
            } else {
                // Si no hay datos específicos de tenis, mostramos todos los deportes
                let html = '<h2>Deportes Disponibles</h2>';
                html += '<table>';
                html += '<thead><tr><th>Deporte</th><th>Formato</th></tr></thead>';
                html += '<tbody>';
                
                data.sports.slice(0, 10).forEach(sport => {
                    html += `<tr>
                        <td>${sport.strSport}</td>
                        <td>${sport.strFormat}</td>
                    </tr>`;
                });
                
                html += '</tbody></table>';
                dataContainer.innerHTML = html;
            }
        } else {
            dataContainer.innerHTML = '<div class="error-message">No se encontraron datos de deportes.</div>';
        }
    }
});
