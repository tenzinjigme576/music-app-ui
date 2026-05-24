// Screen nav, tabs, mini player, track skip

(function () {
  'use strict';

  const screens = document.querySelectorAll('.screen');
  const tabs    = document.querySelectorAll('.tab');
  const tabBar  = document.getElementById('tabs');

  let currentScreen = 'home';
  let previousScreen = 'home';
  let isPlaying = true;
  let progressInterval = null;
  let progress = 38; // percent

  /* ── Navigate to a screen ─────────────────────────── */
  function goTo(name) {
    if (name === currentScreen) return;

    const prev = document.querySelector(`.screen[data-screen="${currentScreen}"]`);
    const next = document.querySelector(`.screen[data-screen="${name}"]`);

    previousScreen = currentScreen;
    currentScreen  = name;

    if (prev) {
      prev.classList.remove('active');
      prev.classList.add('slide-out');
      setTimeout(() => prev.classList.remove('slide-out'), 320);
    }
    if (next) {
      next.classList.add('active', 'slide-in');
      setTimeout(() => next.classList.remove('slide-in'), 320);
    }

    // Hide / show tab bar on player screen
    if (name === 'player') {
      tabBar.classList.add('hidden');
    } else {
      tabBar.classList.remove('hidden');
      updateTabs(name);
    }
  }

  /* ── Sync active tab indicator ────────────────────── */
  function updateTabs(name) {
    tabs.forEach(t => t.classList.toggle('active', t.dataset.tab === name));
  }

  /* ── Tab bar clicks ───────────────────────────────── */
  tabs.forEach(tab => {
    tab.addEventListener('click', () => goTo(tab.dataset.tab));
  });

  /* ── data-go attribute clicks (cards, mini-player…) ─ */
  document.addEventListener('click', e => {
    const el = e.target.closest('[data-go]');
    if (!el) return;
    const dest = el.dataset.go;
    if (dest === 'home' && currentScreen === 'player') {
      goTo(previousScreen === 'player' ? 'home' : previousScreen);
    } else {
      goTo(dest);
    }
  });

  /* ── Genre pills toggle ───────────────────────────── */
  const pills = document.querySelectorAll('.pill');
  pills.forEach(p => {
    p.addEventListener('click', () => {
      pills.forEach(x => x.classList.remove('active'));
      p.classList.add('active');
    });
  });

  /* ── Heart toggle ─────────────────────────────────── */
  const heart = document.querySelector('.heart');
  if (heart) {
    heart.addEventListener('click', () => heart.classList.toggle('liked'));
  }

  /* ── Play / pause (main button) ───────────────────── */
  const playMain = document.querySelector('.play-main');
  if (playMain) {
    playMain.addEventListener('click', togglePlay);
  }

  /* Mini player pause icon reacts to state too */
  const miniCtrl = document.querySelector('.mini-ctrl');
  if (miniCtrl) {
    miniCtrl.addEventListener('click', e => {
      e.stopPropagation();
      togglePlay();
    });
  }

  function togglePlay() {
    isPlaying = !isPlaying;
    if (playMain) playMain.setAttribute('aria-label', isPlaying ? 'Pause' : 'Play');
    if (playMain) playMain.textContent = isPlaying ? '⏸' : '▶';
    if (miniCtrl) miniCtrl.textContent = isPlaying ? '⏸' : '▶';

    if (isPlaying) {
      startProgress();
    } else {
      clearInterval(progressInterval);
    }
  }

  /* ── Progress bar animation ───────────────────────── */
  const fill     = document.querySelector('.progress-fill');
  const miniProg = document.querySelector('.mini-progress');
  const elapsed  = document.querySelector('.progress-times span:first-child');

  function startProgress() {
    clearInterval(progressInterval);
    progressInterval = setInterval(() => {
      progress += 0.05; // very slow increment — feels realistic
      if (progress >= 100) { progress = 0; }
      setProgress(progress);
    }, 50);
  }

  function setProgress(pct) {
    if (fill)     fill.style.width     = pct + '%';
    if (miniProg) miniProg.style.width = pct + '%';
    if (elapsed)  elapsed.textContent  = pctToTime(pct, 425); // 7:05 total
  }

  function pctToTime(pct, totalSec) {
    const s = Math.floor((pct / 100) * totalSec);
    return `${Math.floor(s/60)}:${String(s%60).padStart(2,'0')}`;
  }

  // Kick off
  startProgress();

  /* ── Progress bar scrubbing ───────────────────────── */
  const progressTrack = document.querySelector('.progress-track');
  if (progressTrack) {
    progressTrack.addEventListener('click', e => {
      const rect = progressTrack.getBoundingClientRect();
      progress = ((e.clientX - rect.left) / rect.width) * 100;
      setProgress(progress);
    });
  }

  /* ── Search field focus highlight ────────────────── */
  const searchField = document.querySelector('.search-field');
  if (searchField) {
    searchField.addEventListener('click', () => {
      searchField.style.borderColor = 'var(--purple)';
      searchField.style.boxShadow   = '0 0 0 3px rgba(139,92,246,.2)';
      // Fake cursor blink in placeholder
      const ph = searchField.querySelector('.search-ph');
      if (ph && ph.textContent.endsWith('?')) {
        ph.textContent = '|';
        setInterval(() => {
          ph.style.opacity = ph.style.opacity === '0' ? '1' : '0';
        }, 500);
      }
    });
  }

  /* ── Tag hover ripple ─────────────────────────────── */
  document.querySelectorAll('.tag').forEach(tag => {
    tag.addEventListener('click', () => {
      tag.style.borderColor = 'var(--cyan)';
      tag.style.color = 'var(--cyan)';
    });
  });

  /* ── Menu item chevron ────────────────────────────── */
  document.querySelectorAll('.menu-item').forEach(item => {
    if (!item.querySelector('.chevron')) {
      const ch = document.createElement('span');
      ch.style.cssText = 'margin-left:auto;opacity:.4;font-size:16px;';
      ch.textContent = '›';
      item.appendChild(ch);
    }
  });

  /* ── Next / Prev buttons ──────────────────────────── */
  const nextBtn = document.querySelector('[aria-label="Next"]');
  const prevBtn = document.querySelector('[aria-label="Previous"]');

  const tracks = [
    { title: 'Lofi Sunset',     artist: 'Chill Beats',  img: 'https://images.unsplash.com/photo-1518609878373-06d740f60d8b?q=80&w=500' },
    { title: 'Midnight Horizon',artist: 'Neon Drives',   img: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=500' },
    { title: 'Cosmic Wind',     artist: 'Deep Space',    img: 'https://images.unsplash.com/photo-1557683316-973673baf926?q=80&w=500' },
  ];
  let trackIdx = 0;

  function loadTrack(idx) {
    const t = tracks[idx];
    const albumArt  = document.querySelector('.album-art');
    const albumGlow = document.querySelector('.album-glow');
    const titleEl   = document.querySelector('.player-meta h2');
    const artistEl  = document.querySelector('.player-artist');

    if (albumArt)  { albumArt.style.opacity = '0'; setTimeout(() => { albumArt.src = t.img; albumArt.style.opacity = '1'; }, 200); }
    if (albumGlow) albumGlow.style.backgroundImage = `url('${t.img}')`;
    if (titleEl)   titleEl.textContent  = t.title;
    if (artistEl)  artistEl.textContent = t.artist;
    progress = 0;
    setProgress(0);
  }

  if (nextBtn) nextBtn.addEventListener('click', () => { trackIdx = (trackIdx + 1) % tracks.length; loadTrack(trackIdx); });
  if (prevBtn) prevBtn.addEventListener('click', () => { trackIdx = (trackIdx - 1 + tracks.length) % tracks.length; loadTrack(trackIdx); });

  /* ── Shuffle / Repeat glow toggle ────────────────── */
  const shuffleBtn = document.querySelector('[aria-label="Shuffle"]');
  const repeatBtn  = document.querySelector('[aria-label="Repeat"]');
  [shuffleBtn, repeatBtn].forEach(btn => {
    if (!btn) return;
    btn.addEventListener('click', () => {
      const on = btn.style.color === 'rgb(139, 92, 246)';
      btn.style.color     = on ? '' : 'var(--purple)';
      btn.style.textShadow = on ? '' : '0 0 16px rgba(139,92,246,.7)';
    });
  });

  console.log('🎧 Aether prototype loaded');
})();
