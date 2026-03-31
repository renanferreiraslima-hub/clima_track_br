// ============================================================
//  api.js – Previsão do Tempo com Open-Meteo
// ============================================================

// ── 1. Mapeamento de weather codes para descrição e emoji ──
function getWeatherInfo(code) {
  const map = {
    0:  { desc: 'Céu limpo',                  icon: '☀️'  },
    1:  { desc: 'Principalmente limpo',        icon: '🌤'  },
    2:  { desc: 'Parcialmente nublado',        icon: '⛅'  },
    3:  { desc: 'Nublado',                     icon: '☁️'  },
    45: { desc: 'Neblina',                     icon: '🌫'  },
    48: { desc: 'Neblina com geada',           icon: '🌫'  },
    51: { desc: 'Garoa leve',                  icon: '🌦'  },
    53: { desc: 'Garoa moderada',              icon: '🌦'  },
    55: { desc: 'Garoa intensa',               icon: '🌧'  },
    61: { desc: 'Chuva leve',                  icon: '🌧'  },
    63: { desc: 'Chuva moderada',              icon: '🌧'  },
    65: { desc: 'Chuva intensa',               icon: '🌧'  },
    71: { desc: 'Neve leve',                   icon: '🌨'  },
    73: { desc: 'Neve moderada',               icon: '❄️'  },
    75: { desc: 'Neve intensa',                icon: '❄️'  },
    80: { desc: 'Pancadas de chuva',           icon: '🌦'  },
    81: { desc: 'Pancadas moderadas',          icon: '🌧'  },
    82: { desc: 'Pancadas violentas',          icon: '⛈'  },
    95: { desc: 'Trovoada',                    icon: '⛈'  },
    96: { desc: 'Trovoada com granizo',        icon: '⛈'  },
    99: { desc: 'Trovoada forte c/ granizo',   icon: '⛈'  },
  };
  return map[code] || { desc: 'Condição desconhecida', icon: '🌡' };
}

// ── 2. Converte graus de vento em direção cardeal ──
function getWindDirection(deg) {
  const dirs = ['N','NE','L','SE','S','SO','O','NO'];
  return dirs[Math.round(deg / 45) % 8];
}

// ── 3. Formata a data/hora ISO para exibição ──
function formatTime(isoStr) {
  const d = new Date(isoStr);
  return d.toLocaleString('pt-BR', {
    day: '2-digit', month: '2-digit', year: 'numeric',
    hour: '2-digit', minute: '2-digit'
  });
}

// ── 4. Mostra / esconde elementos ──
function show(id) { document.getElementById(id).classList.remove('hidden'); }
function hide(id) { document.getElementById(id).classList.add('hidden');    }

// ── 5. Exibe mensagem de erro ──
function showError(msg) {
  const el = document.getElementById('errorMsg');
  el.textContent = msg;
  show('errorMsg');
}

// ── 6. Preenche o card de clima no HTML ──
function renderWeather(cityName, data) {
  const c    = data.current;
  const info = getWeatherInfo(c.weather_code);

  document.getElementById('cityName').textContent    = cityName;
  document.getElementById('temperature').textContent = c.temperature_2m + '°C';
  document.getElementById('weatherIcon').textContent = info.icon;
  document.getElementById('weatherDesc').textContent = info.desc;
  document.getElementById('windSpeed').textContent   = c.wind_speed_10m + ' km/h';
  document.getElementById('windDir').textContent     = getWindDirection(c.wind_direction_10m);
  document.getElementById('elevation').textContent   = data.elevation + ' m';
  document.getElementById('updateTime').textContent  = formatTime(c.time);

  show('weatherCard');
}

// ── 7. Busca principal (coordenadas → clima) ──
async function searchWeather() {
  const city = document.getElementById('cityInput').value.trim();

  if (!city) {
    showError('Por favor, informe o nome de uma cidade.');
    return;
  }

  // Oculta resultados anteriores
  hide('weatherCard');
  hide('errorMsg');
  show('loading');

  try {
    // 7a. Geocodificação: nome → lat/lon
    const geoURL = `https://geocoding-api.open-meteo.com/v1/search` +
                   `?name=${encodeURIComponent(city)}&count=1&language=pt&format=json`;

    const geoRes  = await fetch(geoURL);
    const geoData = await geoRes.json();

    if (!geoData.results || geoData.results.length === 0) {
      throw new Error(`Cidade '${city}' não encontrada. Verifique o nome e tente novamente.`);
    }

    const { latitude, longitude, name, country } = geoData.results[0];
    const displayName = country ? `${name}, ${country}` : name;

    // 7b. Clima atual — usando o parâmetro "current" (atual da API)
    const wxURL = `https://api.open-meteo.com/v1/forecast` +
                  `?latitude=${latitude}&longitude=${longitude}` +
                  `&current=temperature_2m,weather_code,wind_speed_10m,wind_direction_10m` +
                  `&wind_speed_unit=kmh`;

    const wxRes  = await fetch(wxURL);
    const wxData = await wxRes.json();

    if (!wxData.current) {
      throw new Error('Não foi possível obter os dados climáticos. Tente novamente.');
    }

    renderWeather(displayName, wxData);

  } catch (err) {
    showError(err.message || 'Erro inesperado. Tente novamente.');
  } finally {
    hide('loading');
  }
}

// ── 8. Eventos ──
document.getElementById('searchBtn').addEventListener('click', searchWeather);

document.getElementById('cityInput').addEventListener('keydown', function (e) {
  if (e.key === 'Enter') searchWeather();
});