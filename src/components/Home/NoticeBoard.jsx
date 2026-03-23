import { useState, useEffect } from 'react';
import { db } from '../../config/firebaseConfig';
import { collection, onSnapshot, query, orderBy } from 'firebase/firestore';

export default function NoticeBoard() {
    const [announcements, setAnnouncements] = useState([]);
    
    useEffect(() => {
        // Fetch announcements without restrictive query parameters to ensure public fallback works
        const q = query(collection(db, 'announcements'));
        const unsubscribe = onSnapshot(q, (snapshot) => {
            if (snapshot.empty) {
                console.log("No announcements found in Firestore.");
                setAnnouncements([]);
                return;
            }
            
            const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            
            // Sort by createdAt (latest first) or manually added date string
            const sortedData = data.sort((a, b) => {
                const timeA = a.createdAt?.seconds ? a.createdAt.seconds * 1000 : (a.date ? new Date(a.date).getTime() : 0);
                const timeB = b.createdAt?.seconds ? b.createdAt.seconds * 1000 : (b.date ? new Date(b.date).getTime() : 0);
                return timeB - timeA;
            });
            
            setAnnouncements(sortedData);
        }, (error) => {
            console.error("Home NoticeBoard Error (Check Security Rules):", error);
        });
        return () => unsubscribe();
    }, []);
    return (
        <section className="py-16 bg-blue-50">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                <h2 className="text-3xl font-bold text-center mb-8 text-gray-800"><span className="text-blue-600">Notice Board</span></h2>

                <div className="bg-white rounded-2xl shadow-lg border border-blue-100 overflow-hidden h-96 relative flex flex-col">
                    <div className="p-4 bg-blue-600 text-white font-bold flex justify-between items-center z-10 shrink-0">
                        <div className="flex items-center space-x-2">
                            <span className="text-xl">📢</span>
                            <span>Latest Announcements</span>
                        </div>
                        <span className="text-xs bg-red-500 px-3 py-1 rounded-full font-black tracking-widest uppercase shadow-sm">Live</span>
                    </div>
                    
                    <div className="flex-1 overflow-y-auto custom-scrollbar bg-gray-50/30 p-4">
                        {announcements.length === 0 ? (
                            <div className="h-full flex flex-col items-center justify-center text-center">
                                <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mb-4 rotate-12 shadow-sm">
                                    <span className="text-3xl text-blue-600">🔔</span>
                                </div>
                                <h3 className="text-xl font-bold text-gray-800 mb-2">Upcoming Announcements</h3>
                                <p className="text-gray-500 max-w-sm">
                                    Stay tuned! We'll announce placement drives, workshop schedules, and other important updates right here.
                                </p>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {announcements.map((item) => (
                                    <div key={item.id} className="bg-white p-5 rounded-xl border-l-4 border-blue-600 shadow-sm hover:shadow-md transition-shadow">
                                        <div className="flex justify-between items-start mb-2">
                                            <h3 className="font-bold text-gray-800 text-lg">{item.title}</h3>
                                            <span className="text-xs font-semibold text-gray-500 bg-gray-100 px-2 py-1 rounded-md whitespace-nowrap ml-2">
                                                {item.date}
                                            </span>
                                        </div>
                                        <p className="text-gray-600 text-sm whitespace-pre-wrap">{item.message}</p>
                                        {(item.target || item.deadline) && (
                                            <div className="mt-4 flex items-center space-x-3 text-xs font-medium">
                                                {item.target && (
                                                    <span className="text-indigo-600 bg-indigo-50 px-2 py-1 rounded-md">
                                                        🎯 {item.target}
                                                    </span>
                                                )}
                                                {item.deadline && (
                                                    <span className="text-red-600 bg-red-50 px-2 py-1 rounded-md">
                                                        ⏰ Deadline: {item.deadline}
                                                    </span>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </section>
    );
}
