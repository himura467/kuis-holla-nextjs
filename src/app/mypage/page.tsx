"use client";

import { useRouter } from "next/navigation";

export default function MyPage() {
  const router = useRouter();

  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-4">
      <h1 className="text-2xl font-bold mb-6">マイページ</h1>
      <div className="flex flex-col space-y-4">
        <button
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          onClick={() => router.push("/profile")}
        >
          プロフィール変更
        </button>
        <button
          className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
          onClick={() => router.push("/event")}
        >
          イベントに参加
        </button>
        <button
          className="px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600"
          onClick={() => router.push("/event_create")}
        >
          イベントを開催
        </button>
      </div>
    </main>
  );
}
