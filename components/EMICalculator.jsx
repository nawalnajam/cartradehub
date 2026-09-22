

"use client";

import { useState, useEffect, useRef } from "react";
import { Calculator, DollarSign, Percent, Calendar, Sliders } from "lucide-react";

export default function EMICalculator({ carPrice, onUpdate }) {
  const [loanAmount, setLoanAmount] = useState(carPrice || 0);
  const [downPayment, setDownPayment] = useState(0);
  const [interestRate, setInterestRate] = useState(12);
  const [loanTerm, setLoanTerm] = useState(3);
  const [emi, setEmi] = useState(0);
  const [totalPayment, setTotalPayment] = useState(0);
  const [totalInterest, setTotalInterest] = useState(0);
  
  // ✅ Use ref to prevent infinite loop
  const prevValuesRef = useRef({});

  const calculateEMI = () => {
    const principal = loanAmount - downPayment;
    if (principal <= 0) {
      setEmi(0);
      setTotalPayment(0);
      setTotalInterest(0);
      return;
    }

    const monthlyRate = interestRate / 12 / 100;
    const months = loanTerm * 12;
    
    if (monthlyRate === 0) {
      const monthlyEmi = principal / months;
      setEmi(monthlyEmi);
      setTotalPayment(principal);
      setTotalInterest(0);
    } else {
      const emiValue = principal * monthlyRate * Math.pow(1 + monthlyRate, months) / (Math.pow(1 + monthlyRate, months) - 1);
      const total = emiValue * months;
      setEmi(emiValue);
      setTotalPayment(total);
      setTotalInterest(total - principal);
    }
  };

  // ✅ Calculate EMI when inputs change
  useEffect(() => {
    calculateEMI();
  }, [loanAmount, downPayment, interestRate, loanTerm]);

  // ✅ Notify parent only when values actually change
  useEffect(() => {
    const currentValues = {
      emi,
      downPayment,
      interestRate,
      loanTerm,
      totalPayment,
      totalInterest,
      loanAmount,
    };

    // Check if values have changed
    const hasChanged = JSON.stringify(prevValuesRef.current) !== JSON.stringify(currentValues);
    
    if (hasChanged && onUpdate) {
      prevValuesRef.current = currentValues;
      onUpdate(currentValues);
    }
  }, [emi, downPayment, interestRate, loanTerm, totalPayment, totalInterest, loanAmount, onUpdate]);

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-PK', {
      style: 'currency',
      currency: 'PKR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value);
  };

  const handleDownPaymentSlider = (value) => {
    const amount = Math.min(Number(value), loanAmount);
    setDownPayment(amount);
  };

  const handleInterestRateSlider = (value) => {
    setInterestRate(Number(value));
  };

  const handleLoanTermSlider = (value) => {
    setLoanTerm(Number(value));
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-gradient-to-r from-sky-500 to-emerald-500 rounded-lg">
          <Calculator className="w-5 h-5 text-white" />
        </div>
        <h3 className="text-xl font-bold text-gray-900">Car Loan EMI Calculator</h3>
      </div>

      <div className="space-y-6">
        {/* Vehicle Price */}
        <div>
          <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
            <DollarSign className="w-4 h-4 text-sky-500" />
            Vehicle Price
          </label>
          <div className="px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-gray-900 font-semibold">
            {formatCurrency(loanAmount)}
          </div>
        </div>

        {/* Down Payment */}
        <div>
          <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
            <Sliders className="w-4 h-4 text-emerald-500" />
            Down Payment
          </label>
          <div className="space-y-3">
            <input
              type="range"
              min="0"
              max={loanAmount}
              step="1000"
              value={downPayment}
              onChange={(e) => handleDownPaymentSlider(e.target.value)}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-emerald-500"
            />
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">0 PKR</span>
              <span className="text-sm font-semibold text-emerald-600">
                {formatCurrency(downPayment)}
              </span>
              <span className="text-sm text-gray-600">{formatCurrency(loanAmount)}</span>
            </div>
          </div>
          <p className="text-xs text-gray-500 mt-1">
            {((downPayment / loanAmount) * 100).toFixed(0)}% of vehicle price
          </p>
        </div>

        {/* Interest Rate */}
        <div>
          <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
            <Percent className="w-4 h-4 text-purple-500" />
            Interest Rate (% per year)
          </label>
          <div className="space-y-3">
            <input
              type="range"
              min="0"
              max="30"
              step="0.5"
              value={interestRate}
              onChange={(e) => handleInterestRateSlider(e.target.value)}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-purple-500"
            />
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">0%</span>
              <span className="text-sm font-semibold text-purple-600">
                {interestRate}%
              </span>
              <span className="text-sm text-gray-600">30%</span>
            </div>
          </div>
        </div>

        {/* Loan Term */}
        <div>
          <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
            <Calendar className="w-4 h-4 text-orange-500" />
            Loan Term
          </label>
          <div className="space-y-3">
            <input
              type="range"
              min="1"
              max="7"
              step="1"
              value={loanTerm}
              onChange={(e) => handleLoanTermSlider(e.target.value)}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-orange-500"
            />
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">1 Year</span>
              <span className="text-sm font-semibold text-orange-600">
                {loanTerm} {loanTerm === 1 ? 'Year' : 'Years'}
              </span>
              <span className="text-sm text-gray-600">7 Years</span>
            </div>
          </div>
        </div>

        {/* Results */}
        <div className="mt-6 pt-4 border-t border-gray-200">
          <div className="bg-gradient-to-r from-sky-50 to-emerald-50 rounded-lg p-4">
            <p className="text-sm text-gray-600 mb-1">Monthly Payment (EMI)</p>
            <p className="text-3xl font-bold bg-gradient-to-r from-sky-600 to-emerald-600 bg-clip-text text-transparent">
              {formatCurrency(emi)}
            </p>
            
            <div className="grid grid-cols-2 gap-4 mt-4 pt-4 border-t border-gray-200">
              <div>
                <p className="text-xs text-gray-500">Total Payment</p>
                <p className="text-sm font-semibold text-gray-900">{formatCurrency(totalPayment)}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Total Interest</p>
                <p className="text-sm font-semibold text-gray-900">{formatCurrency(totalInterest)}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-100">
          <p className="text-xs text-blue-800">
            💡 This is an estimated EMI. Actual rates may vary based on bank policies and credit score.
          </p>
        </div>
      </div>
    </div>
  );
}