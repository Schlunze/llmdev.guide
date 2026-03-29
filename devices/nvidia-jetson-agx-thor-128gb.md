---
id: "nvidia-jetson-agx-thor-128gb"
name: "NVIDIA Jetson AGX Thor 128GB"
vendor: "NVIDIA"
device_type: "Dev Board"
chip: "Jetson AGX Thor (T5000)"

memory_capacity_gb: 128
memory_bandwidth_gbs: 273
memory_type: "LPDDR5X"

tops_int8: 1035
tops_note: "FP8 TOPS, Blackwell architecture"

price_usd: 3499
power_watts: 130

interface: "Onboard"

benchmarks:
  - model: "Qwen3-30B-A3B"
    quant: "int4"
    framework: "vLLM"
    decode_tps: 61.0
    note: "measured, concurrency=1, NVIDIA official benchmark"
  - model: "Llama 3.1 8B"
    quant: "int4"
    framework: "vLLM"
    decode_tps: 41.3
    note: "measured, concurrency=1, NVIDIA official benchmark"
  - model: "Qwen3 32B"
    quant: "int4"
    framework: "vLLM"
    decode_tps: 13.19
    note: "measured, concurrency=1, NVIDIA official benchmark"
  - model: "Llama 3.3 70B"
    quant: "int4"
    framework: "vLLM"
    decode_tps: 4.7
    note: "measured, concurrency=1, NVIDIA official benchmark"
  - model: "Qwen3.5-9B"
    quant: "int4"
    framework: "vLLM"
    decode_tps: 36.7
    estimated: true
    estimated_from: "Llama 3.1 8B (8B -> 9B, x0.89, Dense->Dense)"
  - model: "Qwen3.5-27B"
    quant: "int4"
    framework: "vLLM"
    decode_tps: 15.6
    estimated: true
    estimated_from: "Qwen3 32B (32B -> 27B, x1.19, Dense->Dense)"
  - model: "Qwen3.5-35B-A3B"
    quant: "int4"
    framework: "vLLM"
    decode_tps: 61.0
    estimated: true
    estimated_from: "Qwen3-30B-A3B (3B -> 3B active, x1.00, MoE->MoE)"

submitted_by: "community"
date: "2026-03-29"
---

# NVIDIA Jetson AGX Thor 128GB — Benchmark Report

## Test Environment

- **OS**: JetPack 7.0, CUDA 13.0, TensorRT 10.13
- **Framework**: vLLM (via Triton Server container)
- **Config**: ISL=2048, OSL=128, MAXN power mode
- **Cooling**: Stock active cooling
- **Power supply**: Original power adapter

## Sources

- [NVIDIA Jetson Benchmarks](https://developer.nvidia.com/embedded/jetson-benchmarks) — Official concurrency=1 and concurrency=8 numbers
- [NVIDIA Developer Forum: Qwen3-30B-A3B Thor vs Orin](https://forums.developer.nvidia.com/t/performance-comparison-of-qwen3-30b-a3b-awq-on-jetson-thor-vs-orin-agx-64gb/345449) — User-reported ~53 tps (Thor) vs ~41.5 tps (Orin) for Qwen3-30B-A3B AWQ

## Notes

All data uses **concurrency=1** (single-user) from official NVIDIA benchmarks. Concurrency=8 throughput numbers are significantly higher (e.g., Qwen3 30B-A3B: 226 tps) but not comparable to single-user interactive use.

Thor has the same 273 GB/s memory bandwidth as DGX Spark, but with JetPack/vLLM optimization it achieves notably higher single-user decode speeds for MoE models (61 tps for 30B-A3B vs DGX Spark's ~28 tps on LM Studio).

User-reported results (~53 tps for Qwen3-30B-A3B) are somewhat lower than NVIDIA's official 61 tps, likely due to different container versions and configurations. The 128GB LPDDR5X enables running models up to 70B dense at int4.
