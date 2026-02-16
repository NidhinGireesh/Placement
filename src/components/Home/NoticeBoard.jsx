import React from 'react';

export default function NoticeBoard() {
    const notices = [
        { id: 1, text: 'TCS Digital Drive Registration ends on Feb 20th.', tag: 'New', date: 'Feb 16, 2026' },
        { id: 2, text: 'Infosys Power Programmer Interview Schedule Released.', tag: 'Interview', date: 'Feb 15, 2026' },
        { id: 3, text: 'Pre-placement talk by Zoho Corporation starts at 10 AM tomorrow.', tag: 'Event', date: 'Feb 14, 2026' },
        { id: 4, text: 'Wipro Velvet Certification results are out.', tag: 'Results', date: 'Feb 12, 2026' },
        { id: 5, text: 'Mock Interview session for CSE students on Friday.', tag: 'Training', date: 'Feb 10, 2026' },
    ];

    return (
        <section className="py-16 bg-blue-50">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                <h2 className="text-3xl font-bold text-center mb-8 text-gray-800">Use <span className="text-blue-600">Notice Board</span></h2>

                <div className="bg-white rounded-2xl shadow-lg border border-blue-100 overflow-hidden h-80 relative">
                    <div className="p-4 bg-blue-600 text-white font-bold flex justify-between items-center z-10 relative">
                        <span>Latest Updates</span>
                        <span className="text-xs bg-blue-700 px-2 py-1 rounded">Live</span>
                    </div>
                    <div className="overflow-hidden h-[calc(100%-60px)] relative">
                        <div className="animate-vertical-scroll absolute w-full">
                            {[...notices, ...notices].map((notice, index) => (
                                <div key={`${notice.id}-${index}`} className="p-4 border-b border-gray-100 hover:bg-blue-50 transition-colors">
                                    <div className="flex justify-between items-start mb-1">
                                        <span className={`text-xs font-bold px-2 py-1 rounded ${notice.tag === 'New' ? 'bg-red-100 text-red-600' :
                                                notice.tag === 'Interview' ? 'bg-purple-100 text-purple-600' :
                                                    'bg-gray-100 text-gray-600'
                                            }`}>{notice.tag}</span>
                                        <span className="text-xs text-gray-400">{notice.date}</span>
                                    </div>
                                    <p className="text-gray-700 font-medium">{notice.text}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
            <style jsx>{`
        @keyframes vertical-scroll {
            0% { transform: translateY(0); }
            100% { transform: translateY(-50%); }
        }
        .animate-vertical-scroll {
            animation: vertical-scroll 20s linear infinite;
        }
        .animate-vertical-scroll:hover {
            animation-play-state: paused;
        }
      `}</style>
        </section>
    );
}
