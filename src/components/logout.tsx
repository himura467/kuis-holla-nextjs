"use client";

import { useRouter } from "next/navigation";
import axios from "axios";

export default function LogoutButton() {
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await axios.post(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/logout`,
        {},
        {
          withCredentials: true,
        },
      );
      router.push("/");
    } catch (err) {
      console.error("ログアウト失敗", err);
    }
  };

  return (
    <button className="logoutButton" onClick={handleLogout}>
      ログアウト
    </button>
  );
}
