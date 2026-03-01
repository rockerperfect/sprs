import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';

const GATEWAY_COLORS = ['#6366f1', '#8b5cf6', '#34d399'];

const EmptyRing = () => (
    <div className="h-48 sm:h-56 md:h-64 flex flex-col items-center justify-center gap-4">
        {/* Animated placeholder rings */}
        <div className="relative flex items-center justify-center">
            <div className="absolute w-28 h-28 rounded-full border-2 border-dashed border-[#30363d] animate-spin [animation-duration:8s]"></div>
            <div className="absolute w-20 h-20 rounded-full border border-[#30363d]/50 animate-pulse"></div>
            <div className="w-12 h-12 rounded-full bg-[#1c2333] border border-[#30363d] flex items-center justify-center">
                <div className="w-3 h-3 rounded-full bg-indigo-500/40 animate-pulse"></div>
            </div>
        </div>
        <p className="text-[#484f58] text-xs text-center max-w-[160px] leading-relaxed">
            Run a simulation to visualise traffic allocation
        </p>
    </div>
);

const TrafficPieChart = ({ distribution }) => {
    const data = distribution.map(d => ({ name: d.gateway, value: d.count }));
    const hasData = data.some(d => d.value > 0);

    return (
        <div className="bg-[#161b22] rounded-xl border border-[#30363d] p-5 sm:p-6 flex flex-col">
            <h3 className="text-xs font-semibold text-[#8b949e] uppercase tracking-widest mb-4">Traffic Distribution</h3>
            {!hasData ? (
                <EmptyRing />
            ) : (
                <div className="w-full h-48 sm:h-56 md:h-64">
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie
                                data={data}
                                cx="50%" cy="50%"
                                innerRadius="38%" outerRadius="60%"
                                paddingAngle={4}
                                dataKey="value"
                                animationBegin={0}
                                animationDuration={900}
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
                                    borderRadius: '10px',
                                    color: '#e6edf3',
                                    fontSize: '12px',
                                    boxShadow: '0 8px 32px rgba(0,0,0,0.5)'
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
