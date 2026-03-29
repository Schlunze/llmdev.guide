---
id: "intel-arc-b580-12gb"
name: "Intel Arc B580 12GB"
vendor: "Intel"
device_type: "GPU"
chip: "BMG-G21"

memory_capacity_gb: 12
memory_bandwidth_gbs: 456
memory_type: "GDDR6"

price_usd: 260
power_watts: 150

interface: "PCIe x8"

benchmarks:
  - model: "Llama 7B"
    quant: "Q4_0"
    framework: "llama.cpp Vulkan"
    decode_tps: 72.0
    prefill_tps: 621.0
    note: "measured, FA=1"
  - model: "Qwen3.5-9B"
    quant: "int4"
    framework: "llama.cpp Vulkan"
    decode_tps: 56.1
    prefill_tps: 484.0
    estimated: true
    estimated_from: "Llama 7B Q4_0 llama-bench tg128, factor 7/9=0.78"

submitted_by: "community"
date: "2026-03-28"
---

# Intel Arc B580 12GB — Benchmark Report

## Test Environment

- **OS**: Linux (Ubuntu)
- **Framework**: llama.cpp (Vulkan backend, Flash Attention enabled)
- **Model source**: llama-bench (Llama 7B Q4_0)
- **Cooling**: Stock dual-fan cooler
- **Power supply**: Standard ATX PSU

## Sources

- [llama.cpp #10879](https://github.com/ggml-org/llama.cpp/issues/10879) — Llama 7B Q4_0 measured results: decode 72.0 tps (tg128), prefill 621 tps (pp512), FA=1

## Estimation Methodology

Qwen3.5-9B int4 numbers are estimated from Llama 7B Q4_0 llama-bench results using a linear scaling factor based on active parameter count:

- **Factor**: 7B / 9B = 0.78
- **Decode**: 72.0 x 0.78 = 56.1 tps (rounded)
- **Prefill**: 621 x 0.78 = 484 tps (rounded)

This is a rough approximation. Actual performance may vary due to differences in model architecture, quantization efficiency, and framework optimizations.

## Notes

The Intel Arc B580 is a budget-friendly option at $260 with 12GB VRAM, enough to run 9B models in 4-bit quantization. Decode performance at ~56 tps (estimated for Qwen3.5-9B) is quite usable for interactive inference. Prefill is relatively slow compared to NVIDIA and AMD competitors, likely due to less mature Vulkan backend optimizations and lower compute throughput. The 12GB VRAM limits context length for larger models. Overall, the B580 offers the best entry-level price point for GPU-accelerated LLM inference.
