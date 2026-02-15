import { useState, useEffect } from 'react';
import { useAuthStore } from '../../store/authStore';
import { getCoordinatorDetails, getStudentsByClass, updateStudentStatus, deleteStudent } from '../../services/coordinatorService';

const StudentVerification = () => {
    const { user } = useAuthStore();
    const [students, setStudents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [coordinatorInfo, setCoordinatorInfo] = useState({ branch: '', year: '' });

    const [filterStatus, setFilterStatus] = useState("All");
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedStudent, setSelectedStudent] = useState(null); // For Modal

    useEffect(() => {
        if (user?.uid) {
            fetchData();
        }
    }, [user]);

    const fetchData = async () => {
        setLoading(true);
        // 1. Get Coordinator's Class Info
        const coordResult = await getCoordinatorDetails(user.uid);
        if (coordResult.success) {
            setCoordinatorInfo({ branch: coordResult.branch, year: coordResult.passoutYear });

            // 2. Get Students for that Class
            const studentsResult = await getStudentsByClass(coordResult.branch, coordResult.passoutYear);
            if (studentsResult.success) {
                setStudents(studentsResult.data);
            }
        }
        setLoading(false);
    };

    const handleApprove = async (id) => {
        if (window.confirm("Approve this student?")) {
            const result = await updateStudentStatus(id, "Verified"); // Status remains "Verified" in DB, but UI says "Approve"
            if (result.success) {
                setStudents(students.map(s => s.id === id ? { ...s, status: "Verified" } : s));
            } else {
                alert("Failed to approve student.");
            }
        }
    };

    const handleReject = async (id) => {
        if (window.confirm("Reject this student?")) {
            const result = await updateStudentStatus(id, "Rejected");
            if (result.success) {
                setStudents(students.map(s => s.id === id ? { ...s, status: "Rejected" } : s));
            } else {
                alert("Failed to reject student.");
            }
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm("Delete this student permanently? This cannot be undone.")) {
            const result = await deleteStudent(id);
            if (result.success) {
                setStudents(students.filter(s => s.id !== id));
            } else {
                alert("Failed to delete student.");
            }
        }
    };

    const filteredStudents = students.filter(student => {
        // Branch filter removed because we only fetch students of the same branch
        const matchesStatus = filterStatus === "All" || student.status === filterStatus;
        const matchesSearch = student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (student.regNo && student.regNo.toLowerCase().includes(searchTerm.toLowerCase()));
        return matchesStatus && matchesSearch;
    });

    const isEligible = (cgpa, backlogs) => cgpa >= 7.0 && backlogs === 0;

    if (loading) {
        return <div className="p-8 text-center text-gray-500">Loading students for {coordinatorInfo.branch} - {coordinatorInfo.year}...</div>;
    }

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-end">
                <div>
                    <h2 className="text-2xl font-bold text-gray-800">Student Verification</h2>
                    <p className="text-gray-500 text-sm">Class: {coordinatorInfo.branch} - {coordinatorInfo.year}</p>
                </div>
                <button onClick={fetchData} className="text-teal-600 hover:text-teal-800 text-sm font-medium">
                    Refresh Data
                </button>
            </div>

            {/* Analytics / Quick Stats for Verification */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="bg-white p-4 rounded-lg shadow-sm border-l-4 border-yellow-500">
                    <p className="text-sm text-gray-500">Pending</p>
                    <p className="text-2xl font-bold">{students.filter(s => s.status === 'Pending').length}</p>
                </div>
                <div className="bg-white p-4 rounded-lg shadow-sm border-l-4 border-green-500">
                    <p className="text-sm text-gray-500">Verified</p>
                    <p className="text-2xl font-bold">{students.filter(s => s.status === 'Verified').length}</p>
                </div>
                <div className="bg-white p-4 rounded-lg shadow-sm border-l-4 border-red-500">
                    <p className="text-sm text-gray-500">Rejected</p>
                    <p className="text-2xl font-bold">{students.filter(s => s.status === 'Rejected').length}</p>
                </div>
            </div>

            {/* Filters */}
            <div className="bg-white p-4 rounded-lg shadow-sm flex flex-col md:flex-row gap-4 items-center justify-between">
                <div className="flex gap-4 w-full md:w-auto">
                    <input
                        type="text"
                        placeholder="Search by Name or Reg No..."
                        className="border p-2 rounded-md w-full md:w-64 focus:outline-none focus:ring-2 focus:ring-teal-500"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />

                    <select
                        className="border p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                        value={filterStatus}
                        onChange={(e) => setFilterStatus(e.target.value)}
                    >
                        <option value="All">All Status</option>
                        <option value="Pending">Pending</option>
                        <option value="Verified">Verified</option>
                        <option value="Rejected">Rejected</option>
                    </select>
                </div>
            </div>

            {/* Table */}
            <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name / Reg No</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Academics</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Resume</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {filteredStudents.length === 0 ? (
                            <tr>
                                <td colSpan="5" className="px-6 py-8 text-center text-gray-500">
                                    No students found in {coordinatorInfo.branch} ({coordinatorInfo.year})
                                </td>
                            </tr>
                        ) : (
                            filteredStudents.map((student) => (
                                <tr key={student.id} className="hover:bg-gray-50 transition-colors">
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center">
                                            <div className="flex-shrink-0 h-10 w-10 bg-teal-100 text-teal-600 rounded-full flex items-center justify-center font-bold">
                                                {student.name ? student.name.charAt(0) : '?'}
                                            </div>
                                            <div className="ml-4">
                                                <div className="text-sm font-medium text-gray-900">{student.name || 'Unknown'}</div>
                                                <div className="text-sm text-gray-500">{student.regNo || 'No Reg No'}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm text-gray-900">CGPA: {student.cgpa}</div>
                                        <div className={`text-xs ${student.backlogs > 0 ? 'text-red-500' : 'text-green-500'}`}>
                                            Backlogs: {student.backlogs}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-blue-600 cursor-pointer hover:underline" onClick={() => setSelectedStudent(student)}>
                                        {student.resume ? 'View Resume' : 'No Resume'}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                    ${student.status.toLowerCase() === 'verified' ? 'bg-green-100 text-green-800' :
                                                student.status.toLowerCase() === 'rejected' ? 'bg-red-100 text-red-800' :
                                                    'bg-yellow-100 text-yellow-800'}`}>
                                            {student.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                                            {/* Show Approve/Reject for Pending (case-insensitive) OR allow changing status */}
                                            <button
                                                onClick={() => handleApprove(student.id)}
                                                className={`font-bold ${student.status.toLowerCase() === 'verified' ? 'text-gray-400 cursor-not-allowed' : 'text-green-600 hover:text-green-900'}`}
                                                disabled={student.status.toLowerCase() === 'verified'}
                                            >
                                                Approve
                                            </button>
                                            <button
                                                onClick={() => handleReject(student.id)}
                                                className={`font-bold ${student.status.toLowerCase() === 'rejected' ? 'text-gray-400 cursor-not-allowed' : 'text-red-600 hover:text-red-900'}`}
                                                disabled={student.status.toLowerCase() === 'rejected'}
                                            >
                                                Reject
                                            </button>
                                            <button
                                                onClick={() => handleDelete(student.id)}
                                                className="text-gray-500 hover:text-red-700 font-bold ml-2"
                                                title="Delete Permanent"
                                            >
                                                🗑️
                                            </button>
                                        </td>
                                    </td>
                                </tr>
                            )))}
                    </tbody>
                </table>
            </div>

            {/* Resume Modal */}
            {selectedStudent && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-lg shadow-lg w-full max-w-2xl h-3/4 flex flex-col">
                        <div className="flex justify-between items-center p-4 border-b">
                            <h3 className="text-xl font-bold">{selectedStudent.name}'s Resume</h3>
                            <button
                                onClick={() => setSelectedStudent(null)}
                                className="text-gray-500 hover:text-gray-700 text-2xl"
                                aria-label="Close"
                            >
                                ×
                            </button>
                        </div>
                        <div className="flex-1 p-4 bg-gray-100 flex items-center justify-center overflow-auto">
                            <div className="text-center">
                                {selectedStudent.resume ? (
                                    <>
                                        <p className="mb-4 text-gray-600">Resume Link Available</p>
                                        <a href={selectedStudent.resume} target="_blank" rel="noopener noreferrer" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
                                            Open PDF
                                        </a>
                                    </>
                                ) : (
                                    <p className="text-gray-500">No resume uploaded.</p>
                                )}
                            </div>
                        </div>
                        <div className="p-4 border-t flex justify-end">
                            <button
                                onClick={() => setSelectedStudent(null)}
                                className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default StudentVerification;
