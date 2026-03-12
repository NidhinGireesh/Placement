import { useState, useEffect } from 'react';
import { useAuthStore } from '../../store/authStore';
import { getOfflineCourses } from '../../services/courseService';
import { getUsersByRole } from '../../services/adminService';
import { saveAttendance, getAttendance } from '../../services/attendanceService';

const TrainingWorkshop = () => {
    const { user } = useAuthStore();
    const [sessions, setSessions] = useState([]);
    const [classStudents, setClassStudents] = useState([]);
    const [loading, setLoading] = useState(true);

    // Attendance Modal State
    const [showAttendanceModal, setShowAttendanceModal] = useState(false);
    const [selectedSession, setSelectedSession] = useState(null);
    const [presentIds, setPresentIds] = useState([]);
    const [isSavingAttendance, setIsSavingAttendance] = useState(false);

    const [toast, setToast] = useState({ show: false, message: '', type: 'success' });

    const userBranch = user?.branch || user?.department;

    // Derive class string exactly as defined in authService
    // "CSE-2025" for example
    const coordinatorClass = user ? `${userBranch}-${user.passoutYear}` : '';

    useEffect(() => {
        if (user?.passoutYear && userBranch) {
            fetchData();
        }
    }, [user]);

    const fetchData = async () => {
        setLoading(true);
        // 1. Fetch Offline Courses targeted at this batch
        const coursesResult = await getOfflineCourses(user.passoutYear);
        if (coursesResult.success) {
            setSessions(coursesResult.data);
        }

        // 2. Fetch Students matching Coordinator's Class (branch + passoutYear)
        const studentsResult = await getUsersByRole('student');
        if (studentsResult.success) {
            const studentsInClass = studentsResult.data.filter(s =>
                (s.branch === userBranch || s.department === userBranch) &&
                s.passoutYear === user.passoutYear &&
                s.originalRole !== 'coordinator' // Don't take attendance for fellow coordinators (optional, but typical)
            );
            setClassStudents(studentsInClass);
        }
        setLoading(false);
    };

    // Helper: Show Toast
    const showToast = (message, type = 'success') => {
        setToast({ show: true, message, type });
        setTimeout(() => setToast({ show: false, message: '', type: 'success' }), 3000);
    };

    const handleOpenAttendance = async (session) => {
        setSelectedSession(session);
        setPresentIds([]); // Reset
        setShowAttendanceModal(true);

        // Fetch existing attendance if any
        const result = await getAttendance(session.id, coordinatorClass);
        if (result.success) {
            setPresentIds(result.presentStudentIds);
        }
    };

    const toggleStudentAttendance = (studentId) => {
        setPresentIds(prev =>
            prev.includes(studentId)
                ? prev.filter(id => id !== studentId)
                : [...prev, studentId]
        );
    };

    const handleSaveAttendance = async () => {
        setIsSavingAttendance(true);
        const result = await saveAttendance(selectedSession.id, coordinatorClass, presentIds);
        if (result.success) {
            showToast('Attendance saved successfully!');
            setShowAttendanceModal(false);
        } else {
            showToast(result.error || 'Failed to save attendance', 'error');
        }
        setIsSavingAttendance(false);
    };

    // Handler: Download
    const handleDownload = (fileName) => {
        showToast(`Downloading ${fileName}...`);
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center py-20">
                <div className="w-10 h-10 border-4 border-teal-600/20 border-t-teal-600 rounded-full animate-spin"></div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-start mb-8">
                <div>
                    <h2 className="text-2xl font-bold text-gray-800">Manage Training Sessions</h2>
                    <p className="text-gray-500 mt-1">Take attendance for offline sessions assigned to <strong className="text-teal-600">Batch {user?.passoutYear}</strong></p>
                </div>
            </div>

            {/* Sessions Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {sessions.map((session) => (
                    <div key={session.id} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow flex flex-col h-full">
                        <div className="h-28 bg-gradient-to-r from-slate-800 to-slate-700 p-6 flex flex-col justify-center relative">
                            <h3 className="text-white font-bold text-lg mb-1">{session.title}</h3>
                            <span className="text-[10px] uppercase font-bold text-slate-300 tracking-wider bg-white/10 w-fit px-2 py-0.5 rounded">
                                Offline Session
                            </span>
                        </div>
                        <div className="p-6 space-y-4 flex-1 flex flex-col">

                            <p className="text-sm text-gray-600 line-clamp-2">{session.description}</p>

                            <div className="bg-slate-50 p-3 rounded-lg border border-slate-100 space-y-2 text-sm text-gray-700 font-medium">
                                <div className="flex items-center gap-2">
                                    <span className="text-lg">📅</span> {session.date}
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className="text-lg">⏰</span> {session.time}
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className="text-lg">📍</span> {session.venue}
                                </div>
                            </div>

                            <div className="pt-4 mt-auto">
                                <button
                                    onClick={() => handleOpenAttendance(session)}
                                    className="w-full py-2.5 bg-teal-50 text-teal-700 border border-teal-200 rounded-lg hover:bg-teal-600 hover:text-white transition-colors font-bold flex justify-center items-center gap-2"
                                >
                                    <span>✓</span> Take Attendance
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Empty State */}
            {sessions.length === 0 && (
                <div className="text-center py-16 bg-white rounded-xl border border-dashed border-gray-300">
                    <div className="text-4xl mb-4">🏫</div>
                    <h3 className="text-lg font-bold text-gray-800">No Offline Sessions</h3>
                    <p className="text-gray-500 mt-1 max-w-md mx-auto">There are currently no offline training sessions assigned to your batch.</p>
                </div>
            )}

            {/* Attendance Modal */}
            {showAttendanceModal && selectedSession && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh]">
                        <div className="p-6 border-b border-gray-100 flex justify-between items-start bg-slate-50">
                            <div>
                                <h3 className="text-xl font-bold text-gray-800">Attendance: {selectedSession.title}</h3>
                                <p className="text-xs text-gray-500 mt-1 font-medium bg-gray-200 w-fit px-2 py-0.5 rounded">
                                    Class: {coordinatorClass}
                                </p>
                            </div>
                            <button onClick={() => setShowAttendanceModal(false)} className="text-gray-400 hover:text-gray-800 transition-colors p-1">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>

                        <div className="p-6 overflow-y-auto flex-1 bg-white">
                            {classStudents.length === 0 ? (
                                <p className="text-center text-gray-500 py-8">No students found in your class ({coordinatorClass}).</p>
                            ) : (
                                <div className="space-y-1">
                                    <div className="flex justify-between items-center px-4 py-2 bg-slate-100 rounded-t-lg font-semibold text-xs text-slate-500 uppercase tracking-wider">
                                        <span>Student Name</span>
                                        <div className="flex gap-16">
                                            <span>Reg No.</span>
                                            <span>Status</span>
                                        </div>
                                    </div>
                                    {classStudents.map(student => (
                                        <label
                                            key={student.id}
                                            className="flex items-center justify-between p-3 hover:bg-slate-50 border-b border-slate-100 cursor-pointer transition-colors"
                                        >
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-full bg-teal-100 text-teal-700 font-bold flex items-center justify-center text-sm">
                                                    {student.name.charAt(0).toUpperCase()}
                                                </div>
                                                <span className="font-medium text-gray-800">{student.name}</span>
                                            </div>

                                            <div className="flex items-center gap-8">
                                                <span className="text-sm text-gray-500 font-mono w-24 text-right">
                                                    {student.registerNumber || 'N/A'}
                                                </span>
                                                <div className="relative inline-block w-12 mr-2 align-middle select-none transition duration-200 ease-in">
                                                    <input
                                                        type="checkbox"
                                                        name="toggle"
                                                        id={`toggle-${student.id}`}
                                                        className="toggle-checkbox absolute block w-6 h-6 rounded-full bg-white border-4 appearance-none cursor-pointer focus:outline-none focus:ring-0 checked:right-0 checked:border-green-500 transition-all duration-300 z-10"
                                                        style={{
                                                            right: presentIds.includes(student.id) ? '0' : '24px',
                                                            borderColor: presentIds.includes(student.id) ? '#22c55e' : '#e5e7eb'
                                                        }}
                                                        checked={presentIds.includes(student.id)}
                                                        onChange={() => toggleStudentAttendance(student.id)}
                                                    />
                                                    <label
                                                        htmlFor={`toggle-${student.id}`}
                                                        className={`toggle-label block overflow-hidden h-6 rounded-full cursor-pointer transition-colors duration-300 ${presentIds.includes(student.id) ? 'bg-green-100' : 'bg-gray-200'}`}
                                                    ></label>
                                                </div>
                                            </div>
                                        </label>
                                    ))}
                                </div>
                            )}
                        </div>

                        <div className="p-6 border-t border-gray-100 bg-slate-50 flex justify-between items-center">
                            <div className="text-sm text-gray-600">
                                Total Present: <strong className="text-green-600">{presentIds.length}</strong> / {classStudents.length}
                            </div>
                            <div className="space-x-3">
                                <button type="button" onClick={() => setShowAttendanceModal(false)} className="px-5 py-2 text-gray-600 font-medium hover:bg-gray-200 rounded-lg transition-colors">
                                    Cancel
                                </button>
                                <button
                                    onClick={handleSaveAttendance}
                                    disabled={isSavingAttendance || classStudents.length === 0}
                                    className="px-6 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 font-bold transition-colors disabled:opacity-50"
                                >
                                    {isSavingAttendance ? 'Saving...' : 'Save Attendance'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Toast Notification */}
            {toast.show && (
                <div className="fixed bottom-8 right-8 bg-gray-900 text-white px-6 py-3 rounded-lg shadow-lg flex items-center space-x-3 animate-fade-in-up z-50">
                    <span className={`text-xl ${toast.type === 'error' ? 'text-red-400' : 'text-green-400'}`}>
                        {toast.type === 'error' ? '✖' : '✓'}
                    </span>
                    <p className="font-medium">{toast.message}</p>
                </div>
            )}
        </div>
    );
};

export default TrainingWorkshop;
