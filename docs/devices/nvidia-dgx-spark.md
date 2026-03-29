---
id: "nvidia-dgx-spark"
name: "NVIDIA DGX Spark"
vendor: "NVIDIA"
device_type: "Mini PC"
chip: "Grace Blackwell GB10"

memory_capacity_gb: 128
memory_bandwidth_gbs: 273
memory_type: "LPDDR5X"
memory_speed: "8533MT/s"
memory_bus_width: "256bit"

tops_int8: 1000
tops_note: "FP4 sparse, dense INT8 estimated ~250-500 TOPS, compute far exceeds memory bandwidth ceiling"

price_usd: 4699
power_watts: 240

interface: "Onboard"

benchmarks:
  - model: "Qwen3.5-35B-A3B"
    quant: "NVFP4"
    framework: "Atlas"
    decode_tps: 102.0
    note: "measured, optimized SM121 CUDA kernels"
  - model: "Qwen3.5-122B-A10B"
    quant: "NVFP4"
    framework: "Atlas"
    decode_tps: 47.0
    note: "measured, single GB10"
  - model: "Llama 3.1 8B"
    quant: "Q4_K_M"
    framework: "Ollama"
    decode_tps: 38.0
    prefill_tps: 7614.0
    note: "measured"
  - model: "Qwen3 32B"
    quant: "Q4_K_M"
    framework: "Ollama"
    decode_tps: 9.4
    note: "measured"
  - model: "GPT-OSS-20B"
    quant: "MXFP4"
    framework: "Ollama"
    decode_tps: 58.3
    prefill_tps: 3224.0
    note: "measured, MoE 3.6B active"
  - model: "GPT-OSS-120B"
    quant: "Q4_K_S"
    framework: "LM Studio"
    decode_tps: 48.96
    note: "measured, MoE 5.1B active"
  - model: "Qwen3.5-9B"
    quant: "int4"
    framework: "LM Studio"
    decode_tps: 42.0
    estimated: true
    estimated_from: "LM Studio Qwen3.5-9B Q8_0 (20.96 tps, model size halved at Q4 -> x2)"
  - model: "Qwen3.5-27B"
    quant: "int4"
    framework: "LM Studio"
    decode_tps: 13.4
    estimated: true
    estimated_from: "LM Studio Qwen3.5-27B Q8_0 (6.70 tps, model size halved at Q4 -> x2)"

submitted_by: "community"
date: "2026-03-29"
---

# NVIDIA DGX Spark — Benchmark Report

## Test Environment

- **OS**: Ubuntu 24.04 / DGX OS
- **Frameworks**: Atlas (Rust + CUTLASS 3.8 SM121 kernels), LM Studio 4.7 (llama.cpp CUDA ARM v2.8.0), Ollama v0.12.6
- **Cooling**: Internal active cooling
- **Power supply**: Stock power adapter

## Sources

- [Reddit — Atlas: 102 tok/s Qwen3.5-35B-A3B on DGX Spark](https://www.reddit.com/r/LocalLLaMA/comments/1rkefjw/solved_the_dgx_spark_102_stable_toks_qwen3535ba3b/) — Atlas engine benchmarks, 122B-A10B 47 tps
- [Reddit — LM Studio DGX Spark 23 models](https://www.reddit.com/r/LocalLLaMA/comments/1s4yc0w/lm_studio_dgx_spark_generation_speeds_for_23/) — LM Studio benchmarks for 9B/27B/35B/122B
- [Ollama Blog — NVIDIA Spark Performance](https://ollama.com/blog/nvidia-spark-performance) — Llama 3.1 8B, Qwen3 32B, GPT-OSS measured data
- [LMSYS Blog — DGX Spark Review](https://lmsys.org/blog/2025-10-13-nvidia-dgx-spark/)

## Notes

DGX Spark claims 1000 TOPS (FP4 sparse) but has only 273 GB/s memory bandwidth. For standard inference engines (LM Studio, Ollama), single-user decode is severely memory bandwidth bound.

However, the Atlas engine (custom Rust + CUTLASS 3.8 kernels optimized for SM121 architecture) demonstrates that specialized software can dramatically improve performance:

| Model | Atlas | LM Studio | vLLM | Speedup (Atlas/vLLM) |
|-------|-------|-----------|------|---------------------|
| 35B-A3B | **102 tps** | 27.7 tps (bf16) | 41-44 tps | **2.3x** |
| 122B-A10B | **47 tps** | 24.2 tps (Q4) | — | — |

Atlas achieves this through NVFP4 quantization native to GB10, pre-quantized weight cache, and zero-overhead kernel dispatch (2GB image vs 20GB vLLM). Cold start is ~2 minutes vs 30-45 minutes for vLLM.

The 128GB unified memory enables 122B+ models that don't fit on consumer GPUs. For batch=1 with unoptimized engines, the $2,999 price is hard to justify vs cheaper devices with similar bandwidth. But with Atlas, the DGX Spark becomes significantly more competitive.
