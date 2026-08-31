# 规则库 — 启动状态机（R-START-*）

> 来源：Agent_Memory/001-启动与状态机.md。level: must=铁律。
> 索引入口：`rules.index.json` → trigger「启动/Make/必点两次」。
> **scope: workspace**（只与工作台本身有关，项目日常开发不加载）。

## R-START-01 — append 日志按时间切片
- **level**: must | **status**: valid
- **trigger**: 解析追加模式日志的「最后状态」
- **rule**: 用 `txt.lastIndexOf('启动 <relative>')` 切片，只检测当前这次启动的尾部，**勿全文 includes**
- **reason**: 日志是 append 模式，旧启动的 done 标记永远残留，全文 includes 会把上次的 done 误判为当前完成
- **verify**: 清空日志启动，T+2s~T+12s 返回 running，T+14.6s 返回 done

## R-START-02 — 异步启动加过渡态
- **level**: must | **status**: valid
- **trigger**: 启动要几十秒才能就绪（spawn PS1）
- **rule**: 加 `starting` 过渡态；reconcile 对 starting **不降级**，Vite 起则补升级
- **reason**: 无过渡态时，启动未完成被 reconcile 判死，导致"必点两次"
- **verify**: 启动后 1.5s 显示 starting，就绪后自动转 editing/active

## R-START-03 — 完成=所有依赖就绪
- **level**: must | **status**: valid
- **trigger**: 启动流程依赖多服务（Vite + Make）
- **rule**: 升级 starting→editing 前必须 **Vite + Make 都健康**（isMakeAlive 检查 53817）
- **reason**: 单服务（Vite）就绪 ≠ 整体完成，Make 超时会导致 ERR_CONNECTION_REFUSED
- **verify**: T+0s starting（Vite down）→ T+10s editing（Vite+Make 都 up）

## R-START-04 — 跨进程联动等就绪再调
- **level**: must | **status**: valid
- **trigger**: spawn 后要联动另一进程（Make active 切换）
- **rule**: 等对方输出 `AXHUB_LAUNCH_STATUS: done`（Make 就绪）再同步调 syncMakeActiveProject
- **reason**: spawn 后立即调，依赖服务还没启动，HTTP 探测 status=0 失败
- **verify**: 手动 PUT /api/projects/active 可立即切，浏览器刷新可见 Make 客户端

## R-START-05 — 状态写入讲优先级
- **level**: must | **status**: valid
- **trigger**: touchProjectCtx 更新状态 / reconcile 校准
- **rule**: 旧 intent 优先级 > 新 intent 时保留旧值（stopped=5>running=4>ready=4>opening=3>focus=2>created=1）；reconcile 双向校准（死→stopped，活→running）
- **reason**: touchProjectCtx 被频繁调用无差别覆盖 intent，是状态乱跳根因
- **verify**: 状态稳定不乱跳
