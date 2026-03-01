import React from 'react';

const PageContainer = ({ children }) => {
    return (
        <div className="min-h-screen bg-[#0d1117] pt-16">
            <main className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {children}
            </main>
        </div>
    );
};

export default PageContainer;
