# AI Agent Local LLM Inference Device Deployment Guide

## 1. Recommended Models for Local Agent Deployment

For local deployment testing with agent frameworks such as [OpenClaw](https://github.com/openclaw) / [PicoClaw](https://github.com/picoclaw), we recommend the following models by size:

| Model | Position | Min Memory (INT4) | Recommended Hardware |
|-------|----------|-------------------|---------------------|
| **Qwen3.5-9B** | Minimum viable | ~8 GB | High-performance CPU, entry-level GPU |
| **Qwen3.5-27B** | Daily driver | ~16 GB | 24GB+ VRAM GPU (RTX 4090/5090) |
| **Qwen3.5-35B-A3B** | Daily driver (MoE) | ~20 GB | 24GB+ VRAM GPU |
| **Qwen3.5-122B-A10B** | Advanced | ~70 GB | Mac Studio 128GB / 4x RTX 5090 / 2x A100 |
| **Qwen3.5-397B-A17B** | Flagship | ~220 GB | Mac Studio 256GB / 8x RTX 5090 / 3x A100 |

**Key takeaways**:

- **Qwen3.5-9B** is the minimum threshold for agent instruction following. High-performance CPUs (e.g., 8845HS, Snapdragon X Elite) can run it reasonably smoothly, but complex task capability is limited.
- **Qwen3.5-27B or 35B-A3B** offer the best price-performance for daily agent tasks. 27B is a dense model; 35B-A3B is a MoE architecture (only 3B active parameters) and actually runs faster.
- **Qwen3.5-122B-A10B** offers marginal improvement over 27B while doubling memory requirements — poor value.
- **Qwen3.5-397B-A17B** delivers the best results but requires 256GB+ memory — extremely expensive to deploy.
- Older open-source models like GPT-OSS-120B have been surpassed by Qwen3.5-35B-A3B and are not recommended.
- Community suggestions for other suitable models are welcome.

---

## 2. How to Evaluate Local Inference Device Specifications

### 2.1 TOPS (Compute Power) — The Least Useful Metric

Different vendors measure compute power with wildly different methodologies. Vendor B's 100 TOPS may actually be slower than Vendor A's 10 TOPS. **LLM inference is memory-bandwidth-bound, not compute-bound** (compute mainly affects prefill speed). Beginners should skip this metric entirely.

**Common "TOPS inflation" tactics:**

1. **Sparsity doubling**: Using sparse compute as the headline number, instantly ×2.
2. **Low-precision doubling**: Using FP4 compute as the headline number, another ×2.
   - Example: DGX Spark has 125 TOPS BF16 dense compute, but markets **1000 TOPS** (FP4 sparse). Yet its memory bandwidth is only 273 GB/s — the same as a Mac Mini.
3. **Adding heterogeneous compute**: Summing CPU + DSP + NPU compute directly.
   - E.g., CPU 1T + DSP 4T + NPU 15T = claimed 20 TOPS. In practice, only the NPU handles inference workloads.
4. **Adding multi-chip board-level compute**: On-SoC NPU 30T + discrete NPU accelerator 80T = claimed 110 TOPS.
   - Heterogeneous or clustered compute suffers massive efficiency losses.
   - Reference: [Jeff's Mac Studio RDMA cluster test](https://www.youtube.com/watch?v=x4_RsUxRjKU&t=566s) (Thunderbolt 5, 10 GB/s interconnect):
     - 1 node: 20 tps → 2 nodes: 26 tps (only 130%) → 4 nodes: 32 tps (only 160%)
   - This is with 10 GB/s Thunderbolt 5. With PCIe 4 at under 8 GB/s, efficiency is even worse.

### 2.2 Memory Capacity — Be Cautious

Memory capacity determines the maximum model size you can run:

- **Minimum**: Quantized model file size + ~4 GB (OS + KV cache).
- CPU inference via llama.cpp supports quantizations as low as Q2, but **Q4 or above is recommended** (model size ≈ half the parameter count).
- GPUs generally support FP16/BF16 and INT4; RTX 4090+ supports FP8; RTX 5090+ supports FP4.
- For NPUs, always check supported data formats. Typically INT8; FP4 support roughly doubles inference speed (halved data transfer).

**Misleading marketing to watch for:**

- **Adding memory across different chips**: e.g., main SoC 32 GB + accelerator chip 24 GB = claimed 56 GB. In reality, the two chips are connected via PCIe 4 (under 8 GB/s). Once the model exceeds the single-chip capacity, inference speed drops catastrophically.

### 2.3 Memory Bandwidth — The Most Important Metric!

**For local LLM inference, memory bandwidth is the single most important factor!**

You can estimate the theoretical maximum decode speed with:

```
Theoretical TPS = Memory Bandwidth (GB/s) × 0.9 / Model Weight Size (GB)
```

**Case study — DGX Spark's compute-bandwidth mismatch:**

- FP4 compute: 512 TOPS, but memory bandwidth: only 273 GB/s.
- Running INT4 Llama 3.1 8B: theoretical max = 273 × 0.9 ÷ (8÷2) = **61.4 tps**, measured: only **38 tps**.
- As a rule of thumb, memory bandwidth (GB/s) should be 1~2× the FP4 compute (TOPS). Spark's bandwidth would need to be 2~4× higher to match its claimed compute.

### 2.4 Measured Output TPS — The Most Trustworthy Metric!

Even with bandwidth estimates, **different chips with the same bandwidth can differ by 3~4× in actual inference speed** due to architectural differences. Measured TPS is the only reliable reference.

**Pitfalls in measured TPS:**

1. **KV cache growth slows output**: Decode speed decreases as KV cache grows. When KV cache size equals the model weight size, output speed drops by roughly half.
2. **Cliff effect on heterogeneous devices**: When KV cache exceeds a single chip's memory, inference speed drops catastrophically.
3. **Watch for speed degradation at long context lengths**.

**Qwen3.5 half-speed context length reference (FP16 KV cache):**

| Model | KV/token | INT4 Weight | Half-speed Context | Memory Cost |
|-------|----------|-------------|-------------------|-------------|
| 9B | 16 KB | 4.5 GB | ~138K | 4.5 + 4.5 = 9.0 GB |
| 27B | 32 KB | 13.5 GB | ~206K | 13.5 + 13.5 = 27.0 GB |
| 35B-A3B | 10 KB | 1.5 GB (active) | ~73K | 17.5 + 1.5 = 19.0 GB |

### 2.5 Prefill Speed — Often Overlooked

Prefill speed determines the time-to-first-token (TTFT). Slow prefill means you may wait over 1 minute before seeing the first output token.

- Heterogeneous devices are especially prone to this issue.
- Prefill speed is mainly related to context length and compute power.

### 2.6 Other Considerations

Community contributions of additional purchasing and deployment tips are welcome.

---

## 3. Device Recommendations by Budget

We recommend both **fastest inference** and **low-power** devices (under 75W — the PCIe single-connector power limit) at each price tier:

### Under $500

> Limited by memory capacity — can basically only run 9B models.

| Category | Recommended | Highlights |
|----------|-------------|------------|
| Fastest | Intel Arc B580 12GB | Good for 9B accelerated inference |
| Low-power | AMD Ryzen 7 8845HS Mini PC | CPU inference, low power |

### $500 – $1,000

> Typically 16GB+ memory, can start running 20~30B models.

| Category | Recommended | Highlights |
|----------|-------------|------------|
| Fastest | AMD Radeon RX 7900 XT | Up to 800 GB/s bandwidth |
| Low-power | Mac Mini M4 (16~32GB) | 120 GB/s bandwidth, ultra-low power |

### $1,000 – $2,000

> Typically 24GB+ memory, can smoothly run 20~35B models.

| Category | Recommended | Highlights |
|----------|-------------|------------|
| Fastest | AMD Radeon RX 7900 XTX | Up to 960 GB/s bandwidth |
| Low-power | Mac Mini M4 Pro (24~64GB) | 273 GB/s bandwidth |

### $2,000 – $4,000

> Enthusiast territory with top-tier consumer GPUs, 32GB+ memory.

| Category | Recommended | Highlights |
|----------|-------------|------------|
| Fastest | NVIDIA RTX 5090 | Up to 1,800 GB/s bandwidth |
| Low-power | Mac Studio M4 Max (64~128GB) | 410 GB/s bandwidth |

### $4,000+

> Beyond most individual developers' budgets. 48GB+ VRAM, up to 256GB memory — can attempt 122B or even 397B models.

Community suggestions for sweet-spot devices at each tier are welcome.

---

## 4. Devices to Avoid

For products with mismatched specs or misleading marketing, community reports help everyone make informed decisions:

| Device | Issue |
|--------|-------|
| **NVIDIA DGX Spark** | Memory bandwidth (273 GB/s) severely mismatched with claimed compute (1000 TOPS FP4 sparse); overpriced ($4,699) |

Community contributions of additional cautionary cases are welcome.
