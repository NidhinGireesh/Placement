import React, { useState, useEffect, useMemo } from 'react';
import { getUsersByRoles, addNotification, getAdminNotifications, deleteNotification } from '../../../services/adminService';
import { getAllApplications, getAllJobs } from '../../../services/jobService';

export default function ReportsDashboard() {
    const [activeTab, setActiveTab] = useState('communication');
    const [students, setStudents] = useState([]);
    const [applications, setApplications] = useState([]);
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDashboardData = async () => {
            setLoading(true);
            try {
                const [studentsRes, appsRes, jobsRes] = await Promise.all([
                    getUsersByRoles(['student', 'coordinator']),
                    getAllApplications(),
                    getAllJobs()
                ]);
                
                if (studentsRes.success) setStudents(studentsRes.data);
                if (appsRes.success) setApplications(appsRes.data);
                if (jobsRes.success) setJobs(jobsRes.data);
            } catch (error) {
                console.error("Error fetching dashboard data:", error);
            }
            setLoading(false);
        };
        fetchDashboardData();
    }, []);

    // Extract unique classes
    const availableClasses = useMemo(() => {
        return ['All Classes', ...new Set(students
            .map(u => u.class)
            .filter(c => c && c.trim() !== '')
        )].sort();
    }, [students]);

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
                {activeTab === 'communication' && (
                    <CommunicationForm availableClasses={availableClasses} />
                )}
                {activeTab === 'stats' && (
                    <StatisticsPanel 
                        loading={loading}
                        students={students}
                        applications={applications}
                        jobs={jobs}
                    />
                )}
            </div>
        </div>
    );
}

