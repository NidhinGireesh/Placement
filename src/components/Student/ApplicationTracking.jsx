
export default function ApplicationTracking() {
    // Mock Data
    const applications = [
        {
            id: 101,
            company: 'InnovateTech',
            role: 'Frontend Developer',
            status: 'Shortlisted',
            appliedDate: '2026-02-01',
            lastUpdate: '2026-02-12',
            statusColor: 'text-yellow-600 bg-yellow-100'
        },
        {
            id: 102,
            company: 'FinServe',
            role: 'Analyst',
            status: 'Applied',
            appliedDate: '2026-02-10',
            lastUpdate: '2026-02-10',
            statusColor: 'text-blue-600 bg-blue-100'
        },
        {
            id: 103,
            company: 'Global Systems',
            role: 'System Engineer',
            status: 'Rejected',
            appliedDate: '2026-01-20',
            lastUpdate: '2026-01-25',
            statusColor: 'text-red-600 bg-red-100'
        }
    ];

    const getStatusBadge = (status, colorClass) => (
        <span className={`px-3 py-1 rounded-full text-sm font-semibold ${colorClass}`}>
            {status}
        </span>
    );

    return (
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
            <div className="p-6 border-b border-gray-100">
                <h2 className="text-xl font-bold text-gray-800">My Applications</h2>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full text-left">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-4 text-sm font-semibold text-gray-600 uppercase">Company</th>
                            <th className="px-6 py-4 text-sm font-semibold text-gray-600 uppercase">Role</th>
                            <th className="px-6 py-4 text-sm font-semibold text-gray-600 uppercase">Applied Date</th>
                            <th className="px-6 py-4 text-sm font-semibold text-gray-600 uppercase">Status</th>
                            <th className="px-6 py-4 text-sm font-semibold text-gray-600 uppercase">Action</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {applications.map((app) => (
                            <tr key={app.id} className="hover:bg-gray-50 transition-colors">
                                <td className="px-6 py-4 font-medium text-gray-900">{app.company}</td>
                                <td className="px-6 py-4 text-gray-600">{app.role}</td>
                                <td className="px-6 py-4 text-gray-600">{app.appliedDate}</td>
                                <td className="px-6 py-4">
                                    {getStatusBadge(app.status, app.statusColor)}
                                </td>
                                <td className="px-6 py-4">
                                    <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                                        View Details
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                {applications.length === 0 && (
                    <div className="text-center py-10 text-gray-500">
                        You haven't applied to any jobs yet. Head over to the Job Board!
                    </div>
                )}
            </div>
        </div>
    );
}
