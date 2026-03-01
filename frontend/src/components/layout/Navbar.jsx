import React from 'react';

const Navbar = () => {
    return (
        <nav className="bg-[#161b22]/95 border-b border-[#30363d] px-4 sm:px-6 py-4 fixed w-full z-10 top-0 backdrop-blur-md">
            <div className="flex items-center justify-between max-w-screen-2xl mx-auto">
                <div className="flex items-center gap-3">
                    <div className="relative">
                        <div className="absolute inset-0 rounded-xl bg-indigo-500/20 blur-md scale-110"></div>
                        <img
                            src="/icon.png"
                            alt="SPRS Logo"
                            className="relative h-11 w-11 rounded-xl object-contain ring-1 ring-indigo-500/30 shadow-[0_0_20px_rgba(99,102,241,0.4)]"
                        />
                    </div>
                    <div className="flex flex-col leading-tight">
                        <span className="text-lg font-bold tracking-tight bg-gradient-to-r from-white via-indigo-200 to-violet-300 bg-clip-text text-transparent">
                            SPRS
                        </span>
                        <span className="text-[10px] font-medium text-[#8b949e] uppercase tracking-widest hidden sm:block -mt-0.5">
                            Dashboard
                        </span>
                    </div>
                </div>
                <div className="hidden sm:flex items-center gap-2.5 text-xs text-[#8b949e] bg-[#0d1117]/60 border border-[#30363d] rounded-full px-3 py-1.5">
                    <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                    </span>
                    <span className="text-[#c9d1d9]">LIVE</span>
                    <span className="text-[#484f58]">·</span>
                    Smart Payment Routing Simulator
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
