// utils/mockGoals.ts

export type SubGoal = {
  id: string;
  title: string;
  completed: boolean;
};

export type MidGoal = {
  id: string;
  title: string;
  subGoals: SubGoal[];
};

export type Goal = {
  id: string;
  title: string;
  description?: string;
  midGoals: MidGoal[];
};

// 初始假資料
export const initialGoals: Goal[] = [
  {
    id: "goal-1",
    title: "學習 Next.js",
    description: "建立一個可以使用 AI 幫助分解目標的 App",
    midGoals: [
      {
        id: "mid-1-1",
        title: "安裝與設定環境",
        subGoals: [
          { id: "sub-1-1-1", title: "安裝 Node.js", completed: true },
          { id: "sub-1-1-2", title: "建立 Next.js 專案", completed: false },
          { id: "sub-1-1-3", title: "設定 Tailwind CSS", completed: false },
        ],
      },
      {
        id: "mid-1-2",
        title: "建立首頁與列表頁",
        subGoals: [
          { id: "sub-1-2-1", title: "建立首頁 layout", completed: false },
          { id: "sub-1-2-2", title: "建立目標列表 component", completed: false },
        ],
      },
    ],
  },
  {
    id: "goal-2",
    title: "學習 AI 分解目標",
    midGoals: [
      {
        id: "mid-2-1",
        title: "設計資料結構",
        subGoals: [
          { id: "sub-2-1-1", title: "定義 Goal、MidGoal、SubGoal", completed: true },
          { id: "sub-2-1-2", title: "建立假資料", completed: false },
        ],
      },
      {
        id: "mid-2-2",
        title: "串接 OpenAI API",
        subGoals: [
          { id: "sub-2-2-1", title: "了解 OpenAI API 使用方式", completed: false },
          { id: "sub-2-2-2", title: "設計回傳中小目標的函式", completed: false },
        ],
      },
    ],
  },
  // 新增大目標示例
  {
    id: "goal-3",
    title: "健身計畫",
    description: "分解成中目標與小目標，逐步完成健身目標",
    midGoals: [
      {
        id: "mid-3-1",
        title: "增肌訓練",
        subGoals: [
          { id: "sub-3-1-1", title: "每週 3 次重量訓練", completed: false },
          { id: "sub-3-1-2", title: "每天核心訓練 15 分鐘", completed: false },
        ],
      },
      {
        id: "mid-3-2",
        title: "飲食控制",
        subGoals: [
          { id: "sub-3-2-1", title: "控制每日蛋白質攝取量", completed: false },
          { id: "sub-3-2-2", title: "減少高熱量零食", completed: false },
        ],
      },
    ],
  },
  {
    id: "goal-4",
    title: "學習英語",
    description: "從基礎到流利，每日學習小目標",
    midGoals: [
      {
        id: "mid-4-1",
        title: "單字與文法",
        subGoals: [
          { id: "sub-4-1-1", title: "每天學習 20 個單字", completed: false },
          { id: "sub-4-1-2", title: "每週完成一次文法練習", completed: false },
        ],
      },
      {
        id: "mid-4-2",
        title: "聽說讀寫",
        subGoals: [
          { id: "sub-4-2-1", title: "每天聽英語 30 分鐘", completed: false },
          { id: "sub-4-2-2", title: "每週練習 1 次口說", completed: false },
        ],
      },
    ],
  },
];
