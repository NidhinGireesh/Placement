import React, { useState, useEffect } from 'react';
import { getUsersByRole } from '../../services/adminService';

export default function DashboardOverview({ setActiveTab }) {
    const [students, setStudents] = useState([]);
    const [recruiters, setRecruiters] = useState([]);
    const [coordinators, setCoordinators] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            const studentResult = await getUsersByRole('student');
            const recruiterResult = await getUsersByRole('recruiter');
            const coordinatorResult = await getUsersByRole('coordinator');

            if (studentResult.success) setStudents(studentResult.data);
            if (recruiterResult.success) setRecruiters(recruiterResult.data);
            if (coordinatorResult.success) setCoordinators(coordinatorResult.data);
            setLoading(false);
        };

        fetchData();
    }, []);

    if (loading) return (
        <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
    );

    const stats = [
        {
            title: "Total Students",
            value: students.length,
            icon: "👨‍🎓",
            color: "from-blue-500 to-blue-600",
            bg: "bg-blue-50",
            text: "text-blue-600"
        },
        {
            title: "Approved Students",
            value: students.filter((s) => s.status === 'approved').length,
            icon: "✅",
            color: "from-green-500 to-green-600",
            bg: "bg-green-50",
            text: "text-green-600"
        },
        {
            title: "Blocked Students",
            value: students.filter((s) => s.blocked).length,
            icon: "🚫",
            color: "from-red-500 to-red-600",
            bg: "bg-red-50",
            text: "text-red-600"
        },
        {
            title: "Recruiters",
            value: recruiters.length,
            icon: "🏢",
            color: "from-purple-500 to-purple-600",
            bg: "bg-purple-50",
            text: "text-purple-600"
        },
        {
            title: "Coordinators",
            value: coordinators.length,
            icon: "👔",
            color: "from-amber-500 to-amber-600",
            bg: "bg-amber-50",
            text: "text-amber-600"
        },
    ];

    return (
        <div>
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-slate-800">System Overview</h1>
                <p className="text-slate-500 mt-2">Welcome back to the Admin Dashboard.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {stats.map((stat, index) => (
                    <div key={index} className="bg-white rounded-xl shadow-sm border border-slate-100 p-6 hover:shadow-md transition-shadow duration-300">
                        <div className="flex justify-between items-start">
                            <div>
                                <p className="text-sm font-medium text-slate-500 mb-1">{stat.title}</p>
                                <h3 className="text-3xl font-bold text-slate-800">{stat.value}</h3>
                            </div>
                            <div className={`p-3 rounded-lg ${stat.bg} ${stat.text} text-xl`}>
                                {stat.icon}
                            </div>
                        </div>
                        <div className="mt-4 w-full bg-gray-100 rounded-full h-1.5 overflow-hidden">
                            <div className={`h-full rounded-full bg-gradient-to-r ${stat.color} w-3/4`} style={{ width: '70%' }}></div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Recent Activity or Quick Actions could go here */}
            <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6">
                    <h3 className="text-lg font-bold text-slate-800 mb-4">Quick Actions</h3>
                    <div className="grid grid-cols-2 gap-4">
                        <button
                            onClick={() => setActiveTab('students')}
                            className="p-4 rounded-lg border border-slate-200 hover:border-blue-500 hover:bg-blue-50 transition-colors text-left group"
                        >
                            <span className="block text-2xl mb-2 group-hover:scale-110 transition-transform origin-left">🎓</span>
                            <span className="font-semibold text-slate-700 group-hover:text-blue-700">Add Student</span>
                        </button>
                        <button
                            onClick={() => setActiveTab('jobs')}
                            className="p-4 rounded-lg border border-slate-200 hover:border-purple-500 hover:bg-purple-50 transition-colors text-left group"
                        >
                            <span className="block text-2xl mb-2 group-hover:scale-110 transition-transform origin-left">📢</span>
                            <span className="font-semibold text-slate-700 group-hover:text-purple-700">Post Job</span>
                        </button>
                    </div>
                </div>

                <div className="bg-gradient-to-br from-indigo-600 to-purple-700 rounded-xl shadow-lg p-6 text-white overflow-hidden relative">
                    <div className="relative z-10">
                        <h3 className="text-xl font-bold mb-2">Placement Season 2026</h3>
                        <p className="text-indigo-100 mb-6 max-w-sm">
                            Manage the upcoming placement drive efficiently. Track analytics and reports in real-time.
                        </p>
                        <button className="bg-white text-indigo-600 px-4 py-2 rounded-lg font-semibold hover:bg-indigo-50 transition-colors">
                            View Reports
                        </button>
                    </div>
                    <div className="absolute right-0 bottom-0 opacity-10 transform translate-x-1/4 translate-y-1/4">
                        <svg width="300" height="300" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
                        </svg>
                    </div>
                </div>
            </div>
        </div>
    );
}