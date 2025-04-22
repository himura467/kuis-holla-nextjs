"use client"; // クライアントコンポーネントとしてマークする必要あり
import Shinkitouroku from "../../components/shinkitouroku";

export default function Home() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-100 p-8">
      <Shinkitouroku />
    </main>
  );
}
