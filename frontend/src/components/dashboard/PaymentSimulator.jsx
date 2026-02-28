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
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center gap-2 mb-6 text-gray-800">
                <Settings className="w-5 h-5" />
                <h2 className="text-lg font-semibold">Traffic Simulator</h2>
            </div>

            <div className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Number of Transactions
                    </label>
                    <input
                        type="range"
                        min="10"
                        max="1000"
                        step="10"
                        value={count}
                        onChange={(e) => setCount(Number(e.target.value))}
                        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                    />
                    <div className="flex justify-between text-xs text-gray-500 mt-2">
                        <span>10</span>
                        <span className="font-medium text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-full">
                            {count}
                        </span>
                        <span>1000</span>
                    </div>
                </div>

                <button
                    onClick={handleSimulate}
                    disabled={isSimulating}
                    className={`w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg text-white font-medium transition-colors
            ${isSimulating
                            ? 'bg-indigo-400 cursor-not-allowed'
                            : 'bg-indigo-600 hover:bg-indigo-700 shadow-sm'
                        }`}
                >
                    <Play className={`w-4 h-4 ${isSimulating ? 'animate-pulse' : ''}`} />
                    {isSimulating ? 'Simulating...' : 'Run Simulation'}
                </button>

                {result && (
                    <div className={`mt-4 p-3 rounded-lg flex items-start gap-2 text-sm ${result.success ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'
                        }`}>
                        {result.success ? (
                            <CheckCircle className="w-5 h-5 text-green-500 shrink-0" />
                        ) : (
                            <AlertTriangle className="w-5 h-5 text-red-500 shrink-0" />
                        )}
                        <p>{result.message}</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default PaymentSimulator;
