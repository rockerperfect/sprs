import React from 'react';
import { Activity } from 'lucide-react';

const Navbar = () => {
    return (
        <nav className="bg-[#161b22] border-b border-[#30363d] px-4 sm:px-6 py-3 fixed w-full z-10 top-0 backdrop-blur-sm">
            <div className="flex items-center justify-between max-w-screen-2xl mx-auto">
                <div className="flex items-center gap-3">
                    <div className="p-1.5 rounded-lg bg-gradient-to-br from-indigo-600 to-violet-600 shadow-[0_0_12px_rgba(99,102,241,0.4)]">
                        <Activity className="h-5 w-5 text-white" />
                    </div>
                    <span className="text-base font-bold text-[#e6edf3] tracking-tight">
                        SPRS <span className="text-indigo-400 font-normal hidden sm:inline">Dashboard</span>
                    </span>
                </div>
                <div className="hidden sm:flex items-center gap-2 text-xs text-[#8b949e]">
                    <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                    </span>
                    LIVE · Smart Payment Routing Simulator
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
