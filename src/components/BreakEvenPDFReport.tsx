
import React from 'react';
import { Button } from "@/components/ui/button";
import { Download } from 'lucide-react';
import { useToast } from "@/components/ui/use-toast";
import jsPDF from 'jspdf';
import 'jspdf-autotable';

interface BreakEvenPDFReportProps {
  fixedCosts: number;
  variableCost: number;
  sellingPrice: number;
  breakEvenPoint: number;
  contributionMargin: number;
}

const BreakEvenPDFReport = ({
  fixedCosts,
  variableCost,
  sellingPrice,
  breakEvenPoint,
  contributionMargin
}: BreakEvenPDFReportProps) => {
  const { toast } = useToast();

  const formatCurrency = (value: number): string => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(value);
  };

  const generatePDF = () => {
    try {
      // Create a new PDF document
      const doc = new jsPDF();
      
      // Add logo or header (using text as placeholder)
      doc.setFillColor(36, 94, 79); // Primary color
      doc.rect(0, 0, 210, 25, 'F');
      doc.setTextColor(255, 255, 255);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(20);
      doc.text('Break-Even Analysis Report', 105, 15, { align: 'center' });
      
      // Add current date
      const currentDate = new Date().toLocaleDateString('en-IN', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      });
      doc.setFontSize(10);
      doc.text(`Generated on: ${currentDate}`, 105, 22, { align: 'center' });
      
      // Add company info section
      doc.setTextColor(36, 94, 79);
      doc.setFontSize(12);
      doc.text('Break-Even Brilliance Analytics', 14, 35);
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(10);
      doc.setTextColor(51, 51, 51);
      doc.text('Expert financial analysis for your business success', 14, 40);
      doc.text('www.breakevenbrilliance.com', 14, 45);
      
      // Add report title and description
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(16);
      doc.setTextColor(36, 94, 79);
      doc.text('Break-Even Analysis Summary', 105, 60, { align: 'center' });
      
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(11);
      doc.setTextColor(51, 51, 51);
      doc.text('This report provides a detailed breakdown of your break-even analysis, highlighting', 105, 68, { align: 'center' });
      doc.text('key financial metrics to help you make informed business decisions.', 105, 74, { align: 'center' });
      
      // Add input parameters table
      doc.setFontSize(14);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(36, 94, 79);
      doc.text('Input Parameters', 14, 90);
      
      // @ts-ignore
      doc.autoTable({
        startY: 95,
        head: [['Parameter', 'Value']],
        body: [
          ['Fixed Costs', formatCurrency(fixedCosts)],
          ['Variable Cost Per Unit', formatCurrency(variableCost)],
          ['Selling Price Per Unit', formatCurrency(sellingPrice)]
        ],
        theme: 'grid',
        headStyles: { 
          fillColor: [36, 94, 79],
          textColor: [255, 255, 255],
          fontStyle: 'bold'
        },
        alternateRowStyles: {
          fillColor: [240, 240, 240]
        },
        styles: {
          fontSize: 11
        }
      });
      
      // Add results table
      const contribution = sellingPrice - variableCost;
      const revenueAtBreakEven = breakEvenPoint * sellingPrice;
      const totalCostsAtBreakEven = fixedCosts + (breakEvenPoint * variableCost);
      
      doc.setFontSize(14);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(36, 94, 79);
      // @ts-ignore
      const finalY = doc.lastAutoTable.finalY + 15;
      doc.text('Break-Even Analysis Results', 14, finalY);
      
      // @ts-ignore
      doc.autoTable({
        startY: finalY + 5,
        head: [['Metric', 'Value']],
        body: [
          ['Break-Even Point', `${breakEvenPoint.toLocaleString()} units`],
          ['Revenue at Break-Even', formatCurrency(revenueAtBreakEven)],
          ['Total Costs at Break-Even', formatCurrency(totalCostsAtBreakEven)],
          ['Contribution per Unit', formatCurrency(contribution)],
          ['Contribution Margin', `${contributionMargin.toFixed(2)}%`]
        ],
        theme: 'grid',
        headStyles: { 
          fillColor: [36, 94, 79],
          textColor: [255, 255, 255],
          fontStyle: 'bold'
        },
        alternateRowStyles: {
          fillColor: [240, 240, 240]
        },
        styles: {
          fontSize: 11
        }
      });
      
      // Add interpretations & recommendations
      // @ts-ignore
      const finalY2 = doc.lastAutoTable.finalY + 15;
      doc.setFontSize(14);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(36, 94, 79);
      doc.text('Analysis & Recommendations', 14, finalY2);
      
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(11);
      doc.setTextColor(51, 51, 51);
      const interpretationY = finalY2 + 10;
      
      let salesNeededText = '';
      if (breakEvenPoint > 0) {
        salesNeededText = `To reach profitability, your business needs to sell more than ${breakEvenPoint.toLocaleString()} units. Every unit sold beyond this point contributes ${formatCurrency(contribution)} to your profit.`;
      } else {
        salesNeededText = 'Your current pricing structure does not allow for a break-even point. Consider revising your pricing strategy.';
      }
      
      const marginText = `With a contribution margin of ${contributionMargin.toFixed(2)}%, ${contributionMargin.toFixed(2)}% of each sales rupee is available to cover fixed costs and generate profit.`;
      
      doc.text(salesNeededText, 14, interpretationY);
      doc.text(marginText, 14, interpretationY + 8);
      
      const recY = interpretationY + 20;
      doc.setFontSize(12);
      doc.text('Recommendations:', 14, recY);
      
      doc.setFontSize(11);
      let recText1 = '';
      
      if (contributionMargin < 30) {
        recText1 = '• Consider increasing your selling price or finding ways to reduce variable costs to improve your contribution margin.';
      } else {
        recText1 = '• Your contribution margin is healthy. Focus on increasing sales volume to maximize profits.';
      }
      
      const recText2 = '• Regularly review fixed costs to identify opportunities for cost reduction without impacting operations.';
      const recText3 = '• Monitor market conditions and competitor pricing to ensure your pricing strategy remains competitive.';
      
      doc.text(recText1, 14, recY + 8);
      doc.text(recText2, 14, recY + 16);
      doc.text(recText3, 14, recY + 24);
      
      // Add footer
      const pageCount = doc.internal.getNumberOfPages();
      for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i);
        doc.setFontSize(10);
        doc.setTextColor(100, 100, 100);
        doc.text('This report is generated for informational purposes only and should not be considered as financial advice.', 105, 285, { align: 'center' });
        doc.setFontSize(8);
        doc.text(`Page ${i} of ${pageCount}`, 105, 290, { align: 'center' });
      }
      
      // Save the PDF
      doc.save('BreakEven_Analysis_Report.pdf');
      
      toast({
        title: "PDF Generated Successfully",
        description: "Your break-even analysis report has been downloaded.",
      });
      
    } catch (error) {
      console.error("Error generating PDF:", error);
      toast({
        title: "Error Generating PDF",
        description: "There was a problem creating your report. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <Button variant="default" onClick={generatePDF} className="flex items-center gap-2 bg-accent text-accent-foreground hover:bg-accent/80">
      <Download size={16} />
      <span>Download PDF</span>
    </Button>
  );
};

export default BreakEvenPDFReport;
