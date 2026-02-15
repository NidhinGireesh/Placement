export default function InterviewSchedule() {
    // Mock Data
    const interviews = [
        {
            id: 201,
            company: 'InnovateTech',
            role: 'Frontend Developer',
            round: 'Technical Round 1',
            date: '2026-02-16',
            time: '14:00 PM',
            type: 'Video Call',
            link: 'https://meet.google.com/abc-defg-hij',
            status: 'Scheduled'
        }
    ];

    return (
        <div>
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Upcoming Interviews</h2>

            <div className="space-y-4">
                {interviews.map(interview => (
                    <div key={interview.id} className="bg-white p-6 rounded-xl shadow-md border-l-4 border-blue-500 flex justify-between items-center">
                        <div>
                            <div className="flex items-center gap-3 mb-1">
                                <h3 className="text-lg font-bold text-gray-900">{interview.company}</h3>
                                <span className="bg-blue-100 text-blue-700 text-xs px-2 py-0.5 rounded-full font-medium">
                                    {interview.round}
                                </span>
                            </div>
                            <p className="text-gray-600 mb-2">{interview.role}</p>
                            <div className="flex gap-4 text-sm text-gray-500">
                                <span className="flex items-center gap-1">
                                    📅 {interview.date}
                                </span>
                                <span className="flex items-center gap-1">
                                    ⏰ {interview.time}
                                </span>
                                <span className="flex items-center gap-1">
                                    🎥 {interview.type}
                                </span>
                            </div>
                        </div>

                        <div>
                            <a
                                href={interview.link}
                                target="_blank"
                                rel="noreferrer"
                                className="btn btn-primary flex items-center gap-2"
                            >
                                Join Meeting
                            </a>
                        </div>
                    </div>
                ))}

                {interviews.length === 0 && (
                    <div className="bg-white p-10 rounded-xl shadow-sm text-center">
                        <div className="text-4xl mb-4">🎉</div>
                        <h3 className="text-lg font-medium text-gray-900">No interviews scheduled</h3>
                        <p className="text-gray-500">Relax and prepare for your next opportunity.</p>
                    </div>
                )}
            </div>
        </div>
    );
}
