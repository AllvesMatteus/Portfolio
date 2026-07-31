/**
 * Music App — Apple Music-inspired player
 */
import { WindowManager } from '../windowManager.js';

const TRACKS = [
  { id: 1, title: 'Blinding Lights', artist: 'The Weeknd', album: 'After Hours', duration: '3:20', year: 2019, color: '#8B2FC9' },
  { id: 2, title: 'As It Was', artist: 'Harry Styles', album: "Harry's House", duration: '2:37', year: 2022, color: '#E44F5A' },
  { id: 3, title: 'Stay', artist: 'The Kid LAROI & Justin Bieber', album: 'F*CK LOVE', duration: '2:21', year: 2021, color: '#1DB954' },
  { id: 4, title: 'Levitating', artist: 'Dua Lipa', album: 'Future Nostalgia', duration: '3:23', year: 2020, color: '#0A84FF' },
  { id: 5, title: 'Anti-Hero', artist: 'Taylor Swift', album: 'Midnights', duration: '3:20', year: 2022, color: '#B07CE6' },
  { id: 6, title: 'Flowers', artist: 'Miley Cyrus', album: 'Endless Summer Vacation', duration: '3:20', year: 2023, color: '#FF9F0A' },
  { id: 7, title: 'Calm Down', artist: 'Rema & Selena Gomez', album: 'Rave & Roses', duration: '3:59', year: 2022, color: '#34C759' },
  { id: 8, title: 'Bad Habit', artist: 'Steve Lacy', album: 'Gemini Rights', duration: '3:52', year: 2022, color: '#FF375F' },
];

