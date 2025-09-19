"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function StartChallengePage() {
  const [mode, setMode] = useState<string>("");
  const router = useRouter();

  const handleStart = () => {
    if (!mode) {
      alert("請選擇目標完成模式！");
      return;
    }

    // 根據模式跳轉到不同頁面
    switch (mode) {
      case "challenger":
        router.push("/challenge/challenger");
        break;
      case "resource":
        router.push("/challenge/resource");
        break;
      case "growth":
        router.push("/challenge/growth");
        break;
      default:
        alert("未知模式");
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[var(--background)] text-[var(--foreground)] p-8 font-sans">
      <h1 className="text-3xl font-bold mb-6">選擇目標完成模式</h1>

      <select
        value={mode}
        onChange={(e) => setMode(e.target.value)}
        className="border p-2 rounded mb-4"
      >
        <option value="">-- 請選擇模式 --</option>
        <option value="challenger">挑戰者模式</option>
        <option value="resource">資源模式</option>
        <option value="growth">成長模式</option>
      </select>

      <button
        onClick={handleStart}
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
      >
        開始挑戰
      </button>
    </div>
  );
}
