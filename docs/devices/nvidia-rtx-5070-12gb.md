---
id: "nvidia-rtx-5070-12gb"
name: "NVIDIA GeForce RTX 5070 12GB"
vendor: "NVIDIA"
device_type: "GPU"
chip: "GB205 (Blackwell)"

memory_capacity_gb: 12
memory_bandwidth_gbs: 672
memory_type: "GDDR7"

tops_int8: 988
tops_note: "Tensor Core INT8"

price_usd: 669
power_watts: 250

interface: "PCIe x16"

benchmarks:
  - model: "Qwen3 8B"
    quant: "Q4_K_XL"
    framework: "llama.cpp"
    decode_tps: 59.1
    prefill_tps: 1600.0
    context_length: 16384
    note: "measured, Hardware Corner GPU ranking"
  - model: "Qwen3 14B"
    quant: "Q4_K_XL"
    framework: "llama.cpp"
    decode_tps: 40.6
    prefill_tps: 1315.0
    context_length: 16384
    note: "measured, Hardware Corner GPU ranking"
  - model: "Qwen3.5-9B"
    quant: "Q4_K_XL"
    framework: "llama.cpp"
    decode_tps: 52.5
    prefill_tps: 1422.0
    estimated: true
    estimated_from: "Qwen3 8B (8B -> 9B, x0.89, Dense->Dense)"

submitted_by: "community"
date: "2026-03-29"
---

# NVIDIA GeForce RTX 5070 12GB — Benchmark Report

## Test Environment

- **GPU**: NVIDIA GeForce RTX 5070 (GB205, Blackwell)
- **VRAM**: 12GB GDDR7, 672 GB/s
- **Framework**: llama.cpp (CUDA backend)
- **Quantization**: Q4_K_XL
- **Context**: 16K tokens

## Sources

- [Hardware Corner — GPU Ranking for Local LLMs](https://www.hardware-corner.net/gpu-ranking-local-llm/) — Qwen3 8B and 14B measured results

## Notes

- 12GB VRAM limits model size: 9B and 14B fit comfortably at 4-bit, but 27B+ models require CPU offloading.
- Qwen3 8B at 59.1 tps is very responsive for interactive chat.
- Memory bandwidth (672 GB/s) is the primary decode bottleneck, as expected for autoregressive generation.
- At $669, the 5070 offers competitive performance for sub-14B models but cannot match cards with more VRAM for larger models.
