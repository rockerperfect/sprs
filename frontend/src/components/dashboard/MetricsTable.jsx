import React from 'react';
import { ShieldCheck, TrendingDown, LockKeyhole, LockKeyholeOpen, RefreshCw } from 'lucide-react';

const MetricsTable = ({ stats, isRefreshing = false }) => {
    const getStatusBadge = (status) => {
        switch (status) {
            case 'Healthy':
                return (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold bg-[#0d2818] text-emerald-400 rounded-full border border-emerald-900 whitespace-nowrap">
                        <ShieldCheck className="w-3.5 h-3.5 shrink-0" />Healthy
                    </span>
                );
            case 'Degraded':
                return (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold bg-[#2d1f06] text-amber-400 rounded-full border border-amber-900 whitespace-nowrap">
                        <TrendingDown className="w-3.5 h-3.5 shrink-0" />Degraded
                    </span>
                );
            default:
                return (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold bg-[#1c2333] text-[#8b949e] rounded-full border border-[#30363d] whitespace-nowrap">
                        {status}
                    </span>
                );
        }
    };

    const getCircuitBadge = (state) => {
        switch (state) {
            case 'CLOSED':
                return (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold bg-[#0d2818] text-emerald-400 rounded-full border border-emerald-900 whitespace-nowrap">
                        <LockKeyhole className="w-3.5 h-3.5 shrink-0" />CLOSED
                    </span>
                );
            case 'OPEN':
                return (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold bg-[#2d0d0d] text-red-400 rounded-full border border-red-900 animate-pulse whitespace-nowrap">
                        <LockKeyholeOpen className="w-3.5 h-3.5 shrink-0" />OPEN
                    </span>
                );
            case 'HALF-OPEN':
                return (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold bg-[#1a1228] text-violet-400 rounded-full border border-violet-900 whitespace-nowrap">
                        <RefreshCw className="w-3.5 h-3.5 shrink-0" />HALF-OPEN
                    </span>
                );
            default:
                return (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold bg-[#1c2333] text-[#8b949e] rounded-full border border-[#30363d] whitespace-nowrap">
                        {state}
                    </span>
                );
        }
    };

    /** Per-row decorations based on state */
    const getRowDecoration = (row) => {
        if (row.circuitState === 'OPEN')
            return 'border-l-2 border-red-500/60 bg-red-950/10 shadow-[inset_4px_0_12px_rgba(248,113,113,0.06)]';
        if (row.status === 'Degraded')
            return 'border-l-2 border-amber-500/50 bg-amber-950/5';
        return 'border-l-2 border-transparent';
    };

    return (
        <div className={`bg-[#161b22] rounded-xl border border-[#30363d] overflow-hidden accent-top-line shimmer-wrap ${isRefreshing ? 'shimmer-active' : ''}`}>
            {/* Header */}
            <div className="px-5 py-4 border-b border-[#30363d] flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-indigo-500 shrink-0 shadow-[0_0_6px_rgba(99,102,241,0.8)]"></span>
                <h3 className="text-xs font-semibold text-[#e6edf3] uppercase tracking-widest">Gateway Health Stats</h3>
                {isRefreshing && (
                    <span className="ml-auto text-[10px] text-[#484f58] animate-pulse">Refreshing…</span>
                )}
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
                <table className="w-full text-sm text-left min-w-[600px]">
                    <thead className="bg-[#0d1117] text-[#8b949e] text-xs uppercase tracking-widest sticky top-0 z-10">
                        <tr>
                            <th className="px-5 py-3 font-medium whitespace-nowrap">Gateway</th>
                            <th className="px-5 py-3 font-medium whitespace-nowrap">Status</th>
                            <th className="px-5 py-3 font-medium whitespace-nowrap">Circuit</th>
                            <th className="px-5 py-3 font-medium whitespace-nowrap">Success Rate</th>
                            <th className="px-5 py-3 font-medium whitespace-nowrap">Avg Latency</th>
                            <th className="px-5 py-3 font-medium whitespace-nowrap">Requests</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-[#21262d]">
                        {stats.length === 0 && (
                            <tr>
                                <td colSpan="6" className="px-5 py-10 text-center text-[#484f58] text-sm">
                                    No stats available — run a simulation above.
                                </td>
                            </tr>
                        )}
                        {stats.map((row) => (
                            <tr
                                key={row.gateway}
                                className={`hover:bg-[#1c2333] transition-all duration-200 ${getRowDecoration(row)}`}
                            >
                                <td className="px-5 py-4 font-semibold text-[#e6edf3] font-data whitespace-nowrap">{row.gateway}</td>
                                <td className="px-5 py-4">{getStatusBadge(row.status)}</td>
                                <td className="px-5 py-4">{getCircuitBadge(row.circuitState)}</td>
                                <td className="px-5 py-4 text-[#e6edf3] font-data">{(row.successRate * 100).toFixed(1)}%</td>
                                <td className="px-5 py-4 text-[#8b949e] font-data">{(row.avgLatency || 0).toFixed(0)} ms</td>
                                <td className="px-5 py-4 text-[#8b949e] font-data">{row.totalRequests || 0}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default MetricsTable;
