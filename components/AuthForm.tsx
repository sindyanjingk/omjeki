// components/AuthForm.tsx
"use client";

import { Loader2Icon } from "lucide-react";
import { useForm } from "react-hook-form";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";

interface AuthFormProps {
  type: "login" | "register";
}

export default function AuthForm({ type }: AuthFormProps) {
  const router = useRouter();
  const [errorMsg, setErrorMsg] = useState("");

  const {
    handleSubmit,
    register,
    formState: { errors, isSubmitting },
    setError,
    reset,
  } = useForm({
    defaultValues: {
      email: "",
      password: "",
    }
  });

  const onSubmit = async (data: any) => {
    setErrorMsg("");
    const res = await signIn("credentials", {
      redirect: false,
      username: data.email, // Sesuai dengan field "username" di credentials
      password: data.password,
    });

    if (res?.error) {
      setErrorMsg("Email atau password salah");
    } else if (res?.ok) {
      router.push("/dashboard"); // ganti sesuai rute tujuan setelah login
    }
  };

  return (
    <div className="w-full max-w-md mx-auto mt-16 bg-white rounded-2xl shadow-lg p-8">
      <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">
        {type === "login" ? "Welcome Back!" : "Create an Account"}
      </h2>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <input
          {...register("email", { required: "Email wajib di isi" })}
          type="email"
          placeholder="Email"
          className="w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        {errors.email && <div className="text-sm text-red-500">{errors.email.message}</div>}

        <input
          {...register("password", { required: "Password wajib di isi" })}
          type="password"
          placeholder="Password"
          className="w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        {errors.password && <div className="text-sm text-red-500">{errors.password.message}</div>}

        {errorMsg && <div className="text-sm text-red-500">{errorMsg}</div>}

        <button
          type="submit"
          className="w-full py-3 bg-blue-600 flex items-center justify-center text-white rounded-xl hover:bg-blue-700 transition"
        >
          {isSubmitting ? <Loader2Icon className="animate-spin" /> : "Login"}
        </button>
      </form>
    </div>
  );
}
