"use client";
import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from "framer-motion";

// ─── Custom Hook: Encapsulates all calculator logic ───
function useCalculator() {
  const [currentValue, setCurrentValue] = useState("0");
  const [previousValue, setPreviousValue] = useState(null);
  const [operator, setOperator] = useState(null);
  const [waitingForOperand, setWaitingForOperand] = useState(false);
  const [expression, setExpression] = useState("");
  const [lastOperand, setLastOperand] = useState(null);
  const [lastOperator, setLastOperator] = useState(null);

  const formatNumber = (num) => {
    if (num === "Error" || isNaN(num)) return num;
    const str = String(num);
    if (str.includes("e")) return str;
    const parts = str.split(".");
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    return parts.join(".");
  };

  const calc = (prev, curr, op) => {
    switch (op) {
      case "+": return +(prev + curr).toFixed(10);
      case "-": return +(prev - curr).toFixed(10);
      case "×": return +(prev * curr).toFixed(10);
      case "÷": return curr === 0 ? "Error" : +(prev / curr).toFixed(10);
      default: return curr;
    }
  };

  const inputDigit = (digit) => {
    if (waitingForOperand) {
      setCurrentValue(String(digit));
      setExpression(prev => prev + String(digit));
      setWaitingForOperand(false);
    } else {
      setCurrentValue(prev => {
        const newVal = prev === "0" ? String(digit) : prev + String(digit);
        setExpression(prevExpr => {
          if (prevExpr && /[+\-×÷]$/.test(prevExpr.trim())) return prevExpr + String(digit);
          if (prevExpr === "0") return String(digit);
          return prevExpr + String(digit);
        });
        return newVal;
      });
    }
  };

  const inputDot = () => {
    if (waitingForOperand) {
      setCurrentValue("0.");
      setExpression(prev => prev + "0.");
      setWaitingForOperand(false);
    } else if (!currentValue.includes(".")) {
      setCurrentValue(prev => prev + ".");
      setExpression(prev => prev + ".");
    }
  };

  const toggleSign = () => {
    const num = parseFloat(currentValue);
    if (isNaN(num)) return;
    const newVal = String(-num);
    setCurrentValue(newVal);
    setExpression(prev => {
      const match = prev.match(/(-?\d+\.?\d*)$/);
      return match ? prev.slice(0, prev.length - match[0].length) + newVal : newVal;
    });
  };

  const percentage = () => {
    const num = parseFloat(currentValue);
    if (isNaN(num)) return;
    const newVal = String(+(num / 100).toFixed(10));
    setCurrentValue(newVal);
    setExpression(prev => {
      const match = prev.match(/(-?\d+\.?\d*)$/);
      return match ? prev.slice(0, prev.length - match[0].length) + newVal : newVal;
    });
  };

  const backspace = () => {
    if (waitingForOperand) return;
    if (currentValue.length > 1) {
      setCurrentValue(prev => prev.slice(0, -1));
      setExpression(prev => prev.slice(0, -1));
    } else {
      setCurrentValue("0");
      setExpression(prev => prev.slice(0, -1) || "0");
    }
  };

  const clear = () => {
    setCurrentValue("0");
    setPreviousValue(null);
    setOperator(null);
    setExpression("");
    setWaitingForOperand(false);
    setLastOperand(null);
    setLastOperator(null);
  };

  const performOperation = (nextOperator) => {
    const inputValue = parseFloat(currentValue);

    if (waitingForOperand && nextOperator && operator) {
      setOperator(nextOperator);
      setExpression(prev => prev.replace(/[+\-×÷]\s*$/, `${nextOperator} `));
      return;
    }

    if (previousValue == null) {
      setPreviousValue(inputValue);
      setExpression(`${formatNumber(inputValue)} ${nextOperator || ""}`);
      if (nextOperator) {
        setWaitingForOperand(true);
        setOperator(nextOperator);
      }
    } else if (operator) {
      const curr = inputValue || 0;
      const result = calc(previousValue, curr, operator);
      setLastOperand(curr);
      setLastOperator(operator);
      setPreviousValue(result === "Error" ? null : result);
      setCurrentValue(String(result));
      setExpression(nextOperator ? `${formatNumber(result)} ${nextOperator}` : `${expression} =`);
      if (nextOperator) {
        setWaitingForOperand(true);
        setOperator(nextOperator);
      } else {
        setOperator(null);
        setWaitingForOperand(false);
      }
    } else if (!operator && nextOperator) {
      setPreviousValue(inputValue);
      setOperator(nextOperator);
      setWaitingForOperand(true);
      setExpression(`${formatNumber(inputValue)} ${nextOperator}`);
    }

    if (!nextOperator && lastOperand !== null && lastOperator && operator === null) {
      const repeatResult = calc(parseFloat(currentValue), lastOperand, lastOperator);
      setCurrentValue(String(repeatResult));
      setPreviousValue(repeatResult === "Error" ? null : repeatResult);
      setExpression(`${formatNumber(parseFloat(currentValue))} ${lastOperator} ${formatNumber(lastOperand)} =`);
    }
  };

  const displayValue = formatNumber(currentValue);
  return { currentValue: displayValue, expression, inputDigit, inputDot, toggleSign, percentage, backspace, clear, performOperation };
}

