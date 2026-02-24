
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs, doc, writeBatch } from 'firebase/firestore';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Manually parse .env
const envPath = join(__dirname, '../.env');
const envContent = fs.readFileSync(envPath, 'utf8');
const env = {};
envContent.split('\n').forEach(line => {
    const [key, value] = line.split('=');
    if (key && value) {
        env[key.trim()] = value.trim();
    }
});

const firebaseConfig = {
    apiKey: env.VITE_FIREBASE_API_KEY,
    authDomain: env.VITE_FIREBASE_AUTH_DOMAIN,
    projectId: env.VITE_FIREBASE_PROJECT_ID,
    storageBucket: env.VITE_FIREBASE_STORAGE_BUCKET,
    messagingSenderID: env.VITE_FIREBASE_MESSAGING_SENDER_ID,
    appID: env.VITE_FIREBASE_APP_ID
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function bulkApprove() {
    console.log('Starting bulk approval migration...');
    try {
        const querySnapshot = await getDocs(collection(db, 'users'));
        const batch = writeBatch(db);
        let count = 0;

        querySnapshot.docs.forEach((userDoc) => {
            const data = userDoc.data();
            if (data.approved !== true) {
                const userRef = doc(db, 'users', userDoc.id);
                batch.update(userRef, {
                    approved: true,
                    status: 'approved'
                });
                count++;
                console.log(`Queueing approval for: ${data.email || userDoc.id}`);
            }
        });

        if (count > 0) {
            await batch.commit();
            console.log(`Successfully approved ${count} users.`);
        } else {
            console.log('No users found needing approval.');
        }
    } catch (error) {
        console.error('Migration failed:', error);
    } finally {
        process.exit();
    }
}

bulkApprove();
