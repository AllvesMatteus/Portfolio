import { getSFSymbolHtml } from './sfSymbols.js';
import { showNotification } from './notificationManager.js';

export class WidgetsManager {
  constructor(desktopEl, wm) {
    this.desktopEl = desktopEl;
    this.wm = wm;
    this.container = null;
    this._init(wm);
  }

  _init(wm) {
    if (!this.desktopEl) return;
    this.wm = wm;

    this.container = document.createElement('div');
    this.container.id = 'desktop-widgets-container';
    this.container.className = 'desktop-widgets-container';
    this.desktopEl.appendChild(this.container);

    this._renderCalendarWidget();
    this._renderBatteryWidget();
    this._renderWeatherWidget();
    this._renderPortfolioWidget();

    if (wm && typeof wm.onChange === 'function') {
      wm.onChange(({ openApps, minimizedApps, windows }) => {
        const visibleWindows = windows.filter(w => !minimizedApps.has(w.id));
        const isDesktop = visibleWindows.length === 0;
        this.container.classList.toggle('widgets--desktop', isDesktop);
      });
      const initial = { openApps: wm.openApps, minimizedApps: wm.minimizedApps, windows: wm.windows };
      const visibleNow = initial.windows.filter(w => !initial.minimizedApps.has(w.id));
      this.container.classList.toggle('widgets--desktop', visibleNow.length === 0);
    }
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
            ${getSFSymbolHtml('laptop', { size: 22 })}
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

      const now = new Date();
      const currentHour = now.getHours();
      let startIndex = data.hourly?.time?.findIndex(t => {
        const d = new Date(t);
        return d.getHours() === currentHour && d.getDate() === now.getDate();
      }) ?? -1;

      if (startIndex === -1) startIndex = currentHour;

      const hourlyList = [];
      for (let i = 0; i < 6; i++) {
        const idx = startIndex + i;
        const timeISO = data.hourly?.time?.[idx];
        let hourDisplay = ((currentHour + i) % 24).toString().padStart(2, '0');
        if (timeISO) {
          const d = new Date(timeISO);
          hourDisplay = d.getHours().toString().padStart(2, '0');
        }

        const hCode = data.hourly?.weathercode?.[idx] ?? weatherCode;
        const hTemp = data.hourly?.temperature_2m?.[idx] ?? currentTemp;
        const hSym = (weatherCodeMap[hCode] || { symbol: 'cloud.fill' }).symbol;
        hourlyList.push({ time: hourDisplay, symbol: hSym, temp: hTemp });
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
      } catch (e) { }
      return null;
    };

    const tryIpApiCom = async () => {
      try {
        const res = await fetch('https://ip-api.com/json/');
        const data = await res.json();
        if (data && data.lat && data.lon) {
          return { lat: data.lat, lon: data.lon, city: data.city || 'Sua Cidade' };
        }
      } catch (e) { }
      return null;
    };

    const tryIpApiCo = async () => {
      try {
        const res = await fetch('https://ipapi.co/json/');
        const data = await res.json();
        if (data && data.latitude && data.longitude) {
          return { lat: data.latitude, lon: data.longitude, city: data.city || 'Sua Cidade' };
        }
      } catch (e) { }
      return null;
    };

