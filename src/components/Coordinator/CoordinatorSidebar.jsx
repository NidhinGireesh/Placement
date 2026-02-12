
import { Link, useLocation } from 'react-router-dom';

const CoordinatorSidebar = ({ onLogout }) => {
    const location = useLocation();
    const isActive = (path) => location.pathname === path;

    const SidebarItem = ({ to, icon, label }) => (
        <Link
            to={to}
            className={`flex items-center space-x-3 px-6 py-3 transition-colors duration-200 ${isActive(to)
                ? "bg-teal-50 text-teal-600 border-r-4 border-teal-600"
                : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                }`}
        >
            <span className="text-xl">{icon}</span>
            <span className="font-semibold">{label}</span>
        </Link>
    );

    return (
        <aside className="w-64 bg-white border-r border-gray-200 h-screen flex flex-col fixed left-0 top-0 overflow-y-auto z-10">
            <div className="p-6 border-b border-gray-100">
                <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-teal-600 to-emerald-500">
                    Coordinator
                </h2>
                <p className="text-xs text-gray-400 mt-1">Management Console</p>
            </div>

            <nav className="flex-1 py-6 space-y-1">
                <SidebarItem to="/coordinator" icon="📊" label="Overview" />
                <SidebarItem to="/coordinator/verification" icon="✅" label="Verification" />
                {/* Job Monitoring removed */}
                {/* Application Tracking removed */}
                <SidebarItem to="/coordinator/schedule-interview" icon="🗓️" label="Schedule Interview" />
                <SidebarItem to="/coordinator/communication" icon="📢" label="Communication" />
                <SidebarItem to="/coordinator/training" icon="🎓" label="Training" />
            </nav>

            <div className="p-6 border-t border-gray-100">
                <button
                    onClick={onLogout}
                    className="flex items-center space-x-3 text-red-500 hover:text-red-700 font-semibold w-full transition-colors"
                >
                    <span className="text-xl">🚪</span>
                    <span>Logout</span>
                </button>
            </div>
        </aside>
    );
};

export default CoordinatorSidebar;
