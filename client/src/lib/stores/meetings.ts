import { writable } from 'svelte/store';
import { doc, onSnapshot, updateDoc, setDoc, getDoc } from 'firebase/firestore';
import { auth, db } from '$lib/firebase';
import { user } from './auth';

export interface Meeting {
    link: string;
    startTime: string;
    endTime: string;
}

export const meetings = writable<Meeting[]>([]);
export const isRunning = writable<boolean>(false);

// Subscribe to user's meetings in Firestore
user.subscribe(currentUser => {
    if (currentUser) {
        const userDoc = doc(db, 'users', currentUser.uid);
        
        onSnapshot(doc(db, 'users', currentUser.uid), (doc) => {
            if (doc.exists()) {
                meetings.set(doc.data().meetings || []);
                isRunning.set(doc.data().isRunning || false);
            } else {
                setDoc(userDoc, { meetings: [], isRunning: false });
            }
        });
    } else {
        meetings.set([]);
        isRunning.set(false);
    }
});

// Update Firestore when meetings change
export async function updateMeetings(newMeetings: Meeting[]) {
    const currentUser = auth.currentUser;
    if (currentUser) {
        const userDoc = doc(db, 'users', currentUser.uid);
        try {
            // Try to get the document first
            const docSnap = await getDoc(userDoc);
            
            if (!docSnap.exists()) {
                // Create the document if it doesn't exist
                await setDoc(userDoc, { meetings: newMeetings, isRunning: false });
            } else {
                // Update existing document
                await updateDoc(userDoc, { meetings: newMeetings });
            }
        } catch (error) {
            console.error('Error updating meetings:', error);
        }
    }
}

export async function updateIsRunning(running: boolean) {
    const currentUser = auth.currentUser;
    if (currentUser) {
        const userDoc = doc(db, 'users', currentUser.uid);
        try {
            // Try to get the document first
            const docSnap = await getDoc(userDoc);
            
            if (!docSnap.exists()) {
                // Create the document if it doesn't exist
                await setDoc(userDoc, { meetings: [], isRunning: running });
            } else {
                // Update existing document
                await updateDoc(userDoc, { isRunning: running });
            }
        } catch (error) {
            console.error('Error updating running state:', error);
        }
    }
}