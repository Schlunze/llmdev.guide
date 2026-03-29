/**
 * LLM Local Inference Device Benchmark - Visualization App
 */

let allDevices = [];
let filteredDevices = [];

// Canonical model order for benchmark groups
const BENCH_MODELS = [
  'Qwen3.5-9B', 'Qwen3.5-27B', 'Qwen3.5-35B-A3B',
  'Qwen3.5-122B-A10B', 'Qwen3.5-397B-A17B',
];

// ============================================================
// Data loading & init
// ============================================================

async function init() {
  try {
    const resp = await fetch('data/devices.json');
    allDevices = await resp.json();
    filteredDevices = [...allDevices];
    populateAxisSelectors();
    setupTabs();
    setupFilters();
    renderAll();
  } catch (e) {
    document.getElementById('app').innerHTML =
      `<p style="color:#f85149;padding:40px;">${t('load_error')}: ${e.message}<br>${t('load_hint')} <code>python scripts/build_data.py</code></p>`;
  }
  document.getElementById('loading-overlay').style.display = 'none';
  document.getElementById('app').style.display = '';
  // Re-render after app becomes visible so Plotly gets correct container width
  requestAnimationFrame(() => renderAll());
}

// ============================================================
// Grouped metric definitions
// ============================================================

function getMetricGroups() {
  // Collect models that exist in data, ordered by canonical list
  // Only show canonical Qwen3.5 models in selectors (non-Qwen models like GPT-OSS are estimation sources only)
  const modelSet = new Set();
  allDevices.forEach(d => {
    if (d.benchmarks) d.benchmarks.forEach(b => {
      if (BENCH_MODELS.includes(b.model)) modelSet.add(b.model);
    });
  });
  const models = BENCH_MODELS.filter(m => modelSet.has(m));

  const shortName = m => m.replace('Qwen3.5-', 'Qwen ');

  return [
    {
      groupKey: 'group_specs',
      options: [
        { value: 'memory_bandwidth_gbs', labelKey: 'metric_memory_bandwidth_gbs' },
        { value: 'memory_capacity_gb', labelKey: 'metric_memory_capacity_gb' },
        { value: 'tops_int8', labelKey: 'metric_tops' },
        { value: 'price_usd', labelKey: 'metric_price_usd' },
        { value: 'power_watts', labelKey: 'metric_power_watts' },
      ],
    },
    {
      groupKey: 'group_decode',
      options: models.map(m => ({
        value: `bench_decode_${m}`,
        labelFn: () => `${shortName(m)} ${t('metric_decode_suffix')}`,
      })),
    },
    {
      groupKey: 'group_ratios',
      options: [
        { value: 'perf_per_dollar', labelKey: 'metric_perf_per_dollar' },
        { value: 'perf_per_watt', labelKey: 'metric_perf_per_watt' },
        { value: 'perf_effectiveness', labelKey: 'metric_perf_effectiveness' },
      ],
    },
    {
      groupKey: 'group_prefill',
      options: models.map(m => ({
        value: `bench_prefill_${m}`,
        labelFn: () => `${shortName(m)} ${t('metric_prefill_suffix')}`,
      })),
    },
  ];
}

// Flat list for lookups
function getAllMetricOptions() {
  return getMetricGroups().flatMap(g => g.options);
}

function getMetricLabel(metricKey) {
  const opt = getAllMetricOptions().find(o => o.value === metricKey);
  if (!opt) return metricKey;
  if (opt.labelFn) return opt.labelFn();
  return t(opt.labelKey);
}

function showEstimated() {
  const cb = document.getElementById('show-estimated');
  return cb ? cb.checked : true;
}

function showSuspicious() {
  const cb = document.getElementById('show-suspicious');
  return cb ? cb.checked : true;
}

function findBench(device, model) {
  if (!device.benchmarks) return null;
  const bench = device.benchmarks.find(b => b.model === model);
  if (!bench) return null;
  if (bench.estimated && !showEstimated()) return null;
  if (bench._suspicious && !showSuspicious()) return null;
  return bench;
}

