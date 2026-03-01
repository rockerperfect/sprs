import React, { useState } from 'react';
import { simulateBulk } from '../../api/payment.api';
import { Settings, Play, CheckCircle, AlertTriangle } from 'lucide-react';

const PaymentSimulator = ({ onSimulationComplete }) => {
    const [count, setCount] = useState(10);
    const [isSimulating, setIsSimulating] = useState(false);
    const [result, setResult] = useState(null);

    const handleSimulate = async () => {
        setIsSimulating(true);
        setResult(null);
        try {
            const res = await simulateBulk(count);
            setResult({ success: true, message: res.message });
            if (onSimulationComplete) {
                onSimulationComplete();
            }
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
        <div className="bg-[#161b22] rounded-xl border border-[#30363d] p-5 sm:p-6">
            <div className="flex items-center gap-2 mb-5">
                <Settings className="w-4 h-4 text-indigo-400 shrink-0" />
                <h2 className="text-xs font-semibold text-[#e6edf3] uppercase tracking-widest">Traffic Simulator</h2>
            </div>

            <div className="space-y-4">
                <div>
                    <label className="block text-[10px] font-medium text-[#8b949e] uppercase tracking-widest mb-3">
                        Transaction Volume
                    </label>
                    <input
                        type="range"
                        min="10"
                        max="1000"
                        step="10"
                        value={count}
                        onChange={(e) => setCount(Number(e.target.value))}
                        className="w-full"
                    />
                    <div className="flex justify-between text-xs text-[#8b949e] mt-3">
                        <span>10</span>
                        <span className="font-semibold text-indigo-400 bg-indigo-950 border border-indigo-800 px-3 py-0.5 rounded-full font-data">
                            {count}
                        </span>
                        <span>1000</span>
                    </div>
                </div>

                <button
                    onClick={handleSimulate}
                    disabled={isSimulating}
                    className="btn-primary w-full flex items-center justify-center gap-2"
                >
                    <Play className={`w-4 h-4 shrink-0 ${isSimulating ? 'animate-pulse' : ''}`} />
                    {isSimulating ? 'Simulating...' : 'Run Simulation'}
                </button>

                {result && (
                    <div className={`p-3 rounded-lg flex items-start gap-2.5 text-sm border ${result.success
                            ? 'bg-[#0d2818] border-emerald-900 text-emerald-400'
                            : 'bg-[#2d0d0d] border-red-900 text-red-400'
                        }`}>
                        {result.success ? (
                            <CheckCircle className="w-4 h-4 shrink-0 mt-0.5" />
                        ) : (
                            <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
                        )}
                        <p>{result.message}</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default PaymentSimulator;
