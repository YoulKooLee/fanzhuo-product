// 临时：验证 parseDescription 对真实 description 的拆分（用完即删）
function parseDescription(text) {
  const lines = text.split('\n');
  const mods = [];
  let brief = '';
  let cur = null;
  const clean = (s) => s.replace(/\*\*(.*?)\*\*/g, '$1').trim();
  for (const line of lines) {
    const t = line.trim();
    if (t.startsWith('## ')) {
      cur = { id: mods.length + 1, title: t.slice(3).trim(), text: '', list: [] };
      mods.push(cur);
    } else if (t.startsWith('# ')) {
      if (!brief) brief = clean(t.slice(2));
    } else if (cur) {
      if (t.startsWith('- ')) cur.list.push(clean(t.slice(2)));
      else if (t.startsWith('|')) { }
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

// 样例1：模板 sample-page
const s1 = [
  '# 示例页面',
  '这是一个示例原型，展示标准布局模板。',
  '',
  '## 页面结构',
  '- **左侧**：设计稿（UI 内容）',
  '- **右侧**：设计说明（Markdown 描述）',
  '',
  '## 设计说明编写规范',
  '遵循以下分级结构编写设计说明：',
  '',
  '### 一级标题（#）',
  '页面名称和一句话说明',
  '',
  '### 二级标题（##）',
  '模块/功能区的标题',
  '',
  '### 列表（-）',
  '- 功能点',
  '- 字段说明',
  '',
  '## 输出规范',
  '- 所有原型使用 PrototypeLayout 组件',
  '- 字段描述引用 PRD 对应章节',
].join('\n');

// 样例2：数字孪生 标签管理
const s2 = [
  '# 标签管理',
  '设备标签 CRUD。',
  '',
  '## 字段',
  '标签名称(0/10)、标签描述(0/100)、关联设备数、创建时间。',
  '',
  '## 交互',
  '- 新增/编辑：弹窗',
  '- 绑定设备：跳转到设备并关联此标签',
  '- 删除：二次确认',
].join('\n');

// 样例3：无 ## 纯文本（降级单卡片）
const s3 = ['# 简单页面', '这里只有一句话说明。', '', '- 要点甲', '- 要点乙'].join('\n');

for (const [i, s] of [s1, s2, s3].entries()) {
  const { brief, mods } = parseDescription(s);
  console.log('=== 样例' + (i + 1) + ' brief=' + JSON.stringify(brief));
  for (const m of mods) {
    console.log('  卡[' + m.id + '] 标题=' + m.title + ' | text=' + JSON.stringify(m.text) + ' | list=' + JSON.stringify(m.list));
  }
}
