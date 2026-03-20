import {
    doc,
    setDoc,
    getDoc,
    serverTimestamp,
    query,
    collection,
    where,
    getDocs
} from 'firebase/firestore';
import { db } from '../config/firebaseConfig';

const ATTENDANCE_COLLECTION = 'attendance';

// The document ID will be a composite of courseId and coordinatorClass
// e.g. "course123_CSE-2025"
const getAttendanceDocId = (courseId, coordinatorClass) => `${courseId}_${coordinatorClass}`;

export const saveAttendance = async (courseId, coordinatorClass, presentStudentIds) => {
    try {
        const docId = getAttendanceDocId(courseId, coordinatorClass);
        const docRef = doc(db, ATTENDANCE_COLLECTION, docId);

        await setDoc(docRef, {
            courseId,
            coordinatorClass,
            presentStudentIds,
            lastUpdated: serverTimestamp()
        }, { merge: true }); // Merge ensures we update rather than blindly overwrite if we ever add metadata

        return { success: true };
    } catch (error) {
        console.error('Error saving attendance:', error);
        return { success: false, error: error.message };
    }
};

export const getAttendance = async (courseId, coordinatorClass) => {
    try {
        const docId = getAttendanceDocId(courseId, coordinatorClass);
        const docRef = doc(db, ATTENDANCE_COLLECTION, docId);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            return { success: true, presentStudentIds: docSnap.data().presentStudentIds || [] };
        } else {
            // First time taking attendance, return empty array
            return { success: true, presentStudentIds: [] };
        }
    } catch (error) {
        console.error('Error getting attendance:', error);
        return { success: false, error: error.message };
    }
};

export const getAttendanceByCourse = async (courseId) => {
    try {
        const q = query(
            collection(db, ATTENDANCE_COLLECTION),
            where('courseId', '==', courseId)
        );
        const querySnapshot = await getDocs(q);
        const attendanceData = querySnapshot.docs.map(doc => doc.data());
        return { success: true, data: attendanceData };
    } catch (error) {
        console.error('Error getting attendance by course:', error);
        return { success: false, error: error.message };
    }
};
