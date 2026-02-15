import { useState } from 'react';

export default function StudentTraining() {
    const [courses] = useState([
        {
            id: 1,
            title: "Full Stack Web Development",
            provider: "Udemy",
            duration: "40 Hours",
            status: "In Progress",
            progress: 65,
            image: "https://img.youtube.com/vi/bMknfKXIFA8/sddefault.jpg"
        },
        {
            id: 2,
            title: "Data Structures & Algorithms",
            provider: "Coursera",
            duration: "60 Hours",
            status: "Not Started",
            progress: 0,
            image: "https://img.youtube.com/vi/8hly31xKli0/sddefault.jpg"
        },
        {
            id: 3,
            title: "Communication Skills Workshop",
            provider: "Internal",
            duration: "5 Hours",
            status: "Completed",
            progress: 100,
            image: "https://img.youtube.com/vi/HAnw168huqA/sddefault.jpg"
        }
    ]);

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
                                    {course.provider}
                                </span>
                                <span className={`text-xs font-bold px-2 py-1 rounded-full ${course.status === 'Completed' ? 'bg-green-100 text-green-700' :
                                        course.status === 'In Progress' ? 'bg-yellow-100 text-yellow-700' :
                                            'bg-gray-100 text-gray-700'
                                    }`}>
                                    {course.status}
                                </span>
                            </div>

                            <h3 className="font-bold text-gray-800 text-lg mb-2 line-clamp-1">{course.title}</h3>
                            <p className="text-sm text-gray-500 mb-4">Duration: {course.duration}</p>

                            <div className="mb-4">
                                <div className="flex justify-between text-xs text-gray-500 mb-1">
                                    <span>Progress</span>
                                    <span>{course.progress}%</span>
                                </div>
                                <div className="w-full bg-gray-100 rounded-full h-2">
                                    <div
                                        className={`h-2 rounded-full ${course.progress === 100 ? 'bg-green-500' : 'bg-indigo-600'}`}
                                        style={{ width: `${course.progress}%` }}
                                    ></div>
                                </div>
                            </div>

                            <button className="w-full py-2 border border-gray-200 rounded-lg text-sm font-semibold text-gray-600 hover:bg-gray-50 hover:text-indigo-600 transition-colors">
                                {course.status === 'Not Started' ? 'Start Course' : 'Continue Learning'}
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
