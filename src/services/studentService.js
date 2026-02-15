import { db } from '../config/firebaseConfig';
import { collection, query, where, getDocs, doc, updateDoc, getDoc } from 'firebase/firestore';

// Get Student Profile by User ID
export const getStudentProfile = async (userId) => {
    try {
        const q = query(collection(db, 'students'), where('userId', '==', userId));
        const querySnapshot = await getDocs(q);

        if (!querySnapshot.empty) {
            const data = querySnapshot.docs[0].data();
            return {
                id: querySnapshot.docs[0].id,
                ...data,
                success: true
            };
        }
        return { success: false, error: 'Student profile not found' };
    } catch (error) {
        console.error('Error fetching student profile:', error);
        return { success: false, error: error.message };
    }
};

// Update Student Profile
export const updateStudentProfile = async (userId, profileData) => {
    try {
        // 1. Update 'students' collection
        const q = query(collection(db, 'students'), where('userId', '==', userId));
        const querySnapshot = await getDocs(q);

        if (!querySnapshot.empty) {
            const studentDoc = querySnapshot.docs[0];
            const studentRef = doc(db, 'students', studentDoc.id);

            // Fields allowed to be updated in 'students' collection
            const studentUpdates = {
                phone: profileData.phone,
                dob: profileData.dob,
                cgpa: profileData.cgpa,
                skills: Array.isArray(profileData.skills) ? profileData.skills : profileData.skills.split(',').map(s => s.trim()),
                resumeUrl: profileData.resumeLink,
                // Add any other fields that are editable
            };

            await updateDoc(studentRef, studentUpdates);
        } else {
            return { success: false, error: 'Student record not found to update.' };
        }

        // 2. Update 'users' collection (for shared fields like name)
        // Note: Email is usually not editable directly without re-authentication flows
        const userRef = doc(db, 'users', userId);
        await updateDoc(userRef, {
            name: profileData.name,
            phone: profileData.phone
        });

        return { success: true };
    } catch (error) {
        console.error('Error updating profile:', error);
        return { success: false, error: error.message };
    }
};
