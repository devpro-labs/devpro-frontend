"use client"

import type React from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card } from "@/components/ui/card"
import { motion } from "framer-motion"
import { Github } from "lucide-react"
import { use, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useAuth, useSignIn, useUser } from "@clerk/nextjs"
import Loader from "../ui/Loader"
import SITE_MAP from "@/lib/const/site_map"
import { checkUser } from "./api"
import { toast } from "sonner"

export function LoginForm() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const { isLoaded, signIn, setActive } = useSignIn();
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter();
  const { getToken } = useAuth()
  const { user } = useUser()
  const { signOut } = useAuth();


  if (!isLoaded) {
    return (
      <>
        <Loader />
      </>
    )
  }

  const checkUserUtil = async () => {
    const token = await getToken({ template: "devpro" }) ?? "";
    const apiResponse = await checkUser({
      username: user?.username ?? "",
      email: user?.primaryEmailAddress?.emailAddress ?? ""
    }, token);

    if (apiResponse.STATUS != 200) {
      console.log(401);
      toast.error("User verification failed", { duration: 3000 });
      signOut();
      return;
    }

    toast.success("Login successful!", { duration: 3000 });
    router.push(SITE_MAP.problems.Problems);
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    // Handle login logic here
    console.log("Login:", { email, password })
    try {
      const res = await signIn.create({
        identifier: email,
        password: password
      })
      await setActive({ session: res.createdSessionId })
      await checkUserUtil();


    } catch (error: any) {
      console.log(error)
      toast.error(error?.errors?.[0]?.message || "Login failed", { duration: 3000 });
    } finally {
      setIsLoading(false)
    }
  }

  const handleGoogleLogin = async () => {
    // Handle Google OAuth
    setIsLoading(true)
    console.log("Google login")
    try {
      await signIn.authenticateWithRedirect({
        strategy: "oauth_google",
        redirectUrl: SITE_MAP.auth.Login,
        redirectUrlComplete: SITE_MAP.auth.Login
      })

      await checkUserUtil();
    } catch (error: any) {
      console.log(error)
      toast.error(error?.errors?.[0]?.message || "Google login failed", { duration: 3000 });
    } finally {
      setIsLoading(false)
    }
  }

  const handleGithubLogin = async () => {
    // Handle GitHub OAuth
    console.log("GitHub login")
    setIsLoading(true)
    try {
      await signIn.authenticateWithRedirect({
        strategy: "oauth_github",
        redirectUrl: SITE_MAP.auth.Login,
        redirectUrlComplete: SITE_MAP.auth.Login
      })
      await checkUserUtil();
    } catch (error: any) {
      console.log(error)
      toast.error(error?.errors?.[0]?.message || "GitHub login failed", { duration: 3000 });
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      viewport={{ once: true }}
    >
      {isLoading && <Loader />}
      <Card className="p-6 border-border/50">
        <div className="space-y-4">
          <Button type="button" variant="outline" className="w-full bg-transparent" onClick={handleGoogleLogin}>
            <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
              <path
                fill="currentColor"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="currentColor"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="currentColor"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              />
              <path
                fill="currentColor"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              />
            </svg>
            Continue with Google
          </Button>

          <Button type="button" variant="outline" className="w-full bg-transparent" onClick={handleGithubLogin}>
            <Github className="mr-2 h-4 w-4" />
            Continue with GitHub
          </Button>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-border" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-card px-2 text-muted-foreground">Or continue with email</span>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Password</Label>
                <Link href="/forgot-password" className="text-xs text-primary hover:underline">
                  Forgot password?
                </Link>
              </div>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <Button type="submit" className="w-full">
              Log In
            </Button>
          </form>
        </div>
      </Card>
    </motion.div>
  )
}
