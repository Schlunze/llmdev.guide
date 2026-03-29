---
id: raspberry-pi-5-8gb
name: Raspberry Pi 5 8GB
vendor: Raspberry Pi
device_type: "Dev Board"
chip: BCM2712 (Cortex-A76 x4)
memory_capacity_gb: 8
memory_bandwidth_gbs: 34
memory_type: LPDDR4X
price_usd: 80
power_watts: 12
interface: Onboard
benchmarks:
- model: TinyLlama 1.1B
  quant: Q4_K_M
  framework: llama.cpp
  decode_tps: 10.0
  note: measured
- model: Llama 3.2 3B
  quant: Q4_K_M
  framework: llama.cpp
  decode_tps: 5.0
  note: measured
- model: Llama 7B
  quant: Q4_K_M
  framework: llama.cpp
  decode_tps: 2.0
  note: measured, approximate
- model: Qwen3.5-9B
  quant: int4
  framework: llama.cpp
  decode_tps: 1.6
  estimated: true
  estimated_from: Llama 7B (7B active -> 9B active, x0.78)
submitted_by: benchmark-team
date: '2026-03-28'
---

# Raspberry Pi 5 8GB — Benchmark Report

## Test Environment

- **OS**: Raspberry Pi OS (Debian-based, 64-bit)
- **Framework**: llama.cpp (CPU backend)
- **Model source**: Hugging Face (GGUF)
- **Cooling**: Stock passive / aftermarket fan
- **Power supply**: USB-C PD 5V/5A

## Sources

- [How Well Do LLMs Perform on a Raspberry Pi 5?](https://www.stratosphereips.org/blog/2025/6/5/how-well-do-llms-perform-on-a-raspberry-pi-5)

## Notes

- With only 8GB RAM and 34 GB/s memory bandwidth, the Raspberry Pi 5 is extremely limited for LLM inference.
- Cannot run Qwen3.5-9B (insufficient memory for any quantization). No estimation provided.
- Llama 7B Q4_K_M (~3.8GB) barely fits in memory and achieves only ~2 t/s decode.
- CPU-only inference (no GPU/NPU accelerator), relying on quad Cortex-A76 cores.
- Useful as a baseline reference for the lowest-cost ARM SBC category.
