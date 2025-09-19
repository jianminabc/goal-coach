"use client";

import { useState } from "react";

type SubGoal = { id: string; title: string; completed: boolean };
type MidGoal = { id: string; title: string; subGoals: SubGoal[]; completed?: boolean };
type Goal = { title: string; midGoals: MidGoal[] };

interface ChallengePageProps {
  goal: Goal;
}

export default function ChallengerPage() {
  // 這裡暫時用範例目標，可改成從 HomePage 傳入或 localStorage
  const initialGoal: Goal = {
    title: "學習程式設計",
    midGoals: [
      {
        id: "mid-1",
        title: "掌握基礎語法",
        subGoals: [
          { id: "sub-1", title: "完成 JS 教程", completed: false },
          { id: "sub-2", title: "寫簡單練習題", completed: false },
        ],
      },
      {
        id: "mid-2",
        title: "進階專案練習",
        subGoals: [
          { id: "sub-3", title: "製作 ToDo App", completed: false },
          { id: "sub-4", title: "製作小遊戲", completed: false },
        ],
      },
    ],
  };

  const [goal, setGoal] = useState<Goal>(initialGoal);
  const [showTree, setShowTree] = useState(false);
  const [completed, setCompleted] = useState(false);

  // 勾選小目標
  const toggleSubGoal = (midId: string, subId: string) => {
    const updatedGoal = {
      ...goal,
      midGoals: goal.midGoals.map(mid => {
        if (mid.id === midId) {
          const newSubGoals = mid.subGoals.map(sub =>
            sub.id === subId ? { ...sub, completed: !sub.completed } : sub
          );
          return { ...mid, subGoals: newSubGoals, completed: newSubGoals.every(s => s.completed) };
        }
        return mid;
      }),
    };
    setGoal(updatedGoal);

    // 檢查是否完成大目標
    const allMidCompleted = updatedGoal.midGoals.every(mid => mid.completed);
    if (allMidCompleted) {
      setCompleted(true);
    }
  };

  return (
    <div className="min-h-screen p-8 bg-[var(--background)] text-[var(--foreground)] font-sans">
      {!showTree ? (
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-4">歡迎進入挑戰者模式！</h1>
          <button
            onClick={() => setShowTree(true)}
            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
          >
            開始挑戰目標
          </button>
        </div>
      ) : (
        <div>
          <h2 className="text-2xl font-bold mb-4">{goal.title}</h2>
          {goal.midGoals.map(mid => (
            <div key={mid.id} className="mb-4 pl-4 border-l-2 border-gray-300">
              <h3 className="font-semibold">
                {mid.title} {mid.completed && <span className="text-green-600">(已完成)</span>}
              </h3>
              <ul className="list-disc list-inside pl-4">
                {mid.subGoals.map(sub => (
                  <li key={sub.id}>
                    <label className={sub.completed ? "line-through text-gray-400" : ""}>
                      <input
                        type="checkbox"
                        checked={sub.completed}
                        onChange={() => toggleSubGoal(mid.id, sub.id)}
                        className="mr-2"
                      />
                      {sub.title}
                    </label>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {completed && (
            <div className="mt-6 p-4 bg-green-200 text-green-800 font-bold rounded">
              🎉 恭喜你已完成大目標！
            </div>
          )}
        </div>
      )}
    </div>
  );
}
