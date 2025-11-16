import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";
import { prisma } from "@/lib/prisma/client";
import { DayStructData } from "@/lib/types/day";

export const maxDuration = 60;

const openai = new OpenAI({
  baseURL: "https://openrouter.ai/api/v1",
  apiKey: process.env.OPENROUTER_API_KEY,
  timeout: 50000,
});

// POST /api/analytic
export async function POST(request: NextRequest) {
  try {
    const { markdown, date } = await request.json();
    console.log(`[Analytic] Start: date=${date}, markdown=${markdown?.length}chars`);

    if (!markdown || !date) {
      return NextResponse.json(
        { error: "Markdown and date are required" },
        { status: 400 }
      );
    }

    // Prepare AI prompt - 简洁直接
    const prompt = `分析以下日记，返回JSON格式数据：

${markdown}

统计规则：
1. 餐饮: - [ ] 未完成, - [x] 已完成，统计各部分total和completed
2. 运动: 表格中✅表示完成，统计总数、完成数、时长(分钟)、卡路里
3. 心情: 从 ## Mood 部分提取，格式 "- 心情名: 数值"
4. enrichmentScore = (所有完成项数) / (所有总项数)，包括早中晚餐、饮料、零食、运动

只返回JSON，不要任何解释：
{
  "breakfastTotal": 数字,
  "breakfastCompleted": 数字,
  "lunchTotal": 数字,
  "lunchCompleted": 数字,
  "dinnerTotal": 数字,
  "dinnerCompleted": 数字,
  "drinksTotal": 数字,
  "drinksCompleted": 数字,
  "snacksTotal": 数字,
  "snacksCompleted": 数字,
  "exerciseTotal": 数字,
  "exerciseCompleted": 数字,
  "totalDuration": 数字,
  "totalCalories": 数字,
  "mood": {"心情名": 数值},
  "enrichmentScore": 数值
}`;

    console.log("[Analytic] Calling OpenRouter API...");
    const startTime = Date.now();

    const completion = await openai.chat.completions.create({
      model: "z-ai/glm-4.5-air:free",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.1,
    });

    console.log(`[Analytic] API responded in ${Date.now() - startTime}ms`);

    const message = completion.choices[0].message;
    console.log("[Analytic] Message keys:", Object.keys(message));

    // 某些模型会把内容放在 reasoning 字段
    const aiResponse = message.content || (message as any).reasoning || '';

    if (!aiResponse) {
      console.error("[Analytic] Empty response, full message:", message);
      throw new Error("No response from AI");
    }

    console.log("[Analytic] Response preview:", aiResponse.substring(0, 200));

    console.log("[Analytic] Parsing JSON...");
    let structData: DayStructData;
    try {
      const jsonMatch = aiResponse.match(/\{[\s\S]*\}/);
      structData = jsonMatch ? JSON.parse(jsonMatch[0]) : JSON.parse(aiResponse);
    } catch (parseError) {
      console.error("[Analytic] Parse failed:", aiResponse.substring(0, 500));
      throw new Error("Failed to parse AI response as JSON");
    }

    const validatedData: DayStructData = {
      breakfastTotal: structData.breakfastTotal || 0,
      breakfastCompleted: structData.breakfastCompleted || 0,
      lunchTotal: structData.lunchTotal || 0,
      lunchCompleted: structData.lunchCompleted || 0,
      dinnerTotal: structData.dinnerTotal || 0,
      dinnerCompleted: structData.dinnerCompleted || 0,
      drinksTotal: structData.drinksTotal || 0,
      drinksCompleted: structData.drinksCompleted || 0,
      snacksTotal: structData.snacksTotal || 0,
      snacksCompleted: structData.snacksCompleted || 0,
      exerciseTotal: structData.exerciseTotal || 0,
      exerciseCompleted: structData.exerciseCompleted || 0,
      totalDuration: structData.totalDuration || 0,
      totalCalories: structData.totalCalories || 0,
      mood: structData.mood || {},
      enrichmentScore: Math.max(0, Math.min(1, structData.enrichmentScore || 0)),
    };

    console.log("[Analytic] Saving to DB...");
    const dateObj = new Date(date);

    const dayMeta = await prisma.dayMeta.upsert({
      where: { date: dateObj },
      update: { markdown },
      create: { date: dateObj, markdown },
    });

    const dayStruct = await prisma.dayStruct.upsert({
      where: { dayMetaId: dayMeta.id },
      update: validatedData,
      create: { dayMetaId: dayMeta.id, ...validatedData },
    });

    console.log(`[Analytic] ✓ Completed (score: ${validatedData.enrichmentScore})`);
    return NextResponse.json({ success: true, data: dayStruct });

  } catch (error) {
    console.error("[Analytic] Error:", error instanceof Error ? error.message : error);
    return NextResponse.json(
      {
        error: "Failed to analyze day data",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
