import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { FinancialResults, CarbonResults, EnergyResults, ElectricityPriceResults } from '../types';

// Function to generate PDF with all results
export function generatePDF(
  financialResults: FinancialResults,
  carbonResults: CarbonResults,
  energyResults: EnergyResults,
  electricityPriceResults: ElectricityPriceResults
) {
  const doc = new jsPDF();
  
  // Add title
  doc.setFontSize(20);
  doc.setTextColor(0, 51, 102);
  doc.text('Solar & Wind Financial Analysis Report', 105, 15, { align: 'center' });
  
  // Add date
  doc.setFontSize(10);
  doc.setTextColor(100, 100, 100);
  doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 105, 22, { align: 'center' });
  
  // Add financial metrics
  doc.setFontSize(16);
  doc.setTextColor(0, 51, 102);
  doc.text('Financial Metrics', 14, 35);
  
  // Create financial metrics table
  (doc as any).autoTable({
    startY: 40,
    head: [['Metric', 'Value']],
    body: [
      ['Net Present Value (NPV)', `R ${financialResults.npv.toLocaleString(undefined, { maximumFractionDigits: 2 })}`],
      ['Internal Rate of Return (IRR)', `${financialResults.irr.toFixed(2)}%`],
      ['Payback Period', `${financialResults.paybackPeriod.toFixed(2)} years`],
      ['Return on Investment (ROI)', `${financialResults.roi.toFixed(2)}%`],
      ['Levelized Cost of Energy (LCOE)', `R ${financialResults.lcoe.toFixed(2)} per kWh`],
      ['Initial Investment', `R ${financialResults.initialInvestment.toLocaleString(undefined, { maximumFractionDigits: 2 })}`],
    ],
    theme: 'grid',
    headStyles: { fillColor: [0, 102, 204], textColor: 255 },
    alternateRowStyles: { fillColor: [240, 240, 240] },
  });
  
  // Add energy generation table
  doc.setFontSize(16);
  doc.setTextColor(0, 51, 102);
  doc.text('Energy Generation Prediction', 14, (doc as any).lastAutoTable.finalY + 15);
  
  // Create energy generation table
  (doc as any).autoTable({
    startY: (doc as any).lastAutoTable.finalY + 20,
    head: [['Period', 'Energy Output (kWh)']],
    body: [
      ['Daily Output', energyResults.dailyOutput.toFixed(2)],
      ['Annual Output (Year 1)', (energyResults.dailyOutput * 365).toFixed(2)],
      ['Total Lifetime Output', energyResults.totalLifetimeOutput.toLocaleString(undefined, { maximumFractionDigits: 2 })],
    ],
    theme: 'grid',
    headStyles: { fillColor: [0, 153, 51], textColor: 255 },
    alternateRowStyles: { fillColor: [240, 240, 240] },
  });
  
  // Add carbon reduction metrics
  doc.setFontSize(16);
  doc.setTextColor(0, 51, 102);
  doc.text('Carbon Reduction Estimation', 14, (doc as any).lastAutoTable.finalY + 15);
  
  // Create carbon reduction table
  (doc as any).autoTable({
    startY: (doc as any).lastAutoTable.finalY + 20,
    head: [['Period', 'CO₂ Reduction (kg)', 'Value (R)']],
    body: [
      ['Daily', carbonResults.dailyReduction.toFixed(2), (carbonResults.dailyReduction / 1000 * 190).toFixed(2)],
      ['Yearly', carbonResults.yearlyReduction.toFixed(2), (carbonResults.yearlyReduction / 1000 * 190).toFixed(2)],
      ['Lifetime', carbonResults.lifetimeReduction.toLocaleString(undefined, { maximumFractionDigits: 2 }), carbonResults.carbonValue.toLocaleString(undefined, { maximumFractionDigits: 2 })],
    ],
    theme: 'grid',
    headStyles: { fillColor: [102, 0, 102], textColor: 255 },
    alternateRowStyles: { fillColor: [240, 240, 240] },
  });
  
  // Add yearly cash flow table (new page)
  doc.addPage();
  doc.setFontSize(16);
  doc.setTextColor(0, 51, 102);
  doc.text('Yearly Cash Flow Analysis', 14, 15);
  
  // Prepare cash flow data
  const cashFlowData = financialResults.yearlyCashFlows.map((cashFlow, index) => [
    `Year ${index + 1}`,
    `R ${cashFlow.toLocaleString(undefined, { maximumFractionDigits: 2 })}`,
    `R ${financialResults.cumulativeCashFlows[index + 1].toLocaleString(undefined, { maximumFractionDigits: 2 })}`
  ]);
  
  // Create cash flow table
  (doc as any).autoTable({
    startY: 20,
    head: [['Year', 'Cash Flow', 'Cumulative Cash Flow']],
    body: cashFlowData,
    theme: 'grid',
    headStyles: { fillColor: [204, 102, 0], textColor: 255 },
    alternateRowStyles: { fillColor: [240, 240, 240] },
  });
  
  // Add electricity price prediction table
  doc.setFontSize(16);
  doc.setTextColor(0, 51, 102);
  doc.text('Electricity Price Prediction', 14, (doc as any).lastAutoTable.finalY + 15);
  
  // Prepare electricity price data (show every 5 years to save space)
  const priceData = electricityPriceResults.years
    .filter((_, index) => index % 5 === 0 || index === electricityPriceResults.years.length - 1)
    .map((year, index) => [
      `Year ${year}`,
      `R ${electricityPriceResults.prices[year - 1].toFixed(2)} per kWh`
    ]);
  
  // Create electricity price table
  (doc as any).autoTable({
    startY: (doc as any).lastAutoTable.finalY + 20,
    head: [['Year', 'Electricity Price']],
    body: priceData,
    theme: 'grid',
    headStyles: { fillColor: [0, 102, 102], textColor: 255 },
    alternateRowStyles: { fillColor: [240, 240, 240] },
  });
  
  // Add footer
  const pageCount = doc.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(10);
    doc.setTextColor(100, 100, 100);
    doc.text(`Page ${i} of ${pageCount}`, 105, 285, { align: 'center' });
    doc.text('Solar & Wind Financial Analysis Tool', 105, 292, { align: 'center' });
  }
  
  // Save the PDF
  doc.save('solar-wind-financial-analysis.pdf');
}