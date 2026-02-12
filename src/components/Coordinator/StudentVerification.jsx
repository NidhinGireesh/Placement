
import { useState } from 'react';
import { mockStudents } from './mockData';

const StudentVerification = () => {
    const [students, setStudents] = useState(mockStudents);
    const [filterBranch, setFilterBranch] = useState("All");
    const [filterStatus, setFilterStatus] = useState("All");
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedStudent, setSelectedStudent] = useState(null); // For Modal

    const handleVerify = (id) => {
        setStudents(students.map(s => s.id === id ? { ...s, status: "Verified" } : s));
    };

    const handleReject = (id) => {
        setStudents(students.map(s => s.id === id ? { ...s, status: "Rejected" } : s));
    };

    const filteredStudents = students.filter(student => {
        const matchesBranch = filterBranch === "All" || student.branch === filterBranch;
        const matchesStatus = filterStatus === "All" || student.status === filterStatus;
        const matchesSearch = student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            student.regNo.toLowerCase().includes(searchTerm.toLowerCase());
        return matchesBranch && matchesStatus && matchesSearch;
    });

    const isEligible = (cgpa, backlogs) => cgpa >= 7.0 && backlogs === 0;

    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-800">Student Verification</h2>

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
                        value={filterBranch}
                        onChange={(e) => setFilterBranch(e.target.value)}
                    >
                        <option value="All">All Branches</option>
                        <option value="CSE">CSE</option>
                        <option value="ECE">ECE</option>
                        <option value="MECH">MECH</option>
                        <option value="EEE">EEE</option>
                    </select>
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
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Branch</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Academics</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Resume</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {filteredStudents.map((student) => (
                            <tr key={student.id} className="hover:bg-gray-50 transition-colors">
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="flex items-center">
                                        <div className="flex-shrink-0 h-10 w-10 bg-teal-100 text-teal-600 rounded-full flex items-center justify-center font-bold">
                                            {student.name.charAt(0)}
                                        </div>
                                        <div className="ml-4">
                                            <div className="text-sm font-medium text-gray-900">{student.name}</div>
                                            <div className="text-sm text-gray-500">{student.regNo}</div>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{student.branch}</td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="text-sm text-gray-900">CGPA: {student.cgpa}</div>
                                    <div className={`text-xs ${student.backlogs > 0 ? 'text-red-500' : 'text-green-500'}`}>
                                        Backlogs: {student.backlogs}
                                    </div>
                                    {isEligible(student.cgpa, student.backlogs) ? (
                                        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800">
                                            Eligible
                                        </span>
                                    ) : (
                                        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-red-100 text-red-800">
                                            Not Eligible
                                        </span>
                                    )}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-blue-600 cursor-pointer hover:underline" onClick={() => setSelectedStudent(student)}>
                                    View Resume
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                    ${student.status === 'Verified' ? 'bg-green-100 text-green-800' :
                                            student.status === 'Rejected' ? 'bg-red-100 text-red-800' :
                                                'bg-yellow-100 text-yellow-800'}`}>
                                        {student.status}
                                    </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                                    {student.status === 'Pending' && (
                                        <>
                                            <button onClick={() => handleVerify(student.id)} className="text-green-600 hover:text-green-900 font-bold">Verify</button>
                                            <button onClick={() => handleReject(student.id)} className="text-red-600 hover:text-red-900 font-bold">Reject</button>
                                        </>
                                    )}
                                    {student.status !== 'Pending' && <span className="text-gray-400">Locked</span>}
                                </td>
                            </tr>
                        ))}
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
                                <p className="mb-4 text-gray-600">This is a placeholder for the PDF Viewer.</p>
                                <div className="bg-white p-8 shadow-md rounded-md max-w-sm mx-auto">
                                    <p className="font-bold text-lg">{selectedStudent.resume}</p>
                                    <p className="text-sm text-gray-500 mt-2">Mock Resume Content...</p>
                                </div>
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
