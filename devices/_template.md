---
# ============================================================
# LLM Local Inference Device Benchmark - Data Template
# Copy this file and rename to: vendor-model.md (lowercase, hyphens)
# Example: nvidia-jetson-orin-nano-8gb.md
# ============================================================

# Basic info (required)
id: "your-device-id"                    # Unique ID, same as filename without .md
name: "Full Device Name"                # e.g. "NVIDIA Jetson Orin Nano 8GB"
vendor: "Vendor"                        # e.g. "NVIDIA"
device_type: "Dev Board"                # Dev Board / GPU / Accelerator / Mini PC / Server

# Chip info (optional)
chip: ""                                # Main chip model

# Memory (required)
memory_capacity_gb:                     # Memory capacity in GB
memory_bandwidth_gbs:                   # Memory bandwidth in GB/s

# Memory details (optional)
memory_type: ""                         # LPDDR4 / LPDDR5 / LPDDR5X / HBM3 etc.
memory_speed: ""                        # e.g. 8533MT/s
memory_bus_width: ""                    # e.g. 256bit

# Claimed compute (optional — due to huge variance in vendor methodologies)
tops_int8:                              # Claimed TOPS
tops_note: ""                           # Methodology: "GPU only" / "sparse" / "GPU+DLA" etc.

# Price & power (required)
price_usd:                              # Reference price in USD
power_watts:                            # Power consumption under load, in W

# Interface (optional)
interface: ""                           # PCIe x16 / USB-C / M.2 / Onboard etc.

# ============================================================
# LLM Benchmark Data (required — at least one Qwen3.5 model)
# ============================================================
benchmarks:
  - model: "Qwen3.5-9B"                # Model name
    quant: "int4"                       # Quantization: int4 / fp4 / int8 / fp8 / bf16 / f32
    framework: "ollama"                 # Tool: ollama / llama.cpp / LM Studio / vendor SDK etc.
    decode_tps:                         # Output speed in tokens/s (required)
    prefill_tps:                        # Prefill speed in tokens/s (optional)
    context_length:                     # Context length used (optional)
    image_encode_ms:                    # Image encode time in ms (optional, vision models only)

#  - model: "Qwen3.5-27B"
#    quant: "int4"
#    framework: "ollama"
#    decode_tps:

#  - model: "Qwen3.5-35B-A3B"          # Optional
#  - model: "Qwen3.5-122B-A10B"        # Optional
#  - model: "Qwen3.5-397B-A17B"        # Optional

# Submission info (required)
submitted_by: "your_github_username"
date: "2026-01-01"
---

# Device Name — Benchmark Report

## Test Environment

- **OS**:
- **Framework**: (name + version)
- **Model source**: (e.g. Hugging Face / Ollama library)
- **Cooling**: (stock / aftermarket / ambient temp)
- **Power supply**:

## Results

(Additional details, multi-run results, different settings, etc.)

## Evidence

Place screenshots in `devices/assets/<device-id>/` directory.
For example, if your device id is `nvidia-rtx-4090-24gb`, put images in:
`devices/assets/nvidia-rtx-4090-24gb/`

Then reference them in this file with relative paths:

![Qwen3.5-9B benchmark](assets/<device-id>/screenshot_9b.jpg)

Accepted formats: `.jpg`, `.png`, `.webp`

## Device Photo

(Optional: photo of the actual device, placed in the same evidence directory)

![Device](assets/<device-id>/device_photo.jpg)

## Notes

(Any additional information, known issues, special configurations, etc.)
