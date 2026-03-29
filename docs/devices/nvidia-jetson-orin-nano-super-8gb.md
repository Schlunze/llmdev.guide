---
id: "nvidia-jetson-orin-nano-super-8gb"
name: "NVIDIA Jetson Orin Nano Super 8GB"
vendor: "NVIDIA"
device_type: "Dev Board"
chip: "Jetson Orin Nano (Super)"

memory_capacity_gb: 8
memory_bandwidth_gbs: 102
memory_type: "LPDDR5"
memory_speed: "6400MHz"
memory_bus_width: "128bit"

tops_int8: 67
tops_note: "GPU sparse, actual dense ~40 TOPS"

price_usd: 249
power_watts: 25

interface: "Onboard"

benchmarks:
  - model: "Qwen3.5-2B"
    quant: "UD-Q4_K_XL"
    framework: "llama.cpp CUDA"
    decode_tps: 20.0
    note: "measured, 100K context, source: reddit.com/r/LocalLLaMA"
  - model: "Qwen3.5-9B"
    quant: "int4"
    framework: "llama.cpp CUDA"
    decode_tps: 4.4
    estimated: true
    estimated_from: "Qwen3.5-2B (2B -> 9B, x0.22, Dense->Dense)"

submitted_by: "community"
date: "2026-03-29"
---

# NVIDIA Jetson Orin Nano Super 8GB — Benchmark Report

## Test Environment

- **OS**: JetPack 6.x (Ubuntu 22.04)
- **Framework**: llama.cpp (CUDA backend)
- **Cooling**: Stock heatsink
- **Power supply**: USB-C PD

## Sources

- [Reddit — Qwen3.5-9B on Jetson](https://www.reddit.com/r/LocalLLaMA/comments/1rlzlo7/qwen359b_on_jetson/) — Qwen3.5-2B at 16.7-20 tps, 9B at 4.6 tps (likely misconfigured CUDA)

## Notes

- 8GB unified memory is very tight for 9B int4 (~4.5GB weights + KV cache + system). The 4.4 tps estimate assumes memory fits but performance will be severely degraded.
- Qwen3.5-2B is the practical sweet spot for this device: 20 tps at 100K context in only ~1.5GB model weight.
- Reddit OP reported 9B at 4.6 tps but community analysis suggests CUDA tensor cores may not have been properly utilized (4B also only 7-8 tps vs expected ~12 tps). The 4.4 tps estimate from 2B scaling is consistent with this measurement.
