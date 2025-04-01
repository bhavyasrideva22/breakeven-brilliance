
import BreakEvenCalculator from "@/components/BreakEvenCalculator";

const Index = () => {
  return (
    <div className="min-h-screen bg-cream py-8 px-4">
      <header className="max-w-5xl mx-auto text-center mb-8">
        <h1 className="text-3xl md:text-4xl font-bold text-primary mb-4">Break-Even Brilliance</h1>
        <p className="text-lg text-charcoal/80 max-w-3xl mx-auto">
          Make smarter business decisions with our powerful break-even analysis calculator.
          Calculate your break-even point, visualize costs vs. revenue, and plan for profitability.
        </p>
      </header>
      
      <main className="pb-16">
        <BreakEvenCalculator />
      </main>
      
      <footer className="max-w-5xl mx-auto mt-16 text-center text-charcoal/60 text-sm">
        <p>© 2023 Break-Even Brilliance. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default Index;
