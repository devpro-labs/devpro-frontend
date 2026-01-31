// my own ui

// import { SignupForm } from "@/components/signup/signup"
// import { Header } from "@/components/ui/header"
// import Link from "next/link"

// export default function SignupPage() {
//   return (
//     <main className="max-h-screen bg-background overflow-hidden">
//       <Header />
//       <div className="container mx-auto flex items-center justify-center px-4 py-12">
//         <div className="w-full max-w-md">
//           <div className="mb-8 text-center">
//             <h1 className="text-3xl font-bold mb-2">Create your account</h1>

//           </div>

//           <SignupForm />

//           <p className="mt-2 text-center text-sm text-muted-foreground">
//             Already have an account?{" "}
//             <Link href="/login" className="text-primary hover:underline">
//               Log in
//             </Link>
//           </p>
//         </div>
//       </div>
//     </main>
//   )
// }

'use client'

import { SignUp } from '@clerk/nextjs'

export default function Home() {

  return (
    <div className='flex justify-center items-center min-h-screen'>
      <SignUp />
    </div>
  )

}