function getMetricValue(device, metricKey) {
  // Benchmark decode/prefill
  if (metricKey.startsWith('bench_decode_') || metricKey.startsWith('bench_prefill_')) {
    const parts = metricKey.split('_');
    const type = parts[1];
    const model = parts.slice(2).join('_');
    const bench = findBench(device, model);
    if (!bench) return null;
    return type === 'decode' ? bench.decode_tps : bench.prefill_tps;
  }
  // Perf per dollar (9B decode tps per $100)
  if (metricKey === 'perf_per_dollar') {
    if (!device.price_usd) return null;
    const b9 = findBench(device, 'Qwen3.5-9B');
    return b9 ? (b9.decode_tps / device.price_usd * 100) : null;
  }
  // Perf per watt (9B decode tps per watt)
  if (metricKey === 'perf_per_watt') {
    if (!device.power_watts) return null;
    const b9 = findBench(device, 'Qwen3.5-9B');
    return b9 ? (b9.decode_tps / device.power_watts) : null;
  }
  // Effectiveness: (actual_tps / claimed_tops) normalized to max
  if (metricKey === 'perf_effectiveness') {
    if (!device.tops_int8) return null;
    const b9 = findBench(device, 'Qwen3.5-9B');
    if (!b9) return null;
    const raw = b9.decode_tps / device.tops_int8;
    let maxRaw = 0;
    filteredDevices.forEach(d => {
      if (!d.tops_int8) return;
      const db = findBench(d, 'Qwen3.5-9B');
      if (db) maxRaw = Math.max(maxRaw, db.decode_tps / d.tops_int8);
    });
    return maxRaw > 0 ? (raw / maxRaw * 100) : null;
  }
  return device[metricKey] ?? null;
}

// ============================================================
// UI init — grouped <optgroup> selectors
// ============================================================

function populateAxisSelectors() {
  const groups = getMetricGroups();
  const selectors = [
    'ladder-metric',
    'scatter2d-x', 'scatter2d-y', 'scatter2d-size',
    'scatter3d-x', 'scatter3d-y', 'scatter3d-z', 'scatter3d-size',
  ];

  // Save current selections
  const saved = {};
  selectors.forEach(id => {
    const sel = document.getElementById(id);
    if (sel) saved[id] = sel.value;
  });

  selectors.forEach(id => {
    const sel = document.getElementById(id);
    if (!sel) return;
    const hasPlaceholder = id.includes('size');
    sel.innerHTML = hasPlaceholder ? `<option value="">${t('ctrl_none')}</option>` : '';

    groups.forEach(group => {
      if (!group.options.length) return;
      const og = document.createElement('optgroup');
      og.label = t(group.groupKey);
      group.options.forEach(opt => {
        const o = document.createElement('option');
        o.value = opt.value;
        o.textContent = opt.labelFn ? opt.labelFn() : t(opt.labelKey);
        og.appendChild(o);
      });
      sel.appendChild(og);
    });
  });

  // Restore or set defaults
  restoreOrDefault('ladder-metric', saved, 'bench_decode_Qwen3.5-9B');
  restoreOrDefault('scatter2d-x', saved, 'price_usd');
  restoreOrDefault('scatter2d-y', saved, 'bench_decode_Qwen3.5-9B');
  restoreOrDefault('scatter2d-size', saved, 'power_watts');
  restoreOrDefault('scatter3d-x', saved, 'price_usd');
  restoreOrDefault('scatter3d-y', saved, 'bench_decode_Qwen3.5-9B');
  restoreOrDefault('scatter3d-z', saved, 'memory_bandwidth_gbs');
  restoreOrDefault('scatter3d-size', saved, 'power_watts');
}

function restoreOrDefault(id, saved, fallback) {
  setSelectValue(id, saved[id] || fallback);
}

function setSelectValue(id, value) {
  const sel = document.getElementById(id);
  if (!sel) return;
  for (let i = 0; i < sel.options.length; i++) {
    if (sel.options[i].value === value) { sel.selectedIndex = i; return; }
  }
}

// ============================================================
// Tabs
// ============================================================

function setupTabs() {
  document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
      document.querySelectorAll('.tab-panel').forEach(p => p.classList.remove('active'));
      btn.classList.add('active');
      document.getElementById(btn.dataset.tab).classList.add('active');
      renderAll();
    });
  });
}

// ============================================================
// Filters
// ============================================================

function setupFilters() {
  document.querySelectorAll('select').forEach(sel => {
    sel.addEventListener('change', renderAll);
  });
}

// ============================================================
// Render
// ============================================================

function renderAll() {
  updateStats();
  renderLadder();
  renderScatter2D();
  renderScatter3D();
  renderTable();
  renderGuide();
}

// ============================================================
// Deployment Guide (markdown rendering)
// ============================================================

const _guideCache = {};
let _guideRenderedLang = null;

async function renderGuide() {
  const el = document.getElementById('guide-content');
  if (!el) return;
  const lang = (typeof currentLang !== 'undefined') ? currentLang : 'zh';
  if (_guideRenderedLang === lang) return;
  const file = lang === 'zh' ? 'guide_zh.md' : 'guide_en.md';
  try {
    if (!_guideCache[file]) {
      const resp = await fetch(file);
      _guideCache[file] = await resp.text();
    }
    el.innerHTML = marked.parse(_guideCache[file]);
    _guideRenderedLang = lang;
  } catch (e) {
    el.innerHTML = '<p style="color:#f85149">Failed to load deployment guide.</p>';
  }
}

