#!/usr/bin/env python3
"""
Batch-fill estimated Qwen3.5 benchmarks from existing source model data.
Only adds estimates where: source data exists, target doesn't exist yet, and device has enough memory.

Rules:
  Dense→Dense only, MoE→MoE only.
  Use closest size source model.
"""

import yaml
import sys
from pathlib import Path

DEVICES_DIR = Path(__file__).parent.parent / "devices"

# ============================================================
# Estimation rules: (target_model, target_active, min_memory_gb, sources)
# sources: list of (source_model_pattern, source_active, is_moe)
# ============================================================

DENSE_TARGETS = [
    {
        "model": "Qwen3.5-9B",
        "active": 9,
        "min_mem": 6,  # ~5GB at int4
        "sources": [
            ("Gemma 2 9B", 9),
            ("Gemma2 9B", 9),
            ("Qwen3 8B", 8),
            ("Llama 3.1 8B", 8),
            ("Llama 8B", 8),
            ("Llama2-7B", 7),
            ("Llama 7B", 7),
            ("Llama 2 7B", 7),
            ("Qwen2 7B", 7),
            ("Qwen2.5 7B", 7),
            ("DeepSeek-R1-Distill 8B", 8),
            ("DeepSeek-R1-Distill-Qwen-7B", 7),
            ("DeepSeek-R1-Distill 7B", 7),
        ],
    },
    {
        "model": "Qwen3.5-27B",
        "active": 27,
        "min_mem": 16,  # ~14GB at int4
        "sources": [
            ("Gemma 2 27B", 27),
            ("Qwen3 32B", 32),
            ("Qwen 2.5 32B", 32),
            ("Qwen2.5 32B", 32),
            ("Qwen 32B", 32),
            ("DeepSeek-R1-Distill 32B", 32),
            ("DeepSeek-R1-Distill-Qwen-32B", 32),
        ],
    },
]

MOE_TARGETS = [
    {
        "model": "Qwen3.5-35B-A3B",
        "active": 3,
        "min_mem": 18,  # ~18GB at int4 (35B total params)
        "sources": [
            ("Qwen3 30B-A3B", 3),
            ("Qwen3-30B-A3B", 3),
            ("GPT-OSS-20B", 3.6),
        ],
    },
    {
        "model": "Qwen3.5-122B-A10B",
        "active": 10,
        "min_mem": 62,  # ~61GB at int4
        "sources": [
            ("GPT-OSS-120B", 5.1),
            ("Mixtral 8x7B", 12.9),
        ],
    },
    {
        "model": "Qwen3.5-397B-A17B",
        "active": 17,
        "min_mem": 200,  # ~200GB at int4
        "sources": [
            ("Qwen3 235B-A22B", 22),
            ("DeepSeek R1 671B", 37),
            ("DeepSeek-R1 671B", 37),
        ],
    },
]


def parse_frontmatter(filepath):
    text = filepath.read_text(encoding="utf-8")
    if not text.startswith("---"):
        return None, None
    parts = text.split("---", 2)
    if len(parts) < 3:
        return None, None
    data = yaml.safe_load(parts[1])
    body = parts[2]
    return data, body


def write_device(filepath, data, body):
    yaml_str = yaml.dump(data, allow_unicode=True, default_flow_style=False, sort_keys=False, width=200)
    filepath.write_text(f"---\n{yaml_str}---{body}", encoding="utf-8")


def find_source_bench(benchmarks, sources):
    """Find best matching source benchmark. Prefer first match (closest size)."""
    for src_name, src_active in sources:
        for b in benchmarks:
            if b.get("model") == src_name and b.get("decode_tps") and not b.get("estimated"):
                # Only use 4bit+ quantization
                quant = b.get("quant", "").lower()
                if any(bad in quant for bad in ["2bit", "1bit", "1.58"]):
                    continue
                return b, src_active
    return None, None


def add_estimate(benchmarks, target_model, target_active, source_bench, source_active):
    factor = source_active / target_active
    decode = round(source_bench["decode_tps"] * factor, 1)
    prefill = None
    if source_bench.get("prefill_tps"):
        prefill = round(source_bench["prefill_tps"] * factor, 1)

    entry = {
        "model": target_model,
        "quant": "int4",
        "framework": source_bench.get("framework", "unknown"),
        "decode_tps": decode,
        "estimated": True,
        "estimated_from": f"{source_bench['model']} ({source_active}B active -> {target_active}B active, x{factor:.2f})",
    }
    if prefill:
        entry["prefill_tps"] = prefill

    benchmarks.append(entry)
    return decode


def process():
    md_files = sorted(DEVICES_DIR.glob("*.md"))
    md_files = [f for f in md_files if f.name != "_template.md"]

    total_added = 0

    for filepath in md_files:
        data, body = parse_frontmatter(filepath)
        if data is None or not data.get("benchmarks"):
            continue

        mem = data.get("memory_capacity_gb", 0) or 0
        benchmarks = data["benchmarks"]
        existing_models = {b["model"] for b in benchmarks}
        added = []

        # Process Dense targets
        for target in DENSE_TARGETS:
            if target["model"] in existing_models:
                continue
            if mem < target["min_mem"]:
                continue
            src, src_active = find_source_bench(benchmarks, target["sources"])
            if src:
                tps = add_estimate(benchmarks, target["model"], target["active"], src, src_active)
                added.append(f"{target['model']}={tps}")

        # Process MoE targets
        for target in MOE_TARGETS:
            if target["model"] in existing_models:
                continue
            if mem < target["min_mem"]:
                continue
            src, src_active = find_source_bench(benchmarks, target["sources"])
            if src:
                tps = add_estimate(benchmarks, target["model"], target["active"], src, src_active)
                added.append(f"{target['model']}={tps}")

        if added:
            data["benchmarks"] = benchmarks
            write_device(filepath, data, body)
            print(f"{filepath.name}: +{len(added)} estimates ({', '.join(added)})")
            total_added += len(added)

    print(f"\nTotal: {total_added} estimates added")


if __name__ == "__main__":
    process()
