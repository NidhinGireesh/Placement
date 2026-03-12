import { useState, useEffect } from 'react';
import { collection, query, where, getDocs, doc, updateDoc } from 'firebase/firestore';
import { db } from '../../config/firebaseConfig';

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
                                    <th className="pb-3 font-medium text-right">Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50">
                                {pendingAdmins.map(admin => (
                                    <tr key={admin.id} className="group hover:bg-slate-50 transition-colors">
                                        <td className="py-3 font-medium text-slate-800">{admin.name}</td>
                                        <td className="py-3 text-slate-600">{admin.email}</td>
                                        <td className="py-3 text-slate-500 text-sm">
                                            {admin.createdAt?.seconds ? new Date(admin.createdAt.seconds * 1000).toLocaleDateString() : 'N/A'}
                                        </td>
                                        <td className="py-3 text-right">
                                            <button
                                                onClick={() => handleApprove(admin.id)}
                                                className="px-4 py-1.5 bg-green-50 text-green-600 border border-green-200 rounded-lg text-sm font-medium hover:bg-green-100 transition-colors shadow-sm"
                                            >
                                                Approve
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* Approved Admins List */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 opacity-80">
                <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-green-500"></span>
                    Active Faculty Admins
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {approvedAdmins.map(admin => (
                        <div key={admin.id} className="p-4 border border-slate-100 rounded-lg flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold">
                                {admin.name.charAt(0)}
                            </div>
                            <div>
                                <p className="font-medium text-slate-800">{admin.name}</p>
                                <p className="text-xs text-slate-500">{admin.email}</p>
                            </div>
                            <div className="ml-auto">
                                <span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full">Active</span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

        </div>
    );
}
