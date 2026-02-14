import React, { useState } from 'react';

export default function ReportsDashboard() {
    const [activeTab, setActiveTab] = useState('communication');

    return (
        <div>
            <div className="mb-6">
                <h1 className="text-3xl font-bold text-slate-800">Communication & Reports</h1>
                <p className="text-slate-500">View analytics and send official communications.</p>
            </div>

            <div className="flex gap-2 mb-6 border-b border-slate-200">
                <button
                    onClick={() => setActiveTab('communication')}
                    className={`px-4 py-2 font-medium text-sm transition-colors border-b-2 ${activeTab === 'communication'
                            ? 'border-blue-600 text-blue-600'
                            : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
                        }`}
                >
                    Communication
                </button>
                <button
                    onClick={() => setActiveTab('results')}
                    className={`px-4 py-2 font-medium text-sm transition-colors border-b-2 ${activeTab === 'results'
                            ? 'border-blue-600 text-blue-600'
                            : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
                        }`}
                >
                    Publish Results
                </button>
                <button
                    onClick={() => setActiveTab('stats')}
                    className={`px-4 py-2 font-medium text-sm transition-colors border-b-2 ${activeTab === 'stats'
                            ? 'border-blue-600 text-blue-600'
                            : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
                        }`}
                >
                    Statistics
                </button>
            </div>

            <div className="animate-fadeIn">
                {activeTab === 'communication' && <CommunicationForm />}
                {activeTab === 'results' && <ResultsPanel />}
                {activeTab === 'stats' && <StatisticsPanel />}
            </div>
        </div>
    );
}

function CommunicationForm() {
    const handleSubmit = (e) => {
        e.preventDefault();
        alert(`Message Sent to ${e.target.recipient.value}!`);
        e.target.reset();
    };

    return (
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 max-w-3xl">
            <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2">
                <span>📧</span> Send Official Communication
            </h3>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Recipient Group</label>
                    <select name="recipient" className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none">
                        <option value="All Students">All Students</option>
                        <option value="Placed Students">Placed Students</option>
                        <option value="Unplaced Students">Unplaced Students</option>
                        <option value="Student Coordinators">Student Coordinators</option>
                        <option value="Recruiters">Recruiters</option>
                    </select>
                </div>
                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Subject</label>
                    <input name="subject" type="text" placeholder="Important Announcement" required className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
                </div>
                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Message Content</label>
                    <textarea name="message" rows="6" placeholder="Type your message here..." required className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none resize-none"></textarea>
                </div>
                <div className="flex justify-end">
                    <button type="submit" className="bg-blue-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors shadow-sm">
                        Send Message
                    </button>
                </div>
            </form>
        </div>
    );
}

function ResultsPanel() {
    const [results] = useState([
        { id: 1, title: 'TCS Final Selects 2025', date: '2025-10-15', status: 'Published' },
        { id: 2, title: 'Infosys Shortlist', date: '2025-10-20', status: 'Published' },
    ]);

    return (
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 max-w-3xl">
            <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-bold text-slate-800">Published Results</h3>
                <button className="bg-white border border-slate-300 text-slate-700 px-4 py-2 rounded-lg text-sm font-medium hover:bg-slate-50 transition-colors">
                    + Upload New Result
                </button>
            </div>

            <ul className="divide-y divide-slate-100">
                {results.map((r) => (
                    <li key={r.id} className="py-4 flex justify-between items-center hover:bg-slate-50 px-2 rounded-lg transition-colors">
                        <div>
                            <p className="font-semibold text-slate-800">{r.title}</p>
                            <p className="text-sm text-slate-500">{r.date}</p>
                        </div>
                        <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-xs font-medium border border-green-200">
                            {r.status}
                        </span>
                    </li>
                ))}
            </ul>
        </div>
    );
}

function StatisticsPanel() {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                <h3 className="text-lg font-bold text-slate-800 mb-6">Branch-wise Placements</h3>
                <div className="space-y-4">
                    <StatRow label="CSE" percentage={85} color="bg-blue-500" />
                    <StatRow label="ECE" percentage={70} color="bg-emerald-500" />
                    <StatRow label="MECH" percentage={60} color="bg-amber-500" />
                    <StatRow label="EEE" percentage={65} color="bg-purple-500" />
                </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                <h3 className="text-lg font-bold text-slate-800 mb-6">Company-wise Offers</h3>
                <ul className="space-y-4">
                    <CompanyRow name="TCS" offers={45} logo="🏢" />
                    <CompanyRow name="Infosys" offers={32} logo="🏢" />
                    <CompanyRow name="Wipro" offers={28} logo="🏢" />
                    <CompanyRow name="Accenture" offers={40} logo="🏢" />
                </ul>
            </div>
        </div>
    );
}

function StatRow({ label, percentage, color }) {
    return (
        <div className="flex items-center gap-4">
            <span className="w-12 font-medium text-slate-600">{label}</span>
            <div className="flex-1 bg-slate-100 h-2.5 rounded-full overflow-hidden">
                <div className={`h-full rounded-full ${color}`} style={{ width: `${percentage}%` }}></div>
            </div>
            <span className="w-10 text-right text-sm font-semibold text-slate-700">{percentage}%</span>
        </div>
    );
}

function CompanyRow({ name, offers, logo }) {
    return (
        <li className="flex justify-between items-center p-3 bg-slate-50 rounded-lg">
            <div className="flex items-center gap-3">
                <span className="text-xl">{logo}</span>
                <span className="font-medium text-slate-700">{name}</span>
            </div>
            <span className="font-bold text-slate-800">{offers} Offers</span>
        </li>
    );
}