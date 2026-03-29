---
id: "amd-rx-7900-xt-20gb"
name: "AMD Radeon RX 7900 XT 20GB"
vendor: "AMD"
device_type: "GPU"
chip: "Navi 31"

memory_capacity_gb: 20
memory_bandwidth_gbs: 800
memory_type: "GDDR6"

tops_int8: 103
tops_note: "Shader-based INT8, no dedicated tensor cores"

price_usd: 699
power_watts: 315

interface: "PCIe x16"

benchmarks:
  - model: "Qwen3.5-9B"
    quant: "int4"
    framework: "llama.cpp Vulkan"
    decode_tps: 126.8
    estimated: true
    estimated_from: "RX 7900 XTX 9B 152.2 tps scaled by BW ratio 800/960"
  - model: "Qwen3.5-27B"
    quant: "int4"
    framework: "llama.cpp Vulkan"
    decode_tps: 42.2
    estimated: true
    estimated_from: "RX 7900 XTX 27B 50.6 tps scaled by BW ratio 800/960"
  - model: "Qwen3.5-35B-A3B"
    quant: "int4"
    framework: "llama.cpp Vulkan"
    decode_tps: 110.8
    estimated: true
    estimated_from: "RX 7900 XTX 35B-A3B 133.0 tps scaled by BW ratio 800/960"

submitted_by: "community"
date: "2026-03-29"
---

# AMD Radeon RX 7900 XT 20GB — Benchmark Report

## Test Environment

- **OS**: Linux (Ubuntu)
- **Framework**: llama.cpp (Vulkan backend)
- **Cooling**: Stock dual-fan cooler
- **Power supply**: Standard ATX PSU (850W+ recommended)

## Estimation Methodology

All Qwen3.5 estimates are derived from the RX 7900 XTX measured/estimated data, scaled by the memory bandwidth ratio (800 / 960 = 0.833):

- **9B**: 152.2 × 0.833 = 126.8 tps
- **27B**: 50.6 × 0.833 = 42.2 tps
- **35B-A3B**: 133.0 × 0.833 = 110.8 tps

## Notes

- The RX 7900 XT shares the same Navi 31 GPU as the XTX but with fewer CUs (84 vs 96) and reduced memory bandwidth (800 vs 960 GB/s).
- 20GB VRAM is sufficient for 9B and 27B models in 4-bit quantization, but tight for larger models.
- At $699, offers strong price-performance for LLM decode workloads compared to the $1299 XTX.
