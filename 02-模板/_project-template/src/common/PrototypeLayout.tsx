/**
 * 原型通用布局组件（Xbox 风格）
 * 左侧设计稿 + 右侧设计说明。
 *
 * Xbox 风格：方方正正（直角）、扁平（无阴影）、白/灰底、绿边框、黑字。
 *
 * 特性：
 * 1. modules 结构化说明：每模块一张编号卡片，与左侧 [data-proto-id] 元素 SVG 连线 + hover 高亮
 * 2. description 旧格式兼容：纯 Markdown 按 `## ` 自动拆成多张卡片；无 `## ` 时降级为单卡片
 * 3. 左侧直接子元素自动编号 data-proto-id（作者也可显式指定，实现精准连线）
 *
 * 用法（新，精准连线）：
 * ```tsx
 * <PrototypeLayout
 *   title="页面标题"
 *   breadcrumb="路径"
 *   modules={[
 *     { id: 1, title: '模块1', text: '说明', list: ['点1', '点2'] },
 *     { id: 2, title: '模块2', text: '说明' },
 *   ]}
 * >
 *   <div data-proto-id="1">…页面元素…</div>
 *   <div data-proto-id="2">…页面元素…</div>
 * </PrototypeLayout>
 * ```
 *
 * 用法（旧，自动拆分）：
 * ```tsx
 * <PrototypeLayout title="页面标题" description={'# 标题\n\n## 模块1\n- 要点1\n- 要点2'}>
 *   …设计稿…
 * </PrototypeLayout>
 * ```
 */
import React, { useEffect, useMemo, useRef, useState } from 'react';

export interface PrototypeModule {
  id?: string | number;
  title: string;
  text?: string;
  list?: string[];
}

interface PrototypeLayoutProps {
  title: string;
  breadcrumb?: string;
  /** 旧格式：纯 Markdown 字符串，按 `## ` 自动拆分为模块卡片 */
  description?: string;
  /** 新格式：结构化模块（与左侧 data-proto-id 元素连线） */
  modules?: PrototypeModule[];
  /** 全宽布局（隐藏右侧说明），默认 false */
  fullWidth?: boolean;
  children: React.ReactNode;
}

const XB = {
  green: '#107C10',
  greenLight: '#EDF5ED',
  bg: '#F2F2F2',
  panel: '#FFFFFF',
  black: '#000000',
  gray: '#4A4A4A',
  border: '#D9D9D9',
  font: '"Segoe UI", "Segoe UI Variable", "PingFang SC", "Microsoft YaHei", -apple-system, sans-serif',
};

const XboxStyle = `
  .plx-shell{display:grid;grid-template-columns:minmax(0,1fr) 360px;min-height:100vh;background:${XB.bg};font-family:${XB.font};color:${XB.black};margin:0}
  .plx-shell.plx-full{display:block}
  .plx-left{padding:24px;min-width:0;overflow-y:auto;max-height:100vh;position:relative}
  .plx-head{margin-bottom:16px}
  .plx-head h1{font-size:20px;margin:0;font-weight:700;color:${XB.black}}
  .plx-head p{color:${XB.gray};font-size:12px;margin:4px 0 0}
  .plx-right{width:360px;min-width:360px;background:${XB.panel};border-left:3px solid ${XB.green};padding:16px;overflow-y:auto;max-height:100vh;position:sticky;top:0}
  .plx-rd-titlebar{display:flex;align-items:center;gap:10px;padding-bottom:12px;border-bottom:2px solid ${XB.green};margin-bottom:12px}
  .plx-rd-badge{background:${XB.green};color:#fff;font-size:11px;font-weight:700;padding:3px 8px;letter-spacing:.05em}
  .plx-rd-title{font-size:15px;font-weight:700;color:${XB.black}}
  .plx-rd-brief{font-size:12px;color:${XB.gray};margin:0 0 10px;line-height:1.6}
  .plx-rd-hint{font-size:11px;color:${XB.gray};margin:0 0 14px;line-height:1.5}
  .plx-desc{background:#fff;border:2px solid ${XB.green};margin-bottom:12px;padding:12px;transition:background .15s,border-color .15s}
  .plx-desc-head{display:flex;align-items:center;gap:10px;margin-bottom:6px}
  .plx-desc-num{width:24px;height:24px;background:${XB.green};color:#fff;font-weight:700;font-size:13px;display:flex;align-items:center;justify-content:center;flex-shrink:0}
  .plx-desc-title{font-size:13px;font-weight:700;color:${XB.black}}
  .plx-desc-text{font-size:12px;color:${XB.black};line-height:1.6;margin:4px 0 0;white-space:pre-line}
  .plx-desc-list{list-style:none;padding:0;margin:6px 0 0}
  .plx-desc-list li{position:relative;padding:2px 0 2px 18px;font-size:12px;line-height:1.6;color:${XB.black}}
  .plx-desc-list li::before{content:'';position:absolute;left:2px;top:10px;width:8px;height:8px;background:${XB.green}}
  .plx-desc.active-highlight{background:${XB.green};border-color:${XB.green}}
  .plx-desc.active-highlight .plx-desc-num{background:#fff;color:${XB.green}}
  .plx-desc.active-highlight .plx-desc-title,
  .plx-desc.active-highlight .plx-desc-text,
  .plx-desc.active-highlight li{color:#fff}
  .plx-el{transition:box-shadow .15s,background .15s}
  .plx-el.active-highlight{box-shadow:0 0 0 3px ${XB.green};background:${XB.greenLight}}
  .plx-connections{position:fixed;top:0;left:0;width:100%;height:100%;pointer-events:none;z-index:9999}
  .plx-connection-line{fill:none;stroke:${XB.green};stroke-width:2;opacity:.5}
  .plx-connection-line.active{stroke-width:3;opacity:1}
  .plx-connection-bg{fill:${XB.green}}
  .plx-connection-label{fill:#fff;font-size:11px;font-weight:700;text-anchor:middle;dominant-baseline:central;font-family:${XB.font}}
  @media (max-width: 900px){.plx-shell{display:block}.plx-right{display:none}.plx-connections{display:none}}
`;

