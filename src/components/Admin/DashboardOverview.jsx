import React, { useState, useEffect } from 'react';
import { getUsersByRole } from '../../services/adminService';

export default function DashboardOverview() {
    const [students, setStudents] = useState([]);
    const [recruiters, setRecruiters] = useState([]);
    const [coordinators, setCoordinators] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            const studentResult = await getUsersByRole('student');
            const recruiterResult = await getUsersByRole('recruiter');
            const coordinatorResult = await getUsersByRole('coordinator');

            if (studentResult.success) setStudents(studentResult.data);
            if (recruiterResult.success) setRecruiters(recruiterResult.data);
            if (coordinatorResult.success) setCoordinators(coordinatorResult.data);
            setLoading(false);
        };

        fetchData();
    }, []);

    if (loading) return <p>Loading overview...</p>;

    return (
        <div>
            <h1 className="page-title">
                System Overview
            </h1>

            <div className="stats-grid">
                <StatCard title="Total Students" value={students.length} />
                <StatCard title="Approved Students" value={students.filter((s) => s.status === 'approved').length} />
                <StatCard title="Blocked Students" value={students.filter((s) => s.blocked).length} />
                <StatCard title="Recruiters" value={recruiters.length} />
                <StatCard title="Coordinators" value={coordinators.length} />
            </div>
        </div>
    );
}

function StatCard({ title, value }) {
    return (
        <div className="stat-card">
            <h4 className="stat-title">{title}</h4>
            <p className="stat-value">{value}</p>
        </div>
    );
}
