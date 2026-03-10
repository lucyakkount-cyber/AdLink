import { Routes, Route } from "react-router-dom"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { HeroSection } from "@/components/landing/hero-section"
import { ProblemSection } from "@/components/landing/problem-section"
import { SolutionSection } from "@/components/landing/solution-section"
import { FeaturesSection } from "@/components/landing/features-section"
import { StepsSection } from "@/components/landing/steps-section"
import { CTASection } from "@/components/landing/cta-section"

export default function App() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<>
            <HeroSection />
            <ProblemSection />
            <SolutionSection />
            <FeaturesSection />
            <StepsSection />
            <CTASection />
          </>} />
          <Route path="/login" element={<div className="mx-auto max-w-md px-4 py-10 lg:px-6 lg:py-16">
            <h1 className="text-2xl font-bold text-foreground sm:text-3xl">Login</h1>
            <p className="mt-1 text-muted-foreground">Please use Next.js server for login: <a href="http://localhost:3001/login" className="text-blue-600 hover:underline">http://localhost:3001/login</a></p>
          </div>} />
          <Route path="/signup" element={<div className="mx-auto max-w-md px-4 py-10 lg:px-6 lg:py-16">
            <h1 className="text-2xl font-bold text-foreground sm:text-3xl">Sign Up</h1>
            <p className="mt-1 text-muted-foreground">Please use Next.js server for signup: <a href="http://localhost:3001/signup" className="text-blue-600 hover:underline">http://localhost:3001/signup</a></p>
          </div>} />
          <Route path="/profile" element={<div className="mx-auto max-w-md px-4 py-10 lg:px-6 lg:py-16">
            <h1 className="text-2xl font-bold text-foreground sm:text-3xl">Profile</h1>
            <p className="mt-1 text-muted-foreground">Please use Next.js server for profile: <a href="http://localhost:3001/profile" className="text-blue-600 hover:underline">http://localhost:3001/profile</a></p>
          </div>} />
          <Route path="/business/dashboard" element={<div className="mx-auto max-w-md px-4 py-10 lg:px-6 lg:py-16">
            <h1 className="text-2xl font-bold text-foreground sm:text-3xl">Business Dashboard</h1>
            <p className="mt-1 text-muted-foreground">Please use Next.js server for dashboard: <a href="http://localhost:3001/business/dashboard" className="text-blue-600 hover:underline">http://localhost:3001/business/dashboard</a></p>
          </div>} />
          <Route path="*" element={<div className="mx-auto max-w-md px-4 py-10 lg:px-6 lg:py-16">
            <h1 className="text-2xl font-bold text-foreground sm:text-3xl">Page Not Found</h1>
            <p className="mt-1 text-muted-foreground">Use Next.js server for full functionality.</p>
            <p className="mt-2">
              <a href="http://localhost:3001" className="text-blue-600 hover:underline">Go to Next.js Server</a>
            </p>
          </div>} />
        </Routes>
      </main>
      <Footer />
    </div>
  )
}
