import React from 'react';

export default function PlacementChart() {
    const data = [
        { department: 'CSE', percentage: 0, color: 'bg-blue-500' },
        { department: 'ECE', percentage: 0, color: 'bg-indigo-500' },
        { department: 'ME', percentage: 0, color: 'bg-purple-500' },
        { department: 'CE', percentage: 0, color: 'bg-teal-500' },
        { department: 'IT', percentage: 0, color: 'bg-cyan-500' },
    ];

    return (
        <section className="py-16 bg-gray-50">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                <h2 className="text-3xl font-bold text-center mb-10 text-gray-800">Department-wise Success</h2>

                <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
                    <div className="space-y-6">
                        {data.map((item) => (
                            <div key={item.department}>
                                <div className="flex justify-between mb-2">
                                    <span className="font-bold text-gray-700">{item.department}</span>
                                    <span className="font-medium text-gray-500">{item.percentage}% Placed</span>
                                </div>
                                <div className="w-full bg-gray-100 rounded-full h-4 overflow-hidden">
                                    <div
                                        className={`${item.color} h-4 rounded-full transition-all duration-1000 ease-out`}
                                        style={{ width: `${item.percentage}%` }}
                                    ></div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}
