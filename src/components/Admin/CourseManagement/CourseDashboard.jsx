import React, { useState } from 'react';

export default function CourseDashboard() {
    const [courses, setCourses] = useState([
        {
            id: 1,
            title: 'Aptitude Training',
            description: 'Prepare for quantitative and logical reasoning.',
            link: 'https://example.com/aptitude-pdf',
            assignedTo: '2025',
        },
        {
            id: 2,
            title: 'Resume Building Workshop',
            description: 'Learn how to craft a perfect resume.',
            link: 'https://example.com/resume-guide',
            assignedTo: 'All',
        },
    ]);

    const [progress, setProgress] = useState([
        { id: 1, student: 'John Doe', course: 'Aptitude Training', status: 'Completed' },
        { id: 2, student: 'Alice John', course: 'Aptitude Training', status: 'In Progress' },
        { id: 3, student: 'John Doe', course: 'Resume Building', status: 'Pending' },
    ]);

    const addCourse = (e) => {
        e.preventDefault();
        const title = e.target.title.value;
        const link = e.target.link.value;
        const batch = e.target.batch.value;

        const newCourse = {
            id: Date.now(),
            title,
            description: 'New Course Content',
            link,
            assignedTo: batch,
        };
        setCourses([...courses, newCourse]);
        e.target.reset();
    };

    const deleteCourse = (id) => {
        setCourses(courses.filter((c) => c.id !== id));
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
                        <form onSubmit={addCourse} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Course Title</label>
                                <input name="title" type="text" placeholder="e.g. Java Basics" required className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Content Link</label>
                                <input name="link" type="url" placeholder="https://..." required className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Assign To Batch</label>
                                <select name="batch" className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none">
                                    <option value="2025">Batch 2025</option>
                                    <option value="2026">Batch 2026</option>
                                    <option value="All">All Batches</option>
                                </select>
                            </div>
                            <button type="submit" className="w-full bg-indigo-600 text-white py-2 rounded-lg font-medium hover:bg-indigo-700 transition-colors shadow-sm mt-2">
                                + Assign Course
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
                        <ul className="divide-y divide-slate-100">
                            {courses.map((course) => (
                                <li key={course.id} className="p-6 flex justify-between items-center hover:bg-slate-50 transition-colors">
                                    <div>
                                        <h4 className="font-semibold text-slate-800 text-lg">{course.title}</h4>
                                        <div className="text-sm text-slate-500 mt-1 flex gap-3">
                                            <span>👥 Batch {course.assignedTo}</span>
                                            <span className="text-slate-300">|</span>
                                            <a href={course.link} target="_blank" rel="noreferrer" className="text-indigo-600 hover:text-indigo-800 hover:underline">
                                                View Content
                                            </a>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => deleteCourse(course.id)}
                                        className="text-red-500 hover:bg-red-50 p-2 rounded-lg transition-colors text-sm"
                                        title="Delete Course"
                                    >
                                        🗑️
                                    </button>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Progress Table */}
                    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                        <div className="p-6 border-b border-slate-100">
                            <h3 className="text-lg font-bold text-slate-800">Student Progress Tracking</h3>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead className="bg-slate-50 text-xs uppercase text-slate-500 font-semibold">
                                    <tr>
                                        <th className="px-6 py-4">Student</th>
                                        <th className="px-6 py-4">Course</th>
                                        <th className="px-6 py-4">Status</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    {progress.map((p) => (
                                        <tr key={p.id} className="hover:bg-slate-50">
                                            <td className="px-6 py-4 font-medium text-slate-800">{p.student}</td>
                                            <td className="px-6 py-4 text-slate-600">{p.course}</td>
                                            <td className="px-6 py-4">
                                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${p.status === 'Completed' ? 'bg-green-100 text-green-800' :
                                                        p.status === 'In Progress' ? 'bg-amber-100 text-amber-800' :
                                                            'bg-gray-100 text-gray-800'
                                                    }`}>
                                                    {p.status}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}