import type { Metadata } from "next";
import { AuthForm } from "@/components/auth-form";

export const metadata: Metadata = {
  title: "Sign In",
  description: "Sign in to your account.",
};

export default function LoginPage() {
  return <AuthForm mode="login" />;
}
