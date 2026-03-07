"use client";
import React, { useState } from 'react';

export default function Calculator() {
  const [currentValue, setCurrentValue] = useState("0");
  const [previousValue, setPreviousValue] = useState(null);
  const [operator, setOperator] = useState(null);
  const [waitingForOperand, setWaitingForOperand] = useState(false);

  const inputDigit = (digit) => {
    if (waitingForOperand) {
      setCurrentValue(String(digit));
      setWaitingForOperand(false);
    } else {
      setCurrentValue(currentValue === "0" ? String(digit) : currentValue + digit);
    }
  };

  const inputDot = () => {
    if (!currentValue.includes(".")) {
      setCurrentValue(currentValue + ".");
    }
  };

  const clear = () => {
    setCurrentValue("0");
    setPreviousValue(null);
    setOperator(null);
  };

  const performOperation = (nextOperator) => {
    const inputValue = parseFloat(currentValue);

    if (previousValue == null) {
      setPreviousValue(inputValue);
    } else if (operator) {
      const currentValueNum = inputValue || 0;
      const newValue = calculate(previousValue, currentValueNum, operator);
      setPreviousValue(newValue);
      setCurrentValue(String(newValue));
    }

    setWaitingForOperand(true);
    setOperator(nextOperator);
  };

  const calculate = (prev, curr, op) => {
    switch (op) {
      case "+": return prev + curr;
      case "-": return prev - curr;
      case "*": return prev * curr;
      case "/": return prev / curr;
      default: return curr;
    }
  };

  const Button = ({ children, onClick, className = "" }) => (
    <button
      onClick={onClick}
      className={`h-16 text-xl font-semibold rounded-2xl transition-all active:scale-95 ${className}`}
    >
      {children}
    </button>
  );

  return (
    <div className="flex items-center justify-center min-h-screen bg-slate-50">
      <div className="w-full max-w-xs p-6 bg-white shadow-2xl rounded-3xl border border-slate-100">
        
        {/* Display */}
        <div className="mb-6 p-4 bg-slate-900 rounded-2xl text-right">
          <div className="text-slate-400 text-xs h-4 mb-1 uppercase tracking-widest">
            {operator ? `${previousValue} ${operator}` : ""}
          </div>
          <div className="text-white text-4xl font-light overflow-hidden">
            {currentValue}
          </div>
        </div>

        {/* Buttons Grid */}
        <div className="grid grid-cols-4 gap-3">
          <Button onClick={clear} className="col-span-2 bg-rose-100 text-rose-600 hover:bg-rose-200">AC</Button>
          <Button onClick={() => performOperation("/")} className="bg-indigo-100 text-indigo-600 hover:bg-indigo-200">÷</Button>
          <Button onClick={() => performOperation("*")} className="bg-indigo-100 text-indigo-600 hover:bg-indigo-200">×</Button>

          {[7, 8, 9].map(n => <Button key={n} onClick={() => inputDigit(n)} className="bg-slate-100 text-slate-700 hover:bg-slate-200">{n}</Button>)}
          <Button onClick={() => performOperation("-")} className="bg-indigo-100 text-indigo-600 hover:bg-indigo-200">−</Button>

          {[4, 5, 6].map(n => <Button key={n} onClick={() => inputDigit(n)} className="bg-slate-100 text-slate-700 hover:bg-slate-200">{n}</Button>)}
          <Button onClick={() => performOperation("+")} className="bg-indigo-100 text-indigo-600 hover:bg-indigo-200">+</Button>

          {[1, 2, 3].map(n => <Button key={n} onClick={() => inputDigit(n)} className="bg-slate-100 text-slate-700 hover:bg-slate-200">{n}</Button>)}
          <Button onClick={() => performOperation(null)} className="row-span-2 bg-indigo-600 text-white hover:bg-indigo-700">=</Button>

          <Button onClick={() => inputDigit(0)} className="col-span-2 bg-slate-100 text-slate-700 hover:bg-slate-200">0</Button>
          <Button onClick={inputDot} className="bg-slate-100 text-slate-700 hover:bg-slate-200">.</Button>
        </div>
      </div>
    </div>
  );
}