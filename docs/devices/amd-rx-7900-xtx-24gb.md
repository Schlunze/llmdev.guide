---
id: "amd-rx-7900-xtx-24gb"
name: "AMD Radeon RX 7900 XTX 24GB"
vendor: "AMD"
device_type: "GPU"
chip: "Navi 31"

memory_capacity_gb: 24
memory_bandwidth_gbs: 960
memory_type: "GDDR6"

tops_int8: 123
tops_note: "Shader-based INT8, no dedicated tensor cores"

price_usd: 1299
power_watts: 355

interface: "PCIe x16"

benchmarks:
  - model: "Llama 7B"
    quant: "Q4_0"
    framework: "llama.cpp Vulkan"
    decode_tps: 195.3
    prefill_tps: 3333.0
    note: "measured, FA=1"
  - model: "Qwen3.5-9B"
    quant: "int4"
    framework: "llama.cpp Vulkan"
    decode_tps: 152.2
    prefill_tps: 2596.0
    estimated: true
    estimated_from: "Llama 7B Q4_0 llama-bench tg128, factor 7/9=0.78"
  - model: "Qwen3.5-27B"
    quant: "int4"
    framework: "llama.cpp Vulkan"
    decode_tps: 50.6
    estimated: true
    estimated_from: "Llama 7B Q4_0 (7B -> 27B, x0.259, Dense->Dense, bandwidth model)"
  - model: "Qwen3.5-35B-A3B"
    quant: "int4"
    framework: "llama.cpp Vulkan"
    decode_tps: 133.0
    estimated: true
    estimated_from: "RTX 4090 Qwen3 30B-A3B 139.7 tps scaled by BW ratio 960/1008 (MoE->MoE)"

submitted_by: "community"
date: "2026-03-28"
---

# AMD Radeon RX 7900 XTX 24GB — Benchmark Report

## Test Environment

- **OS**: Linux (Ubuntu)
- **Framework**: llama.cpp (Vulkan backend, Flash Attention enabled)
- **Model source**: llama-bench (Llama 7B Q4_0)
- **Cooling**: Stock dual-fan cooler
- **Power supply**: Standard ATX PSU (850W+ recommended)

## Sources

- [llama.cpp #10879](https://github.com/ggml-org/llama.cpp/issues/10879) — Llama 7B Q4_0 measured results: decode 195.3 tps (tg128), prefill 3333 tps (pp512), FA=1

## Estimation Methodology

Qwen3.5-9B int4 numbers are estimated from Llama 7B Q4_0 llama-bench results using a linear scaling factor based on active parameter count:

- **Factor**: 7B / 9B = 0.78
- **Decode**: 195.3 x 0.78 = 152.2 tps (rounded)
- **Prefill**: 3333 x 0.78 = 2596 tps (rounded)

This is a rough approximation. Actual performance may vary due to differences in model architecture, quantization efficiency, and framework optimizations.

## Notes

The RX 7900 XTX offers strong decode throughput thanks to 960 GB/s memory bandwidth, competitive with the RTX 4090 for decode-bound workloads. However, prefill performance is significantly lower due to the lack of dedicated tensor cores — AMD relies on shader-based INT8 compute (123 TOPS vs 1321 TOPS on 4090). The Vulkan backend in llama.cpp is used since ROCm support on consumer RDNA3 cards can be inconsistent. At $999, it provides excellent price-performance for decode-heavy interactive use cases.

### Dual-card reference (2x 7900 XTX, vLLM TP=2)

A [Reddit benchmark](https://www.reddit.com/r/LocalLLaMA/comments/1rz9lne/) tested 2x 7900 XTX with vLLM (ROCm, HSA_ENABLE_IPC_MODE_LEGACY=0):
- **27B AWQ INT4**: 226 tok/s total throughput @30 concurrent, median TPOT 87.5ms
- **35B-A3B AWQ 4bit**: 543 tok/s total throughput @50 concurrent, median TPOT 77.6ms

These are serving throughput numbers under heavy concurrency, not single-user decode speed. Single-card estimates above are derived from bandwidth modeling instead.
