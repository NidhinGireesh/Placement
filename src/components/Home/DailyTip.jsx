export default function DailyTip() {
    return (
        <div className="bg-yellow-50 rounded-xl p-6 border border-yellow-100">
            <div className="flex items-start space-x-4">
                <div className="text-3xl">💡</div>
                <div>
                    <h3 className="font-bold text-gray-800 text-lg">Tip of the Day</h3>
                    <p className="text-gray-700 mt-2 text-sm leading-relaxed">
                        <span className="font-semibold">Resume Hack:</span> Always quantify your achievements.
                        Instead of "Managed team", write "Managed team of 5 developers to deliver project 2 weeks early".
                    </p>
                </div>
            </div>
        </div>
    );
}
