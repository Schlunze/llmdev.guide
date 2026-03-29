---
id: "amd-radeon-ai-pro-r9700-32gb"
name: "AMD Radeon AI PRO R9700 32GB"
vendor: "AMD"
device_type: "GPU"
chip: "Navi 48 (RDNA 4, gfx1201)"

memory_capacity_gb: 32
memory_bandwidth_gbs: 640
memory_type: "GDDR6"
memory_speed: "20Gbps"
memory_bus_width: "256bit"

tops_int8: 766
tops_note: "1531 TOPS INT4 sparse / 2, AI accelerator based"

price_usd: 1349
power_watts: 300

interface: "PCIe x16"

benchmarks:
  - model: "Qwen3.5-35B-A3B"
    quant: "Q4_K_XL"
    framework: "llama.cpp Vulkan"
    decode_tps: 138.0
    context_length: 8192
    note: "measured, latest llama.cpp, source: llama.cpp #19890"
  - model: "Qwen3.5-27B"
    quant: "int4"
    framework: "llama.cpp Vulkan"
    decode_tps: 41.0
    context_length: 8192
    note: "measured, latest llama.cpp, source: llama.cpp #19890"
  - model: "Qwen3-30B-A3B"
    quant: "Q4_K_M"
    framework: "llama.cpp Vulkan"
    decode_tps: 183.5
    prefill_tps: 3033.0
    context_length: 512
    note: "measured, FA ON, 5-run mean, source: llama.cpp #19890"
  - model: "Qwen3.5-9B"
    quant: "int4"
    framework: "llama.cpp Vulkan"
    decode_tps: 123.0
    estimated: true
    estimated_from: "Qwen3.5-27B 41 tps (27B -> 9B, x3.0, Dense->Dense)"

submitted_by: "community"
date: "2026-03-28"
---

# AMD Radeon AI PRO R9700 32GB — Benchmark Report

## Test Environment

- **OS**: Ubuntu 24.04
- **Framework**: llama.cpp (Vulkan backend, Flash Attention enabled)
- **CPU**: Ryzen 9 9900X / Ryzen 5 7500F
- **Config**: `-ngl 99 -fa 1`, KV cache q8_0

## Sources

- [llama.cpp #19890](https://github.com/ggml-org/llama.cpp/discussions/19890) — Comprehensive R9700 benchmarks by multiple users
- [AMD Radeon AI PRO R9700 Product Page](https://www.amd.com/en/products/graphics/workstations/radeon-ai-pro/ai-9000-series/amd-radeon-ai-pro-r9700.html)

## Estimation Methodology

- **Qwen3.5-9B int4**: Estimated from measured Qwen3.5-27B decode (41 tps at 8K context), factor 27/9 = 3.0. Result: 41 × 3.0 = 123 tps. Cross-validated with bandwidth model: 640 GB/s × 0.86 / 4.5 GB = 122 tps — consistent.

## Notes

The R9700 is AMD's RDNA 4 AI-focused professional GPU with 32GB GDDR6 and 640 GB/s bandwidth. At $1,299 it sits between the RX 9070 XT ($549, 16GB) and RX 7900 XTX ($999, 24GB) in price, but the doubled VRAM (32GB) makes it uniquely suited for LLM inference of 27B+ dense models.

Key findings from llama.cpp #19890:
- **Vulkan is faster than ROCm** on this card: ~183 tps vs ~150 tps for Qwen3-30B-A3B
- Measured bandwidth utilization reaches ~86% of theoretical 640 GB/s
- Latest llama.cpp builds improved MoE performance by +30% compared to earlier versions
- 32GB VRAM comfortably fits Qwen3.5-35B-A3B (~18GB at int4) with room for large KV cache

### 3090 Ti reference data (from same discussion)

Also reported in the same thread (3090 Ti FE, 24GB GDDR6X, 936 GB/s):
- Qwen3.5-35B-A3B Q4_0: 152.6 tps (mainline llama.cpp CUDA, ctx=0)
- Qwen3.5-27B IQ5_KS (5-bit): 36.3 tps (ctx=0)
