"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { setUser } from "@/store/slices/userSlice";
import { supabase } from "@/utils/supabaseClient";
import { useRouter } from "next/navigation";
import { authForm } from "@/data/authData";
import Loading from "../loading";
import Link from "next/link";

// Zod schema definition for form validation
const schema = z.object({
  email: z.string().email(`${authForm.zodEmailErrorMessage}`),
  password: z.string().min(6, `${authForm.zodPasswordErrorMessage}`),
});

type FormData = z.infer<typeof schema>;

interface AuthFormProps {
  isLogin: boolean;
}

export default function AuthForm({ isLogin }: AuthFormProps) {
  const dispatch = useDispatch();
  const [error, setError] = useState<string>("");
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const handleAuth = async (data: FormData) => {
    setError("");

    let result;
    if (isLogin) {
      result = await supabase.auth.signInWithPassword(data);
    } else {
      result = await supabase.auth.signUp(data);
    }

    if (result.error) {
      setError(result.error.message);
    } else {
      const { session } = result.data;
      if (session) {
        await supabase.auth.setSession({
          access_token: session.access_token,
          refresh_token: session.refresh_token,
        });

        dispatch(
          setUser({
            id: session.user.id,
            name: session.user.email || "",
            email: session.user.email || "",
          })
        );

        router.push("/");
      }
    }
  };

  return (
    <div className="w-full min-h-screen p-6 bg-white shadow-md rounded-lg flex flex-col items-center justify-center">
      <div className="flex gap-5 items-center flex-col justify-center">
        <div className="w-11 h-11 rounded-full bg-[#818181]"></div>
        <h2 className="text-4xl font-semibold mb-4 text-[#212121]">
          {isLogin ? authForm.title[0] : authForm.title[1]}
        </h2>
      </div>
      {error && <p className="text-red-500 text-sm">{error}</p>}

      <div className="flex items-center w-full justify-center gap-[4em]">
        <form onSubmit={handleSubmit(handleAuth)} className="max-w-md w-full">
          <div className="w-full flex justify-center">
            <h2 className="text-xl font-semibold mb-4 text-[#212121]">
              {isLogin ? authForm.title[0] : authForm.title[1]}
            </h2>
          </div>
          {authForm.fields.map((field) => (
            <div key={field.name} className="flex flex-col gap-1">
              <label htmlFor={field.name} className="text-[#818181]">
                {field.label}
              </label>
              <input
                type={field.type}
                {...register(field.name as keyof FormData)}
                className="w-full p-2 mb-2 border border-[#818181] rounded-xl bg-transparent outline-none"
              />
              {errors[field.name as keyof FormData] && (
                <p className="text-red-500 text-xs">
                  {errors[field.name as keyof FormData]?.message}
                </p>
              )}
            </div>
          ))}

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-[#818181] text-white p-2 rounded-3xl mt-4"
          >
            {isSubmitting ? (
              <Loading />
            ) : isLogin ? (
              `${authForm.submitButton.loginText}`
            ) : (
              `${authForm.submitButton.signInText}`
            )}
          </button>
        </form>
        <div className="flex flex-col items-center justify-center">
          <div className="w-[0.1rem] h-48 bg-[#c3c3c3]"></div>
          <span className="my-4 text-[#818181]">OR</span>
          <div className="w-[0.1rem] h-48 bg-[#c3c3c3]"></div>
        </div>
        <div className="max-w-md w-full mt-[3em]">
          {authForm.autoLogin.map((item, index) => (
            <button
              key={index}
              className="flex justify-center items-center gap-1 my-3 border border-[#818181] text-[#212121] rounded-3xl p-2.5 w-72"
            >
              <span className="text-2xl">{item.icon}</span>
              {item.title}
            </button>
          ))}
        </div>
      </div>
      {authForm.accounts
        .filter((_, index) => index === (isLogin ? 0 : 1))
        .map((item, index) => (
          <Link
            key={index}
            href={item.link}
            className="text-[#212121] font-semibold mt-4"
          >
            {item.title}
          </Link>
        ))}
    </div>
  );
}
