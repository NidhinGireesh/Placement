
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
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
      approved: userData.role === 'admin' ? true : false,
      createdAt: new Date(),
    });

    // If role is student, create student profile
    if (userData.role === 'student') {
      await addDoc(collection(db, 'students'), {
        userId: uid,
        registerNumber: userData.registerNumber || '',
        passoutYear: userData.passoutYear || '',
        branch: userData.branch || '',
        batch: userData.batch || '',
        gender: userData.gender || '',
        dob: userData.dob || null,
        lateralEntry: 'no',
        cgpa: 0,
        skills: [],
        resumeUrl: '',
        coordinatorId: '',
        approvalStatus: 'pending',
        createdAt: new Date(),
        updatedAt: new Date(),
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
      return {
        uid,
        email: userDoc.data().email,
        role: userDoc.data().role,
        name: userDoc.data().name,
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
