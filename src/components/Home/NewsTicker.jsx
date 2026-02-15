export default function NewsTicker() {
    return (
        <div className="bg-gray-900 text-white py-2 overflow-hidden relative">
            <div className="animate-marquee whitespace-nowrap flex space-x-12">
                <span className="flex items-center"><span className="text-yellow-400 mr-2">📢</span> Amazon recruitment starting next week for SDE roles.</span>
                <span className="flex items-center"><span className="text-yellow-400 mr-2">📢</span> New Aptitude Training module live on dashboard.</span>
                <span className="flex items-center"><span className="text-yellow-400 mr-2">📢</span> Wipro results announced! Check your email.</span>
                <span className="flex items-center"><span className="text-yellow-400 mr-2">📢</span> Resume review session on Friday at 4 PM.</span>
                {/* Duplicate for seamless loop */}
                <span className="flex items-center"><span className="text-yellow-400 mr-2">📢</span> Amazon recruitment starting next week for SDE roles.</span>
                <span className="flex items-center"><span className="text-yellow-400 mr-2">📢</span> New Aptitude Training module live on dashboard.</span>
            </div>

            {/* Tailwind config for animation needed: 
          @keyframes marquee { 0% { transform: translateX(0); } 100% { transform: translateX(-50%); } } 
          .animate-marquee { animation: marquee 20s linear infinite; }
      */}
            <style>{`
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-marquee {
          animation: marquee 25s linear infinite;
        }
      `}</style>
        </div>
    );
}
