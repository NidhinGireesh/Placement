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
            <h1 className="page-title">Coordinator Management</h1>

            <div className="card-container">
                <h3>Pending Approvals</h3>
                {loading ? (
                    <p>Loading coordinators...</p>
                ) : (
                    <table className="data-table">
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Email</th>
                                <th>Department</th>
                                <th>Status</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {coordinators.length === 0 ? (
                                <tr>
                                    <td colSpan="5" style={{ textAlign: 'center' }}>No coordinators found</td>
                                </tr>
                            ) : (
                                coordinators.map((coord) => (
                                    <tr key={coord.id}>
                                        <td>{coord.name}</td>
                                        <td>{coord.email}</td>
                                        <td>{coord.department}</td>
                                        <td>
                                            <span className={getStatusBadgeClass(coord.status || 'Pending')}>{coord.status || 'Pending'}</span>
                                        </td>
                                        <td>
                                            {(coord.status || 'Pending') === 'Pending' && (
                                                <div className="action-row">
                                                    <button className="btn-approve" onClick={() => updateStatus(coord.id, 'Approved')}>Accept</button>
                                                    <button className="btn-reject" onClick={() => updateStatus(coord.id, 'Rejected')}>Reject</button>
                                                </div>
                                            )}
                                            {(coord.status || 'Pending') !== 'Pending' && <span className="no-actions">No actions</span>}
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

function getStatusBadgeClass(status) {
    if (status === 'Approved') return 'status-badge approved';
    if (status === 'Rejected') return 'status-badge rejected';
    return 'status-badge';
}
