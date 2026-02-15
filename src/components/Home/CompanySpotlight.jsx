export default function CompanySpotlight() {
    // Mock daily company
    const company = {
        name: "TechNova Systems",
        logo: "https://via.placeholder.com/50", // Replace with real logo if available
        role: "Junior React Developer",
        package: "6.5 LPA",
        eligibility: "B.Tech (CS/IT), 60%+",
        tip: "Focus on React Hooks and Context API for the technical round."
    };

    return (
        <div className="bg-white rounded-xl shadow-md border border-gray-100 p-6 hover:shadow-lg transition-shadow">
            <div className="flex justify-between items-start mb-4">
                <div>
                    <span className="text-xs font-bold text-indigo-600 bg-indigo-50 px-2 py-1 rounded mb-2 inline-block">
                        Today’s Spotlight 🏢
                    </span>
                    <h3 className="text-xl font-bold text-gray-800 mt-1">{company.name}</h3>
                </div>
                <div className="h-12 w-12 bg-gray-100 rounded-lg flex items-center justify-center font-bold text-gray-400">
                    Logo
                </div>
            </div>

            <div className="space-y-3">
                <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Role:</span>
                    <span className="font-medium text-gray-800">{company.role}</span>
                </div>
                <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Package:</span>
                    <span className="font-bold text-green-600">{company.package}</span>
                </div>
                <hr className="border-gray-100 my-2" />
                <div>
                    <p className="text-xs text-gray-500 font-semibold uppercase mb-1">Interview Tip 💡</p>
                    <p className="text-sm text-gray-700 italic bg-yellow-50 p-2 rounded border-l-4 border-yellow-400">
                        "{company.tip}"
                    </p>
                </div>
            </div>
        </div>
    );
}
