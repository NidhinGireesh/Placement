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
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h2 className="text-2xl font-bold text-gray-800">Training & Courses</h2>
                    <p className="text-gray-500 mt-1">Enhance your skills with recommended courses</p>
                </div>
                <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 font-medium shadow-sm">
                    Browse More
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {courses.map((course) => (
                    <div key={course.id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow">
                        <div className="h-40 bg-gray-200 relative overflow-hidden">
                            {/* Fallback pattern if image fails to load or just for style */}
                            <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-indigo-600 opacity-90"></div>
                            <div className="absolute inset-0 flex items-center justify-center text-white text-lg font-bold">
                                {course.title.substring(0, 15)}...
                            </div>
                        </div>

                        <div className="p-5">
                            <div className="flex justify-between items-start mb-2">
                                <span className="text-xs font-semibold uppercase tracking-wider text-indigo-600 px-2 py-1 bg-indigo-50 rounded-md">
                                    Resource
                                </span>
                            </div>

                            <h3 className="font-bold text-gray-800 text-lg mb-2 line-clamp-1">{course.title}</h3>
                            <p className="text-sm text-gray-500 mb-6 line-clamp-3 min-h-[60px]">{course.description}</p>

                            <a
                                href={course.link}
                                target="_blank"
                                rel="noreferrer"
                                className="block text-center w-full py-2.5 bg-indigo-50 text-indigo-700 rounded-lg text-sm font-bold hover:bg-indigo-600 hover:text-white transition-all duration-300"
                            >
                                Access Materials
                            </a>
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
