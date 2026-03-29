---
id: "apple-mac-studio-m3-ultra-96gb"
name: "Apple Mac Studio M3 Ultra 96GB"
vendor: "Apple"
device_type: "Mini PC"
chip: "Apple M3 Ultra (28P+8E CPU, 60-core GPU)"

memory_capacity_gb: 96
memory_bandwidth_gbs: 800
memory_type: "LPDDR5X"

price_usd: 4969
power_watts: 200

interface: "Onboard"

benchmarks:
  - model: "Gemma-3 27B"
    quant: "Q4"
    framework: "MLX"
    decode_tps: 41.0
    note: "measured, Creative Strategies review"
  - model: "LLaMA 7B"
    quant: "Q4_0"
    framework: "llama.cpp"
    decode_tps: 88.4
    note: "measured, llama.cpp discussion #4167, 60-core GPU"
  - model: "Qwen3.5-9B"
    quant: "int4"
    framework: "MLX"
    decode_tps: 68.8
    estimated: true
    estimated_from: "LLaMA 7B Q4_0 88.4 tps (7B -> 9B, x0.78, Dense->Dense)"
  - model: "Qwen3.5-27B"
    quant: "int4"
    framework: "MLX"
    decode_tps: 41.0
    estimated: true
    estimated_from: "Gemma-3 27B Q4 (27B -> 27B, x1.00, Dense->Dense)"
  - model: "Qwen3.5-35B-A3B"
    quant: "int4"
    framework: "MLX"
    decode_tps: 76.3
    estimated: true
    estimated_from: "Qwen3-30B-A3B 76.3 tps on M3 Ultra 256GB (3B -> 3B active, x1.00, MoE->MoE, same bandwidth)"

submitted_by: "community"
date: "2026-03-29"
---

# Apple Mac Studio M3 Ultra 96GB — Benchmark Report

## Test Environment

- **Device**: Mac Studio (M3 Ultra, 96GB unified memory)
- **CPU**: 28P+8E cores, 60-core GPU
- **Memory**: 96GB LPDDR5X, ~800 GB/s bandwidth
- **Framework**: MLX / llama.cpp

## Sources

- [MacRumors — M3 Ultra 96GB 28/60 LLM Performance](https://forums.macrumors.com/threads/mac-studio-m3-ultra-96gb-28-60-llm-performance.2456559/)
- [Creative Strategies — Mac Studio M3 Ultra AI Review](https://creativestrategies.com/mac-studio-m3-ultra-ai-workstation-review/)
- [llama.cpp Discussion #4167](https://github.com/ggml-org/llama.cpp/discussions/4167)

## Notes

- The 96GB variant has 60 GPU cores (vs 80 on 256GB), but decode speed is nearly identical since it is memory-bandwidth-bound (~800 GB/s for both).
- 96GB usable capacity (~80-85GB after OS) can run up to 70B dense models at Q4, or ~235B MoE models at Q3.
- At $4969 vs $6749 for the 256GB version, this is the more cost-effective option if you don't need to run 100B+ dense models.
- MLX framework recommended for best performance on Apple Silicon.
