import { db } from '../config/firebaseConfig';
import { collection, query, where, getDocs, doc, updateDoc, deleteDoc, addDoc } from 'firebase/firestore';

// Collection reference
const usersCollection = collection(db, 'users');

/**
 * Fetch users by role
 * @param {string} role - 'student', 'recruiter', 'coordinator'
 * @returns {Promise<Array>} - List of users
 */
export const getUsersByRole = async (role) => {
    try {
        const q = query(usersCollection, where('role', '==', role));
        const querySnapshot = await getDocs(q);
        const users = [];
        querySnapshot.forEach((doc) => {
            users.push({ id: doc.id, ...doc.data() });
        });
        return { success: true, data: users };
    } catch (error) {
        console.error(`Error fetching ${role}s:`, error);
        return { success: false, error: error.message };
    }
};

/**
 * Update user status (approve/reject/block)
 * @param {string} userId
 * @param {object} updates - Object containing fields to update (e.g., { status: 'approved', blocked: true })
 */
export const updateUserStatus = async (userId, updates) => {
    try {
        const userRef = doc(db, 'users', userId);
        await updateDoc(userRef, updates);
        return { success: true };
    } catch (error) {
        console.error('Error updating user status:', error);
        return { success: false, error: error.message };
    }
};

/**
 * Add a new user (Recruiter/Coordinator) directly to Firestore
 * Note: This creates a record in Firestore but does NOT create an Auth account.
 * Ideally, you'd use a Cloud Function or a secondary Admin SDK app to create Auth users.
 * For now, this just adds the data so it appears in the list.
 */
export const addUserDoc = async (userData) => {
    try {
        // We use addDoc to let Firestore auto-generate an ID, or setDoc if we have an ID.
        // Since we don't have a UID from Auth, we'll let Firestore generate one for the doc ID.
        const docRef = await addDoc(usersCollection, {
            ...userData,
            createdAt: new Date(),
        });
        return { success: true, id: docRef.id };
    } catch (error) {
        console.error('Error adding user:', error);
        return { success: false, error: error.message };
    }
};

/**
 * Delete a user document
 * @param {string} userId
 */
export const deleteUserDoc = async (userId) => {
    try {
        await deleteDoc(doc(db, 'users', userId));
        return { success: true };
    } catch (error) {
        console.error('Error deleting user:', error);
        return { success: false, error: error.message };
    }
};
