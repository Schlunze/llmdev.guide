---
id: "qualcomm-snapdragon-x-elite-laptop"
name: "Snapdragon X Elite Laptop (e.g. Surface Laptop 7)"
vendor: "Qualcomm"
device_type: "Mini PC"
chip: "Snapdragon X Elite (12-core Oryon)"

memory_capacity_gb: 32
memory_bandwidth_gbs: 135
memory_type: "LPDDR5X"

price_usd: 1600
power_watts: 25

interface: "Onboard"

benchmarks:
  - model: "Llama 7B"
    quant: "Q4_0_4_8"
    framework: "llama.cpp CPU"
    decode_tps: 23.4
    note: "measured"
  - model: "Qwen2 7B"
    quant: "Q4_0"
    framework: "llama.cpp CPU"
    decode_tps: 20.3
    note: "measured"
  - model: "Qwen3.5-9B"
    quant: "int4"
    framework: "llama.cpp CPU"
    decode_tps: 18.2
    estimated: true
    estimated_from: "Llama 7B Q4_0_4_8 (7B -> 9B, x0.78, Dense->Dense)"

submitted_by: "benchmark-team"
date: "2026-03-28"
---

# Snapdragon X Elite Laptop — Benchmark Report

## Test Environment

- **Device**: Surface Laptop 7 or equivalent Snapdragon X Elite laptop
- **OS**: Windows on ARM / Linux (details from source)
- **Framework**: llama.cpp (CPU backend)
- **Model source**: Hugging Face (GGUF)
- **Cooling**: Laptop cooling
- **Power**: 25W CPU package TDP (not whole laptop)

## Sources

- [llama.cpp Discussion #8273 — Snapdragon X Elite benchmarks](https://github.com/ggml-org/llama.cpp/discussions/8273)

## Estimation Methodology

- **Qwen3.5-9B int4**: Estimated from Llama 7B Q4_0_4_8 measured decode (23.4 tps) using Dense→Dense scaling. Factor = 7/9 ≈ 0.778. Result: 23.4 × 7/9 ≈ 18.2 tps.

## Notes

- CPU-only inference on Qualcomm Oryon cores with LPDDR5X providing ~135 GB/s bandwidth.
- Price is for a typical Snapdragon X Elite laptop (e.g. Surface Laptop 7).
- Power figure (25W) is for CPU package only; total system power is higher.
- The 32GB unified memory limits maximum model size compared to server platforms.
- Qwen2 7B Q4_0 measured at 20.3 tps provides a cross-reference for the 7B class performance level.
- Classified as "Mini PC" due to the low-power, integrated form factor.
