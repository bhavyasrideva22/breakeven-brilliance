
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { Mail } from 'lucide-react';

interface ReportData {
  fixedCosts: number;
  variableCost: number;
  sellingPrice: number;
  breakEvenPoint: number;
  revenue: number;
  contributionMargin: number;
}

interface EmailFormProps {
  reportData: ReportData;
}

const EmailForm = ({ reportData }: EmailFormProps) => {
  const { toast } = useToast();
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [message, setMessage] = useState(`Here is the break-even analysis report you requested.\n\nBreak-Even Point: ${reportData.breakEvenPoint.toLocaleString()} units\nRevenue at Break-Even: ₹${reportData.revenue.toLocaleString()}\nContribution Margin: ${reportData.contributionMargin.toFixed(2)}%`);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast({
        title: "Invalid Email",
        description: "Please enter a valid email address.",
        variant: "destructive",
      });
      setIsLoading(false);
      return;
    }

    // Simulate sending email
    setTimeout(() => {
      toast({
        title: "Email Sent",
        description: `The break-even analysis report has been sent to ${email}.`,
      });
      setIsLoading(false);
    }, 1500);

    // In a real application, you would implement an API call to your backend
    // to handle sending emails with the report data
    console.log("Email would be sent with this data:", {
      to: email,
      name,
      message,
      reportData
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name">Your Name</Label>
        <Input
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Enter your name"
          required
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="email">Recipient Email</Label>
        <Input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="example@company.com"
          required
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="message">Message</Label>
        <Textarea
          id="message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          rows={5}
          required
        />
      </div>
      
      <Button type="submit" disabled={isLoading} className="w-full flex items-center gap-2">
        {isLoading ? "Sending..." : (
          <>
            <Mail size={16} /> Send Report
          </>
        )}
      </Button>
      
      <p className="text-xs text-muted-foreground text-center mt-4">
        This will send a detailed break-even analysis report based on your calculations. 
        In a production environment, this would generate and attach a PDF report similar to the downloadable version.
      </p>
    </form>
  );
};

export default EmailForm;
