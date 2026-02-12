
import { useState } from 'react';
import { mockAnnouncements } from './mockData';

const Communication = () => {
    const [announcements, setAnnouncements] = useState(mockAnnouncements);
    const [title, setTitle] = useState('');
    const [message, setMessage] = useState('');

    const handleSend = () => {
        if (!title || !message) return;
        const newAnnouncement = {
            id: announcements.length + 1,
            title,
            message,
            date: new Date().toISOString().split('T')[0]
        };
        setAnnouncements([newAnnouncement, ...announcements]);
        setTitle('');
        setMessage('');
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Compose Message */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 h-fit">
                <h2 className="text-xl font-bold text-gray-800 mb-6">Compose Announcement</h2>
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                        <input
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            className="w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-teal-500 focus:border-teal-500"
                            placeholder="e.g. Upcoming Placement Drive"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Message</label>
                        <textarea
                            rows="6"
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            className="w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-teal-500 focus:border-teal-500"
                            placeholder="Type your message here..."
                        ></textarea>
                    </div>
                    <div className="flex items-center justify-between pt-4">
                        <div className="flex items-center space-x-2 text-sm text-gray-500">
                            <span className="font-bold">Target:</span>
                            <select className="border-none bg-gray-50 rounded pl-2 pr-6 py-1 text-sm focus:ring-0 cursor-pointer">
                                <option>All Students</option>
                                <option>Final Year CSE</option>
                                <option>Eligible Students</option>
                            </select>
                        </div>
                        <button
                            onClick={handleSend}
                            disabled={!title || !message}
                            className={`px-6 py-2 rounded-lg font-medium text-white shadow-sm transition-all ${!title || !message ? 'bg-gray-300 cursor-not-allowed' : 'bg-teal-600 hover:bg-teal-700'
                                }`}
                        >
                            Send Announcement
                        </button>
                    </div>
                </div>
            </div>

            {/* Recent Announcements */}
            <div className="space-y-6">
                <h2 className="text-xl font-bold text-gray-800">Recent Announcements</h2>
                {announcements.map((announcement) => (
                    <div key={announcement.id} className="bg-white rounded-xl shadow-sm border-l-4 border-teal-500 p-6 animate-fade-in-up">
                        <div className="flex justify-between items-start mb-2">
                            <h3 className="font-bold text-lg text-gray-800">{announcement.title}</h3>
                            <span className="text-xs text-gray-400 bg-gray-100 px-2 py-1 rounded-full">{announcement.date}</span>
                        </div>
                        <p className="text-gray-600 text-sm leading-relaxed">{announcement.message}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Communication;
