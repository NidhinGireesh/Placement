import { useState, useEffect } from 'react';
import { collection, query, where, getDocs, doc, updateDoc, deleteDoc } from 'firebase/firestore';
import { db, auth } from '../../config/firebaseConfig';
import { formatDate } from '../../utils/dateUtils';

export default function AdminManagement() {
    const [admins, setAdmins] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchAdmins();
    }, []);

    const fetchAdmins = async () => {
        try {
            const q = query(collection(db, 'users'), where('role', '==', 'admin'));
            const querySnapshot = await getDocs(q);
            const adminList = querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            setAdmins(adminList);
        } catch (error) {
            console.error("Error fetching admins:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleApprove = async (adminId) => {
        try {
            const adminRef = doc(db, 'users', adminId);
            await updateDoc(adminRef, {
                approved: true
            });
            // Refresh list
            setAdmins(prev => prev.map(admin =>
                admin.id === adminId ? { ...admin, approved: true } : admin
            ));
        } catch (error) {
            console.error("Error approving admin:", error);
            alert("Failed to approve admin");
        }
    };

    const handleToggleBlock = async (adminId, currentBlockedStatus) => {
        try {
            const adminRef = doc(db, 'users', adminId);
            await updateDoc(adminRef, {
                blocked: !currentBlockedStatus
            });
            // Refresh list
            setAdmins(prev => prev.map(admin =>
                admin.id === adminId ? { ...admin, blocked: !currentBlockedStatus } : admin
            ));
        } catch (error) {
            console.error("Error toggling block status for admin:", error);
            alert("Failed to update admin status");
        }
    };

    const handleDeleteAdmin = async (adminId, adminName) => {
        if (window.confirm(`Are you sure you want to delete admin ${adminName}? This action cannot be undone.`)) {
            try {
                const adminRef = doc(db, 'users', adminId);
                await deleteDoc(adminRef);
                // Refresh list
                setAdmins(prev => prev.filter(admin => admin.id !== adminId));
            } catch (error) {
                console.error("Error deleting admin:", error);
                alert("Failed to delete admin");
            }
        }
    };

    if (loading) return <div className="p-4">Loading admins...</div>;

    const pendingAdmins = admins.filter(a => !a.approved);
    const approvedAdmins = admins.filter(a => a.approved);

    return (
        <div className="space-y-8">

            {/* Pending Approvals */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-orange-500"></span>
                    Pending Approvals
                    <span className="ml-2 px-2 py-0.5 bg-orange-100 text-orange-600 text-xs rounded-full">{pendingAdmins.length}</span>
                </h3>

                {pendingAdmins.length === 0 ? (
                    <p className="text-slate-500 italic">No pending faculty admin requests.</p>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="border-b border-slate-100 text-slate-500 text-sm">
                                    <th className="pb-3 font-medium">Name</th>
                                    <th className="pb-3 font-medium">Email</th>
                                    <th className="pb-3 font-medium">Date</th>
                                    <th className="pb-3 font-medium text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50">
                                {pendingAdmins.map(admin => (
                                    <tr key={admin.id} className="group hover:bg-slate-50 transition-colors">
                                        <td className="py-3 font-medium text-slate-800">
                                            <div className="flex items-center gap-2">
                                                {admin.name}
                                                {admin.blocked && (
                                                    <span className="px-1.5 py-0.5 bg-red-100 text-red-700 text-[10px] font-semibold rounded-full">Blocked</span>
                                                )}
                                            </div>
                                        </td>
                                        <td className="py-3 text-slate-600">{admin.email}</td>
                                        <td className="py-3 text-slate-500 text-sm">
                                            {formatDate(admin.createdAt)}
                                        </td>
                                        <td className="py-3 text-right">
                                            <div className="flex justify-end gap-2">
                                                <button
                                                    onClick={() => handleApprove(admin.id)}
                                                    className="px-3 py-1.5 bg-green-50 text-green-600 border border-green-200 rounded-lg text-xs font-semibold hover:bg-green-100 transition-colors shadow-sm"
                                                >
                                                    Approve
                                                </button>
                                                <button
                                                    onClick={() => handleToggleBlock(admin.id, admin.blocked)}
                                                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors border shadow-sm ${
                                                        admin.blocked
                                                            ? 'bg-amber-50 text-amber-600 border-amber-200 hover:bg-amber-100'
                                                            : 'bg-red-50 text-red-600 border-red-200 hover:bg-red-100'
                                                    }`}
                                                >
                                                    {admin.blocked ? 'Unblock' : 'Block'}
                                                </button>
                                                <button
                                                    onClick={() => handleDeleteAdmin(admin.id, admin.name)}
                                                    className="px-3 py-1.5 bg-slate-50 hover:bg-slate-100 text-slate-600 border border-slate-200 rounded-lg text-xs font-semibold transition-colors shadow-sm"
                                                >
                                                    Delete
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* Approved Admins List */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-green-500"></span>
                    Active Faculty Admins
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {approvedAdmins.map(admin => {
                        const isSelf = admin.id === auth.currentUser?.uid;
                        return (
                            <div key={admin.id} className="p-4 border border-slate-100 rounded-lg flex flex-col justify-between gap-3 bg-white hover:shadow-sm transition-all">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold shrink-0">
                                        {admin.name ? admin.name.charAt(0).toUpperCase() : 'A'}
                                    </div>
                                    <div className="min-w-0 flex-1">
                                        <div className="flex items-center gap-2">
                                            <p className="font-medium text-slate-800 truncate">{admin.name}</p>
                                            {isSelf && (
                                                <span className="px-1.5 py-0.5 bg-slate-100 text-slate-600 text-[10px] font-medium rounded">You</span>
                                            )}
                                        </div>
                                        <p className="text-xs text-slate-500 truncate">{admin.email}</p>
                                    </div>
                                    <div className="shrink-0">
                                        {admin.blocked ? (
                                            <span className="px-2 py-0.5 bg-red-100 text-red-700 text-xs rounded-full font-medium">Blocked</span>
                                        ) : (
                                            <span className="px-2 py-0.5 bg-green-100 text-green-700 text-xs rounded-full font-medium">Active</span>
                                        )}
                                    </div>
                                </div>
                                {!isSelf && (
                                    <div className="flex justify-end gap-2 border-t border-slate-100 pt-3">
                                        <button
                                            onClick={() => handleToggleBlock(admin.id, admin.blocked)}
                                            className={`px-3 py-1 rounded-md text-xs font-medium transition-colors border ${
                                                admin.blocked
                                                    ? 'bg-amber-50 text-amber-600 border-amber-200 hover:bg-amber-100'
                                                    : 'bg-red-50 text-red-600 border-red-200 hover:bg-red-100'
                                            }`}
                                        >
                                            {admin.blocked ? 'Unblock' : 'Block'}
                                        </button>
                                        <button
                                            onClick={() => handleDeleteAdmin(admin.id, admin.name)}
                                            className="px-3 py-1 bg-slate-100 hover:bg-slate-200 text-slate-600 border border-slate-200 rounded-md text-xs font-medium transition-colors"
                                        >
                                            Delete
                                        </button>
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>

        </div>
    );
}
