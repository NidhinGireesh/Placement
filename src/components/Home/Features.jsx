import React from 'react';

export default function Features() {
    const features = [
        { title: 'Automated Filtering', icon: '⚡', desc: 'Instantly check eligibility criteria.' },
        { title: 'Resume Collection', icon: '📄', desc: 'Centralized resume management.' },
        { title: 'Interview Scheduling', icon: '📅', desc: 'Seamless scheduling for hiring.' },
        { title: 'Real-time Alerts', icon: '🔔', desc: 'Never miss an update or deadline.' },
        { title: 'Recruiter Dashboard', icon: '📊', desc: 'Powerful tools for hiring managers.' },
        { title: 'Analytics Reports', icon: '📈', desc: 'Insights into placement trends.' },
    ];

    return (
        <section className="py-16 bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <h2 className="text-3xl font-bold text-center mb-12 text-gray-800">Why Use This Platform?</h2>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {features.map((feature, index) => (
                        <div key={index} className="p-6 rounded-xl border border-gray-100 hover:border-blue-100 hover:shadow-lg transition-all duration-300 group">
                            <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center text-2xl mb-4 group-hover:scale-110 transition-transform">
                                {feature.icon}
                            </div>
                            <h3 className="text-xl font-bold text-gray-800 mb-2">{feature.title}</h3>
                            <p className="text-gray-500">{feature.desc}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
