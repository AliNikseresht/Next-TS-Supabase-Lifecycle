import LogoutButton from "@/components/ui/LogoutButton";
import UserInfo from "@/components/ui/UserInfo";

export default function Home() {
  return (
    <div className="max-w-lg mx-auto p-6 bg-gray-100 shadow-md rounded-lg">
      <h1 className="text-2xl font-bold mb-4">داشبورد</h1>
      <UserInfo />
      <LogoutButton />
    </div>
  );
}
