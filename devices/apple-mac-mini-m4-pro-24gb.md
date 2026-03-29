---
id: "apple-mac-mini-m4-pro-24gb"
name: "Apple Mac Mini M4 Pro 24GB"
vendor: "Apple"
device_type: "Mini PC"
chip: "Apple M4 Pro (12-core CPU, 20-core GPU)"

memory_capacity_gb: 24
memory_bandwidth_gbs: 273
memory_type: "LPDDR5X"

price_usd: 1399
power_watts: 65

interface: "Onboard"

benchmarks:
  - model: "Qwen3.5-9B"
    quant: "int4"
    framework: "llama.cpp"
    decode_tps: 39.5
    prefill_tps: 342.9
    estimated: true
    estimated_from: "Llama 7B Q4_0 llama-bench tg128/pp512, factor 7/9=0.78"

submitted_by: "community"
date: "2026-03-28"
---

# Apple Mac Mini M4 Pro 24GB — Benchmark Report

## Test Environment

- **OS**: macOS Sequoia
- **Framework**: llama.cpp (Metal backend)
- **Model source**: llama-bench (Llama 7B Q4_0), estimated for Qwen3.5-9B
- **Cooling**: Stock internal fan
- **Power supply**: Stock power adapter

## Sources

- [llama.cpp performance discussion](https://github.com/ggml-org/llama.cpp/discussions/4167) — Llama 7B Q4_0 measured results: decode 50.74 tps (tg128), prefill 439.78 tps (pp512)

## Estimation Methodology

Qwen3.5-9B int4 numbers are estimated from Llama 7B Q4_0 llama-bench results using a linear scaling factor based on active parameter count:

- **Factor**: 7B / 9B = 0.78
- **Decode**: 50.74 x 0.78 = 39.5 tps
- **Prefill**: 439.78 x 0.78 = 342.9 tps

This is a rough approximation. Actual performance may vary due to differences in model architecture, quantization efficiency, and framework optimizations.
