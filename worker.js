export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    if (request.method === "OPTIONS") {
      return new Response(null, {
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "POST, OPTIONS",
          "Access-Control-Allow-Headers": "Content-Type",
        },
      });
    }

    if (url.pathname === "/functions/notion") {
      try {
        const { path, method, body } = await request.json();
        const res = await fetch("https://api.notion.com" + path, {
          method: method || "POST",
          headers: {
            "Authorization": "Bearer " + env.NOTION_TOKEN,
            "Content-Type": "application/json",
            "Notion-Version": "2022-06-28",
          },
          body: body ? JSON.stringify(body) : undefined,
        });
        const text = await res.text();
        return new Response(text, {
          status: res.status,
          headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" },
        });
      } catch (e) {
        return new Response(JSON.stringify({ error: e.message }), {
          status: 500,
          headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" },
        });
      }
    }

    if (url.pathname === "/functions/claude") {
      try {
        const payload = await request.json();
        const res = await fetch("https://api.anthropic.com/v1/messages", {
          method: "POST",
          headers: {
            "x-api-key": env.ANTHROPIC_KEY,
            "anthropic-version": "2023-06-01",
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        });
        const text = await res.text();
        return new Response(text, {
          status: res.status,
          headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" },
        });
      } catch (e) {
        return new Response(JSON.stringify({ error: e.message }), {
          status: 500,
          headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" },
        });
      }
    }

    const html = String.raw`<!DOCTYPE html>
<html lang="es">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Vínculo — Sistema de Agentes</title>
<link href="https://fonts.googleapis.com/css2?family=Syne:wght@400;500;600;700;800&family=DM+Sans:wght@300;400;500&display=swap" rel="stylesheet">
<style>
:root{--green:#2D6A4F;--green-light:#52B788;--green-pale:#D8F3DC;--navy:#0D1B2A;--white:#FFFFFF;--surface:#F7F8FA;--surface2:#EEF0F4;--border:rgba(0,0,0,0.08);--text:#0D1B2A;--text2:#5A6478;--text3:#9BA3B0;}
*{box-sizing:border-box;margin:0;padding:0;}
body{font-family:'DM Sans',sans-serif;background:var(--surface);color:var(--text);min-height:100vh;}
header{background:var(--navy);padding:0 32px;height:60px;display:flex;align-items:center;justify-content:space-between;position:sticky;top:0;z-index:100;}
.logo{display:flex;align-items:center;gap:10px;}
.logo-mark{width:34px;height:34px;background:var(--green);border-radius:9px;display:flex;align-items:center;justify-content:center;color:#fff;font-family:'Syne',sans-serif;font-size:18px;font-weight:800;}
.logo-text{color:#fff;font-family:'Syne',sans-serif;font-weight:700;font-size:16px;}
.logo-sub{color:#9BA3B0;font-size:11px;}
.tabs{display:flex;gap:6px;padding:20px 32px 0;}
.tab{padding:10px 20px;border-radius:10px 10px 0 0;border:1px solid transparent;background:transparent;color:var(--text2);font-size:13px;font-weight:500;cursor:pointer;font-family:'DM Sans',sans-serif;transition:all 0.15s;}
.tab.active{background:var(--white);border-color:var(--border);color:var(--green);font-weight:600;}
.tab:hover:not(.active){background:var(--surface2);}
.main{padding:0 32px 40px;}
.panel{display:none;background:var(--white);border:1px solid var(--border);border-radius:0 12px 12px 12px;padding:24px;}
.panel.active{display:block;}
.card{background:var(--surface);border:1px solid var(--border);border-radius:10px;padding:18px 20px;margin-bottom:14px;}
.card-title{font-family:'Syne',sans-serif;font-weight:600;font-size:14px;color:var(--text);margin-bottom:14px;}
label.lbl{display:block;font-size:11px;font-weight:500;color:var(--text3);text-transform:uppercase;letter-spacing:0.6px;margin-bottom:5px;}
input,select,textarea{width:100%;padding:9px 12px;border:1px solid var(--border);border-radius:8px;font-family:'DM Sans',sans-serif;font-size:13px;color:var(--text);background:var(--white);transition:border 0.15s;}
input:focus,select:focus,textarea:focus{outline:none;border-color:var(--green);}
textarea{resize:vertical;}
.row2{display:grid;grid-template-columns:1fr 1fr;gap:14px;margin-bottom:14px;}
.field{margin-bottom:12px;}
.btn{display:inline-flex;align-items:center;gap:6px;padding:9px 18px;border-radius:8px;font-family:'DM Sans',sans-serif;font-size:13px;font-weight:500;cursor:pointer;border:1px solid var(--border);background:var(--white);color:var(--text);transition:all 0.15s;}
.btn:hover:not(:disabled){background:var(--surface2);}
.btn:disabled{opacity:0.45;cursor:not-allowed;}
.btn-primary{background:var(--green);color:#fff;border-color:var(--green);}
.btn-primary:hover:not(:disabled){background:#245C43;}
.btn-ghost{background:transparent;color:var(--green);border-color:var(--green);}
.btn-sm{padding:5px 12px;font-size:12px;}
.badge{display:inline-block;padding:3px 10px;border-radius:20px;font-size:11px;font-weight:500;}
.badge-green{background:#D8F3DC;color:#1B4332;}
.badge-yellow{background:#FFF3CD;color:#5C3D00;}
.badge-red{background:#FEE2E2;color:#7F1D1D;}
.badge-blue{background:#DBEAFE;color:#1E3A5F;}
.badge-gray{background:var(--surface2);color:var(--text2);}
.result-box{background:var(--surface);border-radius:8px;padding:12px 14px;font-size:13px;color:var(--text2);line-height:1.6;}
.score-pill{font-family:'Syne',sans-serif;font-weight:700;font-size:22px;padding:4px 14px;border-radius:10px;}
.bar-bg{height:5px;background:var(--surface2);border-radius:3px;margin-top:4px;overflow:hidden;}
.bar-fill{height:100%;border-radius:3px;transition:width 0.8s ease;}
.step-msg{font-size:12px;color:var(--text3);}
.error-msg{font-size:12px;color:#DC2626;}
.success-msg{font-size:13px;color:#16A34A;font-weight:500;}
.seg-card{background:var(--white);border:1px solid var(--border);border-radius:10px;padding:16px 18px;margin-bottom:10px;}
.copy-block{background:var(--surface);border-radius:8px;padding:12px 14px;font-size:13px;color:var(--text2);line-height:1.7;white-space:pre-wrap;}
#header-badge{font-size:12px;font-weight:500;padding:4px 12px;border-radius:20px;}
.upload-area{border:2px dashed var(--border);border-radius:8px;padding:20px;text-align:center;cursor:pointer;transition:all 0.15s;margin-bottom:12px;}
.upload-area:hover{border-color:var(--green);background:var(--green-pale);}
.upload-area.active{border-color:var(--green);background:var(--green-pale);}
.upload-icon{font-size:24px;margin-bottom:6px;}
.upload-text{font-size:13px;color:var(--text2);}
.upload-sub{font-size:11px;color:var(--text3);margin-top:3px;}
.divider{display:flex;align-items:center;gap:12px;margin:12px 0;color:var(--text3);font-size:12px;}
.divider::before,.divider::after{content:'';flex:1;height:1px;background:var(--border);}
@media(max-width:600px){.row2{grid-template-columns:1fr;}header,.tabs,.main{padding-left:16px;padding-right:16px;}}
</style>
</head>
<body>
<header>
<div class="logo">
<div class="logo-mark">&#8734;</div>
<div><div class="logo-text">Vínculo</div><div class="logo-sub">Sistema de Agentes</div></div>
</div>
<span id="header-badge" class="badge badge-gray">Cargando...</span>
</header>
<div class="tabs">
<button class="tab active" onclick="setTab('sourcing',this)">&#9889; Sourcing</button>
<button class="tab" onclick="setTab('contacto',this)">&#9993;&#65039; Contacto</button>
<button class="tab" onclick="setTab('seguimiento',this)">&#128276; Seguimiento</button>
</div>
<div class="main">
<div id="panel-sourcing" class="panel active">
<div class="card">
<div class="card-title">Cargar candidato</div>
<div class="row2">
<div><label class="lbl">Búsqueda activa *</label><select id="sel-busqueda" onchange="onBusquedaChange()"><option value="">Cargando...</option></select></div>
<div><label class="lbl">Fuente</label><select id="sel-fuente"><option>LinkedIn</option><option>CV por Mail</option><option>Base Existente</option><option>Referido</option></select></div>
</div>
<div id="busq-info" style="display:none;background:#D8F3DC;border-radius:8px;padding:8px 12px;margin-bottom:12px;font-size:12px;color:#1B4332;"></div>
<label class="lbl">Subir CV en PDF</label>
<div class="upload-area" id="upload-area" onclick="document.getElementById('pdf-input').click()">
<div class="upload-icon">&#128196;</div>
<div class="upload-text">Click para subir el CV en PDF</div>
<div class="upload-sub">O arrastrá el archivo acá</div>
</div>
<input type="file" id="pdf-input" accept=".pdf" style="display:none" onchange="handlePDF(this)">
<div class="divider">o pegá el texto manualmente</div>
<div class="field">
<label class="lbl">Texto del perfil</label>
<textarea id="txt-perfil" rows="5" placeholder="Pegá acá el texto del perfil de LinkedIn o CV..."></textarea>
</div>
<div style="display:flex;align-items:center;gap:12px;margin-top:4px;">
<button class="btn btn-primary" onclick="procesarCandidato()" id="btn-procesar">&#9889; Procesar con agentes</button>
<span id="step-msg" class="step-msg" style="display:none;"></span>
<span id="error-msg" class="error-msg" style="display:none;"></span>
</div>
</div>
<div id="resultado-parser" style="display:none;" class="card"></div>
<div id="resultado-scorer" style="display:none;" class="card"></div>
</div>
<div id="panel-contacto" class="panel">
<div class="card">
<div class="card-title">Generar outreach personalizado</div>
<div class="field"><label class="lbl">Nombre del candidato</label><input id="c-nombre" type="text" placeholder="Ej: Martina González"/></div>
<div class="field"><label class="lbl">Resumen del perfil</label><textarea id="c-perfil" rows="3" placeholder="Ej: Gerente de Marketing, 10 años en consumo masivo..."></textarea></div>
<div class="field"><label class="lbl">Descripción de la búsqueda</label><textarea id="c-busqueda" rows="3" placeholder="Ej: Gerente Comercial para empresa industrial en Mendoza..."></textarea></div>
<div style="display:flex;align-items:center;gap:12px;">
<button class="btn btn-primary" onclick="generarOutreach()" id="btn-outreach">&#9997;&#65039; Generar mensajes</button>
<span id="outreach-step" class="step-msg" style="display:none;">Generando...</span>
</div>
</div>
<div id="resultado-outreach"></div>
</div>
<div id="panel-seguimiento" class="panel">
<div class="card">
<div style="display:flex;justify-content:space-between;align-items:center;">
<div><div class="card-title" style="margin-bottom:2px;">Agente de seguimiento</div><div style="font-size:12px;color:var(--text3);">Candidatos contactados sin respuesta</div></div>
<button class="btn btn-ghost" onclick="cargarSeguimiento()" id="btn-seg">Actualizar</button>
</div>
</div>
<div id="lista-seguimiento"><div style="text-align:center;color:var(--text3);font-size:13px;padding:40px;">Presioná "Actualizar" para cargar los candidatos</div></div>
</div>
</div>
<script src="https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js"></script>
<script>
pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';
const BUSQ_DB="4319e79e9e644cb684c7f2242d74123f";
const PROC_DB="3dcdfdf396ae4cdb8479b6da52a32ba1";
let busquedas=[];

function setTab(t,el){
  document.querySelectorAll(".panel").forEach(p=>p.classList.remove("active"));
  document.querySelectorAll(".tab").forEach(b=>b.classList.remove("active"));
  document.getElementById("panel-"+t).classList.add("active");
  el.classList.add("active");
}

async function handlePDF(input) {
  const file = input.files[0];
  if (!file) return;
  const area = document.getElementById("upload-area");
  area.innerHTML = '<div class="upload-icon">&#9203;</div><div class="upload-text">Leyendo PDF...</div>';
  try {
    const arrayBuffer = await file.arrayBuffer();
    const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
    let text = '';
    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const content = await page.getTextContent();
      text += content.items.map(item => item.str).join(' ') + '\n';
    }
    document.getElementById("txt-perfil").value = text.trim();
    area.innerHTML = '<div class="upload-icon">&#9989;</div><div class="upload-text">' + file.name + '</div><div class="upload-sub">PDF cargado correctamente</div>';
  } catch(e) {
    area.innerHTML = '<div class="upload-icon">&#128196;</div><div class="upload-text">Click para subir el CV en PDF</div><div class="upload-sub">Error leyendo el PDF, intentá de nuevo</div>';
  }
}

const uploadArea = document.getElementById("upload-area");
uploadArea.addEventListener("dragover", e => { e.preventDefault(); uploadArea.classList.add("active"); });
uploadArea.addEventListener("dragleave", () => uploadArea.classList.remove("active"));
uploadArea.addEventListener("drop", e => {
  e.preventDefault(); uploadArea.classList.remove("active");
  const file = e.dataTransfer.files[0];
  if (file && file.type === "application/pdf") {
    const input = document.getElementById("pdf-input");
    const dt = new DataTransfer(); dt.items.add(file); input.files = dt.files;
    handlePDF(input);
  }
});

async function notionQ(dbId,filter,sorts){
  const body={};
  if(filter)body.filter=filter;
  if(sorts)body.sorts=sorts;
  const r=await fetch("/functions/notion",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({path:"/v1/databases/"+dbId+"/query",method:"POST",body})});
  return r.json();
}

async function notionCreate(dbId,props){
  const r=await fetch("/functions/notion",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({path:"/v1/pages",method:"POST",body:{parent:{database_id:dbId},properties:props}})});
  return r.json();
}

async function callClaude(sys,user){
  const r=await fetch("/functions/claude",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({model:"claude-sonnet-4-20250514",max_tokens:1000,system:sys,messages:[{role:"user",content:user}]})});
  const text = await r.text();
  const d = JSON.parse(text);
  return d.content?.[0]?.text||"";
}

async function loadBusquedas(){
  try{
    const d=await notionQ(BUSQ_DB,{property:"Estado",select:{equals:"Abierta"}});
    busquedas=(d.results||[]).map(p=>({
      id:p.id,
      puesto:p.properties?.Puesto?.title?.[0]?.plain_text||"Sin título",
      cliente:p.properties?.Cliente?.rich_text?.[0]?.plain_text||"",
      perfil:p.properties?.["Perfil Ideal"]?.rich_text?.[0]?.plain_text||"",
      sector:p.properties?.Sector?.rich_text?.[0]?.plain_text||"",
      seniority:p.properties?.Seniority?.select?.name||""
    }));
    const sel=document.getElementById("sel-busqueda");
    sel.innerHTML='<option value="">Seleccioná una búsqueda...</option>'+busquedas.map(b=>'<option value="'+b.id+'">'+b.puesto+(b.cliente?" — "+b.cliente:"")+'</option>').join("");
    const badge=document.getElementById("header-badge");
    badge.textContent=busquedas.length+" búsqueda"+(busquedas.length!==1?"s":"")+" activa"+(busquedas.length!==1?"s":"");
    badge.className="badge "+(busquedas.length>0?"badge-green":"badge-gray");
  }catch(e){
    document.getElementById("header-badge").textContent="Error de conexión";
    document.getElementById("header-badge").className="badge badge-red";
  }
}

function onBusquedaChange(){
  const b=busquedas.find(x=>x.id===document.getElementById("sel-busqueda").value);
  const info=document.getElementById("busq-info");
  if(b&&(b.seniority||b.sector)){
    info.style.display="block";
    info.textContent=[b.puesto,b.seniority,b.sector,b.cliente].filter(Boolean).join(" · ");
  }else info.style.display="none";
}

const PARSER_SYS='Extraés información de perfiles LinkedIn o CVs. Devolvés SOLO JSON sin backticks:\n{"nombre":"...","cargoActual":"...","empresaActual":"...","anosExperiencia":0,"sector":"...","nivelEducativo":"...","ubicacion":"...","email":"...","linkedin":"...","resumen":"2-3 oraciones"}\nUsá null para campos no encontrados.';
const SCORER_SYS='Evaluás candidatos para búsquedas ejecutivas en LATAM. Devolvés SOLO JSON sin backticks:\n{"score":0,"dimensiones":{"fitDeRol":0,"fitDeSeniority":0,"fitDeIndustria":0,"fitDeEmpresa":0},"fortalezas":["..."],"brechas":["..."],"recomendacion":"Avanzar","justificacion":"párrafo 3-4 oraciones"}\nrecomendacion: exactamente "Avanzar", "Evaluar" o "Descartar".';
const OUTREACH_SYS='Experto en outreach ejecutivo en Argentina. Mensajes cálidos, directos, personalizados. Devolvés SOLO JSON sin backticks:\n{"asunto":"...","mensaje":"mensaje completo del email","mensajeLinkedIn":"max 300 chars"}';

function setStep(msg){const e=document.getElementById("step-msg");e.style.display=msg?"inline":"none";e.textContent=msg;}
function setError(msg){const e=document.getElementById("error-msg");e.style.display=msg?"inline":"none";e.textContent=msg;}

async function procesarCandidato(){
  const texto=document.getElementById("txt-perfil").value.trim();
  const busqId=document.getElementById("sel-busqueda").value;
  if(!texto||!busqId){setError("Cargá un CV o pegá el texto y seleccioná una búsqueda.");return;}
  const busq=busquedas.find(b=>b.id===busqId);
  const btn=document.getElementById("btn-procesar");
  btn.disabled=true;setError("");
  document.getElementById("resultado-parser").style.display="none";
  document.getElementById("resultado-scorer").style.display="none";
  try{
    setStep("Agente Parser analizando el perfil...");
    const raw1=await callClaude(PARSER_SYS,"Extraé la información de este perfil:\n\n"+texto.slice(0,8000));
    const c=JSON.parse(raw1.replace(/```json|```/g,"").trim());
    const rp=document.getElementById("resultado-parser");
    rp.style.display="block";
    const campos=[["Nombre",c.nombre],["Cargo",c.cargoActual],["Empresa",c.empresaActual],["Experiencia",c.anosExperiencia?c.anosExperiencia+" años":null],["Sector",c.sector],["Ubicación",c.ubicacion],["Email",c.email]].filter(x=>x[1]);
    rp.innerHTML='<div class="card-title">Perfil extraído</div><div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-bottom:12px;">'+campos.map(function(x){return '<div><div class="lbl" style="margin-bottom:3px;">'+x[0]+'</div><div style="font-size:13px;">'+x[1]+'</div></div>';}).join("")+'</div>'+(c.resumen?'<div class="result-box">'+c.resumen+'</div>':"");
    setStep("Agente de Scoring evaluando fit...");
    const raw2=await callClaude(SCORER_SYS,"CANDIDATO:\n"+JSON.stringify(c)+"\n\nBÚSQUEDA:\nPuesto: "+busq.puesto+"\nCliente: "+busq.cliente+"\nSector: "+busq.sector+"\nSeniority: "+busq.seniority+"\nPerfil: "+busq.perfil);
    const s=JSON.parse(raw2.replace(/```json|```/g,"").trim());
    const recColor={Avanzar:"badge-green",Evaluar:"badge-yellow",Descartar:"badge-red"};
    const scoreBg=s.score>=75?"#D8F3DC":s.score>=55?"#FFF3CD":"#FEE2E2";
    const scoreFg=s.score>=75?"#1B4332":s.score>=55?"#5C3D00":"#7F1D1D";
    const dimLabels={fitDeRol:"Fit de rol",fitDeSeniority:"Seniority",fitDeIndustria:"Industria",fitDeEmpresa:"Tipo empresa"};
    const barColor=function(v){return v>=75?"#52B788":v>=55?"#FBBF24":"#F87171";};
    window._c=c;window._s=s;
    const rs=document.getElementById("resultado-scorer");
    rs.style.display="block";
    const dims=Object.entries(s.dimensiones||{}).map(function(e){const k=e[0],v=e[1];return '<div><div style="display:flex;justify-content:space-between;font-size:12px;"><span style="color:var(--text3);">'+(dimLabels[k]||k)+'</span><span style="font-weight:500;">'+v+'</span></div><div class="bar-bg"><div class="bar-fill" style="width:'+v+'%;background:'+barColor(v)+';"></div></div></div>';}).join("");
    const forts=s.fortalezas&&s.fortalezas.length?'<div><div style="font-size:11px;font-weight:500;color:#16A34A;text-transform:uppercase;letter-spacing:0.5px;margin-bottom:6px;">Fortalezas</div>'+s.fortalezas.map(function(f){return '<div style="font-size:12px;color:var(--text2);margin-bottom:3px;">• '+f+'</div>';}).join("")+'</div>':"";
    const brechs=s.brechas&&s.brechas.length?'<div><div style="font-size:11px;font-weight:500;color:#DC2626;text-transform:uppercase;letter-spacing:0.5px;margin-bottom:6px;">Brechas</div>'+s.brechas.map(function(b){return '<div style="font-size:12px;color:var(--text2);margin-bottom:3px;">• '+b+'</div>';}).join("")+'</div>':"";
    rs.innerHTML='<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:16px;"><div class="card-title" style="margin-bottom:0;">Evaluación del agente</div><div style="display:flex;gap:8px;align-items:center;"><span class="badge '+(recColor[s.recomendacion]||"badge-gray")+'">'+s.recomendacion+'</span><span class="score-pill" style="background:'+scoreBg+';color:'+scoreFg+';">'+s.score+'/100</span></div></div><div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-bottom:16px;">'+dims+'</div><div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-bottom:14px;">'+forts+brechs+'</div><div class="result-box" style="margin-bottom:16px;">'+s.justificacion+'</div><div style="display:flex;align-items:center;gap:12px;"><button class="btn btn-primary" id="btn-guardar" onclick="guardarNotion()">&#128190; Guardar en Notion</button><span id="saved-msg" style="display:none;" class="success-msg">&#10003; Guardado en Procesos</span></div>';
    setStep("");
  }catch(e){setError("Error procesando. Intentá de nuevo.");setStep("");console.error(e);}
  btn.disabled=false;
}

async function guardarNotion(){
  const c=window._c;const s=window._s;
  const busqId=document.getElementById("sel-busqueda").value;
  const busq=busquedas.find(b=>b.id===busqId);
  const fuente=document.getElementById("sel-fuente").value;
  const texto=document.getElementById("txt-perfil").value;
  document.getElementById("btn-guardar").disabled=true;
  try{
    const props={
      Candidato:{title:[{text:{content:c.nombre||"Sin nombre"}}]},
      "Búsqueda Asociada":{rich_text:[{text:{content:busq?busq.puesto:""}}]},
      Cliente:{rich_text:[{text:{content:busq?busq.cliente:""}}]},
      Score:{number:s.score},
      "Justificación del Score":{rich_text:[{text:{content:s.justificacion||""}}]},
      Estado:{select:{name:"Identificado"}},
      Fuente:{select:{name:fuente}},
      "Incluir en Reporte":{checkbox:s.score>=70},
      "Texto Crudo Original":{rich_text:[{text:{content:texto.slice(0,2000)}}]}
    };
    if(c.email)props["Email Candidato"]={email:c.email};
    if(c.linkedin)props["LinkedIn URL"]={url:c.linkedin};
    await notionCreate(PROC_DB,props);
    document.getElementById("saved-msg").style.display="inline";
  }catch(e){alert("Error guardando en Notion.");document.getElementById("btn-guardar").disabled=false;}
}

async function generarOutreach(){
  const nombre=document.getElementById("c-nombre").value.trim();
  const perfil=document.getElementById("c-perfil").value.trim();
  const busqueda=document.getElementById("c-busqueda").value.trim();
  if(!nombre||!perfil||!busqueda)return;
  const btn=document.getElementById("btn-outreach");
  const step=document.getElementById("outreach-step");
  btn.disabled=true;step.style.display="inline";
  document.getElementById("resultado-outreach").innerHTML="";
  try{
    const raw=await callClaude(OUTREACH_SYS,"Candidato: "+nombre+"\nPerfil: "+perfil+"\nBúsqueda: "+busqueda);
    const r=JSON.parse(raw.replace(/```json|```/g,"").trim());
    document.getElementById("resultado-outreach").innerHTML='<div class="card"><div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:10px;"><div class="card-title" style="margin-bottom:0;">&#128231; Email</div><button class="btn btn-sm btn-ghost" onclick="copiarTexto(\'email-body\',this)">Copiar</button></div><div style="font-size:12px;color:var(--text3);margin-bottom:8px;">Asunto: <strong style="color:var(--text);">'+r.asunto+'</strong></div><div id="email-body" class="copy-block">'+r.mensaje+'</div></div><div class="card"><div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:10px;"><div class="card-title" style="margin-bottom:0;">&#128188; Mensaje LinkedIn</div><button class="btn btn-sm btn-ghost" onclick="copiarTexto(\'li-body\',this)">Copiar</button></div><div id="li-body" class="copy-block">'+r.mensajeLinkedIn+'</div><div style="font-size:11px;color:var(--text3);margin-top:6px;">'+r.mensajeLinkedIn.length+'/300 caracteres</div></div>';
  }catch(e){console.error(e);}
  btn.disabled=false;step.style.display="none";
}

function copiarTexto(id,btn){
  navigator.clipboard&&navigator.clipboard.writeText(document.getElementById(id).innerText);
  btn.textContent="&#10003; Copiado";
  setTimeout(function(){btn.textContent="Copiar";},2000);
}

async function cargarSeguimiento(){
  const btn=document.getElementById("btn-seg");btn.disabled=true;btn.textContent="Cargando...";
  const lista=document.getElementById("lista-seguimiento");
  try{
    const d=await notionQ(PROC_DB,{property:"Estado",select:{equals:"Contactado"}},[{property:"Fecha de Contacto",direction:"ascending"}]);
    const items=(d.results||[]).map(p=>({
      id:p.id,
      nombre:p.properties?.Candidato?.title?.[0]?.plain_text||"Sin nombre",
      busqueda:p.properties?.["Búsqueda Asociada"]?.rich_text?.[0]?.plain_text||"",
      fecha:p.properties?.["Fecha de Contacto"]?.date?.start||null
    }));
    if(!items.length){
      lista.innerHTML='<div style="text-align:center;color:var(--text3);font-size:13px;padding:40px;">No hay candidatos en estado "Contactado" por ahora</div>';
    }else{
      lista.innerHTML=items.map(function(p){
        const dias=p.fecha?Math.floor((Date.now()-new Date(p.fecha))/86400000):null;
        const urgente=dias!==null&&dias>5;
        return '<div class="seg-card" style="border-left:3px solid '+(urgente?"#DC2626":"#52B788")+'"><div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:10px;"><div><div style="font-weight:500;font-size:14px;">'+p.nombre+'</div><div style="font-size:12px;color:var(--text3);margin-top:2px;">'+p.busqueda+'</div></div>'+(dias!==null?'<span class="badge '+(urgente?"badge-red":"badge-blue")+'">'+dias+' días sin respuesta</span>':"")+'</div><div id="fu-'+p.id+'"><button class="btn btn-sm btn-ghost" onclick="genFollowup(\''+p.id+'\',\''+p.nombre.replace(/'/g,"\\'")+'\',\''+p.busqueda.replace(/'/g,"\\'")+'\',\''+p.busqueda+'\','+(dias||0)+')">Generar follow-up</button></div></div>';
      }).join("");
    }
  }catch(e){lista.innerHTML='<div style="color:#DC2626;font-size:13px;padding:16px;">Error cargando</div>';}
  btn.disabled=false;btn.textContent="Actualizar";
}

async function genFollowup(id,nombre,busqueda,dias){
  const div=document.getElementById("fu-"+id);
  div.innerHTML='<span style="font-size:12px;color:var(--text3);">Generando...</span>';
  try{
    const txt=await callClaude("Agente de recruiting. Generás follow-ups breves y directos. Solo el texto, sin JSON.","Candidato: "+nombre+". Búsqueda: "+busqueda+". Días sin respuesta: "+dias+".");
    div.innerHTML='<div class="result-box">'+txt+'</div>';
  }catch(e){div.innerHTML='<span style="color:#DC2626;font-size:12px;">Error generando</span>';}
}

loadBusquedas();
</script>
</body>
</html>`;

    return new Response(html, {
      headers: { "Content-Type": "text/html;charset=UTF-8" },
    });
  },
};
