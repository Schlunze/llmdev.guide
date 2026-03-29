# Contributing Guide

Thank you for contributing! Every real-world benchmark helps the community make better purchasing decisions.

## How to Submit

### 1. Fork & Clone

```bash
git clone https://github.com/sipeed/llmdev.guide.git
cd llmdev.guide
```

### 2. Create a Device File

```bash
cp devices/_template.md devices/your-device-name.md
```

Naming convention: `vendor-model.md`, lowercase with hyphens. Examples:
- `nvidia-jetson-orin-nano-8gb.md`
- `apple-mac-mini-m4-pro-48gb.md`
- `rockchip-rk3588-16gb.md`

### 3. Fill in the Data

Follow the YAML frontmatter format in the template.

**Required fields:**
- `id`: Unique identifier (same as filename without `.md`)
- `name`: Full product name
- `vendor`: Manufacturer
- `device_type`: Dev Board / PCIe Card / USB Accelerator / Mini PC / Server / Module
- `memory_capacity_gb`: Memory capacity in GB
- `memory_bandwidth_gbs`: Memory bandwidth in GB/s
- `price_usd`: Reference price in USD
- `power_watts`: Power consumption under load (W)
- `benchmarks`: At least one Qwen3.5 model benchmark
- `submitted_by`: Your GitHub username
- `date`: Submission date

**Per-benchmark required fields:**
- `model`: Model name (Qwen3.5-9B / Qwen3.5-27B etc.)
- `quant`: Quantization (int4 / fp4 / int8 / fp8 / bf16 / f32)
- `framework`: Inference framework (Ollama / llama.cpp / LM Studio / vendor SDK etc.)
- `decode_tps`: Output generation speed in tokens/s

**Per-benchmark optional fields:**
- `prefill_tps`: Prefill speed in tokens/s (if your tool reports it)
- `context_length`: Context length used during testing
- `image_encode_ms`: Image encoding time in ms (for vision models)

### 4. How to Benchmark

Choose the method that works best for you:

#### Easy: Chat & Screenshot

Just run the model in Ollama or LM Studio and note the tokens/s displayed:

```bash
ollama run qwen3.5:9b-q4_K_M
```

Ask a question that generates a long response. Most tools display the generation speed (tokens/s) at the bottom of the output or in the UI. Screenshot this for your evidence.

#### Standard: Ollama Verbose

```bash
ollama run qwen3.5:9b-q4_K_M --verbose
```

This shows both **prompt eval rate** (prefill) and **eval rate** (decode) after each response. Copy these numbers directly.

#### Advanced: llama-bench

```bash
# Qwen3.5-9B INT4
llama-bench -m qwen3.5-9b-q4_k_m.gguf -p 512 -n 128

# Qwen3.5-27B INT4 (if your device has enough memory)
llama-bench -m qwen3.5-27b-q4_k_m.gguf -p 512 -n 128
```

This gives precise prefill (pp) and decode (tg) speeds with multiple runs averaged.

#### Tips

- **Run the test a few times** and use a representative result (not the first cold run)
- **Ensure stable thermals**: let the device warm up, avoid thermal throttling
- **Test early in the conversation** (short context) for the most comparable results
- If you have a power meter, measure the actual system power draw under load

#### Power Measurement

A USB power meter or wall plug meter is ideal. If not available, use software readings (e.g., `tegrastats` on Jetson, `powermetrics` on Mac) and note the source.

### 5. Provide Evidence

In the markdown body, please include:

- **Test environment**: OS, framework version, model source
- **Screenshot or log output**: Proving the benchmark numbers are real
- **Device photo**: At least one photo of the actual device

Images can be uploaded via GitHub Issues and referenced by URL.

### 6. Submit PR

```bash
git add devices/your-device-name.md
git commit -m "Add benchmark: Device Name"
git push origin main
```

Then create a Pull Request on GitHub.

## Estimation from Other Models

If Qwen3.5 benchmarks are not yet available for your device, you may estimate from other models of **similar architecture and similar size**:

- **Dense → Dense only** (never cross Dense/MoE)
- **MoE → MoE only** (never cross Dense/MoE)
- **Use the closest size** — do not estimate across large size gaps
- **Formula**: `estimated_tps = measured_tps × (source_active_params / target_active_params)`
- Mark with `estimated: true` and `estimated_from: "description"` in the benchmark entry

Estimated values are displayed with an asterisk (*) on the website.

### Approved Estimation Sources

#### Dense → Dense

| Qwen3.5 Target | Active | Approved Source Models | Source Active | Factor |
|----------------|--------|-----------------------|---------------|--------|
| **9B** | 9B | Llama 3.1 8B, Qwen3 8B, Gemma 2 9B, DeepSeek-R1-Distill 8B | 8-9B | ×0.89 ~ ×1.00 |
| **27B** | 27B | Qwen3 32B, Qwen 2.5 32B, Gemma 2 27B | 27-32B | ×1.00 ~ ×1.19 |

#### MoE → MoE

| Qwen3.5 Target | Active | Approved Source Models | Source Active | Factor |
|----------------|--------|-----------------------|---------------|--------|
| **35B-A3B** | 3B | Qwen3 30B-A3B, GPT-OSS-20B (3.6B active) | 3-3.6B | ×1.00 ~ ×1.20 |
| **122B-A10B** | 10B | GPT-OSS-120B (5.1B active), Mixtral 8x7B (12.9B active) | 5.1-12.9B | ×0.51 ~ ×1.29 |
| **397B-A17B** | 17B | Qwen3 235B-A22B (22B active), DeepSeek R1 671B (37B active) | 17-37B | ×1.29 ~ ×2.18 |

## Validation

CI will automatically check:
- YAML frontmatter format
- Required fields are present
- Values are within reasonable ranges

Maintainers will manually review evidence for authenticity.

## FAQ

**Q: My device can't run Qwen3.5-27B, what do I do?**
A: No problem — submit whatever models your device can run. Not being able to run a model is itself valuable information.

**Q: Can I submit data from different frameworks on the same device?**
A: Yes, add multiple entries in `benchmarks` with different `framework` values.

**Q: I can only see one "tokens/s" number, not separate prefill/decode.**
A: That's fine — just fill in `decode_tps`. The `prefill_tps` field is optional. If you want both numbers, try `ollama run --verbose` or `llama-bench`.

**Q: Prices fluctuate a lot, what should I put?**
A: Use the price you paid, or the current mainstream channel price. Note it in the body text.

**Q: I'm not sure about the claimed TOPS figure.**
A: `tops_int8` is optional. If you fill it in, use `tops_note` to explain the methodology (e.g., "GPU only", "sparse", "GPU+DLA").
