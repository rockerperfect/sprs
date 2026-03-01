import React, { useState } from 'react';
import { simulateBulk } from '../../api/payment.api';
import { Settings, Play, CircleCheck, CircleAlert, Minus, Plus, Loader2 } from 'lucide-react';

const MIN = 10;
const MAX = 1000;
const STEP = 10;

const PaymentSimulator = ({ onSimulationComplete }) => {
    const [count, setCount] = useState(10);
    const [inputValue, setInputValue] = useState('10');
    const [isSimulating, setIsSimulating] = useState(false);
    const [result, setResult] = useState(null);

    const applyCount = (val) => {
        const clamped = Math.max(MIN, Math.min(MAX, val));
        setCount(clamped);
        setInputValue(String(clamped));
    };

    const handleSliderChange = (e) => applyCount(Number(e.target.value));

    const handleInputChange = (e) => {
        const raw = e.target.value.replace(/[^0-9]/g, '');
        setInputValue(raw);
    };

    const handleInputBlur = () => {
        const parsed = parseInt(inputValue, 10);
        applyCount(isNaN(parsed) || parsed < MIN ? MIN : parsed);
    };

    const handleInputKeyDown = (e) => { if (e.key === 'Enter') e.target.blur(); };

    const decrement = () => applyCount(Math.round((count - STEP) / STEP) * STEP);
    const increment = () => applyCount(Math.round((count + STEP) / STEP) * STEP);

    const handleSimulate = async () => {
        setIsSimulating(true);
        setResult(null);
        try {
            const res = await simulateBulk(count);
            setResult({ success: true, message: res.message });
            if (onSimulationComplete) onSimulationComplete();
        } catch (err) {
            setResult({
                success: false,
                message: err.response?.data?.error || 'Simulation failed to execute.'
            });
        } finally {
            setIsSimulating(false);
        }
    };

    return (
        <div className="bg-[#161b22] rounded-xl border border-indigo-500/20 p-5 sm:p-6 glow-accent">
            <div className="flex items-center gap-2 mb-5">
                <Settings className="w-4 h-4 text-indigo-400 shrink-0" />
                <h2 className="text-xs font-semibold text-[#e6edf3] uppercase tracking-widest">Traffic Simulator</h2>
            </div>

            <div className="space-y-4">
                <div>
                    <label className="block text-[10px] font-medium text-[#8b949e] uppercase tracking-widest mb-3">
                        Transaction Volume
                    </label>

                    {/* Slider row */}
                    <div className="flex items-center gap-3">
                        <button
                            onClick={decrement}
                            disabled={count <= MIN}
                            aria-label="Decrease by 10"
                            className="flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-lg
                                       bg-[#1c2333] border border-[#4a5568] text-[#c9d1d9]
                                       shadow-[inset_0_1px_0_rgba(255,255,255,0.08)]
                                       hover:bg-indigo-900/60 hover:border-indigo-500 hover:text-white
                                       hover:shadow-[inset_0_1px_0_rgba(255,255,255,0.12),0_0_8px_rgba(99,102,241,0.5)]
                                       active:scale-95
                                       disabled:opacity-25 disabled:cursor-not-allowed
                                       transition-all duration-150"
                        >
                            <Minus className="w-3.5 h-3.5" />
                        </button>

                        <input
                            type="range"
                            min={MIN} max={MAX} step={STEP}
                            value={count}
                            onChange={handleSliderChange}
                            className="flex-1"
                        />

                        <button
                            onClick={increment}
                            disabled={count >= MAX}
                            aria-label="Increase by 10"
                            className="flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-lg
                                       bg-[#1c2333] border border-[#4a5568] text-[#c9d1d9]
                                       shadow-[inset_0_1px_0_rgba(255,255,255,0.08)]
                                       hover:bg-indigo-900/60 hover:border-indigo-500 hover:text-white
                                       hover:shadow-[inset_0_1px_0_rgba(255,255,255,0.12),0_0_8px_rgba(99,102,241,0.5)]
                                       active:scale-95
                                       disabled:opacity-25 disabled:cursor-not-allowed
                                       transition-all duration-150"
                        >
                            <Plus className="w-3.5 h-3.5" />
                        </button>
                    </div>

                    {/* Scale labels + manual input */}
                    <div className="flex items-center justify-between mt-3 gap-3">
                        <span className="text-xs text-[#8b949e] shrink-0">{MIN}</span>
                        <input
                            type="text"
                            inputMode="numeric"
                            pattern="[0-9]*"
                            value={inputValue}
                            onChange={handleInputChange}
                            onBlur={handleInputBlur}
                            onKeyDown={handleInputKeyDown}
                            aria-label="Transaction count"
                            className="w-20 text-center text-sm font-semibold font-data
                                       text-indigo-300 bg-indigo-950 border border-indigo-700
                                       rounded-lg px-2 py-1 outline-none
                                       focus:border-indigo-400 focus:ring-1 focus:ring-indigo-400/40
                                       transition-all duration-150"
                        />
                        <span className="text-xs text-[#8b949e] shrink-0">{MAX}</span>
                    </div>
                </div>

                {/* Run button */}
                <button
                    onClick={handleSimulate}
                    disabled={isSimulating}
                    className="btn-primary w-full flex items-center justify-center gap-2"
                >
                    {isSimulating ? (
                        <>
                            <Loader2 className="w-4 h-4 shrink-0 animate-spin" />
                            Simulating…
                        </>
                    ) : (
                        <>
                            <Play className="w-4 h-4 shrink-0" />
                            Run Simulation
                        </>
                    )}
                </button>

                {/* Result toast */}
                {result && (
                    <div className={`p-3 rounded-lg flex items-start gap-2.5 text-sm border transition-all duration-300 ${result.success
                            ? 'bg-[#0d2818] border-emerald-900 text-emerald-400'
                            : 'bg-[#2d0d0d] border-red-900 text-red-400'
                        }`}>
                        {result.success ? (
                            <CircleCheck className="w-4 h-4 shrink-0 mt-0.5" />
                        ) : (
                            <CircleAlert className="w-4 h-4 shrink-0 mt-0.5" />
                        )}
                        <p>{result.message}</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default PaymentSimulator;
