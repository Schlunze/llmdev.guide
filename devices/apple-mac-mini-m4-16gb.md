---
id: "apple-mac-mini-m4-16gb"
name: "Apple Mac Mini M4 16GB"
vendor: "Apple"
device_type: "Mini PC"
chip: "Apple M4"

memory_capacity_gb: 16
memory_bandwidth_gbs: 120
memory_type: "LPDDR5"

price_usd: 599
power_watts: 65

interface: "Onboard"

benchmarks:
  - model: "Qwen3.5-9B"
    quant: "int4"
    framework: "MLX"
    decode_tps: 21.0
    note: "measured, source: reddit.com/r/LocalLLM 'base M4 Mac Mini hits 21 tok/s'"

submitted_by: "community"
date: "2026-03-28"
---

# Apple Mac Mini M4 16GB — Benchmark Report

## Test Environment

- **OS**: macOS Sequoia
- **Framework**: llama.cpp (Metal backend)
- **Model source**: llama-bench (Llama 7B Q4_0), estimated for Qwen3.5-9B
- **Cooling**: Stock internal fan
- **Power supply**: Stock power adapter

## Sources

- [llama.cpp performance discussion](https://github.com/ggml-org/llama.cpp/discussions/4167) — Llama 7B Q4_0 measured results: decode 24.11 tps (tg128), prefill 221.29 tps (pp512)

## Estimation Methodology

Qwen3.5-9B int4 numbers are estimated from Llama 7B Q4_0 llama-bench results using a linear scaling factor based on active parameter count:

- **Factor**: 7B / 9B = 0.78
- **Decode**: 24.11 x 0.78 = 18.8 tps
- **Prefill**: 221.29 x 0.78 = 172.6 tps

This is a rough approximation. Actual performance may vary due to differences in model architecture, quantization efficiency, and framework optimizations.
