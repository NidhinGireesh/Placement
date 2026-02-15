export default function QuickResources() {
    const resources = [
        { title: "Resume Format", icon: "📄", color: "bg-blue-100 text-blue-600" },
        { title: "Syllabus", icon: "📚", color: "bg-purple-100 text-purple-600" },
        { title: "Prev. Papers", icon: "📝", color: "bg-orange-100 text-orange-600" },
        { title: "Roadmap", icon: "🗺️", color: "bg-green-100 text-green-600" }
    ];

    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
            <h3 className="font-bold text-gray-800 mb-4 flex items-center">
                <span className="mr-2">📚</span> Quick Resources
            </h3>
            <div className="grid grid-cols-2 gap-4">
                {resources.map((res, idx) => (
                    <button key={idx} className="flex flex-col items-center justify-center p-3 rounded-xl hover:bg-gray-50 transition-colors border border-transparent hover:border-gray-100">
                        <div className={`h-10 w-10 ${res.color} rounded-full flex items-center justify-center text-xl mb-2`}>
                            {res.icon}
                        </div>
                        <span className="text-xs font-semibold text-gray-700">{res.title}</span>
                    </button>
                ))}
            </div>
        </div>
    );
}
