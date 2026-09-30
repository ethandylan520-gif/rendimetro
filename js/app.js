(() => {
  const cfg = window.CONFIG || {};
  const GPU = Object.fromEntries(GPUS.map(g => [g.id, g]));
  const CPU = Object.fromEntries(CPUS.map(c => [c.id, c]));
  const JUEGO = Object.fromEntries(JUEGOS.map(j => [j.id, j]));
  const GPU_TOP = Math.max(...GPUS.map(g => g.idx));
  const CPU_TOP = Math.max(...CPUS.map(c => c.game));

  // gpu: escala de FPS respecto a 1440p. cpu: fracción del índice de gráfica que el procesador tiene que igualar.
  const RES = {
    '1080': { label: '1080p', gpu: 1.35, cpu: 1.0, vram: 1.0 },
    '1440': { label: '1440p', gpu: 1.0, cpu: 0.78, vram: 1.15 },
    '2160': { label: '4K', gpu: 0.55, cpu: 0.55, vram: 1.4 }
  };
  const PRESETS = [
    { id: 'baja', label: 'Baja', w: 1, cpu: 1.15, vram: 0.6 },
    { id: 'media', label: 'Media', w: 0.55, cpu: 1.08, vram: 0.72 },
    { id: 'alta', label: 'Alta', w: 0.22, cpu: 1.03, vram: 0.86 },
    { id: 'ultra', label: 'Ultra', w: 0, cpu: 1.0, vram: 1.0 }
  ];
  const TABS = ['gpu', 'cpu', 'cuello', 'fps', 'pc'];

  const $ = id => document.getElementById(id);
  const diff = (a, b) => Math.round((a / b - 1) * 100);
  const escapeHtml = s => s.replace(/[&<>"']/g, ch => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[ch]));
  const norm = s => s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-z0-9 ]/g, ' ').replace(/\s+/g, ' ').trim();

  // Si el juego es un perfil genérico y el usuario escribió un nombre, usamos ese nombre en los textos.
  function nombreJuego(selectId, j) {
    const custom = $(selectId).dataset.custom;
    return j.generic && custom ? `«${escapeHtml(custom)}»` : j.name;
  }

  function notaGenerico(selectId, j) {
    if (!j.generic) return '';
    const custom = $(selectId).dataset.custom;
    const quien = custom ? `«${escapeHtml(custom)}»` : 'ese juego';
    return `<p class="note">No tenemos datos concretos de ${quien}: lo estimamos como ${j.perfil}. Tómalo como una referencia aproximada.</p>`;
  }

  function amazonUrl(query) {
    const url = new URL(`https://${cfg.amazonDominio || 'www.amazon.es'}/s`);
    url.searchParams.set('k', query);
    if (cfg.amazonTag) url.searchParams.set('tag', cfg.amazonTag);
    return url.toString();
  }

  function buyLink(item, kind) {
    const query = kind === 'gpu' ? `tarjeta gráfica ${item.name}` : `procesador ${item.brand} ${item.name}`;
    return `<a class="amz amz-${kind}" href="${amazonUrl(query)}" target="_blank" rel="sponsored noopener">Ver ${item.name} en Amazon</a>`;
  }

  const affNote = '<p class="aff-note">Enlaces de afiliado: si compras a través de ellos, esta web recibe una pequeña comisión sin coste extra para ti.</p>';

  // ---------- Velocímetro ----------
  const G_START = -125, G_SWEEP = 250;
  const ESC_PTS = [[20, 4], [40, 4], [60, 6], [80, 4], [100, 5], [120, 6], [140, 7]];
  const ESC_FPS = [[60, 4], [90, 3], [120, 4], [180, 3], [240, 4], [300, 5], [360, 6], [480, 4], [600, 5], [900, 6], [1200, 6]];
  const FPS_ZONAS = [[0, 30, 'bad'], [30, 60, 'warn'], [60, 144, 'ok'], [144, Infinity, 'info']];

  const escala = (valor, opciones) => opciones.find(([m]) => m >= valor) || opciones[opciones.length - 1];
  const fix = n => n.toFixed(2);

  function polar(r, deg) {
    const a = deg * Math.PI / 180;
    return [100 + r * Math.sin(a), 100 - r * Math.cos(a)];
  }

  function arco(r, from, to) {
    const [x1, y1] = polar(r, from), [x2, y2] = polar(r, to);
    return `M ${fix(x1)} ${fix(y1)} A ${r} ${r} 0 ${to - from > 180 ? 1 : 0} 1 ${fix(x2)} ${fix(y2)}`;
  }

  function gauge({ value, scale, label, sub = '', unit, color, read, zonas }) {
    const [max, pasos] = scale;
    const t = Math.max(0, Math.min(1, value / max));
    const ang = G_START + G_SWEEP * t;
    const toAng = v => G_START + G_SWEEP * Math.min(1, v / max);

    let marcas = '';
    const total = pasos * 4;
    for (let i = 0; i <= total; i++) {
      const deg = G_START + G_SWEEP * i / total;
      const mayor = i % 4 === 0;
      const [x1, y1] = polar(mayor ? 60 : 64, deg), [x2, y2] = polar(70, deg);
      marcas += `<line x1="${fix(x1)}" y1="${fix(y1)}" x2="${fix(x2)}" y2="${fix(y2)}" class="${mayor ? 'tk-major' : 'tk'}"/>`;
      if (mayor) {
        const [lx, ly] = polar(49, deg);
        marcas += `<text x="${fix(lx)}" y="${fix(ly)}" class="tk-label">${Math.round(max * i / total)}</text>`;
      }
    }

    const bandas = (zonas || [])
      .filter(([desde]) => desde < max)
      .map(([desde, hasta, cls]) => `<path d="${arco(89, toAng(desde), toAng(Math.min(hasta, max)))}" class="g-zone z-${cls}"/>`)
      .join('');

    const lleno = t > 0.005
      ? `<path d="${arco(80, G_START, G_START + G_SWEEP)}" pathLength="100" class="g-value c-${color}" style="stroke-dasharray:${fix(t * 100)} 100"/>`
      : '';

    return `<figure class="gauge">
      <svg viewBox="0 0 200 162" role="img" aria-label="${label}: ${read ?? Math.round(value)} ${unit}">
        ${bandas}
        <path d="${arco(80, G_START, G_START + G_SWEEP)}" class="g-track"/>
        ${lleno}
        ${marcas}
        <polygon points="96.5,100 103.5,100 100,26" class="needle n-${color}" style="transform:rotate(${fix(ang)}deg)"/>
        <circle cx="100" cy="100" r="7" class="hub"/>
        <text x="100" y="141" class="g-read">${read ?? Math.round(value)}</text>
        <text x="100" y="155" class="g-unit">${unit}</text>
      </svg>
      <figcaption><span class="g-label">${label}</span>${sub ? `<span class="g-sub">${sub}</span>` : ''}</figcaption>
    </figure>`;
  }

  function fillHardware(select, items, key) {
    const brands = [...new Set(items.map(i => i.brand))];
    select.innerHTML = brands.map(b => {
      const opts = items.filter(i => i.brand === b)
        .sort((x, y) => y[key] - x[key])
        .map(i => `<option value="${i.id}">${i.name}</option>`).join('');
      return `<optgroup label="${b}">${opts}</optgroup>`;
    }).join('');
  }

  function fillRes(select) {
    select.innerHTML = Object.entries(RES).map(([k, r]) => `<option value="${k}">${r.label}</option>`).join('');
  }

  function specRow(label, a, b, better) {
    let ca = '', cb = '';
    if (better && a.num !== b.num) {
      const aWins = better === 'high' ? a.num > b.num : a.num < b.num;
      ca = aWins ? 'win' : '';
      cb = aWins ? '' : 'win';
    }
    return `<tr><th scope="row">${label}</th><td class="${ca}">${a.txt}</td><td class="${cb}">${b.txt}</td></tr>`;
  }

  function recBox(kind, item, html) {
    return `<div class="rec rec-${kind}"><p>${html}</p>${buyLink(item, kind)}</div>`;
  }

  // ---------- Gráfica vs gráfica ----------
  function renderGpu() {
    const a = GPU[$('gpuA').value], b = GPU[$('gpuB').value];
    let head;
    if (a === b) {
      head = 'Has elegido la misma gráfica en los dos lados.';
    } else {
      const [w, l] = a.idx >= b.idx ? [a, b] : [b, a];
      const d = diff(w.idx, l.idx);
      head = d < 3
        ? `<strong>${a.name}</strong> y <strong>${b.name}</strong> rinden prácticamente igual.`
        : `<strong>${w.name}</strong> rinde un <strong class="hl-gpu">${d}% más</strong> que ${l.name}.`;
    }
    const scale = escala(Math.max(a.idx, b.idx) * 1.08, ESC_PTS);
    const eff = g => Math.round(g.idx / g.tdp * 1000) / 10;
    $('gpuResult').innerHTML = `
      <p class="headline">${head}</p>
      <div class="gauges">
        ${gauge({ value: a.idx, scale, label: a.name, sub: `${a.vram} GB · ${a.tdp} W`, unit: 'PTS', color: 'gpu' })}
        ${gauge({ value: b.idx, scale, label: b.name, sub: `${b.vram} GB · ${b.tdp} W`, unit: 'PTS', color: 'gpu-b' })}
      </div>
      <div class="table-wrap"><table class="specs">
        <thead><tr><th></th><th>${a.name}</th><th>${b.name}</th></tr></thead>
        <tbody>
          ${specRow('Rendimiento', { num: a.idx, txt: `${a.idx} pts` }, { num: b.idx, txt: `${b.idx} pts` }, 'high')}
          ${specRow('Memoria (VRAM)', { num: a.vram, txt: `${a.vram} GB` }, { num: b.vram, txt: `${b.vram} GB` }, 'high')}
          ${specRow('Consumo', { num: a.tdp, txt: `${a.tdp} W` }, { num: b.tdp, txt: `${b.tdp} W` }, 'low')}
          ${specRow('Eficiencia', { num: eff(a), txt: `${eff(a)} pts / 100 W` }, { num: eff(b), txt: `${eff(b)} pts / 100 W` }, 'high')}
          ${specRow('Lanzamiento', { num: a.year, txt: a.year }, { num: b.year, txt: b.year }, null)}
        </tbody>
      </table></div>
      <div class="buy">${buyLink(a, 'gpu')}${a !== b ? buyLink(b, 'gpu') : ''}</div>
      ${affNote}`;
  }

  // ---------- Procesador vs procesador ----------
  function renderCpu() {
    const a = CPU[$('cpuA').value], b = CPU[$('cpuB').value];
    let head, sub = '';
    if (a === b) {
      head = 'Has elegido el mismo procesador en los dos lados.';
    } else {
      const [w, l] = a.game >= b.game ? [a, b] : [b, a];
      const d = diff(w.game, l.game);
      head = d < 3
        ? `En juegos, <strong>${a.name}</strong> y <strong>${b.name}</strong> rinden prácticamente igual.`
        : `En juegos, <strong>${w.name}</strong> rinde un <strong class="hl-cpu">${d}% más</strong> que ${l.name}.`;
      const [mw, ml] = a.multi >= b.multi ? [a, b] : [b, a];
      const dm = diff(mw.multi, ml.multi);
      sub = dm < 3
        ? 'En tareas multinúcleo (edición de vídeo, streaming, renderizado) van a la par.'
        : `En tareas multinúcleo (edición de vídeo, streaming, renderizado) gana el ${mw.name} por un ${dm}%.`;
    }
    const scaleG = escala(Math.max(a.game, b.game) * 1.08, ESC_PTS);
    const scaleM = escala(Math.max(a.multi, b.multi) * 1.08, ESC_PTS);
    const plataforma = a.socket === b.socket
      ? `<p class="note">Los dos usan la plataforma ${a.socket}: puedes cambiar uno por otro sin cambiar de placa base (a veces hace falta actualizar la BIOS).</p>`
      : '';
    $('cpuResult').innerHTML = `
      <p class="headline">${head}</p>
      ${sub ? `<p class="subline">${sub}</p>` : ''}
      <div class="gauges four">
        ${gauge({ value: a.game, scale: scaleG, label: a.name, sub: 'Juegos', unit: 'PTS', color: 'cpu' })}
        ${gauge({ value: b.game, scale: scaleG, label: b.name, sub: 'Juegos', unit: 'PTS', color: 'cpu-b' })}
        ${gauge({ value: a.multi, scale: scaleM, label: a.name, sub: 'Multinúcleo', unit: 'PTS', color: 'cpu' })}
        ${gauge({ value: b.multi, scale: scaleM, label: b.name, sub: 'Multinúcleo', unit: 'PTS', color: 'cpu-b' })}
      </div>
      <div class="table-wrap"><table class="specs cpu-specs">
        <thead><tr><th></th><th>${a.name}</th><th>${b.name}</th></tr></thead>
        <tbody>
          ${specRow('Núcleos / hilos', { num: a.threads, txt: `${a.cores} / ${a.threads}` }, { num: b.threads, txt: `${b.cores} / ${b.threads}` }, 'high')}
          ${specRow('Plataforma', { num: 0, txt: a.socket }, { num: 0, txt: b.socket }, null)}
          ${specRow('Lanzamiento', { num: a.year, txt: a.year }, { num: b.year, txt: b.year }, null)}
        </tbody>
      </table></div>
      ${plataforma}
      <div class="buy">${buyLink(a, 'cpu')}${a !== b ? buyLink(b, 'cpu') : ''}</div>
      ${affNote}`;
  }

  // ---------- Cuello de botella ----------
  function cuello(g, c, resKey) {
    const need = g.idx * RES[resKey].cpu;
    const feed = Math.min(1, c.game / need);
    return { need, feed, bn: (1 - feed) * 100 };
  }

  function recomendarCpu(need, actual) {
    const cands = CPUS.filter(x => x.buy && x.game >= need && x.game > actual.game).sort((a, b) => a.game - b.game);
    return cands.find(x => x.socket === actual.socket) || cands[0] || null;
  }

  function mejoraGpu(c, resKey, actual) {
    const k = RES[resKey].cpu;
    const aguanta = GPUS.filter(x => x.buy && x.idx > actual.idx && x.idx * k <= c.game * 1.02);
    if (!aguanta.length) return null;
    const techo = aguanta.reduce((m, x) => (x.idx > m.idx ? x : m));
    const paso = aguanta.filter(x => x.idx >= actual.idx * 1.35).sort((a, b) => a.idx - b.idx)[0] || techo;
    return { paso, techo };
  }

  function renderCuello() {
    const g = GPU[$('bnGpu').value], c = CPU[$('bnCpu').value], r = $('bnRes').value;
    const res = RES[r].label;
    const { need, feed, bn } = cuello(g, c, r);
    let tone, title, text, extra = '';

    if (bn > 5) {
      if (bn > 30) { tone = 'bad'; title = 'Cuello de botella fuerte'; }
      else if (bn > 15) { tone = 'orange'; title = 'Cuello de botella notable'; }
      else { tone = 'warn'; title = 'Cuello de botella leve'; }
      text = `En ${res}, el ${c.name} solo puede aprovechar en torno al <strong>${Math.round(feed * 100)}%</strong> de la ${g.name}. Lo notarás sobre todo en juegos competitivos y cuando buscas muchos FPS.`;
      const rec = recomendarCpu(need, c);
      if (rec) {
        const plat = rec.socket === c.socket
          ? 'Usa tu misma plataforma, así que no tendrías que cambiar de placa base (puede que haga falta actualizar la BIOS).'
          : `Ojo: usa otra plataforma (${rec.socket}), así que tendrías que cambiar también la placa base.`;
        extra = recBox('cpu', rec, `Para aprovechar la ${g.name} en ${res} te iría mejor un <strong>${rec.name}</strong>. ${plat}`);
        if (rec.socket !== c.socket) {
          const misma = CPUS.filter(x => x.buy && x.socket === c.socket && x.game > c.game).sort((a, b) => b.game - a.game)[0];
          if (misma) {
            const queda = Math.round(Math.max(0, 1 - misma.game / need) * 100);
            const efecto = queda > 5 ? `el cuello bajaría a un ${queda}%` : 'el cuello prácticamente desaparecería';
            extra += recBox('cpu', misma, `Si no quieres cambiar de placa, lo mejor que puedes montar en ${c.socket} es un <strong>${misma.name}</strong>: ${efecto}.`);
          }
        }
      } else {
        extra = `<p class="note">Con esta gráfica, en ${res} hasta el procesador más rápido del mercado se queda algo corto. Es normal en la gama más alta: si juegas a más resolución, la aprovecharás mejor.</p>`;
      }
    } else if (c.game >= need * 1.6 && g.idx < GPU_TOP) {
      tone = 'info'; title = 'La gráfica marca el límite';
      text = `El ${c.name} va sobrado para la ${g.name}. No es un problema, es lo ideal: puedes mejorar la gráfica y notar el salto sin cambiar de procesador.`;
      const m = mejoraGpu(c, r, g);
      if (m) {
        const techo = m.techo !== m.paso ? ` Tu procesador aguantaría incluso una ${m.techo.name} en ${res}.` : '';
        extra = recBox('gpu', m.paso, `Una buena mejora sería la <strong>${m.paso.name}</strong> (+${diff(m.paso.idx, g.idx)}% de rendimiento).${techo}`);
      }
    } else {
      tone = 'ok'; title = 'Combinación equilibrada';
      text = `El ${c.name} aprovecha bien la ${g.name} en ${res}. Ninguno de los dos frena al otro de forma notable.`;
    }

    const porRes = Object.keys(RES).map(k => {
      const x = cuello(g, c, k).bn;
      const cls = x > 30 ? 'bad' : x > 15 ? 'orange' : x > 5 ? 'warn' : 'ok';
      return `<li><span>${RES[k].label}</span><strong class="t-${cls}">${x > 5 ? `Limita un ${Math.round(x)}%` : 'Sin cuello de botella'}</strong></li>`;
    }).join('');

    const compat = [{ ok: true, txt: `Encajan: la ${g.name} va en cualquier placa con ranura PCIe x16, así que puedes montarla con el ${c.name}.` }];
    if (g.x8 && c.pcie3) {
      compat.push({ ok: false, txt: `La ${g.name} usa solo 8 líneas PCIe y el ${c.name} va con PCIe 3.0: perderá algo de rendimiento, sobre todo cuando se quede sin VRAM.` });
    }
    if (g.brand === 'Intel' && (c.socket === 'LGA1151' || c.id === 'r2600')) {
      compat.push({ ok: false, txt: `Las Intel Arc necesitan Resizable BAR para rendir bien y con el ${c.name} lo más probable es que tu placa no lo tenga. Sin él rinden bastante peor.` });
    } else if (g.brand === 'Intel' && c.game < 65) {
      compat.push({ ok: false, txt: `Las Intel Arc pierden algo de rendimiento con procesadores modestos como el ${c.name} por la carga extra de su driver.` });
    }
    const compatHtml = `<ul class="compat">${compat.map(x => `<li class="${x.ok ? 'cp-si' : 'cp-aviso'}">${x.txt}</li>`).join('')}</ul>`;

    $('bnResult').innerHTML = `
      <h3 class="bars-title">Compatibilidad</h3>
      ${compatHtml}
      <h3 class="bars-title">Equilibrio (cuello de botella)</h3>
      <div class="verdict v-${tone}"><span class="verdict-title">${title}</span><p>${text}</p></div>
      <div class="gauges three">
        ${gauge({ value: g.idx / GPU_TOP * 100, scale: [100, 5], label: 'Potencia gráfica', sub: g.name, unit: '/ 100', color: 'gpu' })}
        ${gauge({ value: c.game / CPU_TOP * 100, scale: [100, 5], label: 'Potencia procesador', sub: c.name, unit: '/ 100', color: 'cpu' })}
        ${gauge({ value: feed * 100, scale: [100, 5], label: 'Aprovechamiento', sub: 'de la gráfica', unit: '%', color: tone })}
      </div>
      <h3 class="bars-title">Según la resolución</h3>
      <ul class="res-list">${porRes}</ul>
      <p class="note">A más resolución, más trabaja la gráfica y menos importa el procesador.</p>
      ${extra}
      ${extra.includes('class="rec') ? affNote : ''}`;
  }

  // ---------- FPS por juego ----------
  function estimar(g, c, j, resKey, p) {
    const R = RES[resKey];
    const boost = 1 + (j.low - 1) * p.w;
    let gpuFps = j.gpu * (g.idx / 100) * R.gpu * boost;
    const cpuFps = j.cpu * (c.game / 100) * p.cpu;
    const vramNeed = j.vram * R.vram * p.vram;
    const vramShort = g.vram < vramNeed;
    if (vramShort) gpuFps *= 0.75;
    let fps = Math.pow(Math.pow(gpuFps, -4) + Math.pow(cpuFps, -4), -0.25);
    const capped = Boolean(j.cap) && fps >= j.cap;
    if (j.cap) fps = Math.min(fps, j.cap);
    return { fps, gpuFps, cpuFps, limit: gpuFps < cpuFps ? 'gpu' : 'cpu', vramShort, vramNeed, capped };
  }

  function fpsTier(fps) {
    if (fps < 30) return { cls: 'bad', label: 'No jugable' };
    if (fps < 60) return { cls: 'warn', label: 'Jugable' };
    if (fps < 144) return { cls: 'ok', label: 'Fluido' };
    return { cls: 'info', label: 'Competitivo' };
  }

  function renderFps() {
    const g = GPU[$('fpsGpu').value], c = CPU[$('fpsCpu').value], j = JUEGO[$('fpsGame').value], r = $('fpsRes').value;
    const nombre = nombreJuego('fpsGame', j);
    const res = RES[r].label;
    const rows = PRESETS.map(p => ({ p, ...estimar(g, c, j, r, p) }));
    const scale = escala(Math.max(...rows.map(x => x.fps), 60) * 1.05, ESC_FPS);

    const table = rows.map(x => {
      const t = fpsTier(x.fps);
      const lim = x.capped ? 'Límite del juego' : x.limit === 'gpu' ? 'Limita la gráfica' : 'Limita el procesador';
      return gauge({
        value: x.fps, scale, label: `Calidad ${x.p.label}`,
        sub: `<b class="t-${t.cls}">${t.label}</b> · ${lim}`,
        unit: 'FPS', color: t.cls, zonas: FPS_ZONAS
      });
    }).join('');

    const cortos = rows.filter(x => x.vramShort).map(x => x.p.label);
    const lista = cortos.length > 1 ? `${cortos.slice(0, -1).join(', ')} y ${cortos[cortos.length - 1]}` : cortos[0];
    const vram = cortos.length
      ? `<p class="note warn-note">Con ${g.vram} GB de VRAM te quedas corto en calidad ${lista} (${nombre} pide unos ${Math.ceil(rows[3].vramNeed)} GB en Ultra a ${res}). Baja la calidad de texturas para evitar tirones.</p>`
      : '';
    const alta = rows[2], ultra = rows[3];
    const cap = j.cap && !ultra.capped ? `<p class="note">${nombre} tiene un límite de ${j.cap} FPS.</p>` : '';
    let rec;
    if (ultra.capped && !ultra.vramShort) {
      rec = `<p class="note ok-note">Con este equipo mueves ${nombre} en <strong>Ultra</strong> al máximo que permite el juego (${j.cap} FPS) en ${res}.</p>`;
    } else if (ultra.fps >= 60 && !ultra.vramShort) {
      rec = `<p class="note ok-note">Con este equipo mueves ${nombre} en <strong>Ultra</strong> a más de 60 FPS en ${res}.</p>`;
    } else if (alta.fps >= 60 && !alta.vramShort) {
      rec = `<p class="note ok-note">Puedes jugar en <strong>Alta</strong> a más de 60 FPS en ${res}. Para Ultra fluido te haría falta algo más de potencia.</p>`;
    } else {
      const P = PRESETS[2];
      const cpuOk = j.cpu * (c.game / 100) * P.cpu >= 66;
      const gpuOk = alta.gpuFps >= 66 && !alta.vramShort;
      let cpuPick = null;
      if (!cpuOk) {
        const need = 66 / (j.cpu * P.cpu) * 100;
        const cands = CPUS.filter(x => x.buy && x.game >= need).sort((a, b) => a.game - b.game);
        cpuPick = cands.find(x => x.socket === c.socket) || cands[0] || null;
      }
      const gpuPick = gpuOk ? null : GPUS.filter(x => x.buy && x.idx > g.idx).sort((a, b) => a.idx - b.idx)
        .find(x => { const e = estimar(x, cpuPick || c, j, r, P); return e.fps >= 60 && !e.vramShort; }) || null;

      if (!cpuOk && !cpuPick) {
        rec = `<p class="note">Este juego es muy exigente con el procesador: ni los más rápidos llegan a 60 FPS estables en Alta.</p>`;
      } else if (cpuPick && gpuPick) {
        rec = `<p class="note">Para 60 FPS en Alta en ${res} se quedan cortas las dos piezas: te haría falta al menos un <strong>${cpuPick.name}</strong> y una <strong>${gpuPick.name}</strong>.</p>`
          + recBox('cpu', cpuPick, `Procesador recomendado: <strong>${cpuPick.name}</strong>.`)
          + recBox('gpu', gpuPick, `Gráfica recomendada: <strong>${gpuPick.name}</strong>.`);
      } else if (cpuPick) {
        rec = recBox('cpu', cpuPick, `En este juego te frena el procesador. Para ir a 60 FPS en Alta te haría falta al menos un <strong>${cpuPick.name}</strong>.`);
      } else if (gpuPick) {
        rec = recBox('gpu', gpuPick, `Para jugar a 60 FPS en Alta en ${res} te haría falta al menos una <strong>${gpuPick.name}</strong>.`);
      } else {
        rec = `<p class="note">Ninguna gráfica actual llega a 60 FPS en Alta en ${res} con este procesador. Prueba a bajar la resolución.</p>`;
      }
    }

    $('fpsResult').innerHTML = `
      <p class="headline"><strong>${nombre}</strong> en ${res} con ${g.name} y ${c.name}</p>
      <div class="gauges four">${table}</div>
      ${notaGenerico('fpsGame', j)}${vram}${cap}${rec}
      <p class="aff-note">Estimación orientativa sin DLSS/FSR ni generación de fotogramas: con reescalado puedes ganar bastante más.</p>
      ${rec.includes('class="rec') ? affNote : ''}`;
  }

  // ---------- Tu PC ideal ----------
  const COMPETITIVOS = ['cs2', 'valorant', 'lol', 'fortnite', 'apex', 'rivals', 'bo6', 'bf6'];
  const PRESUPUESTO_MIN = 300, RANGO_MAX = 4000;
  const eur = n => `${Math.round(n).toLocaleString('es-ES')} €`;

  function fuentePara(g, c) {
    const need = (g.tdp + c.w + 100) * 1.3;
    return PIEZAS.fuentes.find(f => f.w >= need) || PIEZAS.fuentes[PIEZAS.fuentes.length - 1];
  }

  function montar(g, c, grande) {
    const plat = PIEZAS.plataformas[c.socket];
    const gb = grande ? 32 : 16;
    const ram = PIEZAS.ram[plat.ram][gb];
    const fuente = fuentePara(g, c);
    const caja = grande ? PIEZAS.cajas.buena : PIEZAS.cajas.basica;
    const disip = PIEZAS.disipadores[c.disipador];
    const partes = [
      { tipo: 'Gráfica', nombre: g.name, precio: g.precio, q: `tarjeta gráfica ${g.name}` },
      { tipo: 'Procesador', nombre: c.name, precio: c.precio, q: `procesador ${c.brand} ${c.name}` },
      { tipo: 'Placa base', nombre: `${plat.chipset} (${c.socket})`, precio: plat.precio, q: plat.q },
      { tipo: 'Memoria RAM', nombre: `${gb} GB ${plat.ram}`, precio: ram.precio, q: ram.q },
      { tipo: 'Almacenamiento', nombre: PIEZAS.ssd.nombre, precio: PIEZAS.ssd.precio, q: PIEZAS.ssd.q },
      { tipo: 'Fuente', nombre: `${fuente.w} W 80 Plus Gold`, precio: fuente.precio, q: `fuente alimentación ${fuente.w}W 80 Plus Gold` },
      { tipo: 'Caja', nombre: caja.nombre, precio: caja.precio, q: caja.q },
      { tipo: 'Disipador', nombre: disip.nombre, precio: disip.precio, q: disip.q }
    ];
    return { g, c, partes, total: partes.reduce((s, p) => s + p.precio, 0) };
  }

  function mejorHasta(lista, tope) {
    const dentro = lista.filter(b => b.total <= tope);
    if (!dentro.length) return null;
    const top = Math.max(...dentro.map(b => b.est.fps));
    return dentro.filter(b => b.est.fps >= top * 0.98).sort((a, b) => a.total - b.total)[0];
  }

  const miniLink = q => `<a class="amz-mini" href="${amazonUrl(q)}" target="_blank" rel="sponsored noopener">Ver en Amazon</a>`;

  function cambios(de, a) {
    const out = [];
    if (de.g !== a.g) out.push({ html: `Gráfica: ${de.g.name} → <strong>${a.g.name}</strong>`, q: `tarjeta gráfica ${a.g.name}` });
    if (de.c !== a.c) {
      const placa = de.c.socket !== a.c.socket ? ' (con otra placa base)' : '';
      out.push({ html: `Procesador: ${de.c.name} → <strong>${a.c.name}</strong>${placa}`, q: `procesador ${a.c.brand} ${a.c.name}` });
    }
    return out;
  }

  function leerPresupuesto() {
    const v = Math.round(Number($('pcBudget').value));
    return Number.isFinite(v) && v >= PRESUPUESTO_MIN ? v : null;
  }

  function renderPc() {
    const j = JUEGO[$('pcGame').value], r = $('pcRes').value;
    const nombre = nombreJuego('pcGame', j);
    const p = PRESETS.find(x => x.id === $('pcCal').value);
    const presupuesto = leerPresupuesto();
    if (presupuesto === null) {
      $('pcResult').innerHTML = `<p class="note warn-note">Escribe un presupuesto de al menos ${eur(PRESUPUESTO_MIN)}.</p>`;
      return;
    }
    const res = RES[r].label;
    const grande = presupuesto >= 900;
    const lista = [];
    for (const g of GPUS) {
      if (!g.buy) continue;
      // El modelo de FPS medio no ve los mínimos ni otros juegos: evitamos procesadores muy por debajo de la gráfica.
      const cpuMin = Math.min(95, g.idx * 0.65);
      for (const c of CPUS) {
        if (!c.buy || c.game < cpuMin) continue;
        const b = montar(g, c, grande);
        b.est = estimar(g, c, j, r, p);
        lista.push(b);
      }
    }

    let elegido = mejorHasta(lista, presupuesto);
    let aviso = '';
    if (!elegido) {
      elegido = [...lista].sort((a, b) => a.total - b.total)[0];
      aviso = `<p class="note warn-note">Con ${eur(presupuesto)} no llega para un PC completo con piezas nuevas. Lo más económico que tiene sentido ronda los <strong>${eur(elegido.total)}</strong>: te lo enseñamos como referencia.</p>`;
    }

    const e = elegido.est;
    const t = fpsTier(e.fps);
    // Por encima de 60 FPS no tiene sentido hablar de qué pieza "limita": ya se juega de sobra.
    let lim;
    if (e.capped) lim = 'Al máximo del juego';
    else if (e.fps >= 60) lim = 'Perfecto para jugar';
    else lim = e.limit === 'gpu' ? 'Limita la gráfica' : 'Limita el procesador';
    const scale = escala(Math.max(e.fps, 60) * 1.05, ESC_FPS);

    const filas = elegido.partes.map(x => `<tr>
        <th scope="row">${x.tipo}</th>
        <td>${x.nombre}</td>
        <td class="precio">${x.precio ? `~${eur(x.precio)}` : '—'}</td>
        <td class="link">${x.q ? miniLink(x.q) : ''}</td>
      </tr>`).join('');

    const objetivo = Math.min(COMPETITIVOS.includes(j.id) ? 144 : 60, j.cap || Infinity);
    const barato = lista.filter(b => b.est.fps >= objetivo).sort((a, b) => a.total - b.total)[0];
    let notas = notaGenerico('pcGame', j) + aviso;
    if (e.vramShort) notas += `<p class="note warn-note">En calidad ${p.label} a ${res} este juego pide más VRAM de la que tienen las gráficas de este presupuesto: baja la calidad de texturas para evitar tirones.</p>`;
    const siguiente = lista.filter(b => b.est.fps >= e.fps * 1.05).sort((a, b) => a.total - b.total)[0];
    const sobra = !aviso && elegido.total < presupuesto - 150;
    if (!aviso) {
      if (e.capped) {
        notas += `<p class="note ok-note">${nombre} está limitado a ${j.cap} FPS y con este equipo ya lo mueves al máximo.</p>`;
      } else if (e.fps < objetivo && barato) {
        notas += `<p class="note">Con este presupuesto no llegas a ${objetivo} FPS. Para conseguirlo harían falta unos <strong>${eur(barato.total)}</strong> (${barato.g.name} + ${barato.c.name}).</p>`;
      } else if (e.fps < objetivo) {
        notas += `<p class="note">Ningún PC con piezas actuales llega a ${objetivo} FPS en esta calidad y resolución. Prueba a bajar la calidad.</p>`;
      } else if (barato && barato.total < elegido.total * 0.8) {
        notas += `<p class="note ok-note">Para jugar a ${objetivo} FPS te bastaría con unos <strong>${eur(barato.total)}</strong> (${barato.g.name} + ${barato.c.name}). Lo que gastes de más se nota en FPS extra.</p>`;
      }
      if (sobra && !e.capped) {
        notas += siguiente
          ? `<p class="note">No hace falta gastar todo tu presupuesto: con ${eur(elegido.total)} ya tienes lo máximo que se consigue por debajo de ${eur(presupuesto)} en este juego.</p>`
          : `<p class="note">No hace falta gastar todo tu presupuesto: por encima de ${eur(elegido.total)} apenas ganarías FPS en este juego, gastes lo que gastes.</p>`;
      }
    }

    const mejoras = [];
    if (!aviso) {
      for (const extra of [100, 200, 350]) {
        const b = mejorHasta(lista, presupuesto + extra);
        if (!b || b.total <= elegido.total) continue;
        if (b.est.fps < e.fps * 1.05) continue;
        if (mejoras.some(m => m.g === b.g && m.c === b.c)) continue;
        mejoras.push(b);
      }
    }
    const tarjetas = mejoras.map(b => {
      const cs = cambios(elegido, b);
      return `<div class="upg">
          <div class="upg-top">
            <span class="upg-extra">+${eur(b.total - elegido.total)}</span>
            <span class="upg-fps">${Math.round(b.est.fps)} FPS <em>+${diff(b.est.fps, e.fps)}%</em></span>
          </div>
          <ul>${cs.map(x => `<li>${x.html}</li>`).join('')}</ul>
          <p class="upg-total">Total: ~${eur(b.total)}</p>
          <div class="upg-links">${cs.map(x => miniLink(x.q)).join('')}</div>
        </div>`;
    }).join('');
    let bloqueMejoras = '';
    if (!aviso && !e.capped) {
      let contenido;
      if (tarjetas) {
        contenido = `<div class="upgrades">${tarjetas}</div>`;
      } else if (siguiente) {
        const cs = cambios(elegido, siguiente);
        contenido = `<div class="upgrades"><div class="upg">
            <div class="upg-top">
              <span class="upg-extra">+${eur(siguiente.total - elegido.total)}</span>
              <span class="upg-fps">${Math.round(siguiente.est.fps)} FPS <em>+${diff(siguiente.est.fps, e.fps)}%</em></span>
            </div>
            <p class="upg-total">Por poco más no hay mejora que merezca la pena. El siguiente salto de rendimiento está en unos ${eur(siguiente.total)}:</p>
            <ul>${cs.map(x => `<li>${x.html}</li>`).join('')}</ul>
            <div class="upg-links">${cs.map(x => miniLink(x.q)).join('')}</div>
          </div></div>`;
      } else {
        contenido = sobra ? '' : '<p class="note">Gastando más apenas ganarías FPS en este juego: ya tienes lo que más sentido tiene.</p>';
      }
      if (contenido) bloqueMejoras = `<h3 class="bars-title">${tarjetas ? 'Por un poco más' : 'Si quieres más'}</h3>${contenido}`;
    }

    $('pcResult').innerHTML = `
      <p class="headline">Tu PC para <strong>${nombre}</strong> en ${res} · calidad ${p.label} · hasta ${eur(presupuesto)}</p>
      <div class="build">
        <div class="build-gauge">
          ${gauge({ value: e.fps, scale, label: `${Math.round(e.fps)} FPS estimados`, sub: `<b class="t-${t.cls}">${t.label}</b> · ${lim}`, unit: 'FPS', color: t.cls, zonas: FPS_ZONAS })}
        </div>
        <div class="table-wrap build-parts"><table class="parts">
          <tbody>${filas}</tbody>
          <tfoot><tr><th scope="row">Total</th><td></td><td class="precio">~${eur(elegido.total)}</td><td></td></tr></tfoot>
        </table></div>
      </div>
      ${notas}
      ${bloqueMejoras}
      <p class="aff-note">Precios orientativos del mercado español (septiembre 2026): el precio real puede variar, consúltalo en Amazon. No incluye monitor, periféricos ni sistema operativo. FPS estimados sin DLSS/FSR.</p>
      ${affNote}`;
  }

  // ---------- Buscador de juegos ----------
  const REALES = JUEGOS.filter(j => !j.generic).sort((a, b) => a.name.localeCompare(b.name, 'es'));
  const GENERICOS = JUEGOS.filter(j => j.generic);
  const etiqueta = j => (j.year ? `${j.name} <small>${j.year}</small>` : j.name);

  function buscarJuegos(texto) {
    const q = norm(texto);
    if (!q) return REALES;
    return REALES
      .filter(j => norm(j.name).includes(q) || (j.alias || []).some(a => a.startsWith(q) || q.startsWith(`${a} `)))
      .sort((a, b) => Number(norm(b.name).startsWith(q)) - Number(norm(a.name).startsWith(q)));
  }

  function initCombo(prefix) {
    const input = $(`${prefix}GameInput`), list = $(`${prefix}GameList`), select = $(`${prefix}Game`);
    let items = [], active = -1, escrito = '';

    const mostrarActual = () => {
      const j = JUEGO[select.value];
      input.value = j.generic && select.dataset.custom ? select.dataset.custom : j.name;
    };
    const cerrar = () => {
      list.hidden = true;
      input.setAttribute('aria-expanded', 'false');
      input.removeAttribute('aria-activedescendant');
      active = -1;
    };
    const marcar = () => {
      list.querySelectorAll('[role="option"]').forEach((li, i) => li.setAttribute('aria-selected', String(i === active)));
      const li = list.querySelector('[role="option"][aria-selected="true"]');
      if (li) {
        input.setAttribute('aria-activedescendant', li.id);
        li.scrollIntoView({ block: 'nearest' });
      } else {
        input.removeAttribute('aria-activedescendant');
      }
    };

    function pintar(texto) {
      escrito = texto.trim();
      const buscando = Boolean(norm(texto));
      const hits = buscarJuegos(texto);
      let html = '';
      if (hits.length) {
        items = buscando ? hits : [...hits, ...GENERICOS];
      } else {
        items = GENERICOS;
        html = `<li class="combo-empty" role="presentation">No tenemos «${escapeHtml(escrito)}» todavía. ¿Cómo de exigente es?</li>`;
      }
      html += items.map(j => {
        const sep = !buscando && j === GENERICOS[0] ? '<li class="combo-sep" role="presentation">¿No está tu juego?</li>' : '';
        return `${sep}<li role="option" id="${prefix}-opt-${j.id}" data-id="${j.id}" class="combo-opt${j.generic ? ' gen' : ''}" aria-selected="false">${etiqueta(j)}</li>`;
      }).join('');
      list.innerHTML = html;
      list.hidden = false;
      input.setAttribute('aria-expanded', 'true');
      active = hits.length && buscando ? 0 : -1;
      marcar();
    }

    function elegir(j) {
      if (j.generic && escrito && !buscarJuegos(escrito).length) select.dataset.custom = escrito.slice(0, 60);
      else delete select.dataset.custom;
      select.value = j.id;
      cerrar();
      select.dispatchEvent(new Event('change'));
    }

    input.addEventListener('focus', () => { input.select(); pintar(''); });
    input.addEventListener('click', () => { if (list.hidden) pintar(''); });
    input.addEventListener('input', () => pintar(input.value));
    input.addEventListener('keydown', e => {
      if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
        e.preventDefault();
        if (list.hidden) pintar(input.value);
        if (!items.length) return;
        active = e.key === 'ArrowDown' ? (active + 1) % items.length : (active - 1 + items.length) % items.length;
        marcar();
      } else if (e.key === 'Enter') {
        if (list.hidden) return;
        e.preventDefault();
        if (active >= 0) elegir(items[active]);
      } else if (e.key === 'Escape') {
        cerrar();
        mostrarActual();
      }
    });
    const pick = e => {
      const li = e.target.closest('[role="option"]');
      if (!li || list.hidden) return;
      e.preventDefault();
      elegir(JUEGO[li.dataset.id]);
    };
    list.addEventListener('mousedown', pick);
    list.addEventListener('click', pick);
    input.addEventListener('blur', () => {
      if (list.hidden) return;
      const q = norm(input.value);
      const exacto = q && REALES.find(j => norm(j.name) === q || (j.alias || []).includes(q));
      if (exacto) elegir(exacto);
      else { cerrar(); mostrarActual(); }
    });
    select.addEventListener('change', mostrarActual);
    mostrarActual();
  }

  // ---------- Pestañas ----------
  const tabs = [...document.querySelectorAll('.tab')];

  function openTab(id, scroll) {
    tabs.forEach(t => {
      const on = t.dataset.tab === id;
      t.setAttribute('aria-selected', String(on));
      t.tabIndex = on ? 0 : -1;
      $(`panel-${t.dataset.tab}`).hidden = !on;
    });
    if (scroll) $('herramientas').scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  tabs.forEach((t, i) => {
    t.addEventListener('click', () => {
      history.replaceState(null, '', `#${t.dataset.tab}`);
      openTab(t.dataset.tab, false);
    });
    t.addEventListener('keydown', e => {
      if (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft') return;
      const next = tabs[(i + (e.key === 'ArrowRight' ? 1 : tabs.length - 1)) % tabs.length];
      next.focus();
      next.click();
    });
  });

  window.addEventListener('hashchange', () => {
    const h = location.hash.slice(1);
    if (TABS.includes(h)) openTab(h, true);
  });

  // ---------- Arranque ----------
  ['gpuA', 'gpuB', 'bnGpu', 'fpsGpu'].forEach(id => fillHardware($(id), GPUS, 'idx'));
  ['cpuA', 'cpuB', 'bnCpu', 'fpsCpu'].forEach(id => fillHardware($(id), CPUS, 'game'));
  ['bnRes', 'fpsRes', 'pcRes'].forEach(id => fillRes($(id)));
  const juegosOpts = JUEGOS.map(j => `<option value="${j.id}">${j.name}</option>`).join('');
  $('fpsGame').innerHTML = juegosOpts;
  $('pcGame').innerHTML = juegosOpts;
  $('pcCal').innerHTML = PRESETS.map(p => `<option value="${p.id}">${p.label}</option>`).join('');

  const defaults = {
    gpuA: 'rtx5070', gpuB: 'rx9070',
    cpuA: 'r7600', cpuB: 'i514400f',
    bnGpu: 'rtx5070', bnCpu: 'r5600', bnRes: '1440',
    fpsGpu: 'rtx4060', fpsCpu: 'r5600', fpsGame: 'cyberpunk', fpsRes: '1080',
    pcGame: 'cyberpunk', pcRes: '1440', pcCal: 'alta', pcBudget: '1000', pcRange: '1000'
  };
  Object.entries(defaults).forEach(([id, v]) => { $(id).value = v; });
  initCombo('fps');
  initCombo('pc');

  $('pcRange').addEventListener('input', () => {
    $('pcBudget').value = $('pcRange').value;
    renderPc();
  });
  $('pcBudget').addEventListener('input', () => {
    const v = leerPresupuesto();
    if (v !== null) $('pcRange').value = String(Math.min(v, RANGO_MAX));
    renderPc();
  });

  const renders = {
    gpu: [['gpuA', 'gpuB'], renderGpu],
    cpu: [['cpuA', 'cpuB'], renderCpu],
    cuello: [['bnGpu', 'bnCpu', 'bnRes'], renderCuello],
    fps: [['fpsGpu', 'fpsCpu', 'fpsGame', 'fpsRes'], renderFps],
    pc: [['pcGame', 'pcRes', 'pcCal'], renderPc]
  };
  Object.values(renders).forEach(([ids, fn]) => {
    ids.forEach(id => $(id).addEventListener('change', fn));
    fn();
  });

  $('gpuSwap').addEventListener('click', () => {
    [$('gpuA').value, $('gpuB').value] = [$('gpuB').value, $('gpuA').value];
    renderGpu();
  });
  $('cpuSwap').addEventListener('click', () => {
    [$('cpuA').value, $('cpuB').value] = [$('cpuB').value, $('cpuA').value];
    renderCpu();
  });

  const start = location.hash.slice(1);
  openTab(TABS.includes(start) ? start : 'gpu', TABS.includes(start));
})();
