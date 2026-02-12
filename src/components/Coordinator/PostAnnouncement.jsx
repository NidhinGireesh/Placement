
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { mockAnnouncements } from './mockData';

const PostAnnouncement = () => {
    const navigate = useNavigate();
    const [announcements, setAnnouncements] = useState(mockAnnouncements);
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        target: 'All Students',
        deadline: ''
    });
    const [showToast, setShowToast] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const newAnnouncement = {
            id: announcements.length + 1,
            title: formData.title,
            message: formData.description,
            date: new Date().toISOString().split('T')[0],
            target: formData.target,
            deadline: formData.deadline
        };

        setAnnouncements([newAnnouncement, ...announcements]);
        setFormData({ title: '', description: '', target: 'All Students', deadline: '' });

        // Show success message
        setShowToast(true);
        setTimeout(() => setShowToast(false), 3000);
    };

    return (
        <div className="max-w-4xl mx-auto space-y-8">
            <div className="flex items-center space-x-4 mb-6">
                <button
                    onClick={() => navigate(-1)}
                    className="p-2 rounded-full hover:bg-gray-100 text-gray-600 transition-colors"
                >
                    ← Back
                </button>
                <h1 className="text-2xl font-bold text-gray-900">Post New Announcement</h1>
            </div>

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

                    <div className="pt-4">
                        <button
                            type="submit"
                            className="w-full md:w-auto px-8 py-3 bg-teal-600 text-white font-semibold rounded-lg hover:bg-teal-700 transition-colors shadow-sm"
                        >
                            Post Announcement
                        </button>
                    </div>
                </form>
            </div>

            {/* Recent Announcements Preview */}
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
                            <div className="flex items-center space-x-4 text-xs text-gray-500 font-medium">
                                <span className="flex items-center"><span className="mr-1">🎯</span> {item.target || 'All Students'}</span>
                                {item.deadline && <span className="flex items-center text-red-500"><span className="mr-1">⏰</span> Deadline: {item.deadline}</span>}
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Toast Notification */}
            {showToast && (
                <div className="fixed bottom-8 right-8 bg-gray-900 text-white px-6 py-3 rounded-lg shadow-lg flex items-center space-x-3 animate-fade-in-up z-50">
                    <span className="text-green-400 text-xl">✓</span>
                    <p className="font-medium">Announcement posted successfully!</p>
                </div>
            )}
        </div>
    );
};

export default PostAnnouncement;
