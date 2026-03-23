import {
    collection,
    addDoc,
    getDocs,
    query,
    where,
    orderBy,
    doc,
    updateDoc,
    deleteDoc,
    getDoc
} from 'firebase/firestore';
import { db } from '../config/firebaseConfig';

const JOBS_COLLECTION = 'jobs';
const APPLICATIONS_COLLECTION = 'applications';

export const postOpportunity = async (jobData) => {
    try {
        const docRef = await addDoc(collection(db, JOBS_COLLECTION), {
            ...jobData,
            createdAt: new Date(),
            status: 'active'
        });
        return { success: true, id: docRef.id };
    } catch (error) {
        console.error('Error posting opportunity:', error);
        return { success: false, error: error.message };
    }
};

export const getAllJobs = async () => {
    try {
        const q = query(collection(db, JOBS_COLLECTION), orderBy('createdAt', 'desc'));
        const querySnapshot = await getDocs(q);
        const jobs = querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));
        return { success: true, data: jobs };
    } catch (error) {
        console.error('Error getting jobs:', error);
        return { success: false, error: error.message };
    }
};

export const getTargetedJobs = async (branch, batch) => {
    try {
        // We fetch all jobs and filter/sort client-side to avoid the requirement for 
        // a composite index on (status ASC, createdAt DESC). 
        // This is safe for the expected data volume of a placement portal.
        const q = query(collection(db, JOBS_COLLECTION));
        const querySnapshot = await getDocs(q);

        const allJobs = querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));

        // Filter and Sort Client Side
        const targetedJobs = allJobs
            .filter(job => job.status === 'active')
            .filter(job => {
                // Ensure targetBranches and targetYears exist
                const targetBranches = job.targetBranches || ['All'];
                const targetYears = job.targetYears || ['All'];

                const branchMatch = targetBranches.includes('All') || targetBranches.includes(branch);
                const yearMatch = targetYears.includes('All') || targetYears.includes(batch);
                return branchMatch && yearMatch;
            })
            .sort((a, b) => {
                const dateA = a.createdAt?.seconds || 0;
                const dateB = b.createdAt?.seconds || 0;
                return dateB - dateA; // Descending order
            });

        return { success: true, data: targetedJobs };
    } catch (error) {
        console.error('Error getting targeted jobs:', error);
        return { success: false, error: error.message };
    }
};

export const deleteJob = async (jobId) => {
    try {
        // 1. Delete all applications related to this jobId
        const q = query(collection(db, APPLICATIONS_COLLECTION), where('jobId', '==', jobId));
        const appSnapshot = await getDocs(q);
        const deletePromises = appSnapshot.docs.map(appDoc => deleteDoc(doc(db, APPLICATIONS_COLLECTION, appDoc.id)));
        await Promise.all(deletePromises);

        // 2. Delete the job itself
        await deleteDoc(doc(db, JOBS_COLLECTION, jobId));
        return { success: true };
    } catch (error) {
        console.error('Error deleting job:', error);
        return { success: false, error: error.message };
    }
};

export const updateJobStatus = async (jobId, status) => {
    try {
        const jobRef = doc(db, JOBS_COLLECTION, jobId);
        await updateDoc(jobRef, { status });
        return { success: true };
    } catch (error) {
        console.error('Error updating job status:', error);
        return { success: false, error: error.message };
    }
};

export const updateJob = async (jobId, jobData) => {
    try {
        const jobRef = doc(db, JOBS_COLLECTION, jobId);
        // Exclude the id and any potential metadata we don't want to update blindly
        const { id, createdAt, ...updateData } = jobData;
        await updateDoc(jobRef, updateData);
        return { success: true };
    } catch (error) {
        console.error('Error updating job:', error);
        return { success: false, error: error.message };
    }
};

export const getJobsByRecruiter = async (recruiterId) => {
    try {
        const q = query(
            collection(db, JOBS_COLLECTION),
            where('postedBy', '==', recruiterId)
        );
        const querySnapshot = await getDocs(q);
        let jobs = querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));
        
        const safeSort = (a, b) => {
            const getMs = (date) => {
                if (!date) return 0;
                if (date.toMillis) return date.toMillis();
                if (date.getTime) return date.getTime();
                return new Date(date).getTime() || 0;
            };
            return getMs(b.createdAt) - getMs(a.createdAt);
        };
        jobs.sort(safeSort);
        
        return { success: true, data: jobs };
    } catch (error) {
        console.error('Error getting recruiter jobs:', error);
        return { success: false, error: error.message };
    }
};

