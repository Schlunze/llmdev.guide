---
id: "tiiny-ai-pocket-lab"
name: "Tiiny AI Pocket Lab"
vendor: "Tiiny AI"
device_type: "Accelerator"
chip: "CIX P1 (CD8180) + HOUMO LQ50 (M50)"

memory_capacity_gb: 80
memory_bandwidth_gbs: 153.6
memory_type: "LPDDR5X"
memory_speed: "6400MT/s"
memory_bus_width: "128bit"
memory_note: "Two separate memory pools: 32GB on SoC side (102 GB/s) + 48GB on dNPU side (154 GB/s), interconnected via PCIe Gen4 x4 (~7 GB/s)"

tops_int8: 190
tops_note: "SoC NPU 30T + dNPU 160T combined, heterogeneous compute units"

price_usd: 1599
power_watts: 65

interface: "Onboard"

benchmarks:
  # === Measured data (source: bay41.com analysis) ===
  - model: "GPT-OSS-120B"
    quant: "int4"
    framework: "PowerInfer"
    decode_tps: 16.85
    prefill_tps: 104.7
    note: "measured, MoE 5.1B active, cross-pool, short context"
  - model: "GPT-OSS-20B"
    quant: "int4"
    framework: "PowerInfer"
    decode_tps: 29.0
    prefill_tps: 718.6
    note: "measured, MoE 3.6B active, single SoC pool, source: bay41.com"
  - model: "Qwen3-30B-A3B"
    quant: "int4"
    framework: "PowerInfer"
    decode_tps: 28.0
    note: "measured, MoE 3B active, source: Kickstarter official page"
  - model: "Qwen3.5-9B"
    quant: "int4"
    framework: "HOUMO SDK"
    decode_tps: 22.2
    estimated: true
    estimated_from: "HOUMO LQ50 8B Dense 25 tps (8B -> 9B, x0.89, Dense->Dense, same dNPU chip)"
  - model: "Qwen3.5-35B-A3B"
    quant: "int4"
    framework: "PowerInfer"
    decode_tps: 28.0
    estimated: true
    estimated_from: "Qwen3-30B-A3B (3B -> 3B active, x1.00, MoE->MoE)"
  - model: "Qwen3.5-122B-A10B"
    quant: "int4"
    framework: "PowerInfer"
    decode_tps: 8.6
    estimated: true
    estimated_from: "GPT-OSS-120B (5.1B -> 10B active, x0.51, MoE->MoE, cross-pool)"

submitted_by: "bay41"
date: "2026-03-25"
---

# Tiiny AI Pocket Lab Benchmark Report

> Data sources: [bay41.com reverse engineering analysis](https://bay41.com/posts/tiiny-ai-pocket-lab-review/), [Kickstarter official page](https://www.kickstarter.com/projects/tiinyai/tiiny-ai-pocket-lab)
> Device status: Kickstarter campaign, estimated shipping August 2026. Data obtained from official demo unit.

## Architecture

The Tiiny Pocket Lab consists of two independent compute + memory subsystems:

- **SoC**: CIX P1 (CD8180), 12-core Armv9.2 CPU, built-in NPU 30 TOPS, 32GB LPDDR5X @ 102 GB/s
- **dNPU**: [HOUMO LQ50 M.2 module](https://www.houmoai.com/48/6/Product.html) (M50 chip), 160 INT8 TOPS, 48GB LPDDR5 @ 154 GB/s
- **Interconnect**: PCIe Gen4 x4, theoretical ~8 GB/s, measured ~7 GB/s

```
┌──────────────────────┐     PCIe Gen4 x4      ┌───────────────────────┐
│   CIX P1 (CD8180)    │◄────── ~7 GB/s ──────►│   HOUMO LQ50           │
│   12-core Armv9.2    │                        │   (M50 chip)          │
│   NPU: 30 TOPS       │                        │   NPU: 160 TOPS       │
│   32GB LPDDR5X       │                        │   48GB LPDDR5          │
│   BW: 102 GB/s       │                        │   BW: 154 GB/s        │
└──────────────────────┘                        └───────────────────────┘
```

## Specs Clarification

The marketed specs aggregate numbers across the two subsystems. For transparency, here is what the individual components contribute:

| Marketed Spec | Breakdown |
|--------------|-----------|
| 80 GB memory | 32 GB (SoC) + 48 GB (dNPU), two separate pools |
| ~250 GB/s bandwidth | 102 GB/s (SoC) + 154 GB/s (dNPU), not additive for a single workload; cross-pool bottleneck is ~7 GB/s via PCIe |
| 190 INT8 TOPS | 30 TOPS (SoC NPU) + 160 TOPS (dNPU), heterogeneous units |

Note: When a model fits entirely within one memory pool, only that pool's bandwidth is available. When a model spans both pools, the PCIe interconnect (~7 GB/s) becomes the bottleneck for cross-pool data transfer.

## Single-Pool vs Cross-Pool Performance (64K context)

| Metric | GPT-OSS-20B (single pool) | GPT-OSS-120B (cross-pool) | Ratio |
|--------|--------------------------|--------------------------|-------|
| Prefill tps | 362.1 | 10.6 | 34x |
| Decode tps | 10.69 | 4.47 | 2.4x |
| Total time | 53s | 28 min | 32x |

The single-pool scenario (GPT-OSS-20B within the 32GB SoC memory) achieves ~52% bandwidth utilization (29 tps vs theoretical ceiling of ~56 tps), which is a reasonable result for the CIX P1 SoC.

## Evidence

- [bay41.com](https://bay41.com/posts/tiiny-ai-pocket-lab-review/) — GPT-OSS-120B/20B data from official demo reverse engineering
- [Kickstarter](https://www.kickstarter.com/projects/tiinyai/tiiny-ai-pocket-lab) — Qwen3-30B-A3B 28 tps, GPT-OSS-20B 28 tps official claims

## Notes

- Device not yet shipped to end users; no independent user benchmarks available
- The inference engine is PowerInfer, a fork of [the open-source project](https://github.com/SJTU-IPADS/PowerInfer) originally developed at Shanghai Jiao Tong University
- For models that fit within the 32GB SoC memory pool, performance is consistent with the 102 GB/s bandwidth specification
