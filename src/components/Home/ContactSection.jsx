import React from 'react';

export default function ContactSection() {
    return (
        <section className="py-16 bg-white border-t border-gray-100">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <h2 className="text-3xl font-bold text-center mb-12 text-gray-800">Contact Placement Cell</h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                    {/* Contact Card */}
                    <div className="bg-gradient-to-br from-indigo-900 to-blue-800 text-white rounded-2xl p-8 shadow-xl relative overflow-hidden">
                        {/* Decorative circles */}
                        <div className="absolute top-0 right-0 w-32 h-32 bg-white opacity-10 rounded-full -mr-10 -mt-10"></div>
                        <div className="absolute bottom-0 left-0 w-24 h-24 bg-white opacity-10 rounded-full -ml-10 -mb-10"></div>

                        <h3 className="text-2xl font-bold mb-6">Get in Touch</h3>

                        <div className="space-y-6 relative z-10">
                            <div className="flex items-center space-x-4">
                                <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                                    👨‍💼
                                </div>
                                <div>
                                    <p className="text-blue-200 text-sm">Placement Officer</p>
                                    <p className="font-bold text-lg">Placement Cell Faculty Admin</p>
                                </div>
                            </div>

                            <div className="flex items-center space-x-4">
                                <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                                    📧
                                </div>
                                <div>
                                    <p className="text-blue-200 text-sm">Email Address</p>
                                    <p className="font-bold text-lg">placement@geci.ac.in</p>
                                </div>
                            </div>

                            <div className="flex items-center space-x-4">
                                <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                                    📞
                                </div>
                                <div>
                                    <p className="text-blue-200 text-sm">Phone Number</p>
                                    <p className="font-bold text-lg">+91 9876543210</p>
                                </div>
                            </div>

                            <div className="flex items-center space-x-4">
                                <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                                    📍
                                </div>
                                <div>
                                    <p className="text-blue-200 text-sm">Office Location</p>
                                    <p className="font-bold text-lg">Admin Block,Second Floor</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Map Placeholder or Additional Info */}
                    <div className="bg-gray-50 rounded-2xl p-8 h-full flex flex-col justify-center border border-gray-200">
                        <h3 className="text-xl font-bold text-gray-800 mb-4">Visit Us</h3>
                        <p className="text-gray-600 mb-6">
                            Our office is open from Monday to Friday, 9:00 AM to 5:00 PM.
                            Feel free to visit for any queries regarding placements, internships, or recruitment drives.
                        </p>
                        <div className="w-full h-[300px] overflow-hidden rounded-xl shadow-inner border border-gray-200">
                            <iframe 
                                src="https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d6582.366989004989!2d76.931017!3d9.850898!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3b07ba40109a481f%3A0x68b6eed84716c7ce!2sGovernment%20Engineering%20College%20Idukki!5e1!3m2!1sen!2sin!4v1774291687811!5m2!1sen!2sin" 
                                width="100%" 
                                height="100%" 
                                style={{ border: 0 }} 
                                allowFullScreen="" 
                                loading="lazy" 
                                referrerpolicy="no-referrer-when-downgrade"
                                title="GEC Idukki Location"
                            ></iframe>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
