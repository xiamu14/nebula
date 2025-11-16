import MonthView from "./components/calendar/MonthView";

export default function Home() {
  return (
    <div className="bg-linear-to-br from-blue-50 via-white to-purple-50 min-h-screen">
      <main className="mx-auto py-8 container">
        <div className="mb-8 text-center">
          <h1 className="mb-2 font-bold text-gray-900 text-4xl">Nebula</h1>
          <p className="text-gray-600">生活计划记录 · 情绪追踪 · 健康管理</p>
        </div>
        <MonthView />
      </main>
    </div>
  );
}
