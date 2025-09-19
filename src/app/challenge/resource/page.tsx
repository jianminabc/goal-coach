"use client";

import { useState } from "react";

type SubGoal = { id: string; title: string; completed: boolean };
type MidGoal = { id: string; title: string; subGoals: SubGoal[] };
type Goal = { title: string; midGoals: MidGoal[] };

const mockGoal: Goal = {
  title: "學習程式設計",
  midGoals: [
    {
      id: "mid-1",
      title: "基礎語法",
      subGoals: [
        { id: "sub-1", title: "學習變數與型別", completed: false },
        { id: "sub-2", title: "學習函式與流程控制", completed: false },
      ],
    },
    {
      id: "mid-2",
      title: "進階主題",
      subGoals: [
        { id: "sub-3", title: "物件導向", completed: false },
        { id: "sub-4", title: "非同步程式設計", completed: false },
      ],
    },
  ],
};

export default function ResourceModePage() {
  const [goal, setGoal] = useState<Goal>(mockGoal);
  const [resources, setResources] = useState(0);

  const toggleSubGoal = (midId: string, subId: string) => {
    const updated = {
      ...goal,
      midGoals: goal.midGoals.map((mid) =>
        mid.id === midId
          ? {
              ...mid,
              subGoals: mid.subGoals.map((sub) => {
                if (sub.id === subId) {
                  if (!sub.completed) setResources(resources + 10); // 每完成小目標加 10 資源
                  return { ...sub, completed: !sub.completed };
                }
                return sub;
              }),
            }
          : mid
      ),
    };
    setGoal(updated);
  };

  return (
    <div className="min-h-screen p-8 bg-[var(--background)] text-[var(--foreground)] font-sans">
      <h1 className="text-3xl font-bold mb-4">資源模式 - {goal.title}</h1>
      <p className="mb-6">目前資源點數: {resources}</p>

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
