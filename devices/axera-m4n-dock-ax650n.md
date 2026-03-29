---
id: "axera-m4n-dock-ax650n"
name: "AXera M4N-Dock (AX650N)"
vendor: "AXera"
device_type: "Dev Board"
chip: "AX650N"

memory_capacity_gb: 8
memory_bandwidth_gbs: 29
memory_type: "LPDDR4"
memory_speed: "3733MT/s"
memory_bus_width: "64bit"

tops_int8: 14.4
tops_note: "NPU INT8"

price_usd: 299
power_watts: 8

interface: "Onboard"

benchmarks:
  - model: "Qwen3-VL-8B"
    quant: "w4a16"
    framework: "Pulsar2 NPU"
    decode_tps: 4.5
    image_encode_ms: 280
    note: "measured, source: HuggingFace AXERA-TECH"
  - model: "Qwen3.5-9B"
    quant: "w4a16"
    framework: "Pulsar2 NPU"
    decode_tps: 4.0
    estimated: true
    estimated_from: "Qwen3-VL-8B (8B -> 9B, x0.89, Dense->Dense)"

submitted_by: "axera"
date: "2026-03-29"
---

# AXera M4N-Dock (AX650N) — Benchmark Report

## Test Environment

- **Board**: M4N-Dock
- **SoC**: AX650N
- **NPU**: 14.4 INT8 TOPS
- **Memory**: 8GB LPDDR4, 64-bit, 3733MT/s, ~29 GB/s
- **Framework**: Pulsar2 v5.0 (AXera NPU SDK)
- **Quantization**: w4a16 (GPTQ-Int4 weights, FP16 activations)

## Sources

- [HuggingFace AXERA-TECH/Qwen3-VL-8B-Instruct-GPTQ-Int4](https://huggingface.co/AXERA-TECH/Qwen3-VL-8B-Instruct-GPTQ-Int4)

## Notes

- Qwen3-VL-8B is a vision-language model. Decode speed of 4.5 tps includes multimodal context.
- Image encode: 280 ms, TTFT: ~1066 ms (168 input tokens).
- At 6W power consumption, this is one of the most power-efficient LLM-capable edge devices.
- 8GB LPDDR4 at 29 GB/s bandwidth is the primary constraint for decode speed.