function updateStats() {
  document.getElementById('stat-count').textContent = filteredDevices.length;
  document.getElementById('stat-vendors').textContent = new Set(filteredDevices.map(d => d.vendor)).size;
  const prices = filteredDevices.map(d => d.price_usd).filter(Boolean);
  document.getElementById('stat-price-range').textContent = prices.length ? `$${Math.min(...prices)} - $${Math.max(...prices)}` : '-';
  const bw = filteredDevices.map(d => d.memory_bandwidth_gbs).filter(Boolean);
  document.getElementById('stat-bw-range').textContent = bw.length ? `${Math.min(...bw)} - ${Math.max(...bw)}` : '-';
}

// ============================================================
// Leaderboard
// ============================================================

function renderLadder() {
  const metric = document.getElementById('ladder-metric')?.value;
  if (!metric) return;

  const data = filteredDevices
    .map(d => ({ name: d.name, value: getMetricValue(d, metric), vendor: d.vendor, file: d._source_file, suspicious: isMetricSuspicious(d, metric), estimated: isMetricEstimated(d, metric) }))
    .filter(d => d.value !== null && d.value !== undefined)
    .sort((a, b) => a.value - b.value);

  if (!data.length) { Plotly.purge('ladder-chart'); return; }

  const vendorColors = assignColors(data.map(d => d.vendor));
  const trace = {
    type: 'bar', orientation: 'h',
    y: data.map(d => {
      let label = d.name;
      if (window.innerWidth < 768) {
        const lineW = 18;
        if (label.length > lineW) {
          const l1 = label.slice(0, lineW);
          const l2 = label.slice(lineW);
          label = l2.length > lineW ? l1 + '<br>' + l2.slice(0, lineW - 2) + '..' : l1 + '<br>' + l2;
        }
      }
      if (d.estimated) label += ' *';
      if (d.suspicious) label += ' ⚠';
      return label;
    }),
    x: data.map(d => d.value),
    customdata: data.map(d => d.file),
    marker: {
      color: data.map(d => d.suspicious ? 'rgba(248,81,73,0.5)' : d.estimated ? vendorColors[d.vendor] + '99' : vendorColors[d.vendor]),
      line: {
        width: data.map(d => d.suspicious ? 2 : d.estimated ? 2 : 0),
        color: data.map(d => d.suspicious ? '#f85149' : d.estimated ? '#d29922' : 'transparent'),
      },
      pattern: {
        shape: data.map(d => d.suspicious ? '/' : d.estimated ? '.' : ''),
        fgcolor: data.map(d => d.suspicious ? 'rgba(248,81,73,0.3)' : d.estimated ? 'rgba(210,153,34,0.2)' : 'transparent'),
      },
    },
    text: data.map(d => formatValue(d.value)),
    textposition: 'outside',
    textfont: { color: data.map(d => d.suspicious ? '#f85149' : d.estimated ? '#d29922' : getComputedStyle(document.documentElement).getPropertyValue('--plotly-text').trim()), size: 12 },
    hovertemplate: '%{y}<br>%{x:.2~f}<extra></extra>',
  };
  const layout = {
    ...darkLayout(),
    title: { text: getMetricLabel(metric), font: { size: 16, color: getComputedStyle(document.documentElement).getPropertyValue('--plotly-text').trim() } },
    xaxis: { title: getMetricLabel(metric), gridcolor: getComputedStyle(document.documentElement).getPropertyValue('--plotly-grid').trim(), type: isLogAxis('x') ? 'log' : 'linear' },
    yaxis: { automargin: true, tickfont: { size: window.innerWidth < 768 ? 10 : 12 } },
    height: Math.max(400, data.length * 50 + 100),
    margin: { l: 10, r: 60, t: 50, b: 50 },
  };
  Plotly.newPlot('ladder-chart', [trace], layout, { responsive: true });
  bindChartClick('ladder-chart');
  bindDetailHover('ladder-chart');
}

// ============================================================
// 2D Scatter
// ============================================================

