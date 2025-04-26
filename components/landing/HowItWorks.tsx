// components/HowItWorks.tsx
const steps = [
    "Browse the menu and choose your meal",
    "Place your order and pay online",
    "Track your delivery in real-time",
  ];
  
  export default function HowItWorks() {
    return (
      <section className="bg-gray-50 py-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-10">How It Works</h2>
          <ol className="space-y-6 text-left max-w-md mx-auto">
            {steps.map((step, index) => (
              <li key={index} className="flex items-start space-x-3">
                <div className="text-white bg-orange-500 rounded-full w-8 h-8 flex items-center justify-center font-bold">
                  {index + 1}
                </div>
                <p className="text-gray-700">{step}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>
    );
  }
  