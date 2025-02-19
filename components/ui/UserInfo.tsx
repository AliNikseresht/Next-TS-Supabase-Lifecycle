"use client";

import { RootState } from "@/store";
import { useSelector } from "react-redux";


export default function UserInfo() {
  const user = useSelector((state: RootState) => state.user);

  return user.id ? <p>خوش آمدید، {user.name}!</p> : <p>لطفاً وارد شوید.</p>;
}
