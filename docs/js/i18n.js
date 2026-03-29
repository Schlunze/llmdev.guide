/**
 * i18n - Internationalization
 */

const I18N = {
  zh: {
    // Page & header
    page_title: 'AI Agent 本地LLM推理设备部署指南',
    site_title: '本地LLM推理设备部署指南',
    site_subtitle: '用真实数据说话，拒绝虚标 — 社区驱动的大模型推理设备性能数据库',

    // Stats
    stat_devices: '收录设备',
    stat_vendors: '覆盖厂商',
    stat_price_range: '价格区间',
    stat_bw_range: '带宽区间 (GB/s)',

    // Filters
    filters: '筛选器',
    filter_vendor: '厂商',
    filter_type: '设备类型',

    // Tabs
    tab_ladder: '天梯排行榜',
    tab_scatter2d: '2D 散点图',
    tab_scatter3d: '3D 散点图',
    tab_table: '数据表格',
    tab_guide: '部署指南',

    // Controls
    ctrl_metric: '排序指标',
    ctrl_x_axis: 'X 轴',
    ctrl_y_axis: 'Y 轴',
    ctrl_z_axis: 'Z 轴',
    ctrl_bubble_size: '气泡大小 (可选)',
    ctrl_none: '无',

    // Table headers
    th_name: '设备名称',
    th_vendor: '厂商',
    th_type: '类型',
    th_mem: '内存 GB',
    th_bw: '带宽 GB/s',
    th_price: '价格',
    th_power: '功耗',
    th_quant: '量化',
    th_framework: '框架',

    // Footer
    footer_community: '数据由社区贡献者提供',
    footer_submit: '提交数据',
    footer_baseline: '测试基准: Qwen3.5 系列 | 许可: CC BY-SA 4.0',

    // Metric groups
    group_specs: '── 静态参数 ──',
    group_prefill: '── LLM Prefill ──',
    group_decode: '── LLM Output ──',
    group_ratios: '── 比率 (9B 归一化) ──',

    // Metric labels — specs
    metric_memory_bandwidth_gbs: '内存带宽 (GB/s)',
    metric_memory_capacity_gb: '内存容量 (GB)',
    metric_price_usd: '价格 (USD)',
    metric_power_watts: '功耗 (W)',
    metric_tops: '标称算力 (TOPS)',

    // Metric labels — benchmark suffixes
    metric_decode_suffix: 'Output (tps)',
    metric_prefill_suffix: 'Prefill (tps)',

    // Metric labels — ratios
    metric_perf_per_dollar: '性价比 (9B output / $100)',
    metric_perf_per_watt: '能效比 (9B output / W)',
    metric_perf_effectiveness: '实效比 (TPS/TOPS, 归一化%)',

    // Options
    opt_show_estimated: '显示近似模型估算值',
    opt_show_suspicious: '显示存疑值 (超带宽上限)',
    opt_show_bw_lines: '显示理论带宽参考线',
    opt_log_x: 'X 轴对数',
    opt_log_y: 'Y 轴对数',
    opt_log_z: 'Z 轴对数',

    // Legend
    legend_measured: '实测值',
    legend_estimated: '近似模型估算值 *',
    legend_suspicious: '存疑值 (超带宽理论上限) ⚠',

    // Error
    load_error: '加载数据失败',
    load_hint: '请先运行',
  },

  en: {
    page_title: 'AI Agent Local LLM Inference Device Deployment Guide',
    site_title: 'Local LLM Inference Device Deployment Guide',
    site_subtitle: 'Real data, no hype — Community-driven LLM inference device performance database',

    stat_devices: 'Devices',
    stat_vendors: 'Vendors',
    stat_price_range: 'Price Range',
    stat_bw_range: 'Bandwidth Range (GB/s)',

    filters: 'Filters',
    filter_vendor: 'Vendor',
    filter_type: 'Device Type',

    tab_ladder: 'Leaderboard',
    tab_scatter2d: '2D Scatter',
    tab_scatter3d: '3D Scatter',
    tab_table: 'Data Table',
    tab_guide: 'Deployment Guide',

    ctrl_metric: 'Metric',
    ctrl_x_axis: 'X Axis',
    ctrl_y_axis: 'Y Axis',
    ctrl_z_axis: 'Z Axis',
    ctrl_bubble_size: 'Bubble Size (optional)',
    ctrl_none: 'None',

    th_name: 'Device',
    th_vendor: 'Vendor',
    th_type: 'Type',
    th_mem: 'RAM GB',
    th_bw: 'BW GB/s',
    th_price: 'Price',
    th_power: 'Power',
    th_quant: 'Quant',
    th_framework: 'Framework',

    footer_community: 'Data contributed by the community',
    footer_submit: 'Submit Data',
    footer_baseline: 'Benchmark: Qwen3.5 series | License: CC BY-SA 4.0',

    group_specs: '── Device Specs ──',
    group_prefill: '── LLM Prefill ──',
    group_decode: '── LLM Output ──',
    group_ratios: '── Ratios (9B normalized) ──',

    metric_memory_bandwidth_gbs: 'Memory Bandwidth (GB/s)',
    metric_memory_capacity_gb: 'Memory Capacity (GB)',
    metric_price_usd: 'Price (USD)',
    metric_power_watts: 'Power (W)',
    metric_tops: 'Claimed TOPS',

    metric_decode_suffix: 'Output (tps)',
    metric_prefill_suffix: 'Prefill (tps)',

    metric_perf_per_dollar: 'Perf/Dollar (9B output / $100)',
    metric_perf_per_watt: 'Perf/Watt (9B output / W)',
    metric_perf_effectiveness: 'Effectiveness (TPS/TOPS, norm %)',

    opt_show_estimated: 'Show estimated values from similar models',
    opt_show_suspicious: 'Show suspicious values (exceeding BW ceiling)',
    opt_show_bw_lines: 'Show theoretical bandwidth reference lines',
    opt_log_x: 'Log X axis',
    opt_log_y: 'Log Y axis',
    opt_log_z: 'Log Z axis',

    legend_measured: 'Measured',
    legend_estimated: 'Estimated from similar model *',
    legend_suspicious: 'Suspicious (exceeds BW ceiling) ⚠',

    load_error: 'Failed to load data',
    load_hint: 'Please run',
  },
};

