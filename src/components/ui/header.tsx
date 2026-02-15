"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"
import { Code2 } from "lucide-react"
import { useEffect, useState } from "react"
import { SignInButton, useAuth, useUser } from "@clerk/nextjs"
import { Atom } from "react-loading-indicators"
import Loader from "./Loader"
interface NavLink {
  name: string
  href: string
}

export function Header() {

  const { isLoaded, isSignedIn, user } = useUser();

  const navLinks: Array<NavLink> = [
    { name: "Features", href: "#features" },
    { name: "Frameworks", href: "#frameworks" },
    { name: "Pricing", href: "#pricing" },
  ];

  const authLinks: Array<NavLink> = [
    ...navLinks,
    { name: "Problems", href: "/problems" },
    { name: "Profile", href: `/profile/${user?.username || 'me'}` },
  ];

  const { signOut } = useAuth();



  if (!isLoaded) {
    return (
      <Loader />
    );
  }


  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
      className="sticky min-w-full top-0 z-50 border-b border-border/40 bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60 flex justify-center items-center"
    >
      <div className="w-full flex h-16 items-center justify-around px-4">
        <div className="flex justify-center items-center gap-8">
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
              <Code2 className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold">DevPro</span>
          </Link>

          <nav className="hidden items-center gap-6 md:flex">
            {isSignedIn ? authLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                {link.name}
              </Link>
            )) : navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                {link.name}
              </Link>
            ))}
          </nav>
        </div>

        <div className="flex items-center gap-3">
          {isSignedIn && (
            <div className="text-sm text-muted-foreground flex items-center gap-4">
              <div>Hello, {user?.firstName || "User"}</div>
              <div>
                <Button variant="link" className="p-0" onClick={() => signOut()}>
                  Sign Out
                </Button>
              </div>
            </div>
          )}

          {!isSignedIn && (
            <SignInButton />
          )}
        </div>
      </div>
    </motion.header>
  )
}
