// app/auth/register/page.tsx
import AuthForm from "@/components/AuthForm";

export default function RegisterPage() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-100">
      <AuthForm type="register" />
    </main>
  );
}
