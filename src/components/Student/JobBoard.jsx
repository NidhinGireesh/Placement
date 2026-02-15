import { useState } from 'react';

export default function JobBoard() {
    // Mock Data
    const [jobs] = useState([
        {
            id: 1,
            company: 'TechCorp Solutions',
            role: 'Software Engineer',
            package: '12 LPA',
            location: 'Bangalore',
            deadline: '2026-03-01',
            skills: ['React', 'Node.js', 'MongoDB'],
            description: 'We are looking for a full stack developer to join our dynamic team.',
            postedDate: '2026-02-14'
        },
        {
            id: 2,
            company: 'DataSystems Inc',
            role: 'Data Analyst',
            package: '8 LPA',
            location: 'Pune',
            deadline: '2026-02-28',
            skills: ['Python', 'SQL', 'Tableau'],
            description: 'Analyze complex datasets and provide actionable insights.',
            postedDate: '2026-02-12'
        },
        {
            id: 3,
            company: 'CloudNine',
            role: 'DevOps Intern',
            package: '25k/month',
            location: 'Remote',
            deadline: '2026-03-05',
            skills: ['AWS', 'Docker', 'Linux'],
            description: 'Internship opportunity for cloud enthusiasts.',
            postedDate: '2026-02-10'
        }
    ]);

    const [searchTerm, setSearchTerm] = useState('');

    const filteredJobs = jobs.filter(job =>
        job.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.role.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleApply = (jobId) => {
        alert(`Applied to job ID: ${jobId} (Mock functionality)`);
    };

    return (
        <div>
            <div className="mb-6 flex justify-between items-center">
                <h2 className="text-2xl font-bold text-gray-800">Current Openings</h2>
                <div className="relative">
                    <input
                        type="text"
                        placeholder="Search role or company..."
                        className="form-input w-64 pl-10"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <span className="absolute left-3 top-2.5 text-gray-400">🔍</span>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredJobs.map(job => (
                    <div key={job.id} className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow border border-gray-100">
                        <div className="flex justify-between items-start mb-4">
                            <div>
                                <h3 className="text-lg font-bold text-gray-900">{job.role}</h3>
                                <p className="text-blue-600 font-medium">{job.company}</p>
                            </div>
                            <span className="bg-green-100 text-green-700 text-xs font-bold px-2 py-1 rounded-full">
                                {job.package}
                            </span>
                        </div>

                        <div className="space-y-2 mb-4">
                            <div className="flex items-center text-sm text-gray-600">
                                <span className="mr-2">📍</span> {job.location}
                            </div>
                            <div className="flex items-center text-sm text-gray-600">
                                <span className="mr-2">📅</span> Deadline: {job.deadline}
                            </div>
                        </div>

                        <div className="mb-4">
                            <div className="flex flex-wrap gap-2">
                                {job.skills.map((skill, idx) => (
                                    <span key={idx} className="bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded">
                                        {skill}
                                    </span>
                                ))}
                            </div>
                        </div>

                        <button
                            onClick={() => handleApply(job.id)}
                            className="w-full btn btn-primary"
                        >
                            Apply Now
                        </button>
                    </div>
                ))}

                {filteredJobs.length === 0 && (
                    <div className="col-span-full text-center py-10 text-gray-500">
                        No jobs found matching your search.
                    </div>
                )}
            </div>
        </div>
    );
}
