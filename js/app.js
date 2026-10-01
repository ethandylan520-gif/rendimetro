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

  // Tienda de Amazon del visitante según su zona horaria (sin cookies ni servicios externos). ?tienda=us la fuerza.
  const ZONAS_US = /^(America\/(New_York|Chicago|Denver|Los_Angeles|Phoenix|Anchorage|Juneau|Sitka|Yakutat|Nome|Adak|Metlakatla|Boise|Detroit|Menominee|Puerto_Rico|Indiana\/.+|Kentucky\/.+|North_Dakota\/.+)|Pacific\/Honolulu|US\/.+)$/;

  function paisVisitante() {
    let zona = '';
    try { zona = Intl.DateTimeFormat().resolvedOptions().timeZone || ''; } catch { /* navegador sin Intl */ }
    return ZONAS_US.test(zona) ? 'us' : null;
  }

  const tiendas = cfg.tiendas || {};
  const tienda = tiendas[new URLSearchParams(location.search).get('tienda')]
    || tiendas[paisVisitante()] || tiendas[cfg.principal] || { dominio: 'www.amazon.es', tag: '', idioma: 'es' };

  // Las búsquedas van en el idioma de la tienda: { es: '...', en: '...' } o un texto suelto.
  function amazonUrl(query) {
    const k = typeof query === 'string' ? query : query[tienda.idioma] || query.es;
    const url = new URL(`https://${tienda.dominio}/s`);
    url.searchParams.set('k', k);
    if (tienda.tag) url.searchParams.set('tag', tienda.tag);
    return url.toString();
  }

  const qGpu = g => ({ es: `tarjeta gráfica ${g.name}`, en: `${g.name} graphics card` });
  const qCpu = c => ({ es: `procesador ${c.brand} ${c.name}`, en: `${c.brand} ${c.name} processor` });

  function buyLink(item, kind) {
    const query = kind === 'gpu' ? qGpu(item) : qCpu(item);
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

  // hot: valor de gama alta (brilla y la aguja tiembla al llegar). badge: etiqueta como "GANA". delay: retraso del arranque en ms.
  function gauge({ value, scale, label, sub = '', unit, color, read, zonas, hot, badge, delay, key }) {
    const [max, pasos] = scale;
    const t = Math.max(0, Math.min(1, value / max));
    const ang = G_START + G_SWEEP * t;
    const toAng = v => G_START + G_SWEEP * Math.min(1, v / max);
    const n = read ?? Math.round(value);

    let marcas = '';
    const total = pasos * 4;
    for (let i = 0; i <= total; i++) {
      const k = i / total;
      const deg = G_START + G_SWEEP * k;
      const mayor = i % 4 === 0;
      const [x1, y1] = polar(mayor ? 60 : 64, deg), [x2, y2] = polar(70, deg);
      marcas += `<line x1="${fix(x1)}" y1="${fix(y1)}" x2="${fix(x2)}" y2="${fix(y2)}" data-k="${fix(k)}" class="${mayor ? 'tk-major' : 'tk'}${k <= t ? ' on' : ''}"/>`;
      if (mayor) {
        const [lx, ly] = polar(49, deg);
        marcas += `<text x="${fix(lx)}" y="${fix(ly)}" class="tk-label">${Math.round(max * k)}</text>`;
      }
    }

    const bandas = (zonas || [])
      .filter(([desde]) => desde < max)
      .map(([desde, hasta, cls]) => `<path d="${arco(89, toAng(desde), toAng(Math.min(hasta, max)))}" class="g-zone z-${cls}"/>`)
      .join('');

    // Chispas que saltan en el punto donde se para la aguja.
    const [bx, by] = polar(80, ang);
    let rayos = '';
    for (let i = 0; i < 8; i++) {
      const a = i * Math.PI / 4;
      rayos += `<line x1="${fix(7 * Math.cos(a))}" y1="${fix(7 * Math.sin(a))}" x2="${fix(14 * Math.cos(a))}" y2="${fix(14 * Math.sin(a))}"/>`;
    }

    const fx = hot ? ' hot' : color === 'bad' ? ' alerta' : '';
    return `<figure class="gauge k-${color}${fx}${badge ? ' win' : ''}" data-t="${t.toFixed(4)}" data-n="${n}"${delay != null ? ` data-delay="${delay}"` : ''}${key ? ` data-key="${key}"` : ''}>
      <svg viewBox="0 0 200 162" role="img" aria-label="${label}: ${n} ${unit}">
        ${bandas}
        <path d="${arco(80, G_START, G_START + G_SWEEP)}" class="g-track"/>
        <path d="${arco(80, G_START, G_START + G_SWEEP)}" pathLength="100" class="g-value c-${color}" style="stroke-dasharray:${fix(t * 100)} 100${t > 0.005 ? '' : ';visibility:hidden'}"/>
        ${marcas}
        <g transform="translate(${fix(bx)} ${fix(by)})"><g class="g-burst">${rayos}</g></g>
        <g class="needle-shake"><polygon points="96.5,100 103.5,100 100,26" class="needle n-${color}" style="transform:rotate(${fix(ang)}deg)"/></g>
        <circle cx="100" cy="100" r="7" class="hub"/>
        <text x="100" y="141" class="g-read">${n}</text>
        <text x="100" y="155" class="g-unit">${unit}</text>
      </svg>
      ${badge ? `<span class="g-badge">${badge}</span>` : ''}
      <figcaption><span class="g-label">${label}</span>${sub ? `<span class="g-sub">${sub}</span>` : ''}</figcaption>
    </figure>`;
  }

  // Rueda vacía, con un "?", mientras falta elegir la pieza.
  function gaugeVacio(label) {
    let marcas = '';
    for (let i = 0; i <= 20; i++) {
      const deg = G_START + G_SWEEP * i / 20;
      const [x1, y1] = polar(i % 4 === 0 ? 60 : 64, deg), [x2, y2] = polar(70, deg);
      marcas += `<line x1="${fix(x1)}" y1="${fix(y1)}" x2="${fix(x2)}" y2="${fix(y2)}" class="${i % 4 === 0 ? 'tk-major' : 'tk'}"/>`;
    }
    return `<figure class="gauge vacio">
      <svg viewBox="0 0 200 162" aria-hidden="true">
        <path d="${arco(80, G_START, G_START + G_SWEEP)}" class="g-track"/>
        ${marcas}
        <polygon points="96.5,100 103.5,100 100,26" class="needle" style="transform:rotate(${G_START}deg)"/>
        <circle cx="100" cy="100" r="7" class="hub"/>
        <text x="100" y="141" class="g-read">?</text>
      </svg>
      <figcaption><span class="g-label">${label}</span></figcaption>
    </figure>`;
  }

  // ---------- Animaciones ----------
  // Cada aguja recuerda dónde se quedó: al cambiar una pieza se mueve desde ahí hasta el valor nuevo.
  // Al abrir una pestaña, o al llegar a los resultados haciendo scroll, hace el barrido de arranque de un coche.
  const sinMovimiento = matchMedia('(prefers-reduced-motion: reduce)');
  const agujas = new Map(), cuentas = new Map(), esperando = new Map();
  const rebote = p => 1 - Math.exp(-6.5 * p) * Math.cos(9.5 * p);
  const suave = p => (p < 0.5 ? 4 * p ** 3 : 1 - (-2 * p + 2) ** 3 / 2);
  const frenar = p => 1 - (1 - p) ** 3;
  // quieto: sin animar (pestañas ocultas al cargar). cambio: el usuario cambia una opción. arrastre: barra del presupuesto.
  let modo = 'quieto';

  function reiniciarClase(el, cls) {
    el.classList.remove(cls);
    void el.offsetWidth;
    el.classList.add(cls);
  }

  function ponerAguja(fig, t, n) {
    fig._p ??= {
      needle: fig.querySelector('.needle'), arc: fig.querySelector('.g-value'), read: fig.querySelector('.g-read'),
      marcas: [...fig.querySelectorAll('[data-k]')].map(el => [el, Number(el.dataset.k)])
    };
    const { needle, arc, read, marcas } = fig._p;
    const tc = Math.max(0, Math.min(1, t));
    needle.style.transform = `rotate(${fix(G_START + G_SWEEP * Math.max(-0.015, Math.min(1.02, t)))}deg)`;
    arc.style.strokeDasharray = `${fix(tc * 100)} 100`;
    arc.style.visibility = tc > 0.005 ? 'visible' : 'hidden';
    read.textContent = Math.max(0, Math.round(n));
    marcas.forEach(([el, k]) => el.classList.toggle('on', k <= tc + 0.001));
  }

  function moverAguja(fig, key, como, orden) {
    const t1 = Number(fig.dataset.t), n1 = Number(fig.dataset.n);
    const antes = agujas.get(key);
    if (antes) { cancelAnimationFrame(antes.raf); clearTimeout(antes.seguro); }
    const estado = { t: t1, n: n1, raf: 0, seguro: 0 };
    agujas.set(key, estado);
    if (sinMovimiento.matches || como === 'quieto') return;

    const arranque = como === 'arranque' || !antes;
    const t0 = arranque ? 0 : antes.t, n0 = arranque ? 0 : antes.n;
    if (!arranque && Math.abs(t0 - t1) < 0.002 && Math.round(n0) === n1) return;
    const efectos = como !== 'arrastre';
    if (efectos) {
      fig.classList.remove('landed');
      fig.classList.add('anim');
    }
    const pintar = (t, n) => { ponerAguja(fig, t, n); estado.t = t; estado.n = n; };
    pintar(t0, n0);

    const retraso = arranque ? (fig.dataset.delay ? Number(fig.dataset.delay) : orden * 140) : orden * 50;
    const subida = arranque ? 520 : 0, pausa = arranque ? 80 : 0, asentar = arranque ? 1000 : 850;
    // En el arranque la aguja sube hasta el final de la escala y luego cae a su valor (con un pequeño rebote).
    const tope = t1 > 0 ? n1 / t1 : 0;
    const ta = arranque ? 1 : t0, na = arranque ? tope : n0;
    let inicio = null, llegado = false;
    const paso = ahora => {
      inicio ??= ahora;
      const ms = ahora - inicio - retraso;
      if (ms >= 0) {
        if (ms < subida) {
          const k = suave(ms / subida);
          pintar(k, tope * k);
        } else if (ms < subida + pausa) {
          pintar(1, tope);
        } else {
          const p = Math.min(1, (ms - subida - pausa) / asentar);
          const k = rebote(p);
          pintar(ta + (t1 - ta) * k, na + (n1 - na) * k);
          if (!llegado && p >= 0.17) {
            llegado = true;
            if (efectos) reiniciarClase(fig, 'landed');
          }
          if (p >= 1) { pintar(t1, n1); clearTimeout(estado.seguro); return; }
        }
      }
      estado.raf = requestAnimationFrame(paso);
    };
    estado.raf = requestAnimationFrame(paso);
    // Si el navegador pausa la animación (pestaña en segundo plano), que al menos quede el valor correcto.
    estado.seguro = setTimeout(() => {
      cancelAnimationFrame(estado.raf);
      pintar(t1, n1);
      if (!llegado) fig.classList.remove('anim');
    }, retraso + subida + pausa + asentar + 500);
  }

  // Números que cuentan hasta su valor (porcentajes, precio total).
  function contar(root, como) {
    root.querySelectorAll('[data-cuenta]').forEach((el, i) => {
      const key = `${root.id}#${i}`;
      const fin = Number(el.dataset.cuenta);
      const desde = como === 'arranque' ? 0 : cuentas.get(key) ?? fin;
      cuentas.set(key, fin);
      if (sinMovimiento.matches || como === 'quieto' || desde === fin) return;
      const fmt = el.dataset.fmt === 'eur' ? eur : v => String(Math.round(v));
      const dur = como === 'arranque' ? 1200 : como === 'arrastre' ? 300 : 650;
      const retraso = como === 'arranque' ? 300 : 0;
      let inicio = null, raf = 0;
      el.textContent = fmt(desde);
      const seguro = setTimeout(() => { cancelAnimationFrame(raf); el.textContent = fmt(fin); }, retraso + dur + 500);
      const paso = ahora => {
        inicio ??= ahora;
        const p = Math.max(0, Math.min(1, (ahora - inicio - retraso) / dur));
        el.textContent = fmt(desde + (fin - desde) * frenar(p));
        if (p < 1) raf = requestAnimationFrame(paso);
        else clearTimeout(seguro);
      };
      raf = requestAnimationFrame(paso);
    });
  }

  function ejecutar(el, como) {
    const previa = esperando.get(el);
    if (previa) { vigia.unobserve(previa); esperando.delete(el); }
    el.classList.remove('reveal', 'reveal-suave');
    if (como === 'arranque' || como === 'cambio') {
      [...el.children].forEach((c, i) => c.style.setProperty('--i', i));
      reiniciarClase(el, como === 'arranque' ? 'reveal' : 'reveal-suave');
    }
    el.querySelectorAll('.gauge[data-t]').forEach((fig, i) => {
      fig.style.setProperty('--g', i);
      moverAguja(fig, clave(el, fig, i), como, i);
    });
    contar(el, como);
    if (como === 'quieto') return;
    // Que los lectores de pantalla no lean los números mientras cuentan.
    el.setAttribute('aria-busy', 'true');
    clearTimeout(el._ocupado);
    el._ocupado = setTimeout(() => el.removeAttribute('aria-busy'), 2300);
  }

  const vigia = new IntersectionObserver(entradas => {
    entradas.forEach(e => {
      if (!e.isIntersecting) return;
      const el = e.target.closest('.result');
      if (esperando.get(el) === e.target) ejecutar(el, 'arranque');
      else vigia.unobserve(e.target);
    });
  }, { threshold: 0.35 });

  function aLaVista(fig) {
    const r = fig.getBoundingClientRect();
    return r.height > 0 && r.bottom > 70 && r.top < innerHeight - Math.min(r.height * 0.35, 120);
  }

  // Cada aguja se identifica por su lado (data-key) para que, al elegir la otra pieza, no herede la posición de otra.
  const clave = (el, fig, i) => `${el.id}:${fig.dataset.key || i}`;

  function animar(el, como) {
    const primera = el.querySelector('.gauge[data-t]');
    if (sinMovimiento.matches || como === 'quieto' || !primera || aLaVista(primera)) {
      ejecutar(el, como);
      return;
    }
    // Fuera de pantalla: dejamos las agujas a cero y arrancan cuando el usuario llega hasta ellas.
    const previa = esperando.get(el);
    if (previa) vigia.unobserve(previa);
    el.querySelectorAll('.gauge[data-t]').forEach((fig, i) => {
      const key = clave(el, fig, i);
      cancelAnimationFrame(agujas.get(key)?.raf);
      clearTimeout(agujas.get(key)?.seguro);
      agujas.set(key, { t: 0, n: 0, raf: 0, seguro: 0 });
      fig.classList.remove('landed');
      fig.classList.add('anim');
      ponerAguja(fig, 0, 0);
    });
    el.querySelectorAll('[data-cuenta]').forEach(c => { c.textContent = c.dataset.fmt === 'eur' ? eur(0) : '0'; });
    esperando.set(el, primera);
    vigia.observe(primera);
  }

  function mostrar(el, html) {
    el.innerHTML = html;
    animar(el, modo);
  }

  // Los selectores empiezan vacíos (para que en los vídeos se vea cómo eliges cada pieza).
  // conBlanco: añade al final una opción en blanco para volver a "ninguna" (sirve para repetir la animación en los vídeos).
  function fillHardware(select, items, key, vacio, conBlanco) {
    const brands = [...new Set(items.map(i => i.brand))];
    select.innerHTML = `<option value="" disabled selected hidden>${vacio}</option>` + brands.map(b => {
      const opts = items.filter(i => i.brand === b)
        .sort((x, y) => y[key] - x[key])
        .map(i => `<option value="${i.id}">${i.name}</option>`).join('');
      return `<optgroup label="${b}">${opts}</optgroup>`;
    }).join('') + (conBlanco ? '<option value="" aria-label="Ninguna">&nbsp;</option>' : '');
    // Al elegir la opción en blanco, el selector vuelve a mostrar "Elige…".
    select.addEventListener('change', () => { if (!select.value) select.selectedIndex = 0; });
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
    if (!a || !b) {
      // Falta alguna: la que ya está elegida arranca su rueda y la otra espera con un "?".
      const scale = escala(Math.max(a?.idx || 0, b?.idx || 0, 60) * 1.08, ESC_PTS);
      const lado = (g, key, color) => (g
        ? gauge({ value: g.idx, scale, label: g.name, sub: `${g.vram} GB · ${g.tdp} W`, unit: 'PTS', color, hot: g.idx >= 95, key })
        : gaugeVacio('Elige una gráfica'));
      mostrar($('gpuResult'), `
        <p class="headline vacio-hint">${a || b ? 'Ahora elige su rival…' : 'Elige dos gráficas y que empiece la batalla'}</p>
        <div class="gauges duelo">${lado(a, 'a', 'gpu')}${lado(b, 'b', 'gpu-b')}<span class="vs" aria-hidden="true">VS</span></div>`);
      return;
    }
    let head, gana = null;
    if (a === b) {
      head = 'Has elegido la misma gráfica en los dos lados.';
    } else {
      const [w, l] = a.idx >= b.idx ? [a, b] : [b, a];
      const d = diff(w.idx, l.idx);
      if (d >= 3) gana = w;
      head = d < 3
        ? `<strong>${a.name}</strong> y <strong>${b.name}</strong> rinden prácticamente igual.`
        : `<strong>${w.name}</strong> rinde un <strong class="hl-gpu"><span data-cuenta="${d}">${d}</span>% más</strong> que ${l.name}.`;
    }
    const scale = escala(Math.max(a.idx, b.idx) * 1.08, ESC_PTS);
    const eff = g => Math.round(g.idx / g.tdp * 1000) / 10;
    mostrar($('gpuResult'), `
      <p class="headline">${head}</p>
      <div class="gauges duelo">
        ${gauge({ value: a.idx, scale, label: a.name, sub: `${a.vram} GB · ${a.tdp} W`, unit: 'PTS', color: 'gpu', hot: a.idx >= 95, badge: gana === a ? 'GANA' : '', key: 'a' })}
        ${gauge({ value: b.idx, scale, label: b.name, sub: `${b.vram} GB · ${b.tdp} W`, unit: 'PTS', color: 'gpu-b', hot: b.idx >= 95, badge: gana === b ? 'GANA' : '', key: 'b' })}
        <span class="vs" aria-hidden="true">VS</span>
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
      ${affNote}`);
  }

  // ---------- Procesador vs procesador ----------
  function renderCpu() {
    const a = CPU[$('cpuA').value], b = CPU[$('cpuB').value];
    if (!a || !b) {
      const scaleG = escala(Math.max(a?.game || 0, b?.game || 0, 60) * 1.08, ESC_PTS);
      const scaleM = escala(Math.max(a?.multi || 0, b?.multi || 0, 60) * 1.08, ESC_PTS);
      const lado = (c, campo, scale, sub, key, color) => (c
        ? gauge({ value: c[campo], scale, label: c.name, sub, unit: 'PTS', color, hot: c[campo] >= (campo === 'game' ? 88 : 90), key })
        : gaugeVacio('Elige un procesador'));
      mostrar($('cpuResult'), `
        <p class="headline vacio-hint">${a || b ? 'Ahora elige su rival…' : 'Elige dos procesadores y que empiece la batalla'}</p>
        <div class="duelos">
          <div class="gauges duelo">${lado(a, 'game', scaleG, 'Juegos', 'aj', 'cpu')}${lado(b, 'game', scaleG, 'Juegos', 'bj', 'cpu-b')}<span class="vs" aria-hidden="true">VS</span></div>
          <div class="gauges duelo">${lado(a, 'multi', scaleM, 'Productividad', 'am', 'cpu')}${lado(b, 'multi', scaleM, 'Productividad', 'bm', 'cpu-b')}<span class="vs" aria-hidden="true">VS</span></div>
        </div>`);
      return;
    }
    let head, sub = '', ganaJ = null, ganaM = null;
    if (a === b) {
      head = 'Has elegido el mismo procesador en los dos lados.';
    } else {
      const [w, l] = a.game >= b.game ? [a, b] : [b, a];
      const d = diff(w.game, l.game);
      if (d >= 3) ganaJ = w;
      head = d < 3
        ? `En juegos, <strong>${a.name}</strong> y <strong>${b.name}</strong> rinden prácticamente igual.`
        : `En juegos, <strong>${w.name}</strong> rinde un <strong class="hl-cpu"><span data-cuenta="${d}">${d}</span>% más</strong> que ${l.name}.`;
      const [mw, ml] = a.multi >= b.multi ? [a, b] : [b, a];
      const dm = diff(mw.multi, ml.multi);
      if (dm >= 3) ganaM = mw;
      sub = dm < 3
        ? 'En productividad (edición de vídeo, streaming, renderizado) van a la par.'
        : `En productividad (edición de vídeo, streaming, renderizado) gana el ${mw.name} por un <span data-cuenta="${dm}">${dm}</span>%.`;
    }
    const scaleG = escala(Math.max(a.game, b.game) * 1.08, ESC_PTS);
    const scaleM = escala(Math.max(a.multi, b.multi) * 1.08, ESC_PTS);
    const plataforma = a.socket === b.socket
      ? `<p class="note">Los dos usan la plataforma ${a.socket}: puedes cambiar uno por otro sin cambiar de placa base (a veces hace falta actualizar la BIOS).</p>`
      : '';
    const badgeJ = x => (ganaJ === x ? 'GANA' : ''), badgeM = x => (ganaM === x ? 'GANA' : '');
    mostrar($('cpuResult'), `
      <p class="headline">${head}</p>
      ${sub ? `<p class="subline">${sub}</p>` : ''}
      <div class="duelos">
        <div class="gauges duelo">
          ${gauge({ value: a.game, scale: scaleG, label: a.name, sub: 'Juegos', unit: 'PTS', color: 'cpu', hot: a.game >= 88, badge: badgeJ(a), key: 'aj' })}
          ${gauge({ value: b.game, scale: scaleG, label: b.name, sub: 'Juegos', unit: 'PTS', color: 'cpu-b', hot: b.game >= 88, badge: badgeJ(b), key: 'bj' })}
          <span class="vs" aria-hidden="true">VS</span>
        </div>
        <div class="gauges duelo">
          ${gauge({ value: a.multi, scale: scaleM, label: a.name, sub: 'Productividad', unit: 'PTS', color: 'cpu', hot: a.multi >= 90, badge: badgeM(a), key: 'am' })}
          ${gauge({ value: b.multi, scale: scaleM, label: b.name, sub: 'Productividad', unit: 'PTS', color: 'cpu-b', hot: b.multi >= 90, badge: badgeM(b), key: 'bm' })}
          <span class="vs" aria-hidden="true">VS</span>
        </div>
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
      ${affNote}`);
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
    if (!g || !c) {
      const potGpu = g
        ? gauge({ value: g.idx / GPU_TOP * 100, scale: [100, 5], label: 'Potencia gráfica', sub: g.name, unit: '/ 100', color: 'gpu', hot: g.idx >= 95, key: 'gpu' })
        : gaugeVacio('Elige tu gráfica');
      const potCpu = c
        ? gauge({ value: c.game / CPU_TOP * 100, scale: [100, 5], label: 'Potencia procesador', sub: c.name, unit: '/ 100', color: 'cpu', hot: c.game >= 88, key: 'cpu' })
        : gaugeVacio('Elige tu procesador');
      mostrar($('bnResult'), `
        <p class="headline vacio-hint">${g || c ? `Ahora elige tu ${g ? 'procesador' : 'gráfica'}…` : 'Elige tu gráfica y tu procesador para ver si se llevan bien'}</p>
        <div class="gauges trio">${potGpu}${gaugeVacio('Compatibilidad')}${potCpu}</div>`);
      return;
    }
    const res = RES[r].label;
    const { need, feed, bn } = cuello(g, c, r);
    let tone, title, text, extra = '';

    if (bn > 5) {
      if (bn > 30) { tone = 'bad'; title = 'Cuello de botella fuerte'; }
      else if (bn > 15) { tone = 'orange'; title = 'Cuello de botella notable'; }
      else { tone = 'warn'; title = 'Cuello de botella leve'; }
      text = `En ${res}, el ${c.name} solo puede aprovechar en torno al <strong><span data-cuenta="${Math.round(feed * 100)}">${Math.round(feed * 100)}</span>%</strong> de la ${g.name}. Lo notarás sobre todo en juegos competitivos y cuando buscas muchos FPS.`;
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

    const porRes = Object.keys(RES).map((k, i) => {
      const x = cuello(g, c, k).bn;
      const cls = x > 30 ? 'bad' : x > 15 ? 'orange' : x > 5 ? 'warn' : 'ok';
      return `<li style="--k:${i}"><span>${RES[k].label}</span><strong class="t-${cls}">${x > 5 ? `Limita un ${Math.round(x)}%` : 'Sin cuello de botella'}</strong></li>`;
    }).join('');

    // Puntuación de compatibilidad: lo que el procesador aprovecha de la gráfica, menos lo que se pierde por PCIe o Resizable BAR.
    let puntos = feed * 100;
    const compat = [{ ok: true, txt: `Encajan: la ${g.name} va en cualquier placa con ranura PCIe x16, así que puedes montarla con el ${c.name}.` }];
    if (g.x8 && c.pcie3) {
      puntos -= 8;
      compat.push({ ok: false, txt: `La ${g.name} usa solo 8 líneas PCIe y el ${c.name} va con PCIe 3.0: perderá algo de rendimiento, sobre todo cuando se quede sin VRAM.` });
    }
    if (g.brand === 'Intel' && (c.socket === 'LGA1151' || c.id === 'r2600')) {
      puntos -= 20;
      compat.push({ ok: false, txt: `Las Intel Arc necesitan Resizable BAR para rendir bien y con el ${c.name} lo más probable es que tu placa no lo tenga. Sin él rinden bastante peor.` });
    } else if (g.brand === 'Intel' && c.game < 65) {
      puntos -= 8;
      compat.push({ ok: false, txt: `Las Intel Arc pierden algo de rendimiento con procesadores modestos como el ${c.name} por la carga extra de su driver.` });
    }
    puntos = Math.max(0, Math.round(puntos));
    const [compatTono, compatNota] = puntos >= 90 ? ['ok', 'Excelente'] : puntos >= 75 ? ['warn', 'Buena'] : puntos >= 60 ? ['orange', 'Mejorable'] : ['bad', 'Mala'];
    const compatHtml = `<ul class="compat">${compat.map((x, i) => `<li class="${x.ok ? 'cp-si' : 'cp-aviso'}" style="--k:${i}">${x.txt}</li>`).join('')}</ul>`;

    // Primero arrancan la gráfica y el procesador; la compatibilidad, en el centro, llega la última.
    mostrar($('bnResult'), `
      <div class="gauges trio">
        ${gauge({ value: g.idx / GPU_TOP * 100, scale: [100, 5], label: 'Potencia gráfica', sub: g.name, unit: '/ 100', color: 'gpu', hot: g.idx >= 95, delay: 0, key: 'gpu' })}
        ${gauge({ value: puntos, scale: [100, 5], label: 'Compatibilidad', sub: `<b class="t-${compatTono}">${compatNota}</b>`, unit: '%', color: compatTono, hot: puntos >= 95, delay: 650, key: 'compat' })}
        ${gauge({ value: c.game / CPU_TOP * 100, scale: [100, 5], label: 'Potencia procesador', sub: c.name, unit: '/ 100', color: 'cpu', hot: c.game >= 88, delay: 180, key: 'cpu' })}
      </div>
      <h3 class="bars-title">Compatibilidad</h3>
      ${compatHtml}
      <h3 class="bars-title">Equilibrio (cuello de botella)</h3>
      <div class="verdict v-${tone}"><span class="verdict-title">${title}</span><p>${text}</p></div>
      <h3 class="bars-title">Según la resolución</h3>
      <ul class="res-list">${porRes}</ul>
      <p class="note">A más resolución, más trabaja la gráfica y menos importa el procesador.</p>
      ${extra}
      <div class="buy">${buyLink(g, 'gpu')}${buyLink(c, 'cpu')}</div>
      ${affNote}`);
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
    if (!g || !c || !j) {
      const falta = [!g && 'tu gráfica', !c && 'tu procesador', !j && 'un juego'].filter(Boolean);
      const lista = falta.length > 1 ? `${falta.slice(0, -1).join(', ')} y ${falta[falta.length - 1]}` : falta[0];
      mostrar($('fpsResult'), `
        <p class="headline vacio-hint">Elige ${lista} y te decimos cuántos FPS vas a sacar</p>
        <div class="gauges four">${PRESETS.map(p => gaugeVacio(`Calidad ${p.label}`)).join('')}</div>`);
      return;
    }
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
        unit: 'FPS', color: t.cls, zonas: FPS_ZONAS, hot: x.fps >= 144
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

    mostrar($('fpsResult'), `
      <p class="headline"><strong>${nombre}</strong> en ${res} con ${g.name} y ${c.name}</p>
      <div class="gauges four">${table}</div>
      ${notaGenerico('fpsGame', j)}${vram}${cap}${rec}
      <div class="buy">${buyLink(g, 'gpu')}${buyLink(c, 'cpu')}</div>
      <p class="aff-note">Estimación orientativa sin DLSS/FSR ni generación de fotogramas: con reescalado puedes ganar bastante más.</p>
      ${affNote}`);
  }

  // ---------- Tu PC ideal ----------
  const COMPETITIVOS = ['cs2', 'valorant', 'lol', 'fortnite', 'apex', 'rivals', 'bo6', 'bf6'];
  const VISUALES = ['cyberpunk', 'rdr2', 'alanwake2', 'wukong', 'mhwilds', 'acshadows', 'hogwarts', 'starfield', 'eldenring'];

  // Cómo se reparte el presupuesto según el juego. En los competitivos el procesador pesa un poco más (FPS altos y
  // estables); en los más gráficos, la gráfica. Solo un poco: los FPS mostrados son los reales y el PC sigue equilibrado.
  const PERFILES = {
    competitivo: { cpu: 0.9, gpu: 1, cpuPrecio: 0.22, txt: 'Como es un juego competitivo, el procesador pesa un poco más' },
    grafico: { cpu: 1, gpu: 0.9, cpuPrecio: 0.18, txt: 'Como es un juego muy gráfico, la gráfica pesa un poco más' },
    normal: { cpu: 1, gpu: 1, cpuPrecio: 0.22, txt: '' }
  };
  const perfilDe = j => (COMPETITIVOS.includes(j.id) || j.id === 'gen-ligero' ? PERFILES.competitivo
    : VISUALES.includes(j.id) || j.id === 'gen-exigente' ? PERFILES.grafico : PERFILES.normal);

  // Puntuación para elegir el PC: los mismos FPS estimados, pero dando algo menos de margen a la pieza que más importa.
  function puntuar(e, perfil, j) {
    const fps = Math.pow(Math.pow(e.gpuFps * perfil.gpu, -4) + Math.pow(e.cpuFps * perfil.cpu, -4), -0.25);
    return j.cap ? Math.min(fps, j.cap) : fps;
  }
  const PRESUPUESTO_MIN = 300, RANGO_MAX = 4000;
  const eur = n => `${Math.round(n).toLocaleString('es-ES')} €`;

  function fuentePara(g, c) {
    const need = (g.tdp + c.w + 100) * 1.3;
    return PIEZAS.fuentes.find(f => f.w >= need) || PIEZAS.fuentes[PIEZAS.fuentes.length - 1];
  }

  // Gama del PC según la potencia de la gráfica. El resto de piezas va a juego para que el PC quede equilibrado:
  // de nada sirve una gráfica buena con 16 GB de RAM, una caja que se calienta o el disipador ruidoso de serie.
  const GAMAS = {
    1: { nombre: 'entrada', ram: 16, ssd: 'ssd', caja: 'basica', placaAlta: false, disipMin: null },
    2: { nombre: 'media', ram: 32, ssd: 'ssd', caja: 'buena', placaAlta: false, disipMin: 'aire' },
    3: { nombre: 'alta', ram: 32, ssd: 'ssd2', caja: 'buena', placaAlta: true, disipMin: 'aire' }
  };
  const gamaDe = g => (g.idx >= 70 ? 3 : g.idx >= 40 ? 2 : 1);

  function montar(g, c) {
    const gama = GAMAS[gamaDe(g)];
    const plat = PIEZAS.plataformas[c.socket];
    // Placa superior en gama alta; en Intel solo compensa con procesadores K (overclock).
    const placa = gama.placaAlta && plat.alta && (c.brand === 'AMD' || /K$/.test(c.name)) ? plat.alta : plat;
    const ram = PIEZAS.ram[plat.ram][gama.ram];
    const ssd = PIEZAS[gama.ssd];
    const fuente = fuentePara(g, c);
    const caja = PIEZAS.cajas[gama.caja];
    const disip = PIEZAS.disipadores[c.disipador === 'incluido' && gama.disipMin ? gama.disipMin : c.disipador];
    const partes = [
      { tipo: 'Gráfica', nombre: g.name, precio: g.precio, q: qGpu(g) },
      { tipo: 'Procesador', nombre: c.name, precio: c.precio, q: qCpu(c) },
      { tipo: 'Placa base', nombre: `${placa.chipset} (${c.socket})`, precio: placa.precio, q: placa.q },
      { tipo: 'Memoria RAM', nombre: `${gama.ram} GB ${plat.ram}`, precio: ram.precio, q: ram.q },
      { tipo: 'Almacenamiento', nombre: ssd.nombre, precio: ssd.precio, q: ssd.q },
      { tipo: 'Fuente', nombre: `${fuente.w} W 80 Plus Gold`, precio: fuente.precio, q: { es: `fuente alimentación ${fuente.w}W 80 Plus Gold`, en: `${fuente.w}W 80 Plus Gold power supply` } },
      { tipo: 'Caja', nombre: caja.nombre, precio: caja.precio, q: caja.q },
      { tipo: 'Disipador', nombre: disip.nombre, precio: disip.precio, q: disip.q }
    ];
    return { g, c, gama, partes, total: partes.reduce((s, p) => s + p.precio, 0) };
  }

  function mejorHasta(lista, tope) {
    const dentro = lista.filter(b => b.total <= tope);
    if (!dentro.length) return null;
    const top = Math.max(...dentro.map(b => b.puntos));
    return dentro.filter(b => b.puntos >= top * 0.98).sort((a, b) => a.total - b.total)[0];
  }

  const miniLink = q => `<a class="amz-mini" href="${amazonUrl(q)}" target="_blank" rel="sponsored noopener">Ver en Amazon</a>`;

  // Qué cambia de un PC a otro: gráfica y procesador, y las piezas que suben con la gama (RAM, SSD, placa…).
  function cambios(de, a) {
    return a.partes
      .map((p, i) => ({ p, antes: de.partes[i] }))
      .filter(({ p, antes }) => p.nombre !== antes.nombre && p.q)
      .map(({ p, antes }) => ({ html: `${p.tipo}: ${antes.nombre} → <strong>${p.nombre}</strong>`, q: p.q }));
  }

  function leerPresupuesto() {
    const v = Math.round(Number($('pcBudget').value));
    return Number.isFinite(v) && v >= PRESUPUESTO_MIN ? v : null;
  }

  // Parejas que tienen sentido. El modelo de FPS medio no ve los mínimos, otros juegos ni el futuro, así que en juegos
  // que tiran de gráfica elegiría el procesador más barato aunque la gráfica cueste 1.000 €.
  function encaja(g, c, perfil = PERFILES.normal) {
    if (c.game < Math.min(95, g.idx * 0.65)) return false; // que no se quede muy corto en potencia
    if (c.precio < Math.min(g.precio * perfil.cpuPrecio, 350)) return false; // ni de gama: al menos un 18–27 % de la gráfica
    if (g.x8 && c.pcie3) return false; // gráfica de 8 líneas en PCIe 3.0 (aviso en Compatibilidad)
    if (g.brand === 'Intel' && c.game < 65) return false; // Intel Arc con procesador modesto (ídem)
    return true;
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
    const perfil = perfilDe(j);
    const lista = [];
    for (const g of GPUS) {
      if (!g.buy) continue;
      for (const c of CPUS) {
        if (!c.buy || !encaja(g, c, perfil)) continue;
        const b = montar(g, c);
        b.est = estimar(g, c, j, r, p);
        b.puntos = puntuar(b.est, perfil, j);
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

    const filas = elegido.partes.map((x, i) => `<tr style="--f:${i}">
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
    const tarjetas = mejoras.map((b, i) => {
      const cs = cambios(elegido, b);
      return `<div class="upg" style="--u:${i}">
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

    mostrar($('pcResult'), `
      <p class="headline">Tu PC para <strong>${nombre}</strong> en ${res} · calidad ${p.label} · hasta ${eur(presupuesto)}</p>
      <p class="subline">PC equilibrado de <strong>gama ${elegido.gama.nombre}</strong>: ${elegido.gama.ram} GB de RAM, ${elegido.partes[4].nombre.replace('SSD NVMe', 'SSD de')}${elegido.gama.caja === 'buena' ? ' y caja con buena ventilación' : ''}, a juego con la gráfica.${perfil.txt ? ` ${perfil.txt}.` : ''}</p>
      <div class="build">
        <div class="build-gauge">
          ${gauge({ value: e.fps, scale, label: `${Math.round(e.fps)} FPS estimados`, sub: `<b class="t-${t.cls}">${t.label}</b> · ${lim}`, unit: 'FPS', color: t.cls, zonas: FPS_ZONAS, hot: e.fps >= 144 })}
        </div>
        <div class="table-wrap build-parts"><table class="parts">
          <tbody>${filas}</tbody>
          <tfoot><tr><th scope="row">Total</th><td></td><td class="precio">~<span data-cuenta="${elegido.total}" data-fmt="eur">${eur(elegido.total)}</span></td><td></td></tr></tfoot>
        </table></div>
      </div>
      ${notas}
      ${bloqueMejoras}
      <p class="aff-note">Precios orientativos del mercado español, revisados el 1 de octubre de 2026: el precio real puede variar, consúltalo en Amazon. No incluye monitor, periféricos ni sistema operativo. FPS estimados sin DLSS/FSR.</p>
      ${affNote}`);
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
      if (!j) { input.value = ''; return; }
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

  // ---------- Todas las piezas ----------
  const CATS = [
    { id: 'gpu', nombre: 'Gráficas', marcas: ['NVIDIA', 'AMD', 'Intel'] },
    { id: 'cpu', nombre: 'Procesadores', marcas: ['AMD', 'Intel'] },
    ...TIENDA
  ];
  const VISIBLES = 12;
  const shop = { cat: 'gpu', marca: '', todo: false };

  // Gráficas y procesadores: primero los que se venden nuevos, de más a menos potentes; luego las generaciones anteriores.
  function piezasDe(cat) {
    const orden = (a, b) => Number(Boolean(b.buy)) - Number(Boolean(a.buy));
    if (cat.id === 'gpu') {
      return [...GPUS].sort((a, b) => orden(a, b) || b.idx - a.idx).map(g => ({
        k: 'gpu', marca: g.brand, name: g.name, sub: `${g.vram} GB · ${g.tdp} W · ${g.year}`,
        barra: g.idx / GPU_TOP, puntos: `${g.idx} pts`, precio: g.precio, q: qGpu(g), antigua: !g.buy, gpu: g
      }));
    }
    if (cat.id === 'cpu') {
      return [...CPUS].sort((a, b) => orden(a, b) || b.game - a.game).map(c => ({
        k: 'cpu', marca: c.brand, name: c.name, sub: `${c.cores} núcleos · ${c.threads} hilos · ${c.socket}`,
        barra: c.game / CPU_TOP, puntos: `${c.game} pts juegos`, precio: c.precio, q: qCpu(c), antigua: !c.buy, cpu: c
      }));
    }
    return cat.items.map(x => ({ k: 'info', marca: cat.nombre, ...x }));
  }

  function tarjetaPieza(x, n, nueva, i) {
    const barra = x.barra != null
      ? `<div class="item-score"><div class="item-bar"><i style="width:${Math.round(x.barra * 100)}%"></i></div><span>${x.puntos}</span></div>`
      : '';
    return `<article class="item k-${x.k}${nueva ? ' nueva' : ''}" style="--n:${n}">
        <span class="item-brand">${x.marca}${x.antigua ? '<em class="tag-old">Anterior</em>' : ''}</span>
        <h3 class="item-name">${x.name}</h3>
        <p class="item-sub">${x.sub}</p>
        ${barra}
        <div class="item-foot">
          ${x.precio ? `<span class="item-precio">~${eur(x.precio)}</span>` : ''}
          <div class="item-btns">
            <button type="button" class="item-det" data-i="${i}" aria-label="Detalles de ${escapeHtml(x.name)}">Detalles</button>
            <a class="item-buy" href="${amazonUrl(x.q)}" target="_blank" rel="sponsored noopener" aria-label="Ver ${escapeHtml(x.name)} en Amazon">Ver en Amazon</a>
          </div>
        </div>
      </article>`;
  }

  // ---------- Ficha de cada pieza ----------
  const CPU_REF = CPU.r9800x3d;
  const GPU_TOPE = Math.max(...GPUS.filter(g => g.buy).map(g => g.idx));
  const MEMORIA = { AM4: 'DDR4', AM5: 'DDR5', LGA1700: 'DDR4 o DDR5 (según la placa)', LGA1851: 'DDR5', LGA1200: 'DDR4', LGA1151: 'DDR4' };
  const REFRIGERACION = { incluido: 'Incluida con el procesador', aire: 'Disipador por aire de torre', liquida: 'Líquida o disipador de doble torre' };
  const FPS_FICHA = [['fortnite', '1080', 'alta'], ['cyberpunk', '1440', 'alta'], ['cs2', '1080', 'baja'], ['bo6', '1440', 'alta']];
  const fila = (k, v) => `<tr><th scope="row">${k}</th><td>${v}</td></tr>`;
  const porCien = (pts, precio) => (pts / precio * 100).toFixed(1).replace('.', ',');

  function fichaGpu(g) {
    const filas = [
      fila('Rendimiento', `${g.idx} pts <small>(RTX 4090 = 100)</small>`),
      fila('Memoria (VRAM)', `${g.vram} GB`),
      fila('Consumo', `${g.tdp} W`),
      fila('Fuente recomendada', `${fuentePara(g, { w: 120 }).w} W 80 Plus Gold`),
      fila('Conexión', g.x8 ? 'PCIe x8 <small>(en placas PCIe 3.0 pierde algo de rendimiento)</small>' : 'PCIe x16'),
      fila('Lanzamiento', g.year)
    ];
    if (g.precio) filas.push(fila('Precio orientativo', `~${eur(g.precio)} <small>· ${porCien(g.idx, g.precio)} pts por cada 100 €</small>`));
    const cpuRec = CPUS.filter(c => c.buy && encaja(g, c) && cuello(g, c, '1440').bn <= 5).sort((a, b) => a.precio - b.precio)[0];
    filas.push(fila('Procesador recomendado', cpuRec
      ? `${cpuRec.name} <small>o superior, para 1440p</small>`
      : `${CPU_REF.name} <small>(en 1440p hasta el más rápido se queda algo corto)</small>`));
    const fps = FPS_FICHA.map(([jid, r, cal]) => {
      const j = JUEGO[jid], p = PRESETS.find(x => x.id === cal);
      const e = estimar(g, CPU_REF, j, r, p);
      return `<li><span>${j.name} <small>${RES[r].label} · ${p.label}</small></span><strong class="t-${fpsTier(e.fps).cls}">${Math.round(e.fps)} FPS</strong></li>`;
    }).join('');
    return {
      k: 'gpu', id: g.id, marca: g.brand, nombre: g.name, antigua: !g.buy, q: qGpu(g), filas,
      gauge: gauge({ value: g.idx, scale: escala(GPU_TOP * 1.08, ESC_PTS), label: 'Rendimiento', unit: 'PTS', color: 'gpu', hot: g.idx >= 95 }),
      extra: `<h4 class="ficha-sub">FPS orientativos <small>con un ${CPU_REF.name}</small></h4><ul class="ficha-lista">${fps}</ul>`,
      acciones: [['gpu', 'gpuA', 'Comparar'], ['fps', 'fpsGpu', 'FPS en más juegos']]
    };
  }

  function fichaCpu(c) {
    const plat = PIEZAS.plataformas[c.socket];
    const filas = [
      fila('Juegos', `${c.game} pts <small>(${CPU_REF.name} = 100)</small>`),
      fila('Productividad', `${c.multi} pts <small>(Ryzen 9 9950X = 100)</small>`),
      fila('Núcleos / hilos', `${c.cores} / ${c.threads}`),
      fila('Plataforma', `${c.socket}${plat ? ` <small>· ${plat.chipset.replace('Placa base', 'placa')} o superior</small>` : ''}`),
      fila('Memoria', MEMORIA[c.socket] || '—')
    ];
    if (c.w) filas.push(fila('Consumo jugando', `~${c.w} W`));
    if (c.disipador) filas.push(fila('Refrigeración', REFRIGERACION[c.disipador]));
    filas.push(fila('PCIe', c.pcie3 ? 'PCIe 3.0 <small>(las gráficas x8 pierden algo de rendimiento)</small>' : 'PCIe 4.0 o superior'));
    filas.push(fila('Lanzamiento', c.year));
    if (c.precio) filas.push(fila('Precio orientativo', `~${eur(c.precio)} <small>· ${porCien(c.game, c.precio)} pts de juegos por cada 100 €</small>`));
    const aprovecha = Object.keys(RES).map(r => {
      const tope = GPUS.filter(g => g.buy && cuello(g, c, r).bn <= 5).sort((a, b) => b.idx - a.idx)[0];
      const txt = !tope ? 'Se queda corto con cualquier gráfica actual' : tope.idx >= GPU_TOPE ? 'Cualquier gráfica actual' : `Hasta una ${tope.name}`;
      return `<li><span>${RES[r].label}</span><strong>${txt}</strong></li>`;
    }).join('');
    return {
      k: 'cpu', id: c.id, marca: c.brand, nombre: c.name, antigua: !c.buy, q: qCpu(c), filas,
      gauge: gauge({ value: c.game, scale: escala(CPU_TOP * 1.08, ESC_PTS), label: 'Juegos', unit: 'PTS', color: 'cpu', hot: c.game >= 88 }),
      extra: `<h4 class="ficha-sub">Gráficas que aprovecha sin cuello de botella</h4><ul class="ficha-lista">${aprovecha}</ul>`,
      acciones: [['cpu', 'cpuA', 'Comparar'], ['cuello', 'bnCpu', 'Compatibilidad']]
    };
  }

  function fichaOtra(x) {
    let det = x.det || {};
    if (x.w) {
      // Fuentes: misma regla que "Tu PC ideal" (gráfica + procesador de ~120 W + 100 W, con un 30 % de margen).
      const limite = x.w / 1.3 - 220;
      const tope = GPUS.filter(g => g.buy && g.tdp <= limite).sort((a, b) => b.idx - a.idx)[0];
      det = {
        Potencia: `${x.w} W`, Certificación: '80 Plus Gold',
        'Aguanta gráficas de hasta': `~${Math.floor(limite / 10) * 10} W de consumo`,
        ...(tope ? { 'Por ejemplo': `${tope.name} (${tope.tdp} W) con un procesador de gama media` } : {})
      };
    }
    const filas = Object.entries(det).map(([k, v]) => fila(k, v));
    if (x.precio) filas.push(fila('Precio orientativo', `~${eur(x.precio)}`));
    return { k: 'info', marca: x.marca, nombre: x.name, sub: x.sub, q: x.q, filas };
  }

  function abrirFicha(x) {
    const f = x.gpu ? fichaGpu(x.gpu) : x.cpu ? fichaCpu(x.cpu) : fichaOtra(x);
    const dialogo = $('ficha');
    dialogo.className = `ficha k-${f.k}`;
    $('fichaBody').innerHTML = `
      <div class="ficha-head">
        <div>
          <span class="item-brand">${f.marca}${f.antigua ? '<em class="tag-old">Anterior</em>' : ''}</span>
          <h3 id="fichaTitulo" class="ficha-nombre">${f.nombre}</h3>
          ${f.sub ? `<p class="item-sub">${f.sub}</p>` : ''}
        </div>
        <button type="button" class="ficha-close" aria-label="Cerrar">✕</button>
      </div>
      ${f.gauge || ''}
      <table class="ficha-specs"><tbody>${f.filas.join('')}</tbody></table>
      ${f.extra || ''}
      <div class="ficha-acciones">
        <a class="item-buy" href="${amazonUrl(f.q)}" target="_blank" rel="sponsored noopener">Ver en Amazon</a>
        ${(f.acciones || []).map(([tab, sel, txt]) => `<button type="button" class="item-det" data-tab="${tab}" data-sel="${sel}" data-id="${f.id}">${txt}</button>`).join('')}
      </div>
      <p class="aff-note">Datos y precios orientativos. Enlace de afiliado: si compras a través de él, esta web recibe una pequeña comisión sin coste extra para ti.</p>`;
    dialogo.showModal();
    animar($('fichaBody'), 'arranque');
  }

  let shopVistas = [];

  // animarDesde: índice a partir del cual las tarjetas entran animadas (sin valor = sin animación).
  function renderShop(animarDesde) {
    const cat = CATS.find(c => c.id === shop.cat);
    // Las categorías se pintan una vez; después solo cambia la marcada, para no perder el scroll lateral en móvil.
    if (!$('shopCats').children.length) {
      $('shopCats').innerHTML = CATS.map(c =>
        `<button type="button" class="cat" data-cat="${c.id}">${c.nombre} <small>${piezasDe(c).length}</small></button>`).join('');
    }
    $('shopCats').querySelectorAll('.cat').forEach(b => b.setAttribute('aria-pressed', String(b.dataset.cat === shop.cat)));
    $('shopMarcas').innerHTML = cat.marcas
      ? ['', ...cat.marcas].map(m => `<button type="button" class="marca" data-marca="${m}" aria-pressed="${m === shop.marca}">${m || 'Todas'}</button>`).join('')
      : '';

    const todas = piezasDe(cat).filter(x => !shop.marca || x.marca === shop.marca);
    const vistas = shop.todo ? todas : todas.slice(0, VISIBLES);
    shopVistas = vistas;
    const primeraAntigua = vistas.findIndex(x => x.antigua);
    $('shopItems').innerHTML = vistas.map((x, i) => {
      const sep = i === primeraAntigua
        ? '<p class="items-sep">Generaciones anteriores: ya no se venden nuevas, pero suelen encontrarse de segunda mano o reacondicionadas.</p>'
        : '';
      const nueva = animarDesde != null && i >= animarDesde;
      return sep + tarjetaPieza(x, nueva ? i - animarDesde : 0, nueva, i);
    }).join('');
    $('shopMore').innerHTML = vistas.length < todas.length
      ? `<button type="button">Ver todas (${todas.length})</button>`
      : '';
    if (animarDesde != null && !sinMovimiento.matches) reiniciarClase($('shopItems'), 'reveal');
  }

  $('shopCats').addEventListener('click', e => {
    const b = e.target.closest('[data-cat]');
    if (!b || b.dataset.cat === shop.cat) return;
    Object.assign(shop, { cat: b.dataset.cat, marca: '', todo: false });
    renderShop(0);
  });
  $('shopMarcas').addEventListener('click', e => {
    const b = e.target.closest('[data-marca]');
    if (!b || b.dataset.marca === shop.marca) return;
    Object.assign(shop, { marca: b.dataset.marca, todo: false });
    renderShop(0);
  });
  $('shopMore').addEventListener('click', e => {
    if (!e.target.closest('button')) return;
    shop.todo = true;
    renderShop(VISIBLES);
  });
  $('shopItems').addEventListener('click', e => {
    const b = e.target.closest('.item-det');
    if (b) abrirFicha(shopVistas[Number(b.dataset.i)]);
  });
  // La ficha se cierra con la X, con Esc (lo hace el navegador) o pulsando fuera.
  // "Comparar", "FPS en más juegos" y "Compatibilidad" llevan la pieza a esa herramienta.
  $('ficha').addEventListener('click', e => {
    const dialogo = $('ficha');
    if (e.target === dialogo || e.target.closest('.ficha-close')) { dialogo.close(); return; }
    const b = e.target.closest('[data-tab]');
    if (!b) return;
    dialogo.close();
    $(b.dataset.sel).value = b.dataset.id;
    modo = 'cambio';
    $(b.dataset.sel).dispatchEvent(new Event('change'));
    history.replaceState(null, '', `#${b.dataset.tab}`);
    openTab(b.dataset.tab, true);
  });

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
    animar($(`panel-${id}`).querySelector('.result'), 'arranque');
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
  ['gpuA', 'gpuB', 'bnGpu', 'fpsGpu'].forEach(id => fillHardware($(id), GPUS, 'idx', 'Elige una gráfica…', true));
  ['cpuA', 'cpuB', 'bnCpu', 'fpsCpu'].forEach(id => fillHardware($(id), CPUS, 'game', 'Elige un procesador…'));
  ['bnRes', 'fpsRes', 'pcRes'].forEach(id => fillRes($(id)));
  const juegosOpts = JUEGOS.map(j => `<option value="${j.id}">${j.name}</option>`).join('');
  $('fpsGame').innerHTML = '<option value="" selected></option>' + juegosOpts;
  $('pcGame').innerHTML = juegosOpts;
  $('pcCal').innerHTML = PRESETS.map(p => `<option value="${p.id}">${p.label}</option>`).join('');

  const defaults = {
    // Las comparaciones empiezan vacías: las piezas las elige quien usa la web.
    bnRes: '1440', fpsRes: '1080',
    pcGame: 'cyberpunk', pcRes: '1440', pcCal: 'alta', pcBudget: '1200', pcRange: '1200'
  };
  Object.entries(defaults).forEach(([id, v]) => { $(id).value = v; });
  initCombo('fps');
  initCombo('pc');
  renderShop();

  $('pcRange').addEventListener('input', () => {
    $('pcBudget').value = $('pcRange').value;
    modo = 'arrastre';
    renderPc();
  });
  $('pcBudget').addEventListener('input', () => {
    const v = leerPresupuesto();
    if (v !== null) $('pcRange').value = String(Math.min(v, RANGO_MAX));
    modo = 'arrastre';
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
    ids.forEach(id => $(id).addEventListener('change', () => { modo = 'cambio'; fn(); }));
    fn();
  });

  $('gpuSwap').addEventListener('click', () => {
    [$('gpuA').value, $('gpuB').value] = [$('gpuB').value, $('gpuA').value];
    modo = 'cambio';
    renderGpu();
  });
  $('cpuSwap').addEventListener('click', () => {
    [$('cpuA').value, $('cpuB').value] = [$('cpuB').value, $('cpuA').value];
    modo = 'cambio';
    renderCpu();
  });

  const start = location.hash.slice(1);
  openTab(TABS.includes(start) ? start : 'gpu', TABS.includes(start));
})();
