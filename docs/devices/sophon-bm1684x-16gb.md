---
id: "sophon-bm1684x-16gb"
name: "Sophon BM1684X AI Box 16GB"
vendor: "Sophgo"
device_type: "Accelerator"
chip: "Sophon BM1684X"

memory_capacity_gb: 16
memory_bandwidth_gbs: 75
memory_type: "DDR4"

price_usd: 400
power_watts: 33

tops_int8: 32
tops_note: "BM1684X INT8 TOPS"

interface: "Onboard"

benchmarks:
  - model: "DeepSeek-R1-Distill 7B"
    quant: "INT4"
    framework: "LLM-TPU"
    decode_tps: 11.0
    note: "measured"
  - model: "Qwen3.5-9B"
    quant: "int4"
    framework: "LLM-TPU"
    decode_tps: 8.6
    estimated: true
    estimated_from: "DS-R1-Distill 7B (7B -> 9B, x0.78, Dense->Dense)"

submitted_by: "benchmark-team"
date: "2026-03-28"
---

# Sophon BM1684X AI Box 16GB — Benchmark Report

## Test Environment

- **OS**: Linux (Sophon SDK)
- **Framework**: LLM-TPU (Sophgo's LLM inference framework)
- **Model source**: Sophgo model zoo
- **Cooling**: Passive / fan-cooled AI box
- **Power**: 33W TDP

## Sources

- [Sophgo LLM-TPU GitHub repository](https://github.com/sophgo/LLM-TPU)

## Estimation Methodology

- **Qwen3.5-9B int4**: Estimated from DeepSeek-R1-Distill 7B INT4 measured decode (11.0 tps) using Dense→Dense scaling. Factor = 7/9 ≈ 0.778. Result: 11.0 × 7/9 ≈ 8.6 tps.

## Notes

- BM1684X is an edge AI accelerator with 32 INT8 TOPS.
- Memory bandwidth is approximate (~75 GB/s) based on DDR4 interface.
- 16GB memory limits the maximum model size that can be loaded.
- LLM-TPU is Sophgo's proprietary LLM inference framework optimized for their TPU architecture.
- Price ($400) is for the AI Box product, not just the chip.
- Low power consumption (33W) makes it suitable for edge deployment scenarios.
