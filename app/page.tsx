"use client";
import DateCard from "./components/DateCard";
import WeightCard from "./components/WeightCard";
import CateringPlanCard from "./components/CateringPlanCard";
import ExerciseCard from "./components/ExerciseCard";
import EmotionCard from "./components/EmotionCard";
import NotesCard from "./components/NotesCard";
import { useAutoUpdateDate } from "./hooks/useAutoUpdateDate";

export default function BentoPage() {
  useAutoUpdateDate();

  return (
    <div className="h-screen w-screen items-center justify-center overflow-y-auto bg-[#f5f5f5]">
      <div className="flex items-center justify-center">
        <div className="bg-base-200 m-auto min-h-screen min-w-210 py-10 lg:max-w-280">
          <div className="p-5">
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              <div className="md:row-span-2 lg:row-span-3">
                <DateCard />
              </div>

              <div className="md:row-span-2 lg:row-span-3">
                <CateringPlanCard />
              </div>

              <div className="md:row-span-2 lg:row-span-3">
                <WeightCard />
              </div>

              <div className="md:row-span-2 lg:row-span-3">
                <ExerciseCard />
              </div>

              <div className="md:row-span-2 lg:row-span-3">
                <EmotionCard />
              </div>

              <div className="md:row-span-2 lg:row-span-3">
                <NotesCard />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
