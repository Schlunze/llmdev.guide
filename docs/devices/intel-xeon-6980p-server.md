---
id: intel-xeon-6980p-server
name: Intel Xeon 6980P Server (12ch DDR5)
vendor: Intel
device_type: "Server"
chip: Intel Xeon 6980P (128-core Granite Rapids)
memory_capacity_gb: 768
memory_bandwidth_gbs: 614
memory_type: DDR5 RDIMM
memory_speed: 6400MT/s
memory_bus_width: 12-channel
price_usd: 8000
power_watts: 500
interface: Onboard
benchmarks:
- model: DeepSeek R1 671B
  quant: Q4_K_M
  framework: llama.cpp
  decode_tps: 10.5
  note: measured, NUMA=1 config, MoE model
- model: Qwen3.5-397B-A17B
  quant: int4
  framework: llama.cpp
  decode_tps: 22.9
  estimated: true
  estimated_from: DeepSeek R1 671B (37B active -> 17B active, x2.18)
submitted_by: benchmark-team
date: '2026-03-28'
---

# Intel Xeon 6980P Server (12ch DDR5) — Benchmark Report

## Test Environment

- **OS**: Linux (details from source)
- **Framework**: llama.cpp (CPU backend)
- **Model source**: Hugging Face (GGUF)
- **NUMA config**: NUMA=1 (single-socket optimized)
- **Cooling**: Server-grade cooling
- **Power supply**: Server PSU

## Sources

- [llama.cpp Discussion #12088 — Intel Xeon 6980P benchmarks](https://github.com/ggml-org/llama.cpp/discussions/12088)

## Estimation Methodology

- **Qwen3.5-9B int4**: No estimation provided. The only available measured data is for DeepSeek R1 671B, which is a MoE model (671B total / ~37B active). MoE→Dense scaling is not reliable, and no 7-8B class Dense model data was found for this platform.

## Notes

- CPU-only inference using 12-channel DDR5-6400 providing ~614 GB/s aggregate bandwidth (up to 845 GB/s with MRDIMM-8800).
- Price is approximate: CPU street price ~$6,190 plus platform cost.
- 128 P-cores (Granite Rapids) with high memory bandwidth make this competitive for large model inference.
- DeepSeek R1 671B is a MoE model and cannot be used for Dense→Dense estimation to Qwen3.5-9B.
- 768GB memory capacity can accommodate very large models including 671B MoE at Q4.
