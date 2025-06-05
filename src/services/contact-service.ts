
'use server';

import { db } from '@/lib/firebase'; // Use db for Realtime Database
import { ref, push, set, serverTimestamp } from 'firebase/database';

export interface NewContactData {
  name: string;
  email: string;
  phone: string;
  purpose?: string;
  message?: string;
}

const CONTACTS_PATH = 'contacts'; // Path in Realtime Database

export async function addContactSubmission(data: NewContactData): Promise<string> {
  try {
    const contactsRef = ref(db, CONTACTS_PATH);
    const newContactPushRef = push(contactsRef); // Generates a unique key
    
    if (!newContactPushRef.key) {
      throw new Error('Failed to generate a unique key for contact submission.');
    }

    await set(newContactPushRef, {
      ...data,
      timestamp: serverTimestamp(), // Firebase server will write the timestamp
      status: 'new', // You can add a status field, e.g., new, read, replied
    });
    
    return newContactPushRef.key; // Return the unique key of the new submission
  } catch (error: any) {
    console.error('Error adding contact submission to Firebase Realtime Database:', error);
    throw new Error('Could not submit your message. Please try again later.');
  }
}
