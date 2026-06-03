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

    if (url.pathname === "/app.js") {
      return new Response(getAppJS(), {
        headers: { "Content-Type": "application/javascript;charset=UTF-8" },
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

    return new Response(getHTML(), {
      headers: { "Content-Type": "text/html;charset=UTF-8" },
    });
  },
};

function getHTML() {
  return [
    '<!DOCTYPE html><html lang="es"><head>',
    '<meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0">',
    '<title>Vinculo Agentes</title>',
    '<link href="https://fonts.googleapis.com/css2?family=Syne:wght@400;500;600;700;800&family=DM+Sans:wght@300;400;500&display=swap" rel="stylesheet">',
    '<style>',
    ':root{--green:#2D6A4F;--green-light:#52B788;--green-pale:#D8F3DC;--navy:#0D1B2A;--white:#FFFFFF;--surface:#F7F8FA;--surface2:#EEF0F4;--border:rgba(0,0,0,0.08);--text:#0D1B2A;--text2:#5A6478;--text3:#9BA3B0;}',
    '*{box-sizing:border-box;margin:0;padding:0;}',
    'body{font-family:"DM Sans",sans-serif;background:var(--surface);color:var(--text);min-height:100vh;}',
    'header{background:var(--navy);padding:0 32px;height:60px;display:flex;align-items:center;justify-content:space-between;position:sticky;top:0;z-index:100;}',
    '.logo{display:flex;align-items:center;gap:10px;}',
    '.logo-mark{width:34px;height:34px;background:var(--green);border-radius:9px;display:flex;align-items:center;justify-content:center;color:#fff;font-size:18px;font-weight:800;}',
    '.logo-text{color:#fff;font-weight:700;font-size:16px;}.logo-sub{color:#9BA3B0;font-size:11px;}',
    '.tabs{display:flex;gap:6px;padding:20px 32px 0;}',
    '.tab{padding:10px 20px;border-radius:10px 10px 0 0;border:1px solid transparent;background:transparent;color:var(--text2);font-size:13px;font-weight:500;cursor:pointer;transition:all 0.15s;}',
    '.tab.active{background:var(--white);border-color:var(--border);color:var(--green);font-weight:600;}',
    '.tab:hover:not(.active){background:var(--surface2);}',
    '.main{padding:0 32px 40px;}',
    '.panel{display:none;background:var(--white);border:1px solid var(--border);border-radius:0 12px 12px 12px;padding:24px;}',
    '.panel.active{display:block;}',
    '.card{background:var(--surface);border:1px solid var(--border);border-radius:10px;padding:18px 20px;margin-bottom:14px;}',
    '.card-title{font-weight:600;font-size:14px;color:var(--text);margin-bottom:14px;}',
    'label.lbl{display:block;font-size:11px;font-weight:500;color:var(--text3);text-transform:uppercase;letter-spacing:0.6px;margin-bottom:5px;}',
    'input,select,textarea{width:100%;padding:9px 12px;border:1px solid var(--border);border-radius:8px;font-size:13px;color:var(--text);background:var(--white);transition:border 0.15s;}',
    'input:focus,select:focus,textarea:focus{outline:none;border-color:var(--green);}',
    'textarea{resize:vertical;}',
    '.row2{display:grid;grid-template-columns:1fr 1fr;gap:14px;margin-bottom:14px;}',
    '.field{margin-bottom:12px;}',
    '.btn{display:inline-flex;align-items:center;gap:6px;padding:9px 18px;border-radius:8px;font-size:13px;font-weight:500;cursor:pointer;border:1px solid var(--border);background:var(--white);color:var(--text);transition:all 0.15s;}',
    '.btn:hover:not(:disabled){background:var(--surface2);}.btn:disabled{opacity:0.45;cursor:not-allowed;}',
    '.btn-primary{background:var(--green);color:#fff;border-color:var(--green);}.btn-primary:hover:not(:disabled){background:#245C43;}',
    '.btn-ghost{background:transparent;color:var(--green);border-color:var(--green);}',
    '.btn-sm{padding:5px 12px;font-size:12px;}',
    '.badge{display:inline-block;padding:3px 10px;border-radius:20px;font-size:11px;font-weight:500;}',
    '.badge-green{background:#D8F3DC;color:#1B4332;}.badge-yellow{background:#FFF3CD;color:#5C3D00;}',
    '.badge-red{background:#FEE2E2;color:#7F1D1D;}.badge-blue{background:#DBEAFE;color:#1E3A5F;}',
    '.badge-gray{background:var(--surface2);color:var(--text2);}',
    '.result-box{background:var(--surface);border-radius:8px;padding:12px 14px;font-size:13px;color:var(--text2);line-height:1.6;}',
    '.score-pill{font-weight:700;font-size:22px;padding:4px 14px;border-radius:10px;}',
    '.bar-bg{height:5px;background:var(--surface2);border-radius:3px;margin-top:4px;overflow:hidden;}',
    '.bar-fill{height:100%;border-radius:3px;transition:width 0.8s ease;}',
    '.step-msg{font-size:12px;color:var(--text3);}.error-msg{font-size:12px;color:#DC2626;}',
    '.success-msg{font-size:13px;color:#16A34A;font-weight:500;}',
    '.seg-card{background:var(--white);border:1px solid var(--border);border-radius:10px;padding:16px 18px;margin-bottom:10px;}',
    '.copy-block{background:var(--surface);border-radius:8px;padding:12px 14px;font-size:13px;color:var(--text2);line-height:1.7;white-space:pre-wrap;}',
    '#header-badge{font-size:12px;font-weight:500;padding:4px 12px;border-radius:20px;}',
    '.upload-area{border:2px dashed var(--border);border-radius:8px;padding:20px;text-align:center;cursor:pointer;transition:all 0.15s;margin-bottom:12px;}',
    '.upload-area:hover{border-color:var(--green);background:var(--green-pale);}',
    '.divider{display:flex;align-items:center;gap:12px;margin:12px 0;color:var(--text3);font-size:12px;}',
    '.divider::before,.divider::after{content:"";flex:1;height:1px;background:var(--border);}',
    '@media(max-width:600px){.row2{grid-template-columns:1fr;}header,.tabs,.main{padding-left:16px;padding-right:16px;}}',
    '</style></head><body>',
    '<header><div class="logo"><div class="logo-mark">&#8734;</div>',
    '<div><div class="logo-text">V&#237;nculo</div><div class="logo-sub">Sistema de Agentes</div></div></div>',
    '<span id="header-badge" class="badge badge-gray">Cargando...</span></header>',
    '<div class="tabs">',
    '<button class="tab active" onclick="setTab('sourcing',this)">&#9889; Sourcing</button>',
    '<button class="tab" onclick="setTab('contacto',this)">Contacto</button>',
    '<button class="tab" onclick="setTab('seguimiento',this)">Seguimiento</button>',
    '</div><div class="main">',
    '<div id="panel-sourcing" class="panel active"><div class="card">',
    '<div class="card-title">Cargar candidato</div>',
    '<div class="row2">',
    '<div><label class="lbl">B&#250;squeda activa *</label><select id="sel-busqueda" onchange="onBusquedaChange()"><option value="">Cargando...</option></select></div>',
    '<div><label class="lbl">Fuente</label><select id="sel-fuente"><option>LinkedIn</option><option>CV por Mail</option><option>Base Existente</option><option>Referido</option></select></div>',
    '</div>',
    '<div id="busq-info" style="display:none;background:#D8F3DC;border-radius:8px;padding:8px 12px;margin-bottom:12px;font-size:12px;color:#1B4332;"></div>',
    '<label class="lbl">Subir CV en PDF</label>',
    '<div class="upload-area" id="upload-area" onclick="document.getElementById('pdf-input').click()">',
    '<div style="font-size:24px;margin-bottom:6px;">&#128196;</div>',
    '<div style="font-size:13px;color:var(--text2);">Click para subir el CV en PDF</div>',
    '<div style="font-size:11px;color:var(--text3);margin-top:3px;">O arrastr&#225; el archivo ac&#225;</div>',
    '</div>',
    '<input type="file" id="pdf-input" accept=".pdf" style="display:none" onchange="handlePDF(this)">',
    '<div class="divider">o peg&#225; el texto manualmente</div>',
    '<div class="field"><label class="lbl">Texto del perfil</label>',
    '<textarea id="txt-perfil" rows="5" placeholder="Peg&#225; ac&#225; el texto del perfil de LinkedIn o CV..."></textarea></div>',
    '<div style="display:flex;align-items:center;gap:12px;margin-top:4px;">',
    '<button class="btn btn-primary" onclick="procesarCandidato()" id="btn-procesar">&#9889; Procesar con agentes</button>',
    '<span id="step-msg" class="step-msg" style="display:none;"></span>',
    '<span id="error-msg" class="error-msg" style="display:none;"></span>',
    '</div></div>',
    '<div id="resultado-parser" style="display:none;" class="card"></div>',
    '<div id="resultado-scorer" style="display:none;" class="card"></div>',
    '</div>',
    '<div id="panel-contacto" class="panel"><div class="card">',
    '<div class="card-title">Generar outreach personalizado</div>',
    '<div class="field"><label class="lbl">Nombre del candidato</label><input id="c-nombre" type="text" placeholder="Ej: Martina Gonz&#225;lez"/></div>',
    '<div class="field"><label class="lbl">Resumen del perfil</label><textarea id="c-perfil" rows="3" placeholder="Ej: Gerente de Marketing, 10 a&#241;os..."></textarea></div>',
    '<div class="field"><label class="lbl">Descripci&#243;n de la b&#250;squeda</label><textarea id="c-busqueda" rows="3" placeholder="Ej: Gerente Comercial..."></textarea></div>',
    '<div style="display:flex;align-items:center;gap:12px;">',
    '<button class="btn btn-primary" onclick="generarOutreach()" id="btn-outreach">Generar mensajes</button>',
    '<span id="outreach-step" class="step-msg" style="display:none;">Generando...</span>',
    '</div></div><div id="resultado-outreach"></div></div>',
    '<div id="panel-seguimiento" class="panel"><div class="card">',
    '<div style="display:flex;justify-content:space-between;align-items:center;">',
    '<div><div class="card-title" style="margin-bottom:2px;">Agente de seguimiento</div>',
    '<div style="font-size:12px;color:var(--text3);">Candidatos contactados sin respuesta</div></div>',
    '<button class="btn btn-ghost" onclick="cargarSeguimiento()" id="btn-seg">Actualizar</button>',
    '</div></div>',
    '<div id="lista-seguimiento"><div style="text-align:center;color:var(--text3);font-size:13px;padding:40px;">Presion&#225; Actualizar para cargar</div></div>',
    '</div></div>',
    '<script src="https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js"><\/script>',
    '<script src="/app.js"><\/script>',
    '</body></html>'
  ].join('\n');
}

function getAppJS() {
  return [
    'var BUSQ_DB = "4319e79e9e644cb684c7f2242d74123f";',
    'var PROC_DB = "3dcdfdf396ae4cdb8479b6da52a32ba1";',
    'var busquedas = [];',
    'pdfjsLib.GlobalWorkerOptions.workerSrc = "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js";',
    'function setTab(t,el){document.querySelectorAll(".panel").forEach(function(p){p.classList.remove("active");});document.querySelectorAll(".tab").forEach(function(b){b.classList.remove("active");});document.getElementById("panel-"+t).classList.add("active");el.classList.add("active");}',
    'function handlePDF(input){var file=input.files[0];if(!file)return;var area=document.getElementById("upload-area");area.innerHTML="<div style=\'font-size:24px\'>&#9203;</div><div>Leyendo PDF...</div>";var reader=new FileReader();reader.onload=function(e){pdfjsLib.getDocument({data:e.target.result}).promise.then(function(pdf){var pages=[];for(var i=1;i<=pdf.numPages;i++){pages.push(pdf.getPage(i).then(function(pg){return pg.getTextContent();}).then(function(c){return c.items.map(function(x){return x.str;}).join(" ");}))}Promise.all(pages).then(function(txts){document.getElementById("txt-perfil").value=txts.join("\\n");area.innerHTML="<div style=\'font-size:24px\'>&#9989;</div><div>"+file.name+"</div>";});});};reader.readAsArrayBuffer(file);}',
    'document.getElementById("upload-area").addEventListener("dragover",function(e){e.preventDefault();});',
    'document.getElementById("upload-area").addEventListener("drop",function(e){e.preventDefault();var file=e.dataTransfer.files[0];if(file&&file.type==="application/pdf"){var inp=document.getElementById("pdf-input");var dt=new DataTransfer();dt.items.add(file);inp.files=dt.files;handlePDF(inp);}});',
    'function notionQ(dbId,filter,sorts){var body={};if(filter)body.filter=filter;if(sorts)body.sorts=sorts;return fetch("/functions/notion",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({path:"/v1/databases/"+dbId+"/query",method:"POST",body:body})}).then(function(r){return r.json();});}',
    'function notionCreate(dbId,props){return fetch("/functions/notion",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({path:"/v1/pages",method:"POST",body:{parent:{database_id:dbId},properties:props}})}).then(function(r){return r.json();});}',
    'function callClaude(sys,user){return fetch("/functions/claude",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({model:"claude-sonnet-4-20250514",max_tokens:1000,system:sys,messages:[{role:"user",content:user}]})}).then(function(r){return r.text();}).then(function(t){var d=JSON.parse(t);return d.content&&d.content[0]?d.content[0].text:"";});}',
    'function loadBusquedas(){notionQ(BUSQ_DB,{property:"Estado",select:{equals:"Abierta"}}).then(function(d){busquedas=(d.results||[]).map(function(p){var pr=p.properties||{};return{id:p.id,puesto:pr.Puesto&&pr.Puesto.title&&pr.Puesto.title[0]?pr.Puesto.title[0].plain_text:"Sin titulo",cliente:pr.Cliente&&pr.Cliente.rich_text&&pr.Cliente.rich_text[0]?pr.Cliente.rich_text[0].plain_text:"",perfil:pr["Perfil Ideal"]&&pr["Perfil Ideal"].rich_text&&pr["Perfil Ideal"].rich_text[0]?pr["Perfil Ideal"].rich_text[0].plain_text:"",sector:pr.Sector&&pr.Sector.rich_text&&pr.Sector.rich_text[0]?pr.Sector.rich_text[0].plain_text:"",seniority:pr.Seniority&&pr.Seniority.select?pr.Seniority.select.name:""};});var sel=document.getElementById("sel-busqueda");sel.innerHTML="<option value=\"\">Seleccion\u00e1 una b\u00fasqueda...</option>"+busquedas.map(function(b){return"<option value=\""+b.id+"\">"+b.puesto+(b.cliente?" \u2014 "+b.cliente:"")+"</option>";}).join("");var badge=document.getElementById("header-badge");badge.textContent=busquedas.length+" b\u00fasqueda"+(busquedas.length!==1?"s":"")+" activa"+(busquedas.length!==1?"s":"");badge.className="badge "+(busquedas.length>0?"badge-green":"badge-gray");}).catch(function(){document.getElementById("header-badge").textContent="Error de conexi\u00f3n";document.getElementById("header-badge").className="badge badge-red";});}',
    'function onBusquedaChange(){var b=busquedas.find(function(x){return x.id===document.getElementById("sel-busqueda").value;});var info=document.getElementById("busq-info");if(b&&(b.seniority||b.sector)){info.style.display="block";info.textContent=[b.puesto,b.seniority,b.sector,b.cliente].filter(Boolean).join(" \u00b7 ");}else{info.style.display="none";}}',
    'var PARSER_SYS="Extr\u00e9s informaci\u00f3n de perfiles LinkedIn o CVs. Devolv\u00e9s SOLO JSON sin backticks:\n{\"nombre\":\"...\",\"cargoActual\":\"...\",\"empresaActual\":\"...\",\"anosExperiencia\":0,\"sector\":\"...\",\"nivelEducativo\":\"...\",\"ubicacion\":\"...\",\"email\":\"...\",\"linkedin\":\"...\",\"resumen\":\"2-3 oraciones\"}\nUs\u00e1 null para campos no encontrados.";',
    'var SCORER_SYS="Evalu\u00e1s candidatos para b\u00fasquedas ejecutivas en LATAM. Devolv\u00e9s SOLO JSON sin backticks:\n{\"score\":0,\"dimensiones\":{\"fitDeRol\":0,\"fitDeSeniority\":0,\"fitDeIndustria\":0,\"fitDeEmpresa\":0},\"fortalezas\":[\"...\"],\"brechas\":[\"...\"],\"recomendacion\":\"Avanzar\",\"justificacion\":\"p\u00e1rrafo 3-4 oraciones\"}\nrecomendacion: exactamente \"Avanzar\", \"Evaluar\" o \"Descartar\".";',
    'var OUTREACH_SYS="Experto en outreach ejecutivo en Argentina. Mensajes c\u00e1lidos, directos, personalizados. Devolv\u00e9s SOLO JSON sin backticks:\n{\"asunto\":\"...\",\"mensaje\":\"mensaje completo del email\",\"mensajeLinkedIn\":\"max 300 chars\"}";',
    'function setStep(msg){var e=document.getElementById("step-msg");e.style.display=msg?"inline":"none";e.textContent=msg;}',
    'function setError(msg){var e=document.getElementById("error-msg");e.style.display=msg?"inline":"none";e.textContent=msg;}',
    'function procesarCandidato(){var texto=document.getElementById("txt-perfil").value.trim();var busqId=document.getElementById("sel-busqueda").value;if(!texto||!busqId){setError("Carg\u00e1 un CV y selecci\u00f3n una b\u00fasqueda.");return;}var busq=busquedas.find(function(b){return b.id===busqId;});var btn=document.getElementById("btn-procesar");btn.disabled=true;setError("");document.getElementById("resultado-parser").style.display="none";document.getElementById("resultado-scorer").style.display="none";setStep("Agente Parser analizando el perfil...");callClaude(PARSER_SYS,"Extr\u00e9 la informaci\u00f3n de este perfil:\n\n"+texto.slice(0,8000)).then(function(raw1){var c=JSON.parse(raw1.replace(/```json|```/g,"").trim());window._c=c;var rp=document.getElementById("resultado-parser");rp.style.display="block";var campos=[["Nombre",c.nombre],["Cargo",c.cargoActual],["Empresa",c.empresaActual],["Experiencia",c.anosExperiencia?c.anosExperiencia+" a\u00f1os":null],["Sector",c.sector],["Ubicaci\u00f3n",c.ubicacion],["Email",c.email]].filter(function(x){return x[1];});rp.innerHTML="<div class=\"card-title\">Perfil extra\u00eddo</div><div style=\"display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-bottom:12px;\">"+campos.map(function(x){return"<div><div class=\"lbl\" style=\"margin-bottom:3px;\">"+x[0]+"</div><div style=\"font-size:13px;\">"+x[1]+"</div></div>";}).join("")+"</div>"+(c.resumen?"<div class=\"result-box\">"+c.resumen+"</div>":"");setStep("Agente de Scoring evaluando fit...");return callClaude(SCORER_SYS,"CANDIDATO:\n"+JSON.stringify(c)+"\n\nBUSQUEDA:\nPuesto: "+busq.puesto+"\nCliente: "+busq.cliente+"\nSector: "+busq.sector+"\nSeniority: "+busq.seniority+"\nPerfil: "+busq.perfil);}).then(function(raw2){var s=JSON.parse(raw2.replace(/```json|```/g,"").trim());window._s=s;var rc={Avanzar:"badge-green",Evaluar:"badge-yellow",Descartar:"badge-red"};var sbg=s.score>=75?"#D8F3DC":s.score>=55?"#FFF3CD":"#FEE2E2";var sfg=s.score>=75?"#1B4332":s.score>=55?"#5C3D00":"#7F1D1D";var dl={fitDeRol:"Fit de rol",fitDeSeniority:"Seniority",fitDeIndustria:"Industria",fitDeEmpresa:"Tipo empresa"};function bc(v){return v>=75?"#52B788":v>=55?"#FBBF24":"#F87171";}var rs=document.getElementById("resultado-scorer");rs.style.display="block";var dims=Object.keys(s.dimensiones||{}).map(function(k){var v=s.dimensiones[k];return"<div><div style=\"display:flex;justify-content:space-between;font-size:12px;\"><span style=\"color:var(--text3);\">"+(dl[k]||k)+"</span><span style=\"font-weight:500;\">"+v+"</span></div><div class=\"bar-bg\"><div class=\"bar-fill\" style=\"width:"+v+"%;background:"+bc(v)+";\"></div></div></div>";}).join("");var forts=s.fortalezas&&s.fortalezas.length?"<div><div style=\"font-size:11px;font-weight:500;color:#16A34A;text-transform:uppercase;margin-bottom:6px;\">Fortalezas</div>"+s.fortalezas.map(function(f){return"<div style=\"font-size:12px;color:var(--text2);margin-bottom:3px;\">\u2022 "+f+"</div>";}).join("")+"</div>":"";var brechs=s.brechas&&s.brechas.length?"<div><div style=\"font-size:11px;font-weight:500;color:#DC2626;text-transform:uppercase;margin-bottom:6px;\">Brechas</div>"+s.brechas.map(function(b){return"<div style=\"font-size:12px;color:var(--text2);margin-bottom:3px;\">\u2022 "+b+"</div>";}).join("")+"</div>":"";rs.innerHTML="<div style=\"display:flex;justify-content:space-between;align-items:center;margin-bottom:16px;\"><div class=\"card-title\" style=\"margin-bottom:0;\">Evaluaci\u00f3n</div><div style=\"display:flex;gap:8px;align-items:center;\"><span class=\"badge "+(rc[s.recomendacion]||"badge-gray")+"\">" +s.recomendacion+"</span><span class=\"score-pill\" style=\"background:"+sbg+";color:"+sfg+";">"+s.score+"/100</span></div></div><div style=\"display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-bottom:16px;\">"+dims+"</div><div style=\"display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-bottom:14px;\">"+forts+brechs+"</div><div class=\"result-box\" style=\"margin-bottom:16px;\">"+s.justificacion+"</div><div style=\"display:flex;align-items:center;gap:12px;\"><button class=\"btn btn-primary\" id=\"btn-guardar\" onclick=\"guardarNotion()\">Guardar en Notion</button><span id=\"saved-msg\" style=\"display:none;\" class=\"success-msg\">\u2713 Guardado</span></div>";setStep("");}).catch(function(e){setError("Error procesando.");setStep("");console.error(e);}).finally(function(){document.getElementById("btn-procesar").disabled=false;});}',
    'function guardarNotion(){var c=window._c;var s=window._s;var busqId=document.getElementById("sel-busqueda").value;var busq=busquedas.find(function(b){return b.id===busqId;});var fuente=document.getElementById("sel-fuente").value;var texto=document.getElementById("txt-perfil").value;document.getElementById("btn-guardar").disabled=true;var props={Candidato:{title:[{text:{content:c.nombre||"Sin nombre"}}]},"B\u00fasqueda Asociada":{rich_text:[{text:{content:busq?busq.puesto:""}}]},Cliente:{rich_text:[{text:{content:busq?busq.cliente:""}}]},Score:{number:s.score},"Justificaci\u00f3n del Score":{rich_text:[{text:{content:s.justificacion||""}}]},Estado:{select:{name:"Identificado"}},Fuente:{select:{name:fuente}},"Incluir en Reporte":{checkbox:s.score>=70},"Texto Crudo Original":{rich_text:[{text:{content:texto.slice(0,2000)}}]}};if(c.email)props["Email Candidato"]={email:c.email};if(c.linkedin)props["LinkedIn URL"]={url:c.linkedin};notionCreate(PROC_DB,props).then(function(){document.getElementById("saved-msg").style.display="inline";}).catch(function(){alert("Error guardando.");document.getElementById("btn-guardar").disabled=false;});}',
    'function generarOutreach(){var nombre=document.getElementById("c-nombre").value.trim();var perfil=document.getElementById("c-perfil").value.trim();var busqueda=document.getElementById("c-busqueda").value.trim();if(!nombre||!perfil||!busqueda)return;document.getElementById("btn-outreach").disabled=true;document.getElementById("outreach-step").style.display="inline";document.getElementById("resultado-outreach").innerHTML="";callClaude(OUTREACH_SYS,"Candidato: "+nombre+"\nPerfil: "+perfil+"\nB\u00fasqueda: "+busqueda).then(function(raw){var r=JSON.parse(raw.replace(/```json|```/g,"").trim());var h="<div class=\"card\">";h+="<div style=\"display:flex;justify-content:space-between;align-items:center;margin-bottom:10px;\">";h+="<div class=\"card-title\" style=\"margin-bottom:0;\">Email</div>";h+="<button class=\"btn btn-sm btn-ghost\" data-id=\"email-body\" onclick=\"cpBtn(this)\">Copiar</button>";h+="</div>";h+="<div style=\"font-size:12px;color:var(--text3);margin-bottom:8px;\">Asunto: <strong>"+r.asunto+"</strong></div>";h+="<div id=\"email-body\" class=\"copy-block\">"+r.mensaje+"</div></div>";h+="<div class=\"card\">";h+="<div style=\"display:flex;justify-content:space-between;align-items:center;margin-bottom:10px;\">";h+="<div class=\"card-title\" style=\"margin-bottom:0;\">LinkedIn</div>";h+="<button class=\"btn btn-sm btn-ghost\" data-id=\"li-body\" onclick=\"cpBtn(this)\">Copiar</button>";h+="</div>";h+="<div id=\"li-body\" class=\"copy-block\">"+r.mensajeLinkedIn+"</div></div>";document.getElementById("resultado-outreach").innerHTML=h;}).catch(function(e){console.error(e);}).finally(function(){document.getElementById("btn-outreach").disabled=false;document.getElementById("outreach-step").style.display="none";});}',
    'function cpBtn(btn){var id=btn.getAttribute("data-id");navigator.clipboard&&navigator.clipboard.writeText(document.getElementById(id).innerText);btn.textContent="\u2713 Copiado";setTimeout(function(){btn.textContent="Copiar";},2000);}',
    'function cargarSeguimiento(){var btn=document.getElementById("btn-seg");btn.disabled=true;btn.textContent="Cargando...";notionQ(PROC_DB,{property:"Estado",select:{equals:"Contactado"}},[{property:"Fecha de Contacto",direction:"ascending"}]).then(function(d){var items=(d.results||[]).map(function(p){var pr=p.properties||{};return{id:p.id,nombre:pr.Candidato&&pr.Candidato.title&&pr.Candidato.title[0]?pr.Candidato.title[0].plain_text:"Sin nombre",busqueda:pr["B\u00fasqueda Asociada"]&&pr["B\u00fasqueda Asociada"].rich_text&&pr["B\u00fasqueda Asociada"].rich_text[0]?pr["B\u00fasqueda Asociada"].rich_text[0].plain_text:"",fecha:pr["Fecha de Contacto"]&&pr["Fecha de Contacto"].date?pr["Fecha de Contacto"].date.start:null};});var lista=document.getElementById("lista-seguimiento");if(!items.length){lista.innerHTML="<div style=\"text-align:center;color:var(--text3);font-size:13px;padding:40px;\">No hay candidatos contactados</div>";}else{lista.innerHTML=items.map(function(p){var dias=p.fecha?Math.floor((Date.now()-new Date(p.fecha))/86400000):null;var urg=dias!==null&&dias>5;return"<div class=\"seg-card\" style=\"border-left:3px solid "+(urg?"#DC2626":"#52B788")+";\"><div style=\"display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:10px;\"><div><div style=\"font-weight:500;font-size:14px;\">"+p.nombre+"</div><div style=\"font-size:12px;color:var(--text3);margin-top:2px;\">"+p.busqueda+"</div></div>"+(dias!==null?"<span class=\"badge "+(urg?"badge-red":"badge-blue")+"\">" +dias+" d\u00edas sin respuesta</span>":"")+"</div><div id=\"fu-"+p.id+"\"><button class=\"btn btn-sm btn-ghost\" onclick=\"genFU(\'"+p.id+"\',\'"+p.nombre.replace(/['\\]/g,"")+"\',\'"+p.busqueda.replace(/['\\]/g,"")+"\',\'"+(dias||0)+"\')\">Generar follow-up</button></div></div>";}).join("");}}).catch(function(){document.getElementById("lista-seguimiento").innerHTML="<div style=\"color:#DC2626;padding:16px;\">Error cargando</div>";}).finally(function(){btn.disabled=false;btn.textContent="Actualizar";});}',
    'function genFU(id,nombre,busqueda,dias){var div=document.getElementById("fu-"+id);div.innerHTML="<span style=\"font-size:12px;color:var(--text3);\">Generando...</span>";callClaude("Agente de recruiting. Gener\u00e1s follow-ups breves y directos. Solo el texto, sin JSON.","Candidato: "+nombre+". B\u00fasqueda: "+busqueda+". D\u00edas sin respuesta: "+dias+".").then(function(txt){div.innerHTML="<div class=\"result-box\">"+txt+"</div>";}).catch(function(){div.innerHTML="<span style=\"color:#DC2626;font-size:12px;\">Error generando</span>";});}',
    'loadBusquedas();'
  ].join('\n');
}
