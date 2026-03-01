import React, { useEffect, useState } from 'react';
import { getMetrics, getGatewayHealth } from '../api/metrics.api';
import { resetSimulation } from '../api/payment.api';
import Navbar from '../components/layout/Navbar';
import PageContainer from '../components/layout/PageContainer';
import PaymentSimulator from '../components/dashboard/PaymentSimulator';
import MetricsTable from '../components/dashboard/MetricsTable';
import TrafficPieChart from '../components/dashboard/TrafficPieChart';
import SuccessRateChart from '../components/dashboard/SuccessRateChart';
import FailureBarChart from '../components/dashboard/FailureBarChart';

const Dashboard = () => {
    const [metrics, setMetrics] = useState(null);
    const [gatewayStats, setGatewayStats] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isResetting, setIsResetting] = useState(false);

    const fetchDashboardData = async () => {
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
                    <p className="text-[#8b949e] text-sm">Loading dashboard...</p>
                </div>
            </div>
        );
    }

    return (
        <>
            <Navbar />
            <PageContainer>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 lg:gap-6">

                    {/* Left Column */}
                    <div className="lg:col-span-1 space-y-5">

                        {/* Overview Header */}
                        <div className="flex justify-between items-center bg-[#161b22] rounded-xl border border-[#30363d] px-4 py-3">
                            <div>
                                <p className="text-[10px] font-medium text-[#8b949e] uppercase tracking-widest">System</p>
                                <h2 className="text-sm font-semibold text-[#e6edf3]">Overview</h2>
                            </div>
                            <button
                                onClick={handleReset}
                                disabled={isResetting}
                                className="btn-danger"
                            >
                                {isResetting ? 'Resetting...' : 'Reset Data'}
                            </button>
                        </div>

                        {/* KPI Cards */}
                        <div className="grid grid-cols-2 gap-3 sm:gap-4">
                            <div className="bg-[#161b22] rounded-xl border border-[#30363d] p-4 sm:p-5">
                                <p className="text-[10px] font-medium text-[#8b949e] uppercase tracking-widest mb-2">Total Transactions</p>
                                <p className="text-2xl sm:text-3xl font-bold text-[#e6edf3] font-data">{metrics?.totalTransactions || 0}</p>
                            </div>
                            <div className="bg-[#161b22] rounded-xl border border-[#30363d] p-4 sm:p-5">
                                <p className="text-[10px] font-medium text-[#8b949e] uppercase tracking-widest mb-2">Success Rate</p>
                                <p className="text-2xl sm:text-3xl font-bold text-emerald-400 font-data">{metrics?.successRate || 0}%</p>
                            </div>
                        </div>

                        <PaymentSimulator onSimulationComplete={fetchDashboardData} />

                        {metrics?.trafficDistribution && (
                            <TrafficPieChart distribution={metrics.trafficDistribution} />
                        )}
                    </div>

                    {/* Right Column */}
                    <div className="lg:col-span-2 space-y-5">
                        <MetricsTable stats={gatewayStats} />
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                            <SuccessRateChart stats={gatewayStats} />
                            <FailureBarChart stats={gatewayStats} />
                        </div>
                    </div>

                </div>
            </PageContainer>
        </>
    );
};

export default Dashboard;
