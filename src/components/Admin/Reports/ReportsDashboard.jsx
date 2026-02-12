import React, { useState } from 'react';

export default function ReportsDashboard() {
    const [activeTab, setActiveTab] = useState('communication');

    return (
        <div>
            <h1 style={{ fontSize: '1.8rem', marginBottom: '1.5rem' }}>Communication & Reports</h1>

            <div style={{ marginBottom: '1.5rem', display: 'flex', gap: '1rem' }}>
                <button onClick={() => setActiveTab('communication')} style={activeTab === 'communication' ? activeTabStyle : tabStyle}>Communication</button>
                <button onClick={() => setActiveTab('results')} style={activeTab === 'results' ? activeTabStyle : tabStyle}>Publish Results</button>
                <button onClick={() => setActiveTab('stats')} style={activeTab === 'stats' ? activeTabStyle : tabStyle}>Statistics</button>
            </div>

            {activeTab === 'communication' && <CommunicationForm />}
            {activeTab === 'results' && <ResultsPanel />}
            {activeTab === 'stats' && <StatisticsPanel />}
        </div>
    );
}

function CommunicationForm() {
    const handleSubmit = (e) => {
        e.preventDefault();
        alert(`Message Sent to ${e.target.recipient.value}!`);
        e.target.reset();
    };

    return (
        <div style={cardStyle}>
            <h3>Send Official Communication</h3>
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem', maxWidth: '600px' }}>
                <select name="recipient" style={inputStyle}>
                    <option value="All Students">All Students</option>
                    <option value="Placed Students">Placed Students</option>
                    <option value="Unplaced Students">Unplaced Students</option>
                    <option value="Recruiters">Recruiters</option>
                </select>
                <input name="subject" type="text" placeholder="Subject" required style={inputStyle} />
                <textarea name="message" rows="5" placeholder="Type your message here..." required style={inputStyle}></textarea>
                <button type="submit" style={submitBtn}>Send Message</button>
            </form>
        </div>
    );
}

function ResultsPanel() {
    const [results] = useState([
        { id: 1, title: 'TCS Final Selects 2025', date: '2025-10-15', status: 'Published' },
        { id: 2, title: 'Infosys Shortlist', date: '2025-10-20', status: 'Published' },
    ]);

    return (
        <div style={cardStyle}>
            <h3>Published Results</h3>
            <button style={secondaryBtn}>+ Upload New Result (PDF/Excel)</button>
            <ul style={{ listStyle: 'none', padding: 0, marginTop: '1rem' }}>
                {results.map((r) => (
                    <li key={r.id} style={listItemStyle}>
                        <span>{r.title} <span style={{ fontSize: '0.8rem', color: '#6b7280' }}>({r.date})</span></span>
                        <span style={{ color: 'green', fontWeight: 'bold' }}>{r.status}</span>
                    </li>
                ))}
            </ul>
        </div>
    );
}

function StatisticsPanel() {
    return (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
            <div style={cardStyle}>
                <h3>Branch-wise Placements</h3>
                <div style={statRow}><span>CSE</span> <div style={barContainer}><div style={{ ...bar, width: '85%' }}></div></div> <span>85%</span></div>
                <div style={statRow}><span>ECE</span> <div style={barContainer}><div style={{ ...bar, width: '70%' }}></div></div> <span>70%</span></div>
                <div style={statRow}><span>MECH</span> <div style={barContainer}><div style={{ ...bar, width: '60%' }}></div></div> <span>60%</span></div>
            </div>

            <div style={cardStyle}>
                <h3>Company-wise Offers</h3>
                <div style={statRow}><span>TCS</span> <span>45 Offers</span></div>
                <div style={statRow}><span>Infosys</span> <span>32 Offers</span></div>
                <div style={statRow}><span>Wipro</span> <span>28 Offers</span></div>
                <div style={statRow}><span>Accenture</span> <span>40 Offers</span></div>
            </div>
        </div>
    );
}

// Reuse styles
const cardStyle = { background: 'white', padding: '1.5rem', borderRadius: '8px', border: '1px solid #e5e7eb' };
const inputStyle = { padding: '0.75rem', borderRadius: '6px', border: '1px solid #d1d5db', width: '100%' };
const submitBtn = { padding: '0.75rem', backgroundColor: '#111827', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' };
const secondaryBtn = { padding: '0.5rem 1rem', backgroundColor: 'white', border: '1px solid #d1d5db', borderRadius: '6px', cursor: 'pointer' };
const tabStyle = { padding: '0.75rem 1.5rem', border: 'none', background: 'white', cursor: 'pointer', borderRadius: '6px', color: '#6b7280', fontWeight: '600' };
const activeTabStyle = { ...tabStyle, background: '#2563eb', color: 'white' };
const listItemStyle = { display: 'flex', justifyContent: 'space-between', padding: '0.75rem', borderBottom: '1px solid #f3f4f6' };

// Stat specific
const statRow = { display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.8rem' };
const barContainer = { flex: 1, background: '#f3f4f6', height: '10px', borderRadius: '5px', margin: '0 1rem' };
const bar = { background: '#2563eb', height: '100%', borderRadius: '5px' };
