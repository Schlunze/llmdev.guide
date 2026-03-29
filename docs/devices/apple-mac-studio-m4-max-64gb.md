---
id: "apple-mac-studio-m4-max-64gb"
name: "Apple Mac Studio M4 Max 64GB (32-core GPU)"
vendor: "Apple"
device_type: "Mini PC"
chip: "Apple M4 Max (32-core GPU)"

memory_capacity_gb: 64
memory_bandwidth_gbs: 410
memory_type: "LPDDR5X"

price_usd: 2400
power_watts: 75

interface: "Onboard"

benchmarks:
  - model: "Qwen3.5-9B"
    quant: "int4"
    framework: "llama.cpp"
    decode_tps: 54.5
    prefill_tps: 556.5
    estimated: true
    estimated_from: "Llama 7B Q4_0 llama-bench tg128/pp512, factor 7/9=0.78"

submitted_by: "community"
date: "2026-03-28"
---

# Apple Mac Studio M4 Max 64GB (32-core GPU) — Benchmark Report

## Test Environment

- **OS**: macOS Sequoia
- **Framework**: llama.cpp (Metal backend)
- **Model source**: llama-bench (Llama 7B Q4_0), estimated for Qwen3.5-9B
- **Cooling**: Stock internal fan
- **Power supply**: Stock power adapter

## Sources

- [llama.cpp performance discussion](https://github.com/ggml-org/llama.cpp/discussions/4167) — Llama 7B Q4_0 measured results: decode 69.95 tps (tg128), prefill 713.93 tps (pp512)

## Estimation Methodology

Qwen3.5-9B int4 numbers are estimated from Llama 7B Q4_0 llama-bench results using a linear scaling factor based on active parameter count:

- **Factor**: 7B / 9B = 0.78
- **Decode**: 69.95 x 0.78 = 54.5 tps
- **Prefill**: 713.93 x 0.78 = 556.5 tps

This is a rough approximation. Actual performance may vary due to differences in model architecture, quantization efficiency, and framework optimizations.
