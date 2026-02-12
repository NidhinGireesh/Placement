import React from 'react';

export default function DashboardOverview({ students, recruiters }) {
    return (
        <>
            <h1 style={{ fontSize: '1.8rem', marginBottom: '1rem' }}>
                System Overview
            </h1>

            <div
                style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                    gap: '1rem',
                }}
            >
                <StatCard title="Total Students" value={students.length} />
                <StatCard
                    title="Approved Students"
                    value={students.filter((s) => s.status === 'approved').length}
                />
                <StatCard
                    title="Blocked Students"
                    value={students.filter((s) => s.blocked).length}
                />
                <StatCard title="Recruiters" value={recruiters.length} />
            </div>
        </>
    );
}

function StatCard({ title, value }) {
    return (
        <div
            style={{
                background: 'white',
                padding: '1.5rem',
                borderRadius: '8px',
                border: '1px solid #e5e7eb',
                textAlign: 'center',
            }}
        >
            <h4 style={{ color: '#6b7280', fontSize: '0.9rem' }}>{title}</h4>
            <p style={{ fontSize: '1.6rem', fontWeight: 'bold' }}>{value}</p>
        </div>
    );
}
