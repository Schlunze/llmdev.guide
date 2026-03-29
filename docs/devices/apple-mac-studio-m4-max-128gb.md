---
id: "apple-mac-studio-m4-max-128gb"
name: "Apple Mac Studio M4 Max 128GB (40-core GPU)"
vendor: "Apple"
device_type: "Mini PC"
chip: "Apple M4 Max (40-core GPU)"

memory_capacity_gb: 128
memory_bandwidth_gbs: 546
memory_type: "LPDDR5X"

price_usd: 3999
power_watts: 75

interface: "Onboard"

benchmarks:
  - model: "Qwen3.5-35B-A3B"
    quant: "int4"
    framework: "MLX/Ollama"
    decode_tps: 106.0
    note: "measured on M4 Max 40-core 64GB (same 546 GB/s BW), source: reddit.com/r/LocalLLM"
  - model: "Qwen3.5-9B"
    quant: "int4"
    framework: "llama.cpp"
    decode_tps: 64.7
    prefill_tps: 690.4
    estimated: true
    estimated_from: "Llama 7B Q4_0 llama-bench tg128/pp512, factor 7/9=0.78"
submitted_by: "community"
date: "2026-03-28"
---

# Apple Mac Studio M4 Max 128GB (40-core GPU) — Benchmark Report

## Test Environment

- **OS**: macOS Sequoia
- **Framework**: llama.cpp (Metal backend)
- **Model source**: llama-bench (Llama 7B Q4_0), estimated for Qwen3.5-9B
- **Cooling**: Stock internal fan
- **Power supply**: Stock power adapter

## Sources

- [llama.cpp performance discussion](https://github.com/ggml-org/llama.cpp/discussions/4167) — Llama 7B Q4_0 measured results: decode 83.06 tps (tg128), prefill 885.68 tps (pp512)
## Estimation Methodology

Qwen3.5-9B int4 numbers are estimated from Llama 7B Q4_0 llama-bench results using a linear scaling factor based on active parameter count:

- **Factor**: 7B / 9B = 0.78
- **Decode**: 83.06 x 0.78 = 64.7 tps
- **Prefill**: 885.68 x 0.78 = 690.4 tps

This is a rough approximation. Actual performance may vary due to differences in model architecture, quantization efficiency, and framework optimizations.
