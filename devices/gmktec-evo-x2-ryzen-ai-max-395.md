---
id: gmktec-evo-x2-ryzen-ai-max-395
name: "GMKtec EVO-X2 (Ryzen AI Max+ 395) 128GB"
vendor: "GMKtec / AMD"
device_type: "Mini PC"
chip: "AMD Ryzen AI Max+ 395"
memory_capacity_gb: 128
memory_bandwidth_gbs: 256
memory_type: "LPDDR5X"
memory_speed: "8000MT/s"
tops_int8: 50
tops_note: "XDNA2 NPU only, GPU compute separate"
price_usd: 1800
power_watts: 65
interface: "Onboard"
benchmarks:
  - model: "Qwen3.5-35B-A3B"
    quant: "int4"
    framework: "llama.cpp ROCm"
    decode_tps: 64.7
    estimated: true
    estimated_from: "Qwen3.5-35B-A3B Q6_K_L measured 43.1 tps, Q4 model ~1.5x smaller -> x1.5"
  - model: "Qwen3.5-122B-A10B"
    quant: "Q4_K_L"
    framework: "llama.cpp ROCm"
    decode_tps: 21.2
    prefill_tps: 279.0
    context_length: 5000
    note: "measured, Bartowski quant, Framework Desktop same SoC"
  - model: "Qwen3 8B"
    quant: "Q4_K_M"
    framework: "llama.cpp Vulkan"
    decode_tps: 33.5
    note: "measured, source: nishtahir.com"
  - model: "Qwen3 32B"
    quant: "Q4_K_M"
    framework: "Ollama"
    decode_tps: 9.4
    note: "measured, source: nishtahir.com"
  - model: "GPT-OSS-20B"
    quant: "MXFP4"
    framework: "llama.cpp ROCm"
    decode_tps: 65.7
    note: "measured, MoE 3.6B active, source: nishtahir.com"
  - model: "GPT-OSS-120B"
    quant: "MXFP4"
    framework: "llama.cpp ROCm"
    decode_tps: 46.1
    note: "measured, MoE 5.1B active, source: nishtahir.com"
  - model: "Qwen3.5-9B"
    quant: "int4"
    framework: "llama.cpp"
    decode_tps: 29.8
    estimated: true
    estimated_from: "Qwen3 8B (8B -> 9B, x0.89, Dense->Dense)"
  - model: "Qwen3.5-27B"
    quant: "int4"
    framework: "Ollama"
    decode_tps: 11.1
    estimated: true
    estimated_from: "Qwen3 32B (32B -> 27B, x1.19, Dense->Dense)"
submitted_by: "community"
date: "2026-03-29"
---

# GMKtec EVO-X2 (Ryzen AI Max+ 395) 128GB — Benchmark Report

## Test Environment

- **OS**: Fedora 43 / Linux
- **Framework**: llama.cpp (ROCm 6.4.4 / Vulkan), Ollama
- **Chip**: AMD Ryzen AI Max+ 395 (128GB LPDDR5X, 256 GB/s)
- **Cooling**: Stock Mini PC cooling

## Sources

- [Reddit — Ryzen AI Max 395+ 128GB Qwen 3.5 Benchmarks (100k-250K Context)](https://www.reddit.com/r/LocalLLaMA/comments/1rpw17y/ryzen_ai_max_395_128gb_qwen_35_35b122b_benchmarks/) — Framework Desktop, same SoC, Qwen3.5-35B/122B measured data
- [GMKtec EVO-X2 Benchmarks](https://nishtahir.com/gmktec-evo-x2-ryzen-ai-max-395-benchmarks/) — Qwen3 8B/32B, GPT-OSS measured data

## Notes

- Qwen3.5 data from Framework Desktop (same Ryzen AI Max+ 395 SoC, same 128GB config).
- ROCm 6.4.4 generally performs better than ROCm 7.2 for current llama.cpp builds on this platform.
- 35B-A3B Q6_K_L at 43 tps is very usable for interactive agentic workloads. Even at 250K context it sustains 19.5 tps.
- 122B-A10B Q4 at 21 tps is respectable for a $1,800 mini PC running a 122B model. Sustains 13.4 tps at 250K context.
- 128GB unified memory is the key advantage — fits 122B MoE models that require 60GB+ at Q4, with ample room for KV cache at large contexts.
