import React, { useState, useEffect } from 'react';
import { db, auth } from '../../config/firebaseConfig';
import { collection, addDoc, getDocs, deleteDoc, doc } from 'firebase/firestore';

export default function UploadDrives() {
    const [company, setCompany] = useState('');
    const [role, setRole] = useState('');
    const [deadline, setDeadline] = useState('');
    const [eligibility, setEligibility] = useState('');
    const [domain, setDomain] = useState('');
    
    const [drives, setDrives] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetchDrives();
    }, []);

    const fetchDrives = async () => {
        const querySnapshot = await getDocs(collection(db, 'upcomingDrives'));
        const drivesData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setDrives(drivesData);
    };

    const handleUpload = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const cleanDomain = domain.replace(/^https?:\/\//, '');
            let logoUrl = '';
            if (cleanDomain.toLowerCase().includes('infosys')) {
                logoUrl = '/logos/infosys.svg';
            } else if (cleanDomain.toLowerCase().includes('freshworks')) {
                logoUrl = '/logos/freshworks.svg';
            } else if (cleanDomain) {
                logoUrl = `https://t3.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=http://${cleanDomain}&size=256`;
            }
            
            await addDoc(collection(db, 'upcomingDrives'), {
                company,
                role,
                deadline,
                eligibility,
                logo: logoUrl,
                createdAt: new Date().toISOString()
            });
            alert('Drive uploaded successfully!');
            setCompany('');
            setRole('');
            setDeadline('');
            setEligibility('');
            setDomain('');
            fetchDrives();
        } catch (error) {
            console.error('Error adding document: ', error);
            alert('Error uploading drive');
        }
        setLoading(false);
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this drive?')) {
            try {
                await deleteDoc(doc(db, 'upcomingDrives', id));
                fetchDrives();
            } catch (error) {
                console.error('Error deleting document: ', error);
            }
        }
    };

    return (
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 max-w-5xl mx-auto">
            <h2 className="text-2xl font-bold mb-6 text-gray-800 mt-2">Upload Upcoming Drives</h2>
            <form onSubmit={handleUpload} className="space-y-4 mb-10 bg-blue-50/50 p-6 rounded-xl border border-blue-100">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1">Company Name</label>
                        <input type="text" placeholder="e.g. Infosys" className="border border-gray-300 p-2.5 rounded-lg w-full focus:ring-2 focus:ring-blue-500 outline-none" value={company} onChange={e => setCompany(e.target.value)} required />
                    </div>
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1">Company Domain (For Logo)</label>
                        <input type="text" placeholder="e.g. infosys.com" className="border border-gray-300 p-2.5 rounded-lg w-full focus:ring-2 focus:ring-blue-500 outline-none" value={domain} onChange={e => setDomain(e.target.value)} required />
                    </div>
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1">Role</label>
                        <input type="text" placeholder="e.g. System Engineer" className="border border-gray-300 p-2.5 rounded-lg w-full focus:ring-2 focus:ring-blue-500 outline-none" value={role} onChange={e => setRole(e.target.value)} required />
                    </div>
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1">Deadline</label>
                        <input type="text" placeholder="e.g. Feb 18, 2026" className="border border-gray-300 p-2.5 rounded-lg w-full focus:ring-2 focus:ring-blue-500 outline-none" value={deadline} onChange={e => setDeadline(e.target.value)} required />
                    </div>
                    <div className="md:col-span-2">
                        <label className="block text-sm font-semibold text-gray-700 mb-1">Eligibility</label>
                        <input type="text" placeholder="e.g. CSE, ECE" className="border border-gray-300 p-2.5 rounded-lg w-full focus:ring-2 focus:ring-blue-500 outline-none" value={eligibility} onChange={e => setEligibility(e.target.value)} required />
                    </div>
                </div>
                <button type="submit" disabled={loading} className="mt-4 bg-blue-600 text-white px-6 py-2.5 rounded-lg font-medium hover:bg-blue-700 transition-colors w-full shadow-md">
                    {loading ? 'Uploading...' : 'Upload Drive & Make Public'}
                </button>
            </form>

            <h3 className="text-xl font-bold mb-4 text-gray-800 border-b pb-2">Currently Uploaded Drives</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {drives.length === 0 && <p className="text-gray-500 py-4 col-span-full">No drives uploaded yet.</p>}
                {drives.map(drive => (
                    <div key={drive.id} className="bg-white p-4 border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition-shadow relative">
                        <div className="flex items-center space-x-4 mb-3">
                            <div className="w-16 h-16 p-2 rounded-lg border border-gray-100 flex-shrink-0 bg-white shadow-sm flex items-center justify-center">
                                <img src={drive.logo} alt={drive.company} className="w-full h-full object-contain" />
                            </div>
                            <div>
                                <p className="font-bold text-lg leading-tight">{drive.company}</p>
                                <span className="text-xs font-semibold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full inline-block mt-1">{drive.role}</span>
                            </div>
                        </div>
                        <div className="text-sm text-gray-600 space-y-1 mb-4">
                            <p><span className="font-semibold text-gray-700">Deadline:</span> {drive.deadline}</p>
                            <p><span className="font-semibold text-gray-700">Eligibility:</span> {drive.eligibility}</p>
                        </div>
                        <button onClick={() => handleDelete(drive.id)} className="w-full bg-red-50 text-red-600 px-3 py-2 text-sm font-semibold rounded-lg hover:bg-red-100 hover:text-red-700 transition-colors border border-red-100 shadow-sm">
                            Delete Drive
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
}