function renderScatter2D() {
  const xKey = document.getElementById('scatter2d-x')?.value;
  const yKey = document.getElementById('scatter2d-y')?.value;
  const sizeKey = document.getElementById('scatter2d-size')?.value;
  if (!xKey || !yKey) return;

  const data = filteredDevices
    .map(d => ({ name: d.name, vendor: d.vendor, file: d._source_file, suspicious: hasAnySuspicious(d), estimated: hasAnyEstimated(d), x: getMetricValue(d, xKey), y: getMetricValue(d, yKey), size: sizeKey ? getMetricValue(d, sizeKey) : null }))
    .filter(d => d.x !== null && d.y !== null);
  if (!data.length) { Plotly.purge('scatter2d-chart'); return; }

  const vendorColors = assignColors(data.map(d => d.vendor));
  const traces = Object.entries(groupBy(data, 'vendor')).map(([vendor, items]) => ({
    type: 'scatter', mode: 'markers+text', name: vendor, showlegend: false,
    x: items.map(d => d.x), y: items.map(d => d.y),
    text: items.map(d => truncName(d.name)),
    textposition: 'top center', textfont: { size: 10, color: getComputedStyle(document.documentElement).getPropertyValue('--plotly-muted').trim() },
    marker: {
      size: computeBubbleSizes(items, data, sizeKey),
      color: vendorColors[vendor], opacity: items.map(d => d.suspicious ? 0.5 : d.estimated ? 0.6 : 0.85),
      line: {
        width: items.map(d => d.suspicious ? 3 : d.estimated ? 2 : 1),
        color: items.map(d => d.suspicious ? '#f85149' : d.estimated ? '#d29922' : '#30363d'),
      },
    },
    customdata: items.map(d => sizeKey ? [d.size ?? '', d.file] : ['', d.file]),
    hovertemplate: buildHover([xKey, yKey], sizeKey, vendor),
    _fullNames: items.map(d => d.name),
  }));
  // Add bandwidth ceiling reference lines if an axis is output tps
  const bwLines = buildBandwidthLines(xKey, yKey, data);

  const layout = {
    ...darkLayout(),
    xaxis: { title: getMetricLabel(xKey), gridcolor: getComputedStyle(document.documentElement).getPropertyValue('--plotly-grid').trim(), type: isLogAxis('x') ? 'log' : 'linear' },
    yaxis: { title: getMetricLabel(yKey), gridcolor: getComputedStyle(document.documentElement).getPropertyValue('--plotly-grid').trim(), type: isLogAxis('y') ? 'log' : 'linear' },
    height: 550, margin: { l: 60, r: 20, t: 30, b: 60 },
    showlegend: false,
    shapes: bwLines.shapes,
    annotations: bwLines.annotations,
  };
  Plotly.newPlot('scatter2d-chart', traces, layout, { responsive: true });
  bindChartClick('scatter2d-chart');
  bindDetailHover('scatter2d-chart');
}

// ============================================================
// 3D Scatter
// ============================================================

function renderScatter3D() {
  const xKey = document.getElementById('scatter3d-x')?.value;
  const yKey = document.getElementById('scatter3d-y')?.value;
  const zKey = document.getElementById('scatter3d-z')?.value;
  const sizeKey = document.getElementById('scatter3d-size')?.value;
  if (!xKey || !yKey || !zKey) return;

  const data = filteredDevices
    .map(d => ({ name: d.name, vendor: d.vendor, file: d._source_file, suspicious: hasAnySuspicious(d), estimated: hasAnyEstimated(d), x: getMetricValue(d, xKey), y: getMetricValue(d, yKey), z: getMetricValue(d, zKey), size: sizeKey ? getMetricValue(d, sizeKey) : null }))
    .filter(d => d.x !== null && d.y !== null && d.z !== null);
  if (!data.length) { Plotly.purge('scatter3d-chart'); return; }

  const vendorColors = assignColors(data.map(d => d.vendor));
  const traces = Object.entries(groupBy(data, 'vendor')).map(([vendor, items]) => ({
    type: 'scatter3d', mode: 'markers+text', name: vendor, showlegend: false,
    x: items.map(d => d.x), y: items.map(d => d.y), z: items.map(d => d.z),
    text: items.map(d => d.name), textfont: { size: 9, color: getComputedStyle(document.documentElement).getPropertyValue('--plotly-muted').trim() },
    marker: {
      size: computeBubbleSizes3D(items, data, sizeKey),
      color: items.map(d => d.suspicious ? '#f85149' : d.estimated ? '#d29922' : vendorColors[vendor]),
      opacity: items.map(d => d.suspicious ? 0.5 : d.estimated ? 0.6 : 0.9),
      line: { width: items.map(d => d.suspicious ? 2 : d.estimated ? 1.5 : 0.5), color: items.map(d => d.suspicious ? '#f85149' : d.estimated ? '#d29922' : '#30363d') },
    },
    customdata: items.map(d => sizeKey ? [d.size ?? '', d.file] : ['', d.file]),
    hovertemplate: buildHover3D([xKey, yKey, zKey], sizeKey, vendor),
    _fullNames: items.map(d => d.name),
  }));
  const layout = {
    ...darkLayout(),
    scene: {
      xaxis: { title: getMetricLabel(xKey), gridcolor: getComputedStyle(document.documentElement).getPropertyValue('--plotly-grid').trim(), color: getComputedStyle(document.documentElement).getPropertyValue('--plotly-muted').trim(), type: isLogAxis('x') ? 'log' : 'linear' },
      yaxis: { title: getMetricLabel(yKey), gridcolor: getComputedStyle(document.documentElement).getPropertyValue('--plotly-grid').trim(), color: getComputedStyle(document.documentElement).getPropertyValue('--plotly-muted').trim(), type: isLogAxis('y') ? 'log' : 'linear' },
      zaxis: { title: getMetricLabel(zKey), gridcolor: getComputedStyle(document.documentElement).getPropertyValue('--plotly-grid').trim(), color: getComputedStyle(document.documentElement).getPropertyValue('--plotly-muted').trim(), type: isLogAxis('z') ? 'log' : 'linear' },
      bgcolor: getComputedStyle(document.documentElement).getPropertyValue('--plotly-bg').trim(),
    },
    height: 600, margin: { l: 0, r: 0, t: 30, b: 0 },
    showlegend: false,
  };
  Plotly.newPlot('scatter3d-chart', traces, layout, { responsive: true });
  bindChartClick('scatter3d-chart');
  bindDetailHover('scatter3d-chart');
}

