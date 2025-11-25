"use client";
import DateCard from "./components/DateCard";
import WeightCard from "./components/WeightCard";
import CateringPlanCard from "./components/CateringPlanCard";
import ExerciseCard from "./components/ExerciseCard";
import EmotionCard from "./components/EmotionCard";
import NotesCard from "./components/NotesCard";

export default function BentoPage() {
  return (
    <div className="h-screen w-screen items-center justify-center overflow-y-auto bg-[#f5f5f5] py-10">
      <div className="flex items-center justify-center">
        <div className="bg-base-200 m-auto min-h-screen w-[75%] lg:max-w-300">
          <div className="p-5">
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              <div className="grid grid-cols-1 gap-6 md:col-span-2 md:grid-cols-2 lg:row-span-3">
                <DateCard />
                <CateringPlanCard />
              </div>

              <div className="grid grid-cols-1 gap-6 md:col-span-2 md:grid-cols-2 lg:row-span-3">
                <WeightCard />
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
