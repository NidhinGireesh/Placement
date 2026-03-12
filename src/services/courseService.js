import {
    collection,
    addDoc,
    getDocs,
    query,
    where,
    orderBy,
    doc,
    deleteDoc,
    serverTimestamp
} from 'firebase/firestore';
import { db } from '../config/firebaseConfig';

const COURSES_COLLECTION = 'courses';

export const addCourse = async (courseData) => {
    try {
        const docRef = await addDoc(collection(db, COURSES_COLLECTION), {
            ...courseData,
            createdAt: serverTimestamp()
        });
        return { success: true, id: docRef.id };
    } catch (error) {
        console.error('Error adding course:', error);
        return { success: false, error: error.message };
    }
};

export const getAllCourses = async () => {
    try {
        const q = query(collection(db, COURSES_COLLECTION), orderBy('createdAt', 'desc'));
        const querySnapshot = await getDocs(q);
        const courses = querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));
        return { success: true, data: courses };
    } catch (error) {
        console.error('Error getting courses:', error);
        return { success: false, error: error.message };
    }
};

export const getTargetedCourses = async (batch) => {
    try {
        // Fetch all and filter client side to avoid complex index requirements
        // given the expected volume of scaling
        const q = query(collection(db, COURSES_COLLECTION), orderBy('createdAt', 'desc'));
        const querySnapshot = await getDocs(q);

        const allCourses = querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));

        const targeted = allCourses.filter(course =>
            course.assignedTo === 'All' || course.assignedTo === batch
        );

        return { success: true, data: targeted };
    } catch (error) {
        console.error('Error getting targeted courses:', error);
        return { success: false, error: error.message };
    }
};

export const getOfflineCourses = async (batch) => {
    try {
        const q = query(
            collection(db, COURSES_COLLECTION),
            where('type', '==', 'offline'),
            orderBy('createdAt', 'desc') // Need index for where + orderBy. We'll filter batch client-side
        );
        const querySnapshot = await getDocs(q);

        const allOffline = querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));

        const targeted = allOffline.filter(course =>
            course.assignedTo === 'All' || course.assignedTo === batch
        );

        return { success: true, data: targeted };
    } catch (error) {
        console.error('Error getting offline courses:', error);
        return { success: false, error: error.message };
    }
};

export const deleteCourse = async (courseId) => {
    try {
        await deleteDoc(doc(db, COURSES_COLLECTION, courseId));
        return { success: true };
    } catch (error) {
        console.error('Error deleting course:', error);
        return { success: false, error: error.message };
    }
};
