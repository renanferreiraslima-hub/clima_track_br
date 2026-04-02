function show(id) { document.getElementById(id).classList.remove('hidden') }
function hide(id) { document.getElementById(id).classList.add('hidden') }

function showError(msg) {
  const el = document.getElementById('errorMsg')
  el.textContent = msg
  el.classList.remove('hidden')
}

function getIcon(code) {
  if (code === 0)  return "☀️"
  if (code <= 2)   return "⛅"
  if (code === 3)  return "☁️"
  if (code < 50)   return "🌫️"
  if (code < 60)   return "🌦️"
  if (code < 70)   return "🌧️"
  if (code < 80)   return "❄️"
  if (code < 90)   return "🌨️"
  return "⛈️"
}

function getWeatherDesc(code) {
  if (code === 0)  return "Céu limpo"
  if (code === 1)  return "Principalmente limpo"
  if (code === 2)  return "Parcialmente nublado"
  if (code === 3)  return "Nublado"
  if (code < 50)   return "Nevoeiro"
  if (code < 60)   return "Garoa"
  if (code < 70)   return "Chuva"
  if (code < 80)   return "Neve"
  if (code < 90)   return "Pancadas de chuva"
  return "Tempestade"
}

function getWindDir(deg) {
  const dirs = ['N','NE','L','SE','S','SO','O','NO']
  return dirs[Math.round(deg / 45) % 8]
}

function formatDay(dateStr, isFirst) {
  if (isFirst) return "Hoje"
  const d = new Date(dateStr + 'T12:00:00')
  return d.toLocaleDateString('pt-BR', { weekday: 'short' }).replace('.', '').toUpperCase()
}

function formatTime(isoStr) {
  if (!isoStr) return '--'
  const d = new Date(isoStr)
  return d.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
}

