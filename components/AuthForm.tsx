// components/AuthForm.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

interface AuthFormProps {
  type: "login" | "register";
}

export default function AuthForm({ type }: AuthFormProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Simulasi login / register
    if (type === "login") {
      console.log("Logging in with", { email, password });
    } else {
      console.log("Registering with", { email, password });
    }

    // Redirect misalnya ke dashboard
    router.push("/");
  };

  return (
    <div className="w-full max-w-md mx-auto mt-16 bg-white rounded-2xl shadow-lg p-8">
      <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">
        {type === "login" ? "Welcome Back!" : "Create an Account"}
      </h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="email"
          placeholder="Email"
          className="w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          className="w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button
          type="submit"
          className="w-full py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition"
        >
          {type === "login" ? "Login" : "Register"}
        </button>
      </form>
      <p className="mt-4 text-center text-sm text-gray-600">
        {type === "login" ? (
          <>
            Don't have an account?{" "}
            <a href="/auth/register" className="text-blue-600 hover:underline">
              Register
            </a>
          </>
        ) : (
          <>
            Already have an account?{" "}
            <a href="/auth/login" className="text-blue-600 hover:underline">
              Login
            </a>
          </>
        )}
      </p>
    </div>
  );
}
