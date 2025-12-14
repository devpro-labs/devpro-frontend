import { LoginForm } from "@/components/signin/login"
import { Header } from "@/components/ui/header"
import Link from "next/link"

export default function LoginPage() {
  return (
    <main className="max-h-screen bg-background overflow-hidden">
      <Header />
      <div className="container mx-auto flex min-h-[calc(100vh-4rem)] items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">
          <div className="mb-8 text-center">
            <h1 className="text-3xl font-bold mb-2">Welcome back</h1>
           
          </div>

          <LoginForm />

          <p className="mt-6 text-center text-sm text-muted-foreground">
            {"Don't have an account? "}
            <Link href="/signup" className="text-primary hover:underline">
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </main>
  )
}
