import { db, storage } from '../config/firebaseConfig';
import { collection, query, where, getDocs, doc, updateDoc, getDoc } from 'firebase/firestore';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';

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

// Upload Profile Picture
export const uploadProfilePicture = async (userId, file) => {
    try {
        const fileExtension = file.name.split('.').pop();
        const storageRef = ref(storage, `profile_pictures/${userId}_${Date.now()}.${fileExtension}`);
        const uploadTask = uploadBytesResumable(storageRef, file);

        return new Promise((resolve, reject) => {
            uploadTask.on(
                'state_changed',
                (snapshot) => {
                    // Optional: You could track progress here
                    const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                    console.log('Upload is ' + progress + '% done');
                },
                (error) => {
                    console.error('Upload failed:', error);
                    resolve({ success: false, error: error.message });
                },
                async () => {
                    const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);

                    // Update both users and students collections with the photo photoUrl
                    try {
                        // Update users
                        const userRef = doc(db, 'users', userId);
                        await updateDoc(userRef, { photoUrl: downloadURL });

                        // Update students (need to find the doc id first)
                        const q = query(collection(db, 'students'), where('userId', '==', userId));
                        const querySnapshot = await getDocs(q);
                        if (!querySnapshot.empty) {
                            const studentRef = doc(db, 'students', querySnapshot.docs[0].id);
                            await updateDoc(studentRef, { photoUrl: downloadURL });
                        }

                        resolve({ success: true, photoUrl: downloadURL });
                    } catch (dbError) {
                        resolve({ success: false, error: dbError.message });
                    }
                }
            );
        });
    } catch (error) {
        console.error('Error uploading profile picture:', error);
        return { success: false, error: error.message };
    }
};

// Upload Resume
export const uploadResume = async (userId, file) => {
    try {
        const fileExtension = file.name.split('.').pop();
        const storageRef = ref(storage, `resumes/${userId}_${Date.now()}.${fileExtension}`);
        const uploadTask = uploadBytesResumable(storageRef, file);

        return new Promise((resolve, reject) => {
            uploadTask.on(
                'state_changed',
                (snapshot) => {
                    const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                    console.log('Resume upload is ' + progress + '% done');
                },
                (error) => {
                    console.error('Resume upload failed:', error);
                    resolve({ success: false, error: error.message });
                },
                async () => {
                    const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);

                    try {
                        // Update students collection with the resumeUrl
                        const q = query(collection(db, 'students'), where('userId', '==', userId));
                        const querySnapshot = await getDocs(q);
                        if (!querySnapshot.empty) {
                            const studentRef = doc(db, 'students', querySnapshot.docs[0].id);
                            await updateDoc(studentRef, { resumeUrl: downloadURL });
                            resolve({ success: true, resumeUrl: downloadURL });
                        } else {
                            resolve({ success: false, error: 'Student profile not found to update resume' });
                        }
                    } catch (dbError) {
                        resolve({ success: false, error: dbError.message });
                    }
                }
            );
        });
    } catch (error) {
        console.error('Error uploading resume:', error);
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
                gender: profileData.gender,
                cgpa: profileData.cgpa,
                backlogs: profileData.backlogs !== undefined && profileData.backlogs !== '' ? parseInt(profileData.backlogs, 10) : 0,
                skills: Array.isArray(profileData.skills) ? profileData.skills : profileData.skills.split(',').map(s => s.trim()),
                resumeUrl: profileData.resumeLink,
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
