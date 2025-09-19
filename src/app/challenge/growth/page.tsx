"use client";

import { useState } from "react";

type SubGoal = { id: string; title: string; completed: boolean };
type MidGoal = { id: string; title: string; subGoals: SubGoal[] };
type Goal = { title: string; midGoals: MidGoal[] };

const mockGoal: Goal = {
  title: "健身計畫",
  midGoals: [
    {
      id: "mid-1",
      title: "有氧運動",
      subGoals: [
        { id: "sub-1", title: "慢跑 30 分鐘", completed: false },
        { id: "sub-2", title: "騎單車 30 分鐘", completed: false },
      ],
    },
    {
      id: "mid-2",
      title: "重量訓練",
      subGoals: [
        { id: "sub-3", title: "深蹲 3 組", completed: false },
        { id: "sub-4", title: "伏地挺身 3 組", completed: false },
      ],
    },
  ],
};

export default function GrowthModePage() {
  const [goal, setGoal] = useState<Goal>(mockGoal);
  const [exp, setExp] = useState(0);

  const toggleSubGoal = (midId: string, subId: string) => {
    const updated = {
      ...goal,
      midGoals: goal.midGoals.map((mid) => {
        if (mid.id === midId) {
          const allCompletedBefore = mid.subGoals.every((s) => s.completed);
          return {
            ...mid,
            subGoals: mid.subGoals.map((sub) => {
              if (sub.id === subId && !sub.completed) {
                setExp(exp + 5); // 每完成小目標 +5 經驗
                return { ...sub, completed: true };
              } else if (sub.id === subId && sub.completed) {
                setExp(exp - 5); // 取消勾選扣經驗
                return { ...sub, completed: false };
              }
              return sub;
            }),
          };
        }
        return mid;
      }),
    };
    setGoal(updated);

    // 如果中目標所有小目標完成，加額外經驗
    goal.midGoals.forEach((mid) => {
      if (mid.id === midId && mid.subGoals.every((s) => s.completed)) {
        setExp((prev) => prev + 10);
      }
    });
  };

  return (
    <div className="min-h-screen p-8 bg-[var(--background)] text-[var(--foreground)] font-sans">
      <h1 className="text-3xl font-bold mb-4">成長模式 - {goal.title}</h1>
      <p className="mb-6">經驗值: {exp}</p>

      {goal.midGoals.map((mid) => (
        <div key={mid.id} className="mb-4 pl-4">
          <h2 className="font-semibold">{mid.title}</h2>
          <ul className="list-disc list-inside">
            {mid.subGoals.map((sub) => (
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
    </div>
  );
}
