import React from 'react';

export default function NoticeBoard() {


    return (
        <section className="py-16 bg-blue-50">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                <h2 className="text-3xl font-bold text-center mb-8 text-gray-800">Use <span className="text-blue-600">Notice Board</span></h2>

                <div className="bg-white rounded-2xl shadow-lg border border-blue-100 overflow-hidden h-80 relative">
                    <div className="p-4 bg-blue-600 text-white font-bold flex justify-between items-center z-10 relative">
                        <span>Latest Updates</span>
                        <span className="text-xs bg-blue-700 px-2 py-1 rounded">Live</span>
                    </div>
                    <div className="h-[calc(100%-60px)] flex flex-col items-center justify-center p-8 text-center bg-gray-50/50">
                        <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mb-4 rotate-12 shadow-sm">
                            <span className="text-3xl text-blue-600">🔔</span>
                        </div>
                        <h3 className="text-xl font-bold text-gray-800 mb-2">Upcoming Announcements</h3>
                        <p className="text-gray-500 max-w-sm">
                            Stay tuned! We'll announce placement drives, workshop schedules, and other important updates right here.
                        </p>
                        
                        <div className="mt-6 flex space-x-1">
                            <span className="w-2 h-2 bg-blue-400 rounded-full animate-bounce"></span>
                            <span className="w-2 h-2 bg-blue-400 rounded-full animate-bounce [animation-delay:0.2s]"></span>
                            <span className="w-2 h-2 bg-blue-400 rounded-full animate-bounce [animation-delay:0.4s]"></span>
                        </div>
                    </div>
                </div>
            </div>

        </section>
    );
}
