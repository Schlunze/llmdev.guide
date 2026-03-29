---
id: "rockchip-rk3588-24gb"
name: "Rockchip RK3588 Dev Board 24GB (Rock 5B+)"
vendor: "Rockchip"
device_type: "Dev Board"
chip: "RK3588"

memory_capacity_gb: 24
memory_bandwidth_gbs: 34
memory_type: "LPDDR4X"
memory_speed: "4266MT/s"
memory_bus_width: "64bit"

tops_int8: 6
tops_note: "NPU only (3 cores), not used for LLM inference"

price_usd: 387
power_watts: 15

interface: "Onboard"

benchmarks:
  - model: "Qwen3.5-9B"
    quant: "Q4_K_M"
    framework: "llama.cpp CPU"
    decode_tps: 2.48
    prefill_tps: 7.6
    context_length: 8192
    note: "measured, 4 threads, CPU only"
  - model: "Qwen3.5-4B"
    quant: "Q4_K_M"
    framework: "llama.cpp CPU"
    decode_tps: 3.62
    prefill_tps: 13.0
    context_length: 16384
    note: "measured, 4 threads"
  - model: "Qwen3.5-2B"
    quant: "Q4_K_M"
    framework: "llama.cpp CPU"
    decode_tps: 8.68
    prefill_tps: 32.4
    context_length: 32768
    note: "measured, 4 threads"
  - model: "Qwen3.5-0.8B"
    quant: "Q4_K_M"
    framework: "llama.cpp CPU"
    decode_tps: 12.07
    prefill_tps: 54.6
    context_length: 16384
    note: "measured, 4 threads"
  - model: "Qwen3.5-27B"
    quant: "Q4_K_M"
    framework: "llama.cpp CPU"
    decode_tps: 0.62
    prefill_tps: 1.37
    context_length: 4096
    note: "measured, 2 threads, not interactively usable"

submitted_by: "community"
date: "2026-03-29"
---

# Rockchip RK3588 Dev Board 24GB (Rock 5B+) — Benchmark Report

## Test Environment

- **Board**: Radxa ROCK 5B+ (RK3588, 24GB LPDDR4X)
- **OS**: Linux ARM64
- **Framework**: llama.cpp (source-built, armv8.2-a, cortex-a76+crc+crypto+dotprod, OpenMP, Flash Attention)
- **Inference**: CPU only (NPU not used for LLM)
- **KV cache**: q4_0
- **Cooling**: Passive heatsink

## Sources

- [RK3588 Qwen3.5 llama.cpp Rock 5B+ Benchmarks](https://sergiiob.dev/posts/rk3588-qwen35-llama-cpp-rock5b-plus-benchmarks.md/)

## Notes

- CPU-only inference on 4x Cortex-A76 cores. 4 threads is the optimal setting for most models.
- The 2B model is recommended as the best balance: 8.7 tps at 32K context with good task quality.
- 9B model is usable but slow at 2.5 tps. 27B loads but is not interactive (0.6 tps).
- NPU (6 TOPS) supports only W8A8 quantization via RKLLM and is limited to small models. Not used here.
- Memory bandwidth (~34 GB/s LPDDR4X) is the primary bottleneck for CPU inference.
