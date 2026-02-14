import React, { useState, useEffect } from 'react';
import { getUsersByRole, addUserDoc, deleteUserDoc, updateUserStatus } from '../../services/adminService';

export default function RecruiterManagement() {
    const [recruiters, setRecruiters] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showAddForm, setShowAddForm] = useState(false);
    const [newRecruiter, setNewRecruiter] = useState({ company: '', email: '' });

    useEffect(() => {
        fetchRecruiters();
    }, []);

    const fetchRecruiters = async () => {
        setLoading(true);
        const result = await getUsersByRole('recruiter');
        if (result.success) {
            setRecruiters(result.data);
        } else {
            console.error('Failed to fetch recruiters:', result.error);
        }
        setLoading(false);
    };

    const handleAddSubmit = async (e) => {
        e.preventDefault();
        if (!newRecruiter.company || !newRecruiter.email) return;

        setLoading(true);
        const result = await addUserDoc({
            company: newRecruiter.company,
            email: newRecruiter.email,
            role: 'recruiter',
            createdAt: new Date()
        });

        if (result.success) {
            fetchRecruiters();
            setShowAddForm(false);
            setNewRecruiter({ company: '', email: '' });
        }
        setLoading(false);
    };

    const removeRecruiter = async (id) => {
        if (window.confirm('Are you sure you want to remove this recruiter?')) {
            const result = await deleteUserDoc(id);
            if (result.success) {
                setRecruiters((prev) => prev.filter((r) => r.id !== id));
            }
        }
    };

    const toggleBlockRecruiter = async (id, currentBlockedStatus) => {
        const result = await updateUserStatus(id, { blocked: !currentBlockedStatus });
        if (result.success) {
            setRecruiters((prev) =>
                prev.map((recruiter) =>
                    recruiter.id === id ? { ...recruiter, blocked: !recruiter.blocked } : recruiter
                )
            );
        }
    };

    return (
        <div>
            <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-slate-800">Recruiter Management</h1>
                    <p className="text-slate-500">Manage company recruiters and their access.</p>
                </div>
                <button
                    onClick={() => setShowAddForm(!showAddForm)}
                    className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg shadow-md transition-colors flex items-center gap-2"
                >
                    <span>{showAddForm ? 'Cancel' : '+ Add Recruiter'}</span>
                </button>
            </div>

            {/* Add Recruiter Form */}
            {showAddForm && (
                <div className="bg-white p-6 rounded-xl shadow-sm border border-purple-100 mb-6 animate-fadeIn">
                    <h3 className="text-lg font-semibold text-slate-800 mb-4">Add New Recruiter</h3>
                    <form onSubmit={handleAddSubmit} className="flex flex-col md:flex-row gap-4 items-end">
                        <div className="w-full md:w-1/3">
                            <label className="block text-sm font-medium text-slate-700 mb-1">Company Name</label>
                            <input
                                type="text"
                                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none"
                                placeholder="e.g. TechCorp"
                                value={newRecruiter.company}
                                onChange={(e) => setNewRecruiter({ ...newRecruiter, company: e.target.value })}
                                required
                            />
                        </div>
                        <div className="w-full md:w-1/3">
                            <label className="block text-sm font-medium text-slate-700 mb-1">Email Address</label>
                            <input
                                type="email"
                                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none"
                                placeholder="hr@techcorp.com"
                                value={newRecruiter.email}
                                onChange={(e) => setNewRecruiter({ ...newRecruiter, email: e.target.value })}
                                required
                            />
                        </div>
                        <button
                            type="submit"
                            disabled={loading}
                            className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded-lg font-medium transition-colors disabled:opacity-50"
                        >
                            {loading ? 'Adding...' : 'Add Recruiter'}
                        </button>
                    </form>
                </div>
            )}

            <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                {loading && !showAddForm ? (
                    <div className="p-8 text-center text-slate-500">Loading recruiters...</div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-slate-50 border-b border-slate-200 text-xs uppercase text-slate-500 font-semibold">
                                    <th className="px-6 py-4">Company</th>
                                    <th className="px-6 py-4">Email</th>
                                    <th className="px-6 py-4">Blocked</th>
                                    <th className="px-6 py-4 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {recruiters.length === 0 ? (
                                    <tr>
                                        <td colSpan="4" className="px-6 py-8 text-center text-slate-500">
                                            No recruiters found.
                                        </td>
                                    </tr>
                                ) : (
                                    recruiters.map((rec) => (
                                        <tr key={rec.id} className="hover:bg-slate-50 transition-colors">
                                            <td className="px-6 py-4 font-medium text-slate-800">{rec.company}</td>
                                            <td className="px-6 py-4 text-slate-600">{rec.email}</td>
                                            <td className="px-6 py-4">
                                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${rec.blocked ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'
                                                    }`}>
                                                    {rec.blocked ? 'Yes' : 'No'}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <div className="flex justify-end gap-2">
                                                    <button
                                                        onClick={() => toggleBlockRecruiter(rec.id, rec.blocked)}
                                                        className={`px-3 py-1 rounded-md text-sm transition-colors border ${rec.blocked
                                                                ? 'border-gray-300 text-gray-700 hover:bg-gray-50'
                                                                : 'border-orange-200 text-orange-600 hover:bg-orange-50'
                                                            }`}
                                                    >
                                                        {rec.blocked ? 'Unblock' : 'Block'}
                                                    </button>
                                                    <button
                                                        onClick={() => removeRecruiter(rec.id)}
                                                        className="text-red-600 hover:bg-red-50 px-3 py-1 rounded-md text-sm transition-colors"
                                                    >
                                                        Remove
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
}