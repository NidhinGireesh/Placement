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
        alert('Course Added & Assigned!');
        e.target.reset();
    };

    const deleteCourse = (id) => {
        setCourses(courses.filter((c) => c.id !== id));
    };

    return (
        <div>
            <h1 style={{ fontSize: '1.8rem', marginBottom: '1.5rem' }}>Course Management</h1>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
                {/* Add Course Section */}
                <div style={cardStyle}>
                    <h3>Add Training Course</h3>
                    <form onSubmit={addCourse} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        <input name="title" type="text" placeholder="Course Title" required style={inputStyle} />
                        <input name="link" type="text" placeholder="Content Link (PDF/Video)" required style={inputStyle} />
                        <select name="batch" style={inputStyle}>
                            <option value="2025">Batch 2025</option>
                            <option value="2026">Batch 2026</option>
                            <option value="All">All Batches</option>
                        </select>
                        <button type="submit" style={submitBtn}>Assign Course</button>
                    </form>
                </div>

                {/* Course List & Progress */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                    <div style={cardStyle}>
                        <h3>Active Courses</h3>
                        <ul style={{ listStyle: 'none', padding: 0 }}>
                            {courses.map((course) => (
                                <li key={course.id} style={listItemStyle}>
                                    <div>
                                        <strong>{course.title}</strong>
                                        <div style={{ fontSize: '0.85rem', color: '#6b7280' }}>
                                            Assigned to: {course.assignedTo} | <a href={course.link} target="_blank" rel="noreferrer">View Content</a>
                                        </div>
                                    </div>
                                    <button onClick={() => deleteCourse(course.id)} style={deleteBtn}>Delete</button>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div style={cardStyle}>
                        <h3>Student Progress</h3>
                        <table style={tableStyle}>
                            <thead>
                                <tr>
                                    <th>Student</th>
                                    <th>Course</th>
                                    <th>Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {progress.map((p) => (
                                    <tr key={p.id}>
                                        <td>{p.student}</td>
                                        <td>{p.course}</td>
                                        <td style={{
                                            color: p.status === 'Completed' ? 'green' : p.status === 'In Progress' ? 'orange' : 'red',
                                            fontWeight: 'bold'
                                        }}>
                                            {p.status}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}

const cardStyle = {
    background: 'white',
    padding: '1.5rem',
    borderRadius: '8px',
    border: '1px solid #e5e7eb',
    height: 'fit-content'
};

const inputStyle = {
    padding: '0.75rem',
    borderRadius: '6px',
    border: '1px solid #d1d5db',
    width: '100%',
};

const submitBtn = {
    padding: '0.75rem',
    backgroundColor: '#2563eb',
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    fontWeight: 'bold',
};

const deleteBtn = {
    padding: '0.25rem 0.5rem',
    backgroundColor: '#fee2e2',
    color: '#991b1b',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '0.8rem'
};

const listItemStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '0.75rem 0',
    borderBottom: '1px solid #f3f4f6',
};

const tableStyle = {
    width: '100%',
    marginTop: '0.5rem',
    borderCollapse: 'collapse',
    textAlign: 'left',
    fontSize: '0.9rem'
};
