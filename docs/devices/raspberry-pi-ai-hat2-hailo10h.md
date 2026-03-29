---
id: raspberry-pi-ai-hat2-hailo10h
name: Raspberry Pi AI HAT+ 2 (Hailo-10H)
vendor: Raspberry Pi / Hailo
device_type: "Accelerator"
chip: Hailo-10H (40 TOPS INT4) + BCM2712 host
memory_capacity_gb: 8
memory_bandwidth_gbs: 34
memory_type: LPDDR4X
memory_note: 8GB shared with RPi 5 host. Hailo-10H has 8GB on-board LPDDR4.
tops_int8: 20
tops_note: 20 TOPS INT8 / 40 TOPS INT4, Hailo-10H NPU
price_usd: 210
power_watts: 15
interface: M.2 HAT+ on Raspberry Pi 5
benchmarks:
- model: Qwen2-1.5B
  quant: W4A8
  framework: Hailo SDK (QuaROT+GPTQ)
  decode_tps: 9.45
- model: Llama2-7B
  quant: W4A8
  framework: Hailo SDK
  decode_tps: 10.0
  note: Hailo official claim, not independently verified
- model: Qwen3.5-9B
  quant: int4
  framework: Hailo SDK
  decode_tps: 7.8
  estimated: true
  estimated_from: Llama2-7B (7B active -> 9B active, x0.78)
submitted_by: community
date: '2026-03-28'
---

# Raspberry Pi AI HAT+ 2 (Hailo-10H) Benchmark Report

## Architecture

The Raspberry Pi AI HAT+ 2 combines a Hailo-10H NPU (40 INT4 TOPS) with the Raspberry Pi 5 host via M.2 HAT+ interface. The NPU handles model inference while the host CPU manages tokenization and I/O.

- **Host**: Raspberry Pi 5 (BCM2712, 4x Cortex-A76 @ 2.4 GHz)
- **NPU**: Hailo-10H, 8GB on-board LPDDR4
- **Interface**: PCIe Gen3 x1 via M.2 HAT+
- **Total price**: RPi 5 8GB (~$80) + AI HAT+ 2 (~$130) = ~$210

## Test Environment

- **OS**: Raspberry Pi OS (Debian 12)
- **Framework**: Hailo SDK with W4A8 quantization (QuaROT + GPTQ pipeline)
- **Quantization**: W4A8 (4-bit weights, 8-bit activations)

## Important Note

CNX Software independent testing found that the RPi 5 CPU alone achieved 9.04 t/s on DeepSeek-R1-1.5B, comparable to the Hailo-10H's ~6.7 t/s on the same model. This suggests the NPU's advantage is limited for LLM workloads at this scale, primarily due to shared LPDDR4X memory bandwidth (~34 GB/s) being the common bottleneck for both CPU and NPU paths.

The Hailo-10H's primary strength is in computer vision tasks, not LLM inference.

## Sources

- [Hailo Blog: LLM on Hailo-10H](https://hailo.ai/blog/bringing-generative-ai-to-the-edge-llm-on-hailo-10h/)
- [CNX Software: RPi AI HAT+ 2 Review](https://www.cnx-software.com/2026/01/20/raspberry-pi-ai-hat-2-review-a-40-tops-ai-accelerator-tested-with-computer-vision-llm-and-vlm-workloads/)

## Notes

- Only supports models up to ~7B parameters with W4A8 quantization
- Cannot run Qwen3.5-9B (insufficient on-board memory for 9B model at W4A8)
- The HAT+ is more suited for vision/CV workloads where it significantly outperforms the CPU
