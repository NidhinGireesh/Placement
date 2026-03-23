import React from 'react';

export default function Testimonials() {
    return (
        <section className="py-16 bg-gradient-to-br from-indigo-50 to-blue-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <h2 className="text-3xl font-bold text-center mb-12 text-gray-800 uppercase tracking-wider">Success Stories</h2>

                <div className="max-w-4xl mx-auto">
                    <div className="bg-white/70 backdrop-blur-md p-12 md:p-16 rounded-[2rem] border border-white/50 shadow-2xl relative overflow-hidden text-center transition-all duration-700 hover:shadow-indigo-500/10">
                        {/* Decorative background elements */}
                        <div className="absolute -top-10 -right-10 w-40 h-40 bg-indigo-100 rounded-full blur-3xl opacity-50"></div>
                        <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-blue-100 rounded-full blur-3xl opacity-50"></div>
                        
                        <div className="text-6xl text-indigo-400/20 absolute top-4 left-6 font-serif">“</div>
                        
                        <div className="relative z-10 flex flex-col items-center">
                            <div className="w-20 h-20 bg-indigo-50 rounded-2xl flex items-center justify-center mb-8 rotate-3 shadow-lg group-hover:rotate-6 transition-transform">
                                <span className="text-4xl">🚀</span>
                            </div>
                            
                            <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4 bg-gradient-to-r from-indigo-600 to-blue-600 bg-clip-text text-transparent">
                                Future Success Stories Loading...
                            </h3>
                            
                            <p className="text-lg md:text-xl text-gray-600 italic leading-relaxed max-w-2xl mx-auto">
                                "The next big milestone could be yours. We are currently gathering the latest placement achievements from our bright students to share with you."
                            </p>
                            
                            <div className="mt-8 flex items-center space-x-2 text-indigo-600 font-semibold tracking-wide uppercase text-sm">
                                <span className="w-8 h-[2px] bg-indigo-600"></span>
                                <span>Be part of our legacy</span>
                                <span className="w-8 h-[2px] bg-indigo-600"></span>
                            </div>
                        </div>

                        <div className="text-6xl text-indigo-400/20 absolute bottom-4 right-6 font-serif rotate-180">“</div>
                    </div>
                </div>
            </div>
        </section>
    );
}