export const applyForJob = async (jobId, recruiterId, studentId, studentDetails) => {
    try {
        // We no longer strictly require recruiterId at this stage to support Admin-posted jobs
        // that may have been created without a specific recruiter account.

        const q = query(
            collection(db, APPLICATIONS_COLLECTION),
            where('jobId', '==', jobId),
            where('studentId', '==', studentId)
        );
        const existing = await getDocs(q);
        if (!existing.empty) {
            return { success: false, error: 'You have already applied for this job.' };
        }

        const application = {
            jobId,
            recruiterId,
            studentId,
            ...studentDetails,
            status: 'Applied',
            appliedAt: new Date()
        };

        const docRef = await addDoc(collection(db, APPLICATIONS_COLLECTION), application);
        return { success: true, id: docRef.id };
    } catch (error) {
        console.error('Error applying for job:', error);
        return { success: false, error: error.message };
    }
};

export const getApplicationsForRecruiter = async (recruiterId) => {
    try {
        const q = query(
            collection(db, APPLICATIONS_COLLECTION),
            where('recruiterId', '==', recruiterId)
        );
        const querySnapshot = await getDocs(q);
        let apps = querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));
        
        const safeSortApps = (a, b) => {
            const getMs = (date) => {
                if (!date) return 0;
                if (date.toMillis) return date.toMillis();
                if (date.getTime) return date.getTime();
                return new Date(date).getTime() || 0;
            };
            return getMs(b.appliedAt) - getMs(a.appliedAt);
        };
        apps.sort(safeSortApps);
        
        return { success: true, data: apps };
    } catch (error) {
        console.error('Error getting applications:', error);
        return { success: false, error: error.message };
    }
};

export const updateApplicationStatus = async (appId, status, additionalData = {}) => {
    try {
        await updateDoc(doc(db, APPLICATIONS_COLLECTION, appId), { status, ...additionalData });
        return { success: true };
    } catch (error) {
        console.error('Error updating application status:', error);
        return { success: false, error: error.message };
    }
};

export const getApplicationsForStudent = async (studentId) => {
    try {
        const q = query(
            collection(db, APPLICATIONS_COLLECTION),
            where('studentId', '==', studentId)
        );
        const querySnapshot = await getDocs(q);
        
        // Also fetch the job details for each application
        const apps = (await Promise.all(querySnapshot.docs.map(async (docSnap) => {
            const data = docSnap.data();
            // Fetch job info
            const jobDoc = await getDoc(doc(db, JOBS_COLLECTION, data.jobId));
            if (!jobDoc.exists()) return null; // Filter out applications for deleted jobs
            
            const jobData = jobDoc.data();
            return {
                id: docSnap.id,
                ...data,
                jobTitle: jobData.title,
                company: jobData.company,
                location: jobData.location || 'Not Specified',
                type: jobData.type || 'Full-time'
            };
        }))).filter(Boolean);
        
        const safeSortApps = (a, b) => {
            const getMs = (date) => {
                if (!date) return 0;
                if (date.toMillis) return date.toMillis();
                if (date.getTime) return date.getTime();
                return new Date(date).getTime() || 0;
            };
            return getMs(b.appliedAt) - getMs(a.appliedAt);
        };
        apps.sort(safeSortApps);
        
        return { success: true, data: apps };
    } catch (error) {
        console.error('Error getting student applications:', error);
        return { success: false, error: error.message };
    }
};

export const revokeApplication = async (applicationId) => {
    try {
        await deleteDoc(doc(db, APPLICATIONS_COLLECTION, applicationId));
        return { success: true };
    } catch (error) {
        console.error('Error revoking application:', error);
        return { success: false, error: error.message };
    }
};

// Admin: get all applications across all jobs
export const getAllApplications = async () => {
    try {
        const querySnapshot = await getDocs(collection(db, APPLICATIONS_COLLECTION));
        const apps = querySnapshot.docs.map(d => ({ id: d.id, ...d.data() }));
        return { success: true, data: apps };
    } catch (error) {
        console.error('Error fetching all applications:', error);
        return { success: false, error: error.message };
    }
};
