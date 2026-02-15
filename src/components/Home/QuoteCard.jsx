import { useState } from 'react';

const quotes = [
    "Consistency beats talent in placements.",
    "Your portfolio is your new resume.",
    "Don't practice until you get it right. Practice until you can't get it wrong.",
    "The expert in anything was once a beginner.",
    "Opportunities don't happen, you create them."
];

export default function QuoteCard() {
    const [index, setIndex] = useState(0);

    const handleRefresh = () => {
        let newIndex;
        do {
            newIndex = Math.floor(Math.random() * quotes.length);
        } while (newIndex === index);
        setIndex(newIndex);
    };

    return (
        <div className="bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl p-6 text-white shadow-lg relative overflow-hidden">
            <div className="absolute top-0 right-0 opacity-10 transform translate-x-4 -translate-y-4">
                <span className="text-9xl font-serif">"</span>
            </div>

            <div className="relative z-10">
                <h3 className="text-xs font-bold uppercase tracking-widest opacity-80 mb-2">Quote of the Day 🎓</h3>
                <p className="text-xl md:text-2xl font-medium leading-relaxed mb-4 font-serif">
                    “{quotes[index]}”
                </p>

                <button
                    onClick={handleRefresh}
                    className="flex items-center text-xs font-bold bg-white/20 hover:bg-white/30 px-3 py-1 rounded-full transition-colors"
                >
                    <span className="mr-2 text-sm">🔄</span> Another One
                </button>
            </div>
        </div>
    );
}
