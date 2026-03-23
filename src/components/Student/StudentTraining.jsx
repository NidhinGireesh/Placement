import { useState, useEffect } from 'react';
import { getTargetedCourses } from '../../services/courseService';
import { useAuthStore } from '../../store/authStore';

export default function StudentTraining() {
    const { user } = useAuthStore();
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (user?.passoutYear) {
            fetchCourses();
        } else {
            setLoading(false);
        }
    }, [user]);

    const fetchCourses = async () => {
        setLoading(true);
        const result = await getTargetedCourses(user.passoutYear);
        if (result.success) {
            setCourses(result.data);
        } else {
            setError(result.error);
        }
        setLoading(false);
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center py-20">
                <div className="w-10 h-10 border-4 border-indigo-600/20 border-t-indigo-600 rounded-full animate-spin"></div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex justify-end items-center mb-6">
                <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 font-medium shadow-sm">
                    Browse More
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {courses.map((course) => (
                    <div key={course.id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow flex flex-col h-full">
                        <div className="h-40 bg-gray-200 relative overflow-hidden shrink-0">
                            {/* Fallback pattern if image fails to load or just for style */}
                            <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-indigo-600 opacity-90"></div>
                            <div className="absolute inset-0 flex items-center justify-center text-white text-lg font-bold">
                                {course.title.substring(0, 15)}...
                            </div>
                        </div>

                        <div className="p-5 flex flex-col flex-1">
                            <div className="flex justify-between items-start mb-2 shrink-0">
                                <span className={`text-xs font-semibold uppercase tracking-wider px-2 py-1 rounded-md ${
                                    course.type === 'offline' 
                                        ? 'bg-amber-100 text-amber-700' 
                                        : 'bg-indigo-50 text-indigo-600'
                                }`}>
                                    {course.type === 'offline' ? 'Offline Session' : 'Resource'}
                                </span>
                            </div>

                            <h3 className="font-bold text-gray-800 text-lg mb-2 line-clamp-1 shrink-0">{course.title}</h3>
                            <p className="text-sm text-gray-500 mb-4 line-clamp-3 min-h-[60px] shrink-0">{course.description}</p>

                            {course.type === 'offline' ? (
                                <div className="mt-auto space-y-2 mb-4 bg-slate-50 p-3 rounded-lg border border-slate-100 text-sm text-gray-700 font-medium">
                                    <div className="flex items-center gap-2">
                                        <span className="text-lg">📅</span> {course.date}
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span className="text-lg">⏰</span> {course.time}
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span className="text-lg">📍</span> {course.venue}
                                    </div>
                                </div>
                            ) : null}

                            <div className="mt-auto shrink-0">
                                {course.type === 'offline' ? (
                                    <div className="block text-center w-full py-2.5 bg-gray-100 text-gray-500 rounded-lg text-sm font-bold border border-gray-200">
                                        In-Person Attendance Required
                                    </div>
                                ) : (
                                    <a
                                        href={course.link}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="block text-center w-full py-2.5 bg-indigo-50 text-indigo-700 rounded-lg text-sm font-bold hover:bg-indigo-600 hover:text-white transition-all duration-300"
                                    >
                                        Access Materials
                                    </a>
                                )}
                            </div>
                        </div>
                    </div>
                ))}

                {courses.length === 0 && (
                    <div className="col-span-full py-16 text-center bg-white rounded-2xl border border-dashed border-gray-200">
                        <div className="text-4xl mb-4">📚</div>
                        <h3 className="text-lg font-bold text-gray-800">No courses available yet</h3>
                        <p className="text-gray-500 text-sm mt-1">Check back later for new training materials assigned to your batch.</p>
                    </div>
                )}
            </div>
        </div>
    );
}
