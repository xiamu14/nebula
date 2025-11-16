"use client";

import { useState, useEffect } from "react";
import DayEditorModal from "../DayEditorModal";

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
    year || new Date().getFullYear()
  );
  const [currentMonth, setCurrentMonth] = useState(
    month || new Date().getMonth() + 1
  );
  const [daysData, setDaysData] = useState<Record<string, DayData>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [todayDate, setTodayDate] = useState<string>('');

  // Load month data
  useEffect(() => {
    loadMonthData();
  }, [currentYear, currentMonth]);

  const loadMonthData = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(
        `/api/month?year=${currentYear}&month=${currentMonth}`
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
    } finally {
      setIsLoading(false);
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
      "0"
    )}-${String(day).padStart(2, "0")}`;
    setSelectedDate(dateStr);
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

  const weekDays = ["日", "一", "二", "三", "四", "五", "六"];

  // Calculate dominant mood and its color
  const getMoodInfo = (mood: Record<string, number>) => {
    const moodColors: Record<
      string,
      { bg: string; border: string; text: string }
    > = {
      平静: {
        bg: "bg-blue-50",
        border: "border-blue-200",
        text: "text-blue-600",
      },
      愉悦: {
        bg: "bg-yellow-50",
        border: "border-yellow-200",
        text: "text-yellow-700",
      },
      开心: {
        bg: "bg-green-50",
        border: "border-green-200",
        text: "text-green-600",
      },
      快乐: {
        bg: "bg-green-50",
        border: "border-green-200",
        text: "text-green-600",
      },
      沮丧: {
        bg: "bg-gray-50",
        border: "border-gray-300",
        text: "text-gray-600",
      },
      压力: { bg: "bg-red-50", border: "border-red-200", text: "text-red-600" },
      焦虑: {
        bg: "bg-orange-50",
        border: "border-orange-200",
        text: "text-orange-600",
      },
    };

    if (Object.keys(mood).length === 0) {
      return {
        name: "",
        value: 0,
        colors: {
          bg: "bg-white",
          border: "border-gray-200",
          text: "text-gray-600",
        },
      };
    }

    let maxMood = "";
    let maxValue = 0;
    Object.entries(mood).forEach(([key, value]) => {
      if (value > maxValue) {
        maxMood = key;
        maxValue = value;
      }
    });

    return {
      name: maxMood,
      value: maxValue,
      colors: moodColors[maxMood] || {
        bg: "bg-purple-50",
        border: "border-purple-200",
        text: "text-purple-600",
      },
    };
  };

  const getEnrichmentColors = (score: number) => {
    if (score >= 0.8)
      return {
        bg: "bg-green-50",
        border: "border-green-400",
        text: "text-green-700",
      };
    if (score >= 0.6)
      return {
        bg: "bg-green-50",
        border: "border-green-300",
        text: "text-green-600",
      };
    if (score >= 0.4)
      return {
        bg: "bg-yellow-50",
        border: "border-yellow-300",
        text: "text-yellow-700",
      };
    if (score >= 0.2)
      return {
        bg: "bg-orange-50",
        border: "border-orange-300",
        text: "text-orange-600",
      };
    if (score > 0)
      return {
        bg: "bg-red-50",
        border: "border-red-300",
        text: "text-red-600",
      };
    return { bg: "bg-white", border: "border-gray-200", text: "text-gray-400" };
  };

  return (
    <div className="mx-auto p-4 w-full max-w-6xl">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <button
          onClick={handlePrevMonth}
          className="hover:bg-gray-100 p-2 rounded-lg transition-colors"
        >
          <svg
            className="w-6 h-6"
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

        <h2 className="font-semibold text-2xl">
          {currentYear}年 {currentMonth}月
        </h2>

        <button
          onClick={handleNextMonth}
          className="hover:bg-gray-100 p-2 rounded-lg transition-colors"
        >
          <svg
            className="w-6 h-6"
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
      <div className="bg-white shadow-lg rounded-lg overflow-hidden">
        {/* Week day headers */}
        <div className="grid grid-cols-7">
          {weekDays.map((day) => (
            <div
              key={day}
              className="bg-gray-50 p-3 font-semibold text-gray-700 text-center"
            >
              {day}
            </div>
          ))}
        </div>

        {/* Calendar days */}
        <div className="grid grid-cols-7">
          {/* Empty cells for days before month starts */}
          {Array.from({ length: firstDay }).map((_, index) => (
            <div
              key={`empty-${index}`}
              className="border border-gray-100 aspect-square"
            />
          ))}

          {/* Actual days */}
          {Array.from({ length: daysInMonth }).map((_, index) => {
            const day = index + 1;
            const dateStr = `${currentYear}-${String(currentMonth).padStart(
              2,
              "0"
            )}-${String(day).padStart(2, "0")}`;
            const dayData = daysData[dateStr];
            const isToday = dateStr === new Date().toISOString().split("T")[0];

            const enrichmentColors = dayData?.hasData
              ? getEnrichmentColors(dayData.enrichmentScore)
              : {
                  bg: "bg-white",
                  border: "",
                  text: "text-gray-400",
                };
            const moodInfo = dayData?.hasData
              ? getMoodInfo(dayData.mood)
              : {
                  name: "",
                  value: 0,
                  colors: {
                    bg: "bg-white",
                    border: "",
                    text: "text-gray-600",
                  },
                };

            return (
              <div
                key={day}
                onClick={() => handleDayClick(day)}
                className={`
                  aspect-square border border-gray-100 p-2 cursor-pointer
                   transition-all relative
                  ${isToday ? "bg-gray-200" : ""}
                `}
              >
                <div
                  className={`font-semibold ${
                    isToday ? "text-blue-600" : "text-gray-700"
                  }`}
                >
                  {day}
                </div>

                {dayData?.hasData && (
                  <div className="space-y-2 mt-2">
                    {/* Enrichment progress bar */}
                    <div
                      className={`relative h-5 rounded-full ${enrichmentColors.bg} ${enrichmentColors.border} border overflow-hidden`}
                    >
                      <div
                        className={`h-full ${enrichmentColors.border.replace(
                          "border-",
                          "bg-"
                        )} transition-all`}
                        style={{ width: `${dayData.enrichmentScore * 100}%` }}
                      />
                      <div
                        className={`absolute inset-0 flex items-center justify-center text-[10px] font-medium ${enrichmentColors.text}`}
                      >
                        充实
                      </div>
                    </div>

                    {/* Mood progress bar */}
                    {moodInfo.name && (
                      <div
                        className={`relative h-5 rounded-full ${moodInfo.colors.bg} ${moodInfo.colors.border} border overflow-hidden`}
                      >
                        <div
                          className={`h-full ${moodInfo.colors.border.replace(
                            "border-",
                            "bg-"
                          )} transition-all`}
                          style={{ width: `${moodInfo.value * 100}%` }}
                        />
                        <div
                          className={`absolute inset-0 flex items-center justify-center text-[10px] font-medium ${moodInfo.colors.text}`}
                        >
                          {moodInfo.name}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Modal */}
      {selectedDate && (
        <DayEditorModal
          isOpen={!!selectedDate}
          onClose={handleModalClose}
          date={selectedDate}
        />
      )}
    </div>
  );
}
