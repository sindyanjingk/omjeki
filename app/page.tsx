import Features from "@/components/landing/Features";
import Hero from "@/components/landing/Hero";
import HowItWorks from "@/components/landing/HowItWorks";


export default function HomePage() {
  return (
    <main className="bg-white text-gray-900">
      <Hero />
      <Features />
      <HowItWorks />
    </main>
  );
}
