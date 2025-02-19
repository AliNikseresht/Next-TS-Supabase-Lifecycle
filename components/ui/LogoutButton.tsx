"use client";

import { logout } from "@/store/slices/userSlice";
import { supabase } from "@/utils/supabaseClient";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";

export default function LogoutButton() {
  const dispatch = useDispatch();
  const router = useRouter();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    dispatch(logout());
    router.push("/auth/login");
  };

  return (
    <button
      onClick={handleLogout}
      className="bg-red-500 text-white p-2 rounded"
    >
      خروج
    </button>
  );
}
