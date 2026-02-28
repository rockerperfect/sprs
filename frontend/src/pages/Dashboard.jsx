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
        // Auto-refresh every 5 seconds
        const interval = setInterval(fetchDashboardData, 5000);
        return () => clearInterval(interval);
    }, []);

    if (loading && !metrics) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
            </div>
        );
    }

    return (
        <>
            <Navbar />
            <PageContainer>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left Column Controls */}
                    <div className="lg:col-span-1 space-y-6">

                        {/* High Level Stats Summary */}
                        <div className="flex justify-between items-center bg-white rounded-xl shadow-sm border border-gray-100 p-4">
                            <h2 className="text-lg font-bold text-gray-800">Overview</h2>
                            <button
                                onClick={handleReset}
                                disabled={isResetting}
                                className="text-xs font-semibold bg-red-50 text-red-600 px-3 py-1.5 rounded hover:bg-red-100 transition-colors disabled:opacity-50"
                            >
                                {isResetting ? 'Resetting...' : 'Reset Data'}
                            </button>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
                                <p className="text-sm font-medium text-gray-500 mb-1">Total Transactions</p>
                                <p className="text-2xl font-bold text-gray-900">{metrics?.totalTransactions || 0}</p>
                            </div>
                            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
                                <p className="text-sm font-medium text-gray-500 mb-1">Global Success Rate</p>
                                <p className="text-2xl font-bold text-green-600">{metrics?.successRate || 0}%</p>
                            </div>
                        </div>

                        <PaymentSimulator onSimulationComplete={fetchDashboardData} />

                        {metrics?.trafficDistribution && (
                            <TrafficPieChart distribution={metrics.trafficDistribution} />
                        )}

                    </div>

                    {/* Right Column Tables & Charts */}
                    <div className="lg:col-span-2 space-y-8">
                        <MetricsTable stats={gatewayStats} />
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
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
