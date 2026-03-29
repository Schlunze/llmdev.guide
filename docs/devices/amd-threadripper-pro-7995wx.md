---
id: "amd-threadripper-pro-7995wx"
name: "AMD Threadripper PRO 7995WX Workstation"
vendor: "AMD"
device_type: "Server"
chip: "AMD Threadripper PRO 7995WX (96-core Zen 4)"

memory_capacity_gb: 512
memory_bandwidth_gbs: 333
memory_type: "DDR5 ECC RDIMM"
memory_speed: "5200MT/s"
memory_bus_width: "8-channel"

price_usd: 12000
power_watts: 350

interface: "Onboard"

benchmarks:
  - model: "Mistral 7B"
    quant: "Q4"
    framework: "llamafile (AVX512)"
    decode_tps: 93.0
    note: "measured, llamafile custom AVX512 kernels, source: justine.lol"
  - model: "Llama 7B"
    quant: "Q4"
    framework: "llama.cpp (standard)"
    decode_tps: 31.4
    note: "measured, standard llama.cpp without AVX512 optimization, source: OpenBenchmarking"
  - model: "Qwen3.5-9B"
    quant: "int4"
    framework: "llamafile (AVX512)"
    decode_tps: 72.3
    estimated: true
    estimated_from: "Mistral 7B llamafile AVX512 (7B active -> 9B active, x0.78, Dense->Dense)"
  - model: "Mixtral 8x22B"
    quant: "Q4_0"
    framework: "llamafile"
    decode_tps: 9.44
    note: "measured, MoE ~141B total / ~44B active, source: HuggingFace"

submitted_by: "benchmark-team"
date: "2026-03-28"
---

# AMD Threadripper PRO 7995WX Workstation — Benchmark Report

## Test Environment

- **OS**: Linux
- **Framework**: llamafile v0.6.2+ (custom AVX512 tinyBLAS kernels) / llama.cpp
- **Model source**: Hugging Face (GGUF)
- **Cooling**: Workstation-grade cooling
- **Power supply**: Workstation PSU

## Sources

- [justine.lol matmul — llamafile AVX512 optimizations](https://justine.lol/matmul/) (Mistral 7B: 93 tps)
- [OpenBenchmarking llama.cpp benchmark](https://openbenchmarking.org/performance/test/pts/llama-cpp/6ec440762e0ebc1af4c8a53ca2fae5a7403dd9fd) (standard llama.cpp: 31.4 tps)
- [Mozilla Mixtral-8x22B llamafile — HuggingFace](https://huggingface.co/Mozilla/Mixtral-8x22B-Instruct-v0.1-llamafile)

## Notes

- **Framework matters hugely on this platform**: llamafile with AVX512 reaches 93 tps (98% bandwidth utilization), while standard llama.cpp only gets 31.4 tps (33% utilization) — a 3x difference on the same hardware.
- CPU-only inference using 8-channel DDR5-5200 providing ~333 GB/s aggregate bandwidth.
- Price includes CPU (~$9,999 MSRP) plus platform cost (~$2,000).
- 512GB memory capacity allows running very large models at int4 quantization.
