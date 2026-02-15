import { useState } from 'react';

export default function PollWidget() {
    const [voted, setVoted] = useState(false);
    const [votes, setVotes] = useState({ aptitude: 45, coding: 30, hr: 25 }); // Percentages

    const handleVote = (option) => {
        if (voted) return;
        setVoted(true);
        // Logic to increment vote would go here. For demo, we just show stats.
    };

    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
            <h3 className="font-bold text-gray-800 mb-4 flex items-center">
                <span className="mr-2">📊</span> Poll of the Week
            </h3>
            <p className="text-sm text-gray-600 mb-4 font-medium">Which interview round do you find hardest?</p>

            <div className="space-y-3">
                {!voted ? (
                    <>
                        <button onClick={() => handleVote('aptitude')} className="w-full text-left px-4 py-2 border rounded-lg hover:bg-gray-50 transition-colors text-sm">🧠 Aptitude Round</button>
                        <button onClick={() => handleVote('coding')} className="w-full text-left px-4 py-2 border rounded-lg hover:bg-gray-50 transition-colors text-sm">💻 Coding Round</button>
                        <button onClick={() => handleVote('hr')} className="w-full text-left px-4 py-2 border rounded-lg hover:bg-gray-50 transition-colors text-sm">👔 HR Round</button>
                    </>
                ) : (
                    <div className="space-y-3">
                        <div>
                            <div className="flex justify-between text-xs mb-1"><span>Aptitude</span><span>{votes.aptitude}%</span></div>
                            <div className="w-full bg-gray-100 rounded-full h-2"><div className="bg-blue-500 h-2 rounded-full" style={{ width: `${votes.aptitude}%` }}></div></div>
                        </div>
                        <div>
                            <div className="flex justify-between text-xs mb-1"><span>Coding</span><span>{votes.coding}%</span></div>
                            <div className="w-full bg-gray-100 rounded-full h-2"><div className="bg-purple-500 h-2 rounded-full" style={{ width: `${votes.coding}%` }}></div></div>
                        </div>
                        <div>
                            <div className="flex justify-between text-xs mb-1"><span>HR</span><span>{votes.hr}%</span></div>
                            <div className="w-full bg-gray-100 rounded-full h-2"><div className="bg-green-500 h-2 rounded-full" style={{ width: `${votes.hr}%` }}></div></div>
                        </div>
                        <p className="text-xs text-center text-gray-400 mt-2">Thanks for voting!</p>
                    </div>
                )}
            </div>
        </div>
    );
}