// ─── Main Component ───
export default function Calculator() {
  const { currentValue, expression, inputDigit, inputDot, toggleSign, percentage, backspace, clear, performOperation } = useCalculator();
  const [mounted, setMounted] = useState(false);
  const [rippleButtons, setRippleButtons] = useState({});

  useEffect(() => { setMounted(true); }, []);

  const triggerRipple = (key) => {
    setRippleButtons(prev => ({ ...prev, [key]: true }));
    setTimeout(() => setRippleButtons(prev => ({ ...prev, [key]: false })), 400);
  };

  const handleKey = useCallback((e) => {
    const keyMap = {
      "+": () => { performOperation("+"); triggerRipple("+"); },
      "-": () => { performOperation("-"); triggerRipple("−"); },
      "*": () => { performOperation("×"); triggerRipple("×"); },
      "/": () => { e.preventDefault(); performOperation("÷"); triggerRipple("÷"); },
      "Enter": () => { performOperation(null); triggerRipple("="); },
      "=": () => { performOperation(null); triggerRipple("="); },
      "Escape": () => { clear(); triggerRipple("AC"); },
      "c": () => { clear(); triggerRipple("AC"); },
      "C": () => { clear(); triggerRipple("AC"); },
      "Backspace": () => { backspace(); triggerRipple("⌫"); },
      ".": () => { inputDot(); triggerRipple("."); },
      "%": () => { percentage(); triggerRipple("%"); },
    };
    if (keyMap[e.key]) keyMap[e.key]();
    else if (e.key >= "0" && e.key <= "9") {
      inputDigit(parseInt(e.key));
      triggerRipple(e.key);
    }
  }, [currentValue, expression, performOperation, clear, backspace, inputDot, inputDigit, percentage]);

  useEffect(() => {
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [handleKey]);

  // ─── Thick, luxurious button component ───
  const Btn = ({ children, onClick, span = "", variant = "number", label = "" }) => {
    const variants = {
      number: "bg-white/[0.07] text-white/90 hover:bg-white/[0.12] active:bg-white/[0.16] border border-white/[0.05] shadow-sm",
      operator: "bg-purple-500/15 text-purple-300 hover:bg-purple-500/25 active:bg-purple-500/35 border border-purple-400/10",
      accent: "bg-gradient-to-br from-purple-600 to-pink-600 text-white shadow-lg shadow-purple-600/30 hover:shadow-purple-600/50 hover:from-purple-500 hover:to-pink-500",
      clear: "bg-rose-500/15 text-rose-300 hover:bg-rose-500/25 active:bg-rose-500/35 border border-rose-400/10",
      func: "bg-white/[0.05] text-gray-400 hover:bg-white/[0.10] hover:text-gray-200 active:bg-white/[0.14] border border-white/[0.03]",
    };

    const isRippling = rippleButtons[label];

    return (
      <motion.button
        whileTap={{ scale: 0.93 }}
        whileHover={{ scale: 1.03 }}
        onClick={() => { onClick(); triggerRipple(label); }}
        className={`
          relative h-20 sm:h-24 w-full text-2xl sm:text-3xl font-semibold
          rounded-[28px] transition-all duration-200 cursor-pointer
          ${variants[variant]} ${span}
          overflow-hidden select-none
          flex items-center justify-center
        `}
      >
        <AnimatePresence>
          {isRippling && (
            <motion.span
              initial={{ scale: 0, opacity: 0.6 }}
              animate={{ scale: 4, opacity: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
              className="absolute inset-0 m-auto w-10 h-10 rounded-full bg-white/20 pointer-events-none"
              style={{ top: "50%", left: "50%", translateX: "-50%", translateY: "-50%" }}
            />
          )}
        </AnimatePresence>
        <span className="relative z-10">{children}</span>
      </motion.button>
    );
  };

  const buttons = [
    { label: "AC", action: clear, variant: "clear" },
    { label: "⌫", action: backspace, variant: "func" },
    { label: "%", action: percentage, variant: "func" },
    { label: "÷", action: () => performOperation("÷"), variant: "operator" },
    { label: "7", action: () => inputDigit(7) },
    { label: "8", action: () => inputDigit(8) },
    { label: "9", action: () => inputDigit(9) },
    { label: "×", action: () => performOperation("×"), variant: "operator" },
    { label: "4", action: () => inputDigit(4) },
    { label: "5", action: () => inputDigit(5) },
    { label: "6", action: () => inputDigit(6) },
    { label: "−", action: () => performOperation("-"), variant: "operator" },
    { label: "1", action: () => inputDigit(1) },
    { label: "2", action: () => inputDigit(2) },
    { label: "3", action: () => inputDigit(3) },
    { label: "+", action: () => performOperation("+"), variant: "operator" },
    { label: "±", action: toggleSign, variant: "func" },
    { label: "0", action: () => inputDigit(0) },
    { label: ".", action: inputDot },
    { label: "=", action: () => performOperation(null), variant: "accent" },
  ];

  return (
    <div className="relative flex items-center justify-center min-h-screen overflow-hidden bg-[#050510]">
      {/* Background glows */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div animate={{ x: [0, 130, -50, 0], y: [0, -110, 70, 0] }} transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -top-40 -left-40 w-[550px] h-[550px] bg-purple-600 rounded-full blur-[200px] opacity-25" />
        <motion.div animate={{ x: [0, -150, 70, 0], y: [0, 130, -90, 0] }} transition={{ duration: 17, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -bottom-40 -right-40 w-[500px] h-[500px] bg-pink-600 rounded-full blur-[200px] opacity-20" />
        <motion.div animate={{ x: [0, 90, -70, 0], y: [0, -60, 90, 0] }} transition={{ duration: 13, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-1/3 left-1/4 w-[400px] h-[400px] bg-indigo-500 rounded-full blur-[180px] opacity-15" />
      </div>

      {/* Particles */}
      {mounted && (
        <div className="absolute inset-0 pointer-events-none">
          {[...Array(25)].map((_, i) => (
            <motion.div key={i}
              initial={{ x: Math.random() * 100 + "%", y: Math.random() * 100 + "%", opacity: 0 }}
              animate={{ y: [0, -45 - Math.random() * 55, 0], opacity: [0, 0.8, 0] }}
              transition={{ duration: 4 + Math.random() * 7, repeat: Infinity, delay: Math.random() * 5 }}
              className="absolute w-1 h-1 bg-purple-300/50 rounded-full" />
          ))}
        </div>
      )}

      {/* Calculator card */}
      <motion.div
        initial={{ opacity: 0, y: 50, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
        className="relative w-full max-w-[440px] mx-4"
      >
        <div className="p-5 sm:p-6 rounded-[36px] bg-[#111128]/70 backdrop-blur-2xl border border-white/[0.07] shadow-2xl shadow-purple-900/10">
          
          {/* Display */}
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}
            className="mb-6 p-5 sm:p-6 rounded-2xl bg-[#0a0a18]/70 border border-white/[0.05] relative overflow-hidden">
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-b from-purple-500/[0.03] to-transparent pointer-events-none" />
            <div className="relative text-gray-500 text-xs sm:text-sm h-5 mb-2 font-mono tracking-wider flex items-center justify-end">
              <span className="truncate max-w-full">{expression || "\u00A0"}</span>
            </div>
            <AnimatePresence mode="popLayout">
              <motion.div
                key={currentValue}
                initial={{ opacity: 0, y: 14, filter: "blur(4px)" }}
                animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                exit={{ opacity: 0, y: -14, filter: "blur(4px)" }}
                transition={{ duration: 0.2, ease: "easeOut" }}
                className="relative text-white text-4xl sm:text-5xl font-light text-right overflow-x-auto scrollbar-none tracking-tight"
                style={{ fontVariantNumeric: "tabular-nums" }}
              >
                {currentValue}
              </motion.div>
            </AnimatePresence>
          </motion.div>

          {/* Button grid */}
          <motion.div initial="hidden" animate="visible" variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.02 } } }}
            className="grid grid-cols-4 gap-2.5 sm:gap-3">
            {buttons.map((btn, i) => (
              <motion.div key={btn.label + i} variants={{ hidden: { opacity: 0, y: 20, scale: 0.8 }, visible: { opacity: 1, y: 0, scale: 1 } }}
                transition={{ duration: 0.35, ease: "easeOut" }} className={btn.span || ""}>
                <Btn onClick={btn.action} span={btn.span || ""} variant={btn.variant || "number"} label={btn.label}>
                  {btn.label}
                </Btn>
              </motion.div>
            ))}
          </motion.div>
        </div>

        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8 }}
          className="text-center text-gray-600 text-xs mt-5 font-mono tracking-wide">
          keyboard supported • press keys to type
        </motion.p>
      </motion.div>
    </div>
  );
}
