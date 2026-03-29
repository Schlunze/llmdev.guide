---
id: "apple-mac-studio-m3-ultra-256gb"
name: "Apple Mac Studio M3 Ultra 256GB"
vendor: "Apple"
device_type: "Mini PC"
chip: "Apple M3 Ultra (28P+8E CPU, 80-core GPU)"

memory_capacity_gb: 256
memory_bandwidth_gbs: 800
memory_type: "LPDDR5X"

price_usd: 6749
power_watts: 200

interface: "Onboard"

benchmarks:
  - model: "Qwen3-30B-A3B"
    quant: "int4"
    framework: "MLX"
    decode_tps: 76.3
    note: "measured, deepnewz benchmark"
  - model: "Qwen3.5-122B-A10B"
    quant: "int8"
    framework: "MLX"
    decode_tps: 42.5
    note: "measured, Unsloth guide"
  - model: "LLaMA 7B"
    quant: "Q4_0"
    framework: "llama.cpp"
    decode_tps: 92.1
    note: "measured, llama.cpp discussion #4167, 80-core GPU"
  - model: "Qwen3.5-9B"
    quant: "int4"
    framework: "llama.cpp"
    decode_tps: 71.6
    estimated: true
    estimated_from: "LLaMA 7B Q4_0 92.1 tps (7B -> 9B, x0.78, Dense->Dense)"
  - model: "Qwen3.5-27B"
    quant: "int4"
    framework: "MLX"
    decode_tps: 19.9
    estimated: true
    estimated_from: "Qwen3 32B Q4 16.8 tps (32B -> 27B, x1.19, Dense->Dense)"
  - model: "Qwen3.5-35B-A3B"
    quant: "int4"
    framework: "MLX"
    decode_tps: 76.3
    estimated: true
    estimated_from: "Qwen3-30B-A3B (3B -> 3B active, x1.00, MoE->MoE)"

submitted_by: "community"
date: "2026-03-29"
---

# Apple Mac Studio M3 Ultra 256GB — Benchmark Report

## Test Environment

- **Device**: Mac Studio (M3 Ultra, 256GB unified memory)
- **Memory**: 256GB LPDDR5X, ~800 GB/s bandwidth
- **Framework**: MLX / llamafile
- **Quantization**: int4 / Q4_K_M / int8

## Sources

- [LocalScore — M3 Ultra Results](https://www.localscore.ai/accelerator/1359)
- [Qwen3-30B-A3B MLX Benchmark](https://deepnewz.com/ai-modeling/qwen3-30b-a3b-model-mlx-weights-shows-m4-max-m3-ultra-lead-tokens-per-second-32k-380e5584)
- [Unsloth — Qwen3.5 Local Guide](https://unsloth.ai/docs/models/qwen3.5)

## Notes

- 256GB unified memory is the key advantage: can run 122B and even 397B models that no consumer GPU can fit.
- MoE models perform excellently — Qwen3-30B-A3B at 76.3 tps and 122B-A10B at 42.5 tps thanks to small active parameter counts.
- Dense 27B+ models are bandwidth-bound at ~800 GB/s, resulting in moderate decode speeds.
- MLX framework delivers best performance on Apple Silicon, ~25-30% faster than llama.cpp/Ollama.
- At $6749, primarily justified by the ability to run very large models locally.
