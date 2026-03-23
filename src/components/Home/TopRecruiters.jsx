import React from 'react';

const companies = [
    { name: 'Google', type: 'Product', logo: 'https://t3.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=http://www.google.com&size=256' },
    { name: 'Microsoft', type: 'Product', logo: 'https://t3.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=http://www.microsoft.com&size=256' },
    { name: 'Amazon', type: 'Product', logo: 'https://t3.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=http://www.amazon.com&size=256' },
    { name: 'TCS', type: 'Service', logo: 'https://t3.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=http://www.tcs.com&size=256' },
    { name: 'Infosys', type: 'Service', logo: '/logos/infosys.svg' },
    { name: 'Wipro', type: 'Service', logo: 'https://t3.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=http://www.wipro.com&size=256' },
    { name: 'Zoho', type: 'Product', logo: 'https://t3.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=http://www.zoho.com&size=256' },
    { name: 'Freshworks', type: 'Product', logo: '/logos/freshworks.svg' },
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
                        <div key={`${company.name}-${index}`} className="flex flex-col items-center justify-center bg-white p-6 rounded-xl shadow-sm border border-gray-100 h-36 w-48 hover:shadow-lg hover:-translate-y-1 active:shadow-lg active:-translate-y-1 transition-all duration-300 group cursor-pointer">
                            <div className="relative h-14 w-full flex items-center justify-center mb-3">
                                <img
                                    src={company.logo}
                                    alt={company.name}
                                    className="h-full object-contain filter grayscale opacity-60 group-hover:grayscale-0 group-hover:opacity-100 group-active:grayscale-0 group-active:opacity-100 transition-all duration-300"
                                    onError={(e) => { 
                                        e.target.style.display = 'none'; 
                                        e.target.nextSibling.classList.remove('hidden');
                                        e.target.nextSibling.classList.add('flex');
                                    }}
                                />
                                <div className="hidden items-center justify-center text-lg font-bold text-gray-700 text-center px-2">
                                    {company.name}
                                </div>
                            </div>
                            <span className="text-[10px] tracking-wider uppercase font-semibold text-blue-600 bg-blue-50/50 px-2.5 py-1 rounded-md border border-blue-100/50 group-hover:bg-blue-600 group-hover:text-white transition-colors duration-300">
                                {company.type}
                            </span>
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
