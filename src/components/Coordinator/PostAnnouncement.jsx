
import { useState, useEffect } from 'react';
import { db } from '../../config/firebaseConfig';
import { collection, addDoc, onSnapshot, query, orderBy, serverTimestamp, deleteDoc, doc, updateDoc } from 'firebase/firestore';

const PostAnnouncement = ({ onSuccess, editData }) => {
    const [announcements, setAnnouncements] = useState([]);
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        target: 'All Students',
        deadline: ''
    });
    const [showToast, setShowToast] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [editId, setEditId] = useState(null);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    useEffect(() => {
        if (editData) {
            setFormData({
                title: editData.title || '',
                description: editData.message || '',
                target: editData.target || 'All Students',
                deadline: editData.deadline || ''
            });
            setIsEditing(true);
            setEditId(editData.id);
        } else {
            setFormData({ title: '', description: '', target: 'All Students', deadline: '' });
            setIsEditing(false);
            setEditId(null);
        }
    }, [editData]);

    useEffect(() => {
        const q = query(collection(db, 'announcements'), orderBy('createdAt', 'desc'));
        const unsubscribe = onSnapshot(q, (snapshot) => {
            const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setAnnouncements(data);
        });
        return () => unsubscribe();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (isEditing) {
                const docRef = doc(db, 'announcements', editId);
                await updateDoc(docRef, {
                    title: formData.title,
                    message: formData.description,
                    target: formData.target,
                    deadline: formData.deadline,
                    updatedAt: serverTimestamp()
                });
                setIsEditing(false);
                setEditId(null);
            } else {
                await addDoc(collection(db, 'announcements'), {
                    title: formData.title,
                    message: formData.description,
                    target: formData.target,
                    deadline: formData.deadline,
                    createdAt: serverTimestamp(),
                    date: new Date().toLocaleDateString()
                });
            }

            setFormData({ title: '', description: '', target: 'All Students', deadline: '' });
            setShowToast(true);
            setTimeout(() => {
                setShowToast(false);
                if (onSuccess) onSuccess();
            }, 1500);
        } catch (error) {
            console.error("Error saving announcement: ", error);
            alert("Failed to save announcement.");
        }
    };

    const handleEdit = (announcement) => {
        setFormData({
            title: announcement.title,
            description: announcement.message,
            target: announcement.target || 'All Students',
            deadline: announcement.deadline || ''
        });
        setIsEditing(true);
        setEditId(announcement.id);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleDelete = async (id) => {
        if (window.confirm("Are you sure you want to delete this announcement?")) {
            try {
                await deleteDoc(doc(db, 'announcements', id));
            } catch (error) {
                console.error("Error deleting announcement:", error);
                alert("Failed to delete announcement.");
            }
        }
    };

    return (
        <div className="max-w-4xl mx-auto space-y-8 animate-fadeIn">
            {!onSuccess && (
                <div className="flex items-center space-x-4 mb-6">
                    <span className="p-3 bg-blue-100 text-blue-600 rounded-xl text-2xl">📢</span>
                    <div>
                        <h1 className="text-3xl font-black text-gray-800 tracking-tight">
                            {isEditing ? 'Edit Announcement' : 'Post Announcement'}
                        </h1>
                        <p className="text-sm font-medium text-gray-500 mt-1">
                            {isEditing ? 'Update the details of this announcement' : 'Broadcast important information'}
                        </p>
                    </div>
                </div>
            )}

            {/* Form Section */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Announcement Title</label>
                        <input
                            type="text"
                            name="title"
                            value={formData.title}
                            onChange={handleChange}
                            required
                            className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none transition-all"
                            placeholder="e.g. Upcoming Placement Drive - TechCorp"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                        <textarea
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            required
                            rows="6"
                            className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none transition-all resize-none"
                            placeholder="Enter detailed announcement..."
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Target Audience</label>
                            <select
                                name="target"
                                value={formData.target}
                                onChange={handleChange}
                                className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none transition-all"
                            >
                                <option>All Students</option>
                                <option>Final Year CSE</option>
                                <option>Final Year ECE</option>
                                <option>Final Year MECH</option>
                                <option>Final Year EEE</option>
                                <option>Backlog Students</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Deadline (Optional)</label>
                            <input
                                type="date"
                                name="deadline"
                                value={formData.deadline}
                                onChange={handleChange}
                                className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none transition-all"
                            />
                        </div>
                    </div>

                    <div className="pt-4 flex gap-4">
                        <button
                            type="submit"
                            className="w-full md:w-auto px-8 py-3 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition-all shadow-md hover:shadow-lg transform hover:-translate-y-0.5 active:scale-95"
                        >
                            {isEditing ? 'Update Announcement' : 'Post Announcement'}
                        </button>
                        {isEditing && (
                            <button
                                type="button"
                                onClick={() => {
                                    setIsEditing(false);
                                    setEditId(null);
                                    setFormData({ title: '', description: '', target: 'All Students', deadline: '' });
                                }}
                                className="w-full md:w-auto px-8 py-3 bg-gray-100 text-gray-700 font-bold rounded-xl hover:bg-gray-200 transition-all border border-gray-200"
                            >
                                Cancel
                            </button>
                        )}
                    </div>
                </form>
            </div>

            {/* Recent Announcements Preview - Only show if not embedded (no onSuccess) */}
            {!onSuccess && (
                <div className="space-y-4">
                    <h2 className="text-xl font-bold text-gray-800">Recent Announcements</h2>
                    <div className="space-y-4">
                        {announcements.map((item) => (
                            <div key={item.id} className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                                <div className="flex justify-between items-start mb-2">
                                    <h3 className="font-bold text-lg text-gray-800">{item.title}</h3>
                                    <span className="text-sm text-gray-500 bg-gray-50 px-3 py-1 rounded-full border border-gray-200">
                                        {item.date}
                                    </span>
                                </div>
                                <p className="text-gray-600 mb-3">{item.message}</p>
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center space-x-4 text-xs text-gray-500 font-medium">
                                        <span className="flex items-center"><span className="mr-1">🎯</span> {item.target || 'All Students'}</span>
                                        {item.deadline && <span className="flex items-center text-red-500"><span className="mr-1">⏰</span> Deadline: {item.deadline}</span>}
                                    </div>
                                    <div className="flex gap-2">
                                        <button 
                                            onClick={() => handleEdit(item)}
                                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors text-sm font-bold"
                                            title="Edit"
                                        >
                                            Edit
                                        </button>
                                        <button 
                                            onClick={() => handleDelete(item.id)}
                                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors text-sm font-bold"
                                            title="Delete"
                                        >
                                            Delete
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Toast Notification */}
            {showToast && (
                <div className="fixed bottom-8 right-8 bg-gray-900 text-white px-6 py-3 rounded-lg shadow-lg flex items-center space-x-3 animate-fade-in-up z-50">
                    <span className="text-green-400 text-xl">✓</span>
                    <p className="font-medium">Announcement {isEditing ? 'updated' : 'posted'} successfully!</p>
                </div>
            )}
        </div>
    );
};

export default PostAnnouncement;
