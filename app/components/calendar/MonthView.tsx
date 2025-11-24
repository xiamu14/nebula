"use client";

import { useState, useEffect, useRef } from "react";
import DayEditorModal from "../DayEditorModal";
import { cn } from "@/app/utils/cn";
import MyDialog, { controlRef } from "../ui/Dialog";

interface DayData {
  date: string;
  enrichmentScore: number;
  mood: Record<string, number>;
  hasData: boolean;
}

interface MonthViewProps {
  year?: number;
  month?: number; // 1-12
  onDateClick?: (date: string) => void;
}

export default function MonthView({
  year,
  month,
  onDateClick,
}: MonthViewProps) {
  const [currentYear, setCurrentYear] = useState(
    year || new Date().getFullYear(),
  );
  const [currentMonth, setCurrentMonth] = useState(
    month || new Date().getMonth() + 1,
  );
  const [daysData, setDaysData] = useState<Record<string, DayData>>({});
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const DialogControlRef = useRef<controlRef>(null);
  // Load month data
  useEffect(() => {
    loadMonthData();
  }, [currentYear, currentMonth]);

  const loadMonthData = async () => {
    try {
      const response = await fetch(
        `/api/month?year=${currentYear}&month=${currentMonth}`,
      );
      const { days } = await response.json();

      const dataMap: Record<string, DayData> = {};
      if (days && Array.isArray(days)) {
        days.forEach((day: any) => {
          const dateStr = new Date(day.date).toISOString().split("T")[0];
          dataMap[dateStr] = {
            date: dateStr,
            enrichmentScore: day.struct?.enrichmentScore || 0,
            mood: day.struct?.mood || {},
            hasData: !!day.struct,
          };
        });
      }
      setDaysData(dataMap);
    } catch (error) {
      console.error("Error loading month data:", error);
    }
  };

  const getDaysInMonth = (year: number, month: number) => {
    return new Date(year, month, 0).getDate();
  };

  const getFirstDayOfMonth = (year: number, month: number) => {
    return new Date(year, month - 1, 1).getDay();
  };

  const handlePrevMonth = () => {
    if (currentMonth === 1) {
      setCurrentMonth(12);
      setCurrentYear(currentYear - 1);
    } else {
      setCurrentMonth(currentMonth - 1);
    }
  };

  const handleNextMonth = () => {
    if (currentMonth === 12) {
      setCurrentMonth(1);
      setCurrentYear(currentYear + 1);
    } else {
      setCurrentMonth(currentMonth + 1);
    }
  };

  const handleDayClick = (day: number) => {
    const dateStr = `${currentYear}-${String(currentMonth).padStart(
      2,
      "0",
    )}-${String(day).padStart(2, "0")}`;
    setSelectedDate(dateStr);
    DialogControlRef.current?.open();
    if (onDateClick) {
      onDateClick(dateStr);
    }
  };

  const handleModalClose = () => {
    setSelectedDate(null);
    // Reload month data after closing modal
    loadMonthData();
  };

  const daysInMonth = getDaysInMonth(currentYear, currentMonth);
  const firstDay = getFirstDayOfMonth(currentYear, currentMonth);
  const lastDay = 7 - ((firstDay + daysInMonth) % 7);

  const weekDays = ["日", "一", "二", "三", "四", "五", "六"];

  // Calculate dominant mood and its color
  const getMoodInfo = (mood: Record<string, number>) => {
    const moodColors: Record<
      string,
      { bg: string; border: string; text: string; "fill:bg": string }
    > = {
      quiet: {
        bg: "#f5f3ff", // 50
        border: "#ece9fe", //100
        text: "#7839ef", //600
        "fill:bg": "#ddd6fe",
      },
      negative: {
        bg: "#f8fafc", // 50
        border: "#eef2f6", //100
        text: "#4b5565", //600
        "fill:bg": "#e3e8ef",
      },
      positive: {
        bg: "#f3fee7", // 50
        border: "#e4fbcc", //100
        text: "#4ca30d", //600
        "fill:bg": "#d0f8ab",
      },
    };
    // 拆解心情指示

    return {
      name: "负面",
      value: 10,
      colors: moodColors["negative"],
    };
  };

  const getEnrichmentColors = () => {
    return {
      bg: "#eff4ff", // 50
      border: "#d1e0ff", //100
      text: "#155eef", //600
      "fill:bg": "#b2ccff", //200
    };
  };

  return (
    <div className="mx-auto p-4 w-full max-w-6xl">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="font-semibold text-gray-500 text-2xl">
          {currentYear}年 {currentMonth}月
        </h2>
        <div className="flex-1"></div>
        <button
          onClick={handlePrevMonth}
          className="hover:bg-gray-100 p-2 rounded-lg transition-colors cursor-pointer"
        >
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
        </button>

        <button
          onClick={handleNextMonth}
          className="hover:bg-gray-100 p-2 rounded-lg transition-colors cursor-pointer"
        >
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5l7 7-7 7"
            />
          </svg>
        </button>
      </div>

      {/* Calendar Grid */}
      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
        {/* Week day headers */}
        <div className="grid grid-cols-7">
          {weekDays.map((day) => (
            <div
              key={day}
              className={cn(
                "p-2.5 border border-gray-200 border-t-0 last:border-r-0 border-b-0 border-l-0 font-semibold text-gray-700 text-sm text-center",
              )}
            >
              周{day}
            </div>
          ))}
        </div>

        {/* Calendar days */}
        <div className="grid grid-cols-7">
          {/* Empty cells for days before month starts */}
          {Array.from({ length: firstDay }).map((_, index) => (
            <div
              key={`empty-${index}`}
              className="border border-gray-200 last:border-r-0 border-b-0 border-l-0 aspect-square"
            />
          ))}

          {/* Actual days */}
          {Array.from({ length: daysInMonth }).map((_, index) => {
            const day = index + 1;
            const dateStr = `${currentYear}-${String(currentMonth).padStart(
              2,
              "0",
            )}-${String(day).padStart(2, "0")}`;
            const dayData = daysData[dateStr];
            const isToday = dateStr === new Date().toISOString().split("T")[0];

            const enrichmentColors = getEnrichmentColors();

            const moodInfo = getMoodInfo(dayData?.mood);

            return (
              <div
                key={day}
                onClick={() => handleDayClick(day)}
                className={cn(
                  `relative hover:bg-gray-50 p-2 border border-gray-200 border-b-0 border-l-0 aspect-square transition-all cursor-pointer`,
                  {
                    "border-r-0": (index + firstDay + 1) % 7 === 0,
                  },
                )}
              >
                <div
                  className={cn(`text-gray-600`, {
                    "bg-purple-500 flex w-6 h-6 justify-center items-center rounded-full text-white":
                      isToday,
                  })}
                >
                  <span className="p-0 font-semibold text-sm">{day}</span>
                </div>

                {dayData?.hasData && (
                  <div className="space-y-2 mt-2">
                    {/* Enrichment progress bar */}
                    <div
                      className={`relative h-6 rounded-full border overflow-hidden`}
                      style={{
                        backgroundColor: enrichmentColors.bg,
                        borderColor: enrichmentColors.border,
                        color: enrichmentColors.border,
                      }}
                    >
                      <div
                        className={`h-full transition-all`}
                        style={{
                          width: "40%",
                          background: enrichmentColors["fill:bg"],
                        }}
                      />
                      <div
                        className={`absolute inset-0 flex items-center justify-center text-[10px] font-medium `}
                        style={{
                          color: enrichmentColors.text,
                        }}
                      >
                        充实:0.4
                      </div>
                    </div>

                    {/* Mood progress bar */}
                    {moodInfo.name && (
                      <div
                        className={`relative h-6 rounded-full border overflow-hidden`}
                        style={{
                          backgroundColor: moodInfo.colors.bg,
                          borderColor: moodInfo.colors.border,
                          color: moodInfo.colors.border,
                        }}
                      >
                        <div
                          className={`h-full transition-all`}
                          style={{
                            width: "30%",
                            background: moodInfo.colors["fill:bg"],
                          }}
                        />
                        <div
                          className={`absolute inset-0 flex items-center justify-center text-[10px] font-medium `}
                          style={{
                            color: moodInfo.colors.text,
                          }}
                        >
                          {moodInfo.name}:0.3
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}

          {/* Empty cells for days after month ends */}
          {Array.from({ length: lastDay }).map((_, index) => (
            <div
              key={`empty-${index}`}
              className="border border-gray-200 last:border-r-0 border-b-0 border-l-0 aspect-square"
            />
          ))}
        </div>
      </div>
      <MyDialog controlRef={DialogControlRef} />
    </div>
  );
}
