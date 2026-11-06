// ==========================================================================
// app.js - Główna Logika Biznesowa NoSmoking "Czysty Oddech"
// Obsługa dwóch niezależnych trybów: 🚬 Papierosy & 💨 E-papierosy (Vaping)
// ==========================================================================

(function () {
  'use strict';

  // 1. STAN APLIKACJI I LOCALSTORAGE
  const STORAGE_KEY = 'NoSmoking_PureBreath_v2';

  let state = {
    activeCategory: 'cigarettes', // 'cigarettes' | 'vape'
    categories: {
      cigarettes: {
        quitDate: APP_DATA.cigarettes.defaultSettings.quitDate,
        cigsPerDay: APP_DATA.cigarettes.defaultSettings.cigsPerDay,
        packPrice: APP_DATA.cigarettes.defaultSettings.packPrice,
        yearsSmoked: APP_DATA.cigarettes.defaultSettings.yearsSmoked,
        currency: "zł"
      },
      vape: {
        quitDate: APP_DATA.vape.defaultSettings.quitDate,
        bottlePrice10ml: APP_DATA.vape.defaultSettings.bottlePrice10ml,
        mlPerDay: APP_DATA.vape.defaultSettings.mlPerDay,
        nicotineStrengthMg: APP_DATA.vape.defaultSettings.nicotineStrengthMg,
        puffsPerDay: APP_DATA.vape.defaultSettings.puffsPerDay,
        yearsVaped: APP_DATA.vape.defaultSettings.yearsVaped,
        currency: "zł"
      }
    },
    unlockedBadges: [],
    goals: [...APP_DATA.shared.defaultGoals],
    cravingsLog: [
      {
        id: "craving_init",
        timestamp: new Date().toISOString(),
        trigger: "☕ Poranna lub popołudniowa kawa",
        intensity: "3",
        note: "Zamiast zaciągnięcia wypiłem szklankę wody z cytryną i wziąłem 10 głębokich oddechów. Pokusa minęła!",
        status: "surfed"
      }
    ],
    cravingsSurfed: 1,
    soundEnabled: true,
    bubblesPopped: 0
  };

  // Ładowanie stanu z LocalStorage (z migracją ze starszej wersji v1)
  function loadState() {
    try {
      // Sprawdź czy jest stan v2
      let saved = localStorage.getItem(STORAGE_KEY);
      if (!saved) {
        // Spróbuj załadować ze starej wersji v1
        const legacy = localStorage.getItem('NoSmoking_PureBreath_v1');
        if (legacy) {
          const parsedLegacy = JSON.parse(legacy);
          if (parsedLegacy.settings) {
            state.categories.cigarettes.quitDate = parsedLegacy.settings.quitDate || state.categories.cigarettes.quitDate;
            state.categories.cigarettes.cigsPerDay = parsedLegacy.settings.cigsPerDay || state.categories.cigarettes.cigsPerDay;
            state.categories.cigarettes.packPrice = parsedLegacy.settings.packPrice || state.categories.cigarettes.packPrice;
            state.categories.cigarettes.yearsSmoked = parsedLegacy.settings.yearsSmoked || state.categories.cigarettes.yearsSmoked;
          }
          if (Array.isArray(parsedLegacy.unlockedBadges)) state.unlockedBadges = parsedLegacy.unlockedBadges;
          if (Array.isArray(parsedLegacy.goals) && parsedLegacy.goals.length > 0) state.goals = parsedLegacy.goals;
          if (Array.isArray(parsedLegacy.cravingsLog)) state.cravingsLog = parsedLegacy.cravingsLog;
          state.cravingsSurfed = parsedLegacy.cravingsSurfed || 1;
          state.bubblesPopped = parsedLegacy.bubblesPopped || 0;
          saveState();
          return;
        }
      }

      if (saved) {
        const parsed = JSON.parse(saved);
        state = {
          ...state,
          ...parsed,
          categories: {
            cigarettes: { ...state.categories.cigarettes, ...(parsed.categories?.cigarettes || {}) },
            vape: { ...state.categories.vape, ...(parsed.categories?.vape || {}) }
          }
        };

        if (!Array.isArray(state.unlockedBadges)) state.unlockedBadges = [];
        if (!Array.isArray(state.goals) || state.goals.length === 0) state.goals = [...APP_DATA.shared.defaultGoals];
        if (!Array.isArray(state.cravingsLog)) state.cravingsLog = [];
      }
    } catch (e) {
      console.warn('Nie udało się załadować stanu z localStorage:', e);
    }
  }

  function saveState() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch (e) {
      console.error('Błąd zapisu do localStorage:', e);
    }
  }

  // 2. SYNTEZA DŹWIĘKÓW (WEB AUDIO API - ZERO ZEWNĘTRZNYCH PLIKÓW)
  let audioCtx = null;

  function initAudio() {
    if (!audioCtx && (window.AudioContext || window.webkitAudioContext)) {
      const AudioContextClass = window.AudioContext || window.webkitAudioContext;
      audioCtx = new AudioContextClass();
    }
    if (audioCtx && audioCtx.state === 'suspended') {
      audioCtx.resume();
    }
  }

  function playBubblePopSound() {
    if (!state.soundEnabled) return;
    try {
      initAudio();
      if (!audioCtx) return;
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      const now = audioCtx.currentTime;

      osc.type = 'sine';
      osc.frequency.setValueAtTime(450, now);
      osc.frequency.exponentialRampToValueAtTime(120, now + 0.08);

      gain.gain.setValueAtTime(0.3, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);

      osc.connect(gain);
      gain.connect(audioCtx.destination);

      osc.start(now);
      osc.stop(now + 0.08);
    } catch (e) {}
  }

  function playZenBellSound(freq = 528) {
    if (!state.soundEnabled) return;
    try {
      initAudio();
      if (!audioCtx) return;
      const now = audioCtx.currentTime;
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now);

      gain.gain.setValueAtTime(0.25, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 2.5);

      osc.connect(gain);
      gain.connect(audioCtx.destination);

      osc.start(now);
      osc.stop(now + 2.5);
    } catch (e) {}
  }

  function playTriumphSound() {
    if (!state.soundEnabled) return;
    try {
      initAudio();
      if (!audioCtx) return;
      const now = audioCtx.currentTime;
      const notes = [523.25, 659.25, 783.99, 1046.50];
      notes.forEach((freq, index) => {
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        const start = now + index * 0.12;

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, start);

        gain.gain.setValueAtTime(0.2, start);
        gain.gain.exponentialRampToValueAtTime(0.001, start + 0.5);

        osc.connect(gain);
        gain.connect(audioCtx.destination);

        osc.start(start);
        osc.stop(start + 0.55);
      });
    } catch (e) {}
  }

  // 3. SILNIK CZĄSTECZKOWY KONFETTI
  const confettiCanvas = document.getElementById('confetti-canvas');
  let confettiCtx = confettiCanvas ? confettiCanvas.getContext('2d') : null;
  let confettiParticles = [];
  let confettiAnimationId = null;

  function resizeConfetti() {
    if (confettiCanvas) {
      confettiCanvas.width = window.innerWidth;
      confettiCanvas.height = window.innerHeight;
    }
  }
  window.addEventListener('resize', resizeConfetti);
  resizeConfetti();

  function triggerConfetti(durationMs = 3500) {
    if (!confettiCtx) return;
    const colors = state.activeCategory === 'vape'
      ? ['#8b5cf6', '#c084fc', '#06b6d4', '#38bdf8', '#fbbf24', '#ffffff']
      : ['#10b981', '#06b6d4', '#fbbf24', '#f43f5e', '#a855f7', '#ffffff'];
    const particleCount = 120;
    
    for (let i = 0; i < particleCount; i++) {
      confettiParticles.push({
        x: window.innerWidth / 2 + (Math.random() - 0.5) * 200,
        y: window.innerHeight / 2 + (Math.random() - 0.5) * 100,
        vx: (Math.random() - 0.5) * 14,
        vy: -Math.random() * 12 - 4,
        size: Math.random() * 8 + 4,
        color: colors[Math.floor(Math.random() * colors.length)],
        rotation: Math.random() * 360,
        rotSpeed: (Math.random() - 0.5) * 10,
        opacity: 1
      });
    }

    if (!confettiAnimationId) {
      function renderConfetti() {
        confettiCtx.clearRect(0, 0, confettiCanvas.width, confettiCanvas.height);
        
        for (let i = confettiParticles.length - 1; i >= 0; i--) {
          const p = confettiParticles[i];
          p.x += p.vx;
          p.y += p.vy;
          p.vy += 0.25;
          p.rotation += p.rotSpeed;
          p.opacity -= 0.007;

          if (p.opacity <= 0 || p.y > window.innerHeight) {
            confettiParticles.splice(i, 1);
            continue;
          }

          confettiCtx.save();
          confettiCtx.translate(p.x, p.y);
          confettiCtx.rotate((p.rotation * Math.PI) / 180);
          confettiCtx.fillStyle = p.color;
          confettiCtx.globalAlpha = Math.max(0, p.opacity);
          confettiCtx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 0.6);
          confettiCtx.restore();
        }

        if (confettiParticles.length > 0) {
          confettiAnimationId = requestAnimationFrame(renderConfetti);
        } else {
          cancelAnimationFrame(confettiAnimationId);
          confettiAnimationId = null;
          confettiCtx.clearRect(0, 0, confettiCanvas.width, confettiCanvas.height);
        }
      }
      confettiAnimationId = requestAnimationFrame(renderConfetti);
    }
  }

  // 4. SYSTEM POWIADOMIEŃ TOAST
  function showToast(message, icon = '✨') {
    const container = document.getElementById('toast-container');
    if (!container) return;
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.innerHTML = `<span style="font-size: 1.3rem;">${icon}</span> <span>${message}</span>`;
    container.appendChild(toast);
    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateY(10px)';
      toast.style.transition = 'all 0.3s ease';
      setTimeout(() => toast.remove(), 300);
    }, 4500);
  }

  // 5. GŁÓWNY ZEGAR I KALKULACJE DLA AKTYWNEJ KATEGORII
  function getActiveCategoryData() {
    return APP_DATA[state.activeCategory] || APP_DATA.cigarettes;
  }

  function getActiveSettings() {
    return state.categories[state.activeCategory] || state.categories.cigarettes;
  }

  function calculateCurrentStats() {
    const now = new Date();
    const currentSettings = getActiveSettings();
    const quitTime = new Date(currentSettings.quitDate);
    const isPreQuit = now < quitTime;
    
    let secondsElapsed = 0;
    let secondsUntilQuit = 0;

    if (isPreQuit) {
      secondsUntilQuit = Math.max(0, Math.floor((quitTime - now) / 1000));
    } else {
      secondsElapsed = Math.max(0, Math.floor((now - quitTime) / 1000));
    }

    if (state.activeCategory === 'vape') {
      // Kalkulacje dla E-papierosów / Vapingu
      const bottlePrice = parseFloat(currentSettings.bottlePrice10ml) || 18.00;
      const mlPerDay = parseFloat(currentSettings.mlPerDay) || 3.5;
      const nicStrength = parseFloat(currentSettings.nicotineStrengthMg) || 20;
      const puffsPerDay = parseInt(currentSettings.puffsPerDay, 10) || 350;

      const dailyCost = mlPerDay * (bottlePrice / 10);
      const costPerSec = dailyCost / 86400;
      const mlPerSec = mlPerDay / 86400;
      const puffsPerSec = puffsPerDay / 86400;

      const moneySaved = isPreQuit ? 0 : secondsElapsed * costPerSec;
      const mlAvoided = isPreQuit ? 0 : secondsElapsed * mlPerSec;
      const nicSavedMg = isPreQuit ? 0 : Math.round(mlAvoided * nicStrength);
      const puffsAvoided = isPreQuit ? 0 : Math.floor(secondsElapsed * puffsPerSec);

      return {
        now,
        quitTime,
        isPreQuit,
        secondsElapsed,
        secondsUntilQuit,
        dailyCost,
        moneySaved,
        mlAvoided,
        nicSavedMg,
        puffsAvoided,
        cravingsSurfed: state.cravingsSurfed || 0
      };
    } else {
      // Kalkulacje dla Papierosów Tradycyjnych
      const cigsPerDay = parseInt(currentSettings.cigsPerDay, 10) || 20;
      const packPrice = parseFloat(currentSettings.packPrice) || 19.50;

      const dailyCost = (cigsPerDay / 20) * packPrice;
      const cigsPerSec = cigsPerDay / 86400;
      const costPerSec = dailyCost / 86400;

      const cigsAvoided = isPreQuit ? 0 : Math.floor(secondsElapsed * cigsPerSec);
      const moneySaved = isPreQuit ? 0 : secondsElapsed * costPerSec;
      const lifeMinutesGained = isPreQuit ? 0 : Math.round(cigsAvoided * 11);
      const tarGramsAvoided = isPreQuit ? 0 : (cigsAvoided * 10 / 1000);

      return {
        now,
        quitTime,
        isPreQuit,
        secondsElapsed,
        secondsUntilQuit,
        dailyCost,
        cigsAvoided,
        moneySaved,
        lifeMinutesGained,
        tarGramsAvoided,
        cravingsSurfed: state.cravingsSurfed || 0
      };
    }
  }

  function formatSecondsToDHM(totalSecs) {
    const days = Math.floor(totalSecs / 86400);
    const hours = Math.floor((totalSecs % 86400) / 3600);
    const mins = Math.floor((totalSecs % 3600) / 60);
    const secs = totalSecs % 60;
    return { days, hours, mins, secs };
  }

  function formatLifeTime(minutes) {
    if (minutes < 60) return `${minutes} min`;
    const hours = Math.floor(minutes / 60);
    const remainingMins = minutes % 60;
    if (hours < 24) return `${hours}h ${remainingMins}m`;
    const days = Math.floor(hours / 24);
    const remainingHours = hours % 24;
    return `${days}d ${remainingHours}h`;
  }

  // 6. AKTUALIZACJA UI ZEGARA I STATYSTYK
  function updateTimerUI() {
    const stats = calculateCurrentStats();
    const catData = getActiveCategoryData();
    const currentSettings = getActiveSettings();

    // 1. Obsługa Banera Przedstartowego
    const banner = document.getElementById('pre-quit-banner');
    const headerStatusBadge = document.getElementById('header-status-badge');
    const headerStatusText = document.getElementById('header-status-text');
    const earlyStartBtn = document.getElementById('start-now-early-btn');
    const preQuitTitle = document.getElementById('pre-quit-title');
    const preQuitDesc = document.getElementById('pre-quit-desc');

    if (stats.isPreQuit) {
      if (banner) banner.style.display = 'flex';
      if (headerStatusBadge) headerStatusBadge.className = 'status-badge pre-quit';
      if (headerStatusText) headerStatusText.textContent = 'Przygotowanie do startu';

      if (earlyStartBtn) earlyStartBtn.textContent = `🚀 ${catData.quitActionLabel}`;
      if (preQuitTitle) preQuitTitle.textContent = '⏳ Godzina Zero zbliża się wielkimi krokami!';
      if (preQuitDesc) {
        if (state.activeCategory === 'vape') {
          preQuitDesc.innerHTML = `Twój zaplanowany start wolności od e-papierosów: <strong>19 października 2026, godz. 00:00</strong>. Schowaj pody, kable i zapasy liquidów, aby od razu przeciąć chemiczny odruch sięgania po e-papierosa.`;
        } else {
          preQuitDesc.innerHTML = `Twój zaplanowany start wolności: <strong>19 października 2026, godz. 00:00</strong>. Wykorzystaj ten czas, by wyrzucić popielniczki, zapalniczki i mentalnie przygotować się na odrodzenie Twoich płuc.`;
        }
      }

      const pqtTime = formatSecondsToDHM(stats.secondsUntilQuit);
      const hEl = document.getElementById('pqt-hours');
      const mEl = document.getElementById('pqt-mins');
      const sEl = document.getElementById('pqt-secs');
      if (hEl) hEl.textContent = String(pqtTime.days * 24 + pqtTime.hours).padStart(2, '0');
      if (mEl) mEl.textContent = String(pqtTime.mins).padStart(2, '0');
      if (sEl) sEl.textContent = String(pqtTime.secs).padStart(2, '0');

      document.getElementById('timer-days').textContent = '0';
      document.getElementById('timer-hours').textContent = '00';
      document.getElementById('timer-minutes').textContent = '00';
      document.getElementById('timer-seconds').textContent = '00';
      document.getElementById('hero-clock-subtitle').textContent = 'Czas do Godziny Zero';
    } else {
      if (banner) banner.style.display = 'none';
      if (headerStatusBadge) headerStatusBadge.className = 'status-badge';
      if (headerStatusText) headerStatusText.textContent = catData.statusText;
      
      document.getElementById('hero-clock-subtitle').textContent = state.activeCategory === 'vape'
        ? 'Czas Czystych Płuc (Bez Vapingu)'
        : 'Czas Czystego Życia (Bez Dymu)';

      const dhm = formatSecondsToDHM(stats.secondsElapsed);
      document.getElementById('timer-days').textContent = String(dhm.days);
      document.getElementById('timer-hours').textContent = String(dhm.hours).padStart(2, '0');
      document.getElementById('timer-minutes').textContent = String(dhm.mins).padStart(2, '0');
      document.getElementById('timer-seconds').textContent = String(dhm.secs).padStart(2, '0');
    }

    // 2. Data w Hero
    const heroQuitDisplay = document.getElementById('hero-quit-date-display');
    if (heroQuitDisplay) {
      const qDate = new Date(currentSettings.quitDate);
      const pad = (n) => String(n).padStart(2, '0');
      heroQuitDisplay.textContent = `Od: ${pad(qDate.getDate())}.${pad(qDate.getMonth() + 1)}.${qDate.getFullYear()}, ${pad(qDate.getHours())}:${pad(qDate.getMinutes())}`;
    }

    // 3. Statystyki Hero & KPI Dashboard
    const moneyStr = stats.moneySaved.toFixed(2) + ' zł';
    document.getElementById('hero-money-saved').textContent = moneyStr;
    document.getElementById('kpi-money').textContent = moneyStr;
    document.getElementById('kpi-daily-cost').textContent = `${stats.dailyCost.toFixed(2)} zł / dzień`;

    if (state.activeCategory === 'vape') {
      // Dostosowanie wskaźników do E-papierosów
      document.getElementById('hero-stat-2-icon').textContent = '💧';
      document.getElementById('hero-stat-2-label').textContent = 'Niewlany liquid';
      document.getElementById('hero-cigs-avoided').textContent = stats.mlAvoided.toFixed(1) + ' ml';

      document.getElementById('hero-stat-3-icon').textContent = '💨';
      document.getElementById('hero-stat-3-label').textContent = 'Odrzucone puffy';
      document.getElementById('hero-life-gained').textContent = stats.puffsAvoided + ' szt.';

      // KPI Card 2
      document.getElementById('kpi-intake-icon').textContent = '💧';
      document.getElementById('kpi-intake-icon').className = 'kpi-icon vape';
      document.getElementById('kpi-intake-badge').textContent = 'Czysty Płyn';
      document.getElementById('kpi-cigs').textContent = stats.mlAvoided.toFixed(1) + ' ml';
      document.getElementById('kpi-intake-label').textContent = 'Niewlanego liquidu do płuc';
      document.getElementById('kpi-intake-sub').innerHTML = `<span>⚡ Oszczędzono ok. <strong>${stats.nicSavedMg} mg</strong> czystej soli nikotynowej</span>`;

      // KPI Card 3
      document.getElementById('kpi-secondary-icon').textContent = '💨';
      document.getElementById('kpi-secondary-badge').textContent = 'Spokój Oddechu';
      document.getElementById('kpi-life').textContent = stats.puffsAvoided;
      document.getElementById('kpi-secondary-label').textContent = 'Niewykonanych zaciągnięć (puffów)';
      document.getElementById('kpi-secondary-sub').innerHTML = `<span>❤️ Serce odpoczywa od uderzeń nikotyny</span>`;

      // KPI Card 4
      document.getElementById('kpi-toxins-icon').textContent = '🛡️';
      document.getElementById('kpi-toxins-badge').textContent = 'Brak Toksyn';
      document.getElementById('kpi-tar').textContent = '0 ml';
      document.getElementById('kpi-toxins-label').textContent = 'Glikolu, gliceryny i podgrzanych metali w płucach';
      document.getElementById('kpi-toxins-sub').innerHTML = `<span>🌿 Brak niklu, ołowiu, akroleiny i ryzyka EVALI</span>`;
    } else {
      // Dostosowanie wskaźników do Papierosów Tradycyjnych
      document.getElementById('hero-stat-2-icon').textContent = '🚭';
      document.getElementById('hero-stat-2-label').textContent = 'Niewypalone';
      document.getElementById('hero-cigs-avoided').textContent = stats.cigsAvoided + ' szt.';

      const lifeStr = formatLifeTime(stats.lifeMinutesGained);
      document.getElementById('hero-stat-3-icon').textContent = '⏳';
      document.getElementById('hero-stat-3-label').textContent = 'Odzyskane życie';
      document.getElementById('hero-life-gained').textContent = lifeStr;

      // KPI Card 2
      document.getElementById('kpi-intake-icon').textContent = '🚭';
      document.getElementById('kpi-intake-icon').className = 'kpi-icon cigs';
      document.getElementById('kpi-intake-badge').textContent = 'Czystość';
      document.getElementById('kpi-cigs').textContent = stats.cigsAvoided;
      document.getElementById('kpi-intake-label').textContent = 'Odrzuconych papierosów';
      document.getElementById('kpi-intake-sub').innerHTML = `<span>💨 Nie wciągnięto dymu do płuc</span>`;

      // KPI Card 3
      document.getElementById('kpi-secondary-icon').textContent = '⏳';
      document.getElementById('kpi-secondary-badge').textContent = 'Długowieczność';
      document.getElementById('kpi-life').textContent = lifeStr;
      document.getElementById('kpi-secondary-label').textContent = 'Odzyskany czas życia';
      document.getElementById('kpi-secondary-sub').innerHTML = `<span>❤️ +11 minut za każdy niewypalony</span>`;

      // KPI Card 4
      document.getElementById('kpi-toxins-icon').textContent = '🫁';
      document.getElementById('kpi-toxins-badge').textContent = 'Detoks';
      document.getElementById('kpi-tar').textContent = stats.tarGramsAvoided.toFixed(1) + ' g';
      document.getElementById('kpi-toxins-label').textContent = 'Niewdychanej smoły i substancji toksycznych';
      document.getElementById('kpi-toxins-sub').innerHTML = `<span>🌿 Twoje rzęski płucne pracują!</span>`;
    }

    // 4. Sprawdzenie Odblokowania Osiągnięć (Badges)
    checkAchievements(stats);

    // 5. Aktualizacja Pasków Celów Marzeń (Wishlist)
    updateGoalsUI(stats.moneySaved);
  }

  // 7. PRZEŁĄCZANIE KATEGORII (PAPIEROSY <-> E-PAPIEROSY)
  function switchCategory(newCategory) {
    if (state.activeCategory === newCategory) return;
    state.activeCategory = newCategory;
    saveState();

    // 1. Zmiana klasy motywu na body
    document.body.className = newCategory === 'vape' ? 'theme-vape' : 'theme-cigarettes';

    // 2. Aktualizacja przycisków w switcherze
    document.querySelectorAll('.category-toggle-btn').forEach((btn) => {
      btn.classList.toggle('active', btn.getAttribute('data-category') === newCategory);
    });

    // 3. Aktualizacja ikony logo i nagłówka
    const brandLogoIcon = document.getElementById('brand-logo-icon');
    if (brandLogoIcon) {
      brandLogoIcon.textContent = newCategory === 'vape' ? '💨' : '🫁';
    }

    // 4. Dźwięk potwierdzenia
    playBubblePopSound();

    // 5. Odświeżenie widoków
    updateTimerUI();
    renderHealthMilestones();
    renderMyths();
    renderAchievements();

    const catName = newCategory === 'vape' ? 'E-papierosy (Vaping)' : 'Papierosy Tradycyjne';
    showToast(`Przełączono tryb na: ${catName}`, newCategory === 'vape' ? '💨' : '🚬');
  }

  // 8. SPRAWDZANIE I ODBLOKOWYWANIE ODZNAK
  function checkAchievements(stats) {
    let newlyUnlocked = false;

    APP_DATA.shared.achievements.forEach((ach) => {
      const isAlreadyUnlocked = state.unlockedBadges.includes(ach.id);
      if (!isAlreadyUnlocked && ach.checkUnlocked(stats)) {
        state.unlockedBadges.push(ach.id);
        newlyUnlocked = true;
        saveState();

        showToast(`Odblokowano trofeum: "${ach.title}"! ${ach.icon}`, '🏆');
        playTriumphSound();
        triggerConfetti();
      }
    });

    if (newlyUnlocked) {
      renderAchievements();
    }
  }

  // 9. RENDEROWANIE KAMIENI MILOWYCH ZDROWIA (HEALTH TIMELINE)
  let currentFilter = 'all';

  function renderHealthMilestones() {
    const container = document.getElementById('health-milestones-grid');
    const titleEl = document.getElementById('health-timeline-title');
    const subtitleEl = document.getElementById('health-timeline-subtitle');
    if (!container) return;

    const catData = getActiveCategoryData();
    const stats = calculateCurrentStats();

    if (titleEl) {
      titleEl.innerHTML = state.activeCategory === 'vape'
        ? `💨 Medyczna Oś Czasu Regeneracji po Vapingu (E-papierosy)`
        : `🫁 Medyczna Oś Czasu Regeneracji Organizmu (Dym Tytoniowy)`;
    }
    if (subtitleEl) {
      subtitleEl.textContent = state.activeCategory === 'vape'
        ? `Oparta na badaniach toksykologicznych nad aerozolem e-papierosów, solami nikotynowymi, EVALI i gojeniem nabłonka oskrzelików`
        : `Oparta na oficjalnych protokołach badawczych WHO, Europejskiego Towarzystwa Kardiologicznego i American Lung Association`;
    }

    container.innerHTML = '';

    const filtered = catData.healthMilestones.filter((m) => {
      const isDone = stats.secondsElapsed >= m.timeSeconds;
      if (currentFilter === 'all') return true;
      if (currentFilter === 'completed') return isDone;
      if (currentFilter === 'in_progress') return !isDone && stats.secondsElapsed > 0;
      if (currentFilter === 'serce') return m.category === 'serce';
      if (currentFilter === 'płuca') return m.category === 'płuca';
      if (currentFilter === 'zmysły') return m.category === 'zmysły' || m.category === 'krew' || m.category === 'ogólne';
      return true;
    });

    if (filtered.length === 0) {
      container.innerHTML = `<div style="grid-column: 1/-1; text-align: center; color: var(--text-muted); padding: 40px;">Brak etapów w wybranej kategorii.</div>`;
      return;
    }

    filtered.forEach((m) => {
      const progressPercent = Math.min(100, Math.max(0, (stats.secondsElapsed / m.timeSeconds) * 100));
      const isCompleted = progressPercent >= 100;

      let statusBadgeHtml = '';
      if (isCompleted) {
        statusBadgeHtml = `<span class="hc-status-pill done">✓ Zregenerowano</span>`;
      } else if (progressPercent > 0) {
        statusBadgeHtml = `<span class="hc-status-pill progress">${progressPercent.toFixed(1)}%</span>`;
      } else {
        statusBadgeHtml = `<span class="hc-status-pill locked">W kolejce</span>`;
      }

      let remainingText = '';
      if (!isCompleted) {
        const remainingSeconds = Math.max(0, m.timeSeconds - stats.secondsElapsed);
        const remDHM = formatSecondsToDHM(remainingSeconds);
        if (remDHM.days > 0) {
          remainingText = `Pozostało ok. ${remDHM.days} dni ${remDHM.hours}h`;
        } else if (remDHM.hours > 0) {
          remainingText = `Pozostało ok. ${remDHM.hours}h ${remDHM.mins}m`;
        } else {
          remainingText = `Pozostało ok. ${remDHM.mins}m ${remDHM.secs}s`;
        }
      } else {
        remainingText = 'Etap osiągnięty w 100%';
      }

      const card = document.createElement('div');
      card.className = `health-card ${isCompleted ? 'completed' : ''}`;
      card.innerHTML = `
        <div class="health-card-head">
          <div class="hc-icon-title">
            <div class="hc-icon">${m.icon}</div>
            <div class="hc-title-block">
              <h3>${m.title}</h3>
              <div class="hc-time-badge">⏱️ Po czasie: ${m.timeFormatted}</div>
            </div>
          </div>
          <div>${statusBadgeHtml}</div>
        </div>

        <div class="progress-bar-wrapper">
          <div class="progress-track">
            <div class="progress-fill ${isCompleted ? 'done' : ''}" style="width: ${progressPercent}%;"></div>
          </div>
          <div class="progress-meta">
            <span>${remainingText}</span>
            <span>${progressPercent.toFixed(1)}%</span>
          </div>
        </div>

        <p class="hc-desc">${m.description}</p>
        <div class="hc-scientific">
          <strong>🔬 Efekt biologiczny:</strong> ${m.scientificBenefit}
        </div>
      `;
      container.appendChild(card);
    });

    renderNextMilestonePreview(stats, catData);
  }

  function renderNextMilestonePreview(stats, catData) {
    const previewContainer = document.getElementById('next-milestone-preview-content');
    const milestoneTitle = document.getElementById('dashboard-milestone-title');
    const milestoneDesc = document.getElementById('dashboard-milestone-desc');
    if (!previewContainer) return;

    if (milestoneTitle) {
      milestoneTitle.textContent = state.activeCategory === 'vape'
        ? `💨 Następny Etap Regeneracji po Vapingu`
        : `🫁 Następny Etap Regeneracji Twojego Ciała`;
    }
    if (milestoneDesc) {
      milestoneDesc.textContent = state.activeCategory === 'vape'
        ? `Oczyszczanie pęcherzyków płucnych z aerozolu i regeneracja śródbłonka naczyniowego`
        : `Medyczny proces naprawczy komórek, który aktualnie zachodzi w Twoim ciele`;
    }

    const nextMilestone = catData.healthMilestones.find((m) => stats.secondsElapsed < m.timeSeconds);

    if (!nextMilestone) {
      previewContainer.innerHTML = `
        <div style="background: rgba(16, 185, 129, 0.1); border: 1px solid var(--accent-emerald); border-radius: var(--radius-md); padding: 18px; text-align: center;">
          <h4 style="color: var(--accent-emerald-light); font-size: 1.1rem; font-weight: 800;">👑 Niewiarygodne! Osiągnąłeś wszystkie medyczne etapy regeneracji!</h4>
          <p style="color: #cbd5e1; font-size: 0.9rem; margin-top: 4px;">Twoje ciało, naczynia i płuca pracują z wydajnością osoby, która nigdy nie była uzależniona.</p>
        </div>
      `;
      return;
    }

    const progressPercent = Math.min(100, Math.max(0, (stats.secondsElapsed / nextMilestone.timeSeconds) * 100));
    const remSeconds = nextMilestone.timeSeconds - stats.secondsElapsed;
    const remDHM = formatSecondsToDHM(remSeconds);
    let timeStr = '';
    if (remDHM.days > 0) timeStr = `${remDHM.days} dni ${remDHM.hours}h`;
    else if (remDHM.hours > 0) timeStr = `${remDHM.hours} godz. ${remDHM.mins} min`;
    else timeStr = `${remDHM.mins} min ${remDHM.secs} sek`;

    previewContainer.innerHTML = `
      <div style="display: flex; align-items: center; justify-content: space-between; gap: 16px; flex-wrap: wrap;">
        <div style="display: flex; align-items: center; gap: 14px;">
          <div style="width: 48px; height: 48px; border-radius: var(--radius-md); background: rgba(6, 182, 212, 0.15); border: 1px solid rgba(6, 182, 212, 0.3); display: flex; align-items: center; justify-content: center; font-size: 1.6rem;">
            ${nextMilestone.icon}
          </div>
          <div>
            <h4 style="font-size: 1.05rem; font-weight: 800; color: #fff;">${nextMilestone.title}</h4>
            <div style="font-size: 0.8rem; color: var(--accent-cyan-light);">Wymagany czas: ${nextMilestone.timeFormatted} (Zostało: ${timeStr})</div>
          </div>
        </div>
        <div style="font-size: 1.25rem; font-weight: 800; color: ${state.activeCategory === 'vape' ? '#c084fc' : 'var(--accent-emerald-light)'};">${progressPercent.toFixed(1)}%</div>
      </div>
      <div class="progress-bar-wrapper" style="margin-top: 14px;">
        <div class="progress-track" style="height: 12px;">
          <div class="progress-fill" style="width: ${progressPercent}%;"></div>
        </div>
      </div>
      <p style="font-size: 0.88rem; color: var(--text-muted); margin-top: 8px;">${nextMilestone.description}</p>
    `;
  }

  // 10. RENDEROWANIE SKARBCA CELÓW (WISHLIST)
  function updateGoalsUI(moneySaved) {
    const container = document.getElementById('goals-grid');
    if (!container) return;

    if (container.children.length !== state.goals.length + 1) {
      renderGoals(moneySaved);
      return;
    }

    state.goals.forEach((goal) => {
      const card = document.getElementById(`goal-card-${goal.id}`);
      if (!card) return;
      const percent = Math.min(100, Math.max(0, (moneySaved / goal.cost) * 100));
      const fillEl = card.querySelector('.progress-fill');
      const percentEl = card.querySelector('.goal-percent-text');
      const remEl = card.querySelector('.goal-rem-text');

      if (fillEl) fillEl.style.width = `${percent}%`;
      if (percentEl) percentEl.textContent = `${percent.toFixed(1)}%`;
      if (remEl) {
        if (percent >= 100) {
          remEl.textContent = '🎉 Odblokowano! Czas na nagrodę!';
          card.classList.add('unlocked');
        } else {
          const needed = (goal.cost - moneySaved).toFixed(2);
          remEl.textContent = `Brakuje jeszcze: ${needed} zł`;
          card.classList.remove('unlocked');
        }
      }
    });
  }

  function renderGoals(moneySaved) {
    const container = document.getElementById('goals-grid');
    if (!container) return;
    container.innerHTML = '';

    state.goals.forEach((goal) => {
      const percent = Math.min(100, Math.max(0, (moneySaved / goal.cost) * 100));
      const isDone = percent >= 100;
      const needed = Math.max(0, goal.cost - moneySaved).toFixed(2);

      const card = document.createElement('div');
      card.className = `goal-card ${isDone ? 'unlocked' : ''}`;
      card.id = `goal-card-${goal.id}`;
      card.innerHTML = `
        <div class="goal-head">
          <div class="goal-icon">${goal.icon || '🎁'}</div>
          <div class="goal-title-group" style="flex: 1;">
            <h3>${goal.name}</h3>
            <div class="goal-cost">Cena: ${goal.cost.toFixed(2)} zł</div>
          </div>
          <button class="icon-btn delete-goal-btn" data-goal-id="${goal.id}" title="Usuń ten cel" style="width: 32px; height: 32px; font-size: 0.9rem;">
            🗑️
          </button>
        </div>

        <div class="progress-bar-wrapper">
          <div class="progress-track">
            <div class="progress-fill ${isDone ? 'done' : ''}" style="width: ${percent}%;"></div>
          </div>
          <div class="progress-meta">
            <span class="goal-rem-text">${isDone ? '🎉 Odblokowano! Czas na nagrodę!' : `Brakuje jeszcze: ${needed} zł`}</span>
            <span class="goal-percent-text">${percent.toFixed(1)}%</span>
          </div>
        </div>
      `;
      container.appendChild(card);
    });

    const addCard = document.createElement('div');
    addCard.className = 'add-goal-card';
    addCard.id = 'trigger-add-goal-card';
    addCard.innerHTML = `
      <div class="add-goal-icon">➕</div>
      <h3 style="font-size: 1.05rem; font-weight: 700; color: #fff;">Dodaj nowy cel</h3>
      <p style="font-size: 0.8rem; color: var(--text-muted); margin-top: 4px;">Zdefiniuj nagrodę za rzucenie nałogu</p>
    `;
    container.appendChild(addCard);
  }

  // 11. RENDEROWANIE ODZNAK I TROFEÓW
  function renderAchievements() {
    const container = document.getElementById('achievements-grid');
    const summaryBadge = document.getElementById('badges-unlocked-summary');
    if (!container) return;

    container.innerHTML = '';
    const totalCount = APP_DATA.shared.achievements.length;
    const unlockedCount = state.unlockedBadges.length;

    if (summaryBadge) {
      summaryBadge.textContent = `Odblokowano: ${unlockedCount} / ${totalCount}`;
    }

    APP_DATA.shared.achievements.forEach((ach) => {
      const isUnlocked = state.unlockedBadges.includes(ach.id);
      const card = document.createElement('div');
      card.className = `badge-card ${isUnlocked ? 'unlocked' : ''}`;
      card.innerHTML = `
        <div class="badge-icon">${ach.icon}</div>
        <div class="badge-info">
          <h4>${ach.title}</h4>
          <p>${ach.description}</p>
          <span class="badge-tier-pill ${ach.tier}">${ach.tier}</span>
          ${isUnlocked ? '<span style="font-size: 0.7rem; color: var(--accent-emerald-light); font-weight: 700; margin-left: 6px;">✓ Zdobyto</span>' : ''}
        </div>
      `;
      container.appendChild(card);
    });
  }

  // 12. RENDEROWANIE BAZY WIEDZY I MITÓW (DEDYKOWANE DLA KATEGORII)
  function renderMyths() {
    const mythsContainer = document.getElementById('myths-list');
    const tipsContainer = document.getElementById('psychology-tips-container');
    const mythsTitle = document.getElementById('myths-section-title');
    const catData = getActiveCategoryData();

    if (mythsTitle) {
      mythsTitle.innerHTML = state.activeCategory === 'vape'
        ? `🚫 Rozprawiamy się z mitami o e-papierosach i vapingu`
        : `🚫 Rozprawiamy się z mitami o paleniu tytoniu`;
    }

    if (mythsContainer) {
      mythsContainer.innerHTML = '';
      catData.mythsVsFacts.forEach((item) => {
        const card = document.createElement('div');
        card.className = 'myth-card';
        card.innerHTML = `
          <div class="myth-header">
            <span>❌</span> <span>Mit: "${item.myth}"</span>
          </div>
          <div class="fact-box">
            ${item.fact}
          </div>
        `;
        mythsContainer.appendChild(card);
      });
    }

    if (tipsContainer) {
      tipsContainer.innerHTML = '';
      catData.tips.forEach((tip) => {
        const card = document.createElement('div');
        card.className = 'myth-card';
        card.innerHTML = `
          <div style="font-weight: 700; color: ${state.activeCategory === 'vape' ? '#c084fc' : 'var(--accent-cyan-light)'}; margin-bottom: 6px;">
            💡 ${tip.title}
          </div>
          <div style="font-size: 0.88rem; color: #cbd5e1; line-height: 1.5;">
            ${tip.desc}
          </div>
        `;
        tipsContainer.appendChild(card);
      });
    }
  }

  // 13. RENDEROWANIE DZIENNIKA POKUS
  function renderJournal() {
    const container = document.getElementById('journal-entries-container');
    if (!container) return;
    container.innerHTML = '';

    if (state.cravingsLog.length === 0) {
      container.innerHTML = `
        <div style="background: var(--bg-card); border: 1px dashed var(--border-glass); border-radius: var(--radius-md); padding: 36px; text-align: center; color: var(--text-muted);">
          <div style="font-size: 2rem; margin-bottom: 8px;">🕊️</div>
          <p style="font-size: 0.95rem; font-weight: 600;">Twój dziennik jest jeszcze pusty.</p>
          <p style="font-size: 0.85rem; margin-top: 4px;">Gdy poczujesz chęć sięgnięcia po dym lub vape – kliknij „Dodaj wpis”, zanotuj sytuację i świętuj wygraną!</p>
        </div>
      `;
      return;
    }

    const sorted = [...state.cravingsLog].sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

    sorted.forEach((entry) => {
      const date = new Date(entry.timestamp);
      const formattedDate = date.toLocaleDateString('pl-PL', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });

      const card = document.createElement('div');
      card.className = 'journal-entry-card';
      card.innerHTML = `
        <div class="jec-left">
          <div class="jec-status-icon" title="Fala głodu pokonana!">✓</div>
          <div>
            <div class="jec-trigger-tag">${entry.trigger}</div>
            <div style="font-size: 0.8rem; color: #fbbf24; font-weight: 700; margin-bottom: 2px;">
              Siła pokusy: ${'⚡'.repeat(Number(entry.intensity) || 1)} (${entry.intensity}/5)
            </div>
            <div class="jec-note">${entry.note || 'Brak dodatkowych notatek. Zwycięstwo!'}</div>
          </div>
        </div>
        <div class="jec-date">${formattedDate}</div>
      `;
      container.appendChild(card);
    });
  }

  // 14. ROTATOR CYTATÓW MOTYWACYJNYCH
  let currentQuoteIndex = 0;
  function showNextQuote() {
    const quoteEl = document.getElementById('daily-quote-text');
    const authorEl = document.getElementById('daily-quote-author');
    if (!quoteEl || !authorEl) return;

    currentQuoteIndex = Math.floor(Math.random() * APP_DATA.shared.motivationalQuotes.length);
    const q = APP_DATA.shared.motivationalQuotes[currentQuoteIndex];

    quoteEl.style.opacity = '0';
    quoteEl.style.transform = 'translateY(5px)';
    quoteEl.style.transition = 'all 0.25s ease';

    setTimeout(() => {
      quoteEl.textContent = `"${q.text}"`;
      authorEl.textContent = `— ${q.author}`;
      quoteEl.style.opacity = '1';
      quoteEl.style.transform = 'translateY(0)';
    }, 250);
  }

  // 15. INTERAKTYWNA FOLIA BĄBELKOWA (FIDGET POP-IT)
  function initBubbleWrap() {
    const grid = document.getElementById('bubble-wrap-grid');
    const counterEl = document.getElementById('bubbles-popped-count');
    if (!grid) return;

    grid.innerHTML = '';
    const totalBubbles = 24;

    for (let i = 0; i < totalBubbles; i++) {
      const btn = document.createElement('button');
      btn.className = 'bubble-btn';
      btn.type = 'button';
      btn.setAttribute('aria-label', `Bąbelek ${i + 1}`);

      btn.addEventListener('click', () => {
        if (!btn.classList.contains('popped')) {
          btn.classList.add('popped');
          playBubblePopSound();
          state.bubblesPopped = (state.bubblesPopped || 0) + 1;
          if (counterEl) counterEl.textContent = state.bubblesPopped;
          saveState();
        }
      });
      grid.appendChild(btn);
    }

    if (counterEl) counterEl.textContent = state.bubblesPopped || 0;
  }

  // 16. PROWADZONY TRENING ODDECHOWY (URGE SURFING 4-7-8)
  let breathingInterval = null;
  let isBreathingActive = false;
  let breathingPhase = 'inhale';
  let phaseTimeLeft = 4;
  let totalSessionSecondsLeft = 180;

  const breathingCircle = document.getElementById('breathing-circle');
  const breathingAction = document.getElementById('breathing-action');
  const breathingTimer = document.getElementById('breathing-timer');
  const breathingInstruction = document.getElementById('breathing-instruction');
  const breathingToggleBtn = document.getElementById('breathing-toggle-btn');

  function startBreathingSession() {
    isBreathingActive = true;
    totalSessionSecondsLeft = 180;
    setBreathingPhase('inhale');
    if (breathingToggleBtn) {
      breathingToggleBtn.textContent = '⏹ Zatrzymaj sesję oddechową';
      breathingToggleBtn.className = 'btn btn-outline';
    }

    clearInterval(breathingInterval);
    breathingInterval = setInterval(tickBreathing, 1000);
  }

  function stopBreathingSession() {
    isBreathingActive = false;
    clearInterval(breathingInterval);
    if (breathingCircle) {
      breathingCircle.className = 'breathing-circle';
    }
    if (breathingAction) breathingAction.textContent = 'GOTOWY';
    if (breathingTimer) breathingTimer.textContent = '4';
    if (breathingInstruction) breathingInstruction.textContent = 'Kliknij przycisk poniżej, aby rozpocząć.';
    if (breathingToggleBtn) {
      breathingToggleBtn.textContent = '▶ Rozpocznij sesję oddechową (3 minuty)';
      breathingToggleBtn.className = 'btn btn-primary';
    }
  }

  function setBreathingPhase(phase) {
    breathingPhase = phase;
    if (phase === 'inhale') {
      phaseTimeLeft = 4;
      if (breathingCircle) breathingCircle.className = 'breathing-circle inhale';
      if (breathingAction) breathingAction.textContent = 'WDECH';
      if (breathingInstruction) breathingInstruction.textContent = 'Wdychaj powoli i głęboko przez nos...';
      playZenBellSound(440);
    } else if (phase === 'hold') {
      phaseTimeLeft = 7;
      if (breathingCircle) breathingCircle.className = 'breathing-circle hold';
      if (breathingAction) breathingAction.textContent = 'ZATRZYMAJ';
      if (breathingInstruction) breathingInstruction.textContent = 'Zatrzymaj powietrze w płucach, poczuj spokój...';
      playZenBellSound(554);
    } else if (phase === 'exhale') {
      phaseTimeLeft = 8;
      if (breathingCircle) breathingCircle.className = 'breathing-circle exhale';
      if (breathingAction) breathingAction.textContent = 'WYDECH';
      if (breathingInstruction) breathingInstruction.textContent = 'Powoli wypuszczaj powietrze przez usta...';
      playZenBellSound(330);
    }
    if (breathingTimer) breathingTimer.textContent = phaseTimeLeft;
  }

  function tickBreathing() {
    phaseTimeLeft--;
    totalSessionSecondsLeft--;

    if (breathingTimer) breathingTimer.textContent = phaseTimeLeft;

    if (phaseTimeLeft <= 0) {
      if (breathingPhase === 'inhale') {
        setBreathingPhase('hold');
      } else if (breathingPhase === 'hold') {
        setBreathingPhase('exhale');
      } else {
        setBreathingPhase('inhale');
      }
    }

    if (totalSessionSecondsLeft <= 0) {
      stopBreathingSession();
      showToast('Brawo! Ukończyłeś pełną 3-minutową sesję oddechową. Fala głodu pokonana!', '🌟');
      playTriumphSound();
      triggerConfetti();
    }
  }

  // 17. PRZEŁĄCZANIE ZAKŁADEK GŁÓWNYCH
  function switchTab(tabId) {
    document.querySelectorAll('.tab-panel').forEach((panel) => {
      panel.classList.remove('active');
    });

    const targetPanel = document.getElementById(`tab-${tabId}`);
    if (targetPanel) targetPanel.classList.add('active');

    document.querySelectorAll('.nav-btn').forEach((btn) => {
      btn.classList.toggle('active', btn.getAttribute('data-tab') === tabId);
    });

    document.querySelectorAll('.mobile-nav-btn').forEach((btn) => {
      btn.classList.toggle('active', btn.getAttribute('data-tab') === tabId);
    });

    window.scrollTo({ top: 0, behavior: 'smooth' });

    if (tabId === 'zdrowie') renderHealthMilestones();
    if (tabId === 'odznaki') renderAchievements();
    if (tabId === 'dziennik') renderJournal();
    if (tabId === 'wiedza') renderMyths();
  }

  // 18. MODALE I FORMULARZE
  function openModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) modal.classList.add('open');
  }

  function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) modal.classList.remove('open');
  }

  // Zakładki w ustawieniach (Papierosy vs E-papierosy)
  let activeSettingsTab = 'cigarettes';
  function switchSettingsTab(tabName) {
    activeSettingsTab = tabName;
    document.querySelectorAll('.settings-tab-btn').forEach((btn) => {
      btn.classList.toggle('active', btn.getAttribute('data-settings-tab') === tabName);
    });
    document.querySelectorAll('.settings-section-pane').forEach((pane) => {
      pane.classList.toggle('active', pane.id === `pane-settings-${tabName}`);
    });
  }

  function populateSettingsForm() {
    switchSettingsTab(state.activeCategory);

    // Wypełnij pola Papierosów Tradycyjnych
    const cigs = state.categories.cigarettes;
    const dateInput = document.getElementById('setting-quit-date');
    const cigsInput = document.getElementById('setting-cigs-per-day');
    const priceInput = document.getElementById('setting-pack-price');
    const yearsInput = document.getElementById('setting-years-smoked');

    if (dateInput) {
      const qd = new Date(cigs.quitDate);
      const pad = (n) => String(n).padStart(2, '0');
      dateInput.value = `${qd.getFullYear()}-${pad(qd.getMonth() + 1)}-${pad(qd.getDate())}T${pad(qd.getHours())}:${pad(qd.getMinutes())}`;
    }
    if (cigsInput) cigsInput.value = cigs.cigsPerDay;
    if (priceInput) priceInput.value = cigs.packPrice;
    if (yearsInput) yearsInput.value = cigs.yearsSmoked || 7;

    // Wypełnij pola E-papierosów
    const vape = state.categories.vape;
    const vapeDateInput = document.getElementById('setting-vape-quit-date');
    const bottlePriceInput = document.getElementById('setting-bottle-price');
    const mlPerDayInput = document.getElementById('setting-ml-per-day');
    const nicStrengthInput = document.getElementById('setting-nicotine-strength');
    const puffsPerDayInput = document.getElementById('setting-puffs-per-day');
    const yearsVapedInput = document.getElementById('setting-years-vaped');

    if (vapeDateInput) {
      const vqd = new Date(vape.quitDate);
      const pad = (n) => String(n).padStart(2, '0');
      vapeDateInput.value = `${vqd.getFullYear()}-${pad(vqd.getMonth() + 1)}-${pad(vqd.getDate())}T${pad(vqd.getHours())}:${pad(vqd.getMinutes())}`;
    }
    if (bottlePriceInput) bottlePriceInput.value = vape.bottlePrice10ml || 18.00;
    if (mlPerDayInput) mlPerDayInput.value = vape.mlPerDay || 3.5;
    if (nicStrengthInput) nicStrengthInput.value = vape.nicotineStrengthMg || 20;
    if (puffsPerDayInput) puffsPerDayInput.value = vape.puffsPerDay || 350;
    if (yearsVapedInput) yearsVapedInput.value = vape.yearsVaped || 3;
  }

  // 19. INICJALIZACJA ZDARZEŃ (EVENT LISTENERS)
  function setupEventListeners() {
    // Szybki Przełącznik Kategorii w nagłówku
    document.querySelectorAll('.category-toggle-btn').forEach((btn) => {
      btn.addEventListener('click', () => {
        const cat = btn.getAttribute('data-category');
        if (cat) switchCategory(cat);
      });
    });

    // Obsługa zakładek głównych w menu i mobilnych
    document.querySelectorAll('[data-tab]').forEach((btn) => {
      btn.addEventListener('click', () => {
        const tab = btn.getAttribute('data-tab');
        if (tab) switchTab(tab);
      });
    });

    // Filtry etapów zdrowia
    document.querySelectorAll('.filter-btn').forEach((btn) => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('.filter-btn').forEach((b) => b.classList.remove('active'));
        btn.classList.add('active');
        currentFilter = btn.getAttribute('data-filter') || 'all';
        renderHealthMilestones();
      });
    });

    // Przycisk SOS w nagłówku i na pulpicie
    const sosTrigger = document.getElementById('header-sos-btn');
    const dashSosBtn = document.getElementById('dashboard-open-sos-btn');
    if (sosTrigger) {
      sosTrigger.addEventListener('click', () => {
        switchTab('sos');
        if (!isBreathingActive) startBreathingSession();
      });
    }
    if (dashSosBtn) {
      dashSosBtn.addEventListener('click', () => {
        switchTab('sos');
        if (!isBreathingActive) startBreathingSession();
      });
    }

    // Przejście z dashboardu do zdrowia
    const dashHealthBtn = document.getElementById('dashboard-go-health-btn');
    if (dashHealthBtn) {
      dashHealthBtn.addEventListener('click', () => switchTab('zdrowie'));
    }

    // Przycisk wcześniejszego startu ("Zgasiłem papierosa / schowałem vape już teraz!")
    const earlyStartBtn = document.getElementById('start-now-early-btn');
    if (earlyStartBtn) {
      earlyStartBtn.addEventListener('click', () => {
        const promptText = state.activeCategory === 'vape'
          ? 'Czy na pewno odstawiłeś e-papierosa i chcesz wystartować licznik czystych płuc od tej sekundy?'
          : 'Czy na pewno zgasiłeś ostatniego papierosa i chcesz wystartować licznik czystego życia od tej sekundy?';

        if (confirm(promptText)) {
          const nowIso = new Date().toISOString();
          state.categories[state.activeCategory].quitDate = nowIso;
          saveState();
          updateTimerUI();
          renderHealthMilestones();
          showToast('Gratulacje! Twoja podróż ku czystemu oddechowi rozpoczęła się TERAZ!', '🚀');
          playTriumphSound();
          triggerConfetti();
        }
      });
    }

    // Rotator cytatów
    const quoteBtn = document.getElementById('refresh-quote-btn');
    if (quoteBtn) quoteBtn.addEventListener('click', showNextQuote);

    // Dźwięk toggle
    const soundBtn = document.getElementById('sound-toggle-btn');
    if (soundBtn) {
      soundBtn.addEventListener('click', () => {
        state.soundEnabled = !state.soundEnabled;
        soundBtn.textContent = state.soundEnabled ? '🔊 Dźwięk: WŁ' : '🔇 Dźwięk: WYŁ';
        saveState();
      });
    }

    // Trening oddechowy start/stop
    if (breathingToggleBtn) {
      breathingToggleBtn.addEventListener('click', () => {
        if (isBreathingActive) {
          stopBreathingSession();
        } else {
          startBreathingSession();
        }
      });
    }

    // Przycisk zwycięstwa z falą głodu
    const cravingVicBtn = document.getElementById('craving-victory-btn');
    if (cravingVicBtn) {
      cravingVicBtn.addEventListener('click', () => {
        state.cravingsSurfed = (state.cravingsSurfed || 0) + 1;
        state.cravingsLog.unshift({
          id: 'craving_' + Date.now(),
          timestamp: new Date().toISOString(),
          trigger: `🚨 Nagły atak głodu (${state.activeCategory === 'vape' ? 'Vaping' : 'Dym'})`,
          intensity: '4',
          note: 'Użyłem przycisku SOS, opanowałem oddech i przeczekałem falę. Kolejne zwycięstwo!',
          status: 'surfed'
        });
        saveState();
        playTriumphSound();
        triggerConfetti();
        showToast('Znakomicie! Zwycięstwo zapisane w dzienniku. Każda przetrwana fala osłabia nałóg!', '🌊');
        renderJournal();
      });
    }

    // Reset folii bąbelkowej
    const resetBubblesBtn = document.getElementById('reset-bubbles-btn');
    if (resetBubblesBtn) {
      resetBubblesBtn.addEventListener('click', () => {
        initBubbleWrap();
        showToast('Folia bąbelkowa odświeżona! Możesz pękać dalej.', '🫧');
      });
    }

    // Zamykanie modali
    document.querySelectorAll('[data-close-modal]').forEach((btn) => {
      btn.addEventListener('click', () => {
        const modalId = btn.getAttribute('data-close-modal');
        if (modalId) closeModal(modalId);
      });
    });

    document.querySelectorAll('.modal-overlay').forEach((overlay) => {
      overlay.addEventListener('click', (e) => {
        if (e.target === overlay) closeModal(overlay.id);
      });
    });

    // Ustawienia: Zakładki wewnątrz modala
    document.querySelectorAll('.settings-tab-btn').forEach((btn) => {
      btn.addEventListener('click', () => {
        const tab = btn.getAttribute('data-settings-tab');
        if (tab) switchSettingsTab(tab);
      });
    });

    // Otwieranie modala ustawień
    const openSettingsBtn = document.getElementById('open-settings-btn');
    const heroEditDateBtn = document.getElementById('hero-edit-date-btn');
    if (openSettingsBtn) {
      openSettingsBtn.addEventListener('click', () => {
        populateSettingsForm();
        openModal('settings-modal');
      });
    }
    if (heroEditDateBtn) {
      heroEditDateBtn.addEventListener('click', () => {
        populateSettingsForm();
        openModal('settings-modal');
      });
    }

    // Zapis ustawień obu kategorii
    const settingsForm = document.getElementById('settings-form');
    if (settingsForm) {
      settingsForm.addEventListener('submit', (e) => {
        e.preventDefault();

        // 1. Zapisz ustawienia Papierosów
        const cigDate = document.getElementById('setting-quit-date').value;
        const cigsPerDay = parseInt(document.getElementById('setting-cigs-per-day').value, 10);
        const packPrice = parseFloat(document.getElementById('setting-pack-price').value);
        const yearsSmoked = parseInt(document.getElementById('setting-years-smoked').value, 10);

        if (cigDate) state.categories.cigarettes.quitDate = new Date(cigDate).toISOString();
        if (!isNaN(cigsPerDay) && cigsPerDay > 0) state.categories.cigarettes.cigsPerDay = cigsPerDay;
        if (!isNaN(packPrice) && packPrice > 0) state.categories.cigarettes.packPrice = packPrice;
        if (!isNaN(yearsSmoked) && yearsSmoked >= 0) state.categories.cigarettes.yearsSmoked = yearsSmoked;

        // 2. Zapisz ustawienia E-papierosów
        const vapeDate = document.getElementById('setting-vape-quit-date').value;
        const bottlePrice = parseFloat(document.getElementById('setting-bottle-price').value);
        const mlPerDay = parseFloat(document.getElementById('setting-ml-per-day').value);
        const nicStrength = parseFloat(document.getElementById('setting-nicotine-strength').value);
        const puffsPerDay = parseInt(document.getElementById('setting-puffs-per-day').value, 10);
        const yearsVaped = parseInt(document.getElementById('setting-years-vaped').value, 10);

        if (vapeDate) state.categories.vape.quitDate = new Date(vapeDate).toISOString();
        if (!isNaN(bottlePrice) && bottlePrice > 0) state.categories.vape.bottlePrice10ml = bottlePrice;
        if (!isNaN(mlPerDay) && mlPerDay > 0) state.categories.vape.mlPerDay = mlPerDay;
        if (!isNaN(nicStrength) && nicStrength >= 0) state.categories.vape.nicotineStrengthMg = nicStrength;
        if (!isNaN(puffsPerDay) && puffsPerDay > 0) state.categories.vape.puffsPerDay = puffsPerDay;
        if (!isNaN(yearsVaped) && yearsVaped >= 0) state.categories.vape.yearsVaped = yearsVaped;

        // Jeśli użytkownik konfigurował akurat drugą zakładkę, możemy automatycznie przełączyć
        if (activeSettingsTab !== state.activeCategory) {
          switchCategory(activeSettingsTab);
        }

        saveState();
        closeModal('settings-modal');
        updateTimerUI();
        renderHealthMilestones();
        showToast('Ustawienia zostały pomyślnie zapisane!', '⚙️');
      });
    }

    // Modal dodawania celu marzeń
    const openAddGoalBtn = document.getElementById('open-add-goal-modal-btn');
    if (openAddGoalBtn) {
      openAddGoalBtn.addEventListener('click', () => openModal('goal-modal'));
    }

    document.addEventListener('click', (e) => {
      if (e.target.closest('#trigger-add-goal-card')) {
        openModal('goal-modal');
      }
      const deleteBtn = e.target.closest('.delete-goal-btn');
      if (deleteBtn) {
        const goalId = deleteBtn.getAttribute('data-goal-id');
        if (goalId && confirm('Czy na pewno chcesz usunąć ten cel ze Skarbca?')) {
          state.goals = state.goals.filter((g) => g.id !== goalId);
          saveState();
          const stats = calculateCurrentStats();
          renderGoals(stats.moneySaved);
          showToast('Cel został usunięty.', '🗑️');
        }
      }
    });

    const goalForm = document.getElementById('goal-form');
    if (goalForm) {
      goalForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const name = document.getElementById('goal-name-input').value.trim();
        const cost = parseFloat(document.getElementById('goal-cost-input').value);
        const icon = document.getElementById('goal-icon-input').value;

        if (name && !isNaN(cost) && cost > 0) {
          state.goals.push({
            id: 'g_' + Date.now(),
            name,
            cost,
            icon: icon || '🎁'
          });
          saveState();
          goalForm.reset();
          closeModal('goal-modal');
          const stats = calculateCurrentStats();
          renderGoals(stats.moneySaved);
          showToast(`Cel "${name}" dodany do Skarbca!`, '🎯');
        }
      });
    }

    // Modal dodawania wpisu w dzienniku pokus
    const openCravingBtn = document.getElementById('open-craving-entry-modal-btn');
    const dashCravingBtn = document.getElementById('dashboard-open-craving-btn');
    if (openCravingBtn) openCravingBtn.addEventListener('click', () => openModal('craving-modal'));
    if (dashCravingBtn) dashCravingBtn.addEventListener('click', () => openModal('craving-modal'));

    const cravingForm = document.getElementById('craving-form');
    if (cravingForm) {
      cravingForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const trigger = document.getElementById('craving-trigger-select').value;
        const intensity = document.getElementById('craving-intensity-input').value;
        const note = document.getElementById('craving-note-input').value.trim();

        state.cravingsLog.unshift({
          id: 'c_' + Date.now(),
          timestamp: new Date().toISOString(),
          trigger,
          intensity,
          note: note || 'Pokonano bez sięgania po nikotynę!',
          status: 'surfed'
        });
        state.cravingsSurfed = (state.cravingsSurfed || 0) + 1;
        saveState();

        cravingForm.reset();
        closeModal('craving-modal');
        renderJournal();
        playTriumphSound();
        triggerConfetti();
        showToast('Wpis dodany! Jesteś o krok bliżej całkowitej wolności.', '📝');
      });
    }
  }

  // 20. GŁÓWNY START APLIKACJI
  function initApp() {
    loadState();

    // Ustaw motyw początkowy
    document.body.className = state.activeCategory === 'vape' ? 'theme-vape' : 'theme-cigarettes';
    document.querySelectorAll('.category-toggle-btn').forEach((btn) => {
      btn.classList.toggle('active', btn.getAttribute('data-category') === state.activeCategory);
    });
    const brandLogoIcon = document.getElementById('brand-logo-icon');
    if (brandLogoIcon) {
      brandLogoIcon.textContent = state.activeCategory === 'vape' ? '💨' : '🫁';
    }

    setupEventListeners();
    initBubbleWrap();
    renderHealthMilestones();
    renderAchievements();
    renderMyths();
    renderJournal();

    const stats = calculateCurrentStats();
    renderGoals(stats.moneySaved);

    updateTimerUI();
    setInterval(updateTimerUI, 1000);
    setInterval(renderHealthMilestones, 5000);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initApp);
  } else {
    initApp();
  }

})();
