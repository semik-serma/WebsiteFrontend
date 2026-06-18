"use client";
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from "framer-motion";

export default function Calculator() {
  const [currentValue, setCurrentValue] = useState("0");
  const [previousValue, setPreviousValue] = useState(null);
  const [operator, setOperator] = useState(null);
  const [waitingForOperand, setWaitingForOperand] = useState(false);
  const [expression, setExpression] = useState("");

  useEffect(() => {
    const handleKey = (e) => {
      if (e.key >= "0" && e.key <= "9") inputDigit(parseInt(e.key));
      if (e.key === ".") inputDot();
      if (e.key === "Escape" || e.key === "c" || e.key === "C") clear();
      if (e.key === "Enter" || e.key === "=") performOperation(null);
      if (e.key === "+") performOperation("+");
      if (e.key === "-") performOperation("-");
      if (e.key === "*") performOperation("*");
      if (e.key === "/") performOperation("/");
      if (e.key === "Backspace") backspace();
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [currentValue, previousValue, operator, waitingForOperand]);

  const inputDigit = (digit) => {
    if (waitingForOperand) {
      setCurrentValue(String(digit));
      setWaitingForOperand(false);
    } else {
      setCurrentValue(prev => prev === "0" ? String(digit) : prev + digit);
    }
  };

  const inputDot = () => {
    if (!currentValue.includes(".")) setCurrentValue(prev => prev + ".");
  };

  const backspace = () => {
    if (currentValue.length > 1) setCurrentValue(prev => prev.slice(0, -1));
    else setCurrentValue("0");
  };

  const clear = () => {
    setCurrentValue("0");
    setPreviousValue(null);
    setOperator(null);
    setExpression("");
  };

  const performOperation = (nextOperator) => {
    const inputValue = parseFloat(currentValue);
    if (previousValue == null) {
      setPreviousValue(inputValue);
      setExpression(`${inputValue} ${nextOperator || ""}`);
    } else if (operator) {
      const curr = inputValue || 0;
      const result = calc(previousValue, curr, operator);
      setPreviousValue(result);
      setCurrentValue(String(result));
      setExpression(nextOperator ? `${result} ${nextOperator}` : `${result} =`);
    }
    if (nextOperator) {
      setWaitingForOperand(true);
      setOperator(nextOperator);
    } else {
      setOperator(null);
    }
  };

  const calc = (prev, curr, op) => {
    switch (op) {
      case "+": return +(prev + curr).toFixed(10);
      case "-": return +(prev - curr).toFixed(10);
      case "*": return +(prev * curr).toFixed(10);
      case "/": return curr === 0 ? "Error" : +(prev / curr).toFixed(10);
      default: return curr;
    }
  };

  const Btn = ({ children, onClick, span = "", variant = "number" }) => {
    const variants = {
      number: "bg-white/[0.04] text-white/90 hover:bg-white/[0.08]",
      operator: "bg-purple-500/10 text-purple-300 hover:bg-purple-500/20",
      accent: "bg-gradient-to-r from-purple-600 to-pink-600 text-white",
      clear: "bg-rose-500/10 text-rose-300 hover:bg-rose-500/20",
      func: "bg-white/[0.03] text-gray-500 hover:bg-white/[0.07] hover:text-gray-300"
    };
    return (
      <motion.button
        whileTap={{ scale: 0.95 }}
        onClick={onClick}
        className={`h-[60px] text-lg font-semibold rounded-xl transition-all duration-150 ${variants[variant]} ${span}`}
      >
        {children}
      </motion.button>
    );
  };

  const buttons = [
    { label: "AC", action: clear, span: "col-span-2", variant: "clear" },
    { label: "⌫", action: backspace, variant: "func" },
    { label: "÷", action: () => performOperation("/"), variant: "operator" },
    { label: "7", action: () => inputDigit(7) },
    { label: "8", action: () => inputDigit(8) },
    { label: "9", action: () => inputDigit(9) },
    { label: "×", action: () => performOperation("*"), variant: "operator" },
    { label: "4", action: () => inputDigit(4) },
    { label: "5", action: () => inputDigit(5) },
    { label: "6", action: () => inputDigit(6) },
    { label: "−", action: () => performOperation("-"), variant: "operator" },
    { label: "1", action: () => inputDigit(1) },
    { label: "2", action: () => inputDigit(2) },
    { label: "3", action: () => inputDigit(3) },
    { label: "+", action: () => performOperation("+"), variant: "operator" },
    { label: "0", action: () => inputDigit(0), span: "col-span-2" },
    { label: ".", action: inputDot },
    { label: "=", action: () => performOperation(null), variant: "accent" },
  ];

  return (
    <div className="relative flex items-center justify-center min-h-screen overflow-hidden bg-[#0a0a1a]">
      {/* Animated gradient orbs */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div animate={{ x: [0, 100, 0], y: [0, -80, 0] }} transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -top-40 -left-40 w-96 h-96 bg-purple-600 rounded-full blur-[150px] opacity-30" />
        <motion.div animate={{ x: [0, -120, 0], y: [0, 100, 0] }} transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -bottom-40 -right-40 w-80 h-80 bg-pink-600 rounded-full blur-[150px] opacity-25" />
        <motion.div animate={{ x: [0, 80, 0], y: [0, 60, 0] }} transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-blue-600 rounded-full blur-[120px] opacity-20" />
      </div>

      {/* Floating particles */}
      <div className="absolute inset-0">
        {[...Array(20)].map((_, i) => (
          <motion.div key={i}
            initial={{ x: Math.random() * 100 + "%", y: Math.random() * 100 + "%", opacity: 0 }}
            animate={{ y: [0, -30 - Math.random() * 40, 0], opacity: [0, 0.8, 0] }}
            transition={{ duration: 4 + Math.random() * 6, repeat: Infinity, delay: Math.random() * 4 }}
            className="absolute w-1 h-1 bg-purple-400/60 rounded-full"
          />
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="relative w-full max-w-sm mx-4"
      >
        {/* Glass card */}
        <div className="p-6 rounded-3xl bg-[#111125]/80 backdrop-blur-xl border border-white/[0.06] shadow-2xl shadow-purple-900/20">
          {/* Display */}
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}
            className="mb-5 p-5 rounded-2xl bg-[#0a0a1a]/60 border border-white/[0.04]"
          >
            <div className="text-gray-500 text-xs h-5 mb-1 font-mono tracking-wider flex items-center justify-end gap-2">
              <span className="truncate">{expression}</span>
            </div>
            <AnimatePresence mode="popLayout">
              <motion.div key={currentValue}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.15 }}
                className="text-white text-5xl font-light text-right overflow-x-auto scrollbar-none"
              >
                {currentValue}
              </motion.div>
            </AnimatePresence>
          </motion.div>

          {/* Grid */}
          <motion.div initial="hidden" animate="visible"
            variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.025 } } }}
            className="grid grid-cols-4 gap-2.5"
          >
            {buttons.map((btn, i) => (
              <motion.div key={btn.label + i}
                variants={{ hidden: { opacity: 0, y: 16 }, visible: { opacity: 1, y: 0 } }}
                className={btn.span || ""}
              >
                <Btn onClick={btn.action} span={btn.span || ""} variant={btn.variant || "number"}>
                  {btn.label === "÷" ? "÷" : btn.label === "×" ? "×" : btn.label === "−" ? "−" : btn.label === "+" ? "+" : btn.label}
                </Btn>
              </motion.div>
            ))}
          </motion.div>
        </div>

        {/* Hint */}
        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8 }}
          className="text-center text-gray-600 text-xs mt-4 font-mono"
        >
          keyboard supported
        </motion.p>
      </motion.div>
    </div>
  );
}
