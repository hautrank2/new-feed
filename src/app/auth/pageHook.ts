import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import z from "zod";
import { signIn } from "next-auth/react";
import { AuthPageProps } from "./page";

export const LoginSchema = z.object({
  usernameOrEmail: z.string().min(1, "Required"),
  password: z.string().min(1, "Required"),
});

export type LoginValues = z.infer<typeof LoginSchema>;

export const useAuth = ({ prePathname }: AuthPageProps) => {
  const form = useForm<LoginValues>({ resolver: zodResolver(LoginSchema) });

  const handleLoginGoogle = async () => {
    // TODO: Wire to your Google OAuth. Example (NextAuth): signIn("google")
    await signIn("google", { callbackUrl: prePathname ?? "/" });
  };

  const handleLogin = async () => {};

  return {
    form,
    handleLogin,
    handleLoginGoogle,
  };
};
