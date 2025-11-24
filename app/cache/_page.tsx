import MonthView from "../components/calendar/MonthView";

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50">
      <main className="container mx-auto py-8">
        <div className="mb-4 flex flex-row items-center justify-center gap-2 text-center">
          <h1 className="text-4xl font-bold text-gray-900">Nebula</h1>
          <p className="text-gray-600">生活计划记录 · 情绪追踪 · 健康管理</p>
        </div>
        <MonthView />
      </main>
    </div>
  );
}