const DEVICE_TYPE_MAP = {
  '开发板': 'Dev Board',
  '迷你主机': 'Mini PC',
  '独立服务器': 'Server',
  '模组': 'Module',
  '加速卡': 'Accelerator',
  '显卡': 'GPU',
};

let currentLang = (navigator.language || 'zh').startsWith('zh') ? 'zh' : 'en';

function t(key) {
  return I18N[currentLang]?.[key] || I18N.zh[key] || key;
}

function toggleLang() {
  currentLang = currentLang === 'zh' ? 'en' : 'zh';
  document.getElementById('lang-toggle').textContent = currentLang === 'zh' ? 'EN' : '中文';
  applyI18n();
  if (typeof populateAxisSelectors === 'function') populateAxisSelectors();
  if (typeof renderAll === 'function') renderAll();
}

function applyI18n() {
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.dataset.i18n;
    const text = t(key);
    const arrow = el.querySelector('.sort-arrow');
    if (arrow) {
      const arrowText = arrow.textContent;
      el.textContent = text;
      const newArrow = document.createElement('span');
      newArrow.className = 'sort-arrow';
      newArrow.textContent = arrowText;
      el.appendChild(newArrow);
    } else {
      el.textContent = text;
    }
  });
  document.title = t('page_title');
  document.documentElement.lang = currentLang === 'zh' ? 'zh-CN' : 'en';
}

function translateDeviceType(type) {
  if (currentLang === 'en' && DEVICE_TYPE_MAP[type]) return DEVICE_TYPE_MAP[type];
  return type;
}

// Theme
let currentTheme = 'dark';

function toggleTheme() {
  currentTheme = currentTheme === 'dark' ? 'light' : 'dark';
  document.documentElement.setAttribute('data-theme', currentTheme);
  document.getElementById('theme-toggle').innerHTML = currentTheme === 'dark' ? '&#9788;' : '&#9790;';
  if (typeof renderAll === 'function') renderAll();
}

document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('lang-toggle').textContent = currentLang === 'zh' ? 'EN' : '中文';
  document.getElementById('theme-toggle').innerHTML = '&#9790;';
  document.documentElement.setAttribute('data-theme', 'dark');
  applyI18n();
});
