import { getSFSymbolHtml } from './sfSymbols.js';

export class WidgetsManager {
  constructor(desktopEl) {
    this.desktopEl = desktopEl;
    this.container = null;
    this._init();
  }

  _init() {
    if (!this.desktopEl) return;

    this.container = document.createElement('div');
    this.container.id = 'desktop-widgets-container';
    this.container.className = 'desktop-widgets-container';
    this.desktopEl.appendChild(this.container);

    this._renderCalendarWidget();
    this._renderBatteryWidget();
    this._renderWeatherWidget();
  }

  _renderCalendarWidget() {
    const card = document.createElement('div');
    card.className = 'widget-card widget-calendar';
    
    const now = new Date();
    const monthNames = ['JANEIRO', 'FEVEREIRO', 'MARÇO', 'ABRIL', 'MAIO', 'JUNHO', 'JULHO', 'AGOSTO', 'SETEMBRO', 'OUTUBRO', 'NOVEMBRO', 'DEZEMBRO'];
    const currentMonth = monthNames[now.getMonth()];
    const todayDate = now.getDate();
    const year = now.getFullYear();
    const month = now.getMonth();

    const firstDayIndex = new Date(year, month, 1).getDay();
    const totalDays = new Date(year, month + 1, 0).getDate();

    let gridHtml = '';
    const dayHeaders = ['D', 'S', 'T', 'Q', 'Q', 'S', 'S'];
    gridHtml += `<div class="widget-cal-header-row">${dayHeaders.map((h, i) => `<span class="${i === 0 || i === 6 ? 'is-weekend' : ''}">${h}</span>`).join('')}</div>`;

    gridHtml += '<div class="widget-cal-grid">';
    for (let i = 0; i < firstDayIndex; i++) {
      gridHtml += '<span class="widget-cal-day is-empty"></span>';
    }
    for (let d = 1; d <= totalDays; d++) {
      const colIndex = (firstDayIndex + d - 1) % 7;
      const isWeekend = colIndex === 0 || colIndex === 6;
      const isToday = d === todayDate;
      let classes = 'widget-cal-day';
      if (isWeekend) classes += ' is-weekend';
      if (isToday) classes += ' is-today';
      gridHtml += `<span class="${classes}"><span>${d}</span></span>`;
    }
    gridHtml += '</div>';

    card.innerHTML = `
      <div class="widget-cal-title">${currentMonth}</div>
      ${gridHtml}
    `;

    this.container.appendChild(card);
  }

  _renderBatteryWidget() {
    const card = document.createElement('div');
    card.className = 'widget-card widget-battery';

    card.innerHTML = `
      <div class="widget-battery-top">
        <div class="widget-battery-ring-wrap">
          <svg class="widget-battery-ring-svg" viewBox="0 0 44 44">
            <circle class="ring-bg" cx="22" cy="22" r="18" />
            <circle class="ring-fill" id="widget-battery-circle" cx="22" cy="22" r="18" stroke-dasharray="113" stroke-dashoffset="37" />
          </svg>
          <div class="widget-battery-icon-center">
            ${getSFSymbolHtml('desktopcomputer', { size: 22 })}
          </div>
        </div>
      </div>
      <div class="widget-battery-bottom">
        <span class="widget-battery-pct" id="widget-battery-text">100%</span>
      </div>
    `;

    this.container.appendChild(card);

    this._initBatteryData(card);
  }

  async _initBatteryData(card) {
    const pctEl = card.querySelector('#widget-battery-text');
    const circleEl = card.querySelector('#widget-battery-circle');

    const updateBatteryUI = () => {
      if (pctEl) pctEl.textContent = '100%';
      const circumference = 2 * Math.PI * 18;
      if (circleEl) {
        circleEl.style.strokeDasharray = `${circumference}`;
        circleEl.style.strokeDashoffset = '0';
        circleEl.style.stroke = '#30d158';
      }
    };

    updateBatteryUI();
  }

