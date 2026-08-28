"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { History, Copy, Check, Trash2, Calculator as CalcIcon } from "lucide-react";

const MAX_DIGITS = 15;
const MAX_HISTORY = 12;

function formatDisplay(num) {
  if (num === "Error") return "Error";
  const n = Number(num);
  if (!Number.isFinite(n)) return "Error";
  if (Math.abs(n) > 1e15 || (Math.abs(n) !== 0 && Math.abs(n) < 1e-10)) {
    return n.toExponential(6).replace(/\.?0+e/, "e");
  }
  const str = String(n);
  const [intPart, decPart] = str.split(".");
  const formatted = intPart.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  return decPart !== undefined ? `${formatted}.${decPart}` : formatted;
}

function trimNumber(n) {
  return +parseFloat(n.toPrecision(MAX_DIGITS));
}

function evaluateExpression(expr) {
  try {
    const sanitized = expr
      .replace(/,/g, "")
      .replace(/×/g, "*")
      .replace(/÷/g, "/");

    if (!/^[\d+\-*/().\s]+$/.test(sanitized)) return "Error";

    // eslint-disable-next-line no-new-func
    const result = Function(`"use strict"; return (${sanitized})`)();
    if (!Number.isFinite(result)) return "Error";
    return trimNumber(result);
  } catch {
    return "Error";
  }
}

function useCalculator() {
  const [display, setDisplay] = useState("0");
  const [expression, setExpression] = useState("");
  const [freshInput, setFreshInput] = useState(true);
  const [memory, setMemory] = useState(0);
  const [hasMemory, setHasMemory] = useState(false);
  const [history, setHistory] = useState([]);

  const pushHistory = useCallback((expr, result) => {
    setHistory((prev) => [{ expr, result, time: Date.now() }, ...prev].slice(0, MAX_HISTORY));
  }, []);

  const appendDigit = useCallback((digit) => {
    setDisplay((prev) => {
      if (freshInput || prev === "Error") {
        setFreshInput(false);
        return String(digit);
      }
      if (prev.replace(/[,.-]/g, "").length >= MAX_DIGITS) return prev;
      return prev === "0" ? String(digit) : prev + String(digit);
    });
  }, [freshInput]);

  const appendDot = useCallback(() => {
    setDisplay((prev) => {
      if (freshInput || prev === "Error") {
        setFreshInput(false);
        return "0.";
      }
      if (prev.includes(".")) return prev;
      return `${prev}.`;
    });
  }, [freshInput]);

  const toggleSign = useCallback(() => {
    setDisplay((prev) => {
      if (prev === "0" || prev === "Error") return prev;
      return prev.startsWith("-") ? prev.slice(1) : `-${prev}`;
    });
    setFreshInput(false);
  }, []);

  const percentage = useCallback(() => {
    setDisplay((prev) => {
      const n = parseFloat(prev.replace(/,/g, ""));
      if (isNaN(n)) return prev;
      return String(trimNumber(n / 100));
    });
    setFreshInput(false);
  }, []);

  const backspace = useCallback(() => {
    setDisplay((prev) => {
      if (freshInput || prev === "Error") return prev;
      if (prev.length <= 1 || (prev.length === 2 && prev.startsWith("-"))) return "0";
      return prev.slice(0, -1);
    });
  }, [freshInput]);

  const clear = useCallback(() => {
    setDisplay("0");
    setExpression("");
    setFreshInput(true);
  }, []);

  const clearEntry = useCallback(() => {
    setDisplay("0");
    setFreshInput(true);
  }, []);

  const inputOperator = useCallback((op) => {
    const raw = display.replace(/,/g, "");
    const num = parseFloat(raw);
    if (isNaN(num) && display !== "Error") return;

    setExpression((prev) => {
      if (prev && !freshInput) {
        const full = `${prev}${raw}`;
        const result = evaluateExpression(full);
        if (result !== "Error") {
          setDisplay(String(result));
          return `${result} ${op} `;
        }
      }
      if (prev && /[+\-×÷]\s*$/.test(prev)) {
        return prev.replace(/[+\-×÷]\s*$/, `${op} `);
      }
      return `${raw} ${op} `;
    });
    setFreshInput(true);
  }, [display, freshInput]);

  const calculate = useCallback(() => {
    const raw = display.replace(/,/g, "");
    const fullExpr = expression ? `${expression}${raw}` : raw;
    if (!fullExpr.trim()) return;

    const result = evaluateExpression(fullExpr);
    if (result === "Error") {
      setDisplay("Error");
      setFreshInput(true);
      return;
    }

    pushHistory(`${fullExpr} =`, formatDisplay(result));
    setDisplay(String(result));
    setExpression("");
    setFreshInput(true);
  }, [display, expression, pushHistory]);

  const applyResult = useCallback((result, historyExpr) => {
    if (!Number.isFinite(result)) {
      setDisplay("Error");
      setFreshInput(true);
      return;
    }
    const trimmed = trimNumber(result);
    pushHistory(historyExpr, formatDisplay(trimmed));
    setDisplay(String(trimmed));
    setFreshInput(true);
  }, [pushHistory]);

  const insertConstant = useCallback((value) => {
    setDisplay(String(trimNumber(value)));
    setFreshInput(true);
  }, []);

  const memoryAdd = useCallback(() => {
    const n = parseFloat(display.replace(/,/g, ""));
    if (isNaN(n)) return;
    setMemory((m) => m + n);
    setHasMemory(true);
  }, [display]);

  const memorySubtract = useCallback(() => {
    const n = parseFloat(display.replace(/,/g, ""));
    if (isNaN(n)) return;
    setMemory((m) => m - n);
    setHasMemory(true);
  }, [display]);

  const memoryRecall = useCallback(() => {
    setDisplay(String(memory));
    setFreshInput(true);
  }, [memory]);

  const memoryClear = useCallback(() => {
    setMemory(0);
    setHasMemory(false);
  }, []);

  const useHistoryItem = useCallback((result) => {
    setDisplay(String(result).replace(/,/g, ""));
    setFreshInput(true);
  }, []);

  return {
    display: formatDisplay(display.replace(/,/g, "")),
    expression,
    hasMemory,
    history,
    appendDigit,
    appendDot,
    toggleSign,
    percentage,
    backspace,
    clear,
    clearEntry,
    inputOperator,
    calculate,
    applyResult,
    insertConstant,
    memoryAdd,
    memorySubtract,
    memoryRecall,
    memoryClear,
    useHistoryItem,
    clearHistory: () => setHistory([]),
  };
}

