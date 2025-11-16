import { Editor } from "./components/editor/DynamicEditor";

export default function Home() {
  return (
    <div className="flex justify-center items-center bg-zinc-50 dark:bg-black h-screen overflow-hidden font-sans">
      <main className="flex flex-col justify-between items-center sm:items-start dark:bg-black px-16 py-1 w-full max-w-3xl h-screen overflow-y-scroll">
        <div className="bg-white py-2 rounded-xl w-full h-full">
          <Editor />
        </div>
      </main>
    </div>
  );
}
