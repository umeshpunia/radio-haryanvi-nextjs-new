
'use server';

import { dbFirestore } from '@/lib/firebase'; // Use dbFirestore for Cloud Firestore
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

export interface NewContactData {
  name: string;
  email: string;
  phone: string;
  purpose?: string;
  message?: string;
}

const CONTACTS_COLLECTION = 'contacts';

export async function addContactSubmission(data: NewContactData): Promise<string> {
  try {
    const contactsCollectionRef = collection(dbFirestore, CONTACTS_COLLECTION);
    const docRef = await addDoc(contactsCollectionRef, {
      ...data,
      timestamp: serverTimestamp(),
      status: 'new', // You can add a status field, e.g., new, read, replied
    });
    return docRef.id;
  } catch (error: any) {
    console.error('Error adding contact submission to Firestore:', error);
    throw new Error('Could not submit your message. Please try again later.');
  }
}
