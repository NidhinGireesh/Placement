import {
  collection,
  query,
  where,
  getDocs,
  doc,
  updateDoc,
  deleteDoc,
  setDoc,
  getDoc,
  writeBatch
} from 'firebase/firestore';
import { db } from '../config/firebaseConfig';

// Fetch users by multiple roles (e.g. ['student', 'coordinator'])
export const getUsersByRoles = async (roles) => {
  try {
    const q = query(collection(db, 'users'), where('role', 'in', roles));
    const querySnapshot = await getDocs(q);

    const users = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    return { success: true, data: users };
  } catch (error) {
    console.error(`Error fetching users by roles ${roles}:`, error);
    return { success: false, error: error.message };
  }
};

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

    // If the update includes approval, trigger a notification
    if (updates.approved === true || updates.status === 'approved' || updates.status === 'Verified') {
      console.log(`Sending approval email to user ${uid}...`);
      // In a real application, you would:
      // 1. Call a Cloud Function to send an email via SendGrid/Mailgun
      // 2. Or use a client-side library like EmailJS
      // For this prototype, we log the action.
    }

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

// Bulk approve all existing users who don't have the approved flag
export const bulkApproveExistingUsers = async () => {
  try {
    // We fetch all users because documents missing the 'approved' field 
    // won't be caught by a != true query in Firestore.
    const querySnapshot = await getDocs(collection(db, 'users'));

    const batch = writeBatch(db);
    let count = 0;

    querySnapshot.docs.forEach((userDoc) => {
      const data = userDoc.data();
      // Only update if approved is not explicitly true
      if (data.approved !== true) {
        const userRef = doc(db, 'users', userDoc.id);
        batch.update(userRef, {
          approved: true,
          status: 'approved'
        });
        count++;
      }
    });

    if (count > 0) {
      await batch.commit();
    }

    return { success: true, count };
  } catch (error) {
    console.error('Error in bulk approval:', error);
    return { success: false, error: error.message };
  }
};

// Get Detailed user info (including profile for students)
export const getUserDetails = async (uid, role) => {
  try {
    // 1. Get base user data
    const userDoc = await getDoc(doc(db, 'users', uid));
    if (!userDoc.exists()) return { success: false, error: 'User not found' };

    const userData = { id: userDoc.id, ...userDoc.data() };

    // 2. If student, fetch from students collection too
    if (role === 'student' || userData.role === 'student') {
      const q = query(collection(db, 'students'), where('userId', '==', uid));
      const studentSnap = await getDocs(q);
      if (!studentSnap.empty) {
        const studentProfile = studentSnap.docs[0].data();
        return {
          success: true,
          data: {
            ...userData,
            profile: studentProfile
          }
        };
      }
    }

    return { success: true, data: userData };
  } catch (error) {
    console.error('Error fetching user details:', error);
    return { success: false, error: error.message };
  }
};
