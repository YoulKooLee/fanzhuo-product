#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""调用 skills API 将 Markdown 导出为 Word（等价于 .claude/skills/common/export-word.sh）"""
from __future__ import annotations

import json
import re
import sys
from pathlib import Path

import requests


def load_api_base(project_root: Path) -> str:
    cfg = project_root / ".claude" / "skills" / "config.json"
    data = json.loads(cfg.read_text(encoding="utf-8"))
    return data["apiBaseUrl"].rstrip("/")


def collect_images(md_text: str, md_dir: Path) -> list[Path]:
    seen: list[Path] = []
    for m in re.finditer(r"!\[[^\]]*\]\(([^)]+)\)", md_text):
        p = m.group(1).strip()
        if p.startswith(("http://", "https://", "data:")):
            continue
        full = (md_dir / p).resolve()
        if full.is_file() and full not in seen:
            seen.append(full)
    return seen


def export_word(md_file: Path, template: str, api_base: str) -> Path:
    md_file = md_file.resolve()
    md_dir = md_file.parent
    md_text = md_file.read_text(encoding="utf-8")
    images = collect_images(md_text, md_dir)

    url = f"{api_base}/api/document/export/word-with-images"
    # 与 bash 脚本一致：文本字段名 content；多张图片字段名均为 files
    multipart: list[tuple] = [("template", (None, template))]
    # content 使用无扩展名的文件名，避免服务端误判为图片校验
    multipart.append(
        (
            "content",
            ("markdown-body.txt", md_file.read_bytes(), "text/markdown; charset=utf-8"),
        )
    )
    for img in images:
        try:
            rel_name = str(img.relative_to(md_dir)).replace("\\", "/")
        except ValueError:
            rel_name = img.name
        multipart.append(
            ("files", (rel_name, img.read_bytes(), "application/octet-stream"))
        )

    r = requests.post(url, files=multipart, timeout=120)
    r.raise_for_status()
    out = md_dir / (md_file.stem + ".docx")
    # 成功时为 docx 二进制；失败时可能返回 JSON
    ct = r.headers.get("Content-Type", "")
    if "application/json" in ct or r.content[:1] == b"{":
        try:
            err = r.json()
        except Exception:
            err = {"message": r.text[:500]}
        raise RuntimeError(err.get("message", err))

    out.write_bytes(r.content)
    return out


def main() -> None:
    if len(sys.argv) < 3:
        print(
            "用法: python export_word_api.py <markdown路径> <模板名>",
            file=sys.stderr,
        )
        print(
            "模板: req-doc | feasibility-report | default | formal | simple ...",
            file=sys.stderr,
        )
        sys.exit(1)
    md_path = Path(sys.argv[1])
    template = sys.argv[2]
    root = Path(__file__).resolve().parents[1]
    api_base = load_api_base(root)
    out = export_word(md_path, template, api_base)
    print(f"OK: {out} ({out.stat().st_size} bytes)")


if __name__ == "__main__":
    main()
