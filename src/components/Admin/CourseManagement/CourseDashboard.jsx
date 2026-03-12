import React, { useState, useEffect } from 'react';
import { addCourse, getAllCourses, deleteCourse } from '../../../services/courseService';

export default function CourseDashboard() {
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [courseType, setCourseType] = useState('online');

    useEffect(() => {
        fetchCourses();
    }, []);

    const fetchCourses = async () => {
        setLoading(true);
        const result = await getAllCourses();
        if (result.success) {
            setCourses(result.data);
        } else {
            setError(result.error);
        }
        setLoading(false);
    };

    const handleAddCourse = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        const title = e.target.title.value;
        const description = e.target.description.value;
        const batch = e.target.batch.value;

        let newCourse = {
            title,
            description,
            assignedTo: batch,
            type: courseType
        };

        if (courseType === 'online') {
            newCourse.link = e.target.link.value;
        } else {
            newCourse.date = e.target.date.value;
            newCourse.time = e.target.time.value;
            newCourse.venue = e.target.venue.value;
        }

        const result = await addCourse(newCourse);
        if (result.success) {
            e.target.reset();
            fetchCourses(); // refresh the list
        } else {
            alert('Failed to assign course: ' + result.error);
        }
        setIsSubmitting(false);
    };

    const handleDeleteCourse = async (id) => {
        if (window.confirm("Are you sure you want to remove this course?")) {
            const result = await deleteCourse(id);
            if (result.success) {
                setCourses(courses.filter((c) => c.id !== id));
            } else {
                alert('Error deleting course: ' + result.error);
            }
        }
    };

    return (
        <div>
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-slate-800 mb-2">Training & Course Management</h1>
                <p className="text-slate-500">Assign training materials and track student progress.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Col: Add Course */}
                <div className="lg:col-span-1">
                    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 sticky top-6">
                        <h3 className="text-lg font-bold text-slate-800 mb-4">Add Training Module</h3>

                        {/* Type Toggle */}
                        <div className="flex bg-slate-100 p-1 rounded-lg mb-6">
                            <button
                                type="button"
                                onClick={() => setCourseType('online')}
                                className={`flex-1 py-1.5 text-sm font-medium rounded-md transition-colors ${courseType === 'online' ? 'bg-white text-indigo-700 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                            >
                                Online Resource
                            </button>
                            <button
                                type="button"
                                onClick={() => setCourseType('offline')}
                                className={`flex-1 py-1.5 text-sm font-medium rounded-md transition-colors ${courseType === 'offline' ? 'bg-white text-indigo-700 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                            >
                                Offline Session
                            </button>
                        </div>

                        <form onSubmit={handleAddCourse} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Title</label>
                                <input name="title" type="text" placeholder="e.g. Java Basics" required className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Description</label>
                                <textarea name="description" placeholder="Short summary" required className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none resize-none h-20" />
                            </div>

                            {courseType === 'online' ? (
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Access URL</label>
                                    <input name="link" type="url" placeholder="https://..." required className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none" />
                                </div>
                            ) : (
                                <>
                                    <div className="grid grid-cols-2 gap-3">
                                        <div>
                                            <label className="block text-sm font-medium text-slate-700 mb-1">Date</label>
                                            <input name="date" type="date" required className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none" />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-slate-700 mb-1">Time</label>
                                            <input name="time" type="time" required className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none" />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-1">Venue</label>
                                        <input name="venue" type="text" placeholder="e.g. Main Auditorium" required className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none" />
                                    </div>
                                </>
                            )}

                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Assign To Batch</label>
                                <select name="batch" className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none cursor-pointer">
                                    <option value="2025">Batch 2025</option>
                                    <option value="2026">Batch 2026</option>
                                    <option value="2027">Batch 2027</option>
                                    <option value="2028">Batch 2028</option>
                                    <option value="All">All Batches</option>
                                </select>
                            </div>
                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="w-full bg-indigo-600 text-white py-2 rounded-lg font-medium hover:bg-indigo-700 transition-colors shadow-sm mt-2 disabled:opacity-50"
                            >
                                {isSubmitting ? 'Assigning...' : '+ Assign Course'}
                            </button>
                        </form>
                    </div>
                </div>

                {/* Right Col: List & Progress */}
                <div className="lg:col-span-2 space-y-8">
                    {/* Active Courses */}
                    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                        <div className="p-6 border-b border-slate-100 flex justify-between items-center">
                            <h3 className="text-lg font-bold text-slate-800">Active Courses</h3>
                            <span className="text-sm text-slate-500">{courses.length} Modules</span>
                        </div>

                        {error && <div className="p-4 bg-red-50 text-red-600 text-sm">{error}</div>}

                        {loading ? (
                            <div className="flex justify-center items-center py-10">
                                <div className="w-6 h-6 border-2 border-indigo-600/30 border-t-indigo-600 rounded-full animate-spin"></div>
                            </div>
                        ) : (
                            <ul className="divide-y divide-slate-100">
                                {courses.length === 0 ? (
                                    <div className="text-center py-10 text-slate-400 font-medium">No courses available.</div>
                                ) : courses.map((course) => (
                                    <li key={course.id} className="p-6 flex justify-between items-start hover:bg-slate-50 transition-colors gap-4 border-l-4 border-transparent hover:border-indigo-500">
                                        <div className="flex-1">
                                            <div className="flex items-center gap-2 mb-1">
                                                <h4 className="font-bold text-slate-800 text-lg">{course.title}</h4>
                                                <span className={`text-[10px] uppercase tracking-wider font-bold px-2 py-0.5 rounded-full ${course.type === 'offline' ? 'bg-amber-100 text-amber-700' : 'bg-blue-100 text-blue-700'}`}>
                                                    {course.type || 'online'}
                                                </span>
                                            </div>

                                            <p className="text-sm text-slate-600 mb-3 line-clamp-2">{course.description}</p>

                                            <div className="flex flex-wrap items-center gap-3">
                                                <span className="bg-slate-100 text-slate-600 px-3 py-1 rounded-full text-xs font-semibold">
                                                    👥 Batch: {course.assignedTo}
                                                </span>

                                                {course.type === 'offline' ? (
                                                    <span className="text-xs text-slate-500 font-medium flex items-center gap-1.5 bg-slate-50 px-2 py-1 rounded-md border border-slate-100">
                                                        📅 {course.date} at {course.time} • 📍 {course.venue}
                                                    </span>
                                                ) : (
                                                    <a href={course.link} target="_blank" rel="noreferrer" className="text-indigo-600 hover:text-indigo-800 hover:underline flex items-center gap-1 text-sm font-semibold">
                                                        Link →
                                                    </a>
                                                )}
                                            </div>
                                        </div>
                                        <button
                                            onClick={() => handleDeleteCourse(course.id)}
                                            className="text-red-500 hover:bg-red-50 p-2.5 rounded-xl transition-colors shrink-0"
                                            title="Delete Course"
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                                <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                                            </svg>
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}