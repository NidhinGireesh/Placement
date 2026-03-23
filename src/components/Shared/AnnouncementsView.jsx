import { useState, useEffect } from 'react';
import { db } from '../../config/firebaseConfig';
import { collection, onSnapshot, query, orderBy } from 'firebase/firestore';
import { useAuthStore } from '../../store/authStore';
import PostAnnouncement from '../Coordinator/PostAnnouncement';

export default function AnnouncementsView() {
    const { user } = useAuthStore();
    const [announcements, setAnnouncements] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showPostForm, setShowPostForm] = useState(false);
    const [editData, setEditData] = useState(null);
    
    const canPost = user?.role === 'admin' || user?.role === 'coordinator';

    const handleDelete = async (id) => {
        if (window.confirm("Are you sure you want to delete this announcement?")) {
            const { doc, deleteDoc } = await import('firebase/firestore');
            await deleteDoc(doc(db, 'announcements', id));
        }
    };

    const handleEdit = (announcement) => {
        setEditData(announcement);
        setShowPostForm(true);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    useEffect(() => {
        const q = query(collection(db, 'announcements'), orderBy('createdAt', 'desc'));
        const unsubscribe = onSnapshot(q, (snapshot) => {
            const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setAnnouncements(data);
            setLoading(false);
        }, (error) => {
            console.error("Error fetching announcements:", error);
            setLoading(false);
        });
        return () => unsubscribe();
    }, []);

    if (loading) {
        return (
            <div className="flex items-center justify-center p-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto space-y-6 animate-fadeIn">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                <div className="flex items-center space-x-4">
                    <span className="p-3 bg-blue-100 text-blue-600 rounded-xl text-2xl">🔔</span>
                    <div>
                        <h1 className="text-3xl font-black text-gray-800 tracking-tight">Announcements</h1>
                        <p className="text-sm font-medium text-gray-500 mt-1">Stay updated with the latest campus placement news</p>
                    </div>
                </div>
                
                {canPost && (
                    <button 
                        onClick={() => setShowPostForm(!showPostForm)}
                        className={`px-6 py-2.5 rounded-xl font-bold transition-all shadow-sm flex items-center gap-2 ${
                            showPostForm 
                            ? 'bg-gray-100 text-gray-600 hover:bg-gray-200' 
                            : 'bg-blue-600 text-white hover:bg-blue-700 shadow-blue-100'
                        }`}
                    >
                        <span>{showPostForm ? '✕' : '➕'}</span>
                        {showPostForm ? 'Cancel' : 'Post New'}
                    </button>
                )}
            </div>

            {showPostForm && canPost && (
                <div className="mb-8 p-6 bg-white rounded-2xl border-2 border-primary-100 shadow-xl animate-scaleUp">
                    <PostAnnouncement 
                        onSuccess={() => {
                            setShowPostForm(false);
                            setEditData(null);
                        }} 
                        editData={editData}
                    />
                </div>
            )}

            {announcements.length === 0 ? (
                <div className="text-center bg-white p-12 rounded-2xl shadow-sm border border-gray-100">
                    <span className="text-6xl mb-4 block">📭</span>
                    <h3 className="text-xl font-bold text-gray-800">No Announcements Yet</h3>
                    <p className="text-gray-500 mt-2">When the admin posts an announcement, it will appear here.</p>
                </div>
            ) : (
                <div className="space-y-4">
                    {announcements.map((item) => (
                        <div key={item.id} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
                            <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-blue-500 to-indigo-600 group-hover:w-2 transition-all"></div>
                            
                            <div className="flex justify-between items-start mb-3 pl-3">
                                <div>
                                    <h3 className="font-bold text-xl text-gray-800 mb-1">{item.title}</h3>
                                    <div className="flex items-center space-x-3 text-xs text-gray-500 font-medium">
                                        <span className="bg-gray-100 px-2 py-1 rounded-md">{item.date}</span>
                                        <span className="flex items-center text-indigo-600 bg-indigo-50 px-2 py-1 rounded-md">
                                            <span className="mr-1">🎯</span> {item.target || 'All Students'}
                                        </span>
                                    </div>
                                </div>
                                {item.deadline && (
                                    <div className="flex flex-col items-end">
                                        <span className="text-[10px] font-black uppercase text-red-500 tracking-wider">Deadline</span>
                                        <span className="text-sm font-bold text-red-600 bg-red-50 px-3 py-1 rounded-lg mt-1">{item.deadline}</span>
                                    </div>
                                )}
                                {canPost && (
                                    <div className="flex items-center space-x-2 ml-4">
                                        <button 
                                            onClick={() => handleEdit(item)}
                                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors border border-transparent hover:border-blue-100"
                                            title="Edit"
                                        >
                                            ✏️
                                        </button>
                                        <button 
                                            onClick={() => handleDelete(item.id)}
                                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors border border-transparent hover:border-red-100"
                                            title="Delete"
                                        >
                                            🗑️
                                        </button>
                                    </div>
                                )}
                            </div>
                            
                            <p className="text-gray-600 leading-relaxed pl-3 whitespace-pre-wrap">{item.message}</p>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
