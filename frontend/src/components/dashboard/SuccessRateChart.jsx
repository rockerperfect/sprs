import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const SuccessRateChart = ({ stats }) => {
    const data = stats.map(s => ({
        name: s.gateway,
        Success: parseFloat((s.successRate * 100).toFixed(1)),
        Failure: parseFloat(((1 - s.successRate) * 100).toFixed(1))
    }));

    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h3 className="text-md font-semibold text-gray-800 mb-4">Availability Rates (%)</h3>
            {data.length === 0 ? (
                <div className="h-64 flex items-center justify-center text-gray-400 text-sm">
                    No gateway stats available
                </div>
            ) : (
                <div className="w-full h-64">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                            data={data}
                            margin={{ top: 20, right: 30, left: 0, bottom: 5 }}
                        >
                            <CartesianGrid strokeDasharray="3 3" vertical={false} />
                            <XAxis dataKey="name" axisLine={false} tickLine={false} />
                            <YAxis axisLine={false} tickLine={false} domain={[0, 100]} />
                            <Tooltip
                                cursor={{ fill: 'transparent' }}
                                contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                            />
                            <Legend />
                            <Bar dataKey="Success" stackId="a" fill="#10b981" radius={[0, 0, 4, 4]} />
                            <Bar dataKey="Failure" stackId="a" fill="#ef4444" radius={[4, 4, 0, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            )}
        </div>
    );
};

export default SuccessRateChart;
