
import { useState } from 'react';
import { mockTrainingSessions } from './mockData';

const TrainingWorkshop = () => {
    const [sessions, setSessions] = useState(mockTrainingSessions);
    const [showAddModal, setShowAddModal] = useState(false);
    const [showUploadModal, setShowUploadModal] = useState(false);
    const [selectedSessionId, setSelectedSessionId] = useState('');
    const [toast, setToast] = useState({ show: false, message: '', type: 'success' });

    // Add Session Form State
    const [newSession, setNewSession] = useState({
        title: '',
        trainer: '',
        date: '',
        time: '',
        description: '',
        batch: 'All Students'
    });

    // Upload Material Form State
    const [material, setMaterial] = useState({
        title: '',
        file: null
    });

    // Helper: Show Toast
    const showToast = (message, type = 'success') => {
        setToast({ show: true, message, type });
        setTimeout(() => setToast({ show: false, message: '', type: 'success' }), 3000);
    };

    // Handler: Add Session
    const handleAddSession = (e) => {
        e.preventDefault();
        const session = {
            id: sessions.length + 1,
            title: newSession.title,
            trainer: newSession.trainer,
            date: newSession.date,
            time: newSession.time,
            attendees: 0,
            status: 'Upcoming',
            materials: []
        };
        setSessions([session, ...sessions]);
        setShowAddModal(false);
        setNewSession({ title: '', trainer: '', date: '', time: '', description: '', batch: 'All Students' });
        showToast('Session added successfully!');
    };

    // Handler: Upload Material
    const handleUploadMaterial = (e) => {
        e.preventDefault();
        if (!selectedSessionId || !material.title) {
            alert('Please select a session and enter a file title.');
            return;
        }

        const updatedSessions = sessions.map(session => {
            if (session.id === parseInt(selectedSessionId)) {
                return {
                    ...session,
                    materials: [...(session.materials || []), { name: material.title + ".pdf", size: "2.5 MB" }] // Simulating file
                };
            }
            return session;
        });

        setSessions(updatedSessions);
        setShowUploadModal(false);
        setMaterial({ title: '', file: null });
        setSelectedSessionId('');
        showToast('Material uploaded successfully!');
    };

    // Handler: Delete Session
    const handleDeleteSession = (id) => {
        if (window.confirm('Are you sure you want to delete this session?')) {
            setSessions(sessions.filter(s => s.id !== id));
            showToast('Session deleted.', 'error');
        }
    };

    // Handler: Download
    const handleDownload = (fileName) => {
        showToast(`Downloading ${fileName}...`);
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-gray-800">Training & Workshops</h2>
                <div className="space-x-4">
                    <button
                        onClick={() => setShowUploadModal(true)}
                        className="bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors shadow-sm font-medium"
                    >
                        📂 Upload Material
                    </button>
                    <button
                        onClick={() => setShowAddModal(true)}
                        className="bg-teal-600 text-white px-4 py-2 rounded-lg hover:bg-teal-700 transition-colors shadow-sm font-medium"
                    >
                        + Add New Session
                    </button>
                </div>
            </div>

            {/* Sessions Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {sessions.map((session) => (
                    <div key={session.id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow flex flex-col h-full">
                        <div className="h-32 bg-gradient-to-r from-teal-500 to-emerald-500 p-6 flex flex-col justify-end relative">
                            <button
                                onClick={() => handleDeleteSession(session.id)}
                                className="absolute top-4 right-4 text-white/80 hover:text-white bg-black/10 hover:bg-black/20 rounded-full p-1 transition-all"
                                title="Delete Session"
                            >
                                ✕
                            </button>
                            <h3 className="text-white font-bold text-lg">{session.title}</h3>
                            <p className="text-teal-100 text-sm">{session.trainer}</p>
                        </div>
                        <div className="p-6 space-y-4 flex-1 flex flex-col">
                            <div className="flex justify-between text-sm text-gray-600">
                                <span>📅 {session.date}</span>
                                <span>⏰ {session.time}</span>
                            </div>

                            <div className="flex items-center justify-between pt-2">
                                <span className={`px-2 py-1 rounded text-xs font-bold ${session.status === 'Completed' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'
                                    }`}>
                                    {session.status}
                                </span>
                                <span className="text-gray-500 text-sm">
                                    👥 {session.attendees} Attendees
                                </span>
                            </div>

                            {/* Materials Section */}
                            <div className="pt-4 border-t border-gray-100 flex-1">
                                <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Materials</h4>
                                {session.materials && session.materials.length > 0 ? (
                                    <ul className="space-y-2">
                                        {session.materials.map((file, idx) => (
                                            <li key={idx} className="flex justify-between items-center text-sm bg-gray-50 p-2 rounded">
                                                <span className="truncate text-gray-700 max-w-[150px]" title={file.name}>{file.name}</span>
                                                <button
                                                    onClick={() => handleDownload(file.name)}
                                                    className="text-teal-600 hover:text-teal-800 text-xs font-medium"
                                                >
                                                    ⬇ Load
                                                </button>
                                            </li>
                                        ))}
                                    </ul>
                                ) : (
                                    <p className="text-xs text-gray-400 italic">No materials uploaded.</p>
                                )}
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Empty State */}
            {sessions.length === 0 && (
                <div className="text-center py-12 bg-gray-50 rounded-xl border border-dashed border-gray-300">
                    <p className="text-gray-500">No training sessions scheduled.</p>
                    <button
                        onClick={() => setShowAddModal(true)}
                        className="mt-4 text-teal-600 font-medium hover:underline"
                    >
                        Create your first session
                    </button>
                </div>
            )}

            {/* Add Session Modal */}
            {showAddModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-xl shadow-xl w-full max-w-lg overflow-hidden animate-fade-in-up">
                        <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                            <h3 className="text-xl font-bold text-gray-800">Add New Session</h3>
                            <button onClick={() => setShowAddModal(false)} className="text-gray-400 hover:text-gray-600">✕</button>
                        </div>
                        <form onSubmit={handleAddSession} className="p-6 space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Session Title</label>
                                <input required type="text" className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-teal-500 outline-none"
                                    value={newSession.title} onChange={e => setNewSession({ ...newSession, title: e.target.value })} />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Trainer Name</label>
                                <input required type="text" className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-teal-500 outline-none"
                                    value={newSession.trainer} onChange={e => setNewSession({ ...newSession, trainer: e.target.value })} />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                                    <input required type="date" className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-teal-500 outline-none"
                                        value={newSession.date} onChange={e => setNewSession({ ...newSession, date: e.target.value })} />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Time</label>
                                    <input required type="time" className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-teal-500 outline-none"
                                        value={newSession.time} onChange={e => setNewSession({ ...newSession, time: e.target.value })} />
                                </div>
                            </div>
                            <div className="flex justify-end pt-4 space-x-3">
                                <button type="button" onClick={() => setShowAddModal(false)} className="px-4 py-2 text-gray-600 hover:bg-gray-50 rounded-lg">Cancel</button>
                                <button type="submit" className="px-6 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 font-medium">Add Session</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Upload Modal */}
            {showUploadModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden animate-fade-in-up">
                        <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                            <h3 className="text-xl font-bold text-gray-800">Upload Material</h3>
                            <button onClick={() => setShowUploadModal(false)} className="text-gray-400 hover:text-gray-600">✕</button>
                        </div>
                        <form onSubmit={handleUploadMaterial} className="p-6 space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Select Session</label>
                                <select required className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-teal-500 outline-none bg-white"
                                    value={selectedSessionId} onChange={e => setSelectedSessionId(e.target.value)}
                                >
                                    <option value="">-- Choose Session --</option>
                                    {sessions.map(s => <option key={s.id} value={s.id}>{s.title}</option>)}
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Material Title</label>
                                <input required type="text" placeholder="e.g. Slides-v1" className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-teal-500 outline-none"
                                    value={material.title} onChange={e => setMaterial({ ...material, title: e.target.value })} />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">File (PDF/PPT)</label>
                                <input required type="file" accept=".pdf,.ppt,.pptx" className="w-full border rounded-lg p-2 text-sm file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-teal-50 file:text-teal-700 hover:file:bg-teal-100" />
                            </div>
                            <div className="flex justify-end pt-4 space-x-3">
                                <button type="button" onClick={() => setShowUploadModal(false)} className="px-4 py-2 text-gray-600 hover:bg-gray-50 rounded-lg">Cancel</button>
                                <button type="submit" className="px-6 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 font-medium">Upload</button>
                            </div>
                        </form>
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