export function renderMusic(contentEl, wm) {
  contentEl.innerHTML = '';
  const titlebar = WindowManager.buildTitleBar('music', 'Music', wm, { showTitle: false });
  contentEl.appendChild(titlebar);

  let currentTrack = TRACKS[0];
  let isPlaying = false;
  let progress = 0;
  let progressInterval = null;
  let volume = 70;

  const wrapper = document.createElement('div');
  wrapper.className = 'music-window';
  wrapper.style.cssText = 'display:flex;height:calc(100% - 40px);overflow:hidden;background:rgba(18,18,20,0.98);';

  // Sidebar
  const sidebar = document.createElement('div');
  sidebar.style.cssText = 'width:180px;min-width:160px;border-right:1px solid rgba(255,255,255,0.08);padding:16px 0;flex-shrink:0;background:rgba(22,22,24,0.98);overflow-y:auto;';
  sidebar.innerHTML = `
    <div style="padding:0 16px 8px;font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:1px;opacity:0.4;">Library</div>
    ${['Listen Now','Browse','Radio','Music Videos','Recently Added'].map((s, i) => `
      <div class="music-sidebar-item" style="display:flex;align-items:center;gap:10px;padding:7px 16px;cursor:pointer;border-radius:0;${i===0?'background:rgba(255,55,95,0.15);color:#ff375f;':''}" data-section="${s}">
        <span style="font-size:13px;">${s}</span>
      </div>
    `).join('')}
    <div style="padding:16px 16px 8px;font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:1px;opacity:0.4;">Playlists</div>
    ${['Favorites Mix','Chill Vibes','Workout Beats'].map(p => `
      <div style="display:flex;align-items:center;gap:10px;padding:7px 16px;cursor:pointer;font-size:13px;opacity:0.7;">${p}</div>
    `).join('')}
  `;

  // Main content
  const main = document.createElement('div');
  main.style.cssText = 'flex:1;display:flex;flex-direction:column;overflow:hidden;';

  // Now playing bar (top)
  const nowPlaying = document.createElement('div');
  nowPlaying.id = 'music-nowplaying';
  nowPlaying.style.cssText = 'flex-shrink:0;';

  // Track list
  const trackList = document.createElement('div');
  trackList.style.cssText = 'flex:1;overflow-y:auto;padding:0 0 80px;';

  // Bottom player controls
  const player = document.createElement('div');
  player.id = 'music-player';
  player.style.cssText = 'flex-shrink:0;border-top:1px solid rgba(255,255,255,0.08);';

  function durationToSec(d) {
    const p = d.split(':');
    return parseInt(p[0]) * 60 + parseInt(p[1]);
  }

  function secToStr(s) {
    const m = Math.floor(s / 60);
    const sec = Math.floor(s % 60);
    return `${m}:${String(sec).padStart(2,'0')}`;
  }

  function renderNowPlaying() {
    nowPlaying.innerHTML = `
      <div style="display:flex;align-items:center;gap:16px;padding:16px 20px;background:linear-gradient(135deg,${currentTrack.color}22,${currentTrack.color}11);border-bottom:1px solid rgba(255,255,255,0.06);">
        <div style="width:56px;height:56px;border-radius:8px;background:linear-gradient(135deg,${currentTrack.color},${currentTrack.color}aa);flex-shrink:0;display:flex;align-items:center;justify-content:center;font-size:24px;">🎵</div>
        <div style="flex:1;min-width:0;">
          <div style="font-size:15px;font-weight:600;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">${currentTrack.title}</div>
          <div style="font-size:13px;opacity:0.6;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">${currentTrack.artist}</div>
        </div>
      </div>
    `;
  }

  function renderTrackList() {
    trackList.innerHTML = `
      <div style="padding:12px 20px;font-size:13px;font-weight:700;opacity:0.4;border-bottom:1px solid rgba(255,255,255,0.06);">
        TOP TRACKS
      </div>
    `;
    TRACKS.forEach((track, idx) => {
      const row = document.createElement('div');
      row.style.cssText = `display:flex;align-items:center;gap:12px;padding:10px 20px;cursor:pointer;transition:background 0.12s;${track.id===currentTrack.id?'background:rgba(255,55,95,0.1);':''}`;
      row.innerHTML = `
        <div style="width:36px;height:36px;border-radius:6px;background:linear-gradient(135deg,${track.color},${track.color}88);display:flex;align-items:center;justify-content:center;flex-shrink:0;font-size:16px;">${track.id===currentTrack.id && isPlaying?'♫':'🎵'}</div>
        <div style="flex:1;min-width:0;">
          <div style="font-size:13px;font-weight:${track.id===currentTrack.id?'700':'500'};color:${track.id===currentTrack.id?'#ff375f':'inherit'};white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">${track.title}</div>
          <div style="font-size:12px;opacity:0.5;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">${track.artist} · ${track.album}</div>
        </div>
        <span style="font-size:12px;opacity:0.4;flex-shrink:0;">${track.duration}</span>
      `;
      row.addEventListener('mouseenter', () => { if (track.id!==currentTrack.id) row.style.background='rgba(255,255,255,0.05)'; });
      row.addEventListener('mouseleave', () => { if (track.id!==currentTrack.id) row.style.background=''; });
      row.addEventListener('dblclick', () => {
        currentTrack = track;
        progress = 0;
        isPlaying = true;
        startProgress();
        rerender();
      });
      row.addEventListener('click', () => {
        currentTrack = track;
        progress = 0;
        rerender();
      });
      trackList.appendChild(row);
    });
  }

  function renderPlayer() {
    const total = durationToSec(currentTrack.duration);
    const elapsed = Math.floor(progress * total / 100);
    player.innerHTML = `
      <div style="padding:14px 20px;">
        <div style="display:flex;align-items:center;gap:16px;margin-bottom:12px;">
          <div style="width:44px;height:44px;border-radius:7px;background:linear-gradient(135deg,${currentTrack.color},${currentTrack.color}88);display:flex;align-items:center;justify-content:center;font-size:20px;flex-shrink:0;">🎵</div>
          <div style="flex:1;min-width:0;">
            <div style="font-size:13px;font-weight:600;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">${currentTrack.title}</div>
            <div style="font-size:12px;opacity:0.5;">${currentTrack.artist}</div>
          </div>
          <div style="display:flex;gap:16px;align-items:center;">
            <button id="music-prev" style="background:none;border:none;color:rgba(255,255,255,0.7);cursor:pointer;font-size:20px;padding:4px;" title="Previous">⏮</button>
            <button id="music-play" style="background:rgba(255,55,95,0.85);border:none;color:#fff;cursor:pointer;font-size:18px;width:36px;height:36px;border-radius:50%;display:flex;align-items:center;justify-content:center;" title="${isPlaying?'Pause':'Play'}">${isPlaying?'⏸':'▶'}</button>
            <button id="music-next" style="background:none;border:none;color:rgba(255,255,255,0.7);cursor:pointer;font-size:20px;padding:4px;" title="Next">⏭</button>
          </div>
        </div>
        <div style="display:flex;align-items:center;gap:10px;">
          <span style="font-size:11px;opacity:0.4;min-width:32px;">${secToStr(elapsed)}</span>
          <div id="music-progress-bar" style="flex:1;height:4px;background:rgba(255,255,255,0.15);border-radius:2px;cursor:pointer;position:relative;">
            <div id="music-progress-fill" style="width:${progress}%;height:100%;background:#ff375f;border-radius:2px;transition:width 0.3s;position:relative;">
              <div style="position:absolute;right:-4px;top:-3px;width:10px;height:10px;background:#fff;border-radius:50%;box-shadow:0 0 4px rgba(0,0,0,0.3);"></div>
            </div>
          </div>
          <span style="font-size:11px;opacity:0.4;min-width:32px;text-align:right;">${currentTrack.duration}</span>
        </div>
      </div>
    `;

    // Bind controls
    player.querySelector('#music-play')?.addEventListener('click', () => {
      isPlaying = !isPlaying;
      if (isPlaying) startProgress(); else stopProgress();
      rerender();
    });
    player.querySelector('#music-prev')?.addEventListener('click', () => {
      const idx = TRACKS.findIndex(t => t.id === currentTrack.id);
      currentTrack = TRACKS[(idx - 1 + TRACKS.length) % TRACKS.length];
      progress = 0;
      rerender();
    });
    player.querySelector('#music-next')?.addEventListener('click', () => {
      const idx = TRACKS.findIndex(t => t.id === currentTrack.id);
      currentTrack = TRACKS[(idx + 1) % TRACKS.length];
      progress = 0;
      rerender();
    });
    player.querySelector('#music-progress-bar')?.addEventListener('click', (e) => {
      const rect = e.currentTarget.getBoundingClientRect();
      progress = Math.max(0, Math.min(100, (e.clientX - rect.left) / rect.width * 100));
      rerender();
    });
  }

  function startProgress() {
    stopProgress();
    const total = durationToSec(currentTrack.duration) * 1000;
    const step = 100 / (total / 1000);
    progressInterval = setInterval(() => {
      progress = Math.min(100, progress + step);
      if (progress >= 100) {
        // Auto-advance
        const idx = TRACKS.findIndex(t => t.id === currentTrack.id);
        currentTrack = TRACKS[(idx + 1) % TRACKS.length];
        progress = 0;
      }
      // Update just the progress fill without full rerender
      const fill = document.getElementById('music-progress-fill');
      if (fill) fill.style.width = `${progress}%`;
    }, 1000);
  }

  function stopProgress() {
    if (progressInterval) { clearInterval(progressInterval); progressInterval = null; }
  }

  function rerender() {
    renderNowPlaying();
    renderTrackList();
    renderPlayer();
  }

  main.appendChild(nowPlaying);
  main.appendChild(trackList);
  main.appendChild(player);
  wrapper.appendChild(sidebar);
  wrapper.appendChild(main);
  contentEl.appendChild(wrapper);

  rerender();
}
