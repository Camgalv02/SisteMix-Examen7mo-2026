/* ═══════════════════════════════════════════════════════
   LÓGICA DE SISTEMIX
   Necesita datos.js cargado antes (LETRAS, BANCO, GLOSARIO, UNIDADES)
   El estado compartido (nombres tomados, ranking, panel docente)
   vive en una planilla de Google, vía servidor-apps-script.gs
   ═══════════════════════════════════════════════════════ */
(function () {
  "use strict";

  /* ═══════════════════════════════════════
     CONFIGURACIÓN — EDITÁ ESTA SECCIÓN
     ═══════════════════════════════════════ */
  // URL de la aplicación web de Apps Script (termina en /exec)
  const API_URL = "https://script.google.com/macros/s/AKfycbwIUYnfOkekXAxMKEamLYRDtB1qMW0n9Y9ImoKnUoSo9Yx-mqN-691XQHsRKKBfunmAIw/exec";

  // Alumnos (se ordenan solos, ignorando emojis). Hay dos Milagros: el emoji las distingue.
  const soloLetras = s => s.replace(/[^\p{L}\s]/gu, '').trim();
  const ALUMNOS = [
    "🦦 Leonel 🦦", "🗣️ Alejandro 🗣️", "Sergio", "🐧 Micaela 🐧", "🌙 Priscila 🌙", "🌊 Adriel 🌊", "🧉 Mateo 🧉",
    "🦊 Yuliana 🦊", "💅🏻 Siomara 💅🏻", "🫪 Jorge 🫪", "🗝️ Lucas 🗝️", "🐱 Guadalupe 🐱", "🇸🇪 Humberto 🇸🇪", "♠️ Lautaro ♠️",
    "😝 Milagros 😝", "🍙 Benjamin 🍙", "🍓 Brisa 🍓", "💫 Maria José 💫", "🎵 Angela 🎵", "✌🏻 Gustavo ✌🏻",
    "💎 Bruno 💎", "🥥 Milagros 🥥", "✨ Camila ✨"
  ].map(n => n.trim())   // sin espacios sobrantes: el servidor compara los nombres tal cual
   .sort((a, b) => soloLetras(a).localeCompare(soloLetras(b), 'es'));

  const NOMBRES_CLASE = [...ALUMNOS];

  const SEG_JUEGO = 300;      // tiempo de juego (segundos): 5 minutos
  const PUNTAJE_MAX = 1000;   // equivale a nota 10
  const NOTA_APROBACION = 7;  // se aprueba con 7/10
  // La clave del panel docente ya NO está acá: se valida en el servidor.

  /* ═══════════════════════════════════════
     SERVIDOR (Google Sheets vía Apps Script)
     ═══════════════════════════════════════ */
  let PARTIDAS = [];          // última foto del servidor (formato del juego)
  let cargado = false, fallo = false;
  let ADMIN = [], claveDocente = '';

  async function api(accion, params) {
    if (!API_URL.startsWith('https://')) throw new Error('API_URL sin configurar');
    const url = API_URL + '?' + new URLSearchParams(Object.assign({ accion }, params || {}));
    const r = await fetch(url);
    return r.json();
  }

  async function cargarPartidas() {
    try {
      const d = await api('estado');
      if (!d.ok) throw new Error('estado');
      PARTIDAS = d.partidas.map(p => ({
        nombre: p.nombre, estado: p.estado,
        aciertos: +p.aciertos || 0, errores: +p.errores || 0, sinRep: +p.sin_responder || 0,
        segUsados: +p.segundos_usados || 0, segRest: +p.segundos_restantes || 0,
        precision: +p.precision_pct || 0, global: +p.puntaje_global || 0,
        completo: +p.completo === 1, fecha: p.fin || ''
      }));
      cargado = true; fallo = false;
    } catch (e) { fallo = true; }
  }
  function getJugados() { return PARTIDAS.map(p => p.nombre); }          // empezaron (jugando o terminado)
  function getScores() { return PARTIDAS.filter(p => p.estado === 'terminado'); }

  async function refrescar() {
    await cargarPartidas();
    if (!overlayInicio.classList.contains('oculto')) actualizarLobby();
    if (document.getElementById('viewRanking').classList.contains('active')) renderRanking();
    if (!overlayAdmin.classList.contains('oculto')) { try { await cargarAdmin(); } catch (e) { } }
  }

  /* ═══════════════════════════════════════
     NAVEGACIÓN
     ═══════════════════════════════════════ */
  let juegoEstado = 'esperando'; // 'esperando' | 'jugando' | 'terminado'

  function activarVista(id) {
    if (jugando && id !== 'viewJugar') return;   // no se puede salir mientras se juega
    document.querySelectorAll('.nav-tab').forEach(t => t.classList.toggle('active', t.dataset.view === id));
    document.querySelectorAll('.view').forEach(v => v.classList.toggle('active', v.id === id));
    window.scrollTo(0, 0);
    if (id === 'viewJugar' && juegoEstado === 'esperando') {
      overlayInicio.classList.remove('oculto');
      actualizarLobby();
    }
    if (id === 'viewRanking') { renderRanking(); refrescar(); }
  }
  document.querySelectorAll('.nav-tab').forEach(t => t.addEventListener('click', () => activarVista(t.dataset.view)));

  /* ═══════════════════════════════════════
     LOBBY
     ═══════════════════════════════════════ */
  const overlayInicio = document.getElementById('overlayInicio');
  const selectNombre = document.getElementById('selectNombre');
  const yaJugoMsg = document.getElementById('yaJugoMsg');
  const btnComenzar = document.getElementById('btnComenzar');
  const btnLobbyRepasar = document.getElementById('btnLobbyRepasar');
  const statJugados = document.getElementById('statJugados');
  const badgeRanking = document.getElementById('badgeRanking');

  function actualizarLobby() {
    const jugados = getJugados();
    statJugados.textContent = jugados.length + '/' + NOMBRES_CLASE.length;
    badgeRanking.textContent = jugados.length;

    const valActual = selectNombre.value;
    const disponibles = NOMBRES_CLASE.filter(n => !jugados.includes(n));
    let ph;
    if (!cargado) ph = fallo ? '— Sin conexión, reintentando… —' : '— Cargando… —';
    else ph = disponibles.length ? '— Seleccioná tu nombre —' : '— Ya jugaron todos —';
    selectNombre.innerHTML = '<option value="">' + ph + '</option>';
    if (cargado) {
      disponibles.forEach(n => {
        const opt = document.createElement('option');
        opt.value = n; opt.textContent = n;
        selectNombre.appendChild(opt);
      });
      if (valActual && disponibles.includes(valActual)) selectNombre.value = valActual;
    }
    verificarNombre();
  }

  function verificarNombre() {
    const nombre = selectNombre.value;
    const yaJugo = getJugados().includes(nombre);
    yaJugoMsg.classList.toggle('oculto', !nombre || !yaJugo);
    btnComenzar.disabled = !nombre || yaJugo;
  }

  selectNombre.addEventListener('change', verificarNombre);

  btnLobbyRepasar.addEventListener('click', () => {
    overlayInicio.classList.add('oculto');
    activarVista('viewRepasar');
  });

  btnComenzar.addEventListener('click', async () => {
    const nombre = selectNombre.value;
    if (!nombre) return;
    getAudioCtx();                 // tiene que ir antes del await (gesto del usuario)
    btnComenzar.disabled = true;
    let d;
    try { d = await api('comenzar', { nombre }); }
    catch (e) {
      alert('No hay conexión con el servidor. Probá de nuevo.');
      verificarNombre(); return;
    }
    if (!d.ok) {
      alert(d.error === 'ocupado' ? 'Ese nombre ya fue usado.' : 'No se pudo comenzar. Probá de nuevo.');
      await refrescar(); return;
    }
    iniciar(nombre);               // primero el estado pasa a 'jugando'
    overlayInicio.classList.add('oculto');
    activarVista('viewJugar');
    document.getElementById('jugadorActual').classList.remove('oculto');
    document.getElementById('nombreEnJuego').textContent = nombre;
  });

  document.getElementById('btnReiniciar').addEventListener('click', () => {
    document.getElementById('overlayFinal').classList.add('oculto');
    overlayInicio.classList.remove('oculto');
    juegoEstado = 'esperando';
    actualizarLobby();
    refrescar();
  });

  document.getElementById('btnVerRanking').addEventListener('click', () => {
    document.getElementById('overlayFinal').classList.add('oculto');
    activarVista('viewRanking');
  });

  /* ═══════════════════════════════════════
     GLOSARIO (REPASAR)
     ═══════════════════════════════════════ */
  const elFiltros = document.getElementById('letraFiltros');
  const elGrid = document.getElementById('glosarioGrid');
  const elBuscar = document.getElementById('repasoBuscar');
  let filtroActivo = '*';
  Object.keys(GLOSARIO).forEach(letra => {
    const btn = document.createElement('button'); btn.textContent = letra; btn.dataset.letra = letra;
    btn.addEventListener('click', () => cambiarFiltro(letra)); elFiltros.appendChild(btn);
  });
  elFiltros.querySelector('.btn-todas').addEventListener('click', () => cambiarFiltro('*'));
  function cambiarFiltro(l) {
    filtroActivo = l; elBuscar.value = '';
    elFiltros.querySelectorAll('button').forEach(b =>
      b.classList.toggle('activa', (l === '*' && b.classList.contains('btn-todas')) || b.dataset.letra === l));
    renderGlosario('');
  }
  function renderGlosario(q) {
    q = (q || '').toLowerCase().trim(); elGrid.innerHTML = ''; let n = 0;
    Object.keys(GLOSARIO).forEach(letra => {
      if (filtroActivo !== '*' && filtroActivo !== letra) return;
      GLOSARIO[letra].forEach(item => {
        if (q && !item.t.toLowerCase().includes(q) && !item.d.toLowerCase().includes(q)) return;
        n++;
        const est = UNIDADES[item.u] || UNIDADES['—'];
        const c = document.createElement('div'); c.className = 'term-card';
        c.innerHTML = '<div class="tc-header"><div class="tc-term">' + item.t + '</div>' +
          '<div class="tc-badge" style="background:' + est.bg + ';color:' + est.c + '">' + item.u + '</div></div>' +
          '<div class="tc-def">' + item.d + '</div>';
        elGrid.appendChild(c);
      });
    });
    if (!n) elGrid.innerHTML = '<p style="color:var(--text-dim);grid-column:1/-1;padding:12px 0">No se encontraron términos.</p>';
  }
  elBuscar.addEventListener('input', () => {
    const q = elBuscar.value.trim();
    if (q) { filtroActivo = '*'; elFiltros.querySelectorAll('button').forEach(b => b.classList.remove('activa')); elFiltros.querySelector('.btn-todas').classList.add('activa'); }
    renderGlosario(q);
  });
  renderGlosario('');

  /* ═══════════════════════════════════════
     JUEGO
     ═══════════════════════════════════════ */
  const TOTAL = LETRAS.length;
  let ronda = [], estados = new Array(TOTAL).fill("pendiente"), indiceActual = 0;
  let segRest = SEG_JUEGO, cronometro = null, jugando = false, audioCtx = null, ultimoIdx = {};
  let nombreActual = '';

  function armarRonda() {
    return LETRAS.map(l => {
      const ops = BANCO[l]; let i = 0;
      if (ops.length > 1) { do { i = Math.floor(Math.random() * ops.length); } while (i === ultimoIdx[l]); }
      ultimoIdx[l] = i;
      const e = ops[i]; return { letra: l, r: e.r, texto: e.t, respuesta: e.s, aceptadas: e.a };
    });
  }
  function getAudioCtx() { if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)(); return audioCtx; }
  function tono(f, d, tp, v) { try { const c = getAudioCtx(), o = c.createOscillator(), g = c.createGain(); o.type = tp || "sine"; o.frequency.value = f; g.gain.value = v || .06; o.connect(g); g.connect(c.destination); o.start(); g.gain.exponentialRampToValueAtTime(.0001, c.currentTime + d); o.stop(c.currentTime + d + .02); } catch (e) { } }
  function sCorrecto() { tono(880, .12, "triangle", .07); setTimeout(() => tono(1175, .15, "triangle", .07), 100); }
  function sIncorrecto() { tono(160, .25, "sawtooth", .07); }
  function sTic() { tono(700, .05, "square", .03); }
  function sFin() { tono(523, .15, "triangle", .06); setTimeout(() => tono(659, .15, "triangle", .06), 140); setTimeout(() => tono(784, .25, "triangle", .06), 280); }
  function norm(s) { return s.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/ñ/g, "n").replace(/[^a-z0-9 ]/g, "").replace(/\s+/g, " ").trim(); }

  const roscoWrap = document.getElementById("roscoWrap"), chips = [];
  LETRAS.forEach((l, i) => {
    const a = (i * (360 / TOTAL) - 90) * Math.PI / 180, rd = 44;
    const chip = document.createElement("div"); chip.className = "letra-chip";
    chip.style.left = (50 + rd * Math.cos(a)) + "%"; chip.style.top = (50 + rd * Math.sin(a)) + "%";
    chip.textContent = l; roscoWrap.appendChild(chip); chips.push(chip);
  });

  const elTimer = document.getElementById("timer"), elTipo = document.getElementById("tipoPregunta");
  const elPregunta = document.getElementById("preguntaTexto"), elResp = document.getElementById("respuesta");
  const btnComprobar = document.getElementById("btnComprobar"), btnPasa = document.getElementById("btnPasapalabra");
  const elOk = document.getElementById("numOk"), elBad = document.getElementById("numBad"), elPend = document.getElementById("numPend");

  function fmt(s) { return String(Math.floor(s / 60)).padStart(2, "0") + ":" + String(s % 60).padStart(2, "0"); }
  function pintarChips() {
    chips.forEach((c, i) => {
      c.classList.remove("current", "correcta", "incorrecta");
      if (estados[i] === "correcta") c.classList.add("correcta");
      else if (estados[i] === "incorrecta") c.classList.add("incorrecta");
      if (i === indiceActual && jugando) c.classList.add("current");
    });
  }
  function pintarPregunta() {
    const p = ronda[indiceActual];
    elTipo.textContent = p.letra + " · " + (p.r === "empieza" ? "EMPIEZA POR " : "CONTIENE LA ") + p.letra;
    elPregunta.textContent = p.texto;
  }
  function pintarMarcador() {
    const ok = estados.filter(e => e === "correcta").length,
      bad = estados.filter(e => e === "incorrecta").length,
      pend = estados.filter(e => e === "pendiente").length;
    elOk.textContent = ok; elBad.textContent = bad; elPend.textContent = pend; return { ok, bad, pend };
  }
  function pintarTodo() { pintarChips(); pintarPregunta(); pintarMarcador(); }
  function sigPendiente(desde) { for (let p = 1; p <= TOTAL; p++) { const i = (desde + p) % TOTAL; if (estados[i] === "pendiente") return i; } return -1; }

  function comprobar() {
    if (!jugando) return;
    const val = elResp.value; if (!val.trim()) return;
    const p = ronda[indiceActual], dada = norm(val);
    const ok = p.aceptadas.some(a => norm(a) === dada);
    if (ok) { estados[indiceActual] = "correcta"; sCorrecto(); }
    else {
      estados[indiceActual] = "incorrecta"; sIncorrecto();
      chips[indiceActual].classList.add("sacude");
      setTimeout(() => chips[indiceActual].classList.remove("sacude"), 350);
    }
    elResp.value = ""; avanzar();
  }
  function pasar() { if (!jugando) return; elResp.value = ""; const s = sigPendiente(indiceActual); if (s === -1) return; indiceActual = s; pintarTodo(); elResp.focus(); }
  function avanzar() { pintarTodo(); const s = sigPendiente(indiceActual); if (s === -1) { terminar("completo"); return; } indiceActual = s; pintarTodo(); elResp.focus(); }
  function tick() {
    segRest--; elTimer.textContent = fmt(Math.max(segRest, 0));
    if (segRest <= 10 && segRest > 0) { elTimer.classList.add("urgente"); sTic(); }
    if (segRest <= 0) terminar("tiempo");
  }

  function iniciar(nombre) {
    nombreActual = nombre;
    ronda = armarRonda(); estados = new Array(TOTAL).fill("pendiente");
    indiceActual = 0; segRest = SEG_JUEGO; jugando = true; juegoEstado = 'jugando';
    elResp.disabled = false; btnComprobar.disabled = false; btnPasa.disabled = false;
    elTimer.classList.remove("urgente"); elTimer.textContent = fmt(segRest);
    pintarTodo(); elResp.focus();
    if (cronometro) clearInterval(cronometro);
    cronometro = setInterval(tick, 1000);
    document.getElementById('mainNav').classList.add('bloqueado');
  }

  // 1000 puntos = nota 10; cada letra vale 1000/27. Errar no resta.
  function calcularPuntaje(ok) {
    return Math.round(ok * PUNTAJE_MAX / TOTAL);
  }

  // Envía el resultado al servidor (reintenta si falla la conexión)
  async function enviarResultado(nombre, ok, bad, pend) {
    for (let i = 0; i < 4; i++) {
      try {
        const d = await api('terminar', { nombre, aciertos: ok, errores: bad, sin_responder: pend });
        if (d.ok) return true;
        if (d.error === 'no_jugando' || d.error === 'no_existe' || d.error === 'datos') break;
      } catch (e) { }
      await new Promise(r => setTimeout(r, 2000));
    }
    alert('⚠️ No se pudo guardar tu resultado en el servidor.\nNo cierres la página y avisale a la docente.\n' +
      'Tu resultado: ' + ok + ' aciertos, ' + bad + ' errores, ' + pend + ' sin responder.');
    return false;
  }

  function terminar(motivo) {
    jugando = false; juegoEstado = 'terminado';
    document.getElementById('mainNav').classList.remove('bloqueado');
    if (cronometro) clearInterval(cronometro);
    elResp.disabled = true; btnComprobar.disabled = true; btnPasa.disabled = true;
    pintarChips(); sFin();
    const { ok, bad, pend } = pintarMarcador();
    const global = calcularPuntaje(ok);
    mostrarResultados(motivo, ok, bad, pend, global);
    enviarResultado(nombreActual, ok, bad, pend).then(refrescar);
  }

  function mostrarResultados(motivo, ok, bad, pend, global) {
    const notaNum = ok * 10 / TOTAL;
    const nota = notaNum.toFixed(1);
    let titulo, color;
    if (ok === TOTAL) { titulo = "¡PERFECTO! 🏆"; color = "var(--green)"; }
    else if (notaNum >= NOTA_APROBACION) { titulo = "¡APROBADO! 👏"; color = "var(--green)"; }
    else if (notaNum >= 5) { titulo = "TE FALTÓ UN POCO 📖"; color = "var(--gold)"; }
    else { titulo = "A REPASAR 📚"; color = "var(--red)"; }
    const h = document.getElementById("tituloFinal");
    h.textContent = titulo; h.style.color = color; h.style.textShadow = "0 0 12px " + color;
    document.getElementById("puntajeFinal").textContent = global + " / " + PUNTAJE_MAX;
    document.querySelector(".puntaje-label").textContent =
      "PUNTAJE · NOTA " + nota + (motivo === "tiempo" ? " · TIEMPO AGOTADO ⏰" : "");
    document.getElementById("finalOk").innerHTML = ok + "<small>ACIERTOS</small>";
    document.getElementById("finalBad").innerHTML = bad + "<small>ERRORES</small>";
    document.getElementById("finalPend").innerHTML = pend + "<small>SIN RESPONDER</small>";
    const lista = document.getElementById("listaRespuestas"); lista.innerHTML = "";
    ronda.forEach((p, i) => {
      const est = estados[i], fila = document.createElement("div");
      fila.className = "fila-resp " + (est === "correcta" ? "ok" : est === "incorrecta" ? "bad" : "pend");
      fila.innerHTML = '<div class="letra-icono">' + p.letra + ' ' + (est === "correcta" ? "✅" : est === "incorrecta" ? "❌" : "⏳") + '</div>' +
        '<div class="detalle">Respuesta: <b>' + p.respuesta + '</b></div>';
      lista.appendChild(fila);
    });
    document.getElementById("overlayFinal").classList.remove("oculto");
  }

  btnComprobar.addEventListener("click", comprobar);
  btnPasa.addEventListener("click", pasar);
  elResp.addEventListener("keydown", e => { if (e.key === "Enter") { e.preventDefault(); comprobar(); } });

  /* ═══════════════════════════════════════
     RANKING
     ═══════════════════════════════════════ */
  let modoRanking = 'global';
  const MEDALLAS = ['🥇', '🥈', '🥉'];
  const TOP_CLASES = ['top1', 'top2', 'top3'];

  function renderRanking() {
    const scores = getScores();
    const jugados = getJugados();
    document.getElementById('rkSubtitulo').textContent =
      !cargado ? (fallo ? 'Sin conexión con el servidor…' : 'Cargando…')
        : jugados.length + ' de ' + NOMBRES_CLASE.length + ' jugadores han jugado';
    badgeRanking.textContent = jugados.length;

    if (!scores.length) {
      document.getElementById('rkLista').innerHTML = '<div class="rk-empty">Todavía nadie terminó. ¡Que empiece el juego!</div>';
      return;
    }

    let sorted;
    if (modoRanking === 'aciertos') {
      sorted = [...scores].sort((a, b) => b.aciertos - a.aciertos || a.errores - b.errores);
    } else if (modoRanking === 'precision') {
      sorted = [...scores].sort((a, b) => (b.precision || 0) - (a.precision || 0));
    } else {
      sorted = [...scores].sort((a, b) => b.global - a.global || a.segUsados - b.segUsados);
    }
    const lista = document.getElementById('rkLista'); lista.innerHTML = '';
    sorted.forEach((s, i) => {
      const div = document.createElement('div');
      div.className = 'rk-fila' + (i < 3 ? ' ' + TOP_CLASES[i] : '');
      const pos = i < 3 ? MEDALLAS[i] : '#' + (i + 1);
      const minSeg = Math.floor(s.segUsados / 60), secSeg = String(s.segUsados % 60).padStart(2, '0');
      const tiempoStr = minSeg + ':' + secSeg;

      let valPrincipal;
      if (modoRanking === 'aciertos') { valPrincipal = s.aciertos + '/27'; }
      else if (modoRanking === 'precision') { valPrincipal = (s.precision || 0) + '%'; }
      else { valPrincipal = s.global + ' pts'; }

      div.innerHTML = '<div class="rk-pos">' + pos + '</div>' +
        '<div class="rk-nombre">' + s.nombre + '</div>' +
        '<div class="rk-val-main">' + valPrincipal + '</div>' +
        '<div class="rk-stats">' +
        '<div class="rk-stat"><span>ACIERTOS</span><strong>' + s.aciertos + '</strong></div>' +
        '<div class="rk-stat"><span>ERRORES</span><strong>' + s.errores + '</strong></div>' +
        '<div class="rk-stat"><span>TIEMPO</span><strong>' + tiempoStr + '</strong></div>' +
        '<div class="rk-stat"><span>GLOBAL</span><strong>' + s.global + '</strong></div>' +
        '</div>';
      lista.appendChild(div);
    });
  }

  document.getElementById('rkTabs').querySelectorAll('.rtab').forEach(btn => {
    btn.addEventListener('click', () => {
      document.getElementById('rkTabs').querySelectorAll('.rtab').forEach(b => b.classList.remove('activo'));
      btn.classList.add('activo');
      modoRanking = btn.dataset.modo;
      renderRanking();
    });
  });

  /* ═══════════════════════════════════════
     PANEL DOCENTE (la clave se valida en el servidor)
     ═══════════════════════════════════════ */
  const overlayClave = document.getElementById('overlayClave');
  const inputClave = document.getElementById('inputClave');
  const claveError = document.getElementById('claveError');
  const overlayAdmin = document.getElementById('overlayAdmin');

  function abrirPedidoClave() {
    inputClave.value = ''; claveError.textContent = '';
    overlayClave.classList.remove('oculto');
    setTimeout(() => inputClave.focus(), 50);
  }
  function cerrarPedidoClave() {
    overlayClave.classList.add('oculto');
    inputClave.value = ''; claveError.textContent = '';
  }

  async function cargarAdmin() {
    const d = await api('admin', { clave: claveDocente });
    if (d.ok) { ADMIN = d.partidas; renderAdmin(); }
    return d.ok;
  }

  async function verificarClave() {
    claveDocente = inputClave.value;
    claveError.textContent = 'Verificando…';
    try {
      const ok = await cargarAdmin();
      if (ok) {
        cerrarPedidoClave();
        overlayAdmin.classList.remove('oculto');
      } else {
        claveDocente = ''; claveError.textContent = 'Clave incorrecta. Probá de nuevo.';
        inputClave.value = ''; inputClave.focus();
      }
    } catch (e) {
      claveDocente = ''; claveError.textContent = 'Sin conexión con el servidor. Probá de nuevo.';
    }
  }
  document.getElementById('btnAbrirLock').addEventListener('click', abrirPedidoClave);
  document.getElementById('btnEntrarClave').addEventListener('click', verificarClave);
  document.getElementById('btnCancelarClave').addEventListener('click', cerrarPedidoClave);
  inputClave.addEventListener('keydown', e => { if (e.key === 'Enter') { e.preventDefault(); verificarClave(); } });

  document.getElementById('btnCerrarAdmin').addEventListener('click', () => {
    overlayAdmin.classList.add('oculto');
    claveDocente = ''; ADMIN = [];
  });

  document.getElementById('btnResetTodo').addEventListener('click', async () => {
    if (!confirm('¿Resetear TODOS los jugadores? Se borrarán todos los puntajes.')) return;
    try {
      const d = await api('resetear_todo', { clave: claveDocente });
      if (!d.ok) { alert('No se pudo resetear.'); return; }
      await cargarAdmin(); await refrescar();
      alert('Reseteo completo. Todos pueden jugar de nuevo.');
    } catch (e) { alert('Sin conexión con el servidor.'); }
  });

  /* CSV: baja los datos actuales del servidor (también podés bajarlo desde la planilla) */
  document.getElementById('btnExportCSV').addEventListener('click', async () => {
    await cargarPartidas();
    const scores = getScores();
    if (!scores.length) { alert('No hay datos para exportar aún.'); return; }
    const SEP = ';';
    const q = v => '"' + String(v).replace(/"/g, '""') + '"';
    const cols = ['nombre', 'aciertos', 'errores', 'sin_responder', 'segundos_usados', 'segundos_restantes', 'precision_pct', 'puntaje_global', 'completo', 'fecha'];
    const rows = scores.map(s => [
      q(s.nombre), s.aciertos, s.errores, s.sinRep, s.segUsados, s.segRest,
      s.precision, s.global, s.completo ? 1 : 0, s.fecha
    ].join(SEP));
    const csv = [cols.join(SEP), ...rows].join('\n');
    const a = document.createElement('a');
    a.href = URL.createObjectURL(new Blob(['\ufeff' + csv], { type: 'text/csv;charset=utf-8;' }));
    a.download = 'sistemix_resultados.csv'; a.click();
  });

  function renderAdmin() {
    const lista = document.getElementById('adminLista');
    lista.innerHTML = '';
    if (!ADMIN.length) {
      lista.innerHTML = '<p style="color:var(--text-dim);font-size:.82rem;padding:8px">Nadie ha jugado todavía.</p>';
      return;
    }
    [...ADMIN].sort((a, b) => soloLetras(a.nombre).localeCompare(soloLetras(b.nombre), 'es')).forEach(p => {
      let estado;
      if (p.estado === 'terminado') estado = p.puntaje_global + ' pts · ' + p.aciertos + '✅';
      else {
        const seg = (Date.now() - new Date(p.inicio).getTime()) / 1000;
        estado = seg > SEG_JUEGO + 30 ? '⚠️ sin métricas' : '⏳ jugando…';
      }
      const div = document.createElement('div'); div.className = 'admin-fila';
      div.innerHTML = '<span class="af-nombre">' + p.nombre + '</span>' +
        '<span class="af-pts">' + estado + '</span>' +
        '<button>Resetear</button>';
      div.querySelector('button').addEventListener('click', async () => {
        if (!confirm('¿Resetear a ' + p.nombre + '? Podrá jugar de nuevo.')) return;
        try {
          const d = await api('resetear', { nombre: p.nombre, clave: claveDocente });
          if (!d.ok) { alert('No se pudo resetear.'); return; }
          await cargarAdmin(); await refrescar();
        } catch (e) { alert('Sin conexión con el servidor.'); }
      });
      lista.appendChild(div);
    });
  }

  /* ═══════════════════════════════════════
     INIT
     ═══════════════════════════════════════ */
  pintarChips(); pintarMarcador(); actualizarLobby();
  refrescar();
  setInterval(() => { if (!jugando) refrescar(); }, 8000);

})();
