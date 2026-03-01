import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';

const GATEWAY_COLORS = ['#6366f1', '#8b5cf6', '#34d399'];

const TrafficPieChart = ({ distribution }) => {
    const data = distribution.map(d => ({
        name: d.gateway,
        value: d.count
    }));

    return (
        <div className="bg-[#161b22] rounded-xl border border-[#30363d] p-5 sm:p-6 flex flex-col">
            <h3 className="text-xs font-semibold text-[#8b949e] uppercase tracking-widest mb-4">Traffic Distribution</h3>
            {data.length === 0 ? (
                <div className="h-48 sm:h-56 md:h-64 flex items-center justify-center text-[#484f58] text-sm">
                    No traffic data yet
                </div>
            ) : (
                <div className="w-full h-48 sm:h-56 md:h-64">
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie
                                data={data}
                                cx="50%"
                                cy="50%"
                                innerRadius="40%"
                                outerRadius="60%"
                                paddingAngle={4}
                                dataKey="value"
                            >
                                {data.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={GATEWAY_COLORS[index % GATEWAY_COLORS.length]} />
                                ))}
                            </Pie>
                            <Tooltip
                                formatter={(value) => [`${value} Requests`, 'Traffic']}
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
                                verticalAlign="bottom"
                                height={36}
                                formatter={(value) => (
                                    <span style={{ color: '#8b949e', fontSize: '12px' }}>{value}</span>
                                )}
                            />
                        </PieChart>
                    </ResponsiveContainer>
                </div>
            )}
        </div>
    );
};

export default TrafficPieChart;
