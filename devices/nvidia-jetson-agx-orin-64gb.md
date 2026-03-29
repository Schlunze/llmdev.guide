---
id: "nvidia-jetson-agx-orin-64gb"
name: "NVIDIA Jetson AGX Orin 64GB"
vendor: "NVIDIA"
device_type: "Dev Board"
chip: "Jetson AGX Orin"

memory_capacity_gb: 64
memory_bandwidth_gbs: 205
memory_type: "LPDDR5"

tops_int8: 275
tops_note: "GPU + DLA combined, sparse"

price_usd: 1999
power_watts: 60

interface: "Onboard"

benchmarks:
  - model: "Llama 7B"
    quant: "Q4_0"
    framework: "llama.cpp CUDA"
    decode_tps: 36.6
    prefill_tps: 1090.0
    note: "measured, FA=1"
  - model: "Qwen3.5-4B"
    quant: "Q4_K_M"
    framework: "llama.cpp CUDA"
    decode_tps: 27.0
    note: "measured, source: Liquid AI LinkedIn"
  - model: "Qwen3.5-0.8B"
    quant: "Q4_K_M"
    framework: "llama.cpp CUDA"
    decode_tps: 83.4
    note: "measured, source: Liquid AI LinkedIn"
  - model: "Qwen3.5-9B"
    quant: "int4"
    framework: "llama.cpp CUDA"
    decode_tps: 12.0
    estimated: true
    estimated_from: "Qwen3.5-4B Q4_K_M (4B -> 9B, x0.44, Dense->Dense, same architecture)"
  - model: "Qwen3.5-27B"
    quant: "int4"
    framework: "llama.cpp CUDA"
    decode_tps: 4.0
    estimated: true
    estimated_from: "Qwen3.5-4B Q4_K_M (4B -> 27B, x0.148, Dense->Dense, same architecture)"

submitted_by: "community"
date: "2026-03-29"
---

# NVIDIA Jetson AGX Orin 64GB — Benchmark Report

## Test Environment

- **OS**: JetPack 6.x (Ubuntu 22.04)
- **Framework**: llama.cpp (CUDA backend)
- **Cooling**: Stock active cooling
- **Power supply**: Original power adapter

## Sources

- [llama.cpp Jetson benchmarks discussion](https://github.com/ggml-org/llama.cpp/discussions/15013) — Llama 7B Q4_0 measured
- [Liquid AI LinkedIn post](https://www.linkedin.com/feed/update/urn:li:activity:7434615253067382784/) — Qwen3.5-0.8B (83.4 tps) and Qwen3.5-4B (27 tps) measured on AGX Orin 64GB Q4_K_M

## Notes

Qwen3.5 on Jetson AGX Orin is significantly slower than Llama at comparable parameter counts:
- Llama 7B Q4: 36.6 tps
- Qwen3.5-4B Q4: 27.0 tps (smaller model, yet slower)

This is likely due to Qwen3.5's hybrid DeltaNet + GatedAttention architecture, which has different compute patterns than pure Transformer models. The DeltaNet layers may not be well-optimized for Jetson's Ampere GPU architecture in current llama.cpp builds.

The 9B and 27B estimates are derived from the Qwen3.5-4B measured data using same-architecture scaling, which is more reliable than cross-architecture estimation from Llama.
