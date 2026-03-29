---
id: "houmo-lq50-48gb"
name: "HOUMO LQ50 M.2 (M50) 48GB"
vendor: "HOUMO"
device_type: "Accelerator"
chip: "漫界 M50 (CIM Architecture)"

memory_capacity_gb: 48
memory_bandwidth_gbs: 153.6
memory_type: "LPDDR5"
memory_speed: "6400MT/s"
memory_bus_width: "192bit"

tops_int8: 160
tops_note: "INT8 dense, CIM (Compute-in-Memory)"

price_usd: 1200
power_watts: 12

interface: "M.2 2280"

benchmarks:
  - model: "8B Dense"
    quant: "int4"
    framework: "HOUMO SDK"
    decode_tps: 25.0
    note: "measured, official claim WAIC 2025"
  - model: "Qwen3-30B-A3B"
    quant: "int4"
    framework: "HOUMO SDK"
    decode_tps: 25.0
    note: "measured, official communication"
  - model: "Qwen3.5-9B"
    quant: "int4"
    framework: "HOUMO SDK"
    decode_tps: 22.2
    estimated: true
    estimated_from: "8B Dense 25 tps (8B -> 9B, x0.89, Dense->Dense)"
  - model: "Qwen3.5-27B"
    quant: "int4"
    framework: "HOUMO SDK"
    decode_tps: 7.4
    estimated: true
    estimated_from: "8B Dense 25 tps (8B -> 27B, x0.296, Dense->Dense, bandwidth model)"
  - model: "Qwen3.5-35B-A3B"
    quant: "int4"
    framework: "HOUMO SDK"
    decode_tps: 25.0
    estimated: true
    estimated_from: "Qwen3-30B-A3B 25 tps (3B -> 3B active, x1.00, MoE->MoE)"

submitted_by: "community"
date: "2026-03-29"
---

# HOUMO LQ50 M.2 (M50) 48GB — Benchmark Report

## Test Environment

- **Chip**: HOUMO 漫界 M50 (CIM / Compute-in-Memory architecture)
- **Memory**: 48GB LPDDR5, 192-bit, 6400MT/s, 153.6 GB/s
- **Compute**: 160 TOPS INT8
- **Form factor**: M.2 2280, passive cooling
- **Power**: ~12W

## Sources

- [HOUMO Official — WAIC 2025 M50 Launch](https://www.houmoai.com/1/40/NewsDetails.html)
- Official communication (Qwen3-30B-A3B int4 speed)

## Notes

- The M50 uses Compute-in-Memory (CIM / 存算一体) architecture, which integrates compute directly within the memory array.
- 48GB LPDDR5 can run up to 27B dense models at INT4. MoE models like 35B-A3B (17.5GB total weights) fit comfortably.
- At 12W power consumption, this is one of the most power-efficient LLM accelerators available.
- M.2 2280 form factor allows easy integration into mini PCs, laptops, and edge devices.
- HOUMO also offers LQ50 Duo (2x M50, 320 TOPS) for 14B/32B models, and LM5070 (4x M50, 640 TOPS) for larger deployments.
