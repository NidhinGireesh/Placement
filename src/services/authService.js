
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  sendPasswordResetEmail,
  sendEmailVerification,
} from 'firebase/auth';
import { doc, setDoc, getDoc, updateDoc, addDoc, collection, query, where, getDocs } from 'firebase/firestore';
import { auth, db } from '../config/firebaseConfig';

// Flag to prevent auth listener from signing out users during registration process
let isRegistering = false;

// Fetch unique existing company names for autocomplete
export const getExistingCompanies = async () => {
  try {
    const q = query(
      collection(db, 'users'),
      where('role', '==', 'recruiter')
    );
    const querySnapshot = await getDocs(q);
    const companies = new Set();
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      if (data.company) {
        companies.add(data.company);
      }
    });
    return Array.from(companies).sort();
  } catch (error) {
    console.error('Error fetching companies:', error);
    return [];
  }
};

export const registerUser = async (email, password, userData) => {
  isRegistering = true;
  try {
    // Create Firebase Auth user
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const uid = userCredential.user.uid;

    // Additional validation for coordinators: Max 4 per class (2 Male, 2 Female)
    if (userData.role === 'coordinator') {
      try {
        const studentsRef = collection(db, 'students');
        const classQ = query(
          studentsRef,
          where('branch', '==', userData.branch),
          where('passoutYear', '==', userData.passoutYear),
          where('originalRole', '==', 'coordinator')
        );
        const classSnap = await getDocs(classQ);

        // Check total limit
        if (classSnap.size >= 4) {
          await userCredential.user.delete(); // Rollback auth user
          return { success: false, error: `Registration failed: Maximum limit of 4 coordinators reached for ${userData.branch} ${userData.passoutYear}.` };
        }

        // Check gender specific limit
        const sameGenderCount = classSnap.docs.filter(doc => doc.data().gender === userData.gender).length;
        if ((userData.gender === 'male' || userData.gender === 'female') && sameGenderCount >= 2) {
          await userCredential.user.delete(); // Rollback auth user
          return { success: false, error: `Registration failed: Maximum limit of 2 ${userData.gender} coordinators reached for this class.` };
        }
      } catch (err) {
        console.error('Error validating coordinator limits:', err);
        // Continue if check fails, or handle as error? Safer to handle as error.
        await userCredential.user.delete();
        return { success: false, error: 'Failed to validate coordinator limits. Please try again.' };
      }
    }

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
      passoutYear: userData.passoutYear || '', // Added for student profile sync
      class: userData.role === 'coordinator' ? `${userData.branch}-${userData.passoutYear}` : (userData.coordinatorClass || ''), // Derived class for coordinator
      company: userData.company || '', // Explicitly use company field instead of name
      designation: userData.designation || '', // Add designation
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

    // Sign out the user immediately after registration so they have to login after verification
    await signOut(auth);

    return { uid, success: true, message: 'Registration successful! Your account is pending admin approval. A verification link will be sent to your email once approved.' };
  } catch (error) {
    console.error('Registration error:', error);
    return { error: error.message, success: false };
  } finally {
    isRegistering = false;
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

      // 1. Check Admin Approval status for restricted roles (Coordinator, Recruiter, Student, Admin)
      const isApproved = userData.approved === true || userData.status === 'approved' || userData.status === 'Verified';

      if ((userData.role === 'coordinator' || userData.role === 'recruiter' || userData.role === 'student' || userData.role === 'admin') && !isApproved) {
        await signOut(auth);
        return { success: false, error: 'Your account is pending admin approval. You will be notified once approved.' };
      }

      // 2. Check Email Verification (skip for admins) - ONLY after approval
      if (!userCredential.user.emailVerified && userData.role !== 'admin') {
        // Send email verification now that we know they are approved
        await sendEmailVerification(userCredential.user);
        await signOut(auth);
        return { success: false, error: 'Your account has been approved! A verification link has been sent to your email. Please verify and login again.' };
      }

      let department = userData.department || '';
      let passoutYear = userData.passoutYear || '';

      // Fallback for existing students/coordinators missing metadata in 'users' collection
      if ((userData.role === 'student' || userData.role === 'coordinator') && (!department || !passoutYear)) {
        try {
          const studentsRef = collection(db, 'students');
          const q = query(studentsRef, where('userId', '==', uid));
          const studentSnap = await getDocs(q);
          if (!studentSnap.empty) {
            const studentData = studentSnap.docs[0].data();
            department = department || studentData.branch || '';
            passoutYear = passoutYear || studentData.passoutYear || '';
          }
        } catch (err) {
          console.error('Error fetching student fallback data:', err);
        }
      }

      return {
        uid,
        email: userData.email,
        role: userData.role,
        name: userData.name,
        department,
        passoutYear,
        success: true,
      };
    } else {
      await signOut(auth);
      return { success: false, error: 'User profile not found. Please contact support.' };
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

export const updateUserProfile = async (uid, profileData) => {
  try {
    await updateDoc(doc(db, 'users', uid), profileData);
    return { success: true };
  } catch (error) {
    console.error('Error updating profile:', error);
    return { success: false, error: error.message };
  }
};

export const setupAuthListener = (callback) => {
  return onAuthStateChanged(auth, async (firebaseUser) => {
    // If we are in the middle of registration, ignore auth state changes
    // to avoid signing out the new user while Firestore/Email logic is running
    if (isRegistering) return;

    if (firebaseUser) {
      const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
      if (userDoc.exists()) {
        const userData = userDoc.data();

        // Enforce approval and verification even in listener for safety
        // This ensures unapproved users are signed out if they refresh
        const isApproved = userData.approved === true || userData.status === 'approved' || userData.status === 'Verified';
        const isEmailVerified = firebaseUser.emailVerified;
        const skipEmailCheck = userData.role === 'admin';

        if ((!isEmailVerified && !skipEmailCheck) || ((userData.role === 'coordinator' || userData.role === 'recruiter' || userData.role === 'student' || userData.role === 'admin') && !isApproved)) {
          // If unapproved/unverified session exists, sign them out
          await signOut(auth);
          callback(null);
          return;
        }

        let department = userData.department || '';
        let passoutYear = userData.passoutYear || '';

        // Fallback for existing students/coordinators missing metadata in 'users' collection
        if ((userData.role === 'student' || userData.role === 'coordinator') && (!department || !passoutYear)) {
          try {
            const studentsRef = collection(db, 'students');
            const q = query(studentsRef, where('userId', '==', firebaseUser.uid));
            const studentSnap = await getDocs(q);
            if (!studentSnap.empty) {
              const studentData = studentSnap.docs[0].data();
              department = department || studentData.branch || '';
              passoutYear = passoutYear || studentData.passoutYear || '';
            }
          } catch (err) {
            console.error('Error fetching student fallback data:', err);
          }
        }

        callback({
          uid: firebaseUser.uid,
          email: firebaseUser.email,
          role: userData.role,
          name: userData.name,
          department,
          passoutYear,
        });
      } else {
        // User authenticated but no document found
        console.error("User authenticated but no user document found");
        await signOut(auth);
        callback(null);
      }
    } else {
      callback(null);
    }
  });
};