/** 旧格式 description 解析：`## ` 拆分模块；`# ` 作为 brief；`- ` 为列表；其余为段落 */
function parseDescription(text: string): { brief: string; mods: PrototypeModule[] } {
  const lines = text.split('\n');
  const mods: PrototypeModule[] = [];
  let brief = '';
  let cur: PrototypeModule | null = null;
  const clean = (s: string) => s.replace(/\*\*(.*?)\*\*/g, '$1').trim();
  for (const line of lines) {
    const t = line.trim();
    if (t.startsWith('## ')) {
      cur = { id: mods.length + 1, title: t.slice(3).trim(), text: '', list: [] };
      mods.push(cur);
    } else if (t.startsWith('# ')) {
      if (!brief) brief = clean(t.slice(2));
    } else if (cur) {
      if (t.startsWith('- ')) cur.list!.push(clean(t.slice(2)));
      else if (t.startsWith('|')) { /* 表格行忽略 */ }
      else if (t.startsWith('### ')) cur.text += (cur.text ? '\n' : '') + '【' + clean(t.slice(4)) + '】';
      else if (t) cur.text += (cur.text ? '\n' : '') + clean(t);
    }
  }
  if (mods.length === 0) {
    const textParts = lines.filter((l) => {
      const x = l.trim();
      return x && !x.startsWith('#') && !x.startsWith('- ') && !x.startsWith('|');
    }).map((l) => clean(l));
    const list = lines.filter((l) => l.trim().startsWith('- ')).map((l) => clean(l.slice(2)));
    mods.push({ id: 1, title: brief || '说明', text: textParts.join('\n'), list });
  }
  return { brief, mods };
}

