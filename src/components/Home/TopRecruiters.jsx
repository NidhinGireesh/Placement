import React from 'react';

const companies = [
    { name: 'Google', type: 'Product', logo: 'https://logo.clearbit.com/google.com' },
    { name: 'Microsoft', type: 'Product', logo: 'https://logo.clearbit.com/microsoft.com' },
    { name: 'Amazon', type: 'Product', logo: 'https://logo.clearbit.com/amazon.com' },
    { name: 'TCS', type: 'Service', logo: 'https://logo.clearbit.com/tcs.com' },
    { name: 'Infosys', type: 'Service', logo: 'https://logo.clearbit.com/infosys.com' },
    { name: 'Wipro', type: 'Service', logo: 'https://logo.clearbit.com/wipro.com' },
    { name: 'Zoho', type: 'Product', logo: 'https://logo.clearbit.com/zoho.com' },
    { name: 'Freshworks', type: 'Product', logo: 'https://logo.clearbit.com/freshworks.com' },
];

export default function TopRecruiters() {
    return (
        <section className="py-16 bg-gray-50 overflow-hidden">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-10 text-center">
                <h2 className="text-3xl font-bold text-gray-800">Our Top Recruiters</h2>
                <p className="text-gray-500 mt-2">Trusted by world-class companies</p>
            </div>

            <div className="relative w-full overflow-hidden">
                <div className="flex animate-scroll space-x-12 w-max">
                    {[...companies, ...companies].map((company, index) => (
                        <div key={`${company.name}-${index}`} className="flex flex-col items-center justify-center bg-white p-6 rounded-xl shadow-sm border border-gray-100 h-32 w-48 hover:shadow-md transition-shadow">
                            {/* Using a placeholder text if image fails or for simplicity, but trying to use clearbit logo API */}
                            <img
                                src={company.logo}
                                alt={company.name}
                                className="h-12 object-contain mb-2 grayscale hover:grayscale-0 transition-all duration-300"
                                onError={(e) => { e.target.style.display = 'none'; e.target.nextSibling.style.display = 'block' }}
                            />
                            <span className="hidden text-lg font-bold text-gray-700">{company.name}</span>
                            <span className="text-xs text-blue-500 bg-blue-50 px-2 py-1 rounded-full">{company.type}</span>
                        </div>
                    ))}
                </div>
            </div>

            <style jsx>{`
        @keyframes scroll {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-scroll {
          animation: scroll 30s linear infinite;
        }
        .animate-scroll:hover {
            animation-play-state: paused;
        }
      `}</style>
        </section>
    );
}
