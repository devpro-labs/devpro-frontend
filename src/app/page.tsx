import { CTA } from "@/components/home/cta";
import { Features } from "@/components/home/features";
import { Hero } from "@/components/home/hero";
import { Footer } from "@/components/ui/footer";
import { Frameworks } from "@/components/home/framework";
import { Header } from "@/components/ui/header";


export default function HomePage() {
  return (
    <main className="min-h-screen bg-background">
      <Header />
      <Hero />
      <Frameworks />
      <Features />
      <CTA />
      <Footer />
    </main>
  )
}
