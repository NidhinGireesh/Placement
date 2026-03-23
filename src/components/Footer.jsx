import React from 'react';

export default function Footer() {
    return (
        <footer className="bg-gray-900 text-white pt-16 pb-8 border-t-4 border-blue-600">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
                    <div>
                        <h3 className="text-2xl font-bold mb-6">Placement<span className="text-blue-500">Cell</span></h3>
                        <p className="text-gray-400 text-sm leading-relaxed">
                            Bridging the gap between talent and opportunity. We ensure every student gets the best career kickstart.
                        </p>
                        <div className="mt-6 flex space-x-4">
                            <a href="#" className="p-2 bg-gray-800 rounded-lg hover:bg-blue-600 transition-colors">🐦</a>
                            <a href="#" className="p-2 bg-gray-800 rounded-lg hover:bg-blue-600 transition-colors">👔</a>
                            <a href="#" className="p-2 bg-gray-800 rounded-lg hover:bg-blue-600 transition-colors">📸</a>
                        </div>
                    </div>

                    <div>
                        <h4 className="text-lg font-bold mb-6 text-blue-100">Quick Links</h4>
                        <ul className="space-y-3 text-gray-400 text-sm">
                            <li><a href="#" className="hover:text-white transition-colors">Placement Policy PDF</a></li>
                            <li><a href="#" className="hover:text-white transition-colors">Information Brochure</a></li>
                            <li><a href="#" className="hover:text-white transition-colors">Recruiter Guide</a></li>
                            <li><a href="#" className="hover:text-white transition-colors">Past Recruiters</a></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="text-lg font-bold mb-6 text-blue-100">For Companies</h4>
                        <ul className="space-y-3 text-gray-400 text-sm">
                            <li><a href="#" className="hover:text-white transition-colors">Register for Drive</a></li>
                            <li><a href="#" className="hover:text-white transition-colors">Post a Job</a></li>
                            <li><a href="#" className="hover:text-white transition-colors">Corporate Relations</a></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="text-lg font-bold mb-6 text-blue-100">Contact Us</h4>
                        <ul className="space-y-3 text-gray-400 text-sm">
                            <li className="flex items-start gap-3">
                                <span className="mt-1">📍</span>
                                <span>Placement Cell, Admin Block,<br />Main Campus, GECI</span>
                            </li>
                            <li className="flex items-center gap-3">
                                <span>📞</span>
                                <span>+91 98765 43210</span>
                            </li>
                            <li className="flex items-center gap-3">
                                <span>📧</span>
                                <span>placement@college.edu</span>
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="border-t border-gray-800 pt-8 mt-8 flex flex-col md:flex-row justify-between items-center text-sm text-gray-500">
                    <p>© 2026 College Placement Cell. All rights reserved.</p>
                    <div className="flex space-x-6 mt-4 md:mt-0">
                        <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
                        <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
                        <a href="#" className="hover:text-white transition-colors">Sitemap</a>
                    </div>
                </div>
            </div>
        </footer>
    );
}
