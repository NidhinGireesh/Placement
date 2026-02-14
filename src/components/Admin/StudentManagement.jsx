import React, { useState, useEffect } from 'react';
import { getUsersByRole, updateUserStatus, deleteUserDoc, addUserDoc } from '../../services/adminService';

export default function StudentManagement() {
    const [students, setStudents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [showAddForm, setShowAddForm] = useState(false);
    const [newStudent, setNewStudent] = useState({ name: '', email: '', department: '' });

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

    const handleAddSubmit = async (e) => {
        e.preventDefault();
        if (!newStudent.name || !newStudent.email) return;

        setLoading(true);
        const result = await addUserDoc({
            name: newStudent.name,
            email: newStudent.email,
            department: newStudent.department,
            role: 'student',
            createdAt: new Date()
        });

        if (result.success) {
            fetchStudents();
            setShowAddForm(false);
            setNewStudent({ name: '', email: '', department: '' });
        } else {
            alert('Error adding student: ' + result.error);
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

    const filteredStudents = students.filter(student =>
        student.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.email?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div>
            <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-slate-800">Student Management</h1>
                    <p className="text-slate-500">Manage student accounts and approvals.</p>
                </div>
                <div className="flex gap-4 w-full md:w-auto">
                    <input
                        type="text"
                        placeholder="Search students..."
                        className="w-full md:w-64 px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <button
                        onClick={() => setShowAddForm(!showAddForm)}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg shadow-md transition-colors whitespace-nowrap"
                    >
                        {showAddForm ? 'Cancel' : '+ Add Student'}
                    </button>
                </div>
            </div>

            {/* Add Student Form */}
            {showAddForm && (
                <div className="bg-white p-6 rounded-xl shadow-sm border border-blue-100 mb-6 animate-fadeIn">
                    <h3 className="text-lg font-semibold text-slate-800 mb-4">Add New Student</h3>
                    <form onSubmit={handleAddSubmit} className="flex flex-col md:flex-row gap-4 items-end">
                        <div className="w-full md:w-1/3">
                            <label className="block text-sm font-medium text-slate-700 mb-1">Full Name</label>
                            <input
                                type="text"
                                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                                placeholder="e.g. John Doe"
                                value={newStudent.name}
                                onChange={(e) => setNewStudent({ ...newStudent, name: e.target.value })}
                                required
                            />
                        </div>
                        <div className="w-full md:w-1/3">
                            <label className="block text-sm font-medium text-slate-700 mb-1">Email Address</label>
                            <input
                                type="email"
                                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                                placeholder="john@example.com"
                                value={newStudent.email}
                                onChange={(e) => setNewStudent({ ...newStudent, email: e.target.value })}
                                required
                            />
                        </div>
                        <div className="w-full md:w-1/3">
                            <label className="block text-sm font-medium text-slate-700 mb-1">Department</label>
                            <select
                                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                                value={newStudent.department}
                                onChange={(e) => setNewStudent({ ...newStudent, department: e.target.value })}
                            >
                                <option value="">Select Dept</option>
                                <option value="CSE">CSE</option>
                                <option value="ECE">ECE</option>
                                <option value="MECH">MECH</option>
                                <option value="CIVIL">CIVIL</option>
                            </select>
                        </div>
                        <button
                            type="submit"
                            disabled={loading}
                            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition-colors disabled:opacity-50"
                        >
                            {loading ? 'Adding...' : 'Add Student'}
                        </button>
                    </form>
                </div>
            )}

            <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                {loading && !showAddForm ? (
                    <div className="p-8 text-center text-slate-500">Loading students...</div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-slate-50 border-b border-slate-200 text-xs uppercase text-slate-500 font-semibold">
                                    <th className="px-6 py-4">Name</th>
                                    <th className="px-6 py-4">Email</th>
                                    <th className="px-6 py-4">Department</th>
                                    <th className="px-6 py-4">Status</th>
                                    <th className="px-6 py-4">Blocked</th>
                                    <th className="px-6 py-4 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {filteredStudents.length === 0 ? (
                                    <tr>
                                        <td colSpan="6" className="px-6 py-8 text-center text-slate-500">
                                            No students found matching your search.
                                        </td>
                                    </tr>
                                ) : (
                                    filteredStudents.map((student) => (
                                        <tr key={student.id} className="hover:bg-slate-50 transition-colors">
                                            <td className="px-6 py-4 font-medium text-slate-800">{student.name}</td>
                                            <td className="px-6 py-4 text-slate-600">{student.email}</td>
                                            <td className="px-6 py-4 text-slate-600">{student.department || '-'}</td>
                                            <td className="px-6 py-4">
                                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${student.status === 'approved' ? 'bg-green-100 text-green-800' :
                                                        student.status === 'rejected' ? 'bg-red-100 text-red-800' :
                                                            'bg-yellow-100 text-yellow-800'
                                                    }`}>
                                                    {student.status || 'pending'}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${student.blocked ? 'bg-red-100 text-red-800' : 'bg-gray-100 text-gray-800'
                                                    }`}>
                                                    {student.blocked ? 'Yes' : 'No'}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <div className="flex justify-end gap-2">
                                                    {student.status !== 'approved' && (
                                                        <button
                                                            onClick={() => approveStudent(student.id)}
                                                            className="text-white bg-green-500 hover:bg-green-600 px-3 py-1 rounded-md text-sm transition-colors"
                                                        >
                                                            Approve
                                                        </button>
                                                    )}
                                                    <button
                                                        onClick={() => toggleBlockStudent(student.id, student.blocked)}
                                                        className={`px-3 py-1 rounded-md text-sm transition-colors border ${student.blocked
                                                                ? 'border-gray-300 text-gray-700 hover:bg-gray-50'
                                                                : 'border-orange-200 text-orange-600 hover:bg-orange-50'
                                                            }`}
                                                    >
                                                        {student.blocked ? 'Unblock' : 'Block'}
                                                    </button>
                                                    <button
                                                        onClick={() => deleteStudent(student.id, student.name)}
                                                        className="text-red-600 hover:bg-red-50 px-3 py-1 rounded-md text-sm transition-colors"
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
        </div>
    );
}