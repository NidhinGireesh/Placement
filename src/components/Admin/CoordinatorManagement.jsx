import React, { useState, useEffect } from 'react';
import { getUsersByRole, updateUserStatus } from '../../services/adminService';

export default function CoordinatorManagement() {
    const [coordinators, setCoordinators] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchCoordinators();
    }, []);

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

    const updateStatus = async (id, newStatus) => {
        const result = await updateUserStatus(id, { status: newStatus });
        if (result.success) {
            setCoordinators((prev) =>
                prev.map((c) => (c.id === id ? { ...c, status: newStatus } : c))
            );
        }
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-3xl font-bold text-slate-800">Coordinator Management</h1>
                    <p className="text-slate-500">Approve or reject coordinator requests.</p>
                </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                {loading ? (
                    <div className="p-8 text-center text-slate-500">Loading coordinators...</div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-slate-50 border-b border-slate-200 text-xs uppercase text-slate-500 font-semibold">
                                    <th className="px-6 py-4">Name</th>
                                    <th className="px-6 py-4">Email</th>
                                    <th className="px-6 py-4">Department</th>
                                    <th className="px-6 py-4">Status</th>
                                    <th className="px-6 py-4 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {coordinators.length === 0 ? (
                                    <tr>
                                        <td colSpan="5" className="px-6 py-8 text-center text-slate-500">
                                            No coordinators found.
                                        </td>
                                    </tr>
                                ) : (
                                    coordinators.map((coord) => (
                                        <tr key={coord.id} className="hover:bg-slate-50 transition-colors">
                                            <td className="px-6 py-4 font-medium text-slate-800">{coord.name}</td>
                                            <td className="px-6 py-4 text-slate-600">{coord.email}</td>
                                            <td className="px-6 py-4 text-slate-600">{coord.department}</td>
                                            <td className="px-6 py-4">
                                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${coord.status === 'Approved' ? 'bg-green-100 text-green-800' :
                                                        coord.status === 'Rejected' ? 'bg-red-100 text-red-800' :
                                                            'bg-yellow-100 text-yellow-800'
                                                    }`}>
                                                    {coord.status || 'Pending'}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                {(coord.status || 'Pending') === 'Pending' ? (
                                                    <div className="flex justify-end gap-2">
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
                                                    </div>
                                                ) : (
                                                    <span className="text-slate-400 text-sm">No actions</span>
                                                )}
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
