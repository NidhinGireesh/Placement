import React, { useState } from 'react';

export default function CoordinatorManagement() {
    const [coordinators, setCoordinators] = useState([
        { id: 1, name: 'Michael Scott', email: 'michael@dunder.com', department: 'Sales', status: 'Pending' },
        { id: 2, name: 'Dwight Schrute', email: 'dwight@dunder.com', department: 'Sales', status: 'Pending' },
        { id: 3, name: 'Jim Halpert', email: 'jim@dunder.com', department: 'Sales', status: 'Approved' },
    ]);

    const updateStatus = (id, newStatus) => {
        setCoordinators((prev) =>
            prev.map((c) => (c.id === id ? { ...c, status: newStatus } : c))
        );
    };

    return (
        <div>
            <h1 style={{ fontSize: '1.8rem', marginBottom: '1.5rem' }}>Coordinator Management</h1>

            <div style={cardStyle}>
                <h3>Pending Approvals</h3>
                <table style={tableStyle}>
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
                        {coordinators.map((coord) => (
                            <tr key={coord.id}>
                                <td>{coord.name}</td>
                                <td>{coord.email}</td>
                                <td>{coord.department}</td>
                                <td>
                                    <span style={getStatusBadge(coord.status)}>{coord.status}</span>
                                </td>
                                <td>
                                    {coord.status === 'Pending' && (
                                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                                            <button style={approveBtn} onClick={() => updateStatus(coord.id, 'Approved')}>Accept</button>
                                            <button style={rejectBtn} onClick={() => updateStatus(coord.id, 'Rejected')}>Reject</button>
                                        </div>
                                    )}
                                    {coord.status !== 'Pending' && <span style={{ fontSize: '0.9rem', color: '#6b7280' }}>No actions</span>}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

// Styles
const cardStyle = {
    background: 'white',
    padding: '1.5rem',
    borderRadius: '8px',
    border: '1px solid #e5e7eb',
};

const tableStyle = {
    width: '100%',
    marginTop: '1rem',
    borderCollapse: 'collapse',
    textAlign: 'left',
};

const approveBtn = {
    padding: '0.3rem 0.6rem',
    backgroundColor: '#22c55e',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
};

const rejectBtn = {
    padding: '0.3rem 0.6rem',
    backgroundColor: '#ef4444',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
};

function getStatusBadge(status) {
    const base = { padding: '0.25rem 0.5rem', borderRadius: '4px', fontSize: '0.85rem' };
    if (status === 'Approved') return { ...base, backgroundColor: '#dcfce7', color: '#166534' };
    if (status === 'Rejected') return { ...base, backgroundColor: '#fee2e2', color: '#991b1b' };
    return { ...base, backgroundColor: '#f3f4f6', color: '#374151' };
}