function CalcButton({ children, onClick, variant = "num", className = "", small = false }) {
  const styles = {
    num: "bg-white text-gray-800 hover:bg-gray-100 border-gray-200",
    op: "bg-blue-50 text-blue-600 hover:bg-blue-100 border-blue-200",
    func: "bg-gray-50 text-gray-600 hover:bg-gray-100 border-gray-200",
    accent: "bg-blue-600 text-white hover:bg-blue-700 border-blue-500",
    danger: "bg-red-50 text-red-600 hover:bg-red-100 border-red-200",
    sci: "bg-gray-50 text-gray-700 hover:bg-gray-100 border-gray-200",
  };

  return (
    <motion.button
      type="button"
      whileTap={{ scale: 0.96 }}
      onClick={onClick}
      className={`
        relative flex items-center justify-center font-medium rounded-xl border
        transition-colors duration-150 select-none cursor-pointer
        ${small ? "h-11 text-xs sm:text-sm" : "h-14 sm:h-16 text-lg sm:text-xl"}
        ${styles[variant]} ${className}
      `}
    >
      {children}
    </motion.button>
  );
}

export default function Calculator() {
  const calc = useCalculator();
  const [mode, setMode] = useState("standard");
  const [angleMode, setAngleMode] = useState("deg");
  const [showHistory, setShowHistory] = useState(false);
  const [copied, setCopied] = useState(false);

  const getDisplayNum = () => parseFloat(calc.display.replace(/,/g, ""));

  const handleUnary = (compute, label) => {
    const raw = getDisplayNum();
    if (isNaN(raw)) return;
    try {
      const result = compute(raw);
      calc.applyResult(result, `${label}(${raw}) =`);
    } catch {
      calc.applyResult(NaN, `${label}(${raw}) =`);
    }
  };

  const trig = (fn) => (n) => {
    const rad = angleMode === "rad" ? n : (n * Math.PI) / 180;
    return fn(rad);
  };

  const copyResult = async () => {
    try {
      await navigator.clipboard.writeText(calc.display.replace(/,/g, ""));
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch { /* ignore */ }
  };

  const handleKey = useCallback((e) => {
    const { key } = e;
    const map = {
      "+": () => calc.inputOperator("+"),
      "-": () => calc.inputOperator("-"),
      "*": () => calc.inputOperator("×"),
      "/": () => { e.preventDefault(); calc.inputOperator("÷"); },
      Enter: () => calc.calculate(),
      "=": () => calc.calculate(),
      Escape: () => calc.clear(),
      Backspace: () => calc.backspace(),
      ".": () => calc.appendDot(),
      "%": () => calc.percentage(),
    };
    if (map[key]) { map[key](); return; }
    if (key >= "0" && key <= "9") calc.appendDigit(parseInt(key, 10));
  }, [calc]);

  useEffect(() => {
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [handleKey]);

  const topRow = [
    { label: "AC", action: calc.clear, variant: "danger" },
    { label: "CE", action: calc.clearEntry, variant: "func" },
    { label: "⌫", action: calc.backspace, variant: "func" },
    { label: "÷", action: () => calc.inputOperator("÷"), variant: "op" },
  ];

  const numberPad = [
    { label: "7", action: () => calc.appendDigit(7) },
    { label: "8", action: () => calc.appendDigit(8) },
    { label: "9", action: () => calc.appendDigit(9) },
    { label: "×", action: () => calc.inputOperator("×"), variant: "op" },
    { label: "4", action: () => calc.appendDigit(4) },
    { label: "5", action: () => calc.appendDigit(5) },
    { label: "6", action: () => calc.appendDigit(6) },
    { label: "−", action: () => calc.inputOperator("-"), variant: "op" },
    { label: "1", action: () => calc.appendDigit(1) },
    { label: "2", action: () => calc.appendDigit(2) },
    { label: "3", action: () => calc.appendDigit(3) },
    { label: "+", action: () => calc.inputOperator("+"), variant: "op" },
    { label: "±", action: calc.toggleSign, variant: "func" },
    { label: "0", action: () => calc.appendDigit(0) },
    { label: ".", action: calc.appendDot },
    { label: "%", action: calc.percentage, variant: "func" },
    { label: "=", action: calc.calculate, variant: "accent" },
  ];

  const scientificRow1 = [
    { label: "MC", action: calc.memoryClear, variant: "func" },
    { label: "MR", action: calc.memoryRecall, variant: "func" },
    { label: "M+", action: calc.memoryAdd, variant: "func" },
    { label: "M−", action: calc.memorySubtract, variant: "func" },
  ];

  const scientificRow2 = [
    { label: "sin", action: () => handleUnary(trig(Math.sin), "sin"), variant: "sci" },
    { label: "cos", action: () => handleUnary(trig(Math.cos), "cos"), variant: "sci" },
    { label: "tan", action: () => handleUnary(trig(Math.tan), "tan"), variant: "sci" },
    { label: "√", action: () => handleUnary(Math.sqrt, "√"), variant: "sci" },
  ];

  const scientificRow3 = [
    { label: "log", action: () => handleUnary(Math.log10, "log"), variant: "sci" },
    { label: "ln", action: () => handleUnary(Math.log, "ln"), variant: "sci" },
    { label: "x²", action: () => handleUnary((n) => n * n, "x²"), variant: "sci" },
    { label: "1/x", action: () => handleUnary((n) => 1 / n, "1/x"), variant: "sci" },
  ];

  const scientificRow4 = [
    { label: "π", action: () => calc.insertConstant(Math.PI), variant: "sci" },
    { label: "e", action: () => calc.insertConstant(Math.E), variant: "sci" },
    { label: "abs", action: () => handleUnary(Math.abs, "abs"), variant: "sci" },
    { label: "10ˣ", action: () => handleUnary((n) => Math.pow(10, n), "10^x"), variant: "sci" },
  ];

  const renderRow = (buttons, small = false) => (
    <div className="grid grid-cols-4 gap-2">
      {buttons.map((btn) => (
        <CalcButton key={btn.label} onClick={btn.action} variant={btn.variant || "num"} small={small}>
          {btn.label}
        </CalcButton>
      ))}
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6">
      <div className="max-w-4xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 rounded-lg bg-blue-50 border border-blue-200">
              <CalcIcon className="w-5 h-5 text-blue-600" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900">Calculator</h1>
          </div>
          <p className="text-gray-500 text-sm">Standard & scientific modes with memory and history</p>
        </motion.div>

        <div className="grid lg:grid-cols-[1fr_280px] gap-6 items-start">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="portfolio-card p-5 sm:p-6"
          >
            <div className="flex items-center justify-between mb-5 gap-3 flex-wrap">
              <div className="flex rounded-lg bg-gray-50 p-1 border border-gray-200">
                {["standard", "scientific"].map((m) => (
                  <button
                    key={m}
                    type="button"
                    onClick={() => setMode(m)}
                    className={`px-4 py-1.5 rounded-md text-sm font-medium capitalize transition-colors ${
                      mode === m ? "bg-blue-600 text-white" : "text-gray-600 hover:text-blue-600"
                    }`}
                  >
                    {m}
                  </button>
                ))}
              </div>
              <div className="flex items-center gap-2">
                {mode === "scientific" && (
                  <button
                    type="button"
                    onClick={() => setAngleMode((a) => (a === "deg" ? "rad" : "deg"))}
                    className="text-xs font-medium px-3 py-1.5 rounded-lg bg-gray-100 border border-gray-300 text-gray-600 hover:text-blue-600 transition-colors"
                  >
                    {angleMode.toUpperCase()}
                  </button>
                )}
                {calc.hasMemory && (
                  <span className="text-xs text-blue-600 font-mono px-2 py-1 rounded bg-blue-50 border border-blue-200">
                    M
                  </span>
                )}
                <button
                  type="button"
                  onClick={() => setShowHistory((s) => !s)}
                  className={`p-2 rounded-lg border transition-colors lg:hidden ${
                    showHistory
                      ? "bg-blue-600/20 border-blue-300 text-blue-600"
                      : "bg-gray-100 border-gray-300 text-gray-600"
                  }`}
                  aria-label="Toggle history"
                >
                  <History className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="mb-5 p-4 sm:p-5 rounded-xl bg-white border border-gray-200">
              <div className="flex items-center justify-between mb-1 min-h-[20px]">
                <span className="text-gray-500 text-xs font-mono truncate max-w-[70%]">
                  {calc.expression || "\u00A0"}
                </span>
                <button
                  type="button"
                  onClick={copyResult}
                  className="text-gray-500 hover:text-blue-600 transition-colors p-1"
                  aria-label="Copy result"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-blue-600" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
              </div>
              <AnimatePresence mode="popLayout">
                <motion.div
                  key={calc.display}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  transition={{ duration: 0.15 }}
                  className="text-right text-3xl sm:text-4xl font-light text-gray-900 tracking-tight overflow-x-auto"
                  style={{ fontVariantNumeric: "tabular-nums" }}
                >
                  {calc.display}
                </motion.div>
              </AnimatePresence>
            </div>

            <div className="space-y-2">
              {mode === "scientific" && (
                <>
                  {renderRow(scientificRow1, true)}
                  {renderRow(scientificRow2, true)}
                  {renderRow(scientificRow3, true)}
                  {renderRow(scientificRow4, true)}
                </>
              )}
              {renderRow(topRow)}
              {renderRow(numberPad)}
            </div>

            <p className="text-center text-gray-500 text-xs mt-4 font-mono">
              Keyboard supported · Enter to calculate · Esc to clear
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className={`portfolio-card p-5 ${showHistory ? "block" : "hidden lg:block"}`}
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-semibold text-gray-900 flex items-center gap-2">
                <History className="w-4 h-4 text-blue-600" />
                History
              </h2>
              {calc.history.length > 0 && (
                <button
                  type="button"
                  onClick={calc.clearHistory}
                  className="text-gray-500 hover:text-rose-400 transition-colors p-1"
                  aria-label="Clear history"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {calc.history.length === 0 ? (
              <p className="text-gray-500 text-sm text-center py-8">Calculations will appear here</p>
            ) : (
              <ul className="space-y-2 max-h-[480px] overflow-y-auto">
                {calc.history.map((item, i) => (
                  <motion.li
                    key={item.time}
                    initial={{ opacity: 0, x: 8 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.03 }}
                  >
                    <button
                      type="button"
                      onClick={() => calc.useHistoryItem(item.result.replace(/,/g, ""))}
                      className="w-full text-left p-3 rounded-lg bg-gray-50 border border-gray-200 hover:border-blue-200 hover:bg-gray-100 transition-colors group"
                    >
                      <p className="text-gray-500 text-xs font-mono truncate">{item.expr}</p>
                      <p className="text-gray-900 text-sm font-medium mt-0.5 group-hover:text-blue-600 transition-colors">
                        {item.result}
                      </p>
                    </button>
                  </motion.li>
                ))}
              </ul>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
}
