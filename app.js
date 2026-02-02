
document.addEventListener('DOMContentLoaded', () => {
  /* =====================
     NAVEGACIÓN / SCREENS
  ====================== */
  const navButtons = document.querySelectorAll('.nav-btn');
  const screens = document.querySelectorAll('.screen');

  const navBar = document.querySelector('.screen-navigation');

  const btnHome = document.getElementById('start-from-home');
  const btnStart = document.getElementById('start-challenge');
  const btnVerify = document.getElementById('verify-backpack');

  // Resultados
  const btnAgain = document.getElementById('play-again');
  const btnBackHome = document.getElementById('back-to-home');

  // UI juego
  const itemsGrid = document.getElementById('itemsGrid');
  const backpackDrop = document.getElementById('backpack-dropzone');
  const backpackItemsEl = document.getElementById('backpack-items');
  const hintEl = document.getElementById('hint');

  const backpackStatsEl = document.getElementById('backpack-stats');
  const weightTextEl = document.getElementById('weightText');
  const weightProgressEl = document.getElementById('weightProgress');
  const timerEl = document.getElementById('timer');
  const pointsEl = document.getElementById('points');
  const livesEl = document.getElementById('lives');

  // Resultados textos
  const resultTitle = document.getElementById('resultTitle');
  const resultSubtitle = document.getElementById('resultSubtitle');
  const finalPoints = document.getElementById('finalPoints');
  const finalCorrect = document.getElementById('finalCorrect');
  const finalStars = document.getElementById('finalStars');

  // Home texts
  const homeWeightText = document.getElementById('homeWeightText');
  const homeMaxItemsText = document.getElementById('homeMaxItemsText');
  const gameTitle = document.getElementById('gameTitle');
  const gameSubtitle = document.getElementById('gameSubtitle');

  // ✅ Loader
  const appLoader = document.getElementById('appLoader');
  const loaderTitle = document.getElementById('loaderTitle');
  const loaderSubtitle = document.getElementById('loaderSubtitle');

  // ✅ Modal tiempo agotado (solo verificar)
  const timeUpModal = document.getElementById('timeUpModal');
  const timeUpVerify = document.getElementById('timeUpVerify');

  /* =====================
     CONSTANTES
  ====================== */
  const TIME_LIMIT = 15;
  const MAX_LIVES = 3;
  const CORRECT_TOTAL = 8; // siempre 8 correctos

  // ✅ NAV: Solo estas pestañas se pueden clickear "en general"
  const NAV_ALLOWED = new Set(['home', 'instructions']);

  const BAG_RULES = {
    adulto:       { maxWeight: 8.0, maxArticles: 12, label: "Adulto" },
    nino:         { maxWeight: 5.0, maxArticles: 10, label: "Niño" },
    adulto_mayor: { maxWeight: 7.0, maxArticles: 12, label: "Adulto mayor" }
  };

  const GENERAL_GOOD = [
    { id:"agua",      emoji:"💧", name:"Agua (1–2 litros)",            weight:2.0, essential:true },
    { id:"botiquin",  emoji:"🏥", name:"Botiquín de primeros auxilios", weight:1.2, essential:true },
    { id:"linterna",  emoji:"🔦", name:"Linterna",                     weight:0.4, essential:true },
    { id:"radio",     emoji:"📻", name:"Radio portátil",               weight:0.6, essential:true },
    { id:"pilas",     emoji:"🔋", name:"Pilas extra",                  weight:0.3, essential:true },
    { id:"comida",    emoji:"🥫", name:"Comida enlatada",              weight:1.3, essential:true }
  ];

  const GOOD_BY_BAG = {
    adulto: [
      { id:"cargador",    emoji:"🔌", name:"Cargador portátil (power bank)", weight:0.35, essential:true },
      { id:"documentos",  emoji:"📄", name:"Copias de documentos",           weight:0.20, essential:true },
      { id:"silbato",     emoji:"📣", name:"Silbato",                        weight:0.10, essential:true },
      { id:"cubrebocas",  emoji:"😷", name:"Cubrebocas",                     weight:0.10, essential:true },
      { id:"guantes",     emoji:"🧤", name:"Guantes",                        weight:0.30, essential:true },
      { id:"manta",       emoji:"🧣", name:"Manta térmica",                  weight:0.25, essential:true }
    ],
    nino: [
      { id:"cubrebocas",  emoji:"😷", name:"Cubrebocas",                     weight:0.10, essential:true },
      { id:"silbato",     emoji:"📣", name:"Silbato",                        weight:0.10, essential:true },
      { id:"manta",       emoji:"🧣", name:"Manta térmica",                  weight:0.25, essential:true },
      { id:"snack",       emoji:"🍎", name:"Snack (barrita o fruta)",        weight:0.40, essential:true },
      { id:"toallitas",   emoji:"🧻", name:"Toallitas húmedas",              weight:0.60, essential:true },
      { id:"contacto",    emoji:"🪪", name:"Tarjetajita con teléfonos (mamá/papá)", weight:0.05, essential:true }
    ],
    adulto_mayor: [
      { id:"medicinas",   emoji:"💊", name:"Medicinas personales (3 días)",  weight:0.35, essential:true },
      { id:"lentes",      emoji:"👓", name:"Lentes extra",                   weight:0.10, essential:true },
      { id:"cubrebocas",  emoji:"😷", name:"Cubrebocas",                     weight:0.10, essential:true },
      { id:"silbato",     emoji:"📣", name:"Silbato",                        weight:0.10, essential:true },
      { id:"documentos",  emoji:"📄", name:"Copias de documentos",           weight:0.20, essential:true },
      { id:"manta",       emoji:"🧣", name:"Manta térmica",                  weight:0.25, essential:true }
    ]
  };

  const BAD_COMMON = [
    { id:"consola",   emoji:"🎮", name:"Consola portátil",      weight:0.9,  essential:false },
    { id:"peluche",   emoji:"🧸", name:"Peluche grande",        weight:0.7,  essential:false },
    { id:"perfume",   emoji:"🧴", name:"Perfume",               weight:0.4,  essential:false },
    { id:"pinturas",  emoji:"🎨", name:"Pinturas",              weight:1.0,  essential:false },
    { id:"revistas",  emoji:"📰", name:"Revistas",              weight:0.6,  essential:false },
    { id:"audifonos", emoji:"🎧", name:"Audífonos",             weight:0.25, essential:false },
    { id:"bocina",    emoji:"🔊", name:"Bocina",                weight:0.9,  essential:false },
    { id:"tablet",    emoji:"📱", name:"Tablet",                weight:0.55, essential:false },
    { id:"maquillaje",emoji:"💄", name:"Maquillaje",            weight:0.25, essential:false },
    { id:"juguete",   emoji:"🪀", name:"Juguete extra",         weight:0.35, essential:false },
    { id:"dulces",    emoji:"🍬", name:"Dulces",                weight:0.50, essential:false },
    { id:"zapatos",   emoji:"👠", name:"Zapatos extra",         weight:0.90, essential:false },
    { id:"gorra",     emoji:"🧢", name:"Gorra",                 weight:0.20, essential:false },
    { id:"libro",     emoji:"📚", name:"Libro",                 weight:0.60, essential:false }
  ];

  /* =====================
     ESTADO DINÁMICO
  ====================== */
  let RULES = BAG_RULES.adulto;
  let MAX_WEIGHT = RULES.maxWeight;
  let MAX_ARTICLES = RULES.maxArticles;

  let currentWeight = 0;
  let articleCount = 0;
  let points = 0;
  let lives = MAX_LIVES;
  let timeLeft = TIME_LIMIT;
  let timerInterval = null;
  let gameRunning = false;

  let selectedIds = new Set();
  let draggedId = null;

  let currentBagType = "adulto";
  let currentGridArticles = [];
  let correctIdSet = new Set();

  // Bandera: tiempo agotado (congela interacción, PERO permite verificar)
  let timeIsUp = false;

  /* =====================
     HELPERS
  ====================== */
  function setNavHidden(hidden){
    if(!navBar) return;
    navBar.classList.toggle('is-hidden', !!hidden);
  }

  function setNavLocked(locked){
    if(!navBar) return;
    navBar.classList.toggle('is-locked', !!locked);
  }

  function applyNavDisabledState(){
    navButtons.forEach(btn => {
      const target = btn.dataset.screen;
      const disabled = !NAV_ALLOWED.has(target);
      btn.classList.toggle('is-disabled', disabled);
    });
  }

  // ✅ marcar/desmarcar item en la grilla
  function markCardSelected(id, selected){
    const card = document.querySelector(`.item-card[data-id="${id}"]`);
    if(!card) return;
    card.classList.toggle('is-selected', !!selected);
  }

  function showScreen(screenId){
    navButtons.forEach(b => b.classList.remove('active'));
    screens.forEach(s => s.classList.remove('active'));

    const nav = document.querySelector(`.nav-btn[data-screen="${screenId}"]`);
    const screen = document.getElementById(`screen-${screenId}`);

    if(nav) nav.classList.add('active');
    if(screen) screen.classList.add('active');

    // ✅ Ocultar la barra SOLO en pantalla de juego
    setNavHidden(screenId === 'game');

    // ✅ Bloqueo total SOLO en resultados
    setNavLocked(screenId === 'results');

    applyNavDisabledState();
  }

  function shuffle(arr){
    const a = [...arr];
    for(let i=a.length-1;i>0;i--){
      const j = Math.floor(Math.random()*(i+1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }

  function formatTime(sec){
    return `0:${String(Math.max(0, sec)).padStart(2,'0')}`;
  }

  /* =====================
     LOADER
  ====================== */
  function showLoader(title='Cargando…', subtitle='Un momento'){
    if(!appLoader) return;
    if(loaderTitle) loaderTitle.textContent = title;
    if(loaderSubtitle) loaderSubtitle.textContent = subtitle;
    appLoader.classList.add('show');
    appLoader.setAttribute('aria-hidden','false');
  }

  function hideLoader(){
    if(!appLoader) return;
    appLoader.classList.remove('show');
    appLoader.setAttribute('aria-hidden','true');
  }

  /* =====================
     MODAL TIEMPO AGOTADO
  ====================== */
  function showTimeUpModal(){
    if(!timeUpModal) return;
    timeUpModal.classList.add('show');
    timeUpModal.setAttribute('aria-hidden','false');
  }

  function hideTimeUpModal(){
    if(!timeUpModal) return;
    timeUpModal.classList.remove('show');
    timeUpModal.setAttribute('aria-hidden','true');
  }

  /* =====================
     EVENTOS NAVEGACIÓN
  ====================== */
  navButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      if(navBar && navBar.classList.contains('is-locked')) return;

      const target = btn.dataset.screen;
      if(!NAV_ALLOWED.has(target)) return;

      showScreen(target);
    });
  });

  if(btnHome){
    btnHome.addEventListener('click', () => {
      applyBagSelection();
      showScreen('instructions');
    });
  }

  if(btnStart){
    btnStart.addEventListener('click', () => {
      showScreen('game');
      showLoader('Preparando desafío…', 'Cargando artículos');
      setTimeout(() => {
        startGame();
        hideLoader();
      }, 550);
    });
  }

  if(btnAgain){
    btnAgain.addEventListener('click', () => {
      showScreen('game');
      showLoader('Reiniciando…', 'Armando nuevo desafío');
      setTimeout(() => {
        startGame();
        hideLoader();
      }, 650);
    });
  }

  if(btnBackHome){
    btnBackHome.addEventListener('click', () => {
      resetGame();
      applyBagSelection();
      showScreen('home');
    });
  }

  // Modal: solo verificar
  if(timeUpVerify){
    timeUpVerify.addEventListener('click', () => {
      hideTimeUpModal();
      if(btnVerify) btnVerify.click();
    });
  }

  document.querySelectorAll('input[name="bagType"]').forEach(radio => {
    radio.addEventListener('change', applyBagSelection);
  });

  function applyBagSelection(){
    const selected = document.querySelector('input[name="bagType"]:checked');
    currentBagType = selected ? selected.value : "adulto";
    RULES = BAG_RULES[currentBagType] || BAG_RULES.adulto;

    MAX_WEIGHT = RULES.maxWeight;
    MAX_ARTICLES = RULES.maxArticles;

    if(homeWeightText) homeWeightText.textContent = `Máx. ${MAX_WEIGHT.toFixed(0)}kg`;
    if(homeMaxItemsText) homeMaxItemsText.textContent = `Máx. ${MAX_ARTICLES} artículos`;

    if(gameTitle) gameTitle.textContent = `Mochila de Emergencia (${RULES.label})`;
    if(gameSubtitle) gameSubtitle.textContent = `Cruz Roja Mexicana`;
  }

  /* =====================
     CONSTRUCCIÓN DE GRILLA
  ====================== */
  function buildGridForBag(){
    const goodGeneral = shuffle(GENERAL_GOOD).slice(0, 6);
    const used = new Set(goodGeneral.map(x => x.id));

    const bagPool = GOOD_BY_BAG[currentBagType] || GOOD_BY_BAG.adulto;
    const bagSpecific = shuffle(bagPool)
      .filter(x => !used.has(x.id))
      .slice(0, CORRECT_TOTAL - goodGeneral.length);

    const goodEight = [...goodGeneral, ...bagSpecific].slice(0, CORRECT_TOTAL);

    const badCount = 8;
    const badPicks = shuffle(BAD_COMMON).slice(0, badCount);

    const grid = shuffle([...goodEight, ...badPicks]);
    return { grid, correctIds: new Set(goodEight.map(x => x.id)) };
  }

  function renderGrid(list){
    if(!itemsGrid) return;
    itemsGrid.innerHTML = '';

    list.forEach(a => {
      const card = document.createElement('div');
      card.className = 'item-card';
      card.setAttribute('draggable', 'true');
      card.dataset.id = a.id;
      card.dataset.weight = a.weight;
      card.dataset.essential = a.essential ? 'true' : 'false';

      card.innerHTML = `
        <div class="item-emoji">${a.emoji}</div>
        <div class="item-name">${a.name}</div>
        <div class="item-weight">${a.weight.toFixed(1)}kg</div>
      `;

      // ✅ si ya estaba seleccionado (por seguridad), que se pinte
      if(selectedIds.has(String(a.id))) card.classList.add('is-selected');

      card.addEventListener('click', () => tryAddFromCard(card));

      card.addEventListener('dragstart', (e) => {
        if(!gameRunning || timeIsUp){ e.preventDefault(); return; }
        draggedId = card.dataset.id;
        card.classList.add('dragging');
        e.dataTransfer.effectAllowed = 'move';
        e.dataTransfer.setData('text/plain', draggedId);
      });

      card.addEventListener('dragend', () => {
        draggedId = null;
        card.classList.remove('dragging');
      });

      itemsGrid.appendChild(card);
    });

    if(finalCorrect) finalCorrect.textContent = `0/${CORRECT_TOTAL}`;
  }

  /* =====================
     UI UPDATES
  ====================== */
  function updateWeightUI(){
    if(backpackStatsEl) backpackStatsEl.textContent = `${articleCount} artículos • ${currentWeight.toFixed(1)}kg`;
    if(weightTextEl) weightTextEl.textContent = `${currentWeight.toFixed(1)}kg / ${MAX_WEIGHT.toFixed(1)}kg`;

    const pct = Math.min(100, (currentWeight / MAX_WEIGHT) * 100);
    if(weightProgressEl) weightProgressEl.style.width = `${pct}%`;

    if(hintEl) hintEl.style.display = articleCount === 0 ? 'block' : 'none';

    const chipCount = document.getElementById('chipCount');
    const chipWeight = document.getElementById('chipWeight');
    const packMeterBar = document.getElementById('packMeterBar');

    if(chipCount) chipCount.textContent = `${articleCount} artículos`;
    if(chipWeight) chipWeight.textContent = `${currentWeight.toFixed(1)} kg`;
    if(packMeterBar) packMeterBar.style.width = `${pct}%`;
  }

  function updateLivesUI(){
    if(!livesEl) return;
    livesEl.innerHTML = '';
    for(let i=0;i<MAX_LIVES;i++){
      const span = document.createElement('span');
      span.className = 'life';
      span.textContent = '❤️';
      if(i >= lives) span.classList.add('lost');
      livesEl.appendChild(span);
    }
  }

  function updatePointsUI(){ if(pointsEl) pointsEl.textContent = points; }
  function updateTimerUI(){ if(timerEl) timerEl.textContent = formatTime(timeLeft); }

  function flashZone(cls){
    if(!backpackDrop) return;
    backpackDrop.classList.add(cls);
    setTimeout(() => backpackDrop.classList.remove(cls), 250);
  }

  /* =====================
     TIMER / RESET / START
  ====================== */
  function startTimer(){
    clearInterval(timerInterval);
    timeLeft = TIME_LIMIT;
    updateTimerUI();

    timerInterval = setInterval(() => {
      if(!gameRunning) return;
      timeLeft--;
      updateTimerUI();

      if(timeLeft <= 0){
        gameRunning = false;
        timeIsUp = true;
        clearInterval(timerInterval);
        updateTimerUI();
        showTimeUpModal();
      }
    }, 1000);
  }

  function resetGame(){
    clearInterval(timerInterval);
    timerInterval = null;

    gameRunning = false;
    timeIsUp = false;

    currentWeight = 0;
    articleCount = 0;
    points = 0;
    lives = MAX_LIVES;
    timeLeft = TIME_LIMIT;

    // ✅ limpiar seleccionados y colores
    selectedIds.clear();
    if(backpackItemsEl) backpackItemsEl.innerHTML = '';
    document.querySelectorAll('.item-card.is-selected').forEach(c => c.classList.remove('is-selected'));

    hideTimeUpModal();
    hideLoader();

    updateWeightUI();
    updateLivesUI();
    updatePointsUI();
    updateTimerUI();
  }

  function startGame(){
    resetGame();

    const built = buildGridForBag();
    currentGridArticles = built.grid;
    correctIdSet = built.correctIds;

    renderGrid(currentGridArticles);

    gameRunning = true;
    timeIsUp = false;
    startTimer();
  }

  /* =====================
     MOCHILA
  ====================== */
  function loseLives(amount, reason){
    lives -= amount;
    if(lives < 0) lives = 0;

    updateLivesUI();
    flashZone('drop-error');

    if(lives <= 0){
      endGame(false, reason || 'Te quedaste sin vidas');
    }
  }

  function addBackpackRow({id, emoji, name, weight}){
    if(!backpackItemsEl) return;

    const row = document.createElement('div');
    row.className = 'backpack-item';
    row.dataset.id = id;

    row.innerHTML = `
      <div class="item-left">
        <div class="item-emoji small">${emoji}</div>
        <div class="item-details">
          <h4>${name}</h4>
          <p>${weight.toFixed(1)}kg</p>
        </div>
      </div>
      <button class="remove-item" aria-label="Quitar artículo">×</button>
    `;

    row.querySelector('.remove-item').addEventListener('click', () => {
      if(!gameRunning || timeIsUp) return;

      selectedIds.delete(String(id));
      backpackItemsEl.removeChild(row);

      // ✅ quitar gris al card
      markCardSelected(id, false);

      currentWeight -= weight;
      articleCount--;
      points = Math.max(0, points - 5);

      updateWeightUI();
      updatePointsUI();
    });

    backpackItemsEl.appendChild(row);
  }

  function tryAddFromCard(card){
    if(!gameRunning || timeIsUp) return;

    const id = card.dataset.id;

    if(selectedIds.has(String(id))){
      loseLives(1, 'Artículo repetido');
      return;
    }

    if(articleCount >= MAX_ARTICLES){
      loseLives(1, 'Mochila llena');
      return;
    }

    const weight = parseFloat(card.dataset.weight);
    const emoji = card.querySelector('.item-emoji').textContent.trim();
    const name = card.querySelector('.item-name').textContent.trim();

    if(currentWeight + weight > MAX_WEIGHT){
      loseLives(1, 'Excediste el peso máximo');
      return;
    }

    selectedIds.add(String(id));

    // ✅ poner gris al card
    markCardSelected(id, true);

    currentWeight += weight;
    articleCount++;

    const isCorrect = correctIdSet.has(id);

    points += isCorrect ? 30 : 5;

    addBackpackRow({id, emoji, name, weight});
    updateWeightUI();
    updatePointsUI();
    flashZone('drop-success');

    if(!isCorrect){
      loseLives(1, 'Agregaste un artículo incorrecto');
    }
  }

  /* =====================
     DRAG & DROP
  ====================== */
  if(backpackDrop){
    backpackDrop.addEventListener('dragover', (e) => {
      if(!gameRunning || timeIsUp) return;
      e.preventDefault();
      backpackDrop.classList.add('drop-active');
    });

    backpackDrop.addEventListener('dragleave', () => {
      backpackDrop.classList.remove('drop-active');
    });

    backpackDrop.addEventListener('drop', (e) => {
      if(!gameRunning || timeIsUp) return;
      e.preventDefault();
      backpackDrop.classList.remove('drop-active');

      const id = e.dataTransfer.getData('text/plain') || draggedId;
      if(!id) return;

      const card = document.querySelector(`.item-card[data-id="${id}"]`);
      if(!card) return;

      tryAddFromCard(card);
    });
  }

  /* =====================
     VERIFICAR / RESULTADOS
  ====================== */
  function countCorrectSelected(){
    let c = 0;
    selectedIds.forEach(id => {
      if(correctIdSet.has(id)) c++;
    });
    return c;
  }

  function countIncorrectSelected(){
    let c = 0;
    selectedIds.forEach(id => {
      if(!correctIdSet.has(id)) c++;
    });
    return c;
  }

  function endGame(endedNormally, reason){
    hideTimeUpModal();
    hideLoader();

    gameRunning = false;
    timeIsUp = false;
    clearInterval(timerInterval);

    const correctSelected = countCorrectSelected();
    const incorrectSelected = countIncorrectSelected();

    let stars = '⭐';
    if(correctSelected >= 6 && incorrectSelected === 0) stars = '⭐⭐';
    if(correctSelected === CORRECT_TOTAL && incorrectSelected === 0 && lives >= 2) stars = '⭐⭐⭐';

    points += lives * 10;
    points += Math.max(0, timeLeft);

    if(finalPoints) finalPoints.textContent = points;
    if(finalCorrect) finalCorrect.textContent = `${correctSelected}/${CORRECT_TOTAL}`;
    if(finalStars) finalStars.textContent = stars;

    if(lives <= 0){
      if(resultTitle) resultTitle.textContent = '¡Ups! Inténtalo de nuevo';
      if(resultSubtitle) resultSubtitle.textContent = 'Te quedaste sin vidas.';
    } else {
      const win = (correctSelected >= 6 && incorrectSelected === 0);
      if(resultTitle) resultTitle.textContent = win ? '¡Buen trabajo!' : 'Casi...';
      if(resultSubtitle) resultSubtitle.textContent =
        `${reason || 'Fin del juego'}. Correctos: ${correctSelected}/8, Incorrectos: ${incorrectSelected}.`;
    }

    showScreen('results');
  }

  if(btnVerify){
    btnVerify.addEventListener('click', () => {
      if(!gameRunning && !timeIsUp) return;

      showLoader('Verificando mochila…', 'Calculando resultados');

      setTimeout(() => {
        const correctSelected = countCorrectSelected();
        const incorrectSelected = countIncorrectSelected();
        const missing = Math.max(0, CORRECT_TOTAL - correctSelected);

        const penalties = missing + incorrectSelected;

        if(penalties > 0){
          lives -= penalties;
          if(lives < 0) lives = 0;
          updateLivesUI();
          flashZone('drop-error');
        }

        hideLoader();

        if(lives <= 0){
          endGame(false, 'Penalización por verificación');
          return;
        }

        endGame(true, 'Verificaste la mochila');
      }, 650);
    });
  }

  /* =====================
     INIT
  ====================== */
  applyBagSelection();
  applyNavDisabledState();
  resetGame();
  showScreen('home');
});