// ============================================================
// Data table
// ============================================================

let tableSortKey = 'name';
let tableSortAsc = true;

function renderTable() {
  const tbody = document.getElementById('table-body');
  if (!tbody) return;

  const sorted = [...filteredDevices].sort((a, b) => {
    let va = getTableVal(a, tableSortKey), vb = getTableVal(b, tableSortKey);
    if (va == null) va = tableSortAsc ? Infinity : -Infinity;
    if (vb == null) vb = tableSortAsc ? Infinity : -Infinity;
    if (typeof va === 'string') return tableSortAsc ? va.localeCompare(vb) : vb.localeCompare(va);
    return tableSortAsc ? va - vb : vb - va;
  });

  tbody.innerHTML = sorted.map((d, idx) => {
    const b9 = d.benchmarks?.find(b => b.model === 'Qwen3.5-9B');
    const b27 = d.benchmarks?.find(b => b.model === 'Qwen3.5-27B');
    const b35 = d.benchmarks?.find(b => b.model === 'Qwen3.5-35B-A3B');
    const fmtB = (b, field) => { const v = b?.[field]; return v != null ? (b.estimated ? `${v}*` : v) : '-'; };
    const fmtV = (v, prefix, suffix) => v != null ? `${prefix || ''}${v}${suffix || ''}` : '-';
    return `<tr>
      <td class="num">${idx + 1}</td>
      <td><a href="device.html?file=${encodeURIComponent(d._source_file)}">${d.name}</a></td>
      <td>${d.vendor}</td>
      <td>${translateDeviceType(d.device_type)}</td>
      <td class="num">${fmtV(d.memory_capacity_gb)}</td>
      <td class="num">${fmtV(d.memory_bandwidth_gbs)}</td>
      <td class="num">${fmtV(d.tops_int8)}</td>
      <td class="num">${fmtV(d.price_usd, '$')}</td>
      <td class="num">${fmtV(d.power_watts, '', 'W')}</td>
      <td class="num">${fmtB(b9, 'decode_tps')}</td>
      <td class="num">${fmtB(b9, 'prefill_tps')}</td>
      <td class="num">${fmtB(b27, 'decode_tps')}</td>
      <td class="num">${fmtB(b27, 'prefill_tps')}</td>
      <td class="num">${fmtB(b35, 'decode_tps')}</td>
      <td>${b9?.quant ?? '-'}</td>
      <td>${b9?.framework ?? '-'}</td>
    </tr>`;
  }).join('');
}

function getTableVal(d, key) {
  const benchMap = {
    b9_decode: ['Qwen3.5-9B', 'decode_tps'], b9_prefill: ['Qwen3.5-9B', 'prefill_tps'],
    b27_decode: ['Qwen3.5-27B', 'decode_tps'], b27_prefill: ['Qwen3.5-27B', 'prefill_tps'],
    b35_decode: ['Qwen3.5-35B-A3B', 'decode_tps'],
  };
  if (benchMap[key]) {
    const [model, field] = benchMap[key];
    return d.benchmarks?.find(b => b.model === model)?.[field];
  }
  return d[key];
}

