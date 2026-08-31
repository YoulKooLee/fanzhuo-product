# Word export tools

Cross-platform helpers for exporting Markdown to `.docx` via `.agents/skills/config.json` (`apiBaseUrl`).

## Windows (PowerShell, Python 3)

```powershell
.agents/skills/common/export-word.ps1 docs/spec.md req-doc
```

## Git Bash / Linux / macOS

```bash
bash .agents/skills/common/export-word.sh docs/spec.md req-doc
```

## Cross-platform (Python 3)

```bash
python .agents/skills/common/export-word.py docs/spec.md req-doc
```

## Templates

| Template | Use case |
| --- | --- |
| `req-doc` | Requirements specification |
| `test-cases` | Test cases |
| `operation-manual` | Operation manual |
| `feasibility-report` | Feasibility report |
| `feature-list` | Feature list |
| `default` | Default |
| `formal` | Formal |
| `simple` | Simple |

Output file: same directory as the Markdown file, same basename with `.docx`.
