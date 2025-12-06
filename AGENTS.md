# AGENTS.md - Nebula 项目开发指南

## 项目概述

Nebula 是一个全栈生活健康管理应用，使用 Next.js 14 + React 19 + TypeScript + Prisma + PostgreSQL 开发。主要功能包括：
- 体重记录和图表展示
- 饮食计划管理
- 运动记录追踪  
- 情绪标签管理
- 日记笔记功能

## 技术栈

- **前端**: Next.js 14 + React 19 + TypeScript
- **UI**: HeroUI + TailwindCSS 4 + tailwindcss-animate
- **状态管理**: Valtio (仅全局状态)
- **数据库**: PostgreSQL + Prisma ORM  
- **样式**: TailwindCSS + PostCSS + Prettier
- **运行时**: Bun (包管理 + 数据库操作)
- **开发环境**: Docker Compose (PostgreSQL)

## 核心命令

### 开发
```bash
bun run dev           # 启动开发服务器
bun run build         # 构建生产版本
bun run start         # 启动生产服务器
bun run lint          # ESLint 检查
```

### 数据库
```bash
bun run db:generate   # 生成 Prisma Client
bun run db:seed       # 运行数据填充
```

### Docker
```bash
docker-compose up -d  # 启动 PostgreSQL (端口 5433)
```

## 代码规范

### TypeScript 规则
- **禁止使用 any 类型**
- 所有函数必须有明确的类型定义
- 日期操作必须使用 dayjs 库
- 使用已安装的库，不要造轮子

### React 规则  
- **禁止使用 React Context** - 避免不必要的重渲染
- 仅全局状态使用 Valtio 同步，局部状态用 useState
- 将独立、可复用代码抽象为函数
- 遵循"如无必要，不增实体"原则

### 文件组织
```
app/
├── components/     # 页面组件
├── hooks/         # 自定义 hooks  
├── store/         # Valtio 全局状态
├── utils/         # 工具函数
└── api/           # API 路由

components/        # 共享组件库
├── base/          # 基础组件 (Button, Badge 等)
├── foundations/   # 基础元素 (Icon 等)  
└── application/   # 应用级组件 (Tabs 等)
```

## 数据库设计 & 优化建议

### 当前 Schema 分析

#### ✅ 做得好的地方
- 使用复合索引优化查询性能 (`@@index([date, category])`)
- 运动记录使用复合唯一键防重复 (`@@unique([exerciseId, date])`)
- 适当的关系设计 (Exercise -> ExerciseRecord)
- 使用 Json 类型存储情绪标签（灵活性好）

#### 🔧 可优化的地方

**1. 统一时间戳字段命名**
```prisma
// 当前混合使用 createdAt/updatedAt
// 建议统一为 created_at/updated_at 或全部用 camelCase
```

**2. Weight 模型优化**
```prisma
model Weight {
  id        Int      @id @default(autoincrement())
  date      DateTime @unique
  value     Decimal  @db.Decimal(5, 2)  // 5位数字，2位小数，最大 999.99kg
  // 建议：可考虑是否需要 createdAt，因为有 date 字段
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}
```

**3. Exercise 表可简化**
```prisma
// 当前：Exercise + ExerciseRecord 两张表
// 优化建议：如果运动类型固定且不多，可考虑枚举
enum ExerciseType {
  RUNNING
  CYCLING  
  SWIMMING
  YOGA
  // ...
}

model ExerciseRecord {
  id       Int          @id @default(autoincrement())
  type     ExerciseType  // 直接用枚举，减少JOIN
  date     DateTime
  duration Int          @default(0)
  createdAt DateTime    @default(now())
  updatedAt DateTime    @updatedAt
  
  @@unique([type, date])
  @@index([date])
}
```

## API 路由优化建议

### 🔧 需要改进的地方

**1. 文件扩展名不统一**
```
exercise/route.ts  ✅ TypeScript
diet-plan/route.js ❌ JavaScript  
emotion/route.js   ❌ JavaScript
weight/route.js    ❌ JavaScript
```
建议全部改为 `.ts`

