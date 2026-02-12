import { useNavigate } from 'react-router-dom';
import { mockStudents } from './mockData';

const DashboardOverview = () => {
    const navigate = useNavigate();
    const pendingApprovals = mockStudents.filter(s => s.status === 'Pending').length;
    const eligibleStudents = mockStudents.filter(s => s.cgpa >= 7.0 && s.backlogs === 0).length;
    const placedStudents = 0; // Placeholder

    const StatCard = ({ title, value, icon, color, subtext }) => (
        <div className={`bg-white rounded-xl shadow-sm p-6 border-b-4 ${color}`}>
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-gray-500 font-medium">{title}</h3>
                <span className={`text-2xl p-2 rounded-lg ${color.replace('border-', 'bg-').replace('500', '100').replace('600', '100')} ${color.replace('border-', 'text-')}`}>
                    {icon}
                </span>
            </div>
            <p className="text-4xl font-bold text-gray-800">{value}</p>
            <p className={`text-sm mt-2 font-medium ${color.replace('border-', 'text-')}`}>
                {subtext}
            </p>
        </div>
    );

    return (
        <div>
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Dashboard Overview</h2>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <StatCard
                    title="Pending Approvals"
                    value={pendingApprovals}
                    icon="⚠️"
                    color="border-yellow-500"
                    subtext="Action Required"
                />
                <StatCard
                    title="Eligible Students"
                    value={eligibleStudents}
                    icon="👥"
                    color="border-teal-500"
                    subtext="+0 this week"
                />
                <StatCard
                    title="Placed Students"
                    value={placedStudents}
                    icon="🎓"
                    color="border-blue-500"
                    subtext="0% Placement Rate"
                />
            </div>

            {/* Recent Activity / Quick Actions could go here */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white rounded-xl shadow-sm p-6">
                    <h3 className="text-lg font-bold text-gray-800 mb-4">Quick Actions</h3>
                    <div className="grid grid-cols-2 gap-4">
                        <button
                            onClick={() => navigate('/coordinator/post-announcement')}
                            className="flex flex-col items-center justify-center p-4 border-2 border-dashed border-gray-300 rounded-xl hover:border-teal-500 hover:bg-teal-50 hover:text-teal-700 transition-all text-gray-600 font-medium"
                        >
                            <span className="text-2xl mb-2">📢</span>
                            Post Announcement
                        </button>
                        {/* Schedule Interview button removed from Quick Actions */}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DashboardOverview;
