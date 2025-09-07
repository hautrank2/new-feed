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
  const [loading, setLoading] = useState(false);

  const form = useForm<LoginValues>({ resolver: zodResolver(LoginSchema) });

  const onSubmit = async (values: LoginValues) => {
    try {
      setLoading(true);
      // TODO: Replace with your Credentials login (NextAuth, custom API, etc.)
      // Example (NextAuth): await signIn("credentials", { redirect: false, ...values })
      await new Promise((r) => setTimeout(r, 900));
      console.log("Login with:", values);
      // If success, route to your POST dashboard, e.g., router.push("/posts")
    } finally {
      setLoading(false);
    }
  };

  const handleLoginGoogle = async () => {
    // TODO: Wire to your Google OAuth. Example (NextAuth): signIn("google")
    await signIn("google", { callbackUrl: prePathname ?? "/" });
  };

  const handleLogin = async () => {};

  return {
    form,
    loading,
    handleLogin,
    handleLoginGoogle,
  };
};
