---
id: "apple-mac-studio-m1-ultra-64gb"
name: "Apple Mac Studio M1 Ultra 64GB (48-core GPU)"
vendor: "Apple"
device_type: "Mini PC"
chip: "Apple M1 Ultra (20-core CPU, 48-core GPU)"

memory_capacity_gb: 64
memory_bandwidth_gbs: 800
memory_type: "LPDDR5"

price_usd: 2500
power_watts: 90

interface: "Onboard"

benchmarks:
  - model: "Qwen3.5-35B-A3B"
    quant: "int4"
    framework: "MLX/Ollama"
    decode_tps: 60.0
    note: "measured, source: reddit.com/r/LocalLLM"
  - model: "Qwen3.5-9B"
    quant: "int4"
    framework: "MLX"
    decode_tps: 90.0
    note: "M2 Ultra 64GB (same 800 GB/s BW) measured 90 tps, source: reddit.com/r/LocalLLM"

submitted_by: "community"
date: "2026-03-29"
---

# Apple Mac Studio M1 Ultra 64GB — Benchmark Report

## Test Environment

- **Device**: Mac Studio (2022), M1 Ultra, 20-core CPU, 48-core GPU
- **Memory**: 64GB LPDDR5 unified, 800 GB/s
- **Framework**: MLX / Ollama (user did not specify exact framework)

## Sources

- [Reddit r/LocalLLM](https://www.reddit.com/r/LocalLLM/) — "Qwen3.5-35B-A3B-4bit 60 tokens/second on my Apple Mac Studio (M1 Ultra 64GB RAM)"

## Notes

- The M1 Ultra has 800 GB/s memory bandwidth (same as M3 Ultra 60-core), making it excellent for bandwidth-bound LLM decode.
- Price listed is approximate used market price (2026). Original MSRP was $3,999+.
- The 9B estimate uses M3 Ultra 60-core data from llama.cpp #4167 as reference since both have ~800 GB/s bandwidth. Actual M1 Ultra may be slightly slower due to older GPU architecture.
- 35B-A3B at 60 tps is a strong result for a MoE model with 3B active parameters on 800 GB/s bandwidth.
