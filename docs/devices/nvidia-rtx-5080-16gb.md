---
id: "nvidia-rtx-5080-16gb"
name: "NVIDIA GeForce RTX 5080 16GB"
vendor: "NVIDIA"
device_type: "GPU"
chip: "GB203 (Blackwell)"

memory_capacity_gb: 16
memory_bandwidth_gbs: 960
memory_type: "GDDR7"

tops_int8: 1801
tops_note: "Tensor Core INT8"

price_usd: 1499
power_watts: 360

interface: "PCIe x16"

benchmarks:
  - model: "Qwen3 8B"
    quant: "Q4_K"
    framework: "llama.cpp"
    decode_tps: 129.1
    prefill_tps: 6410.0
    note: "measured, Hardware Corner GPU ranking, 4K context"
  - model: "Qwen3 14B"
    quant: "Q4_K"
    framework: "llama.cpp"
    decode_tps: 80.6
    prefill_tps: 3820.0
    note: "measured, Hardware Corner GPU ranking, 4K context"
  - model: "Qwen3.5-9B"
    quant: "Q4_K"
    framework: "llama.cpp"
    decode_tps: 114.8
    prefill_tps: 5698.0
    estimated: true
    estimated_from: "Qwen3 8B (8B -> 9B, x0.89, Dense->Dense)"

submitted_by: "community"
date: "2026-03-29"
---

# NVIDIA GeForce RTX 5080 16GB — Benchmark Report

## Test Environment

- **GPU**: NVIDIA GeForce RTX 5080 (GB203, Blackwell)
- **VRAM**: 16GB GDDR7, 960 GB/s
- **Framework**: llama.cpp (CUDA backend, build 8233)
- **Quantization**: Q4_K
- **Context**: 4K tokens

## Sources

- [Hardware Corner — RTX 5080 LLM Benchmarks](https://www.hardware-corner.net/gpu-llm-benchmarks/rtx-5080/)

## Notes

- 16GB VRAM can run 14B models at Q4 up to 32K context, but 27B+ models do not fit.
- At 960 GB/s bandwidth (same as RX 7900 XTX), decode speed is very competitive for sub-14B models.
- Qwen3 8B at 129 tps (4K context) drops to 94 tps at 16K and 49 tps at 64K due to KV cache pressure.
- At $1499, positioned between the RTX 5070 ($669) and RTX 5090 ($3999).
