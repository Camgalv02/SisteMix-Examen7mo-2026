/* ═══════════════════════════════════════════════════════
   LÓGICA DEL ROSCO
   Necesita datos.js cargado antes (LETRAS, BANCO, GLOSARIO, UNIDADES)
   ═══════════════════════════════════════════════════════ */
(function(){"use strict";

/* ═══════════════════════════════════════
   CONFIGURACIÓN — EDITÁ ESTA SECCIÓN
   ═══════════════════════════════════════ */
// Alumnos (se ordenan solos). Hay dos Milagros: cambiá la marca por la inicial del apellido si querés.
const soloLetras = s => s.replace(/[^\p{L}\s]/gu,'').trim();
const ALUMNOS = [
   "🦦 Leonel 🦦","Alejandro","Sergio","🐧 Micaela 🐧","🌙 Priscila 🌙","🌊 Adriel 🌊","Mateo",
  "🦊 Yuliana 🦊","💅🏻 Siomara 💅🏻","🫪 Jorge 🫪","Lucas","🐱 Guadalupe 🐱","🇸🇪 Humberto 🇸🇪"," ♠️ Lautaro ♠️",
  "😝 Milagros 😝","🍙 Benjamin 🍙","🍓 Brisa 🍓","💫 Maria José 💫","🎵 Angela 🎵","✌🏻Gustavo ✌🏻",
  "💎 Bruno 💎","🥥 Milagros 🥥","✨ Camila ✨"
].sort((a,b)=>soloLetras(a).localeCompare(soloLetras(b),'es'));

const NOMBRES_CLASE = [...ALUMNOS];

// Tiempo fijo de juego (segundos)
const SEG_JUEGO = 300; // 5 minutos

// Clave del panel docente (🔒 en la solapa Ranking)
const CLAVE_DOCENTE = "la clave";

/* ═══════════════════════════════════════
   LOCAL STORAGE
   ═══════════════════════════════════════ */
const LS_SCORES  = 'rosco_scores';
const LS_JUGADOS = 'rosco_jugados';

function lsGet(key,def){ try{const v=localStorage.getItem(key);return v?JSON.parse(v):def;}catch(e){return def;} }
function lsSet(key,val){ try{localStorage.setItem(key,JSON.stringify(val));}catch(e){} }

function getJugados(){ return lsGet(LS_JUGADOS,[]); }
function getScores(){  return lsGet(LS_SCORES,[]); }
function marcarJugado(nombre){ const j=getJugados(); if(!j.includes(nombre)){j.push(nombre); lsSet(LS_JUGADOS,j);} }
function guardarScore(entry){  const s=getScores(); s.push(entry); lsSet(LS_SCORES,s); }
function resetNombre(nombre){
  lsSet(LS_JUGADOS, getJugados().filter(n=>n!==nombre));
  lsSet(LS_SCORES,  getScores().filter(s=>s.nombre!==nombre));
}
function resetTodo(){ lsSet(LS_JUGADOS,[]); lsSet(LS_SCORES,[]); }

/* ═══════════════════════════════════════
   NAVEGACIÓN
   ═══════════════════════════════════════ */
let juegoEstado = 'esperando'; // 'esperando' | 'jugando' | 'terminado'

function activarVista(id){
  document.querySelectorAll('.nav-tab').forEach(t=>t.classList.toggle('active',t.dataset.view===id));
  document.querySelectorAll('.view').forEach(v=>v.classList.toggle('active',v.id===id));
  window.scrollTo(0,0);
  if(id==='viewJugar' && juegoEstado==='esperando'){
    overlayInicio.classList.remove('oculto');
    actualizarLobby();
  }
  if(id==='viewRanking'){ renderRanking(); }
}
document.querySelectorAll('.nav-tab').forEach(t=>t.addEventListener('click',()=>activarVista(t.dataset.view)));

/* ═══════════════════════════════════════
   LOBBY
   ═══════════════════════════════════════ */
const overlayInicio  = document.getElementById('overlayInicio');
const selectNombre   = document.getElementById('selectNombre');
const yaJugoMsg      = document.getElementById('yaJugoMsg');
const btnComenzar    = document.getElementById('btnComenzar');
const btnLobbyRepasar= document.getElementById('btnLobbyRepasar');
const statJugados    = document.getElementById('statJugados');
const badgeRanking   = document.getElementById('badgeRanking');

function actualizarLobby(){
  const jugados = getJugados();
  const total   = NOMBRES_CLASE.length;
  statJugados.textContent = jugados.length+'/'+total;
  badgeRanking.textContent = jugados.length;

  const valActual = selectNombre.value;
  selectNombre.innerHTML = '<option value="">— Seleccioná tu nombre —</option>';
  NOMBRES_CLASE.forEach(n=>{
    const opt=document.createElement('option');
    opt.value=n; opt.textContent=n;
    if(jugados.includes(n)) opt.textContent += ' ✓';
    selectNombre.appendChild(opt);
  });
  if(valActual) selectNombre.value = valActual;
  verificarNombre();
}

function verificarNombre(){
  const nombre = selectNombre.value;
  const jugados = getJugados();
  const yaJugo  = jugados.includes(nombre);
  yaJugoMsg.classList.toggle('oculto', !nombre || !yaJugo);
  btnComenzar.disabled = !nombre || yaJugo;
}

selectNombre.addEventListener('change', verificarNombre);

btnLobbyRepasar.addEventListener('click',()=>{
  overlayInicio.classList.add('oculto');
  activarVista('viewRepasar');
});

btnComenzar.addEventListener('click',()=>{
  const nombre = selectNombre.value;
  if(!nombre || getJugados().includes(nombre)) return;
  getAudioCtx();
  marcarJugado(nombre);
  overlayInicio.classList.add('oculto');
  activarVista('viewJugar');
  document.getElementById('jugadorActual').classList.remove('oculto');
  document.getElementById('nombreEnJuego').textContent = nombre;
  iniciar(nombre);
});

document.getElementById('btnReiniciar').addEventListener('click',()=>{
  document.getElementById('overlayFinal').classList.add('oculto');
  overlayInicio.classList.remove('oculto');
  juegoEstado='esperando';
  actualizarLobby();
});

document.getElementById('btnVerRanking').addEventListener('click',()=>{
  document.getElementById('overlayFinal').classList.add('oculto');
  activarVista('viewRanking');
});

/* ═══════════════════════════════════════
   GLOSARIO (REPASAR)
   ═══════════════════════════════════════ */
const elFiltros=document.getElementById('letraFiltros');
const elGrid=document.getElementById('glosarioGrid');
const elBuscar=document.getElementById('repasoBuscar');
let filtroActivo='*';
Object.keys(GLOSARIO).forEach(letra=>{
  const btn=document.createElement('button'); btn.textContent=letra; btn.dataset.letra=letra;
  btn.addEventListener('click',()=>cambiarFiltro(letra)); elFiltros.appendChild(btn);
});
elFiltros.querySelector('.btn-todas').addEventListener('click',()=>cambiarFiltro('*'));
function cambiarFiltro(l){
  filtroActivo=l; elBuscar.value='';
  elFiltros.querySelectorAll('button').forEach(b=>
    b.classList.toggle('activa',(l==='*'&&b.classList.contains('btn-todas'))||b.dataset.letra===l));
  renderGlosario('');
}
function renderGlosario(q){
  q=(q||'').toLowerCase().trim(); elGrid.innerHTML=''; let n=0;
  Object.keys(GLOSARIO).forEach(letra=>{
    if(filtroActivo!=='*'&&filtroActivo!==letra) return;
    GLOSARIO[letra].forEach(item=>{
      if(q&&!item.t.toLowerCase().includes(q)&&!item.d.toLowerCase().includes(q)) return;
      n++;
      const est=UNIDADES[item.u]||UNIDADES['—'];
      const c=document.createElement('div'); c.className='term-card';
      c.innerHTML='<div class="tc-header"><div class="tc-term">'+item.t+'</div>'+
        '<div class="tc-badge" style="background:'+est.bg+';color:'+est.c+'">'+item.u+'</div></div>'+
        '<div class="tc-def">'+item.d+'</div>';
      elGrid.appendChild(c);
    });
  });
  if(!n) elGrid.innerHTML='<p style="color:var(--text-dim);grid-column:1/-1;padding:12px 0">No se encontraron términos.</p>';
}
elBuscar.addEventListener('input',()=>{
  const q=elBuscar.value.trim();
  if(q){filtroActivo='*';elFiltros.querySelectorAll('button').forEach(b=>b.classList.remove('activa'));elFiltros.querySelector('.btn-todas').classList.add('activa');}
  renderGlosario(q);
});
renderGlosario('');

/* ═══════════════════════════════════════
   PDF
   ═══════════════════════════════════════ */
const pdfInput=document.getElementById('pdfInput'),pdfDropzone=document.getElementById('pdfDropzone');
const pdfLista=document.getElementById('pdfLista'),pdfOverlay=document.getElementById('pdfOverlay');
const pdfFrame=document.getElementById('pdfFrame'),pdfNombre=document.getElementById('pdfNombre');
let pdfs=[];
pdfDropzone.addEventListener('dragover',e=>{e.preventDefault();pdfDropzone.classList.add('drag-over');});
pdfDropzone.addEventListener('dragleave',()=>pdfDropzone.classList.remove('drag-over'));
pdfDropzone.addEventListener('drop',e=>{e.preventDefault();pdfDropzone.classList.remove('drag-over');addPDFs(e.dataTransfer.files);});
pdfInput.addEventListener('change',()=>{addPDFs(pdfInput.files);pdfInput.value='';});
function addPDFs(files){
  Array.from(files).forEach(f=>{
    if(!f.name.endsWith('.pdf')&&!f.type.includes('pdf')) return;
    const url=URL.createObjectURL(f),idx=pdfs.length; pdfs.push({nombre:f.name,url});
    const chip=document.createElement('div'); chip.className='pdf-chip';
    chip.innerHTML='<span>📄</span><span class="pdf-name">'+f.name+'</span><span class="pdf-close">✕</span>';
    chip.addEventListener('click',e=>{if(!e.target.classList.contains('pdf-close')) abrirPDF(idx);});
    chip.querySelector('.pdf-close').addEventListener('click',e=>{
      e.stopPropagation(); URL.revokeObjectURL(pdfs[idx].url); pdfs[idx]=null; chip.remove();});
    pdfLista.appendChild(chip);
  });
}
function abrirPDF(i){if(!pdfs[i]) return; pdfNombre.textContent=pdfs[i].nombre; pdfFrame.src=pdfs[i].url; pdfOverlay.classList.remove('oculto');}
document.getElementById('pdfCerrar').addEventListener('click',()=>{pdfOverlay.classList.add('oculto');pdfFrame.src='';});

/* ═══════════════════════════════════════
   ROSCO: JUEGO
   ═══════════════════════════════════════ */
const TOTAL=LETRAS.length;
let ronda=[],estados=new Array(TOTAL).fill("pendiente"),indiceActual=0;
let segRest=SEG_JUEGO,cronometro=null,jugando=false,audioCtx=null,ultimoIdx={};
let nombreActual='';

function armarRonda(){
  return LETRAS.map(l=>{
    const ops=BANCO[l]; let i=0;
    if(ops.length>1){do{i=Math.floor(Math.random()*ops.length);}while(i===ultimoIdx[l]);}
    ultimoIdx[l]=i;
    const e=ops[i]; return{letra:l,r:e.r,texto:e.t,respuesta:e.s,aceptadas:e.a};
  });
}
function getAudioCtx(){if(!audioCtx) audioCtx=new(window.AudioContext||window.webkitAudioContext)(); return audioCtx;}
function tono(f,d,tp,v){try{const c=getAudioCtx(),o=c.createOscillator(),g=c.createGain();o.type=tp||"sine";o.frequency.value=f;g.gain.value=v||.06;o.connect(g);g.connect(c.destination);o.start();g.gain.exponentialRampToValueAtTime(.0001,c.currentTime+d);o.stop(c.currentTime+d+.02);}catch(e){}}
function sCorrecto(){tono(880,.12,"triangle",.07);setTimeout(()=>tono(1175,.15,"triangle",.07),100);}
function sIncorrecto(){tono(160,.25,"sawtooth",.07);}
function sTic(){tono(700,.05,"square",.03);}
function sFin(){tono(523,.15,"triangle",.06);setTimeout(()=>tono(659,.15,"triangle",.06),140);setTimeout(()=>tono(784,.25,"triangle",.06),280);}
function norm(s){return s.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g,"").replace(/ñ/g,"n").replace(/[^a-z0-9 ]/g,"").replace(/\s+/g," ").trim();}

const roscoWrap=document.getElementById("roscoWrap"),chips=[];
LETRAS.forEach((l,i)=>{
  const a=(i*(360/TOTAL)-90)*Math.PI/180,rd=44;
  const chip=document.createElement("div"); chip.className="letra-chip";
  chip.style.left=(50+rd*Math.cos(a))+"%"; chip.style.top=(50+rd*Math.sin(a))+"%";
  chip.textContent=l; roscoWrap.appendChild(chip); chips.push(chip);
});

const elTimer=document.getElementById("timer"),elTipo=document.getElementById("tipoPregunta");
const elPregunta=document.getElementById("preguntaTexto"),elResp=document.getElementById("respuesta");
const btnComprobar=document.getElementById("btnComprobar"),btnPasa=document.getElementById("btnPasapalabra");
const elOk=document.getElementById("numOk"),elBad=document.getElementById("numBad"),elPend=document.getElementById("numPend");

function fmt(s){return String(Math.floor(s/60)).padStart(2,"0")+":"+String(s%60).padStart(2,"0");}
function pintarChips(){chips.forEach((c,i)=>{
  c.classList.remove("current","correcta","incorrecta");
  if(estados[i]==="correcta") c.classList.add("correcta");
  else if(estados[i]==="incorrecta") c.classList.add("incorrecta");
  if(i===indiceActual&&jugando) c.classList.add("current");
});}
function pintarPregunta(){const p=ronda[indiceActual];
  elTipo.textContent=p.letra+" · "+(p.r==="empieza"?"EMPIEZA POR ":"CONTIENE LA ")+p.letra;
  elPregunta.textContent=p.texto;}
function pintarMarcador(){
  const ok=estados.filter(e=>e==="correcta").length,
        bad=estados.filter(e=>e==="incorrecta").length,
        pend=estados.filter(e=>e==="pendiente").length;
  elOk.textContent=ok;elBad.textContent=bad;elPend.textContent=pend;return{ok,bad,pend};}
function pintarTodo(){pintarChips();pintarPregunta();pintarMarcador();}
function sigPendiente(desde){for(let p=1;p<=TOTAL;p++){const i=(desde+p)%TOTAL;if(estados[i]==="pendiente") return i;} return -1;}

function comprobar(){
  if(!jugando) return;
  const val=elResp.value; if(!val.trim()) return;
  const p=ronda[indiceActual],dada=norm(val);
  const ok=p.aceptadas.some(a=>norm(a)===dada);
  if(ok){estados[indiceActual]="correcta";sCorrecto();}
  else{estados[indiceActual]="incorrecta";sIncorrecto();
    chips[indiceActual].classList.add("sacude");
    setTimeout(()=>chips[indiceActual].classList.remove("sacude"),350);}
  elResp.value=""; avanzar();
}
function pasar(){if(!jugando) return; elResp.value=""; const s=sigPendiente(indiceActual); if(s===-1) return; indiceActual=s; pintarTodo(); elResp.focus();}
function avanzar(){pintarTodo(); const s=sigPendiente(indiceActual); if(s===-1){terminar("completo");return;} indiceActual=s; pintarTodo(); elResp.focus();}
function tick(){segRest--; elTimer.textContent=fmt(Math.max(segRest,0));
  if(segRest<=10&&segRest>0){elTimer.classList.add("urgente");sTic();}
  if(segRest<=0) terminar("tiempo");}

function iniciar(nombre){
  nombreActual=nombre;
  ronda=armarRonda(); estados=new Array(TOTAL).fill("pendiente");
  indiceActual=0; segRest=SEG_JUEGO; jugando=true; juegoEstado='jugando';
  elResp.disabled=false; btnComprobar.disabled=false; btnPasa.disabled=false;
  elTimer.classList.remove("urgente"); elTimer.textContent=fmt(segRest);
  pintarTodo(); elResp.focus();
  if(cronometro) clearInterval(cronometro);
  cronometro=setInterval(tick,1000);
}

function calcularPuntaje(ok,bad,rest){
  const base=Math.max(ok*10-bad*3,0);
  return base + Math.floor(rest/3); // hasta ~100 pts de bonus por velocidad
}

function terminar(motivo){
  jugando=false; juegoEstado='terminado';
  if(cronometro) clearInterval(cronometro);
  elResp.disabled=true; btnComprobar.disabled=true; btnPasa.disabled=true;
  pintarChips(); sFin();
  const{ok,bad,pend}=pintarMarcador();
  const segUsados=SEG_JUEGO-segRest;
  const global=calcularPuntaje(ok,bad,segRest);
  const precision=ok+bad>0?Math.round(ok/(ok+bad)*100):0;
  const velocidad=segUsados>0?Math.round(ok/segUsados*60*10)/10:0; // aciertos/min
  guardarScore({nombre:nombreActual,aciertos:ok,errores:bad,sinRep:pend,
    segUsados,segRest,global,precision,velocidad,
    completo:motivo==="completo",fecha:new Date().toISOString()});
  actualizarLobby();
  mostrarResultados(motivo,ok,bad,pend,global);
}

function mostrarResultados(motivo,ok,bad,pend,global){
  document.getElementById("tituloFinal").textContent=motivo==="completo"?"¡ROSCO COMPLETO! 🎉":"¡SE ACABÓ EL TIEMPO! ⏰";
  document.getElementById("puntajeFinal").textContent=global+" pts";
  document.getElementById("finalOk").innerHTML=ok+"<small>ACIERTOS</small>";
  document.getElementById("finalBad").innerHTML=bad+"<small>ERRORES</small>";
  document.getElementById("finalPend").innerHTML=pend+"<small>SIN RESPONDER</small>";
  const lista=document.getElementById("listaRespuestas"); lista.innerHTML="";
  ronda.forEach((p,i)=>{
    const est=estados[i],fila=document.createElement("div");
    fila.className="fila-resp "+(est==="correcta"?"ok":est==="incorrecta"?"bad":"pend");
    fila.innerHTML='<div class="letra-icono">'+p.letra+'<br>'+(est==="correcta"?"✅":est==="incorrecta"?"❌":"⏳")+'</div>'+
      '<div class="detalle">Respuesta: <b>'+p.respuesta+'</b></div>';
    lista.appendChild(fila);
  });
  document.getElementById("overlayFinal").classList.remove("oculto");
}

btnComprobar.addEventListener("click",comprobar);
btnPasa.addEventListener("click",pasar);
elResp.addEventListener("keydown",e=>{if(e.key==="Enter"){e.preventDefault();comprobar();}});

/* ═══════════════════════════════════════
   RANKING
   ═══════════════════════════════════════ */
let modoRanking='global';
const MEDALLAS=['🥇','🥈','🥉'];
const TOP_CLASES=['top1','top2','top3'];

function renderRanking(){
  const scores=getScores();
  const jugados=getJugados();
  const total=NOMBRES_CLASE.length;
  document.getElementById('rkSubtitulo').textContent=
    jugados.length+' de '+total+' jugadores han jugado';
  badgeRanking.textContent=jugados.length;

  if(!scores.length){
    document.getElementById('rkLista').innerHTML='<div class="rk-empty">Todavía nadie jugó. ¡Que empiece el juego!</div>';
    return;
  }

  let sorted;
  if(modoRanking==='aciertos'){
    sorted=[...scores].sort((a,b)=>b.aciertos-a.aciertos||a.errores-b.errores);
  } else if(modoRanking==='velocidad'){
    sorted=[...scores].sort((a,b)=>(b.velocidad||0)-(a.velocidad||0));
  } else if(modoRanking==='precision'){
    sorted=[...scores].sort((a,b)=>(b.precision||0)-(a.precision||0));
  } else {
    sorted=[...scores].sort((a,b)=>b.global-a.global);
  }

  const lista=document.getElementById('rkLista'); lista.innerHTML='';
  sorted.forEach((s,i)=>{
    const div=document.createElement('div');
    div.className='rk-fila'+(i<3?' '+TOP_CLASES[i]:'');
    const pos=i<3?MEDALLAS[i]:'#'+(i+1);
    const minSeg=Math.floor(s.segUsados/60),secSeg=String(s.segUsados%60).padStart(2,'0');
    const tiempoStr=minSeg+':'+secSeg;

    let valPrincipal;
    if(modoRanking==='aciertos'){valPrincipal=s.aciertos+'/27';}
    else if(modoRanking==='velocidad'){valPrincipal=(s.velocidad||0).toFixed(1)+'/min';}
    else if(modoRanking==='precision'){valPrincipal=(s.precision||0)+'%';}
    else{valPrincipal=s.global+' pts';}

    div.innerHTML='<div class="rk-pos">'+pos+'</div>'+
      '<div class="rk-nombre">'+s.nombre+'</div>'+
      '<div class="rk-val-main">'+valPrincipal+'</div>'+
      '<div class="rk-stats">'+
        '<div class="rk-stat"><span>ACIERTOS</span><strong>'+s.aciertos+'</strong></div>'+
        '<div class="rk-stat"><span>ERRORES</span><strong>'+s.errores+'</strong></div>'+
        '<div class="rk-stat"><span>TIEMPO</span><strong>'+tiempoStr+'</strong></div>'+
        '<div class="rk-stat"><span>GLOBAL</span><strong>'+s.global+'</strong></div>'+
      '</div>';
    lista.appendChild(div);
  });
}

document.getElementById('rkTabs').querySelectorAll('.rtab').forEach(btn=>{
  btn.addEventListener('click',()=>{
    document.getElementById('rkTabs').querySelectorAll('.rtab').forEach(b=>b.classList.remove('activo'));
    btn.classList.add('activo');
    modoRanking=btn.dataset.modo;
    renderRanking();
  });
});

/* ═══════════════════════════════════════
   PANEL DOCENTE (protegido con clave)
   ═══════════════════════════════════════ */
const overlayClave = document.getElementById('overlayClave');
const inputClave   = document.getElementById('inputClave');
const claveError   = document.getElementById('claveError');
const overlayAdmin = document.getElementById('overlayAdmin');

function abrirPedidoClave(){
  inputClave.value=''; claveError.textContent='';
  overlayClave.classList.remove('oculto');
  setTimeout(()=>inputClave.focus(),50);
}
function cerrarPedidoClave(){
  overlayClave.classList.add('oculto');
  inputClave.value=''; claveError.textContent='';
}
function verificarClave(){
  if(inputClave.value===CLAVE_DOCENTE){
    cerrarPedidoClave();
    renderAdmin();
    overlayAdmin.classList.remove('oculto');
  } else {
    claveError.textContent='Clave incorrecta. Probá de nuevo.';
    inputClave.value=''; inputClave.focus();
  }
}
document.getElementById('btnAbrirLock').addEventListener('click',abrirPedidoClave);
document.getElementById('btnEntrarClave').addEventListener('click',verificarClave);
document.getElementById('btnCancelarClave').addEventListener('click',cerrarPedidoClave);
inputClave.addEventListener('keydown',e=>{if(e.key==='Enter'){e.preventDefault();verificarClave();}});

document.getElementById('btnCerrarAdmin').addEventListener('click',()=>{
  overlayAdmin.classList.add('oculto');
});
document.getElementById('btnResetTodo').addEventListener('click',()=>{
  if(!confirm('¿Resetear TODOS los jugadores? Se borrarán todos los puntajes.')) return;
  resetTodo(); renderAdmin(); renderRanking(); actualizarLobby();
  alert('Reseteo completo. Todos pueden jugar de nuevo.');
});

/* CSV Export (vive dentro del panel docente) */
document.getElementById('btnExportCSV').addEventListener('click',()=>{
  const scores=getScores();
  if(!scores.length){alert('No hay datos para exportar aún.');return;}
  const cols=['Nombre','Aciertos','Errores','Sin Responder','Tiempo Usado (s)','Tiempo Restante (s)','Precisión %','Vel. (acier/min)','Puntaje Global','Completó','Fecha'];
  const rows=scores.map(s=>[
    s.nombre,s.aciertos,s.errores,s.sinRep,s.segUsados,s.segRest,
    s.precision,s.velocidad,s.global,s.completo?'Sí':'No',s.fecha
  ].join(','));
  const csv=[cols.join(','),...rows].join('\n');
  const a=document.createElement('a');
  a.href=URL.createObjectURL(new Blob(['\ufeff'+csv],{type:'text/csv;charset=utf-8;'}));
  a.download='rosco_resultados.csv'; a.click();
});

function renderAdmin(){
  const scores=getScores();
  const lista=document.getElementById('adminLista');
  lista.innerHTML='';
  if(!scores.length){
    lista.innerHTML='<p style="color:var(--text-dim);font-size:.82rem;padding:8px">Nadie ha jugado todavía.</p>';
    return;
  }
  [...scores].sort((a,b)=>a.nombre.localeCompare(b.nombre,'es')).forEach(s=>{
    const div=document.createElement('div'); div.className='admin-fila';
    div.innerHTML='<span class="af-nombre">'+s.nombre+'</span>'+
      '<span class="af-pts">'+s.global+' pts · '+s.aciertos+'✅</span>'+
      '<button>Resetear</button>';
    div.querySelector('button').addEventListener('click',()=>{
      if(!confirm('¿Resetear a '+s.nombre+'? Podrá jugar de nuevo.')) return;
      resetNombre(s.nombre); renderAdmin(); renderRanking(); actualizarLobby();
    });
    lista.appendChild(div);
  });
}

/* ═══════════════════════════════════════
   INIT
   ═══════════════════════════════════════ */
pintarChips(); pintarMarcador(); actualizarLobby();

})();
