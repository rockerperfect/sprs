import React from 'react';
import { Activity, XCircle, AlertTriangle, CheckCircle } from 'lucide-react';

const MetricsTable = ({ stats }) => {
    const getStatusBadge = (status) => {
        switch (status) {
            case 'Healthy':
                return <span className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium bg-green-50 text-green-700 rounded-full"><CheckCircle className="w-3.5 h-3.5" />Healthy</span>;
            case 'Degraded':
                return <span className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium bg-yellow-50 text-yellow-700 rounded-full"><AlertTriangle className="w-3.5 h-3.5" />Degraded</span>;
            default:
                return <span className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium bg-gray-50 text-gray-700 rounded-full">{status}</span>;
        }
    };

    const getCircuitBadge = (state) => {
        switch (state) {
            case 'CLOSED':
                return <span className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium bg-green-50 text-green-700 rounded-full"><Activity className="w-3.5 h-3.5" />CLOSED</span>;
            case 'OPEN':
                return <span className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium bg-red-50 text-red-700 rounded-full"><XCircle className="w-3.5 h-3.5" />OPEN</span>;
            case 'HALF-OPEN':
                return <span className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium bg-yellow-50 text-yellow-700 rounded-full"><AlertTriangle className="w-3.5 h-3.5" />HALF-OPEN</span>;
            default:
                return <span className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium bg-gray-50 text-gray-700 rounded-full">{state}</span>;
        }
    };

    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="px-6 py-5 border-b border-gray-100">
                <h3 className="text-lg font-semibold text-gray-900">Gateway Health Stats</h3>
            </div>
            <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                    <thead className="bg-gray-50/50 text-gray-500 uppercase text-xs">
                        <tr>
                            <th className="px-6 py-4 font-medium">Gateway</th>
                            <th className="px-6 py-4 font-medium">Status</th>
                            <th className="px-6 py-4 font-medium">Circuit State</th>
                            <th className="px-6 py-4 font-medium whitespace-nowrap">Success Rate</th>
                            <th className="px-6 py-4 font-medium whitespace-nowrap">Avg Latency</th>
                            <th className="px-6 py-4 font-medium whitespace-nowrap">Total Requests</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {stats.length === 0 && (
                            <tr>
                                <td colSpan="6" className="px-6 py-8 text-center text-gray-500">
                                    No stats available to display.
                                </td>
                            </tr>
                        )}
                        {stats.map((row) => (
                            <tr key={row.gateway} className="hover:bg-gray-50/50 transition-colors">
                                <td className="px-6 py-4 font-medium text-gray-900">{row.gateway}</td>
                                <td className="px-6 py-4">{getStatusBadge(row.status)}</td>
                                <td className="px-6 py-4">{getCircuitBadge(row.circuitState)}</td>
                                <td className="px-6 py-4 text-gray-600">{(row.successRate * 100).toFixed(1)}%</td>
                                <td className="px-6 py-4 text-gray-600">{(row.avgLatency || 0).toFixed(0)} ms</td>
                                <td className="px-6 py-4 text-gray-600">{row.totalRequests || 0}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default MetricsTable;
