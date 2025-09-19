"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type SubGoal = {
  id: string;
  title: string;
  timeframe: string;
  resourceLevel: string;
  growthLevel: string;
  completed: boolean;
};
type MidGoal = {
  id: string;
  title: string;
  timeframe: string;
  resourceLevel: string;
  growthLevel: string;
  subGoals: SubGoal[];
};
type Goal = { title: string; midGoals: MidGoal[] };

export default function HomePage() {
  const [inputGoal, setInputGoal] = useState("");
  const [selectedGoal, setSelectedGoal] = useState<Goal | null>(null);
  const [language, setLanguage] = useState<
    "zh-TW" | "zh-CN" | "en" | "ja" | "ko"
  >("zh-TW");
  const [mode, setMode] = useState<"" | "challenger" | "resource" | "growth">(
    ""
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleGenerate = async () => {
    if (!inputGoal.trim()) return;

    setLoading(true);
    setError("");
    setSelectedGoal(null);

    try {
      const res = await fetch("/api/ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ goal: inputGoal, language }),
      });

      const data = await res.json();
      if (data.error) {
        setError(data.error);
      } else {
        setSelectedGoal(data);
      }
    } catch (err) {
      console.error(err);
      setError("無法連線到 AI");
    } finally {
      setLoading(false);
    }
  };

  const toggleSubGoal = (midGoalId: string, subGoalId: string) => {
    if (!selectedGoal) return;
    const updatedGoal: Goal = {
      ...selectedGoal,
      midGoals: selectedGoal.midGoals.map((mid) =>
        mid.id === midGoalId
          ? {
              ...mid,
              subGoals: mid.subGoals.map((sub) =>
                sub.id === subGoalId
                  ? { ...sub, completed: !sub.completed }
                  : sub
              ),
            }
          : mid
      ),
    };
    setSelectedGoal(updatedGoal);
  };

  const handleStartChallenge = () => {
    if (!mode) {
      alert("請先選擇目標完成模式");
      return;
    }
    if (!selectedGoal) {
      alert("請先生成大目標");
      return;
    }

    // 帶參數進入挑戰頁面
    router.push(`/challenge/${mode}?goal=${encodeURIComponent(
      JSON.stringify(selectedGoal)
    )}`);
  };

  return (
    <div className="min-h-screen p-8 bg-[var(--background)] text-[var(--foreground)] font-sans">
      <h1 className="text-4xl font-bold mb-6">AI 目標教練</h1>

      {/* 語言選擇 */}
      <div className="mb-4">
        <label className="mr-2 font-semibold">選擇生成語言：</label>
        <select
          value={language}
          onChange={(e) => setLanguage(e.target.value as any)}
          className="border p-2 rounded"
        >
          <option value="zh-TW">中文繁體</option>
          <option value="zh-CN">中文簡體</option>
          <option value="en">英文</option>
          <option value="ja">日文</option>
          <option value="ko">韓文</option>
        </select>
      </div>

      {/* 輸入大目標 */}
      <div className="mb-6 flex gap-2">
        <input
          type="text"
          placeholder="輸入想完成的目標"
          value={inputGoal}
          onChange={(e) => setInputGoal(e.target.value)}
          className="border p-2 flex-1 rounded"
        />
        <button
          onClick={handleGenerate}
          disabled={loading}
          className="bg-blue-500 text-white px-4 rounded hover:bg-blue-600 disabled:opacity-50"
        >
          {loading ? "生成中..." : "告訴我"}
        </button>
      </div>

      {/* 錯誤訊息 */}
      {error && <p className="text-red-500 mb-4">{error}</p>}

      {/* 顯示 AI 拆解的目標 */}
      {selectedGoal && (
        <div className="border p-4 rounded shadow">
          <h2 className="text-2xl font-bold mb-2">{selectedGoal.title}</h2>
          {selectedGoal.midGoals.map((mid) => (
            <div key={mid.id} className="mb-4 pl-4">
              <h3 className="font-semibold">
                {mid.title} ({mid.timeframe} | {mid.resourceLevel} |{" "}
                {mid.growthLevel})
              </h3>
              <ul className="list-disc list-inside">
                {mid.subGoals.map((sub) => (
                  <li key={sub.id}>
                    <label
                      className={
                        sub.completed ? "line-through text-gray-400" : ""
                      }
                    >
                      <input
                        type="checkbox"
                        checked={sub.completed}
                        onChange={() => toggleSubGoal(mid.id, sub.id)}
                        className="mr-2"
                      />
                      {sub.title} ({sub.timeframe} | {sub.resourceLevel} |{" "}
                      {sub.growthLevel})
                    </label>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* 選擇模式 */}
          <div className="mt-4">
            <label className="mr-2 font-semibold">選擇目標完成模式：</label>
            <select
              value={mode}
              onChange={(e) => setMode(e.target.value as any)}
              className="border p-2 rounded"
            >
              <option value="">請選擇模式</option>
              <option value="challenger">挑戰者模式</option>
              <option value="resource">資源模式</option>
              <option value="growth">成長模式</option>
            </select>
          </div>

          {/* 開始挑戰 */}
          <button
            onClick={handleStartChallenge}
            className="mt-4 bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
          >
            開始挑戰目標
          </button>
        </div>
      )}
    </div>
  );
}
