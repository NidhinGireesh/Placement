import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function HeroSection({ user }) {
    const navigate = useNavigate();

    return (
        <section className="relative bg-gradient-to-br from-indigo-900 to-blue-800 text-white py-20 overflow-hidden">
            {/* Background Elements */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden opacity-20">
                <div className="absolute -top-24 -left-24 w-96 h-96 rounded-full bg-blue-500 blur-3xl"></div>
                <div className="absolute top-1/2 right-0 w-64 h-64 rounded-full bg-purple-500 blur-3xl"></div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
                <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-6 animate-fade-in-up">
                    Your Campus <span className="text-blue-300">→</span> Your Career <span className="text-blue-300">→</span> One Platform
                </h1>
                <p className="text-xl md:text-2xl text-blue-100 mb-10 max-w-3xl mx-auto">
                    Manage placements, applications, and hiring — all in one place.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto mb-12">
                    <div className="glass-panel bg-white/10 p-6 rounded-xl border border-white/20 hover:scale-105 transition-transform duration-300">
                        <div className="text-3xl mb-2">🎓</div>
                        <h3 className="text-xl font-bold mb-1">For Students</h3>
                        <p className="text-sm text-blue-100">Apply to drives & track status</p>
                    </div>
                    <div className="glass-panel bg-white/10 p-6 rounded-xl border border-white/20 hover:scale-105 transition-transform duration-300">
                        <div className="text-3xl mb-2">🏢</div>
                        <h3 className="text-xl font-bold mb-1">For Recruiters</h3>
                        <p className="text-sm text-blue-100">Post jobs & hire talent</p>
                    </div>
                    <div className="glass-panel bg-white/10 p-6 rounded-xl border border-white/20 hover:scale-105 transition-transform duration-300">
                        <div className="text-3xl mb-2">👨‍💼</div>
                        <h3 className="text-xl font-bold mb-1">For Placement Cell</h3>
                        <p className="text-sm text-blue-100">Manage entire workflow</p>
                    </div>
                </div>

                <div className="flex flex-col sm:flex-row justify-center gap-4">
                    {!user ? (
                        <>
                            <button
                                onClick={() => navigate('/login')}
                                className="bg-white text-indigo-900 px-8 py-3 rounded-full font-bold text-lg shadow-lg hover:bg-blue-50 transition-all transform hover:-translate-y-1"
                            >
                                Student Login
                            </button>
                            <button
                                onClick={() => navigate('/register')}
                                className="bg-blue-600 border border-blue-500 text-white px-8 py-3 rounded-full font-bold text-lg shadow-lg hover:bg-blue-700 transition-all transform hover:-translate-y-1"
                            >
                                Recruiter Register
                            </button>
                        </>
                    ) : (
                        <button
                            onClick={() => navigate(user.role === 'coordinator' ? '/coordinator' : '/student')}
                            className="bg-white text-indigo-900 px-8 py-3 rounded-full font-bold text-lg shadow-lg hover:bg-blue-50 transition-all transform hover:-translate-y-1"
                        >
                            Go to Dashboard
                        </button>
                    )}
                    <button
                        onClick={() => document.getElementById('placement-stats').scrollIntoView({ behavior: 'smooth' })}
                        className="glass-panel bg-white/10 text-white px-8 py-3 rounded-full font-bold text-lg border border-white/30 hover:bg-white/20 transition-all"
                    >
                        View Placement Stats
                    </button>
                </div>
            </div>
        </section>
    );
}
