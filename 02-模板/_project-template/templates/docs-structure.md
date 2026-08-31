# docs/ 目录建议结构

vibepm-dev-agent 接入后，建议在 **WORKSPACE_PATH** 下创建 `docs/`，供 `req-doc`、`page-generator`、`delivery-plan` 等技能使用。

```
docs/
├── 01-需求与规划/
│   └── YYYY-MM-DD-{项目名}-SRS需求规格说明书-V1.0.md   # 研发真源（page-generator 输入）
├── delivery-plan.md                                      # 交付计划（批量 page-generator 时使用）
└── ...
```

## SRS 最低要求（page-generator 步骤 0 门禁）

合格 SRS 须包含以下章节（req-doc 模板结构）：

- **3.1** 总体功能架构（菜单结构、端别：PC / 移动）
- **3.3** 页面功能清单
- **3.5** 功能详细设计
- **6.1** 数据字典（如有枚举）

## 多子项目时在 SRS 中标注端别

菜单 3.1 建议写明目标子项目，便于 `page-generator` 选择 PROJECT_PATH：

```markdown
### 菜单结构

- admin（PC 后台）> 用户管理 > 用户列表
- mobile（移动端）> 首页
```

或在 `delivery-plan.md` 每条功能标注：`目标子项目: admin`。