async function searchWeather(cityOverride) {
  const city = cityOverride || document.getElementById('cityInput').value.trim()
  if (!city) { showError("Digite o nome de uma cidade"); return }

  if (cityOverride) document.getElementById('cityInput').value = cityOverride

  hide('errorMsg')
  hide('currentWeather')
  hide('extraRow')
  hide('forecastWrap')
  hide('sunWrap')
  document.getElementById('forecast').innerHTML = ''
  show('loading')

  try {
    const geoRes = await fetch(
      `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&count=1&language=pt`
    )
    const geoData = await geoRes.json()
    if (!geoData.results || geoData.results.length === 0) throw new Error("Cidade não encontrada")

    const { latitude, longitude, name, country, admin1 } = geoData.results[0]

    const res = await fetch(
      `https://api.open-meteo.com/v1/forecast` +
      `?latitude=${latitude}&longitude=${longitude}` +
      `&current_weather=true` +
      `&hourly=relativehumidity_2m,apparent_temperature,uv_index` +
      `&daily=weathercode,temperature_2m_max,temperature_2m_min,sunrise,sunset,precipitation_sum` +
      `&timezone=auto&forecast_days=6`
    )
    const data = await res.json()

    const cw = data.current_weather
    const nowHour = new Date(cw.time).getHours()

    const humidity  = data.hourly?.relativehumidity_2m?.[nowHour] ?? '--'
    const uvIndex   = data.hourly?.uv_index?.[nowHour]            ?? '--'
    const feelsLike = data.hourly?.apparent_temperature?.[nowHour] ?? '--'
    const locationLabel = admin1 ? `${name}, ${admin1} — ${country}` : `${name}, ${country}`

    // ── CARD ATUAL ──
    document.getElementById('currentWeather').innerHTML = `
      <div class="card-top">
        <div class="city-row">
          <i class="fa-solid fa-location-dot"></i>
          ${locationLabel}
        </div>
        <div class="main-temp-row">
          <div>
            <div class="temp">${Math.round(cw.temperature)}<sup>°C</sup></div>
            <div class="desc">${getWeatherDesc(cw.weathercode)}</div>
          </div>
          <div class="weather-icon-big">${getIcon(cw.weathercode)}</div>
        </div>
      </div>
      <div class="card-stats">
        <div class="stat-item">
          <div class="stat-icon">💨</div>
          <div>
            <div class="stat-label">Vento</div>
            <div class="stat-value">${Math.round(cw.windspeed)} km/h ${getWindDir(cw.winddirection)}</div>
          </div>
        </div>
        <div class="stat-item">
          <div class="stat-icon">🌡️</div>
          <div>
            <div class="stat-label">Sensação</div>
            <div class="stat-value">${feelsLike !== '--' ? Math.round(feelsLike) + '°C' : '--'}</div>
          </div>
        </div>
        <div class="stat-item">
          <div class="stat-icon">🌧️</div>
          <div>
            <div class="stat-label">Chuva hoje</div>
            <div class="stat-value">${data.daily?.precipitation_sum?.[0] ?? '0'} mm</div>
          </div>
        </div>
        <div class="stat-item">
          <div class="stat-icon">🧭</div>
          <div>
            <div class="stat-label">Direção</div>
            <div class="stat-value">${cw.winddirection}° ${getWindDir(cw.winddirection)}</div>
          </div>
        </div>
      </div>
    `
    show('currentWeather')

    // ── UMIDADE + UV ──
    const humPct = typeof humidity === 'number' ? Math.min(humidity, 100) : 0
    const uvPct  = typeof uvIndex  === 'number' ? Math.min((uvIndex / 11) * 100, 100) : 0
    document.getElementById('extraRow').innerHTML = `
      <div class="extra-card">
        <div class="extra-label"><i class="fa-solid fa-droplet"></i> Umidade</div>
        <div class="extra-value">${humidity !== '--' ? humidity : '--'}<span>%</span></div>
        <div class="bar-wrap">
          <div class="bar-fill" style="width:${humPct}%; background: linear-gradient(90deg,#38bdf8,#818cf8)"></div>
        </div>
      </div>
      <div class="extra-card">
        <div class="extra-label"><i class="fa-solid fa-sun"></i> Índice UV</div>
        <div class="extra-value">${uvIndex !== '--' ? Math.round(uvIndex) : '--'}<span>/11</span></div>
        <div class="bar-wrap">
          <div class="bar-fill" style="width:${uvPct}%; background: linear-gradient(90deg,#fbbf24,#f97316)"></div>
        </div>
      </div>
    `
    show('extraRow')

    // ── PREVISÃO RICA ──
    const forecastEl = document.getElementById('forecast')
    const maxPrecip = Math.max(...(data.daily.precipitation_sum || [1]))

    data.daily.time.slice(0, 6).forEach((day, i) => {
      const isToday = i === 0
      const precip  = data.daily.precipitation_sum?.[i] ?? 0
      const precipPct = maxPrecip > 0 ? Math.round((precip / maxPrecip) * 100) : 0
      const tempRange = data.daily.temperature_2m_max[i] - data.daily.temperature_2m_min[i]

      forecastEl.innerHTML += `
        <div class="forecast-card${isToday ? ' today' : ''}">
          <div class="fc-top">
            <div class="fc-day">${formatDay(day, isToday)}</div>
            <span class="fc-icon">${getIcon(data.daily.weathercode[i])}</span>
            <div class="fc-cond">${getWeatherDesc(data.daily.weathercode[i])}</div>
          </div>
          <div class="fc-bottom">
            <div class="fc-temp-row">
              <span class="fc-max">${Math.round(data.daily.temperature_2m_max[i])}°</span>
              <span class="fc-min">${Math.round(data.daily.temperature_2m_min[i])}°</span>
            </div>
            ${precip > 0 ? `<div class="fc-precip">💧 ${precip} mm</div>` : ''}
            <div class="fc-bar-wrap">
              <div class="fc-bar-fill" style="width:${Math.min(Math.round((tempRange/20)*100),100)}%"></div>
            </div>
          </div>
        </div>
      `
    })
    show('forecastWrap')

    // ── NASCER / PÔR DO SOL ──
    const sunrise = formatTime(data.daily?.sunrise?.[0])
    const sunset  = formatTime(data.daily?.sunset?.[0])
    document.getElementById('sunWrap').innerHTML = `
      <div class="sun-card">
        <div class="sun-icon">🌅</div>
        <div>
          <div class="s-label">Nascer do sol</div>
          <div class="s-value">${sunrise}</div>
        </div>
      </div>
      <div class="sun-card">
        <div class="sun-icon">🌇</div>
        <div>
          <div class="s-label">Pôr do sol</div>
          <div class="s-value">${sunset}</div>
        </div>
      </div>
    `
    show('sunWrap')

  } catch (err) {
    showError(err.message)
  } finally {
    hide('loading')
  }
}

document.addEventListener("DOMContentLoaded", () => {
  document.getElementById('searchBtn').addEventListener('click', () => searchWeather())
  document.getElementById('cityInput').addEventListener('keydown', (e) => {
    if (e.key === 'Enter') searchWeather()
  })

  // botões rápidos
  document.querySelectorAll('.qc-btn').forEach(btn => {
    btn.addEventListener('click', () => searchWeather(btn.dataset.city))
  })
})