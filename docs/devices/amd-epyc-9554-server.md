---
id: "amd-epyc-9554-server"
name: "AMD EPYC 9554 Server (12ch DDR5)"
vendor: "AMD"
device_type: "Server"
chip: "AMD EPYC 9554 (64-core Zen 4)"

memory_capacity_gb: 384
memory_bandwidth_gbs: 460
memory_type: "DDR5-4800"
memory_bus_width: "12-channel"

price_usd: 5000
power_watts: 360

interface: "Onboard"

benchmarks:
  - model: "DeepSeek-R1-Distill 8B"
    quant: "Q4_K_M"
    framework: "llama.cpp"
    decode_tps: 50.0
    note: "measured"
  - model: "Qwen3.5-9B"
    quant: "int4"
    framework: "llama.cpp"
    decode_tps: 44.4
    estimated: true
    estimated_from: "DS-R1-Distill 8B (8B -> 9B, x0.89, Dense->Dense)"
  - model: "DeepSeek-R1-Distill 70B"
    quant: "Q4_K_M"
    framework: "llama.cpp"
    decode_tps: 7.14
    note: "measured"

submitted_by: "benchmark-team"
date: "2026-03-28"
---

# AMD EPYC 9554 Server (12ch DDR5) — Benchmark Report

## Test Environment

- **OS**: Linux (details from source)
- **Framework**: llama.cpp (CPU backend)
- **Model source**: Hugging Face (GGUF)
- **Cooling**: Server-grade cooling
- **Power supply**: Server PSU

## Sources

- [LLM Inference Benchmarks with llama.cpp with AMD EPYC 9554 CPU](https://ahelpme.com/ai/llm-inference-benchmarks-with-llamacpp-with-amd-epyc-9554-cpu/)

## Notes

- CPU-only inference using 12-channel DDR5-4800 providing 460 GB/s aggregate bandwidth.
- The high memory bandwidth of server-class DDR5 enables competitive CPU-only decode speeds.
- Price is approximate for the CPU only; full server cost would be significantly higher.
- Qwen3.5-9B estimated from DeepSeek-R1-Distill 8B using Dense-to-Dense scaling (8/9 ≈ 0.89).
- 384GB memory capacity allows running even the largest Dense models at int4.
