---
id: nvidia-rtx-4090-24gb
name: NVIDIA RTX 4090 24GB
vendor: NVIDIA
device_type: "GPU"
chip: AD102
memory_capacity_gb: 24
memory_bandwidth_gbs: 1008
memory_type: GDDR6X
tops_int8: 1321
tops_note: FP8 Tensor Core sparse, dense INT8 ~660 TOPS
price_usd: 3499
power_watts: 450
interface: PCIe x16
benchmarks:
- model: Llama 7B
  quant: Q4_0
  framework: llama.cpp CUDA
  decode_tps: 189.0
  prefill_tps: 14771.0
  note: "measured, FA=1, source: llama.cpp #15013"
- model: Qwen3 8B
  quant: Q4_K_XL
  framework: llama.cpp CUDA
  decode_tps: 104.3
  context_length: 16384
  note: "measured, source: Hardware Corner"
- model: Qwen3 30B-A3B
  quant: Q4_K_XL
  framework: llama.cpp CUDA
  decode_tps: 139.7
  prefill_tps: 4549.0
  context_length: 16384
  note: "measured, MoE 3B active, source: Hardware Corner"
- model: Qwen3 32B
  quant: Q4_K_XL
  framework: llama.cpp CUDA
  decode_tps: 37.7
  prefill_tps: 1685.0
  context_length: 16384
  note: "measured, Dense 32B, source: Hardware Corner"
- model: Qwen3.5-9B
  quant: Q4_K_M
  framework: llama.cpp CUDA
  decode_tps: 111.7
  note: "measured, source: reddit.com/r/LocalLLaMA"
- model: Qwen3.5-27B
  quant: Q4_K_M
  framework: llama.cpp CUDA
  decode_tps: 40.4
  note: "measured, source: reddit.com/r/LocalLLaMA"
- model: Qwen3.5-35B-A3B
  quant: Q4_K_M
  framework: llama.cpp CUDA
  decode_tps: 149.8
  note: "measured, source: reddit.com/r/LocalLLaMA"
submitted_by: community
date: '2026-03-28'
---

# NVIDIA RTX 4090 24GB — Benchmark Report

## Test Environment

- **OS**: Linux (Ubuntu)
- **Framework**: llama.cpp (CUDA backend, Flash Attention enabled)
- **Cooling**: Stock triple-fan cooler
- **Power supply**: Standard ATX PSU (850W+ recommended)

## Sources

- [llama.cpp #15013](https://github.com/ggml-org/llama.cpp/discussions/15013) — Llama 7B Q4_0: decode 189.0 tps, prefill 14771 tps (FA=1)
- [Hardware Corner](https://hardware-corner.net) — Qwen3 8B/32B/30B-A3B @16K context
- [Reddit r/LocalLLaMA](https://www.reddit.com/r/LocalLLaMA/comments/1rn59iv/) — Qwen3.5-9B/27B/35B-A3B Q4_K_M measured decode

## Notes

The RTX 4090 with 1008 GB/s bandwidth delivers strong decode throughput across all model sizes. At 24GB VRAM it handles up to 35B MoE models comfortably.

Qwen3.5-9B measured at 111.7 tps is lower than the earlier Llama 7B-based estimate (147.2 tps) — the ~24% gap is due to Qwen3.5's hybrid DeltaNet architecture having different compute patterns than pure transformer Llama models, making simple parameter-count scaling less accurate.

At $2,755 (street price, 2026) and 450W TDP, it's a premium choice. The 3090 Ti offers similar decode speed at ~$1,200 used.
