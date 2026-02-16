import React, { useState } from 'react';

const FAQs = [
    {
        question: 'Can backlog students apply?',
        answer: 'It depends on the company policy. Some companies allow upto 1 active backlog, while others require all subjects to be cleared. Check specific drive details.'
    },
    {
        question: 'How to reset password?',
        answer: 'Go to the Login page and click on "Forgot Password?". Follow the instructions sent to your registered email to reset it.'
    },
    {
        question: 'Who can register?',
        answer: 'Final and pre-final year students from all branches can register. Alumni can also register for specific off-campus drives.'
    },
    {
        question: 'What is the minimum CGPA required?',
        answer: 'Most top-tier companies require a minimum CGPA of 6.5 or 7.0 with no standing arrears. However, this varies by company.'
    },
    {
        question: 'How do I know if I am shortlisted?',
        answer: 'You will receive an email notification and an update on your dashboard status once you are shortlisted for further rounds.'
    }
];

export default function FAQSection() {
    const [openIndex, setOpenIndex] = useState(null);

    return (
        <section className="py-16 bg-gray-50">
            <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
                <h2 className="text-3xl font-bold text-center mb-10 text-gray-800">Frequently Asked Questions</h2>

                <div className="space-y-4">
                    {FAQs.map((faq, index) => (
                        <div key={index} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                            <button
                                className="w-full px-6 py-4 text-left flex justify-between items-center bg-white hover:bg-gray-50 transition-colors focus:outline-none"
                                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                            >
                                <span className="font-semibold text-gray-800">{faq.question}</span>
                                <span className={`transform transition-transform duration-300 ${openIndex === index ? 'rotate-180' : ''}`}>
                                    ▼
                                </span>
                            </button>
                            <div
                                className={`overflow-hidden transition-all duration-300 ease-in-out ${openIndex === index ? 'max-h-40 opacity-100' : 'max-h-0 opacity-0'}`}
                            >
                                <div className="px-6 pb-4 text-gray-600 text-sm">
                                    {faq.answer}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