function sortTable(key) {
  if (tableSortKey === key) tableSortAsc = !tableSortAsc;
  else { tableSortKey = key; tableSortAsc = true; }
  document.querySelectorAll('th[data-sort]').forEach(th => {
    const arrow = th.querySelector('.sort-arrow');
    if (arrow) arrow.textContent = th.dataset.sort === key ? (tableSortAsc ? ' ▲' : ' ▼') : '';
  });
  renderTable();
}

// ============================================================
// Utilities
// ============================================================

const COLORS = [
  '#58a6ff', '#3fb950', '#d29922', '#f85149',
  '#bc8cff', '#f778ba', '#79c0ff', '#56d364',
  '#e3b341', '#ff7b72', '#d2a8ff', '#db61a2',
];

function assignColors(vendors) {
  const unique = [...new Set(vendors)];
  const map = {};
  unique.forEach((v, i) => map[v] = COLORS[i % COLORS.length]);
  return map;
}

function darkLayout() {
  const s = getComputedStyle(document.documentElement);
  return {
    paper_bgcolor: s.getPropertyValue('--plotly-bg').trim(),
    plot_bgcolor: s.getPropertyValue('--plotly-bg').trim(),
    font: { color: s.getPropertyValue('--plotly-text').trim() },
  };
}

function groupBy(arr, key) {
  const g = {};
  arr.forEach(d => { (g[d[key]] ||= []).push(d); });
  return g;
}

function truncName(name) { return name.length > 20 ? name.slice(0, 18) + '..' : name; }

function formatValue(v) {
  if (v == null) return '-';
  if (Math.abs(v) < 10) return v.toFixed(2);
  return v.toFixed(1);
}

function computeBubbleSizes(items, allData, sizeKey) {
  if (!sizeKey) return items.map(() => 14);
  const max = Math.max(...allData.map(d => d.size || 0)) || 1;
  return items.map(d => Math.max(10, Math.min(50, ((d.size || 0) / max) * 40 + 10)));
}

function computeBubbleSizes3D(items, allData, sizeKey) {
  if (!sizeKey) return items.map(() => 8);
  const max = Math.max(...allData.map(d => d.size || 0)) || 1;
  return items.map(d => Math.max(5, Math.min(30, ((d.size || 0) / max) * 25 + 5)));
}

// ============================================================
// Bandwidth ceiling reference lines for 2D scatter
// ============================================================

const BW_EFFICIENCY = 0.9;
// Active params (billions) for canonical models — must match build_data.py
const MODEL_ACTIVE_B = {
  'Qwen3.5-9B': 9, 'Qwen3.5-27B': 27,
  'Qwen3.5-35B-A3B': 3, 'Qwen3.5-122B-A10B': 10, 'Qwen3.5-397B-A17B': 17,
};
// Reference bandwidth tiers (GB/s) and labels
const BW_TIERS = [
  { bw: 128, label: '128 GB/s' },
  { bw: 256, label: '256 GB/s' },
  { bw: 512, label: '512 GB/s' },
  { bw: 1024, label: '1024 GB/s' },
];
const BW_LINE_COLORS = ['#6e7681', '#8b949e', '#8b949e', '#6e7681'];

// MoE models where bandwidth ceiling is inaccurate
const MOE_MODELS = new Set(['Qwen3.5-35B-A3B', 'Qwen3.5-122B-A10B', 'Qwen3.5-397B-A17B']);

function getDecodeModelFromKey(metricKey) {
  if (!metricKey.startsWith('bench_decode_')) return null;
  const model = metricKey.split('_').slice(2).join('_');
  if (MOE_MODELS.has(model)) return null; // Skip MoE models
  return model;
}

function isLogAxis(axis) {
  const id = axis === 'x' ? 'log-x' : axis === 'y' ? 'log-y' : 'log-z';
  const cb = document.getElementById(id);
  return cb ? cb.checked : false;
}

function showBwLines() {
  const cb = document.getElementById('show-bw-lines');
  return cb ? cb.checked : false;
}