    const fallbackTimezoneCity = () => {
      try {
        const tz = Intl.DateTimeFormat().resolvedOptions().timeZone || '';
        const parts = tz.split('/');
        if (parts.length > 1) {
          return parts[parts.length - 1].replace(/_/g, ' ');
        }
      } catch (e) { }
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
      } catch (e) { }
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
    } catch (e) { }

    await fetchWeatherByCoords(-23.5505, -46.6333, fallbackCity);
  }

  _renderPortfolioWidget() {
    const card = document.createElement('div');
    card.className = 'widget-card widget-portfolio-carousel';
    card.setAttribute('role', 'region');
    card.setAttribute('aria-roledescription', 'carousel');
    card.setAttribute('aria-label', 'Perfil e Portfólio de Mateus Alves');

    const slides = [
      {
        id: 'hero',
        label: '1 de 5',
        title: 'Perfil',
        content: `
          <div class="bento-slide bento-hero-slide">
            <div class="bento-header-label">
              <span>DESENVOLVEDOR FULL STACK WEB</span>
              <span class="bento-counter">São Paulo, Brasil</span>
            </div>
            <div class="bento-hero-body">
              <div class="bento-hero-left">
                <div class="bento-avatar-wrap">
                  <img src="assets/images/portfolio/mateus-alves-about.jpg" alt="Mateus Alves" class="bento-avatar" draggable="false" />
                </div>
              </div>
              <div class="bento-hero-right">
                <h3 class="bento-name">Mateus Alves</h3>
                <p class="bento-role">+5 anos de experiência criando soluções web, mobile e automações.</p>
                <div class="bento-action-row">
                  <button class="bento-btn-primary" id="btn-portfolio-safari">
                    <img src="assets/icons/dock/safari.png" alt="Safari" class="bento-btn-icon" />
                    <span>Explorar Portfólio</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        `
      },
      {
        id: 'education',
        label: '2 de 5',
        title: 'Formação',
        content: `
          <div class="bento-slide bento-education">
            <div class="bento-header-label">
              <span>FORMAÇÃO ACADÊMICA</span>
              <span class="bento-counter">Mackenzie & ETEC</span>
            </div>
            <div class="bento-edu-body-wrap">
              <div class="bento-edu-grid">
                <div class="bento-edu-card">
                  <img src="assets/images/portfolio/logo-mackenzie.png" alt="Mackenzie" class="bento-edu-logo" />
                  <div class="bento-edu-info">
                    <span class="bento-edu-school">Mackenzie</span>
                    <span class="bento-edu-degree">Análise e Dev. de Sistemas</span>
                    <span class="bento-edu-tag">Tecnólogo</span>
                  </div>
                  <span class="bento-edu-year">Cursando</span>
                </div>
                <div class="bento-edu-card">
                  <img src="assets/images/portfolio/logo-etec.png" alt="ETEC" class="bento-edu-logo" />
                  <div class="bento-edu-info">
                    <span class="bento-edu-school">ETEC</span>
                    <span class="bento-edu-degree">Dev. de Sistemas</span>
                    <span class="bento-edu-tag">Técnico</span>
                  </div>
                  <span class="bento-edu-year">2021</span>
                </div>
              </div>
            </div>
          </div>
        `
      },
      {
        id: 'stack',
        label: '3 de 5',
        title: 'Tech Stack',
        content: `
          <div class="bento-slide bento-stack">
            <div class="bento-header-label">
              <span>TECH STACK PRINCIPAL</span>
              <span class="bento-counter">Mais de 8 Tecnologias</span>
            </div>
            <div class="bento-tech-grid">
              <div class="bento-tech-tile" title="JavaScript">
                <div class="bento-tech-icon-box">
                  <img src="assets/images/portfolio/tecnologias/javascript.png" alt="JavaScript" />
                </div>
                <span class="bento-tech-title">JavaScript</span>
              </div>
              <div class="bento-tech-tile" title="TypeScript">
                <div class="bento-tech-icon-box">
                  <img src="assets/images/portfolio/tecnologias/typescript.png" alt="TypeScript" />
                </div>
                <span class="bento-tech-title">TypeScript</span>
              </div>
              <div class="bento-tech-tile" title="React Native">
                <div class="bento-tech-icon-box">
                  <img src="assets/images/portfolio/tecnologias/react-native.png" alt="React Native" />
                </div>
                <span class="bento-tech-title">React Native</span>
              </div>
              <div class="bento-tech-tile" title="Tailwind CSS">
                <div class="bento-tech-icon-box">
                  <img src="assets/images/portfolio/tecnologias/tailwind.png" alt="Tailwind CSS" />
                </div>
                <span class="bento-tech-title">Tailwind</span>
              </div>
              <div class="bento-tech-tile" title="Node.js">
                <div class="bento-tech-icon-box">
                  <img src="assets/images/portfolio/tecnologias/node-js.png" alt="Node.js" />
                </div>
                <span class="bento-tech-title">Node.js</span>
              </div>
              <div class="bento-tech-tile" title="Python">
                <div class="bento-tech-icon-box">
                  <img src="assets/images/portfolio/tecnologias/python.png" alt="Python" />
                </div>
                <span class="bento-tech-title">Python</span>
              </div>
              <div class="bento-tech-tile" title="Supabase">
                <div class="bento-tech-icon-box">
                  <img src="assets/images/portfolio/tecnologias/supabase.png" alt="Supabase" />
                </div>
                <span class="bento-tech-title">Supabase</span>
              </div>
              <div class="bento-tech-tile" title="MongoDB">
                <div class="bento-tech-icon-box">
                  <img src="assets/images/portfolio/tecnologias/mongo-db.png" alt="MongoDB" />
                </div>
                <span class="bento-tech-title">MongoDB</span>
              </div>
            </div>
          </div>
        `
      },
      {
        id: 'contact',
        label: '4 de 5',
        title: 'Contatos',
        content: `
          <div class="bento-slide bento-contact">
            <div class="bento-header-label">
              <span>CONTATO</span>
            </div>
            <div class="bento-contact-body">
              <div class="bento-contact-centered">
                <a href="mailto:allves.matteus@hotmail.com?subject=Contato%20via%20Portf%C3%B3lio" class="bento-contact-item" title="Enviar E-mail para allves.matteus@hotmail.com">
                  <div class="bento-contact-icon-wrap bento-mail-gradient">
                    <img src="assets/icons/sf-symbols/white/envelope.fill.png" alt="E-mail" class="bento-mail-symbol" />
                  </div>
                  <span class="bento-contact-name">E-mail</span>
                </a>
                <a href="https://www.linkedin.com/in/allves-matteus/" target="_blank" rel="noopener noreferrer" class="bento-contact-item" title="LinkedIn">
                  <div class="bento-contact-icon-wrap">
                    <img src="assets/icons/dock/linkedIn.png" alt="LinkedIn" class="bento-contact-large-img" />
                  </div>
                  <span class="bento-contact-name">LinkedIn</span>
                </a>
                <a href="https://github.com/AllvesMatteus" target="_blank" rel="noopener noreferrer" class="bento-contact-item" title="GitHub">
                  <div class="bento-contact-icon-wrap">
                    <img src="assets/icons/dock/github-desktop.png" alt="GitHub" class="bento-contact-large-img" />
                  </div>
                  <span class="bento-contact-name">GitHub</span>
                </a>
                <a href="https://wa.me/5511948642383?text=Ol%C3%A1%20Mateus!%20Vim%20pelo%20seu%20Portf%C3%B3lio%20e%20gostaria%20de%20conversar." target="_blank" rel="noopener noreferrer" class="bento-contact-item" title="WhatsApp">
                  <div class="bento-contact-icon-wrap">
                    <img src="assets/icons/dock/WhatsApp.png" alt="WhatsApp" class="bento-contact-large-img" />
                  </div>
                  <span class="bento-contact-name">WhatsApp</span>
                </a>
              </div>
            </div>
          </div>
        `
      },
      {
        id: 'tips',
        label: '5 de 5',
        title: 'Dicas',
        content: `
          <div class="bento-slide bento-tips">
            <div class="bento-header-label">
              <span>COMO EXPLORAR</span>
              <span class="bento-counter">Atalhos do Sistema</span>
            </div>
            <div class="bento-tips-inset-card">
              <div class="bento-tip-row" id="tip-open-safari">
                <img src="assets/icons/dock/safari.png" alt="Safari" class="bento-tip-icon" />
                <div class="bento-tip-text"><strong>Safari</strong> · Ver portfólio web tradicional</div>
                <span class="bento-tip-arrow">›</span>
              </div>
              <div class="bento-tip-row" id="tip-open-terminal">
                <img src="assets/icons/dock/terminal.png" alt="Terminal" class="bento-tip-icon" />
                <div class="bento-tip-text"><strong>Terminal</strong> · Digite <code>man</code> ou <code>sudo -i</code></div>
                <span class="bento-tip-arrow">›</span>
              </div>
              <div class="bento-tip-row" id="tip-open-finder">
                <img src="assets/icons/dock/finder.png" alt="Finder" class="bento-tip-icon" />
                <div class="bento-tip-text"><strong>Finder</strong> · Arquivos e Currículo na Mesa</div>
                <span class="bento-tip-arrow">›</span>
              </div>
            </div>
          </div>
        `
      }
    ];

    card.innerHTML = `
      <div class="carousel-track-wrapper">
        <div class="carousel-track" id="portfolio-carousel-track">
          ${slides.map((s, idx) => `
            <div class="carousel-slide" role="group" aria-roledescription="slide" aria-label="${s.label}" data-slide="${idx}">
              ${s.content}
            </div>
          `).join('')}
        </div>
      </div>
      
      <button class="carousel-control carousel-prev" aria-label="Slide anterior" id="btn-carousel-prev">
        <svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 18 9 12 15 6"></polyline></svg>
      </button>
      <button class="carousel-control carousel-next" aria-label="Próximo slide" id="btn-carousel-next">
        <svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg>
      </button>

      <div class="carousel-dots" role="tablist" aria-label="Seletor de slides">
        ${slides.map((s, idx) => `
          <button class="carousel-dot ${idx === 0 ? 'is-active' : ''}" role="tab" aria-selected="${idx === 0 ? 'true' : 'false'}" aria-label="Ir para ${s.title}" data-index="${idx}"></button>
        `).join('')}
      </div>
    `;

    this.container.appendChild(card);
    this._initPortfolioCarousel(card);
  }

  _initPortfolioCarousel(card) {
    const track = card.querySelector('#portfolio-carousel-track');
    const dots = card.querySelectorAll('.carousel-dot');
    const prevBtn = card.querySelector('#btn-carousel-prev');
    const nextBtn = card.querySelector('#btn-carousel-next');
    const totalSlides = 5;
    let currentIndex = 0;
    let autoRotateTimer = null;

    const goToSlide = (idx) => {
      currentIndex = (idx + totalSlides) % totalSlides;
      if (track) {
        track.style.transform = `translateX(-${currentIndex * 100}%)`;
      }
      dots.forEach((dot, i) => {
        const isActive = i === currentIndex;
        dot.classList.toggle('is-active', isActive);
        dot.setAttribute('aria-selected', isActive ? 'true' : 'false');
      });
    };

    if (prevBtn) prevBtn.onclick = (e) => { e.stopPropagation(); goToSlide(currentIndex - 1); };
    if (nextBtn) nextBtn.onclick = (e) => { e.stopPropagation(); goToSlide(currentIndex + 1); };

    dots.forEach((dot, i) => {
      dot.onclick = (e) => {
        e.stopPropagation();
        goToSlide(i);
      };
    });

    const startAutoRotate = () => {
      stopAutoRotate();
      autoRotateTimer = setInterval(() => {
        goToSlide(currentIndex + 1);
      }, 7000);
    };

    const stopAutoRotate = () => {
      if (autoRotateTimer) {
        clearInterval(autoRotateTimer);
        autoRotateTimer = null;
      }
    };

    card.addEventListener('mouseenter', stopAutoRotate);
    card.addEventListener('mouseleave', startAutoRotate);
    startAutoRotate();

    let touchStartX = 0;
    card.addEventListener('touchstart', (e) => {
      touchStartX = e.touches[0].clientX;
    }, { passive: true });

    card.addEventListener('touchend', (e) => {
      const touchEndX = e.changedTouches[0].clientX;
      const diffX = touchEndX - touchStartX;
      if (Math.abs(diffX) > 35) {
        if (diffX > 0) goToSlide(currentIndex - 1);
        else goToSlide(currentIndex + 1);
      }
    }, { passive: true });

    let wheelDebounce = false;
    card.addEventListener('wheel', (e) => {
      if (wheelDebounce) return;
      if (Math.abs(e.deltaX) > 20 || Math.abs(e.deltaY) > 40) {
        wheelDebounce = true;
        if (e.deltaX > 0 || e.deltaY > 0) goToSlide(currentIndex + 1);
        else goToSlide(currentIndex - 1);
        setTimeout(() => { wheelDebounce = false; }, 350);
      }
    }, { passive: true });

    const btnSafari = card.querySelector('#btn-portfolio-safari');
    if (btnSafari) {
      btnSafari.onclick = (e) => {
        e.stopPropagation();
        this._showPortfolioOpenDialog();
      };
    }

    const tipSafari = card.querySelector('#tip-open-safari');
    if (tipSafari) {
      tipSafari.onclick = (e) => {
        e.stopPropagation();
        this._showPortfolioOpenDialog();
      };
    }

    const tipTerminal = card.querySelector('#tip-open-terminal');
    if (tipTerminal) {
      tipTerminal.onclick = (e) => {
        e.stopPropagation();
        if (this.wm) this.wm.openApp('terminal', 'Terminal');
      };
    }

    const tipFinder = card.querySelector('#tip-open-finder');
    if (tipFinder) {
      tipFinder.onclick = (e) => {
        e.stopPropagation();
        if (this.wm) this.wm.openApp('finder', 'Finder');
      };
    }
  }

  _showPortfolioOpenDialog() {
    const existing = document.getElementById('portfolio-choice-modal');
    if (existing) existing.remove();

    const overlay = document.createElement('div');
    overlay.id = 'portfolio-choice-modal';
    overlay.className = 'macos-alert-overlay';
    overlay.setAttribute('role', 'dialog');
    overlay.setAttribute('aria-modal', 'true');

    overlay.innerHTML = `
      <div class="macos-alert-dialog" role="document">
        <div class="macos-alert-icon-wrap">
          <img src="assets/icons/dock/safari.png" alt="Safari" class="macos-alert-icon" />
        </div>
        <h3 class="macos-alert-title">Abrir Portfólio Web</h3>
        <p class="macos-alert-desc">Como você deseja visualizar o portfólio de Mateus Alves?</p>
        <div class="macos-alert-actions">
          <button class="macos-alert-btn macos-alert-btn-primary" id="btn-choice-safari">
            Abrir no Safari
          </button>
          <button class="macos-alert-btn macos-alert-btn-secondary" id="btn-choice-newtab">
            Abrir em Nova Aba
          </button>
          <button class="macos-alert-btn macos-alert-btn-cancel" id="btn-choice-cancel">
            Cancelar
          </button>
        </div>
      </div>
    `;

    document.body.appendChild(overlay);

    requestAnimationFrame(() => {
      overlay.classList.add('is-visible');
    });

    const closeModal = () => {
      overlay.classList.remove('is-visible');
      setTimeout(() => {
        if (overlay.parentNode) overlay.parentNode.removeChild(overlay);
      }, 200);
      document.removeEventListener('keydown', handleKey);
    };

    const handleKey = (e) => {
      if (e.key === 'Escape') closeModal();
    };
    document.addEventListener('keydown', handleKey);

    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) closeModal();
    });

    const btnChoiceSafari = overlay.querySelector('#btn-choice-safari');
    if (btnChoiceSafari) {
      btnChoiceSafari.onclick = (e) => {
        e.stopPropagation();
        closeModal();
        if (this.wm) {
          const isSafariOpen = this.wm.openApps && this.wm.openApps.includes('safari');
          this.wm.openApp('safari', 'Safari');
          setTimeout(() => {
            window.dispatchEvent(new CustomEvent('portfolio:open', { detail: { section: 'all', showAll: true } }));
          }, isSafariOpen ? 60 : 250);
        }
      };
    }

    const btnChoiceNewTab = overlay.querySelector('#btn-choice-newtab');
    if (btnChoiceNewTab) {
      btnChoiceNewTab.onclick = (e) => {
        e.stopPropagation();
        closeModal();
        window.open('assets/portfolio.html', '_blank', 'noopener,noreferrer');
      };
    }

    const btnChoiceCancel = overlay.querySelector('#btn-choice-cancel');
    if (btnChoiceCancel) {
      btnChoiceCancel.onclick = (e) => {
        e.stopPropagation();
        closeModal();
      };
    }
  }
}