  _renderWeatherWidget() {
    const card = document.createElement('div');
    card.className = 'widget-card widget-weather';

    card.innerHTML = `
      <div class="widget-weather-main">
        <div class="widget-weather-left">
          <div class="widget-weather-city-row">
            <span class="widget-weather-city" id="widget-weather-city">Carregando...</span>
            ${getSFSymbolHtml('location.fill', { size: 13, className: 'widget-weather-location-icon' })}
          </div>
          <div class="widget-weather-temp" id="widget-weather-temp">--°</div>
        </div>
        <div class="widget-weather-right">
          <div class="widget-weather-condition-icon" id="widget-weather-cond-icon"></div>
          <div class="widget-weather-condition-text" id="widget-weather-cond-text">--</div>
          <div class="widget-weather-range" id="widget-weather-range">Máx --° Mín --°</div>
        </div>
      </div>
      <div class="widget-weather-hourly" id="widget-weather-hourly">
      </div>
    `;

    this.container.appendChild(card);

    this._fetchUserWeather(card);
  }

  async _fetchUserWeather(card) {
    const cityEl = card.querySelector('#widget-weather-city');
    const tempEl = card.querySelector('#widget-weather-temp');
    const condIconEl = card.querySelector('#widget-weather-cond-icon');
    const condTextEl = card.querySelector('#widget-weather-cond-text');
    const rangeEl = card.querySelector('#widget-weather-range');
    const hourlyEl = card.querySelector('#widget-weather-hourly');

    const weatherCodeMap = {
      0: { text: 'Ensolarado', symbol: 'sun.max.fill' },
      1: { text: 'Predom. Ensolarado', symbol: 'cloud.sun.fill' },
      2: { text: 'Parcialm. Nublado', symbol: 'cloud.sun.fill' },
      3: { text: 'Nublado', symbol: 'cloud.fill' },
      45: { text: 'Nevoeiro', symbol: 'cloud.fog.fill' },
      48: { text: 'Geada', symbol: 'cloud.fog.fill' },
      51: { text: 'Garoa Leve', symbol: 'cloud.drizzle.fill' },
      53: { text: 'Garoa', symbol: 'cloud.rain.fill' },
      55: { text: 'Garoa Forte', symbol: 'cloud.rain.fill' },
      61: { text: 'Chuva Leve', symbol: 'cloud.rain.fill' },
      63: { text: 'Chuva', symbol: 'cloud.rain.fill' },
      65: { text: 'Chuva Forte', symbol: 'cloud.rain.fill' },
      80: { text: 'Pancadas de Chuva', symbol: 'cloud.rain.fill' },
      95: { text: 'Tempestade', symbol: 'cloud.bolt.rain.fill' },
    };

    const applyWeatherData = (cityName, currentTemp, weatherCode, maxTemp, minTemp, hourlyData) => {
      if (cityEl) cityEl.textContent = cityName;
      if (tempEl) tempEl.textContent = `${Math.round(currentTemp)}°`;

      const condInfo = weatherCodeMap[weatherCode] || { text: 'Parcialm. Nublado', symbol: 'cloud.sun.fill' };
      if (condIconEl) condIconEl.innerHTML = getSFSymbolHtml(condInfo.symbol, { size: 28 });
      if (condTextEl) condTextEl.textContent = condInfo.text;
      if (rangeEl) rangeEl.textContent = `Máx ${Math.round(maxTemp)}° Mín ${Math.round(minTemp)}°`;

      if (hourlyEl && hourlyData) {
        hourlyEl.innerHTML = hourlyData.slice(0, 6).map(h => `
          <div class="widget-hourly-col">
            <span class="widget-hourly-time">${h.time}</span>
            <span class="widget-hourly-icon">${getSFSymbolHtml(h.symbol, { size: 18 })}</span>
            <span class="widget-hourly-temp">${Math.round(h.temp)}°</span>
          </div>
        `).join('');
      }
    };

    const fetchWeatherByCoords = async (lat, lon, cityName) => {
      const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true&hourly=temperature_2m,weathercode&daily=temperature_2m_max,temperature_2m_min&timezone=auto`;
      const res = await fetch(url);
      const data = await res.json();

      const currentTemp = data.current_weather.temperature;
      const weatherCode = data.current_weather.weathercode;
      const maxTemp = data.daily?.temperature_2m_max?.[0] ?? (currentTemp + 3);
      const minTemp = data.daily?.temperature_2m_min?.[0] ?? (currentTemp - 4);

      const currentHour = new Date().getHours();
      const hourlyList = [];
      for (let i = 0; i < 6; i++) {
        const h = (currentHour + i) % 24;
        const hStr = h.toString().padStart(2, '0');
        const hCode = data.hourly?.weathercode?.[currentHour + i] ?? weatherCode;
        const hTemp = data.hourly?.temperature_2m?.[currentHour + i] ?? currentTemp;
        const hSym = (weatherCodeMap[hCode] || { symbol: 'cloud.fill' }).symbol;
        hourlyList.push({ time: hStr, symbol: hSym, temp: hTemp });
      }

      applyWeatherData(cityName, currentTemp, weatherCode, maxTemp, minTemp, hourlyList);
    };

    const getCityNameFromCoords = async (lat, lon) => {
      try {
        const res = await fetch(`https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lon}&localityLanguage=pt`);
        const data = await res.json();
        return data.city || data.locality || data.principalSubdivision || 'Sua Localização';
      } catch (e) {
        return 'Sua Localização';
      }
    };

    const tryBrowserGeolocation = () => {
      return new Promise((resolve) => {
        if (!('geolocation' in navigator)) return resolve(null);
        navigator.geolocation.getCurrentPosition(
          async pos => {
            const lat = pos.coords.latitude;
            const lon = pos.coords.longitude;
            const city = await getCityNameFromCoords(lat, lon);
            resolve({ lat, lon, city });
          },
          () => resolve(null),
          { timeout: 4000 }
        );
      });
    };

    const tryGeoJs = async () => {
      try {
        const res = await fetch('https://get.geojs.io/v1/ip/geo.json');
        const data = await res.json();
        if (data && data.latitude && data.longitude) {
          return { lat: parseFloat(data.latitude), lon: parseFloat(data.longitude), city: data.city || 'Sua Cidade' };
        }
      } catch (e) {}
      return null;
    };

    const tryIpApiCom = async () => {
      try {
        const res = await fetch('https://ip-api.com/json/');
        const data = await res.json();
        if (data && data.lat && data.lon) {
          return { lat: data.lat, lon: data.lon, city: data.city || 'Sua Cidade' };
        }
      } catch (e) {}
      return null;
    };

    const tryIpApiCo = async () => {
      try {
        const res = await fetch('https://ipapi.co/json/');
        const data = await res.json();
        if (data && data.latitude && data.longitude) {
          return { lat: data.latitude, lon: data.longitude, city: data.city || 'Sua Cidade' };
        }
      } catch (e) {}
      return null;
    };

    const fallbackTimezoneCity = () => {
      try {
        const tz = Intl.DateTimeFormat().resolvedOptions().timeZone || '';
        const parts = tz.split('/');
        if (parts.length > 1) {
          return parts[parts.length - 1].replace(/_/g, ' ');
        }
      } catch (e) {}
      return 'Sua Cidade';
    };

    let loc = await tryGeoJs();
    if (!loc) loc = await tryIpApiCom();
    if (!loc) loc = await tryIpApiCo();
    if (!loc) loc = await tryBrowserGeolocation();

    if (loc) {
      try {
        await fetchWeatherByCoords(loc.lat, loc.lon, loc.city);
        return;
      } catch (e) {}
    }

    const fallbackCity = fallbackTimezoneCity();
    try {
      const geoUrl = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(fallbackCity)}&count=1&language=pt&format=json`;
      const res = await fetch(geoUrl);
      const data = await res.json();
      if (data.results && data.results[0]) {
        const { latitude, longitude, name } = data.results[0];
        await fetchWeatherByCoords(latitude, longitude, name);
        return;
      }
    } catch (e) {}

    await fetchWeatherByCoords(-23.5505, -46.6333, fallbackCity);
  }
}
