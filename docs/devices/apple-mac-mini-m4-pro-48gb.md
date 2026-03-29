---
id: "apple-mac-mini-m4-pro-48gb"
name: "Apple Mac Mini M4 Pro 48GB"
vendor: "Apple"
device_type: "Mini PC"
chip: "Apple M4 Pro"

memory_capacity_gb: 48
memory_bandwidth_gbs: 273
memory_type: "LPDDR5X"
memory_speed: "8533MT/s"
memory_bus_width: "256bit"

tops_int8: 38
tops_note: "Neural Engine only, GPU separate"

price_usd: 1799
power_watts: 65

interface: "Onboard"

benchmarks:
  - model: "Qwen3.5-27B"
    quant: "int4"
    framework: "llama.cpp / MLX"
    decode_tps: 9.0
    note: "measured, multiple users report 8-10 tps, source: reddit.com/r/LocalLLM"
  - model: "Qwen3.5-9B"
    quant: "int4"
    framework: "llama.cpp / MLX"
    decode_tps: 27.0
    estimated: true
    estimated_from: "Qwen3.5-27B measured 9 tps (27B -> 9B, x3.0, Dense->Dense)"
  - model: "Qwen3.5-35B-A3B"
    quant: "int4"
    framework: "llama.cpp"
    decode_tps: 55.0
    note: "from earlier community reports, pending re-verification"

submitted_by: "community"
date: "2026-03-29"
---

# Apple Mac Mini M4 Pro 48GB — Benchmark Report

## Test Environment

- **OS**: macOS Sequoia
- **Framework**: llama.cpp (Metal backend) / MLX
- **Memory**: 48GB LPDDR5X unified, 273 GB/s

## Sources

- [Reddit r/LocalLLM — Qwen 3.5 27B Macbook M4 Pro 48GB](https://www.reddit.com/r/LocalLLaMA/comments/1roetd9/qwen_35_27b_macbook_m4_pro_48gb/) — Multiple users report 8-10 tps for Qwen3.5-27B at various quants (Q4-Q8) on M4 Pro 48GB
- [llama.cpp #4167](https://github.com/ggml-org/llama.cpp/discussions/4167) — Llama 7B Q4_0 baseline

## Notes

- Qwen3.5-27B at int4 (~14GB weights) fits in 48GB but leaves limited room for KV cache and system usage. Multiple users on Reddit consistently report 8-10 tps regardless of framework (llama.cpp or MLX) or quantization (Q4 to Q8), suggesting memory pressure may be a factor.
- The 9B estimate is derived from the 27B measured speed using parameter ratio scaling (27/9 = 3x). This gives 27 tps, which is lower than the earlier placeholder of 62 tps — the discrepancy likely reflects Qwen3.5's hybrid DeltaNet architecture being less bandwidth-efficient than pure Transformer models on GPU.
- 35B-A3B at 55 tps is from earlier reports and may need re-verification with current llama.cpp/MLX builds.
