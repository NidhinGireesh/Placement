import React, { useEffect, useState } from 'react';
import { db } from '../../config/firebaseConfig';
import { collection, onSnapshot, query } from 'firebase/firestore';

export default function UpcomingDrives() {
    const [drives, setDrives] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const q = query(collection(db, 'upcomingDrives'));
        const unsubscribeSnapshot = onSnapshot(q, (snapshot) => {
            const drivesData = snapshot.docs.map(doc => ({ 
                id: doc.id, 
                ...doc.data() 
            }));
            
            drivesData.sort((a, b) => {
                if (!a.createdAt) return 1;
                if (!b.createdAt) return -1;
                return new Date(b.createdAt) - new Date(a.createdAt);
            });
            
            setDrives(drivesData);
            setLoading(false);
        }, (error) => {
            console.error("Firestore error while fetching public drives:", error);
            setLoading(false);
        });

        return () => {
            if (unsubscribeSnapshot) unsubscribeSnapshot();
        };
    }, []);

    return (
        <section className="py-16 bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <h2 className="text-3xl font-bold text-center mb-12 text-gray-800">Upcoming Drives</h2>

                {loading ? (
                    <div className="flex justify-center p-12">
                        <div className="animate-spin h-10 w-10 border-4 border-blue-500 rounded-full border-t-transparent"></div>
                    </div>
                ) : drives.length === 0 ? (
                    <div className="text-center py-12 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200 group hover:border-blue-400 transition-colors">
                        <div className="text-4xl mb-3 group-hover:scale-110 transition-transform grayscale hover:grayscale-0">🚀</div>
                        <p className="text-gray-500 font-medium tracking-wide">No recruitment drives are scheduled currently.</p>
                        <p className="text-sm text-gray-400">Check back later for updates!</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {drives.map((drive) => (
                            <div key={drive.id} className="bg-white rounded-xl shadow-md border border-gray-100 p-6 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 relative overflow-hidden group">
                                <div className="absolute top-0 right-0 w-24 h-24 bg-blue-50 rounded-bl-full -mr-4 -mt-4 opacity-50 group-hover:bg-blue-100 transition-colors"></div>

                                <div className="flex items-center space-x-4 mb-4 relative z-10">
                                    <div className="w-24 h-24 bg-white rounded-xl shadow-sm border border-gray-100 p-2 flex items-center justify-center relative z-10 group-hover:border-blue-200 transition-colors">
                                        <img
                                            src={drive.company && drive.company.toLowerCase().includes('infosys') ? '/logos/infosys.svg' : drive.logo}
                                            alt={drive.company}
                                            className="w-full h-full object-contain mix-blend-multiply"
                                            onError={(e) => {
                                                e.target.style.display = 'none';
                                                e.target.nextSibling.classList.remove('hidden');
                                                e.target.nextSibling.classList.add('flex');
                                            }}
                                        />
                                        <div className="w-full h-full bg-blue-50 rounded-lg hidden items-center justify-center text-xl text-blue-600 font-bold">
                                            {drive.company?.substring(0, 2).toUpperCase()}
                                        </div>
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-lg text-gray-800">{drive.company}</h3>
                                        <span className="text-sm text-green-600 font-medium bg-green-50 px-2 py-0.5 rounded-full">Register Open</span>
                                    </div>
                                </div>

                                <div className="space-y-2 mb-2">
                                    <p className="text-gray-600 text-sm flex items-center gap-2">
                                        <span className="font-bold text-gray-800">Role:</span> {drive.role || drive.title}
                                    </p>
                                    <p className="text-gray-600 text-sm flex items-center gap-2">
                                        <span className="font-bold text-gray-800">Deadline:</span> {drive.deadline}
                                    </p>
                                    <p className="text-gray-600 text-sm flex items-center gap-2">
                                        <span className="font-bold text-gray-800">Eligible:</span> {drive.eligibility}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </section>
    );
}
