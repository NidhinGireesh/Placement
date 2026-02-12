import React from 'react';

export default function UserManagement({
    students,
    recruiters,
    approveStudent,
    toggleBlockStudent,
    addRecruiter,
    removeRecruiter,
}) {
    const cardStyle = {
        background: 'white',
        padding: '1.5rem',
        borderRadius: '8px',
        marginBottom: '2rem',
        border: '1px solid #e5e7eb',
    };

    const tableStyle = {
        width: '100%',
        marginTop: '1rem',
        borderCollapse: 'collapse',
        textAlign: 'left',
    };

    const approveBtn = {
        marginRight: '0.5rem',
        padding: '0.3rem 0.6rem',
        backgroundColor: '#22c55e',
        color: 'white',
        border: 'none',
        borderRadius: '4px',
        cursor: 'pointer',
    };

    const blockBtn = {
        padding: '0.3rem 0.6rem',
        backgroundColor: '#ef4444',
        color: 'white',
        border: 'none',
        borderRadius: '4px',
        cursor: 'pointer',
    };

    const addBtn = {
        padding: '0.5rem 1rem',
        backgroundColor: '#2563eb',
        color: 'white',
        border: 'none',
        borderRadius: '4px',
        cursor: 'pointer',
        marginBottom: '1rem',
    };

    return (
        <>
            <h1 style={{ fontSize: '1.8rem', marginBottom: '1.5rem' }}>
                User Management
            </h1>

            {/* Students */}
            <div style={cardStyle}>
                <h3>Student Accounts</h3>
                <table style={tableStyle}>
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Email</th>
                            <th>Status</th>
                            <th>Blocked</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {students.map((student) => (
                            <tr key={student.id}>
                                <td>{student.name}</td>
                                <td>{student.email}</td>
                                <td>{student.status}</td>
                                <td>{student.blocked ? 'Yes' : 'No'}</td>
                                <td>
                                    {student.status !== 'approved' && (
                                        <button
                                            style={approveBtn}
                                            onClick={() => approveStudent(student.id)}
                                        >
                                            Approve
                                        </button>
                                    )}
                                    <button
                                        style={blockBtn}
                                        onClick={() => toggleBlockStudent(student.id)}
                                    >
                                        {student.blocked ? 'Unblock' : 'Block'}
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Recruiters */}
            <div style={cardStyle}>
                <h3>Recruiter Accounts</h3>
                <button style={addBtn} onClick={addRecruiter}>
                    + Add Recruiter
                </button>

                <table style={tableStyle}>
                    <thead>
                        <tr>
                            <th>Company</th>
                            <th>Email</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {recruiters.map((rec) => (
                            <tr key={rec.id}>
                                <td>{rec.company}</td>
                                <td>{rec.email}</td>
                                <td>
                                    <button style={blockBtn} onClick={() => removeRecruiter(rec.id)}>
                                        Remove
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </>
    );
}
