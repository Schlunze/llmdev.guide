---
id: "nvidia-rtx-3090-ti-24gb"
name: "NVIDIA RTX 3090 Ti 24GB"
vendor: "NVIDIA"
device_type: "GPU"
chip: "GA102 (Ampere)"

memory_capacity_gb: 24
memory_bandwidth_gbs: 1008
memory_type: "GDDR6X"
memory_speed: "21Gbps"
memory_bus_width: "384bit"

tops_int8: 320
tops_note: "INT8 Tensor Core, dense"

price_usd: 1699
power_watts: 450

interface: "PCIe x16"

benchmarks:
  - model: "Qwen3.5-35B-A3B"
    quant: "Q4_0"
    framework: "llama.cpp CUDA"
    decode_tps: 152.6
    prefill_tps: 4256.0
    note: "measured, mainline llama.cpp, ctx=0, source: llama.cpp #19890"
  - model: "Qwen3.5-27B"
    quant: "IQ5_KS"
    framework: "ik_llama.cpp CUDA"
    decode_tps: 36.3
    prefill_tps: 1536.0
    note: "measured, 5-bit quant (~5.9 BPW), ctx=0, source: llama.cpp #19890"
  - model: "Qwen3.5-9B"
    quant: "int4"
    framework: "llama.cpp CUDA"
    decode_tps: 111.7
    estimated: true
    estimated_from: "Same BW as RTX 4090 (1008 GB/s), using 4090 Qwen3.5-9B measured value"

submitted_by: "community"
date: "2026-03-28"
---

# NVIDIA RTX 3090 Ti 24GB — Benchmark Report

## Test Environment

- **OS**: Linux
- **Framework**: llama.cpp mainline CUDA / ik_llama.cpp fork (CUDA 13.1)
- **GPU Config**: LACT undervolt/OC
- **Cooling**: Founders Edition blower

## Sources

- [llama.cpp #19890](https://github.com/ggml-org/llama.cpp/discussions/19890) — ubergarm sweep-bench data for 3090 Ti FE

## Notes

The 3090 Ti shares the same 1008 GB/s memory bandwidth as the RTX 4090 (both use 384-bit GDDR6X), so decode performance is nearly identical for bandwidth-bound workloads. The key difference is compute throughput — the 4090 (AD102) has more CUDA cores and newer tensor cores, which matters for prefill but not decode.

At ~$1,200 (used market, 2026), the 3090 Ti offers RTX 4090-class decode speed at less than half the price. The 450W TDP and blower cooler are downsides.

Qwen3.5-27B data uses 5-bit quantization (IQ5_KS, ~5.9 BPW) which is above the 4-bit minimum. A 4-bit quant would be slightly faster.

The ik_llama.cpp fork shows higher prefill but lower decode compared to mainline on the same model — different optimization tradeoffs.