function buildBandwidthLines(xKey, yKey, data) {
  const shapes = [], annotations = [];
  if (!showBwLines()) return { shapes, annotations };
  const xModel = getDecodeModelFromKey(xKey);
  const yModel = getDecodeModelFromKey(yKey);
  if (!xModel && !yModel) return { shapes, annotations };

  const mutedColor = getComputedStyle(document.documentElement).getPropertyValue('--plotly-muted').trim() || '#6e7681';

  const addLines = (model, axis) => {
    const activeB = MODEL_ACTIVE_B[model];
    if (!activeB) return;
    const weightGB = activeB * 0.5; // int4 = 0.5 bytes per param

    BW_TIERS.forEach((tier, i) => {
      const tps = tier.bw * BW_EFFICIENCY / weightGB;
      if (axis === 'x') {
        const annoVal = isLogAxis('x') ? Math.log10(tps) : tps;
        shapes.push({
          type: 'line', xref: 'x', yref: 'paper',
          x0: tps, x1: tps, y0: 0, y1: 1,
          line: { color: mutedColor, width: 1, dash: 'dot' },
        });
        annotations.push({
          x: annoVal, y: 1, xref: 'x', yref: 'paper',
          text: tier.label, showarrow: false,
          font: { size: 9, color: mutedColor },
          textangle: -90, xanchor: 'left', yanchor: 'top',
        });
      } else {
        const annoVal = isLogAxis('y') ? Math.log10(tps) : tps;
        shapes.push({
          type: 'line', xref: 'paper', yref: 'y',
          x0: 0, x1: 1, y0: tps, y1: tps,
          line: { color: mutedColor, width: 1, dash: 'dot' },
        });
        annotations.push({
          x: 1, y: annoVal, xref: 'paper', yref: 'y',
          text: tier.label, showarrow: false,
          font: { size: 9, color: mutedColor },
          xanchor: 'right', yanchor: 'bottom',
        });
      }
    });
  };

  if (xModel) addLines(xModel, 'x');
  if (yModel) addLines(yModel, 'y');

  return { shapes, annotations };
}

function buildHover(axisKeys, sizeKey, vendor) {
  const axes = ['x', 'y'];
  let tpl = '<b>%{text}</b>';
  axisKeys.forEach((k, i) => { tpl += `<br>${getMetricLabel(k)}: %{${axes[i]}:.2~f}`; });
  if (sizeKey) tpl += `<br>${getMetricLabel(sizeKey)}: %{customdata[0]:.2~f}`;
  return tpl + `<extra>${vendor}</extra>`;
}

function buildHover3D(axisKeys, sizeKey, vendor) {
  const axes = ['x', 'y', 'z'];
  let tpl = '<b>%{text}</b>';
  axisKeys.forEach((k, i) => { tpl += `<br>${getMetricLabel(k)}: %{${axes[i]}:.2~f}`; });
  if (sizeKey) tpl += `<br>${getMetricLabel(sizeKey)}: %{customdata[0]:.2~f}`;
  return tpl + `<extra>${vendor}</extra>`;
}

// ============================================================
// Delayed full-detail tooltip (shows after 2s hover)
// ============================================================

let _detailTimer = null;
let _detailEl = null;

function getDetailTooltip() {
  if (!_detailEl) {
    _detailEl = document.createElement('div');
    _detailEl.id = 'detail-tooltip';
    _detailEl.style.cssText = 'position:fixed;z-index:9999;pointer-events:none;padding:10px 14px;border-radius:6px;font-size:12px;line-height:1.6;max-width:360px;display:none;white-space:pre-line;';
    document.body.appendChild(_detailEl);
  }
  return _detailEl;
}

function updateTooltipTheme() {
  const el = getDetailTooltip();
  const dark = document.documentElement.getAttribute('data-theme') !== 'light';
  el.style.background = dark ? 'rgba(22,27,34,0.95)' : 'rgba(255,255,255,0.95)';
  el.style.color = dark ? '#e6edf3' : '#1f2328';
  el.style.border = dark ? '1px solid #30363d' : '1px solid #d0d7de';
  el.style.boxShadow = dark ? '0 4px 12px rgba(0,0,0,0.4)' : '0 4px 12px rgba(0,0,0,0.15)';
}

function buildDeviceSummary(deviceName) {
  const d = allDevices.find(dev => dev.name === deviceName);
  if (!d) return deviceName;
  const lines = [`<b>${d.name}</b>`, `${d.vendor} · ${translateDeviceType(d.device_type)}`];
  if (d.chip) lines.push(`Chip: ${d.chip}`);
  if (d.memory_capacity_gb) lines.push(`Memory: ${d.memory_capacity_gb}GB ${d.memory_type || ''} ${d.memory_bandwidth_gbs ? '@ ' + d.memory_bandwidth_gbs + ' GB/s' : ''}`);
  if (d.tops_int8) lines.push(`INT8 TOPS: ${d.tops_int8}${d.tops_note ? ' (' + d.tops_note + ')' : ''}`);
  if (d.price_usd) lines.push(`Price: $${d.price_usd}`);
  if (d.power_watts) lines.push(`Power: ${d.power_watts}W`);
  if (d.benchmarks && d.benchmarks.length) {
    lines.push('');
    d.benchmarks.forEach(b => {
      if (!BENCH_MODELS.includes(b.model)) return;
      let s = `${b.model} ${b.quant}: ${b.decode_tps} tps`;
      if (b.prefill_tps) s += ` (pp ${b.prefill_tps})`;
      if (b.estimated) s += ' *';
      if (b._suspicious) s += ' ⚠';
      lines.push(s);
    });
  }
  return lines.join('<br>');
}

