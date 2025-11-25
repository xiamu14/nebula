import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/prisma/client";
import { DayStructData } from "@/types/day";

// Mock API - 不调用 AI,使用简单的解析逻辑
export async function POST(request: NextRequest) {
  console.log("[Mock Analytic API] Request received");

  try {
    const { markdown, date } = await request.json();

    if (!markdown || !date) {
      return NextResponse.json(
        { error: "Markdown and date are required" },
        { status: 400 },
      );
    }

    console.log("[Mock Analytic API] Parsing markdown manually...");

    // 简单的解析逻辑
    const lines = markdown.split("\n");

    // 计算餐饮项目
    const breakfastItems =
      markdown.match(/### Breakfast\s+([\s\S]*?)(?=###|---)/)?.[1] || "";
    const lunchItems =
      markdown.match(/### Lunch\s+([\s\S]*?)(?=###|---)/)?.[1] || "";
    const dinnerItems =
      markdown.match(/### Dinner\s+([\s\S]*?)(?=###|---)/)?.[1] || "";
    const drinksItems =
      markdown.match(/### Drinks\s+([\s\S]*?)(?=###|---)/)?.[1] || "";
    const snacksItems =
      markdown.match(/### Snacks\s+([\s\S]*?)(?=###|---)/)?.[1] || "";

    const countItems = (text: string) => {
      const total = (text.match(/- \[[ x]\]/g) || []).length;
      const completed = (text.match(/- \[x\]/gi) || []).length;
      return { total, completed };
    };

    const breakfast = countItems(breakfastItems);
    const lunch = countItems(lunchItems);
    const dinner = countItems(dinnerItems);
    const drinks = countItems(drinksItems);
    const snacks = countItems(snacksItems);

    // 计算运动项目
    const exerciseSection =
      markdown.match(/## Exercise\s+([\s\S]*?)(?=---|## Notes)/)?.[1] || "";
    const exerciseRows = exerciseSection
      .split("\n")
      .filter((line) => line.includes("|") && !line.includes("完成"));
    const exerciseTotal = Math.max(0, exerciseRows.length - 1); // 减去表头
    const exerciseCompleted = exerciseSection.match(/✅/g)?.length || 0;

    // 简单计算时长和卡路里
    let totalDuration = 0;
    let totalCalories = 0;
    exerciseRows.forEach((row) => {
      const durationMatch = row.match(/\|\s*(\d+)\s*\|/);
      const calorieMatch = row.match(/\|\s*\d+\s*\|\s*(\d+)\s*\|/);
      if (durationMatch) totalDuration += parseInt(durationMatch[1]) || 0;
      if (calorieMatch) totalCalories += parseInt(calorieMatch[1]) || 0;
    });

    // 解析心情
    const moodSection = markdown.match(/## Mood\s+([\s\S]*?)$/)?.[1] || "";
    const mood: Record<string, number> = {};
    const moodLines = moodSection
      .split("\n")
      .filter((line) => line.includes(":"));
    moodLines.forEach((line) => {
      const match = line.match(/- (.*?):\s*([\d.]+)/);
      if (match) {
        mood[match[1]] = parseFloat(match[2]);
      }
    });

    // 计算充实度
    const totalItems =
      breakfast.total +
      lunch.total +
      dinner.total +
      drinks.total +
      snacks.total +
      exerciseTotal;
    const completedItems =
      breakfast.completed +
      lunch.completed +
      dinner.completed +
      drinks.completed +
      snacks.completed +
      exerciseCompleted;
    const enrichmentScore = totalItems > 0 ? completedItems / totalItems : 0;

    const validatedData: DayStructData = {
      breakfastTotal: breakfast.total,
      breakfastCompleted: breakfast.completed,
      lunchTotal: lunch.total,
      lunchCompleted: lunch.completed,
      dinnerTotal: dinner.total,
      dinnerCompleted: dinner.completed,
      drinksTotal: drinks.total,
      drinksCompleted: drinks.completed,
      snacksTotal: snacks.total,
      snacksCompleted: snacks.completed,
      exerciseTotal,
      exerciseCompleted,
      totalDuration,
      totalCalories,
      mood,
      enrichmentScore: Math.max(0, Math.min(1, enrichmentScore)),
    };

    console.log("[Mock Analytic API] Parsed data:", validatedData);

    // Save to database
    const dateObj = new Date(date);

    const dayMeta = await prisma.dayMeta.upsert({
      where: { date: dateObj },
      update: { markdown },
      create: { date: dateObj, markdown },
    });

    const dayStruct = await prisma.dayStruct.upsert({
      where: { dayMetaId: dayMeta.id },
      update: validatedData,
      create: {
        dayMetaId: dayMeta.id,
        ...validatedData,
      },
    });

    console.log("[Mock Analytic API] Request completed successfully");
    return NextResponse.json({
      success: true,
      data: dayStruct,
      note: "This is a mock response without AI analysis",
    });
  } catch (error) {
    console.error("[Mock Analytic API] Error:", error);
    return NextResponse.json(
      {
        error: "Failed to analyze day data",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    );
  }
}
