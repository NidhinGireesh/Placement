export default function UpcomingDrives() {
    const drives = [
        { company: "Infosys", daysLeft: 2, color: "text-red-500" },
        { company: "TCS Digital", daysLeft: 5, color: "text-orange-500" },
        { company: "UST Global", daysLeft: 1, color: "text-red-600 fw-bold" } // 1 day is urgent
    ];

    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
            <h3 className="font-bold text-gray-800 mb-4 flex items-center">
                <span className="mr-2">⏰</span> Upcoming Drives
            </h3>
            <div className="space-y-4">
                {drives.map((drive, index) => (
                    <div key={index} className="flex justify-between items-center pb-3 border-b border-gray-50 last:border-0 last:pb-0">
                        <span className="font-medium text-gray-700">{drive.company}</span>
                        <span className={`text-sm font-bold ${drive.daysLeft <= 2 ? 'text-red-500' : 'text-orange-500'}`}>
                            {drive.daysLeft === 1 ? 'Tomorrow!' : `${drive.daysLeft} days left`}
                        </span>
                    </div>
                ))}
            </div>
        </div>
    );
}
