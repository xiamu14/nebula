# Troubleshooting Guide

## API 一直 Pending 的排查步骤

### 1. 检查环境变量

```bash
# 检查 .env 文件是否存在
ls -la .env

# 确认 OPENROUTER_API_KEY 已配置
cat .env | grep OPENROUTER_API_KEY
```

如果没有 .env 文件:
```bash
cp .env.example .env
# 然后编辑 .env 填入你的 API key
```

### 2. 检查服务器日志

在运行 `bun run dev` 的终端中查看日志:

**期望看到的日志**:
```
[Analytic API Init] Initializing OpenAI client...
[Analytic API Init] OPENROUTER_API_KEY exists: true
[Analytic API Init] OPENROUTER_API_KEY length: 64 (或其他数字)
[Analytic API Init] OpenAI client initialized
```

**当接收到请求时**:
```
[Analytic API] Request received
[Analytic API] Parsing request body...
[Analytic API] Request data: { date: '2025-11-16', markdownLength: 500 }
[Analytic API] Calling OpenRouter API...
[Analytic API] API Key exists: true
```

### 3. 检查网络连接

测试是否能连接到 OpenRouter:

```bash
curl https://openrouter.ai/api/v1/models \
  -H "Authorization: Bearer YOUR_API_KEY_HERE"
```

### 4. 使用测试脚本

确保开发服务器正在运行 (`bun run dev`),然后在另一个终端运行:

```bash
node test-analytic-api.js
```

### 5. 检查数据库连接

```bash
# 测试数据库连接
bunx prisma studio --schema=lib/prisma/schemas/schema.prisma
```

如果 Prisma Studio 能打开,说明数据库连接正常。

### 6. 检查浏览器控制台

打开浏览器开发者工具 (F12),查看:
- **Network 标签**: 查看请求状态
- **Console 标签**: 查看错误信息

## 常见问题

### Q1: API Key 错误

**症状**: 日志显示 "API Key exists: false"

**解决方案**:
1. 确认 `.env` 文件存在
2. 确认变量名是 `OPENROUTER_API_KEY` (不是其他名字)
3. 重启开发服务器 (Ctrl+C 然后重新 `bun run dev`)

### Q2: 数据库连接错误

**症状**: 日志中有 Prisma 错误

**解决方案**:
```bash
# 1. 检查 DATABASE_URL
cat .env | grep DATABASE_URL

# 2. 测试数据库连接
bunx prisma db push --schema=lib/prisma/schemas/schema.prisma

# 3. 查看数据库状态
bunx prisma studio --schema=lib/prisma/schemas/schema.prisma
```

### Q3: OpenRouter API 超时

**症状**: 长时间 pending 后超时

**可能原因**:
1. 网络问题
2. API Key 余额不足
3. 模型不可用

**解决方案**:
1. 检查网络连接
2. 访问 https://openrouter.ai/ 查看账户状态
3. 尝试更换模型:

编辑 `app/api/analytic/route.ts`:
```typescript
model: "openai/gpt-3.5-turbo", // 替换为其他模型
```

可用的免费模型:
- `z-ai/glm-4.5-air:free`
- `meta-llama/llama-3.2-3b-instruct:free`
- `mistralai/mistral-7b-instruct:free`

### Q4: AI 返回格式错误

**症状**: 日志显示 "Failed to parse AI response as JSON"

**查看方法**: 日志会显示 AI 的原始返回
```
[Analytic API] Failed to parse AI response: [AI的返回内容]
```

**解决方案**:
这通常是临时问题,重试即可。如果持续出现,可以修改 prompt。

### Q5: Prisma 生成错误

**症状**: 构建或启动时报错找不到 Prisma Client

**解决方案**:
```bash
# 重新生成 Prisma Client
bun run db:generate

# 或直接运行
bunx prisma generate --schema=lib/prisma/schemas/schema.prisma
```

## 调试技巧

### 查看完整的 API 响应

在 `app/api/analytic/route.ts` 中查找这行:
```typescript
console.log('[Analytic API] AI response length:', aiResponse?.length);
```

可以临时添加:
```typescript
console.log('[Analytic API] Full AI response:', aiResponse);
```

### 测试不调用 AI 的版本

临时修改代码,跳过 AI 调用:

```typescript
// 注释掉 AI 调用
// const completion = await openai.chat.completions.create(...);

// 使用模拟数据
const structData: DayStructData = {
  breakfastTotal: 2,
  breakfastCompleted: 1,
  lunchTotal: 2,
  lunchCompleted: 2,
  dinnerTotal: 1,
  dinnerCompleted: 0,
  drinksTotal: 1,
  drinksCompleted: 1,
  snacksTotal: 1,
  snacksCompleted: 0,
  exerciseTotal: 1,
  exerciseCompleted: 1,
  totalDuration: 30,
  totalCalories: 250,
  mood: { "平静": 0.7, "愉悦": 0.8, "压力": 0.2 },
  enrichmentScore: 0.75,
};
```

这可以帮助确定是 AI 调用的问题还是其他部分的问题。

## 获取更多帮助

1. 查看完整的服务器日志
2. 检查浏览器 Network 标签的详细信息
3. 确认所有依赖都已安装: `bun install`
4. 清除缓存重新构建: `rm -rf .next && bun run dev`

## 快速检查清单

- [ ] `.env` 文件存在且配置正确
- [ ] `OPENROUTER_API_KEY` 已设置
- [ ] `DATABASE_URL` 已设置
- [ ] 数据库已迁移/推送 schema
- [ ] Prisma Client 已生成
- [ ] 开发服务器正在运行
- [ ] 网络连接正常
- [ ] OpenRouter 账户有余额
- [ ] 查看了服务器日志
- [ ] 查看了浏览器控制台
