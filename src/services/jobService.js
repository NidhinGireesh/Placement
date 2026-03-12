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
