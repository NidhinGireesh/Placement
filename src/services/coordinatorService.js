import { db } from '../config/firebaseConfig';
import { collection, query, where, getDocs, doc, updateDoc, getDoc, deleteDoc } from 'firebase/firestore';

// Get Coordinator's own details (Branch & Passout Year)
export const getCoordinatorDetails = async (userId) => {
    try {
        // Coordinator has a profile in 'students' collection too
        const q = query(collection(db, 'students'), where('userId', '==', userId));
        const querySnapshot = await getDocs(q);

        if (!querySnapshot.empty) {
            const data = querySnapshot.docs[0].data();
            return {
                branch: data.branch,
                passoutYear: data.passoutYear,
                success: true
            };
        }
        return { success: false, error: 'Coordinator profile not found' };
    } catch (error) {
        console.error('Error fetching coordinator details:', error);
        return { success: false, error: error.message };
    }
};

// Get Students for verification (Same Branch & Year)
export const getStudentsByClass = async (branch, passoutYear) => {
    try {
        // Query students collection
        const q = query(
            collection(db, 'students'),
            where('branch', '==', branch),
            where('passoutYear', '==', passoutYear)
        );
        const querySnapshot = await getDocs(q);

        const students = [];

        // Process each student
        // Note: We need to fetch 'name' from 'users' collection for each student
        // This could be slow for many students, but accurate.
        // Optimization: Store name in students collection on registration.
        // For now, we will fetch individually.

        for (const docSnapshot of querySnapshot.docs) {
            const studentData = docSnapshot.data();

            // Fetch Name and Status from Users collection (where the main approval logic sits)
            let userData = { name: "Unknown" };
            if (studentData.userId) {
                const userDoc = await getDoc(doc(db, 'users', studentData.userId));
                if (userDoc.exists()) {
                    userData = userDoc.data();
                }
            }
 
            if (userData.name !== "Unknown") {
                students.push({
                    id: docSnapshot.id,
                    ...studentData,
                    ...userData, // Spread user document (includes 'approved' boolean and 'status')
                    name: userData.name,
                    regNo: studentData.registerNumber,
                    // Use user's status as primary if profile status is missing/old
                    status: userData.status || studentData.approvalStatus || 'pending',
                    cgpa: studentData.cgpa || 0,
                    backlogs: studentData.backlogs || 0,
                    resume: studentData.resumeUrl || '',
                });
            }
        }

        return { success: true, data: students };
    } catch (error) {
        console.error('Error fetching students:', error);
        return { success: false, error: error.message };
    }
};

// Update Student Verification Status
export const updateStudentStatus = async (studentDocId, status) => {
    try {
        const studentRef = doc(db, 'students', studentDocId);
        const studentSnap = await getDoc(studentRef); // Get student doc to find linked userId

        if (studentSnap.exists()) {
            const studentData = studentSnap.data();
            const userId = studentData.userId;

            // 1. Update Student Collection
            await updateDoc(studentRef, {
                approvalStatus: status
            });

            // 2. Update Users Collection (Auth Logic relies on this)
            if (userId) {
                const userRef = doc(db, 'users', userId);
                await updateDoc(userRef, {
                    approved: status === 'approved', // True if approved, False otherwise
                    status: status // 'approved', 'rejected', or 'pending'
                });
            }
            return { success: true };
        } else {
            return { success: false, error: "Student not found" };
        }

    } catch (error) {
        console.error('Error updating student status:', error);
        return { success: false, error: error.message };
    }
};

// Delete Student
export const deleteStudent = async (studentDocId) => {
    try {
        await deleteDoc(doc(db, 'students', studentDocId));
        return { success: true };
    } catch (error) {
        console.error('Error deleting student:', error);
        return { success: false, error: error.message };
    }
};
