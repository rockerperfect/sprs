import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const SuccessRateChart = ({ stats }) => {
    const data = stats.map(s => ({
        name: s.gateway,
        Success: parseFloat((s.successRate * 100).toFixed(1)),
        Failure: parseFloat(((1 - s.successRate) * 100).toFixed(1))
    }));

    return (
        <div className="bg-[#161b22] rounded-xl border border-[#30363d] p-5 sm:p-6">
            <h3 className="text-xs font-semibold text-[#8b949e] uppercase tracking-widest mb-4">Availability Rates (%)</h3>
            {data.length === 0 ? (
                <div className="h-48 sm:h-56 md:h-64 flex items-center justify-center text-[#484f58] text-sm">
                    No gateway stats available
                </div>
            ) : (
                <div className="w-full h-48 sm:h-56 md:h-64">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#21262d" vertical={false} />
                            <XAxis
                                dataKey="name"
                                axisLine={false}
                                tickLine={false}
                                tick={{ fill: '#8b949e', fontSize: 11 }}
                            />
                            <YAxis
                                axisLine={false}
                                tickLine={false}
                                domain={[0, 100]}
                                tick={{ fill: '#8b949e', fontSize: 11 }}
                            />
                            <Tooltip
                                cursor={{ fill: 'rgba(255,255,255,0.03)' }}
                                contentStyle={{
                                    backgroundColor: '#1c2333',
                                    border: '1px solid #30363d',
                                    borderRadius: '8px',
                                    color: '#e6edf3',
                                    fontSize: '12px',
                                    boxShadow: '0 4px 20px rgba(0,0,0,0.4)'
                                }}
                                itemStyle={{ color: '#e6edf3' }}
                            />
                            <Legend
                                formatter={(value) => (
                                    <span style={{ color: '#8b949e', fontSize: '11px' }}>{value}</span>
                                )}
                            />
                            <Bar dataKey="Success" stackId="a" fill="#34d399" radius={[0, 0, 4, 4]} />
                            <Bar dataKey="Failure" stackId="a" fill="#f87171" radius={[4, 4, 0, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            )}
        </div>
    );
};

export default SuccessRateChart;
