# Nebula

生活计划记录 + 情绪追踪 + 健康/饮食/运动管理的综合型 Web App。

## 功能特性

- 📅 **月视图日历** - 可视化展示每天的计划充实度和心情状态
- ✍️ **日计划编辑器** - 基于 BlockNote 的富文本编辑器,支持 Markdown
- 🍎 **餐饮管理** - 记录三餐、饮品、零食的计划和完成情况
- 🏃 **运动追踪** - 记录运动项目、时长、卡路里消耗
- 😊 **情绪记录** - 多维度心情状态追踪
- 🤖 **AI 分析** - 自动分析日记内容,生成结构化数据

## 技术栈

- **框架**: Next.js 16
- **数据库**: PostgreSQL + Prisma ORM
- **编辑器**: BlockNote
- **AI**: OpenRouter API
- **样式**: Tailwind CSS
- **语言**: TypeScript

## 项目结构

```
nebula/
├── app/
│   ├── api/
│   │   ├── day/          # 日记 CRUD API
│   │   ├── month/        # 月视图数据 API
│   │   └── analytic/     # AI 分析 API
│   ├── components/
│   │   ├── calendar/     # 日历组件
│   │   ├── editor/       # 编辑器组件
│   │   └── ui/           # UI 组件
│   └── page.tsx          # 主页
├── lib/
│   ├── prisma/           # Prisma client 和 schemas
│   └── types/            # TypeScript 类型定义
└── Todos/                # 项目需求和任务文档
```

## 数据库设计

### DayMeta (日记元数据)
存储每天的 Markdown 原始内容:
- `id`: 唯一标识
- `date`: 日期 (唯一)
- `markdown`: Markdown 内容
- `createdAt/updatedAt`: 时间戳

### DayStruct (结构化数据)
存储 AI 分析后的结构化数据:
- 餐饮完成度统计 (breakfast, lunch, dinner, drinks, snacks)
- 运动统计 (总数、完成数、时长、卡路里)
- 心情数据 (JSON 格式)
- 整体充实度评分 (0-1)

## 开发指南

### 环境配置

1. 复制环境变量模板:
   ```bash
   cp .env.example .env
   ```

2. 配置环境变量:
   - `DATABASE_URL`: PostgreSQL 数据库连接字符串
   - `OPENROUTER_API_KEY`: OpenRouter API 密钥

### 安装依赖

```bash
bun install
```

### 数据库设置

```bash
# 生成 Prisma Client
bun run db:generate

# 创建数据库迁移 (如果需要)
bunx prisma migrate dev --name init --schema=lib/prisma/schemas/schema.prisma

# 推送 schema 到数据库 (开发环境)
bunx prisma db push --schema=lib/prisma/schemas/schema.prisma
```

### 运行开发服务器

```bash
bun run dev
```

访问 http://localhost:3000

### 构建生产版本

```bash
bun run build
bun run start
```

## 使用说明

### 月视图

- 点击左右箭头切换月份
- 每个日期格子显示:
  - **边框颜色**: 充实度 (绿色=高, 黄色=中, 红色=低)
  - **背景颜色**: 主要心情状态
  - **进度条**: 整体完成度
- 点击日期打开编辑器

### 日记编辑器

日记采用固定的 Markdown 结构:

```markdown
## Meals
### Breakfast
- [ ] 鸡蛋
- [x] 面包

### Lunch
- [ ] 米饭

### Dinner
- [ ] 蔬菜

### Drinks
- [x] 咖啡

### Snacks
- [ ] 坚果

---

## Exercise

| 完成 | 名称 | 时长(min) | 卡路里 | 感受 |
|:----:|:----:|:---------:|:------:|:----:|
|  ✅  | 跑步 |    30     |  200   | 轻松 |

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
```

### AI 分析

保存日记时会自动触发 AI 分析:
1. 提取餐饮完成度
2. 统计运动数据
3. 识别心情状态
4. 计算整体充实度评分

## 开发进度

- [x] Prisma schema 设计和实现
- [x] Editor 保存和加载功能
- [x] AI 分析 API 端点
- [x] Modal 组件实现
- [x] 月视图日历组件
- [ ] Untitled UI 组件集成 (可选)
- [ ] 数据导出功能
- [ ] 统计报表功能

## License

MIT