**2. 重复的日期处理代码**
```typescript
// 在多个 API 中重复出现
const parsedDate = new Date(date);
parsedDate.setHours(0, 0, 0, 0);
```

**建议创建工具函数：**
```typescript
// app/utils/dateUtils.ts
export function normalizeDate(dateInput: string | Date): Date {
  const date = new Date(dateInput);
  date.setHours(0, 0, 0, 0);
  return date;
}
```

**3. 统一错误处理**
建议创建统一的错误处理中间件：
```typescript
// app/utils/apiUtils.ts
export function handleApiError(error: unknown) {
  console.error("API Error:", error);
  return Response.json(
    { error: "Internal server error" },
    { status: 500 }
  );
}

export function validateRequired(data: Record<string, any>, required: string[]) {
  const missing = required.filter(field => 
    data[field] === undefined || data[field] === null
  );
  
  if (missing.length > 0) {
    throw new Error(`Missing required fields: ${missing.join(', ')}`);
  }
}
```

**4. API 响应格式统一**
```typescript
// 建议统一的响应格式
interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}
```

**5. 可以合并的路由**
- `emotion/route.js` 和 `emotion/[date]/route.js` 功能重复
- 建议在主路由中通过查询参数处理删除操作

### 具体优化建议

**Exercise API 优化**
```typescript
// 当前 GET 请求需要两次数据库查询
// 可以用一次 JOIN 查询优化
const exerciseRecords = await prisma.exerciseRecord.findMany({
  where: { date: requestedDate },
  include: { exercise: true }  // 一次查询包含运动类型
});
```

**Diet Plan API 优化**
```typescript
// DELETE 应该使用 body 而非 query 参数传递 ID
// 建议改为 DELETE /api/diet-plan/{id}
```

## 组件开发规范

### 样式系统
- 使用 `cx()` 函数合并 TailwindCSS 类
- 自定义工具类在 `utils/cx.ts` 中扩展
- 组件变体使用 `sortCx()` 函数整理样式对象

### 状态管理
```typescript
// 全局状态 (使用 Valtio)
import { currentDateState } from '@/app/store/global.state';
const currentDate = useSnapshot(currentDateState);

// 局部状态 (使用 useState) 
const [loading, setLoading] = useState(false);
```

### 数据获取
- 使用自定义 hooks 封装 API 调用
- hooks 命名规范：`use[功能名]Data` (如 `useWeightChartData`)

## 注意事项

1. **分支规范**: 当前在 `feat/bento` 分支开发
2. **不要改动已完成的组件**: WeightCard, CateringPlanCard, ExerciseCard 已完成
3. **数据库迁移**: 修改 Schema 后执行 `bun run db:generate`
4. **环境变量**: 确保 `DATABASE_URL` 指向正确的 PostgreSQL 实例
5. **端口配置**: PostgreSQL 运行在端口 5433 (非标准 5432)

## 开发工作流

1. **启动开发环境**
   ```bash
   docker-compose up -d  # 启动数据库
   bun install          # 安装依赖
   bun run dev          # 启动开发服务器
   ```

2. **数据库更改流程**
   ```bash
   # 修改 prisma/schemas/schema.prisma
   bun run db:generate  # 重新生成客户端
   # 测试更改
   ```

3. **代码规范检查**
   ```bash
   bun run lint         # ESLint 检查
   # Prettier 会自动格式化 (集成 Tailwind 排序)
   ```

## 当前开发任务

根据 README.md，主要任务集中在 EmotionCard 组件：

1. ✅ 已完成 emotions 表结构 
2. 🔄 展示当前日期的情绪标签
3. 🔄 实现标签删除功能
4. 🔄 实现添加默认情绪功能（平静、喜悦、沮丧、积极）

开发此功能时注意：
- 使用 HeroUI Badge 组件展示标签
- 标签颜色映射：default(灰) success(绿) danger(红) warning(黄)  
- API 调用使用 emotion 相关路由
- 状态更新后及时刷新UI

---

*此文档会随项目发展持续更新。如发现问题或有改进建议，请及时更新此文档。*