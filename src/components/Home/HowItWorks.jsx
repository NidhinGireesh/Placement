import React from 'react';

export default function HowItWorks() {
    const studentSteps = [
        { title: 'Register Profile', icon: '📝' },
        { title: 'Get Eligible Companies', icon: '🎯' },
        { title: 'Attend Tests', icon: '💻' },
        { title: 'Get Placed 🎉', icon: '🎓' },
    ];

    const recruiterSteps = [
        { title: 'Post Job', icon: '📢' },
        { title: 'Filter Candidates', icon: '🔍' },
        { title: 'Schedule Interviews', icon: '📅' },
        { title: 'Hire Students', icon: '🤝' },
    ];

    return (
        <section className="py-16 bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <h2 className="text-3xl font-bold text-center mb-12 text-gray-800">How It Works</h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                    {/* Student Flow */}
                    <div className="bg-blue-50/50 p-8 rounded-2xl border border-blue-100">
                        <h3 className="text-xl font-bold text-blue-800 mb-6 text-center">For Students</h3>
                        <div className="space-y-6">
                            {studentSteps.map((step, index) => (
                                <div key={index} className="flex items-center space-x-4">
                                    <div className="flex-shrink-0 w-10 h-10 bg-white text-blue-600 rounded-full flex items-center justify-center font-bold shadow-sm border border-blue-100">
                                        {index + 1}
                                    </div>
                                    <div className="flex-1 bg-white p-4 rounded-xl shadow-sm border border-blue-50 flex items-center space-x-3">
                                        <span className="text-2xl">{step.icon}</span>
                                        <span className="font-medium text-gray-700">{step.title}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Recruiter Flow */}
                    <div className="bg-indigo-50/50 p-8 rounded-2xl border border-indigo-100">
                        <h3 className="text-xl font-bold text-indigo-800 mb-6 text-center">For Recruiters</h3>
                        <div className="space-y-6">
                            {recruiterSteps.map((step, index) => (
                                <div key={index} className="flex items-center space-x-4">
                                    <div className="flex-shrink-0 w-10 h-10 bg-white text-indigo-600 rounded-full flex items-center justify-center font-bold shadow-sm border border-indigo-100">
                                        {index + 1}
                                    </div>
                                    <div className="flex-1 bg-white p-4 rounded-xl shadow-sm border border-indigo-50 flex items-center space-x-3">
                                        <span className="text-2xl">{step.icon}</span>
                                        <span className="font-medium text-gray-700">{step.title}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
