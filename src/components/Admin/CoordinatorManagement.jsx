import React, { useState, useEffect } from 'react';
import { getUsersByRole, updateUserStatus, addUserDoc, deleteUserDoc } from '../../services/adminService';
import UserDetailsModal from './UserDetailsModal';

export default function CoordinatorManagement() {
    const [coordinators, setCoordinators] = useState([]);
    const [loading, setLoading] = useState(true);

    const [showAddForm, setShowAddForm] = useState(false);
    const [newCoordinator, setNewCoordinator] = useState({ name: '', email: '', department: '', passoutYear: '' });

    // Modal state
    const [selectedCoordId, setSelectedCoordId] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        fetchCoordinators();
    }, []);

    const openDetails = (id) => {
        setSelectedCoordId(id);
        setIsModalOpen(true);
    };

    const fetchCoordinators = async () => {
        setLoading(true);
        const result = await getUsersByRole('coordinator');
        if (result.success) {
            setCoordinators(result.data);
        } else {
            console.error('Failed to fetch coordinators:', result.error);
        }
        setLoading(false);
    };

    const handleAddSubmit = async (e) => {
        e.preventDefault();
        if (!newCoordinator.name || !newCoordinator.email) return;

        setLoading(true);
        // Derive class from Department + Passout Year
        const derivedClass = `${newCoordinator.department}-${newCoordinator.passoutYear}`;

        const result = await addUserDoc({
            name: newCoordinator.name,
            email: newCoordinator.email,
            department: newCoordinator.department,
            class: derivedClass,
            passoutYear: newCoordinator.passoutYear, // Save passout year explicitly too if needed, but class covers the requirement
            role: 'coordinator',
            createdAt: new Date()
        });

        if (result.success) {
            fetchCoordinators();
            setShowAddForm(false);
            setNewCoordinator({ name: '', email: '', department: '', passoutYear: '' });
        } else {
            alert('Error adding coordinator: ' + result.error);
        }
        setLoading(false);
    };

    const updateStatus = async (id, newStatus) => {
        const isApproved = newStatus === 'Approved';
        const result = await updateUserStatus(id, {
            status: newStatus,
            approved: isApproved
        });

        if (result.success) {
            setCoordinators((prev) =>
                prev.map((c) => (c.id === id ? { ...c, status: newStatus, approved: isApproved } : c))
            );
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this coordinator? This action cannot be undone.')) {
            const result = await deleteUserDoc(id);
            if (result.success) {
                setCoordinators((prev) => prev.filter((c) => c.id !== id));
            } else {
                alert('Error deleting coordinator: ' + result.error);
            }
        }
    };

    return (
        <div>
            <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-slate-800">Coordinator Management</h1>
                    <p className="text-slate-500">Approve or reject coordinator requests.</p>
                </div>
                <button
                    onClick={() => setShowAddForm(!showAddForm)}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg shadow-md transition-colors flex items-center gap-2"
                >
                    <span>{showAddForm ? 'Cancel' : '+ Add Coordinator'}</span>
                </button>
            </div>

            {/* Add Coordinator Form */}
            {showAddForm && (
                <div className="bg-white p-6 rounded-xl shadow-sm border border-indigo-100 mb-6 animate-fadeIn">
                    <h3 className="text-lg font-semibold text-slate-800 mb-4">Add New Coordinator</h3>
                    <form onSubmit={handleAddSubmit} className="flex flex-col md:flex-row gap-4 items-end">
                        <div className="w-full md:w-1/4">
                            <label className="block text-sm font-medium text-slate-700 mb-1">Full Name</label>
                            <input
                                type="text"
                                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                                placeholder="e.g. Jane Smith"
                                value={newCoordinator.name}
                                onChange={(e) => setNewCoordinator({ ...newCoordinator, name: e.target.value })}
                                required
                            />
                        </div>
                        <div className="w-full md:w-1/4">
                            <label className="block text-sm font-medium text-slate-700 mb-1">Email Address</label>
                            <input
                                type="email"
                                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                                placeholder="jane@example.com"
                                value={newCoordinator.email}
                                onChange={(e) => setNewCoordinator({ ...newCoordinator, email: e.target.value })}
                                required
                            />
                        </div>
                        <div className="w-full md:w-1/4">
                            <label className="block text-sm font-medium text-slate-700 mb-1">Department</label>
                            <select
                                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                                value={newCoordinator.department}
                                onChange={(e) => setNewCoordinator({ ...newCoordinator, department: e.target.value })}
                            >
                                <option value="">Select Dept</option>
                                <option value="CSE">CSE</option>
                                <option value="ECE">ECE</option>
                                <option value="MECH">MECH</option>
                                <option value="CIVIL">CIVIL</option>
                            </select>
                        </div>
                        <div className="w-full md:w-1/4">
                            <label className="block text-sm font-medium text-slate-700 mb-1">Passout Year</label>
                            <input
                                type="text"
                                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                                placeholder="e.g. 2024"
                                value={newCoordinator.passoutYear}
                                onChange={(e) => setNewCoordinator({ ...newCoordinator, passoutYear: e.target.value })}
                            />
                        </div>
                        <button
                            type="submit"
                            disabled={loading}
                            className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-lg font-medium transition-colors disabled:opacity-50"
                        >
                            {loading ? 'Adding...' : 'Add'}
                        </button>
                    </form>
                </div>
            )}

            <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                {loading && !showAddForm ? (
                    <div className="p-8 text-center text-slate-500">Loading coordinators...</div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-slate-50 border-b border-slate-200 text-xs uppercase text-slate-500 font-semibold">
                                    <th className="px-6 py-4">Name</th>
                                    <th className="px-6 py-4">Email</th>
                                    <th className="px-6 py-4">Department</th>
                                    <th className="px-6 py-4">Class</th>
                                    <th className="px-6 py-4">Status</th>
                                    <th className="px-6 py-4 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {coordinators.length === 0 ? (
                                    <tr>
                                        <td colSpan="6" className="px-6 py-8 text-center text-slate-500">
                                            No coordinators found.
                                        </td>
                                    </tr>
                                ) : (
                                    coordinators.map((coord) => (
                                        <tr key={coord.id} className="hover:bg-slate-50 transition-colors">
                                            <td className="px-6 py-4">
                                                <button
                                                    onClick={() => openDetails(coord.id)}
                                                    className="font-semibold text-indigo-600 hover:text-indigo-800 hover:underline transition-all text-left"
                                                >
                                                    {coord.name}
                                                </button>
                                            </td>
                                            <td className="px-6 py-4 text-slate-600">{coord.email}</td>
                                            <td className="px-6 py-4 text-slate-600">{coord.department || '-'}</td>
                                            <td className="px-6 py-4 text-slate-600">{coord.class || '-'}</td>
                                            <td className="px-6 py-4">
                                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${coord.status === 'Approved' ? 'bg-green-100 text-green-800' :
                                                    coord.status === 'Rejected' ? 'bg-red-100 text-red-800' :
                                                        'bg-yellow-100 text-yellow-800'
                                                    }`}>
                                                    {coord.status || 'Pending'}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <div className="flex justify-end gap-2">
                                                    {(coord.status || 'Pending') === 'Pending' && (
                                                        <>
                                                            <button
                                                                onClick={() => updateStatus(coord.id, 'Approved')}
                                                                className="text-white bg-green-500 hover:bg-green-600 px-3 py-1 rounded-md text-sm transition-colors"
                                                            >
                                                                Approve
                                                            </button>
                                                            <button
                                                                onClick={() => updateStatus(coord.id, 'Rejected')}
                                                                className="text-white bg-red-500 hover:bg-red-600 px-3 py-1 rounded-md text-sm transition-colors"
                                                            >
                                                                Reject
                                                            </button>
                                                        </>
                                                    )}
                                                    <button
                                                        onClick={() => handleDelete(coord.id)}
                                                        className="text-white bg-slate-500 hover:bg-slate-600 px-3 py-1 rounded-md text-sm transition-colors"
                                                        title="Delete Coordinator"
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
                userId={selectedCoordId}
                role="coordinator"
            />
        </div>
    );
}