export function PrototypeLayout({
  title, breadcrumb, description, modules, fullWidth, children,
}: PrototypeLayoutProps) {
  const isFull = fullWidth === true;
  const { brief, mods } = useMemo(() => {
    if (modules && modules.length) {
      return { brief: '', mods: modules.map((m, i) => ({ ...m, id: m.id ?? i + 1 })) };
    }
    if (description) return parseDescription(description);
    return { brief: '', mods: [] };
  }, [modules, description]);

  const leftRef = useRef<HTMLDivElement>(null);
  const rightRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const connsRef = useRef<Array<{ pid: string; path: SVGPathElement; le: HTMLElement; re: HTMLElement }>>([]);
  const [activeId, setActiveId] = useState<string | number | null>(null);
  const activeIdRef = useRef(activeId);
  activeIdRef.current = activeId;

  const hasCards = mods.length > 0 && !isFull;

  // 左侧直接子元素自动编号（保留作者显式指定的 data-proto-id）
  const augmentedChildren = useMemo(() => {
    let auto = 1;
    return React.Children.map(children, (child) => {
      if (!React.isValidElement(child)) return child;
      const existing = (child.props as Record<string, unknown>)['data-proto-id'];
      if (existing !== undefined && existing !== null) return child;
      return React.cloneElement(child as React.ReactElement<Record<string, unknown>>, { 'data-proto-id': String(auto++) });
    });
  }, [children]);

  // 绘制 SVG 连线（viewport 坐标 + fixed 覆盖层，滚动/缩放实时重绘）
  useEffect(() => {
    if (!hasCards) return;
    const left = leftRef.current;
    const right = rightRef.current;
    const svg = svgRef.current;
    if (!left || !right || !svg) return;

    const draw = () => {
      svg.innerHTML = '';
      connsRef.current = [];
      const leftEls = Array.from(left.querySelectorAll<HTMLElement>('[data-proto-id]'));
      leftEls.forEach((le) => {
        const pid = le.getAttribute('data-proto-id')!;
        const re = right.querySelector<HTMLElement>(`.plx-desc[data-proto-id="${pid}"]`);
        if (!re) return;
        const lr = le.getBoundingClientRect();
        const rr = re.getBoundingClientRect();
        if (!lr.width || !lr.height || !rr.width || !rr.height) return;
        const x1 = lr.right, y1 = lr.top + lr.height / 2;
        const x2 = rr.left, y2 = rr.top + rr.height / 2;
        const dx = Math.max((x2 - x1) * 0.4, 40);
        const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        path.setAttribute('d', `M ${x1} ${y1} C ${x1 + dx} ${y1}, ${x2 - dx} ${y2}, ${x2} ${y2}`);
        path.setAttribute('class', 'plx-connection-line');
        svg.appendChild(path);
        const midX = (x1 + x2) / 2, midY = (y1 + y2) / 2;
        const bg = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        bg.setAttribute('cx', String(midX));
        bg.setAttribute('cy', String(midY));
        bg.setAttribute('r', '10');
        bg.setAttribute('class', 'plx-connection-bg');
        svg.appendChild(bg);
        const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        text.setAttribute('x', String(midX));
        text.setAttribute('y', String(midY));
        text.setAttribute('dy', '0.05em');
        text.setAttribute('class', 'plx-connection-label');
        text.textContent = pid;
        svg.appendChild(text);
        const act = activeIdRef.current !== null && String(pid) === String(activeIdRef.current);
        connsRef.current.push({ pid, path, le, re });
        if (act) {
          path.classList.add('active');
          le.classList.add('active-highlight');
          re.classList.add('active-highlight');
        }
      });
    };

    draw();
    const onScroll = () => requestAnimationFrame(draw);
    left.addEventListener('scroll', onScroll, { passive: true });
    right.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      left.removeEventListener('scroll', onScroll);
      right.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, [hasCards, mods, children]);

  // activeId 变化时同步高亮状态
  useEffect(() => {
    connsRef.current.forEach((c) => {
      const act = activeId !== null && String(c.pid) === String(activeId);
      c.path.classList.toggle('active', act);
      c.le.classList.toggle('active-highlight', act);
      c.re.classList.toggle('active-highlight', act);
    });
  }, [activeId]);

  const handleHover = (e: React.MouseEvent) => {
    const el = (e.target as HTMLElement).closest('[data-proto-id]');
    if (el) setActiveId(el.getAttribute('data-proto-id'));
  };

  return (
    <div className={`plx-shell${isFull ? ' plx-full' : ''}`}>
      <style>{XboxStyle}</style>
      <div className="plx-left" ref={leftRef} onMouseOver={handleHover} onMouseLeave={() => setActiveId(null)}>
        <header className="plx-head">
          <h1>{title}</h1>
          {breadcrumb && <p>{breadcrumb}</p>}
        </header>
        {augmentedChildren}
      </div>
      {hasCards && (
        <div className="plx-right" ref={rightRef} onMouseOver={handleHover} onMouseLeave={() => setActiveId(null)}>
          <div className="plx-rd-titlebar">
            <span className="plx-rd-badge">DESIGN NOTES</span>
            <span className="plx-rd-title">设计说明</span>
          </div>
          {brief && <p className="plx-rd-brief">{brief}</p>}
          <p className="plx-rd-hint">下方每个模块与左侧界面区域通过连线对应，悬停可高亮。</p>
          {mods.map((m, i) => (
            <div key={String(m.id)} className="plx-desc" data-proto-id={String(m.id)}>
              <div className="plx-desc-head">
                <span className="plx-desc-num">{i + 1}</span>
                <span className="plx-desc-title">{m.title}</span>
              </div>
              {m.text && <p className="plx-desc-text">{m.text}</p>}
              {m.list && m.list.length > 0 && (
                <ul className="plx-desc-list">
                  {m.list.map((it, j) => <li key={j}>{it}</li>)}
                </ul>
              )}
            </div>
          ))}
        </div>
      )}
      {hasCards && <svg className="plx-connections" ref={svgRef}></svg>}
    </div>
  );
}

export default PrototypeLayout;
