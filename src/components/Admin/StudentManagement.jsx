import React, { useState, useEffect } from 'react';
import { getUsersByRole, updateUserStatus, deleteUserDoc } from '../../services/adminService';

export default function StudentManagement() {
    const [students, setStudents] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchStudents();
    }, []);

    const fetchStudents = async () => {
        setLoading(true);
        const result = await getUsersByRole('student');
        if (result.success) {
            setStudents(result.data);
        } else {
            console.error('Failed to fetch students:', result.error);
        }
        setLoading(false);
    };

    const approveStudent = async (id) => {
        const result = await updateUserStatus(id, { status: 'approved' });
        if (result.success) {
            setStudents((prev) =>
                prev.map((student) =>
                    student.id === id ? { ...student, status: 'approved' } : student
                )
            );
        }
    };

    const toggleBlockStudent = async (id, currentBlockedStatus) => {
        const result = await updateUserStatus(id, { blocked: !currentBlockedStatus });
        if (result.success) {
            setStudents((prev) =>
                prev.map((student) =>
                    student.id === id ? { ...student, blocked: !student.blocked } : student
                )
            );
        }
    };

    const deleteStudent = async (id, studentName) => {
        if (window.confirm(`Are you sure you want to delete ${studentName}? This action cannot be undone.`)) {
            const result = await deleteUserDoc(id);
            if (result.success) {
                setStudents((prev) => prev.filter((student) => student.id !== id));
            } else {
                alert('Failed to delete student: ' + result.error);
            }
        }
    };

    return (
        <div>
            <h1 className="page-title">
                Student Management
            </h1>

            <div className="card-container">
                <h3>Student Accounts</h3>
                {loading ? (
                    <p>Loading students...</p>
                ) : (
                    <table className="data-table">
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
                            {students.length === 0 ? (
                                <tr>
                                    <td colSpan="5" style={{ textAlign: 'center' }}>No students found</td>
                                </tr>
                            ) : (
                                students.map((student) => (
                                    <tr key={student.id}>
                                        <td>{student.name}</td>
                                        <td>{student.email}</td>
                                        <td>
                                            <span className={getStatusBadgeClass(student.status || 'pending')}>{student.status || 'pending'}</span>
                                        </td>
                                        <td>
                                            <span className={`status-badge ${student.blocked ? 'rejected' : 'approved'}`}>
                                                {student.blocked ? 'Yes' : 'No'}
                                            </span>
                                        </td>
                                        <td>
                                            <div className="action-row">
                                                {student.status !== 'approved' && (
                                                    <button
                                                        className="btn-approve"
                                                        onClick={() => approveStudent(student.id)}
                                                    >
                                                        Approve
                                                    </button>
                                                )}
                                                <button
                                                    className={student.blocked ? 'btn-approve' : 'btn-reject'}
                                                    onClick={() => toggleBlockStudent(student.id, student.blocked)}
                                                >
                                                    {student.blocked ? 'Unblock' : 'Block'}
                                                </button>
                                                <button
                                                    className="btn-reject"
                                                    onClick={() => deleteStudent(student.id, student.name)}
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
                )}
            </div>
        </div>
    );
}

function getStatusBadgeClass(status) {
    if (status === 'approved') return 'status-badge approved';
    if (status === 'rejected') return 'status-badge rejected';
    if (status === 'pending') return 'status-badge pending';
    return 'status-badge';
}
