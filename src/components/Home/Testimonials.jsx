import React, { useState, useEffect } from 'react';

const testimonials = [
    {
        id: 1,
        name: 'Rahul Verma',
        role: 'Placed at Google (2025)',
        content: 'The placement portal made applying to companies so simple. I could track my application status in real-time!',
        image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Rahul'
    },
    {
        id: 2,
        name: 'Priya Singh',
        role: 'HR Manager, Infosys',
        content: 'Shortlisting candidates became faster and efficient. The automated filtering saved us hours of work.',
        image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Priya'
    },
    {
        id: 3,
        name: 'Amit Patel',
        role: 'Placed at Amazon (2025)',
        content: 'The mock tests and interview scheduling features were a game changer for my preparation.',
        image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Amit'
    }
];

export default function Testimonials() {
    const [current, setCurrent] = useState(0);

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrent((prev) => (prev + 1) % testimonials.length);
        }, 5000);
        return () => clearInterval(timer);
    }, []);

    return (
        <section className="py-16 bg-gradient-to-br from-indigo-50 to-blue-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <h2 className="text-3xl font-bold text-center mb-12 text-gray-800">Success Stories</h2>

                <div className="max-w-4xl mx-auto">
                    <div className="bg-white p-8 md:p-12 rounded-3xl shadow-xl relative overflow-hidden text-center transition-all duration-500">
                        <div className="text-6xl text-blue-100 absolute top-4 left-6 font-serif">“</div>

                        <div className="relative z-10">
                            <p className="text-xl md:text-2xl text-gray-700 italic mb-8 leading-relaxed">
                                "{testimonials[current].content}"
                            </p>

                            <div className="flex flex-col items-center">
                                <img
                                    src={testimonials[current].image}
                                    alt={testimonials[current].name}
                                    className="w-16 h-16 rounded-full border-4 border-blue-100 mb-3"
                                />
                                <h4 className="font-bold text-lg text-gray-900">{testimonials[current].name}</h4>
                                <p className="text-blue-600 text-sm font-medium">{testimonials[current].role}</p>
                            </div>
                        </div>

                        {/* Dots */}
                        <div className="flex justify-center space-x-2 mt-8">
                            {testimonials.map((_, index) => (
                                <button
                                    key={index}
                                    onClick={() => setCurrent(index)}
                                    className={`w-3 h-3 rounded-full transition-all duration-300 ${current === index ? 'bg-blue-600 w-6' : 'bg-gray-300'
                                        }`}
                                />
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
