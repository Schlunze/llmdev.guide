---
id: "orange-pi-aipro-ascend310b-16gb"
name: "Orange Pi AI Pro (Ascend 310B) 16GB"
vendor: "Orange Pi / Huawei"
device_type: "Dev Board"
chip: "Ascend 310B4"

memory_capacity_gb: 16
memory_bandwidth_gbs: 25.6
memory_type: "LPDDR4X"
memory_speed: "3200MT/s"
memory_bus_width: "64bit"

tops_int8: 8
tops_note: "Ascend 310B4 AI Core, 另有 20T 版本"

price_usd: 150
power_watts: 10

interface: "板载"

benchmarks:
  - model: "Qwen3.5-9B"
    quant: "int4"
    framework: "MindSpore Lite"
    decode_tps: 7.5
    prefill_tps: 35.0

submitted_by: "example"
date: "2026-03-25"
---

# Orange Pi AI Pro (Ascend 310B) 16GB 测试报告

> 注意：本文件为示例数据，仅供演示格式。实际数据请以社区提交为准。

## 测试环境

- **OS**：openEuler 22.03
- **推理框架**：MindSpore Lite
- **模型来源**：ModelScope
- **散热条件**：被动散热片
- **供电方式**：USB-C PD

## 备注

Ascend 310B 的生态支持相对有限，目前主要通过华为 MindSpore 框架进行推理。llama.cpp 暂不支持此芯片。
