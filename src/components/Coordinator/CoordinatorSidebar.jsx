import React from 'react';

const SidebarItem = ({ id, icon, label, isActive, onClick }) => (
    <button
        onClick={() => onClick(id)}
        className={`w-full flex items-center space-x-3 px-6 py-3 transition-colors duration-200 text-left ${isActive
            ? "bg-blue-50 text-blue-600 border-r-4 border-blue-600"
            : "text-gray-500 hover:bg-gray-50 hover:text-gray-900"
            }`}
    >
        <span className="text-xl">{icon}</span>
        <span className="font-semibold">{label}</span>
    </button>
);

const CoordinatorSidebar = ({ activeTab, setActiveTab, onLogout }) => {

    return (
        <aside className="w-full h-full flex flex-col bg-white overflow-hidden">
            <div className="p-6 border-b border-gray-100 flex flex-col">
                <h2 className="text-xl font-black tracking-tighter bg-gradient-to-br from-blue-600 to-indigo-700 bg-clip-text text-transparent leading-none">
                    STUDENT COORDINATOR
                </h2>
                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-1">Management Portal</p>
            </div>

            <nav className="flex-1 py-6 space-y-1 overflow-y-auto scrollbar-thin">
                <SidebarItem id="overview" icon="📊" label="Dashboard" isActive={activeTab === 'overview'} onClick={setActiveTab} />
                <SidebarItem id="students" icon="👨‍🎓" label="Students" isActive={activeTab === 'students'} onClick={setActiveTab} />
                <SidebarItem id="training" icon="🎓" label="Manage Training" isActive={activeTab === 'training'} onClick={setActiveTab} />

                <div className="pt-4 pb-2">
                    <p className="px-6 text-xs font-semibold text-gray-400 uppercase tracking-wider">Student View</p>
                </div>
                <SidebarItem id="student-jobs" icon="💼" label="Job Board" isActive={activeTab === 'student-jobs'} onClick={setActiveTab} />
                <SidebarItem id="student-applications" icon="📝" label="My Applications" isActive={activeTab === 'student-applications'} onClick={setActiveTab} />
                <SidebarItem id="student-interviews" icon="🤝" label="My Interviews" isActive={activeTab === 'student-interviews'} onClick={setActiveTab} />
                <SidebarItem id="student-training" icon="📚" label="My Training" isActive={activeTab === 'student-training'} onClick={setActiveTab} />
            </nav>

            <div className="p-6 border-t border-gray-100 mt-auto pb-8">
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
