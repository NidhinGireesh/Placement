
export const mockStudents = [
    { id: 1, name: "Alice Johnson", regNo: "REG001", branch: "CSE", cgpa: 8.5, backlogs: 0, resume: "alice_resume.pdf", status: "Pending" },
    { id: 2, name: "Bob Smith", regNo: "REG002", branch: "ECE", cgpa: 6.8, backlogs: 1, resume: "bob_resume.pdf", status: "Pending" },
    { id: 3, name: "Charlie Brown", regNo: "REG003", branch: "MECH", cgpa: 7.5, backlogs: 0, resume: "charlie_resume.pdf", status: "Verified" },
    { id: 4, name: "David Lee", regNo: "REG004", branch: "CSE", cgpa: 9.2, backlogs: 0, resume: "david_resume.pdf", status: "Verified" },
    { id: 5, name: "Eva Green", regNo: "REG005", branch: "EEE", cgpa: 7.0, backlogs: 2, resume: "eva_resume.pdf", status: "Rejected" },
];

// mockApplications removed

export const mockInterviews = [
    { id: 1, company: "TechCorp", round: "Technical Round 1", date: "2023-11-01", time: "10:00 AM", venue: "Lab 3", type: "Offline", candidates: 10 },
    { id: 2, company: "Innovate Solutions", round: "HR Round", date: "2023-11-02", time: "02:00 PM", venue: "Conference Hall A", type: "Offline", candidates: 5 },
];

export const mockTrainingSessions = [
    { id: 1, title: "Resume Building Workshop", trainer: "Mr. Expert", date: "2023-10-15", time: "10:00 AM", attendees: 120, status: "Completed", materials: [{ name: "Resume_Template.pdf", size: "1.2 MB" }] },
    { id: 2, title: "Aptitude Training", trainer: "Math Whiz", date: "2023-10-28", time: "09:00 AM", attendees: 0, status: "Upcoming", materials: [] },
];

export const mockAnnouncements = [
    { id: 1, title: "TechCorp Drive Tomorrow", message: "All eligible students please assemble in the auditorium by 9 AM.", date: "2023-10-31" },
    { id: 2, title: "Resume Upload Deadline", message: "Last date to update resumes is 2023-11-05.", date: "2023-10-28" },
];
