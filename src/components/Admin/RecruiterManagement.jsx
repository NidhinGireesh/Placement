import React, { useState, useEffect } from 'react';
import { getUsersByRole, addUserDoc, deleteUserDoc, updateUserStatus } from '../../services/adminService';

export default function RecruiterManagement() {
    const [recruiters, setRecruiters] = useState([]);
    const [loading, setLoading] = useState(true);

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

    const addRecruiter = async () => {
        const company = prompt('Enter Company Name');
        const email = prompt('Enter Company Email');

        if (company && email) {
            setLoading(true);
            // Ideally we should create a user in Auth too, but for this task we add to Firestore.
            const result = await addUserDoc({
                company,
                email,
                role: 'recruiter',
                createdAt: new Date()
            });

            if (result.success) {
                fetchRecruiters(); // Refresh list
            }
            setLoading(false);
        }
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
            <h1 className="page-title">
                Recruiter Management
            </h1>

            <div className="card-container">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                    <h3>Recruiter Accounts</h3>
                    <button className="btn-approve" onClick={addRecruiter} disabled={loading}>
                        {loading ? 'Processing...' : '+ Add Recruiter'}
                    </button>
                </div>

                {loading ? (
                    <p>Loading recruiters...</p>
                ) : (
                    <table className="data-table">
                        <thead>
                            <tr>
                                <th>Company</th>
                                <th>Email</th>
                                <th>Blocked</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {recruiters.length === 0 ? (
                                <tr>
                                    <td colSpan="4" style={{ textAlign: 'center' }}>No recruiters found</td>
                                </tr>
                            ) : (
                                recruiters.map((rec) => (
                                    <tr key={rec.id}>
                                        <td>{rec.company}</td>
                                        <td>{rec.email}</td>
                                        <td>
                                            <span className={`status-badge ${rec.blocked ? 'rejected' : 'approved'}`}>
                                                {rec.blocked ? 'Yes' : 'No'}
                                            </span>
                                        </td>
                                        <td>
                                            <div className="action-row">
                                                <button
                                                    className={rec.blocked ? 'btn-approve' : 'btn-reject'}
                                                    onClick={() => toggleBlockRecruiter(rec.id, rec.blocked)}
                                                >
                                                    {rec.blocked ? 'Unblock' : 'Block'}
                                                </button>
                                                <button className="btn-reject" onClick={() => removeRecruiter(rec.id)}>
                                                    Remove
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
}
