import React from 'react';

export default function UpcomingDrives() {
    const drives = [
        {
            id: 1,
            company: 'Infosys',
            role: 'System Engineer',
            deadline: 'Feb 18, 2026',
            eligibility: 'CSE, ECE',
            logo: 'https://logo.clearbit.com/infosys.com'
        },
        {
            id: 2,
            company: 'TCS',
            role: 'Digital Innovator',
            deadline: 'Feb 21, 2026',
            eligibility: 'All Branches',
            logo: 'https://logo.clearbit.com/tcs.com'
        },
        {
            id: 3,
            company: 'Accenture',
            role: 'App Development Analyst',
            deadline: 'Feb 25, 2026',
            eligibility: 'CSE, IT, MCA',
            logo: 'https://logo.clearbit.com/accenture.com'
        }
    ];

    return (
        <section className="py-16 bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <h2 className="text-3xl font-bold text-center mb-12 text-gray-800">Upcoming Drives</h2>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {drives.map((drive) => (
                        <div key={drive.id} className="bg-white rounded-xl shadow-md border border-gray-100 p-6 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 relative overflow-hidden group">
                            <div className="absolute top-0 right-0 w-24 h-24 bg-blue-50 rounded-bl-full -mr-4 -mt-4 opacity-50 group-hover:bg-blue-100 transition-colors"></div>

                            <div className="flex items-center space-x-4 mb-4 relative z-10">
                                <img src={drive.logo} alt={drive.company} className="w-16 h-16 object-contain p-2 bg-gray-50 rounded-lg" onError={(e) => { e.target.style.display = 'none'; e.target.nextSibling.style.display = 'block' }} />
                                <div className="w-16 h-16 bg-gray-100 rounded-lg hidden flex items-center justify-center text-xs text-gray-500 font-bold">{drive.company.substring(0, 2)}</div>
                                <div>
                                    <h3 className="font-bold text-lg text-gray-800">{drive.company}</h3>
                                    <span className="text-sm text-green-600 font-medium bg-green-50 px-2 py-0.5 rounded-full">Register Open</span>
                                </div>
                            </div>

                            <div className="space-y-2 mb-6">
                                <p className="text-gray-600 text-sm flex items-center gap-2">
                                    <span className="font-bold text-gray-800">Role:</span> {drive.role}
                                </p>
                                <p className="text-gray-600 text-sm flex items-center gap-2">
                                    <span className="font-bold text-gray-800">Deadline:</span> {drive.deadline}
                                </p>
                                <p className="text-gray-600 text-sm flex items-center gap-2">
                                    <span className="font-bold text-gray-800">Eligible:</span> {drive.eligibility}
                                </p>
                            </div>

                            <button className="w-full bg-blue-600 text-white py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors shadow-sm">
                                Apply Now
                            </button>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