function CommunicationForm({ availableClasses }) {
    const [recipient, setRecipient] = useState('All Students');
    const [targetClass, setTargetClass] = useState('All Classes');
    const [subject, setSubject] = useState('');
    const [message, setMessage] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    
    // History state
    const [sentMessages, setSentMessages] = useState([]);
    const [loadingHistory, setLoadingHistory] = useState(true);

    const fetchHistory = async () => {
        setLoadingHistory(true);
        const res = await getAdminNotifications();
        if (res.success) {
            setSentMessages(res.data);
        }
        setLoadingHistory(false);
    };

    useEffect(() => {
        fetchHistory();
    }, []);

    // Show class filter for student-related groups
    const showClassFilter = ['All Students', 'Student Coordinators'].includes(recipient);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        
        const result = await addNotification({
            recipientGroup: recipient,
            targetClass: showClassFilter ? targetClass : null,
            subject,
            message,
            sender: 'admin'
        });

        if (result.success) {
            alert(`Message "${subject}" sent to ${recipient}${showClassFilter && targetClass !== 'All Classes' ? ` (${targetClass})` : ''} successfully!`);
            setSubject('');
            setMessage('');
            setRecipient('All Students');
            setTargetClass('All Classes');
            fetchHistory(); // refresh history
        } else {
            alert('Failed to send message: ' + result.error);
        }
        setIsSubmitting(false);
    };

    const handleDeleteMessage = async (id) => {
        if (!window.confirm('Are you sure you want to delete this message?')) return;
        const result = await deleteNotification(id);
        if (result.success) {
            setSentMessages(prev => prev.filter(msg => msg.id !== id));
        } else {
            alert('Failed to delete message: ' + result.error);
        }
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2">
                    <span>📧</span> Send Official Communication
                </h3>
                <form onSubmit={handleSubmit} className="space-y-5">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Recipient Group</label>
                            <select 
                                value={recipient}
                                onChange={(e) => setRecipient(e.target.value)}
                                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                            >
                                <option value="All Students">All Students</option>
                                <option value="Student Coordinators">Student Coordinators</option>
                                <option value="Recruiters">Recruiters</option>
                            </select>
                        </div>
                        {showClassFilter && (
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Target Class</label>
                                <select 
                                    value={targetClass}
                                    onChange={(e) => setTargetClass(e.target.value)}
                                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                >
                                    {availableClasses.map(cls => (
                                        <option key={cls} value={cls}>{cls}</option>
                                    ))}
                                </select>
                            </div>
                        )}
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Subject</label>
                        <input 
                            type="text" 
                            value={subject}
                            onChange={(e) => setSubject(e.target.value)}
                            placeholder="Important Announcement" 
                            required 
                            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" 
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Message Content</label>
                        <textarea 
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            rows="6" 
                            placeholder="Type your message here..." 
                            required 
                            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none resize-none"
                        ></textarea>
                    </div>
                    <div className="flex justify-end">
                        <button 
                            type="submit" 
                            disabled={isSubmitting}
                            className="bg-blue-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors shadow-sm disabled:opacity-50"
                        >
                            {isSubmitting ? 'Sending...' : 'Send Message'}
                        </button>
                    </div>
                </form>
            </div>

            {/* History Panel */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 flex flex-col h-[550px]">
                <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
                    <span>🕰️</span> Sent Messages
                </h3>
                <div className="flex-1 overflow-y-auto pr-2 space-y-4 styled-scrollbar">
                    {loadingHistory ? (
                        <p className="text-sm text-slate-500 text-center py-4">Loading history...</p>
                    ) : sentMessages.length === 0 ? (
                        <div className="py-12 border-2 border-dashed border-slate-100 rounded-xl flex flex-col items-center justify-center text-center">
                            <span className="text-3xl mb-2">📭</span>
                            <p className="text-sm text-slate-500 font-medium">No messages sent yet.</p>
                        </div>
                    ) : (
                        sentMessages.map(msg => (
                            <div key={msg.id} className="p-4 bg-slate-50 rounded-xl border border-slate-100 transition-all hover:bg-slate-100 hover:border-slate-200 group">
                                <div className="flex justify-between items-start mb-1">
                                    <h4 className="font-bold text-slate-800 text-sm pr-2">{msg.subject}</h4>
                                    <button 
                                        onClick={() => handleDeleteMessage(msg.id)}
                                        className="text-slate-400 opacity-0 group-hover:opacity-100 hover:text-red-500 transition-all p-1 rounded-md hover:bg-red-50 -mt-1 -mr-1"
                                        title="Delete message"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                        </svg>
                                    </button>
                                </div>
                                <div className="flex flex-wrap items-center gap-2 mb-2 text-xs text-slate-500">
                                    <span className="bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full font-bold">
                                        {msg.recipientGroup} {msg.targetClass && msg.targetClass !== 'All Classes' ? `(${msg.targetClass})` : ''}
                                    </span>
                                    <span>{new Date(msg.createdAt).toLocaleDateString()}</span>
                                </div>
                                <p className="text-sm text-slate-600 line-clamp-3 whitespace-pre-wrap">{msg.message}</p>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
}

function StatisticsPanel({ loading, students, applications, jobs }) {
    if (loading) {
        return <div className="py-20 text-center text-slate-500">Loading real-time statistics...</div>;
    }

    // Process Department-wise Placements
    const departmentStats = useMemo(() => {
        const stats = {};
        
        // Count total students per department
        students.forEach(s => {
            const dept = s.department || 'Other';
            if (!stats[dept]) stats[dept] = { total: 0, placed: 0 };
            stats[dept].total++;
        });

        // Find placed students
        const hiredApps = applications.filter(app => app.status === 'Hired');
        const placedStudentIds = new Set(hiredApps.map(app => app.studentId));
        
        students.forEach(s => {
            if (placedStudentIds.has(s.id)) {
                const dept = s.department || 'Other';
                if (stats[dept]) {
                    stats[dept].placed++;
                }
            }
        });

        // Convert to array and calculate percentage
        return Object.entries(stats)
            .map(([dept, data]) => ({
                label: dept,
                percentage: data.total > 0 ? Math.round((data.placed / data.total) * 100) : 0,
                total: data.total,
                placed: data.placed
            }))
            .filter(d => d.total > 0)
            .sort((a, b) => b.percentage - a.percentage); // Sort by highest percentage
    }, [students, applications]);

    const colors = ["bg-blue-500", "bg-emerald-500", "bg-amber-500", "bg-purple-500", "bg-rose-500"];

    // Process Company-wise Offers
    const companyStats = useMemo(() => {
        // Create job map for quick lookup
        const jobMap = {};
        jobs.forEach(job => jobMap[job.id] = job);

        const hiredApps = applications.filter(app => app.status === 'Hired');
        const companyCounts = {};

        hiredApps.forEach(app => {
            const job = jobMap[app.jobId];
            if (job) {
                const comp = job.company || 'Unknown Company';
                companyCounts[comp] = (companyCounts[comp] || 0) + 1;
            }
        });

        return Object.entries(companyCounts)
            .map(([name, offers]) => ({ name, offers, logo: '🏢' }))
            .sort((a, b) => b.offers - a.offers)
            .slice(0, 5); // Top 5
    }, [applications, jobs]);

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                <h3 className="text-lg font-bold text-slate-800 mb-6">Branch-wise Placements</h3>
                {departmentStats.length === 0 ? (
                    <p className="text-slate-500 text-center py-6">No placement data available yet.</p>
                ) : (
                    <div className="space-y-4">
                        {departmentStats.map((stat, idx) => (
                            <StatRow 
                                key={stat.label} 
                                label={stat.label} 
                                percentage={stat.percentage} 
                                color={colors[idx % colors.length]} 
                                detailText={`${stat.placed}/${stat.total} Placed`}
                            />
                        ))}
                    </div>
                )}
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                <h3 className="text-lg font-bold text-slate-800 mb-6">Top Company-wise Offers</h3>
                {companyStats.length === 0 ? (
                    <p className="text-slate-500 text-center py-6">No hired applications found.</p>
                ) : (
                    <ul className="space-y-4">
                        {companyStats.map(comp => (
                            <CompanyRow key={comp.name} name={comp.name} offers={comp.offers} logo={comp.logo} />
                        ))}
                    </ul>
                )}
            </div>
        </div>
    );
}

function StatRow({ label, percentage, color, detailText }) {
    return (
        <div className="flex flex-col gap-1">
            <div className="flex justify-between text-xs font-semibold text-slate-500">
                <span>{label}</span>
                <span>{detailText}</span>
            </div>
            <div className="flex items-center gap-4">
                <div className="flex-1 bg-slate-100 h-2.5 rounded-full overflow-hidden">
                    <div className={`h-full rounded-full transition-all duration-1000 ${color}`} style={{ width: `${percentage}%` }}></div>
                </div>
                <span className="w-10 text-right text-sm font-semibold text-slate-700">{percentage}%</span>
            </div>
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