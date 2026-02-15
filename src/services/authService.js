
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  sendPasswordResetEmail,
} from 'firebase/auth';
import { doc, setDoc, getDoc, addDoc, collection } from 'firebase/firestore';
import { auth, db } from '../config/firebaseConfig';

export const registerUser = async (email, password, userData) => {
  try {
    // Create Firebase Auth user
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const uid = userCredential.user.uid;

    // Create user document in Firestore
    await setDoc(doc(db, 'users', uid), {
      userId: uid,
      name: userData.name,
      email: email,
      phone: userData.phone || '',
      role: userData.role,
      approved: false, // Default to false for ALL roles including admin
      createdAt: new Date(),
      // Add extra fields to main user doc for Admin easy access
      department: userData.branch || userData.department || '', // For student (branch) or coordinator (department)
      class: userData.role === 'coordinator' ? `${userData.branch}-${userData.passoutYear}` : (userData.coordinatorClass || ''), // Derived class for coordinator
      company: userData.role === 'recruiter' ? userData.name : (userData.company || ''), // For recruiter, use name as company
      website: userData.website || '',
      industry: userData.industry || '',
      location: userData.location || '',
    });

    // If role is student OR coordinator, create student profile
    if (userData.role === 'student' || userData.role === 'coordinator') {
      await addDoc(collection(db, 'students'), {
        userId: uid,
        registerNumber: userData.registerNumber || '',
        passoutYear: userData.passoutYear || '',
        branch: userData.branch || '',
        gender: userData.gender || '',
        dob: userData.dob || null,
        lateralEntry: userData.lateralEntry || 'no',
        cgpa: 0,
        skills: [],
        resumeUrl: '',
        coordinatorId: '',
        approvalStatus: 'pending',
        createdAt: new Date(),
        updatedAt: new Date(),
        // Extra field to identify actual role in students collection if needed
        originalRole: userData.role
      });
    }

    return { uid, success: true };
  } catch (error) {
    console.error('Registration error:', error);
    return { error: error.message, success: false };
  }
};

export const loginUser = async (email, password) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const uid = userCredential.user.uid;

    // Get user role from Firestore
    const userDoc = await getDoc(doc(db, 'users', uid));
    if (userDoc.exists()) {
      const userData = userDoc.data();

      // Check approval status for restricted roles (Coordinator, Recruiter, Student, Admin)
      const isApproved = userData.approved === true || userData.status === 'approved' || userData.status === 'Verified';

      if ((userData.role === 'coordinator' || userData.role === 'recruiter' || userData.role === 'student' || userData.role === 'admin') && !isApproved) {
        await signOut(auth);
        return { success: false, error: 'Your account is pending approval.' };
      }

      return {
        uid,
        email: userData.email,
        role: userData.role,
        name: userData.name,
        success: true,
      };
    }
  } catch (error) {
    console.error('Login error:', error);
    return { error: error.message, success: false };
  }
};

export const logoutUser = async () => {
  try {
    await signOut(auth);
    return { success: true };
  } catch (error) {
    console.error('Logout error:', error);
    return { error: error.message, success: false };
  }
};

export const resetPassword = async (email) => {
  try {
    await sendPasswordResetEmail(auth, email);
    return { success: true };
  } catch (error) {
    console.error('Reset password error:', error);
    return { success: false, error: error.message };
  }
};

export const getCurrentUser = async (uid) => {
  try {
    const userDoc = await getDoc(doc(db, 'users', uid));
    if (userDoc.exists()) {
      return { ...userDoc.data(), success: true };
    }
    return { success: false, error: 'User not found' };
  } catch (error) {
    console.error('Get user error:', error);
    return { error: error.message, success: false };
  }
};

export const setupAuthListener = (callback) => {
  return onAuthStateChanged(auth, async (firebaseUser) => {
    if (firebaseUser) {
      const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
      if (userDoc.exists()) {
        callback({
          uid: firebaseUser.uid,
          email: firebaseUser.email,
          role: userDoc.data()?.role,
          name: userDoc.data()?.name,
        });
      } else {
        // User authenticated but no document found (should not happen in normal flow, but handle it)
        console.error("User authenticated but no user document found");
        callback(null);
      }
    } else {
      callback(null);
    }
  });
};
