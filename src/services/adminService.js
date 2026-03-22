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
  writeBatch,
  addDoc
} from 'firebase/firestore';
import { db } from '../config/firebaseConfig';

// Fetch users by multiple roles (e.g. ['student', 'coordinator'])
export const getUsersByRoles = async (roles) => {
  try {
    const q = query(collection(db, 'users'), where('role', 'in', roles));
    const querySnapshot = await getDocs(q);

    const usersTemp = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    // Join with student profiles for students and coordinators
    const users = await Promise.all(usersTemp.map(async (user) => {
      if (user.role === 'student' || user.role === 'coordinator') {
        const studentQuery = query(collection(db, 'students'), where('userId', '==', user.id));
        const studentSnapshot = await getDocs(studentQuery);

        if (!studentSnapshot.empty) {
          const profileData = studentSnapshot.docs[0].data();
          return {
            ...user,
            // Use profile data as fallback if main user doc fields are missing
            department: user.department || user.branch || profileData.branch || '',
            passoutYear: user.passoutYear || profileData.passoutYear || '',
            class: user.class || (profileData.branch && profileData.passoutYear ? `${profileData.branch}-${profileData.passoutYear}` : ''),
            registerNumber: profileData.registerNumber || user.registerNumber || ''
          };
        }
      }
      return user;
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

    const usersTemp = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    // Join with student profiles if needed
    let users = usersTemp;
    if (role === 'student' || role === 'coordinator') {
      users = await Promise.all(usersTemp.map(async (user) => {
        const studentQuery = query(collection(db, 'students'), where('userId', '==', user.id));
        const studentSnapshot = await getDocs(studentQuery);

        if (!studentSnapshot.empty) {
          const profileData = studentSnapshot.docs[0].data();
          return {
            ...user,
            department: user.department || user.branch || profileData.branch || '',
            passoutYear: user.passoutYear || profileData.passoutYear || '',
            class: user.class || (profileData.branch && profileData.passoutYear ? `${profileData.branch}-${profileData.passoutYear}` : ''),
            registerNumber: profileData.registerNumber || user.registerNumber || ''
          };
        }
        return user;
      }));
    }

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
    const uid = newDocRef.id;

    // Validation for coordinators: Max 4 per class (2 Male, 2 Female)
    if (userData.role === 'coordinator') {
      const studentsRef = collection(db, 'students');
      const classQ = query(
        studentsRef,
        where('branch', '==', userData.branch || userData.department),
        where('passoutYear', '==', userData.passoutYear),
        where('originalRole', '==', 'coordinator')
      );
      const classSnap = await getDocs(classQ);

      if (classSnap.size >= 4) {
        return { success: false, error: `Maximum limit of 4 coordinators reached for this class.` };
      }

      const sameGenderCount = classSnap.docs.filter(doc => doc.data().gender === userData.gender).length;
      if ((userData.gender === 'male' || userData.gender === 'female') && sameGenderCount >= 2) {
        return { success: false, error: `Maximum limit of 2 ${userData.gender} coordinators reached for this class.` };
      }
    }

    await setDoc(doc(db, 'users', uid), {
      ...userData,
      userId: uid,
      createdAt: new Date(),
      status: 'approved' // Auto-approve manual adds
    });

    // If role is student OR coordinator, create student profile document
    if (userData.role === 'student' || userData.role === 'coordinator') {
      try {
        await addDoc(collection(db, 'students'), {
          userId: uid,
          registerNumber: userData.registerNumber || '',
          passoutYear: userData.passoutYear || '',
          branch: userData.branch || userData.department || '',
          gender: userData.gender || '',
          dob: null,
          lateralEntry: 'no',
          cgpa: 0,
          skills: [],
          resumeUrl: '',
          approvalStatus: 'Verified', // Auto-verify manual adds
          createdAt: new Date(),
          updatedAt: new Date(),
          originalRole: userData.role
        });
      } catch (studentErr) {
        console.error('Error creating student profile for admin add:', studentErr);
        // Note: We don't rollback the user doc here, but we log the error
      }
    }

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

    // 2. If student or coordinator, fetch from students collection too
    if (role === 'student' || userData.role === 'student' || role === 'coordinator' || userData.role === 'coordinator') {
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

// Add a new notification
export const addNotification = async (notificationData) => {
  try {
    const newDocRef = doc(collection(db, 'notifications'));
    await setDoc(newDocRef, {
      ...notificationData,
      id: newDocRef.id,
      createdAt: new Date().toISOString()
    });
    return { success: true, id: newDocRef.id };
  } catch (error) {
    console.error('Error adding notification:', error);
    return { success: false, error: error.message };
  }
};

// Get notifications sent by admin
export const getAdminNotifications = async () => {
  try {
    const q = query(collection(db, 'notifications'), where('sender', '==', 'admin'));
    const snapshot = await getDocs(q);
    const notifications = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    return { success: true, data: notifications.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)) };
  } catch (error) {
    console.error('Error fetching admin notifications:', error);
    return { success: false, error: error.message };
  }
};

// Delete a notification
export const deleteNotification = async (notificationId) => {
  try {
    await deleteDoc(doc(db, 'notifications', notificationId));
    return { success: true };
  } catch (error) {
    console.error('Error deleting notification:', error);
    return { success: false, error: error.message };
  }
};
