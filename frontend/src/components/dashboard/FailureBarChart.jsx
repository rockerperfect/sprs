import React from 'react';
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid,
    Tooltip, Cell, ResponsiveContainer
} from 'recharts';

const FailureBarChart = ({ stats }) => {
    const data = stats.map(s => ({
        name: s.gateway,
        Failures: s.consecutiveFailures,
    }));

    const getBarColor = (failures) => {
        if (failures >= 5) return '#f87171'; // red — circuit tripped
        if (failures >= 3) return '#fb923c'; // orange — approaching threshold
        return '#6366f1';                    // indigo — healthy range
    };

    return (
        <div className="bg-[#161b22] rounded-xl border border-[#30363d] p-5 sm:p-6">
            <h3 className="text-xs font-semibold text-[#8b949e] uppercase tracking-widest mb-4">Consecutive Failures</h3>
            {data.length === 0 ? (
                <div className="h-48 sm:h-56 md:h-64 flex items-center justify-center text-[#484f58] text-sm">
                    No failure data available
                </div>
            ) : (
                <div className="w-full h-48 sm:h-56 md:h-64">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#21262d" vertical={false} />
                            <XAxis
                                dataKey="name"
                                axisLine={false} tickLine={false}
                                tick={{ fill: '#8b949e', fontSize: 11 }}
                            />
                            <YAxis
                                axisLine={false} tickLine={false}
                                allowDecimals={false}
                                tick={{ fill: '#8b949e', fontSize: 11 }}
                            />
                            <Tooltip
                                cursor={{ fill: 'rgba(248,113,113,0.05)' }}
                                contentStyle={{
                                    backgroundColor: '#1c2333',
                                    border: '1px solid #30363d',
                                    borderRadius: '10px',
                                    color: '#e6edf3',
                                    fontSize: '12px',
                                    boxShadow: '0 8px 32px rgba(0,0,0,0.5)'
                                }}
                                itemStyle={{ color: '#e6edf3' }}
                            />
                            <Bar
                                dataKey="Failures"
                                radius={[6, 6, 0, 0]}
                                animationDuration={900} animationEasing="ease-out"
                            >
                                {data.map((entry, index) => (
                                    <Cell
                                        key={`cell-${index}`}
                                        fill={getBarColor(entry.Failures)}
                                    />
                                ))}
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            )}
        </div>
    );
};

export default FailureBarChart;
