import { useState } from 'react';

export default function FAQSection() {
    const [openIndex, setOpenIndex] = useState(null);

    const faqs = [
        { q: "How do I apply for drives?", a: "Go to the Dashboard > Job Board and click 'Apply Now' on eligible drives." },
        { q: "What is the eligibility criteria?", a: "Generally 60% in 10th, 12th, and B.Tech with no active backlogs." },
        { q: "Whom to contact for errors?", a: "Email placement@college.edu or use the Contact button below." }
    ];

    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
            <h3 className="font-bold text-gray-800 mb-4 flex items-center">
                <span className="mr-2">❓</span> FAQ
            </h3>
            <div className="space-y-2">
                {faqs.map((faq, idx) => (
                    <div key={idx} className="border border-gray-100 rounded-lg overflow-hidden">
                        <button
                            onClick={() => setOpenIndex(openIndex === idx ? null : idx)}
                            className="w-full flex justify-between items-center p-3 text-left bg-gray-50 hover:bg-gray-100 transition-colors"
                        >
                            <span className="font-medium text-sm text-gray-700">{faq.q}</span>
                            <span className="text-gray-400 text-xs">{openIndex === idx ? '▲' : '▼'}</span>
                        </button>
                        {openIndex === idx && (
                            <div className="p-3 text-xs text-gray-600 bg-white border-t border-gray-100">
                                {faq.a}
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}
