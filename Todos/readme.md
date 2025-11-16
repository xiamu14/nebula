这是一个用于用于记录用户生活计划。 日历月显示当日计划的丰富度，心情状态。日计划是一个 markdown 文档，使用 Editor 组件展示具体详细的安排，包括 三餐规划安排，三餐饮食水果，运动计划，运动时长，时间安排，运动消耗。然后是知识和感想，自动文本记录，富文本记录。心情表，感想，感受等。

总结：这是一个 生活计划记录 + 情绪记录 + 健康/饮食/运动管理的综合型 Web App。

日计划输入组件构思：实现一个模板输入组件（整个是一个 markdown 内容），就是 每一天包含 餐饮输入，三餐、饮品、水果、零食。都支持 TODO list ， 作为 Plan。 运动 输入，也是 todo list ，支持项目名， 耗时，消耗卡路里，运动感受（一句话，完形填空输入）。 支持纯文本块（富文本,高亮加粗和背景前景对比色， 支持图片，链接，媒体文件），用于 记录收获的知识，人生的感受等。 最后一个 心情模块，支持 tag 多选，比如平静，愉悦，沮丧，挫折等，都支持 process 0 - 1 ， 程度设置。帮我构思下这样一个输入组件如何实现，如何存储，如何增删改查。导出是一个 markdown ， 从这个 markdown 恢复即可。

🧩 一、组件整体结构思想

你的目标是：

在 UI 中：结构化输入（计划、todo、运动、心情、富文本记录）

在存储时：导出成 Markdown（可读、可恢复）

再次打开时：从 Markdown 恢复到结构化数据

为了实现这一点，需要：

1）结构化 UI + 2）结构化 Markdown（有标记）+ 3）解析器

Markdown 中有固定的结构区块（类似 FrontMatter 或 Block 标签），这样既：
• 人类能读
• 你能解析
• UI 能恢复数据

⸻

🧱 一天的 Markdown 模板（导入、导出的格式）

这是设计的 可解析 Markdown 模板（每日一份）。
可以完全照此格式保存数据，也支持恢复。
示例参考：

```md
export const dayTemplate = `

## Meals

### Breakfast

- [ ] 鸡蛋
- [x] 面包

### Lunch

- [ ] 米饭
- [ ] 青菜

### Dinner

- [ ] 粥
- [ ] 蔬菜

### Drinks

- [x] 咖啡
- [ ] 茶

### Snacks

- [ ] 坚果

---

## Exercise

| 完成 |  名称  | 时长(min) | 卡路里 | 感受 |
| :--: | :----: | :-------: | :----: | :--: |
|  ✅  |  跑步  |    30     |  200   | 轻松 |
|      | 俯卧撑 |    10     |   60   |  累  |

---

## Notes

<!-- RICHTEXT:START -->

这里是富文本区域，可以 **加粗**、==高亮==、插入图片。

<!-- RICHTEXT:END -->

---

## Mood

- 平静: 0.4
- 愉悦: 0.8
- 压力: 0.2
  `;
```

这是一个所见既所得的编辑组件，可以查看 app/components/editor 的基础实现。

数据结构：day 最终保存的就是 markdown 文档。编辑器读取时也是从数据库读取出的 markdown。

# 还有一部分是 calendar 组件（自定义实现），月视图。

月视图展示一个月的日期，顶部有年月的切换。月视图展示每天的计划安排是否充实，包含餐饮，运动是否足够。心情状态如何，使用不同颜色展示 process。 这个数据通过 day markdown 里通过 AI 读取完成。这个读取是在 day 编辑器保存通过 AI api 分析读取，让 AI 返回 TOON 格式，再装换 TOON 为 JSON，最后保存到数据库，数据库关联 day ,结构化存储 AI 分析后的结果。月视图里的每天数据分析使用这个结构化数据。
这是一种 AI-Native 应用结构，数据结构设计如下：
WYSIWYG 编辑器 ←→ Block Document Model（前端内存）
↓ 导出
Markdown 文件（唯一真实数据）
↓ 提供给 AI
AI 执行统计 / 总结 / 分析

举例你要请求 AI：

“阅读我当天的 Markdown，生成：
• 餐饮营养总结
• 三餐完成度
• 运动趋势
• 心情分类统计
• 今日反思”

AI 直接从 markdown 结构中提取即可。

结构化数据示例：

```
interface DailyRecord {
  date: string;

  meals: {
    breakfast: TodoItem[];
    lunch: TodoItem[];
    dinner: TodoItem[];
    drinks: TodoItem[];
    snacks: TodoItem[];
  };

  exercises: ExerciseItem[];

  notesRichText: string; // 原始富文本 or markdown

  mood: Record<string, number>; // { 平静: 0.3, 愉悦: 0.8 ... }
}

interface TodoItem {
  text: string;
  completed: boolean;
}

interface ExerciseItem {
  name: string;
  duration: number;
  calorie: number;
  feel: string;        // 一句话
  completed: boolean;
}
```

数据库使用 prisma。
