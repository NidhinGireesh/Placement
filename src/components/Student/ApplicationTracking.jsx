import { useState, useEffect } from 'react';
import { useAuthStore } from '../../store/authStore';
import { getApplicationsForStudent, revokeApplication } from '../../services/jobService';
import { formatDate } from '../../utils/dateUtils';

export default function ApplicationTracking() {
    const { user } = useAuthStore();
    const [applications, setApplications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedApp, setSelectedApp] = useState(null);

    useEffect(() => {
        const fetchApps = async () => {
            if (user?.uid) {
                const result = await getApplicationsForStudent(user.uid);
                if (result.success) {
                    setApplications(result.data);
                }
                setLoading(false);
            }
        };
        fetchApps();
    }, [user]);



    const handleRevoke = async (applicationId) => {
        if (!window.confirm("Are you sure you want to withdraw this application? This action cannot be undone.")) return;

        const result = await revokeApplication(applicationId);
        if (result.success) {
            setApplications(prev => prev.filter(app => app.id !== applicationId));
            if (selectedApp && selectedApp.id === applicationId) {
                setSelectedApp(null);
            }
            alert("Application withdrawn successfully.");
        } else {
            alert(result.error);
        }
    };

    const getStatusBadge = (status) => {
        let colorClass = 'text-gray-600 bg-gray-100';
        if (status === 'Shortlisted') colorClass = 'text-green-600 bg-green-100';
        else if (status === 'Applied') colorClass = 'text-blue-600 bg-blue-100';
        else if (status === 'Rejected') colorClass = 'text-red-600 bg-red-100';

        return (
            <span className={`px-3 py-1 rounded-full text-sm font-semibold ${colorClass}`}>
                {status}
            </span>
        );
    };

    // formatDate moved to utils/dateUtils.js

    return (
        <div className="bg-white rounded-xl shadow-md overflow-hidden relative">

            <div className="overflow-x-auto">
                {loading ? (
                    <div className="text-center py-10 text-gray-500 font-medium animate-pulse">
                        Loading your applications...
                    </div>
                ) : applications.length === 0 ? (
                    <div className="text-center py-10 text-gray-500">
                        You haven't applied to any jobs yet. Head over to the Job Board!
                    </div>
                ) : (
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
                                    <td className="px-6 py-4 text-gray-600">{app.jobTitle}</td>
                                    <td className="px-6 py-4 text-gray-600">{formatDate(app.appliedAt)}</td>
                                    <td className="px-6 py-4">
                                        {getStatusBadge(app.status)}
                                    </td>
                                    <td className="px-6 py-4">
                                        <button 
                                            onClick={() => setSelectedApp(app)}
                                            className="text-indigo-600 hover:text-indigo-800 font-semibold text-sm transition-colors"
                                        >
                                            View Details
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>

            {/* Application Details Modal */}
            {selectedApp && (
                <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl relative">
                        <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                            <h3 className="text-xl font-bold text-gray-800">Application Details</h3>
                            <button 
                                onClick={() => setSelectedApp(null)}
                                className="text-gray-400 hover:bg-gray-100 p-2 rounded-full transition-colors"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>
                        <div className="p-6 space-y-4">
                            <div>
                                <p className="text-sm text-gray-500 font-semibold mb-1">Company</p>
                                <p className="text-lg font-medium text-gray-900">{selectedApp.company}</p>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <p className="text-sm text-gray-500 font-semibold mb-1">Role</p>
                                    <p className="font-medium text-gray-900">{selectedApp.jobTitle}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500 font-semibold mb-1">Type</p>
                                    <p className="font-medium text-gray-900">{selectedApp.type}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500 font-semibold mb-1">Location</p>
                                    <p className="font-medium text-gray-900">{selectedApp.location}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500 font-semibold mb-1">Applied On</p>
                                    <p className="font-medium text-gray-900">{formatDate(selectedApp.appliedAt)}</p>
                                </div>
                            </div>
                            <div className="mt-4 pt-4 border-t border-gray-100">
                                <p className="text-sm text-gray-500 font-semibold mb-2">Current Status</p>
                                {getStatusBadge(selectedApp.status)}
                                {selectedApp.status === 'Shortlisted' && (
                                    <div className="mt-4">
                                        <p className="text-sm text-green-600 mt-3 font-medium bg-green-50 p-3 rounded-xl border border-green-100 mb-4">Congratulations! You have been shortlisted. The recruitment team will reach out to you with next steps.</p>
                                    </div>
                                )}
                                {selectedApp.status === 'Interview Scheduled' && (
                                    <div className="mt-4 p-5 bg-indigo-50/50 rounded-2xl border border-indigo-100 flex flex-col gap-3">
                                        <div className="flex items-center gap-3">
                                            <span className="text-xl">🗓️</span>
                                            <p className="text-sm text-indigo-900 font-black">Interview Scheduled!</p>
                                        </div>
                                        <div className="space-y-2 text-sm text-slate-600 pl-8">
                                            {selectedApp.interviewDate && <p><span className="font-bold text-slate-500">Date:</span> {selectedApp.interviewDate}</p>}
                                            {selectedApp.interviewTime && <p><span className="font-bold text-slate-500">Time:</span> {selectedApp.interviewTime}</p>}
                                        </div>
                                        {selectedApp.interviewMessage && (
                                            <div className="mt-2 p-3 bg-white/60 rounded-xl border border-indigo-50 backdrop-blur-sm">
                                                <p className="text-[10px] font-black text-indigo-400 uppercase tracking-widest mb-1">Message from Recruiter</p>
                                                <p className="text-xs text-slate-600 leading-relaxed font-medium">{selectedApp.interviewMessage}</p>
                                            </div>
                                        )}
                                    </div>
                                )}
                                {selectedApp.status === 'Rejected' && (
                                    <p className="text-sm text-red-500 mt-3 font-medium bg-red-50 p-3 rounded-xl border border-red-100">Unfortunately, the company has decided to move forward with other candidates.</p>
                                )}
                                {selectedApp.status === 'Applied' && (
                                    <div className="mt-6">
                                        <button
                                            onClick={() => handleRevoke(selectedApp.id)}
                                            className="w-full text-red-600 font-semibold py-3 rounded-xl border-2 border-red-100 hover:bg-red-50 hover:border-red-200 transition-colors"
                                        >
                                            Withdraw Application
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}


        </div>
    );
}
