// components/Features.tsx
import { LucidePizza, Clock4, Smartphone } from "lucide-react";

const features = [
  { icon: <LucidePizza size={28} />, title: "Delicious Meals", desc: "Wide variety from top restaurants" },
  { icon: <Clock4 size={28} />, title: "Fast Delivery", desc: "Get your food in under 30 minutes" },
  { icon: <Smartphone size={28} />, title: "Easy Ordering", desc: "User-friendly app experience" },
];

export default function Features() {
  return (
    <section id="features" className="py-20 bg-white px-6">
      <div className="max-w-5xl mx-auto text-center">
        <h2 className="text-3xl font-bold mb-10">Why Choose Us?</h2>
        <div className="grid md:grid-cols-3 gap-8">
          {features.map((f, i) => (
            <div key={i} className="p-6 bg-orange-50 rounded-xl shadow hover:shadow-md transition">
              <div className="mb-4 text-orange-500">{f.icon}</div>
              <h3 className="text-xl font-semibold mb-2">{f.title}</h3>
              <p className="text-gray-600">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
