import React, { useState, useEffect } from 'react';
import { getUsersByRoles, updateUserStatus, deleteUserDoc, addUserDoc } from '../../services/adminService';
import UserDetailsModal from './UserDetailsModal';

export default function StudentManagement({ initialFilter = 'all', setInitialFilter }) {
    const [students, setStudents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState(initialFilter);
    const [classFilter, setClassFilter] = useState('All');
    const [showAddForm, setShowAddForm] = useState(false);
    const [newStudent, setNewStudent] = useState({ name: '', email: '', department: '', gender: '' });

    // Ensure statusFilter stays in sync if dashboard triggers a change
    useEffect(() => {
        if (initialFilter) {
            setStatusFilter(initialFilter);
        }
    }, [initialFilter]);

    // Sorting state
    const [sortBy, setSortBy] = useState('name'); // 'name', 'department', 'passoutYear'
    const [sortOrder, setSortOrder] = useState('asc'); // 'asc', 'desc'

    // Modal state
    const [selectedStudent, setSelectedStudent] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        fetchStudents();
    }, []);

    const openDetails = (id, role) => {
        setSelectedStudent({ id, role });
        setIsModalOpen(true);
    };

    const fetchStudents = async () => {
        setLoading(true);
        // Fetch both primary students and coordinators (who are also students)
        const result = await getUsersByRoles(['student', 'coordinator']);
        if (result.success) {
            setStudents(result.data);
        } else {
            console.error('Failed to fetch students:', result.error);
        }
        setLoading(false);
    };

    const toggleSort = (field) => {
        if (sortBy === field) {
            setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
        } else {
            setSortBy(field);
            setSortOrder('asc');
        }
    };

    const handleAddSubmit = async (e) => {
        e.preventDefault();
        if (!newStudent.name || !newStudent.email) return;

        setLoading(true);
        const result = await addUserDoc({
            name: newStudent.name,
            email: newStudent.email,
            department: newStudent.department,
            gender: newStudent.gender,
            role: 'student',
            createdAt: new Date()
        });

        if (result.success) {
            fetchStudents();
            setShowAddForm(false);
            setNewStudent({ name: '', email: '', department: '', gender: '' });
        } else {
            alert('Error adding student: ' + result.error);
        }
        setLoading(false);
    };

    const approveStudent = async (id) => {
        const result = await updateUserStatus(id, { status: 'approved', approved: true });
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

    // Extract unique classes for the filter
    const availableClasses = ['All', ...new Set(students
        .map(u => u.class)
        .filter(c => c && c.trim() !== '')
    )].sort();

    const sortedStudents = [...students].sort((a, b) => {
        let valA, valB;

        if (sortBy === 'name') {
            valA = a.name?.toLowerCase() || '';
            valB = b.name?.toLowerCase() || '';
        } else if (sortBy === 'department') {
            valA = a.department?.toLowerCase() || '';
            valB = b.department?.toLowerCase() || '';
        } else if (sortBy === 'passoutYear') {
            valA = a.passoutYear || '';
            valB = b.passoutYear || '';
        } else {
            valA = a.name?.toLowerCase() || '';
            valB = b.name?.toLowerCase() || '';
        }

        if (valA < valB) return sortOrder === 'asc' ? -1 : 1;
        if (valA > valB) return sortOrder === 'asc' ? 1 : -1;
        return 0;
    });

    const filteredStudents = sortedStudents.filter(student => {
        const matchesSearch =
            student.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            student.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            student.department?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            student.class?.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesClass = classFilter === 'All' || student.class === classFilter;
        
        // Handle Status / Approval filtering
        let matchesStatus = true;
        if (statusFilter === 'approved') matchesStatus = student.status?.toLowerCase() === 'approved';
        else if (statusFilter === 'pending') {
            const statusStr = student.status?.toLowerCase() || 'pending';
            matchesStatus = statusStr === 'pending';
        }
        else if (statusFilter === 'blocked') matchesStatus = student.blocked === true;

        return matchesSearch && matchesClass && matchesStatus;
    });

    const getSortIndicator = (field) => {
        if (sortBy === field) {
            return sortOrder === 'asc' ? ' ▲' : ' ▼';
        }
        return '';
    };

    return (
        <div>
            <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-slate-800">Student Management</h1>
                    <p className="text-slate-500">View and manage all students and coordinators.</p>
                </div>
                <div className="flex flex-wrap gap-4 w-full md:w-auto">
                    {/* Class Filter Dropdown */}
                    <div className="flex items-center gap-2">
                        <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Status:</label>
                        <select
                            className="px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm font-medium text-slate-700 bg-white"
                            value={statusFilter}
                            onChange={(e) => {
                                setStatusFilter(e.target.value);
                                if (setInitialFilter) setInitialFilter(e.target.value);
                            }}
                        >
                            <option value="all">All</option>
                            <option value="approved">Approved</option>
                            <option value="pending">Pending</option>
                            <option value="blocked">Blocked</option>
                        </select>
                    </div>

                    <div className="flex items-center gap-2">
                        <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Class:</label>
                        <select
                            className="px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm font-medium text-slate-700 bg-white"
                            value={classFilter}
                            onChange={(e) => setClassFilter(e.target.value)}
                        >
                            {availableClasses.map(cls => (
                                <option key={cls} value={cls}>{cls}</option>
                            ))}
                        </select>
                    </div>

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
                        <div className="w-full md:w-1/4">
                            <label className="block text-sm font-medium text-slate-700 mb-1">Gender</label>
                            <select
                                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                                value={newStudent.gender}
                                onChange={(e) => setNewStudent({ ...newStudent, gender: e.target.value })}
                                required
                            >
                                <option value="">Select Gender</option>
                                <option value="male">Male</option>
                                <option value="female">Female</option>
                                <option value="other">Other</option>
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
                    <div className="p-8 text-center text-slate-500">Loading data...</div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-slate-50 border-b border-slate-200 text-xs uppercase text-slate-500 font-semibold">
                                    <th
                                        className="px-6 py-4 cursor-pointer hover:bg-slate-100 transition-colors"
                                        onClick={() => toggleSort('name')}
                                    >
                                        Name{getSortIndicator('name')}
                                    </th>
                                    <th className="px-6 py-4">Email</th>
                                    <th
                                        className="px-6 py-4 cursor-pointer hover:bg-slate-100 transition-colors"
                                        onClick={() => toggleSort('department')}
                                    >
                                        Department{getSortIndicator('department')}
                                    </th>
                                    <th
                                        className="px-6 py-4 cursor-pointer hover:bg-slate-100 transition-colors"
                                        onClick={() => toggleSort('passoutYear')}
                                    >
                                        Batch{getSortIndicator('passoutYear')}
                                    </th>
                                    <th className="px-6 py-4">Class</th>
                                    <th className="px-6 py-4 text-center">Role</th>
                                    <th className="px-6 py-4">Status</th>
                                    <th className="px-6 py-4 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {filteredStudents.length === 0 ? (
                                    <tr>
                                        <td colSpan="8" className="px-6 py-8 text-center text-slate-500">
                                            No students found matching your filters.
                                        </td>
                                    </tr>
                                ) : (
                                    filteredStudents.map((student) => (
                                        <tr key={student.id} className="hover:bg-slate-50 transition-colors">
                                            <td className="px-6 py-4">
                                                <button
                                                    onClick={() => openDetails(student.id, student.role)}
                                                    className="font-semibold text-blue-600 hover:text-blue-800 hover:underline transition-all text-left"
                                                >
                                                    {student.name}
                                                </button>
                                            </td>
                                            <td className="px-6 py-4 text-slate-600">{student.email}</td>
                                            <td className="px-6 py-4 text-slate-600">{student.department || '-'}</td>
                                            <td className="px-6 py-4 text-slate-600">{student.passoutYear || '-'}</td>
                                            <td className="px-6 py-4 text-slate-600 font-medium">{student.class || '-'}</td>
                                            <td className="px-6 py-4 text-center">
                                                <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider ${student.role === 'coordinator'
                                                    ? 'bg-indigo-100 text-indigo-700 border border-indigo-200'
                                                    : 'bg-slate-100 text-slate-600'
                                                    }`}>
                                                    {student.role}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${student.status === 'approved' ? 'bg-green-100 text-green-800' :
                                                    student.status === 'rejected' ? 'bg-red-100 text-red-800' :
                                                        'bg-yellow-100 text-yellow-800'
                                                    }`}>
                                                    {student.status || 'pending'}
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

            {/* User Details Modal */}
            <UserDetailsModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                userId={selectedStudent?.id}
                role={selectedStudent?.role}
            />
        </div>
    );
}
