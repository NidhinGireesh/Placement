import { useState } from 'react';

export default function ContactFloatingButton() {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
            {isOpen && (
                <div className="bg-white p-4 rounded-xl shadow-xl border border-gray-200 mb-4 w-64 animate-fade-in-up">
                    <h4 className="font-bold text-gray-800 mb-2">Contact Placement Cell</h4>
                    <div className="space-y-2 text-sm text-gray-600">
                        <p>📞 +91 98765 43210</p>
                        <p>✉️ placement@college.edu</p>
                        <p className="text-xs text-gray-500 mt-2">Mon-Fri, 9AM - 5PM</p>
                    </div>
                </div>
            )}

            <button
                onClick={() => setIsOpen(!isOpen)}
                className="bg-blue-600 hover:bg-blue-700 text-white rounded-full px-6 py-3 font-bold shadow-lg flex items-center transition-all hover:scale-105"
            >
                <span className="mr-2">📞</span>
                {isOpen ? 'Close' : 'Need Help?'}
            </button>
        </div>
    );
}
