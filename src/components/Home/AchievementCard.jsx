import { useState, useEffect } from 'react';

const achievers = [
    { name: "Anjali Singh", company: "Wipro", package: "6.5 LPA", image: "👩‍💼" },
    { name: "Rahul Verma", company: "TCS Digital", package: "7.0 LPA", image: "👨‍💼" },
    { name: "Priya Sharma", company: "Accenture", package: "4.5 LPA", image: "👩‍💻" }
];

export default function AchievementCard() {
    const [achiever, setAchiever] = useState(achievers[0]);

    useEffect(() => {
        // Randomly pick one on mount
        const random = achievers[Math.floor(Math.random() * achievers.length)];
        setAchiever(random);
    }, []);

    return (
        <div className="bg-gradient-to-br from-indigo-900 to-purple-900 rounded-xl p-6 text-white shadow-lg relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-20">
                <span className="text-6xl">🏆</span>
            </div>

            <div className="relative z-10">
                <h3 className="text-xs font-bold uppercase tracking-widest text-yellow-400 mb-4">Student Achievement</h3>

                <div className="flex items-center space-x-4">
                    <div className="h-14 w-14 bg-white/20 rounded-full flex items-center justify-center text-3xl border-2 border-white/50 backdrop-blur-sm">
                        {achiever.image}
                    </div>
                    <div>
                        <h4 className="font-bold text-lg">{achiever.name}</h4>
                        <p className="text-indigo-200 text-sm">Placed at <span className="text-white font-semibold">{achiever.company}</span></p>
                        <div className="mt-1 inline-block bg-white/20 px-2 py-0.5 rounded text-xs font-bold text-yellow-300">
                            {achiever.package}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
