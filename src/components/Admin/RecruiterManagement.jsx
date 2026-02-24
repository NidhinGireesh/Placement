import React, { useState, useEffect } from 'react';
import { getUsersByRole, addUserDoc, deleteUserDoc, updateUserStatus } from '../../services/adminService';
import UserDetailsModal from './UserDetailsModal';

export default function RecruiterManagement() {
    const [recruiters, setRecruiters] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showAddForm, setShowAddForm] = useState(false);
    const [newRecruiter, setNewRecruiter] = useState({ company: '', email: '' });

    // Modal state
    const [selectedRecId, setSelectedRecId] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        fetchRecruiters();
    }, []);

    const openDetails = (id) => {
        setSelectedRecId(id);
        setIsModalOpen(true);
    };

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
            createdAt: new Date(),
            company: newRecruiter.company // Ensure this key is consistent with authService
        });

        if (result.success) {
            fetchRecruiters();
            setShowAddForm(false);
            setNewRecruiter({ company: '', email: '' });
        } else {
            alert('Error adding recruiter: ' + result.error);
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
                                    <th className="px-6 py-4">Industry</th>
                                    <th className="px-6 py-4">Location</th>
                                    <th className="px-6 py-4">Status</th>
                                    <th className="px-6 py-4 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {recruiters.length === 0 ? (
                                    <tr>
                                        <td colSpan="6" className="px-6 py-8 text-center text-slate-500">
                                            No recruiters found.
                                        </td>
                                    </tr>
                                ) : (
                                    recruiters.map((rec) => (
                                        <tr key={rec.id} className="hover:bg-slate-50 transition-colors">
                                            <td className="px-6 py-4 font-medium text-slate-800">
                                                <button
                                                    onClick={() => openDetails(rec.id)}
                                                    className="font-semibold text-purple-600 hover:text-purple-800 hover:underline transition-all text-left"
                                                >
                                                    {rec.company || rec.name}
                                                </button>
                                                {rec.website && (
                                                    <div className="mt-1">
                                                        <a href={rec.website} target="_blank" rel="noopener noreferrer" className="text-xs text-indigo-500 hover:underline">
                                                            Visit Website
                                                        </a>
                                                    </div>
                                                )}
                                            </td>
                                            <td className="px-6 py-4 text-slate-600">{rec.email}</td>
                                            <td className="px-6 py-4 text-slate-600">{rec.industry || '-'}</td>
                                            <td className="px-6 py-4 text-slate-600">{rec.location || '-'}</td>
                                            <td className="px-6 py-4">
                                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${rec.approved ? 'bg-green-100 text-green-800' :
                                                    rec.status === 'Rejected' ? 'bg-red-100 text-red-800' :
                                                        'bg-yellow-100 text-yellow-800'
                                                    }`}>
                                                    {rec.approved ? 'Approved' : (rec.status || 'Pending')}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <div className="flex justify-end gap-2">
                                                    {!rec.approved && (rec.status !== 'Rejected') && (
                                                        <>
                                                            <button
                                                                onClick={() => updateUserStatus(rec.id, { approved: true, status: 'Approved' }).then(() => fetchRecruiters())}
                                                                className="text-white bg-green-500 hover:bg-green-600 px-3 py-1 rounded-md text-sm transition-colors"
                                                            >
                                                                Approve
                                                            </button>
                                                            <button
                                                                onClick={() => updateUserStatus(rec.id, { approved: false, status: 'Rejected' }).then(() => fetchRecruiters())}
                                                                className="text-white bg-red-500 hover:bg-red-600 px-3 py-1 rounded-md text-sm transition-colors"
                                                            >
                                                                Reject
                                                            </button>
                                                        </>
                                                    )}
                                                    <button
                                                        onClick={() => removeRecruiter(rec.id)}
                                                        className="text-white bg-slate-500 hover:bg-slate-600 px-3 py-1 rounded-md text-sm transition-colors"
                                                        title="Delete Recruiter"
                                                    >
                                                        Delete
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

            {/* User Details Modal */}
            <UserDetailsModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                userId={selectedRecId}
                role="recruiter"
            />
        </div>
    );
}
