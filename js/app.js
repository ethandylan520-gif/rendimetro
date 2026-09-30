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
  const TABS = ['gpu', 'cpu', 'cuello', 'fps'];

  const $ = id => document.getElementById(id);
  const diff = (a, b) => Math.round((a / b - 1) * 100);

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

    $('bnResult').innerHTML = `
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
      ? `<p class="note warn-note">Con ${g.vram} GB de VRAM te quedas corto en calidad ${lista} (${j.name} pide unos ${Math.ceil(rows[3].vramNeed)} GB en Ultra a ${res}). Baja la calidad de texturas para evitar tirones.</p>`
      : '';
    const alta = rows[2], ultra = rows[3];
    const cap = j.cap && !ultra.capped ? `<p class="note">${j.name} tiene un límite de ${j.cap} FPS.</p>` : '';
    let rec;
    if (ultra.capped && !ultra.vramShort) {
      rec = `<p class="note ok-note">Con este equipo mueves ${j.name} en <strong>Ultra</strong> al máximo que permite el juego (${j.cap} FPS) en ${res}.</p>`;
    } else if (ultra.fps >= 60 && !ultra.vramShort) {
      rec = `<p class="note ok-note">Con este equipo mueves ${j.name} en <strong>Ultra</strong> a más de 60 FPS en ${res}.</p>`;
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
      <p class="headline"><strong>${j.name}</strong> en ${res} con ${g.name} y ${c.name}</p>
      <div class="gauges four">${table}</div>
      ${vram}${cap}${rec}
      <p class="aff-note">Estimación orientativa sin DLSS/FSR ni generación de fotogramas: con reescalado puedes ganar bastante más.</p>
      ${rec.includes('class="rec') ? affNote : ''}`;
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
  ['bnRes', 'fpsRes'].forEach(id => fillRes($(id)));
  $('fpsGame').innerHTML = [...JUEGOS].sort((a, b) => a.name.localeCompare(b.name, 'es'))
    .map(j => `<option value="${j.id}">${j.name} (${j.year})</option>`).join('');

  const defaults = {
    gpuA: 'rtx5070', gpuB: 'rx9070',
    cpuA: 'r7600', cpuB: 'i514400f',
    bnGpu: 'rtx5070', bnCpu: 'r5600', bnRes: '1440',
    fpsGpu: 'rtx4060', fpsCpu: 'r5600', fpsGame: 'cyberpunk', fpsRes: '1080'
  };
  Object.entries(defaults).forEach(([id, v]) => { $(id).value = v; });

  const renders = {
    gpu: [['gpuA', 'gpuB'], renderGpu],
    cpu: [['cpuA', 'cpuB'], renderCpu],
    cuello: [['bnGpu', 'bnCpu', 'bnRes'], renderCuello],
    fps: [['fpsGpu', 'fpsCpu', 'fpsGame', 'fpsRes'], renderFps]
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
