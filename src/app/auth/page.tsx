"use client";

import * as React from "react";
import Link from "next/link";
import { Lock, Loader2, User, LogIn, ArrowRight, Chrome } from "lucide-react";
import { Button } from "~/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Separator } from "~/components/ui/separator";
import { useAuth } from "./pageHook";

export type AuthPageProps = {
  prePathname: string;
};
const AuthPage = (props: AuthPageProps) => {
  const { form, handleLogin, loading, handleLoginGoogle } = useAuth(props);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = form;

  return (
    <div className="min-h-screen w-full bg-gradient-to-b from-background to-muted flex items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-xl border-muted-foreground/10">
        <CardHeader className="space-y-2 text-center">
          <CardTitle className="text-2xl font-semibold tracking-tight">
            Welcome back
          </CardTitle>
          <CardDescription>
            Sign in to continue to your blog admin.
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit(handleLogin)} className="grid gap-4">
            {/* Username / Email */}
            <div className="grid gap-2">
              <Label htmlFor="usernameOrEmail">Username or Email</Label>
              <div className="relative">
                <Input
                  id="usernameOrEmail"
                  placeholder="you@example.com"
                  autoComplete="username"
                  {...register("usernameOrEmail")}
                />
                <User className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 opacity-60" />
              </div>
              {errors.usernameOrEmail && (
                <p className="text-sm text-destructive">
                  {errors.usernameOrEmail.message}
                </p>
              )}
            </div>

            {/* Password */}
            <div className="grid gap-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  autoComplete="current-password"
                  {...register("password")}
                />
                <Lock className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 opacity-60" />
              </div>
              {errors.password && (
                <p className="text-sm text-destructive">
                  {errors.password.message}
                </p>
              )}
            </div>

            {/* Submit */}
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Signing in...
                </>
              ) : (
                <>
                  <LogIn className="mr-2 h-4 w-4" />
                  Sign In
                </>
              )}
            </Button>

            {/* Divider */}
            <div className="flex items-center gap-3">
              <Separator className="flex-1" />
              <span className="text-xs text-muted-foreground">or</span>
              <Separator className="flex-1" />
            </div>

            {/* OAuth */}
            <Button
              type="button"
              variant="outline"
              className="w-full"
              onClick={handleLoginGoogle}
            >
              <Chrome className="mr-2 h-4 w-4" />
              Continue with Google
            </Button>
          </form>
        </CardContent>

        <CardFooter className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            Don&apos;t have an account?
          </p>
          <Button asChild variant="ghost" size="sm" className="gap-1">
            <Link href="/signup">
              Sign up
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default AuthPage;
