---
id: "nvidia-rtx-4060-ti-16gb"
name: "NVIDIA RTX 4060 Ti 16GB"
vendor: "NVIDIA"
device_type: "GPU"
chip: "AD106"

memory_capacity_gb: 16
memory_bandwidth_gbs: 288
memory_type: "GDDR6"

tops_int8: 353
tops_note: "FP8 Tensor Core sparse, dense INT8 ~176 TOPS"

price_usd: 569
power_watts: 165

interface: "PCIe x16"

benchmarks:
  - model: "Llama 7B"
    quant: "Q4_0"
    framework: "llama.cpp CUDA"
    decode_tps: 64.0
    prefill_tps: 3803.0
    note: "measured, FA=1"
  - model: "Qwen3 8B"
    quant: "Q4_K_XL"
    framework: "llama.cpp CUDA"
    decode_tps: 34.3
    context_length: 16384
    note: "measured, Hardware Corner"
  - model: "Qwen3.5-9B"
    quant: "int4"
    framework: "llama.cpp CUDA"
    decode_tps: 49.9
    prefill_tps: 2963.0
    estimated: true
    estimated_from: "Llama 7B Q4_0 llama-bench tg128, factor 7/9=0.78"

  - model: "GPT-OSS-20B"
    quant: "Q4_K_XL"
    framework: "llama.cpp CUDA"
    decode_tps: 57.8
    context_length: 16384
    note: "measured, MoE 3.6B active, Hardware Corner"

submitted_by: "community"
date: "2026-03-28"
---

# NVIDIA RTX 4060 Ti 16GB — Benchmark Report

## Test Environment

- **OS**: Linux (Ubuntu)
- **Framework**: llama.cpp (CUDA backend, Flash Attention enabled)
- **Model source**: llama-bench (Llama 7B Q4_0), Hugging Face (Qwen3 8B)
- **Cooling**: Stock dual-fan cooler
- **Power supply**: Standard ATX PSU

## Sources

- [llama.cpp #15013](https://github.com/ggml-org/llama.cpp/pull/15013) — Llama 7B Q4_0 measured results: decode 64.0 tps (tg128), prefill 3803 tps (pp512), FA=1
- [hardware-corner.net](https://hardware-corner.net) — Qwen3 8B Q4_K_XL measured: decode 34.3 tps @16K context

## Estimation Methodology

Qwen3.5-9B int4 numbers are estimated from Llama 7B Q4_0 llama-bench results using a linear scaling factor based on active parameter count:

- **Factor**: 7B / 9B = 0.78
- **Decode**: 64.0 x 0.78 = 49.9 tps
- **Prefill**: 3803 x 0.78 = 2963 tps

This is a rough approximation. Actual performance may vary due to differences in model architecture, quantization efficiency, and framework optimizations.

## Notes

The 16GB VRAM variant of the RTX 4060 Ti provides enough memory to run 9B-class models comfortably in 4-bit quantization with room for longer context. Memory bandwidth at 288 GB/s is the main bottleneck for decode speed. The card offers good performance per watt at 165W TDP.
