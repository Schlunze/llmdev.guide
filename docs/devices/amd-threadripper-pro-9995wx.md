---
id: "amd-threadripper-pro-9995wx"
name: "AMD Threadripper PRO 9995WX Workstation"
vendor: "AMD"
device_type: "Server"
chip: "AMD Threadripper PRO 9995WX (96-core Zen 5)"

memory_capacity_gb: 512
memory_bandwidth_gbs: 410
memory_type: "DDR5 ECC RDIMM"
memory_speed: "6400MT/s"
memory_bus_width: "8-channel"

price_usd: 14000
power_watts: 350

interface: "Onboard"

benchmarks:
  - model: "Qwen3.5-9B"
    quant: "int4"
    framework: "llamafile (AVX512, estimated)"
    decode_tps: 83.9
    estimated: true
    estimated_from: "TR PRO 7995WX Mistral 7B llamafile 93 tps x1.16 Zen5 uplift x 7/9 (Dense->Dense)"

submitted_by: "benchmark-team"
date: "2026-03-28"
---

# AMD Threadripper PRO 9995WX Workstation — Benchmark Report

## Test Environment

- **OS**: Linux
- **Framework**: llamafile (AVX512, estimated from 7995WX + Zen 5 uplift)
- **Cooling**: Workstation-grade cooling
- **Power supply**: Workstation PSU

## Sources

- [Puget Systems — AMD Ryzen Threadripper PRO 9000WX Review](https://www.pugetsystems.com/labs/articles/amd-ryzen-threadripper-pro-9000wx-content-creation-review/) (+16% over 7995WX for LLM workloads)
- [justine.lol matmul — llamafile AVX512 optimizations](https://justine.lol/matmul/) (7995WX baseline: 93 tps on Mistral 7B)

## Notes

- Estimated from 7995WX llamafile AVX512 data (93 tps) with Puget Systems reported +16% Zen 5 uplift: 93 × 1.16 = 107.9 tps for 7B, then × 7/9 = 83.9 tps for 9B.
- 8-channel DDR5-6400 provides ~410 GB/s aggregate bandwidth (23% more than 7995WX's 333 GB/s).
- No direct measured data available yet for this platform.
- 512GB memory capacity allows running very large models at int4 quantization.
