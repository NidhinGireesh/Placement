import React, { useEffect, useState } from 'react';

const Counter = ({ end, suffix = '', duration = 2000 }) => {
    const [count, setCount] = useState(0);

    useEffect(() => {
        let startTime;
        let animationFrame;

        const animate = (timestamp) => {
            if (!startTime) startTime = timestamp;
            const progress = timestamp - startTime;
            const progressRatio = Math.min(progress / duration, 1);

            setCount(Math.floor(progressRatio * end));

            if (progress < duration) {
                animationFrame = requestAnimationFrame(animate);
            }
        };

        animationFrame = requestAnimationFrame(animate);
        return () => cancelAnimationFrame(animationFrame);
    }, [end, duration]);

    return <span>{count}{suffix}</span>;
};

export default function PlacementStats() {
    return (
        <section id="placement-stats" className="py-16 bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <h2 className="text-3xl font-bold text-center mb-12 text-gray-800">
                    Placement Highlights <span className="text-blue-600">2025-26</span>
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    <div className="p-6 bg-blue-50 rounded-2xl text-center hover:shadow-xl transition-shadow border border-blue-100">
                        <div className="text-4xl font-extrabold text-blue-600 mb-2">
                            <Counter end={850} suffix="+" />
                        </div>
                        <div className="text-gray-600 font-medium">Students Placed This Year</div>
                    </div>

                    <div className="p-6 bg-indigo-50 rounded-2xl text-center hover:shadow-xl transition-shadow border border-indigo-100">
                        <div className="text-4xl font-extrabold text-indigo-600 mb-2">
                            <Counter end={120} suffix="+" />
                        </div>
                        <div className="text-gray-600 font-medium">Companies Visited</div>
                    </div>

                    <div className="p-6 bg-purple-50 rounded-2xl text-center hover:shadow-xl transition-shadow border border-purple-100">
                        <div className="text-4xl font-extrabold text-purple-600 mb-2">
                            ₹<Counter end={45} suffix=" LPA" />
                        </div>
                        <div className="text-gray-600 font-medium">Highest Package</div>
                    </div>

                    <div className="p-6 bg-teal-50 rounded-2xl text-center hover:shadow-xl transition-shadow border border-teal-100">
                        <div className="text-4xl font-extrabold text-teal-600 mb-2">
                            ₹<Counter end={8} suffix=" LPA" />
                        </div>
                        <div className="text-gray-600 font-medium">Average Package</div>
                    </div>
                </div>
            </div>
        </section>
    );
}
