import { 
  collection, 
  query, 
  where, 
  getDocs, 
  doc, 
  updateDoc, 
  deleteDoc,
  setDoc,
  getDoc
} from 'firebase/firestore';
import { db } from '../config/firebaseConfig';

// Fetch users by their role (student, recruiter, coordinator)
export const getUsersByRole = async (role) => {
  try {
    const q = query(collection(db, 'users'), where('role', '==', role));
    const querySnapshot = await getDocs(q);
    
    // If querying students, we might want to join with 'students' collection details
    // For now, returning basic user data. In a real app, you'd fetch the profile too.
    
    const users = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    
    return { success: true, data: users };
  } catch (error) {
    console.error(`Error fetching ${role}s:`, error);
    return { success: false, error: error.message };
  }
};

// Update user status (approve/reject/block)
export const updateUserStatus = async (uid, updates) => {
  try {
    const userRef = doc(db, 'users', uid);
    await updateDoc(userRef, updates);
    return { success: true };
  } catch (error) {
    console.error('Error updating user status:', error);
    return { success: false, error: error.message };
  }
};

// Delete a user document
export const deleteUserDoc = async (uid) => {
  try {
    await deleteDoc(doc(db, 'users', uid));
    
    // Also try to delete from sub-collections if they exist (e.g. students)
    // This is a bit complex without backend functions, but we'll try for 'students'
    // This part is best effort for client-side only
    
    return { success: true };
  } catch (error) {
    console.error('Error deleting user:', error);
    return { success: false, error: error.message };
  }
};

// Add a new user document (for manually adding recruiters/coordinators)
export const addUserDoc = async (userData) => {
  try {
    // Note: This only creates the Firestore doc. 
    // Creating the Auth user requires a backend function or secondary auth app 
    // if we don't want to log out the current admin.
    // For this prototype, we'll assume we just store the record.
    
    if (!userData.email) return { success: false, error: "Email is required" };
    
    const newDocRef = doc(collection(db, 'users'));
    const uid = newDocRef.id; // Generate an ID
    
    await setDoc(doc(db, 'users', uid), {
      ...userData,
      userId: uid,
      createdAt: new Date(),
      status: 'approved' // Auto-approve manual adds
    });

    return { success: true, id: uid };
  } catch (error) {
    console.error('Error adding user:', error);
    return { success: false, error: error.message };
  }
};
