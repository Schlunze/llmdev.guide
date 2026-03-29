---
id: "rockchip-rk3588-16gb"
name: "Rockchip RK3588 开发板 16GB"
vendor: "Rockchip"
device_type: "Dev Board"
chip: "RK3588"

memory_capacity_gb: 16
memory_bandwidth_gbs: 34
memory_type: "LPDDR4X"
memory_speed: "4266MT/s"
memory_bus_width: "64bit"

tops_int8: 6
tops_note: "NPU only, 3个NPU核心合计"

price_usd: 120
power_watts: 15

interface: "板载"

benchmarks:
  - model: "Qwen3.5-9B"
    quant: "int4"
    framework: "llama.cpp"
    decode_tps: 2.5
    prefill_tps: 12.0

submitted_by: "example"
date: "2026-03-25"
---

# Rockchip RK3588 开发板 16GB 测试报告

> 注意：本文件为示例数据，仅供演示格式。实际数据请以社区提交为准。

## 测试环境

- **OS**：Ubuntu 22.04 (ARM64)
- **推理框架**：llama.cpp (CPU only, 未使用 NPU)
- **模型来源**：Hugging Face
- **散热条件**：被动散热片
- **供电方式**：USB-C 5V/4A

## 备注

RK3588 的 NPU 目前对主流 LLM 推理框架支持有限，主要依赖 CPU 推理。内存带宽是主要瓶颈。
