import type { Metadata } from "next";
import { AuthForm } from "@/components/auth-form";

export const metadata: Metadata = {
  title: "Create Account",
  description: "Create a new account.",
};

export default function RegisterPage() {
  return <AuthForm mode="register" />;
}
