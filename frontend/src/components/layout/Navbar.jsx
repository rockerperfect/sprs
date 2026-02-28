import React from 'react';
import { Activity } from 'lucide-react';

const Navbar = () => {
    return (
        <nav className="bg-white border-b border-gray-200 px-4 py-3 fixed w-full z-10 top-0">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <Activity className="h-6 w-6 text-indigo-600" />
                    <span className="text-xl font-bold text-gray-900">SPRS Dashboard</span>
                </div>
                <div className="text-sm text-gray-500">
                    Smart Payment Routing Simulator
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
