#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""使用本机 Pandoc 将 Markdown 转为 DOCX（含 SRS 中 ../images 引用）。远程 export-word API 异常时可代替使用。"""
from __future__ import annotations

import subprocess
import sys
from pathlib import Path


def export_one(md_path: Path, extra_resource_dirs: list[Path]) -> Path:
    md_path = md_path.resolve()
    out_path = md_path.with_suffix(".docx")
    doc_parent = md_path.parent
    paths = [doc_parent] + [p.resolve() for p in extra_resource_dirs]
    resource_path = ";".join(str(p) for p in paths)
    cmd = [
        "pandoc",
        str(md_path),
        "-o",
        str(out_path),
        "--from",
        "markdown+yaml_metadata_block",
        "--toc",
        "--resource-path",
        resource_path,
    ]
    subprocess.run(cmd, check=True)
    return out_path


def main() -> None:
    root = Path(__file__).resolve().parents[1]
    planning = root / "docs" / "01-需求与规划"
    images = root / "docs" / "images"
    defaults = [
        planning / "2026-05-07-物流企业-物流配送后台管理系统-SRS需求规格说明书-V1.0.md",
        planning / "2026-05-07-物流配送后台管理系统-可行性研究报告-V1.0.md",
        planning / "2026-05-07-物流企业-物流配送后台管理系统-设计方案-v1.0.md",
    ]
    extra_images = images if images.is_dir() else None
    targets = [Path(a) for a in sys.argv[1:]] if len(sys.argv) > 1 else defaults
    for md in targets:
        if not md.is_file():
            print(f"跳过（不存在）: {md}", file=sys.stderr)
            continue
        need_images = md.name.startswith("2026") and "SRS" in md.name
        extras = [images] if need_images and extra_images else []
        out = export_one(md, extras)
        print(out)


if __name__ == "__main__":
    main()
