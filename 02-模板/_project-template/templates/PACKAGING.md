# Vibepm Dev Agent  · 最小交付清单

本文说明**不含前端脚手架（无 admin/）**时的 vibepm-dev-agent 交付内容。用户自行创建 Vue / React 等前端项目后，将 vibepm-dev-agent 接入即可使用 AI 工作流。

## 交付目录结构

```
vibepm-dev-agent/
├── .agents/                      # 必需：技能、Agent、知识库、规则、Hook
├── AGENTS.md                     # 必需：AI 工作流入口
├── CHANGELOG.md                  # 建议：版本变更记录
├── docs/                         # 建议：空目录或示例 SRS 结构（见 templates/docs-structure.md）
└── templates/                    # 建议：接入模板
    ├── PACKAGING.md              # 本文件
    ├── project-init.md           # 项目初始化步骤
    ├── README-DEV.template.md    # 复制到子项目并重命名为 README-DEV.md
    └── docs-structure.md         # docs/ 目录建议
```

**不包含**：`admin/`、`mobile/` 等前端源码。如需参考实现，单独提供 Starter 仓库。

## 用户接入后的工作区结构

### 单前端项目（根目录即 PROJECT_PATH）

```
my-project/
├── .agents/
├── AGENTS.md
├── CHANGELOG.md
├── docs/
├── README-DEV.md          # 从 templates/README-DEV.template.md 复制并填写
├── package.json
├── src/
└── ...
```

此时 `WORKSPACE_PATH` = `PROJECT_PATH` = 项目根目录。

### 多前端子项目（推荐）

```
my-workspace/
├── .agents/
├── AGENTS.md
├── CHANGELOG.md
├── docs/
├── admin/                 # PROJECT_PATH（PC Vue + Element Plus，可选 Starter）
│   ├── README-DEV.md
│   ├── package.json
│   └── src/
├── shadcn/                # PROJECT_PATH（PC React + shadcn/ui，可选 Starter）
│   ├── README-DEV.md
│   ├── package.json
│   └── src/
└── mobile/                # PROJECT_PATH（移动端，可选）
    ├── README-DEV.md
    ├── package.json
    └── src/
```

此时 `WORKSPACE_PATH` = 仓库根；各子目录各自一份 `README-DEV.md`。

## 接入检查清单

- [ ] 复制 `.agents/`、`AGENTS.md` 到工作区根目录
- [ ] 创建或引入前端项目（含 `package.json` + `src/`）
- [ ] 将 `templates/README-DEV.template.md` 复制为 `{PROJECT_PATH}/README-DEV.md` 并填写占位项
- [ ] 创建 `docs/` 目录（写 SRS 时使用）
- [ ] 在 `{PROJECT_PATH}` 执行 `pnpm install` 与 `pnpm dev` 验证可运行
- [ ] 至少保留 1 个列表页作为 `page-generator` 风格参考（可选但强烈建议）

## 与 Starter 的关系

| 交付物 | 定位 |
| --- | --- |
| **vibepm-dev-agent**（本文） | AI 工作流 + 知识库，框架无关 |
| **Starter**（如 admin/） | 可选参考实现，开箱即用 |

vibepm-dev-agent 可单独交付；Starter 作为增值示例，不捆绑在 vibepm-dev-agent 内。