function showDetailTooltip(deviceName, x, y) {
  const el = getDetailTooltip();
  updateTooltipTheme();
  el.innerHTML = buildDeviceSummary(deviceName);
  el.style.display = 'block';
  // Position: prefer right of cursor, flip if near edge
  const pad = 16;
  let left = x + pad, top = y + pad;
  if (left + 360 > window.innerWidth) left = x - 360 - pad;
  if (top + el.offsetHeight > window.innerHeight) top = y - el.offsetHeight - pad;
  el.style.left = left + 'px';
  el.style.top = top + 'px';
}

function hideDetailTooltip() {
  clearTimeout(_detailTimer);
  _detailTimer = null;
  const el = getDetailTooltip();
  el.style.display = 'none';
}

let _lastMouseX = 0, _lastMouseY = 0;
document.addEventListener('mousemove', e => { _lastMouseX = e.clientX; _lastMouseY = e.clientY; });

function bindDetailHover(chartId) {
  const el = document.getElementById(chartId);
  if (!el) return;
  el.on('plotly_hover', function(eventData) {
    hideDetailTooltip();
    if (!eventData.points || !eventData.points.length) return;
    const pt = eventData.points[0];
    // Resolve device name: scatter text is short name, ladder y is "Name *⚠"
    let name = '';
    if (pt.data?.type === 'bar') {
      name = (pt.y || '').replace(/\s*[*⚠]+\s*$/g, '').trim();
    } else {
      const idx = pt.pointIndex ?? pt.pointNumber ?? 0;
      const fullNames = pt.data?._fullNames;
      name = fullNames ? fullNames[idx] : (pt.text || pt.data?.text?.[idx] || '');
    }
    if (!name) return; // Skip if no name resolved
    // Capture mouse position at hover start
    const mx = _lastMouseX, my = _lastMouseY;
    _detailTimer = setTimeout(() => {
      showDetailTooltip(name, _lastMouseX, _lastMouseY);
    }, 2000);
  });
  el.on('plotly_unhover', hideDetailTooltip);
}

// Check if a specific metric's benchmark is estimated for a device
function isMetricEstimated(device, metricKey) {
  if (!device.benchmarks) return false;
  if (metricKey.startsWith('bench_decode_') || metricKey.startsWith('bench_prefill_')) {
    const model = metricKey.split('_').slice(2).join('_');
    const bench = device.benchmarks.find(b => b.model === model);
    return bench?.estimated || false;
  }
  if (['perf_per_dollar', 'perf_per_watt', 'perf_effectiveness'].includes(metricKey)) {
    const b9 = device.benchmarks.find(b => b.model === 'Qwen3.5-9B');
    return b9?.estimated || false;
  }
  return false;
}

// Check if device has any estimated benchmark
function hasAnyEstimated(device) {
  if (!device.benchmarks) return false;
  return device.benchmarks.some(b => b.estimated);
}

// Check if a specific metric's benchmark is suspicious for a device
function isMetricSuspicious(device, metricKey) {
  if (!device.benchmarks) return false;
  if (metricKey.startsWith('bench_decode_') || metricKey.startsWith('bench_prefill_')) {
    const model = metricKey.split('_').slice(2).join('_');
    const bench = device.benchmarks.find(b => b.model === model);
    return bench?._suspicious || false;
  }
  // For ratio metrics, check if the underlying 9B benchmark is suspicious
  if (['perf_per_dollar', 'perf_per_watt', 'perf_effectiveness'].includes(metricKey)) {
    const b9 = device.benchmarks.find(b => b.model === 'Qwen3.5-9B');
    return b9?._suspicious || false;
  }
  return false;
}

// Check if device has any suspicious benchmark
function hasAnySuspicious(device) {
  if (!device.benchmarks) return false;
  return device.benchmarks.some(b => b._suspicious);
}

function bindChartClick(chartId) {
  const el = document.getElementById(chartId);
  if (!el) return;
  el.on('plotly_click', function(eventData) {
    if (!eventData.points || !eventData.points.length) return;
    const pt = eventData.points[0];
    // For ladder chart: file is in customdata directly
    // For scatter charts: file is in customdata[last_index]
    let file = null;
    if (typeof pt.customdata === 'string') {
      file = pt.customdata;
    } else if (Array.isArray(pt.customdata)) {
      file = pt.customdata[pt.customdata.length - 1];
    }
    if (file) window.location = `device.html?file=${encodeURIComponent(file)}`;
  });
}

window.sortTable = sortTable;
document.addEventListener('DOMContentLoaded', init);
