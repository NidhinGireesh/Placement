import React, { useState, useEffect } from 'react';
import { getUserDetails } from '../../services/adminService';

export default function UserDetailsModal({ isOpen, onClose, userId, role }) {
    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (isOpen && userId) {
            fetchDetails();
        }
    }, [isOpen, userId]);

    const fetchDetails = async () => {
        setLoading(true);
        setError(null);
        const result = await getUserDetails(userId, role);
        if (result.success) {
            setUserData(result.data);
        } else {
            setError(result.error);
        }
        setLoading(false);
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm animate-fadeIn"
                onClick={onClose}
            ></div>

            {/* Modal Container */}
            <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-2xl overflow-hidden animate-slideUp">
                {/* Header */}
                <div className="bg-gradient-to-r from-slate-900 to-slate-800 p-8 text-white relative">
                    <button
                        onClick={onClose}
                        className="absolute top-6 right-6 p-2 rounded-full hover:bg-white/10 transition-colors"
                    >
                        ✕
                    </button>
                    <div className="flex items-center gap-6">
                        {/* User photo (students/coordinators) or emoji fallback */}
                        {(userData?.profile?.photoUrl || userData?.photoUrl) ? (
                            <img
                                src={userData.profile?.photoUrl || userData.photoUrl}
                                alt={userData?.name || 'User'}
                                className="w-20 h-20 rounded-2xl object-cover border-2 border-white/20 shadow-lg"
                            />
                        ) : (
                            <div className="w-20 h-20 rounded-2xl bg-white/10 flex items-center justify-center text-4xl border border-white/10">
                                {role === 'recruiter' ? '🏢' : (userData?.role === 'coordinator' ? '👔' : '👨‍🎓')}
                            </div>
                        )}
                        <div>
                            <h2 className="text-3xl font-bold tracking-tight">{userData?.name || userData?.company || 'User Details'}</h2>
                            <p className="text-slate-400 font-medium capitalize mt-1 tracking-wide">{userData?.role || role}</p>
                        </div>
                    </div>
                </div>

                {/* Content */}
                <div className="p-8 max-h-[70vh] overflow-y-auto custom-scrollbar">
                    {loading ? (
                        <div className="py-20 text-center">
                            <div className="w-12 h-12 border-4 border-indigo-600/20 border-t-indigo-600 rounded-full animate-spin mx-auto mb-4"></div>
                            <p className="text-slate-500 font-medium italic">Fetching profile data...</p>
                        </div>
                    ) : error ? (
                        <div className="bg-red-50 text-red-600 p-6 rounded-2xl border border-red-100 text-center font-medium">
                            {error}
                        </div>
                    ) : (
                        <div className="space-y-8">
                            {/* General Info */}
                            <section>
                                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4 border-b border-slate-100 pb-2">Primary Information</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                                    <DetailItem label="Full Name" value={userData.name} />
                                    <DetailItem label="Email" value={userData.email} copyable />
                                    <DetailItem label="Phone" value={userData.phone} />
                                    <DetailItem label="Account Status" value={userData.status || (userData.approved ? 'Approved' : 'Pending')} />
                                </div>
                            </section>

                            {/* Academic Profile - Shown for Students and Coordinators */}
                            {userData.profile && (
                                <section>
                                    <h3 className="text-xs font-bold text-indigo-400 uppercase tracking-widest mb-4 border-b border-indigo-50 pb-2">Academic Profile</h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                                        <DetailItem label="Register Number" value={userData.profile.registerNumber} />
                                        <DetailItem label="Branch" value={userData.profile.branch} />
                                        <DetailItem label="Batch / Passout" value={userData.profile.passoutYear} />
                                        <DetailItem label="CGPA" value={userData.profile.cgpa} highlight />
                                        <DetailItem label="Active Backlogs" value={userData.profile.backlogs !== undefined ? String(userData.profile.backlogs) : undefined} />
                                        <DetailItem label="Gender" value={userData.profile.gender} capitalize />
                                        <DetailItem label="Lateral Entry" value={userData.profile.lateralEntry} capitalize />
                                    </div>
                                    <div className="mt-6">
                                        <DetailItem label="Skills" value={userData.profile.skills?.join(', ') || 'None listed'} />
                                    </div>
                                    {userData.profile.resumeUrl && (
                                        <div className="mt-6">
                                            <a
                                                href={userData.profile.resumeUrl}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="inline-flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-xl font-bold hover:shadow-lg hover:shadow-indigo-500/30 transition-all hover:-translate-y-0.5"
                                            >
                                                📄 View Resume
                                            </a>
                                        </div>
                                    )}
                                </section>
                            )}

                            {/* Role Specific Details - COORDINATOR */}
                            {(role === 'coordinator' || userData.role === 'coordinator') && (
                                <section>
                                    <h3 className="text-xs font-bold text-indigo-400 uppercase tracking-widest mb-4 border-b border-indigo-50 pb-2">Student Coordinator Management</h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                                        <DetailItem label="Department" value={userData.department} />
                                        <DetailItem label="Assigned Class" value={userData.class} />
                                    </div>
                                </section>
                            )}

                            {/* Role Specific Details - RECRUITER */}
                            {role === 'recruiter' && (
                                <section>
                                    <h3 className="text-xs font-bold text-indigo-400 uppercase tracking-widest mb-4 border-b border-indigo-50 pb-2">Company Profile</h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                                        <DetailItem label="Website" value={userData.website} isLink />
                                        <DetailItem label="Industry" value={userData.industry} />
                                        <DetailItem label="Location" value={userData.location} />
                                    </div>
                                </section>
                            )}
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="p-6 bg-slate-50 border-t border-slate-100 flex justify-end">
                    <button
                        onClick={onClose}
                        className="px-8 py-2.5 bg-white border border-slate-200 text-slate-700 rounded-xl font-bold hover:bg-slate-100 transition-colors shadow-sm"
                    >
                        Close Portal
                    </button>
                </div>
            </div>
        </div>
    );
}

function DetailItem({ label, value, highlight, capitalize, copyable, isLink }) {
    const displayValue = value || 'Not Provided';

    return (
        <div>
            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1.5">{label}</label>
            <div className={`
                text-slate-800 font-semibold truncate
                ${highlight ? 'text-indigo-600 text-lg font-black' : ''}
                ${capitalize ? 'capitalize' : ''}
            `}>
                {isLink && displayValue !== 'Not Provided' ? (
                    <a href={displayValue} target="_blank" rel="noopener noreferrer" className="text-indigo-500 hover:underline">
                        {displayValue}
                    </a>
                ) : displayValue}
            </div>
        </div>
    );
}
