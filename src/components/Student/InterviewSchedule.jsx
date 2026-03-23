import React, { useState, useEffect } from 'react';
import { useAuthStore } from '../../store/authStore';
import { getApplicationsForStudent } from '../../services/jobService';

export default function InterviewSchedule() {
    const { user } = useAuthStore();
    const [interviews, setInterviews] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (user?.uid) {
            fetchInterviews();
        }
    }, [user]);

    const fetchInterviews = async () => {
        setLoading(true);
        const result = await getApplicationsForStudent(user.uid);
        if (result.success) {
            // Filter for applications with scheduled interviews
            const scheduled = result.data.filter(app => 
                app.status === 'Interview Scheduled' || 
                app.interviewDate // Backwards compatibility if status changes but date remains
            );
            setInterviews(scheduled);
        }
        setLoading(false);
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center py-20">
                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    return (
        <div className="animate-fadeIn">
            <div className="flex justify-end items-center mb-8">
                <button 
                    onClick={fetchInterviews}
                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors text-sm font-medium flex items-center gap-2 shadow-sm"
                >
                    🔄 Refresh Schedule
                </button>
            </div>

            <div className="space-y-6">
                {interviews.length > 0 ? (
                    interviews.map(interview => (
                        <div key={interview.id} className="bg-white rounded-3xl shadow-xl border border-slate-100 overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
                            <div className="p-8 md:p-10">
                                <div className="flex flex-col gap-8">
                                    {/* Header Section */}
                                    <div className="flex justify-between items-start border-b border-slate-50 pb-6">
                                        <div>
                                            <div className="flex items-center gap-3 mb-2">
                                                <h3 className="text-2xl font-black text-slate-900 tracking-tight">{interview.company}</h3>
                                                <span className="bg-emerald-100 text-emerald-700 text-[10px] px-3 py-1 rounded-full font-black uppercase tracking-widest">
                                                    Confirmed
                                                </span>
                                            </div>
                                            <p className="text-xl text-indigo-600 font-bold">{interview.jobTitle}</p>
                                        </div>
                                        <div className="hidden md:block">
                                            <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center text-3xl shadow-inner">
                                                🤝
                                            </div>
                                        </div>
                                    </div>
                                    
                                    {/* Highlighted Date, Time, Venue */}
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-6 rounded-2xl border border-blue-100/50 flex flex-col items-center text-center group">
                                            <span className="text-3xl mb-3 transform group-hover:scale-110 transition-transform">📅</span>
                                            <p className="text-[10px] uppercase font-black text-blue-400 tracking-widest mb-1">Interview Date</p>
                                            <p className="text-2xl font-black text-slate-800">{interview.interviewDate}</p>
                                        </div>
                                        
                                        <div className="bg-gradient-to-br from-purple-50 to-pink-50 p-6 rounded-2xl border border-purple-100/50 flex flex-col items-center text-center group">
                                            <span className="text-3xl mb-3 transform group-hover:scale-110 transition-transform">⏰</span>
                                            <p className="text-[10px] uppercase font-black text-purple-400 tracking-widest mb-1">Scheduled Time</p>
                                            <p className="text-2xl font-black text-slate-800">{interview.interviewTime}</p>
                                        </div>

                                        <div className="bg-gradient-to-br from-amber-50 to-orange-50 p-6 rounded-2xl border border-amber-100/50 flex flex-col items-center text-center group md:col-span-1">
                                            <span className="text-3xl mb-3 transform group-hover:scale-110 transition-transform">📍</span>
                                            <p className="text-[10px] uppercase font-black text-amber-500 tracking-widest mb-1">Venue / Mode</p>
                                            <p className="text-xl font-black text-slate-800 break-words w-full">
                                                {interview.interviewVenue || 'Check Details'}
                                            </p>
                                        </div>
                                    </div>

                                    {/* Message Section */}
                                    {interview.interviewMessage && (
                                        <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100 relative overflow-hidden">
                                            <div className="absolute top-0 left-0 w-1 h-full bg-indigo-500"></div>
                                            <p className="text-xs uppercase font-black text-slate-400 tracking-widest mb-3">Additional Instructions</p>
                                            <p className="text-slate-700 font-medium leading-relaxed italic">
                                                "{interview.interviewMessage}"
                                            </p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="bg-white p-12 rounded-2xl shadow-sm border border-dashed border-slate-200 text-center">
                        <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4 grayscale opacity-50">
                            <span className="text-4xl">🤝</span>
                        </div>
                        <h3 className="text-xl font-bold text-gray-800 mb-2">No Interviews Yet</h3>
                        <p className="text-gray-500 max-w-sm mx-auto">
                            When recruiters schedule interviews for your applications, they will appear here with dates, times, and instructions.
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}
