
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/components/ui/use-toast";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ReferenceLine, ResponsiveContainer } from 'recharts';
import { Calculator, Download, Mail } from 'lucide-react';
import BreakEvenPDFReport from './BreakEvenPDFReport';
import EmailForm from './EmailForm';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';

interface BreakEvenData {
  units: number;
  revenue: number;
  totalCost: number;
  profit: number;
}

const BreakEvenCalculator = () => {
  const { toast } = useToast();
  const [fixedCosts, setFixedCosts] = useState<number>(1000000);
  const [variableCost, setVariableCost] = useState<number>(500);
  const [sellingPrice, setSellingPrice] = useState<number>(1200);
  const [breakEvenPoint, setBreakEvenPoint] = useState<number>(0);
  const [chartData, setChartData] = useState<BreakEvenData[]>([]);
  const [showEmailForm, setShowEmailForm] = useState<boolean>(false);
  
  // Calculate break-even point
  useEffect(() => {
    if (sellingPrice <= variableCost) {
      setBreakEvenPoint(0);
      setChartData([]);
      return;
    }

    const bep = Math.ceil(fixedCosts / (sellingPrice - variableCost));
    setBreakEvenPoint(bep);
    
    // Generate chart data
    generateChartData(bep);
  }, [fixedCosts, variableCost, sellingPrice]);

  const generateChartData = (bep: number) => {
    const maxUnits = Math.ceil(bep * 2);
    const step = Math.max(1, Math.floor(maxUnits / 10));
    
    const newData: BreakEvenData[] = [];
    
    for (let units = 0; units <= maxUnits; units += step) {
      const revenue = units * sellingPrice;
      const totalCost = fixedCosts + (units * variableCost);
      const profit = revenue - totalCost;
      
      newData.push({
        units,
        revenue,
        totalCost,
        profit
      });
    }
    
    setChartData(newData);
  };

  const formatCurrency = (value: number): string => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(value);
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement>, 
    setter: React.Dispatch<React.SetStateAction<number>>
  ) => {
    const value = parseFloat(e.target.value);
    if (!isNaN(value) && value >= 0) {
      setter(value);
    }
  };

  const profit = breakEvenPoint * sellingPrice - (fixedCosts + breakEvenPoint * variableCost);
  const contribution = sellingPrice - variableCost;
  const contributionMargin = contribution / sellingPrice * 100;

  return (
    <div className="max-w-4xl mx-auto p-4 animate-fade-in">
      <Card className="shadow-lg border-primary/20">
        <CardHeader className="bg-primary text-primary-foreground">
          <CardTitle className="flex items-center text-2xl md:text-3xl">
            <Calculator className="mr-2" />
            Break-Even Analysis Calculator
          </CardTitle>
          <CardDescription className="text-primary-foreground/80 text-base md:text-lg">
            Calculate the point where total revenue equals total costs
          </CardDescription>
        </CardHeader>
        
        <CardContent className="pt-6 pb-2">
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="fixedCosts" className="text-base mb-1 block">
                    Fixed Costs (₹)
                  </Label>
                  <Input
                    id="fixedCosts"
                    type="number"
                    value={fixedCosts}
                    onChange={(e) => handleInputChange(e, setFixedCosts)}
                    className="number-input"
                    min="0"
                  />
                </div>
                
                <div>
                  <Label htmlFor="variableCost" className="text-base mb-1 block">
                    Variable Cost Per Unit (₹)
                  </Label>
                  <Input
                    id="variableCost"
                    type="number"
                    value={variableCost}
                    onChange={(e) => handleInputChange(e, setVariableCost)}
                    className="number-input"
                    min="0"
                  />
                </div>
                
                <div>
                  <Label htmlFor="sellingPrice" className="text-base mb-1 block">
                    Selling Price Per Unit (₹)
                  </Label>
                  <Input
                    id="sellingPrice"
                    type="number"
                    value={sellingPrice}
                    onChange={(e) => handleInputChange(e, setSellingPrice)}
                    className="number-input"
                    min="0"
                  />
                </div>
              </div>
              
              <div className="mt-6 p-4 bg-secondary/20 rounded-md">
                <h3 className="text-lg font-semibold text-primary mb-2">Results:</h3>
                <div className="space-y-2">
                  <p className="font-medium">Break-Even Point: <span className="text-primary">{breakEvenPoint.toLocaleString()} units</span></p>
                  <p className="font-medium">Revenue at Break-Even: <span className="text-primary">{formatCurrency(breakEvenPoint * sellingPrice)}</span></p>
                  <p className="font-medium">Contribution per Unit: <span className="text-primary">{formatCurrency(contribution)}</span></p>
                  <p className="font-medium">Contribution Margin: <span className="text-primary">{contributionMargin.toFixed(2)}%</span></p>
                </div>
              </div>
            </div>
            
            <div className="chart-animate-in">
              <h3 className="text-lg font-semibold text-primary mb-3">Break-Even Analysis Chart</h3>
              <div className="h-[300px]">
                {chartData.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={chartData} margin={{ top: 5, right: 5, left: 5, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                      <XAxis 
                        dataKey="units" 
                        label={{ value: 'Units Sold', position: 'insideBottomRight', offset: -10 }} 
                      />
                      <YAxis 
                        tickFormatter={(value) => `₹${value >= 1000 ? `${(value/1000).toFixed(0)}K` : value}`}
                        label={{ value: 'Amount (₹)', angle: -90, position: 'insideLeft' }} 
                      />
                      <Tooltip 
                        formatter={(value: number) => formatCurrency(value)} 
                        labelFormatter={(value) => `Units: ${value}`}
                      />
                      <Legend />
                      <Line 
                        type="monotone" 
                        dataKey="revenue" 
                        name="Total Revenue" 
                        stroke="#7ac9a7" 
                        strokeWidth={3}
                        dot={{ r: 0 }}
                        activeDot={{ r: 8 }}
                      />
                      <Line 
                        type="monotone" 
                        dataKey="totalCost" 
                        name="Total Cost" 
                        stroke="#e9c46a" 
                        strokeWidth={3}
                        dot={{ r: 0 }}
                        activeDot={{ r: 8 }}
                      />
                      <Line 
                        type="monotone" 
                        dataKey="profit" 
                        name="Profit/Loss" 
                        stroke="#245e4f" 
                        strokeWidth={2}
                        strokeDasharray="5 5"
                        dot={{ r: 0 }}
                        activeDot={{ r: 6 }}
                      />
                      <ReferenceLine 
                        x={breakEvenPoint} 
                        stroke="#ef4444" 
                        strokeWidth={2}
                        label={{ value: 'Break-Even', position: 'top', fill: '#ef4444' }} 
                      />
                    </LineChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="flex items-center justify-center h-full bg-muted/30 rounded-md">
                    <p className="text-muted-foreground text-center">
                      Selling price must be greater than variable cost to calculate break-even point.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
          
          <Separator className="my-6" />
          
          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-primary">Understanding Break-Even Analysis</h3>
            <p>Break-even analysis is a vital financial calculation that determines the point at which total revenue equals total costs. At this critical juncture, a business neither makes a profit nor incurs a loss.</p>
            
            <h4 className="text-lg font-medium text-primary mt-4">Key Components:</h4>
            <ul className="list-disc pl-5 space-y-2">
              <li><strong>Fixed Costs:</strong> Expenses that remain constant regardless of production volume (rent, salaries, insurance).</li>
              <li><strong>Variable Costs:</strong> Expenses that change directly with production volume (raw materials, direct labor, packaging).</li>
              <li><strong>Selling Price:</strong> The amount charged to customers per unit of product or service.</li>
              <li><strong>Contribution Margin:</strong> The difference between selling price and variable cost, representing how much each unit sold contributes to covering fixed costs and generating profit.</li>
            </ul>
            
            <h4 className="text-lg font-medium text-primary mt-4">How to Use This Calculator:</h4>
            <ol className="list-decimal pl-5 space-y-2">
              <li>Enter your total fixed costs.</li>
              <li>Enter the variable cost per unit.</li>
              <li>Enter the selling price per unit.</li>
              <li>The calculator will automatically compute your break-even point in units and revenue.</li>
              <li>The chart visualizes where your costs and revenue intersect.</li>
            </ol>
            
            <p className="mt-4">Understanding your break-even point helps with pricing strategies, production planning, and assessing business viability. It answers the crucial question: "How many units must I sell to cover all my costs?"</p>
          </div>
        </CardContent>
        
        <CardFooter className="flex flex-col sm:flex-row justify-between items-center gap-4 p-6 bg-primary/5">
          <div className="text-sm text-charcoal/80">
            Analyze your business profitability with accurate break-even calculations.
          </div>
          
          <div className="flex space-x-3">
            <BreakEvenPDFReport 
              fixedCosts={fixedCosts}
              variableCost={variableCost}
              sellingPrice={sellingPrice}
              breakEvenPoint={breakEvenPoint}
              contributionMargin={contributionMargin}
            />
            
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline" className="flex items-center gap-2">
                  <Mail size={16} />
                  <span>Email Report</span>
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Send Break-Even Analysis Report</DialogTitle>
                </DialogHeader>
                <EmailForm 
                  reportData={{
                    fixedCosts,
                    variableCost,
                    sellingPrice,
                    breakEvenPoint,
                    revenue: breakEvenPoint * sellingPrice,
                    contributionMargin
                  }}
                />
              </DialogContent>
            </Dialog>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
};

export default BreakEvenCalculator;
