import React, { useEffect, useState, useRef } from 'react';
import { getMetrics, getGatewayHealth } from '../api/metrics.api';
import { resetSimulation } from '../api/payment.api';
import Navbar from '../components/layout/Navbar';
import PageContainer from '../components/layout/PageContainer';
import PaymentSimulator from '../components/dashboard/PaymentSimulator';
import MetricsTable from '../components/dashboard/MetricsTable';
import TrafficPieChart from '../components/dashboard/TrafficPieChart';
import SuccessRateChart from '../components/dashboard/SuccessRateChart';
import FailureBarChart from '../components/dashboard/FailureBarChart';

/** Smooth count-up animation hook */
function useCountUp(target, duration = 700) {
    const [display, setDisplay] = useState(target);
    const prevRef = useRef(target);

    useEffect(() => {
        const start = prevRef.current;
        prevRef.current = target;
        if (start === target) return;

        const startTime = performance.now();
        const diff = target - start;

        const tick = (now) => {
            const t = Math.min((now - startTime) / duration, 1);
            const eased = 1 - (1 - t) ** 3; // cubic ease-out
            setDisplay(Math.round(start + diff * eased));
            if (t < 1) requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
    }, [target, duration]);

    return display;
}

const Dashboard = () => {
    const [metrics, setMetrics] = useState(null);
    const [gatewayStats, setGatewayStats] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isResetting, setIsResetting] = useState(false);
    const [isRefreshing, setIsRefreshing] = useState(false);

    const totalTx = useCountUp(metrics?.totalTransactions ?? 0);
    const successRt = useCountUp(
        parseFloat((metrics?.successRate ?? 0).toString().replace('%', '')),
        600
    );

    const fetchDashboardData = async () => {
        setIsRefreshing(true);
        try {
            const [metricsData, statsData] = await Promise.all([
                getMetrics(),
                getGatewayHealth()
            ]);
            setMetrics(metricsData.data);
            setGatewayStats(statsData.data);
        } catch (err) {
            console.error('Failed to load dashboard data:', err);
        } finally {
            setLoading(false);
            // keep shimmer visible for 800ms so animation completes
            setTimeout(() => setIsRefreshing(false), 800);
        }
    };

    const handleReset = async () => {
        if (!window.confirm('Are you sure you want to delete all transactions and reset the simulator?')) return;
        setIsResetting(true);
        try {
            await resetSimulation();
            await fetchDashboardData();
        } catch (err) {
            console.error('Failed to reset:', err);
        } finally {
            setIsResetting(false);
        }
    };

    useEffect(() => {
        fetchDashboardData();
        const interval = setInterval(fetchDashboardData, 5000);
        return () => clearInterval(interval);
    }, []);

    if (loading && !metrics) {
        return (
            <div className="min-h-screen bg-[#0d1117] flex items-center justify-center">
                <div className="flex flex-col items-center gap-4">
                    <div className="animate-spin rounded-full h-10 w-10 border-2 border-[#30363d] border-t-indigo-500"></div>
                    <p className="text-[#8b949e] text-sm font-medium">Initialising dashboard...</p>
                </div>
            </div>
        );
    }

    const isHealthy = (metrics?.successRate ?? 0) > 50;

    return (
        <>
            <Navbar />
            <PageContainer>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 lg:gap-6">

                    {/* ── Left Column ── */}
                    <div className="lg:col-span-1 space-y-5">

                        {/* Overview header */}
                        <div className="animate-fade-in flex justify-between items-center bg-[#161b22] rounded-xl border border-[#30363d] px-4 py-3 shimmer-wrap glow-accent">
                            <div>
                                <p className="text-[10px] font-medium text-[#8b949e] uppercase tracking-widest">System</p>
                                <h2 className="text-sm font-semibold text-[#e6edf3]">Overview</h2>
                            </div>
                            <button onClick={handleReset} disabled={isResetting} className="btn-danger">
                                {isResetting ? 'Resetting…' : 'Reset Data'}
                            </button>
                        </div>

                        {/* KPI Cards */}
                        <div className="grid grid-cols-2 gap-3 sm:gap-4">
                            {/* Total Transactions */}
                            <div className={`animate-fade-in-delay shimmer-wrap relative bg-[#161b22] rounded-xl border border-[#30363d] p-4 sm:p-5 transition-all duration-300 hover:-translate-y-0.5 ${isRefreshing ? 'shimmer-active' : ''}`}>
                                <p className="text-[10px] font-medium text-[#8b949e] uppercase tracking-widest mb-2">Total Txns</p>
                                <p className="text-2xl sm:text-3xl font-bold text-[#e6edf3] font-data">{totalTx.toLocaleString()}</p>
                                <p className="text-[10px] text-[#484f58] mt-1">All time</p>
                            </div>

                            {/* Success Rate */}
                            <div className={`animate-fade-in-delay2 shimmer-wrap relative bg-[#161b22] rounded-xl border border-[#30363d] p-4 sm:p-5 transition-all duration-300 hover:-translate-y-0.5 ${isRefreshing ? 'shimmer-active' : ''}`}>
                                <p className="text-[10px] font-medium text-[#8b949e] uppercase tracking-widest mb-2">Success Rate</p>
                                <p className={`text-2xl sm:text-3xl font-bold font-data ${isHealthy ? 'text-emerald-400' : 'text-red-400'}`}>
                                    {successRt}%
                                </p>
                                <span className={`inline-flex items-center gap-1 text-[10px] px-1.5 py-0.5 rounded mt-1 border font-medium
                                    ${isHealthy
                                        ? 'text-emerald-400 bg-emerald-950/50 border-emerald-900'
                                        : 'text-red-400 bg-red-950/50 border-red-900'}`}>
                                    {isHealthy ? '↑' : '↓'} {isHealthy ? 'Healthy' : 'Low'}
                                </span>
                            </div>
                        </div>

                        <div className="animate-fade-in-delay">
                            <PaymentSimulator onSimulationComplete={fetchDashboardData} />
                        </div>

                        {metrics?.trafficDistribution && (
                            <div className="animate-fade-in-delay2">
                                <TrafficPieChart distribution={metrics.trafficDistribution} />
                            </div>
                        )}
                    </div>

                    {/* ── Right Column ── */}
                    <div className="lg:col-span-2 space-y-5">
                        <div className="animate-fade-in">
                            <MetricsTable stats={gatewayStats} isRefreshing={isRefreshing} />
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                            <div className="animate-fade-in-delay">
                                <SuccessRateChart stats={gatewayStats} />
                            </div>
                            <div className="animate-fade-in-delay2">
                                <FailureBarChart stats={gatewayStats} />
                            </div>
                        </div>
                    </div>

                </div>
            </PageContainer>
        </>
    );
};

export default Dashboard;
