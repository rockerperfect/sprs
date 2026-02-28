import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const FailureBarChart = ({ stats }) => {
    const data = stats.map(s => ({
        name: s.gateway,
        Failures: s.consecutiveFailures,
    }));

    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h3 className="text-md font-semibold text-gray-800 mb-4">Consecutive Failures</h3>
            {data.length === 0 ? (
                <div className="h-64 flex items-center justify-center text-gray-400 text-sm">
                    No failure data available
                </div>
            ) : (
                <div className="w-full h-64">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                            data={data}
                            margin={{ top: 20, right: 30, left: -20, bottom: 5 }}
                        >
                            <CartesianGrid strokeDasharray="3 3" vertical={false} />
                            <XAxis dataKey="name" axisLine={false} tickLine={false} />
                            <YAxis axisLine={false} tickLine={false} allowDecimals={false} />
                            <Tooltip
                                cursor={{ fill: '#fee2e2' }}
                                contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                            />
                            <Bar dataKey="Failures" fill="#f43f5e" radius={[4, 4, 0, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            )}
        </div>
    );
};

export default FailureBarChart;
